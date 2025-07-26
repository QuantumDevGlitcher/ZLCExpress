# Corrección del Calendario en RFQ Dialog

## Problema Identificado
El calendario en la ventana de cotización RFQ no funcionaba correctamente, posiblemente debido a:
- Configuración incorrecta del componente Calendar
- Falta de estilos específicos para react-day-picker
- Manejo de estados y eventos mejorable

## Soluciones Implementadas

### 1. **Nuevo Componente DatePicker** (`src/components/ui/date-picker.tsx`)
- Componente reutilizable y más robusto
- Mejor manejo de estados (abierto/cerrado)
- Validación de errores mejorada
- Callback optimizado con `useCallback`
- Mejores propiedades de accesibilidad

### 2. **Mejoras en el Componente Calendar** (`src/components/ui/calendar.tsx`)
- Tipado mejorado con `DayPickerProps`
- Mejor manejo de propiedades de iconos
- Estilos más consistentes

### 3. **Estilos CSS Mejorados** (`src/index.css`)
- Variables CSS específicas para React Day Picker
- Mejores colores y espaciado
- Consistencia con el tema de la aplicación

### 4. **Integración en RFQRequestDialog**
- Reemplazado el Popover+Calendar manual por el nuevo DatePicker
- Mejor validación y limpieza de errores
- Fecha mínima configurada (7 días desde hoy)
- Información visual de la fecha mínima

## Características del Nuevo DatePicker

### Props Disponibles:
```typescript
interface DatePickerProps {
  date?: Date;                          // Fecha seleccionada
  onSelect?: (date: Date | undefined) => void;  // Callback de selección
  placeholder?: string;                 // Texto placeholder
  disabled?: (date: Date) => boolean;   // Función para deshabilitar fechas
  className?: string;                   // Clases CSS adicionales
  error?: boolean;                      // Estado de error
  id?: string;                         // ID del elemento
}
```

### Mejoras de UX:
- ✅ **Auto-cierre**: El popover se cierra automáticamente al seleccionar una fecha
- ✅ **Validación visual**: Borde rojo cuando hay errores
- ✅ **Fecha mínima**: No permite seleccionar fechas anteriores a 7 días
- ✅ **Localización**: Configurado en español
- ✅ **Accesibilidad**: Atributos ARIA correctos
- ✅ **Limpieza de errores**: Los errores se limpian automáticamente al seleccionar una fecha válida

## Uso en RFQ Dialog

El calendario ahora:
1. **Muestra la fecha mínima permitida** debajo del campo
2. **Valida automáticamente** las fechas seleccionadas
3. **Limpia errores** cuando se selecciona una fecha válida
4. **Mantiene el estado** correctamente durante la sesión
5. **Es completamente accesible** via teclado y screen readers

## Testing

Para probar el calendario:
1. Abrir cualquier producto
2. Hacer clic en "Solicitar Cotización"
3. Navegar al campo "Fecha Tentativa de Entrega"
4. Verificar que:
   - El calendario se abre correctamente
   - Las fechas anteriores a 7 días están deshabilitadas
   - Se puede navegar entre meses
   - La fecha se selecciona y el popup se cierra
   - Los errores aparecen/desaparecen correctamente

## Estado Actual
✅ **Calendario funcional** y completamente operativo
✅ **Sin errores de compilación**
✅ **Mejorada experiencia de usuario**
✅ **Código más mantenible** y reutilizable
