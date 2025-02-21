import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [billItems, setBillItems] = useState([]);

    useEffect(() => {
        axios.get('/api/products')
            .then((response) => {
                setProducts(response.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch products');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const addToBill = (product) => {
        setBillItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const saveBill = () => {
        alert('Bill saved!');
        console.log('Bill items:', billItems);
    };

    const calculateTotal = () => {
        return billItems
            .reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0)
            .toFixed(2);
    };

    if (loading) return <h2 style={{ textAlign: 'center' }}>Loading products...</h2>;
    if (error) return <h2 style={{ textAlign: 'center', color: 'red' }}>{error}</h2>;

    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '20px',
        padding: '20px',
    };

    const productGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        listStyleType: 'none',
    };

    const itemStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
    };

    const billStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    };

    const buttonStyle = {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const totalStyle = {
        marginTop: '20px',
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'right',  // ทำให้ราคาตัวรวมชิดขวา
    };

    // เพิ่ม billItemStyle ใหม่เพื่อจัดระเบียบ
    const billItemStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
    };

    return (
        <div style={containerStyle}>
            {/* รายการสินค้า */}
            <div>
                <h1 style={{ textAlign: 'center' }}>Product List</h1>
                <ul style={productGridStyle}>
                    {products.map((product) => (
                        <li
                            key={product.id}
                            style={itemStyle}
                            onClick={() => addToBill(product)}
                        >
                            <strong>{product.name}</strong>
                            <br />
                            <span>
                                ${product.price && !isNaN(Number(product.price))
                                    ? Number(product.price).toFixed(2)
                                    : 'N/A'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* บิล */}
            <div style={billStyle}>
                <div>
                    <h1 style={{ textAlign: 'center' }}>Bill</h1>
                    {billItems.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999' }}>No items in the bill.</p>
                    ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {billItems.map((item, index) => (
                                <li key={index} style={billItemStyle}>
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>
                                        ${item.price
                                            ? (Number(item.price) * item.quantity).toFixed(2)
                                            : 'N/A'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <div style={totalStyle}>Total: ${calculateTotal()}</div>
                    <button style={buttonStyle} onClick={saveBill}>
                        Save Bill
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
