import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyEditPage } from './family-edit';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    FamilyEditPage,
  ],
  imports: [
    PipesModule,
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(FamilyEditPage),
  ],
})
export class FamilyEditPageModule {}
