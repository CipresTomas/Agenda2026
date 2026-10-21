import { ContactDto } from './contact';

export interface GroupDto {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
}

export interface GroupWithContactsDto extends GroupDto {
  contacts: ContactDto[];
}

export interface CreateAndUpdateGroupDto {
  name: string;
  description?: string | null;
}
