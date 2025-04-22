import React, { useState } from "react";
import {
  TextField,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableSortLabel,
} from "@mui/material";
import { Skeleton } from "@mui/material";

const AllOrders = ({ allOrders, orderListLoading, orderListError, title }) => {
  // Local state for search, pagination, sorting, and items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState("desc"); // For sorting order (ascending/descending)
  const [orderBy, setOrderBy] = useState("orderNo"); // Default sort by Order No

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(1); // Reset to the first page whenever items per page changes
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (orderBy === "orderNo") {
        return compare(a.orderNo, b.orderNo);
      }
      if (orderBy === "orderDate") {
        return compare(new Date(a.orderDate), new Date(b.orderDate));
      }
      if (orderBy === "totalAmount") {
        return compare(a.totalAmount, b.totalAmount);
      }
      if (orderBy === "shippingInfo.fullName") {
        return compare(a.shippingInfo.fullName, b.shippingInfo.fullName);
      }
      if (orderBy === "shippingInfo.mobileNo") {
        return compare(a.shippingInfo.mobileNo, b.shippingInfo.mobileNo);
      }
      if (orderBy === "orderStatus") {
        return compare(a.orderStatus, b.orderStatus);
      }
      if (orderBy === "paymentStatus") {
        return compare(a.paymentStatus, b.paymentStatus);
      }
      return 0;
    });
  };

  const compare = (a, b) => {
    if (a < b) return sortDirection === "asc" ? -1 : 1;
    if (a > b) return sortDirection === "asc" ? 1 : -1;
    return 0;
  };

  // Filter orders based on the search term
  const filteredOrders = allOrders.filter(
    (order) =>
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.mobileNo.includes(searchTerm),
  );

  // Sorting the filtered orders
  const sortedOrders = sortData(filteredOrders);

  // Pagination logic
  const paginatedOrders = sortedOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  // Calculate the range for "Showing X to Y of Z entries"
  const startEntry = (page - 1) * itemsPerPage + 1;
  const endEntry = Math.min(page * itemsPerPage, filteredOrders.length);

  // Function to get button style based on the order status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "orange", color: "white", text: "Pending" };
      case "intransit":
        return { backgroundColor: "blue", color: "white", text: "In Transit" };
      case "approved":
        return { backgroundColor: "teal", color: "white", text: "Approved" };
      case "delivered":
        return { backgroundColor: "green", color: "white", text: "Delivered" };
      case "cancelled":
        return { backgroundColor: "red", color: "white", text: "Cancelled" };
      case "returned":
        return { backgroundColor: "purple", color: "white", text: "Returned" }; // Text for returned
      default:
        return { backgroundColor: "gray", color: "white", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "unpaid":
        return { backgroundColor: "orange", color: "white", text: "Unpaid" };

      case "paid":
        return { backgroundColor: "green", color: "white", text: "Delivered" };

      default:
        return { backgroundColor: "gray", color: "white", text: "Unknown" };
    }
  };

  return (
    <div className="p-4 shadow rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        {title}
      </h1>
      <div
        className={
          "grid grid-cols-2 gap-4 shadow rounded-lg p-4 items-center mt-6 mb-6"
        }
      >
        {/* Search bar */}
        <TextField
          label="Search.."
          variant="outlined"
          onChange={handleSearchChange}
          value={searchTerm}
        />

        {/* Items per page selector */}
        <FormControl>
          <InputLabel>Items per Page</InputLabel>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            label="Items per Page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Loading and error states */}
      {orderListLoading && (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Order No",
                  "Order Date & Time",
                  "Customer",
                  "Mobile No",
                  "Status",
                  "Payment Status",
                  "Total Amount",
                ].map((header, i) => (
                  <TableCell key={i}>
                    <Skeleton variant="text" width={120} height={30} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(itemsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  {Array(7)
                    .fill()
                    .map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" width="100%" height={20} />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {orderListError && (
        <Typography color="error">{orderListError}</Typography>
      )}

      {!orderListLoading && !orderListError && (
        <div>
          {/* Orders Table */}
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "orderNo"}
                      direction={orderBy === "orderNo" ? sortDirection : "asc"}
                      onClick={() => handleSortRequest("orderNo")}
                    >
                      <Typography variant="body1">Order No</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "orderDate"}
                      direction={
                        orderBy === "orderDate" ? sortDirection : "asc"
                      }
                      onClick={() => handleSortRequest("orderDate")}
                    >
                      <Typography variant="body1">Order Date</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "shippingInfo.fullName"}
                      direction={
                        orderBy === "shippingInfo.fullName"
                          ? sortDirection
                          : "asc"
                      }
                      onClick={() => handleSortRequest("shippingInfo.fullName")}
                    >
                      <Typography variant="body1">Customer</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "shippingInfo.mobileNo"}
                      direction={
                        orderBy === "shippingInfo.mobileNo"
                          ? sortDirection
                          : "asc"
                      }
                      onClick={() => handleSortRequest("shippingInfo.mobileNo")}
                    >
                      <Typography variant="body1">Mobile No</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "orderStatus"}
                      direction={
                        orderBy === "orderStatus" ? sortDirection : "asc"
                      }
                      onClick={() => handleSortRequest("orderStatus")}
                    >
                      <Typography variant="body1">Status</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "paymentStatus"}
                      direction={
                        orderBy === "paymentStatus" ? sortDirection : "asc"
                      }
                      onClick={() => handleSortRequest("paymentStatus")}
                    >
                      <Typography variant="body1">Payment Status</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "totalAmount"}
                      direction={
                        orderBy === "totalAmount" ? sortDirection : "asc"
                      }
                      onClick={() => handleSortRequest("totalAmount")}
                    >
                      <Typography variant="body1">Total Amount</Typography>
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Typography variant="body2">
                          {" "}
                          {order.orderNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(order.orderDate)
                            .toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit", // Two-digit month (e.g., 04 for April)
                              day: "2-digit", // Two-digit day (e.g., 20)
                              hour: "2-digit", // Two-digit hour (e.g., 22)
                              minute: "2-digit", // Two-digit minute (e.g., 56)
                              second: "2-digit", // Two-digit second (e.g., 24)
                              hour12: false, // 24-hour format
                            })
                            .replace(",", "")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.shippingInfo.fullName}{" "}
                        </Typography>
                      </TableCell>
                      <TableCell>{order.shippingInfo.mobileNo}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            ...getStatusColor(order.orderStatus), // Apply dynamic styles
                            padding: "5px 10px",
                            borderRadius: "4px",
                            textAlign: "center",
                          }}
                        >
                          {getStatusColor(order.orderStatus).text}{" "}
                          {/* Display corresponding text */}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            ...getPaymentStatusColor(order.paymentStatus), // Apply dynamic styles
                            padding: "5px 10px",
                            borderRadius: "4px",
                            textAlign: "center",
                          }}
                        >
                          {getPaymentStatusColor(order.paymentStatus).text}
                          {/* Display corresponding text */}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Tk. {order.totalAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-between items-center mb-4">
            {/* Showing X to Y of Z entries */}
            <Typography variant="body2">
              Showing {startEntry} to {endEntry} of {filteredOrders.length}{" "}
              entries
            </Typography>

            {/* Pagination */}
            <Pagination
              count={Math.ceil(filteredOrders.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
