import React, { useEffect, useState } from "react";
import { apiGetUserOrders } from "../../../../services/productService";
import { useSearchParams } from "react-router-dom";

const MyOrder = () => {
  const [params] = useSearchParams();
  const [order, setOrder] = useState("");
  const [count, setCount] = useState(0);
  const fetchApiGetOrders = async (params) => {
    const response = await apiGetUserOrders({
      ...params,
    });
    console.log(response);
    if (response.success) {
      setCount(response.counts);
      setOrder(response.order);
    }
  };
  useEffect(() => {
    fetchApiGetOrders();
  }, []);
  return <div>MyOrder</div>;
};

export default MyOrder;
