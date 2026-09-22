import { Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  imports: [FormField, RouterLink],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  readonly loginModel = signal({ email: '', password: '' });
  readonly loginForm = form(this.loginModel);
  readonly errorLogin = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  iniciarSesion(): void {
    this.errorLogin.set(false);
    const { email, password } = this.loginModel();
    if (!email || !password || !this.authService.iniciarSesion(email, password)) {
      this.errorLogin.set(true);
      return;
    }

    this.router.navigate(['/contact-list']);
  }
}
