import React from 'react';
import ReactDOM from 'react-dom';
import ProductList from './components/ProductList';
import CategoryList from './Pages/Drink/CategoryList';
import OrderList from './Pages/Drink/OrderList';
import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';
import Drink from './Pages/Drink';

// ...existing code...

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue');
        return pages[`./Pages/${name}.vue`];
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
});

// ...existing code...

InertiaProgress.init();

if (document.getElementById('app')) {
    ReactDOM.render(
        <div>
            <ProductList />
            <CategoryList />
            <OrderList />
        </div>,
        document.getElementById('app')
    );
}
