import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ReplayIcon from "@mui/icons-material/Replay";
import CancelIcon from "@mui/icons-material/Cancel";

const statusIcons = {
  pending: <HourglassEmptyIcon color="warning" fontSize="large" />,
  approved: <TaskAltIcon color="info" fontSize="large" />,
  intransit: <LocalShippingIcon color="primary" fontSize="large" />,
  delivered: <DoneAllIcon color="success" fontSize="large" />,
  returned: <ReplayIcon color="secondary" fontSize="large" />,
  cancelled: <CancelIcon color="error" fontSize="large" />,
};

const OrderAmountSummary = ({ orders }) => {
  const statusTotals = {
    pending: 0,
    approved: 0,
    intransit: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  };

  orders?.forEach((order) => {
    const status = order.orderStatus?.toLowerCase();
    const amount = order.totalAmount || 0;
    if (statusTotals.hasOwnProperty(status)) {
      statusTotals[status] += amount;
    }
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
        lg: "repeat(6, 1fr)",
      }}
      gap={2}
      my={4}
    >
      {Object.entries(statusTotals).map(([status, amount]) => (
        <Card key={status} elevation={1}>
          <CardContent sx={{ textAlign: "center" }}>
            <Stack spacing={1} alignItems="center">
              {statusIcons[status]}
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                Total {status} Orders
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Tk. {amount.toFixed(2)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderAmountSummary;
