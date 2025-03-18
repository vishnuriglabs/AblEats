import { Restaurant, MenuItem } from '../types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: '5',
    name: 'Malabar Cafe',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/27/31/2c/f6/interior.jpg',
    cuisine: 'Kerala',
    rating: 4.7,
    deliveryTime: '25-35',
    priceRange: '₹₹',
    address: 'Palayam, Trivandrum',
    isVeg: false,
    description: 'Authentic Kerala cuisine in a cozy atmosphere. Specializing in traditional Malabar dishes with a modern twist.',
    distance: 2.5,
    tags: ['Seafood', 'Spicy', 'Local Favorite']
  },
  {
    id: '6',
    name: 'Travancore Heritage',
    image: 'https://www.keralatourism.org/images/service-providers/photos/property-2453-profile-11105-20180831101508.jpg',
    cuisine: 'South Indian',
    rating: 4.8,
    deliveryTime: '30-40',
    priceRange: '₹₹₹',
    address: 'Kovalam, Trivandrum',
    isVeg: false,
    description: 'Experience the royal cuisine of Travancore with authentic recipes passed down through generations.',
    distance: 3.7,
    tags: ['Royal Cuisine', 'Premium Dining', 'Beachside']
  },
  {
    id: '7',
    name: 'Sadhya House',
    image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/495054785.jpg?k=ad2a9eaaf4e8e1bf0b2896beabf81c896374bf134ca8dd4394dde3c007de5b2c&o=&hp=1',
    cuisine: 'Traditional Kerala',
    rating: 4.9,
    deliveryTime: '35-45',
    priceRange: '₹₹',
    address: 'Pattom, Trivandrum',
    isVeg: true,
    description: 'Kerala\'s premier vegetarian restaurant specializing in traditional Sadhya (feast) served on banana leaf.',
    distance: 1.8,
    tags: ['Pure Veg', 'Feast', 'Traditional']
  },
  {
    id: '8',
    name: 'Seafood Harbor',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/6e/38/46/hong-kong-saigon-seafood.jpg?w=900&h=500&s=1',
    cuisine: 'Seafood',
    rating: 4.6,
    deliveryTime: '30-40',
    priceRange: '₹₹₹',
    address: 'Shanghumugham, Trivandrum',
    isVeg: false,
    description: 'Fresh seafood restaurant offering the catch of the day prepared in traditional Kerala style recipes.',
    distance: 4.2,
    tags: ['Seafood', 'Beachside', 'Fresh Catch']
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Malabar Cafe (id: '5') Menu Items
  {
    id: '17',
    name: 'Karimeen Pollichathu',
    description: 'Pearl spot fish marinated in spices and wrapped in banana leaf',
    price: 499,
    image: 'https://somethingiscooking.com/wp-content/uploads/2019/04/meen-2.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '5'
  },
  {
    id: '18',
    name: 'Puttu and Kadala Curry',
    description: 'Steamed rice cake served with black chickpea curry',
    price: 249,
    image: 'https://img-global.cpcdn.com/recipes/4e92699af5e8dd17/1200x630cq70/photo.jpg',
    category: 'Breakfast',
    isVeg: true,
    restaurantId: '5'
  },
  {
    id: '21',
    name: 'Idiyappam with Egg Curry',
    description: 'String hoppers served with spicy egg curry',
    price: 279,
    image: 'https://img-global.cpcdn.com/recipes/dfcd0a96adac73db/1200x630cq70/photo.jpg',
    category: 'Breakfast',
    isVeg: false,
    restaurantId: '5'
  },
  {
    id: '25',
    name: 'Malabar Fish Curry',
    description: 'Spicy fish curry cooked with special Malabar spices and coconut',
    price: 429,
    image: 'https://currynwok.com/wp-content/uploads/2023/09/Fish-curry-Malabar-scaled.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '5'
  },
  {
    id: '26',
    name: 'Kozhi Porichathu',
    description: 'Kerala style fried chicken marinated with spices',
    price: 369,
    image: 'https://luv4foodntravel.com/wp-content/uploads/2023/04/ChickenFry-9.jpg',
    category: 'Starters',
    isVeg: false,
    restaurantId: '5'
  },
  {
    id: '27',
    name: 'Nadan Beef Curry',
    description: 'Traditional Kerala beef curry slow-cooked with spices',
    price: 399,
    image: 'https://i.ytimg.com/vi/76AEtKLuY9c/maxresdefault.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '5'
  },
  {
    id: '28',
    name: 'Porotta',
    description: 'Flaky layered flatbread, perfect with curry',
    price: 30,
    image: 'https://sc0.blr1.cdn.digitaloceanspaces.com/article/135587-exvwaboqcd-1580388178.jpg',
    category: 'Breads',
    isVeg: true,
    restaurantId: '5'
  },
  {
    id: '29',
    name: 'Chilli Parotta',
    description: 'Torn porotta tossed with spicy chilli sauce and vegetables',
    price: 249,
    image: 'https://i.ytimg.com/vi/F-w9muVX5Qw/maxresdefault.jpg',
    category: 'Main Course',
    isVeg: true,
    restaurantId: '5'
  },
  
  // Travancore Heritage (id: '6') Menu Items
  {
    id: '23',
    name: 'Thalassery Biryani',
    description: 'Fragrant rice cooked with spices and meat, Kerala style',
    price: 399,
    image: 'https://i0.wp.com/kalimirchbysmita.com/wp-content/uploads/2016/08/Thalaserry-Chicken-Biryani-02-1024x667.jpg',
    category: 'Biryani',
    isVeg: false,
    restaurantId: '6'
  },
  {
    id: '24',
    name: 'Pazham Pori',
    description: 'Ripe banana fritters, a popular Kerala snack',
    price: 149,
    image: 'https://t4.ftcdn.net/jpg/03/58/52/69/360_F_358526911_C9N0C5zcKjnImXmWHm9ZmulkFnVvVvuY.jpg',
    category: 'Snacks',
    isVeg: true,
    restaurantId: '6'
  },
  {
    id: '30',
    name: 'Appam with Chicken Stew',
    description: 'Lacy rice hoppers served with creamy chicken stew',
    price: 329,
    image: 'https://i.ytimg.com/vi/6cq8jaEnYYI/hq720.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '6'
  },
  {
    id: '31',
    name: 'Mutton Ishtu',
    description: 'Kerala style mutton stew cooked with coconut milk and spices',
    price: 399,
    image: 'https://i.ytimg.com/vi/DQ27-1cNj-A/maxresdefault.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '6'
  },
  {
    id: '32',
    name: 'Meen Varuthathu',
    description: 'Traditional fried fish marinated with spices',
    price: 349,
    image: 'https://www.archanaskitchen.com/images/archanaskitchen/1-Author/rekha_v/MEEN_VARUTHATHU__FISH_FRY__KERALA_STYLE.jpg',
    category: 'Starters',
    isVeg: false,
    restaurantId: '6'
  },
  {
    id: '33',
    name: 'Kadala Curry',
    description: 'Spicy black chickpea curry cooked in coconut gravy',
    price: 229,
    image: 'https://www.nirapara.com/image/recipies/Varutharacha%20Kadala%20Curry%20%20/1615005194imagern4308.jpg',
    category: 'Main Course',
    isVeg: true,
    restaurantId: '6'
  },
  {
    id: '34',
    name: 'Travancore Chicken Roast',
    description: 'Specialty chicken roast prepared with royal Travancore spices',
    price: 379,
    image: 'https://i0.wp.com/www.pepperdelight.com/wp-content/uploads/2016/07/pepper-delight-dry-roasted-chicken-4.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '6'
  },
  {
    id: '35',
    name: 'Kerala Prawn Curry',
    description: 'Prawns cooked in a tangy coconut curry with kudampuli',
    price: 399,
    image: 'https://images.sbs.com.au/dims4/default/e5bfe32/2147483647/strip/true/crop/899x506+0+489/resize/1280x720!/quality/90/?url=http%3A%2F%2Fsbs-au-brightspot.s3.amazonaws.com%2Fdrupal%2Ffood%2Fpublic%2FSBS1211_p54.jpg',
    category: 'Main Course',
    isVeg: false,
    restaurantId: '6'
  },

  // Sadhya House (id: '7') Menu Items
  {
    id: '20',
    name: 'Kerala Sadya',
    description: 'Traditional feast with rice and variety of vegetarian dishes',
    price: 399,
    image: 'https://static.india.com/wp-content/uploads/2017/09/Onam-Sadhya.jpg',
    category: 'Traditional',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '22',
    name: 'Avial',
    description: 'Mixed vegetables cooked with coconut and yogurt',
    price: 249,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ayiyal.jpg/640px-Ayiyal.jpg',
    category: 'Traditional',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '36',
    name: 'Sambar',
    description: 'Lentil-based vegetable stew cooked with tamarind and aromatic spices',
    price: 199,
    image: 'https://nuty.in/cdn/shop/articles/nuty-south-indian-sambar_1920x500@2x.jpg?v=1698561613',
    category: 'Traditional',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '37',
    name: 'Olan',
    description: 'Subtle and delicious curry made from white pumpkin and black-eyed peas',
    price: 229,
    image: 'https://www.yummytummyaarthi.com/wp-content/uploads/2020/09/1-4.jpg',
    category: 'Traditional',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '38',
    name: 'Thoran',
    description: 'Stir-fried vegetables with coconut and spices',
    price: 199,
    image: 'https://mozismenu.com/wp-content/uploads/2017/03/Cabbage-Thoran_M-0.jpg',
    category: 'Side Dish',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '39',
    name: 'Parippu Curry',
    description: 'Dal curry made with coconut milk, a staple in Kerala cuisine',
    price: 179,
    image: 'https://www.archanaskitchen.com//images/archanaskitchen/Indian_Dal_Khadi_Curry/Sadya_Parippu_Recipe_Kerala_Style_Lentils_Onam_Festival_-1.jpg',
    category: 'Traditional',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '40',
    name: 'Puli Inji',
    description: 'Sweet, sour and spicy ginger chutney',
    price: 129,
    image: 'https://aahaaramonline.com/wp-content/uploads/2014/04/Puli_Inji.jpg',
    category: 'Side Dish',
    isVeg: true,
    restaurantId: '7'
  },
  {
    id: '41',
    name: 'Pachadi',
    description: 'Yogurt-based side dish with vegetables and coconut',
    price: 179,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn698Pxmx0Rdgnn7pZ1Rb8ek0c0lpjO6bi_g&s',
    category: 'Side Dish',
    isVeg: true,
    restaurantId: '7'
  },

  // Seafood Harbor (id: '8') Menu Items
  {
    id: '19',
    name: 'Prawn Mango Curry',
    description: 'Prawns cooked in tangy mango and coconut gravy',
    price: 449,
    image: 'https://realfood.tesco.com/media/images/D42-Thai-LH-2b52b105-648a-43aa-b358-81643a3d925a-0-1400x919.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '42',
    name: 'Crab Roast',
    description: 'Fresh crab cooked in spicy masala',
    price: 549,
    image: 'https://www.indrani-will-teach.com/wp-content/uploads/2022/11/crab.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '43',
    name: 'Squid Pepper Fry',
    description: 'Tender squid rings stir-fried with black pepper and spices',
    price: 399,
    image: 'https://i.ytimg.com/vi/sRt2-cMpHNc/hq720.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '44',
    name: 'Lobster Thermidor',
    description: 'Lobster cooked with creamy sauce and topped with cheese',
    price: 999,
    image: 'https://niammy.com/img/public/593/201711/1511852899_30988.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '45',
    name: 'Fish Molee',
    description: 'Fish cooked in a mildly spiced coconut milk curry',
    price: 399,
    image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/malaysian-style_fish_67115_16x9.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '46',
    name: 'Prawn Masala',
    description: 'Prawns cooked in spicy onion tomato gravy',
    price: 429,
    image: 'https://i.ytimg.com/vi/SxUKfbLcSsk/maxresdefault.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '47',
    name: 'Seafood Platter',
    description: 'Assortment of grilled and fried seafood including prawns, fish and squid',
    price: 799,
    image: 'https://images.slurrp.com/prod/recipe_images/taste/easy-seafood-platter-recipe-1619717571_DNMHVHETUW85LDSIHJYO.webp',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  },
  {
    id: '48',
    name: 'Fish Tandoori',
    description: 'Fish marinated with spices and cooked in tandoor',
    price: 449,
    image: 'https://www.awesomecuisine.com/wp-content/uploads/2009/10/tandoori-pomfret.jpg',
    category: 'Seafood',
    isVeg: false,
    restaurantId: '8'
  }
];