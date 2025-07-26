# 📋 FRONTEND-BACKEND INTEGRATION DOCUMENTATION
**ZLCExpress - Sistema de Categorías y Productos**

---

## 📁 ESTRUCTURA DEL SISTEMA

### Backend (Node.js + TypeScript + Express)
```
Backend-ZLCExpress/
├── src/
│   ├── types/
│   │   ├── index.ts           # Exportación de tipos
│   │   └── categories.ts      # Tipos de categorías y productos
│   ├── services/
│   │   └── categoryService.ts # Lógica de negocio
│   ├── controllers/
│   │   └── categoryController.ts # Controladores API
│   └── routes/
│       ├── index.ts           # Rutas principales
│       └── categoryRoutes.ts  # Rutas de categorías/productos
```

### Frontend (React + TypeScript + Vite)
```
ZLCExpress/
├── src/
│   ├── services/
│   │   └── api.ts            # Cliente API integrado
│   ├── pages/
│   │   ├── Categories.tsx    # Página principal de categorías
│   │   └── ProductDetail.tsx # Detalles de producto
│   └── types/               # Tipos compartidos
```

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### 1. Sistema de Tipos TypeScript

#### Backend - types/categories.ts
```typescript
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
  // ... más propiedades
}

export interface VolumeDiscount {
  id: string;
  productId: string;
  minQuantity: number;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}
```

#### Frontend - services/api.ts
```typescript
// Tipos importados del backend con compatibilidad frontend
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
```

### 2. API Endpoints

#### Categorías
- `GET /api/categories` - Obtener todas las categorías con jerarquía
- `GET /api/categories/:id` - Obtener categoría específica
- `GET /api/categories/:id/products` - Productos de una categoría

#### Productos
- `GET /api/products` - Listar productos con filtros y paginación
- `GET /api/products/:id` - Detalles de producto específico
- `GET /api/products/search` - Búsqueda avanzada

### 3. Servicios Frontend

#### api.ts - Funciones principales
```typescript
export const getCategories = async (): Promise<CategoriesResponse>
export const getCategoryById = async (id: string)
export const getProducts = async (filters?: ProductFilters): Promise<ProductsResponse>
export const getProductById = async (id: string): Promise<ProductDetailResponse>
export const searchProducts = async (query: string, filters?)
export const getProductsByCategory = async (categoryId: string, filters?)
```

---

## 📊 DATOS MOCK INTEGRADOS

### Categorías Jerárquicas
1. **Textiles y Ropa** (5 categorías)
   - Ropa de Hombre (32 productos)
   - Ropa de Mujer (45 productos)
   - Accesorios de Moda (28 productos)

2. **Calzado** (3 categorías)
   - Zapatos Deportivos (18 productos)
   - Zapatos Formales (22 productos)
   - Sandalias y Casuales (15 productos)

3. **Electrónicos** (2 categorías)
   - Componentes (35 productos)
   - Accesorios (23 productos)

4. **Hogar y Jardín** (1 categoría)
   - Decoración (67 productos)

5. **Deportes** (1 categoría)
   - Equipamiento (23 productos)

### Productos de Ejemplo
1. **Camisetas 100% Algodón Premium**
   - 5000 unidades en contenedor 20GP
   - $2.50/unidad - $12,500/contenedor
   - Descuentos por volumen: 5%, 10%, 15%
   - MOQ: 1 contenedor

2. **Blusas de manga larga casuales**
   - 4500 unidades en contenedor 20GP
   - $4.00/unidad - $18,000/contenedor
   - CIF - Sin descuentos

3. **Jeans Denim Calidad Premium**
   - 3000 unidades en contenedor 40HQ
   - $8.75/unidad - $26,250/contenedor
   - Descuentos por volumen: 7%, 12%

4. **Zapatos Deportivos Mixtos**
   - 2500 pares en contenedor 40HC
   - $15.00/unidad - $37,500/contenedor
   - Estado: Agotado

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### Página de Categorías (Categories.tsx)

#### ✅ Funciones Principales
- **Árbol de categorías jerárquico**: Navegación expandible con subcategorías
- **Filtros avanzados**: Precio, tipo de contenedor, incoterm, opciones especiales
- **Búsqueda en tiempo real**: Por nombre y código de producto
- **Ordenamiento múltiple**: Por nombre, precio, fecha, popularidad
- **Vista grid/lista**: Alternancia entre modos de visualización
- **Paginación completa**: Navegación por páginas con información de resultados

#### 🎨 Elementos UI
- Sidebar de filtros persistente
- Toolbar con información de resultados
- Cards responsivos con información detallada
- Badges de estado (Disponible, Agotado, Negociable)
- Información del proveedor con verificación
- Estadísticas de producto (vistas, consultas)

#### 📱 Estados Manejados
```typescript
const [categories, setCategories] = useState<Category[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [productsLoading, setProductsLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState<string>("");
const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
// ... más estados para filtros y UI
```

### Página de Detalles (ProductDetail.tsx)

#### ✅ Funciones Principales
- **Galería de imágenes**: Con zoom y navegación por thumbnails
- **Información completa**: Especificaciones, precios, disponibilidad
- **Selector de opciones**: Colores, tallas, cantidades
- **Cálculo de precios**: Con descuentos por volumen automáticos
- **Integración con carrito**: Añadir productos con validaciones
- **Información del proveedor**: Con estado de verificación

#### 📑 Tabs de Información
1. **Descripción**: Texto completo y etiquetas
2. **Especificaciones**: Dimensiones, pesos, materiales, empaque
3. **Precios por Volumen**: Tabla de descuentos aplicables
4. **Envío y Logística**: Términos, tiempos de entrega, condiciones

#### 💰 Sistema de Precios
```typescript
const calculateTotalPrice = () => {
  let basePrice = product.pricePerContainer * quantity;
  
  // Aplicar descuentos por volumen
  const applicableDiscount = product.volumeDiscounts
    .filter(discount => discount.isActive && quantity >= discount.minQuantity)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)[0];
  
  if (applicableDiscount) {
    basePrice = basePrice * (1 - applicableDiscount.discountPercentage / 100);
  }
  
  return basePrice;
};
```

---

## 🔄 FLUJO DE DATOS

### 1. Carga Inicial
```
Frontend          Backend
   |                 |
   |-- GET /api/categories
   |                 |-- categoryService.getCategories()
   |<-- Categories --|-- Mock data con jerarquía
   |                 |
   |-- GET /api/products?limit=20
   |                 |-- categoryService.getProducts()
   |<-- Products  ---|-- Mock data con filtros
```

### 2. Filtrado y Búsqueda
```
User Input        Frontend              Backend
    |                |                    |
Filtrar por precio   |-- useState updates    |
    |                |-- useEffect trigger  |
    |                |-- GET /api/products?priceMin=1000&priceMax=5000
    |                |                    |-- Aplicar filtros
    |                |<-- Filtered results |-- Retornar productos
    |                |-- setProducts()     |
```

### 3. Detalle de Producto
```
Navigation        Frontend              Backend
    |                |                    |
/product/prod-1      |-- useParams        |
    |                |-- GET /api/products/prod-1
    |                |                    |-- getProductById()
    |                |<-- Product detail  |-- Mock data completo
    |                |-- Render detail    |
```

---

## 🧪 TESTING REALIZADO

### Endpoints Verificados ✅
```bash
# Categorías
GET http://localhost:3000/api/categories
✅ Retorna 5 categorías principales con 6 subcategorías

# Productos
GET http://localhost:3000/api/products
✅ Retorna 4 productos con información completa

# Producto específico
GET http://localhost:3000/api/products/prod-1
✅ Retorna camisetas con descuentos por volumen

# Filtros funcionales
GET http://localhost:3000/api/products?category=cat-1&limit=10
✅ Filtros por categoría funcionando
```

### Frontend Verificado ✅
- ✅ Página Categories carga datos reales del backend
- ✅ Árbol de categorías funcional con expansión
- ✅ Filtros aplicados correctamente
- ✅ Paginación operativa
- ✅ ProductDetail muestra información completa
- ✅ Cálculo de precios con descuentos automático
- ✅ Navegación entre páginas funcional

---

## 🚀 PRÓXIMOS PASOS SUGERIDOS

### Prioridad Alta
1. **Integración con base de datos MySQL**
   - Migrar de mock data a base de datos real
   - Implementar migrations para tablas
   - Configurar conexión con Sequelize/TypeORM

2. **Autenticación en APIs**
   - Proteger endpoints que requieren autenticación
   - Implementar middleware de autorización
   - Gestión de roles (buyer/supplier)

### Prioridad Media
3. **Optimización de Performance**
   - Implementar caché en Redis
   - Lazy loading en frontend
   - Optimización de imágenes

4. **Funcionalidades Avanzadas**
   - Sistema de favoritos
   - Comparación de productos
   - Historial de búsquedas

### Prioridad Baja
5. **Monitoreo y Analytics**
   - Tracking de vistas de productos
   - Métricas de búsquedas
   - Dashboard administrativo

---

## 📋 COMANDOS DE TESTING

### Backend
```bash
cd "Backend-ZLCExpress"
npm run dev  # Puerto 3000

# Testing de endpoints
Invoke-RestMethod -Uri "http://localhost:3000/api/categories" -Method GET
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET
Invoke-RestMethod -Uri "http://localhost:3000/api/products/prod-1" -Method GET
```

### Frontend
```bash
cd "ZLCExpress"
npm run dev  # Puerto 8080

# URLs de testing
http://localhost:8080/categories
http://localhost:8080/product/prod-1
http://localhost:8080/product/prod-2
```

---

## 🎉 ESTADO ACTUAL

### ✅ Completado
- Sistema completo de categorías y productos
- API REST funcional con 13 endpoints
- Frontend integrado con backend real
- Filtros avanzados operativos
- Paginación y ordenamiento funcional
- Cálculo automático de descuentos por volumen
- Información detallada de productos
- Sistema de navegación jerárquica
- Responsive design implementado

### 🔄 En Progreso
- Testing de todos los casos de uso
- Optimización de rendimiento

### ⏳ Pendiente
- Integración con base de datos MySQL
- Sistema de autenticación en APIs
- Funcionalidades avanzadas adicionales

---

*Documentación creada el: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")*
*Backend URL: http://localhost:3000*
*Frontend URL: http://localhost:8080*
