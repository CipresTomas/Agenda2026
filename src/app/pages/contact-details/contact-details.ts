import { Component, input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';

@Component({
  imports: [RouterModule],
  selector: 'app-contact-details',
  styleUrl: './contact-details.scss',
  templateUrl: './contact-details.html',
})
export class ContactDetails implements OnInit {
  idContacto = input<string>();
  contacto: Contact | undefined;
  imagenError = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.idContacto();
    this.contacto = id ? this.contactService.obtenerPorId(Number(id)) : undefined;
  }

  mostrarAvatar(): void {
    this.imagenError = true;
  }

  alternarFavorito(): void {
    this.contacto = this.contactService.alternarFavorito(Number(this.idContacto()));
  }

  eliminar(): void {
    this.contactService.eliminar(Number(this.idContacto()));
    this.router.navigate(['/contact-list']);
  }
}
