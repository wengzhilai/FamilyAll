import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestListPage } from './suggest-list';

@NgModule({
  declarations: [
    SuggestListPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestListPage),
  ],
})
export class SuggestListPageModule {}
