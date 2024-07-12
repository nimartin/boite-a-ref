import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ref } from '../modules/dashboard/models/ref';

@Injectable({
  providedIn: 'root'
})
export class RefService {

  constructor(private firestore: Firestore) { }

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
    const last10Query = query(refCollection, orderBy('memeRef', 'desc'), limit(10));
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
    const savePromise = addDoc(refCollection, ref);
    return from(savePromise).pipe(
      map(docRef => {
        const createdRef: Ref = {
          id: docRef.id,
          ...ref
        };
        return createdRef;
      }),
      catchError((error) => {
        console.error('Error saving ref:', error);
        return throwError(() => new Error('Failed to save ref'));
      })
    );
  }
}
