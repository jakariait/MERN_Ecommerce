import { useEffect } from 'react';
import AllOrders from '../component/componentAdmin/AllOrders.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const DeliveredOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('ORDERS', 'View All Delivered Orders');
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={'Delivered Orders'} status={'delivered'} />
    </RequirePermission>
  );
};

export default DeliveredOrdersPage;
