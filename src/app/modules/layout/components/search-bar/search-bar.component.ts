import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { debounceTime, Subject } from 'rxjs';
import { RefService } from '../../../../api/ref.service';
import { Router } from '@angular/router';  // Importez Router
import { NgFor, NgIf } from '@angular/common';
import { Ref } from '../../../dashboard/models/ref';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SvgIconComponent, NgIf, NgFor],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']  // Corrigez styleUrl en styleUrls
})
export class SearchBarComponent implements OnInit {

  private searchSubject: Subject<string> = new Subject();
  refs: Ref[] = [];  // Stocke les résultats de recherche
  currentSearchText = '';  // Stocke le texte de recherche actuel
  isDisplayMobileSearch = false;
  isSearching = false;

  constructor(private refService: RefService, private router: Router) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(500) // Délai de 500ms avant de déclencher la recherche
    ).subscribe(searchText => {
      this.callSearch(searchText);
    });
  }

  onSearchInput(event: any): void {
    this.isSearching = true;
    const searchText = event.target.value;
    this.searchSubject.next(searchText);
    this.currentSearchText = searchText;  // Met à jour la valeur actuelle
  }

  callSearch(searchText: string): void {

    this.refService.searchRefs(searchText).subscribe({
      next: (refs) => {
        console.log(refs);
        this.refs = refs;  // Mettez à jour les résultats de recherche
      },
      error: (error) => {
        console.error('Error fetching refs:', error);
      },
      complete: () => {
        console.log('Search completed');
        this.isSearching = false;
      }
    });
  }

  get isIconSearchVisible(): boolean {
    return (!this.currentSearchText || this.currentSearchText.length === 0);
  }

  get isIconEmptyVisible(): boolean {
    return this.currentSearchText?.length > 0  && !this.isSearching && this.refs.length === 0;
  }


  displayMobileSearch(isDisplayMobileSearch : boolean): void {
    this.isDisplayMobileSearch = isDisplayMobileSearch;
  }

  onSearchClick(): void {
    // this.router.navigate(['/search'], { queryParams: { q: this.currentSearchText } });
  }

  onResultClick(ref: Ref): void {
    this.router.navigate(['/ref', ref.id]);  // Redirige vers une page de détail par exemple
  }

  redirectToUpload(): void {
    this.router.navigate(['/ref/upload']);
  }
}
