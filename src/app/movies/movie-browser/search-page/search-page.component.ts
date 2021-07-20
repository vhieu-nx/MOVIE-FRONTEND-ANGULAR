import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Movie} from '../../models/movie';
import {UrlParameters} from '../../models/url-parameters';
import {MovieService} from '../../services/movie.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: []
})
export class SearchPageComponent implements OnInit {

  movies$: Observable<Movie[]>;
  searchValue: string;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
    this.movies$ = this.movieService.getMovies$();
    this.movieService.searchTerm.subscribe(searchTerm => this.searchValue = searchTerm);
    // this.movies$ = this.movieService.getMovies$();
    // this.movieService.searchMovies();
  }

  search(term: string): void {
    this.movieService.searchMovies(term);
    // if (term.length > 1) {
    //   this.filtersService.allFiltersHiddenEmitter.next(true);
    //   this.movieService.searchTerm.next(term);
    //   this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
    //   this.searchTerm.next(term);
    // } else if (term.length === 0) {
    //   this.movieService.movies$.next([]);
    //   this.filtersService.allFiltersHiddenEmitter.next(false);
    //   setTimeout(() => this.movieService.getMovies(), 700);
    // }
  }

}
