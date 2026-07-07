import React, { useEffect } from 'react';
import AdminSteadfastConfig from '../component/componentAdmin/AdminSteadfastConfig.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const GeneralInfoPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('WEBSITE CONFIG', 'Steadfast API');
  }, []);

  return (
    <div>
      <RequirePermission permission="steadfast_api">
        <AdminSteadfastConfig />
      </RequirePermission>
    </div>
  );
};

export default GeneralInfoPage;
