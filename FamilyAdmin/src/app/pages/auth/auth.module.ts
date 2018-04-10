import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NbLayoutModule, NbCardModule, NbCheckboxModule } from '@nebular/theme';


import { routes } from './auth.routes';
import { AuthLoginPage } from './login/auth-login';
import { AuthRoutingModule, routedComponents } from './auth.routes';
import { AuthBlockPage } from "./auth-block/auth-block.component";
import { AuthPages } from "./auth.component";
import { ModalModule } from 'ngx-bootstrap';
import { AppTranslationModule } from '../../app.translation.module';


@NgModule({
  imports: [
    CommonModule,
    NbLayoutModule,
    NbCardModule,
    NbCheckboxModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    AppTranslationModule,
  ],
  declarations: [
    AuthLoginPage,
    AuthBlockPage,
    AuthPages,
  ],
  entryComponents: [
    AuthLoginPage,
  ],
  exports: [
    AuthLoginPage,
    AuthBlockPage,
    AuthPages,
  ],
})
export class AuthModule {
}
