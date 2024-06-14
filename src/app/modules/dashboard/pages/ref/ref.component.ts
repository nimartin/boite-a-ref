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
  }


  ngOnInit() {

  }
}
