import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoundPipe} from './round.pipe';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {IvyCarouselModule} from 'angular-responsive-carousel';

const notifierDefaultOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 100,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: false,
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [LoadingSpinnerComponent, RoundPipe],
  providers: [],
  exports: [
    LoadingSpinnerComponent,
    CommonModule,
    RoundPipe,
    NotifierModule,
    IvyCarouselModule
  ],
  imports: [
    CommonModule,
    NotifierModule.withConfig(notifierDefaultOptions),
    IvyCarouselModule
  ]
})
export class SharedModule { }
