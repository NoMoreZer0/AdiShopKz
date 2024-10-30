"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import RecommendationsScroll from "@/components/RecommendationsCarousel"
import Link from "next/link";

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productsForYou, setProductsForYou] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchFavorites();
        fetchCategories();
    }, [currentPage, query, category]);

    useEffect(() => {
        const fetchProductsForYou = async () => {
            try {
                const response = await fetch(`/api/recommendations/`);
                const data = await response.json();
                setProductsForYou(data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
        fetchProductsForYou();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/products?query=${query}&category=${category}&page=${currentPage}&limit=10`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchFavorites = async () => {
        const response = await fetch("/api/favorites/get", { credentials: "include" });
        if (response.ok) {
            const data = await response.json();
            setFavorites(data.map(fav => fav._id));
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/products/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const toggleFavorite = async (productId) => {
        try {
            const response = await fetch(`/api/favorites/${productId}`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                setFavorites(prevFavorites => 
                    prevFavorites.includes(productId)
                        ? prevFavorites.filter(fav => fav !== productId)
                        : [...prevFavorites, productId]
                );
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    const toggleFavoritesView = () => setShowFavorites(!showFavorites);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <section>
            <h2>Product Catalog</h2>
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-bar"
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-filter">
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <button onClick={toggleFavoritesView}>
                {showFavorites ? "Show All Products" : "Show Favorites"}
            </button>
            <div className="product-list">
                {products
                    .filter(product => !showFavorites || favorites.includes(product._id))
                    .map((product) => (
                        <div key={product._id} className="product-card">
                            <Link href={`/products/${product._id}`}>
                                <img src={product.images[0]} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>${product.price.toFixed(2)}</p>
                            </Link>
                            <button onClick={() => toggleFavorite(product._id)} className="favorite-button">
                                <FontAwesomeIcon 
                                    icon={favorites.includes(product._id) ? solidHeart : regularHeart} 
                                />
                            </button>
                        </div>
                    ))}
            </div>
            <div className="pagination-controls">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Next
                </button>
            </div>
            {/* <RecommendationsScroll recommendations={productsForYou} headerText="Products for you"/> */}
        </section>
    );
}
