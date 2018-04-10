import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleListPage } from './module-list/module-list';

export const routes: Routes = [
  {
    path: '',
    component: ModuleListPage,
    children: [
      {
        path: 'list',
        component: ModuleListPage,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule { }

export const routedComponents = [
];