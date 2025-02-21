import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const BillSummary = () => {
    const [billSummary, setBillSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/bills/summary')
            .then((response) => {
                setBillSummary(response.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch bill summary');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <h2 style={{ textAlign: 'center' }}>กำลังโหลดข้อมูลสรุปบิล...</h2>;
    if (error) return <h2 style={{ textAlign: 'center', color: 'red' }}>{error}</h2>;

    const containerStyle = {
        padding: '20px',
    };

    const billListStyle = {
        listStyleType: 'none',
        padding: 0,
    };

    const billItemStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
    };

    return (
        <AuthenticatedLayout>
            <div style={containerStyle}>
                <ul style={billListStyle}>
                    {billSummary.map((bill) => (
                        <li key={bill.table_number} style={billItemStyle}>
                            <strong>โต๊ะ: {bill.table_number}</strong>
                            <br />
                            <span>รวม: ${bill.total}</span>
                            <ul>
                                {bill.items.map((item, index) => (
                                    <li key={`${item.product.id}-${index}`}>
                                        {item.product.name} - จำนวน: {item.quantity} - ราคา: ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
};

export default BillSummary;
