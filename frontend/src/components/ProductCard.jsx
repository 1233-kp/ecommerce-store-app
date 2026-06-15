import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`}>
                <img
                    src={product.image_url || 'https://placehold.co/300x200'}
                    alt={product.name}
                    className="product-image"
                />
            </Link>

            <div className="product-info">
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
                    <span className="product-stock">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>
                <button
                    className="btn-add-cart"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;