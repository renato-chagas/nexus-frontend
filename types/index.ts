
export interface User {
  id?: number;
  username?: string;
  email?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// ============== API ==============
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}

// ============== Components ==============
export type InputVariant = "primary" | "secondary" | "danger";

export interface InputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: "mail" | "lock";
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: InputVariant;
  disabled?: boolean;
  className?: string;
}

// ============== Features ==============

// Exemplo:
// export interface Ativo {
//   id: number;
//   nome: string;
//   ...
// }

// export interface Categoria {
//   id: number;
//   nome: string;
//   ...
// }

// export interface Funcionario {
//   id: number;
//   nome: string;
//   email: string;
//   ...
// }
