import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register {
  errorRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  registrarse(form: NgForm): void {
    this.errorRegister = false;
    const { name, email, password, password2 } = form.value;
    if (!name || !email || !password || password !== password2 || password.length < 4) {
      this.errorRegister = true;
      return;
    }

    this.authService.registrar({ name: name.trim(), email: email.trim(), password });
    this.router.navigate(['/login']);
  }
}
