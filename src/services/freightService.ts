import * as API from './api';

export interface FreightCalculationRequest {
  origin: string;
  destination: string;
  containerType: string;
  containerQuantity: number;
  estimatedDate: string;
  specialRequirements?: string;
  incoterm: string;
  userId?: string;
  cartId?: string;
}

export interface FreightQuoteResponse {
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
  userId?: string;
  cartId?: string;
  rfqId?: string;
  status: 'draft' | 'calculated' | 'confirmed' | 'expired';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export class FreightService {
  
  /**
   * Calcular cotización de flete
   */
  static async calculateFreight(request: FreightCalculationRequest): Promise<{
    success: boolean;
    data?: FreightQuoteResponse;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/freight/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error calculating freight');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error calculating freight:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al calcular cotización de flete'
      };
    }
  }

  /**
   * Obtener cotización de flete por ID
   */
  static async getFreightQuoteById(freightId: string): Promise<{
    success: boolean;
    data?: FreightQuoteResponse;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/freight/${freightId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Freight quote not found');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error getting freight quote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al obtener cotización de flete'
      };
    }
  }

  /**
   * Obtener cotizaciones de flete por usuario
   */
  static async getFreightQuotesByUser(userId: string): Promise<{
    success: boolean;
    data?: FreightQuoteResponse[];
    total?: number;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/freight/user/${userId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error getting user freight quotes');
      }

      return {
        success: true,
        data: result.data,
        total: result.total,
        message: result.message
      };
    } catch (error) {
      console.error('Error getting user freight quotes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al obtener cotizaciones del usuario'
      };
    }
  }

  /**
   * Confirmar cotización de flete
   */
  static async confirmFreightQuote(freightId: string, rfqId: string): Promise<{
    success: boolean;
    data?: FreightQuoteResponse;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/freight/${freightId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfqId }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error confirming freight quote');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error confirming freight quote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al confirmar cotización de flete'
      };
    }
  }

  /**
   * Actualizar estado de cotización de flete
   */
  static async updateFreightQuoteStatus(
    freightId: string, 
    status: 'draft' | 'calculated' | 'confirmed' | 'expired'
  ): Promise<{
    success: boolean;
    data?: FreightQuoteResponse;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/freight/${freightId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error updating freight status');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('Error updating freight status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Error al actualizar estado del flete'
      };
    }
  }

  /**
   * Convertir FreightQuoteResponse a FreightQuote (del contexto)
   */
  static convertToContextFreightQuote(response: FreightQuoteResponse): import('@/contexts/CartContext').FreightQuote {
    return {
      id: response.id,
      origin: response.origin,
      destination: response.destination,
      containerType: response.containerType,
      estimatedDate: response.estimatedDate,
      specialRequirements: response.specialRequirements,
      selectedCarrier: response.selectedCarrier,
      cost: response.cost,
      currency: response.currency,
      createdAt: new Date(response.createdAt)
    };
  }

  /**
   * Calcular y guardar flete desde shipping request
   */
  static async calculateAndSaveFreight(
    shippingData: any,
    selectedCarrier: any,
    setFreightQuote: (quote: import('@/contexts/CartContext').FreightQuote | null) => void
  ): Promise<boolean> {
    try {
      const freightRequest: FreightCalculationRequest = {
        origin: shippingData.originPort,
        destination: shippingData.destinationPort,
        containerType: shippingData.containerType,
        containerQuantity: shippingData.containerQuantity || 1,
        estimatedDate: shippingData.estimatedDate,
        specialRequirements: shippingData.specialRequirements,
        incoterm: shippingData.incoterm || 'CIF',
        userId: 'current_user', // TODO: Obtener del contexto de autenticación
        cartId: 'current_cart' // TODO: Obtener del contexto del carrito
      };

      const response = await this.calculateFreight(freightRequest);
      
      if (response.success && response.data) {
        // Actualizar con el carrier seleccionado
        const updatedQuote = {
          ...response.data,
          selectedCarrier: {
            name: selectedCarrier.name,
            cost: selectedCarrier.cost,
            currency: selectedCarrier.currency,
            transitTime: selectedCarrier.transitTime,
            incoterm: selectedCarrier.incoterm,
            conditions: selectedCarrier.conditions,
            availability: selectedCarrier.availability
          },
          cost: selectedCarrier.cost * freightRequest.containerQuantity
        };

        // Convertir a formato del contexto y guardar
        const contextQuote = this.convertToContextFreightQuote(updatedQuote);
        setFreightQuote(contextQuote);
        
        console.log('✅ Freight quote calculated and saved:', contextQuote);
        return true;
      } else {
        console.error('❌ Failed to calculate freight:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Error in calculateAndSaveFreight:', error);
      return false;
    }
  }
}
