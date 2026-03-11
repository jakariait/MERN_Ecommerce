# Admin Order Creation - Troubleshooting Guide

## Common Issues & Solutions

### 1. Products Not Showing in Autocomplete
**Symptoms:** Product dropdown shows "No products found" or is empty

**Causes & Solutions:**
- [ ] **Admin token not in localStorage**
  - Solution: Ensure admin is properly logged in
  - Check: Open DevTools → Application → localStorage → Look for "adminToken"
  
- [ ] **getAllProductsAdmin endpoint permission issue**
  - Solution: Admin must be authenticated
  - Check: Network tab → Look for 401 or 403 errors
  
- [ ] **Products not in database**
  - Solution: Create at least one product in admin panel first
  - Check: Go to Admin → Products → Verify products exist

- [ ] **CORS or network issue**
  - Solution: Check browser console for network errors
  - Check: Network tab → Look for Failed requests to /getAllProductsAdmin

**Debug Steps:**
```javascript
// Open browser console and run:
console.log(localStorage.getItem('adminToken')); // Should show token
console.log(import.meta.env.VITE_API_URL); // Should show API URL
```

---

### 2. Variant Not Showing for Products
**Symptoms:** Product selected but variant dropdown doesn't appear, or variants list is empty

**Causes & Solutions:**
- [ ] **Product doesn't have variants (Normal)**
  - This is fine! Products without variants still work
  - Component will use product's default finalPrice
  - No variant selector will show
  
- [ ] **Variants exist but not loading**
  - Solution: Refresh page and try again
  - Check: Browser console for API errors
  
- [ ] **Product structure mismatch**
  - Solution: Ensure product has `variants` array in database
  - Check: Database → Products → Look for variants field

---

### 3. VAT Showing as NaN or Wrong Amount
**Symptoms:** VAT % displays as "NaN" or shows incorrect value

**Causes & Solutions:**
- [ ] **VAT not configured in system**
  - Solution: Go to Admin → Settings → Configure VAT %
  - Check: Ensure VAT percentage value is set and is numeric
  
- [ ] **VAT API endpoint not responding**
  - Solution: Refresh page
  - Check: Network tab → Look for /getVatPercentage requests
  
- [ ] **Invalid VAT value format**
  - Solution: VAT must be numeric (e.g., 15, not "15%")
  - Check: Admin panel → VAT settings → Verify format

**Temporary Fix:** If VAT won't load, orders still work with 0 VAT until fixed

---

### 4. Cannot Add Product to Order
**Symptoms:** "Add" button doesn't work or shows error

**Causes & Solutions:**
- [ ] **Quantity field is empty or zero**
  - Solution: Enter quantity ≥ 1
  - Check: Quantity field is numeric
  
- [ ] **No variant selected (for products with variants)**
  - Solution: Select a variant from dropdown
  - Check: Variant selector shows options
  
- [ ] **No shipping option selected**
  - Solution: Select shipping before adding products
  - Check: Shipping dropdown has options

---

### 5. Cannot Create Order - Error Message
**Symptoms:** "Create Order" button shows error when clicked

**Possible Errors & Solutions:**

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Add at least one product" | No products added | Click "Add" to add products |
| "Select a shipping option" | No shipping selected | Choose shipping method |
| "Fill in guest information" | Guest fields empty | Fill Name, Phone, Email, Address |
| "Failed to create order" | API error | Check console for details |

**Debug:**
- Open browser console
- Try creating order again
- Look for red error messages
- Copy error text and check documentation

---

### 6. Order Created but Not Showing in List
**Symptoms:** Order created successfully but doesn't appear in order list

**Causes & Solutions:**
- [ ] **Page needs refresh**
  - Solution: Refresh the page (F5 or Cmd+R)
  - Check: Order should now appear
  
- [ ] **Filter is hiding the order**
  - Solution: Clear any active filters
  - Check: Order status filter, date filter, search filter
  
- [ ] **Order marked as different orderSource**
  - This is fine! Filter by "Admin" in Order Source column
  - Check: New column shows order source

---

### 7. Stock Not Deducting from Products
**Symptoms:** Order created but product stock remains same

**Causes & Solutions:**
- [ ] **Stock deduction is delayed**
  - Solution: Refresh page and check product detail
  - Check: May take few seconds to update
  
- [ ] **Product has variants but stock not in variant**
  - Solution: Check if variant has stock field
  - Check: Database → Product → Variants → Should have stock field
  
- [ ] **Admin order permission issue**
  - Solution: Ensure order went through /orders/admin/create endpoint
  - Check: Network tab → Verify correct endpoint used

---

### 8. Customer Not Found (Registered User Mode)
**Symptoms:** Cannot find customer when switching to registered user mode

**Causes & Solutions:**
- [ ] **No registered users in system**
  - Solution: Create test users first
  - Check: Admin → Customers → View customers
  
- [ ] **Search not working properly**
  - Solution: Try typing first/last name
  - Check: Autocomplete options appear as you type
  
- [ ] **User not retrieving from API**
  - Solution: Check admin token is valid
  - Check: Network tab → Look for errors on getAllUsers call

---

### 9. Discount Not Applied Correctly
**Symptoms:** Special discount entered but total doesn't decrease

**Causes & Solutions:**
- [ ] **Discount amount exceeds total**
  - This is normal - total will show as 0 (can't go negative)
  - Enter smaller discount amount
  
- [ ] **Discount field shows wrong format**
  - Solution: Enter numeric value only (e.g., 100, not "100 BDT")
  - Check: Field only accepts numbers

---

### 10. API Token Expired
**Symptoms:** "401 Unauthorized" or "Admin token invalid" error

**Causes & Solutions:**
- [ ] **Session expired**
  - Solution: Log out and log back in
  - Check: Login page loads successfully
  
- [ ] **Token removed from localStorage**
  - Solution: Log in again
  - Check: localStorage now has valid token

---

## Console Debugging Tips

### Enable Debug Logging
The component includes console.log statements for debugging:

```javascript
// In console, you'll see:
// - "Products fetched: [...]" - Shows product data
// - "VAT fetched: 15" - Shows VAT percentage
// - "Order created successfully" - Confirms creation
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (e.g., add product)
4. Look for API call
5. Check Response for errors

### Common Network Errors
- **404**: Endpoint not found - Check API URL
- **401**: Unauthorized - Check admin token
- **400**: Bad request - Check request data
- **500**: Server error - Check server logs

---

## Reset/Clear Cache

### If everything seems broken:
1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Del (Cmd+Shift+Del on Mac)
   - Select "All time"
   - Check "Cookies and cached images"
   - Clear data

2. **Clear localStorage:**
   - Open DevTools (F12)
   - Console tab
   - Type: `localStorage.clear()` and press Enter
   - Refresh page

3. **Log out and log in again:**
   - Logout from admin
   - Close tab
   - Open new tab
   - Login again

---

## Contact Support

If issues persist after trying solutions above:

1. **Take a screenshot** of the error
2. **Check browser console** for error messages
3. **Note the timestamp** when error occurred
4. **Describe steps** to reproduce
5. **Mention what you've tried** already

Include in bug report:
- Browser type and version
- Admin username
- Steps to reproduce
- Console error messages
- Screenshots

---

## Performance Notes

- First load may take a moment (products being fetched)
- Calculations update instantly as you modify order
- Order creation takes 2-3 seconds (normal)
- Page refresh shows new order in list

---

## FAQ

**Q: Can I create orders for guests?**
A: Yes! Toggle to "Guest Checkout" and enter customer info manually

**Q: Can I edit customer info after order creation?**
A: Yes, go to View Order → Edit Customer Details

**Q: Can I apply coupon codes?**
A: Not yet, use Special Discount field instead

**Q: What happens if I add more quantity than stock?**
A: API will reject with "Not enough stock" error

**Q: Can I undo a created order?**
A: You must delete the order (if permission allows)

**Q: Are admin orders different from web orders?**
A: Only difference is the `orderSource` field - Admin can see which orders were created manually
