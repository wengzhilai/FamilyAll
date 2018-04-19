import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveListPage } from './active-list';

@NgModule({
  declarations: [
    ActiveListPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveListPage),
  ],
})
export class ActiveListPageModule {}
