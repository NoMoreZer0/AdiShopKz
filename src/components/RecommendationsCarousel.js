import Link from 'next/link';
import './RecommendationsScroll.css';

export default function RecommendationsScroll({ recommendations, headerText }) {
    return (
        <div className="recommendations-container">
            <h3> {headerText} </h3>
            <div className="scrollable-cards">
                {recommendations.map((rec) => (
                    <div key={rec._id.toString()} className="product-card">
                        <Link href={`/products/${rec._id}`}>
                            <img src={rec.images[0]} alt={rec.name} className="product-image" />
                            <div className="product-info">
                                <p className="product-name">{rec.name}</p>
                                <p className="product-price">${rec.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
