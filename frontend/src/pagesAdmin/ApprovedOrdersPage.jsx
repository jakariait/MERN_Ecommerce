import React, { useEffect } from 'react';
import AllOrders from '../component/componentAdmin/AllOrders.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const ApprovedOrdersPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('ORDERS', 'View All Approved Orders');
  }, []);

  return (
    <RequirePermission permission="view_orders">
      <AllOrders title={'Approved Orders'} status={'approved'} />
    </RequirePermission>
  );
};

export default ApprovedOrdersPage;
