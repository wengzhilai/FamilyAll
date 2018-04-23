import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestAddPage } from './suggest-add';

@NgModule({
  declarations: [
    SuggestAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestAddPage),
  ],
})
export class SuggestAddPageModule {}
