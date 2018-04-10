import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfilePage } from './user-profile/user-profile';
import { UserListPage } from './user-list/user-list';

export const routes: Routes = [
  {
    path: '',
    component: UserListPage,
    children: [
      {
        path: 'Profile',
        component: UserProfilePage,
      },
      {
        path: 'list',
        component: UserListPage,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }

export const routedComponents = [
];