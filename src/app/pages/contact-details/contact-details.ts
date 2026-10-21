import { Component, input, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'

@Component({
  imports: [RouterModule],
  selector: 'app-contact-details',
  styleUrl: './contact-details.scss',
  templateUrl: './contact-details.html',
})
export class ContactDetails implements OnInit {
  idContacto = input<string>();
  readonly contacto = signal<Contact | undefined>(undefined);
  imagenError = false;
  readonly cargando = signal(true);
  readonly error = signal(false);

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    const id = this.idContacto();
    if (!id) {
      this.cargando.set(false);
      return;
    }

    try {
      this.contacto.set(await this.contactService.obtenerPorId(Number(id)));
    } catch {
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  mostrarAvatar(): void {
    this.imagenError = true;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    void this.router.navigate(['/login']);
  }

  async alternarFavorito(): Promise<void> {
    try {
      this.contacto.set(await this.contactService.alternarFavorito(Number(this.idContacto())));
    } catch {
      this.error.set(true);
    }
  }

  async eliminar(): Promise<void> {
    const result = await Swal.fire({
      title: '¿Eliminar contacto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.contactService.eliminar(Number(this.idContacto()));
      await this.router.navigate(['/contacts']);
      void Swal.fire({
        title: 'Contacto eliminado',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
    } catch {
      this.error.set(true);
      void Swal.fire('No se pudo eliminar el contacto', 'Intentá nuevamente.', 'error');
    }
  }
}

// mucho void
//mezcle idiomas :(
//aunque diga que cancele eliminar no lo hace
