import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeIndexPage } from './home-index';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    HomeIndexPage,
  ],
  imports: [
    PipesModule,
    TranslateModule,
    IonicPageModule.forChild(HomeIndexPage),
  ],
})
export class HomeIndexPageModule {}
