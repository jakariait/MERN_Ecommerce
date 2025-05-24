import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const ReturnedOrdersPage = () => {
	const {
		orderListByStatus,
		orderListLoading,
		orderListError,
		fetchAllOrders,
		currentPage,
		itemsPerPage,
	} = useOrderStore();

	useEffect(() => {
		fetchAllOrders("returned", currentPage, itemsPerPage);
	}, [fetchAllOrders, currentPage, itemsPerPage]);

	return (
		<LayoutAdmin>
			<Breadcrumb pageDetails="ORDERS" title="View All Returned Orders" />
			<AllOrders
				allOrders={orderListByStatus.returned}
				orderListLoading={orderListLoading}
				orderListError={orderListError}
				title={"Returned Orders"}
			/>
		</LayoutAdmin>
	);
};

export default ReturnedOrdersPage;
