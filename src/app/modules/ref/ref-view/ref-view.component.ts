import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { RefService } from '../../../api/ref.service';
import { RefPlayerComponent } from '../ref-player/ref-player.component';
import { Meta, Title } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { Ref } from '../../dashboard/models/ref';

@Component({
  selector: 'app-ref-view',
  standalone: true,
  imports: [NgIf, RefPlayerComponent, AsyncPipe],
  templateUrl: './ref-view.component.html',
  styleUrl: './ref-view.component.scss'
})
export class RefViewComponent  implements OnInit
{

  public ref!: Ref;

  constructor(
    private activatedRoute: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private refService: RefService,
    @Inject(PLATFORM_ID) private platformId: Object) {}



  ngOnInit(): void {
    this.refService.getRefById(this.activatedRoute.snapshot.params['id']).subscribe(ref => {
      this.ref = ref;
      //Only execute browser-specific code inside isBrowser()
      if (this.isBrowser()) {
        this.setMetaTags(this.ref);
      }
    });


  }

  public isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setMetaTags(ref: Ref): void {

    const title = 'J\'ai la ref - ' + ref?.title;
    const desc = 'Découvre la ref ' + ref?.title + ' !';
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:image', content: ref?.tiktokVideoThumbnail as string });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
  }
}
