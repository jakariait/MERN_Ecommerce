import { useEffect } from 'react';
import AllOrders from '../component/componentAdmin/AllOrders.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const InTransitOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('ORDERS', 'View All In Transit Orders');
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={'In Transit Orders'} status={'intransit'} />
    </RequirePermission>
  );
};

export default InTransitOrdersPage;
