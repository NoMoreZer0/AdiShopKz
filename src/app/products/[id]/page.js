"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import RecommendationsScroll from "@/components/RecommendationsCarousel"

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    const addToCart = async () => {
        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: product._id, quantity: 1 }),
            });
            response.ok ? toast.success("Added to cart!") : toast.error("Please log in to add items to your cart.");
        } catch (error) {
            toast.error("Error adding to cart: " + error);
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/products?id=${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error("Failed to fetch product details");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        const incrementViewCount = async () => {
            const hasViewed = sessionStorage.getItem(`viewed_${id}`);
            if (!hasViewed) {
                try {
                    await fetch(`/api/products/${id}/view`, { method: "POST" });
                    sessionStorage.setItem(`viewed_${id}`, "true");
                } catch (error) {
                    console.error("Error incrementing view count:", error);
                }
            }
        };

        incrementViewCount();

        return () => {
            sessionStorage.removeItem(`viewed_${id}`);
        };
    }, [id]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const response = await fetch(`/api/recommendations/${id}`);
            const data = await response.json();
            setRecommendedProducts(data);
        };

        fetchRecommendations();
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div className="product-details-container">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-image-container">
                <img src={product.images[0]} alt={product.name} className="product-image-detailed" />
            </div>
            <p className="product-details-text"><strong>Category:</strong> {product.category}</p>
            <p className="product-details-text"><strong>Description:</strong> {product.description}</p>
            <p className="product-price"><strong>Price:</strong> ${product.price.toFixed(2)}</p>
            <div className="view-counter">
                <FontAwesomeIcon icon={faEye} /> {product.viewCount / 2} views
            </div>
            <div>
                <button onClick={addToCart}>Add to Cart</button>
            </div>
 
            <RecommendationsScroll recommendations={recommendedProducts} headerText="Similar Products"/>
            
            <ToastContainer position="bottom-right" autoClose={2000} />
        </div>
    );
}
