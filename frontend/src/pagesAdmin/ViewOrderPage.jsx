import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ViewOrder from '../component/componentAdmin/ViewOrder.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';
import { Button } from '@/components/ui/button';

const apiUrl = import.meta.env.VITE_API_URL;

const ViewOrderPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [adjacentOrders, setAdjacentOrders] = useState({
    previous: null,
    next: null,
  });
  const [adjacentLoading, setAdjacentLoading] = useState(false);

  useEffect(() => {
    setBreadcrumb('ORDER', 'View Order');
  }, [setBreadcrumb]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !orderId) {
      setAdjacentOrders({ previous: null, next: null });
      setAdjacentLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchAdjacentOrders = async () => {
      setAdjacentLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/orders/${orderId}/adjacent`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        setAdjacentOrders({
          previous: res.data?.previous || null,
          next: res.data?.next || null,
        });
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') return;
        console.error('Failed to fetch adjacent orders:', error);
        setAdjacentOrders({ previous: null, next: null });
      } finally {
        if (!controller.signal.aborted) setAdjacentLoading(false);
      }
    };

    fetchAdjacentOrders();
    return () => controller.abort();
  }, [orderId]);

  const goToOrder = useCallback(
    (order) => {
      if (order?._id) navigate(`/admin/orders/${order._id}`);
    },
    [navigate],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.altKey) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (isTyping) return;

      if (event.key === 'ArrowLeft' && adjacentOrders.previous) {
        event.preventDefault();
        goToOrder(adjacentOrders.previous);
      } else if (event.key === 'ArrowRight' && adjacentOrders.next) {
        event.preventDefault();
        goToOrder(adjacentOrders.next);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adjacentOrders, goToOrder]);

  const navigationActions = (
    <div
      role="group"
      aria-label="Order navigation"
      aria-busy={adjacentLoading}
      className="flex w-full items-center gap-1 rounded-xl border border-border/80 bg-muted/40 p-1 shadow-sm supports-[backdrop-filter]:bg-muted/30 supports-[backdrop-filter]:backdrop-blur-sm sm:w-auto"
    >
      <span className="sr-only">
        Use Alt plus the left or right arrow key to move between orders.
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="group h-11 min-w-11 flex-1 gap-1.5 rounded-lg px-2 text-foreground transition-all duration-200 ease-out hover:bg-background hover:text-foreground hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:shadow-none sm:flex-none sm:px-3"
        disabled={adjacentLoading || !adjacentOrders.previous}
        onClick={() => goToOrder(adjacentOrders.previous)}
        aria-keyshortcuts="Alt+ArrowLeft"
        aria-label={
          adjacentOrders.previous
            ? `Previous order #${adjacentOrders.previous.orderNo}`
            : 'No previous order'
        }
        title={
          adjacentOrders.previous
            ? `Previous order #${adjacentOrders.previous.orderNo} (Alt + ←)`
            : 'No previous order'
        }
      >
        <ChevronLeft className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transform-none" />
        <span className="text-sm font-medium">
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </span>
        {adjacentOrders.previous?.orderNo && (
          <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground xl:inline">
            #{adjacentOrders.previous.orderNo}
          </span>
        )}
      </Button>

      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {adjacentLoading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <span className="h-6 w-px bg-border" />
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="group h-11 min-w-11 flex-1 gap-1.5 rounded-lg px-2 text-foreground transition-all duration-200 ease-out hover:bg-background hover:text-foreground hover:shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:shadow-none sm:flex-none sm:px-3"
        disabled={adjacentLoading || !adjacentOrders.next}
        onClick={() => goToOrder(adjacentOrders.next)}
        aria-keyshortcuts="Alt+ArrowRight"
        aria-label={
          adjacentOrders.next
            ? `Next order #${adjacentOrders.next.orderNo}`
            : 'No next order'
        }
        title={
          adjacentOrders.next
            ? `Next order #${adjacentOrders.next.orderNo} (Alt + →)`
            : 'No next order'
        }
      >
        {adjacentOrders.next?.orderNo && (
          <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground xl:inline">
            #{adjacentOrders.next.orderNo}
          </span>
        )}
        <span className="text-sm font-medium">Next</span>
        <ChevronRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transform-none" />
      </Button>

      <span className="sr-only" role="status">
        {adjacentLoading ? 'Loading order navigation' : ''}
      </span>
    </div>
  );

  return <ViewOrder headerActions={navigationActions} />;
};

export default ViewOrderPage;
