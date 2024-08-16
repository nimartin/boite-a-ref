// algolia.service.ts
import { Injectable } from '@angular/core';
import algoliasearch, { SearchClient } from 'algoliasearch/lite';
import { environment } from '../../environments/environment';
import { from, map, Observable } from 'rxjs';
import { Ref } from '../modules/dashboard/models/ref';

@Injectable({
  providedIn: 'root',
})
export class AlgoliaService {
  private client: SearchClient;
  private index: any;

  constructor() {
    // Remplacez par vos informations Algolia

    this.client = algoliasearch(environment.algolia.appId, environment.algolia.adminKey);
    this.index = this.client.initIndex('ref');
  }

  search(query: string): Observable<Ref[]> {
    return from(this.index.search(query)).pipe(
      map((result: any) => {
        return result.hits.map((hit: any) => {
          return {
            id: hit.objectID,
            title: hit.title,
            memeAuthor: hit.memeAuthor,
            memeRef: hit.memeRef,
            tiktokVideoId: hit.tiktokVideoId,
            tiktokVideoCite: hit.tiktokVideoCite,
            tiktokVideoThumbnail: hit.tiktokVideoThumbnail,
            tiktokVideoHtml: hit.tiktokVideoHtml,
          } as Ref;
        });
      })
    );
  }
}
