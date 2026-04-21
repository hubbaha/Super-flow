export type Category = {
  id: number;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
};

export type Specification = {
  id?: number;
  key: string;
  value: string;
};

export type TechnicalTable = {
  id?: number;
  productId?: number;
  [key: string]: string | number | undefined;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  categoryId: number;
  category: Category;
  specs: Specification[];
  tables: TechnicalTable[];
};

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  message: string;
  buyerType: string;
  createdAt: string;
};
