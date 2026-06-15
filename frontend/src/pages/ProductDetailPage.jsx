import Spinner from '../components/Spinner';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();        // gets :id from the URL
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch {
                navigate('/');  // redirect home if product not found
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // reset after 2s
    };

    if (loading) return <Spinner />;
    if (!product) return null;

    return (
        <div className="detail-page">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

            <div className="detail-container">
                <div className="detail-image-wrap">
                    <img
                        src={product.image_url || 'https://placehold.co/500x400'}
                        alt={product.name}
                    />
                </div>

                <div className="detail-info">
                    <h1>{product.name}</h1>
                    <p className="detail-price">₹{Number(product.price).toLocaleString()}</p>
                    <p className="detail-desc">{product.description}</p>

                    <div className="detail-stock">
                        {product.stock > 0
                            ? <span className="in-stock">✓ In Stock ({product.stock} available)</span>
                            : <span className="out-stock">✗ Out of Stock</span>
                        }
                    </div>

                    {product.stock > 0 && (
                        <div className="quantity-row">
                            <label>Quantity:</label>
                            <div className="qty-controls">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                            </div>
                        </div>
                    )}

                    <button
                        className={`btn-add-cart-lg ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {added ? '✓ Added to Cart!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;