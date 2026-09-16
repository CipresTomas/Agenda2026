import { Component, input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';
import Swal from 'sweetalert2'

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
  ) { }

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
   const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No, cancel!",
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) swalWithBootstrapButtons.fire({
    title: "Deleted!",
    text: "Your file has been deleted.",
    icon: "success"
  });
  else if (result.dismiss === Swal.DismissReason.cancel)
 /* Read more about handling dismissals below */
  swalWithBootstrapButtons.fire({
    title: "Cancelled",
    text: "Your imaginary file is safe :)",
    icon: "error"
  });
});
};
  }

// mucho void
//mezcle idiomas :(
//aunque diga que cancele eliminar no lo hace
