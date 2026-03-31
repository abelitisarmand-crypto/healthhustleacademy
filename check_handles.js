import { getProducts } from './assets/js/shopify.js';

async function checkHandles() {
    const data = await getProducts(20);
    const products = data.products.edges.map(e => ({
        title: e.node.title,
        handle: e.node.handle
    }));
    console.log(JSON.stringify(products, null, 2));
}

checkHandles();
