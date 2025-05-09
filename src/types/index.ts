
// Animal interface that matches the DTO from the backend
export interface Animal {
  animalID?: number;
  name: string;
  animalPrice: number;
  animalcount?: number;
  description?: string;
  buyorsale: "buy" | "sale";
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
