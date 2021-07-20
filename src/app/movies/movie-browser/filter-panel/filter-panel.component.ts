import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import { Genre } from 'src/app/movies/models/genre';
import { MovieService } from 'src/app/movies/services/movie.service';
import { DatePipe } from '@angular/common';
import {FiltersService} from '../../services/filters.service';

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent implements OnInit {

  MINIMUM_VOTES = 0;
  MAXIMUM_VOTES = 10000;
  STEP = 1000;
  @Input()
  sortCategory: string;
  @Input()
  selectedButton: string;
  genres: string[];
  genres$: Observable<Genre[]>;
  @Input()
  sortExpanded;
  @Input()
  filterExpanded;
  @Input()
  fromDate: string;
  @Input()
  toDate: string;
  @Input()
  voteCount: number;

  constructor(private movieService: MovieService,
              private datePipe: DatePipe,
              public filterService: FiltersService) {
  }

  ngOnInit(): void {
    this.genres$ = this.movieService.getGenres$();
    if (this.movieService.urlParams.withGenres !== '') {
      this.genres = this.movieService.urlParams.withGenres.split(',');
    } else {
      this.genres = [];
    }
  }

  toggleSort(): void {
    this.sortExpanded = !this.sortExpanded;
    this.filterService.sortingActivatedEmitter.next(this.sortExpanded);
  }

  toggleFilters(): void {
    this.filterExpanded = !this.filterExpanded;
    this.filterService.filteringActivatedEmitter.next(this.filterExpanded);
  }

  onButtonClicked(genreId: string, event): void {
    if (this.genres.includes(genreId)) {
      this.genres = this.genres.filter(id => genreId !== id);
    } else {
      this.genres.push(genreId);
    }
    if (event.target.classList.contains('btn-selected')) {
      event.target.classList.add('no-hover');
    } else {
      event.target.classList.remove('no-hover');
    }
  }

  onMouseOut(event): void {
    event.target.classList.remove('no-hover');
  }

  applyFilters(): void {
    this.movieService.movies$.next([]);
    this.movieService.urlParams.sortCategory = this.sortCategory;
    this.movieService.urlParams.withGenres = this.genres.join(',');
    this.movieService.urlParams.releaseDateGte = this.fromDate === '' || this.fromDate === null
      ? '' : this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    this.movieService.urlParams.releaseDateLte = this.toDate === '' || this.fromDate === null
      ? '' : this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    this.movieService.urlParams.voteCountGte = this.voteCount;
    this.movieService.getMovies();
  }
}
