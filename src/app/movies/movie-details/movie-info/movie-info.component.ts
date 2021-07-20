import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieDetails} from '../../models/movie-details';
import {environment} from '../../../../environments/environment';
import {Person} from '../../models/person';
import {AuthService} from '../../../auth/services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../auth/models/user';
import {MovieService} from '../../services/movie.service';
import {UserService} from '../../services/user.service';
import {UserData} from '../../models/user-data';
import {Movie} from '../../models/movie';
import {NotifierService} from 'angular-notifier';
import {ErrorMessages} from '../../../shared/error-messages';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit, OnDestroy {

  @Input()
  movieDetails: MovieDetails;
  env: string = environment.tmdb_imagesUrl_w500;
  isAuthenticated: boolean;
  loggedUser: User;
  userSub: Subscription;
  watchlistSelected: boolean;
  favoritesSelected: boolean;
  userData: UserData;

  constructor(private authService: AuthService,
              private movieService: MovieService,
              private userService: UserService,
              private notifierService: NotifierService) {}

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.loggedUser = user;
    });
    this.getUserData();
  }

  findCrewMembers(crew: Person[], job: string): Person[] {
    return crew.filter(crewMember => crewMember.job.toLowerCase() === job);
  }

  getUserData(): void {
    if (this.loggedUser) {
      this.userService.getUserData(this.loggedUser.id)
        .subscribe(data => {
          this.userData = data;
          this.checkUserCollections(this.userData);
        },
          () => {
            this.handleError();
          }
          );
    }
  }

  checkUserCollections(userData: UserData): void {
    this.watchlistSelected = userData.watchlist.map(movie => movie.id).includes(this.movieDetails.id);
    this.favoritesSelected = userData.favorites.map(movie => movie.id).includes(this.movieDetails.id);
  }

  onWatchlistSelected(event): void {
    if (this.watchlistSelected) {
      this.removeMovieFromWatchlist(event);
    } else {
      this.addMovieToWatchlist(event);
    }
  }

  onFavoritesSelected(event): void {
    if (this.favoritesSelected) {
      this.removeMovieFromFavorites(event);
    } else {
      this.addMovieToFavorites(event);
    }
  }

  handleEvent(event): void {
    if (event.target.classList.contains('selected')) {
      event.target.classList.add('no-hover');
    } else {
      event.target.classList.remove('no-hover');
    }
  }

  removeMovieFromWatchlist(event): void {
    this.movieService.removeMovieFromWatchlist(this.loggedUser.id, this.movieDetails.id)
      .subscribe(() => {
        this.watchlistSelected = !this.watchlistSelected;
        this.handleEvent(event);
        this.notifierService.notify('success', `"${this.movieDetails.title}" removed from watchlist`);
      }, () => {
        this.handleError();
      });
  }

  addMovieToWatchlist(event): void {
    const movie = this.createMovie();
    this.movieService.addMovieToWatchlist(this.loggedUser.id, movie)
      .subscribe(() => {
        this.watchlistSelected = !this.watchlistSelected;
        this.handleEvent(event);
        this.notifierService.notify('success', `"${this.movieDetails.title}" added to watchlist`);
      }, () => {
        this.handleError();
      });
  }

  removeMovieFromFavorites(event): void {
    this.movieService.removeMovieFromFavorites(this.loggedUser.id, this.movieDetails.id)
      .subscribe(() => {
        this.favoritesSelected = !this.favoritesSelected;
        this.handleEvent(event);
        this.notifierService.notify('success', `"${this.movieDetails.title}" removed from favorites`);
      }, () => {
        this.handleError();
      });
  }

  addMovieToFavorites(event: any): void {
    const movie = this.createMovie();
    this.movieService.addMovieToFavorites(this.loggedUser.id, movie)
      .subscribe(() => {
        this.favoritesSelected = !this.favoritesSelected;
        this.handleEvent(event);
        this.notifierService.notify('success', `"${this.movieDetails.title}" added to favorites`);
      }, () => {
        this.handleError();
      });
  }

  private createMovie(): Movie {
    return {
      id: this.movieDetails.id,
      title: this.movieDetails.title,
      poster_path: this.movieDetails.poster_path ? this.movieDetails.poster_path : null,
      release_date: this.movieDetails.release_date ? this.movieDetails.release_date : null,
      vote_average: this.movieDetails.vote_average ? this.movieDetails.vote_average : null
    };
  }

  handleError(): void {
    this.notifierService.notify('error', ErrorMessages.UNKNOWN_ERROR);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
