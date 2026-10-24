# Shopify integration

The site keeps the BaZi chart and reading experience, while Shopify owns the sellable catalogue, variant IDs, cart checkout, payment, and resulting order.

## Local setup

1. In Shopify, ensure the products you want customers to buy are **Active** and available on the Online Store sales channel. Draft products are not returned by the public Storefront API.
2. Create a Storefront API public access token with product listing and cart/checkout access.
3. Copy `.env.example` to `.env.local`, set `VITE_SHOPIFY_STORE_DOMAIN` to the connected Shopify storefront domain, and set `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` to the public Storefront token. The public token is intended for storefront requests; never put an Admin API token in a `VITE_` variable.
4. Restart Vite. The collection and BaZi recommendations will read the same Shopify products. Checkout creates a Shopify cart and redirects to Shopify-hosted checkout.
5. Add Shopify product tags such as `element-wood`, `element-fire`, `element-earth`, `element-metal`, or `element-water` to control Five Elements recommendations. Product title and material terms are used as a fallback.

## Deployment

Set the same two environment variables in the production host and deploy the Vite app on its own host/subdomain (for example, `reading.fozhu.co.nz`). The Shopify custom domain currently points at the Shopify storefront; it cannot simultaneously serve this separate Vite app at the root. Keep Shopify as the checkout/order system, and link the Vite experience from the Shopify theme or embed it through a Shopify app/theme integration.

Shipping rates and free-shipping rules must also be configured in Shopify Markets/Shipping. The cart page's amount is an estimate; Shopify checkout calculates the actual rate and tax.
