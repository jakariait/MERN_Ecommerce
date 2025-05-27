import React from "react";
import { FormControlLabel, Checkbox, Button } from "@mui/material";

const PermissionsCheckboxGroup = ({
  selectedPermissions = [],
  setSelectedPermissions,
}) => {
  const PERMISSION_OPTIONS = [
    { value: "dashboard", label: "Dashboard Access" },
    { value: "general_info", label: "General Info" },
    { value: "website_theme_color", label: "Website Theme Color" },
    { value: "social_media_link", label: "Social Media Links" },
    { value: "home_page_seo", label: "Home Page SEO" },
    { value: "setup_config", label: "Configuration Setup" },
    { value: "product_size", label: "Add Product Size" },
    { value: "product_flag", label: "Product Flag" },
    { value: "scroll_text", label: "Scroll Text" },
    { value: "delivery_charges", label: "Delivery Charges" },
    { value: "manage_coupons", label: "Manage Coupons" },
    { value: "category", label: "Category" },
    { value: "sub_category", label: "Sub Category" },
    { value: "child_category", label: "Child Category" },
    { value: "add_products", label: "Add Products" },
    { value: "view_products", label: "View Products" },
    { value: "all_orders", label: "All Orders" },
    { value: "pending_orders", label: "Pending Orders" },
    { value: "approved_orders", label: "Approved Orders" },
    { value: "in_transit_orders", label: "In Transit Orders" },
    { value: "delivered_orders", label: "Delivered Orders" },
    { value: "returned_orders", label: "Returned Orders" },
    { value: "cancelled_orders", label: "Cancelled Orders" },
    { value: "incomplete_orders", label: "Incomplete Orders" },
    { value: "delete_incomplete_orders", label: "Delete Incomplete Orders" },
    { value: "bkash_api", label: "bKash API" },
    { value: "steadfast_api", label: "Steadfast API" },
    { value: "customers", label: "Customers" },
    { value: "contact_request", label: "Contact Request" },
    { value: "subscribed_users", label: "Subscribed Users" },
    { value: "sliders-banners", label: "Sliders Banners" },
    { value: "terms-policies", label: "Terms & Policies" },
    { value: "about-us", label: "About Us" },
    { value: "faqs", label: "FAQs" },
    { value: "admin-users", label: "Admin Users" },
  ];

  const handleChange = (value) => {
    if (selectedPermissions.includes(value)) {
      setSelectedPermissions(
        selectedPermissions.filter((perm) => perm !== value),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, value]);
    }
  };

  const selectAll = () => {
    setSelectedPermissions(PERMISSION_OPTIONS.map((p) => p.value));
  };

  const removeAll = () => {
    setSelectedPermissions([]);
  };

  return (
    <div className={"mt-5"}>
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-4 pl-2 text-lg font-semibold">
        Admin Permissions
      </h1>

      <div className="mb-4 flex gap-4 items center justify-center space-x-2">
        <Button variant="outlined" size="small" onClick={selectAll}>
          Select All
        </Button>
        <h1>Permission Routes</h1>
        <Button
          variant="outlined"
          size="small"
          onClick={removeAll}
          color="error"
        >
          Remove All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
        {PERMISSION_OPTIONS.map((perm) => (
          <FormControlLabel
            key={perm.value}
            control={
              <Checkbox
                checked={selectedPermissions.includes(perm.value)}
                onChange={() => handleChange(perm.value)}
              />
            }
            label={perm.label}
          />
        ))}
      </div>
    </div>
  );
};

export default PermissionsCheckboxGroup;
