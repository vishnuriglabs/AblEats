import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Clock, MapPin, Mic, Leaf, Filter, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';
import type { Restaurant, MenuItem } from '../types';
import { useCartStore } from '../store/cartStore';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods'>('restaurants');
  const { speak, cancel } = useSpeechSynthesis();
  const { mode } = useAccessibilityStore();
  const navigate = useNavigate();

  // Filter restaurants and foods
  const filteredRestaurants = RESTAURANTS.filter(restaurant => 
    (showVegOnly ? restaurant.isVeg : true) &&
    (restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFoods = MENU_ITEMS.filter(item =>
    (showVegOnly ? item.isVeg : true) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle search updates
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (mode === 'voice') {
      const resultCount = activeTab === 'restaurants' ? filteredRestaurants.length : filteredFoods.length;
      speak(`Found ${resultCount} ${activeTab} for "${query}"`);
    }
  };

  // Handle tab changes
  const handleTabChange = (tab: 'restaurants' | 'foods') => {
    setActiveTab(tab);
    if (mode === 'voice') {
      const resultCount = tab === 'restaurants' ? filteredRestaurants.length : filteredFoods.length;
      speak(`Showing ${tab}. Found ${resultCount} items`);
    }
  };

  // Handle veg filter
  const handleVegFilter = () => {
    setShowVegOnly(!showVegOnly);
    if (mode === 'voice') {
      speak(!showVegOnly ? 'Showing vegetarian items only' : 'Showing all items');
    }
  };

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = (event: Event) => {
      const customEvent = event as CustomEvent<{command: string}>;
      if (!customEvent.detail?.command) return;

      const command = customEvent.detail.command.toLowerCase();
      console.log('Home component received command:', command);

      // Handle search commands
      if (command.startsWith('search for ')) {
        const searchTerm = command.replace('search for ', '');
        handleSearch(searchTerm);
        return;
      }

      // Handle filter commands
      if (command === 'show restaurants' || command === 'view restaurants') {
        handleTabChange('restaurants');
        return;
      }

      if (command === 'show foods' || command === 'view foods') {
        handleTabChange('foods');
        return;
      }

      // Handle dietary preference commands
      if (command === 'show vegetarian only' || command === 'show veg only') {
        if (!showVegOnly) {
          setShowVegOnly(true);
          speak('Showing vegetarian items only');
        } else {
          speak('Already showing vegetarian items only');
        }
        return;
      }

      if (command === 'show all items' || command === 'show everything') {
        if (showVegOnly) {
          setShowVegOnly(false);
          speak('Showing all items');
        } else {
          speak('Already showing all items');
        }
        return;
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand);
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand);
  }, [mode, speak, showVegOnly, handleSearch, handleTabChange]);

  // Announce initial page load with more context
  useEffect(() => {
    if (mode === 'voice') {
      const itemCount = activeTab === 'restaurants' ? filteredRestaurants.length : filteredFoods.length;
      const message = `Welcome to the home page. Currently showing ${itemCount} ${activeTab}. ${
        showVegOnly ? 'Filtered to show vegetarian items only. ' : ''
      }You can search, filter by type, or say help for more options.`;
      speak(message);
    }
  }, [mode, activeTab, filteredRestaurants.length, filteredFoods.length, showVegOnly, speak]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden glass-effect p-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10" />
        <h1 className="text-4xl font-bold mb-4 gradient-text">
          Discover Amazing Food
        </h1>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-full glass-effect border-none focus:ring-2 focus:ring-primary"
            aria-label="Search restaurants and foods"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4" role="tablist" aria-label="View options">
          <button
            role="tab"
            aria-selected={activeTab === 'restaurants'}
            onClick={() => handleTabChange('restaurants')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'restaurants'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Restaurants
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'foods'}
            onClick={() => handleTabChange('foods')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'foods'
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Foods
          </button>
        </div>
        <button
          onClick={handleVegFilter}
          aria-pressed={showVegOnly}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            showVegOnly ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Leaf className="h-4 w-4" />
          Veg Only
        </button>
      </div>

      {/* Content */}
      <div 
        role="tabpanel" 
        aria-label={`${activeTab} list`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activeTab === 'restaurants' ? (
          filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 p-4">
              No restaurants found. Try a different search.
            </p>
          )
        ) : (
          filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 p-4">
              No food items found. Try a different search.
            </p>
          )
        )}
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="glass-effect rounded-2xl overflow-hidden hover-glow transition-transform duration-300 hover:scale-[1.02]"
      aria-label={`View menu for ${restaurant.name}, ${restaurant.cuisine} restaurant`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {restaurant.isVeg && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Pure Veg
            </span>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="px-3 py-1 rounded-full text-sm bg-white/90 text-gray-800">
            {restaurant.cuisine}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold gradient-text">{restaurant.name}</h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">{restaurant.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{restaurant.distance} km</span>
          </div>
        </div>

        {restaurant.tags && (
          <div className="flex flex-wrap gap-2">
            {restaurant.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{restaurant.priceRange}</span>
          <span className="text-primary font-medium flex items-center">
            View Menu
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FoodCard({ food }: { food: MenuItem }) {
  const navigate = useNavigate();
  const { addItemToCart } = useCartStore();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to item details
    
    addItemToCart(food, 1);
    
    // Provide appropriate feedback based on user mode
    if (mode === 'voice') {
      speak(`Added ${food.name} to your cart.`);
    }
    
    toast.success(`Added ${food.name} to cart`, {
      description: '1 item added to your cart',
      icon: <ShoppingCart className="h-5 w-5" />
    });
  };
  
  return (
    <div 
      onClick={() => navigate(`/item/${food.id}`)}
      className="glass-effect rounded-2xl overflow-hidden hover-glow transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
      aria-label={`${food.name}. ${food.isVeg ? 'Vegetarian. ' : ''} Price: ${food.price} rupees. ${food.description}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {food.isVeg && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center gap-1">
              <Leaf className="h-4 w-4" />
              Veg
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold gradient-text">{food.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">₹{food.price}</span>
          <button 
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
            aria-label={`Add ${food.name} to cart for ${food.price} rupees`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}