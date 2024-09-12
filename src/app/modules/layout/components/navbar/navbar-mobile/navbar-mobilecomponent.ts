import { Component, HostListener, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { NavbarMobileMenuComponent } from './navbar-mobile-menu/navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-navbar-mobile',
    templateUrl: './navbar-mobile.component.html',
    styleUrls: ['./navbar-mobile.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        AngularSvgIconModule,
        NavbarMobileMenuComponent,
    ],
})
export class NavbarMobileComponent implements OnInit {
  constructor(public menuService: MenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(event: any): void {
    event.stopImmediatePropagation();
    this.menuService.showMobileMenu = false;
  }



  // if click outside this component, close the mobile menu
  @HostListener('document:click', ['$event'])
  public closeMobileMenu(event: any): void {
    if (!event.target.closest('.navbar-container') ) {
      this.menuService.showMobileMenu = false;
    }
  }

}
