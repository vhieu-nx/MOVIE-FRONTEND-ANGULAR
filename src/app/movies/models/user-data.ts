import {Movie} from './movie';

export interface UserData {
  id: number;
  email: string;
  favorites?: Movie[];
  watchlist?: Movie[];
}
