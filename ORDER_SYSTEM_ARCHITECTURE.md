# Order System Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Zustand)                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  USER FLOW                              ADMIN FLOW                           │
│  ─────────────────────────────────────────────────────────────────           │
│                                                                               │
│  [Product Browse]                       [Order Dashboard]                    │
│        ↓                                      ↓                              │
│  [Add to Cart]                          [View All Orders]                    │
│        ↓                                      ↓                              │
│  [Checkout Page]                        [Filter/Search Orders]              │
│        ├─ Address Form                      ↓                               │
│        ├─ Shipping Options              [View Order Details]                │
│        ├─ Payment Method                    ├─ Edit Items                   │
│        └─ Order Review                      ├─ Update Status                │
│        ↓                                     ├─ Print Invoice               │
│  [COD/bKash]                                └─ Send to Courier             │
│    ├─ COD: POST /orders                                                     │
│    └─ bKash: POST /bkashcreate → Callback → POST /orders                   │
│        ↓                                                                      │
│  [Thank You Page]                       [Bulk Operations]                    │
│                                             ├─ Bulk Update Status            │
│  [Track Order]                              └─ Bulk Delete                   │
│    └─ POST /track-order (public)                                            │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API LAYER (Express.js)                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ORDER ENDPOINTS                                                             │
│  ────────────────────────────────────────────────────────────────           │
│                                                                               │
│  PUBLIC:                          ADMIN (Protected):                         │
│  • POST /orders                    • GET /orders (list, filter)              │
│  • GET /order-no/:orderNo          • GET /orders/:orderId                    │
│  • POST /track-order               • PUT /orders/:orderId                    │
│  • GET /ordersbyUser/:userId       • DELETE /orders/:orderId                 │
│  • POST /bkashcreate               • PUT /orders/bulk-update-status          │
│  • POST /bkashexecute              • DELETE /orders/bulk-delete              │
│  • POST /queryPaymentStatus                                                  │
│                                                                               │
│  PERMISSION CHECKS:                                                          │
│  - view_orders (read access)                                                 │
│  - edit_orders (modify orders)                                               │
│  - delete_orders (remove orders)                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER (Business Logic)                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  orderService.js                  Other Supporting Services                 │
│  ─────────────────────────────────────────────────────────                  │
│                                                                               │
│  • createOrder()                  • productService (stock management)        │
│    ├─ Verify user                • courierService (Pathao/Steadfast)        │
│    ├─ Generate order number      • bkashService (payment processing)        │
│    ├─ Validate & calc items      • couponService (discount validation)      │
│    ├─ Calculate totals           • UserService (reward points)               │
│    └─ Save to database                                                       │
│                                                                               │
│  • getOrderById()                                                            │
│  • getOrderByOrderNo()                                                       │
│  • getOrdersByUserId()                                                       │
│  • updateOrder()                                                             │
│  • deleteOrder()                                                             │
│  • updateMultipleOrderStatuses()                                             │
│  • bulkDeleteOrders()                                                        │
│  • trackOrderByOrderNoAndPhone()                                             │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (Models)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  OrderModel                       Related Models                             │
│  ───────────                      ──────────────                             │
│  • orderNo                        • OrderCounterModel                        │
│  • userId (optional)              • ProductModel                             │
│  • orderDate                      • ShippingModel                            │
│  • orderStatus                    • VatPercentageModel                       │
│  • paymentStatus                  • FreeDeliveryAmountModel                  │
│  • paymentMethod                  • CouponModel                              │
│  • shippingInfo                   • UserModel                                │
│  • billingInfo                    • bKashConfigModel                         │
│  • items []                       • SteadfastConfigModel                     │
│  • subtotalAmount                 • PathaoConfigModel                        │
│  • totalAmount                    • CartModel                                │
│  • vat                                                                        │
│  • deliveryCharge                                                            │
│  • promoCode                                                                 │
│  • rewardPointsUsed                                                          │
│  • adminNote                                                                 │
│  • courierConsignmentId                                                      │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  • orders (collection)                                                       │
│  • order_counters (sequence generation)                                      │
│  • products (stock tracking)                                                 │
│  • users (reward points)                                                     │
│  • coupons (validation)                                                      │
│  • shipping_methods                                                          │
│  • carts (abandoned cart tracking)                                           │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Order Creation Flow - Detailed Sequence Diagram

```
USER                    FRONTEND              BACKEND              DATABASE          PAYMENT GW
│                           │                   │                    │                  │
│ Add to Cart (multiple)    │                   │                    │                  │
├──────────────────────────→│                   │                    │                  │
│                           │                   │                    │                  │
│ Proceed to Checkout       │                   │                    │                  │
├──────────────────────────→│                   │                    │                  │
│                           │                   │                    │                  │
│ Fill Address & Shipping   │                   │                    │                  │
├──────────────────────────→│                   │                    │                  │
│                           │                   │                    │                  │
│ Select Payment Method     │                   │                    │                  │
├──────────────────────────→│                   │                    │                  │
│                           │                   │                    │                  │
│                    ┌─── IF COD ──────────────┐ IF BKASH ──────┐   │                  │
│                    │                          │                │   │                  │
│         Click Place Order                     │                │   │                  │
│         ├─────────→│                          │                │   │                  │
│                    │ POST /orders             │                │   │                  │
│                    │────────────────────────→ │                │   │                  │
│                    │                          │ Generate Order No   │                  │
│                    │                          │────────────────→│   │                  │
│                    │                          │                │──→│ Create           │
│                    │                          │                │   │                  │
│                    │                          │ Validate Items     │                  │
│                    │                          │ ✓ Product exists   │                  │
│                    │                          │ ✓ Stock available  │                  │
│                    │                          │ ✓ Update stock     │                  │
│                    │                          │ Calc Discounts     │                  │
│                    │                          │ Calc VAT & Total   │                  │
│                    │                          │ Save Order         │                  │
│                    │                          │────────────────→│   │                  │
│                    │                          │                │──→│ Order stored    │
│                    │                          │ Return orderNo     │                  │
│                    │←──────────────────────── │                │   │                  │
│                    │ Success + Order ID       │                │   │                  │
│                    │ Clear Cart              │                │   │                  │
│                    │ Redirect /thank-you    │                │   │                  │
│ See thank you page │←──────────────────────── │                │   │                  │
└────────────────────┘                         │                │   │                  │
                                                │                │   │                  │
                                                └─── IF BKASH ───┤   │                  │
                                                      │                │                  │
                                              │ POST /bkashcreate│   │                  │
                                              │────────────────→ │   │                  │
                                              │                 │   │                  │
                                              │                 │─────────────────→│   │
                                              │                 │  Create Payment   │   │
                                              │                 │                   │ ←──
                                              │                 │   Return paymentID│   │
                                              │←────────────────│   │                  │
                                              │ PaymentID + URL │   │                  │
                                              │ Save to localStorage│ │                 │
                                              │ Redirect to bKash   │                  │
                                              │                     │                  │
                                              │ [USER enters PIN]   │                  │
                                              │                     │                  │
                                              │ [bKash verifies]    │                  │
                                              │                     │                  │
                                              │ Callback /bkash-callback?status=success│
                                              │ ←─────────────────────────────────────│
                                              │ POST /bkashexecute (paymentID)       │
                                              │────────────────→│                     │
                                              │                 │ Verify Payment    │
                                              │                 │──────────────────→│
                                              │                 │       ✓ OK        │
                                              │                 │ ←────────────────│
                                              │ Success Response│   │                  │
                                              │←────────────────│   │                  │
                                              │ POST /orders    │   │                  │
                                              │ (with paymentId &   │                  │
                                              │  paymentStatus="paid")              │
                                              │────────────────→│   │                  │
                                              │                 │ Similar flow as COD│
                                              │                 │ Save Order        │
                                              │                 │────────────────→│   │
                                              │                 │                 │──→│
                                              │ Return Order    │   │                  │
                                              │←────────────────│   │                  │
                                              │ Clear Cart      │   │                  │
                                              │ Redirect /thank-you│                   │
                                              │                 │   │                  │
```

## Order Status Workflow State Machine

```
                    ┌─────────────────────────┐
                    │  ORDER CREATED (pending)│
                    │  - Stock deducted       │
                    │  - Payment: unpaid      │
                    └────────────┬────────────┘
                                 │
                                 ↓
                    ┌─────────────────────────┐
                    │    APPROVED (admin)     │
                    │  - Ready to ship        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ↓                         ↓
         ┌──────────────────────┐  ┌─────────────────────┐
         │   IN TRANSIT (courier)│  │  CANCELLED (admin)  │
         │  - Sent to courier   │  │  - Stock restored   │
         └────────┬─────────────┘  │  - Status locked    │
                  │                 └─────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
       ↓                     ↓
    DELIVERED           RETURNED
    - Payment → paid    - Stock restored
    - Order complete    - Status locked
    - Can't reverse     
```

## Data Flow Diagram - Order Creation

```
┌──────────────┐      ┌─────────────────┐      ┌──────────────┐
│  Order Data  │─────→│  Validation     │─────→│ Calculation  │
│              │      │  - User exists? │      │ - Subtotal   │
│ - Items      │      │  - Stock ok?    │      │ - Discounts  │
│ - Shipping   │      │  - Coupon valid?│      │ - VAT        │
│ - Payment    │      │  - Price checks │      │ - Delivery   │
└──────────────┘      └─────────────────┘      │ - Total      │
                                               │ - Due amt    │
                                               └──────┬───────┘
                                                      │
                                                      ↓
                                              ┌──────────────────┐
                                              │ Stock Adjustment │
                                              │                  │
                                              │ Deduct from:     │
                                              │ - Product qty OR │
                                              │ - Variant stock  │
                                              └──────┬───────────┘
                                                     │
                                                     ↓
                                              ┌──────────────────┐
                                              │ Save Order       │
                                              │                  │
                                              │ - Create Doc in  │
                                              │   MongoDB        │
                                              │ - Update counter │
                                              └──────┬───────────┘
                                                     │
                                                     ↓
                                              ┌──────────────────┐
                                              │ Post-Actions     │
                                              │                  │
                                              │ - Clear cart     │
                                              │ - Email confirm  │
                                              │ - Award points   │
                                              │ - Send SMS/push  │
                                              └──────────────────┘
```

## Database Schema Relationships

```
┌─────────────────┐
│  User           │
├─────────────────┤
│ _id (PK)        │
│ phone           │───┐
│ rewardPoints    │   │
│ email           │   │
└─────────────────┘   │
                      │
                      │ userId (optional)
                      │
┌─────────────────┐   │        ┌──────────────────┐
│ Order           │←──┤        │ Product          │
├─────────────────┤   │        ├──────────────────┤
│ _id (PK)        │   │        │ _id (PK)         │
│ orderNo         │   │        │ name             │
│ userId (FK)     │───┘        │ finalStock       │
│ items[]         │───────────→│ finalPrice       │
│ shippingId (FK) ├──────┐     │ variants[]       │
│ promoCode       │      │     └──────────────────┘
│ paymentStatus   │      │
│ orderStatus     │      │
│ totalAmount     │      │
└─────────────────┘      │
                         │ shippingId (FK)
                         │
                    ┌────┴──────────┐
                    │ Shipping      │
                    ├───────────────┤
                    │ _id (PK)      │
                    │ name          │
                    │ value (charge)│
                    └───────────────┘

    ┌────────────────────────┐      ┌────────────────────────┐
    │ Coupon                 │      │ OrderCounter           │
    ├────────────────────────┤      ├────────────────────────┤
    │ _id (PK)               │      │ _id (PK)               │
    │ code                   │      │ id: "order"            │
    │ value                  │      │ seq: [current number]  │
    │ type (% or amount)     │      └────────────────────────┘
    │ minimumOrder           │
    │ startDate, endDate     │      ┌────────────────────────┐
    └────────────────────────┘      │ VatPercentage          │
                                    ├────────────────────────┤
                                    │ _id (PK)               │
                                    │ value (percentage)     │
                                    └────────────────────────┘
```

## API Request/Response Examples

### Create Order (POST /api/orders)
```
REQUEST:
{
  "shippingInfo": {
    "fullName": "John Doe",
    "mobileNo": "+8801712345678",
    "email": "john@example.com",
    "address": "123 Street, City"
  },
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "variantId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "userId": "507f1f77bcf86cd799439013",
  "shippingId": "507f1f77bcf86cd799439014",
  "paymentMethod": "cash_on_delivery",
  "promoCode": "WELCOME10",
  "rewardPointsUsed": 100
}

RESPONSE:
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439015",
    "orderNo": "000001",
    "orderDate": "2024-03-11T10:30:00Z",
    "orderStatus": "pending",
    "paymentStatus": "unpaid",
    "shippingInfo": { ... },
    "items": [ ... ],
    "subtotalAmount": 1000,
    "promoDiscount": 100,
    "vat": 54,
    "deliveryCharge": 100,
    "totalAmount": 1054,
    "dueAmount": 1054,
    "createdAt": "2024-03-11T10:30:00Z"
  }
}
```

### Get All Orders (GET /api/orders?page=1&limit=10&orderStatus=pending)
```
RESPONSE:
{
  "success": true,
  "totalOrders": 50,
  "totalPages": 5,
  "currentPage": 1,
  "orders": [
    {
      "orderNo": "000001",
      "orderStatus": "pending",
      "paymentStatus": "unpaid",
      "shippingInfo": { "fullName": "John Doe", ... },
      "totalAmount": 1054,
      "orderDate": "2024-03-11T10:30:00Z"
    },
    ...
  ]
}
```
