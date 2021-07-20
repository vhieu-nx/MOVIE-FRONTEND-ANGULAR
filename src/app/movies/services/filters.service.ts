import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  categoryEmitter = new BehaviorSubject<string>(Category.Popular);
  sortingActivatedEmitter = new BehaviorSubject<boolean>(false);
  filteringActivatedEmitter = new BehaviorSubject<boolean>(false);
  allFiltersHiddenEmitter = new BehaviorSubject<boolean>(false);

  constructor() {}

}
