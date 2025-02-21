import React from 'react';
import ProductList from './Drink/ProductList';
import OrderList from './Drink/OrderList';
import CategoryList from './Drink/CategoryList';

const Drink = () => {
    return (
        <div>
            <h1>Drink Management</h1>
            <ProductList />
            <CategoryList />
            <OrderList />
        </div>
    );
};

export default Drink;
