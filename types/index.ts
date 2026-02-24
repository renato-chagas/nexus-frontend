// ================= Auth =================
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

export interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  router: string;
}

// ============== Models ==============

export interface Asset {
  id?: number;
  name: string;
  category_id?: number;
  installed_software?: Software[];
  specs?: string;
  serial_number?: string;
  status?: string;
  bought_price?: number;
  bought_date?: Date;
  person_in_charge_id?: number;
  person_in_charge?: Employee;
  asset_history?: AssetHistory[];
  image_url?: string;
}

export interface Employee {
  id?: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  departament?: string;
  hire_date?: Date;
  assets?: Asset[];
}

export interface Category {
  id: number;
  name: string;
  tracks_software?: boolean;
  description?: string;
  quantity?: number;
}

export type CreateCategoryDTO = Omit<Category, "id" | "quantity">;

export interface AssetHistory {
  id?: number;
  asset_id: number;
  action_date: Date | string;
  action_type: 'CHECKOUT' | 'CHECKIN' | 'MAINTENANCE' | 'DISPOSAL';
  observaitions?: string;
  employee?: number;
  employee_id?: number;
}

export interface CreateAssetHistoryDTO {
  asset_id: number;
  action_type: 'CHECKOUT' | 'CHECKIN' | 'MAINTENANCE' | 'DISPOSAL';
  observaitions?: string;
}

export interface Software {
  id: number;
  name: string;
  version: string;
}