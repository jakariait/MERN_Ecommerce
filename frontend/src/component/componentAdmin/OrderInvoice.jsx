import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import ImageComponent from '../componentGeneral/ImageComponent.jsx';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import sanitizeHtml from '../../utils/sanitizeHtml.js';
import { getVariantDisplayName } from '../../utils/variantDisplay.js';
import { Loader2, Plus, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAYMENT_STATUS_META = {
  unpaid: {
    label: 'Unpaid',
    className:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  },
  paid: {
    label: 'Paid',
    className:
      'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300',
  },
};

const PAYMENT_METHOD_TEXT = {
  cash_on_delivery: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
  card: 'Card',
};

const DELIVERY_METHOD_TEXT = {
  home_delivery: 'Home Delivery',
};

const getPaymentStatusMeta = (status) =>
  PAYMENT_STATUS_META[status] ?? {
    label: 'Unknown',
    className: 'border-border bg-muted text-muted-foreground',
  };

const getPaymentMethodText = (method) =>
  PAYMENT_METHOD_TEXT[method] ?? 'Unknown Method';

const getDeliveryMethodText = (method) =>
  DELIVERY_METHOD_TEXT[method] ?? 'Unknown Method';

const formatMoney = (value) =>
  Number(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const InvoiceSectionHeading = ({ id, children, className }) => (
  <h2
    id={id}
    className={cn(
      'flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground',
      className,
    )}
  >
    <span
      className="h-3.5 w-0.5 shrink-0 rounded-full bg-primary"
      aria-hidden="true"
    />
    {children}
  </h2>
);

const MetaRow = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4 md:justify-end md:gap-3">
    <dt className="shrink-0 text-muted-foreground">{label}</dt>
    <dd className="break-words text-right font-medium text-foreground">
      {value}
    </dd>
  </div>
);

const SummaryRow = ({
  label,
  value,
  emphasis = false,
  destructive = false,
  highlight = false,
}) => (
  <div className="flex items-baseline justify-between gap-4">
    <dt
      className={cn(
        'text-muted-foreground',
        destructive && 'text-destructive',
        (emphasis || highlight) && 'font-medium text-foreground',
      )}
    >
      {label}
    </dt>
    <dd
      className={cn(
        'tabular-nums',
        highlight
          ? 'text-lg font-semibold'
          : emphasis
            ? 'text-base font-semibold'
            : 'font-medium',
        destructive && 'text-destructive',
      )}
    >
      {value}
    </dd>
  </div>
);

const OrderInvoice = forwardRef(function OrderInvoice(
  {
    order,
    isEditMode,
    saving,
    generalInfo,
    orderStatusMeta,
    onShippingInfoChange,
    onBillingInfoChange,
    onItemQuantityChange,
    onRemoveItem,
    onSave,
    onCancel,
    onAddProduct,
  },
  ref,
) {
  const printAreaRef = useRef(null);

  const paymentStatus = getPaymentStatusMeta(order.paymentStatus);
  const items = order.items ?? [];
  const itemCount = items.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const columnCount = isEditMode ? 8 : 7;

  const handlePrint = useCallback(() => {
    const content = printAreaRef.current;
    if (!content) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      return;
    }

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1000);
    };

    doc.open();
    doc.write(`
    <html><head><title>Print Invoice</title><style>
    body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1; margin: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
    img { width: 100px; }
    #firstRow, #secondRow { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    #thirdRow { display: flex; justify-content: space-between; margin-top: 20px; }
    button, .no-print { display: none !important; }
    #thirdRowRight, #secondRowRight { text-align: right; }
    </style></head><body>${sanitizeHtml(content.innerHTML)}</body></html>
  `);
    doc.close();
  }, []);

  useImperativeHandle(ref, () => ({ print: handlePrint }), [handlePrint]);

  return (
    <Card
      role="region"
      aria-label="Order invoice"
      className="overflow-hidden border border-border/60 py-0 shadow-sm"
    >
      <CardContent
        className="space-y-8 p-4 sm:p-6 lg:p-8"
        id="print-area"
        ref={printAreaRef}
      >
        <div
          id="firstRow"
          className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border/60 pb-6 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"
        >
          <p className="col-start-1 row-start-1 min-w-0 text-lg font-semibold tracking-tight sm:text-2xl">
            {generalInfo?.CompanyName ?? ''}
          </p>
          <div className="col-span-2 row-start-2 flex h-14 w-40 max-w-full items-center justify-start sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-48 sm:justify-center">
            <ImageComponent
              imageName={generalInfo?.PrimaryLogo}
              className="max-h-14 w-auto max-w-full object-contain"
              skeletonHeight={56}
              altName={generalInfo?.CompanyName || 'Company logo'}
              fetchpriority="high"
            />
          </div>
          <span className="col-start-2 row-start-1 justify-self-end text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:col-start-3 sm:text-xl">
            Invoice
          </span>
        </div>

        <div id="secondRow" className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="shipping-heading" className="min-w-0">
            <InvoiceSectionHeading id="shipping-heading">
              Shipping Info
            </InvoiceSectionHeading>
            <div className="mt-3">
              {isEditMode ? (
                <div className="space-y-3">
                  <Input
                    aria-label="Recipient full name"
                    placeholder="Full Name"
                    name="fullName"
                    value={order?.shippingInfo?.fullName ?? ''}
                    onChange={onShippingInfoChange}
                    className="h-11"
                  />
                  <Input
                    aria-label="Recipient mobile number"
                    placeholder="Mobile No"
                    name="mobileNo"
                    value={order?.shippingInfo?.mobileNo ?? ''}
                    onChange={onShippingInfoChange}
                    className="h-11"
                  />
                  <Input
                    aria-label="Recipient email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={order?.shippingInfo?.email ?? ''}
                    onChange={onShippingInfoChange}
                    className="h-11"
                  />
                  <Textarea
                    aria-label="Shipping address"
                    placeholder="Address"
                    name="address"
                    value={order?.shippingInfo?.address ?? ''}
                    onChange={onShippingInfoChange}
                    rows={2}
                    className="min-h-20 resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    {order.shippingInfo?.fullName || 'N/A'}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingInfo?.mobileNo || 'N/A'}
                  </p>
                  <p className="break-all text-muted-foreground">
                    {order.shippingInfo?.email || 'N/A'}
                  </p>
                  <p className="break-words text-muted-foreground">
                    {order.shippingInfo?.address || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section id="secondRowRight" aria-labelledby="order-info-heading">
            <InvoiceSectionHeading
              id="order-info-heading"
              className="md:justify-end"
            >
              Order Info
            </InvoiceSectionHeading>
            <dl className="mt-3 space-y-2 text-sm">
              <MetaRow label="Order No" value={`#${order.orderNo ?? 'N/A'}`} />
              <MetaRow
                label="Order Date"
                value={
                  order?.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : 'N/A'
                }
              />
              <div className="flex items-center justify-between gap-4 md:justify-end md:gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <Badge className={cn('border', orderStatusMeta.className)}>
                    {orderStatusMeta.label}
                  </Badge>
                </dd>
              </div>
              <MetaRow
                label="Payment Method"
                value={getPaymentMethodText(order.paymentMethod)}
              />
              <div className="flex items-center justify-between gap-4 md:justify-end md:gap-3">
                <dt className="text-muted-foreground">Payment Status</dt>
                <dd>
                  <Badge className={cn('border', paymentStatus.className)}>
                    {paymentStatus.label}
                  </Badge>
                </dd>
              </div>
              {order.paymentId && (
                <MetaRow label="Payment ID" value={order.paymentId} />
              )}
              {order.transId && (
                <MetaRow label="Transaction ID" value={order.transId} />
              )}
              <MetaRow
                label="Delivery Method"
                value={getDeliveryMethodText(order.deliveryMethod)}
              />
            </dl>
          </section>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <InvoiceSectionHeading>Items</InvoiceSectionHeading>
            <span className="text-xs tabular-nums text-muted-foreground">
              {items.length} {items.length === 1 ? 'line' : 'lines'} ·{' '}
              {itemCount} {itemCount === 1 ? 'unit' : 'units'}
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/60 print:overflow-visible">
            <Table
              aria-label="Order items"
              className="min-w-[720px] print:min-w-0"
            >
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    scope="col"
                    className="w-12 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    SL
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="w-16 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Image
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Item
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Variant
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Qty
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Unit Cost
                  </TableHead>
                  <TableHead
                    scope="col"
                    className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Total
                  </TableHead>
                  {isEditMode && (
                    <TableHead
                      scope="col"
                      className="no-print text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const product = item.product || item.productId;
                  const variant = product?.variants?.[0];
                  const totalPrice = item.price * item.quantity;

                  return (
                    <TableRow
                      key={item._id || index}
                      className="transition-colors"
                    >
                      <TableCell className="tabular-nums text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {product?.images?.[0] ? (
                          <ImageComponent
                            imageName={product.images[0]}
                            className="size-12 rounded-md border border-border/60 object-cover"
                            skeletonHeight={48}
                            width={48}
                            height={48}
                            altName={product?.name}
                          />
                        ) : (
                          <div
                            className="size-12 rounded-md bg-muted"
                            aria-hidden="true"
                          />
                        )}
                      </TableCell>
                      <TableCell className="max-w-56">
                        <div className="truncate font-medium text-foreground">
                          {product?.name || 'Unknown Product'}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          Category: {product?.category?.name || 'N/A'}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          Code: {product?.productCode || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {variant ? getVariantDisplayName(variant) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditMode ? (
                          <Input
                            type="number"
                            min={1}
                            aria-label={`Quantity for ${product?.name || 'item'}`}
                            value={item.quantity}
                            onChange={(e) =>
                              onItemQuantityChange(index, e.target.value)
                            }
                            className="ml-auto h-11 w-20 text-right"
                          />
                        ) : (
                          <span className="tabular-nums">{item.quantity}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(item?.price)}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatMoney(totalPrice)}
                      </TableCell>
                      {isEditMode && (
                        <TableCell className="no-print text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItem(index)}
                            aria-label={`Remove ${product?.name || 'item'} from order`}
                            className="h-11 w-11 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/30"
                          >
                            <X className="size-4" aria-hidden="true" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
                {items.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={columnCount}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No items in this order.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {isEditMode && (
            <div className="mt-4 flex justify-start">
              <Button
                type="button"
                onClick={onAddProduct}
                className="h-11 gap-2 sm:h-10"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add Product
              </Button>
            </div>
          )}
        </div>

        <div id="thirdRow" className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="billing-heading" className="min-w-0">
            <InvoiceSectionHeading id="billing-heading">
              Billing Address
            </InvoiceSectionHeading>
            <div className="mt-3">
              {isEditMode ? (
                <div className="space-y-3">
                  <Input
                    aria-label="Billing full name"
                    placeholder="Full Name"
                    name="fullName"
                    value={order.billingInfo?.fullName || ''}
                    onChange={onBillingInfoChange}
                    className="h-11"
                  />
                  <Textarea
                    aria-label="Billing address"
                    placeholder="Address"
                    name="address"
                    value={order.billingInfo?.address || ''}
                    onChange={onBillingInfoChange}
                    rows={2}
                    className="min-h-20 resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    {order.billingInfo?.fullName ||
                      order.shippingInfo?.fullName ||
                      'N/A'}
                  </p>
                  <p className="break-words text-muted-foreground">
                    {order.billingInfo?.address ||
                      order.shippingInfo?.address ||
                      'N/A'}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section
            id="thirdRowRight"
            aria-labelledby="totals-heading"
            className="w-full md:max-w-sm md:justify-self-end"
          >
            <InvoiceSectionHeading
              id="totals-heading"
              className="md:justify-end"
            >
              Payment Summary
            </InvoiceSectionHeading>
            <dl className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm shadow-sm sm:p-5">
              <SummaryRow
                label="Sub-total"
                value={`Tk. ${formatMoney(order?.subtotalAmount)}`}
              />
              {(order?.promoDiscount ?? 0) > 0 && (
                <SummaryRow
                  label="Promo Discount"
                  value={`Tk. ${formatMoney(order?.promoDiscount)}`}
                />
              )}
              {(order?.rewardPointsUsed ?? 0) > 0 && (
                <SummaryRow
                  label="Reward Points Used"
                  value={order?.rewardPointsUsed ?? 0}
                />
              )}
              {(order?.vat ?? 0) > 0 && (
                <SummaryRow
                  label="VAT / Tax"
                  value={`Tk. ${formatMoney(order?.vat)}`}
                />
              )}
              <SummaryRow
                label="Delivery Charge"
                value={`Tk. ${formatMoney(order?.deliveryCharge)}`}
              />
              {(order?.specialDiscount ?? 0) > 0 && (
                <SummaryRow
                  label="Special Discount"
                  value={`Tk. ${formatMoney(order?.specialDiscount)}`}
                />
              )}
              <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
                <SummaryRow
                  label="Total Order Amount"
                  value={`Tk. ${formatMoney(order?.totalAmount)}`}
                  emphasis
                />
                {(order?.advanceAmount ?? 0) > 0 && (
                  <SummaryRow
                    label="Advance"
                    value={`Tk. ${formatMoney(order?.advanceAmount)}`}
                    destructive
                  />
                )}
                <SummaryRow
                  label="Total Due Amount"
                  value={`Tk. ${formatMoney(order?.dueAmount)}`}
                  highlight
                />
              </div>
            </dl>
          </section>
        </div>

        {isEditMode && (
          <div className="flex flex-col gap-2 border-t border-border/60 pt-6 no-print sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="h-11 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSave}
              disabled={saving}
              aria-busy={saving}
              className="h-11 min-w-40 gap-2 transition-transform active:scale-[0.99] sm:h-10"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="size-4" aria-hidden="true" />
              )}
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default OrderInvoice;
