import React, { useEffect } from "react";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import AdminPathaoConfig from "../component/componentAdmin/AdminPathaoConfig.jsx";
import useBreadcrumbStore from "../store/BreadcrumbStore.js";

const PathaoConfigPage = () => {
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb("WEBSITE CONFIG", "Pathao API");
  }, []);

  return (
    <div>
      <RequirePermission permission="pathao_api">
        <AdminPathaoConfig />
      </RequirePermission>
    </div>
  );
};

export default PathaoConfigPage;
