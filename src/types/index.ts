// Type definitions

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
