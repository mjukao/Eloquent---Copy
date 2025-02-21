import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ฟังก์ชันจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const Orders = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/bills')
            .then((response) => {
                setBills(response.data);
            })
            .catch((err) => {
                setError(err.message || 'ไม่สามารถดึงข้อมูลบิลได้');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ฟังก์ชันสำหรับทำเครื่องหมายบิลว่าสำเร็จและลบหลังยืนยัน
    const handleCompleteBill = async (billId) => {
        try {
            // แสดงกล่องยืนยัน
            const confirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการทำรายการสำเร็จ?');
            if (!confirmed) return; // ถ้ากดยกเลิก จะไม่ดำเนินการต่อ

            // ส่งคำขอไปยัง backend เพื่ออัปเดตสถานะ
            const response = await axios.patch(`/api/bills/${billId}/complete`, {
                status: 'completed'
            });

            // แจ้งเตือนว่าทำสำเร็จ
            alert('ทำรายการสำเร็จเรียบร้อย');

            // ลบ بิลออกจาก state เพื่อให้หายไปจากหน้า
            setBills(bills.filter(bill => bill.id !== billId));
        } catch (err) {
            setError(err.message || 'ไม่สามารถอัปเดตสถานะบิลได้');
            alert('เกิดข้อผิดพลาด: ' + (err.message || 'ไม่สามารถอัปเดตสถานะบิลได้'));
        }
    };

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

    const buttonStyle = {
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <AuthenticatedLayout>
            <div style={containerStyle}>
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
                            <span>เวลา: {formatDateTime(bill.updated_at)}</span>
                            <br />
                            {bill.status !== 'completed' ? (
                                <button
                                    style={buttonStyle}
                                    onClick={() => handleCompleteBill(bill.id)}
                                >
                                    ทำรายการสำเร็จ
                                </button>
                            ) : (
                                <span style={{ color: 'green' }}>สำเร็จแล้ว</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
};

export default Orders;