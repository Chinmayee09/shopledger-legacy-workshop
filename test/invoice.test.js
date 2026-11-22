var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');

function order(overrides) {
  var base = {
    id: 9001,
    customer: 'Walk-in',
    paymentMode: 'cash',
    coupon: '',
    items: []
  };
  Object.keys(overrides || {}).forEach(function (key) {
    base[key] = overrides[key];
  });
  return base;
}

test('invoice applies the HSN GST rate when an HSN-only line has no gstRate', function () {
  var figures = invoice.computeInvoiceFigures(order({
    items: [{ name: 'Rice', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1 }]
  }));

  assert.equal(figures.subtotal, 640);
  assert.equal(figures.tax, 32);
  assert.equal(figures.total, 672);
  assert.equal(figures.rows[0].gstPercent, 5);
});

test('invoice calculates a percent coupon before tax', function () {
  var figures = invoice.computeInvoiceFigures(order({
    coupon: 'SAVE10',
    items: [{ name: 'Rice', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1 }]
  }));

  assert.equal(figures.tax, 28.8);
  assert.equal(figures.discount, 64);
  assert.equal(figures.total, 604.8);
});

test('invoice observes a coupon maximum discount', function () {
  var figures = invoice.computeInvoiceFigures(order({
    coupon: 'WHOLESALE15',
    items: [{ name: 'Bulk rice', sku: 'GRN-001', hsn: '1006', price: 10000, qty: 1 }]
  }));

  assert.equal(figures.discount, 400);
});

test('invoice honours an explicit gstRate supplied on a line', function () {
  var figures = invoice.computeInvoiceFigures(order({
    items: [{ name: 'Rice', sku: 'GRN-001', hsn: '1006', gstRate: 5, price: 640, qty: 1 }]
  }));

  assert.equal(figures.tax, 32);
  assert.equal(figures.rows[0].gstPercent, 5);
});

test('invoice uses the HSN GST slab for an order line that does not carry gstRate', function () {
  var figures = invoice.computeInvoiceFigures(order({
    items: [{ name: 'Rice', sku: 'GRN-001', hsn: '1006', price: 640, qty: 1 }]
  }));

  assert.equal(figures.tax, 32);
  assert.equal(figures.total, 672);
  assert.equal(figures.rows[0].gstPercent, 5);
});

test('invoice applies coupon caps before calculating GST on the discounted taxable value', function () {
  var figures = invoice.computeInvoiceFigures(order({
    coupon: 'WHOLESALE15',
    items: [{ name: 'Bulk rice', sku: 'GRN-001', hsn: '1006', price: 10000, qty: 1 }]
  }));

  assert.equal(figures.discount, 400);
  assert.equal(figures.tax, 480);
  assert.equal(figures.total, 10080);
});

