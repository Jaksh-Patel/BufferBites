import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  CreditCard,
  Banknote,
  Wallet,
  Bike,
  Armchair,
  ShoppingBag,
  Percent,
  Receipt,
  Search,
  X,
  RotateCcw,
} from 'lucide-react';
import '../assets/OrderHistory.css';

// ── helpers ───────────────────────────────────────────────────────────────────
const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const formatDate = (d) => {
  const date = new Date(d);
  return (
    date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) +
    ', ' +
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );
};

// Deterministic emoji from restaurant name hash
const RESTAURANT_EMOJIS = ['🍕', '🍔', '🌮', '🍜', '🥗', '🍱', '🧆', '🥙', '🍛', '🥞'];
const getEmoji = (name = '') => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return RESTAURANT_EMOJIS[h % RESTAURANT_EMOJIS.length];
};

const PAYMENT_ICONS = {
  Online: <CreditCard className="w-3.5 h-3.5" />,
  Cash:   <Banknote   className="w-3.5 h-3.5" />,
  Wallet: <Wallet     className="w-3.5 h-3.5" />,
};

const MODE_ICONS = {
  Takeaway:  <ShoppingBag className="w-3 h-3" />,
  'Dine-in': <Armchair    className="w-3 h-3" />,
  Delivery:  <Bike        className="w-3 h-3" />,
};

// ── OrderCard — flat, always fully visible ────────────────────────────────────
function OrderCard({ order, onReorder }) {
  const [reordered, setReordered] = useState(false);

  const payLabel =
    order.payment === 'Online' && order.onlineMethod
      ? `Online · ${order.onlineMethod}`
      : order.payment;

  const handleReorder = () => {
    onReorder?.(order);
    setReordered(true);
    setTimeout(() => setReordered(false), 2000);
  };

  return (
    <motion.div
      className="oh-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      layout
    >
      {/* Restaurant + order meta */}
      <div className="oh-card-head">
        <div className="oh-card-left">
          <div className="oh-restaurant-emoji" aria-hidden="true">
            {getEmoji(order.restaurantName)}
          </div>
          <div className="oh-restaurant-info">
            <p className="oh-restaurant-name">{order.restaurantName || 'Campus Restaurant'}</p>
            <p className="oh-order-meta">
              <span className="oh-order-number">BB-{order.id?.replace(/^BB/, '')}</span>
              {' · '}
              {formatDate(order.placedAt)}
              {' · '}
              <span className="oh-mode-pill">
                {MODE_ICONS[order.mode]}
                {order.mode}
              </span>
            </p>
          </div>
          {/* Status badge */}
          {order.status && (
            <span className={`oh-status-badge oh-status-${(order.status || 'Pending').toLowerCase()}`}>
              {order.status === 'Done' ? '✅' : order.status === 'Cancelled' ? '❌' : '⏳'} {order.status}
            </span>
          )}
        </div>
      </div>

      <div className="oh-card-divider" />

      {/* Items + payment details — always shown */}
      <div className="oh-card-body-inner">

        {/* Food items */}
        <div>
          <p className="oh-section-label">Order items</p>
          <div className="oh-items-list">
            {order.items?.map((item) => (
              <div key={item.cartId || item.id} className="oh-item-row">
                <span className="oh-item-name">{item.name} × {item.qty}</span>
                <span className="oh-item-price">{formatINR(item.unitPrice * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <div className="oh-payment-row">
          <div className="oh-pay-line">
            <span className="oh-pay-label">
              {PAYMENT_ICONS[order.payment] ?? <Receipt className="w-3.5 h-3.5" />}
              Payment
            </span>
            <span>{payLabel}</span>
          </div>

          {order.discount > 0 && (
            <div className="oh-pay-line">
              <span className="oh-pay-label">
                <Percent className="w-3.5 h-3.5" />
                {order.discountLabel || 'Discount'}
              </span>
              <span className="oh-discount-text">- {formatINR(order.discount)}</span>
            </div>
          )}

          <div className="oh-total-line">
            <span>Total price</span>
            <span className="oh-total-amount">{formatINR(order.total)}</span>
          </div>
        </div>

        {/* Reorder button */}
        <motion.button
          className={`oh-reorder-btn${reordered ? ' oh-reorder-btn--done' : ''}`}
          onClick={handleReorder}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          aria-label="Reorder this order"
        >
          <RotateCcw className={`w-4 h-4 ${reordered ? 'animate-spin-once' : ''}`} />
          {reordered ? 'Added to cart!' : 'Reorder'}
        </motion.button>

      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function OrderHistory({ orderHistory = [], onReorder }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Summary stats — only count orders that weren't cancelled
  const stats = useMemo(() => {
    const active = orderHistory.filter((o) => o.status !== 'Cancelled');
    return {
      total: orderHistory.length,
      spent: active.reduce((s, o) => s + (o.total || 0), 0),
      items: active.reduce((s, o) => s + (o.items?.reduce((a, i) => a + i.qty, 0) || 0), 0),
    };
  }, [orderHistory]);

  // Search across dish names, restaurant name, order ID
  const searchTrimmed = search.trim().toLowerCase();
  const afterSearch = useMemo(() => {
    if (!searchTrimmed) return orderHistory;
    return orderHistory.filter((o) =>
      o.restaurantName?.toLowerCase().includes(searchTrimmed) ||
      o.id?.toLowerCase().includes(searchTrimmed) ||
      o.items?.some((i) => i.name?.toLowerCase().includes(searchTrimmed))
    );
  }, [orderHistory, searchTrimmed]);

  // Status filter on top of search
  const filtered = useMemo(() => {
    if (filter === 'All') return afterSearch;
    return afterSearch.filter((o) => (o.status || 'Pending') === filter);
  }, [afterSearch, filter]);

  const FILTERS = ['All', 'Pending', 'Done', 'Cancelled'];

  return (
    <div className="oh-wrapper">

      {/* Title + filter tabs */}
      <div className="oh-header">
        <h3 className="oh-title">
          <History className="w-5 h-5" />
          Order History
        </h3>
        {orderHistory.length > 0 && (
          <div className="oh-filters" role="group" aria-label="Filter orders">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`oh-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search bar */}
      {orderHistory.length > 0 && (
        <div className="oh-search-wrap">
          <Search className="oh-search-icon w-4 h-4" aria-hidden="true" />
          <input
            className="oh-search-input"
            type="text"
            placeholder="Search by dish, restaurant or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search order history"
          />
          {search && (
            <button className="oh-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Summary stats */}
      {orderHistory.length > 0 && (
        <div className="oh-stats-strip">
          <div className="oh-stat-card">
            <div className="oh-stat-value">{stats.total}</div>
            <div className="oh-stat-label">Orders</div>
          </div>
          <div className="oh-stat-card">
            <div className="oh-stat-value">{stats.items}</div>
            <div className="oh-stat-label">Items</div>
          </div>
          <div className="oh-stat-card">
            <div className="oh-stat-value">{formatINR(stats.spent)}</div>
            <div className="oh-stat-label">Spent</div>
          </div>
        </div>
      )}

      {/* Empty / no-results */}
      {orderHistory.length === 0 ? (
        <div className="oh-empty">
          <div className="oh-empty-icon">🛍️</div>
          <p>No orders yet.</p>
          <p style={{ marginTop: '0.25rem', color: '#d4d4d4' }}>
            Your order history will appear here once you place an order.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="oh-empty">
          <div className="oh-empty-icon">🔍</div>
          <p>{searchTrimmed ? `No results for "${search}"` : `No ${filter.toLowerCase()} orders.`}</p>
        </div>
      ) : (
        <motion.div className="oh-list" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onReorder={onReorder} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </div>
  );
}
