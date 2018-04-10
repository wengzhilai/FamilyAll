import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleListPage } from './role-list/role-list';

export const routes: Routes = [
  {
    path: '',
    component: RoleListPage,
    children: [
      {
        path: 'list',
        component: RoleListPage,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule { }

export const routedComponents = [
];