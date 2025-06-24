/**
 * 主应用组件 - 定义整个应用的路由结构
 */
import { HashRouter, Route, Routes } from 'react-router'
import { useState, createContext, useContext } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Navbar from './components/Navbar'

/**
 * 应用上下文类型定义
 */
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
}

/**
 * 用户数据类型
 */
interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
}

/**
 * 购物车商品类型
 */
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * 产品数据类型
 */
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  discount?: number;
}

// 创建应用上下文
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * 自定义Hook - 获取应用上下文
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  /**
   * 添加商品到购物车
   */
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
  };

  /**
   * 从购物车移除商品
   */
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  /**
   * 更新购物车商品数量
   */
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const contextValue: AppContextType = {
    user,
    setUser,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartQuantity
  };

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}

// 导出类型以供其他组件使用
export type { User, CartItem, Product };
