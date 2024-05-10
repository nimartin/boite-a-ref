import { Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { zgeg } from './zgeg.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boite-a-ref';

  firestore = inject(Firestore);

  zgegs : zgeg[] = [];


  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.waitForElementAndClick();
  }

  waitForElementAndClick() {
    const targetElement = this.elementRef.nativeElement.querySelector('[data-e2e="Player-index-ControllerToggleSound"]');
    if (targetElement) {
      targetElement.click();
    } else {
      //setTimeout(() => this.waitForElementAndClick(), 100); // Réessayer après 100ms
    }
  }

  ngOnInit() {
    getDocs(collection(this.firestore, "zgegs")).then((response) => {
      console.log(response.docs)
      response.docs.forEach((document: any) => {
        this.zgegs.push(document.data() as zgeg)
      });
      console.log(this.zgegs);
    });
  }
}
