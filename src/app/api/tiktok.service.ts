import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ref } from '../modules/dashboard/models/ref';

@Injectable({
  providedIn: 'root'
})
export class TikTokService {

  private tiktokApiUrl = 'https://www.tiktok.com/oembed?url=';

  constructor(private http: HttpClient) { }

  getTikTokEmbed(url: string): Observable<Ref> {
    return this.http.get<any>(`${this.tiktokApiUrl}${url}`).pipe(
      map(response => {
        const ref: Ref = {
          id: '', // L'ID sera généré lors de l'enregistrement dans Firestore
          title: response.title,
          memeAuthor: response.author_name,
          memeRef: response.title, // Ou toute autre logique pour définir la référence
          tiktokVideoId: this.extractVideoId(url),
          tiktokVideoCite: url,
          tiktokVideoThumbnail: response.thumbnail_url,
          tiktokVideoHtml: response.html
        };

        return ref;
      }),
      catchError(error => {
        console.error('Error fetching TikTok embed:', error);
        return throwError(() => new Error('Failed to fetch TikTok embed'));
      })
    );
  }



  loadScript() {
    const url = 'https://www.tiktok.com/embed.js';
    return new Promise((resolve, reject) => {

      if (document.getElementById('tiktok-script')) {
        resolve("loaded");
      }
      const script = document.createElement("script");
      script.async = true;
      script.src = url;
      script.setAttribute('id', 'tiktok-script');

      script.onload = () => {
        // script is loaded successfully, call resolve()
        resolve("loaded");
      };

      script.onerror = () => {
        // script is not loaded, call reject()
        reject("error");
      };

      document.head.appendChild(script);
    });
  }

  private extractVideoId(url: string): string {
    // Logique pour extraire l'ID de la vidéo depuis l'URL TikTok
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : '';
  }
}
