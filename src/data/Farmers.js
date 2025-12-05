// Sample farmer data with comprehensive profiles for demonstration
const farmers = [
  {
    _id: "farmer-ram-singh-1",
    name: "Ram Singh",
    email: "ram.singh@haritkranti.com",
    phone: "+91 98765 43210",
    address: {
      street: "Village Road 12",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India"
    },
    location: { lat: 28.6139, lng: 77.2090 },
    isVerified: true,
    verificationStatus: "verified",
    trustScore: 4.8,
    rating: 4.7,
    reviews: 156,
    joinDate: "2023-01-15",
    lastActive: new Date().toISOString(),
    responseTime: 2,
    profile: {
      farmName: "Singh Organic Farm",
      bio: "Third-generation farmer with 25+ years of experience in organic farming. Passionate about sustainable agriculture and providing fresh, chemical-free produce to families.",
      farmingExperience: 25,
      establishedYear: 1998,
      farmSize: 15,
      farmSizeUnit: "acres",
      region: "North India",
      farmingMethods: ["organic", "sustainable"],
      specialties: ["Organic Vegetables", "Herbs", "Microgreens"],
      cropsGrown: ["Tomatoes", "Spinach", "Carrots", "Basil", "Mint", "Coriander"],
      certifications: ["organic", "gmp"],
      awards: ["Best Organic Farmer 2023", "Sustainable Agriculture Award 2022"],
      description: "Dedicated to organic farming practices and environmental sustainability. All produce is grown without harmful chemicals and pesticides.",
      socialMedia: {
        facebook: "https://facebook.com/ram.singh.farm",
        instagram: "https://instagram.com/ram_singh_organic",
        twitter: "https://twitter.com/ram_singh_farm"
      },
      businessHours: {
        monday: { open: "06:00", close: "18:00" },
        tuesday: { open: "06:00", close: "18:00" },
        wednesday: { open: "06:00", close: "18:00" },
        thursday: { open: "06:00", close: "18:00" },
        friday: { open: "06:00", close: "18:00" },
        saturday: { open: "06:00", close: "16:00" },
        sunday: { open: "08:00", close: "14:00" }
      },
      farmingPractices: [
        "Composting and natural fertilizers",
        "Crop rotation for soil health",
        "Integrated pest management",
        "Water conservation techniques",
        "Seed saving and heirloom varieties"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
    }
  },
  {
    _id: "farmer-priya-sharma-2",
    name: "Priya Sharma",
    email: "priya.sharma@haritkranti.com",
    phone: "+91 98765 43211",
    address: {
      street: "Farm Road 5",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India"
    },
    location: { lat: 19.0760, lng: 72.8777 },
    isVerified: true,
    verificationStatus: "verified",
    trustScore: 4.9,
    rating: 4.8,
    reviews: 203,
    joinDate: "2022-08-20",
    lastActive: new Date().toISOString(),
    responseTime: 1,
    profile: {
      farmName: "Sharma Rice & Grains Farm",
      bio: "Agricultural engineer turned farmer, specializing in premium rice varieties and traditional grain cultivation. Committed to preserving heritage seeds and sustainable farming.",
      farmingExperience: 18,
      establishedYear: 2005,
      farmSize: 25,
      farmSizeUnit: "acres",
      region: "Western India",
      farmingMethods: ["traditional", "modern"],
      specialties: ["Basmati Rice", "Traditional Grains", "Heritage Seeds"],
      cropsGrown: ["Basmati Rice", "Wheat", "Chickpeas", "Lentils", "Millets"],
      certifications: ["gmp", "iso"],
      awards: ["Best Rice Producer 2023", "Heritage Seed Conservation Award 2022"],
      description: "Expert in traditional rice cultivation with modern quality control. All grains are carefully processed and stored to maintain premium quality.",
      socialMedia: {
        facebook: "https://facebook.com/priya.sharma.farm",
        instagram: "https://instagram.com/priya_sharma_grains"
      },
      businessHours: {
        monday: { open: "07:00", close: "19:00" },
        tuesday: { open: "07:00", close: "19:00" },
        wednesday: { open: "07:00", close: "19:00" },
        thursday: { open: "07:00", close: "19:00" },
        friday: { open: "07:00", close: "19:00" },
        saturday: { open: "07:00", close: "17:00" },
        sunday: { open: "09:00", close: "15:00" }
      },
      farmingPractices: [
        "Traditional rice cultivation methods",
        "Heritage seed preservation",
        "Quality control and testing",
        "Sustainable water management",
        "Post-harvest processing"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop"
    }
  },
  {
    _id: "farmer-suresh-kumar-3",
    name: "Suresh Kumar",
    email: "suresh.kumar@haritkranti.com",
    phone: "+91 98765 43212",
    address: {
      street: "Green Valley Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India"
    },
    location: { lat: 12.9716, lng: 77.5946 },
    isVerified: true,
    verificationStatus: "verified",
    trustScore: 4.6,
    rating: 4.5,
    reviews: 89,
    joinDate: "2023-03-10",
    lastActive: new Date().toISOString(),
    responseTime: 3,
    profile: {
      farmName: "Kumar Fresh Greens",
      bio: "Young entrepreneur focused on hydroponic farming and fresh leafy greens. Using technology to grow premium vegetables in controlled environments.",
      farmingExperience: 8,
      establishedYear: 2016,
      farmSize: 8,
      farmSizeUnit: "acres",
      region: "South India",
      farmingMethods: ["modern", "hydroponic"],
      specialties: ["Hydroponic Vegetables", "Leafy Greens", "Microgreens"],
      cropsGrown: ["Lettuce", "Spinach", "Kale", "Arugula", "Basil", "Cilantro"],
      certifications: ["gmp"],
      awards: ["Innovation in Agriculture 2023"],
      description: "Pioneer in hydroponic farming in the region. All vegetables are grown in controlled environments ensuring consistent quality and freshness.",
      socialMedia: {
        instagram: "https://instagram.com/suresh_kumar_hydroponics",
        twitter: "https://twitter.com/suresh_kumar_farm"
      },
      businessHours: {
        monday: { open: "06:00", close: "20:00" },
        tuesday: { open: "06:00", close: "20:00" },
        wednesday: { open: "06:00", close: "20:00" },
        thursday: { open: "06:00", close: "20:00" },
        friday: { open: "06:00", close: "20:00" },
        saturday: { open: "06:00", close: "18:00" },
        sunday: { open: "08:00", close: "16:00" }
      },
      farmingPractices: [
        "Hydroponic cultivation",
        "Controlled environment agriculture",
        "Precision nutrient management",
        "Automated irrigation systems",
        "Quality monitoring and testing"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
    }
  },
  {
    _id: "farmer-anjali-devi-4",
    name: "Anjali Devi",
    email: "anjali.devi@haritkranti.com",
    phone: "+91 98765 43213",
    address: {
      street: "Mango Grove Lane",
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221001",
      country: "India"
    },
    location: { lat: 25.3176, lng: 82.9739 },
    isVerified: true,
    verificationStatus: "verified",
    trustScore: 4.7,
    rating: 4.6,
    reviews: 124,
    joinDate: "2022-11-05",
    lastActive: new Date().toISOString(),
    responseTime: 2,
    profile: {
      farmName: "Devi Mango Paradise",
      bio: "Fruit specialist with expertise in mango cultivation and tropical fruits. Family farm with 30+ years of experience in premium fruit production.",
      farmingExperience: 30,
      establishedYear: 1993,
      farmSize: 20,
      farmSizeUnit: "acres",
      region: "North India",
      farmingMethods: ["traditional", "sustainable"],
      specialties: ["Premium Mangoes", "Tropical Fruits", "Fruit Processing"],
      cropsGrown: ["Alphonso Mangoes", "Bananas", "Papayas", "Guavas", "Pomegranates"],
      certifications: ["organic", "gmp"],
      awards: ["Best Mango Producer 2023", "Fruit Excellence Award 2022"],
      description: "Specialist in premium mango varieties with traditional cultivation methods. All fruits are hand-picked at optimal ripeness for best flavor.",
      socialMedia: {
        facebook: "https://facebook.com/anjali.devi.mango",
        instagram: "https://instagram.com/anjali_devi_fruits"
      },
      businessHours: {
        monday: { open: "05:00", close: "19:00" },
        tuesday: { open: "05:00", close: "19:00" },
        wednesday: { open: "05:00", close: "19:00" },
        thursday: { open: "05:00", close: "19:00" },
        friday: { open: "05:00", close: "19:00" },
        saturday: { open: "05:00", close: "17:00" },
        sunday: { open: "07:00", close: "15:00" }
      },
      farmingPractices: [
        "Traditional fruit cultivation",
        "Natural ripening processes",
        "Hand-picking at optimal ripeness",
        "Fruit quality grading",
        "Sustainable orchard management"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1587049352851-8d0a01f0f5fb?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop"
    }
  },
  {
    _id: "farmer-mohan-singh-5",
    name: "Mohan Singh",
    email: "mohan.singh@haritkranti.com",
    phone: "+91 98765 43214",
    address: {
      street: "Desert Bloom Farm",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India"
    },
    location: { lat: 26.9124, lng: 75.7873 },
    isVerified: true,
    verificationStatus: "verified",
    trustScore: 4.5,
    rating: 4.4,
    reviews: 67,
    joinDate: "2023-05-15",
    lastActive: new Date().toISOString(),
    responseTime: 4,
    profile: {
      farmName: "Singh Desert Agriculture",
      bio: "Innovative farmer adapting traditional crops to arid conditions. Expert in drought-resistant varieties and water-efficient farming techniques.",
      farmingExperience: 22,
      establishedYear: 2001,
      farmSize: 35,
      farmSizeUnit: "acres",
      region: "Western India",
      farmingMethods: ["traditional", "sustainable"],
      specialties: ["Drought-Resistant Crops", "Traditional Grains", "Water Conservation"],
      cropsGrown: ["Pearl Millet", "Chickpeas", "Mustard", "Sesame", "Groundnuts"],
      certifications: ["organic"],
      awards: ["Water Conservation Award 2023", "Sustainable Farming Excellence 2022"],
      description: "Pioneer in sustainable farming in arid regions. All crops are grown using water-efficient techniques and traditional knowledge.",
      socialMedia: {
        facebook: "https://facebook.com/mohan.singh.desert"
      },
      businessHours: {
        monday: { open: "06:00", close: "18:00" },
        tuesday: { open: "06:00", close: "18:00" },
        wednesday: { open: "06:00", close: "18:00" },
        thursday: { open: "06:00", close: "18:00" },
        friday: { open: "06:00", close: "18:00" },
        saturday: { open: "06:00", close: "16:00" },
        sunday: { open: "08:00", close: "14:00" }
      },
      farmingPractices: [
        "Drought-resistant crop varieties",
        "Water conservation techniques",
        "Traditional farming wisdom",
        "Soil moisture management",
        "Crop rotation for soil health"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
    }
  },
  {
    _id: "farmer-kavita-patel-6",
    name: "Kavita Patel",
    email: "kavita.patel@haritkranti.com",
    phone: "+91 98765 43215",
    address: {
      street: "Gujarat Green Fields",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      country: "India"
    },
    location: { lat: 23.0225, lng: 72.5714 },
    isVerified: false,
    verificationStatus: "pending",
    trustScore: 4.2,
    rating: 4.1,
    reviews: 23,
    joinDate: "2023-09-01",
    lastActive: new Date().toISOString(),
    responseTime: 6,
    profile: {
      farmName: "Patel Spice Garden",
      bio: "New generation farmer specializing in spices and aromatic plants. Combining traditional knowledge with modern organic practices.",
      farmingExperience: 5,
      establishedYear: 2018,
      farmSize: 12,
      farmSizeUnit: "acres",
      region: "Western India",
      farmingMethods: ["organic", "traditional"],
      specialties: ["Spices", "Aromatic Plants", "Medicinal Herbs"],
      cropsGrown: ["Turmeric", "Ginger", "Cardamom", "Cumin", "Coriander", "Fenugreek"],
      certifications: ["organic"],
      awards: [],
      description: "Specialist in premium spices and aromatic plants. All products are organically grown and carefully processed to maintain potency.",
      socialMedia: {
        instagram: "https://instagram.com/kavita_patel_spices"
      },
      businessHours: {
        monday: { open: "07:00", close: "19:00" },
        tuesday: { open: "07:00", close: "19:00" },
        wednesday: { open: "07:00", close: "19:00" },
        thursday: { open: "07:00", close: "19:00" },
        friday: { open: "07:00", close: "19:00" },
        saturday: { open: "07:00", close: "17:00" },
        sunday: { open: "09:00", close: "15:00" }
      },
      farmingPractices: [
        "Organic spice cultivation",
        "Traditional processing methods",
        "Aromatic plant care",
        "Natural pest control",
        "Quality preservation techniques"
      ],
      farmPhotos: [
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop"
      ],
      profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
    }
  }
];

export default farmers;
