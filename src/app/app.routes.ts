import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ContactList } from './pages/contact-list/contact-list';
import { ContactDetails } from './pages/contact-details/contact-details';
import { NewEditContact } from './pages/new-edit-contact/new-edit-contact';
import { authGuard } from './auth.guard';
export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'contact-list',
    component: ContactList,
    canActivate: [authGuard],

  },
  {
    path: 'contacts/new',
    component: NewEditContact,
    canActivate: [authGuard],
  },
  {
    path: 'contacts/:idContacto/edit',
    component: NewEditContact,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',

  },
  {
    path: 'contacts/:idContacto',
    component: ContactDetails,
    canActivate: [authGuard],
  }
];
