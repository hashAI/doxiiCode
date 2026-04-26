from typing import Final
from string import Template


def generate_public_api_llm_prompt(base_url: str, tenant_id: str) -> str:
    """
    Build a comprehensive, LLM-friendly prompt to integrate a frontend with DoxiiCMS public APIs.

    The prompt includes:
    - Clear base path and tenancy usage
    - Endpoint reference for Products, Categories, Orders, and Order Items
    - PostgREST-style query conventions
    - Full example requests and full example responses for each endpoint
    - JS quick-start snippet

    Parameters
    - base_url: The deployment base URL (e.g., "https://api.example.com").
    - tenant_id: The tenant identifier to use in examples.

    Returns
    - str: A fully composed prompt string ready to provide to an LLM.
    """

    if not isinstance(base_url, str) or not base_url.strip():
        raise ValueError("base_url must be a non-empty string")
    if not isinstance(tenant_id, str) or not tenant_id.strip():
        raise ValueError("tenant_id must be a non-empty string")

    normalized_base: Final[str] = base_url.rstrip("/")
    tbase: Final[str] = f"{normalized_base}/tenant/{tenant_id}"

    template = Template(
        """
Following is the documentation for the CMS backend APIs using the base URL and tenant provided below.
Integrate with the CMS backend APIs using the base URL and tenant provided below. NO need to use mock schema and data.
Follow the endpoint specifications and examples precisely. Prefer secure defaults, robust error handling, and clear typing where applicable.

- Base URL: $BASE
- Tenant ID: $TENANT
- Base path for all calls in this tenant: $TBASE

General conventions
- Filtering (PostgREST-style): eq., lt., lte., gt., gte., like., ilike., in.(a,b), not.in.(a,b), is.null, not.is.null
- Ordering: ?order=field.asc or ?order=field.desc (multiple comma-separated)
- Pagination: ?limit=<n>&offset=<n>
- Headers: Accept: application/json; Content-Type: application/json for bodies
- Authentication: Products/Categories often public; Orders may require Bearer token depending on deployment. If needed, send Authorization: Bearer <token>.

Products
1) List products
GET $TBASE/products

Query params:
- include_variants (bool, default true)
- include_media (bool, default true)
- Any product field filter (e.g., status, category_id, is_featured, has_variants, name=ilike.*term*)
- Computed filters (applied post-fetch): total_inventory, variant_count; also supports total_inventory_gte / _lte
- Price range: price_range.min=gte.10&price_range.max=lte.100
- order, limit, offset

Example request:
curl "$TBASE/products?status=eq.active&name=ilike.*tee*&order=created_at.desc&limit=2"

Full example response:
{
  "data": [
    {
      "id": 101,
      "name": "Classic T-Shirt",
      "slug": "classic-tshirt",
      "description": "Full sleeve cotton t-shirt",
      "short_description": "Soft cotton tee",
      "status": "active",
      "is_featured": true,
      "has_variants": true,
      "seo_title": "Best Cotton Tee",
      "seo_description": "Buy premium cotton t-shirt",
      "category_id": 5,
      "attributes": { "material": "Cotton" },
      "created_at": "2025-09-14T10:20:30Z",
      "updated_at": "2025-09-14T10:30:00Z",
      "category": { "id": 5, "name": "T-Shirts", "slug": "t-shirts", "description": null, "path": "/Men/T-Shirts" },
      "media": [
        { "id": 1, "url": "$BASE/media/products/101/images/1.jpg", "alt": "Image for Classic T-Shirt", "media_type": "image", "sort_order": 1, "is_external": false }
      ],
      "variants": [
        {
          "id": 2001,
          "sku": "TSHIRT-RED-M",
          "price": 499.0,
          "compare_at_price": 599.0,
          "cost_price": 300.0,
          "inventory_quantity": 100,
          "track_inventory": true,
          "continue_selling_when_out_of_stock": false,
          "weight": 0.3,
          "weight_unit": "kg",
          "attributes": { "color": "Red", "size": "M" },
          "created_at": "2025-09-14T10:20:30Z",
          "updated_at": "2025-09-14T10:30:00Z",
          "media": []
        }
      ],
      "price_range": { "min": 499.0, "max": 549.0, "single": false },
      "variant_count": 3,
      "total_inventory": 230,
      "is_available": true,
      "primary_variant": { "id": 2001, "sku": "TSHIRT-RED-M", "price": 499.0, "inventory_quantity": 100, "in_stock": true }
    },
    {
      "id": 102,
      "name": "Summer Dress",
      "slug": "summer-dress",
      "description": "Lightweight summer dress",
      "short_description": "Perfect for hot weather",
      "status": "active",
      "is_featured": false,
      "has_variants": true,
      "seo_title": "Summer Dress",
      "seo_description": "Comfortable summer dress",
      "category_id": 8,
      "attributes": { "season": "Summer" },
      "created_at": "2025-09-14T10:20:30Z",
      "updated_at": "2025-09-14T10:30:00Z",
      "category": { "id": 8, "name": "Dresses", "slug": "dresses", "description": null, "path": "/Women/Dresses" },
      "media": [ { "id": 2, "url": "$BASE/media/products/102/images/2.jpg", "alt": "Image for Summer Dress", "media_type": "image", "sort_order": 1, "is_external": false } ],
      "variants": [ { "id": 3001, "sku": "DRESS-S-BLUE", "price": 899.0, "compare_at_price": 999.0, "cost_price": 450.0, "inventory_quantity": 25, "track_inventory": true, "continue_selling_when_out_of_stock": false, "weight": 0.25, "weight_unit": "kg", "attributes": { "size": "S", "color": "Blue" }, "created_at": "2025-09-14T10:20:30Z", "updated_at": "2025-09-14T10:30:00Z", "media": [] } ],
      "price_range": { "min": 899.0, "max": 899.0, "single": true },
      "variant_count": 2,
      "total_inventory": 55,
      "is_available": true,
      "primary_variant": { "id": 3001, "sku": "DRESS-S-BLUE", "price": 899.0, "inventory_quantity": 25, "in_stock": true }
    }
  ],
  "meta": { "total": 42, "offset": 0, "limit": 2, "count": 2 }
}

2) Get product by ID
GET $TBASE/products/101?include_variants=true&include_media=true

Full example response:
{
  "id": 101,
  "name": "Classic T-Shirt",
  "slug": "classic-tshirt",
  "description": "Full sleeve cotton t-shirt",
  "short_description": "Soft cotton tee",
  "status": "active",
  "is_featured": true,
  "seo_title": "Best Cotton Tee",
  "seo_description": "Buy premium cotton t-shirt",
  "category_id": 5,
  "attributes": { "material": "Cotton" },
  "created_at": "2025-09-14T10:20:30Z",
  "updated_at": "2025-09-14T10:30:00Z",
  "category": { "id": 5, "name": "T-Shirts", "slug": "t-shirts", "description": null, "path": "/Men/T-Shirts" },
  "media": [ { "id": 1, "url": "$BASE/media/products/101/images/1.jpg", "alt": "Image for Classic T-Shirt", "media_type": "image", "sort_order": 1, "is_external": false } ],
  "variants": [ { "id": 2001, "sku": "TSHIRT-RED-M", "price": 499.0, "compare_at_price": 599.0, "cost_price": 300.0, "inventory_quantity": 100, "track_inventory": true, "continue_selling_when_out_of_stock": false, "weight": 0.3, "weight_unit": "kg", "attributes": { "color": "Red", "size": "M" }, "created_at": "2025-09-14T10:20:30Z", "updated_at": "2025-09-14T10:30:00Z" } ],
  "price_range": { "min": 499.0, "max": 549.0, "single": false }
}

Categories
1) List categories
GET $TBASE/categories?is_active=eq.true&order=sort_order.asc&limit=2

Full example response:
{
  "data": [
    { "id": 5, "name": "T-Shirts", "slug": "t-shirts", "description": null, "parent_id": null, "is_active": true, "sort_order": 1, "seo_title": null, "seo_description": null, "created_at": "2025-09-10T12:00:00Z", "updated_at": "2025-09-10T12:00:00Z" },
    { "id": 8, "name": "Dresses", "slug": "dresses", "description": null, "parent_id": null, "is_active": true, "sort_order": 2, "seo_title": null, "seo_description": null, "created_at": "2025-09-10T12:00:00Z", "updated_at": "2025-09-10T12:00:00Z" }
  ],
  "meta": { "total": 12, "offset": 0, "limit": 2, "count": 2 }
}

2) Category tree
GET $TBASE/categories/tree

Full example response:
{
  "categories": [
    {
      "id": 1,
      "name": "Men",
      "slug": "men",
      "description": null,
      "parent_id": null,
      "is_active": true,
      "sort_order": 1,
      "seo_title": null,
      "seo_description": null,
      "created_at": "2025-09-10T12:00:00Z",
      "updated_at": "2025-09-10T12:00:00Z",
      "children": [
        { "id": 5, "name": "T-Shirts", "slug": "t-shirts", "description": null, "parent_id": 1, "is_active": true, "sort_order": 1, "seo_title": null, "seo_description": null, "created_at": "2025-09-10T12:00:00Z", "updated_at": "2025-09-10T12:00:00Z", "children": [] }
      ]
    }
  ],
  "message": "Category tree retrieved"
}

3) Get category by ID
GET $TBASE/categories/5

Full example response:
{ "id": 5, "name": "T-Shirts", "slug": "t-shirts", "description": null, "parent_id": null, "is_active": true, "sort_order": 1, "seo_title": null, "seo_description": null, "created_at": "2025-09-10T12:00:00Z", "updated_at": "2025-09-10T12:00:00Z" }

Orders
Notes: Values are numbers (decimals serialized as floats). These endpoints may require Bearer auth.

1) List orders
GET $TBASE/orders?status=eq.pending&order=created_at.desc&limit=2

Full example response:
[
  {
    "id": 9001,
    "customer_id": 1,
    "order_number": "ORD-000001",
    "status": "pending",
    "payment_status": "pending",
    "fulfillment_status": "unfulfilled",
    "subtotal": 998.0,
    "tax_amount": 0.0,
    "discount_amount": 0.0,
    "total_amount": 998.0,
    "currency": "USD",
    "notes": null,
    "created_at": "2025-09-14T12:00:00Z",
    "updated_at": "2025-09-14T12:00:00Z"
  },
  {
    "id": 9002,
    "customer_id": 2,
    "order_number": "ORD-000002",
    "status": "confirmed",
    "payment_status": "paid",
    "fulfillment_status": "processing",
    "subtotal": 499.0,
    "tax_amount": 0.0,
    "discount_amount": 0.0,
    "total_amount": 499.0,
    "currency": "USD",
    "notes": "gift wrap",
    "created_at": "2025-09-15T08:30:00Z",
    "updated_at": "2025-09-15T09:00:00Z"
  }
]

2) Create order
POST $TBASE/orders

Request body:
{ "customer_id": 1, "items": [ { "product_id": 101, "variant_id": 2001, "quantity": 2, "unit_price": 499.0 } ] }

Full example response:
{
  "id": 9100,
  "customer_id": 1,
  "order_number": "ORD-000010",
  "status": "pending",
  "payment_status": "pending",
  "fulfillment_status": "unfulfilled",
  "subtotal": 998.0,
  "tax_amount": 0.0,
  "shipping_amount": 0.0,
  "discount_amount": 0.0,
  "total_amount": 998.0,
  "currency": "USD",
  "notes": null,
  "confirmed_at": null,
  "shipped_at": null,
  "delivered_at": null,
  "cancelled_at": null,
  "tracking_number": null,
  "created_at": "2025-09-16T10:00:00Z",
  "updated_at": "2025-09-16T10:00:00Z"
}

3) Get order by ID
GET $TBASE/orders/9100

Full example response:
{
  "id": 9100,
  "customer_id": 1,
  "order_number": "ORD-000010",
  "status": "pending",
  "payment_status": "pending",
  "fulfillment_status": "unfulfilled",
  "subtotal": 998.0,
  "tax_amount": 0.0,
  "shipping_amount": 0.0,
  "discount_amount": 0.0,
  "total_amount": 998.0,
  "currency": "USD",
  "notes": null,
  "confirmed_at": null,
  "shipped_at": null,
  "delivered_at": null,
  "cancelled_at": null,
  "tracking_number": null,
  "created_at": "2025-09-16T10:00:00Z",
  "updated_at": "2025-09-16T10:00:00Z"
}

4) Update order (partial)
PATCH $TBASE/orders/9100

Request body:
{ "status": "confirmed", "payment_status": "paid" }

Full example response:
{
  "id": 9100,
  "customer_id": 1,
  "order_number": "ORD-000010",
  "status": "confirmed",
  "payment_status": "paid",
  "fulfillment_status": "unfulfilled",
  "subtotal": 998.0,
  "tax_amount": 0.0,
  "shipping_amount": 0.0,
  "discount_amount": 0.0,
  "total_amount": 998.0,
  "currency": "USD",
  "notes": null,
  "created_at": "2025-09-16T10:00:00Z",
  "updated_at": "2025-09-16T10:05:00Z"
}

5) Delete order
DELETE $TBASE/orders/9100

Expected: HTTP 204 No Content (no body)

Order items (nested)
1) List items for an order
GET $TBASE/orders/9100/items

Full example response:
[
  {
    "id": 1,
    "order_id": 9100,
    "product_id": 101,
    "variant_id": 2001,
    "product_name": "Classic T-Shirt",
    "product_sku": "TSHIRT-RED-M",
    "variant_title": "TSHIRT-RED-M",
    "quantity": 2,
    "unit_price": 499.0,
    "total_price": 998.0,
    "notes": null,
    "created_at": "2025-09-16T10:00:00Z",
    "updated_at": "2025-09-16T10:00:00Z"
  }
]

2) Add item to order
POST $TBASE/orders/9100/items

Request body:
{ "product_id": 101, "variant_id": 2001, "quantity": 1, "unit_price": 499.0 }

Full example response:
{
  "id": 2,
  "order_id": 9100,
  "product_id": 101,
  "variant_id": 2001,
  "product_name": "Classic T-Shirt",
  "product_sku": "TSHIRT-RED-M",
  "variant_title": "TSHIRT-RED-M",
  "quantity": 1,
  "unit_price": 499.0,
  "total_price": 499.0,
  "notes": null,
  "created_at": "2025-09-16T10:02:00Z",
  "updated_at": "2025-09-16T10:02:00Z"
}

3) Get a specific order item
GET $TBASE/orders/9100/items/2

Full example response:
{
  "id": 2,
  "order_id": 9100,
  "product_id": 101,
  "variant_id": 2001,
  "product_name": "Classic T-Shirt",
  "product_sku": "TSHIRT-RED-M",
  "variant_title": "TSHIRT-RED-M",
  "quantity": 1,
  "unit_price": 499.0,
  "total_price": 499.0,
  "notes": null,
  "created_at": "2025-09-16T10:02:00Z",
  "updated_at": "2025-09-16T10:02:00Z"
}

Error format
- Errors follow FastAPI defaults: {"detail": "message"} with appropriate HTTP status codes (e.g., 400, 404, 500).

Media URLs
- Product and variant media URLs are absolute. Call the API via your public base URL to receive resolvable links.

CORS
- Cross-origin requests are allowed for configured origins. In development, common localhost ports are enabled.

OpenAPI & Docs
- Swagger UI (public): GET $BASE/docs
- OpenAPI JSON (public): GET $BASE/openapi-public.json

Quick start (JavaScript)
```javascript
import axios from 'axios';

const base = '$BASE';
const tenant = '$TENANT';
const api = axios.create({ baseURL: base + '/tenant/' + tenant });

// 1) List products
const { data: productsRes } = await api.get('/products', { params: { status: 'eq.active', order: 'created_at.desc', limit: 20 } });
const products = productsRes.data;

// 2) Get product details
const productId = products[0]?.id;
const { data: product } = await api.get('/products/' + productId, { params: { include_media: true, include_variants: true } });

// 3) Create an order (if auth required, pass Authorization)
const token = '<bearer-token-if-required>';
const authed = token ? axios.create({ baseURL: api.defaults.baseURL, headers: { Authorization: 'Bearer ' + token } }) : api;

const { data: order } = await authed.post('/orders', {
  customer_id: 1,
  items: [{ product_id: product.id, variant_id: product.variants?.[0]?.id, quantity: 1, unit_price: product.price_range?.min ?? 0 }]
});
```
        """
    )

    return template.substitute(BASE=normalized_base, TENANT=tenant_id, TBASE=tbase)


if __name__ == "__main__":
    print(generate_public_api_llm_prompt("https://api.example.com", "demo"))
