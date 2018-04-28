import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import { TranslateModule } from "@ngx-translate/core";
import { PipesModule } from '../../../pipes/pipes.module'
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
    TranslateModule,
    PipesModule,
    ComponentsModule,
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule {}
