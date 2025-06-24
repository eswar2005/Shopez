/**
 * 购物车页面组件 - 显示购物车内容和管理功能
 */
import { Link } from 'react-router'
import { useApp } from '../App'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  /**
   * 计算购物车总价
   */
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * 计算总商品数量
   */
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * 处理数量更新
   */
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  /**
   * 处理商品移除
   */
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link
          to="/products"
          className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Unit Price: ${item.price.toFixed(2)}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {getTotalPrice() >= 50 ? 'Free' : '$9.99'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">
                  ${(getTotalPrice() * 0.08).toFixed(2)}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">
                    ${(
                      getTotalPrice() + 
                      (getTotalPrice() >= 50 ? 0 : 9.99) + 
                      (getTotalPrice() * 0.08)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {getTotalPrice() < 50 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-700">
                  Add ${(50 - getTotalPrice()).toFixed(2)} more to get free shipping!
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout with SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">You might also like</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: '5',
              name: 'Silver Necklace',
              price: 79.99,
              image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/d0b22fee-0495-45b3-8d12-66643ec708a7.jpg'
            },
            {
              id: '6',
              name: 'Pearl Earrings',
              price: 149.99,
              image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/3ad9ebea-c025-417f-9079-ec61eaa51922.jpg'
            },
            {
              id: '7',
              name: 'Diamond Ring',
              price: 299.99,
              image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/551bffe8-ea1a-4e68-b80b-9ef040fc2864.jpg'
            },
            {
              id: '8',
              name: 'Gold Watch',
              price: 399.99,
              image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/de8379b8-cd43-457e-bd8c-4c98a7c265dd.jpg'
            }
          ].map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-orange-500 mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center block"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
