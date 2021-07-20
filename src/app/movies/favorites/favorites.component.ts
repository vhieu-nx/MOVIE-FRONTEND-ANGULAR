import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../models/movie';
import {AuthService} from '../../auth/services/auth.service';
import {User} from '../../auth/models/user';
import {Subscription} from 'rxjs';
import {MovieService} from '../services/movie.service';
import {NotifierService} from 'angular-notifier';
import {tap} from 'rxjs/operators';
import {ErrorMessages} from '../../shared/error-messages';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: []
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favoriteMovies: Movie[];
  loggedUser: User;
  userSub: Subscription;

  constructor(private authService: AuthService,
              private movieService: MovieService,
              private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    });
    this.getFavoriteMovies();
  }

  getFavoriteMovies(): void {
    this.movieService.isLoading = true;
    this.movieService.getFavoriteMovies(this.loggedUser.id)
      .subscribe(data => {
        this.favoriteMovies = data;
        this.movieService.isLoading = false;
      }, error => {
        this.movieService.isLoading = false;
        console.log(error);
      });
  }

  remove(toBeDeletedMovie: Movie): void {
    this.movieService.removeMovieFromFavorites(this.loggedUser.id, toBeDeletedMovie.id)
      .pipe(
        tap(() => this.notifierService.notify('success', `"${toBeDeletedMovie.title}" removed from favorites`)),
      )
      .subscribe(() =>
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== toBeDeletedMovie.id),
        () => {
          this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
        }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
