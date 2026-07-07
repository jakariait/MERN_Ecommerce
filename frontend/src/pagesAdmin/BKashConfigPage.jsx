import React, { useEffect } from 'react';
import AdminBkashConfig from '../component/componentAdmin/AdminBkashConfig.jsx';
import RequirePermission from '../component/componentAdmin/RequirePermission.jsx';
import useBreadcrumbStore from '../store/BreadcrumbStore.js';

const GeneralInfoPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb('WEBSITE CONFIG', 'bKash Configuration');
  }, []);

  return (
    <div>
      {/* Form Section */}
      <RequirePermission permission="bkash_api">
        <AdminBkashConfig />
      </RequirePermission>
    </div>
  );
};

export default GeneralInfoPage;
