// services/api.ts
// Servicio de API para conectar con el backend de ZLCExpress

const API_BASE_URL = 'http://localhost:3000/api';

// Tipos para las respuestas del backend
export interface User {
  id: number;
  email: string;
  companyName: string;
  taxId: string;
  operationCountry: string;
  industry: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  fiscalAddress: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  userType: 'buyer' | 'supplier' | 'both';
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Función para hacer login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: LoginResponse = await response.json();
    
    // Si el login es exitoso, guardar el token
    if (data.success && data.token) {
      localStorage.setItem('zlc_token', data.token);
      localStorage.setItem('zlc_user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: 'Error de conexión. Verifica que el backend esté funcionando.',
    };
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (): Promise<{ success: boolean; user?: User; message?: string }> => {
  try {
    const token = localStorage.getItem('zlc_token');
    
    if (!token) {
      return {
        success: false,
        message: 'No hay sesión activa'
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Función para validar sesión
export const validateSession = async (): Promise<{ success: boolean; valid: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem('zlc_token');
    
    if (!token) {
      return {
        success: false,
        valid: false,
        message: 'No hay token'
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al validar sesión:', error);
    return {
      success: false,
      valid: false,
      message: 'Error de conexión'
    };
  }
};

// Función para hacer logout
export const logoutUser = async (): Promise<void> => {
  try {
    // Hacer la petición al backend
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar datos locales siempre
    localStorage.removeItem('zlc_token');
    localStorage.removeItem('zlc_user');
  }
};

// Función para obtener el usuario del localStorage
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('zlc_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error al obtener usuario guardado:', error);
    return null;
  }
};

// Función para verificar si hay una sesión activa
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('zlc_token');
  const user = getStoredUser();
  return !!(token && user);
};

// Función para obtener el token
export const getToken = (): string | null => {
  return localStorage.getItem('zlc_token');
};

// ===== TIPOS PARA CATEGORÍAS Y PRODUCTOS =====

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  imageUrl?: string;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
}

export interface VolumeDiscount {
  id: string;
  productId: string;
  minQuantity: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  supplierId: string;
  description: string;
  containerType: '20GP' | '40GP' | '40HC' | '45HC' | 'LCL';
  unitsPerContainer: number;
  moq: number;
  unitPrice: number;
  pricePerContainer: number;
  currency: 'USD' | 'EUR' | 'GBP';
  incoterm: 'FOB ZLC' | 'CIF' | 'EXW' | 'DDP';
  grossWeight: number;
  netWeight: number;
  volume: number;
  packagingType: string;
  stockContainers: number;
  isNegotiable: boolean;
  allowsCustomOrders: boolean;
  productionTime: number;
  packagingTime: number;
  status: 'active' | 'inactive' | 'sold_out';
  isPublished: boolean;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  tags: string[];
  totalViews: number;
  totalInquiries: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: {
    id: string;
    companyName: string;
    isVerified: boolean;
    location: string;
  };
  volumeDiscounts?: VolumeDiscount[];
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  message: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  limit: number;
  message: string;
}

export interface ProductDetailResponse {
  success: boolean;
  product: Product;
  message: string;
}

// ===== FUNCIONES PARA CATEGORÍAS =====

export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: CategoriesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return {
      success: false,
      categories: [],
      message: 'Error de conexión'
    };
  }
};

export const getCategoryById = async (id: string): Promise<{ success: boolean; category?: Category; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// ===== FUNCIONES PARA PRODUCTOS =====

export interface ProductFilters {
  category?: string;
  supplier?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  containerType?: string;
  incoterm?: string;
  status?: string;
  isNegotiable?: boolean;
  allowsCustomOrders?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'totalViews';
  sortOrder?: 'asc' | 'desc';
}

export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ProductsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return {
      success: false,
      products: [],
      total: 0,
      page: 1,
      limit: 20,
      message: 'Error de conexión'
    };
  }
};

export const getProductById = async (id: string): Promise<ProductDetailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ProductDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return {
      success: false,
      product: {} as Product,
      message: 'Error de conexión'
    };
  }
};

export const searchProducts = async (query: string, filters?: Omit<ProductFilters, 'search'>): Promise<ProductsResponse> => {
  return getProducts({ ...filters, search: query });
};

export const getProductsByCategory = async (categoryId: string, filters?: Omit<ProductFilters, 'category'>): Promise<ProductsResponse> => {
  return getProducts({ ...filters, category: categoryId });
};

// ===== FUNCIONES PARA CARRITO =====

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productDescription: string;
  supplierName: string;
  supplierId: string;
  containerType: string;
  containerQuantity: number;
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  customPrice?: number;
  notes?: string;
  addedAt: Date;
  updatedAt: Date;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  currency: string;
  lastUpdated: Date;
}

export interface CartResponse {
  success: boolean;
  data?: Cart;
  message?: string;
}

export interface AddToCartResponse {
  success: boolean;
  data?: CartItem;
  message?: string;
}

export interface CartStatsResponse {
  success: boolean;
  data?: {
    itemCount: number;
    totalAmount: number;
    currency: string;
  };
  message?: string;
}

// Obtener carrito
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user' // En producción, esto vendría del token JWT
      },
    });

    const data: CartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Obtener estadísticas del carrito
export const getCartStats = async (): Promise<CartStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    const data: CartStatsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener estadísticas del carrito:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Agregar producto al carrito
export const addToCart = async (
  productId: string,
  containerQuantity: number,
  containerType?: string,
  incoterm?: string,
  customPrice?: number,
  notes?: string
): Promise<AddToCartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
      body: JSON.stringify({
        productId,
        containerQuantity,
        containerType,
        incoterm,
        customPrice,
        notes
      }),
    });

    const data: AddToCartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return {
      success: false,
      message: `Error de conexión: ${error.message}`
    };
  }
};

// Actualizar producto del carrito
export const updateCartItem = async (
  itemId: string,
  containerQuantity?: number,
  customPrice?: number,
  notes?: string
): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/update/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
      body: JSON.stringify({
        containerQuantity,
        customPrice,
        notes
      }),
    });

    const data: CartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar producto del carrito:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Remover producto del carrito
export const removeFromCart = async (itemId: string): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    const data: CartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al remover del carrito:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Limpiar carrito
export const clearCart = async (): Promise<CartResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    const data: CartResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};
