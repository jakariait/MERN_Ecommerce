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
      return;
    }

    let isCancelled = false;
    const fetchAdjacentOrders = async () => {
      setAdjacentLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/orders/${orderId}/adjacent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!isCancelled) {
          setAdjacentOrders({
            previous: res.data?.previous || null,
            next: res.data?.next || null,
          });
        }
      } catch (error) {
        console.error('Failed to fetch adjacent orders:', error);
        if (!isCancelled) {
          setAdjacentOrders({ previous: null, next: null });
        }
      } finally {
        if (!isCancelled) setAdjacentLoading(false);
      }
    };

    fetchAdjacentOrders();
    return () => {
      isCancelled = true;
    };
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
    <div className="flex items-center gap-2">
      <div
        role="group"
        aria-label="Order navigation"
        className="flex items-center rounded-lg border bg-background p-0.5 shadow-sm"
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={adjacentLoading || !adjacentOrders.previous}
          onClick={() => goToOrder(adjacentOrders.previous)}
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
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={adjacentLoading || !adjacentOrders.next}
          onClick={() => goToOrder(adjacentOrders.next)}
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
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {adjacentLoading && (
        <Loader2
          className="size-4 animate-spin text-muted-foreground"
          aria-label="Loading order navigation"
        />
      )}
    </div>
  );

  return <ViewOrder headerActions={navigationActions} />;
};

export default ViewOrderPage;
