import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosConfig';
import { useState } from 'react';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [placing, setPlacing] = useState(false);

    const handlePlaceOrder = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setPlacing(true);

        try {
            const items = cartItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            }));

            await API.post('/orders', { items });

            clearCart();

            showToast('Order placed successfully!', 'success');

            setTimeout(() => {
                navigate('/orders');
            }, 2000);

        } catch (err) {
            console.error(err);

            showToast(
                'Failed to place order. Please try again.',
                'error'
            );
        } finally {
            setPlacing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="empty-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>

                <button
                    onClick={() => navigate('/')}
                    className="btn-shop"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={
                                    item.image_url ||
                                    'https://placehold.co/80x80'
                                }
                                alt={item.name}
                            />

                            <div className="cart-item-info">
                                <h3>{item.name}</h3>

                                <p className="cart-item-price">
                                    ₹{Number(item.price).toLocaleString()}
                                </p>
                            </div>

                            <div className="cart-item-controls">
                                <div className="qty-controls">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="cart-item-subtotal">
                                    ₹
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}
                                </p>

                                <button
                                    className="btn-remove"
                                    onClick={() =>
                                        removeFromCart(item.id)
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>
                            ₹{Number(cartTotal).toLocaleString()}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free">Free</span>
                    </div>

                    <div className="summary-row total">
                        <span>Total</span>
                        <span>
                            ₹{Number(cartTotal).toLocaleString()}
                        </span>
                    </div>

                    <button
                        className="btn-order"
                        onClick={handlePlaceOrder}
                        disabled={placing}
                    >
                        {placing
                            ? 'Placing Order...'
                            : user
                                ? 'Place Order'
                                : 'Login to Order'}
                    </button>

                    <button
                        className="btn-clear"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;