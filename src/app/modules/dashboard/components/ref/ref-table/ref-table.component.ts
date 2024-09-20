import { NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Ref } from '../../../models/ref';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { RefService } from '../../../../../api/ref.service';

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

  constructor(private router: Router, public refService: RefService) {
  }

  ngAfterViewInit() {
    this.refService.getLastRefs(10).subscribe(refs => {
      this.refs = refs;
    });
  }

  navigateToRef(ref: Ref){
    console.log(ref.id)
    this.router.navigate(['ref', ref.id]);
  }
}
