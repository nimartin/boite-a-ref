import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Ref } from '../../dashboard/models/ref';
import { NgIf } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private firestore: Firestore) {
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
        console.log(this.ref); // Affiche les données récupérées
    } else {
        console.log("No such document!");
    }

    this.loadScript('https://www.tiktok.com/embed.js'); // Charge dynamiquement le script TikTok

  }

  loadScript(url: string) {
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
}
