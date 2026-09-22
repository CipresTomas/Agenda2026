import { Component, computed, input, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterModule, Router } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';

@Component({
  imports: [FormField, RouterModule],
  selector: 'app-new-edit-contact',
  styleUrl: '../contact-list/contact-list.scss',
  templateUrl: './new-edit-contact.html',
})
export class NewEditContact implements OnInit {
  idContacto = input<string>();
  contacto: Contact | undefined;
  readonly error = signal(false);

  readonly contactModel = signal<Omit<Contact, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    imgurl: '',
    isFavorite: false,
  });
  readonly contactForm = form(this.contactModel);
  readonly imagenPreview = computed(() => this.contactModel().imgurl);

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

    const { id: _id, ...datos } = this.contacto;
    this.contactModel.set(datos);
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo || !archivo.type.startsWith('image/')) {
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      this.contactModel.update((contacto) => ({ ...contacto, imgurl: lector.result as string }));
    };
    lector.readAsDataURL(archivo);
  }

  guardar(event: Event): void {
    event.preventDefault();
    this.error.set(false);
    const datos = this.contactModel();
    if (!datos.name.trim() || datos.name.trim().length < 2 || !datos.phone.trim()) {
      this.error.set(true);
      return;
    }

    const contacto = {
      ...datos,
      name: datos.name.trim(),
      email: datos.email.trim(),
      phone: datos.phone.trim(),
      address: datos.address.trim(),
      company: datos.company.trim(),
      imgurl: datos.imgurl.trim(),
    };

    if (this.contacto) {
      this.contactService.editar({ ...contacto, id: this.contacto.id });
      this.router.navigate(['/contacts', this.contacto.id]);
      return;
    }

    const nuevoContacto = this.contactService.agregar(contacto);
    this.router.navigate(['/contacts', nuevoContacto.id]);
  }
}
