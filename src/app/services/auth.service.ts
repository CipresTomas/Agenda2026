import { Injectable } from '@angular/core';

interface StoredUser {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userKey = 'agenda-user';
  private readonly sessionKey = 'agenda-session';
  private readonly storage = typeof localStorage === 'undefined' ? undefined : localStorage;

  registrar(user: StoredUser): boolean {
    this.storage?.setItem(this.userKey, JSON.stringify(user));
    return true;
  }

  iniciarSesion(email: string, password: string): boolean {
    const userJson = this.storage?.getItem(this.userKey);
    if (!userJson) {
      return false;
    }

    const user = JSON.parse(userJson) as StoredUser;
    const valido = user.email === email.trim() && user.password === password;
    if (valido) {
      this.storage?.setItem(this.sessionKey, 'true');
    }
    return valido;
  }

  cerrarSesion(): void {
    this.storage?.removeItem(this.sessionKey);
  }

  estaAutenticado(): boolean {
    return this.storage?.getItem(this.sessionKey) === 'true';
  }
}
