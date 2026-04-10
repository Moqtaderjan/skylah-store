import React, { useMemo, useState } from "react";
import { ShoppingCart, Heart, Search, Menu, User, Phone, Mail, MapPin, Truck, Shield, CreditCard, Headphones, ChevronRight, Star, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Accessories",
  "Cooking",
  "Electronics",
  "Fashion",
  "Furniture",
  "Lighting",
  "Toys",
  "Watches",
];

const products = [
  {
    id: 1,
    name: "Stainless Steel Rings",
    category: "Accessories",
    price: 4.96,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
    badge: "Hot",
  },
  {
    id: 2,
    name: "Rattan Furniture Set",
    category: "Furniture",
    price: 276.36,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    badge: "Popular",
  },
  {
    id: 3,
    name: "Poster Music Team",
    category: "Toys",
    price: 37.93,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
    badge: "New",
  },
  {
    id: 4,
    name: "Modern Smart Watch",
    category: "Watches",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    badge: "Sale",
  },
  {
    id: 5,
    name: "Kitchen Essentials Set",
    category: "Cooking",
    price: 29.5,
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
    badge: "Best Value",
  },
  {
    id: 6,
    name: "Minimal Table Lamp",
    category: "Lighting",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    badge: "Trending",
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: "Fast & free delivery",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Unlimited help desk",
  },
  {
    icon: CreditCard,
    title: "Online Payment",
    text: "Debit/Credit Cards",
  },
  {
    icon: Shield,
    title: "100% Safe",
    text: "Safe & secure shopping",
  },
];

function ProductCard({ product, onAdd }) {
  const [wish, setWish] = useState(false);

  return (
    <Card className="group overflow-hidden rounded-2xl border-zinc-200 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-white hover:bg-black">
          {product.badge}
        </Badge>
        <button
          onClick={() => setWish(!wish)}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${wish ? "fill-black text-black" : "text-zinc-700"}`} />
        </button>
      </div>
      <CardContent className="space-y-3 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900">{product.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-zinc-900">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
          <span className="ml-2 text-sm text-zinc-500">5.0</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
          <Button onClick={() => onAdd(product)} className="rounded-xl bg-black text-white hover:bg-zinc-800">
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CartDrawer({ items, open, setOpen, changeQty }) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">Shopping cart</h2>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </div>

        <div className="flex h-[calc(100%-153px)] flex-col overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-zinc-500">Your cart is empty.</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border p-3">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{item.name}</h3>
                    <p className="text-sm text-zinc-500">${item.price.toFixed(2)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="rounded-lg border p-1" onClick={() => changeQty(item.id, -1)}><Minus className="h-4 w-4" /></button>
                      <span className="w-6 text-center">{item.qty}</span>
                      <button className="rounded-lg border p-1" onClick={() => changeQty(item.id, 1)}><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-5">
          <div className="mb-4 flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Button className="w-full rounded-xl bg-black text-white hover:bg-zinc-800">Checkout</Button>
        </div>
      </div>
    </>
  );
}

export default function AzharInspiredStore() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="bg-black px-4 py-2 text-center text-sm text-white">
        FREE SHIPPING FOR ALL ORDERS OF $150
      </div>

      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-xl border p-2 lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Azhar</p>
              <h1 className="text-2xl font-black">STORE</h1>
            </div>
          </div>

          <div className="hidden max-w-xl flex-1 items-center gap-2 lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input placeholder="Search products..." className="rounded-xl border-zinc-200 pl-10" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl"><User className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-xl"><Heart className="h-5 w-5" /></Button>
            <Button variant="ghost" className="relative rounded-xl" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Cart
              {cartCount > 0 && (
                <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">{cartCount}</span>
              )}
            </Button>
          </div>
        </div>

        <nav className="border-t">
          <div className="mx-auto hidden max-w-7xl items-center gap-8 px-6 py-4 lg:flex">
            <div className="font-semibold">Browse Categories</div>
            <div className="flex flex-wrap gap-3 text-sm text-zinc-700">
              {["Home", "Shop", "About us", "Contact us"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="transition hover:text-black">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {mobileMenu && (
            <div className="border-t px-4 py-4 lg:hidden">
              <div className="mb-3">
                <Input placeholder="Search products..." className="rounded-xl" />
              </div>
              <div className="flex flex-col gap-3 text-sm">
                {["Home", "Shop", "About us", "Contact us"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      <section id="home" className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6 lg:py-10">
        <aside className="rounded-3xl border bg-zinc-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setActiveCategory("All")}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                activeCategory === "All" ? "bg-black text-white" : "hover:bg-white"
              }`}
            >
              <span>All</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                  activeCategory === category ? "bg-black text-white" : "hover:bg-white"
                }`}
              >
                <span>{category}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </aside>

        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 p-8 text-white lg:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_35%),linear-gradient(135deg,#18181b,_#000)]" />
          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-zinc-300">Your One Stop Shop</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">For Quality Products</h2>
            <p className="mt-5 max-w-xl text-base text-zinc-300 md:text-lg">
              A clean ecommerce website inspired by the structure and feel of the referenced store,
              with a modern hero section, product categories, featured products, and company info.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-xl bg-white text-black hover:bg-zinc-200">Shop now</Button>
              <Button variant="outline" className="rounded-xl border-white bg-transparent text-white hover:bg-white hover:text-black">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-10 lg:grid-cols-4 lg:px-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="rounded-3xl border-zinc-200 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-zinc-500">{feature.text}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Featured collection</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">Shop Products</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeCategory === item ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <section id="about-us" className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Some words about us</p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Visit Our Store</h2>
          <p className="mt-5 text-lg text-zinc-600">
            This template follows the same kind of ecommerce layout: announcement bar, category menu,
            featured products, about section, trust badges, and a contact/footer area.
          </p>
          <p className="mt-4 text-zinc-600">
            You can replace all text, images, categories, and business details with your own brand.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              ["3000", "Completed Orders"],
              ["350", "Products"],
              ["95", "Partners"],
              ["24/7", "Support"],
              ["5", "Offices"],
              ["2010", "Since"],
            ].map(([value, label]) => (
              <Card key={label} className="rounded-2xl border-zinc-200">
                <CardContent className="p-5">
                  <div className="text-2xl font-black">{value}</div>
                  <div className="mt-1 text-sm text-zinc-500">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
            alt="Store showcase"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section id="contact-us" className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-zinc-200 shadow-sm">
            <CardContent className="p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Contact us</p>
              <h2 className="mt-2 text-3xl font-black">For Any Questions</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input placeholder="Your Name" className="rounded-xl" />
                <Input placeholder="Your Email" className="rounded-xl" />
                <Input placeholder="Phone Number" className="rounded-xl" />
                <Input placeholder="Company" className="rounded-xl" />
              </div>
              <textarea
                placeholder="Your Message"
                className="mt-4 min-h-[140px] w-full rounded-2xl border border-zinc-200 p-4 outline-none focus:ring-2 focus:ring-black"
              />
              <Button className="mt-4 rounded-xl bg-black text-white hover:bg-zinc-800">Send message</Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-zinc-200 bg-black text-white shadow-sm">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Contact details</p>
                <h3 className="mt-2 text-2xl font-black">Your One Stop Shop</h3>
              </div>
              <div className="space-y-4 text-zinc-200">
                <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5" /><span>250 S Van Dorn St, Alexandria, VA 22304</span></div>
                <div className="flex items-center gap-3"><Phone className="h-5 w-5" /><span>+1 (571) 473-8535</span></div>
                <div className="flex items-center gap-3"><Mail className="h-5 w-5" /><span>info@azhar-llc.com</span></div>
              </div>
              <div className="rounded-2xl bg-white/10 p-5 text-sm text-zinc-300">
                Replace these with your own address, phone, email, and social links.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t bg-zinc-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Azhar</p>
            <h3 className="text-2xl font-black">STORE</h3>
            <p className="mt-4 text-sm text-zinc-600">Modern ecommerce layout with products, categories, and trust sections.</p>
          </div>
          <div>
            <h4 className="font-semibold">Our Stores</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li>Alexandria</li>
              <li>London SF</li>
              <li>Cockfosters BP</li>
              <li>New York</li>
              <li>Los Angeles</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Useful Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600">
              <li>Privacy Policy</li>
              <li>Returns</li>
              <li>Terms & Conditions</li>
              <li>Contact Us</li>
              <li>About Us</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Newsletter</h4>
            <p className="mt-4 text-sm text-zinc-600">Join our newsletter.</p>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Your email" className="rounded-xl bg-white" />
              <Button className="rounded-xl bg-black text-white hover:bg-zinc-800">Join</Button>
            </div>
          </div>
        </div>
        <div className="border-t px-4 py-4 text-center text-sm text-zinc-500">©2026 Your Store. All rights reserved.</div>
      </footer>

      <CartDrawer items={cart} open={cartOpen} setOpen={setCartOpen} changeQty={changeQty} />
    </div>
  );
}
