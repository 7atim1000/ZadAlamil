import { useState, useEffect } from 'react';
import { getUserCart } from '../Utils/userCartService'

export const useCartCount = () => {
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCartCount = async () => {
        try {
            setLoading(true);
            const response = await getUserCart();
            
            if (response.success && response.cart) {
                // Calculate total quantity of all items in cart
                const totalItems = response.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                setCartCount(totalItems);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError(error.message);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("userAccessToken");
        if (token) {
            fetchCartCount();
        } else {
            setLoading(false);
            setCartCount(0);
        }
    }, []);

    const refreshCartCount = () => {
        fetchCartCount();
    };

    return {
        cartCount,
        loading,
        error,
        refreshCartCount
    };
};