"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            const response = await fetch("/api/cart/get", { credentials: "include" });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            } else {
                toast.error("Please log in to view your cart.");
            }
        };

        fetchCart();
    }, []);

    const handleCheckout = async () => {
        const response = await fetch("/api/orders", {
            method: "POST",
            credentials: "include",
        });
        if (response.ok) {
            toast.success("Order placed successfully!");
            setTimeout(() => {
                setCart(null)
            }, 2000)
        } else {
            toast.error("Failed to place order.");
        }
    };

    if (!cart) return <p>Loading cart...</p>;

    const totalCost = cart.products.reduce((total, item) => total + item.productId.price * item.quantity, 0);

    return (
        <section className="cart-container">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cart.products.map((item) => (
                    <div key={item.productId._id} className="cart-item">
                        <img src={item.productId.images[0]} alt={item.productId.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.productId.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.productId.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total">
                <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
                <button onClick={handleCheckout} className="checkout-button">Checkout</button>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </section>
    );
}
