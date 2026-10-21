export interface AuthenticationRequestDto {
  email: string;
  password: string;
}

export interface CreateAndUpdateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  state: number;
}

export interface GetUserByIdDto {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  state: number;
}
