import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.component.html',
  styleUrls: ['./movie-rating.component.css']
})
export class MovieRatingComponent implements OnInit {

  @Input()
  rating: number;
  @Input()
  fontSize: string;
  @Input()
  top: string;
  @Input()
  bottom: string;
  @Input()
  left: string;
  @Input()
  right: string;

  constructor() { }

  ngOnInit(): void {
  }

  colorBorder(rating: number): string {
    let color: string;
    if (rating >= 8) {
      color = 'green';
    } else if (rating >= 5) {
      color = 'orange';
    } else {
      color = 'red';
    }
    return color;
  }

  applyStyles(): any {
    return {
      fontSize: this.fontSize,
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right
    };
  }


}
