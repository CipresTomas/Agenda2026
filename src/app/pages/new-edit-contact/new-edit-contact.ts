import { Component, input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';

@Component({
  imports: [FormsModule, RouterModule],
  selector: 'app-new-edit-contact',
  styleUrl: '../contact-list/contact-list.scss',
  templateUrl: './new-edit-contact.html',
})
//no entendi muy bien las signal pero lo hice asi:
export class NewEditContact implements OnInit {
  idContacto = input<string>();
  contacto: Contact | undefined;
  error = false;

  name = '';
  email = '';
  phone = '';
  address = '';
  company = '';
  imgurl = '';
  isFavorite = false;
  imagenPreview = '';

  constructor(
    private contactService: ContactService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.idContacto());
    if (!id) {
      return;
    }

    this.contacto = this.contactService.obtenerPorId(id);
    if (!this.contacto) {
      this.router.navigate(['/contact-list']);
      return;
    }

    this.name = this.contacto.name;
    this.email = this.contacto.email;
    this.phone = this.contacto.phone;
    this.address = this.contacto.address;
    this.company = this.contacto.company;
    this.imgurl = this.contacto.imgurl;
    this.imagenPreview = this.contacto.imgurl;
    this.isFavorite = this.contacto.isFavorite;
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo || !archivo.type.startsWith('image/')) {
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      this.imgurl = lector.result as string;
      this.imagenPreview = this.imgurl;
    };
    lector.readAsDataURL(archivo);
  }

  guardar(form: NgForm): void {
    this.error = false;
    if (form.invalid) {
      this.error = true;
      return;
    }

    const datos = {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      address: this.address.trim(),
      company: this.company.trim(),
      imgurl: this.imgurl.trim(),
      isFavorite: this.isFavorite,
    };

    if (this.contacto) {
      this.contactService.editar({ ...datos, id: this.contacto.id });
      this.router.navigate(['/contacts', this.contacto.id]);
      return;
    }

    const nuevoContacto = this.contactService.agregar(datos);
    this.router.navigate(['/contacts', nuevoContacto.id]);
  }
}
