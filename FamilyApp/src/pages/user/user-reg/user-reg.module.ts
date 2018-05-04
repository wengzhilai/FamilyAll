import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRegPage } from './user-reg';
import { PipesModule } from '../../../pipes/pipes.module'
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../../components/components.module";
@NgModule({
  declarations: [
    UserRegPage,
  ],
  imports: [
    PipesModule,
    TranslateModule,
    ComponentsModule,
    IonicPageModule.forChild(UserRegPage),
  ],
})
export class UserRegPageModule {}
