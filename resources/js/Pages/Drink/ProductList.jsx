import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [billItems, setBillItems] = useState([]);
    const [tableNumber, setTableNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const itemsPerPage = 20;

    useEffect(() => {
        axios
            .get("/api/products")
            .then((response) => setProducts(response.data))
            .catch((err) => setError(err.message || "Failed to fetch products"))
            .finally(() => setLoading(false));
    }, []);

    const categories = [
        { id: "all", name: "ทั้งหมด" },
        { id: "1", name: "เครื่องดื่ม" },
        { id: "2", name: "อาหาร" },
        { id: "3", name: "เบเกอรี่" },
        { id: "4", name: "ของหวาน" },
    ];

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter(
                  (product) => product.category_id.toString() === selectedCategory
              );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const addToBill = (product) => {
        setBillItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id
            );
            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setBillItems((prevItems) =>
            newQuantity > 0
                ? prevItems.map((item) =>
                      item.id === productId ? { ...item, quantity: newQuantity } : item
                  )
                : prevItems.filter((item) => item.id !== productId)
        );
    };

    const calculateTotal = () => {
        return billItems
            .reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0)
            .toFixed(2);
    };

    const saveBill = () => {
        if (!tableNumber) {
            alert("กรุณากรอกหมายเลขโต๊ะ");
            return;
        }

        const billData = {
            table_number: tableNumber,
            total: calculateTotal(),
            items: billItems.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        axios
            .post("/api/bills", billData)
            .then((response) => {
                alert(`บันทึกบิลสำหรับโต๊ะ ${tableNumber} เรียบร้อย!`);
                setBillItems([]);
                setTableNumber("");
            })
            .catch((err) => {
                alert("Failed to save bill");
                console.error(err);
            });
    };

    if (loading) return <h2 className="text-center">กำลังโหลดสินค้า...</h2>;
    if (error) return <h2 className="text-center text-red-500">{error}</h2>;

    return (
        <AuthenticatedLayout>
            <div className="flex gap-6 p-6">
                {/* Sidebar หมวดหมู่ */}
                <div className="w-[230px] min-w-[150px] bg-white shadow-lg rounded-xl p-4">
                    <h2 className="text-2xl font-bold text-orange-500 mb-3">หมวดหมู่</h2>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category.id} className="w-full">
                                {/* หมวดหมู่หลัก */}
                                <div
                                    onClick={() => {
                                        setSelectedCategory(category.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`py-2 px-3 rounded-md text-lg cursor-pointer transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? "bg-orange-100 text-orange-700 font-bold"
                                            : "hover:bg-orange-100"
                                    }`}
                                >
                                    {category.name}
                                </div>

                                {/* แสดงหมวดหมู่ย่อยถ้าเลือกอยู่ */}
                                {selectedCategory === category.id && category.subCategories && (
                                    <ul className="ml-4 mt-1 space-y-1">
                                        {category.subCategories.map((sub) => (
                                            <li
                                                key={sub.id}
                                                onClick={() => {
                                                    setSelectedCategory(sub.id);
                                                    setCurrentPage(1);
                                                }}
                                                className={`py-1 px-3 rounded-md text-md cursor-pointer transition-all duration-300 ${
                                                    selectedCategory === sub.id
                                                        ? "bg-orange-200 text-orange-800 font-bold"
                                                        : "hover:bg-orange-100"
                                                }`}
                                            >
                                                {sub.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Product List */}
                <div className="flex-1">
                    <h1 className="text-center text-2xl font-bold mb-4">รายการสินค้า</h1>
                    <div className="grid grid-cols-5 gap-4">
                        {paginatedProducts.map((product) => (
                            <div key={product.id} className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center">
                                <img src={product.image_url} alt={product.name} className="w-full h-32 object-contain mb-2" />
                                <h3 className="text-lg font-semibold text-center">{product.name}</h3>
                                <p className="text-orange-500 font-bold">${Number(product.price).toFixed(2)}</p>
                                <button
                                    onClick={() => addToBill(product)}
                                    className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                >
                                    เพิ่มลงบิล
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <input
                            type="number"
                            value={currentPage}
                            min="1"
                            max={totalPages}
                            onChange={(e) => {
                                const page = Number(e.target.value);
                                if (page >= 1 && page <= totalPages) {
                                    setCurrentPage(page);
                                }
                            }}
                            className="w-12 text-center border rounded"
                        />
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                    </div>
                </div>

                {/* Bill Section */}
                <div className="w-[300px] bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold text-center mb-3">บิล</h2>
                    <input
                        type="text"
                        placeholder="กรอกหมายเลขโต๊ะ"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full p-2 border rounded mb-3"
                    />
                    {billItems.length === 0 ? (
                        <p className="text-center text-gray-500">ยังไม่มีสินค้าในบิล</p>
                    ) : (
                        <ul className="mb-3">
                            {billItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center py-2 border-b">
                                    <span className="w-1/3">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(item.id, Number(e.target.value) || 1)
                                            }
                                            className="w-12 text-center border rounded"
                                            min="1"
                                        />
                                        <button
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="w-1/3 text-right">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="text-right font-bold mb-3">รวม: ${calculateTotal()}</div>
                    <button onClick={saveBill} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        บันทึกบิล
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductList;
