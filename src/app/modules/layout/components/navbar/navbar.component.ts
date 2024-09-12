import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
        AngularSvgIconModule,
        NavbarMenuComponent,
        ProfileMenuComponent,
        NavbarMobileComponent,
        SearchBarComponent
    ],
})
export class NavbarComponent implements OnInit {
  constructor(private menuService: MenuService, private router: Router) {}

  ngOnInit(): void {}

  public toggleMobileMenu(event: any): void {
    event.stopImmediatePropagation();
    this.menuService.showMobileMenu = true;
  }

  public navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
