import { Component, ElementRef, QueryList, ViewChildren, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Ref } from './modules/dashboard/models/ref';

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


  refs : Ref[] = [];


  constructor(private elementRef: ElementRef) { }


  ngOnInit() {

  }
}
