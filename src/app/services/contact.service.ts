import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Contact,
  ContactDto,
  ContactFormModel,
  ContactWithGroupIdsDto,
  CreateAndUpdateContactDto,
} from '../interfaces/contact';
import { API_BASE_URL } from './api-config';
import { AuthService } from './auth.service';

export type { Contact } from '../interfaces/contact';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  readonly contactos = signal<Contact[]>([]);

  async cargar(): Promise<Contact[]> {
    const response = await firstValueFrom(
      this.http.get<ContactWithGroupIdsDto[]>(`${API_BASE_URL}/contacts`, {
        headers: this.authService.authorizationHeaders,
      }),
    );
    const contactos = response.map((contacto) => this.normalizar(contacto));
    this.contactos.set(contactos);
    return contactos;
  }

  async obtenerPorId(id: number): Promise<Contact | undefined> {
    const response = await firstValueFrom(
      this.http.get<ContactWithGroupIdsDto | null>(`${API_BASE_URL}/contacts/${id}`, {
        headers: this.authService.authorizationHeaders,
      }),
    );
    return response ? this.normalizar(response) : undefined;
  }

  async agregar(contacto: ContactFormModel): Promise<Contact> {
    const response = await firstValueFrom(
      this.http.post<ContactDto>(`${API_BASE_URL}/contacts`, this.toDto(contacto), {
        headers: this.authService.authorizationHeaders,
      }),
    );
    const nuevoContacto = this.normalizar({ ...response, groupIds: [] });
    this.contactos.update((actuales) => [...actuales, nuevoContacto]);
    return nuevoContacto;
  }

  async editar(contacto: Contact): Promise<Contact> {
    await firstValueFrom(
      this.http.put<void>(`${API_BASE_URL}/contacts/${contacto.id}`, this.toDto(contacto), {
        headers: this.authService.authorizationHeaders,
      }),
    );
    this.contactos.update((actuales) =>
      actuales.map((actual) => (actual.id === contacto.id ? contacto : actual)),
    );
    return contacto;
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${API_BASE_URL}/contacts/${id}`, {
        headers: this.authService.authorizationHeaders,
      }),
    );
    this.contactos.update((actuales) => actuales.filter((contacto) => contacto.id !== id));
  }

  async alternarFavorito(id: number): Promise<Contact> {
    await firstValueFrom(
      this.http.post(`${API_BASE_URL}/contacts/${id}/favorite`, null, {
        headers: this.authService.authorizationHeaders,
        responseType: 'text',
      }),
    );
    const contacto = await this.obtenerPorId(id);
    if (!contacto) {
      throw new Error('No se pudo recuperar el contacto actualizado.');
    }
    this.actualizarEnLista(contacto);
    return contacto;
  }

  private toDto(contacto: ContactFormModel): CreateAndUpdateContactDto {
    return {
      firstName: contacto.firstName,
      lastName: contacto.lastName,
      address: contacto.address,
      number: contacto.number,
      email: contacto.email,
      image: contacto.image,
      company: contacto.company,
      description: contacto.description,
    };
  }

  private normalizar(contacto: ContactDto & { groupIds?: number[] }): Contact {
    return {
      id: contacto.id,
      firstName: contacto.firstName,
      lastName: contacto.lastName,
      address: contacto.address ?? '',
      number: contacto.number ?? '',
      email: contacto.email ?? '',
      image: contacto.image ?? '',
      company: contacto.company ?? '',
      description: contacto.description ?? '',
      userId: contacto.userId,
      isFavorite: contacto.isFavorite,
      groupIds: contacto.groupIds ?? [],
    };
  }

  private actualizarEnLista(contacto: Contact): void {
    this.contactos.update((actuales) =>
      actuales.map((actual) => (actual.id === contacto.id ? contacto : actual)),
    );
  }
}
