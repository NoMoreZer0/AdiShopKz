import Link from "next/link";

export default function Home() {
  return (
      <section>
          <h2>Welcome to Our Store</h2>
          <p>Discover amazing products that suit your needs.</p>
          <Link href="/products">
            <button>Shop Now</button>
          </Link>
      </section>
  );
}