import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ฟังก์ชันจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // เติม 0 ถ้าวันเป็นเลขตัวเดียว
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 เลยต้อง +1
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const StaffBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/bills')
            .then((response) => {
                setBills(response.data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to fetch bills');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <h2 style={{ textAlign: 'center' }}>กำลังโหลดข้อมูลบิล...</h2>;
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
                <h1 style={{ textAlign: 'center' }}>รายการบิลพนักงาน</h1>
                <ul style={billListStyle}>
                    {bills.map((bill) => (
                        <li key={bill.id} style={billItemStyle}>
                            <strong>บิล #{bill.id}</strong>
                            <br />
                            <span>โต๊ะ: {bill.table_number}</span>
                            <br />
                            <span>รวม: ${bill.total}</span>
                            <ul>
                                {bill.items.map((item) => (
                                    <li key={item.id}>
                                        {item.product.name} - จำนวน: {item.quantity} - ราคา: ${item.price}
                                    </li>
                                ))}
                            </ul>
                            <span>เวลา : {formatDateTime(bill.updated_at)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
};

export default StaffBills;