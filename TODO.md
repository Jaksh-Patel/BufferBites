# BufferBites Rework Tasks

- [x] Initial CampusBites integration (completed earlier)
- [x] Rebrand to BufferBites (title, header, favicon logo)
- [x] Convert prices $ → ₹ (rupees)
- [x] Remove old offers/discounts; add new 5% first-order + 20% loyalty discount rules
- [x] Replace restaurants with 8 college canteen spots (Pure Veg) — 4 Ground Floor + 4 First Floor
- [x] Add specialized varied menus (pizza/pasta, chaat, juice bar, store packets, south indian, burgers, meal hub)
- [x] Include cold drinks, juices, smoothies, ice creams across menus
- [x] Add menu sorting (popularity/price/name) + category filter tabs per restaurant
- [x] Add animated charts/analytics page (items ordered, spend, category share, order history, loyalty progress)
- [x] Build complete checkout flow (itemized cart, qty +/-, remove)
- [x] Add Takeaway / Dining toggle + preferred food time selection
- [x] Add Online / Cash payment options
- [x] Animated order success screen + payment receipt with confetti
- [x] Add more animations throughout (layout page, menu, charts, checkout)
- [x] Update index.css with brand theme + custom keyframes
- [x] Verify build (npm run build)

## Bug Fixes & Improvements (Round 2)
- [x] Fix heart/favorite button blocked by hover overlay (raised z-index, added favorite button inside overlay too)
- [x] Add "Favourite Restaurants" toggle on home page (favorites only filter)
- [x] Add "Favourites" filter on menu page + per-item heart to mark favourite items
- [x] Add animated food image strips in restaurant hover quick-peek overlay
- [x] Add food images to all 80 menu items (before name & price)
- [x] Add online payment QR code + UPI ID + alternate methods (UPI / Card / NetBanking / Wallet)
- [x] Show chosen online payment method on order receipt
- [x] Add Jain & Swaminarayan dietary filters + badges on menu items
- [x] Add special instructions field in customization modal (carried through cart, checkout, receipt)
- [x] Show spice level + special notes in checkout cart items
- [x] Show add-ons + special notes on order receipt
- [x] Verify build (npm run build) — passed

## Round 3 (Home Page Layout & Hover Fixes)
- [x] Ground Floor now has 5 canteens (Canteen Store moved to Ground Floor)
- [x] First Floor now has 4 canteens (new Campus Bakery & Cafe added on First Floor)
- [x] Added 9th restaurant "Campus Bakery & Cafe" with full 10-item menu + images
- [x] Restaurant cards now have idle float animation (gentle up/down bob)
- [x] Hover overlay now shows animated rotating food image carousel (no dish text list)
- [x] Updated floor info banner on home page
- [x] Verify build (npm run build) — passed

## Round 4 (Card Visibility & Image Size Fixes)
- [x] Fixed float animation conflict with hover (separate nested motion divs)
- [x] Heart/favourite button now highly visible (white pill background, dark icon, turns red when active)
- [x] Added clear "Open" button on every restaurant card cover
- [x] Hover carousel food images sized to fit the card (h-40, full width)
- [x] Menu item cards now have large full-width food images at the top
- [x] Menu item ADD button moved into the price row (no more stray bottom block)
- [x] Menu item category badge moved onto the food image
- [x] Verify build (npm run build) — passed

## Round 5 (Bigger Cards)
- [x] Restaurant card grid uses lg:grid-cols-2 with wider gaps (cards stay large on all screens)
- [x] Restaurant cover image enlarged from h-48 → h-56
- [x] Restaurant meta section padding increased (p-5 → p-6)
- [x] Hover carousel resized to h-40 so it fits inside the larger card without overflow
- [x] Menu item food image enlarged from h-44 → h-52
- [x] Verify build (npm run build) — passed

## Round 6 (Remove Duplicate Navigation & Favorite Buttons)
- [x] Removed the "View Full Menu" button from the hover overlay (both "Open" and "View Full Menu" opened the same menu page)
- [x] Removed the "Open" button from the card cover (whole card is already clickable to open the menu)
- [x] Removed the "Tap anywhere to open" hint text from the hover overlay
- [x] Removed the duplicate favourite button from the hover overlay (kept the always-visible heart at the top of the card)
- [x] Verify build (npm run build) — passed

## Round 7 (Beauty & Animation Upgrade)
- [x] Expanded CSS keyframe library (gradient-shift, glow-pulse, heart-beat, pop-in, slide-in, shine-sweep, sparkle, skeleton-load)
- [x] Added utility classes: glass-card, animate-gradient, shine-effect, animate-glow, animate-heart-beat, neon-text, skeleton-img
- [x] Added AnimatedCounter component (counts up prices with easing)
- [x] Added floating food emoji decorations in the background
- [x] Added live "on campus" orders marquee ticker on home page
- [x] Header upgraded to glassmorphism (glass-card)
- [x] Restaurant cards: idle float bob animation + shine-sweep effect
- [x] Heart button now has heart-beat animation + spring pop on click
- [x] Animated price counter on restaurant cards
- [x] Category tabs have sliding pill indicator (layoutId spring)
- [x] Animated total in bill summary + place order button (counts up)
- [x] Success confetti upgraded to 70 multi-shape/multi-color pieces
- [x] Success check icon now has glow-pulse animation
- [x] Added back-to-top floating button
- [x] Smooth scroll behavior enabled
- [x] Verify build (npm run build) — passed




