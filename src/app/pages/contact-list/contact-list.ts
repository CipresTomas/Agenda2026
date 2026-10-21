import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  imports: [RouterModule],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList implements OnInit {
  get contactos() {
    return this.contactService.contactos;
  }
  readonly cargando = signal(true);
  readonly error = signal(false);

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarContactos();
  }

  async cargarContactos(): Promise<void> {
    this.cargando.set(true);
    this.error.set(false);
    try {
      await this.contactService.cargar();
    } catch {
      this.error.set(true);
    } finally {
      this.cargando.set(false);
    }
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  async eliminarContacto(id: number): Promise<void> {
    Swal.fire({
      title: '¿Eliminar contacto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      try {
        await this.contactService.eliminar(id);
      } catch {
        this.error.set(true);
        void Swal.fire('No se pudo eliminar el contacto', 'Intentá nuevamente.', 'error');
        return;
      }

      void Swal.fire({
        title: 'Contacto eliminado',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
    });
  }
}
