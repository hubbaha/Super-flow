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
  id: number;
  productId: number;
  data: Record<string, string> | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  images?: string[] | null;
  /** Custom heading above the technical table on the product page. */
  technicalTableTitle?: string | null;
  /** Map of row data keys to table header labels. */
  technicalTableColumnLabels?: Record<string, string> | null;
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
