import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ref } from '../../dashboard/models/ref';
import { NgIf } from '@angular/common';
import { RefService } from '../../../api/ref.service';
import { RefPlayerComponent } from '../ref-player/ref-player.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ref-view',
  standalone: true,
  imports: [NgIf, RefPlayerComponent],
  templateUrl: './ref-view.component.html',
  styleUrl: './ref-view.component.scss'
})
export class RefViewComponent  implements OnInit
{

  public ref: Ref | undefined;

  constructor(
    private route: ActivatedRoute,
    private refService: RefService,
    private meta: Meta,
    private title: Title) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        console.log(id);
        if(id != null){
          this.getRefById(id);
        }
    });
  }

  getRefById(id: string): void {
    this.refService.getRefById(id).subscribe(ref => {
      this.ref = ref;
      this.setMetaTags();
    });
  }

  setMetaTags(): void {
    const title = 'J\'ai la ref - ' + this.ref?.title;
    const desc = 'Découvre la ref ' + this.ref?.title + ' !';
    this.title.setTitle(title);
    this.meta.updateTag({
      name: 'description',
      content: desc
    });
    this.meta.updateTag({ name:'title', property: 'og:title', content: title });
    this.meta.updateTag({ name:'description', property: 'og:description', content: desc });
    this.meta.updateTag({ name:'image', property: 'og:image', content: this.ref?.tiktokVideoThumbnail as string});
  }
}
