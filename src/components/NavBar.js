"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("/api/auth/check", {
                    method: "GET",
                    credentials: "include",
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(data.authenticated);
                }
            } catch (error) {
                console.error("Error checking authentication status:", error);
            }
        };

        checkAuthStatus();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });
        setIsAuthenticated(false);
        router.push("/");
    };

    return (
        <header className="header">
            <h1>AdiShopKz</h1>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/products"> Products </Link>

                {isAuthenticated ? (
                    <>
                        <Link href="/profile" style={{ marginLeft: "1em" }}>
                            Profile
                        </Link>
                        <Link href="/orders/history" style={{ marginLeft: "1em" }}>
                            Purchase History
                        </Link>
                        <Link href="/cart">
                            <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            style={{ marginLeft: "1rem" }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ marginLeft: "1rem" }}>
                            Login
                        </Link>
                        <Link href="/register" style={{ marginLeft: "1rem" }}>
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
