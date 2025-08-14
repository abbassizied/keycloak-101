import { Routes } from '@angular/router';
import { User } from './user/user';
import { Home } from './home/home';
import { Admin } from './admin/admin';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home page' }, // Empty path
  { path: 'user', component: User, title: 'User page' }, // Static
  { path: 'admin', component: Admin, title: 'Admin page' }, // Static
  { path: '**', component: NotFound, title: 'Not Found page' }, // Wildcard - always last
];
