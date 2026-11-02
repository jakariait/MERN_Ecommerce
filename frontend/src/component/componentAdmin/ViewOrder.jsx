import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useGeneralInfoStore from '../../store/GeneralInfoStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import OrderInvoice from './OrderInvoice.jsx';
import { getVariantDisplayName } from '../../utils/variantDisplay.js';
import OrderStatusUpdate from './OrderStatusUpdate.jsx';
import CourierStats from './CourierStats.jsx';
import RequirePermission from './RequirePermission.jsx';
import { debounce } from 'lodash';
import { AlertCircle, Loader2, Pencil, Printer, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const apiUrl = import.meta.env.VITE_API_URL;

const STATUS_META = {
  pending: {
    label: 'Pending',
    className:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  },
  intransit: {
    label: 'In Transit',
    className:
      'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
  },
  approved: {
    label: 'Approved',
    className:
      'border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300',
  },
  delivered: {
    label: 'Delivered',
    className:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  },
  cancelled: {
    label: 'Cancelled',
    className:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
  },
  returned: {
    label: 'Returned',
    className:
      'border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300',
  },
};

const getStatusMeta = (status) =>
  STATUS_META[status] ?? {
    label: 'Unknown',
    className: 'border-border bg-muted text-muted-foreground',
  };

const OrderLoadingSkeleton = () => (
  <div className="space-y-6" aria-busy="true" aria-live="polite">
    <span className="sr-only">Loading order details</span>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32" />
        <Skeleton className="h-11 w-32" />
      </div>
    </div>
    <Card className="border border-border/60 shadow-sm">
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-2 sm:ml-auto sm:w-52">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-56 w-full" />
      </CardContent>
    </Card>
  </div>
);

const OrderErrorState = ({ message, onRetry }) => (
  <Card className="mx-auto w-full max-w-lg border-destructive/20 shadow-sm">
    <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Could not load this order</h2>
        <p role="alert" className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
      <Button type="button" onClick={onRetry} className="h-11">
        Try again
      </Button>
    </CardContent>
  </Card>
);

const ViewOrder = ({ headerActions = null }) => {
  const invoiceRef = useRef(null);
  const productSearchRequestId = useRef(0);

  const { GeneralInfoList } = useGeneralInfoStore();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);
  const [editableOrder, setEditableOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePrint = useCallback(() => {
    invoiceRef.current?.print();
  }, []);

  const fetchOrder = useCallback(
    async (signal, { showLoading = true } = {}) => {
      try {
        if (showLoading) setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) throw new Error('You are not authenticated.');

        const res = await axios.get(`${apiUrl}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });

        if (signal?.aborted) return;

        setOrder(res.data.order);
        const editable = JSON.parse(JSON.stringify(res.data.order));
        if (!editable.billingInfo) {
          editable.billingInfo = { ...editable.shippingInfo };
        }
        setEditableOrder(editable);
      } catch (err) {
        if (err?.code === 'ERR_CANCELED' || signal?.aborted) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch order details.',
        );
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchOrder(controller.signal);
    return () => controller.abort();
  }, [fetchOrder]);

  const handleEditToggle = () => {
    if (isEditMode) {
      const editable = JSON.parse(JSON.stringify(order));
      if (!editable.billingInfo) {
        editable.billingInfo = { ...editable.shippingInfo };
      }
      setEditableOrder(editable);
    }
    setIsEditMode(!isEditMode);
  };

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({
      ...prev,
      shippingInfo: { ...prev.shippingInfo, [name]: value },
    }));
  };

  const handleBillingInfoChange = (e) => {
    const { name, value } = e.target;
    setEditableOrder((prev) => ({
      ...prev,
      billingInfo: { ...prev.billingInfo, [name]: value },
    }));
  };

  const handleItemQuantityChange = (index, quantity) => {
    const newQuantity = Math.max(1, Number(quantity) || 1);
    setEditableOrder((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: newQuantity } : item,
      ),
    }));
  };

  const handleRemoveItem = (index) => {
    setEditableOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const debouncedProductSearch = useMemo(
    () =>
      debounce(async (query) => {
        const requestId = ++productSearchRequestId.current;
        setProductSearchLoading(true);
        try {
          const res = await axios.get(
            `${apiUrl}/getAllProductsAdmin?search=${encodeURIComponent(query)}`,
          );
          if (requestId !== productSearchRequestId.current) return;
          setSearchedProducts(res.data.products || []);
        } catch (searchError) {
          if (requestId !== productSearchRequestId.current) return;
          console.error('Failed to search products:', searchError);
          setSearchedProducts([]);
        } finally {
          if (requestId === productSearchRequestId.current) {
            setProductSearchLoading(false);
          }
        }
      }, 500),
    [],
  );

  useEffect(() => {
    if (isAddProductModalOpen) {
      debouncedProductSearch(productSearchQuery);
    }
    return () => debouncedProductSearch.cancel();
  }, [productSearchQuery, debouncedProductSearch, isAddProductModalOpen]);

  const handleAddProduct = (product, variant = null) => {
    const price = variant
      ? variant.discount || variant.price
      : product.finalDiscount > 0
        ? product.finalDiscount
        : product.finalPrice;

    const newItem = {
      productId: product._id,
      variantId: variant ? variant._id : undefined,
      quantity: 1,
      price: price,
      product: {
        _id: product._id,
        name: product.name,
        productCode: product.productCode || product.code,
        category: { name: product.category?.name },
        variants: variant ? [variant] : [],
      },
    };

    setEditableOrder((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    setAddProductModalOpen(false);
    setProductSearchQuery('');
    setSearchedProducts([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const updatePayload = {
        shippingInfo: editableOrder.shippingInfo,
        billingInfo: editableOrder.billingInfo,
        items: editableOrder.items.map(
          ({ productId, variantId, quantity, price }) => ({
            productId:
              typeof productId === 'object' ? productId._id : productId,
            variantId:
              typeof variantId === 'object' && variantId !== null
                ? variantId._id
                : variantId,
            quantity,
            price,
          }),
        ),
      };

      await axios.put(`${apiUrl}/orders/${orderId}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsEditMode(false);
      await fetchOrder(undefined, { showLoading: false });
      toast.success('Order updated successfully.');
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to update order.',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <OrderLoadingSkeleton />;
  if (error) {
    return <OrderErrorState message={error} onRetry={() => fetchOrder()} />;
  }
  if (!order) return null;

  const currentOrderData = isEditMode ? editableOrder : order;
  if (!currentOrderData) return null;

  const orderStatus = getStatusMeta(currentOrderData.orderStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Order Details
            </h1>
            {currentOrderData.orderNo && (
              <Badge
                variant="outline"
                className="font-mono text-xs tabular-nums text-muted-foreground"
              >
                #{currentOrderData.orderNo}
              </Badge>
            )}
            <Badge className={cn('border', orderStatus.className)}>
              {orderStatus.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Review customer information, ordered items, and payment details.
          </p>
        </div>

        <div className="flex flex-col gap-2 no-print sm:items-end">
          {headerActions}
          <div className="flex items-center gap-2">
            <RequirePermission permission="edit_orders">
              <Button
                type="button"
                variant="outline"
                onClick={handleEditToggle}
                disabled={saving}
                className="h-11 flex-1 gap-2 px-4 sm:h-10 sm:flex-none"
              >
                {isEditMode ? (
                  <X className="size-4" aria-hidden="true" />
                ) : (
                  <Pencil className="size-4" aria-hidden="true" />
                )}
                {isEditMode ? 'Cancel' : 'Edit Order'}
              </Button>
            </RequirePermission>
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrint}
              className="h-11 flex-1 gap-2 px-3 sm:h-10 sm:flex-none"
            >
              <Printer className="size-4" aria-hidden="true" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>

      <OrderInvoice
        ref={invoiceRef}
        order={currentOrderData}
        isEditMode={isEditMode}
        saving={saving}
        generalInfo={GeneralInfoList}
        orderStatusMeta={orderStatus}
        onShippingInfoChange={handleShippingInfoChange}
        onBillingInfoChange={handleBillingInfoChange}
        onItemQuantityChange={handleItemQuantityChange}
        onRemoveItem={handleRemoveItem}
        onSave={handleSave}
        onCancel={handleEditToggle}
        onAddProduct={() => setAddProductModalOpen(true)}
      />

      <RequirePermission permission="edit_orders">
        <OrderStatusUpdate
          orderId={order._id}
          onUpdate={() => fetchOrder(undefined, { showLoading: false })}
        />
      </RequirePermission>

      <CourierStats phone={order?.shippingInfo?.mobileNo ?? ''} />

      <Dialog
        open={isAddProductModalOpen}
        onOpenChange={(open) => {
          setAddProductModalOpen(open);
          if (!open) {
            productSearchRequestId.current += 1;
            setProductSearchQuery('');
            setSearchedProducts([]);
            setProductSearchLoading(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Product to Order</DialogTitle>
            <DialogDescription>
              Search for a product by name or code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                autoFocus
                type="search"
                aria-label="Search products by name or code"
                placeholder="Search products by name or code…"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="h-11 pl-9 pr-10"
              />
              {productSearchLoading && (
                <Loader2
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
            <span role="status" className="sr-only">
              {productSearchLoading ? 'Searching products' : ''}
            </span>
            <div className="max-h-[400px] overflow-auto rounded-lg border border-border/60">
              <Table aria-label="Product search results">
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Product</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="w-28 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSearchLoading ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Searching…
                      </TableCell>
                    </TableRow>
                  ) : searchedProducts.length > 0 ? (
                    searchedProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {product.variants && product.variants.length > 0
                            ? 'Multiple Variants'
                            : `Stock: ${product.finalStock}`}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (
                                product.variants &&
                                product.variants.length > 0
                              ) {
                                setSelectedProduct(product);
                              } else {
                                handleAddProduct(product);
                              }
                            }}
                            disabled={
                              !product.variants?.length &&
                              product.finalStock < 1
                            }
                            className="h-11 sm:h-8"
                          >
                            {product.variants && product.variants.length > 0
                              ? 'Select Variant'
                              : 'Add'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-muted-foreground"
                      >
                        {productSearchQuery.length > 1
                          ? 'No products found.'
                          : 'Type to search.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddProductModalOpen(false)}
              className="h-11 sm:h-9"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Select Variant for {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Choose a variant to add to this order.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table aria-label="Product variants">
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Variant</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-28 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProduct?.variants?.map((variant) => (
                  <TableRow key={variant._id}>
                    <TableCell>{getVariantDisplayName(variant)}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {variant.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          handleAddProduct(selectedProduct, variant);
                          setSelectedProduct(null);
                        }}
                        disabled={variant.stock < 1}
                        className="h-11 sm:h-8"
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedProduct(null)}
              className="h-11 sm:h-9"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewOrder;
