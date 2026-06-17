import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "../features/order/orderSlice";
import styles from "./MyOrders.module.css";
import Footer from "./Footer";
function MyOrders() {
  const dispatch = useDispatch();
  const { orderItem } = useSelector((state) => state.orderItems);

  useEffect(() => {
    dispatch(fetchOrder());
  }, [dispatch]);

  if (!orderItem) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div className={styles.ordersPage}>
      <h2 className={`mt-5 ${styles.title}`}>My Orders</h2>

      <div className={`${styles.container} mt-5`}>
        {orderItem.length === 0 ? (
          <p className={styles.empty}>No orders found</p>
        ) : (
          orderItem.map((order) => (
            <div key={order.id} className={`card mb-3 ${styles.card}`}>
              
              <div className={styles.header}>
                <strong>Order #{order.id}</strong> - Status: {order.status}
                <span className={styles.total}>
                  Total: ${order.total_price}
                </span>
              </div>

              <div className={styles.body}>
                <p className={styles.date}>
                  Order Date: {new Date(order.created_at).toLocaleDateString()}
                </p>

                <h6 className={styles.itemsTitle}>Items:</h6>

                <ul className="list-group">
                  {order.order_items?.map((item) => (
                    <li key={item.id} className={styles.item}>
                      {item.product || "Product"} - Quantity: {item.quantity} -
                      Price: ${item.price}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))
        )}
      </div>
            

    </div>
     <Footer></Footer>
     </>
  );
}

export default MyOrders;