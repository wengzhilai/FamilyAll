import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyEditFatherPage } from './family-edit-father';
import { PipesModule } from '../../../pipes/pipes.module'

@NgModule({
  declarations: [
    FamilyEditFatherPage,

  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(FamilyEditFatherPage),
  ],
})
export class FamilyEditFatherPageModule {}
