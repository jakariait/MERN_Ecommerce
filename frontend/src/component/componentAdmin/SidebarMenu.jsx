import {
  FaHome,
  FaPalette,
  FaLink,
  FaSearch,
  FaCog,
  FaThLarge,
  FaBoxes,
  FaList,
  FaTags,
  FaCreditCard,
  FaUsers,
  FaTruck,
  FaMoneyBill,
  FaTicketAlt,
  FaEnvelope,
  FaUserFriends,
  FaSlidersH,
  FaQuoteRight,
  FaNewspaper,
  FaFileAlt,
  FaInfoCircle,
  FaQuestionCircle,
  FaUserShield,
  FaLock,
  FaUserCheck,
  FaSignOutAlt,
  FaTrash,
  FaShoppingBag,
  FaGift,
  FaInfo,
  FaClipboardList,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useProductStore from "../../store/useProductStore.js";
import useOrderStore from "../../store/useOrderStore.js";
import { useEffect } from "react";

export default function SidebarMenu() {
  const { totalProductsAdmin } = useProductStore();
  const { logout } = useAuthAdminStore();
  const { totalByStatus } = useOrderStore();

  // To access delivered count
  const pendingCount = totalByStatus.pending;
  const approvedCount = totalByStatus.approved;
  const intransitCount = totalByStatus.intransit;
  const deliveredCount = totalByStatus.delivered;
  const returnedCount = totalByStatus.returned;
  const cancelledCount = totalByStatus.cancelled;

  const totalOrders = Object.values(totalByStatus).reduce(
    (acc, count) => acc + count,
    0,
  );

  const navigate = useNavigate();
  // Logout function to clear the admin state and navigate to login
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };
  return (
    <div className="w-fit p-4 h-screen overflow-y-auto ">
      {/* Dashboard */}
      <ul>
        <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
          <Link to="/admin/dashboard" className={"flex items-center gap-2"}>
            <FaHome /> <span>Dashboard</span>
          </Link>
        </li>
      </ul>

      {/* Website Config */}
      <div className="mt-4">
        <h3 className="text-yellow-400 text-sm font-semibold mb-2">
          WEBSITE CONFIG
        </h3>
        <ul className="space-y-1">
          <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
            <Link
              to="/admin/general-info"
              className={"flex items-center gap-2"}
            >
              <FaThLarge /> <span>General Info</span>
            </Link>
          </li>
          <Link to="/admin/color-updater/">
            <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
              <FaPalette /> <span>Website Theme Color</span>
            </li>
          </Link>

          <Link to="/admin/social-link-updater">
            <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
              <FaLink /> <span>Social Media Links</span>
            </li>
          </Link>
          <Link to="/admin/homepage-seo">
            <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
              <FaSearch /> <span>Home Page SEO</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* E-Commerce Modules */}
      <div className="mt-4">
        <h3 className="text-yellow-400 text-sm font-semibold mb-2">
          E-COMMERCE MODULES
        </h3>
        <ul className="space-y-1">
          <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaCog /> <span>Config</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/configsetup">Setup Your Config</Link>
                  </li>
                  <li>
                    <Link to="/admin/add-product-size">
                      Add New Product Size
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/product-sizes">View All Product Size</Link>
                  </li>
                  <li>
                    <Link to="/admin/product-flags">Product Flags</Link>
                  </li>
                  <li>
                    <Link to="/admin/scroll-text">Scroll Text</Link>
                  </li>
                  <li>
                    <Link to="/admin/deliverycharge">
                      <span>Delivery Charges</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/coupon">
                      <span>Coupon</span>
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>
          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaThLarge /> <span>Category</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/addnewcategory">Add New Category</Link>
                  </li>
                  <li>
                    <Link to="/admin/categorylist">View All Categories</Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>
          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaBoxes /> <span>Subcategory</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/addnewsubcategory">
                      Add New Sub Category
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/subcategorylist">
                      View All SubCategories
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>
          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaList /> <span>Child Category</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/addnewchildcategory">
                      Add New Child Category
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/childcategorylist">
                      View All Child Categories
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>
          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaTags /> <span>Manage Products</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/addnewproduct">Add New Product</Link>
                  </li>
                  <li>
                    <Link to="/admin/viewallproducts">
                      View All Products({totalProductsAdmin})
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaShoppingBag /> <span>Manage Orders</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link to="/admin/allorders">
                      All Orders ({totalOrders})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/pendingorders">
                      Pending Orders ({pendingCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/approvedorders">
                      Approved Orders ({approvedCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/intransitorders">
                      In Transit Orders ({intransitCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/deliveredorders">
                      Delivered Orders ({deliveredCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/returnedorders">
                      Returned Orders ({returnedCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/cancelledorders">
                      Cancelled Orders ({cancelledCount})
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>
          <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
            <Link
              to="/admin/incomplete-order"
              className={"flex items-center gap-2"}
            >
              <FaClipboardList /> <span>Incomplete Order</span>
            </Link>
          </li>

          <li className="space-x-2 px-2 rounded-md cursor-pointer">
            <Accordion
              style={{
                background: "transparent",
                boxShadow: "none",
                width: "100%",
              }}
              sx={{
                color: "white", // Ensures text color is white
                "& .MuiAccordionSummary-root": {
                  backgroundColor: "transparent",
                  minHeight: "auto", // Removes unnecessary padding
                  padding: "0", // Removes default padding
                },
                "& .MuiAccordionDetails-root": {
                  backgroundColor: "transparent",
                  paddingLeft: "0", // Ensures no extra left padding
                },
                "& .MuiSvgIcon-root": {
                  color: "white", // Ensures the dropdown icon is white
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                className="p-2 flex items-center"
              >
                <Typography component="span">
                  <div className="flex items-center gap-2">
                    <FaCreditCard /> <span>Gateway & API</span>
                  </div>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ul className={"space-y-2 pl-4"}>
                  <li>
                    <Link
                      to="/admin/bkash-config"
                      className={"flex items-center gap-2"}
                    >
                      <span>bKash</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/steadfast-config"
                      className={"flex items-center gap-2"}
                    >
                      <span>Steadfast</span>
                    </Link>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>
          </li>

          <li>
            <Link
              to="/admin/customers"
              className="flex items-center space-x-2 p-2 rounded-md cursor-pointer"
            >
              <FaUsers /> <span>Customers</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Other Sections */}
      <div className="mt-4">
        <h3 className="text-yellow-400 text-sm font-semibold mb-2">
          CRM MODULES
        </h3>
        <ul>
          <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
            <FaTicketAlt /> <span>Support Ticket</span>
          </li>
          <Link to="/admin/contact-request">
            <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
              <FaEnvelope /> <span>Contact Request</span>
            </li>
          </Link>

          <Link to="/admin/subscribed-users">
            {" "}
            <li className="flex items-center space-x-2 p-2 rounded-md cursor-pointer">
              <FaUserFriends /> <span>Subscribed Users</span>
            </li>
          </Link>
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-yellow-400 text-sm font-semibold mb-2">
          CONTENT MANAGEMENT
        </h3>
        <ul>
          {[
            {
              icon: <FaSlidersH />,
              label: "Sliders & Banners",
              to: "/admin/sliders-banners",
            },
            {
              icon: <FaQuoteRight />,
              label: "Testimonial",
              to: "/admin/testimonials",
            },
            {
              icon: <FaFileAlt />,
              label: "Terms & Policies",
              to: "/admin/terms-policies",
            },
            ,
            { icon: <FaQuestionCircle />, label: "FAQs", to: "/admin/faqs" },
            { icon: <FaInfo />, label: "About Us", to: "/admin/about-us" },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 p-2 rounded-md cursor-pointer"
            >
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center space-x-2 w-full"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  {item.icon}
                  <span>{item.label}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-yellow-400 text-sm font-semibold mb-2">
          USER ROLE PERMISSION
        </h3>
        <ul>
          {[
            { icon: <FaUserShield />, label: "System Users", path: "/admin/adminlist" },
            { icon: <FaLock />, label: "Permission Routes", path: "/admin/permission-routes" },
            { icon: <FaUserCheck />, label: "Assign Role Permission", path: "/admin/assign-permission" },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center space-x-2 p-2 rounded-md cursor-pointer "
            >
              {item.icon}
              <Link to={item.path} className="text-inherit no-underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout and Others */}
      <div>
        <ul>
          <li className="flex items-center space-x-2 p-2 rounded-md text-red-500 cursor-pointer">
            <button
              onClick={handleLogout}
              className={"flex items-center space-x-2 cursor-pointer"}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
