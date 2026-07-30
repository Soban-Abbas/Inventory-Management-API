# Inventory Management API

A multi-tenant inventory management backend built with **Node.js**, **Express**, and **PostgreSQL**. Each shop manages its own employees, suppliers, products, and sales independently, with role-based access control for **Shop**, **Manager**, and **Cashier** users.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** PostgreSQL (`pg`)
- **Auth:** JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing:** `bcrypt`
- **Validation:** `express-validator`
- **File Uploads:** `multer`
- **Excel Export:** `exceljs`
- **Dev Tooling:** `nodemon`

## Folder Structure

```
Inventory-Management-API/
├── package.json
├── package-lock.json
└── src/
    ├── app.js                          # Express app entry point, mounts routers
    │
    ├── controller/
    │   ├── shopController.js           # Shop registration, login, history export
    │   ├── employeeController.js       # Employee registration, employee login
    │   ├── managerController.js        # Suppliers, products, product images
    │   └── cashierController.js        # Product lookup and selling
    │
    ├── database/
    │   ├── pool.js                     # PostgreSQL connection pool
    │   └── creatingTables.js           # Creates tables on server start
    │
    ├── helper/
    │   ├── encryptPassword.js          # bcrypt hash/verify helpers
    │   ├── filestorage.js              # multer disk storage + image file filter
    │   ├── sendInputValidtionError.js  # Shared express-validator error responder
    │   ├── startServer.js              # Initializes DB tables, starts the server
    │   └── validateloginInputs.js      # Basic shop login field checks
    │
    ├── middleware/
    │   ├── globalErrorHandlingMiddleware.js  # Central error handler
    │   ├── isShop.js                   # Restricts route to "shop" role
    │   ├── isManager.js                # Restricts route to "manager" role
    │   ├── isCashier.js                # Restricts route to "cashier" role
    │   └── multerBodyParser.js
    │
    ├── model/
    │   ├── shopModel.js                # Shop DB queries
    │   ├── employeeModel.js            # Employee DB queries
    │   ├── managerModel.js             # Supplier/product DB queries
    │   └── cashierModel.js             # Selling/stock DB queries
    │
    ├── routes/
    │   ├── shopRoutes.js               # Mounted at /shop
    │   ├── employeeRoutes.js           # Mounted at /shop (employee login)
    │   ├── managerRoutes.js            # Mounted at /manager
    │   └── cashierRoutes.js            # Mounted at /cashier
    │
    ├── util/
    │   ├── generateJwtToken.js         # JWT for shop accounts (1h expiry)
    │   ├── employeeToken.js            # JWT for employee accounts (4h expiry)
    │   └── verifyToken.js              # Verifies Authorization header token
    │
    └── validator/
        ├── shopRegistrationValidation.js
        ├── validateEmployeeDetails.js
        ├── validateSupplierDetails.js
        ├── productValidation.js
        ├── updateProductValidation.js
        ├── validateSellingInput.js
        └── velidateImageInput.js
```

## Roles & Authentication

There are three account types, distinguished by a `role` claim embedded in the JWT (`req.details = { id, role, shop_id }` after `verifyToken` runs):

| Role | How it's created | Token issuer | Token expiry |
|---|---|---|---|
| `shop` | `POST /shop/registration` | `generateJwtToken.js` | 1 hour |
| `manager` | Added by a shop via `POST /shop/employee` | `employeeToken.js` | 4 hours |
| `cashier` | Added by a shop via `POST /shop/employee` | `employeeToken.js` | 4 hours |

**Auth flow for protected routes:**
1. `verifyToken` — reads `Authorization: Bearer <token>`, verifies it with `process.env.jwtKey`, and attaches `id`, `role`, `shop_id` to `req.details`.
2. `isShop` / `isManager` / `isCashier` — checks `req.details.role` matches the route's required role.

## Environment Variables

The app reads the following from a `.env` file (see `database/pool.js`, `util/*Token.js`, `helper/startServer.js`):

```
jwtKey=your_jwt_secret
user=your_postgres_user
password=your_postgres_password
host=your_postgres_host
port=your_postgres_port
database=your_postgres_database
```

The server listens on port `3000` (hardcoded in `helper/startServer.js`).

## Setup

```bash
git clone https://github.com/Soban-Abbas/Inventory-Management-API.git
cd Inventory-Management-API
npm install
# create a .env file with the variables listed above
npm run dev
```

On startup, `createTables()` runs automatically and creates any missing tables (`shops`, `employees`, `categories`, `suppliers`, `products`, `product_supplier`, `track_history`, `product_image`).

## API Endpoints

All responses are JSON unless stated otherwise. Errors that reach the global error handler (`globalErrorHandlingMiddleware.js`) are returned as:

```json
{ "error": "<message>" }
```

with the HTTP status taken from `err.status` (defaults to `500`).

---

### Shop routes — base path `/shop`

#### `POST /shop/registration`
Register a new shop. **Public.**

**Body:** `name`, `email`, `password`, `confirm-password`

**Success — 201**
```json
{
  "message": "Shop registered Successfully",
  "shopDetails": {
    "id": 1,
    "name": "MyShop",
    "email": "shop@example.com",
    "invite_code": "a1b2c3d4"
  }
}
```

**Errors**
- `422` — validation failed (invalid name/email/password, or password mismatch), body: `{ "error": [ ...express-validator errors ] }`
- `409` — `{ "error": "Email already registered" }`

---

#### `POST /shop/login`
Log in as a shop. **Public.**

**Body:** `email`, `password`

**Success — 200**
```json
{
  "Message": "Shop Login Successfully",
  "id": 1,
  "name": "MyShop",
  "email": "shop@example.com",
  "invite_code": "a1b2c3d4",
  "token": "<jwt>"
}
```

**Errors**
- `404` — `{ "error": "Wrong Email or Password" }` (malformed input, unknown email, or incorrect password)

---

#### `POST /shop/employee`
Register a manager or cashier under the logged-in shop. **Requires:** `verifyToken`, `isShop`.

**Body:** `name`, `phone_number` (international format, e.g. `+923001234567`), `role` (`manager` or `cashier`), `password`, `confirm-password`

**Success — 201**
```json
{
  "message": "Employee registered Successfully",
  "id": 5,
  "name": "Ali",
  "phone_number": "+923001234567",
  "role": "cashier"
}
```

**Errors**
- `422` — validation failed, body: `{ "error": [ ... ] }`
- `400` — `{ "error": "Only shop can access this route" }` (caller isn't a shop)
- `401` — `{ "error": "Please login First" }` (missing/invalid token)
- `409` — `{ "error": "Phone number Already Registered" }`

---

#### `GET /shop/history`
Download a `.xlsx` file of the shop's transaction history (employee actions, dates, totals). **Requires:** `verifyToken`, `isShop`.

**Success — 200**
Binary `.xlsx` file stream with headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename=record.xlsx
```
Columns: `Employee Id`, `action`, `date`, `total_amount`

**Errors**
- `404` — `{ "error": "Not record found " }`
- `400` / `401` — same as above for role/auth failures

---

#### `POST /shop/employee/login`
Log in as a manager or cashier. **Public.**

**Body:** `id`, `password`

**Success — 200**
```json
{
  "message": "Login Successfull",
  "id": 5,
  "name": "Ali",
  "phone_number": "+923001234567",
  "role": "cashier",
  "token": "<jwt>"
}
```

**Errors**
- `401` — `{ "error": "Wrong Id or password" }`

---

### Manager routes — base path `/manager`

All routes below **require** `verifyToken` and `isManager` (`401` `{ "error": "Please login First" }` if unauthenticated, `401` `{ "error": "Unauthorized to Access these Routes" }` if not a manager).

#### `POST /manager/supplier`
Add a new supplier for the shop.

**Body:** `name`, `address`, `phone_number` (international format)

**Success — 201**
```json
{
  "message": "supplier added Successfully",
  "id": 3,
  "name": "ABC Traders",
  "address": "Main Market",
  "phone_number": "+923001234567"
}
```

**Errors**
- `422` — validation failed
- `409` — supplier with that phone number already exists for the shop

---

#### `GET /manager/suppliers`
List suppliers for the shop, paginated.

**Query:** `page` (default `1`), `limit` (default `3`)

**Success — 200**
```json
{
  "message": "Supplier fetch successfully",
  "suppliers": [ { "id": 3, "name": "ABC Traders", "address": "...", "phone_number": "..." } ]
}
```

**Errors**
- `404` — `{ "error": "No supplier found" }`

---

#### `POST /manager/product`
Add a new product (with one or more variants) and record the initial stock purchase in history.

**Body:**
```json
{
  "name": "T-Shirt",
  "category": "Clothing",
  "supplierId": 3,
  "brand": "optional",
  "description": "optional",
  "variants": [
    { "color": "Red", "size": "M", "sellingPrice": 1200, "purchasePrice": 800, "stock": 50 }
  ]
}
```

**Success — 201**
```json
{ "message": "product added successfully" }
```

**Errors**
- `422` — validation failed (name/category length, missing color/size across variants, invalid prices/stock, non-integer `supplierId`)
- `409` — a product with that name already exists for the shop

---

#### `GET /manager/product`
List all products (joined with category, variants, supplier, and image) for the shop, paginated.

**Query:** `page` (default `1`), `limit` (default `3`)

**Success — 200**
```json
{ "products": [ { "productid": 1, "name": "T-Shirt", "category": "Clothing", "variantid": 4, "color": "Red", "size": "M", "price": 1200, "stock": 50, "image_url": null, "supplierid": 3 } ] }
```

**Errors**
- `404` — `{ "error": "products Not found" }`

---

#### `PUT /manager/product`
Update stock / pricing for an existing product variant and log the change in history.

**Body:** `productId`, `variantId`, `supplierId`, `stock`, `purchasePrice`, `sellingPrice`

**Success — 201**
```json
{
  "message": "Product Updated Successfully",
  "updatedProduct": [ { "...updated product_variants row" } ]
}
```

**Errors**
- `422` — validation failed (missing/non-integer fields)

---

#### `POST /manager/image`
Upload a product image (`multipart/form-data`, field name `image`, type png/jpg/jpeg).

**Body (form fields):** `productId`, `variantId` + file field `image`

**Success — 401** *(status code as returned by the current implementation)*
```json
{
  "message": "image uploaded successfully",
  "addImage": { "id": 1, "product_id": 1, "image_url": "upload/...", "variant_id": 4, "shop_id": 1 }
}
```

**Errors**
- `422` — validation failed
- `400` — `{ "error": "image is required " }` (no file attached)
- `415` — `{ "error": "only accept png , jpg images" }`

---

### Cashier routes — base path `/cashier`

All routes below **require** `verifyToken` and `isCashier` (`401` `{ "error": "Unauthorized to Access these Routes" }` if not a cashier).

#### `GET /cashier/product`
Look up a single product variant by ID.

**Query:** `productId`, `variantId`

**Success — 200**
```json
{
  "message": "product found successfully",
  "product": [ { "name": "T-Shirt", "categoryname": "Clothing", "color": "Red", "size": "M", "sku": "...", "stock": 50, "price": 1200, "image_url": null } ]
}
```

**Errors**
- `422` — `{ "message": "Wrong product Id or variant Id" }` (missing query params)
- `404` — `{ "error": "product Not found" }`

---

#### `GET /cashier/products`
List all products for the shop, paginated.

**Query:** `page` (default `1`), `limit` (default `2`)

**Success — 200**
```json
{ "message": "product Fetch successfull", "products": [ ... ] }
```

**Errors**
- `404` — `{ "error": "products Not found" }`

---

#### `POST /cashier/product`
Sell a product: decrements stock and logs the sale in history.

**Body:** `productId`, `variantId`, `units`, `unitPrice`

**Success — 200**
```json
{
  "message": "product Sell",
  "productDetails": {
    "id": 1,
    "name": "T-Shirt",
    "color": "Red",
    "size": "M",
    "totalunitSell": 2,
    "totalAmount": 2400
  }
}
```

**Errors**
- `422` — validation failed (missing/non-integer `productId`, `variantId`, `units`, `unitPrice`)
- `422` — `{ "error": "Available stock is Low" }`
- `422` — `{ "error": "Not allow to sell product on lower rates " }` (selling below the listed price)

---

## Authorization Header Format

Protected routes expect:

```
Authorization: Bearer <token>
```

Missing header or token returns `401` — `{ "error": "Please login First" }`.
