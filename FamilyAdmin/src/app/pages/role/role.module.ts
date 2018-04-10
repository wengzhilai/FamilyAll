import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';

import { routedComponents, RoleRoutingModule } from './role.routes';
import { AppTranslationModule } from '../../app.translation.module';
import { RoleListPage } from './role-list/role-list';
import { TreeviewModule } from 'ngx-treeview';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ComponentsModule } from '../../components/components.module';

import { RoleEditComponent } from '../../components/role-edit/role-edit.component';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    RoleRoutingModule,
    ComponentsModule,
    ModalModule.forRoot(),
    TreeviewModule.forRoot(),
  ],
  declarations: [
    routedComponents,
    RoleListPage,
  ],
  entryComponents: [
    RoleEditComponent,
  ],
  exports: [
  ],
})
export class RoleModule {
}
