// import React from "react";
// import useAuthAdminStore from "../../store/AuthAdminStore.js";
// import { Box, Typography } from "@mui/material";
//
// const RequirePermission = ({ permission, children, fallback }) => {
//   const { admin } = useAuthAdminStore();
//   const hasPermission = admin?.permissions?.includes(permission);
//
//   if (hasPermission) {
//     return <>{children}</>;
//   }
//
//   if (fallback === true) {
//     // Silent hide
//     return null;
//   }
//
//   if (fallback) {
//     // Custom fallback UI
//     return <>{fallback}</>;
//   }
//
//   // Default message fallback
//   return (
//     <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
//       <Typography color="error">
//         You do not have permission to view this section.
//       </Typography>
//     </Box>
//   );
// };
//
// export default RequirePermission;

import React from "react";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { Box, Typography } from "@mui/material";

const RequirePermission = ({ permission, children, fallback, match = "all" }) => {
  const { admin } = useAuthAdminStore();
  const userPermissions = admin?.permissions || [];

  const requiredPermissions = Array.isArray(permission)
    ? permission
    : [permission];

  const hasPermission =
    match === "any"
      ? requiredPermissions.some((perm) => userPermissions.includes(perm))
      : requiredPermissions.every((perm) => userPermissions.includes(perm));

  if (hasPermission) {
    return <>{children}</>;
  }

  if (fallback === true) return null;
  if (fallback) return <>{fallback}</>;

  return (
    <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 1 }}>
      <Typography color="error">
        You do not have permission to access this section.
      </Typography>
    </Box>
  );
};

export default RequirePermission;
