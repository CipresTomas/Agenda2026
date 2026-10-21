import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
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
  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.email);
    email(schema.email);
    required(schema.password);
    minLength(schema.password, 8);
  });
  readonly errorLogin = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async iniciarSesion(): Promise<void> {
    this.errorLogin.set(false);
    const credentials = this.loginModel();
    if (!credentials.email || !credentials.password) {
      this.errorLogin.set(true);
      return;
    }

    const autenticado = await this.authService.iniciarSesion(credentials);
    if (!autenticado) {
      this.errorLogin.set(true);
      return;
    }

    await this.router.navigate(['/contacts']);
  }
}
