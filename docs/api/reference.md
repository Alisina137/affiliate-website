# API Reference

## GET /api/products
List all products.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| categoryId | string | Filter by category |
| brandId | string | Filter by brand |
| search | string | Search term |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| sortBy | string | Sort field |
| sortOrder | string | asc/desc |
| limit | number | Results per page |
| offset | number | Pagination offset |

**Response:**
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}

## GET /api/products/[slug]
Get a single product by slug.

**Response:**
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Product Name",
    "slug": "product-slug",
    "price": 99.99,
    "brand": { "id": "1", "name": "Brand" },
    "category": { "id": "1", "name": "Category" }
  }
}

## GET /api/search
Search all content.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |
| type | string | Content type filter |
| categoryId | string | Filter by category |
| brandId | string | Filter by brand |

## GET /api/health
Health check endpoint.

**Response:**
{
  "status": "healthy",
  "timestamp": "2026-08-29T10:00:00.000Z",
  "uptime": 120,
  "version": "0.1.0",
  "checks": { ... }
}
