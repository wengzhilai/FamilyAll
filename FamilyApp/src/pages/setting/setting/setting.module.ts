import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [
    PipesModule,
    ComponentsModule,
    TranslateModule.forChild(),
    IonicPageModule.forChild(SettingPage),
  ],
})
export class SettingPageModule {}
