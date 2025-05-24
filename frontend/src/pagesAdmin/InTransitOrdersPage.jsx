import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const InTransitOrdersPage = () => {
	const {
		orderListByStatus,
		orderListLoading,
		orderListError,
		fetchAllOrders,
		currentPage,
		itemsPerPage,
	} = useOrderStore();

	useEffect(() => {
		fetchAllOrders("intransit", currentPage, itemsPerPage);
	}, [fetchAllOrders, currentPage, itemsPerPage]);

	return (
		<LayoutAdmin>
			<Breadcrumb pageDetails="ORDERS" title="View All In Transit Orders" />
			<AllOrders
				allOrders={orderListByStatus.intransit}
				orderListLoading={orderListLoading}
				orderListError={orderListError}
				title={"In Transit Orders"}
			/>
		</LayoutAdmin>
	);
};

export default InTransitOrdersPage;
