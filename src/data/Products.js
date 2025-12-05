// Local fallback sample products used when API returns none
const products = [
  {
    _id: "local-veg-tomato-1",
    name: "Organic Tomatoes (1kg)",
    category: { name: "Vegetables" },
    price: 80,
    unit: "kg",
    images: [
      "https://images.unsplash.com/photo-1547514701-9cdcb1f5942a?q=80&w=1200&auto=format&fit=crop"
    ],
    isOrganic: true,
    createdAt: "2025-07-01",
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    cropType: "perishable",
    farmer: {
      name: "Ram Singh",
      location: { lat: 28.6139, lng: 77.2090 } // Delhi coordinates
    }
  },
  {
    _id: "local-grain-rice-1",
    name: "Basmati Rice (5kg)",
    category: { name: "Grains & Cereals" },
    price: 520,
    unit: "5kg",
    images: [
      "https://images.unsplash.com/photo-1615485737651-6cfb3f1c4d73?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-02",
    harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    cropType: "non-perishable",
    farmer: {
      name: "Priya Sharma",
      location: { lat: 19.0760, lng: 72.8777 } // Mumbai coordinates
    }
  },
  {
    _id: "local-veg-spinach-1",
    name: "Fresh Spinach (500g)",
    category: { name: "Vegetables" },
    price: 40,
    unit: "500g",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-03",
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    cropType: "perishable",
    farmer: {
      name: "Suresh Kumar",
      location: { lat: 12.9716, lng: 77.5946 } // Bangalore coordinates
    }
  },
  {
    _id: "local-fruit-mango-1",
    name: "Alphonso Mangoes (Dozen)",
    category: { name: "Fruits" },
    price: 600,
    unit: "dozen",
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d0a01f0f5fb?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-04",
    harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    cropType: "semi-perishable",
    farmer: {
      name: "Anjali Devi",
      location: { lat: 25.3176, lng: 82.9739 } // Varanasi coordinates
    }
  },
  {
    _id: "local-grain-rice-2",
    name: "Brown Rice (2kg)",
    category: { name: "Grains & Cereals" },
    price: 180,
    unit: "2kg",
    images: [
      "https://images.unsplash.com/photo-1615485737651-6cfb3f1c4d73?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-05",
    harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    cropType: "non-perishable",
    farmer: {
      name: "Mohan Singh",
      location: { lat: 26.9124, lng: 75.7873 } // Jaipur coordinates
    }
  },
  {
    _id: "local-pulse-moong-1",
    name: "Green Moong Dal (1kg)",
    category: { name: "Pulses & Legumes" },
    price: 120,
    unit: "1kg",
    images: [
      "https://images.unsplash.com/photo-1604908553833-90a55338183b?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-05",
    harvestDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    cropType: "non-perishable",
    farmer: {
      name: "Priya Sharma",
      location: { lat: 19.0760, lng: 72.8777 } // Mumbai coordinates
    }
  },
  {
    _id: "local-veg-onion-1",
    name: "Red Onions (1kg)",
    category: { name: "Vegetables" },
    price: 45,
    unit: "kg",
    images: [
      "/red-onion.jpg"
    ],
    createdAt: "2025-07-06",
    harvestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    cropType: "semi-perishable",
    farmer: {
      name: "Kavita Patel",
      location: { lat: 23.0225, lng: 72.5714 } // Ahmedabad coordinates
    }
  },
  {
    _id: "local-fruit-banana-1",
    name: "Bananas (1kg)",
    category: { name: "Fruits" },
    price: 55,
    unit: "kg",
    images: [
      "/banana.jpg"
    ],
    createdAt: "2025-07-07",
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    cropType: "perishable",
    farmer: {
      name: "Rajesh Kumar",
      location: { lat: 28.6139, lng: 77.2090 } // Delhi coordinates (near user)
    }
  },
  {
    _id: "local-veg-carrot-1",
    name: "Carrots (1kg)",
    category: { name: "Vegetables" },
    price: 50,
    unit: "kg",
    images: [
      "/carrots.jpg"
    ],
    createdAt: "2025-07-08",
    harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    cropType: "semi-perishable",
    farmer: {
      name: "Sunita Devi",
      location: { lat: 28.6139, lng: 77.2090 } // Delhi coordinates (near user)
    }
  },
  {
    _id: "local-fruit-papaya-1",
    name: "Fresh Papaya (1kg)",
    category: { name: "Fruits" },
    price: 60,
    unit: "kg",
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d0a01f0f5fb?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-09",
    harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    cropType: "perishable",
    farmer: {
      name: "Vikram Singh",
      location: { lat: 12.9716, lng: 77.5946 } // Bangalore coordinates
    }
  },
  {
    _id: "local-grain-wheat-1",
    name: "Whole Wheat Flour (2kg)",
    category: { name: "Grains & Cereals" },
    price: 160,
    unit: "2kg",
    images: [
      "https://images.unsplash.com/photo-1615485737651-6cfb3f1c4d73?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-10",
    harvestDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    cropType: "non-perishable",
    farmer: {
      name: "Rajesh Kumar",
      location: { lat: 28.6139, lng: 77.2090 } // Delhi coordinates
    }
  },
  {
    _id: "local-pulse-toor-1",
    name: "Toor Dal (1kg)",
    category: { name: "Pulses & Legumes" },
    price: 140,
    unit: "1kg",
    images: [
      "https://images.unsplash.com/photo-1604908553833-90a55338183b?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-11",
    harvestDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), // 50 days ago
    cropType: "non-perishable",
    farmer: {
      name: "Anjali Devi",
      location: { lat: 25.3176, lng: 82.9739 } // Varanasi coordinates
    }
  }
];

export default products;
