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
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  userType: 'BUYER' | 'SUPPLIER' | 'BOTH';
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

// Tipos para el registro de usuarios
export interface RegisterData {
  email: string;
  password: string;
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
  userType: 'BUYER' | 'SUPPLIER' | 'BOTH';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

// Función para registrar usuario
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: RegisterResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error en registro:', error);
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
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  isActive: boolean;
  image: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  _count?: {
    products: number;
  };
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
  title: string;
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

// ===== FUNCIONES PARA RFQ/COTIZACIONES =====

export interface FreightQuote {
  id: string;
  origin: string;
  destination: string;
  containerType: string;
  estimatedDate: string;
  specialRequirements?: string;
  selectedCarrier?: {
    name: string;
    cost: number;
    currency: string;
    transitTime: number;
    incoterm: string;
    conditions: string[];
    availability: string;
  };
  cost: number;
  currency: string;
  createdAt: string;
}

export interface RFQRequest {
  id?: string;
  rfqNumber?: string;
  productId: string;
  productName?: string;
  productDescription?: string;
  supplierId?: string;
  supplierName?: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  companyName?: string;
  containerQuantity: number;
  containerType: '20GP' | '40GP' | '40HC' | '45HC';
  incoterm: 'EXW' | 'FOB' | 'CIF' | 'CFR' | 'DDP' | 'DAP';
  tentativeDeliveryDate: string;
  logisticsComments?: string;
  specialRequirements?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  estimatedValue?: number;
  currency?: string;
  freightQuote?: FreightQuote;
  requestDate?: string;
  responseDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RFQResponse {
  rfqId: string;
  supplierId: string;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  deliveryTime: number;
  deliveryTerms: string;
  validityPeriod: number;
  paymentTerms: string;
  minimumOrderQuantity: number;
  supplierComments?: string;
  technicalSpecifications?: string;
  attachments?: string[];
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  responseDate: string;
  validUntil: string;
}

export interface RFQsResponse {
  success: boolean;
  data?: RFQRequest[];
  total?: number;
  message?: string;
}

export interface RFQDetailResponse {
  success: boolean;
  data?: RFQRequest;
  message?: string;
}

export interface CreateRFQResponse {
  success: boolean;
  data?: RFQRequest;
  message?: string;
}

// Crear nueva RFQ
export const createRFQ = async (rfqData: Omit<RFQRequest, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt'>): Promise<CreateRFQResponse> => {
  try {
    console.log('🆕 Creando nueva RFQ:', rfqData);
    const response = await fetch(`${API_BASE_URL}/rfq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
      body: JSON.stringify(rfqData),
    });

    console.log('📡 Respuesta del servidor para createRFQ:', response.status, response.statusText);
    const data: CreateRFQResponse = await response.json();
    console.log('📦 Datos de respuesta createRFQ:', data);
    return data;
  } catch (error) {
    console.error('Error al crear RFQ:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Obtener todas las RFQs del usuario
export const getUserRFQs = async (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  supplierId?: string;
}): Promise<RFQsResponse> => {
  try {
    console.log('🔍 Obteniendo RFQs del usuario con filtros:', filters);
    const queryParams = new URLSearchParams();
    queryParams.append('requesterId', 'demo_user'); // En producción vendría del token
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/rfq?${queryParams.toString()}`;
    console.log('🌐 URL de consulta:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    console.log('📡 Respuesta del servidor:', response.status, response.statusText);
    const data: RFQsResponse = await response.json();
    console.log('📊 Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener RFQs:', error);
    return {
      success: false,
      data: [],
      message: 'Error de conexión'
    };
  }
};

// Obtener RFQ por ID
export const getRFQById = async (rfqId: string): Promise<RFQDetailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rfq/${rfqId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    const data: RFQDetailResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener RFQ:', error);
    return {
      success: false,
      message: 'Error de conexión'
    };
  }
};

// Obtener RFQs con información de flete
export const getRFQsWithFreight = async (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<RFQsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('requesterId', 'demo_user');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/rfq/freight?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });

    const data: RFQsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener RFQs con flete:', error);
    return {
      success: false,
      data: [],
      message: 'Error de conexión'
    };
  }
};

// Función de prueba para verificar conectividad del backend
export const testBackendConnection = async (): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log('🧪 Probando conexión al backend...');
    
    // Probar endpoint básico primero
    const healthResponse = await fetch(`http://localhost:3000/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('❤️ Health check response:', healthResponse.status, healthResponse.statusText);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('❤️ Health data:', healthData);
    
    // Probar endpoint de productos para debug (opcional)
    let productsData = { count: 0, products: [] };
    try {
      const productsResponse = await fetch(`http://localhost:3000/debug/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🛍️ Products debug response:', productsResponse.status, productsResponse.statusText);
      if (productsResponse.ok) {
        productsData = await productsResponse.json();
        console.log('📦 Products available:', productsData);
      }
    } catch (productError) {
      console.log('⚠️ Products endpoint not available:', productError.message);
    }
    
    // Probar endpoint de RFQ específicamente
    const rfqTestResponse = await fetch(`${API_BASE_URL}/rfq?requesterId=demo_user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'demo_user'
      },
    });
    
    console.log('🔍 RFQ test response:', rfqTestResponse.status, rfqTestResponse.statusText);
    const rfqData = await rfqTestResponse.json();
    console.log('📊 RFQ test data:', rfqData);
    
    return {
      success: true,
      message: `Backend conectado correctamente. Health: ${healthData.status}, Products: ${productsData.count || 0}, RFQs: ${rfqData.data?.length || 0}`,
      data: { health: healthData, products: productsData, rfqs: rfqData }
    };
  } catch (error) {
    console.error('❌ Error probando backend:', error);
    return {
      success: false,
      message: `Error de conexión: ${error.message}`
    };
  }
};

// Función para convertir datos del carrito a RFQ
export const sendQuoteAsRFQ = async (quoteData: {
  items: any[];
  totalAmount: number;
  paymentConditions: string;
  freightQuote?: FreightQuote;
  platformCommission?: number;
  notes?: string;
}): Promise<CreateRFQResponse[]> => {
  try {
    console.log('🚀 Enviando cotización como RFQ:', quoteData);
    const results: CreateRFQResponse[] = [];
    
    // Agrupar items por proveedor
    const itemsBySupplier = quoteData.items.reduce((acc: { [supplierId: string]: any[] }, item: any) => {
      if (!acc[item.supplierId]) {
        acc[item.supplierId] = [];
      }
      acc[item.supplierId].push(item);
      return acc;
    }, {} as { [supplierId: string]: any[] });

    console.log('📦 Items agrupados por proveedor:', itemsBySupplier);

    // Crear una RFQ por cada proveedor
    for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
      const itemsArray = items as any[]; // Asegurar que es un array
      const firstItem = itemsArray[0];
      const totalContainers = itemsArray.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      console.log(`🏭 Creando RFQ para proveedor ${supplierId}:`, {
        supplierId,
        itemCount: itemsArray.length,
        totalContainers,
        firstItem
      });
      
      const rfqData: Omit<RFQRequest, 'id' | 'rfqNumber' | 'createdAt' | 'updatedAt'> = {
        productId: firstItem.productId,
        productName: firstItem.productTitle,
        supplierId: firstItem.supplierId,
        supplierName: firstItem.supplier,
        requesterName: 'Demo User', // En producción vendría del contexto de usuario
        requesterEmail: 'demo@example.com',
        companyName: 'Demo Company',
        containerQuantity: totalContainers,
        containerType: firstItem.containerType as any,
        incoterm: firstItem.incoterm as any,
        tentativeDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        logisticsComments: quoteData.notes,
        specialRequirements: `Condiciones de pago: ${quoteData.paymentConditions}. Comisión de plataforma: $${quoteData.platformCommission || 0}`,
        priority: 'medium',
        estimatedValue: quoteData.totalAmount,
        currency: 'USD',
        freightQuote: quoteData.freightQuote
      };

      console.log('📋 Datos de RFQ a enviar:', rfqData);
      const result = await createRFQ(rfqData);
      console.log('📤 Resultado de createRFQ:', result);
      results.push(result);
    }

    console.log('✅ Resultados finales:', results);
    return results;
  } catch (error) {
    console.error('Error al enviar cotización como RFQ:', error);
    return [{
      success: false,
      message: 'Error al procesar cotización'
    }];
  }
};
