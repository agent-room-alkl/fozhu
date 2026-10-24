# Fozhu NZ Storefront

An English-language storefront for Fozhu NZ, with a traditional BaZi-inspired reading, Five Elements product recommendations, Shopify product data, and Shopify-hosted checkout.

## Run locally

Prerequisites: Node.js 20.19+ or 22.12+ (required by Vite 8).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the values described below.
3. Start the development server with `npm run dev` and open `http://localhost:3000`.

## Environment variables

- `VITE_SHOPIFY_STORE_DOMAIN`: Shopify storefront domain, for example `fozhu.co.nz`.
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`: public Storefront API token. This token is intended for storefront access only; never use an Admin API token here.
- `AI_GATEWAY_API_KEY`: server-side Vercel AI Gateway key used by the BaZi reading endpoint. Keep it private and never commit it.
- `BAZI_CLAUDE_MODEL`: Claude model ID enabled for the AI Gateway account.

## Shopify and fulfilment

Shopify provides the live product catalogue and hosts cart checkout. Alibaba supplier orders are not automatically created by this project; fulfilment must be arranged manually unless a compatible dropshipping integration is installed and configured.

Shipping rates shown in Shopify are store-configured estimates. Confirm each supplier's destination coverage, per-product shipping cost, combined-parcel terms, delivery time, and tracking before promising a route to customers. See [SHOPIFY_INTEGRATION.md](SHOPIFY_INTEGRATION.md).

## Build

Run `npm run build` to create the production bundle in `dist/`.
