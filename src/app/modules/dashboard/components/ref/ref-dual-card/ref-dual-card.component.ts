import { Component, Input } from '@angular/core';
import { Ref } from '../../../models/ref';
import { NgIf, NgStyle } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { RefService } from '../../../../../api/ref.service';
import { Router } from '@angular/router';

@Component({
  selector: '[app-ref-dual-card]',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './ref-dual-card.component.html',
  styleUrl: './ref-dual-card.component.scss'
})
export class RefDualCardComponent {
  @Input() ref: Ref = {} as Ref;

  constructor(private refService: RefService, private router: Router) {}

  ngOnInit(): void { }

  public shareRef(ref: Ref, event: any): void {

    event.stopPropagation();

    //spanElement = get element by id "share-ref"
    const element = (document.getElementById('share-ref') as HTMLElement);
    const spanElement = (element as HTMLElement).querySelector('span');
    if (spanElement) {
      spanElement.innerText = 'Ref copiée ! 🎉';
    }

    element.classList.add('bg-muted');
    element.classList.remove('bg-primary');

    setTimeout(() => {
      if (spanElement) {
        spanElement.innerText = 'Partage La ref !';
      }
      element.classList.remove('bg-muted');
      element.classList.add('bg-primary');
    }, 2000);

    const refLink = `${environment.serverUrl}/ref/${ref.id}`;
    navigator.clipboard.writeText(refLink)
      .then(() => {
        console.log('Ref link copied to clipboard:', refLink);
        this.refService.updateShareCount(ref.id)
          .subscribe(() => {
            console.log('Share count incremented for ref:', ref.id);
          });
      })
      .catch((error) => {
        console.error('Failed to copy ref link to clipboard:', error);
      });
  }

  get viewCount(): string {
    return this.ref?.viewCount?.toString() ?? '0';
  }

  get shareCount(): string {
    return this.ref?.shareCount?.toString() ?? '0';
  }

  navigateToRef(ref: Ref){
    this.router.navigate(['refs', ref.id]);
  }

}
