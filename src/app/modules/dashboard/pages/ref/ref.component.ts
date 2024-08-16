import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { Ref } from '../../models/ref';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { RefTableComponent } from '../../components/ref/ref-table/ref-table.component';
import { RefService } from '../../../../api/ref.service';
import { RefDualCardComponent } from '../../components/ref/ref-dual-card/ref-dual-card.component';

@Component({
  selector: 'app-ref',
  standalone: true,
  imports: [CommonModule, RefTableComponent, RefDualCardComponent],
  templateUrl: './ref.component.html',
  styleUrl: './ref.component.scss'
})
export class RefComponent {
  public refs: Ref[] = []
  firestore = inject(Firestore);
  showRefs:boolean = false

  constructor(private refService: RefService) {
  }


  ngOnInit() {
    this.refService.getTopRefs().subscribe(
      (refs: Ref[]) => {
        this.refs = refs;
      }
    );
  }

  callSearch(event: any) {
    console.log(event.target.value);
    this.refService.searchRefs(event.target.value).subscribe(refs => {
      console.log(refs);
    },
    error => {
      console.error('Error fetching refs:', error);
    }
    );
  }

}
