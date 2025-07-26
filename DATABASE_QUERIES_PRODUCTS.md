# Queries de Base de Datos - Sistema de Productos ZLCExpress

## 📊 Estructura de Base de Datos MySQL

### **Tablas Principales**

#### **1. Tabla `products`**
```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    supplier_id VARCHAR(36),
    
    -- Pricing
    unit_price DECIMAL(10, 2) NOT NULL,
    price_per_container DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Container Info
    container_type ENUM('20GP', '40GP', '40HC', '45HC', 'LCL') NOT NULL,
    units_per_container INT NOT NULL,
    moq INT DEFAULT 1, -- Minimum Order Quantity (containers)
    
    -- Stock
    stock_containers INT DEFAULT 0,
    
    -- Logistics
    incoterm VARCHAR(10) DEFAULT 'FOB ZLC',
    production_time INT, -- days
    packaging_time INT, -- days
    
    -- Commercial
    is_negotiable BOOLEAN DEFAULT FALSE,
    allows_custom_orders BOOLEAN DEFAULT FALSE,
    
    -- Physical properties
    gross_weight DECIMAL(8, 2), -- kg
    net_weight DECIMAL(8, 2), -- kg
    volume DECIMAL(8, 3), -- m³
    
    -- Status
    status ENUM('active', 'inactive', 'sold_out', 'draft') DEFAULT 'active',
    
    -- SEO & Analytics
    total_views INT DEFAULT 0,
    total_inquiries INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    
    -- Indexes
    INDEX idx_category (category_id),
    INDEX idx_supplier (supplier_id),
    INDEX idx_status (status),
    INDEX idx_container_type (container_type),
    INDEX idx_price_range (price_per_container),
    INDEX idx_created_at (created_at)
);
```

#### **2. Tabla `categories`**
```sql
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id VARCHAR(36) NULL,
    level INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    product_count INT DEFAULT 0, -- Cache del conteo
    image_url VARCHAR(500),
    icon VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    
    INDEX idx_parent (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_level (level),
    INDEX idx_active (is_active)
);
```

#### **3. Tabla `suppliers`**
```sql
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP NULL,
    business_license VARCHAR(255),
    
    -- Commercial
    payment_terms TEXT,
    min_order_value DECIMAL(12, 2),
    
    -- Status
    status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_verified (is_verified),
    INDEX idx_country (country)
);
```

#### **4. Tabla `product_images`**
```sql
CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    INDEX idx_product (product_id),
    INDEX idx_primary (is_primary)
);
```

#### **5. Tabla `product_tags`**
```sql
CREATE TABLE product_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_product_tag (product_id, tag_name),
    INDEX idx_tag (tag_name)
);
```

#### **6. Tabla `volume_pricing`**
```sql
CREATE TABLE volume_pricing (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id VARCHAR(36) NOT NULL,
    min_quantity INT NOT NULL, -- minimum containers
    discount_percentage DECIMAL(5, 2) NOT NULL,
    price_per_container DECIMAL(12, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    INDEX idx_product (product_id),
    INDEX idx_quantity (min_quantity)
);
```

## 🔍 Queries Principales

### **1. Listar Productos con Filtros (Categories Page)**
```sql
-- Query principal para obtener productos con filtros y paginación
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

WHERE 1=1
    -- Filtros dinámicos (se agregan según los parámetros)
    AND (:category_id IS NULL OR p.category_id = :category_id)
    AND (:search_query IS NULL OR (
        p.name LIKE CONCAT('%', :search_query, '%') OR 
        p.code LIKE CONCAT('%', :search_query, '%') OR
        p.description LIKE CONCAT('%', :search_query, '%')
    ))
    AND (:container_type IS NULL OR p.container_type = :container_type)
    AND (:price_min IS NULL OR p.price_per_container >= :price_min)
    AND (:price_max IS NULL OR p.price_per_container <= :price_max)
    AND (:incoterm IS NULL OR p.incoterm = :incoterm)
    AND (:is_negotiable IS NULL OR p.is_negotiable = :is_negotiable)
    AND (:allows_custom IS NULL OR p.allows_custom_orders = :allows_custom)
    AND (:supplier_verified IS NULL OR s.is_verified = :supplier_verified)
    AND (:in_stock IS NULL OR p.stock_containers > 0)
    AND p.status = 'active'

ORDER BY 
    CASE 
        WHEN :sort_by = 'name' AND :sort_order = 'asc' THEN p.name
    END ASC,
    CASE 
        WHEN :sort_by = 'name' AND :sort_order = 'desc' THEN p.name
    END DESC,
    CASE 
        WHEN :sort_by = 'price_per_container' AND :sort_order = 'asc' THEN p.price_per_container
    END ASC,
    CASE 
        WHEN :sort_by = 'price_per_container' AND :sort_order = 'desc' THEN p.price_per_container
    END DESC,
    CASE 
        WHEN :sort_by = 'created_at' AND :sort_order = 'desc' THEN p.created_at
    END DESC,
    CASE 
        WHEN :sort_by = 'total_views' AND :sort_order = 'desc' THEN p.total_views
    END DESC,
    p.created_at DESC -- Default fallback

LIMIT :limit OFFSET :offset;
```

### **2. Obtener Producto por ID (Product Details Page)**
```sql
-- Query para obtener todos los detalles de un producto específico
SELECT 
    p.*,
    
    -- Supplier details
    s.company_name as supplier_company_name,
    s.contact_name as supplier_contact_name,
    s.email as supplier_email,
    s.phone as supplier_phone,
    s.country as supplier_country,
    s.city as supplier_city,
    s.is_verified as supplier_is_verified,
    s.verification_date as supplier_verification_date,
    
    -- Category details
    c.name as category_name,
    c.slug as category_slug,
    parent_cat.name as parent_category_name

FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN categories parent_cat ON c.parent_id = parent_cat.id

WHERE p.id = :product_id AND p.status IN ('active', 'sold_out');

-- Query para obtener todas las imágenes del producto
SELECT 
    id,
    image_url,
    alt_text,
    is_primary,
    sort_order
FROM product_images 
WHERE product_id = :product_id 
ORDER BY is_primary DESC, sort_order ASC;

-- Query para obtener tags del producto
SELECT tag_name 
FROM product_tags 
WHERE product_id = :product_id 
ORDER BY tag_name;

-- Query para obtener precios por volumen
SELECT 
    min_quantity,
    discount_percentage,
    price_per_container
FROM volume_pricing 
WHERE product_id = :product_id 
ORDER BY min_quantity ASC;
```

### **3. Obtener Categorías con Conteo de Productos**
```sql
-- Query para obtener el árbol de categorías con conteo actualizado
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT 
        id,
        name,
        slug,
        description,
        parent_id,
        level,
        sort_order,
        is_active,
        image_url,
        icon,
        0 as depth
    FROM categories 
    WHERE parent_id IS NULL AND is_active = TRUE
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.parent_id,
        c.level,
        c.sort_order,
        c.is_active,
        c.image_url,
        c.icon,
        ct.depth + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
    WHERE c.is_active = TRUE
)
SELECT 
    ct.*,
    COALESCE(pc.product_count, 0) as product_count
FROM category_tree ct
LEFT JOIN (
    SELECT 
        category_id,
        COUNT(*) as product_count
    FROM products 
    WHERE status = 'active'
    GROUP BY category_id
) pc ON ct.id = pc.category_id
ORDER BY ct.level, ct.sort_order, ct.name;
```

### **4. Búsqueda de Productos con Texto Completo**
```sql
-- Query optimizada para búsqueda de texto
SELECT 
    p.id,
    p.name,
    p.code,
    p.description,
    p.price_per_container,
    p.container_type,
    s.company_name as supplier_name,
    pi.image_url as primary_image,
    
    -- Relevance scoring
    (
        CASE WHEN p.name LIKE CONCAT('%', :search_query, '%') THEN 3 ELSE 0 END +
        CASE WHEN p.code LIKE CONCAT('%', :search_query, '%') THEN 2 ELSE 0 END +
        CASE WHEN p.description LIKE CONCAT('%', :search_query, '%') THEN 1 ELSE 0 END
    ) as relevance_score

FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE

WHERE p.status = 'active'
    AND (
        p.name LIKE CONCAT('%', :search_query, '%') OR
        p.code LIKE CONCAT('%', :search_query, '%') OR
        p.description LIKE CONCAT('%', :search_query, '%') OR
        EXISTS (
            SELECT 1 FROM product_tags pt 
            WHERE pt.product_id = p.id 
            AND pt.tag_name LIKE CONCAT('%', :search_query, '%')
        )
    )

ORDER BY relevance_score DESC, p.total_views DESC
LIMIT :limit OFFSET :offset;
```

### **5. Productos Relacionados/Sugeridos**
```sql
-- Query para obtener productos relacionados basados en categoría y precio similar
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
    AND p.id != :current_product_id
    AND (
        p.category_id = :current_category_id OR
        p.price_per_container BETWEEN :price_min AND :price_max
    )

ORDER BY 
    CASE WHEN p.category_id = :current_category_id THEN 1 ELSE 2 END,
    ABS(p.price_per_container - :current_price),
    p.total_views DESC

LIMIT 8;
```

### **6. Estadísticas de Productos**
```sql
-- Query para dashboard y estadísticas
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products,
    COUNT(CASE WHEN status = 'sold_out' THEN 1 END) as sold_out_products,
    AVG(price_per_container) as avg_price,
    SUM(total_views) as total_views,
    SUM(total_inquiries) as total_inquiries
FROM products;

-- Productos más vistos
SELECT 
    p.id,
    p.name,
    p.total_views,
    s.company_name as supplier_name
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id
WHERE p.status = 'active'
ORDER BY p.total_views DESC
LIMIT 10;

-- Productos más consultados
SELECT 
    p.id,
    p.name,
    p.total_inquiries,
    s.company_name as supplier_name
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id
WHERE p.status = 'active'
ORDER BY p.total_inquiries DESC
LIMIT 10;
```

## 🔧 Queries de Mantenimiento

### **1. Actualizar Contadores de Vistas**
```sql
-- Incrementar vistas de producto
UPDATE products 
SET total_views = total_views + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :product_id;
```

### **2. Actualizar Contadores de Consultas**
```sql
-- Incrementar consultas de producto
UPDATE products 
SET total_inquiries = total_inquiries + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :product_id;
```

### **3. Actualizar Stock de Contenedores**
```sql
-- Actualizar stock después de una venta
UPDATE products 
SET stock_containers = stock_containers - :quantity_sold,
    status = CASE 
        WHEN stock_containers - :quantity_sold <= 0 THEN 'sold_out'
        ELSE status
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :product_id;
```

### **4. Recalcular Conteo de Productos por Categoría**
```sql
-- Trigger o tarea programada para mantener el conteo actualizado
UPDATE categories c
SET product_count = (
    SELECT COUNT(*)
    FROM products p
    WHERE p.category_id = c.id
    AND p.status = 'active'
);
```

## 📊 Índices Recomendados

```sql
-- Índices adicionales para optimización
CREATE INDEX idx_products_composite_search 
ON products(status, category_id, price_per_container, container_type);

CREATE INDEX idx_products_text_search 
ON products(name, code);

CREATE FULLTEXT INDEX idx_products_fulltext 
ON products(name, description);

CREATE INDEX idx_supplier_verification 
ON suppliers(is_verified, status);

CREATE INDEX idx_category_hierarchy 
ON categories(parent_id, level, sort_order);
```

---

**Nota**: Estos queries están optimizados para MySQL 8.0+ y pueden requerir ajustes menores para versiones anteriores. Se recomienda usar prepared statements para prevenir inyección SQL y mejorar performance.

**Fecha**: Julio 2025  
**Versión**: 1.0  
**Base de Datos**: MySQL 8.0+
