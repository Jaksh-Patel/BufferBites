import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, UtensilsCrossed, ClipboardList } from 'lucide-react';
import '../assets/CancelOrder.css';

const TOTAL_SECS    = 120;
const BIG_CIRC      = 2 * Math.PI * 34; // r=34 on 80×80 viewBox

// ─────────────────────────────────────────────────────────────────────────────
// Shared: countdown ring used in both the page cards and success card
// ─────────────────────────────────────────────────────────────────────────────
function BigRing({ timeLeft }) {
  const progress  = timeLeft / TOTAL_SECS;
  const bigOffset = BIG_CIRC * (1 - progress);
  return (
    <span className="co-big-ring-wrap">
      <svg className="co-big-ring-svg" viewBox="0 0 80 80">
        <circle className="co-big-ring-track"    cx="40" cy="40" r="34" stroke="#ef4444" />
        <circle
          className="co-big-ring-progress"
          cx="40" cy="40" r="34"
          stroke="#ef4444"
          strokeDasharray={BIG_CIRC}
          strokeDashoffset={bigOffset}
        />
      </svg>
      <span className="co-big-ring-seconds">
        <span className="co-big-ring-num">{timeLeft}</span>
        <span className="co-big-ring-label">sec</span>
      </span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActiveOrdersPage
//
// Full-page view shown when user clicks the "Active Orders" header icon.
// Props:
//   windows        — { [orderId]: { timeLeft, order } }
//   onCancel(id)   — cancel a specific order
//   onDone(id)     — confirm a specific order early
// ─────────────────────────────────────────────────────────────────────────────
export function ActiveOrdersPage({ windows = {}, onCancel, onDone }) {
  const entries = Object.values(windows); // [{ timeLeft, order }]

  return (
    <motion.div
      key="active-orders"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="co-page-wrap"
    >
      {/* Page header */}
      <div className="co-page-header">
        <div className="co-page-title-row">
          <ClipboardList className="co-page-title-icon" />
          <div>
            <h1 className="co-page-title">Active Orders</h1>
            <p className="co-page-subtitle">
              You can cancel any order within 2 minutes of placing it.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {entries.length === 0 ? (
        <motion.div
          className="co-empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="co-empty-icon">🎉</div>
          <p className="co-empty-title">No active orders</p>
          <p className="co-empty-sub">All orders have been confirmed or cancelled.</p>
        </motion.div>
      ) : (
        <div className="co-order-list">
          <AnimatePresence mode="popLayout">
            {entries.map(({ timeLeft, order }) => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                timeLeft={timeLeft}
                onCancel={onCancel}
                onDone={onDone}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActiveOrderCard — one card per pending order on the Active Orders page
// ─────────────────────────────────────────────────────────────────────────────
const RESTAURANT_EMOJIS = ['🍕','🍔','🌮','🍜','🥗','🍱','🧆','🥙','🍛','🥞'];
function getEmoji(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return RESTAURANT_EMOJIS[h % RESTAURANT_EMOJIS.length];
}
const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

function ActiveOrderCard({ order, timeLeft, onCancel, onDone }) {
  const progress = timeLeft / TOTAL_SECS;

  return (
    <motion.div
      className="co-order-card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top row: emoji + name + total */}
      <div className="co-order-card-top">
        <div className="co-order-emoji">{getEmoji(order.restaurantName)}</div>
        <div className="co-order-info">
          <p className="co-order-name">{order.restaurantName || 'Campus Restaurant'}</p>
          <p className="co-order-meta">
            {order.id} · {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''} · {order.mode}
          </p>
        </div>
        <div className="co-order-total">{fmt(order.total)}</div>
      </div>

      {/* Items list */}
      <div className="co-order-items">
        {order.items?.map((item) => (
          <div key={item.cartId || item.id} className="co-order-item-row">
            <span className="co-order-item-name">{item.name} × {item.qty}</span>
            <span className="co-order-item-price">{fmt((item.unitPrice ?? item.price) * item.qty)}</span>
          </div>
        ))}
      </div>

      {/* Countdown row */}
      <div className="co-countdown-row">
        <BigRing timeLeft={timeLeft} />
        <div className="co-countdown-text">
          <p className="co-countdown-title">Cancel window closes in {timeLeft}s</p>
          <p className="co-countdown-sub">After that, your order locks in automatically.</p>
          {/* thin red progress bar */}
          <div className="co-progress-bar-wrap" style={{ marginTop: '0.6rem' }}>
            <div className="co-progress-bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="co-actions">
        <button className="co-btn co-btn-done" onClick={() => onDone(order.id)}>
          <CheckCircle2 size={15} /> Confirmed
        </button>
        <button className="co-btn co-btn-cancel" onClick={() => onCancel(order.id)}>
          <XCircle size={15} /> Cancel Order
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CancelOrderSuccessCard  (unchanged — still used on the success page)
// ─────────────────────────────────────────────────────────────────────────────
export function CancelOrderSuccessCard({ orderId, timeLeft, onCancel, onDone, onOrderMore }) {
  const confirmed = timeLeft <= 0;
  const progress  = timeLeft / TOTAL_SECS;

  return (
    <div className="co-success-card">

      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div
            key="countdown"
            className="co-timer-row"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <BigRing timeLeft={timeLeft} />
            <div className="co-timer-text">
              <p className="co-timer-title">Order being confirmed…</p>
              <p className="co-timer-subtitle">
                Cancel within {timeLeft}s. After that it locks in automatically.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirmed"
            className="co-confirmed-row"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="co-confirmed-icon">✅</span>
            <div>
              <p className="co-confirmed-title">Order Confirmed!</p>
              <p className="co-confirmed-sub">Your food is being prepared. See you soon 🍽️</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!confirmed && (
        <div className="co-progress-bar-wrap">
          <div className="co-progress-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      <div className="co-actions">
        <button className="co-btn co-btn-done" onClick={() => onDone(orderId)}>
          <CheckCircle2 size={16} /> Confirmed
        </button>
        <AnimatePresence>
          {!confirmed && (
            <motion.button
              key="cancel-btn"
              className="co-btn co-btn-cancel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => onCancel(orderId)}
            >
              <XCircle size={16} /> Cancel Order
            </motion.button>
          )}
        </AnimatePresence>
        <button className="co-btn co-btn-more" onClick={onOrderMore}>
          <UtensilsCrossed size={16} />
          <span className="co-label-desktop">Order More</span>
          <span className="co-label-mobile">More</span>
        </button>
      </div>
    </div>
  );
}
