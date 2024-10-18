import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Ref } from '../../../models/ref';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { RefService } from '../../../../../api/ref.service';

@Component({
  selector: '[app-ref-table]',
  standalone: true,
  imports: [NgFor, AngularSvgIconModule, NgIf],
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
    this.refService.getLastRefs(20).subscribe(refs => {
      this.refs = refs;
    });
  }

  navigateToRef(ref: Ref){
    console.log(ref.id)
    this.router.navigate(['refs', ref.id]);
  }

  get lastVideoTime() {
    if (this.refs.length === 0) return '';

    const lastVideoDate = this.refs[0].uploadAt as Date; // Assuming `uploadAt` is a Firestore timestamp
    console.log(this.refs[0].uploadAt.seconds * 1000);
    const now = new Date();
    const diffInMs = now.getTime() - lastVideoDate.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
    const diffInYears = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));

    if (diffInMinutes < 60) return `${diffInMinutes} m.`;
    if (diffInHours < 24) return `${diffInHours} h.`;
    if (diffInDays < 7) return `${diffInDays} j.`;
    if (diffInWeeks < 4) return `${diffInWeeks} sem.`;
    if (diffInMonths < 12) return `${diffInMonths} mois`;
    return `${diffInYears} a.`;
  }

  navigateToUpload() {
    this.router.navigate(['/refs/upload']);
  }
}
