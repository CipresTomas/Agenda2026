import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  readonly registerModel = signal({ name: '', email: '', password: '', password2: '' });
  readonly registerForm = form(this.registerModel);
  readonly errorRegister = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  registrarse(): void {
    this.errorRegister.set(false);
    const { name, email, password, password2 } = this.registerModel();
    if (!name || !email || !password || password !== password2 || password.length < 4) {
      this.errorRegister.set(true);
      return;
    }

    this.authService.registrar({ name: name.trim(), email: email.trim(), password });
    this.router.navigate(['/login']);
  }
}
