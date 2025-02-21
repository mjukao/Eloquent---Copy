import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data);
            });
    }, []);

    return (
        <div>
            <h1>Order List</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order #{order.id} - Total: ${order.total}
                        <ul>
                            {order.order_items.map(item => (
                                <li key={item.id}>{item.product.name} - Quantity: {item.quantity}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
