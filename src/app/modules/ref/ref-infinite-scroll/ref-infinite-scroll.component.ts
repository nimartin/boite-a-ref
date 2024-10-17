import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RefService } from '../../../api/ref.service';
import { Ref } from '../../dashboard/models/ref';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, Meta, SafeUrl, Title } from '@angular/platform-browser';
import { RefPlayerComponent } from '../ref-player/ref-player.component';

@Component({
  selector: 'app-ref-infinite-scroll',
  standalone: true,
  imports: [NgFor, NgIf, RefPlayerComponent],
  templateUrl: './ref-infinite-scroll.component.html',
  styleUrl: './ref-infinite-scroll.component.scss'
})
export class RefInfiniteScrollComponent {
  refs: Ref[] = [];
  page = 0;
  hitPerPage = 3;
  currentIndex = 0;
  videoPlayed: Array<number> = []


  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;
  @ViewChildren('refItem') refItems!: QueryList<ElementRef>;

  observer!: IntersectionObserver;
  isBrowser: boolean;

  constructor(
    private refService: RefService,
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && typeof window !== 'undefined') {
      this.loadMoreRefs();
      this.setMetaDatas();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initializeObserver();
    }
  }

  setMetaDatas(): void {
    const title = 'J\'ai la ref';
    const desc = 'Découvre les meilleures ref du moment !';
    this.title.setTitle(title);
    this.meta.updateTag({
      name: 'description',
      content: desc
    });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'description', property: 'og:description', content: desc });
  }


  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initializeObserver() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const options = {
        root: this.scrollContainer.nativeElement,
        rootMargin: '0px',
        threshold: 0.5, // 50% visible
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index')!, 10);

          if (entry.isIntersecting) {
            // La ref est visible à plus de 50%
            this.pauseTiktok(this.currentIndex);
            this.currentIndex = index;
            if (this.videoPlayed.includes(this.currentIndex)) {
              this.playTiktok(index);
            }
            this.manageRefLoading();
          } else {
            // La ref n'est plus visible
          }
        });
      }, options);

      // Observer chaque refItem
      this.refItems.forEach((refItem) => {
        this.observer.observe(refItem.nativeElement);
      });

      // Observer les changements dans refItems pour les nouvelles refs
      this.refItems.changes.subscribe((changes: QueryList<ElementRef>) => {
        changes.forEach((refItem) => {
          this.observer.observe(refItem.nativeElement);
        });
      });
    } else {
      // Fallback si IntersectionObserver n'est pas supporté
      console.warn('IntersectionObserver n\'est pas supporté dans cet environnement.');
      // Vous pouvez implémenter une alternative ici
    }
  }

  manageRefLoading(): void {
    if (this.refs.length - this.currentIndex === 2) {
      this.page++;
      this.loadMoreRefs();
    }
  }

  loadMoreRefs(): void {
    this.refService
      .searchRefsWithFilters('', '', this.page, this.hitPerPage)
      .subscribe((newRefs) => {
        newRefs.forEach((ref) => {
          if (!ref.tiktokVideoUrl) {
            ref.tiktokVideoUrl = this.getTiktokVideoUrl(ref);
          }
        });
        this.refs = [...this.refs, ...newRefs];

        // Après mise à jour de la vue, réinitialiser l'observateur
        setTimeout(() => {
          if (this.observer) {
            this.observer.disconnect();
          }
          if (this.isBrowser) {
            this.initializeObserver();
          }
        }, 0);
      });
  }

  playTiktok(index: number): void {
    const iframe: HTMLIFrameElement | null =
      this.refItems.toArray()[index]?.nativeElement.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'seekTo', value: 0, "x-tiktok-player": true }, '*');
      iframe.contentWindow.postMessage({ type: 'play', "x-tiktok-player": true }, '*');
    }
  }

  //listen player message
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {

    if (event.data.type === 'onStateChange' && event.data.value == '1') {
      this.videoPlayed.push(this.currentIndex);
    }
  }

  pauseTiktok(index: number): void {
    const iframe: HTMLIFrameElement | null =
      this.refItems.toArray()[index]?.nativeElement.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: 'pause', 'x-tiktok-player': true },
        '*'
      );
    }
  }

  getTiktokVideoUrl(ref: Ref): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.tiktok.com/player/v1/' + ref?.tiktokVideoId + this.params
    );
  }

  get params(): string {
    return '?autoplay=1&music_info=0&description=0&loop=1&rel=0';
  }
}
