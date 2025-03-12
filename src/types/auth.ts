export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  loading: boolean;
  error: string | null;
}
