import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyContactPage } from './family-contact';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from '../../../pipes/pipes.module'

@NgModule({
  declarations: [
    FamilyContactPage,
  ],
  imports: [
    TranslateModule,
    PipesModule,
    IonicPageModule.forChild(FamilyContactPage),
  ],
})
export class FamilyContactPageModule {}
