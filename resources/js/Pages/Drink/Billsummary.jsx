import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const BillSummary = () => {
    const [billSummary, setBillSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State สำหรับควบคุมเมนู

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

    // ฟังก์ชันสำหรับสลับการแสดงเมนู
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // ฟังก์ชันสำหรับไปยังหน้าประวัติการสั่งซื้อ
    const handleHistoryClick = () => {
        alert('ไปยังหน้าประวัติการสั่งซื้อ (ต้องเพิ่มเส้นทางใน router)');
        setIsMenuOpen(false); // ปิดเมนูหลังจากเลือก
    };

    if (loading) return <h2 style={{ textAlign: 'center' }}>กำลังโหลดข้อมูลสรุปบิล...</h2>;
    if (error) return <h2 style={{ textAlign: 'center', color: 'red' }}>{error}</h2>;

    const containerStyle = {
        padding: '20px',
        position: 'relative', // เพื่อให้เมนูอยู่ในตำแหน่งสัมพัทธ์กับ container
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

    const gearButtonStyle = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '50px',
        right: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: isMenuOpen ? 'block' : 'none',
    };

    const dropdownItemStyle = {
        padding: '8px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #ddd',
    };

    return (
        <AuthenticatedLayout>
            <div style={containerStyle}>
                {/* ปุ่มไอคอนฟันเฟือง */}
                {/* เมนูดรอปดาวน์ */}
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
            <button style={gearButtonStyle} onClick={toggleMenu}>
                ⚙️
            </button>
            <div style={dropdownStyle}>
                <div
                    style={dropdownItemStyle}
                    onClick={handleHistoryClick}
                >
                    ประวัติการสั่งซื้อ
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default BillSummary;