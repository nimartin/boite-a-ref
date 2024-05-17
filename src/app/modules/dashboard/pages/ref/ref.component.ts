import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { Ref } from '../../models/ref';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { RefTableComponent } from '../../components/ref/ref-table/ref-table.component';

@Component({
  selector: 'app-ref',
  standalone: true,
  imports: [CommonModule, RefTableComponent],
  templateUrl: './ref.component.html',
  styleUrl: './ref.component.scss'
})
export class RefComponent {
  public refs: Ref[] = []
  firestore = inject(Firestore);
  showRefs:boolean = false

  constructor() { 
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
        this.refs.push(document.data() as Ref)
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

  ngOnInit() {
    
  }
}
