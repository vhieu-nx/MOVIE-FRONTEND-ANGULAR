import {Component, Input, OnInit} from '@angular/core';
import {Movie} from '../../models/movie';

@Component({
  selector: 'app-similar-movies',
  templateUrl: './similar-movies.component.html',
  styleUrls: ['./similar-movies.component.css']
})
export class SimilarMoviesComponent implements OnInit {

  @Input()
  similarMovies: Movie[];

  constructor() { }

  ngOnInit(): void {
  }

}
