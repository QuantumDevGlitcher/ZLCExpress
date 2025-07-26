import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import * as API from "@/services/api";

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  supplier: string;
  supplierId: string;
  containerType: string;
  quantity: number; // number of containers
  pricePerContainer: number;
  currency: string;
  incoterm: string;
  customPrice?: number;
  notes?: string;
  addedAt: Date;
}

export interface Quote {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentConditions: string;
  purchaseOrderFile?: File;
  freightEstimate?: number;
  platformCommission?: number;
  status:
    | "draft"
    | "sent"
    | "pending"
    | "accepted"
    | "counter-offer"
    | "rejected";
  sentAt?: Date;
  updatedAt?: Date;
  supplierResponse?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  quotes: Quote[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | {
      type: "UPDATE_CUSTOM_PRICE";
      payload: { id: string; customPrice: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "ADD_QUOTE"; payload: Quote }
  | {
      type: "UPDATE_QUOTE_STATUS";
      payload: { id: string; status: Quote["status"]; response?: string };
    };

const initialState: CartState = {
  items: [],
  quotes: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

// API functions using imported services
const cartAPI = {
  async getCart(): Promise<CartItem[]> {
    try {
      const response = await API.getCart();
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch cart');
      }
      
      // Convert API cart items to local cart item format
      return response.data.items.map((item: API.CartItem) => ({
        id: item.id,
        productId: item.productId,
        productTitle: item.productName,
        productImage: '/api/placeholder/400/300',
        supplier: item.supplierName,
        supplierId: item.supplierId,
        containerType: item.containerType,
        quantity: item.containerQuantity,
        pricePerContainer: item.customPrice || item.pricePerContainer,
        currency: item.currency,
        incoterm: item.incoterm,
        customPrice: item.customPrice,
        notes: item.notes,
        addedAt: new Date(item.addedAt),
      }));
    } catch (error) {
      console.warn('Cart API not available, using local storage');
      return JSON.parse(localStorage.getItem('cart-items') || '[]');
    }
  },

  async addToCart(productId: string, containerQuantity: number, containerType: string, incoterm: string): Promise<CartItem> {
    try {
      console.log('🔄 Calling API.addToCart with:', { productId, containerQuantity, containerType, incoterm });
      const response = await API.addToCart(productId, containerQuantity, containerType, incoterm);
      console.log('📝 API response:', response);
      console.log('📝 API response.data:', response.data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to add to cart');
      }
      
      // El backend devuelve el item directamente en data, no en data.items
      const newItem = response.data;
      
      console.log('📝 newItem received:', newItem);
      
      if (!newItem) {
        throw new Error('Item not found in response');
      }

      // Intentar obtener información adicional del producto
      let productImage = null;
      try {
        const productInfo = await API.getProductById(productId);
        if (productInfo.success && productInfo.product) {
          productImage = productInfo.product.images?.[0] || null;
        }
      } catch (error) {
        console.warn('Could not fetch product image');
      }

      return {
        id: newItem.id,
        productId: newItem.productId,
        productTitle: newItem.productName,
        productImage: productImage,
        supplier: newItem.supplierName,
        supplierId: newItem.supplierId,
        containerType: newItem.containerType,
        quantity: newItem.containerQuantity,
        pricePerContainer: newItem.customPrice || newItem.pricePerContainer,
        currency: newItem.currency,
        incoterm: newItem.incoterm,
        customPrice: newItem.customPrice,
        notes: newItem.notes,
        addedAt: new Date(newItem.addedAt),
      };
    } catch (error) {
      console.warn('Cart API not available, using local fallback with real product data');
      
      // Fallback local - pero obteniendo datos reales del producto
      try {
        const productInfo = await API.getProductById(productId);
        if (productInfo.success && productInfo.product) {
          const product = productInfo.product;
          const newItem: CartItem = {
            id: `local_${Date.now()}`,
            productId,
            productTitle: product.name,
            productImage: product.images?.[0] || null,
            supplier: product.supplier?.companyName || 'Proveedor',
            supplierId: product.supplierId,
            containerType,
            quantity: containerQuantity,
            pricePerContainer: product.pricePerContainer, // Usar el precio real del producto
            currency: product.currency,
            incoterm,
            addedAt: new Date(),
          };
          
          const existingItems = JSON.parse(localStorage.getItem('cart-items') || '[]');
          existingItems.push(newItem);
          localStorage.setItem('cart-items', JSON.stringify(existingItems));
          
          console.log('✅ Local fallback item created with real product data:', newItem);
          return newItem;
        }
      } catch (productError) {
        console.warn('Could not fetch product details for fallback');
      }
      
      // Ultimo fallback si no se puede obtener información del producto
      const newItem: CartItem = {
        id: `local_${Date.now()}`,
        productId,
        productTitle: `Product ${productId}`,
        supplier: 'Local Supplier',
        supplierId: 'local_supplier',
        containerType,
        quantity: containerQuantity,
        pricePerContainer: 25000, // Precio por defecto más realista
        currency: 'USD',
        incoterm,
        addedAt: new Date(),
      };
      
      const existingItems = JSON.parse(localStorage.getItem('cart-items') || '[]');
      existingItems.push(newItem);
      localStorage.setItem('cart-items', JSON.stringify(existingItems));
      
      return newItem;
    }
  },

  async removeFromCart(itemId: string): Promise<boolean> {
    try {
      const response = await API.removeFromCart(itemId);
      return response.success;
    } catch (error) {
      console.warn('Cart API not available, using local fallback');
      const existingItems = JSON.parse(localStorage.getItem('cart-items') || '[]');
      const filteredItems = existingItems.filter((item: CartItem) => item.id !== itemId);
      localStorage.setItem('cart-items', JSON.stringify(filteredItems));
      return true;
    }
  },

  async clearCart(): Promise<boolean> {
    try {
      const response = await API.clearCart();
      return response.success;
    } catch (error) {
      console.warn('Cart API not available, using local fallback');
      localStorage.removeItem('cart-items');
      return true;
    }
  },
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
      
    case "SET_ERROR":
      return { ...state, error: action.payload };
      
    case "SET_ITEMS":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.supplierId === action.payload.supplierId,
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + action.payload.quantity,
          addedAt: new Date(),
        };
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      };

    case "UPDATE_CUSTOM_PRICE":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, customPrice: action.payload.customPrice }
            : item,
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_CART_OPEN":
      return { ...state, isOpen: action.payload };

    case "ADD_QUOTE":
      return { ...state, quotes: [...state.quotes, action.payload] };

    case "UPDATE_QUOTE_STATUS":
      return {
        ...state,
        quotes: state.quotes.map((quote) =>
          quote.id === action.payload.id
            ? {
                ...quote,
                status: action.payload.status,
                supplierResponse: action.payload.response,
                updatedAt: new Date(),
              }
            : quote,
        ),
      };

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (productId: string, containerQuantity: number, containerType?: string, incoterm?: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateCustomPrice: (id: string, customPrice: number) => void;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  sendQuote: (
    quoteData: Omit<Quote, "id" | "items" | "status" | "sentAt">,
  ) => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito al inicializar
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const items = await cartAPI.getCart();
      dispatch({ type: "SET_ITEMS", payload: items });
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Error loading cart' });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addItem = async (productId: string, containerQuantity: number, containerType = '20GP', incoterm = 'CIF') => {
    console.log('🛒 Adding item to cart:', { productId, containerQuantity, containerType, incoterm });
    
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const newItem = await cartAPI.addToCart(productId, containerQuantity, containerType, incoterm);
      
      dispatch({ type: "ADD_ITEM", payload: newItem });
      
      // Reload cart to ensure consistency
      await loadCart();
    } catch (error) {
      console.error('❌ Error adding item to cart:', error);
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Error adding to cart' });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await cartAPI.removeFromCart(id);
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Error removing item' });
      throw error;
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      try {
        // Intentar hacer la llamada al API
        const response = await API.updateCartItem(id, quantity);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update quantity');
        }
        
        console.log('✅ Quantity updated on server:', { id, quantity });
      } catch (apiError) {
        console.warn('⚠️ API not available, updating locally:', apiError);
        // Si el API no está disponible, continuar con actualización local
      }
      
      // Actualizar el estado local (ya sea que el API funcionara o no)
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
      
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Error updating quantity' });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateCustomPrice = (id: string, customPrice: number) => {
    dispatch({ type: "UPDATE_CUSTOM_PRICE", payload: { id, customPrice } });
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Error clearing cart' });
      throw error;
    }
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open });
  };

  const sendQuote = (
    quoteData: Omit<Quote, "id" | "items" | "status" | "sentAt">,
  ) => {
    const quote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      items: [...state.items],
      status: "sent",
      sentAt: new Date(),
    };
    dispatch({ type: "ADD_QUOTE", payload: quote });
    clearCart();
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return state.items.reduce((total, item) => {
      const price = item.customPrice || item.pricePerContainer;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateCustomPrice,
        clearCart,
        toggleCart,
        setCartOpen,
        sendQuote,
        getTotalItems,
        getTotalAmount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
