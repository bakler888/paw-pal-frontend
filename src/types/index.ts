
// Animal interface that matches the DTO from the backend
export interface Animal {
  animalID?: number;
  name: string;
  animalPrice: number;
  animalcount?: number;
  description?: string;
  buyorsale: number | "buy" | "sale"; // Can be number (from API) or string (for UI)
  dateOfbuyorsale?: string;
  animalCares?: string[];
}

// CareToolItem interface that matches the DTO from the backend
export interface CareToolItem {
  id?: number;
  name: string;
  price: number;
  count?: number;
  description?: string;
}
