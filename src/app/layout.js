import "./globals.css";
import NavBar from "@/components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <title>AdiShopKz</title>
            </head>
            <body>
                <NavBar />

                <ToastContainer position="top-right" autoClose={2000} />

                <main className="main-content">
                    {children}
                </main>
            </body>
        </html>
    );
}
