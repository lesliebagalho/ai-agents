export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR" | "VIEWER";
export type UserStatus = "ACTIVE" | "INVITED" | "INACTIVE";
export type ProductStatus = "ACTIVE" | "INACTIVE";
export type UnitType = "UNIT" | "BOX" | "KG" | "LITER" | "METER";
export type MovementType = "ENTRY" | "EXIT" | "ADJUSTMENT";

export type Company = {
  id: string;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
};

export type UserCompany = {
  id: string;
  userId: string;
  companyId: string;
  role: UserRole;
  isActive: boolean;
};

export type Category = {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  companyId: string;
  categoryId?: string;
  name: string;
  sku?: string;
  costPrice?: number;
  unit: UnitType;
  minimumStock?: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type InventoryBalance = {
  id: string;
  companyId: string;
  productId: string;
  currentQuantity: number;
  updatedAt: string;
};

export type InventoryMovement = {
  id: string;
  companyId: string;
  productId: string;
  performedByUserId: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  resultingQuantity: number;
  reason?: string;
  note?: string;
  referenceCode?: string;
  createdAt: string;
};

export type InventoryMovementWithRelations = InventoryMovement & {
  product: Product;
  user: User;
};

export type UserWithMembership = User & {
  membership: UserCompany;
};

export type DemoDatabase = {
  companies: Company[];
  users: User[];
  userCompanies: UserCompany[];
  categories: Category[];
  products: Product[];
  inventoryBalances: InventoryBalance[];
  inventoryMovements: InventoryMovement[];
};
