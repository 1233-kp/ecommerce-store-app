import Spinner from '../components/Spinner';
import { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Fetch products from backend when component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Is your backend running?');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); // empty [] means run once on mount

    // Filter products based on search input (client-side filtering)
    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <Spinner />;
    if (error) return <div className="page-center error">{error}</div>;

    return (
        <div className="home-page">
            <div className="home-hero">
                <h1>Welcome to ShopApp</h1>
                <p>Find the best products at great prices</p>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {filtered.length === 0 ? (
                <p className="no-results">No products match your search.</p>
            ) : (
                <div className="products-grid">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;