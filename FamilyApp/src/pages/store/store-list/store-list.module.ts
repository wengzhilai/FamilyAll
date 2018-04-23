import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreListPage } from './store-list';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";
@NgModule({
  declarations: [
    StoreListPage,
  ],
  imports: [
    PipesModule,
    TranslateModule,
    IonicPageModule.forChild(StoreListPage),
  ],
})
export class StoreListPageModule {}
