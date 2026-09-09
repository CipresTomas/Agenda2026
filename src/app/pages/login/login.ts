import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  errorLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  iniciarSesion(form: NgForm): void {
    this.errorLogin = false;
    const { email, password } = form.value;
    if (!email || !password || !this.authService.iniciarSesion(email, password)) {
      this.errorLogin = true;
      return;
    }

    this.router.navigate(['/contact-list']);
  }
}
