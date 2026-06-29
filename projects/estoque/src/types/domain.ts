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

export type Brand = {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Location = {
  id: string;
  companyId: string;
  parentId?: string;
  name: string;
  level: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Supplier = {
  id: string;
  companyId: string;
  name: string;
  cnpj?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  companyId: string;
  categoryId?: string;
  brandId?: string;
  locationId?: string;
  name: string;
  description?: string;
  code?: string;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  unit: UnitType;
  minimumStock?: number;
  maximumStock?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
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
  brands: Brand[];
  locations: Location[];
  suppliers: Supplier[];
  products: Product[];
  inventoryBalances: InventoryBalance[];
  inventoryMovements: InventoryMovement[];
};
