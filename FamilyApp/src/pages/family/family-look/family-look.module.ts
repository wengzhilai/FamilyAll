import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyLookPage } from './family-look';
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    FamilyLookPage,
  ],
  imports: [
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(FamilyLookPage),
  ],
})
export class FamilyLookPageModule {}
