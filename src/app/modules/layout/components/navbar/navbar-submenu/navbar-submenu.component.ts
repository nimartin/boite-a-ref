import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { SubMenuItem } from '../../../../../core/models/menu.model';

@Component({
  selector: 'div[navbar-submenu]',
  templateUrl: './navbar-submenu.component.html',
  styleUrls: ['./navbar-submenu.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, NgIf, AngularSvgIconModule],
})
export class NavbarSubmenuComponent implements OnInit {
  @Input() public submenu = <SubMenuItem[]>{};
  @ViewChild('submenuRef') submenuRef: ElementRef<HTMLUListElement> | undefined;

  constructor() {}

  ngOnInit(): void {
    /**
     * check if component is out of the screen
     */
    if (this.submenuRef) {
      const nativeElement = this.submenuRef.nativeElement
      if (nativeElement) {
        const submenu = nativeElement.getBoundingClientRect();
        const bounding = document.body.getBoundingClientRect();

        if (submenu.right > bounding.right) {
          const childrenElement = this.submenuRef.nativeElement.parentNode as HTMLElement;
          if (childrenElement) {
            childrenElement.style.left = '-100%';
          }
        }
      }
    }
  }

  ngAfterViewInit() {
    /**
     * check if component is out of the screen
     */
    // if (this.submenuRef) {
    //   const nativeElement = this.submenuRef.nativeElement
    //   if (nativeElement) {
    //     const submenu = nativeElement.getBoundingClientRect();
    //     const bounding = document.body.getBoundingClientRect();

    //     if (submenu.right > bounding.right) {
    //       const childrenElement = this.submenuRef.nativeElement.parentNode as HTMLElement;
    //       if (childrenElement) {
    //         childrenElement.style.left = '-100%';
    //       }
    //     }
    //   }
    // }
  }
}
