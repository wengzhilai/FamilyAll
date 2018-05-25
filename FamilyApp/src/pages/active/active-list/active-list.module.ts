import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveListPage } from './active-list';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ActiveListPage,
  ],
  imports: [
    TranslateModule,
    PipesModule,
    IonicPageModule.forChild(ActiveListPage),
  ],
})
export class ActiveListPageModule {}
