# AblEats 🍽️

AblEats is an accessible food delivery platform designed to provide a seamless ordering experience for **all users, including those with disabilities**. Built with React, TypeScript, and modern web technologies, AblEats focuses on inclusive design while offering a beautiful UI and robust functionality.

![AblEats Logo](https://i.imgur.com/SdLG7cS.png)

## ✨ Features

### 🎯 Accessibility-First Design

- **Voice Feedback**: Built-in screen reader support with context-aware announcements
- **Keyboard Navigation**: Fully accessible via keyboard inputs
- **ARIA Attributes**: Semantic HTML and ARIA roles throughout the application
- **High Contrast**: Visual elements designed for users with visual impairments
- **User Mode Switch**: Toggle between voice, visual, and standard modes

### 🛒 Shopping Experience

- **Restaurant Discovery**: Browse restaurants with detailed information
- **Menu Exploration**: View categorized menu items with images and descriptions
- **Cart Management**: Add, remove, and update quantities in your cart
- **Checkout Process**: Smooth, accessible checkout with multiple payment options
- **Order Confirmation**: Clear confirmations with order details and status updates

### 👤 User Management

- **User Profiles**: Manage personal details and preferences
- **Multiple Addresses**: Save and manage delivery locations
- **Order History**: Track past orders with complete details
- **Reordering**: Easily reorder previous meals with one click

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Zustand for global state
- **Styling**: TailwindCSS with custom utilities
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Accessibility**: Custom hooks for speech synthesis and recognition
- **Build Tool**: Vite

## 📱 User Interface

AblEats features a modern, responsive UI that works across devices while maintaining full accessibility:

- **Glass-effect Components**: Beautiful translucent elements 
- **Motion Feedback**: Subtle animations provide visual feedback
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Dark/Light Modes**: Color schemes for different lighting conditions

## 📋 Pages

1. **Welcome Page**: Introduction and authentication
2. **Home Page**: Restaurant discovery and featured items
3. **Restaurant Details**: Restaurant information and menu items
4. **Item Details**: Detailed item information and customization
5. **Cart Page**: Review selected items and proceed to checkout
6. **Checkout Page**: Payment options and delivery details
7. **Order Success**: Confirmation of successful order placement
8. **User Profile**: Account management and order history

## 🔧 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ableats.git

# Navigate to project directory
cd ableats

# Install dependencies
npm install
# or
yarn

# Start development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

## 🌟 Accessibility Features in Detail

AblEats implements a variety of accessibility features to ensure everyone can use the platform:

### Audio Feedback

- **Voice Announcements**: Real-time announcements of actions and page changes
- **Order Status**: Audio confirmation of order placement and status changes
- **Error Notifications**: Clear audio feedback for errors and required actions

### Visual Accessibility

- **High Contrast Mode**: Enhanced visual contrast for text and UI elements
- **Large Text Support**: Responsive to system text size settings
- **Focus Indicators**: Clear visual indicators for focused elements
- **Consistent Layout**: Predictable navigation patterns across the app

### Input Methods

- **Keyboard Navigation**: Complete functionality without requiring a mouse
- **Voice Commands**: Support for basic navigation through voice inputs
- **Touch Optimization**: Large touch targets for easier mobile interaction

## 📱 Responsive Design

- **Mobile-First**: Optimized for small screens with adaptive layouts
- **Tablet Support**: Enhanced layouts for medium-sized screens
- **Desktop Experience**: Full-featured experience on larger screens
- **Print Styles**: Optimized formatting for printed order details

## 🔜 Roadmap

- [ ] Voice-based ordering through conversational UI
- [ ] Real-time order tracking with live updates
- [ ] Dietary restriction filtering
- [ ] Personalized recommendations based on order history
- [ ] Social features for group ordering

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Kerala cuisine restaurant data
- Food images courtesy of various Kerala cuisine resources
- All the contributors who made this project possible

---

Built with ❤️ for accessibility and inclusion