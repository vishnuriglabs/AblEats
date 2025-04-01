import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      <header className="glass-effect sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            to="/home" 
            className="flex items-center space-x-2 gradient-text font-bold text-xl hover-glow"
            aria-label="AblEats Home"
          >
            <UtensilsCrossed className="h-6 w-6" />
            <span>AblEats</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/profile"
              className="p-2 text-gray-600 hover:text-primary transition-colors hover-glow"
              aria-label="User Profile"
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              to="/cart"
              className="p-2 text-gray-600 hover:text-primary transition-colors hover-glow"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="glass-effect mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2025 AblEats. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}