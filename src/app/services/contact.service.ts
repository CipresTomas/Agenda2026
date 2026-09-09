import { Injectable } from '@angular/core';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  imgurl: string;
  address: string;
  company: string;
  isFavorite: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly storageKey = 'agenda-contactos';
  private readonly storage = typeof localStorage === 'undefined' ? undefined : localStorage;
  readonly contactos: Contact[] = this.cargarContactos();

  agregar(contacto: Omit<Contact, 'id'>): Contact {
    const nuevoContacto: Contact = {
      id: this.siguienteId(),
      ...contacto,
    };

    this.contactos.push(nuevoContacto);
    this.guardarContactos();
    return nuevoContacto;
  }

  obtenerPorId(id: number): Contact | undefined {
    return this.contactos.find((contacto) => contacto.id === id);
  }

  editar(contacto: Contact): Contact | undefined {
    const index = this.contactos.findIndex((actual) => actual.id === contacto.id);
    if (index === -1) {
      return undefined;
    }

    this.contactos[index] = contacto;
    this.guardarContactos();
    return contacto;
  }

  eliminar(id: number): boolean {
    const cantidadAnterior = this.contactos.length;
    const contactosRestantes = this.contactos.filter((contacto) => contacto.id !== id);
    this.contactos.splice(0, this.contactos.length, ...contactosRestantes);
    this.guardarContactos();
    return this.contactos.length < cantidadAnterior;
  }

  alternarFavorito(id: number): Contact | undefined {
    const contacto = this.obtenerPorId(id);
    if (!contacto) {
      return undefined;
    }

    contacto.isFavorite = !contacto.isFavorite;
    this.guardarContactos();
    return contacto;
  }

  private cargarContactos(): Contact[] {
    const guardados = this.storage?.getItem(this.storageKey);
    if (!guardados) {
      return [];
    }

    const contactos = JSON.parse(guardados) as Partial<Contact>[];
    return contactos.map((contacto) => ({
      id: contacto.id ?? 0,
      name: contacto.name ?? '',
      email: contacto.email ?? '',
      phone: contacto.phone ?? '',
      imgurl: contacto.imgurl ?? '',
      address: contacto.address ?? '',
      company: contacto.company ?? '',
      isFavorite: contacto.isFavorite ?? false,
    }));
  }

  private guardarContactos(): void {
    this.storage?.setItem(this.storageKey, JSON.stringify(this.contactos));
  }

  private siguienteId(): number {
    return this.contactos.reduce((mayor, contacto) => Math.max(mayor, contacto.id), 0) + 1;
  }
}
