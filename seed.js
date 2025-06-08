import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./shared/schema.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

const sampleCategories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic devices and gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"
  },
  {
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel for all occasions",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
  },
  {
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home and garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Sports equipment and accessories",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
  },
  {
    name: "Books",
    slug: "books",
    description: "Books and educational materials",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
  }
];

const sampleProducts = [
  // Electronics
  {
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description: "The latest iPhone with titanium design and advanced camera system",
    price: "999.00",
    originalPrice: "1099.00",
    sku: "IPHONE15PRO-128",
    categoryId: 1,
    stock: 50,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"],
    tags: ["smartphone", "apple", "premium"]
  },
  {
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    description: "Powerful Android smartphone with AI features",
    price: "849.00",
    originalPrice: "899.00",
    sku: "GALAXY-S24-256",
    categoryId: 1,
    stock: 35,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500"],
    tags: ["smartphone", "samsung", "android"]
  },
  {
    name: "MacBook Pro 14\"",
    slug: "macbook-pro-14",
    description: "Professional laptop with M3 chip for demanding workflows",
    price: "1999.00",
    originalPrice: "2199.00",
    sku: "MBP14-M3-512",
    categoryId: 1,
    stock: 25,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
    tags: ["laptop", "apple", "professional"]
  },
  {
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise canceling wireless headphones",
    price: "329.00",
    originalPrice: "399.00",
    sku: "SONY-WH1000XM5",
    categoryId: 1,
    stock: 40,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"],
    tags: ["headphones", "sony", "wireless"]
  },

  // Clothing
  {
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    description: "Timeless denim jacket perfect for any casual outfit",
    price: "89.00",
    originalPrice: "120.00",
    sku: "DENIM-JACKET-M",
    categoryId: 2,
    stock: 60,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500"],
    tags: ["jacket", "denim", "casual"]
  },
  {
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-tshirt",
    description: "Soft, comfortable cotton t-shirt in various colors",
    price: "29.00",
    originalPrice: "39.00",
    sku: "COTTON-TEE-L",
    categoryId: 2,
    stock: 100,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
    tags: ["t-shirt", "cotton", "basic"]
  },
  {
    name: "Running Sneakers",
    slug: "running-sneakers",
    description: "Lightweight running shoes for optimal performance",
    price: "129.00",
    originalPrice: "159.00",
    sku: "RUN-SNEAKER-42",
    categoryId: 2,
    stock: 45,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
    tags: ["shoes", "running", "athletic"]
  },

  // Home & Garden
  {
    name: "Smart LED Bulb Set",
    slug: "smart-led-bulb-set",
    description: "WiFi-enabled smart bulbs with color changing capabilities",
    price: "49.00",
    originalPrice: "69.00",
    sku: "SMART-LED-4PACK",
    categoryId: 3,
    stock: 80,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500"],
    tags: ["smart home", "lighting", "wifi"]
  },
  {
    name: "Ceramic Plant Pot",
    slug: "ceramic-plant-pot",
    description: "Beautiful ceramic pot perfect for indoor plants",
    price: "24.00",
    originalPrice: "32.00",
    sku: "CERAMIC-POT-MED",
    categoryId: 3,
    stock: 120,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500"],
    tags: ["pot", "ceramic", "plants"]
  },

  // Sports
  {
    name: "Yoga Mat Pro",
    slug: "yoga-mat-pro",
    description: "Professional-grade yoga mat with superior grip",
    price: "79.00",
    originalPrice: "99.00",
    sku: "YOGA-MAT-PRO",
    categoryId: 4,
    stock: 55,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"],
    tags: ["yoga", "mat", "fitness"]
  },
  {
    name: "Resistance Band Set",
    slug: "resistance-band-set",
    description: "Complete set of resistance bands for home workouts",
    price: "39.00",
    originalPrice: "55.00",
    sku: "RESIST-BAND-SET",
    categoryId: 4,
    stock: 70,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500"],
    tags: ["resistance", "bands", "workout"]
  },

  // Books
  {
    name: "JavaScript: The Definitive Guide",
    slug: "javascript-definitive-guide",
    description: "Comprehensive guide to JavaScript programming",
    price: "59.00",
    originalPrice: "69.00",
    sku: "JS-GUIDE-7ED",
    categoryId: 5,
    stock: 30,
    isActive: true,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"],
    tags: ["programming", "javascript", "guide"]
  },
  {
    name: "The Art of Clean Code",
    slug: "art-of-clean-code",
    description: "Best practices for writing maintainable code",
    price: "45.00",
    originalPrice: "52.00",
    sku: "CLEAN-CODE-2ED",
    categoryId: 5,
    stock: 25,
    isActive: true,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"],
    tags: ["programming", "clean code", "best practices"]
  }
];

const sampleCoupons = [
  {
    code: "WELCOME10",
    description: "10% off for new customers",
    discountType: "percentage",
    discountValue: "10.00",
    minOrderAmount: "50.00",
    maxUses: 100,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    code: "SAVE20",
    description: "$20 off orders over $100",
    discountType: "fixed",
    discountValue: "20.00",
    minOrderAmount: "100.00",
    maxUses: 50,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
  },
  {
    code: "FREESHIP",
    description: "Free shipping on any order",
    discountType: "shipping",
    discountValue: "0.00",
    minOrderAmount: "0.00",
    maxUses: null,
    usedCount: 0,
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
  }
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Check if data already exists
    const existingCategories = await db.select().from(schema.categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("📊 Database already contains data. Skipping seed.");
      return;
    }

    // Insert categories
    console.log("📂 Seeding categories...");
    const categories = await db.insert(schema.categories)
      .values(sampleCategories)
      .returning();
    console.log(`✅ Created ${categories.length} categories`);

    // Insert products
    console.log("📦 Seeding products...");
    const products = await db.insert(schema.products)
      .values(sampleProducts)
      .returning();
    console.log(`✅ Created ${products.length} products`);

    // Insert coupons
    console.log("🎟️ Seeding coupons...");
    const coupons = await db.insert(schema.coupons)
      .values(sampleCoupons)
      .returning();
    console.log(`✅ Created ${coupons.length} coupons`);

    // Add some sample reviews for featured products
    console.log("⭐ Adding sample reviews...");
    const sampleReviews = [
      {
        productId: 1, // iPhone 15 Pro
        userId: "sample-user-1",
        rating: 5,
        title: "Amazing phone!",
        comment: "The camera quality is incredible and the titanium build feels premium.",
        isVerified: true
      },
      {
        productId: 1,
        userId: "sample-user-2",
        rating: 4,
        title: "Great upgrade",
        comment: "Noticeable improvement from my old phone. Battery life is excellent.",
        isVerified: true
      },
      {
        productId: 3, // MacBook Pro
        userId: "sample-user-3",
        rating: 5,
        title: "Perfect for development",
        comment: "Blazing fast performance for coding and design work. Highly recommended!",
        isVerified: true
      },
      {
        productId: 5, // Denim Jacket
        userId: "sample-user-4",
        rating: 4,
        title: "Great quality",
        comment: "Fits well and looks stylish. Good value for the price.",
        isVerified: false
      }
    ];

    await db.insert(schema.reviews).values(sampleReviews);
    console.log(`✅ Created ${sampleReviews.length} reviews`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("🛍️ You can now browse products, add to cart, and test all features!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedDatabase();