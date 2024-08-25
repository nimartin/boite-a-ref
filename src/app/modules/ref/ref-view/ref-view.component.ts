import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Ref } from '../../dashboard/models/ref';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { RefService } from '../../../api/ref.service';

@Component({
  selector: 'app-ref-view',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ref-view.component.html',
  styleUrl: './ref-view.component.scss'
})
export class RefViewComponent  implements OnInit
{

  public ref: Ref | undefined;
  public tiktokVideoUrl: SafeUrl | undefined;

  constructor(private route: ActivatedRoute, private firestore: Firestore, private sanitizer: DomSanitizer, private refService: RefService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        console.log(id);
        if(id != null){
          this.getRefById(id);
        }
    });
  }

  async getRefById(id: string) {
    const docRef = doc(this.firestore, 'ref', id); // Crée une référence de document avec l'ID spécifié
    const docSnap = await getDoc(docRef); // Récupère le document à partir de la référence
    if (docSnap.exists()) {
      const refData = { id: docSnap.id, ...docSnap.data() } as Ref; // Combine l'ID et les données du document
      this.ref = refData;
      this.refService.updateViewCount(refData.id);
      this.tiktokVideoUrl = this.getTiktokVideoUrl();
    } else {
      console.log("No such document!");
    }

  }

  getTiktokVideoUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.tiktok.com/player/v1/' + this.ref?.tiktokVideoId + this.params);
  }

  get viewCount(): string {
    return this.ref?.viewCount?.toString() ?? '0';
  }

  get shareCount(): string {
    return this.ref?.shareCount?.toString() ?? '0';
  }

  get params(): string {
    return '?&music_info=1&description=1&loop=1';
  }

  public shareRef(ref: Ref): void {

    //spanElement = get element by id "share-ref"
    const element = (document.getElementById('share-ref') as HTMLElement);
    const spanElement = (element as HTMLElement).querySelector('span');
    if (spanElement) {
      spanElement.innerText = 'Ref copiée ! 🎉';
    }

    element.classList.add('bg-muted');
    element.classList.remove('bg-primary');

    setTimeout(() => {
      if (spanElement) {
        spanElement.innerText = 'Partages la ref !';
      }
      element.classList.remove('bg-muted');
      element.classList.add('bg-primary');
    }, 2000);

    const refLink = `${environment.serverUrl}/ref/${ref.id}`;
    navigator.clipboard.writeText(refLink)
      .then(() => {
        console.log('Ref link copied to clipboard:', refLink);
        this.refService.updateShareCount(ref.id)
          .subscribe(() => {
            console.log('Share count incremented for ref:', ref.id);
          });
      })
      .catch((error) => {
        console.error('Failed to copy ref link to clipboard:', error);
      });
  }

  viewRef(ref: Ref): void {
    this.refService.updateViewCount(ref.id)
      .subscribe(() => {
        console.log('Share count incremented for ref:', ref.id);
      });
  }

}
