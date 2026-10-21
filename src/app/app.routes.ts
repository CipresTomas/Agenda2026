import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ContactList } from './pages/contact-list/contact-list';
import { ContactDetails } from './pages/contact-details/contact-details';
import { NewEditContact } from './pages/new-edit-contact/new-edit-contact';
import { soloPublicGuard } from './guards/solo-public-guard';
import { soloUserGuard } from './guards/solo-user-guard';
export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [soloPublicGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [soloPublicGuard],
  },
  {
    path: 'contacts',
    component: ContactList,
    canActivate: [soloUserGuard],
  },
  {
    path: 'contacts/create',
    component: NewEditContact,
    canActivate: [soloUserGuard],
  },
  {
    path: 'contacts/new',
    redirectTo: 'contacts/create',
  },
  {
    path: 'contact-list',
    redirectTo: 'contacts',
  },
  {
    path: 'contacts/:idContacto/edit',
    component: NewEditContact,
    canActivate: [soloUserGuard],
  },
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full',
  },
  {
    path: 'contacts/:idContacto',
    component: ContactDetails,
    canActivate: [soloUserGuard],
  },
];
