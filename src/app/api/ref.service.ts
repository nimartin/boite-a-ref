import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
}
