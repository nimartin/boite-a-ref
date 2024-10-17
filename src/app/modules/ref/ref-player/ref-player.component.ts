import { Component, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { Ref } from '../../dashboard/models/ref';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RefService } from '../../../api/ref.service';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ref-player',
  standalone: true,
  imports: [NgIf],
  templateUrl: './ref-player.component.html',
  styleUrls: ['./ref-player.component.scss'],
})
export class RefPlayerComponent implements OnChanges {
  @Input('ref') ref!: Ref;

  @ViewChild('shareRefEl') shareRefEl!: ElementRef;
  public tiktokVideoUrl!: SafeUrl;

  isBrowser: boolean;
  constructor(
    private sanitizer: DomSanitizer,
    private refService: RefService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.updateRefData();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ref'] && !changes['ref'].isFirstChange()) {
      this.updateRefData();
    }
  }

  private updateRefData(): void {
    if (this.ref && this.isBrowser) {
      this.ref.tiktokVideoUrl = this.getTiktokVideoUrl();
      this.refService.updateViewCount(this.ref.id ?? '');
    }
  }

  getTiktokVideoUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.tiktok.com/player/v1/' + this.ref?.tiktokVideoId + this.params
    );
  }

  get viewCount(): string {
    return this.ref?.viewCount?.toString() ?? '0';
  }

  get shareCount(): string {
    return this.ref?.shareCount?.toString() ?? '0';
  }

  get params(): string {
    return '?&rel=0&music_info=1&description=1&loop=1&closed_caption=0&native_context_menu=0&volume_control=0';
  }

  public shareRef(ref: Ref): void {
    const element = this.shareRefEl.nativeElement as HTMLElement;
    const spanElement = element.querySelector('span');
    if (spanElement) {
      spanElement.innerText = 'Ref copiée ! 🎉';
    }

    element.classList.add('bg-muted');
    element.classList.remove('bg-primary');

    setTimeout(() => {
      if (spanElement) {
        spanElement.innerText = 'Partage la ref !';
      }
      element.classList.remove('bg-muted');
      element.classList.add('bg-primary');
    }, 2000);

    console.log()
    const refLink = `${environment.serverUrl}/refs/${ref.id}`;
    navigator.clipboard
      .writeText(refLink)
      .then(() => {
        console.log('Ref link copied to clipboard:', refLink);
        this.refService.updateShareCount(ref.id).subscribe(() => {
          console.log('Share count incremented for ref:', ref.id);
        });
      })
      .catch((error) => {
        console.error('Failed to copy ref link to clipboard:', error);
      });
  }
}
