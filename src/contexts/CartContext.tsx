import React, { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
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
}

type CartAction =
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
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
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
  addItem: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCustomPrice: (id: string, customPrice: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  sendQuote: (
    quoteData: Omit<Quote, "id" | "items" | "status" | "sentAt">,
  ) => void;
  getTotalItems: () => number;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, "id" | "addedAt">) => {
    const newItem: CartItem = {
      ...item,
      id: `${item.productId}-${item.supplierId}-${Date.now()}`,
      addedAt: new Date(),
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const updateCustomPrice = (id: string, customPrice: number) => {
    dispatch({ type: "UPDATE_CUSTOM_PRICE", payload: { id, customPrice } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
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
