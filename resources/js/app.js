import React from 'react';
import ReactDOM from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx');
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        ReactDOM.render(<App {...props} />, el);
    },
});

InertiaProgress.init();
