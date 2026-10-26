import React, { useState, useMemo, useEffect, useRef } from 'react';
import Login from './Login.jsx';
import { supabase } from './supabase.js';
import AdminDashboard from './AdminDashboard.jsx';
import '../assets/index.css';
import OrderHistory from './OrderHistory.jsx';
import CustomSelect from './CustomSelect.jsx';
import { ActiveOrdersPage, CancelOrderSuccessCard } from './CancelOrder.jsx';
import { motion, AnimatePresence } from 'framer-motion';


import {
  Search, Heart, Leaf, Plus, ShoppingBag, X, ChevronRight, ArrowLeft,
  UtensilsCrossed, BarChart3, MapPin, TrendingUp, PieChart, Receipt,
  CheckCircle2, Bike, Armchair, Banknote, CreditCard, Clock3,
  PlusCircle, MinusCircle, Trash2, PartyPopper, Wallet, CalendarClock,
  Award, Percent, History, User, LogOut, Pencil, Eye, EyeOff, ClipboardList,
} from 'lucide-react';




// Helper: convert strings to Title Case (capitalize first letter of each word)
const titleCase = (str) => {
  if (!str) return str;
  return String(str)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ================= MOCK DATA =================
const RESTAURANTS = [
  // 1. Feeling Fast Food
  {
    id: 'feeling-fast-food',
    name: 'Feeling Fast Food',
    cuisine: 'Chatpata Chaat • Vada Pav • Dabeli • Chinese • Drinks',
    rating: 4.7,
    reviews: '1.1k',
    time: '10-15 min',
    priceForTwo: '₹180 for two',
    location: 'Ground Floor • Main Gate',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Special Bhel', 'Bombay Vada Pav', 'Khatka Dabeli', 'Dry Manchurian', 'Lassi'],
    category: 'Chatpata Chaat, Vada Pav, Dabeli, Sprouts, Pav Bhaji / Pulav, Kachori / Dahi Vada, Chinese, Drinks',
    menu: [
      // ── CHATPATA CHAAT ──
      { id: 'ff1',  name: 'Dry Bhel',                          price: 70,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Crispy puffed rice with tangy chutneys and sev — dry style.', calories: '220 kcal', popularity: 88 },
      { id: 'ff2',  name: 'Special Bhel',                      price: 60,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Special bhel with onions, tomatoes, sev and chutneys.', calories: '230 kcal', popularity: 92 },
      { id: 'ff3',  name: 'Special Cheese Bhel',               price: 50,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Special bhel topped with melted cheese.', calories: '270 kcal', popularity: 90 },
      { id: 'ff4',  name: 'Dahi Chatako',                      price: 60,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Tangy dahi chaat with sev and chutneys.', calories: '240 kcal', popularity: 89 },
      { id: 'ff5',  name: 'Pani Puri (Special Rava Puri, 8 pcs)', price: 30, category: 'Chatpata Chaat', isVeg: true, spice: 2, desc: 'Special rava puri with spicy flavoured water, 8 pcs.', calories: '180 kcal', popularity: 97 },
      { id: 'ff6',  name: 'Sev Puri (8–9 pcs)',                price: 45,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Crispy puris with potato, onion and sev, 8-9 pcs.', calories: '210 kcal', popularity: 94 },
      { id: 'ff7',  name: 'Chat Puri',                         price: 50,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Crispy puris with spicy chaat toppings.', calories: '220 kcal', popularity: 87 },
      { id: 'ff8',  name: 'Dahi Puri',                         price: 50,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Crispy puris filled with curd and sweet chutney.', calories: '235 kcal', popularity: 91 },
      { id: 'ff9',  name: 'Cheese Sev Puri',                   price: 70,  category: 'Chatpata Chaat', isVeg: true, spice: 1, desc: 'Sev puri loaded with melted cheese.', calories: '280 kcal', popularity: 93 },
      { id: 'ff10', name: 'D. SVIT Special Chana Churmu',      price: 30,  category: 'Chatpata Chaat', isVeg: true, spice: 2, desc: 'SVIT special spiced chana churmu.', calories: '200 kcal', popularity: 85 },
      // ── VADA PAV ──
      { id: 'ff11', name: 'Bombay Vada Pav (Jumbo Size)',       price: 15,  category: 'Vada Pav', isVeg: true, spice: 1, desc: 'Jumbo size Bombay style vada pav with chutneys.', calories: '280 kcal', popularity: 96 },
      { id: 'ff12', name: 'Masala Vada Pav',                   price: 20,  category: 'Vada Pav', isVeg: true, spice: 2, desc: 'Vada pav with extra masala spice mix.', calories: '295 kcal', popularity: 94 },
      { id: 'ff13', name: 'Butter Vada Pav (Amul)',             price: 35,  category: 'Vada Pav', isVeg: true, spice: 1, desc: 'Vada pav with Amul butter generously applied.', calories: '330 kcal', popularity: 93 },
      { id: 'ff14', name: 'Cheese Vada Pav (Amul)',             price: 35,  category: 'Vada Pav', isVeg: true, spice: 1, desc: 'Vada pav with Amul cheese slice.', calories: '340 kcal', popularity: 92 },
      { id: 'ff15', name: 'Garlic Vada Pav',                   price: 25,  category: 'Vada Pav', isVeg: true, spice: 2, desc: 'Vada pav with spicy garlic chutney.', calories: '300 kcal', popularity: 90 },
      { id: 'ff16', name: 'Garlic Cheese Vada Pav',             price: 40,  category: 'Vada Pav', isVeg: true, spice: 2, desc: 'Vada pav with garlic chutney and melted cheese.', calories: '355 kcal', popularity: 95 },
      // ── DABELI ──
      { id: 'ff17', name: 'Regular Dabeli',                     price: 20,  category: 'Dabeli', isVeg: true, spice: 1, desc: 'Classic Kutchi dabeli with sweet and spicy filling.', calories: '260 kcal', popularity: 90 },
      { id: 'ff18', name: 'Masala Dabeli',                      price: 20,  category: 'Dabeli', isVeg: true, spice: 2, desc: 'Dabeli with extra masala spice blend.', calories: '270 kcal', popularity: 88 },
      { id: 'ff19', name: 'Butter Dabeli',                      price: 35,  category: 'Dabeli', isVeg: true, spice: 1, desc: 'Dabeli enriched with butter for a rich taste.', calories: '310 kcal', popularity: 87 },
      { id: 'ff20', name: 'Cheese Dabeli',                      price: 25,  category: 'Dabeli', isVeg: true, spice: 1, desc: 'Dabeli topped with melted cheese.', calories: '295 kcal', popularity: 89 },
      { id: 'ff21', name: 'Garlic Dabeli',                      price: 60,  category: 'Dabeli', isVeg: true, spice: 2, desc: 'Dabeli with aromatic garlic chutney.', calories: '300 kcal', popularity: 86 },
      { id: 'ff22', name: 'Khatka Dabeli',                      price: 90,  category: 'Dabeli', isVeg: true, spice: 3, desc: 'Extra fiery Khatka special dabeli with bold flavours.', calories: '340 kcal', popularity: 97 },
      { id: 'ff23', name: 'Khatka Dabeli with Cheese',          price: 90,  category: 'Dabeli', isVeg: true, spice: 3, desc: 'Khatka dabeli loaded with melted cheese.', calories: '380 kcal', popularity: 96 },
      // ── SPROUTS ──
      { id: 'ff24', name: 'Chana Chat',                         price: 40,  category: 'Sprouts', isVeg: true, spice: 1, desc: 'Spiced chana with onions, tomatoes and chutneys.', calories: '200 kcal', popularity: 85 },
      { id: 'ff25', name: 'Chana Chat with Mug-Math',           price: 50,  category: 'Sprouts', isVeg: true, spice: 1, desc: 'Chana chaat with sprouted moong and math.', calories: '230 kcal', popularity: 83 },
      { id: 'ff26', name: 'Chana Chat with Curd',               price: 30,  category: 'Sprouts', isVeg: true, spice: 1, desc: 'Chana chaat with fresh creamy curd.', calories: '210 kcal', popularity: 84 },
      { id: 'ff27', name: 'Chana Mug-Math with Curd',           price: 55,  category: 'Sprouts', isVeg: true, spice: 1, desc: 'Sprouted chana and moong-math with curd.', calories: '240 kcal', popularity: 82 },
      { id: 'ff28', name: 'Sahi Dahi Vada',                     price: 40,  category: 'Sprouts', isVeg: true, spice: 0, desc: 'Soft vadas soaked in spiced sweetened curd.', calories: '290 kcal', popularity: 88 },
      { id: 'ff29', name: 'Pani Puri Vada',                     price: 30,  category: 'Sprouts', isVeg: true, spice: 2, desc: 'Vada served pani puri style with flavoured water.', calories: '220 kcal', popularity: 86 },
      // ── PAV BHAJI / PULAV ──
      { id: 'ff30', name: 'Pav Bhaji',                          price: 60,  category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Classic Mumbai pav bhaji with buttered pav.', calories: '420 kcal', popularity: 95 },
      { id: 'ff31', name: 'Butter Pav-Bhaji (Amul Butter)',     price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Pav bhaji generously topped with Amul butter.', calories: '520 kcal', popularity: 94 },
      { id: 'ff32', name: 'Cheese Pav Bhaji',                   price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Pav bhaji with melted cheese on top.', calories: '530 kcal', popularity: 93 },
      { id: 'ff33', name: 'Cheese Butter Pav Bhaji',            price: 80,  category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Pav bhaji with both cheese and Amul butter.', calories: '560 kcal', popularity: 92 },
      { id: 'ff34', name: 'Veg Pulav',                          price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Fragrant vegetable pulav with whole spices.', calories: '450 kcal', popularity: 87 },
      { id: 'ff35', name: 'Veg Butter Pulav',                   price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Vegetable pulav enriched with butter.', calories: '490 kcal', popularity: 86 },
      { id: 'ff36', name: 'Cheese Pulav',                       price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Pulav topped with melted cheese.', calories: '500 kcal', popularity: 88 },
      { id: 'ff37', name: 'Cheese Butter Pulav',                price: 120, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Pulav with both cheese and butter.', calories: '530 kcal', popularity: 89 },
      { id: 'ff38', name: 'SVIT Special Cheese Garlic Butter Bun', price: 130, category: 'Pav Bhaji / Pulav', isVeg: true, spice: 1, desc: 'Special SVIT bun with cheese, garlic and butter.', calories: '480 kcal', popularity: 96 },
      // ── KACHORI / DAHI VADA ──
      { id: 'ff39', name: 'Bhel-Kachori',                       price: 50,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 2, desc: 'Crispy kachori with bhel toppings.', calories: '320 kcal', popularity: 88 },
      { id: 'ff40', name: 'Bhel-Kachori (Jumbo Size)',          price: 70,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 2, desc: 'Jumbo kachori loaded with bhel and chutneys.', calories: '400 kcal', popularity: 90 },
      { id: 'ff41', name: 'Dahi Kachori',                       price: 50,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 1, desc: 'Crispy kachori served with sweet curd and chutneys.', calories: '330 kcal', popularity: 87 },
      { id: 'ff42', name: 'Dahi Kachori (Jumbo Size)',          price: 60,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 1, desc: 'Jumbo kachori with generous dahi topping.', calories: '390 kcal', popularity: 89 },
      { id: 'ff43', name: 'Special Kachori Bhel',               price: 50,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 2, desc: 'Special kachori with bhel mix and chutneys.', calories: '340 kcal', popularity: 86 },
      { id: 'ff44', name: 'SVIT Special Dahi Vada',             price: 70,  category: 'Kachori / Dahi Vada', isVeg: true, spice: 0, desc: 'SVIT special dahi vada with layered toppings.', calories: '310 kcal', popularity: 93 },
      // ── CHINESE ──
      { id: 'ff45', name: 'Dry Manchurian',       price: 70,  category: 'Chinese', isVeg: true, spice: 2, desc: 'Crispy veg balls in spicy dry Indo-Chinese sauce.', calories: '340 kcal', popularity: 96, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff46', name: 'Gravy Manchurian',     price: 120, category: 'Chinese', isVeg: true, spice: 2, desc: 'Veg balls in rich and spicy manchurian gravy.', calories: '380 kcal', popularity: 93, sizeVariants: [{ label: 'Full', price: 120 }] },
      { id: 'ff47', name: 'Fried Rice',           price: 60,  category: 'Chinese', isVeg: true, spice: 1, desc: 'Wok-tossed vegetable fried rice.', calories: '360 kcal', popularity: 95, sizeVariants: [{ label: 'Small', price: 60 }, { label: 'Full', price: 80 }] },
      { id: 'ff48', name: 'Manchurian Fried Rice', price: 70, category: 'Chinese', isVeg: true, spice: 2, desc: 'Fried rice served with manchurian balls.', calories: '420 kcal', popularity: 94, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff49', name: 'Schezwan Rice with Manchurian', price: 70, category: 'Chinese', isVeg: true, spice: 3, desc: 'Spicy schezwan rice with manchurian balls.', calories: '440 kcal', popularity: 96, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff50', name: 'Garlic Rice',           price: 60,  category: 'Chinese', isVeg: true, spice: 1, desc: 'Aromatic garlic-tossed rice with veggies.', calories: '370 kcal', popularity: 88, sizeVariants: [{ label: 'Small', price: 60 }, { label: 'Full', price: 80 }] },
      { id: 'ff51', name: 'Garlic Manchurian Rice', price: 70, category: 'Chinese', isVeg: true, spice: 2, desc: 'Garlic rice with manchurian balls.', calories: '430 kcal', popularity: 90, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff52', name: 'Singapuri Rice with Manchurian', price: 70, category: 'Chinese', isVeg: true, spice: 2, desc: 'Singapore style rice with manchurian balls.', calories: '440 kcal', popularity: 91, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff53', name: 'Fried Rice with Gravy', price: 120, category: 'Chinese', isVeg: true, spice: 1, desc: 'Fried rice served with rich vegetable gravy.', calories: '450 kcal', popularity: 89, sizeVariants: [{ label: 'Full', price: 120 }] },
      { id: 'ff54', name: 'Hakka Noodles',          price: 70,  category: 'Chinese', isVeg: true, spice: 1, desc: 'Wok-tossed hakka noodles with fresh vegetables.', calories: '390 kcal', popularity: 94, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff55', name: 'Hakka Noodles with Manchurian', price: 70, category: 'Chinese', isVeg: true, spice: 2, desc: 'Hakka noodles served with manchurian balls.', calories: '450 kcal', popularity: 93, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff56', name: 'Chinese Bhel',           price: 70,  category: 'Chinese', isVeg: true, spice: 2, desc: 'Crispy noodle bhel with Indo-Chinese flavours.', calories: '310 kcal', popularity: 92, sizeVariants: [{ label: 'Small', price: 70 }, { label: 'Full', price: 90 }] },
      { id: 'ff57', name: 'Manchow Soup',           price: 50,  category: 'Chinese', isVeg: true, spice: 2, desc: 'Spicy thick Manchow soup with crispy noodles.', calories: '180 kcal', popularity: 87, sizeVariants: [{ label: 'Small', price: 50 }, { label: 'Full', price: 70 }] },
      { id: 'ff58', name: 'Hot and Sour Soup',      price: 50,  category: 'Chinese', isVeg: true, spice: 2, desc: 'Classic hot and sour vegetable soup.', calories: '170 kcal', popularity: 86, sizeVariants: [{ label: 'Small', price: 50 }, { label: 'Full', price: 70 }] },
      { id: 'ff59', name: 'Paneer Chilli Dry',      price: 100, category: 'Chinese', isVeg: true, spice: 2, desc: 'Crispy paneer tossed in dry chilli sauce.', calories: '380 kcal', popularity: 97, sizeVariants: [{ label: 'Small', price: 100 }, { label: 'Full', price: 100 }] },
      { id: 'ff60', name: 'Paneer Chilli Gravy',    price: 120, category: 'Chinese', isVeg: true, spice: 2, desc: 'Paneer cubes in rich chilli gravy.', calories: '420 kcal', popularity: 95, sizeVariants: [{ label: 'Small', price: 120 }, { label: 'Full', price: 150 }] },
      { id: 'ff61', name: 'Paneer Rice',            price: 120, category: 'Chinese', isVeg: true, spice: 1, desc: 'Fried rice with spiced paneer pieces.', calories: '460 kcal', popularity: 92, sizeVariants: [{ label: 'Small', price: 120 }, { label: 'Full', price: 150 }] },
      { id: 'ff62', name: 'Cheese Rice',            price: 120, category: 'Chinese', isVeg: true, spice: 1, desc: 'Fried rice topped with melted cheese.', calories: '470 kcal', popularity: 91, sizeVariants: [{ label: 'Small', price: 120 }, { label: 'Full', price: 120 }] },
      // ── SVIT SPECIAL DRINKS ──
      { id: 'ff63', name: 'Rajwadi Masala Chaas',   price: 20,  category: 'Drinks', isVeg: true, spice: 1, desc: 'Chilled Rajwadi spiced buttermilk.', calories: '80 kcal', popularity: 89 },
      { id: 'ff64', name: 'Lemon Juice',             price: 20,  category: 'Drinks', isVeg: true, spice: 0, desc: 'Fresh squeezed lemon juice.', calories: '60 kcal', popularity: 90 },
      { id: 'ff65', name: 'Chhas',                   price: 20,  category: 'Drinks', isVeg: true, spice: 0, desc: 'Simple refreshing buttermilk.', calories: '70 kcal', popularity: 86 },
      { id: 'ff66', name: 'Limbu Sharbat',           price: 15,  category: 'Drinks', isVeg: true, spice: 0, desc: 'Sweet lemon sharbat, chilled and refreshing.', calories: '90 kcal', popularity: 85 },
      { id: 'ff67', name: 'Lassi',                   price: 50,  category: 'Drinks', isVeg: true, spice: 0, desc: 'Thick creamy sweet lassi.', calories: '200 kcal', popularity: 94 },
    ]
  },
  // 2. Mech Cafe
  {
    id: 'mech-cafe',
    name: 'MECH CAFE',
    cuisine: 'Puffs • Nachos • Subs • Mojitos',
    rating: 4.9,
    reviews: '1.5k',
    time: '10-15 min',
    priceForTwo: '₹200 for two',
    location: 'Ground Floor • Block C',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Bun Samosa', 'Veg Cheese Nachos', 'Paneer Tikka Sub'],
    category: 'Bun Samosa, Nachos, Sub, Mojito, Puff',
    menu: [
      { id: 'mc1', name: 'Bun Samosa', price: 30, category: 'Bun Samosa', isVeg: true, spice: 1, desc: 'Crispy samosa in a soft bun with chutneys.', calories: '280 kcal', popularity: 95 },
      { id: 'mc2', name: 'Tangy Bun Samosa', price: 35, category: 'Bun Samosa', isVeg: true, spice: 2, desc: 'Bun samosa with tangy tamarind chutney.', calories: '300 kcal', popularity: 92 },
      { id: 'mc3', name: 'Tandoori Bun Samosa', price: 40, category: 'Bun Samosa', isVeg: true, spice: 2, desc: 'Spiced tandoori flavoured samosa in a bun.', calories: '310 kcal', popularity: 90 },
      { id: 'mc4', name: 'Pizza Bun Samosa', price: 40, category: 'Bun Samosa', isVeg: true, spice: 1, desc: 'Samosa with pizza mayo and cheese in a bun.', calories: '320 kcal', popularity: 88 },
      { id: 'mc5', name: 'V.I.P Bun Samosa', price: 40, category: 'Bun Samosa', isVeg: true, spice: 1, desc: 'Premium bun samosa with extra toppings.', calories: '330 kcal', popularity: 89 },
      { id: 'mc6', name: 'Sun Bun Samosa', price: 50, category: 'Bun Samosa', isVeg: true, spice: 1, desc: 'Bun samosa served with crispy wafer.', calories: '360 kcal', popularity: 87 },
      { id: 'mc7', name: 'Thrill Bun Samosa', price: 50, category: 'Bun Samosa', isVeg: true, spice: 3, desc: 'Extra spicy bun samosa served with wafer.', calories: '350 kcal', popularity: 86 },
      { id: 'mc8', name: 'Cheese Tandoori Bun Samosa', price: 60, category: 'Bun Samosa', isVeg: true, spice: 2, desc: 'Tandoori samosa with melted cheese in bun with wafer.', calories: '390 kcal', popularity: 91 },
      { id: 'mc9', name: 'Paneer Cheese Tandoori Bun Samosa', price: 70, category: 'Bun Samosa', isVeg: true, spice: 2, desc: 'Tandoori paneer with cheese bun samosa and wafer.', calories: '420 kcal', popularity: 93 },
      { id: 'mc10', name: 'Veg Cheese Nachos', price: 55, category: 'Nachos', isVeg: true, spice: 0, desc: 'Crunchy nachos with melted veg cheese.', calories: '340 kcal', popularity: 94 },
      { id: 'mc11', name: 'Veg Cheese Pizza Nachos', price: 55, category: 'Nachos', isVeg: true, spice: 0, desc: 'Nachos with pizza sauce and melted cheese.', calories: '350 kcal', popularity: 91 },
      { id: 'mc12', name: 'Veg Cheese Tandoori Nachos', price: 60, category: 'Nachos', isVeg: true, spice: 2, desc: 'Tandoori flavoured nachos with cheese.', calories: '360 kcal', popularity: 89 },
      { id: 'mc13', name: 'Veg Cheese Mexican Nachos', price: 60, category: 'Nachos', isVeg: true, spice: 1, desc: 'Mexican spiced nachos with veg and cheese.', calories: '365 kcal', popularity: 88 },
      { id: 'mc14', name: 'Baked Veg Cheese Nachos', price: 65, category: 'Nachos', isVeg: true, spice: 0, desc: 'Freshly baked nachos with cheese and veggies.', calories: '370 kcal', popularity: 90 },
      { id: 'mc15', name: 'Baked Veg Cheese Pizza Nachos', price: 65, category: 'Nachos', isVeg: true, spice: 0, desc: 'Baked nachos with pizza cheese blend.', calories: '375 kcal', popularity: 89 },
      { id: 'mc16', name: 'Baked Veg Cheese Tandoori Nachos', price: 70, category: 'Nachos', isVeg: true, spice: 2, desc: 'Baked tandoori nachos with melted cheese.', calories: '385 kcal', popularity: 87 },
      { id: 'mc17', name: 'Baked Veg Cheese Mexican Nachos', price: 70, category: 'Nachos', isVeg: true, spice: 2, desc: 'Baked Mexican nachos with cheese and jalapeños.', calories: '390 kcal', popularity: 86 },
      { id: 'mc18', name: 'Veggie Delight Sub', price: 80, category: 'Sub', isVeg: true, spice: 0, desc: 'Fresh veggies sub with mayo and cheese.', calories: '380 kcal', popularity: 85 },
      { id: 'mc19', name: 'Aloo Patty Sub', price: 90, category: 'Sub', isVeg: true, spice: 1, desc: 'Crispy aloo patty sub with special sauce.', calories: '410 kcal', popularity: 87 },
      { id: 'mc20', name: 'Corn & Peas Sub', price: 100, category: 'Sub', isVeg: true, spice: 0, desc: 'Sweet corn and green peas in a sub.', calories: '420 kcal', popularity: 84 },
      { id: 'mc21', name: 'Hara Bhara Kabab Sub', price: 100, category: 'Sub', isVeg: true, spice: 1, desc: 'Green vegetable kabab in a sub.', calories: '430 kcal', popularity: 86 },
      { id: 'mc22', name: 'Mexican Patty Sub', price: 110, category: 'Sub', isVeg: true, spice: 2, desc: 'Spicy Mexican patty with jalapeños.', calories: '450 kcal', popularity: 88 },
      { id: 'mc23', name: 'Paneer Tikka Sub', price: 120, category: 'Sub', isVeg: true, spice: 2, desc: 'Spiced paneer tikka in a toasted sub.', calories: '470 kcal', popularity: 92 },
      { id: 'mc24', name: 'Lemon Mint Mojito', price: 30, category: 'Mojito', isVeg: true, spice: 0, desc: 'Classic lemon mint mojito chilled.', calories: '120 kcal', popularity: 96 },
      { id: 'mc25', name: 'Strawberry Mojito', price: 40, category: 'Mojito', isVeg: true, spice: 0, desc: 'Fresh strawberry flavoured mojito.', calories: '140 kcal', popularity: 90 },
      { id: 'mc26', name: 'Orange Mojito', price: 40, category: 'Mojito', isVeg: true, spice: 0, desc: 'Refreshing orange mint mojito.', calories: '135 kcal', popularity: 89 },
      { id: 'mc27', name: 'Cranberry Mojito', price: 45, category: 'Mojito', isVeg: true, spice: 0, desc: 'Tangy cranberry mojito with mint.', calories: '145 kcal', popularity: 88 },
      { id: 'mc28', name: 'Blueberry Mojito', price: 50, category: 'Mojito', isVeg: true, spice: 0, desc: 'Antioxidant blueberry mojito.', calories: '150 kcal', popularity: 87 },
      { id: 'mc29', name: 'Regular Puff', price: 15, category: 'Puff', isVeg: true, spice: 0, desc: 'Plain puff pastry, light and crispy.', calories: '180 kcal', popularity: 85 },
      { id: 'mc30', name: 'Butter Puff', price: 20, category: 'Puff', isVeg: true, spice: 0, desc: 'Buttery puff pastry, rich and soft.', calories: '210 kcal', popularity: 88 },
      { id: 'mc31', name: 'Mayo Puff', price: 25, category: 'Puff', isVeg: true, spice: 0, desc: 'Puff with creamy mayo.', calories: '240 kcal', popularity: 82 },
      { id: 'mc32', name: 'Cheese Puff', price: 30, category: 'Puff', isVeg: true, spice: 0, desc: 'Puff with melted cheese.', calories: '260 kcal', popularity: 90 },
      { id: 'mc33', name: 'Mayo Cheese Puff', price: 35, category: 'Puff', isVeg: true, spice: 0, desc: 'Puff with mayo and cheese combo.', calories: '290 kcal', popularity: 91 },
      { id: 'mc34', name: 'Garlic Puff', price: 20, category: 'Puff', isVeg: true, spice: 0, desc: 'Aromatic garlic flavoured puff.', calories: '220 kcal', popularity: 89 },
      { id: 'mc35', name: 'Garlic Sev Onion Puff', price: 25, category: 'Puff', isVeg: true, spice: 1, desc: 'Garlic puff with crispy sev and onions.', calories: '250 kcal', popularity: 86 },
      { id: 'mc36', name: 'Mayo Garlic Puff', price: 30, category: 'Puff', isVeg: true, spice: 0, desc: 'Garlic puff with creamy mayo.', calories: '270 kcal', popularity: 85 },
      { id: 'mc37', name: 'Cheese Garlic Puff', price: 35, category: 'Puff', isVeg: true, spice: 0, desc: 'Garlic puff with melted cheese.', calories: '300 kcal', popularity: 92 },
      { id: 'mc38', name: 'Cheese Garlic Mayo Puff', price: 40, category: 'Puff', isVeg: true, spice: 0, desc: 'Garlic puff with cheese and mayo.', calories: '330 kcal', popularity: 93 },
      { id: 'mc39', name: 'Schezwan Puff', price: 25, category: 'Puff', isVeg: true, spice: 2, desc: 'Puff with spicy schezwan sauce.', calories: '245 kcal', popularity: 88 },
      { id: 'mc40', name: 'Mayo Schezwan Puff', price: 30, category: 'Puff', isVeg: true, spice: 2, desc: 'Schezwan puff with creamy mayo.', calories: '280 kcal', popularity: 87 },
      { id: 'mc41', name: 'Cheese Schezwan Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Schezwan puff with melted cheese.', calories: '310 kcal', popularity: 89 },
      { id: 'mc42', name: 'Cheese Mayo Schezwan Puff', price: 40, category: 'Puff', isVeg: true, spice: 2, desc: 'Schezwan puff with cheese and mayo.', calories: '340 kcal', popularity: 90 },
      { id: 'mc43', name: 'Sev Onion Puff', price: 20, category: 'Puff', isVeg: true, spice: 1, desc: 'Puff with crispy sev and onions.', calories: '215 kcal', popularity: 84 },
      { id: 'mc44', name: 'Mayo Sev Onion Puff', price: 30, category: 'Puff', isVeg: true, spice: 1, desc: 'Sev onion puff with mayo.', calories: '260 kcal', popularity: 86 },
      { id: 'mc45', name: 'Cheese Sev Onion Puff', price: 35, category: 'Puff', isVeg: true, spice: 1, desc: 'Sev onion puff with cheese.', calories: '290 kcal', popularity: 88 },
      { id: 'mc46', name: 'Cheese Mayo Sev Onion Puff', price: 40, category: 'Puff', isVeg: true, spice: 1, desc: 'Sev onion puff with cheese and mayo.', calories: '320 kcal', popularity: 89 },
      { id: 'mc47', name: 'Tandoori Sev Onion Puff', price: 30, category: 'Puff', isVeg: true, spice: 2, desc: 'Tandoori spiced sev onion puff.', calories: '270 kcal', popularity: 85 },
      { id: 'mc48', name: 'Mexican Sev Onion Puff', price: 30, category: 'Puff', isVeg: true, spice: 2, desc: 'Mexican spiced sev onion puff.', calories: '275 kcal', popularity: 84 },
      { id: 'mc49', name: 'Tandoori Puff', price: 30, category: 'Puff', isVeg: true, spice: 2, desc: 'Puff with tandoori spice blend.', calories: '280 kcal', popularity: 87 },
      { id: 'mc50', name: 'Cheese Tandoori Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Tandoori puff with melted cheese.', calories: '310 kcal', popularity: 89 },
      { id: 'mc51', name: 'Paneer Tandoori Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Tandoori puff with paneer filling.', calories: '315 kcal', popularity: 90 },
      { id: 'mc52', name: 'Cheese Paneer Tandoori Puff', price: 45, category: 'Puff', isVeg: true, spice: 2, desc: 'Tandoori paneer with cheese puff.', calories: '350 kcal', popularity: 94 },
      { id: 'mc53', name: 'Chinese Puff', price: 20, category: 'Puff', isVeg: true, spice: 1, desc: 'Puff with Chinese sauce.', calories: '225 kcal', popularity: 83 },
      { id: 'mc54', name: 'Chinese Mayo Puff', price: 30, category: 'Puff', isVeg: true, spice: 1, desc: 'Chinese puff with creamy mayo.', calories: '270 kcal', popularity: 84 },
      { id: 'mc55', name: 'Chinese Cheese Puff', price: 35, category: 'Puff', isVeg: true, spice: 1, desc: 'Chinese puff with melted cheese.', calories: '300 kcal', popularity: 86 },
      { id: 'mc56', name: 'Pizza Puff', price: 25, category: 'Puff', isVeg: true, spice: 0, desc: 'Puff with pizza cheese and sauce.', calories: '255 kcal', popularity: 91 },
      { id: 'mc57', name: 'Mayo Pizza Puff', price: 35, category: 'Puff', isVeg: true, spice: 0, desc: 'Pizza puff with creamy mayo.', calories: '295 kcal', popularity: 88 },
      { id: 'mc58', name: 'Cheese Pizza Puff', price: 40, category: 'Puff', isVeg: true, spice: 0, desc: 'Pizza puff with extra cheese.', calories: '320 kcal', popularity: 92 },
      { id: 'mc59', name: 'Cheese Mayo Pizza Puff', price: 45, category: 'Puff', isVeg: true, spice: 0, desc: 'Pizza puff with cheese and mayo.', calories: '350 kcal', popularity: 93 },
      { id: 'mc60', name: 'Garlic Pizza Puff', price: 30, category: 'Puff', isVeg: true, spice: 0, desc: 'Pizza puff with garlic flavour.', calories: '280 kcal', popularity: 87 },
      { id: 'mc61', name: 'Cheese Garlic Pizza Puff', price: 40, category: 'Puff', isVeg: true, spice: 0, desc: 'Garlic pizza puff with extra cheese.', calories: '330 kcal', popularity: 90 },
      { id: 'mc62', name: 'Punjabi Puff', price: 25, category: 'Puff', isVeg: true, spice: 1, desc: 'Punjabi style puff with aloo.', calories: '250 kcal', popularity: 86 },
      { id: 'mc63', name: 'Mayo Punjabi Puff', price: 35, category: 'Puff', isVeg: true, spice: 1, desc: 'Punjabi puff with creamy mayo.', calories: '290 kcal', popularity: 85 },
      { id: 'mc64', name: 'Cheese Punjabi Puff', price: 40, category: 'Puff', isVeg: true, spice: 1, desc: 'Punjabi puff with melted cheese.', calories: '320 kcal', popularity: 88 },
      { id: 'mc65', name: 'Mayo Cheese Punjabi Puff', price: 45, category: 'Puff', isVeg: true, spice: 1, desc: 'Punjabi puff with cheese and mayo.', calories: '350 kcal', popularity: 89 },
      { id: 'mc66', name: 'Mexican Puff', price: 30, category: 'Puff', isVeg: true, spice: 2, desc: 'Puff with Mexican spice blend.', calories: '285 kcal', popularity: 87 },
      { id: 'mc67', name: 'Paneer Mexican Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Mexican puff with paneer.', calories: '310 kcal', popularity: 89 },
      { id: 'mc68', name: 'Cheese Mexican Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Mexican puff with melted cheese.', calories: '315 kcal', popularity: 88 },
      { id: 'mc69', name: 'Cheese Paneer Mexican Puff', price: 40, category: 'Puff', isVeg: true, spice: 2, desc: 'Mexican puff with paneer and cheese.', calories: '340 kcal', popularity: 90 },
      { id: 'mc70', name: 'Special Tandoori Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Special tandoori puff served with wafer.', calories: '310 kcal', popularity: 92 },
      { id: 'mc71', name: 'Special Mexican Puff', price: 35, category: 'Puff', isVeg: true, spice: 2, desc: 'Special Mexican puff served with wafer.', calories: '315 kcal', popularity: 91 }
    ]
  },
  {
    id: 'chai-snacks',
    name: 'Khana Khajana',
    cuisine: 'Thali • Snacks • Breakfast • Parathas',
    rating: 4.6,
    reviews: '860',
    time: '10-15 min',
    priceForTwo: '₹120 for two',
    location: 'Ground Floor • Near Canteen Gate',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Gujarati Thali', 'Paneer Cheese Aloo Paratha', 'Idli Sambhar', 'Chhole Bhature'],
    category: 'Beverages, Snacks & Breakfast, Lunch, Parathas',
    menu: [
      { id: 'cs1',  name: 'Tea (Full)',                          price: 20,  category: 'Beverages',          isVeg: true, spice: 0, desc: 'Full glass of freshly brewed hot tea.',                                    calories: '60 kcal',  popularity: 92 },
      { id: 'cs2',  name: 'Coffee (Full)',                       price: 30,  category: 'Beverages',          isVeg: true, spice: 0, desc: 'Full glass of hot brewed coffee.',                                         calories: '70 kcal',  popularity: 88 },
      { id: 'cs3',  name: 'Milk (Full)',                         price: 30,  category: 'Beverages',          isVeg: true, spice: 0, desc: 'Full glass of fresh hot or cold milk.',                                    calories: '150 kcal', popularity: 82 },
      { id: 'cs4',  name: 'Poha',                                price: 20,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Light flattened rice poha with mustard and curry leaves.',                 calories: '220 kcal', popularity: 88 },
      { id: 'cs5',  name: 'Samosa (2 pcs)',                      price: 20,  category: 'Snacks & Breakfast', isVeg: true, spice: 2, desc: 'Two crispy samosas with spiced potato-pea filling.',                       calories: '300 kcal', popularity: 95 },
      { id: 'cs6',  name: 'Thepla (2 pcs)',                      price: 30,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Two soft Gujarati methi theplas.',                                        calories: '260 kcal', popularity: 87 },
      { id: 'cs7',  name: 'Bread Pakoda (2 pcs)',                price: 30,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Two bread pakodas with spiced filling, deep fried.',                      calories: '320 kcal', popularity: 86 },
      { id: 'cs8',  name: 'Dhokla (100g)',                       price: 25,  category: 'Snacks & Breakfast', isVeg: true, spice: 0, desc: 'Soft steamed dhokla with green chilli tempering, 100g.',                  calories: '180 kcal', popularity: 89 },
      { id: 'cs9',  name: 'Makai Vada / Corn Vada (3 pcs)',      price: 20,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Three crispy corn vadas with chutney.',                                   calories: '240 kcal', popularity: 85 },
      { id: 'cs10', name: 'Mix Bhajiya (100g)',                  price: 25,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Mixed onion and veggie bhajiyas, 100g.',                                  calories: '270 kcal', popularity: 84 },
      { id: 'cs11', name: 'Veg Upma (1 plate)',                  price: 30,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Semolina upma with vegetables and tempering.',                            calories: '250 kcal', popularity: 83 },
      { id: 'cs12', name: 'Khaman (100g)',                       price: 30,  category: 'Snacks & Breakfast', isVeg: true, spice: 0, desc: 'Soft spongy khaman with mustard and coriander, 100g.',                   calories: '200 kcal', popularity: 90 },
      { id: 'cs13', name: 'Sev Khamani (1 plate)',               price: 40,  category: 'Snacks & Breakfast', isVeg: true, spice: 0, desc: 'Crumbled khaman topped with sev and tempering.',                         calories: '230 kcal', popularity: 87 },
      { id: 'cs14', name: 'Idli Sambhar (1 plate)',              price: 50,  category: 'Snacks & Breakfast', isVeg: true, spice: 1, desc: 'Soft steamed idlis with hot sambhar and chutney.',                       calories: '280 kcal', popularity: 91 },
      { id: 'cs15', name: 'Gujarati Thali (Fix)',                price: 100, category: 'Lunch',              isVeg: true, spice: 1, desc: 'Fixed Gujarati thali with dal, rice, sabji, roti and accompaniments.',    calories: '800 kcal', popularity: 96 },
      { id: 'cs16', name: 'Punjabi Thali (Fix)',                 price: 100, category: 'Lunch',              isVeg: true, spice: 2, desc: 'Fixed Punjabi thali with dal makhani, sabji, roti and rice.',             calories: '850 kcal', popularity: 93 },
      { id: 'cs17', name: 'Special Thali (Fix)',                 price: 120, category: 'Lunch',              isVeg: true, spice: 1, desc: 'Special fixed thali with extra items and sweet.',                         calories: '900 kcal', popularity: 95 },
      { id: 'cs18', name: 'Deluxe Lunch',                       price: 150, category: 'Lunch',              isVeg: true, spice: 1, desc: 'Deluxe lunch with premium dishes, sweet and chaas.',                      calories: '1000 kcal', popularity: 92 },
      { id: 'cs19', name: 'Roti Sabji (Fix)',                    price: 60,  category: 'Lunch',              isVeg: true, spice: 1, desc: 'Fixed roti with seasonal sabji.',                                        calories: '450 kcal', popularity: 85 },
      { id: 'cs20', name: 'Chhole Bhature (Fix)',                price: 70,  category: 'Lunch',              isVeg: true, spice: 2, desc: 'Spicy chhole with fluffy bhature, onion and pickle.',                    calories: '580 kcal', popularity: 91 },
      { id: 'cs21', name: 'Kadhi Pulav (Fix)',                   price: 60,  category: 'Lunch',              isVeg: true, spice: 1, desc: 'Gujarati kadhi served with flavoured pulav.',                            calories: '520 kcal', popularity: 88 },
      { id: 'cs22', name: 'Plain Aloo Paratha (1 pc)',           price: 50,  category: 'Parathas',           isVeg: true, spice: 1, desc: 'Whole wheat paratha stuffed with spiced potato.',                        calories: '300 kcal', popularity: 88 },
      { id: 'cs23', name: 'Cheese Aloo Paratha (1 pc)',          price: 80,  category: 'Parathas',           isVeg: true, spice: 1, desc: 'Aloo paratha loaded with melted cheese.',                                calories: '380 kcal', popularity: 90 },
      { id: 'cs24', name: 'Paneer Cheese Aloo Paratha (1 pc)',   price: 100, category: 'Parathas',           isVeg: true, spice: 1, desc: 'Premium paratha with potato, paneer and cheese filling.',                calories: '450 kcal', popularity: 93 }
    ]
  },
  {
    id: 'cool-bites',
    name: 'Gajanand Sandwich Center',
    cuisine: 'Sandwiches • Wraps • Garlic Bread',
    rating: 4.8,
    reviews: '920',
    time: '10-15 min',
    priceForTwo: '₹200 for two',
    location: 'Ground Floor • Courtyard',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Paneer Tandoori Sandwich', 'Pizza Sandwich', 'Cheese Garlic Bread', 'Paneer Wrap'],
    category: 'Jumbo Sandwich, Sandwich, Wrap, Burger, Fries, Salad, Corn, Hot Dog, Garlic Bread',
    menu: [
      { id: 'gs1', name: 'Cheese Chutney Sandwich', price: 40, category: 'Jumbo Sandwich', isVeg: true, spice: 1, desc: 'Soft bread with cheese and tangy chutney.', calories: '250 kcal', popularity: 90 },
      { id: 'gs2', name: 'Double Cheese Chutney Sandwich', price: 50, category: 'Jumbo Sandwich', isVeg: true, spice: 1, desc: 'Double cheese with spicy chutney in jumbo bread.', calories: '310 kcal', popularity: 92 },
      { id: 'gs3', name: 'Schezwan Cheese Butter', price: 50, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Butter bread with schezwan sauce and melted cheese.', calories: '320 kcal', popularity: 89 },
      { id: 'gs4', name: 'Tandoori Cheese Butter', price: 50, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Tandoori spiced butter sandwich with cheese.', calories: '315 kcal', popularity: 88 },
      { id: 'gs5', name: 'Cheese Chutney Jumbo', price: 80, category: 'Jumbo Sandwich', isVeg: true, spice: 1, desc: 'Jumbo sized sandwich with cheese and special chutney.', calories: '400 kcal', popularity: 91 },
      { id: 'gs6', name: 'Masala Waffer Jumbo', price: 100, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Jumbo sandwich with spicy masala and crispy wafer.', calories: '420 kcal', popularity: 87 },
      { id: 'gs7', name: 'Special Jumbo', price: 100, category: 'Jumbo Sandwich', isVeg: true, spice: 1, desc: 'House special jumbo sandwich with premium toppings.', calories: '430 kcal', popularity: 93 },
      { id: 'gs8', name: 'Paneer Schezwan Jumbo', price: 100, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Jumbo paneer sandwich with spicy schezwan sauce.', calories: '440 kcal', popularity: 94 },
      { id: 'gs9', name: 'Paneer Tandoori Jumbo', price: 100, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Tandoori paneer in a jumbo sandwich.', calories: '450 kcal', popularity: 95 },
      { id: 'gs10', name: 'Paneer Jalapeno Olives Jumbo', price: 100, category: 'Jumbo Sandwich', isVeg: true, spice: 2, desc: 'Premium paneer with jalapenos and olives in jumbo bread.', calories: '460 kcal', popularity: 96 },
      { id: 'gs11', name: 'Masala Corn', price: 40, category: 'Boil Corn', isVeg: true, spice: 2, desc: 'Sweet corn with tangy masala seasoning.', calories: '180 kcal', popularity: 85 },
      { id: 'gs12', name: 'Butter Corn with Masala', price: 50, category: 'Boil Corn', isVeg: true, spice: 1, desc: 'Buttery corn with light masala powder.', calories: '220 kcal', popularity: 87 },
      { id: 'gs13', name: 'Cheese Corn', price: 60, category: 'Boil Corn', isVeg: true, spice: 0, desc: 'Sweet corn with melted cheese topping.', calories: '260 kcal', popularity: 89 },
      { id: 'gs14', name: 'Bread Butter', price: 20, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Simple buttered bread sandwich, light and soft.', calories: '150 kcal', popularity: 82 },
      { id: 'gs15', name: 'Bread Butter Grill', price: 25, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Grilled butter bread sandwich, crispy outside.', calories: '170 kcal', popularity: 84 },
      { id: 'gs16', name: 'Butter Jam', price: 30, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Sweet jam with creamy butter.', calories: '200 kcal', popularity: 80 },
      { id: 'gs17', name: 'Cheese Butter', price: 30, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Melted cheese with butter in soft bread.', calories: '210 kcal', popularity: 85 },
      { id: 'gs18', name: 'Bread Thousand Cheese', price: 50, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Thousand island dressing with extra cheese.', calories: '280 kcal', popularity: 86 },
      { id: 'gs19', name: 'Veg Grill Sandwich', price: 50, category: 'Sandwich', isVeg: true, spice: 1, desc: 'Grilled vegetables with cheese and mayo.', calories: '270 kcal', popularity: 84 },
      { id: 'gs20', name: 'Veg Cheese Sandwich', price: 60, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Fresh vegetables with melted cheese.', calories: '290 kcal', popularity: 88 },
      { id: 'gs21', name: 'Chilly Cheese Sandwich', price: 60, category: 'Sandwich', isVeg: true, spice: 2, desc: 'Spicy chilli peppers with melted cheese.', calories: '300 kcal', popularity: 86 },
      { id: 'gs22', name: 'Veg Tikki Sandwich', price: 60, category: 'Sandwich', isVeg: true, spice: 1, desc: 'Crispy potato tikki in bread with chutneys.', calories: '310 kcal', popularity: 87 },
      { id: 'gs23', name: 'Veg Tikki Cheese Sandwich', price: 70, category: 'Sandwich', isVeg: true, spice: 1, desc: 'Tikki with extra melted cheese.', calories: '340 kcal', popularity: 89 },
      { id: 'gs24', name: 'Corn Sandwich', price: 60, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Sweet corn and vegetables in soft bread.', calories: '280 kcal', popularity: 83 },
      { id: 'gs25', name: 'Veg Mayo Sandwich', price: 70, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Three layer sandwich with veggies and creamy mayo.', calories: '320 kcal', popularity: 85 },
      { id: 'gs26', name: 'Paneer Schezwan Sandwich', price: 80, category: 'Sandwich', isVeg: true, spice: 2, desc: 'Spiced paneer with tangy schezwan sauce.', calories: '350 kcal', popularity: 90 },
      { id: 'gs27', name: 'Open Chilly Sandwich', price: 70, category: 'Sandwich', isVeg: true, spice: 2, desc: 'Open sandwich with green chilli and cheese.', calories: '300 kcal', popularity: 82 },
      { id: 'gs28', name: 'Pizza Sandwich', price: 90, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Pizza sauce with mozzarella in soft bread.', calories: '380 kcal', popularity: 92 },
      { id: 'gs29', name: 'Paneer Tandoori Sandwich', price: 80, category: 'Sandwich', isVeg: true, spice: 2, desc: 'Tandoori flavoured paneer in toasted bread.', calories: '360 kcal', popularity: 91 },
      { id: 'gs30', name: 'Paneer Jalapeno Sandwich', price: 80, category: 'Sandwich', isVeg: true, spice: 2, desc: 'Spicy jalapeno with creamy paneer.', calories: '355 kcal', popularity: 88 },
      { id: 'gs31', name: 'Chocolate Sandwich', price: 70, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Sweet chocolate spread in soft bread.', calories: '310 kcal', popularity: 81 },
      { id: 'gs32', name: 'Chocolate Ice-Cream Sandwich', price: 80, category: 'Sandwich', isVeg: true, spice: 0, desc: 'Chocolate with cold vanilla ice cream.', calories: '340 kcal', popularity: 84 },
      { id: 'gs33', name: 'Bombay Sandwich', price: 90, category: 'Sandwich', isVeg: true, spice: 1, desc: 'Bombay style sandwich with special spices.', calories: '370 kcal', popularity: 89 },
      { id: 'gs34', name: 'Bombay Sandwich Loaded With Cheese', price: 100, category: 'Sandwich', isVeg: true, spice: 1, desc: 'Bombay sandwich loaded with extra cheese.', calories: '400 kcal', popularity: 90 },
      { id: 'gs35', name: 'French Fries', price: 90, category: 'Fries', isVeg: true, spice: 0, desc: 'Crispy golden french fries with salt.', calories: '320 kcal', popularity: 92 },
      { id: 'gs36', name: 'Potato Balls', price: 80, category: 'Fries', isVeg: true, spice: 1, desc: 'Fried crispy potato balls with spice.', calories: '300 kcal', popularity: 86 },
      { id: 'gs37', name: 'Veg Fingers', price: 80, category: 'Fries', isVeg: true, spice: 0, desc: 'Battered and fried vegetable fingers.', calories: '280 kcal', popularity: 85 },
      { id: 'gs38', name: 'Momos', price: 80, category: 'Fries', isVeg: true, spice: 1, desc: 'Steamed vegetable momos with sauce.', calories: '250 kcal', popularity: 88 },
      { id: 'gs39', name: 'Smiley', price: 80, category: 'Fries', isVeg: true, spice: 0, desc: 'Potato smiles with cheese filling, fun and crispy.', calories: '290 kcal', popularity: 87 },
      { id: 'gs40', name: 'Veg Wrap', price: 50, category: 'Wrap', isVeg: true, spice: 0, desc: 'Fresh vegetables wrapped in soft tortilla.', calories: '220 kcal', popularity: 84 },
      { id: 'gs41', name: 'Tikki Wrap', price: 60, category: 'Wrap', isVeg: true, spice: 1, desc: 'Crispy potato tikki in a wrapped tortilla.', calories: '260 kcal', popularity: 86 },
      { id: 'gs42', name: 'Cheese Tikki Wrap', price: 70, category: 'Wrap', isVeg: true, spice: 1, desc: 'Tikki wrap with melted cheese inside.', calories: '290 kcal', popularity: 88 },
      { id: 'gs43', name: 'Paneer Wrap', price: 90, category: 'Wrap', isVeg: true, spice: 1, desc: 'Spiced paneer wrapped in soft tortilla.', calories: '310 kcal', popularity: 89 },
      { id: 'gs44', name: 'Pizza Wrap', price: 90, category: 'Wrap', isVeg: true, spice: 0, desc: 'Pizza sauce and cheese in a wrapped tortilla.', calories: '320 kcal', popularity: 90 },
      { id: 'gs45', name: 'Cheese Wrap', price: 80, category: 'Wrap', isVeg: true, spice: 0, desc: 'Melted cheese with vegetables in wrap.', calories: '300 kcal', popularity: 85 },
      { id: 'gs46', name: 'Mix Veg Wrap', price: 80, category: 'Wrap', isVeg: true, spice: 0, desc: 'Mixed vegetables wrapped with mayo and cheese.', calories: '305 kcal', popularity: 84 },
      { id: 'gs47', name: 'Veg Salad', price: 50, category: 'Salad', isVeg: true, spice: 0, desc: 'Fresh mixed vegetables with light dressing.', calories: '120 kcal', popularity: 80 },
      { id: 'gs48', name: 'Paneer Salad', price: 70, category: 'Salad', isVeg: true, spice: 0, desc: 'Paneer cubes with fresh veggies and dressing.', calories: '180 kcal', popularity: 85 },
      { id: 'gs49', name: 'Tikki Salad', price: 60, category: 'Salad', isVeg: true, spice: 1, desc: 'Crispy tikki chunks over fresh salad.', calories: '200 kcal', popularity: 82 },
      { id: 'gs50', name: 'Biscuit Salad', price: 70, category: 'Salad', isVeg: true, spice: 0, desc: 'Salad with crispy biscuit croutons.', calories: '190 kcal', popularity: 81 },
      { id: 'gs51', name: 'Veg Burger', price: 60, category: 'Burger', isVeg: true, spice: 0, desc: 'Vegetable patty with cheese and veggies in bun.', calories: '300 kcal', popularity: 87 },
      { id: 'gs52', name: 'Veg Cheese Burger', price: 70, category: 'Burger', isVeg: true, spice: 0, desc: 'Double cheese burger with veggie patty.', calories: '340 kcal', popularity: 89 },
      { id: 'gs53', name: 'Jalapeno Burger', price: 70, category: 'Burger', isVeg: true, spice: 2, desc: 'Spicy jalapeno burger with cheese.', calories: '330 kcal', popularity: 86 },
      { id: 'gs54', name: 'Jumbo Burger Loaded', price: 90, category: 'Burger', isVeg: true, spice: 1, desc: 'Extra large burger with multiple toppings.', calories: '420 kcal', popularity: 91 },
      { id: 'gs55', name: 'Footlong Hotdog', price: 140, category: 'Hot Dog', isVeg: true, spice: 1, desc: 'Long hotdog with cheese, onions and sauce.', calories: '380 kcal', popularity: 88 },
      { id: 'gs56', name: 'Mini Hotdog', price: 80, category: 'Hot Dog', isVeg: true, spice: 0, desc: 'Smaller hotdog with cheese and condiments.', calories: '240 kcal', popularity: 84 },
      { id: 'gs57', name: 'Cheese Garlic Bread', price: 60, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Garlic bread loaded with melted cheese.', calories: '280 kcal', popularity: 93 },
      { id: 'gs58', name: 'Corn Garlic Bread', price: 65, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Garlic bread with sweet corn topping.', calories: '290 kcal', popularity: 85 },
      { id: 'gs59', name: 'Veg Garlic Bread', price: 65, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Garlic bread with mixed vegetables.', calories: '285 kcal', popularity: 84 },
      { id: 'gs60', name: 'Open Cheese Garlic Bread', price: 90, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Open toast with garlic, cheese and herbs.', calories: '310 kcal', popularity: 87 },
      { id: 'gs61', name: 'Open Veg Garlic Bread', price: 90, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Open toast with garlic and fresh veggies.', calories: '300 kcal', popularity: 86 },
      { id: 'gs62', name: 'Burn Garlic', price: 60, category: 'Garlic Bread', isVeg: true, spice: 1, desc: 'Heavily burnt garlic bread for strong flavour.', calories: '270 kcal', popularity: 82 },
      { id: 'gs63', name: 'Thousand Bread', price: 60, category: 'Garlic Bread', isVeg: true, spice: 0, desc: 'Thousand island dressing on garlic bread.', calories: '295 kcal', popularity: 83 }
    ]
  },
  {
    id: 'chaat-point',
    name: 'Nescafé',
    cuisine: 'Coffee • Maggi • Shakes',
    rating: 4.5,
    reviews: '640',
    time: '10-15 min',
    priceForTwo: '₹100 for two',
    location: 'Ground Floor • Main Atrium',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Cappuccino', 'Frappe', 'Cheese Maggi', 'Oreo Shake'],
    category: 'Magic Bowls, Hot Classics, Chill Thrills, Grab N Go',
    menu: [
      { id: 'nc1', name: 'Original Masala Maggi', price: 40, category: 'Magic Bowls', isVeg: true, spice: 2, desc: 'Classic masala noodles with bold spice and flavour.', calories: '360 kcal', popularity: 88 },
      { id: 'nc2', name: 'Cheese Maggi', price: 50, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Classic masala noodles loaded with melted cheese.', calories: '420 kcal', popularity: 91 },
      { id: 'nc3', name: 'Veg. Cheese Masala', price: 60, category: 'Magic Bowls', isVeg: true, spice: 2, desc: 'Masala noodles with veggies and extra cheesy finish.', calories: '470 kcal', popularity: 90 },
      { id: 'nc4', name: 'Veg. Masala', price: 50, category: 'Magic Bowls', isVeg: true, spice: 2, desc: 'Flavourful veg masala noodles with mixed vegetables.', calories: '390 kcal', popularity: 87 },
      { id: 'nc5', name: 'Atta Noodles', price: 60, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Healthy atta noodles with classic masala taste.', calories: '380 kcal', popularity: 84 },
      { id: 'nc6', name: 'Veg. Atta Noodles', price: 70, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Whole wheat atta noodles with vegetable goodness.', calories: '420 kcal', popularity: 86 },
      { id: 'nc7', name: 'Cheese Corn Maggi', price: 70, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Masala noodles with sweet corn and cheesy richness.', calories: '460 kcal', popularity: 93 },
      { id: 'nc8', name: 'Corn Butter', price: 70, category: 'Magic Bowls', isVeg: true, spice: 0, desc: 'Sweet corn finished with creamy butter.', calories: '440 kcal', popularity: 82 },
      { id: 'nc9', name: 'Masala Pasta', price: 70, category: 'Magic Bowls', isVeg: true, spice: 2, desc: 'Tangy masala pasta with a comforting street-style twist.', calories: '430 kcal', popularity: 88 },
      { id: 'nc10', name: 'Cheese Pasta', price: 80, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Creamy cheesy pasta with rich sauce.', calories: '480 kcal', popularity: 89 },
      { id: 'nc11', name: 'Veg Maggi Pasta', price: 70, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Pasta tossed with veggies and classic maggi masala.', calories: '450 kcal', popularity: 85 },
      { id: 'nc12', name: 'Cheese Masala Pasta', price: 70, category: 'Magic Bowls', isVeg: true, spice: 2, desc: 'Masala pasta with a cheesy, bold finish.', calories: '470 kcal', popularity: 88 },
      { id: 'nc13', name: 'Cheese Macaroni Pasta', price: 80, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Macaroni pasta in cheesy creamy sauce.', calories: '490 kcal', popularity: 87 },
      { id: 'nc14', name: 'Veg Cheese Macaroni Pasta', price: 90, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Veg-loaded macaroni pasta with cheese melt.', calories: '510 kcal', popularity: 90 },
      { id: 'nc15', name: 'Jain Maggi', price: 50, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Jain-style masala Maggi.', calories: '360 kcal', popularity: 84 },
      { id: 'nc16', name: 'Veg Jain Maggi', price: 60, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Jain-style Maggi with vegetables.', calories: '410 kcal', popularity: 83 },
      { id: 'nc17', name: 'Cheese Jain Maggi', price: 60, category: 'Magic Bowls', isVeg: true, spice: 1, desc: 'Jain-style Maggi with melted cheese.', calories: '430 kcal', popularity: 82 },
      { id: 'nc18', name: 'Classic', price: 25, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Classic hot black coffee.', calories: '90 kcal', popularity: 94 },
      { id: 'nc19', name: 'Cappuccino', price: 30, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Rich espresso and creamy foam with cafe-style texture.', calories: '120 kcal', popularity: 96 },
      { id: 'nc20', name: 'Mochacchino', price: 35, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Espresso blended with chocolate and creamy milk.', calories: '160 kcal', popularity: 95 },
      { id: 'nc21', name: 'Hot Chocolate', price: 35, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Creamy hot chocolate finished with a silky texture.', calories: '190 kcal', popularity: 92 },
      { id: 'nc22', name: 'Café Latte', price: 30, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Smooth cafe latte with balanced coffee and milk.', calories: '130 kcal', popularity: 93 },
      { id: 'nc23', name: 'Cardamom Tea', price: 20, category: 'Hot Classics', isVeg: true, spice: 1, desc: 'Fragrant cardamom tea with comforting warmth.', calories: '60 kcal', popularity: 91 },
      { id: 'nc24', name: 'Masala Tea', price: 25, category: 'Hot Classics', isVeg: true, spice: 2, desc: 'Classic masala chai with ginger and spice notes.', calories: '70 kcal', popularity: 90 },
      { id: 'nc25', name: 'Hot Lemon', price: 20, category: 'Hot Classics', isVeg: true, spice: 0, desc: 'Warming hot lemon beverage with a fresh citrus feel.', calories: '40 kcal', popularity: 76 },
      { id: 'nc26', name: 'Ice Tea (Lemon)', price: 50, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Refreshing lemon iced tea with a crisp finish.', calories: '90 kcal', popularity: 88 },
      { id: 'nc27', name: 'Frappe', price: 60, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Iced blended frappe with a smooth coffee kick.', calories: '220 kcal', popularity: 95 },
      { id: 'nc28', name: 'Cold Mocha', price: 60, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Chilled mocha with espresso, chocolate and cream.', calories: '210 kcal', popularity: 93 },
      { id: 'nc29', name: 'Cold Chocolate', price: 60, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Smooth cold chocolate drink with creamy texture.', calories: '220 kcal', popularity: 90 },
      { id: 'nc30', name: 'Ice Coffee', price: 60, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Refreshing iced coffee with a rich taste.', calories: '150 kcal', popularity: 94 },
      { id: 'nc31', name: 'Oreo Shake', price: 70, category: 'Chill Thrills', isVeg: true, spice: 0, desc: 'Creamy Oreo shake with crunchy cookie bits.', calories: '300 kcal', popularity: 96 },
      { id: 'nc32', name: 'Nestlé Chocolates', price: 0, priceLabel: 'MRP', category: 'Grab N Go', isVeg: true, spice: 0, desc: 'Packaged Nestlé chocolate products; price at MRP.', calories: 'See packaging', popularity: 80 },
      { id: 'nc33', name: 'Nescafé RTD', price: 0, priceLabel: 'MRP', category: 'Grab N Go', isVeg: true, spice: 0, desc: 'Nescafé ready-to-drink beverage; price at MRP.', calories: 'See packaging', popularity: 80 },
      { id: 'nc34', name: 'Packaged Drinking Water', price: 0, priceLabel: 'MRP', category: 'Grab N Go', isVeg: true, spice: 0, desc: 'Packaged bottled drinking water; price at MRP.', calories: '0 kcal', popularity: 80 }
    ]
  },
  // 6. Bhagat Sev-Usal
  {
    id: 'bhagat-sev-usal',
    name: 'Bhagat Sev-Usal',
    cuisine: 'Sev Usal • Sev Tari • Chaat • Extras',
    rating: 4.6,
    reviews: '780',
    time: '5-10 min',
    priceForTwo: '₹80 for two',
    location: 'Ground Floor • Near Main Canteen',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Sev Usal with 3 Bun', 'Cheese Butter Sev Usal', 'Cheese Sev Tari', 'Peri Peri Sev Tari'],
    category: 'Sev Usal, Sev Tari, Extras',
    menu: [
      { id: 'su1',  name: 'Sev Usal with 3 Bun',       price: 50,  category: 'Sev Usal', isVeg: true, spice: 2, desc: 'Classic spicy sev usal served with 3 soft buns.', calories: '380 kcal', popularity: 97 },
      { id: 'su2',  name: 'Butter Sev Usal',            price: 65,  category: 'Sev Usal', isVeg: true, spice: 2, desc: 'Sev usal topped with generous butter and bun.', calories: '420 kcal', popularity: 94 },
      { id: 'su3',  name: 'Cheese Sev Usal',            price: 70,  category: 'Sev Usal', isVeg: true, spice: 2, desc: 'Sev usal loaded with melted cheese and bun.', calories: '440 kcal', popularity: 93 },
      { id: 'su4',  name: 'Cheese Butter Sev Usal',     price: 85,  category: 'Sev Usal', isVeg: true, spice: 2, desc: 'Rich sev usal with both cheese and butter, served with bun.', calories: '480 kcal', popularity: 96 },
      { id: 'su5',  name: 'Sev Tari / Masala Sev',      price: 60,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Spicy masala tari with crispy sev — a Surat street classic.', calories: '350 kcal', popularity: 95 },
      { id: 'su6',  name: 'Butter Sev Tari',            price: 75,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Masala sev tari enriched with a dollop of butter.', calories: '390 kcal', popularity: 92 },
      { id: 'su7',  name: 'Cheese Sev Tari',            price: 80,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Sev tari topped with gooey melted cheese.', calories: '400 kcal', popularity: 91 },
      { id: 'su8',  name: 'Cheese Butter Sev Tari',     price: 95,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'The ultimate sev tari — cheese, butter and bold spice.', calories: '450 kcal', popularity: 93 },
      { id: 'su9',  name: 'Garlic Sev Tari',            price: 80,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Sev tari with a punch of roasted garlic flavour.', calories: '380 kcal', popularity: 89 },
      { id: 'su10', name: 'Maggi Masala Sev Tari',      price: 80,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Sev tari spiced with Maggi masala for a unique twist.', calories: '390 kcal', popularity: 90 },
      { id: 'su11', name: 'Cheese Chilly Sev Tari',     price: 80,  category: 'Sev Tari', isVeg: true, spice: 3, desc: 'Fiery chilli-cheese sev tari for spice lovers.', calories: '410 kcal', popularity: 88 },
      { id: 'su12', name: 'Dahi Sev Tari',              price: 75,  category: 'Sev Tari', isVeg: true, spice: 1, desc: 'Cooling dahi balanced with spicy sev tari.', calories: '360 kcal', popularity: 87 },
      { id: 'su13', name: 'Schezwan Sev Tari',          price: 80,  category: 'Sev Tari', isVeg: true, spice: 3, desc: 'Indo-Chinese schezwan sauce meets classic sev tari.', calories: '395 kcal', popularity: 86 },
      { id: 'su14', name: 'Tandoori Mayo Sev Tari',     price: 80,  category: 'Sev Tari', isVeg: true, spice: 2, desc: 'Sev tari with smoky tandoori mayo drizzle.', calories: '400 kcal', popularity: 88 },
      { id: 'su15', name: 'Peri Peri Sev Tari',         price: 80,  category: 'Sev Tari', isVeg: true, spice: 3, desc: 'Tangy peri peri spiced sev tari with a zesty kick.', calories: '385 kcal', popularity: 90 },
      { id: 'su16', name: 'Paua Tari',                  price: 35,  category: 'Extras',   isVeg: true, spice: 1, desc: 'Soft poha soaked in spicy tari gravy.', calories: '260 kcal', popularity: 85 },
      { id: 'su17', name: 'Spicy Ghughra',              price: 30,  category: 'Extras',   isVeg: true, spice: 2, desc: 'Crispy fried pastry pockets with spiced filling.', calories: '220 kcal', popularity: 83 },
      { id: 'su18', name: 'Extra Sev',                  price: 15,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Extra serving of crispy sev on the side.', calories: '80 kcal',  popularity: 80 },
      { id: 'su19', name: 'Extra Vatana',               price: 10,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Extra green peas to add to your usal or tari.', calories: '60 kcal',  popularity: 78 },
      { id: 'su20', name: 'Extra Bun',                  price: 3,   category: 'Extras',   isVeg: true, spice: 0, desc: 'Soft plain bun to go with your usal.', calories: '90 kcal',  popularity: 82 },
      { id: 'su21', name: 'Chaas',                      price: 15,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Chilled salted buttermilk — the perfect cooler.', calories: '50 kcal',  popularity: 88 },
      { id: 'su22', name: 'Dahi',                       price: 15,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Fresh curd served chilled.', calories: '70 kcal',  popularity: 84 },
      { id: 'su23', name: 'Cold Drinks',                price: 0,   category: 'Extras',   isVeg: true, spice: 0, desc: 'Cold drinks available at MRP.', calories: '150 kcal', popularity: 79 },
      { id: 'su24', name: 'Mineral Water',              price: 0,   category: 'Extras',   isVeg: true, spice: 0, desc: 'Mineral water at MRP.', calories: '0 kcal',   popularity: 75 },
      { id: 'su25', name: 'Extra Cheese',               price: 20,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Extra cheese topping for any item.', calories: '90 kcal',  popularity: 86 },
      { id: 'su26', name: 'Extra Butter',               price: 15,  category: 'Extras',   isVeg: true, spice: 0, desc: 'Extra butter topping for any item.', calories: '70 kcal',  popularity: 84 },
      { id: 'su27', name: 'Chana Dal',                  price: 30,  category: 'Extras',   isVeg: true, spice: 1, desc: 'Spiced chana dal served as a side.', calories: '180 kcal', popularity: 81 }
    ]
  },
  // 7. Desi Italiano
  {
    id: 'canteen-store',
    name: 'Desi Italiano',
    cuisine: 'Burgers • Pizza • Pasta • Shakes • Subway',
    rating: 4.4,
    reviews: '510',
    time: '5-10 min',
    priceForTwo: '₹60 for two',
    location: 'Ground Floor • Near Lift Lobby',
    floor: 'Ground',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['SVIT Special Pizza', 'Paneer Tikka Subway', 'Oreo Thick Shake', 'Paneer Momos'],
    category: 'Snacks & Breakfast, Veg Burgers, Burger Meals, Pizza, Rolls & Hot Dogs, Pasta, Lunch & Rice, Subway, Cold Coffee & Shakes, Thick Shakes, Juices, Fruit Dishes, Add-Ons',
    menu: [
      { id: 'st1',  name: 'Idli (3 pcs)',                        price: 30,  category: 'Snacks & Breakfast',   isVeg: true, spice: 0, desc: 'Steamed idli served with coconut and red chutney.', calories: '180 kcal', popularity: 88 },
      { id: 'st2',  name: 'Medu Vada (3 pcs)',                   price: 30,  category: 'Snacks & Breakfast',   isVeg: true, spice: 1, desc: 'Crispy lentil vada served with coconut and red chutney.', calories: '220 kcal', popularity: 86 },
      { id: 'st3',  name: 'Idli & Medu Vada Combo (3 pcs)',      price: 30,  category: 'Snacks & Breakfast',   isVeg: true, spice: 0, desc: 'Combo of idli and medu vada with two chutneys.', calories: '200 kcal', popularity: 87 },
      { id: 'st4',  name: 'Patti Samosa (4 pcs)',                price: 30,  category: 'Snacks & Breakfast',   isVeg: true, spice: 1, desc: 'Crispy patti samosas with spiced filling.', calories: '280 kcal', popularity: 90 },
      { id: 'st5',  name: 'Chinese Patti Samosa (4 pcs)',        price: 40,  category: 'Snacks & Breakfast',   isVeg: true, spice: 2, desc: 'Crispy samosas with Indo-Chinese spiced filling.', calories: '300 kcal', popularity: 89 },
      { id: 'st6',  name: 'Samosa Chaat / Chhole Samose (2 pcs)',price: 60,  category: 'Snacks & Breakfast',   isVeg: true, spice: 2, desc: 'Samosas topped with chhole, chutneys and sev.', calories: '380 kcal', popularity: 92 },
      { id: 'st7',  name: 'Aloo Tikki Chaat',                    price: 60,  category: 'Snacks & Breakfast',   isVeg: true, spice: 2, desc: 'Crispy aloo tikki with chutneys, yogurt and sev.', calories: '360 kcal', popularity: 91 },
      { id: 'st8',  name: 'Chilly Garlic Bites',                 price: 60,  category: 'Snacks & Breakfast',   isVeg: true, spice: 3, desc: 'Crispy bite-sized pieces tossed in chilly garlic sauce.', calories: '340 kcal', popularity: 90 },
      { id: 'st9',  name: 'Veg Momos',                           price: 60,  category: 'Snacks & Breakfast',   isVeg: true, spice: 1, desc: 'Steamed vegetable dumplings with spicy dip.', calories: '280 kcal', popularity: 93 },
      { id: 'st10', name: 'Cheese Corn Nuggets',                 price: 70,  category: 'Snacks & Breakfast',   isVeg: true, spice: 0, desc: 'Golden cheese-corn nuggets, crispy outside soft inside.', calories: '320 kcal', popularity: 89 },
      { id: 'st11', name: 'Spring Roll',                         price: 80,  category: 'Snacks & Breakfast',   isVeg: true, spice: 1, desc: 'Crispy fried spring rolls with mixed veggie filling.', calories: '310 kcal', popularity: 87 },
      { id: 'st12', name: 'Paneer Momos',                        price: 80,  category: 'Snacks & Breakfast',   isVeg: true, spice: 1, desc: 'Steamed paneer-stuffed dumplings with spicy sauce.', calories: '320 kcal', popularity: 92 },
      { id: 'st13', name: 'French Fries',                        price: 90,  category: 'Snacks & Breakfast',   isVeg: true, spice: 0, desc: 'Golden crispy french fries with seasoning.', calories: '310 kcal', popularity: 95 },
      { id: 'st14', name: 'Crinkle Fries',                       price: 100, category: 'Snacks & Breakfast',   isVeg: true, spice: 0, desc: 'Wavy crinkle-cut fries, extra crispy.', calories: '330 kcal', popularity: 93 },
      { id: 'st15', name: 'Classic Veg Burger',                  price: 40,  category: 'Veg Burgers',          isVeg: true, spice: 0, desc: 'Simple crispy veg patty burger with sauce.', calories: '280 kcal', popularity: 88 },
      { id: 'st16', name: 'Tandoori Veg Burger',                 price: 50,  category: 'Veg Burgers',          isVeg: true, spice: 2, desc: 'Smoky tandoori-spiced veg patty burger.', calories: '310 kcal', popularity: 87 },
      { id: 'st17', name: 'Peri Peri Veg Burger',                price: 50,  category: 'Veg Burgers',          isVeg: true, spice: 2, desc: 'Tangy peri peri veg burger with coleslaw.', calories: '305 kcal', popularity: 89 },
      { id: 'st18', name: 'Veggie King Student Special',         price: 50,  category: 'Veg Burgers',          isVeg: true, spice: 1, desc: 'Student special loaded veg burger with extra toppings.', calories: '320 kcal', popularity: 91 },
      { id: 'st19', name: 'Spicy Lover Veg Burger',              price: 50,  category: 'Veg Burgers',          isVeg: true, spice: 3, desc: 'Extra spicy veg burger for heat seekers.', calories: '315 kcal', popularity: 90 },
      { id: 'st20', name: 'Classic Burger Meal',                 price: 80,  category: 'Burger Meals',         isVeg: true, spice: 0, desc: 'Classic burger + fries + cold coffee combo.', calories: '620 kcal', popularity: 90 },
      { id: 'st21', name: 'Tandoori Burger Meal',                price: 90,  category: 'Burger Meals',         isVeg: true, spice: 2, desc: 'Tandoori burger + fries + cold coffee combo.', calories: '650 kcal', popularity: 89 },
      { id: 'st22', name: 'Veggie King Burger Meal',             price: 90,  category: 'Burger Meals',         isVeg: true, spice: 1, desc: 'Veggie King burger + fries + cold coffee combo.', calories: '660 kcal', popularity: 91 },
      { id: 'st23', name: 'Peri Peri Burger Meal',               price: 90,  category: 'Burger Meals',         isVeg: true, spice: 2, desc: 'Peri peri burger + fries + cold coffee combo.', calories: '645 kcal', popularity: 90 },
      { id: 'st24', name: 'Spicy Lover Burger Meal',             price: 90,  category: 'Burger Meals',         isVeg: true, spice: 3, desc: 'Spicy burger + fries + cold coffee combo.', calories: '655 kcal', popularity: 88 },
      { id: 'st25', name: 'Classic Margherita',                  price: 70,  category: 'Pizza',                isVeg: true, spice: 0, desc: 'Thin crust pizza with tomato sauce and mozzarella.', calories: '380 kcal', popularity: 88 },
      { id: 'st26', name: 'Cheesy Onion Capsicum',               price: 80,  category: 'Pizza',                isVeg: true, spice: 0, desc: 'Pizza with caramelised onion, capsicum and extra cheese.', calories: '410 kcal', popularity: 87 },
      { id: 'st27', name: 'Golden Corn Pizza',                   price: 80,  category: 'Pizza',                isVeg: true, spice: 0, desc: 'Sweet corn with cheese on a golden crust.', calories: '400 kcal', popularity: 86 },
      { id: 'st28', name: 'Tandoori Paneer Pizza',               price: 90,  category: 'Pizza',                isVeg: true, spice: 2, desc: 'Smoky tandoori paneer on a cheesy pizza base.', calories: '450 kcal', popularity: 92 },
      { id: 'st29', name: 'Farm Fresh Veggies Pizza',            price: 90,  category: 'Pizza',                isVeg: true, spice: 0, desc: 'Loaded with fresh garden vegetables and herbs.', calories: '420 kcal', popularity: 88 },
      { id: 'st30', name: 'Italian Pizza',                       price: 90,  category: 'Pizza',                isVeg: true, spice: 1, desc: 'Classic Italian-style pizza with herbs and sauce.', calories: '430 kcal', popularity: 89 },
      { id: 'st31', name: 'Cheesy Pizza',                        price: 100, category: 'Pizza',                isVeg: true, spice: 0, desc: 'Four-cheese overloaded pizza for cheese lovers.', calories: '480 kcal', popularity: 91 },
      { id: 'st32', name: 'SVIT Special Pizza',                  price: 150, category: 'Pizza',                isVeg: true, spice: 1, desc: 'House special loaded pizza with premium toppings.', calories: '560 kcal', popularity: 96 },
      { id: 'st33', name: 'Grilled Burger Pizza (2 pcs)',        price: 90,  category: 'Pizza',                isVeg: true, spice: 1, desc: 'Mini grilled burger-pizza fusion pieces.', calories: '440 kcal', popularity: 87 },
      { id: 'st34', name: 'Herb Garlic Loaf (8 pcs)',            price: 90,  category: 'Pizza',                isVeg: true, spice: 0, desc: 'Herb and garlic toasted bread loaf, 8 pieces.', calories: '350 kcal', popularity: 85 },
      { id: 'st35', name: 'Supreme Garlic Loaf (8 pcs)',         price: 100, category: 'Pizza',                isVeg: true, spice: 0, desc: 'Supreme garlic loaf with extra cheese and herbs.', calories: '380 kcal', popularity: 86 },
      { id: 'st36', name: 'Veg Cheese Bruschetta (8 pcs)',       price: 100, category: 'Pizza',                isVeg: true, spice: 0, desc: 'Toasted bruschetta with veg cheese topping, 8 pieces.', calories: '360 kcal', popularity: 84 },
      { id: 'st37', name: 'Hot Dog',                             price: 50,  category: 'Rolls & Hot Dogs',     isVeg: true, spice: 1, desc: 'Classic hot dog with sauce and mustard in a bun.', calories: '290 kcal', popularity: 85 },
      { id: 'st38', name: 'Veg Roll',                            price: 50,  category: 'Rolls & Hot Dogs',     isVeg: true, spice: 0, desc: 'Fresh veggie roll wrapped in a soft tortilla.', calories: '250 kcal', popularity: 84 },
      { id: 'st39', name: 'Paneer Roll',                         price: 60,  category: 'Rolls & Hot Dogs',     isVeg: true, spice: 1, desc: 'Spiced paneer wrapped in a crispy roll.', calories: '310 kcal', popularity: 88 },
      { id: 'st40', name: 'Cheese Corn Roll',                    price: 60,  category: 'Rolls & Hot Dogs',     isVeg: true, spice: 0, desc: 'Cheese and corn stuffed roll, crispy outside.', calories: '300 kcal', popularity: 87 },
      { id: 'st41', name: 'Italian White Sauce Pasta',           price: 60,  category: 'Pasta',                isVeg: true, spice: 0, desc: 'Creamy bechamel pasta with Italian herbs.', calories: '420 kcal', popularity: 87 },
      { id: 'st42', name: 'Italian Red Sauce Pasta',             price: 70,  category: 'Pasta',                isVeg: true, spice: 1, desc: 'Tangy tomato-based pasta with Italian seasoning.', calories: '400 kcal', popularity: 86 },
      { id: 'st43', name: 'Curd Rice',                           price: 40,  category: 'Lunch & Rice',         isVeg: true, spice: 0, desc: 'Cooling curd rice with mustard and curry leaf tempering.', calories: '320 kcal', popularity: 83 },
      { id: 'st44', name: 'Dal Khichdi',                         price: 50,  category: 'Lunch & Rice',         isVeg: true, spice: 1, desc: 'Comforting dal and rice khichdi, lightly spiced.', calories: '380 kcal', popularity: 85 },
      { id: 'st45', name: 'Chhole Rice',                         price: 50,  category: 'Lunch & Rice',         isVeg: true, spice: 2, desc: 'Spiced chhole served with steamed rice.', calories: '430 kcal', popularity: 87 },
      { id: 'st46', name: 'Mag / Mug Pulav',                    price: 50,  category: 'Lunch & Rice',         isVeg: true, spice: 1, desc: 'Fragrant moong pulav with light spices.', calories: '390 kcal', popularity: 84 },
      { id: 'st47', name: 'Paneer Mag / Mug Pulav',             price: 70,  category: 'Lunch & Rice',         isVeg: true, spice: 1, desc: 'Rich paneer moong pulav with aromatic spices.', calories: '460 kcal', popularity: 88 },
      { id: 'st48', name: 'Punjabi Chhole Kulche',               price: 70,  category: 'Lunch & Rice',         isVeg: true, spice: 2, desc: 'Spicy chhole with kulche bread, chass and salad.', calories: '520 kcal', popularity: 90 },
      { id: 'st49', name: 'Veggie Delite Subway',                price: 80,  category: 'Subway',               isVeg: true, spice: 0, desc: 'Fresh veggie subway with sauces and veggies.', calories: '350 kcal', popularity: 86 },
      { id: 'st50', name: 'Aloo Patty Subway',                   price: 90,  category: 'Subway',               isVeg: true, spice: 1, desc: 'Crispy aloo patty subway with toppings.', calories: '400 kcal', popularity: 88 },
      { id: 'st51', name: 'Mexican Veggie Subway',               price: 100, category: 'Subway',               isVeg: true, spice: 2, desc: 'Spicy Mexican-style veggie subway.', calories: '420 kcal', popularity: 89 },
      { id: 'st52', name: 'Paneer Tikka Subway',                 price: 100, category: 'Subway',               isVeg: true, spice: 2, desc: 'Grilled paneer tikka subway with mint chutney.', calories: '450 kcal', popularity: 92 },
      { id: 'st53', name: 'Cold Coffee',                         price: 40,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Chilled blended coffee, smooth and refreshing.', calories: '180 kcal', popularity: 91 },
      { id: 'st54', name: 'Chocolate Cloud',                     price: 50,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Creamy chocolate cloud shake with whipped topping.', calories: '260 kcal', popularity: 90 },
      { id: 'st55', name: 'Strawberry Shake',                    price: 50,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Fresh strawberry blended shake.', calories: '240 kcal', popularity: 88 },
      { id: 'st56', name: 'Vanilla Milk Shake',                  price: 50,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Classic creamy vanilla milkshake.', calories: '230 kcal', popularity: 87 },
      { id: 'st57', name: 'Mango Delight Shake',                 price: 50,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Smooth mango flavoured shake.', calories: '250 kcal', popularity: 89 },
      { id: 'st58', name: 'Cookies & Cream Shake',               price: 60,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Creamy shake with crushed cookie bits.', calories: '290 kcal', popularity: 91 },
      { id: 'st59', name: 'Blueberry Shake',                     price: 70,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Fresh blueberry blended shake.', calories: '270 kcal', popularity: 86 },
      { id: 'st60', name: 'Dryfruit Shake',                      price: 80,  category: 'Cold Coffee & Shakes', isVeg: true, spice: 0, desc: 'Nutritious dry fruit blended shake.', calories: '350 kcal', popularity: 85 },
      { id: 'st61', name: 'Banana Thick Shake',                  price: 70,  category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Thick creamy banana shake.', calories: '310 kcal', popularity: 87 },
      { id: 'st62', name: 'Mango Thick Shake',                   price: 80,  category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Extra thick mango milkshake.', calories: '330 kcal', popularity: 88 },
      { id: 'st63', name: 'Strawberry Thick Shake',              price: 90,  category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Rich thick strawberry milkshake.', calories: '320 kcal', popularity: 86 },
      { id: 'st64', name: 'Chocolate Thick Shake',               price: 90,  category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Dense rich chocolate thick shake.', calories: '380 kcal', popularity: 93 },
      { id: 'st65', name: 'Oreo Thick Shake',                    price: 100, category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Thick shake blended with Oreo cookies and cream.', calories: '400 kcal', popularity: 95 },
      { id: 'st66', name: 'Dryfruit Thick Shake',                price: 100, category: 'Thick Shakes',         isVeg: true, spice: 0, desc: 'Luxurious thick shake with premium dry fruits.', calories: '420 kcal', popularity: 90 },
      { id: 'st67', name: 'Aam Panna Juice',                     price: 35,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Tangy raw mango drink with spices.', calories: '90 kcal',  popularity: 88 },
      { id: 'st68', name: 'Watermelon Juice',                    price: 40,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Fresh chilled watermelon juice.', calories: '70 kcal',  popularity: 87 },
      { id: 'st69', name: 'Orange Juice',                        price: 50,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Freshly squeezed orange juice.', calories: '90 kcal',  popularity: 89 },
      { id: 'st70', name: 'Mosambi Juice',                       price: 60,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Fresh sweet lime juice.', calories: '85 kcal',  popularity: 86 },
      { id: 'st71', name: 'Mix Fruit Juice',                     price: 60,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Blend of seasonal fresh fruits.', calories: '110 kcal', popularity: 88 },
      { id: 'st72', name: 'Pineapple Juice',                     price: 70,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Sweet tangy fresh pineapple juice.', calories: '100 kcal', popularity: 85 },
      { id: 'st73', name: 'Kiwi Juice',                          price: 80,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Refreshing fresh kiwi juice.', calories: '95 kcal',  popularity: 83 },
      { id: 'st74', name: 'Pomegranate Juice',                   price: 90,  category: 'Juices',               isVeg: true, spice: 0, desc: 'Rich antioxidant-packed pomegranate juice.', calories: '120 kcal', popularity: 84 },
      { id: 'st75', name: 'Watermelon',                          price: 30,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Fresh sliced watermelon.', calories: '60 kcal',  popularity: 82 },
      { id: 'st76', name: 'Banana',                              price: 30,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Fresh ripe banana.', calories: '90 kcal',  popularity: 80 },
      { id: 'st77', name: 'Papaya',                              price: 40,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Fresh sliced papaya.', calories: '70 kcal',  popularity: 78 },
      { id: 'st78', name: 'Mix Fruit',                           price: 50,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Seasonal mixed fruit platter.', calories: '120 kcal', popularity: 83 },
      { id: 'st79', name: 'Guava or Orange',                     price: 50,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Fresh guava or orange, your choice.', calories: '80 kcal',  popularity: 81 },
      { id: 'st80', name: 'Apple',                               price: 60,  category: 'Fruit Dishes',         isVeg: true, spice: 0, desc: 'Fresh apple, chilled and crisp.', calories: '95 kcal',  popularity: 82 },
      { id: 'st81', name: 'Dips (Tandoori / Mayo / Cheesy Jalapeno / Peri Peri)', price: 10, category: 'Add-Ons', isVeg: true, spice: 1, desc: 'Choice of dipping sauce — tandoori, mayo, cheesy jalapeño or peri peri.', calories: '40 kcal', popularity: 85 },
      { id: 'st82', name: 'Add Cheese (Burger / Roll / Meal)',   price: 10,  category: 'Add-Ons',              isVeg: true, spice: 0, desc: 'Extra cheese slice for burger, roll or burger meal.', calories: '50 kcal',  popularity: 84 },
      { id: 'st83', name: 'Add Butter (Lunch Special)',          price: 10,  category: 'Add-Ons',              isVeg: true, spice: 0, desc: 'Extra butter for any lunch special item.', calories: '70 kcal',  popularity: 80 },
      { id: 'st84', name: 'Add Cheese Slice / Extra Cheese (Lunch / Subway)', price: 20, category: 'Add-Ons', isVeg: true, spice: 0, desc: 'Extra cheese slice for lunch items or subway.', calories: '80 kcal', popularity: 82 },
      { id: 'st85', name: 'Extra Cheese (Pizza)',                price: 30,  category: 'Add-Ons',              isVeg: true, spice: 0, desc: 'Extra cheese topping on any pizza.', calories: '90 kcal',  popularity: 83 }
    ]
  },
  {
    id: 'south-canteen',
    name: 'Varahi Canteen',
    cuisine: 'Thali • Dosa • Snacks • Beverages',
    rating: 4.7,
    reviews: '980',
    time: '12-18 min',
    priceForTwo: '₹200 for two',
    location: 'First Floor • Food Court Wing A',
    floor: 'First',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    popularDishes: ['Full Lunch Thali', 'Masala Dosa', 'Pav Bhaji', 'Undhiyu'],
    category: 'Beverages, Breakfast, Snacks, Main Course, Thali',
    menu: [
      { id: 'sc1',  name: 'Tea (70 ML)',                      price: 15,  category: 'Beverages',   isVeg: true, spice: 0, desc: 'Hot freshly brewed tea served in 70 ml.',                                      calories: '30 kcal',  popularity: 92 },
      { id: 'sc2',  name: 'Coffee (70 ML)',                   price: 20,  category: 'Beverages',   isVeg: true, spice: 0, desc: 'Hot freshly brewed coffee served in 70 ml.',                                   calories: '35 kcal',  popularity: 90 },
      { id: 'sc3',  name: 'All Type Bhujiya (100 g)',         price: 30,  category: 'Snacks',      isVeg: true, spice: 1, desc: 'Assorted crispy bhujiya namkeen, 100 grams.',                                  calories: '480 kcal', popularity: 85 },
      { id: 'sc4',  name: 'Plain Batata Pava',                price: 20,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Simple spiced potato poha served fresh.',                                     calories: '220 kcal', popularity: 83 },
      { id: 'sc5',  name: 'Puava With Sev',                   price: 25,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Poha topped with crispy sev for extra crunch.',                               calories: '260 kcal', popularity: 86 },
      { id: 'sc6',  name: 'Masala Puava',                     price: 30,  category: 'Breakfast',   isVeg: true, spice: 2, desc: 'Spiced masala poha with onion, mustard and curry leaves.',                    calories: '280 kcal', popularity: 88 },
      { id: 'sc7',  name: 'Vada Pav',                         price: 25,  category: 'Snacks',      isVeg: true, spice: 1, desc: 'Classic batata vada in a soft pav with chutneys.',                            calories: '290 kcal', popularity: 94 },
      { id: 'sc8',  name: 'Cheese Butter Vada Pav',           price: 35,  category: 'Snacks',      isVeg: true, spice: 1, desc: 'Vada pav loaded with cheese and butter.',                                     calories: '360 kcal', popularity: 93 },
      { id: 'sc9',  name: 'Puri Shak (8 Puri)',               price: 35,  category: 'Main Course', isVeg: true, spice: 2, desc: 'Eight crispy puris served with spiced potato shak.',                          calories: '420 kcal', popularity: 89 },
      { id: 'sc10', name: 'Full Lunch Thali',                 price: 100, category: 'Thali',       isVeg: true, spice: 1, desc: 'Dal, rice, sabji, roti and salad — a complete meal.',                         calories: '750 kcal', popularity: 97 },
      { id: 'sc11', name: 'Delux Thali With Sweet',           price: 190, category: 'Thali',       isVeg: true, spice: 1, desc: 'Premium thali with dal, rice, sabji, roti, salad and sweet dish.',            calories: '950 kcal', popularity: 95 },
      { id: 'sc12', name: 'Chole Puri',                       price: 50,  category: 'Main Course', isVeg: true, spice: 2, desc: 'Fluffy fried puris served with spicy chole curry.',                           calories: '480 kcal', popularity: 91 },
      { id: 'sc13', name: 'Amul Chhas',                       price: 20,  category: 'Beverages',   isVeg: true, spice: 0, desc: 'Chilled Amul buttermilk, light and refreshing.',                              calories: '40 kcal',  popularity: 88 },
      { id: 'sc14', name: 'Upma',                             price: 25,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Semolina cooked with vegetables and mustard seasoning.',                      calories: '240 kcal', popularity: 84 },
      { id: 'sc15', name: 'Sev Khamni',                       price: 25,  category: 'Snacks',      isVeg: true, spice: 0, desc: 'Soft steamed khamni topped with sev and tempering.',                         calories: '210 kcal', popularity: 87 },
      { id: 'sc16', name: 'Patra (100 g)',                    price: 25,  category: 'Snacks',      isVeg: true, spice: 1, desc: 'Steamed colocasia leaf rolls with tangy-sweet masala, 100 g.',               calories: '190 kcal', popularity: 85 },
      { id: 'sc17', name: 'Bread Vada',                       price: 30,  category: 'Snacks',      isVeg: true, spice: 1, desc: 'Crispy vada sandwiched in bread slices with chutney.',                        calories: '300 kcal', popularity: 86 },
      { id: 'sc18', name: 'Khaman',                           price: 30,  category: 'Snacks',      isVeg: true, spice: 0, desc: 'Soft and spongy steamed khaman with green chilli tempering.',                 calories: '200 kcal', popularity: 90 },
      { id: 'sc19', name: 'Dhokla',                           price: 25,  category: 'Snacks',      isVeg: true, spice: 0, desc: 'Fluffy fermented rice-lentil dhokla with mustard and coriander.',             calories: '180 kcal', popularity: 89 },
      { id: 'sc20', name: 'Bhel Samosa',                      price: 25,  category: 'Snacks',      isVeg: true, spice: 2, desc: 'Crispy samosa served with bhel topping and chutneys.',                       calories: '310 kcal', popularity: 88 },
      { id: 'sc21', name: 'Chinese Samosa',                   price: 20,  category: 'Snacks',      isVeg: true, spice: 2, desc: 'Crispy samosa stuffed with spiced Chinese-style filling.',                   calories: '270 kcal', popularity: 86 },
      { id: 'sc22', name: 'Pav Bhaji (2 Pav)',                price: 70,  category: 'Main Course', isVeg: true, spice: 2, desc: 'Buttery mashed veggie bhaji served with 2 toasted pavs.',                    calories: '480 kcal', popularity: 93 },
      { id: 'sc23', name: 'Butter Pav Bhaji',                 price: 80,  category: 'Main Course', isVeg: true, spice: 2, desc: 'Extra butter pav bhaji for a richer, indulgent bite.',                       calories: '530 kcal', popularity: 94 },
      { id: 'sc24', name: 'Idli Sambhar',                     price: 35,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Soft steamed idlis served with hot sambhar and chutney.',                    calories: '280 kcal', popularity: 91 },
      { id: 'sc25', name: 'Fry Idli (2 pcs)',                 price: 40,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Crispy pan-fried idli pieces tossed in spiced tempering.',                   calories: '300 kcal', popularity: 87 },
      { id: 'sc26', name: 'Plain Dosa',                       price: 25,  category: 'Main Course', isVeg: true, spice: 0, desc: 'Thin crispy rice-lentil crepe served with sambhar and chutney.',             calories: '280 kcal', popularity: 85 },
      { id: 'sc27', name: 'Masala Dosa',                      price: 60,  category: 'Main Course', isVeg: true, spice: 1, desc: 'Crispy dosa with spiced potato filling, sambhar and chutney.',               calories: '420 kcal', popularity: 96 },
      { id: 'sc28', name: 'Masala Cheese Dosa',               price: 130, category: 'Main Course', isVeg: true, spice: 1, desc: 'Masala dosa loaded with gooey melted cheese.',                               calories: '520 kcal', popularity: 92 },
      { id: 'sc29', name: 'Methi Dhebra',                     price: 20,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Gujarati fenugreek flatbread, soft and flavourful.',                         calories: '160 kcal', popularity: 83 },
      { id: 'sc30', name: 'Aloo Paratha',                     price: 25,  category: 'Breakfast',   isVeg: true, spice: 1, desc: 'Stuffed whole-wheat flatbread with spiced potato filling.',                  calories: '300 kcal', popularity: 88 },
      { id: 'sc31', name: 'Biryani Pulav',                    price: 60,  category: 'Main Course', isVeg: true, spice: 2, desc: 'Fragrant spiced vegetable pulav served with raita.',                         calories: '450 kcal', popularity: 90 },
      { id: 'sc32', name: 'Bajri / Makai Rotala',             price: 30,  category: 'Main Course', isVeg: true, spice: 0, desc: 'Traditional pearl millet or maize flatbread, served warm.',                  calories: '200 kcal', popularity: 82 },
      { id: 'sc33', name: 'Chass Ma Vagarelo Rotlo',          price: 70,  category: 'Main Course', isVeg: true, spice: 1, desc: 'Gujarati rotlo cooked with buttermilk tempering — rustic and wholesome.',    calories: '380 kcal', popularity: 84 },
      { id: 'sc34', name: 'Undhiyu',                          price: 30,  category: 'Main Course', isVeg: true, spice: 1, desc: 'Traditional Gujarati slow-cooked mixed vegetable dish.',                     calories: '320 kcal', popularity: 89 }
    ]
  }
];

// ================= ITEM METADATA (food images + dietary tags) =================
// diet: 'veg' = standard veg; 'swaminarayan' = no onion/garlic style preference
const CATEGORY_IMAGES = {
  'Main Course': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80',
  'Snacks': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&auto=format&fit=crop&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80'
};

const pexelsImage = (photoId, format = 'jpeg') =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.${format}?auto=compress&cs=tinysrgb&w=800`;

const ITEM_META = {
  // ── Feeling Fast Food ──────────────────────────────────────────────────────
  // CHATPATA CHAAT
  ff1:  { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dry Bhel  — bhel puri bowl
  ff2:  { image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Special Bhel — bhel with sev/chutneys
  ff3:  { image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Special Cheese Bhel — cheese topped chaat
  ff4:  { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dahi Chatako — dahi chaat
  ff5:  { image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Pani Puri — golgappa/pani puri ✓
  ff6:  { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Sev Puri — sev puri plate ✓
  ff7:  { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chat Puri — bhel/chaat puri (crispy puri snack) ✓
  ff8:  { image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dahi Puri — puri chaat (same base as pani puri, filled with dahi) ✓ [was: samosa photo — FIXED]
  ff9:  { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Sev Puri — sev puri plate (with cheese) ✓ [was: soup — FIXED]
  ff10: { image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chana Churmu — spiced chana snack
  // VADA PAV
  ff11: { image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Bombay Vada Pav — classic vada pav
  ff12: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Masala Vada Pav — masala vada pav
  ff13: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Butter Vada Pav — vada pav with butter
  ff14: { image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Vada Pav — vada pav with cheese
  ff15: { image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Garlic Vada Pav — vada pav (garlic variant)
  ff16: { image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Garlic Cheese Vada Pav — cheese vada pav
  // DABELI
  ff17: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Regular Dabeli — dabeli bun
  ff18: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Masala Dabeli — spiced dabeli
  ff19: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Butter Dabeli — dabeli with butter
  ff20: { image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Dabeli — dabeli with cheese
  ff21: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Garlic Dabeli
  ff22: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Khatka Dabeli — fiery spiced dabeli
  ff23: { image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Khatka Dabeli with Cheese
  // SPROUTS
  ff24: { image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chana Chat — spiced chickpea chaat
  ff25: { image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chana Chat with Mug-Math — sprouted legumes chaat
  ff26: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chana Chat with Curd — curd chaat bowl
  ff27: { image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chana Mug-Math with Curd
  ff28: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Sahi Dahi Vada — dahi vada
  ff29: { image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Pani Puri Vada — pani puri style vada
  // PAV BHAJI / PULAV
  ff30: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Pav Bhaji — classic pav bhaji
  ff31: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Butter Pav-Bhaji — pav bhaji with butter melting on top
  ff32: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Pav Bhaji — pav bhaji (cheese variant)
  ff33: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Butter Pav Bhaji
  ff34: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Veg Pulav — vegetable pulao rice
  ff35: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Veg Butter Pulav — buttered pulao
  ff36: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Pulav — pulao with cheese
  ff37: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Butter Pulav
  ff38: { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // SVIT Special Cheese Garlic Butter Bun — loaded bun
  // KACHORI / DAHI VADA
  ff39: { image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Bhel-Kachori — kachori with bhel
  ff40: { image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Bhel-Kachori Jumbo
  ff41: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dahi Kachori — kachori with dahi
  ff42: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dahi Kachori Jumbo
  ff43: { image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Special Kachori Bhel
  ff44: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // SVIT Special Dahi Vada
  // CHINESE
  ff45: { image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Dry Manchurian — dry veg manchurian balls
  ff46: { image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Gravy Manchurian — manchurian in gravy
  ff47: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Fried Rice — vegetable fried rice
  ff48: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Manchurian Fried Rice — fried rice with manchurian
  ff49: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Schezwan Rice with Manchurian — schezwan rice
  ff50: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Garlic Rice — garlic fried rice
  ff51: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Garlic Manchurian Rice
  ff52: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Singapuri Rice with Manchurian
  ff53: { image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Fried Rice with Gravy — rice + gravy side
  ff54: { image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Hakka Noodles — hakka noodles wok
  ff55: { image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Hakka Noodles with Manchurian
  ff56: { image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chinese Bhel — crispy noodle bhel
  ff57: { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Manchow Soup — manchow soup bowl
  ff58: { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Hot and Sour Soup — hot sour soup bowl
  ff59: { image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Paneer Chilli Dry — dry paneer chilli
  ff60: { image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Paneer Chilli Gravy — paneer chilli in gravy
  ff61: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Paneer Rice — paneer fried rice
  ff62: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Cheese Rice — cheesy fried rice
  // DRINKS
  ff63: { image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Rajwadi Masala Chaas — spiced buttermilk
  ff64: { image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Lemon Juice — lemon juice glass
  ff65: { image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Chhas — plain buttermilk (chaas)
  ff66: { image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Limbu Sharbat — lemon sharbat
  ff67: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg'] }, // Lassi — creamy lassi glass
  // ── Bhagat Sev-Usal
  su1:  { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su2:  { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su3:  { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su4:  { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su5:  { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su6:  { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su7:  { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su8:  { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su9:  { image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su10: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su11: { image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su12: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su13: { image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su14: { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su15: { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su16: { image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su17: { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su18: { image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su19: { image: 'https://images.unsplash.com/photo-1587735243475-37b56c2f006a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su20: { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su21: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su22: { image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su23: { image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su24: { image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su25: { image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su26: { image: 'https://images.unsplash.com/photo-1620502846700-5c87b4b8cba3?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  su27: { image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  // Campus Pizza & Pasta
  pp1: { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  pp2: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  pp3: { image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  pp4: { image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  pp5: { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  pp6: { image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  pp7: { image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  pp8: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  pp9: { image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  pp10: { image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  // Chai Snacks Junction / Khana Khajana
  cs1:  { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs2:  { image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs3:  { image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs4:  { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs5:  { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs6:  { image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs7:  { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs8:  { image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs9:  { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs10: { image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs11: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs12: { image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs13: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs14: { image: 'https://images.unsplash.com/photo-1589301764474-3e3f5a1c9e1c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs15: { image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs16: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs17: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs18: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs19: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs20: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs21: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs22: { image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs23: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cs24: { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  // Cool Bites Juice Bar
  cb1: { image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb2: { image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb3: { image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb4: { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb5: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb6: { image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb7: { image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb8: { image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb9: { image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cb10: { image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  // Campus Chaat Point
  cp1: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp2: { image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp3: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp4: { image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cp5: { image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp6: { image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp7: { image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  cp8: { image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cp9: { image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  cp10: { image: 'https://images.unsplash.com/photo-1601303512763-2ed0c29cdb33?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  // Nescafé — Magic Bowls
  nc1:  { image: pexelsImage('31109619'), diet: ['veg'] }, // Original Masala Maggi
  nc2:  { image: pexelsImage('31150251'), diet: ['veg'] }, // Cheese Maggi
  nc3:  { image: pexelsImage('4635595', 'png'), diet: ['veg'] }, // Veg. Cheese Masala
  nc4:  { image: pexelsImage('4635600'), diet: ['veg'] }, // Veg. Masala
  nc5:  { image: pexelsImage('5848503'), diet: ['veg'] }, // Atta Noodles
  nc6:  { image: pexelsImage('7138913'), diet: ['veg'] }, // Veg. Atta Noodles
  nc7:  { image: pexelsImage('31150255'), diet: ['veg'] }, // Cheese Corn Maggi
  nc8:  { image: pexelsImage('724295'), diet: ['veg'] }, // Corn Butter
  nc9:  { image: pexelsImage('28459093'), diet: ['veg'] }, // Masala Pasta
  nc10: { image: pexelsImage('30823033'), diet: ['veg'] }, // Cheese Pasta
  nc11: { image: pexelsImage('17184357'), diet: ['veg'] }, // Veg Maggi Pasta
  nc12: { image: pexelsImage('17951099'), diet: ['veg'] }, // Cheese Masala Pasta
  nc13: { image: pexelsImage('32586059'), diet: ['veg'] }, // Cheese Macaroni Pasta
  nc14: { image: pexelsImage('23286041'), diet: ['veg'] }, // Veg Cheese Macaroni Pasta
  nc15: { image: pexelsImage('5409014'), diet: ['veg'] }, // Jain Maggi
  nc16: { image: pexelsImage('31109630'), diet: ['veg'] }, // Veg Jain Maggi
  nc17: { image: pexelsImage('31109629'), diet: ['veg'] }, // Cheese Jain Maggi
  // Nescafé — Hot Classics
  nc18: { image: pexelsImage('1659037'), diet: ['veg'] }, // Classic
  nc19: { image: pexelsImage('36238393'), diet: ['veg'] }, // Cappuccino
  nc20: { image: pexelsImage('17506128'), diet: ['veg'] }, // Mochacchino
  nc21: { image: pexelsImage('15149193'), diet: ['veg'] }, // Hot Chocolate
  nc22: { image: pexelsImage('38576602'), diet: ['veg'] }, // Café Latte
  nc23: { image: pexelsImage('36111903'), diet: ['veg'] }, // Cardamom Tea
  nc24: { image: pexelsImage('37186989'), diet: ['veg'] }, // Masala Tea
  nc25: { image: pexelsImage('3873198'), diet: ['veg'] }, // Hot Lemon
  // Nescafé — Chill Thrills
  nc26: { image: pexelsImage('11009224'), diet: ['veg'] }, // Ice Tea (Lemon)
  nc27: { image: pexelsImage('6767147'), diet: ['veg'] }, // Frappe
  nc28: { image: pexelsImage('11512983'), diet: ['veg'] }, // Cold Mocha
  nc29: { image: pexelsImage('18142621'), diet: ['veg'] }, // Cold Chocolate
  nc30: { image: pexelsImage('35213548'), diet: ['veg'] }, // Ice Coffee
  nc31: { image: pexelsImage('28525199'), diet: ['veg'] }, // Oreo Shake
  // Nescafé — Grab N Go
  nc32: { image: pexelsImage('9667288'), diet: ['veg'] }, // Nestlé Chocolates
  nc33: { image: pexelsImage('14537190'), diet: ['veg'] }, // Nescafé RTD
  nc34: { image: pexelsImage('1540235'), diet: ['veg'] }, // Packaged Drinking Water
  // Canteen Store / Desi Italiano
  st1:  { image: 'https://images.unsplash.com/photo-1589301764474-3e3f5a1c9e1c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st2:  { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st3:  { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st4:  { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st5:  { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st6:  { image: 'https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st7:  { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st8:  { image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st9:  { image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st10: { image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st11: { image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st12: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st13: { image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st14: { image: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st15: { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st16: { image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st17: { image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st18: { image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st19: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st20: { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st21: { image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st22: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st23: { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st24: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st25: { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st26: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st27: { image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st28: { image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st29: { image: 'https://images.unsplash.com/photo-1621447504867-d4046f626d09?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st30: { image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st31: { image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st32: { image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st33: { image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st34: { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st35: { image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st36: { image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st37: { image: 'https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st38: { image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st39: { image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st40: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st41: { image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st42: { image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st43: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st44: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st45: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st46: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st47: { image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st48: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st49: { image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st50: { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st51: { image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st52: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st53: { image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st54: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st55: { image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st56: { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st57: { image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st58: { image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st59: { image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st60: { image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st61: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st62: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st63: { image: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st64: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st65: { image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st66: { image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st67: { image: 'https://images.unsplash.com/photo-1587735243475-37b56c2f006a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st68: { image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st69: { image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st70: { image: 'https://images.unsplash.com/photo-1534353473418-4cfa0e3a2b2b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st71: { image: 'https://images.unsplash.com/photo-1560258018-c7db7645254e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st72: { image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st73: { image: 'https://images.unsplash.com/photo-1622597467836-f3e3f4d3b58e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st74: { image: 'https://images.unsplash.com/photo-1563746924237-f81d0a53bb03?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st75: { image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st76: { image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st77: { image: 'https://images.unsplash.com/photo-1544282944-6d6c8c0c45c4?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st78: { image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st79: { image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st80: { image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st81: { image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st82: { image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st83: { image: 'https://images.unsplash.com/photo-1620502846700-5c87b4b8cba3?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st84: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  st85: { image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  // South Indian Canteen / Varahi Canteen
  sc1:  { image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc2:  { image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc3:  { image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc4:  { image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc5:  { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc6:  { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc7:  { image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc8:  { image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc9:  { image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc10: { image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc11: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc12: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc13: { image: 'https://images.unsplash.com/photo-1571167366136-b57e40deec68?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc14: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc15: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc16: { image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc17: { image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc18: { image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc19: { image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc20: { image: 'https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc21: { image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc22: { image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc23: { image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc24: { image: 'https://images.unsplash.com/photo-1589301764474-3e3f5a1c9e1c?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc25: { image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc26: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc27: { image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc28: { image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc29: { image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc30: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc31: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc32: { image: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc33: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  sc34: { image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  // Burger & Wrap Point
  bw1: { image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw2: { image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw3: { image: 'https://images.unsplash.com/photo-1625225230517-7426c36c3b48?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw4: { image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw5: { image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw6: { image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bw7: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  bw8: { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  bw9: { image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  bw10: { image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  // Meal Hub
  mh1: { image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh2: { image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh3: { image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh4: { image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh5: { image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh6: { image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  mh7: { image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  mh8: { image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  mh9: { image: 'https://images.unsplash.com/photo-1571006682889-4d0f5b3e7c7d?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  mh10: { image: 'https://images.unsplash.com/photo-1601303512763-2ed0c29cdb33?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  // Campus Bakery & Cafe
  bk1: { image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk2: { image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk3: { image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk4: { image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk5: { image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk6: { image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk7: { image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80', diet: ['veg'] },
  bk8: { image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  bk9: { image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] },
  bk10: { image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80', diet: ['veg', 'swaminarayan'] }
};

const getDishMeta = (dish) => {
  const categoryImages = getCategoryImageSet(dish.category || 'Snacks');
  const imageIndex = Number.parseInt(String(dish.id).replace(/\D/g, ''), 10) || 0;
  return {
    image: ITEM_META[dish.id]?.image || categoryImages[imageIndex % categoryImages.length] || CATEGORY_IMAGES[dish.category] || CATEGORY_IMAGES.Snacks,
    diet: ITEM_META[dish.id]?.diet || ['veg']
  };
};

// Animated food image carousel shown on restaurant card hover
function HoverFoodCarousel({ restaurant }) {
  const dishes = restaurant.menu.slice(0, 5).map((d) => ({ ...d, ...getDishMeta(d) }));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dishes.length === 0) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % dishes.length), 1800);
    return () => clearInterval(timer);
  }, [dishes.length]);

  const current = dishes[index] || dishes[0];
  if (!current) return null;

  return (
    <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg bg-neutral-200 dark:bg-neutral-800">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={current.image}
          alt={current.name}
          initial={{ opacity: 0, x: 70, scale: 1.05 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -70, scale: 1.05 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-bold truncate">{current.name}</span>
      {/* progress dots */}
      <div className="absolute top-2.5 right-2.5 flex gap-1.5">
        {dishes.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-orange-400' : 'w-1.5 bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ================= ANIMATED COMPONENTS =================
// Counts up to a target number with spring easing
function AnimatedCounter({ value, className, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(value);
  const prevValue = React.useRef(value);

  useEffect(() => {
    setDisplay(value);
    const start = prevValue.current;
    const end = value;
    if (start === end) return;
    const duration = 700;
    const startTime = performance.now();
    let raf;
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else prevValue.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const safeDisplay = typeof display === 'number' && isFinite(display) ? display : 0;
  return (
    <span className={className}>
      {prefix}{safeDisplay.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

// Floating food emoji decoration
const FLOAT_EMOJIS = ['🍕', '🍔', '🍟', '🥤', '🍦', '🍩', '🥗', '🍜', '🍛', '🍪', '🥪', '🍰'];

// ================= HELPERS =================
const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const parsePriceValue = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^\d]/g, '');
  return cleaned ? Number(cleaned) : 0;
};
const getPriceForTwoText = (restaurant) => `${formatINR(parsePriceValue(restaurant?.priceForTwo || 0))} for two`;
const getCategoryImageSet = (category) => ({
  Puff: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop&q=80'
  ],
  'Bun Samosa': [
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80'
  ],
  Nachos: [
    'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80'
  ],
  Sub: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&auto=format&fit=crop&q=80'
  ],
  Mojito: [
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80'
  ],
  Sandwich: [
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=800&auto=format&fit=crop&q=80'
  ],
  Burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80'
  ],
  Wrap: [
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=80'
  ],
  'Magic Bowls': [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80'
  ],
  'Hot Classics': [
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80'
  ],
'Chill Thrills': [
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80'
  ],
  Snacks: [
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&auto=format&fit=crop&q=80'
  ],
  Beverages: [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80'
  ],
  Desserts: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80'
  ]
})[category] || [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
];

const FLOOR_ORDER = { Ground: 0, First: 1 };

// ================= APP =================
function AppMain({ userName, college, userEmail, userPassword, onUpdateProfile, onLogout, dark, onDarkToggle }) {
  const [view, setView] = useState('home'); // home | menu | charts | checkout | success | profile | orders
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState({}); // { [restaurantId]: [dishId, ...] }
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    try { const s = localStorage.getItem('bb_cart'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [orderHistory, setOrderHistory] = useState([]);
  // Size-picker modal state
  const [sizePickerDish, setSizePickerDish] = useState(null); // dish object or null

  // ── Cancel-order windows (per-order map) ────────────────────────────────────
  // cancelWindows: { [orderId]: { timeLeft, order } }
  const [cancelWindows, setCancelWindows] = useState({});
  const cancelTimersRef = useRef({});  // { [orderId]: intervalId }

  // Clear all cancel-window timers when AppMain unmounts (e.g. user logs out)
  useEffect(() => {
    return () => {
      Object.values(cancelTimersRef.current).forEach(clearInterval);
    };
  }, []);

  // Menu sorting/filtering
  const [sortBy, setSortBy] = useState('Default');
  const [dietFilter, setDietFilter] = useState('All'); // All | Swaminarayan
  const [menuSearch, setMenuSearch] = useState('');

  // Checkout options
  const [orderMode, setOrderMode] = useState('Takeaway');
  const [prepTime, setPrepTime] = useState('ASAP');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [onlineMethod, setOnlineMethod] = useState('UPI'); // UPI | Card | NetBanking | Wallet
  const [placedOrder, setPlacedOrder] = useState(null);

  const [firstOrderUsed, setFirstOrderUsed] = useState({});
  const [loyaltyUsed, setLoyaltyUsed] = useState({});

  // Analytics/loyalty counters
  const [analytics, setAnalytics] = useState({
    itemsOrdered: {},   // itemName -> qty
    spend: {},          // restaurantId -> total ₹
    categoryShare: {},  // category -> qty
    orders: {},         // restaurantId -> count
    history: []         // recent orders
  });

  // Profile
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEditPw, setShowEditPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // ============ DERIVED ============
  const totalCartPrice = cart.reduce((sum, item) => sum + item.finalPrice, 0);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Persist cart to localStorage — omit sizeVariants to keep storage lean
  useEffect(() => {
    try {
      // eslint-disable-next-line no-unused-vars
      const slim = cart.map(({ sizeVariants, ...rest }) => rest);
      localStorage.setItem('bb_cart', JSON.stringify(slim));
    } catch { /* quota exceeded — ignore */ }
  }, [cart]);

  // Subscribe to this user's own order status changes from Supabase Realtime
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('user-orders-' + userId)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const updated = payload.new;
        setOrderHistory((prev) =>
          prev.map((o) => o.id === updated.id ? { ...o, status: updated.status } : o)
        );
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const loyaltyStatus = (restaurantId) => {
    const spend = analytics.spend[restaurantId] || 0;
    const orders = analytics.orders[restaurantId] || 0;
    return { spend, orders, unlocked: spend >= 1000 || orders >= 100 };
  };

  const firstOrderDisc = (restaurantId) => !firstOrderUsed[restaurantId];

  const SORT_KEYS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name (A-Z)', 'Popularity'];

  const filteredMenu = useMemo(() => {
    if (!selectedRestaurant) return [];
    let items = [...selectedRestaurant.menu];
    // Category filter — sortBy may hold a category value prefixed with 'cat:'
    const isCatFilter = sortBy.startsWith('cat:');
    const catVal = isCatFilter ? sortBy.slice(4) : 'All';
    if (catVal !== 'All') items = items.filter((i) => i.category === catVal);
    // Dish search
    if (menuSearch.trim()) items = items.filter((i) => i.name.toLowerCase().includes(menuSearch.toLowerCase()));
    // Diet filter
    if (dietFilter === 'Swaminarayan') items = items.filter((i) => getDishMeta(i).diet.includes('swaminarayan'));
    // Favorites filter
    if (favoritesOnly) items = items.filter((i) => (favoriteItems[selectedRestaurant?.id] || []).includes(i.id));
    // Sort — only applies when a real sort option is selected
    if (!isCatFilter) {
      switch (sortBy) {
        case 'Price: Low to High': items.sort((a, b) => a.price - b.price); break;
        case 'Price: High to Low': items.sort((a, b) => b.price - a.price); break;
        case 'Name (A-Z)': items.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'Popularity': items.sort((a, b) => b.popularity - a.popularity); break;
        default: break; // 'Default' — preserve original menu order
      }
    }
    return items;
  }, [selectedRestaurant, sortBy, dietFilter, favoritesOnly, favoriteItems, menuSearch]);

  const categories = useMemo(() => {
    if (!selectedRestaurant) return ['All'];
    return ['All', ...new Set(selectedRestaurant.menu.map((i) => i.category))];
  }, [selectedRestaurant]);

  // ============ ACTIONS ============
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleFavoriteItem = (dishId, e) => {
    e.stopPropagation();
    const rid = selectedRestaurant?.id;
    if (!rid) return;
    setFavoriteItems((prev) => {
      const current = prev[rid] || [];
      const updated = current.includes(dishId)
        ? current.filter((x) => x !== dishId)
        : [...current, dishId];
      return { ...prev, [rid]: updated };
    });
  };

  const applyDiscount = (restaurantId, baseTotal) => {
    let disc = 0;
    let discLabel = '';
    if (firstOrderDisc(restaurantId)) {
      disc += baseTotal * 0.05;
      discLabel = 'First Order 5% OFF';
    }
    const loyalty = loyaltyStatus(restaurantId);
    if (loyalty.unlocked && !loyaltyUsed[restaurantId]) {
      disc += baseTotal * 0.2;
      discLabel = discLabel ? discLabel + ' + Loyalty 20% OFF' : 'Loyalty 20% OFF';
    }
    return { disc, discLabel };
  };

  const handleAddToCart = (dish, chosenSize = null) => {
    // If this dish has size variants and no size was chosen yet → open the size picker modal
    if (dish.sizeVariants && dish.sizeVariants.length > 1 && !chosenSize) {
      setSizePickerDish(dish);
      return;
    }
    // Determine the price to use
    const sizeLabel = chosenSize?.label || 'Regular';
    const unitPrice = chosenSize?.price ?? dish.price;
    // Each cart entry is keyed by `id + size` so Small and Full are separate rows
    const cartId = `${dish.id}--${sizeLabel}`;

    setCart((prev) => {
      const existing = prev.find((it) => it.cartId === cartId);
      if (existing) {
        // Already in cart — just bump qty
        return prev.map((it) =>
          it.cartId === cartId
            ? { ...it, qty: it.qty + 1, finalPrice: it.unitPrice * (it.qty + 1) }
            : it
        );
      }
      // New entry
      return [
        ...prev,
        {
          ...dish,
          unitPrice,
          finalPrice: unitPrice,
          size: sizeLabel,
          addOns: [],
          spiceLevel: 1,
          specialNote: '',
          qty: 1,
          cartId,
        },
      ];
    });
  };

  const changeQty = (cartId, delta) => {
    setCart((prev) => {
      return prev
        .map((it) => {
          if (it.cartId !== cartId) return it;
          const newQty = it.qty + delta;
          if (newQty <= 0) return null; // mark for removal
          return { ...it, qty: newQty, finalPrice: it.unitPrice * newQty };
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (cartId) => setCart((prev) => prev.filter((it) => it.cartId !== cartId));

  const handleReorder = (order) => {
    const restaurant = RESTAURANTS.find((r) => r.id === order.restaurantId) || null;
    setSelectedRestaurant(restaurant);
    // Rebuild cart from history, using the same cartId format the qty-controller relies on.
    // Items stored from reorders or original orders may already carry a valid cartId;
    // fall back to the canonical `id--size` format so the menu-page controls recognise them.
    const reItems = order.items.map((item) => {
      const sizeLabel = item.size || 'Regular';
      const cartId = `${item.id}--${sizeLabel}`;
      return {
        ...item,
        unitPrice: item.unitPrice ?? item.price,
        finalPrice: (item.unitPrice ?? item.price) * item.qty,
        cartId,
        size: sizeLabel,
        addOns: item.addOns || [],
        spiceLevel: item.spiceLevel ?? 1,
        specialNote: item.specialNote || '',
      };
    });
    setCart(reItems);
    navTo('checkout');
  };

  const placeOrder = () => {
    const baseTotal = totalCartPrice;
    const { disc, discLabel } = selectedRestaurant
      ? applyDiscount(selectedRestaurant.id, baseTotal)
      : { disc: 0, discLabel: '' };
    const grandTotal = Math.max(0, baseTotal - disc);

    const order = {
      id: 'BB' + Math.floor(100000 + Math.random() * 900000),
      items: cart,
      restaurantName: selectedRestaurant?.name || '',
      restaurantId: selectedRestaurant?.id || '',
      mode: orderMode,
      prepTime,
      payment: paymentMethod,
      onlineMethod: paymentMethod === 'Online' ? onlineMethod : '',
      itemSubtotal: baseTotal,
      discount: Math.round(disc),
      discountLabel: discLabel,
      total: Math.round(grandTotal),
      placedAt: new Date(),
      eta: prepTime === 'ASAP' ? '15-20 min' : prepTime,
      status: 'Pending',   // will be updated to 'Done' or 'Cancelled'
    };

    // Update analytics using functional form to avoid stale-closure issues,
    // and deep-copy each sub-object before mutating to satisfy React change detection.
    setAnalytics((prev) => {
      const itemsOrdered  = { ...prev.itemsOrdered };
      const categoryShare = { ...prev.categoryShare };
      const spend         = { ...prev.spend };
      const orders        = { ...prev.orders };

      cart.forEach((item) => {
        itemsOrdered[item.name]       = (itemsOrdered[item.name]       || 0) + item.qty;
        categoryShare[item.category]  = (categoryShare[item.category]  || 0) + item.qty;
      });
      spend[order.restaurantId]  = (spend[order.restaurantId]  || 0) + grandTotal;
      orders[order.restaurantId] = (orders[order.restaurantId] || 0) + 1;

      return {
        ...prev,
        itemsOrdered,
        categoryShare,
        spend,
        orders,
        history: [order, ...prev.history].slice(0, 20),
      };
    });

    // Mark discount usage
    if (firstOrderDisc(order.restaurantId)) setFirstOrderUsed((p) => ({ ...p, [order.restaurantId]: true }));
    const loyalty = loyaltyStatus(order.restaurantId);
    if (loyalty.unlocked && !loyaltyUsed[order.restaurantId]) setLoyaltyUsed((p) => ({ ...p, [order.restaurantId]: true }));
    setOrderHistory((p) => [order, ...p]);

    // Insert order to Supabase for admin dashboard (retry once on failure)
    (async () => {
      setOrderInsertFailed(false);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const payload = {
            id: order.id,
            user_id: user.id,
            user_name: user.user_metadata?.full_name || userName,
            user_email: user.email,
            restaurant_name: order.restaurantName,
            items: order.items.map((it) => ({
              name: it.name,
              qty: it.qty,
              unitPrice: it.unitPrice,
              size: it.size || 'Regular',
              category: it.category,
            })),
            total: order.total,
            payment: order.payment,
            mode: order.mode,
            status: 'Pending',
            discount: order.discount || 0,
            discount_label: order.discountLabel || '',
            placed_at: order.placedAt instanceof Date ? order.placedAt.toISOString() : order.placedAt,
          };
          const { error: insertErr } = await supabase.from('orders').insert(payload);
          if (insertErr) {
            // Retry once after a short delay
            await new Promise((r) => setTimeout(r, 1500));
            const { error: retryErr } = await supabase.from('orders').insert(payload);
            if (retryErr) {
              console.error('[BufferBites] Order persist failed after retry:', retryErr.message);
              setOrderInsertFailed(true);
            }
          }
        }
      } catch (err) {
        console.warn('Supabase order insert failed:', err);
      }
    })();

    setPlacedOrder(order);
    setCart([]);
    startCancelWindow(order);
    setView('success');
  };

  const resetAll = () => {
    setView('home');
    setSelectedRestaurant(null);
    setCart([]);
    setPlacedOrder(null);
  };

  // ── Per-order cancel-window helpers ─────────────────────────────────────────
  const startCancelWindow = (order) => {
    const id = order.id;
    setCancelWindows((prev) => ({ ...prev, [id]: { timeLeft: 120, order } }));
    clearInterval(cancelTimersRef.current[id]);
    cancelTimersRef.current[id] = setInterval(() => {
      setCancelWindows((prev) => {
        const win = prev[id];
        if (!win) return prev;
        if (win.timeLeft <= 1) {
          // Cancel window expired — auto-confirm the order
          clearInterval(cancelTimersRef.current[id]);
          delete cancelTimersRef.current[id];
          // Mark order as Done in history
          setOrderHistory((hist) =>
            hist.map((o) => o.id === id ? { ...o, status: 'Done' } : o)
          );
          const next = { ...prev };
          delete next[id];
          return next;
        }
        return { ...prev, [id]: { ...win, timeLeft: win.timeLeft - 1 } };
      });
    }, 1000);
  };

  const stopCancelWindow = (orderId) => {
    clearInterval(cancelTimersRef.current[orderId]);
    delete cancelTimersRef.current[orderId];
    setCancelWindows((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
  };

  // Cancel a specific order — mark it 'Cancelled' in history and reverse analytics
  const handleCancelOrder = (orderId) => {
    const win = cancelWindows[orderId];
    if (!win) return;
    const order = win.order;
    stopCancelWindow(orderId);

    // Mark the order as Cancelled in history (keep it visible under the Cancelled filter)
    setOrderHistory((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: 'Cancelled' } : o)
    );

    // Sync cancellation to Supabase so the admin dashboard reflects the change
    supabase.from('orders').update({ status: 'Cancelled' }).eq('id', orderId)
      .then(({ error }) => { if (error) console.error('[BufferBites] Cancel sync failed:', error.message); });

    // Reverse analytics
    setAnalytics((prev) => {
      const next = {
        ...prev,
        itemsOrdered:  { ...prev.itemsOrdered },
        categoryShare: { ...prev.categoryShare },
        spend:         { ...prev.spend },
        orders:        { ...prev.orders },
        history:       prev.history.filter((o) => o.id !== orderId),
      };
      order.items.forEach((item) => {
        next.itemsOrdered[item.name]      = Math.max(0, (next.itemsOrdered[item.name]      || 0) - item.qty);
        next.categoryShare[item.category] = Math.max(0, (next.categoryShare[item.category] || 0) - item.qty);
      });
      next.spend[order.restaurantId]  = Math.max(0, (next.spend[order.restaurantId]  || 0) - order.total);
      next.orders[order.restaurantId] = Math.max(0, (next.orders[order.restaurantId] || 0) - 1);
      return next;
    });

    setFirstOrderUsed((p) => { const n = { ...p }; delete n[order.restaurantId]; return n; });
    setLoyaltyUsed((p)     => { const n = { ...p }; delete n[order.restaurantId]; return n; });

    // Navigate home only if still on the success page for this order
    setPlacedOrder((cur) => {
      if (cur?.id === orderId) { setView('home'); setSelectedRestaurant(null); return null; }
      return cur;
    });
  };

  // Confirm a specific order early (Done button) — mark it 'Done' in history
  const handleDoneOrder = (orderId) => {
    stopCancelWindow(orderId);
    // Mark the order as Done in history
    setOrderHistory((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status: 'Done' } : o)
    );

    // Sync to Supabase so the admin dashboard reflects the change
    supabase.from('orders').update({ status: 'Done' }).eq('id', orderId)
      .then(({ error }) => { if (error) console.error('[BufferBites] Done sync failed:', error.message); });

    // Navigate home only if this was the active success-page order
    setPlacedOrder((cur) => {
      if (cur?.id === orderId) { setView('home'); setSelectedRestaurant(null); return null; }
      return cur;
    });
  };

  // ============ CHARTS DATA ============
  const chartItems = useMemo(() => {
    // Filter out zero-count entries that remain after order cancellations
    const sorted = Object.entries(analytics.itemsOrdered)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);
    const max = sorted.length ? sorted[0][1] : 1;
    return { sorted: sorted.slice(0, 8), max };
  }, [analytics.itemsOrdered]);

  const chartSpend = useMemo(() => {
    const sorted = RESTAURANTS.map((r) => ({
      name: r.name.split(' ').slice(0, 2).join(' '),
      fullName: r.name,
      value: analytics.spend[r.id] || 0,
    })).sort((a, b) => b.value - a.value);
    const max = Math.max(1, ...sorted.map((s) => s.value));
    return { sorted, max };
  }, [analytics.spend]);

  const categoryData = useMemo(() => {
    // Filter out zero-count categories left behind after cancellations
    const nonZero = Object.entries(analytics.categoryShare).filter(([, v]) => v > 0);
    const total = nonZero.reduce((s, [, v]) => s + v, 0) || 1;
    const entries = nonZero.map(([k, v]) => ({
      name: k,
      value: v,
      pct: Math.round((v / total) * 100),
    }));
    return entries.sort((a, b) => b.value - a.value);
  }, [analytics.categoryShare]);

  const PALETTE = ['#f97316', '#fb923c', '#fdba74', '#c2410c', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  };
  const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const goToMenu = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSortBy('Default');
    setDietFilter('All');
    setMenuSearch('');
    setFavoritesOnly(false);
    setView('menu');
  };

  // ============ CONFETTI ============
  // Frozen once via useRef so random values never re-compute on re-renders
  const confettiColors = ['#f97316', '#fb923c', '#fdba74', '#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7', '#ec4899', '#14b8a6'];
  const confettiRef = useRef(
    Array.from({ length: 70 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 3 + Math.random() * 4,
      color: confettiColors[i % confettiColors.length],
      size: 5 + Math.random() * 9,
      rotate: Math.random() * 360,
      shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'ribbon',
    }))
  );
  const confetti = confettiRef.current;

  const navTo = (v) => {
    setView(v);
    if (v !== 'success') setPlacedOrder(null);
    if (v === 'home') setFavoritesOnly(false);
    setShowProfileMenu(false);
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans pb-28 relative overflow-hidden">
      {/* Decorative Floating Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-orange-400/20 blur-3xl animate-floaty" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl animate-floaty2" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-orange-200/20 blur-3xl animate-floaty" />
        {/* Floating food emojis */}
        {FLOAT_EMOJIS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-3xl opacity-20 animate-bounce-slow"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 37) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2.5 + (i % 3)}s`,
              fontSize: `${1.6 + (i % 4) * 0.5}rem`
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-40 glass-card border-b border-neutral-200/70 dark:border-neutral-800 transition-all shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(view === 'menu' || view === 'checkout' || view === 'charts' || view === 'profile' || view === 'orders') && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navTo(view === 'menu' ? 'home' : view === 'checkout' ? (selectedRestaurant ? 'menu' : 'home') : 'home')}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
            <button onClick={() => navTo('home')} className="flex items-center gap-2.5">
              <motion.span
                whileHover={{ rotate: -8, scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30"
              >
                <UtensilsCrossed className="w-6 h-6" />
              </motion.span>
              <span className="text-2xl font-black tracking-tight text-brand-primary flex items-center gap-1">
                Buffer<span className="text-neutral-900 dark:text-white">Bites</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navTo('charts')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white transition-all text-sm font-bold"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDarkToggle}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white transition-all"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navTo('checkout')}
              className="relative p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <motion.span
                  key={totalQty}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow"
                >
                  {totalQty}
                </motion.span>
              )}
            </motion.button>

            {/* Active Orders icon button — only shown when at least one order is pending */}
            {Object.keys(cancelWindows).length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navTo('orders')}
                className={`co-nav-btn${view === 'orders' ? ' active' : ''}`}
                aria-label={`Active orders — ${Object.keys(cancelWindows).length} pending`}
              >
                <ClipboardList className="w-5 h-5" />
                <span className="co-nav-badge">{Object.keys(cancelWindows).length}</span>
              </motion.button>
            )}

            {/* Profile button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu((p) => !p)}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-500 hover:text-white transition-all"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-14 z-50 w-52 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs font-black text-neutral-900 dark:text-white truncate">{userName}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{userEmail}</p>
                    </div>
                    {/* Edit Profile */}
                    <button
                      onClick={() => { setShowProfileMenu(false); setEditEmail(userEmail); setEditPassword(''); setConfirmPassword(''); setProfileSaved(false); navTo('profile'); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-500 transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                    {/* Logout */}
                    <button
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all border-t border-neutral-100 dark:border-neutral-800"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {/* ========== HOME / RESTAURANT GRID ========== */}
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-7xl mx-auto px-6 pt-10"
            >
              <div className="mb-10">
                <motion.h1
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 12 }}
                  className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white mb-2"
                >
                  Welcome to <span className="shimmer-text">BufferBites</span> <span className="inline-block animate-wiggle">🍽️</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-neutral-500 dark:text-neutral-400 text-lg"
                >
                  Your campus canteen, all in one place. <span className="font-bold text-green-600">100% Pure Veg</span> 🌱
                </motion.p>

                {/* Favorites Toggle + Search */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFavoritesOnly((f) => !f)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      favoritesOnly
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-white' : ''}`} />
                    Favourite Restaurants {favorites.length > 0 && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">{favorites.length}</span>}
                  </motion.button>

                  {/* Search bar — moved here from header */}
                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search restaurants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                    />
                  </div>

                  {favoritesOnly && (
                    <span className="text-xs text-neutral-400">
                      Showing only your favourited restaurants. Tap the ❤️ on any card to add/remove.
                    </span>
                  )}
                </div>
              </div>

              {/* Restaurant Section */}
              <div className="mb-12">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-black mb-6 flex items-center gap-2"
                >
                  {college ? `${college} Canteens 🏢` : 'Campus Canteens 🏢'}
                </motion.h2>
                {college !== 'SVIT, Vasad' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <span className="text-5xl mb-4">🏫</span>
                    <h3 className="text-lg font-black text-neutral-700 dark:text-neutral-300 mb-2">No Canteens Added Yet</h3>
                    <p className="text-sm text-neutral-400 max-w-xs">
                      Canteens for <span className="font-bold text-orange-500">{college || 'your college'}</span> haven't been added yet. Check back soon!
                    </p>
                  </motion.div>
                ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative"
                >
                  {RESTAURANTS.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()) && (!favoritesOnly || favorites.includes(r.id)))
                    .map((restaurant) => {
                      const isFav = favorites.includes(restaurant.id);
                      const loyalty = loyaltyStatus(restaurant.id);
                      const firstDisc = firstOrderDisc(restaurant.id);
                      return (
                          <motion.div key={restaurant.id} variants={itemAnim}>
                            <motion.div
                              animate={
                                hoveredRestaurant?.id === restaurant.id
                                  ? { y: -2, scale: 1.005, boxShadow: '0 18px 30px -18px rgba(249,115,22,0.3)' }
                                  : { y: 0, scale: 1, boxShadow: '0 10px 30px -12px rgba(249,115,22,0.15)' }
                              }
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              onHoverStart={() => setHoveredRestaurant(restaurant)}
                              onHoverEnd={() => setHoveredRestaurant(null)}
                              onClick={() => goToMenu(restaurant)}
                              className="relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-xl shadow-black/5 cursor-pointer group transition-all shine-effect"
                            >
                            {/* Cover */}
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={restaurant.image}
                                alt={titleCase(restaurant.name)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {/* Badges Container */}
                              <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {/* Pure Veg Badge */}
                                <span className="px-3 py-1 rounded-full bg-green-500 text-white font-bold text-xs shadow-lg flex items-center gap-1 w-fit">
                                  <Leaf className="w-3 h-3" /> Pure Veg
                                </span>

                                {/* 5% First Order Badge */}
                                {firstDisc && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] shadow-lg flex items-center gap-1 w-fit">
                                    <Percent className="w-3 h-3" /> 5% First Order
                                  </span>
                                )}
                              </div>

                              {/* Favorite */}
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={(e) => toggleFavorite(restaurant.id, e)}
                                className={`absolute top-4 right-4 z-30 p-2.5 rounded-full backdrop-blur-md shadow-lg hover:scale-110 active:scale-95 transition-all ${
                                  isFav ? 'bg-red-500 text-white animate-heart-beat' : 'bg-white/90 text-neutral-700 hover:bg-red-500 hover:text-white'
                                }`}
                                aria-label="Add to favorites"
                                title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                              >
                                <motion.span
                                  key={isFav ? 'fav' : 'notfav'}
                                  initial={{ scale: 0.5, rotate: -20 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                                  className="inline-flex"
                                >
                                  <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
                                </motion.span>
                              </motion.button>

                              <div className="absolute bottom-2 left-2 right-2 text-white text-[10px]">
                                <div className="flex items-center gap-1 text-[9px] mb-0.5">
                                  <MapPin className="w-2 h-2 text-orange-300" />
                                  <span className="text-neutral-300 line-clamp-1">{restaurant.location}</span>
                                </div>
                                <h3 className="text-xs font-bold leading-tight line-clamp-1">{titleCase(restaurant.name)}</h3>
                                <p className="text-[9px] text-neutral-400 line-clamp-1">{restaurant.cuisine}</p>
                              </div>
                            </div>

                            {/* Meta */}
                            <div className="px-3 py-2">

                              {/* Loyalty Progress */}
                              {loyalty.unlocked ? (
                                <div className="mt-3 px-3 py-2 rounded-xl bg-green-500/10 text-green-600 text-xs font-bold flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Loyalty unlocked! Get 20% OFF on your next order
                                </div>
                              ) : (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-1">
                                    <span>Loyalty Progress</span>
                                    <span>₹{loyalty.spend}/₹1000</span>
                                  </div>
                                  <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(100, (loyalty.spend / 1000) * 100)}%` }}
                                      transition={{ duration: 0.8 }}
                                      className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Hover Quick Peek */}
                            <AnimatePresence>
                              {hoveredRestaurant?.id === restaurant.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.22, ease: 'easeOut' }}
                                  onClick={() => goToMenu(restaurant)}
                                  className="absolute inset-x-2 bottom-2 z-20 rounded-2xl border border-orange-200/80 bg-white/95 dark:bg-neutral-900/95 p-2 backdrop-blur-md shadow-md shadow-orange-500/10 cursor-pointer"
                                >
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold">Open Now</span>
                                  </div>

                                  <div className="mb-2 overflow-hidden rounded-xl border border-neutral-200/60 bg-neutral-100 dark:bg-neutral-800">
                                    <HoverFoodCarousel restaurant={restaurant} />
                                  </div>

                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">{titleCase(restaurant.name)}</span>
                                    <span className="text-[10px] text-neutral-500">View menu</span>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                  </motion.div>
                )}
                </div>
            </motion.div>
          )}

          {/* ========== RESTAURANT MENU PAGE ========== */}
          {view === 'menu' && selectedRestaurant && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl mx-auto px-4 pt-5"
            >
              {/* Banner */}
              <div className="relative rounded-3xl overflow-hidden h-52 mb-6 shadow-2xl">
                <img src={selectedRestaurant.image} alt={selectedRestaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-green-500 text-xs font-bold inline-flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Pure Veg
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-xs font-bold">{selectedRestaurant.cuisine}</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black">{selectedRestaurant.name}</h1>
                    <p className="text-neutral-300 text-sm mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {selectedRestaurant.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 text-sm">
                  </div>
                </div>
              </div>

              {/* Unified Filter & Sort Menu */}
              {/* Unified Filter & Sort Menu */}
              <div className="flex flex-col gap-3 mb-4">
                {/* Row 1: Search + Diet + Favourites + Sort/Category */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Item search */}
                  <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.18em]">Diet:</label>
                    <div style={{ width: '130px' }}>
                      <CustomSelect
                        value={dietFilter}
                        onChange={(e) => setDietFilter(e.target.value)}
                        options={[
                          { label: 'All', value: 'All' },
                          { label: 'Swaminarayan', value: 'Swaminarayan' }
                        ]}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFavoritesOnly((f) => !f)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      favoritesOnly
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favoritesOnly ? 'fill-white' : ''}`} />
                    Favourites {(favoriteItems[selectedRestaurant?.id] || []).length > 0 && <span className="text-[9px] bg-white/20 px-1 py-0.5 rounded-full">{(favoriteItems[selectedRestaurant?.id] || []).length}</span>}
                  </motion.button>

                  <div className="flex items-center gap-1 ml-auto">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.18em]">Sort / Filter:</label>
                    <div style={{ width: '180px' }}>
                      <CustomSelect
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={[
                          {
                            group: '── Sort by ──',
                            items: SORT_KEYS.map((opt) => ({ label: opt, value: opt }))
                          },
                          {
                            group: '── Category ──',
                            items: categories.map((cat) => ({
                              label: cat,
                              value: cat === 'All' ? 'Popularity' : `cat:${cat}`
                            }))
                          }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <motion.div
                key={sortBy}
                initial="hidden"
                animate="show"
                variants={container}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {filteredMenu.map((dish) => {
                  const meta = getDishMeta(dish);
                  const isFavItem = (favoriteItems[selectedRestaurant?.id] || []).includes(dish.id);
                  return (
                  <motion.div
                    key={dish.id}
                    variants={itemAnim}
                    layout
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md relative overflow-hidden group"
                  >
                    {/* Food Image (large) */}
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={meta.image}
                        alt={dish.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {meta.diet.includes('swaminarayan') && (
                        <span className="absolute top-2 left-2 text-[10px] font-black bg-orange-600 text-white px-2 py-1 rounded-lg shadow-lg">🕉️ S</span>
                      )}
                      <button
                        onClick={(e) => toggleFavoriteItem(dish.id, e)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-neutral-700 shadow-lg hover:bg-red-500 hover:text-white transition-all active:scale-90"
                        aria-label="Favourite item"
                      >
                        <Heart className={`w-4 h-4 ${isFavItem ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                      <span className="absolute bottom-2 left-2 text-white text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {dish.category}
                      </span>
                    </div>

                    <div className="p-2 flex flex-col justify-between gap-2 flex-1">
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="w-2 h-2 rounded-full border border-green-500 bg-green-500" />
                          <h3 className="font-bold text-sm line-clamp-1">{dish.name}</h3>
                        </div>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-1">{dish.desc}</p>
                        {/* Diet badges */}
                        <div className="flex flex-wrap gap-0.5">
                          {meta.diet.includes('swaminarayan') && (
                            <span className="text-[8px] font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 px-1 py-0.5 rounded-md">🕉️ S</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 flex-col">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            {dish.sizeVariants
                              ? `₹${Math.min(...dish.sizeVariants.map(v => v.price))}+`
                              : dish.priceLabel || formatINR(dish.price)}
                          </span>
                          {dish.sizeVariants && (
                            <span className="text-[9px] text-neutral-400 font-medium">Small / Full</span>
                          )}
                        </div>
                        {(() => {
                          // For size-variant items, show per-size controllers or the ADD button
                          if (dish.sizeVariants && dish.sizeVariants.length > 0) {
                            const cartEntries = dish.sizeVariants
                              .map(sv => ({
                                sv,
                                entry: cart.find(it => it.cartId === `${dish.id}--${sv.label}`)
                              }))
                              .filter(x => x.entry);
                            if (cartEntries.length === 0) {
                              return (
                                <button
                                  onClick={() => handleAddToCart(dish)}
                                  className="cart-add-btn"
                                  aria-label={`Add ${dish.name} to cart`}
                                >
                                  <Plus className="w-3 h-3" /> ADD
                                </button>
                              );
                            }
                            return (
                              <div className="flex flex-col gap-1">
                                {cartEntries.map(({ sv, entry }) => (
                                  <div key={sv.label} className="flex items-center gap-1">
                                    <span className="text-[9px] text-neutral-500 w-8 text-right">{sv.label}</span>
                                    <div className="cart-qty-ctrl">
                                      <button
                                        className="cart-qty-btn"
                                        onClick={() => changeQty(entry.cartId, -1)}
                                        aria-label={`Decrease ${dish.name} ${sv.label}`}
                                      >−</button>
                                      <span className="cart-qty-num">{entry.qty}</span>
                                      <button
                                        className="cart-qty-btn"
                                        onClick={() => changeQty(entry.cartId, 1)}
                                        aria-label={`Increase ${dish.name} ${sv.label}`}
                                      >+</button>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleAddToCart(dish)}
                                  className="text-[9px] text-orange-500 font-bold underline underline-offset-2 text-right"
                                  aria-label={`Add another size of ${dish.name}`}
                                >+ Add size</button>
                              </div>
                            );
                          }
                          // Single-price item
                          const cartId = `${dish.id}--Regular`;
                          const cartItem = cart.find(it => it.cartId === cartId);
                          if (!cartItem) {
                            return (
                              <button
                                onClick={() => handleAddToCart(dish)}
                                className="cart-add-btn"
                                aria-label={`Add ${dish.name} to cart`}
                              >
                                <Plus className="w-3 h-3" /> ADD
                              </button>
                            );
                          }
                          return (
                            <div className="cart-qty-ctrl">
                              <button
                                className="cart-qty-btn"
                                onClick={() => changeQty(cartId, -1)}
                                aria-label={`Decrease ${dish.name}`}
                              >−</button>
                              <span className="cart-qty-num">{cartItem.qty}</span>
                              <button
                                className="cart-qty-btn"
                                onClick={() => changeQty(cartId, 1)}
                                aria-label={`Increase ${dish.name}`}
                              >+</button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </motion.div>

              {filteredMenu.length === 0 && (
                <div className="text-center py-16 text-neutral-400">No items found in this category.</div>
              )}
            </motion.div>
          )}

          {/* ========== ANALYTICS / CHARTS PAGE ========== */}
          {view === 'charts' && (
            <motion.div
              key="charts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-7xl mx-auto px-6 pt-10"
            >
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-black mb-2 flex items-center gap-2">
                  <BarChart3 className="w-8 h-8 text-orange-500" /> Campus Food Analytics
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">Track what your campus loves to order.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Items Ordered Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl"
                >
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" /> Most Ordered Items
                  </h3>
                  {chartItems.sorted.length === 0 ? (
                    <p className="text-neutral-400 text-sm py-8 text-center">No orders yet. Start ordering to see analytics!</p>
                  ) : (
                    <div className="space-y-4">
                      {chartItems.sorted.map(([name, count], i) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="truncate pr-2">{name}</span>
                            <span className="text-orange-500">{count}</span>
                          </div>
                          <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / chartItems.max) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Spend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl"
                >
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-orange-500" /> Spend per Restaurant
                  </h3>
                  {chartSpend.sorted.every((s) => s.value === 0) ? (
                    <p className="text-neutral-400 text-sm py-8 text-center">No spending data yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {chartSpend.sorted.filter((s) => s.value > 0).map((s, i) => (
                        <div key={s.fullName}>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span title={s.fullName}>{s.name}</span>
                            <span className="text-orange-500">{formatINR(s.value)}</span>
                          </div>
                          <div className="h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(s.value / chartSpend.max) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Category Share Donut */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl"
                >
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-orange-500" /> Category Share
                  </h3>
                  {categoryData.length === 0 ? (
                    <p className="text-neutral-400 text-sm py-8 text-center">No data yet.</p>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Donut — each segment is positioned by rotating the entire circle */}
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          {(() => {
                            const R = 54;
                            const CIRC = 2 * Math.PI * R;
                            const total = categoryData.reduce((s, x) => s + x.value, 0);
                            let accumulated = 0;
                            return categoryData.map((c, i) => {
                              const fraction = c.value / total;
                              const segLen   = fraction * CIRC;
                              const gap      = CIRC - segLen;
                              // Rotate the segment so it starts where the previous ended
                              const rotation = (accumulated / total) * 360;
                              accumulated += c.value;
                              return (
                                <motion.circle
                                  key={c.name}
                                  cx="60" cy="60" r={R} fill="none"
                                  stroke={PALETTE[i % PALETTE.length]}
                                  strokeWidth="14"
                                  strokeDasharray={`${segLen} ${gap}`}
                                  strokeDashoffset={0}
                                  style={{ transformOrigin: '60px 60px', transform: `rotate(${rotation}deg)` }}
                                  initial={{ strokeDasharray: `0 ${CIRC}` }}
                                  animate={{ strokeDasharray: `${segLen} ${gap}` }}
                                  transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                                />
                              );
                            });
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black">{categoryData.reduce((s, x) => s + x.value, 0)}</span>
                          <span className="text-[10px] text-neutral-400 font-bold">ITEMS</span>
                        </div>
                      </div>
                      {/* Legend */}
                      <div className="space-y-2 flex-1 w-full">
                        {categoryData.map((c, i) => (
                          <div key={c.name} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                            <span className="font-bold flex-1">{c.name}</span>
                            <span className="text-neutral-400 text-xs">{c.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Loyalty Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl"
                >
                  <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" /> Loyalty Leaderboard
                  </h3>
                    <div className="space-y-3">
                    {RESTAURANTS.map((r) => {
                      const loy = loyaltyStatus(r.id);
                      const progress = Math.min(100, Math.max((loy.spend / 1000) * 100, (loy.orders / 100) * 100));
                      return (
                        <div key={r.id} className="flex items-center gap-3">
                          <span className="text-xs font-bold w-32 truncate">{titleCase(r.name)}</span>
                          <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${loy.unlocked ? 100 : progress}%` }}
                              transition={{ duration: 0.8 }}
                              className={`h-full rounded-full ${loy.unlocked ? 'bg-green-500' : 'bg-gradient-to-r from-orange-400 to-orange-600'}`}
                            />
                          </div>
                          <span className="text-xs font-bold w-24 text-right">
                            {loy.unlocked ? '20% OFF ✓' : `₹${loy.spend}/1000`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Order History */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl"
              >
                <OrderHistory orderHistory={orderHistory} onReorder={handleReorder} />
              </motion.div>
            </motion.div>
          )}

          {/* ========== CHECKOUT PAGE ========== */}
          {view === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto px-6 pt-10"
            >
              <h1 className="text-3xl font-black mb-6 flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-orange-500" /> Checkout
              </h1>

              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-1">Your cart is empty</h3>
                  <p className="text-neutral-400 text-sm mb-6">Add some delicious food from campus canteens first!</p>
                  <button
                    onClick={() => navTo('home')}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl">
                    <h3 className="font-black mb-4">Your Items ({totalQty})</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.cartId}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-[11px] text-neutral-400">
                              {item.size} {item.addOns.length > 0 ? `• +${item.addOns.map((a) => a.name).join(', ')}` : ''}
                              {item.spiceLevel > 0 ? `• Spice: ${item.spiceLevel === 1 ? 'Low' : item.spiceLevel === 2 ? 'Med' : 'Hot'}` : ''}
                            </p>
                            {item.specialNote && (
                              <p className="text-[10px] text-orange-500 italic mt-0.5">📝 "{item.specialNote}"</p>
                            )}
                            <p className="text-xs font-bold text-orange-500 mt-0.5">{formatINR(item.unitPrice)}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => changeQty(item.cartId, -1)}
                              className="p-1.5 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:text-orange-500"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </motion.button>
                            <span className="font-black w-6 text-center text-sm">{item.qty}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => changeQty(item.cartId, 1)}
                              className="p-1.5 rounded-lg bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 hover:text-orange-500"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </motion.button>
                          </div>
                          <span className="font-black text-sm w-20 text-right">{formatINR(item.finalPrice)}</span>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Order Options */}
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl">
                    <h3 className="font-black mb-4">Order Options</h3>

                    {/* Mode */}
                    <label className="text-xs font-bold uppercase text-neutral-400 mb-2 block">Order Type</label>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { key: 'Takeaway', icon: Bike, desc: 'Pick it up yourself' },
                        { key: 'Dining', icon: Armchair, desc: 'Eat at the canteen' }
                      ].map((m) => (
                        <button
                          key={m.key}
                          onClick={() => setOrderMode(m.key)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            orderMode === m.key
                              ? 'border-orange-500 bg-orange-500/5'
                              : 'border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <m.icon className={`w-5 h-5 mb-2 ${orderMode === m.key ? 'text-orange-500' : 'text-neutral-400'}`} />
                          <p className="font-bold text-sm">{m.key}</p>
                          <p className="text-[11px] text-neutral-400">{m.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Prep Time */}
                    <div className="text-xs font-bold uppercase text-neutral-400 mb-2 flex items-center gap-1">
                      <Clock3 className="w-3 h-3" aria-hidden="true" /> When do you want the food?
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {['ASAP', '15 min', '30 min', '60 min'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setPrepTime(t)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            prepTime === t
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : 'border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Payment */}
                    <label className="text-xs font-bold uppercase text-neutral-400 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { key: 'Online', icon: CreditCard, desc: 'UPI / NetBanking' },
                        { key: 'Cash', icon: Banknote, desc: 'Pay at counter' }
                      ].map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setPaymentMethod(p.key)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            paymentMethod === p.key
                              ? 'border-orange-500 bg-orange-500/5'
                              : 'border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <p.icon className={`w-5 h-5 mb-2 ${paymentMethod === p.key ? 'text-orange-500' : 'text-neutral-400'}`} />
                          <p className="font-bold text-sm">{p.key}</p>
                          <p className="text-[11px] text-neutral-400">{p.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Online payment options + QR */}
                    <AnimatePresence>
                      {paymentMethod === 'Online' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 border-2 border-orange-200 dark:border-orange-500/30 mb-4">
                            <div className="flex flex-col sm:flex-row items-center gap-5">
                              {/* QR Code */}
                              <div className="relative bg-white p-4 rounded-2xl shadow-lg">
                                <svg width="150" height="150" viewBox="0 0 150 150" className="rounded-xl">
                                  <rect width="150" height="150" fill="white" />
                                  {Array.from({ length: 21 }).map((_, i) =>
                                    Array.from({ length: 21 }).map((_, j) => {
                                      const inFinder = (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
                                      const edge = (i === 0 || i === 20 || j === 0 || j === 20);
                                      const inFinderCenter = inFinder && i > 1 && i < 5 && j > 1 && j < 5;
                                      const rand = ((i * 31 + j * 17 + (i * j) % 7 + 5) % 3);
                                      const fill = inFinder ? '#000' : inFinderCenter ? '#000' : edge ? '#000' : rand < 2 ? '#000' : '#fff';
                                      return <rect key={`${i}-${j}`} x={i * 7.14} y={j * 7.14} width="6" height="6" fill={fill} />;
                                    })
                                  )}
                                </svg>
                                <span className="absolute bottom-2 inset-x-0 text-center text-[10px] font-black text-neutral-500">BUFFERBITES-UPI</span>
                              </div>

                              <div className="flex-1 text-center sm:text-left">
                                <h4 className="font-black text-lg text-neutral-900 dark:text-white mb-1">Scan to Pay 📱</h4>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
                                  Scan this QR with any UPI app (GPay, PhonePe, Paytm, BHIM) to pay instantly.
                                </p>
                                <div className="inline-flex flex-col items-center gap-1 bg-white dark:bg-neutral-800 rounded-xl px-4 py-2 shadow-sm border border-orange-100 dark:border-neutral-700">
                                  <span className="text-[10px] text-neutral-400 font-bold uppercase">UPI ID</span>
                                  <span className="font-mono font-black text-sm text-orange-600">bufferbites@okcampus</span>
                                </div>
                                <button
                                  onClick={() => navigator.clipboard?.writeText('bufferbites@okcampus')}
                                  className="mt-3 text-[11px] font-bold text-orange-500 hover:text-orange-600 underline underline-offset-2"
                                >
                                  📋 Copy UPI ID
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Alternate online methods */}
                          <label className="text-xs font-bold uppercase text-neutral-400 mb-2 block">Or choose a method</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { key: 'UPI', desc: 'GPay / PhonePe / Paytm' },
                              { key: 'NetBanking', desc: 'All major banks' }
                            ].map((m) => (
                              <button
                                key={m.key}
                                onClick={() => setOnlineMethod(m.key)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  onlineMethod === m.key
                                    ? 'border-orange-500 bg-orange-500/10'
                                    : 'border-neutral-200 dark:border-neutral-800'
                                }`}
                              >
                                <p className="font-bold text-xs">{m.key}</p>
                                <p className="text-[10px] text-neutral-400">{m.desc}</p>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bill Summary */}
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xl">
                    <h3 className="font-black mb-4 flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-orange-500" /> Bill Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Item Subtotal</span>
                        <span className="font-bold">{formatINR(totalCartPrice)}</span>
                      </div>

                      {/* First Order discount */}
                      {selectedRestaurant && firstOrderDisc(selectedRestaurant.id) && (
                        <div className="flex justify-between text-green-600 font-bold">
                          <span>First Order 5% OFF</span>
                          <span>- {formatINR(Math.round(totalCartPrice * 0.05))}</span>
                        </div>
                      )}

                      {/* Loyalty discount */}
                      {selectedRestaurant && loyaltyStatus(selectedRestaurant.id).unlocked && !loyaltyUsed[selectedRestaurant.id] && (
                        <div className="flex justify-between text-green-600 font-bold">
                          <span>Loyalty 20% OFF (next order)</span>
                          <span>- {formatINR(Math.round(totalCartPrice * 0.2))}</span>
                        </div>
                      )}

                      <div className="border-t border-dashed border-neutral-200 dark:border-neutral-700 my-3" />
                      <div className="flex justify-between text-lg font-black">
                        <span>Total to Pay</span>
                        <span className="text-orange-500">
                          <AnimatedCounter value={Math.max(0, totalCartPrice - (selectedRestaurant ? (firstOrderDisc(selectedRestaurant.id) ? totalCartPrice * 0.05 : 0) + (loyaltyStatus(selectedRestaurant.id).unlocked && !loyaltyUsed[selectedRestaurant.id] ? totalCartPrice * 0.2 : 0) : 0))} prefix="₹" />
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={placeOrder}
                      className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <PartyPopper className="w-5 h-5" />
                      Place Order • <AnimatedCounter value={Math.max(0, totalCartPrice - (selectedRestaurant ? (firstOrderDisc(selectedRestaurant.id) ? totalCartPrice * 0.05 : 0) + (loyaltyStatus(selectedRestaurant.id).unlocked && !loyaltyUsed[selectedRestaurant.id] ? totalCartPrice * 0.2 : 0) : 0))} prefix="₹" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ========== ORDER SUCCESS / RECEIPT ========== */}
          {view === 'success' && placedOrder && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto px-6 pt-12 relative"
            >
              {/* Confetti */}
              {confetti.map((c, i) => (
                <span
                  key={i}
                  className={`confetti-piece ${c.shape === 'circle' ? 'rounded-full' : c.shape === 'rect' ? 'rounded-sm' : 'rounded-tl-full rounded-br-full'}`}
                  style={{
                    left: `${c.left}%`,
                    backgroundColor: c.color,
                    width: c.size,
                    height: c.shape === 'ribbon' ? c.size * 2 : c.size * 1.4,
                    animationDelay: `${c.delay}s`,
                    animationDuration: `${c.duration}s`,
                    transform: `rotate(${c.rotate}deg)`
                  }}
                />
              ))}

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-24 h-24 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center shadow-2xl shadow-green-500/40 animate-check-pop mb-6 animate-glow"
              >
                <CheckCircle2 className="w-14 h-14" />
              </motion.div>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-black mb-2">Order Placed! 🎉</h1>
                <p className="text-neutral-500 dark:text-neutral-400">Your food is being prepared with love 💛</p>
                {orderInsertFailed && (
                  <p className="mt-3 text-sm text-red-500 font-medium">
                    ⚠️ Order could not be saved to the system — please contact staff with your order ID.
                  </p>
                )}
              </div>

              {/* Receipt */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl"
              >
                {/* Receipt header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5" />
                      </span>
                      <div>
                        <p className="font-black">BufferBites</p>
                        <p className="text-xs text-orange-100">Payment Receipt</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-sm">{placedOrder.id}</p>
                      <p className="text-xs text-orange-100">{new Date(placedOrder.placedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Restaurant info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Restaurant</span>
                    <span className="font-bold">{titleCase(placedOrder.restaurantName)}</span>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold uppercase text-neutral-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {placedOrder.items.map((it) => (
                        <div key={it.cartId} className="flex justify-between text-sm">
                          <span>
                            {it.name} <span className="text-neutral-400">× {it.qty}</span>
                            {it.size && <span className="text-neutral-400"> ({it.size})</span>}
                            {it.addOns.length > 0 && (
                              <span className="text-neutral-400"> +{it.addOns.map((a) => a.name).join(', ')}</span>
                            )}
                            {it.specialNote && (
                              <p className="text-[10px] text-orange-500 italic mt-0.5">📝 {it.specialNote}</p>
                            )}
                          </span>
                          <span className="font-bold">{formatINR(it.finalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-neutral-200 dark:border-neutral-700 my-2" />

                  {/* Order details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                        <Bike className="w-3 h-3" /> Order Type
                      </p>
                      <p className="font-bold mt-1">{placedOrder.mode}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                        <Clock3 className="w-3 h-3" /> Food Ready In
                      </p>
                      <p className="font-bold mt-1">{placedOrder.eta}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Payment
                      </p>
                      <p className="font-bold mt-1">
                        {placedOrder.payment}
                        {placedOrder.onlineMethod && <span className="text-neutral-400 text-xs"> • {placedOrder.onlineMethod}</span>}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase flex items-center gap-1">
                        <CalendarClock className="w-3 h-3" /> Requested Time
                      </p>
                      <p className="font-bold mt-1">{placedOrder.prepTime}</p>
                    </div>
                  </div>

                  {/* Bill breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Item Subtotal</span>
                      <span className="font-bold">{formatINR(placedOrder.itemSubtotal)}</span>
                    </div>
                    {placedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>{placedOrder.discountLabel}</span>
                        <span>- {formatINR(placedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-dashed border-neutral-200 dark:border-neutral-700 my-2" />
                    <div className="flex justify-between text-lg font-black">
                      <span>Total Paid</span>
                      <span className="text-orange-500">{formatINR(placedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <CancelOrderSuccessCard
                orderId={placedOrder.id}
                timeLeft={cancelWindows[placedOrder.id]?.timeLeft ?? 0}
                onCancel={handleCancelOrder}
                onDone={handleDoneOrder}
                onOrderMore={resetAll}
              />
            </motion.div>
          )}

          {/* ========== ACTIVE ORDERS PAGE ========== */}
          {view === 'orders' && (
            <ActiveOrdersPage
              windows={cancelWindows}
              onCancel={handleCancelOrder}
              onDone={handleDoneOrder}
            />
          )}

          {/* ========== PROFILE / EDIT PROFILE PAGE ========== */}
          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-lg mx-auto px-6 pt-12 pb-20"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-black mb-1 flex items-center gap-2">
                  <User className="w-7 h-7 text-orange-500" /> Edit Profile
                </h1>
                <p className="text-neutral-400 text-sm">Update your account details below.</p>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-8 flex flex-col gap-6">
                {/* Name (read-only) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">Full Name</label>
                  <div className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500 dark:text-neutral-400 select-none">
                    {userName}
                  </div>
                </div>

                {/* College (read-only) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">College</label>
                  <div className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-bold text-neutral-500 dark:text-neutral-400 select-none">
                    {college || '—'}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => { setEditEmail(e.target.value); setProfileSaved(false); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showEditPw ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => { setEditPassword(e.target.value); setProfileSaved(false); }}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showEditPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password — only shown when new password is typed */}
                {editPassword.length > 0 && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setProfileSaved(false); }}
                        placeholder="Re-enter new password"
                        className={`w-full px-4 py-3 pr-12 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-800 border focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                          confirmPassword.length > 0 && confirmPassword !== editPassword
                            ? 'border-red-400 dark:border-red-500'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-orange-500 transition-colors"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && confirmPassword !== editPassword && (
                      <p className="text-xs text-red-500 font-semibold mt-1.5">Passwords do not match.</p>
                    )}
                    {confirmPassword.length > 0 && confirmPassword === editPassword && (
                      <p className="text-xs text-green-500 font-semibold mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </p>
                    )}
                  </div>
                )}

                {/* Save button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={editPassword.length > 0 && confirmPassword !== editPassword}
                  onClick={() => {
                    const newPw = editPassword.length > 0 ? editPassword : userPassword;
                    onUpdateProfile(editEmail, newPw);
                    setProfileSaved(true);
                    setEditPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {profileSaved
                    ? <><CheckCircle2 className="w-5 h-5" /> Saved!</>
                    : <><Pencil className="w-4 h-4" /> Save Changes</>}
                </motion.button>

                {/* Logout from here too */}
                <button
                  onClick={onLogout}
                  className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-900 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ===== BACK TO TOP ===== */}
      <AnimatePresence>
        {view !== 'success' && !(cart.length > 0 && view !== 'checkout' && view !== 'success') && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 z-40 p-3 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/40 hover:bg-orange-600 transition-all"
            aria-label="Back to top"
            title="Back to top"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== FLOATING CART BAR ===== */}
      <AnimatePresence>
        {cart.length > 0 && view !== 'checkout' && view !== 'success' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-50"
          >
            <button
              onClick={() => navTo('checkout')}
              className="view-cart-bar"
              aria-label={`View cart — ${totalQty} item${totalQty !== 1 ? 's' : ''}, ${formatINR(totalCartPrice)}`}
            >
              <div className="view-cart-bar__left">
                <div className="view-cart-bar__badge" aria-hidden="true">
                  {totalQty}
                </div>
                <span className="view-cart-bar__items">{totalQty} Item{totalQty !== 1 ? 's' : ''} · {formatINR(totalCartPrice)}</span>
              </div>
              <div className="view-cart-bar__right">
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>VIEW CART</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SIZE PICKER MODAL ===== */}
      <AnimatePresence>
        {sizePickerDish && (
          <motion.div
            key="size-picker-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="size-picker-overlay"
            onClick={() => setSizePickerDish(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Choose size"
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="size-picker-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="size-picker-modal__handle" aria-hidden="true" />
              <p className="size-picker-modal__title">{sizePickerDish.name}</p>
              <p className="size-picker-modal__subtitle">Select a size</p>
              <div className="size-picker-modal__options">
                {sizePickerDish.sizeVariants.map((sv) => (
                  <button
                    key={sv.label}
                    className="size-picker-option"
                    onClick={() => {
                      handleAddToCart(sizePickerDish, sv);
                      setSizePickerDish(null);
                    }}
                    aria-label={`${sv.label} — ₹${sv.price}`}
                  >
                    <span className="size-picker-option__label">{sv.label}</span>
                    <span className="size-picker-option__price">₹{sv.price}</span>
                  </button>
                ))}
              </div>
              <button
                className="size-picker-cancel"
                onClick={() => setSizePickerDish(null)}
                aria-label="Cancel"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('Foodie');
  const [college, setCollege] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Admin emails — add more here if needed
  const ADMIN_EMAILS = ['24bca74@svitvasad.ac.in'];

  const handleLoginSuccess = async (name, selectedCollege, email, password) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const uid = user?.id || '';
      const cleanEmail = (email || user?.email || '').trim().toLowerCase();

      if (ADMIN_EMAILS.includes(cleanEmail)) {
        // Admin user — route to admin dashboard
        setIsAdmin(true);
        setUserEmail(cleanEmail);
        setUserId(uid);
        setLoggedIn(true);
        return;
      }

      // Regular user
      setIsAdmin(false);
      setUserName(name || 'Foodie');
      setCollege(selectedCollege || '');
      setUserEmail(cleanEmail);
      setUserPassword(password || '');
      setUserId(uid);
      setLoggedIn(true);
    } catch {
      // Fallback if getUser fails
      const cleanEmail = (email || '').trim().toLowerCase();
      if (ADMIN_EMAILS.includes(cleanEmail)) {
        setIsAdmin(true);
        setUserEmail(cleanEmail);
        setLoggedIn(true);
        return;
      }
      setIsAdmin(false);
      setUserName(name || 'Foodie');
      setCollege(selectedCollege || '');
      setUserEmail(cleanEmail);
      setUserPassword(password || '');
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut().catch(() => { /* best-effort */ });
    setLoggedIn(false);
    setIsAdmin(false);
    setUserName('Foodie');
    setCollege('');
    setUserEmail('');
    setUserPassword('');
    setUserId('');
  };

  if (!loggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} dark={dark} onDarkToggle={() => setDark((d) => !d)} />;
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={handleLogout} restaurants={RESTAURANTS} />;
  }

  return <AppMain
    userName={userName}
    college={college}
    userEmail={userEmail}
    userPassword={userPassword}
    userId={userId}
    onUpdateProfile={(email, password) => { setUserEmail(email); setUserPassword(password); }}
    onLogout={handleLogout}
    dark={dark}
    onDarkToggle={() => setDark((d) => !d)}
  />;
}