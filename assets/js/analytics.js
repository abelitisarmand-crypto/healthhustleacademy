/**
 * GA4 Ecommerce Analytics Helper
 */

function safeGtag() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

/**
 * Track view_item event when product page is opened
 * @param {Object} product - Product object from Shopify API
 * @param {String} selectedVariantId - ID of the selected variant
 */
export function trackViewItem(product, selectedVariantId) {
  if (!product) return;
  
  const variant = product.variants?.edges?.find(e => e.node.id === selectedVariantId)?.node 
    || product.variants?.edges?.[0]?.node;
    
  if (!variant) return;

  const price = parseFloat(variant.price?.amount || 0);

  const payload = {
    currency: 'USD',
    value: price,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: price,
        quantity: 1,
        item_variant: variant.title !== 'Default Title' ? variant.title : undefined
      }
    ]
  };
  
  console.log('[GA4 DEBUG] view_item fired', payload);
  safeGtag('event', 'view_item', payload);
}

/**
 * Track add_to_cart event after successful addition
 * @param {String} variantId - Added variant ID
 * @param {Number} quantity - Added quantity
 * @param {Object} cart - Updated cart object from Shopify API
 */
export function trackAddToCart(variantId, quantity, cart) {
  if (!cart || !cart.lines || !cart.lines.edges) return;
  
  // Find the added item in the updated cart to get real data
  const addedLine = cart.lines.edges.find(({node}) => node.merchandise.id === variantId);
  if (!addedLine) return;
  
  const variant = addedLine.node.merchandise;
  const product = variant.product;
  const price = parseFloat(variant.price?.amount || 0);

  const payload = {
    currency: 'USD',
    value: price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: price,
        quantity: quantity,
        item_variant: variant.title !== 'Default Title' ? variant.title : undefined
      }
    ]
  };

  console.log('[GA4 DEBUG] add_to_cart fired', payload);
  safeGtag('event', 'add_to_cart', payload);
}

/**
 * Track begin_checkout event when user clicks Proceed to Checkout
 * @param {Object} cart - Current cart object
 */
export function trackBeginCheckout(cart) {
  if (!cart || !cart.lines || !cart.lines.edges || cart.lines.edges.length === 0) return;

  const items = cart.lines.edges.map(({node}) => {
    const variant = node.merchandise;
    const product = variant.product;
    return {
      item_id: product.id,
      item_name: product.title,
      price: parseFloat(variant.price?.amount || 0),
      quantity: node.quantity,
      item_variant: variant.title !== 'Default Title' ? variant.title : undefined
    };
  });

  const value = parseFloat(cart.cost?.totalAmount?.amount || 0);

  const payload = {
    currency: 'USD',
    value: value,
    items: items
  };

  console.log('[GA4 DEBUG] begin_checkout fired', payload);
  safeGtag('event', 'begin_checkout', payload);
}
