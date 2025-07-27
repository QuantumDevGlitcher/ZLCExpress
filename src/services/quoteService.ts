// services/quoteService.ts
// Servicio para gestionar cotizaciones conectado con RFQ backend

import * as API from './api';

export interface QuoteItem {
  id: string;
  productTitle: string;
  productId: string;
  supplier: string;
  supplierId: string;
  quantity: number;
  pricePerContainer: number;
  currency: string;
  containerType: string;
  incoterm: string;
}

export interface FreightDetails {
  origin: string;
  destination: string;
  carrier: string;
  cost: number;
  currency: string;
  transitTime: number;
  incoterm: string;
  estimatedDate: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  items: QuoteItem[];
  totalAmount: number;
  freightDetails?: FreightDetails;
  freightCost?: number;
  platformCommission: number;
  grandTotal: number;
  paymentConditions: string;
  specialRequirements?: string;
  status: 'pending' | 'sent' | 'quoted' | 'accepted' | 'counter-offer' | 'rejected' | 'expired';
  requestDate: string;
  responseDeadline?: string;
  sentAt: string;
  updatedAt?: string;
  supplierResponse?: string;
  rfqIds: string[]; // IDs de las RFQs creadas en el backend
}

export interface QuoteStats {
  total: number;
  pending: number;
  quoted: number;
  accepted: number;
  rejected: number;
}

export class QuoteService {
  
  /**
   * Obtener todas las cotizaciones del usuario desde el backend (RFQs)
   */
  static async getUserQuotes(filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Quote[]> {
    try {
      console.log('🔍 QuoteService: Obteniendo cotizaciones del usuario con filtros:', filters);
      
      // Obtener RFQs del backend
      const rfqResponse = await API.getUserRFQs(filters);
      console.log('📡 QuoteService: Respuesta de API.getUserRFQs:', rfqResponse);
      
      if (!rfqResponse.success || !rfqResponse.data) {
        console.warn('⚠️ QuoteService: No se pudieron obtener RFQs del backend:', rfqResponse);
        return [];
      }

      console.log('📋 QuoteService: RFQs obtenidas:', rfqResponse.data.length, rfqResponse.data);

      // Convertir RFQs a formato Quote
      const quotes = rfqResponse.data.map(rfq => {
        console.log('🔄 QuoteService: Convirtiendo RFQ a Quote:', rfq);
        const quote = this.convertRFQToQuote(rfq);
        console.log('✅ QuoteService: Quote convertida:', quote);
        return quote;
      });
      
      console.log('📦 QuoteService: Cotizaciones finales:', quotes);
      return quotes;
    } catch (error) {
      console.error('Error obteniendo cotizaciones:', error);
      return [];
    }
  }

  /**
   * Obtener cotización específica por ID
   */
  static async getQuoteById(quoteId: string): Promise<Quote | null> {
    try {
      console.log('🔍 Obteniendo cotización por ID:', quoteId);
      
      const rfqResponse = await API.getRFQById(quoteId);
      
      if (!rfqResponse.success || !rfqResponse.data) {
        console.warn('No se pudo obtener la RFQ del backend');
        return null;
      }

      return this.convertRFQToQuote(rfqResponse.data);
    } catch (error) {
      console.error('Error obteniendo cotización por ID:', error);
      return null;
    }
  }

  /**
   * Obtener estadísticas de cotizaciones
   */
  static async getQuoteStats(): Promise<QuoteStats> {
    try {
      const quotes = await this.getUserQuotes();
      
      return {
        total: quotes.length,
        pending: quotes.filter(q => q.status === 'pending' || q.status === 'sent').length,
        quoted: quotes.filter(q => q.status === 'quoted').length,
        accepted: quotes.filter(q => q.status === 'accepted').length,
        rejected: quotes.filter(q => q.status === 'rejected').length,
      };
    } catch (error) {
      console.error('Error calculando estadísticas:', error);
      return {
        total: 0,
        pending: 0,
        quoted: 0,
        accepted: 0,
        rejected: 0,
      };
    }
  }

  /**
   * Convertir RFQ del backend a formato Quote del frontend
   */
  private static convertRFQToQuote(rfq: API.RFQRequest): Quote {
    // Crear items de la cotización basados en los datos de la RFQ
    const items: QuoteItem[] = [{
      id: `item-${rfq.id}`,
      productTitle: rfq.productName || 'Producto',
      productId: rfq.productId,
      supplier: rfq.supplierName || 'Proveedor',
      supplierId: rfq.supplierId || '',
      quantity: rfq.containerQuantity,
      pricePerContainer: (rfq.estimatedValue || 0) / rfq.containerQuantity,
      currency: rfq.currency || 'USD',
      containerType: rfq.containerType,
      incoterm: rfq.incoterm,
    }];

    // Convertir información de flete si existe
    let freightDetails: FreightDetails | undefined;
    let freightCost = 0;

    if (rfq.freightQuote) {
      freightDetails = {
        origin: rfq.freightQuote.origin,
        destination: rfq.freightQuote.destination,
        carrier: rfq.freightQuote.selectedCarrier?.name || 'Carrier',
        cost: rfq.freightQuote.cost,
        currency: rfq.freightQuote.currency,
        transitTime: rfq.freightQuote.selectedCarrier?.transitTime || 0,
        incoterm: rfq.freightQuote.selectedCarrier?.incoterm || rfq.incoterm,
        estimatedDate: rfq.freightQuote.estimatedDate,
      };
      freightCost = rfq.freightQuote.cost;
    }

    const totalAmount = rfq.estimatedValue || 0;
    const platformCommission = 250; // Comisión fija de la plataforma
    const grandTotal = totalAmount + freightCost + platformCommission;

    return {
      id: rfq.id || `quote-${Date.now()}`,
      quoteNumber: rfq.rfqNumber || `Q-${rfq.id?.slice(-6)}`,
      items,
      totalAmount,
      freightDetails,
      freightCost,
      platformCommission,
      grandTotal,
      paymentConditions: this.extractPaymentConditions(rfq.specialRequirements),
      specialRequirements: rfq.logisticsComments,
      status: this.mapRFQStatusToQuoteStatus(rfq.status || 'pending'),
      requestDate: rfq.requestDate || rfq.createdAt || new Date().toISOString(),
      responseDeadline: rfq.responseDeadline,
      sentAt: rfq.createdAt || new Date().toISOString(),
      updatedAt: rfq.updatedAt,
      supplierResponse: undefined, // Se llenarían con las respuestas del proveedor
      rfqIds: [rfq.id || ''],
    };
  }

  /**
   * Mapear estado de RFQ a estado de Quote
   */
  private static mapRFQStatusToQuoteStatus(rfqStatus: string): Quote['status'] {
    switch (rfqStatus) {
      case 'pending':
        return 'sent';
      case 'quoted':
        return 'quoted';
      case 'accepted':
        return 'accepted';
      case 'rejected':
        return 'rejected';
      case 'expired':
        return 'expired';
      default:
        return 'pending';
    }
  }

  /**
   * Extraer condiciones de pago de los requerimientos especiales
   */
  private static extractPaymentConditions(specialRequirements?: string): string {
    if (!specialRequirements) return 'Por definir';
    
    const match = specialRequirements.match(/Condiciones de pago: ([^.]+)/);
    return match ? match[1].trim() : 'Por definir';
  }

  /**
   * Formatear fecha para mostrar
   */
  static formatDate(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /**
   * Formatear moneda
   */
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
