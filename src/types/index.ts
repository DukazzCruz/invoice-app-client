// User types
export interface User {
  language: any;
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  address: string;
  base_currency: string;
  numberFormat?: 'en' | 'es';
  dateFormat?: string;
  createdAt?: string;
  updatedAt?: string;
}
export type CustomerAction =
| { type: 'GET_CUSTOMERS_LOADING' }
| { type: 'GET_CUSTOMERS_SUCCESS'; payload: { results?: Customer[]; [key: string]: any } }
| { type: 'GET_CUSTOMERS_FAIL'; payload: any }
| { type: 'EDIT_CUSTOMER_LOADING' }
| { type: 'EDIT_CUSTOMER_SUCCESS'; payload: any }
| { type: 'EDIT_CUSTOMER_FAIL'; payload: any };
// Customer types
export interface Customer {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  mobile?: string;
  addresses: string[];
  merchant: string;
  number_invoices?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Item types
export interface Item {
  _id: string;
  name: string;
  description?: string;
  price: number;
  merchant: string;
  createdAt?: string;
  updatedAt?: string;
}

// Employee types
export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  active: boolean;
  merchant: string;
  createdAt?: string;
  updatedAt?: string;
}

// Invoice types
export interface InvoiceItem {
  item: string | Item;
  quantity: number;
  subtotal: number;
}

export interface Invoice {
  _id: string;
  number: string;
  customer: string | Customer;
  merchant: string;
  issued: Date | string;
  due: Date | string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

// Payment types
export interface Payment {
  _id: string;
  invoice: string | Invoice;
  merchant: string;
  status: boolean;
  paid_on?: Date | string;
  amount_paid: number;
  amount_due: number;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  ok: boolean;
  results?: T[];
  [key: string]: any;
}

export interface ApiError {
  error: {
    message: string;
  };
}

// Redux State types
export interface AuthState {
  authData: {
    isLoggedIn: boolean;
    token: string | null;
  };
  loginUser: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    errors?: any;
  };
  registerUser: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    errors?: any;
  };
}

export interface UserState {
  getUser: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    userDetails: User;
  };
  editUser: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    user?: User | any;
  };
}

export interface CustomerState {
  getCustomers: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    customersList: Customer[];
  };
  editCustomer: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    customer?: Customer;
  };
}

export interface ItemState {
  getItems: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    itemsList: Item[];
  };
  editItem: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    item?: Item;
  };
}

export interface EmployeeState {
  getEmployees: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    employeesList: Employee[];
  };
  editEmployee: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    employee?: Employee;
  };
  updateEmployee: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    employee?: Employee;
  };
  deleteEmployee: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    deletedId?: string;
  };
}

export interface InvoiceState {
  getInvoices: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    invoicesList: Invoice[];
  };
  editInvoice: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    invoice?: Invoice;
  };
  sendInvoiceEmail: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    emailResponse?: any;
  };
}

export interface RootState {
  authReducer: AuthState;
  userReducer: UserState;
  customerReducer: CustomerState;
  itemReducer: ItemState;
  employeeReducer: EmployeeState;
  invoiceReducer: InvoiceState;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  HomeTabs: undefined;
  CustomerForm: { customer?: Customer | null };
  ItemForm: { item?: Item | null };
  InvoiceForm: { invoice?: Invoice | null; newNumber?: string };
  Profile: undefined;
  EmployeeForm: { employee?: Employee | null };
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type HomeTabParamList = {
  Invoices: undefined;
  Customers: undefined;
  Items: undefined;
  Employees: undefined;
};


export type AuthAction = { type: string; token?: string; payload?: any };
export type UserAction = { type: string; payload?: any };
export type ItemAction =
  | { type: 'GET_ITEMS_LOADING' }
  | { type: 'GET_ITEMS_SUCCESS'; payload: { results?: Item[]; [key: string]: any } | Item[] }
  | { type: 'GET_ITEMS_FAIL'; payload: any }
  | { type: 'EDIT_ITEM_LOADING' }
  | { type: 'EDIT_ITEM_SUCCESS'; payload: Item | any }
  | { type: 'EDIT_ITEM_FAIL'; payload: any };

export type InvoiceAction =
  | { type: 'GET_INVOICES_LOADING' }
  | { type: 'GET_INVOICES_SUCCESS'; payload: { results?: Invoice[]; [key: string]: any } | Invoice[] }
  | { type: 'GET_INVOICES_FAIL'; payload: any }
  | { type: 'EDIT_INVOICE_LOADING' }
  | { type: 'EDIT_INVOICE_SUCCESS'; payload: Invoice | any }
  | { type: 'EDIT_INVOICE_FAIL'; payload: any }
  | { type: 'SEND_INVOICE_EMAIL_LOADING' }
  | { type: 'SEND_INVOICE_EMAIL_SUCCESS'; payload: any }
  | { type: 'SEND_INVOICE_EMAIL_FAIL'; payload: any };

export type EmployeeAction =
  | { type: 'GET_EMPLOYEES_LOADING' }
  | { type: 'GET_EMPLOYEES_SUCCESS'; payload: { results?: Employee[]; [key: string]: any } | Employee[] }
  | { type: 'GET_EMPLOYEES_FAIL'; payload: any }
  | { type: 'EDIT_EMPLOYEE_LOADING' }
  | { type: 'EDIT_EMPLOYEE_SUCCESS'; payload: { employee?: Employee } | Employee | any }
  | { type: 'EDIT_EMPLOYEE_FAIL'; payload: any }
  | { type: 'UPDATE_EMPLOYEE_LOADING' }
  | { type: 'UPDATE_EMPLOYEE_SUCCESS'; payload: { employee?: Employee } | Employee | any }
  | { type: 'UPDATE_EMPLOYEE_FAIL'; payload: any }
  | { type: 'DELETE_EMPLOYEE_LOADING' }
  | { type: 'DELETE_EMPLOYEE_SUCCESS'; payload: string }
  | { type: 'DELETE_EMPLOYEE_FAIL'; payload: any };

