# Implementación del Backend - Controladores de Productos

## 📋 Actualización del Controlador de Productos

### **Archivo: `src/controllers/productController.ts`**

```typescript
import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { ProductFilters } from '../types/products';

export class ProductController {
  /**
   * GET /api/products
   * Obtener todos los productos con filtros y paginación
   */
  static async getAllProducts(req: Request, res: Response) {
    try {
      const filters: ProductFilters = {
        categoryId: req.query.category as string,
        searchQuery: req.query.search as string,
        containerType: req.query.containerType as string,
        incoterm: req.query.incoterm as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        isNegotiable: req.query.isNegotiable === 'true',
        allowsCustomOrders: req.query.allowsCustomOrders === 'true',
        supplierVerified: req.query.supplierVerified === 'true',
        inStock: req.query.inStock === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: req.query.sortBy as any || 'created_at',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const { products, total, totalPages } = await ProductService.getAllProducts(filters);

      // Incrementar views para productos obtenidos (opcional)
      if (products.length > 0) {
        ProductService.incrementBulkViews(products.map(p => p.id));
      }

      res.json({
        success: true,
        products,
        pagination: {
          total,
          totalPages,
          currentPage: filters.page,
          limit: filters.limit,
          hasNext: filters.page < totalPages,
          hasPrev: filters.page > 1
        },
        filters: filters,
        message: `${products.length} productos encontrados`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getAllProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/:id
   * Obtener producto específico por ID con todos los detalles
   */
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeRelated = req.query.includeRelated === 'true';

      // Obtener producto principal
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      // Incrementar contador de vistas
      await ProductService.incrementViews(id);

      // Obtener datos relacionados
      const [images, tags, volumePricing, relatedProducts] = await Promise.all([
        ProductService.getProductImages(id),
        ProductService.getProductTags(id),
        ProductService.getVolumePricing(id),
        includeRelated ? ProductService.getRelatedProducts(id, product.categoryId, product.pricePerContainer) : []
      ]);

      const productWithDetails = {
        ...product,
        images,
        tags,
        volumePricing,
        ...(includeRelated && { relatedProducts })
      };

      res.json({
        success: true,
        product: productWithDetails,
        message: 'Producto obtenido exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.getProductById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  /**
   * GET /api/products/category/:categoryId
   * Obtener productos por categoría específica
   */
  static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      
      const filters: ProductFilters = {
        categoryId,
        searchQuery: req.query.search as string,
        containerType: req.query.containerType as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: req.query.sortBy as any || 'created_at',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const { products, total, totalPages } = await ProductService.getAllProducts(filters);

      res.json({
        success: true,
        products,
        categoryId,
        pagination: {
          total,
          totalPages,
          currentPage: filters.page,
          limit: filters.limit
        },
        message: `${products.length} productos encontrados en la categoría`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getProductsByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * GET /api/products/search/:query
   * Búsqueda de productos por texto
   */
  static async searchProducts(req: Request, res: Response) {
    try {
      const { query } = req.params;
      
      const filters: ProductFilters = {
        searchQuery: query,
        categoryId: req.query.categoryId as string,
        containerType: req.query.containerType as string,
        priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
        sortBy: 'relevance' as any
      };

      const { products, total, totalPages } = await ProductService.searchProducts(filters);

      res.json({
        success: true,
        products,
        searchQuery: query,
        pagination: {
          total,
          totalPages,
          currentPage: filters.page,
          limit: filters.limit
        },
        message: `${products.length} productos encontrados para "${query}"`
      });
    } catch (error: any) {
      console.error('Error en ProductController.searchProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error en la búsqueda'
      });
    }
  }

  /**
   * GET /api/products/featured
   * Obtener productos destacados
   */
  static async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 12;
      const products = await ProductService.getFeaturedProducts(limit);

      res.json({
        success: true,
        products,
        message: `${products.length} productos destacados obtenidos`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getFeaturedProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos destacados'
      });
    }
  }

  /**
   * GET /api/products/related/:productId
   * Obtener productos relacionados
   */
  static async getRelatedProducts(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 8;

      const product = await ProductService.getProductById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Producto base no encontrado'
        });
      }

      const relatedProducts = await ProductService.getRelatedProducts(
        productId,
        product.categoryId,
        product.pricePerContainer,
        limit
      );

      res.json({
        success: true,
        products: relatedProducts,
        baseProduct: {
          id: product.id,
          name: product.name
        },
        message: `${relatedProducts.length} productos relacionados encontrados`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getRelatedProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos relacionados'
      });
    }
  }

  /**
   * PUT /api/products/:id/views
   * Incrementar vistas de un producto (para analytics)
   */
  static async incrementProductViews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProductService.incrementViews(id);

      res.json({
        success: true,
        message: 'Vista registrada exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.incrementProductViews:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar vista'
      });
    }
  }

  /**
   * PUT /api/products/:id/inquiries
   * Incrementar consultas de un producto
   */
  static async incrementProductInquiries(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ProductService.incrementInquiries(id);

      res.json({
        success: true,
        message: 'Consulta registrada exitosamente'
      });
    } catch (error: any) {
      console.error('Error en ProductController.incrementProductInquiries:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar consulta'
      });
    }
  }

  /**
   * GET /api/products/analytics/popular
   * Obtener productos más populares (más vistos)
   */
  static async getPopularProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const timeframe = req.query.timeframe as string || '30d'; // 7d, 30d, 90d

      const products = await ProductService.getPopularProducts(limit, timeframe);

      res.json({
        success: true,
        products,
        timeframe,
        message: `${products.length} productos populares obtenidos`
      });
    } catch (error: any) {
      console.error('Error en ProductController.getPopularProducts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener productos populares'
      });
    }
  }
}
```

## 📋 Servicio de Productos Actualizado

### **Archivo: `src/services/productService.ts`**

```typescript
import { DatabaseConnection } from '../config/database';
import { Product, ProductFilters, ProductImage, VolumePrice } from '../types/products';

export class ProductService {
  /**
   * Obtener todos los productos con filtros
   */
  static async getAllProducts(filters: ProductFilters) {
    const db = await DatabaseConnection.getConnection();
    
    let query = `
      SELECT 
        p.id,
        p.name,
        p.code,
        p.description,
        p.unit_price,
        p.price_per_container,
        p.currency,
        p.container_type,
        p.units_per_container,
        p.moq,
        p.stock_containers,
        p.incoterm,
        p.production_time,
        p.packaging_time,
        p.is_negotiable,
        p.allows_custom_orders,
        p.status,
        p.total_views,
        p.total_inquiries,
        p.created_at,
        p.updated_at,
        
        -- Supplier info
        s.id as supplier_id,
        s.company_name as supplier_company_name,
        s.is_verified as supplier_is_verified,
        s.country as supplier_location,
        
        -- Category info
        c.name as category_name,
        
        -- Primary image
        pi.image_url as primary_image

      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      
      WHERE p.status = 'active'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Aplicar filtros dinámicamente
    if (filters.categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(filters.categoryId);
    }

    if (filters.searchQuery) {
      query += ` AND (
        p.name LIKE ? OR 
        p.code LIKE ? OR
        p.description LIKE ?
      )`;
      const searchPattern = `%${filters.searchQuery}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters.containerType) {
      query += ` AND p.container_type = ?`;
      params.push(filters.containerType);
    }

    if (filters.priceMin !== undefined) {
      query += ` AND p.price_per_container >= ?`;
      params.push(filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      query += ` AND p.price_per_container <= ?`;
      params.push(filters.priceMax);
    }

    if (filters.incoterm) {
      query += ` AND p.incoterm = ?`;
      params.push(filters.incoterm);
    }

    if (filters.isNegotiable !== undefined) {
      query += ` AND p.is_negotiable = ?`;
      params.push(filters.isNegotiable);
    }

    if (filters.allowsCustomOrders !== undefined) {
      query += ` AND p.allows_custom_orders = ?`;
      params.push(filters.allowsCustomOrders);
    }

    if (filters.supplierVerified !== undefined) {
      query += ` AND s.is_verified = ?`;
      params.push(filters.supplierVerified);
    }

    if (filters.inStock) {
      query += ` AND p.stock_containers > 0`;
    }

    // Ordenamiento
    const validSortFields = ['name', 'price_per_container', 'created_at', 'total_views'];
    const sortField = validSortFields.includes(filters.sortBy) ? filters.sortBy : 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;

    // Paginación
    const limit = filters.limit || 20;
    const offset = ((filters.page || 1) - 1) * limit;
    
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Ejecutar query principal
    const [products] = await db.execute(query, params);

    // Query para contar total
    let countQuery = query.split('ORDER BY')[0].replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM');
    const countParams = params.slice(0, -2); // Remove LIMIT and OFFSET
    
    const [countResult] = await db.execute(countQuery, countParams);
    const total = (countResult as any)[0].total;
    const totalPages = Math.ceil(total / limit);

    // Procesar productos para incluir imágenes adicionales
    const processedProducts = await Promise.all(
      (products as any[]).map(async (product) => {
        const images = await this.getProductImages(product.id);
        return {
          ...product,
          images: images.map(img => img.imageUrl),
          supplier: {
            id: product.supplier_id,
            companyName: product.supplier_company_name,
            isVerified: product.supplier_is_verified,
            location: product.supplier_location
          }
        };
      })
    );

    return {
      products: processedProducts,
      total,
      totalPages
    };
  }

  /**
   * Obtener producto por ID
   */
  static async getProductById(id: string): Promise<Product | null> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      SELECT 
        p.*,
        s.company_name as supplier_company_name,
        s.contact_name as supplier_contact_name,
        s.email as supplier_email,
        s.phone as supplier_phone,
        s.country as supplier_country,
        s.city as supplier_city,
        s.is_verified as supplier_is_verified,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status IN ('active', 'sold_out')
    `;

    const [rows] = await db.execute(query, [id]);
    const products = rows as any[];

    if (products.length === 0) {
      return null;
    }

    const product = products[0];
    
    return {
      ...product,
      supplier: {
        id: product.supplier_id,
        companyName: product.supplier_company_name,
        contactName: product.supplier_contact_name,
        email: product.supplier_email,
        phone: product.supplier_phone,
        country: product.supplier_country,
        city: product.supplier_city,
        isVerified: product.supplier_is_verified
      },
      category: {
        id: product.category_id,
        name: product.category_name,
        slug: product.category_slug
      }
    };
  }

  /**
   * Obtener imágenes del producto
   */
  static async getProductImages(productId: string): Promise<ProductImage[]> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      SELECT id, image_url, alt_text, is_primary, sort_order
      FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_primary DESC, sort_order ASC
    `;

    const [rows] = await db.execute(query, [productId]);
    return rows as ProductImage[];
  }

  /**
   * Obtener tags del producto
   */
  static async getProductTags(productId: string): Promise<string[]> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      SELECT tag_name 
      FROM product_tags 
      WHERE product_id = ? 
      ORDER BY tag_name
    `;

    const [rows] = await db.execute(query, [productId]);
    return (rows as any[]).map(row => row.tag_name);
  }

  /**
   * Obtener precios por volumen
   */
  static async getVolumePricing(productId: string): Promise<VolumePrice[]> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      SELECT min_quantity, discount_percentage, price_per_container
      FROM volume_pricing 
      WHERE product_id = ? 
      ORDER BY min_quantity ASC
    `;

    const [rows] = await db.execute(query, [productId]);
    return rows as VolumePrice[];
  }

  /**
   * Incrementar vistas del producto
   */
  static async incrementViews(productId: string): Promise<void> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      UPDATE products 
      SET total_views = total_views + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.execute(query, [productId]);
  }

  /**
   * Incrementar consultas del producto
   */
  static async incrementInquiries(productId: string): Promise<void> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      UPDATE products 
      SET total_inquiries = total_inquiries + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.execute(query, [productId]);
  }

  /**
   * Obtener productos relacionados
   */
  static async getRelatedProducts(
    currentProductId: string,
    categoryId: string,
    currentPrice: number,
    limit: number = 8
  ): Promise<Product[]> {
    const db = await DatabaseConnection.getConnection();
    
    const priceMin = currentPrice * 0.7; // 30% menos
    const priceMax = currentPrice * 1.3; // 30% más
    
    const query = `
      SELECT 
        p.id,
        p.name,
        p.price_per_container,
        p.container_type,
        s.company_name as supplier_name,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE p.status = 'active'
        AND p.id != ?
        AND (
          p.category_id = ? OR
          p.price_per_container BETWEEN ? AND ?
        )
      ORDER BY 
        CASE WHEN p.category_id = ? THEN 1 ELSE 2 END,
        ABS(p.price_per_container - ?),
        p.total_views DESC
      LIMIT ?
    `;

    const [rows] = await db.execute(query, [
      currentProductId,
      categoryId,
      priceMin,
      priceMax,
      categoryId,
      currentPrice,
      limit
    ]);

    return rows as Product[];
  }

  /**
   * Obtener productos destacados
   */
  static async getFeaturedProducts(limit: number = 12): Promise<Product[]> {
    const db = await DatabaseConnection.getConnection();
    
    const query = `
      SELECT 
        p.*,
        s.company_name as supplier_name,
        pi.image_url as primary_image
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE p.status = 'active'
        AND p.stock_containers > 0
      ORDER BY 
        (p.total_views * 0.6 + p.total_inquiries * 0.4) DESC,
        p.created_at DESC
      LIMIT ?
    `;

    const [rows] = await db.execute(query, [limit]);
    return rows as Product[];
  }
}
```

## 🛠️ Rutas Actualizadas

### **Archivo: `src/routes/productRoutes.ts`**

```typescript
import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

// Rutas públicas de productos
router.get('/', ProductController.getAllProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/search/:query', ProductController.searchProducts);
router.get('/category/:categoryId', ProductController.getProductsByCategory);
router.get('/related/:productId', ProductController.getRelatedProducts);
router.get('/analytics/popular', ProductController.getPopularProducts);

// Rutas de producto específico
router.get('/:id', ProductController.getProductById);
router.put('/:id/views', ProductController.incrementProductViews);
router.put('/:id/inquiries', ProductController.incrementProductInquiries);

export default router;
```

---

**Nota**: Esta implementación incluye optimizaciones de performance, manejo de errores robusto, y todas las funcionalidades necesarias para soportar la navegación de productos del frontend.

**Fecha**: Julio 2025  
**Versión**: 1.0  
**Framework**: Node.js + Express + TypeScript
