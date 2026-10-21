import { Component, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  readonly registerModel = signal({ firstName: '', lastName: '', email: '', password: '', password2: '' });
  readonly registerForm = form(this.registerModel, (schema) => {
    required(schema.firstName);
    required(schema.lastName);
    required(schema.email);
    email(schema.email);
    required(schema.password);
    minLength(schema.password, 8);
    required(schema.password2);
  });
  readonly errorRegister = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async registrarse(): Promise<void> {
    this.errorRegister.set(false);
    const { firstName, lastName, email, password, password2 } = this.registerModel();
    if (!firstName || !lastName || !email || !password || password !== password2 || password.length < 8) {
      this.errorRegister.set(true);
      return;
    }

    const registrado = await this.authService.registrar({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });
    if (!registrado) {
      this.errorRegister.set(true);
      return;
    }

    await this.router.navigate(['/login']);
  }
}
