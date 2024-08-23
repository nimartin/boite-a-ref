import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { Ref } from '../modules/dashboard/models/ref';
import { AlgoliaService } from './algolia.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@angular/fire/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, increment, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class RefService {

  constructor(private firestore: Firestore, private algoliaService: AlgoliaService,  private http: HttpClient, private storage: Storage) { }

  getRefs(): Observable<Ref[]> {
    const refCollection = collection(this.firestore, 'ref');
    const docsPromise = getDocs(refCollection);
    return from(docsPromise).pipe(
      map(response => {
        return response.docs.map(doc => {
          const data = doc.data() as Omit<Ref, 'id'>;
          return { id: doc.id, ...data } as Ref;
        });
      })
    );
  }

  getLastRefs(): Observable<Ref[]> {
    const refCollection = collection(this.firestore, 'ref');
    const last10Query = query(refCollection, orderBy('uploadAt', 'desc'), limit(500));
    const docsPromise = getDocs(last10Query);
    return from(docsPromise).pipe(
      map(response => {
        return response.docs.map(doc => {
          const data = doc.data() as Omit<Ref, 'id'>;
          return { id: doc.id, ...data } as Ref;
        });
      })
    );
  }

  saveRef(ref: Omit<Ref, 'id'>): Observable<Ref> {
    const refCollection = collection(this.firestore, 'ref');
    const refWithTimestamp = {
      ...ref,
      uploadAt: new Date() // Ajout de la date et l'heure d'ajout
    };
    const savePromise = addDoc(refCollection, refWithTimestamp);

    return from(savePromise).pipe(
      switchMap(docRef => {
        const refId = docRef.id;
        const filePath = `thumbnails/${refId}.jpg`;

        return from(this.uploadThumbnailFromUrl(ref.tiktokVideoThumbnail, filePath)).pipe(
          switchMap(downloadUrl => {
            console.log('Thumbnail uploaded to:', downloadUrl);
            const updatedRef: Ref = {
              id: refId,
              ...refWithTimestamp,
              tiktokVideoThumbnail: downloadUrl
            };

            // Mettre à jour le document dans Firestore avec l'URL de la miniature
            const refDoc = doc(this.firestore, `ref/${refId}`);
            return from(updateDoc(refDoc, { tiktokVideoThumbnail: downloadUrl })).pipe(
              map(() => updatedRef)
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error saving ref or uploading thumbnail:', error);
        return throwError(() => new Error('Failed to save ref or upload thumbnail'));
      })
    );
  }


  getTopRefs(): Observable<Ref[]> {
    // call firebase and get top 3 refs order by memeRef
    const refCollection = collection(this.firestore, 'ref');
    const top3Query = query(refCollection, orderBy('shareCount', 'desc'), limit(3));
    const docsPromise = getDocs(top3Query);
    return from(docsPromise).pipe(
      map(response => {
        return response.docs.map(doc => {
          const data = doc.data() as Omit<Ref, 'id'>;
          return { id: doc.id, ...data } as Ref;
        });
      })
    );
  }

  searchRefs(query: string): Observable<Ref[]> {
    return this.algoliaService.search(query);
  }

  uploadThumbnailFromUrl(url: string, filePath: string): Promise<string> {
    return this.http.get(url, { responseType: 'blob' }).toPromise().then((blob) => {
      if (!blob) {
        throw new Error('Failed to fetch image blob from URL');
      }
      const fileRef = ref(this.storage, filePath);
      console.log('Uploading thumbnail to:', filePath);

      return uploadBytes(fileRef, blob).then(() => {
        console.log('Thumbnail uploaded to:', filePath);
        return getDownloadURL(fileRef);
      });
    }) as Promise<string>;
  }

  updateShareCount(refId: string): Observable<void> {
    const refDoc = doc(this.firestore, `ref/${refId}`);
    const updatePromise = updateDoc(refDoc, { shareCount: increment(1) });

    return from(updatePromise).pipe(
      catchError((error) => {
        console.error('Error updating share count:', error);
        return throwError(() => new Error('Failed to update share count'));
      })
    );
  }

  updateViewCount(refId: string): Observable<void> {
    const refDoc = doc(this.firestore, `ref/${refId}`);
    console.log('Incrementing view count for ref:', refId);
    const updatePromise = updateDoc(refDoc, { viewCount: increment(1) });

    return from(updatePromise).pipe(
      catchError((error) => {
        console.error('Error updating share count:', error);
        return throwError(() => new Error('Failed to update share count'));
      })
    );
  }
}
