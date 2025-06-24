/**
 * 产品页面组件 - 展示产品列表和搜索功能
 */
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useApp } from '../App'
import { Star, ShoppingCart, Filter, Grid, List } from 'lucide-react'

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

export default function Products() {
  const { addToCart } = useApp();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Electronics', 'Fashion', 'Jewelry', 'Home', 'Sports', 'Books'];

  useEffect(() => {
    // 模拟产品数据
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Elegant Gold Bracelet',
        price: 89.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/d1140dba-592b-4768-a992-aed1684b78d6.jpg',
        description: 'Beautiful gold bracelet perfect for any occasion',
        category: 'Jewelry',
        rating: 4.8,
        reviews: 127,
        discount: 15
      },
      {
        id: '2',
        name: 'Designer Handbag',
        price: 199.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/0b66fdf4-d8de-4970-af4d-6404629b6dc5.jpg',
        description: 'Luxurious designer handbag with premium materials',
        category: 'Fashion',
        rating: 4.9,
        reviews: 89,
        discount: 20
      },
      {
        id: '3',
        name: 'Wireless Earbuds',
        price: 149.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/2d92bc94-fdf3-4c0f-b574-e144ad88c6e5.jpg',
        description: 'High-quality wireless earbuds with noise cancellation',
        category: 'Electronics',
        rating: 4.7,
        reviews: 234,
        discount: 10
      },
      {
        id: '4',
        name: 'Smartwatch Pro',
        price: 299.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/e6c932a4-335c-4c2a-a637-706b27dced1c.jpg',
        description: 'Advanced smartwatch with health tracking features',
        category: 'Electronics',
        rating: 4.6,
        reviews: 156,
        discount: 25
      },
      {
        id: '5',
        name: 'Running Shoes',
        price: 129.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/76118260-6866-4961-81ac-31d1fee4e81d.jpg',
        description: 'Comfortable running shoes for all terrains',
        category: 'Sports',
        rating: 4.5,
        reviews: 203,
        discount: 5
      },
      {
        id: '6',
        name: 'Leather Wallet',
        price: 79.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/c80eb97e-b74e-4333-ab4c-e457c627eb80.jpg',
        description: 'Premium leather wallet with RFID protection',
        category: 'Fashion',
        rating: 4.7,
        reviews: 98,
        discount: 0
      },
      {
        id: '7',
        name: 'Coffee Maker',
        price: 249.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/2b399400-aee5-4b03-87d8-856b1599a0cd.jpg',
        description: 'Automatic coffee maker with programmable settings',
        category: 'Home',
        rating: 4.4,
        reviews: 167,
        discount: 12
      },
      {
        id: '8',
        name: 'Bestseller Novel',
        price: 24.99,
        image: 'https://pub-cdn.sider.ai/u/U0Y3HGZW7LV/web-coder/685ac1739ac9f9652371ce3f/resource/27ee8fbd-ebb7-4fef-884e-25cffa836443.jpg',
        description: 'Popular fiction novel by renowned author',
        category: 'Books',
        rating: 4.8,
        reviews: 321,
        discount: 0
      }
    ];

    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    // 过滤产品
    let filtered = products;

    // 搜索过滤
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 分类过滤
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // 价格范围过滤
    filtered = filtered.filter(product => {
      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, priceRange, searchParams]);

  /**
   * 处理添加到购物车
   */
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  /**
   * 计算最终价格
   */
  const getFinalPrice = (product: Product) => {
    return product.discount 
      ? product.price * (1 - product.discount / 100)
      : product.price;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="lg:col-span-3">
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-500">
                          ${getFinalPrice(product).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="flex">
                    <div className="w-48 h-32 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-3">{product.description}</p>
                          
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              ({product.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold text-orange-500">
                              ${getFinalPrice(product).toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Link
                              to={`/product/${product.id}`}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
