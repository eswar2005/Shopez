/**
 * 产品详情页面组件 - 展示单个产品的详细信息
 */
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { useApp } from '../App'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft } from 'lucide-react'

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
  features: string[];
  specifications: Record<string, string>;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      // 模拟获取产品详情
      const mockProduct: Product = {
        id: id,
        name: 'Elegant Gold Bracelet',
        price: 89.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/7cdd0026-184b-47c6-96e3-3ed09febc4e5.jpg',
        description: 'This stunning gold bracelet is crafted from high-quality 18k gold, featuring an elegant design that complements any outfit. Perfect for special occasions or everyday wear, this bracelet combines timeless elegance with modern style.',
        category: 'Jewelry',
        rating: 4.8,
        reviews: 127,
        discount: 15,
        features: [
          '18k Gold Plated',
          'Hypoallergenic',
          'Adjustable Size',
          'Gift Box Included',
          'Lifetime Warranty'
        ],
        specifications: {
          'Material': '18k Gold Plated Brass',
          'Weight': '25g',
          'Length': '7-9 inches (adjustable)',
          'Width': '8mm',
          'Clasp Type': 'Lobster Clasp',
          'Care Instructions': 'Avoid contact with water and chemicals'
        }
      };

      const mockReviews: Review[] = [
        {
          id: '1',
          user: 'Sarah M.',
          rating: 5,
          comment: 'Absolutely beautiful bracelet! The quality is amazing and it looks exactly like the photos. Perfect gift for my friend Emily.',
          date: '2024-01-15'
        },
        {
          id: '2',
          user: 'Jennifer L.',
          rating: 4,
          comment: 'Love this bracelet! It\'s elegant and goes with everything. The only minor issue is that it took a bit longer to arrive than expected.',
          date: '2024-01-10'
        },
        {
          id: '3',
          user: 'Maria R.',
          rating: 5,
          comment: 'Excellent quality and beautiful design. The gold plating is very good and hasn\'t tarnished at all.',
          date: '2024-01-05'
        }
      ];

      setProduct(mockProduct);
      setReviews(mockReviews);
    }
  }, [id]);

  /**
   * 处理添加到购物车
   */
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  /**
   * 计算最终价格
   */
  const getFinalPrice = () => {
    if (!product) return 0;
    return product.discount 
      ? product.price * (1 - product.discount / 100)
      : product.price;
  };

  /**
   * 处理分享
   */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6">
        <Link to="/products" className="flex items-center text-orange-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
        <span className="text-gray-500">/</span>
        <span className="text-gray-700">{product.category}</span>
        <span className="text-gray-500">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            {product.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.discount}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-20 object-cover rounded border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-orange-500">
              ${getFinalPrice().toFixed(2)}
            </span>
            {product.discount && (
              <span className="text-2xl text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                  isWishlisted ? 'text-red-500 border-red-300' : 'text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Shipping and Security Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-700">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-700">Secure payment guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'description', label: 'Description' },
              { key: 'specifications', label: 'Specifications' },
              { key: 'reviews', label: `Reviews (${reviews.length})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-gray-700 leading-relaxed">
                This exquisite piece is perfect for both casual and formal occasions. 
                The craftsmanship attention to detail makes it a standout accessory 
                that will complement any outfit beautifully.
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.user}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
