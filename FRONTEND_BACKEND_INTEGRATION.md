# Integración Frontend-Backend ZLCExpress

## 🔗 Conexión Establecida

El frontend de ZLCExpress ahora está completamente conectado con el backend real. Aquí están todos los detalles de la integración:

## 📁 Archivos Creados/Actualizados

### 1. **Servicio de API** (`src/services/api.ts`)
- ✅ Conexión directa con `http://localhost:3000/api`
- ✅ Funciones para login, logout, perfil, validación de sesión
- ✅ Manejo automático de tokens en localStorage
- ✅ Tipos TypeScript completos

### 2. **Hook de Autenticación** (`src/hooks/useAuth.ts`)
- ✅ Estado reactivo de autenticación
- ✅ Validación automática de sesión al cargar la app
- ✅ Manejo de errores y estados de carga

### 3. **Contexto de Autenticación** (`src/contexts/AuthContext.tsx`)
- ✅ Contexto global para toda la aplicación
- ✅ Hooks especializados (`useCurrentUser`, `useUserRole`)
- ✅ Verificación de roles (buyer, supplier, both)

### 4. **Rutas Protegidas** (`src/components/ProtectedRoute.tsx`)
- ✅ Protección automática por autenticación
- ✅ Verificación de roles específicos
- ✅ Redirección automática al login

### 5. **Login Actualizado** (`UPDATED_Login.tsx`)
- ✅ Conectado completamente al backend
- ✅ Mantiene la UX existente
- ✅ Manejo real de estados de verificación

## 🔧 Cómo Implementar

### Paso 1: Reemplazar el archivo Login.tsx
```bash
# Reemplaza tu archivo actual
cp UPDATED_Login.tsx src/pages/Login.tsx
```

### Paso 2: Envolver tu App con el AuthProvider
```tsx
// En tu App.tsx o main.tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Tu app actual */}
      </Router>
    </AuthProvider>
  );
}
```

### Paso 3: Proteger rutas que requieren autenticación
```tsx
// Ejemplo de uso
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredRole="buyer">
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Paso 4: Usar hooks en tus componentes
```tsx
// En cualquier componente
import { useAuthContext, useCurrentUser, useUserRole } from '@/contexts/AuthContext';

function MyComponent() {
  const { logout } = useAuthContext();
  const user = useCurrentUser();
  const { isBuyer, isSupplier } = useUserRole();
  
  return (
    <div>
      <p>Bienvenido, {user?.contactName}</p>
      <p>Empresa: {user?.companyName}</p>
      {isBuyer && <BuyerDashboard />}
      {isSupplier && <SupplierDashboard />}
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

## 🧪 Usuarios de Prueba Disponibles

### ✅ Usuarios Verificados (Login Exitoso)
| Email | Password | Tipo | Empresa |
|-------|----------|------|---------|
| `comprador@demo.com` | `demo123` | buyer | Demo Compradora S.A. |
| `proveedor@demo.com` | `demo123` | supplier | Demo Proveedores Ltda. |
| `admin@zlcexpress.com` | `admin123` | both | ZLC Express Admin |
| `juanci123z@gmail.com` | `password123` | buyer | Importadora |

### ⏳ Usuarios Pendientes (Login con Mensaje)
| Email | Password | Estado |
|-------|----------|--------|
| `comprador.pendiente@demo.com` | `demo123` | pending |
| `proveedor.pendiente@demo.com` | `demo123` | pending |

### ❌ Usuarios Rechazados
| Email | Password | Estado |
|-------|----------|--------|
| `proveedor.rechazado@demo.com` | `demo123` | rejected |

## 🔄 Flujo de Autenticación

1. **Login** → Usuario ingresa credenciales
2. **Backend** → Valida y retorna token + datos de usuario
3. **Frontend** → Guarda token en localStorage y actualiza estado
4. **Navegación** → Redirige según el tipo de usuario
5. **Validación** → Cada carga de página verifica la sesión
6. **Logout** → Limpia datos locales y notifica al backend

## 📡 Endpoints Backend Utilizados

- **POST** `/api/auth/login` - Autenticación
- **GET** `/api/auth/profile` - Obtener perfil
- **GET** `/api/auth/validate` - Validar sesión
- **POST** `/api/auth/logout` - Cerrar sesión

## 🎯 Estados de Usuario Manejados

### ✅ Verificado (`verified`)
- Acceso completo a la plataforma
- Puede realizar compras/ventas según su tipo

### ⏳ Pendiente (`pending`)
- Muestra mensaje de verificación en proceso
- No puede acceder a funcionalidades principales

### ❌ Rechazado (`rejected`)
- Muestra mensaje de rechazo
- Sugiere contactar soporte

## 🛡️ Seguridad Implementada

- ✅ Tokens JWT almacenados localmente
- ✅ Validación automática de sesión
- ✅ Protección de rutas por rol
- ✅ Limpieza automática en logout
- ✅ Manejo seguro de errores

## 🔧 Variables de Configuración

```typescript
// En src/services/api.ts
const API_BASE_URL = 'http://localhost:3000/api';

// Para producción, cambiar a:
// const API_BASE_URL = 'https://api.zlcexpress.com/api';
```

## 📱 Ejemplos de Uso

### Login Programático
```typescript
import { useAuthContext } from '@/contexts/AuthContext';

const { login } = useAuthContext();

const handleLogin = async () => {
  const result = await login({
    email: 'comprador@demo.com',
    password: 'demo123'
  });
  
  if (result.success) {
    // Login exitoso
    navigate('/dashboard');
  } else {
    // Mostrar error
    setError(result.message);
  }
};
```

### Obtener Datos del Usuario
```typescript
import { useCurrentUser } from '@/contexts/AuthContext';

const user = useCurrentUser();

return (
  <div>
    <h1>Bienvenido, {user?.contactName}</h1>
    <p>Empresa: {user?.companyName}</p>
    <p>NIT: {user?.taxId}</p>
    <p>País: {user?.country}</p>
  </div>
);
```

### Verificar Roles
```typescript
import { useUserRole } from '@/contexts/AuthContext';

const { isBuyer, isSupplier, isAdmin } = useUserRole();

return (
  <div>
    {isBuyer && <ComprarProductos />}
    {isSupplier && <VenderProductos />}
    {isAdmin && <PanelAdmin />}
  </div>
);
```

## 🚀 Próximos Pasos

1. **Implementar la integración** siguiendo los pasos arriba
2. **Probar todos los flujos** con los usuarios de demo
3. **Conectar otras funcionalidades** (productos, carrito, pedidos)
4. **Agregar manejo de errores específicos**
5. **Implementar refresh automático de tokens**

## ⚠️ Notas Importantes

- El backend debe estar ejecutándose en `http://localhost:3000`
- Los tokens se almacenan en localStorage (considerar sessionStorage para mayor seguridad)
- La validación de sesión ocurre automáticamente al cargar la app
- Todos los estados de verificación están manejados correctamente

¡La integración está completa y lista para usar! 🎉
