declare type TPartner = {
  partnerId: string;
  partnerName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  note?: string;
  gender?: "female" | "male";
  certificate?: string;
  type?: "Customer" | "Supplier";
  totalBuyAmount?: number;
  debt?: number;
  createdAt?: string | Date;
};
declare type TStaff = {
  userId: string;
  staffName: string;
  phoneNumber: string;
  email: string;
  address: string;
  gender: "female" | "male";
  type: string;
  salary: number;
  note: string;
};

declare type TStaffAccount = {
  id: string;
  email: string;
  password: string;
  managerId: string;
  username?: string;
};

declare type TManager = {
  userId: string;
  shopName?: string;
  userName?: string;
  staffName?: string;
  photoURL?: string;
  address?: string;
  phoneNumber?: string;
  email: string;
  password?: string;
};

declare type TVoucher = {
  voucherId: string;
  voucherName: string;
  discountAmount: number;
  expirationDate: Date | string;
  publicDate: Date | string;
};

declare type TProduct = {
  productId: string;
  productName: string;
  groupId?: string;
  groupName?: string;
  image?: string;
  cost_price?: number;
  sell_price?: number;
  VAT?: number;
  note?: string;
  quantity?: number;
  totalPrice?: number;
  price?: number;
  numberOnShelf?: number;

  // FOR WARRANTY
  supplierID?: string;
  warrantyTime?: string;
};

declare type TGroupProduct = {
  groupId: string;
  groupName: string;
  shelfID?: string;
  shelfName?: string;
  note?: string;
};

declare type TShelf = {
  shelfId: string;
  shelfName: string;
  capacity: number | string;
  note?: string;
  currentQuantity?: number;
};

declare type TWarehouse = {
  warehouseId: string;
  warehouseName: string;
  address?: string;
  listProduct: Pick<
    TProduct,
    "productId" | "productName" | "quantity" | "numberOnShelf"
  >[];
  count: number;
};

declare type TOrder = {
  orderId: string;
  partnerId: string;
  partnerName: string;
  createdAt?: Date | string;
  payment: number;
  discount?: number;
  totalPayment: number;
  status?: "paid" | "unpaid";
  debt?: number;
  listProduct: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  note?: string;
  voucherId?: string;
  seller: string;
  receiver: string;
  type: "Import" | "Export";
  warehouseName?: string;
};

declare type TReport = {
  date?: Date | string | number;
  revenue?: number;
  outcome?: number;
  profit?: number;
  numberOfOrder?: number;
  importOrder?: number;
  exportOrder?: number;
  [key: string]: number | Date | string;
};

declare type TReportSlice = {
  byDate?: TReport[];
  byMonth?: TReport[];
  byYear?: TReport[];
};

declare type D = {
  from: Date;
  to: Date;
};

declare type TRProduct = {
  productId: string;
  productName: string;
  import?: number;
  export?: number;
};
declare type TReportProduct = {
  date: Date;
  products: TRProduct[];
};

declare type TWarranty = {
  warrantyId: string;
  productId: string;
  productName: string;
  supplierID: string;
  customerID: string;
  customerName: string;
  customerPhoneNumber: string;
  reason: string;
  status: "REQUEST" | "SEND_TO_SUPPLIER" | "FIXED" | "RETURN_TO_CUSTOMER";
};
