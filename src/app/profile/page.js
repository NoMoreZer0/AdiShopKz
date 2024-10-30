"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        deliveryAddress: ""
    });
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser({
                        name: data.user.name || "",
                        email: data.user.email || "",
                        phoneNumber: data.user.phoneNumber || "",
                        deliveryAddress: data.user.deliveryAddress || ""
                    });
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value || ""
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phoneNumber: data.user.phoneNumber || "",
                    deliveryAddress: data.user.deliveryAddress || ""
                });
                toast.success("Changes saved successfully!");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Failed to save changes.");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error("An error occurred while saving changes.");
        }
    };

    return (
        <section className="profile-container">
            <h2 className="profile-title">User Profile</h2>
            <form className="profile-form" onSubmit={handleSave}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={user.name || ""} 
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={user.email || ""}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </label>
                <label>
                    Phone:
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={user.phoneNumber || ""}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        name="deliveryAddress"
                        value={user.deliveryAddress || ""}
                        onChange={handleChange}
                        placeholder="Enter your address"
                    />
                </label>
                <button type="submit" className="save-button">Save Changes</button>
            </form>
            <ToastContainer position="top-right" autoClose={2000} />
        </section>
    );
}
