import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../models/person';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-movie-cast',
  templateUrl: './movie-cast.component.html',
  styleUrls: ['./movie-cast.component.css']
})
export class MovieCastComponent implements OnInit {

  isChecked = false;
  env: string = environment.tmdb_imagesUrl_w300;

  @Input()
  cast: Person[];

  constructor() { }

  ngOnInit(): void {
  }

}
