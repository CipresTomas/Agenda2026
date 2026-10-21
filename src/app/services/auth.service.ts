import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthenticationRequestDto, CreateAndUpdateUserDto, UserDto } from '../interfaces/user';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'agenda-token';
  private readonly storage = typeof localStorage === 'undefined' ? undefined : localStorage;
  private readonly http = inject(HttpClient);

  async registrar(user: CreateAndUpdateUserDto): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<UserDto>(`${API_BASE_URL}/users`, user));
      return true;
    } catch {
      return false;
    }
  }

  async iniciarSesion(credentials: AuthenticationRequestDto): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${API_BASE_URL}/authentication/authenticate`, credentials, {
          responseType: 'text',
        }),
      );
      const token = response.trim().replace(/^"(.*)"$/, '$1');
      if (!token) {
        return false;
      }

      this.storage?.setItem(this.tokenKey, token);
      return true;
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    this.storage?.removeItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    return Boolean(this.token);
  }

  get token(): string {
    return this.storage?.getItem(this.tokenKey) ?? '';
  }

  get authorizationHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  }
}
