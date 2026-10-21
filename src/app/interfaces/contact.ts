export interface ContactDto {
	id: number;
	firstName: string;
	lastName: string;
	address: string | null;
	number: string | null;
	email: string | null;
	image: string | null;
	company: string | null;
	description: string;
	userId: number;
	isFavorite: boolean;
}

export interface ContactWithGroupIdsDto extends ContactDto {
	groupIds: number[];
}

export interface CreateAndUpdateContactDto {
	firstName: string;
	lastName?: string | null;
	address?: string | null;
	number?: string | null;
	email?: string | null;
	image?: string | null;
	company?: string | null;
	description?: string | null;
}

export interface ContactFormModel {
	firstName: string;
	lastName: string;
	address: string;
	number: string;
	email: string;
	image: string;
	company: string;
	description: string;
	isFavorite: boolean;
}

export interface Contact extends ContactFormModel {
	id: number;
	userId: number;
	groupIds: number[];
}
