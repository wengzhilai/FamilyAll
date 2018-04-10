import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FamilyRelativePage } from './family-relative';

@NgModule({
  declarations: [
    FamilyRelativePage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyRelativePage),
  ],
})
export class FamilyRelativePageModule {}
