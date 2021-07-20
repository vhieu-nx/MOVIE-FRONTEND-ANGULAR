import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import { MovieService } from '../../services/movie.service';
import {UrlParameters} from '../../models/url-parameters';
import {FiltersService} from '../../services/filters.service';
import {Router} from '@angular/router';
import {Movie} from '../../models/movie';

@Component({
  selector: 'app-movie-search',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private searchTerm = new Subject<string>();
  value = '';
  @Input()
  searchValue;

  constructor(private movieService: MovieService, private filtersService: FiltersService, private router: Router) {}

  ngOnInit(): void {
    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(async (searchTerm) => {
        this.movieService.searchMovies(searchTerm);
      })
    ).subscribe();
  }

  search(term: string): void {
    if (term.length > 1) {

      this.router.navigate(['/search']);
      this.searchTerm.next(term);
      this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
      this.movieService.searchTerm.next(term);

    } else if (term.length === 0) {
      this.movieService.movies$.next([]);
      setTimeout(() => this.router.navigate(['/movies']), 700);
    }
  }

}
