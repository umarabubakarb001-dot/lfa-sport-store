import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, SaleRecord, User } from './src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Simple sha256 helper with salt for security
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_lfa').digest('hex');
}

interface DbSchema {
  users: (User & { passwordHash: string })[];
  products: Product[];
  sales: SaleRecord[];
}

// Initial seed products
const SEED_PRODUCTS: Product[] = [
  // --- BOOTS ---
  { id: 'lfa-p-1', name: 'Adidas Predator (First Grade Cleats)', category: 'Boots', stock: 15, costPrice: 70000, price: 95000, minStockLevel: 5 },
  { id: 'lfa-p-2', name: 'Nike Airzoom (First Grade Cleats)', category: 'Boots', stock: 12, costPrice: 75000, price: 105000, minStockLevel: 5 },
  { id: 'lfa-p-3', name: 'Puma Boot (First Grade Cleats)', category: 'Boots', stock: 10, costPrice: 65000, price: 90000, minStockLevel: 5 },
  { id: 'lfa-p-4', name: 'Adidas F50 (First Grade Cleats)', category: 'Boots', stock: 14, costPrice: 72000, price: 100000, minStockLevel: 4 },
  { id: 'lfa-p-5', name: 'Nike Phantom (First Grade Cleats)', category: 'Boots', stock: 8, costPrice: 78000, price: 110000, minStockLevel: 3 },
  { id: 'lfa-p-6', name: 'Nike Mercurial (First Grade Cleats)', category: 'Boots', stock: 20, costPrice: 80000, price: 115000, minStockLevel: 5 },
  { id: 'lfa-p-7', name: 'Samba (Academy Grade Boots)', category: 'Boots', stock: 25, costPrice: 28000, price: 42000, minStockLevel: 6 },
  { id: 'lfa-p-8', name: 'Predator (Academy Grade Boots)', category: 'Boots', stock: 18, costPrice: 32000, price: 48000, minStockLevel: 5 },
  { id: 'lfa-p-9', name: 'Crazy Fast (Academy Grade Boots)', category: 'Boots', stock: 16, costPrice: 30000, price: 45000, minStockLevel: 4 },
  { id: 'lfa-p-10', name: 'Nike Airzoom (Academy Grade Boots)', category: 'Boots', stock: 22, costPrice: 34000, price: 50000, minStockLevel: 6 },

  // --- TRAINERS ---
  { id: 'lfa-p-11', name: 'Original Puma Trainers (First Grade)', category: 'Trainers', stock: 12, costPrice: 42000, price: 60000, minStockLevel: 4 },
  { id: 'lfa-p-12', name: 'Nike Airzoom (First Grade Trainers)', category: 'Trainers', stock: 15, costPrice: 45000, price: 65000, minStockLevel: 5 },
  { id: 'lfa-p-13', name: 'Phantom GX6 (First Grade Trainers)', category: 'Trainers', stock: 10, costPrice: 48000, price: 70000, minStockLevel: 3 },
  { id: 'lfa-p-14', name: 'Adidas F50 (First Grade Trainers)', category: 'Trainers', stock: 14, costPrice: 44000, price: 63000, minStockLevel: 4 },
  { id: 'lfa-p-15', name: 'Adidas Crazy Fast (First Grade Trainers)', category: 'Trainers', stock: 11, costPrice: 42000, price: 60000, minStockLevel: 3 },
  { id: 'lfa-p-16', name: 'Adidas Predator (First Grade Trainers)', category: 'Trainers', stock: 13, costPrice: 46000, price: 65000, minStockLevel: 4 },
  { id: 'lfa-p-17', name: 'Nike Mercurial (First Grade Trainers)', category: 'Trainers', stock: 18, costPrice: 50000, price: 72000, minStockLevel: 5 },
  { id: 'lfa-p-18', name: 'Academy Grade Trainers', category: 'Trainers', stock: 30, costPrice: 18000, price: 28000, minStockLevel: 8 },
  { id: 'lfa-p-19', name: 'Low-Budget Trainers', category: 'Trainers', stock: 45, costPrice: 10000, price: 15000, minStockLevel: 10 },

  // --- BALLS ---
  { id: 'lfa-p-20', name: 'High Quality Original Molten Speed Ball', category: 'Balls', stock: 20, costPrice: 22000, price: 35000, minStockLevel: 5 },
  { id: 'lfa-p-21', name: 'Super-Pro Ball', category: 'Balls', stock: 15, costPrice: 18000, price: 28000, minStockLevel: 4 },
  { id: 'lfa-p-22', name: 'High Quality Tenth Ball', category: 'Balls', stock: 25, costPrice: 14000, price: 22000, minStockLevel: 6 },
  { id: 'lfa-p-23', name: 'Original Conti Ball', category: 'Balls', stock: 18, costPrice: 20000, price: 32000, minStockLevel: 5 },

  // --- GOALKEEPER GEAR ---
  { id: 'lfa-p-24', name: 'Goalkeeper Gloves', category: 'Goalkeeper Gear', stock: 15, costPrice: 12000, price: 20000, minStockLevel: 4 },
  { id: 'lfa-p-25', name: 'Goalkeeper Jersey', category: 'Goalkeeper Gear', stock: 12, costPrice: 15000, price: 25000, minStockLevel: 3 },

  // --- SOCKS & SHIN PADS ---
  { id: 'lfa-p-26', name: 'Long Socks', category: 'Socks & Shin Pads', stock: 100, costPrice: 1000, price: 2000, minStockLevel: 15 },
  { id: 'lfa-p-27', name: 'Ankle Socks', category: 'Socks & Shin Pads', stock: 120, costPrice: 600, price: 1200, minStockLevel: 20 },
  { id: 'lfa-p-28', name: 'Grip Socks', category: 'Socks & Shin Pads', stock: 80, costPrice: 1500, price: 3000, minStockLevel: 15 },
  { id: 'lfa-p-29', name: 'Cut Socks', category: 'Socks & Shin Pads', stock: 65, costPrice: 1000, price: 2000, minStockLevel: 10 },
  { id: 'lfa-p-30', name: 'Belgium Socks', category: 'Socks & Shin Pads', stock: 50, costPrice: 1400, price: 2500, minStockLevel: 10 },
  { id: 'lfa-p-31', name: 'Anklet Socks', category: 'Socks & Shin Pads', stock: 75, costPrice: 500, price: 1000, minStockLevel: 15 },
  { id: 'lfa-p-32', name: 'Mini Shin Pads (Big)', category: 'Socks & Shin Pads', stock: 40, costPrice: 2000, price: 3500, minStockLevel: 8 },
  { id: 'lfa-p-33', name: 'Mini Shin Pads (Small)', category: 'Socks & Shin Pads', stock: 45, costPrice: 1500, price: 2500, minStockLevel: 8 },

  // --- JERSEYS & APPAREL ---
  { id: 'lfa-p-34', name: 'Club Jerseys', category: 'Jerseys & Apparel', stock: 150, costPrice: 10000, price: 16000, minStockLevel: 25 },
  { id: 'lfa-p-35', name: 'Fashion Jersey', category: 'Jerseys & Apparel', stock: 80, costPrice: 8500, price: 14000, minStockLevel: 15 },
  { id: 'lfa-p-36', name: 'Body Hug', category: 'Jerseys & Apparel', stock: 60, costPrice: 4000, price: 7000, minStockLevel: 10 },
  { id: 'lfa-p-37', name: 'Retro-Classic Jersey', category: 'Jerseys & Apparel', stock: 50, costPrice: 11000, price: 18000, minStockLevel: 8 },
  { id: 'lfa-p-38', name: 'Knickers', category: 'Jerseys & Apparel', stock: 95, costPrice: 3500, price: 6000, minStockLevel: 15 },
  { id: 'lfa-p-39', name: 'Full Gym Kits', category: 'Jerseys & Apparel', stock: 40, costPrice: 13000, price: 22000, minStockLevel: 8 },
  { id: 'lfa-p-40', name: 'Singlets (Male Underwear)', category: 'Jerseys & Apparel', stock: 110, costPrice: 1500, price: 2500, minStockLevel: 20 },
  { id: 'lfa-p-41', name: 'Boxers (Male Underwear)', category: 'Jerseys & Apparel', stock: 130, costPrice: 1200, price: 2000, minStockLevel: 25 },

  // --- TROPHIES ---
  { id: 'lfa-p-42', name: 'Big Trophy', category: 'Trophies', stock: 6, costPrice: 35000, price: 60000, minStockLevel: 2 },
  { id: 'lfa-p-43', name: 'Medium Trophy', category: 'Trophies', stock: 9, costPrice: 25000, price: 42000, minStockLevel: 2 },
  { id: 'lfa-p-44', name: 'Small Trophy', category: 'Trophies', stock: 14, costPrice: 15000, price: 26000, minStockLevel: 3 },
  { id: 'lfa-p-45', name: 'Mini Trophy', category: 'Trophies', stock: 22, costPrice: 7000, price: 12000, minStockLevel: 4 },

  // --- TRAINING GEAR & ACCESSORIES ---
  { id: 'lfa-p-46', name: 'Gym Bag', category: 'Training Gear & Accessories', stock: 35, costPrice: 9000, price: 15000, minStockLevel: 6 },
  { id: 'lfa-p-47', name: 'Nike Slides', category: 'Training Gear & Accessories', stock: 45, costPrice: 8000, price: 14000, minStockLevel: 8 },
  { id: 'lfa-p-48', name: 'Face-cap', category: 'Training Gear & Accessories', stock: 60, costPrice: 3000, price: 5000, minStockLevel: 10 },
  { id: 'lfa-p-49', name: 'Belgium Bips', category: 'Training Gear & Accessories', stock: 55, costPrice: 2500, price: 4000, minStockLevel: 10 },
  { id: 'lfa-p-50', name: 'Original Bips 2in1', category: 'Training Gear & Accessories', stock: 40, costPrice: 3800, price: 6500, minStockLevel: 8 },
  { id: 'lfa-p-51', name: 'Captain Band', category: 'Training Gear & Accessories', stock: 50, costPrice: 800, price: 1500, minStockLevel: 10 },
  { id: 'lfa-p-52', name: 'Official Whistle', category: 'Training Gear & Accessories', stock: 25, costPrice: 2000, price: 3500, minStockLevel: 5 },
  { id: 'lfa-p-53', name: 'Small Whistle', category: 'Training Gear & Accessories', stock: 30, costPrice: 800, price: 1500, minStockLevel: 5 }
];

// Helper to generate realistic sale records
function generateSeedSales(): SaleRecord[] {
  return [];
}

export class Database {
  private static instance: Database;
  private data: DbSchema = { users: [], products: [], sales: [] };

  private constructor() {
    this.initDb();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initDb() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);

        // Check if DB contains legacy seeded items (e.g., 'p-1' Nike Pegasus Shoes) and migrate them
        const hasLegacySeed = this.data.products.some(p => p.name.toLowerCase().includes('pegasus') || p.id === 'p-1');
        if (hasLegacySeed) {
          console.log('[LFA DB Migration] Migrating legacy database to clean LFA Store.');
          this.data.products = [];
          this.data.sales = [];
          this.save();
        }
      } catch (err) {
        console.error('Error reading database file, reinitializing...', err);
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  private resetToDefaults() {
    const defaultManager: User & { passwordHash: string } = {
      id: 'manager-1',
      username: 'manager',
      email: 'manager@lfasport.com',
      fullName: 'Store Manager',
      passwordHash: hashPassword('lfa2026') // default password is lfa2026
    };

    this.data = {
      users: [defaultManager],
      products: [],
      sales: []
    };

    this.save();
  }

  private save() {
    fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  // --- Users ---
  public getUsers() {
    return this.data.users;
  }

  public findUserByUsername(username: string) {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public updateUserProfile(fullName: string, email: string, username?: string) {
    const manager = this.data.users[0];
    if (manager) {
      manager.fullName = fullName;
      manager.email = email;
      if (username) {
        manager.username = username;
      }
      this.save();
    }
    return manager;
  }

  public updatePassword(newPasswordHash: string) {
    const manager = this.data.users[0];
    if (manager) {
      manager.passwordHash = newPasswordHash;
      this.save();
    }
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const id = `p-${Date.now()}`;
    const newProduct: Product = { id, ...productData };
    this.data.products.push(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.data.products[idx] = { ...this.data.products[idx], ...updatedFields };
    
    // Auto-update sales category and name if product details change (to keep integrity)
    this.data.sales.forEach(s => {
      if (s.productId === id) {
        if (updatedFields.name) s.productName = updatedFields.name;
        if (updatedFields.category) s.category = updatedFields.category;
        if (updatedFields.price) s.unitPrice = updatedFields.price;
      }
    });

    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const originalLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    
    if (this.data.products.length < originalLen) {
      // Keep sales records but mark that details are locked/archived if product is deleted
      this.save();
      return true;
    }
    return false;
  }

  // --- Sales ---
  public getSales(): SaleRecord[] {
    return this.data.sales;
  }

  public addSale(saleData: Omit<SaleRecord, 'id' | 'totalPrice' | 'profit' | 'productName' | 'category' | 'unitPrice'>): SaleRecord | null {
    const product = this.data.products.find(p => p.id === saleData.productId);
    if (!product) return null;

    if (product.stock < saleData.quantity) {
      throw new Error(`Insufficient stock for ${product.name}. Remaining: ${product.stock}`);
    }

    // Deduct stock
    product.stock -= saleData.quantity;

    const id = `s-${Date.now()}`;
    const totalPrice = product.price * saleData.quantity;
    const totalCost = product.costPrice * saleData.quantity;
    const profit = totalPrice - totalCost;

    const newSale: SaleRecord = {
      id,
      date: saleData.date,
      productId: saleData.productId,
      productName: product.name,
      category: product.category,
      quantity: saleData.quantity,
      unitPrice: product.price,
      totalPrice,
      profit,
      customerType: saleData.customerType
    };

    this.data.sales.push(newSale);
    this.save();
    return newSale;
  }

  public deleteSale(id: string): boolean {
    const saleIdx = this.data.sales.findIndex(s => s.id === id);
    if (saleIdx === -1) return false;

    const sale = this.data.sales[saleIdx];
    // Return stock
    const product = this.data.products.find(p => p.id === sale.productId);
    if (product) {
      product.stock += sale.quantity;
    }

    this.data.sales.splice(saleIdx, 1);
    this.save();
    return true;
  }
}
