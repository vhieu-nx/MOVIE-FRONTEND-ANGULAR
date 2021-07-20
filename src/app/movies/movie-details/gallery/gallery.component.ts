import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input()
  images;
  env: string = environment.tmdb_imagesUrl_original;

  constructor() {}

  ngOnInit(): void {
    this.images = this.images.map(image => {
      return {path: this.env + image.file_path};
    });
  }

}
