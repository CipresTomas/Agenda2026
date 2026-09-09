import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
@Component({
  imports: [RouterModule],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  contactos: Contact[];

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.contactos = this.contactService.contactos;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
