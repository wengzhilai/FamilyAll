import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { routedComponents,UserRoutingModule } from './user.routes';
import { AppTranslationModule } from '../../app.translation.module';
import { UserProfilePage } from './user-profile/user-profile';
import { UserListPage } from './user-list/user-list';


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    UserRoutingModule,
  ],
  declarations: [
    routedComponents,
    UserProfilePage,
    UserListPage
  ],
  entryComponents: [
  ],
  exports: [

  ],
})
export class UserModule {
}
