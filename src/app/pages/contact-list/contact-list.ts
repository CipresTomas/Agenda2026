import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  imports: [FormsModule],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  name: string = '';
  email: string = '';
  phone: string = '';
  contactos: { name: string; email: string; phone: string }[] = [];

  agregarcontacto() {
    if (!this.name.trim() || !this.email.trim() || !this.phone.trim()) {
      return;
    }

    this.contactos.push({
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
    });

  }
}
