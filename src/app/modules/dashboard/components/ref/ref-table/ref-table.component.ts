import { NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Ref } from '../../../models/ref';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';

@Component({
  selector: '[app-ref-table]',
  standalone: true,
  imports: [NgFor, AngularSvgIconModule],
  templateUrl: './ref-table.component.html',
  styleUrl: './ref-table.component.scss'
})
export class RefTableComponent {
  public refs: Ref[] = []
  firestore = inject(Firestore);
  showRefs:boolean = false

  constructor(private router: Router) { 
    this.loadScript('https://www.tiktok.com/embed.js').then(status => {
      if (status === 'loaded') {
        this.showRefs = true;
      }
    })
  }
  
  ngAfterViewInit(){
    getDocs(collection(this.firestore, "ref")).then((response) => {
      console.log(response.docs)
      response.docs.forEach((document: any) => {
        let ref = { id: document.id, ...document.data() } as Ref
        this.refs.push(ref);
      });
      this.loadScript('https://www.tiktok.com/embed.js');
      console.log(this.refs);
    }); 
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

  navigateToRef(ref: Ref){
    console.log(ref.id)
    this.router.navigate(['ref', ref.id]);
  }
}
