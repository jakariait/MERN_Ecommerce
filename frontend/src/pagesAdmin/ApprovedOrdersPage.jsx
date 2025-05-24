import React, { useEffect } from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AllOrders from "../component/componentAdmin/AllOrders.jsx";
import useOrderStore from "../store/useOrderStore.js";

const ApprovedOrdersPage = () => {
	const {
		orderListByStatus,
		orderListLoading,
		orderListError,
		fetchAllOrders,
		currentPage,
		itemsPerPage,
	} = useOrderStore();

	useEffect(() => {
		fetchAllOrders("approved", currentPage, itemsPerPage);
	}, [fetchAllOrders, currentPage, itemsPerPage]);

	return (
		<LayoutAdmin>
			<Breadcrumb pageDetails="ORDERS" title="View All Approved Orders" />
			<AllOrders
				allOrders={orderListByStatus.approved}
				orderListLoading={orderListLoading}
				orderListError={orderListError}
				title={"Approved Orders"}
			/>
		</LayoutAdmin>
	);
};

export default ApprovedOrdersPage;
