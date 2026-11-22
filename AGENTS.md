# ShopLedger contributor guide

## Stack

- Node.js CommonJS application using Express 4 and `body-parser`.
- Static HTML, CSS, and browser JavaScript frontend in `public/`.
- A synchronous JSON-file data store at `data/db.json`.
- Built-in Node test runner (`node:test`) for tests.

## Module map

- `server.js` configures Express, serves `public/`, and mounts API routers.
- `routes/` translates HTTP requests into the application modules.
- `lib/orders.js`, `inventory.js`, `pricing.js`, `tax.js`, and `coupons.js` implement order and stock calculations.
- `lib/ledger.js` manages customer Khata balances and settlements.
- `lib/invoice.js` renders and calculates printable invoices.
- `lib/reports.js` derives dashboard and GST-reconciliation results.
- `lib/store.js` reads and writes the JSON database; `config.js` holds shop, tax, inventory, and coupon configuration.

## Commands

- `npm start` â€” run the local Express server.
- `node --test` â€” run the test suite.

## Change rules

1. Write characterization tests before changing behaviour.
2. Change only the module the ticket is about.
3. Tests must never read or write `data/db.json`.
4. Add no dependencies.

