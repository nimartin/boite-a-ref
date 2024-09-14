import { Component, ElementRef, HostListener } from '@angular/core';
import { RefService } from '../../../api/ref.service';
import { Ref } from '../../dashboard/models/ref';
import { NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ref-infinite-scroll',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './ref-infinite-scroll.component.html',
  styleUrl: './ref-infinite-scroll.component.scss'
})
export class RefInfiniteScrollComponent {
  refs: Ref[] = [];
  currentIndex = 0;
  refHeight = 0;
  hitPerPage = 5;
  page = 0;

  constructor(private refService: RefService, private elRef: ElementRef, private sanitizer: DomSanitizer) {
    // Initialize hammerManager in the constructor
  }

  ngOnInit(): void {
    this.loadMoreRefs();
    this.calculateRefHeight();
  }

  loadMoreRefs(): void {
    this.refService.searchRefsWithFilters('', '', this.page, this.hitPerPage).subscribe(newRefs => {
      console.log(newRefs);
      this.refs = [...this.refs, ...newRefs];
      // generate tiktokvideo url for each ref
      this.refs.forEach(ref => {
        if (!ref.tiktokVideoUrl) {
          ref.tiktokVideoUrl = this.getTiktokVideoUrl(ref);
        }
      });
    });
  }

  manageRefLoading(): void {
    if (this.refs.length - this.currentIndex == 2) {
      this.page++;
      this.loadMoreRefs();
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== "undefined") {
      this.calculateRefHeight();
    }
  }

  calculateRefHeight() {
    // Subtract the navbar height if necessary (e.g., 64px)
    if (typeof window === "undefined") {
      return;
    }
    const navbarHeight = 64;
    this.refHeight = window.innerHeight - navbarHeight;
  }

  onNext(): void {
    if (this.currentIndex < this.refs.length - 1) {
      this.pauseTiktok();
      this.currentIndex++;
      this.restartTiktok();
    }
    this.manageRefLoading();
  }

  onPrev(): void {
    if (this.currentIndex > 0) {
      this.pauseTiktok();
      this.currentIndex--;
      this.restartTiktok();
    }
  }


  pauseTiktok(): void {
    const iframe: HTMLIFrameElement | null = this.elRef.nativeElement.querySelector('#ref'+this.currentIndex + ' iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'pause', "x-tiktok-player": true }, '*');
    }
  }

  restartTiktok(): void{
    const iframe: HTMLIFrameElement | null = this.elRef.nativeElement.querySelector('#ref'+this.currentIndex + ' iframe');
    if (iframe && iframe.contentWindow) {

      iframe.contentWindow.postMessage({ type: 'seekTo', value: 0, "x-tiktok-player": true }, '*');
      iframe.contentWindow.postMessage({ type: 'unMute', "x-tiktok-player": true }, '*');
      iframe.contentWindow.postMessage({ type: 'changeVolume', value: 100, "x-tiktok-player": true }, '*');
      iframe.contentWindow.postMessage({ type: 'play', "x-tiktok-player": true }, '*');

    }
  }

  get transform(): string {
    // if currentIndex = 0, translateY = 0
    return `translateY(-${this.currentIndex * this.refHeight}px)`;
  }

  getTiktokVideoUrl(ref: Ref): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.tiktok.com/player/v1/' + ref?.tiktokVideoId + this.params);
  }

  get params(): string {
    return '?autoplay=1&music_info=1&description=1&loop=1&rel=0';
  }
}
