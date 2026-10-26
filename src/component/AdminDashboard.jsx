{/*
-- Run this SQL in your Supabase dashboard (SQL Editor):
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  user_name text,
  user_email text,
  restaurant_name text,
  items jsonb,
  total numeric,
  payment text,
  mode text,
  status text DEFAULT 'Pending',
  discount numeric DEFAULT 0,
  discount_label text,
  placed_at timestamptz DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access" ON public.orders TO service_role USING (true) WITH CHECK (true);
-- Also create an admin policy — in real production use a service role key for admin
-- NOTE: Enable Realtime for the orders table in Supabase: Database -> Replication -> toggle on 'orders'
*/}

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase.js';
import '../assets/AdminDashboard.css';
import {
  LayoutDashboard, Zap, History, Store, LogOut, TrendingUp, ShoppingBag,
  XCircle, CheckCircle, Users, RefreshCw, Download, Search, Filter,
  ChevronDown, Clock, CreditCard, Bike, Armchair, Package,
  Menu as MenuIcon, X as XIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const cls = (status || '').toLowerCase();
  return <span className={`status-badge ${cls}`}>{status || '—'}</span>;
}

function ModePill({ mode }) {
  const icon = mode === 'Delivery' ? <Bike size={12} /> : mode === 'Dine-in' ? <Armchair size={12} /> : <ShoppingBag size={12} />;
  return <span className="mode-pill">{icon} {mode}</span>;
}

// ─── Export CSV ───────────────────────────────────────────────────────────────

const exportCSV = (rows) => {
  const headers = ['Order ID', 'Restaurant', 'Items', 'Total', 'Payment', 'Mode', 'Status', 'Placed At'];
  const csvRows = rows.map((o) => [
    o.id,
    o.restaurant_name,
    (o.items || []).map((i) => `${i.name} x${i.qty}`).join('; '),
    o.total,
    o.payment,
    o.mode,
    o.status,
    new Date(o.placed_at).toLocaleString(),
  ]);
  const csv = [headers, ...csvRows]
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orders.csv';
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

function DashboardTab({ orders }) {
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.placed_at).toDateString() === today);
  const revenueToday = todayOrders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const pendingToday = todayOrders.filter((o) => o.status === 'Pending').length;
  const cancelledToday = todayOrders.filter((o) => o.status === 'Cancelled').length;

  // Orders per restaurant (all time)
  const byRestaurant = {};
  orders.forEach((o) => {
    const n = o.restaurant_name || 'Unknown';
    byRestaurant[n] = (byRestaurant[n] || 0) + 1;
  });
  const restaurantEntries = Object.entries(byRestaurant).sort((a, b) => b[1] - a[1]);
  const maxCount = restaurantEntries[0]?.[1] || 1;

  const stats = [
    { label: 'Orders Today', value: todayOrders.length, icon: <ShoppingBag size={14} />, color: '#ff6b35' },
    { label: 'Revenue Today', value: `₹${revenueToday.toLocaleString()}`, icon: <TrendingUp size={14} />, color: '#6366f1' },
    { label: 'Pending Orders', value: pendingToday, icon: <Clock size={14} />, color: '#f59e0b' },
    { label: 'Cancelled Today', value: cancelledToday, icon: <XCircle size={14} />, color: '#ef4444' },
  ];

  const recent = [...orders].slice(0, 5);

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label" style={{ color: s.color }}>
              {s.icon} {s.label}
            </div>
            <div className="admin-stat-card__value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="admin-card-section">
        <div className="admin-section-title">Orders by Restaurant (All Time)</div>
        {restaurantEntries.length === 0 ? (
          <div className="admin-empty"><div className="admin-empty__text">No orders yet</div></div>
        ) : (
          <div className="admin-bar-chart">
            {restaurantEntries.map(([name, count]) => (
              <div key={name} className="admin-bar-row">
                <div className="admin-bar-label" title={name}>{name}</div>
                <div className="admin-bar-track">
                  <div className="admin-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
                <div className="admin-bar-count">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="admin-card-section">
        <div className="admin-section-title">Recent Orders</div>
        {recent.length === 0 ? (
          <div className="admin-empty"><div className="admin-empty__text">No orders yet</div></div>
        ) : (
          <table className="admin-recent-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-accent)' }}>{o.id}</td>
                  <td>{o.restaurant_name}</td>
                  <td>₹{o.total}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>{formatTime(o.placed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

// ─── Live Orders Tab ───────────────────────────────────────────────────────────

function LiveOrdersTab({ orders, onUpdate, newOrderBanner, setNewOrderBanner }) {
  const pending = orders.filter((o) => o.status === 'Pending');

  return (
    <motion.div
      key="live"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      {/* New order toast */}
      <AnimatePresence>
        {newOrderBanner && (
          <motion.div
            className="new-order-banner"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3 }}
          >
            🔔 New order from <strong style={{ marginLeft: 4 }}>{newOrderBanner}</strong>!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live indicator */}
      {pending.length > 0 && (
        <div className="live-indicator">
          <span className="live-dot" />
          {pending.length} pending order{pending.length > 1 ? 's' : ''} — live
        </div>
      )}

      {pending.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">✅</div>
          <div className="admin-empty__text">All caught up! No pending orders.</div>
        </div>
      ) : (
        <div className="admin-order-cards">
          <AnimatePresence>
            {pending.map((o) => (
              <motion.div
                key={o.id}
                className="admin-order-card"
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <div className="admin-order-card__header">
                  <span className="admin-order-card__id">{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="admin-order-card__restaurant">{o.restaurant_name}</div>
                <div className="admin-order-card__meta">
                  <ModePill mode={o.mode} />
                  <span><CreditCard size={12} /> {o.payment}</span>
                  <span><Clock size={12} /> {formatTime(o.placed_at)}</span>
                </div>
                <ul className="admin-order-card__items">
                  {(o.items || []).map((item, idx) => (
                    <li key={idx} className="admin-order-card__item">
                      <span>{item.name} × {item.qty}</span>
                      <span>₹{(item.unitPrice || item.price || 0) * item.qty}</span>
                    </li>
                  ))}
                </ul>
                <div className="admin-order-card__total">
                  <span>Total</span>
                  <span>₹{o.total}</span>
                </div>
                <div className="admin-order-card__actions">
                  <button
                    className="admin-btn admin-btn-ready"
                    onClick={() => onUpdate(o.id, 'Done')}
                  >
                    <CheckCircle size={14} /> Mark as Done
                  </button>
                  <button
                    className="admin-btn admin-btn-cancel"
                    onClick={() => onUpdate(o.id, 'Cancelled')}
                  >
                    <XCircle size={14} /> Cancel Order
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ─── Order History Tab ─────────────────────────────────────────────────────────

function HistoryTab({ orders, restaurants }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [restaurantFilter, setRestaurantFilter] = useState('All');

  const filtered = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || o.id?.toLowerCase().includes(q) || (o.restaurant_name || '').toLowerCase().includes(q) || (o.user_name || '').toLowerCase().includes(q) || (o.user_email || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchRest = restaurantFilter === 'All' || o.restaurant_name === restaurantFilter;
    return matchSearch && matchStatus && matchRest;
  });

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      <div className="admin-filters">
        <div className="admin-search-wrap">
          <Search size={16} />
          <input
            className="admin-search"
            placeholder="Search order ID or restaurant…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {['All', 'Pending', 'Done', 'Cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--admin-text-secondary)' }} />
        </div>

        <div style={{ position: 'relative' }}>
          <select
            className="admin-select"
            value={restaurantFilter}
            onChange={(e) => setRestaurantFilter(e.target.value)}
          >
            <option value="All">All Restaurants</option>
            {restaurants.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--admin-text-secondary)' }} />
        </div>

        <button className="admin-btn admin-btn-export" onClick={() => exportCSV(filtered)}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Restaurant</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                  No orders match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--admin-accent)', whiteSpace: 'nowrap' }}>{o.id}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{o.restaurant_name}</td>
                  <td style={{ maxWidth: 200 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                      {(o.items || []).map((i) => `${i.name} ×${i.qty}`).join(', ')}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>₹{o.total}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{o.payment}</td>
                  <td><ModePill mode={o.mode} /></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                    {formatTime(o.placed_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ─── Restaurants Tab ───────────────────────────────────────────────────────────

function RestaurantsTab({ orders, restaurants }) {
  // Compute stats per restaurant from orders
  const statsMap = {};
  orders.forEach((o) => {
    const n = o.restaurant_name;
    if (!n) return;
    if (!statsMap[n]) statsMap[n] = { totalOrders: 0, totalRevenue: 0 };
    statsMap[n].totalOrders += 1;
    if (o.status !== 'Cancelled') statsMap[n].totalRevenue += o.total || 0;
  });

  // Merge with passed restaurants prop for cuisine/rating
  const restaurantData = restaurants.map((r) => ({
    name: r.name,
    cuisine: r.cuisine,
    rating: r.rating,
    ...(statsMap[r.name] || { totalOrders: 0, totalRevenue: 0 }),
  }));

  // Also show restaurants that appear in orders but not in prop
  const knownNames = new Set(restaurants.map((r) => r.name));
  Object.keys(statsMap).forEach((n) => {
    if (!knownNames.has(n)) {
      restaurantData.push({ name: n, cuisine: '', rating: null, ...statsMap[n] });
    }
  });

  return (
    <motion.div
      key="restaurants"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
    >
      {restaurantData.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">🍽️</div>
          <div className="admin-empty__text">No restaurants found.</div>
        </div>
      ) : (
        <div className="admin-restaurant-grid">
          {restaurantData.map((r) => (
            <div key={r.name} className="admin-restaurant-card">
              <div className="admin-restaurant-card__name">{r.name}</div>
              {r.cuisine && (
                <div className="admin-restaurant-card__cuisine">{r.cuisine}</div>
              )}
              {r.rating && (
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-pending)' }}>
                  ⭐ {r.rating}
                </div>
              )}
              <div className="admin-restaurant-card__stats">
                <div className="admin-restaurant-card__stat">
                  <div className="admin-restaurant-card__stat-val">{r.totalOrders}</div>
                  <div className="admin-restaurant-card__stat-label">Orders</div>
                </div>
                <div className="admin-restaurant-card__stat">
                  <div className="admin-restaurant-card__stat-val">₹{r.totalRevenue.toLocaleString()}</div>
                  <div className="admin-restaurant-card__stat-label">Revenue</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main AdminDashboard component ────────────────────────────────────────────

export default function AdminDashboard({ onLogout, restaurants = [] }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderBanner, setNewOrderBanner] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const bannerTimerRef = useRef(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('placed_at', { ascending: false });
    if (!error && data) setOrders(data);
    else if (error) console.warn('[Admin] Fetch error:', error.message);
    setRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Real-time subscription
  useEffect(() => {
    // NOTE: Enable Realtime for 'orders' table in Supabase dashboard
    const channel = supabase
      .channel('admin-orders-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new;
            setOrders((prev) => [newOrder, ...prev]);
            // Show banner
            setNewOrderBanner(newOrder.restaurant_name || 'Unknown');
            clearTimeout(bannerTimerRef.current);
            bannerTimerRef.current = setTimeout(() => setNewOrderBanner(null), 4000);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new;
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
            );
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old;
            setOrders((prev) => prev.filter((o) => o.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(bannerTimerRef.current);
    };
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    // Real-time subscription will update local state; optimistic update below:
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Derive unique restaurant names from orders
  const restaurantNames = [...new Set(orders.map((o) => o.restaurant_name).filter(Boolean))];

  const NAV = [
    { key: 'dashboard',   label: 'Dashboard',    icon: <LayoutDashboard size={18} /> },
    { key: 'live',        label: 'Live Orders',   icon: <Zap size={18} /> },
    { key: 'history',     label: 'Order History', icon: <History size={18} /> },
    { key: 'restaurants', label: 'Restaurants',   icon: <Store size={18} /> },
  ];

  const TAB_TITLES = {
    dashboard:   'Dashboard',
    live:        'Live Orders',
    history:     'Order History',
    restaurants: 'Restaurants',
  };

  const sidebarContent = (
    <>
      <div className="admin-sidebar-brand">
        🍽️ BufferBites Admin
      </div>
      <nav className="admin-sidebar-nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`admin-nav-item${activeTab === n.key ? ' active' : ''}`}
            onClick={() => { setActiveTab(n.key); setSidebarOpen(false); }}
          >
            {n.icon}
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <button className="admin-nav-item logout" onClick={onLogout}>
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--mobile-open' : ''}`}>
        {sidebarContent}
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
            <h1>{TAB_TITLES[activeTab]}</h1>
          </div>
          <div className="admin-header-actions">
            <button
              className={`admin-btn admin-btn-refresh${refreshing ? ' spinning' : ''}`}
              onClick={fetchOrders}
              aria-label="Refresh orders"
            >
              <RefreshCw size={15} />
            </button>
            <span className="admin-badge">Admin</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardTab key="dashboard" orders={orders} />
          )}
          {activeTab === 'live' && (
            <LiveOrdersTab
              key="live"
              orders={orders}
              onUpdate={updateOrderStatus}
              newOrderBanner={newOrderBanner}
              setNewOrderBanner={setNewOrderBanner}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab
              key="history"
              orders={orders}
              restaurants={restaurantNames}
            />
          )}
          {activeTab === 'restaurants' && (
            <RestaurantsTab
              key="restaurants"
              orders={orders}
              restaurants={restaurants}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
