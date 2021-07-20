import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MovieBrowserComponent} from './movie-browser/movie-browser.component';
import {MovieDetailsComponent} from './movie-details/movie-details.component';
import {WatchlistComponent} from './watchlist/watchlist.component';
import {AuthGuard} from '../auth/guards/auth.guard';
import {FavoritesComponent} from './favorites/favorites.component';
import {SearchPageComponent} from './movie-browser/search-page/search-page.component';

const routes: Routes = [
  {
    path: 'movies',
    component: MovieBrowserComponent
  },
  {
    path: 'movies/:id',
    component: MovieDetailsComponent
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: '**', redirectTo: '/movies'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule {

}
