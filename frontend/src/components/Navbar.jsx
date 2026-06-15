import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">🛒 ShopApp</Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>

                {user ? (
                    <>
                        <Link to="/orders">My Orders</Link>
                        <span className="navbar-user">Hi, {user.name}</span>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                <Link to="/cart" className="cart-icon">
                    🛍️ Cart
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;