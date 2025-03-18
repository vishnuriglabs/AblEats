import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Leaf, Clock, Star, MapPin } from 'lucide-react';
import { MENU_ITEMS, RESTAURANTS } from '../data/mockData';
import { toast } from 'sonner';
import { useCartStore } from '../store/cartStore';

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const item = MENU_ITEMS.find(item => item.id === id);
  // Check if the restaurant exists in the RESTAURANTS array
  const restaurant = item ? RESTAURANTS.find(r => r.id === item.restaurantId) : null;

  if (!item) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Item not found</h2>
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div>
    );
  }

  // If restaurant is not found, we'll still show the item but with limited info
  const restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';
  const restaurantInfo = restaurant || {
    rating: '4.0',
    deliveryTime: '30-40',
    address: 'Location not available',
    cuisine: 'Various',
    priceRange: '₹₹'
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity
    };
    
    useCartStore.getState().addItem(cartItem);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary mb-8"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          {item.isVeg && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center gap-1">
                <Leaf className="h-4 w-4" />
                Veg
              </span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{item.name}</h1>
            <p className="text-xl text-gray-600">{item.description}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400" />
              <span>{restaurantInfo.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-5 w-5 text-gray-400" />
              <span>{restaurantInfo.deliveryTime} mins</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{restaurantInfo.address}</span>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">₹{item.price}</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary 
                       text-white font-medium hover:opacity-90 transition-opacity"
            >
              Add to Cart - ₹{(item.price * quantity).toFixed(2)}
            </button>
          </div>

          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">From {restaurantName}</h3>
            <p className="text-gray-600">{restaurantInfo.cuisine} • {restaurantInfo.priceRange}</p>
          </div>

          {/* Nutritional Info (placeholder) */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Nutritional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Calories</p>
                <p className="font-medium">350 kcal</p>
              </div>
              <div>
                <p className="text-gray-600">Protein</p>
                <p className="font-medium">12g</p>
              </div>
              <div>
                <p className="text-gray-600">Carbohydrates</p>
                <p className="font-medium">45g</p>
              </div>
              <div>
                <p className="text-gray-600">Fat</p>
                <p className="font-medium">15g</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}