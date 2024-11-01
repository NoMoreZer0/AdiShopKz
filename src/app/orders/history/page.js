"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PurchaseHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const response = await fetch("/api/orders/history", {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    toast.error("Failed to fetch purchase history.");
                }
            } catch (error) {
                console.error("Error fetching purchase history:", error);
            }
        };

        fetchPurchaseHistory();
    }, []);

    if (orders.length === 0) return <p>Loading your purchase history...</p>;

    return (
        <section className="purchase-history">
            <h2>Your Purchase History</h2>
            <div className="order-cards">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <h3>Order #{order._id}</h3>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                        <h4>Products:</h4>
                        <ul>
                            {order.products.map((item) => (
                                <li key={item.productId._id} className="product-item">
                                    <img src={item.productId.images[0]} alt={item.productId.name} className="product-purchase-history-image" />
                                    <span>{item.productId.name} (x{item.quantity}) - ${item.productId.price.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </section>
    );
}
