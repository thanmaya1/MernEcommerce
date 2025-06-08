import {
  users,
  categories,
  products,
  reviews,
  carts,
  wishlists,
  orders,
  orderItems,
  coupons,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductWithCategory,
  type Review,
  type InsertReview,
  type Cart,
  type InsertCart,
  type CartItemWithProduct,
  type Wishlist,
  type InsertWishlist,
  type WishlistItemWithProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithItems,
  type Coupon,
  type InsertCoupon,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, like, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Product operations
  getProducts(options?: {
    categoryId?: number;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ProductWithCategory[]>;
  getProductById(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySlug(slug: string): Promise<ProductWithCategory | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Review operations
  getReviewsByProduct(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  
  // Cart operations
  getCartByUser(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCart): Promise<Cart>;
  updateCartItem(id: number, quantity: number): Promise<Cart>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Wishlist operations
  getWishlistByUser(userId: string): Promise<WishlistItemWithProduct[]>;
  addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: number): Promise<void>;
  
  // Order operations
  getOrdersByUser(userId: string): Promise<OrderWithItems[]>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  getAllOrders(): Promise<OrderWithItems[]>;
  
  // Coupon operations
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Product operations
  async getProducts(options: {
    categoryId?: number;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<ProductWithCategory[]> {
    let query = db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        categoryId: products.categoryId,
        stock: products.stock,
        images: products.images,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        tags: products.tags,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: categories,
        reviews: sql<Review[]>`COALESCE(json_agg(
          json_build_object(
            'id', ${reviews.id},
            'productId', ${reviews.productId},
            'userId', ${reviews.userId},
            'rating', ${reviews.rating},
            'title', ${reviews.title},
            'comment', ${reviews.comment},
            'isVerified', ${reviews.isVerified},
            'createdAt', ${reviews.createdAt}
          )
        ) FILTER (WHERE ${reviews.id} IS NOT NULL), '[]')`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.isActive, true))
      .groupBy(products.id, categories.id);

    if (options.categoryId) {
      query = query.where(and(eq(products.isActive, true), eq(products.categoryId, options.categoryId)));
    }

    if (options.search) {
      query = query.where(
        and(
          eq(products.isActive, true),
          like(products.name, `%${options.search}%`)
        )
      );
    }

    if (options.featured) {
      query = query.where(and(eq(products.isActive, true), eq(products.isFeatured, true)));
    }

    query = query.orderBy(desc(products.createdAt));

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    const result = await query;
    return result as ProductWithCategory[];
  }

  async getProductById(id: number): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        categoryId: products.categoryId,
        stock: products.stock,
        images: products.images,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        tags: products.tags,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: categories,
        reviews: sql<Review[]>`COALESCE(json_agg(
          json_build_object(
            'id', ${reviews.id},
            'productId', ${reviews.productId},
            'userId', ${reviews.userId},
            'rating', ${reviews.rating},
            'title', ${reviews.title},
            'comment', ${reviews.comment},
            'isVerified', ${reviews.isVerified},
            'createdAt', ${reviews.createdAt}
          )
        ) FILTER (WHERE ${reviews.id} IS NOT NULL), '[]')`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.id, id))
      .groupBy(products.id, categories.id);

    return result as ProductWithCategory | undefined;
  }

  async getProductBySlug(slug: string): Promise<ProductWithCategory | undefined> {
    const [result] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        categoryId: products.categoryId,
        stock: products.stock,
        images: products.images,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        tags: products.tags,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: categories,
        reviews: sql<Review[]>`COALESCE(json_agg(
          json_build_object(
            'id', ${reviews.id},
            'productId', ${reviews.productId},
            'userId', ${reviews.userId},
            'rating', ${reviews.rating},
            'title', ${reviews.title},
            'comment', ${reviews.comment},
            'isVerified', ${reviews.isVerified},
            'createdAt', ${reviews.createdAt}
          )
        ) FILTER (WHERE ${reviews.id} IS NOT NULL), '[]')`,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(reviews, eq(products.id, reviews.productId))
      .where(eq(products.slug, slug))
      .groupBy(products.id, categories.id);

    return result as ProductWithCategory | undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Review operations
  async getReviewsByProduct(productId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Cart operations
  async getCartByUser(userId: string): Promise<CartItemWithProduct[]> {
    return await db
      .select({
        id: carts.id,
        userId: carts.userId,
        productId: carts.productId,
        quantity: carts.quantity,
        createdAt: carts.createdAt,
        product: products,
      })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.userId, userId))
      .orderBy(desc(carts.createdAt));
  }

  async addToCart(cartItem: InsertCart): Promise<Cart> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.userId, cartItem.userId), eq(carts.productId, cartItem.productId)));

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(carts)
        .set({ quantity: existingItem.quantity + cartItem.quantity })
        .where(eq(carts.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Add new item
      const [newItem] = await db.insert(carts).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<Cart> {
    const [updatedItem] = await db
      .update(carts)
      .set({ quantity })
      .where(eq(carts.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(carts).where(eq(carts.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(carts).where(eq(carts.userId, userId));
  }

  // Wishlist operations
  async getWishlistByUser(userId: string): Promise<WishlistItemWithProduct[]> {
    return await db
      .select({
        id: wishlists.id,
        userId: wishlists.userId,
        productId: wishlists.productId,
        createdAt: wishlists.createdAt,
        product: products,
      })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt));
  }

  async addToWishlist(wishlistItem: InsertWishlist): Promise<Wishlist> {
    const [newItem] = await db.insert(wishlists).values(wishlistItem).returning();
    return newItem;
  }

  async removeFromWishlist(id: number): Promise<void> {
    await db.delete(wishlists).where(eq(wishlists.id, id));
  }

  // Order operations
  async getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            createdAt: orderItems.createdAt,
            product: products,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return { ...order, orderItems: items };
      })
    );

    return ordersWithItems;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        createdAt: orderItems.createdAt,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    return { ...order, orderItems: items };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    // Add order items
    await db.insert(orderItems).values(
      items.map(item => ({ ...item, orderId: newOrder.id }))
    );

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getAllOrders(): Promise<OrderWithItems[]> {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select({
            id: orderItems.id,
            orderId: orderItems.orderId,
            productId: orderItems.productId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            createdAt: orderItems.createdAt,
            product: products,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(eq(orderItems.orderId, order.id));

        return { ...order, orderItems: items };
      })
    );

    return ordersWithItems;
  }

  // Coupon operations
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, code), eq(coupons.isActive, true)));
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
  }> {
    const [revenue] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.totalAmount}), 0)` })
      .from(orders)
      .where(eq(orders.paymentStatus, "completed"));

    const [orderCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders);

    const [productCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(products)
      .where(eq(products.isActive, true));

    const [userCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users);

    return {
      totalRevenue: Number(revenue.total) || 0,
      totalOrders: Number(orderCount.count) || 0,
      totalProducts: Number(productCount.count) || 0,
      totalUsers: Number(userCount.count) || 0,
    };
  }
}

export const storage = new DatabaseStorage();
