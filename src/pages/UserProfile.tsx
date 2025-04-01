import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Edit, Check, Phone, Mail, ChevronDown, ChevronUp, ArrowLeft, Pencil, X, CreditCard, Wallet } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useProfileStore } from '../store/profileStore';

// Define a mock order type
interface Order {
  id: string;
  date: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  status: 'delivered' | 'processing' | 'cancelled';
  deliveryAddress: string;
  paymentMethod: string;
}

export function UserProfile() {
  const navigate = useNavigate();
  const { mode } = useAccessibilityStore();
  const { speak } = useSpeechSynthesis();
  const profile = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    pinCode: profile.pinCode
  });
  const [cardData, setCardData] = useState({
    cardNumber: profile.cardDetails.cardNumber,
    nameOnCard: profile.cardDetails.nameOnCard,
    expiry: profile.cardDetails.expiry,
    cvv: profile.cardDetails.cvv
  });
  const [upiData, setUpiData] = useState({
    upiId: profile.upiId
  });
  
  // State for user information
  const [addresses, setAddresses] = useState<string[]>(['123 Main St, City']);
  const [activeAddress, setActiveAddress] = useState(0);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // State for order history
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Provide audio feedback for screen reader users
  useEffect(() => {
    if (mode === 'voice') {
      speak('User profile page loaded. Here you can manage your account details and view your order history.');
    }
  }, [mode, speak]);
  
  // Mock data for order history (in a real app, this would come from an API)
  useEffect(() => {
    // Simulate API call to get order history
    const timer = setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          date: '2023-10-15',
          total: 699,
          items: [
            { id: '17', name: 'Karimeen Pollichathu', quantity: 1, price: 499 },
            { id: '18', name: 'Puttu and Kadala Curry', quantity: 1, price: 249 }
          ],
          status: 'delivered',
          deliveryAddress: 'Apartment 4B, Skyline Heights, Palayam, Trivandrum',
          paymentMethod: 'UPI'
        },
        {
          id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          date: '2023-09-28',
          total: 548,
          items: [
            { id: '25', name: 'Malabar Fish Curry', quantity: 1, price: 429 },
            { id: '24', name: 'Pazham Pori', quantity: 1, price: 149 }
          ],
          status: 'delivered',
          deliveryAddress: 'Apartment 4B, Skyline Heights, Palayam, Trivandrum',
          paymentMethod: 'Cash on Delivery'
        }
      ];
      
      setOrderHistory(mockOrders);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpiData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    profile.updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveCard = () => {
    profile.updateCardDetails(cardData);
    setIsEditingCard(false);
    toast.success('Card details updated successfully');
  };

  const handleSaveUpi = () => {
    profile.updateUpiDetails(upiData.upiId);
    setIsEditingUpi(false);
    toast.success('UPI details updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      pinCode: profile.pinCode
    });
    setIsEditing(false);
  };

  const handleCancelCard = () => {
    setCardData({
      cardNumber: profile.cardDetails.cardNumber,
      nameOnCard: profile.cardDetails.nameOnCard,
      expiry: profile.cardDetails.expiry,
      cvv: profile.cardDetails.cvv
    });
    setIsEditingCard(false);
  };

  const handleCancelUpi = () => {
    setUpiData({
      upiId: profile.upiId
    });
    setIsEditingUpi(false);
  };
  
  const handleSaveAddress = () => {
    // Simulate API call to update address
    const timer = setTimeout(() => {
      toast.success('Address updated successfully!');
      setIsEditingAddress(false);
      
      // Provide audio feedback
      if (mode === 'voice') {
        speak('Address updated successfully!');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  };
  
  const handleAddAddress = () => {
    setAddresses([...addresses, '']);
    setActiveAddress(addresses.length);
    setIsEditingAddress(true);
    
    // Provide audio feedback
    if (mode === 'voice') {
      speak('Adding a new address. Please fill in the details.');
    }
  };
  
  const handleOrderClick = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    
    // Provide audio feedback
    if (mode === 'voice') {
      const order = orderHistory.find(o => o.id === orderId);
      speak(`Order ${orderId} details. Total amount ${order?.total} rupees. Status ${order?.status}`);
    }
  };
  
  // Format date in a user-friendly way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handlePaymentMethodChange = (method: 'card' | 'upi' | 'cash') => {
    profile.setPreferredPayment(method);
    toast.success('Payment preference updated');
  };
  
  return (
    <>
      <Helmet>
        <title>My Profile - AblEats</title>
        <meta name="description" content="View and edit your profile information" />
      </Helmet>
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          aria-label="Go back to home page"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Back to Home</span>
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8 gradient-text">My Profile</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1">
              <div className="glass-effect p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Account Details
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                      aria-label="Edit profile"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        className="flex items-center text-green-600 hover:text-green-500"
                        aria-label="Save changes"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center text-red-600 hover:text-red-500"
                        aria-label="Cancel editing"
                      >
                        <X className="h-5 w-5 mr-2" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your city"
                    />
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your PIN code"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
              
              {/* Card Details Section */}
              <div className="glass-effect p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold gradient-text">Card Details</h2>
                  </div>
                  {!isEditingCard ? (
                    <button
                      onClick={() => setIsEditingCard(true)}
                      className="flex items-center text-primary hover:text-primary/80"
                      aria-label="Edit card details"
                    >
                      <Pencil className="h-5 w-5 mr-2" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSaveCard}
                        className="flex items-center text-green-600 hover:text-green-500"
                        aria-label="Save card changes"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelCard}
                        className="flex items-center text-red-600 hover:text-red-500"
                        aria-label="Cancel card editing"
                      >
                        <X className="h-5 w-5 mr-2" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      disabled={!isEditingCard}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="nameOnCard"
                      name="nameOnCard"
                      value={cardData.nameOnCard}
                      onChange={handleCardInputChange}
                      disabled={!isEditingCard}
                      className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                               focus:ring-2 focus:ring-primary focus:border-transparent
                               disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardInputChange}
                        disabled={!isEditingCard}
                        className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                                 focus:ring-2 focus:ring-primary focus:border-transparent
                                 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        disabled={!isEditingCard}
                        className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                                 focus:ring-2 focus:ring-primary focus:border-transparent
                                 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="***"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="glass-effect p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-semibold gradient-text">Payment Methods</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={profile.preferredPayment === 'card'}
                        onChange={() => handlePaymentMethodChange('card')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Card Payment</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={profile.preferredPayment === 'upi'}
                        onChange={() => handlePaymentMethodChange('upi')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>UPI</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={profile.preferredPayment === 'cash'}
                        onChange={() => handlePaymentMethodChange('cash')}
                        className="text-primary focus:ring-primary"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>

                  {profile.preferredPayment === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-700">UPI Details</h3>
                        {!isEditingUpi ? (
                          <button
                            onClick={() => setIsEditingUpi(true)}
                            className="flex items-center text-primary hover:text-primary/80"
                            aria-label="Edit UPI details"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <div className="flex space-x-4">
                            <button
                              onClick={handleSaveUpi}
                              className="flex items-center text-green-600 hover:text-green-500"
                              aria-label="Save UPI changes"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={handleCancelUpi}
                              className="flex items-center text-red-600 hover:text-red-500"
                              aria-label="Cancel UPI editing"
                            >
                              <X className="h-4 w-4 mr-2" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          value={upiData.upiId}
                          onChange={handleUpiInputChange}
                          disabled={!isEditingUpi}
                          className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                                   focus:ring-2 focus:ring-primary focus:border-transparent
                                   disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="username@upi"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Addresses Section */}
              <div className="glass-effect p-6 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Delivery Addresses
                  </h2>
                  <button 
                    onClick={() => isEditingAddress ? handleSaveAddress() : setIsEditingAddress(true)}
                    className="text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                    aria-label={isEditingAddress ? "Save address changes" : "Edit delivery address"}
                  >
                    {isEditingAddress ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Edit className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {addresses.map((address, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg mb-3 ${activeAddress === index ? 'border-2 border-primary bg-primary/5' : 'border border-gray-200'}`}
                  >
                    {isEditingAddress && activeAddress === index ? (
                      <div>
                        <textarea
                          value={address}
                          onChange={(e) => {
                            const newAddresses = [...addresses];
                            newAddresses[index] = e.target.value;
                            setAddresses(newAddresses);
                          }}
                          className="block w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 
                                   focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="Enter delivery address"
                          rows={3}
                        />
                      </div>
                    ) : (
                      <div 
                        className="flex items-start cursor-pointer"
                        onClick={() => {
                          setActiveAddress(index);
                          if (isEditingAddress) {
                            setIsEditingAddress(false);
                          }
                        }}
                      >
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">{address || "Add a new address"}</p>
                          {activeAddress === index && (
                            <span className="text-xs text-primary font-medium mt-1 inline-block">
                              Default delivery address
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={handleAddAddress}
                  className="w-full py-2 mt-3 border border-gray-300 rounded-lg text-gray-700 
                           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Add a new delivery address"
                >
                  + Add New Address
                </button>
              </div>
            </div>
            
            {/* Right Column - Order History */}
            <div className="lg:col-span-2">
              <div className="glass-effect p-6 rounded-xl">
                <h2 className="text-xl font-semibold flex items-center mb-6">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  Order History
                </h2>
                
                {orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="p-4 flex flex-wrap items-center justify-between cursor-pointer hover:bg-gray-50"
                          onClick={() => handleOrderClick(order.id)}
                          role="button"
                          aria-expanded={expandedOrder === order.id}
                          aria-controls={`order-details-${order.id}`}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="font-medium">₹{order.total.toFixed(2)}</p>
                            {expandedOrder === order.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        {expandedOrder === order.id && (
                          <div 
                            id={`order-details-${order.id}`}
                            className="p-4 border-t border-gray-200 bg-gray-50"
                          >
                            <div className="space-y-3">
                              <h3 className="font-medium text-sm text-gray-700">Order Items</h3>
                              
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span className="flex-1">{item.quantity}x {item.name}</span>
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between font-medium">
                                  <span>Total</span>
                                  <span>₹{order.total.toFixed(2)}</span>
                                </div>
                              </div>
                              
                              <div className="pt-3 border-t border-gray-200 text-sm">
                                <p className="mb-1">
                                  <span className="font-medium">Delivery Address:</span> {order.deliveryAddress}
                                </p>
                                <p>
                                  <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                                </p>
                              </div>
                              
                              <div className="pt-3 flex justify-end">
                                <button
                                  onClick={() => {
                                    // Navigate to a hypothetical re-order functionality
                                    toast.info("Reorder functionality would be implemented here.");
                                    
                                    // Provide audio feedback
                                    if (mode === 'voice') {
                                      speak('Reordering this order. Adding items to cart.');
                                    }
                                  }}
                                  className="px-4 py-2 rounded-lg bg-primary text-white font-medium 
                                           hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                  aria-label={`Reorder items from order ${order.id}`}
                                >
                                  Reorder
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500">When you place orders, they will appear here.</p>
                    <button
                      onClick={() => navigate('/home')}
                      className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-medium 
                               hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Start ordering food"
                    >
                      Start Ordering
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
} 