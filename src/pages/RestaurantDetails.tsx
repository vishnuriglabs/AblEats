import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Leaf, Filter, Search, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import { toast } from 'sonner';
import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart } = useCartStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVegOnly, setShowVegOnly] = useState(false);
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();

  // Find the restaurant by ID
  const restaurant = RESTAURANTS.find(r => r.id === id);

  // Get all menu items for this restaurant
  const restaurantMenuItems = MENU_ITEMS.filter(item => item.restaurantId === id);

  // Get unique categories from menu items
  const categories = ['all', ...new Set(restaurantMenuItems.map(item => item.category))];

  // Filter menu items based on active category, search query, and veg filter
  const filteredMenuItems = restaurantMenuItems.filter(item => 
    (activeCategory === 'all' || item.category === activeCategory) &&
    (showVegOnly ? item.isVeg : true) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Provide audio feedback for blind users when page loads
  useEffect(() => {
    if (restaurant && mode === 'voice') {
      const message = `You are viewing the menu for ${restaurant.name}. ${restaurant.description}. Rating: ${restaurant.rating} stars. ${restaurant.deliveryTime} minutes delivery time. There are ${restaurantMenuItems.length} items on the menu.`;
      speak(message);
    }
  }, [restaurant, mode, speak, restaurantMenuItems.length]);

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    addItemToCart(item, quantity);
    
    // Provide appropriate feedback based on user mode
    if (mode === 'voice') {
      speak(`Added ${quantity} ${item.name} to your cart.`);
    }
    
    toast.success(`Added ${item.name} to cart`, {
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
      icon: <ShoppingCart className="h-5 w-5" />
    });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (mode === 'voice') {
      speak(`Filtered menu by ${category} category`);
    }
  };

  if (!restaurant) {
    return (
      <>
        <Helmet>
          <title>Restaurant Not Found - AblEats</title>
          <meta name="description" content="The requested restaurant could not be found." />
        </Helmet>
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurant not found</h2>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-primary hover:text-primary/80"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{restaurant.name} - Menu | AblEats</title>
        <meta name="description" content={`Order food online from ${restaurant.name}. ${restaurant.cuisine} cuisine. ${restaurant.isVeg ? 'Pure vegetarian restaurant.' : ''} Delivery time: ${restaurant.deliveryTime} mins.`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        
        {/* Restaurant Header with Name, Logo, and Ratings */}
        <div className="glass-effect rounded-3xl overflow-hidden mb-8">
          <div className="h-64 relative">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-gray-200 text-sm mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-300 text-sm">{restaurant.address}</p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex space-x-4 mb-2">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-white">{restaurant.rating}</span>
                  </div>
                  
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 text-white mr-1" />
                    <span className="text-white">{restaurant.deliveryTime} mins</span>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <MapPin className="h-4 w-4 text-white mr-1" />
                  <span className="text-white">{restaurant.distance} km</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white">
            <p className="text-gray-600">{restaurant.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {restaurant.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for dishes"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowVegOnly(!showVegOnly)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-full border ${
                showVegOnly ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-600'
              }`}
              aria-pressed={showVegOnly}
              aria-label="Show vegetarian items only"
            >
              <Leaf className="h-5 w-5" />
              <span>Veg Only</span>
            </button>
            
            <button
              className="flex items-center space-x-2 px-4 py-3 rounded-full border border-gray-200 text-gray-600"
              aria-label="More filters"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4 pb-2" role="tablist">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'glass-effect text-gray-600 hover:bg-gray-100'
                }`}
                role="tab"
                aria-selected={activeCategory === category}
                aria-label={`Show ${category} category`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items Section */}
        {filteredMenuItems.length > 0 ? (
          <div>
            {/* Group menu items by category and display with headings */}
            {activeCategory === 'all' ? (
              // When "all" is selected, group by category and show headings
              Object.entries(
                filteredMenuItems.reduce((acc, item) => {
                  if (!acc[item.category]) {
                    acc[item.category] = [];
                  }
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, MenuItem[]>)
              ).map(([category, items]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-2xl font-semibold mb-6 gradient-text">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <MenuItemCard 
                        key={item.id} 
                        item={item} 
                        onAddToCart={handleAddToCart}
                        mode={mode}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // When specific category is selected, just show items without category heading
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenuItems.map(item => (
                  <MenuItemCard 
                    key={item.id} 
                    item={item} 
                    onAddToCart={handleAddToCart}
                    mode={mode}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try changing your search or filters</p>
          </div>
        )}
      </div>
    </>
  );
}

function MenuItemCard({ 
  item, 
  onAddToCart,
  mode
}: { 
  item: MenuItem; 
  onAddToCart: (item: MenuItem, quantity: number) => void;
  mode: 'voice' | 'deaf' | 'mute';
}) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { speak } = useSpeechSynthesis();
  
  const increaseQuantity = () => {
    setQuantity(prev => {
      const newQuantity = prev + 1;
      if (mode === 'voice') {
        speak(`Quantity increased to ${newQuantity}`);
      }
      return newQuantity;
    });
  };
  
  const decreaseQuantity = () => {
    setQuantity(prev => {
      if (prev > 1) {
        const newQuantity = prev - 1;
        if (mode === 'voice') {
          speak(`Quantity decreased to ${newQuantity}`);
        }
        return newQuantity;
      }
      return prev;
    });
  };
  
  const handleItemClick = () => {
    navigate(`/item/${item.id}`);
    if (mode === 'voice') {
      speak(`Selected ${item.name}`);
    }
  };
  
  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };
  
  // Description for screen readers
  const accessibilityDescription = `${item.name}. ${item.isVeg ? 'Vegetarian. ' : ''} Price: ${item.price} rupees. ${item.description}`;
  
  return (
    <div 
      className="glass-effect rounded-2xl overflow-hidden hover-glow transition-transform duration-300 hover:scale-[1.02]"
      aria-label={accessibilityDescription}
    >
      <div 
        className="relative h-48 overflow-hidden cursor-pointer"
        onClick={handleItemClick}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {item.isVeg && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Veg
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <h3 
          className="text-xl font-semibold gradient-text cursor-pointer"
          onClick={handleItemClick}
        >
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">₹{item.price}</span>
          
          {/* Quantity control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className={`p-1 rounded-full ${
                quantity <= 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Decrease quantity"
            >
              <Minus className="h-5 w-5" />
            </button>
            
            <span className="w-8 text-center font-medium">{quantity}</span>
            
            <button
              onClick={increaseQuantity}
              className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          aria-label={`Add ${quantity} ${item.name} to cart for ${item.price * quantity} rupees`}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart - ₹{item.price * quantity}
        </button>
      </div>
    </div>
  );
}