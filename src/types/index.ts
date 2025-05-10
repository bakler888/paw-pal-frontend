
// Animal interface that matches the DTO from the backend
export interface Animal {
  animalID?: number;
  name: string;
  animalPrice: number;
  animalcount: number; // Changed from optional to required
  description: string;
  buyorsale: number;
  dateOfbuyorsale?: string;
  animalCares?: string[];
}

// CareToolItem interface that matches the DTO from the backend
export interface CareToolItem {
  id?: number;
  name: string;
  price: number;
  count: number; // Changed from optional to required
  description: string;
}

// User interfaces
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
}
