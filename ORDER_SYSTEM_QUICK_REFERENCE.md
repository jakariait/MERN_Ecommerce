# Order System - Quick Reference Guide

## Key Files Location

### Backend
- **Model:** `/backend/models/OrderModel.js` (249 lines)
- **Controller:** `/backend/controllers/orderController.js` (298 lines) 
- **Service:** `/backend/services/orderService.js` (741 lines)
- **Routes:** `/backend/routes/api.js` (lines 545-599)
- **Counter Model:** `/backend/models/OrderCounterModel.js`

### Frontend
- **Store:** `/frontend/src/store/useOrderStore.js` (264 lines) - Zustand state management
- **Admin Pages:** `/frontend/src/pagesAdmin/`
  - `AllOrdersPage.jsx` - Order dashboard
  - `ViewOrderPage.jsx` - Single order view
  - Status pages: `PendingOrdersPage.jsx`, `ApprovedOrdersPage.jsx`, etc.
- **User Pages:** `/frontend/src/pagesUser/`
  - `CheckoutPage.jsx` - User checkout
  - `UserAllOrdersPage.jsx` - User's orders
  - `UserOrderDetailsPage.jsx` - Order tracking
- **Components:** `/frontend/src/component/componentGeneral/`
  - `Checkout.jsx` (345 lines) - Main checkout form
  - `OrderSummary.jsx` (71 lines) - Order total display
  - `BkashCallback.jsx` (118 lines) - Payment callback
- **Admin Components:** `/frontend/src/component/componentAdmin/`
  - `AllOrders.jsx` (1174 lines) - Admin order list
  - `ViewOrder.jsx` (707 lines) - Admin order editor
  - `AdminNewOrderCreate.jsx` (11 lines) - **EMPTY - NEEDS IMPLEMENTATION**

---

## OrderModel Fields at a Glance

### Essential Fields
```javascript
orderNo: "000001"                  // Auto-generated, unique
userId: ObjectId (optional)        // Allows guest orders
orderStatus: "pending"             // pending|approved|intransit|delivered|returned|cancelled
paymentStatus: "unpaid"            // unpaid|paid
paymentMethod: "cash_on_delivery"  // cash_on_delivery|bkash|nagad|card
```

### Financial Fields
```javascript
subtotalAmount: 1000    // Sum of items (price × qty)
promoDiscount: 100      // Coupon discount
specialDiscount: 0      // Admin manual discount
vat: 54                 // Tax (calculated from VatPercentage)
deliveryCharge: 100     // Shipping cost
rewardPointsUsed: 0     // Points deducted
totalAmount: 1054       // Final amount due
advanceAmount: 0        // Upfront payment
dueAmount: 1054         // Outstanding balance
```

### Shipping Fields
```javascript
shippingInfo: {
  fullName: "John Doe",
  mobileNo: "+8801712345678",
  email: "john@example.com",
  address: "123 Street, City"
}
billingInfo: { fullName, address }  // Optional
```

### Items Structure
```javascript
items: [{
  productId: ObjectId,     // Reference to Product
  variantId: ObjectId,     // Optional, if product has variants
  quantity: 2,
  price: 500               // Price at time of order
}]
```

---

## API Endpoints Summary

### Quick Endpoints Reference

**Create Order**
```
POST /api/orders
Body: { shippingInfo, items, userId?, shippingId, paymentMethod, promoCode?, rewardPointsUsed? }
Response: { success, order }
```

**Get Orders (Admin)**
```
GET /api/orders?page=1&limit=10&orderStatus=pending&search=orderNo
Auth: Admin (view_orders permission)
Response: { success, orders, totalOrders, totalPages, currentPage }
```

**Get Order Details (Admin)**
```
GET /api/orders/:orderId
Auth: Admin (view_orders permission)
Response: { success, order } (with populated items & user)
```

**Update Order (Admin)**
```
PUT /api/orders/:orderId
Auth: Admin (edit_orders permission)
Body: { shippingInfo?, billingInfo?, items?, orderStatus?, ... }
Response: { success, updatedOrder }
```

**Delete Order (Admin)**
```
DELETE /api/orders/:orderId
Auth: Admin (delete_orders permission)
Response: { success }
```

**Bulk Update Statuses (Admin)**
```
PUT /api/orders/bulk-update-status
Auth: Admin (edit_orders permission)
Body: { orderIds: [...], orderStatus: "approved" }
Response: { success, totalUpdated, results }
```

**Bulk Delete (Admin)**
```
DELETE /api/orders/bulk-delete
Auth: Admin (delete_orders permission)
Body: { orderIds: [...] }
Response: { success, totalDeleted }
```

**Get User's Orders (Authenticated)**
```
GET /api/ordersbyUser/:userId
Auth: User (must be same user)
Response: { success, orders, totalOrders }
```

**Get Order by Number (Public)**
```
GET /api/order-no/:orderNo
Response: { success, order }
```

**Track Order (Public)**
```
POST /api/track-order
Body: { orderNo: "000001", phone: "+8801712345678" }
Response: { success, order }
```

---

## Order Creation Flow (Step-by-Step)

### User Checkout Flow
```
1. User adds items to cart
2. User goes to checkout
3. Fills shipping address & selects shipping method
4. Selects payment method (COD or bKash)
5. Reviews order summary (with coupon & reward points)
6. Clicks "Place Order"
   
   IF COD:
   └─→ POST /api/orders (directly)
       ├─ Verify user (if logged in)
       ├─ Generate order number
       ├─ Validate coupon
       ├─ Calculate totals
       ├─ Deduct stock
       ├─ Save order (orderStatus: pending, paymentStatus: unpaid)
       └─ Clear cart & redirect to /thank-you
   
   IF BKASH:
   └─→ POST /api/bkashcreate (init payment)
       ├─ Create payment in bKash gateway
       ├─ Get paymentID
       ├─ Save order payload to localStorage
       └─ Redirect to bKash app
   
   └─→ User enters bKash PIN
   
   └─→ bKash callback to /bkash-callback?status=success&paymentID=xxx
       ├─ POST /api/bkashexecute (verify payment)
       ├─ POST /api/orders (with paymentId & paymentStatus: "paid")
       ├─ Deduct stock
       ├─ Save order
       └─ Redirect to /thank-you
```

---

## Admin Order Management

### Viewing Orders
- **Dashboard:** `/orders` - All orders with status filter
- **Filter:** By status, search by orderNo/name/phone/email
- **Pagination:** Customizable items per page
- **Sort:** By order number or date

### Editing Orders
- **Click order** → Opens `/orders/:orderId`
- **Click "Edit Order"** → Enable edit mode
- **Can edit:**
  - Shipping info (name, phone, email, address)
  - Billing info
  - Items (add/remove/qty change)
- **Auto-calculates:** Stock adjustment, totals
- **Click "Save"** → Updates order, recalculates, saves

### Status Management
- **Single Order:** Click order, change status in UI
- **Bulk:** Select multiple orders, choose new status, apply
- **Auto-actions:**
  - Order delivered → paymentStatus becomes "paid"
  - Order cancelled → stock restored
  - Order returned → stock restored

### Courier Integration
- **After approval:** Can send to Pathao or Steadfast
- **Generates:** Consignment ID
- **Tracks:** Courier status in order details

---

## Important Notes

### Stock Management
- **Deducted:** Immediately when order created (both COD & bKash)
- **Restored:** When order moved to "cancelled" or "returned"
- **From:** `product.finalStock` OR `product.variants[].stock`
- **Not restored:** If order is just updated with fewer items (manual adjustment only)

### Coupon Validation
- **Backend validated:** Checked again on order creation
- **Rules:**
  - Must be active (status: "active")
  - Must be within date range (startDate ≤ now ≤ endDate)
  - Order amount ≥ coupon.minimumOrder
  - Type: "percentage" or "amount"
- **Capped:** Discount never exceeds subtotal

### Guest Orders
- **userId is optional** - System allows guest checkout
- **No reward points** for guests (only tracked users)
- **User phone** from shippingInfo for tracking

### Payment Processing
- **COD:** paymentStatus = "unpaid" (until delivery)
- **bKash:** paymentStatus = "paid" (after callback)
- **Manual:** Admin can set paymentStatus manually
- **Auto-paid:** Becomes "paid" when status changed to "delivered"

---

## Implementing Web Order vs Admin Order

### Current Situation
- No distinction field exists
- All orders created via same endpoint
- AdminNewOrderCreate component is empty

### Add This Field to OrderModel
```javascript
orderSource: {
  type: String,
  enum: ["web", "admin"],
  default: "web",
  required: true
}
```

### Create New Endpoint
```javascript
// routes/api.js
router.post(
  "/orders/admin/create",
  adminProtect,
  checkPermission("create_admin_orders"),
  orderController.createAdminOrder
);
```

### Modify Controller
```javascript
const createAdminOrder = async (req, res) => {
  const order = await orderService.createOrder(
    { ...orderData, orderSource: "admin" },
    userId
  );
  // Response with admin-created order
};
```

### Benefits
- Track order origin (web vs admin)
- Different business logic for each source
- Report on manual order creation patterns
- Audit trail

---

## Testing Quick Checklist

### Manual Testing
- [ ] Create order as guest (COD)
- [ ] Create order as logged-in user (COD)
- [ ] Create order with coupon
- [ ] Create order with reward points
- [ ] Create order with bKash (test payment flow)
- [ ] View order as admin
- [ ] Edit order items & shipping
- [ ] Update order status
- [ ] Delete order (verify stock restored)
- [ ] Bulk update statuses
- [ ] Bulk delete orders
- [ ] Track order publicly
- [ ] Search orders by various fields
- [ ] Filter by date range

### Stock Validation
- [ ] Stock deducted on order creation
- [ ] Stock not available → Order fails
- [ ] Stock restored on order cancellation
- [ ] Stock restored on order return
- [ ] Stock not restored if order edited to fewer items

### Payment Validation
- [ ] Invalid coupon → Rejected
- [ ] Expired coupon → Rejected
- [ ] Min order not met → Rejected
- [ ] Reward points > available → Rejected
- [ ] Negative amounts → Rejected

---

## Performance Considerations

### Database Indexes
✅ Already indexed:
- orderStatus
- shippingInfo.fullName
- shippingInfo.mobileNo
- shippingInfo.email

### Query Optimization
- Admin uses `.lean()` for list queries (faster)
- Pagination implemented (10 items default)
- Search on indexed fields
- No N+1 queries (uses proper populate)

### Improvements Possible
- Add index on userId for faster user order queries
- Add index on orderDate for range queries
- Cache order list by status (Redis)
- Implement read replicas for high-traffic queries

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Stock shows wrong quantity | Not deducted on order create | Check orderService.createOrder line 36-73 |
| Coupon not applying | Backend validation fails | Check coupon status, dates, minimum order |
| Order not created after bKash | Callback not processed | Check localStorage for order payload |
| Can't edit order items | Stock validation too strict | Allow manual stock override in edit mode |
| Order number resets | OrderCounter deleted | Recreate counter with seq starting point |
| Reward points double-deducted | User saved twice | Check createOrder line 35-38 |

