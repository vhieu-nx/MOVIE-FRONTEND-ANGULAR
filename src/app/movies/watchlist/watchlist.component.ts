import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../models/movie';
import {User} from '../../auth/models/user';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';
import {MovieService} from '../services/movie.service';
import {tap} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {ErrorMessages} from '../../shared/error-messages';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService,
              private movieService: MovieService,
              private notifierService: NotifierService) {}

  watchlistMovies: Movie[];
  loggedUser: User;
  userSub: Subscription;

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    });
    this.getWatchlistMovies();
  }

  getWatchlistMovies(): void {
    this.movieService.isLoading = true;
    this.movieService.getWatchlistMovies(this.loggedUser.id)
      .subscribe(data => {
        this.watchlistMovies = data;
        this.movieService.isLoading = false;
      }, error => {
        this.movieService.isLoading = false;
        console.log(error.message);
      });
  }

  remove(toBeDeletedMovie: Movie): void {
    this.movieService.removeMovieFromWatchlist(this.loggedUser.id, toBeDeletedMovie.id)
      .pipe(
        tap(() => this.notifierService.notify('success', `"${toBeDeletedMovie.title}" removed from watchlist`)),
      )
      .subscribe(() =>
        this.watchlistMovies = this.watchlistMovies.filter(movie => movie.id !== toBeDeletedMovie.id),
        () => {
          this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
        }
      );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
