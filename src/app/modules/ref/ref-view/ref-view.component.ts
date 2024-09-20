import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Ref } from '../../dashboard/models/ref';
import { NgIf } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { RefService } from '../../../api/ref.service';
import { RefPlayerComponent } from '../ref-player/ref-player.component';

@Component({
  selector: 'app-ref-view',
  standalone: true,
  imports: [NgIf, RefPlayerComponent],
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
    } else {
      console.log("No such document!");
    }

  }
}
