import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveLookPage } from './active-look';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";
import { PipesModule } from "../../../pipes/pipes.module"
@NgModule({
  declarations: [
    ActiveLookPage,
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    PipesModule,
    IonicPageModule.forChild(ActiveLookPage),
  ],
})
export class ActiveLookPageModule {}
