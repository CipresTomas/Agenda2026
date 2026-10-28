import { Component, computed, input, OnInit, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterModule, Router } from '@angular/router';
import { Contact, ContactFormModel } from '../../interfaces/contact';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormField, RouterModule],
  selector: 'app-new-edit-contact',
  styleUrls: ['./new-edit-contact.scss', '../contact-list/contact-list.scss'],
  templateUrl: './new-edit-contact.html',
})
export class NewEditContact implements OnInit {
  idContacto = input<string>();
  contacto: Contact | undefined;
  readonly error = signal(false);
  readonly apiError = signal(false);

  readonly contactModel = signal<ContactFormModel>({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    address: '',
    company: '',
    image: '',
    description: '',
    isFavorite: false,
  });
  readonly contactForm = form(this.contactModel);
  readonly imagenPreview = computed(() => this.contactModel().image);

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.idContacto());
    if (!id) {
      return;
    }

    try {
      this.contacto = await this.contactService.obtenerPorId(id);
    } catch {
      this.apiError.set(true);
      return;
    }
    if (!this.contacto) {
      this.router.navigate(['/contacts']);
      return;
    }

    const { id: _id, userId: _userId, groupIds: _groupIds, ...datos } = this.contacto;
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
      this.contactModel.update((contacto) => ({ ...contacto, image: lector.result as string }));
    };
    lector.readAsDataURL(archivo);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/login']);
  }

  async guardar(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(false);
    this.apiError.set(false);
    const datos = this.contactModel();
    if (!datos.firstName.trim()) {
      this.error.set(true);
      return;
    }

    const contacto = {
      ...datos,
      firstName: datos.firstName.trim(),
      lastName: datos.lastName.trim(),
      email: datos.email.trim(),
      number: datos.number.trim(),
      address: datos.address.trim(),
      company: datos.company.trim(),
      image: datos.image.trim(),
      description: datos.description.trim(),
    };

    try {
      if (this.contacto) {
        await this.contactService.editar({
          ...contacto,
          id: this.contacto.id,
          userId: this.contacto.userId,
          groupIds: this.contacto.groupIds,
        });
        await this.router.navigate(['/contacts', this.contacto.id]);
        return;
      }

      const nuevoContacto = await this.contactService.agregar(contacto);
      await this.router.navigate(['/contacts', nuevoContacto.id]);
    } catch {
      this.apiError.set(true);
    }
  }
}
