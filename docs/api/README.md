# API Documentation

## Base URL
All API endpoints are prefixed with /api.

## Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/[slug] | Get a single product |
| GET | /api/categories | List all categories |
| GET | /api/categories/[slug] | Get a single category |
| GET | /api/brands | List all brands |
| GET | /api/brands/[slug] | Get a single brand |
| GET | /api/reviews | List all reviews |
| GET | /api/reviews/[slug] | Get a single review |
| GET | /api/comparisons | List all comparisons |
| GET | /api/comparisons/[slug] | Get a single comparison |
| GET | /api/guides | List all guides |
| GET | /api/guides/[slug] | Get a single guide |
| GET | /api/best | List all best-of lists |
| GET | /api/best/[slug] | Get a single best-of list |
| GET | /api/statistics | List all statistics |
| GET | /api/statistics/[slug] | Get a single statistic |
| GET | /api/search | Search all content |
| GET | /api/health | Health check |

## Admin Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/admin/products | Create a product |
| PUT | /api/admin/products/[id] | Update a product |
| DELETE | /api/admin/products/[id] | Delete a product |
| POST | /api/admin/categories | Create a category |
| PUT | /api/admin/categories/[id] | Update a category |
| DELETE | /api/admin/categories/[id] | Delete a category |
| POST | /api/admin/brands | Create a brand |
| PUT | /api/admin/brands/[id] | Update a brand |
| DELETE | /api/admin/brands/[id] | Delete a brand |
