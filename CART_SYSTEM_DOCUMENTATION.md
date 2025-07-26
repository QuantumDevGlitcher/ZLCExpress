# Sistema de Carrito - ZLCExpress

## Descripción General
Sistema completo de carrito de compras B2B con funcionalidades avanzadas para la plataforma ZLCExpress. Permite a los usuarios gestionar productos para exportación con soporte para cotizaciones personalizadas, diferentes tipos de contenedores e incoterms.

## Arquitectura

### Backend
- **Express.js + TypeScript**: API RESTful con manejo de errores centralizado
- **Simulación de Base de Datos**: ProductService con datos mock para desarrollo
- **Controladores Modulares**: CartController y ProductController separados

### Frontend
- **React + TypeScript**: Componentes reactivos con Context API
- **Gestión de Estado**: CartContext con useReducer para manejo complejo de estado
- **Fallback Local**: LocalStorage como respaldo cuando la API no esté disponible

## Estructura de Datos

### CartItem Interface
```typescript
interface CartItem {
  id: string;                    // ID único del item en el carrito
  productId: string;             // ID del producto (formato: "prod-1", "prod-2", etc.)
  productTitle: string;          // Nombre del producto
  productImage?: string;         // URL de imagen del producto
  supplier: string;              // Nombre del proveedor
  supplierId: string;           // ID del proveedor
  containerType: string;         // Tipo de contenedor (20ft, 40ft, 40ft HC)
  quantity: number;              // Cantidad de contenedores
  pricePerContainer: number;     // Precio por contenedor
  currency: string;              // Moneda (USD, EUR, etc.)
  incoterm: string;              // Término comercial (FOB, CIF, EXW, etc.)
  customPrice?: number;          // Precio personalizado negociado
  notes?: string;                // Notas adicionales
  addedAt: Date;                 // Fecha de adición al carrito
}
```

## API Endpoints

### GET /api/cart
- **Descripción**: Obtiene todos los items del carrito del usuario
- **Respuesta**: Array de CartItem
- **Autenticación**: Requerida (userId en headers)

### POST /api/cart/add
- **Descripción**: Agrega un producto al carrito
- **Body**:
  ```json
  {
    "productId": "prod-1",
    "containerQuantity": 2,
    "containerType": "40ft",
    "incoterm": "FOB"
  }
  ```
- **Respuesta**: CartItem creado

### DELETE /api/cart/:itemId
- **Descripción**: Elimina un item específico del carrito
- **Parámetros**: itemId (string)
- **Respuesta**: Confirmación de eliminación

### PUT /api/cart/:itemId
- **Descripción**: Actualiza la cantidad de un item
- **Body**: `{ "quantity": number }`
- **Respuesta**: CartItem actualizado

### DELETE /api/cart
- **Descripción**: Vacía completamente el carrito
- **Respuesta**: Confirmación de vaciado

## Componentes Frontend

### CartProvider
Context provider que envuelve la aplicación y proporciona:
- Estado global del carrito
- Funciones para manipular items
- Manejo de carga y errores
- Persistencia automática

### CartDropdown
Componente desplegable en la navegación que muestra:
- Resumen rápido del carrito
- Últimos productos agregados
- Total de items y precio
- Acceso rápido al checkout

### Funciones Principales
```typescript
// Agregar producto al carrito
addItem(productId: string, containerQuantity: number, containerType: string, incoterm: string)

// Eliminar item del carrito
removeItem(id: string)

// Actualizar cantidad
updateQuantity(id: string, quantity: number)

// Actualizar precio personalizado
updateCustomPrice(id: string, customPrice: number)

// Obtener totales
getTotalItems(): number
getTotalAmount(): number

// Limpiar carrito
clearCart()
```

## Características Técnicas

### Gestión de Estado
- **useReducer**: Para manejo complejo de estado del carrito
- **Acciones**: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, SET_LOADING, SET_ERROR, etc.
- **Estado Inmutable**: Todas las actualizaciones preservan inmutabilidad

### Persistencia
- **API Primera**: Todas las operaciones van primero a la API
- **Fallback Local**: LocalStorage como respaldo
- **Sincronización**: Carga automática al inicializar la aplicación

### Manejo de Errores
- **Try-Catch**: En todas las operaciones async
- **Estados de Error**: Feedback visual para el usuario
- **Fallback Graceful**: Continúa funcionando aunque la API falle

### Compatibilidad de Tipos
- **IDs String**: Productos usan IDs formato string ("prod-1", "prod-2")
- **Consistencia de IDs**: Backend alineado con formato de guiones para coherencia
- **Validación**: Verificación de tipos en ambos extremos

## Flujo de Operaciones

### Agregar Producto
1. Usuario selecciona producto y opciones (contenedor, incoterm)
2. Frontend valida datos y muestra estado de carga
3. API call a `/api/cart/add` con datos del producto
4. Backend busca producto, crea CartItem y lo almacena
5. Frontend actualiza estado local y muestra confirmación
6. CartDropdown se actualiza automáticamente

### Gestión de Carrito
1. CartProvider se inicializa al cargar la app
2. Carga automática del carrito desde API
3. Todas las operaciones van primero a API
4. Estado local se mantiene sincronizado
5. Fallback a LocalStorage si API falla

## Debugging y Logs

### Logs de Desarrollo
- Errores se logean en consola con prefijo ❌
- Warnings para fallbacks con prefijo ⚠️
- Información crítica preservada, logs de debugging removidos

### Herramientas de Debug
- React DevTools para inspeccionar Context
- Network tab para verificar API calls
- LocalStorage inspector para datos de fallback

## Próximas Mejoras

### Funcionalidades Pendientes
- [ ] Persistencia en base de datos real
- [ ] Sistema de usuarios y autenticación
- [ ] Cotizaciones automáticas
- [ ] Integración con proveedores
- [ ] Notificaciones push para cambios de precio
- [ ] Exportación de carrito a PDF/Excel

### Optimizaciones Técnicas
- [ ] Implementar React Query para cache de API
- [ ] Lazy loading de imágenes de productos
- [ ] Virtualization para listas grandes
- [ ] Service Worker para funcionalidad offline
- [ ] Testing unitario e integración

## Solución de Problemas

### Errores Comunes

**400 Bad Request al agregar producto**
- Verificar que productId existe en ProductService
- Confirmar formato de IDs (usar guiones: "prod-1", "prod-2")
- Validar datos requeridos en el body

**"Producto no encontrado" al agregar al carrito**
- ✅ **SOLUCIONADO**: Inconsistencia de IDs entre servicios
- Los IDs ahora usan formato consistente con guiones ("prod-1", "prod-2")
- Verificar que ProductService y CategoryService usan los mismos IDs

**"Cart API not available" con respuesta exitosa**
- ✅ **SOLUCIONADO**: Incompatibilidad de tipos en respuesta del backend
- El endpoint `addToCart` devuelve un `CartItem`, no un `Cart`
- Frontend actualizado para manejar la estructura correcta

**Carrito no se muestra**
- Verificar que CartProvider envuelve la aplicación
- Comprobar que Navigation incluye CartDropdown
- Revisar estados de carga y error en Context

**Items no persisten**
- Verificar conexión a API backend
- Comprobar fallback a LocalStorage
- Validar estructura de datos CartItem

### Debugging Steps
1. Abrir DevTools → Console para ver errores
2. Network tab para verificar API calls
3. Application tab → LocalStorage para datos locales
4. React DevTools para inspeccionar Context state

## Configuración de Desarrollo

### Requisitos
- Node.js 18+
- npm o yarn
- Backend corriendo en puerto 3000
- Frontend corriendo en puerto 5173

### Comandos Útiles
```bash
# Iniciar backend
cd Backend-ZLCExpress
npm run dev

# Iniciar frontend
cd ZLCExpress
npm run dev

# Verificar API del carrito con producto existente
curl -X GET http://localhost:3000/api/cart \
  -H "user-id: demo_user"

# Probar agregar producto específico
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "user-id: demo_user" \
  -d '{"productId": "prod-2", "containerQuantity": 1, "containerType": "20GP", "incoterm": "CIF"}'
```

---

**Última actualización**: Julio 2025  
**Versión**: 1.2.0  
**Estado**: Funcional y en producción  
**Últimos cambios**: 
- Corregida inconsistencia de IDs entre servicios backend
- Solucionado problema de tipos en respuesta del endpoint addToCart
