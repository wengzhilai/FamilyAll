import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreLookPage } from './store-look';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";
import { PipesModule } from "../../../pipes/pipes.module"
@NgModule({
  declarations: [
    StoreLookPage,
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    PipesModule,
    IonicPageModule.forChild(StoreLookPage),
  ],
})
export class StoreLookPageModule {}
