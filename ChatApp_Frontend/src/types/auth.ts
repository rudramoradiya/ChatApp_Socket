export interface AuthUser {
  id: string;
  email: string;
  username: string;
  profileImage: string;
  phone?: string;
  about?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}