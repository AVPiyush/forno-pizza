// Size multipliers (applied on top of base price)
const SIZE_PRICES = {
  small:   { label: 'Small',   inch: '8"',  multiplier: 0.75 },
  medium:  { label: 'Medium',  inch: '10"', multiplier: 1.0  },
  regular: { label: 'Regular', inch: '12"', multiplier: 1.28 }
};

// All available toppings the user can choose from
const ALL_TOPPINGS = [
  { id: "t_tomato",    name: "Tomato Slices",     type: "veg",    price: 30  },
  { id: "t_onion",     name: "Red Onion",          type: "veg",    price: 20  },
  { id: "t_capsicum",  name: "Green Capsicum",     type: "veg",    price: 20  },
  { id: "t_mushroom",  name: "Mushrooms",          type: "veg",    price: 40  },
  { id: "t_olive",     name: "Black Olives",       type: "veg",    price: 35  },
  { id: "t_corn",      name: "Sweet Corn",         type: "veg",    price: 25  },
  { id: "t_spinach",   name: "Baby Spinach",       type: "veg",    price: 30  },
  { id: "t_jalapeno",  name: "Jalapeños",          type: "veg",    price: 30  },
  { id: "t_sundried",  name: "Sun-dried Tomatoes", type: "veg",    price: 45  },
  { id: "t_pineapple", name: "Pineapple",          type: "veg",    price: 35  },
  { id: "t_mozzarella",name: "Extra Mozzarella",  type: "cheese", price: 60  },
  { id: "t_parmesan",  name: "Parmesan",           type: "cheese", price: 55  },
  { id: "t_feta",      name: "Feta Crumble",       type: "cheese", price: 50  },
  { id: "t_cheddar",   name: "Cheddar",            type: "cheese", price: 50  },
  { id: "t_pepperoni", name: "Pepperoni",          type: "nonveg", price: 80  },
  { id: "t_chicken",   name: "Grilled Chicken",    type: "nonveg", price: 90  },
  { id: "t_bacon",     name: "Smoked Bacon",       type: "nonveg", price: 85  },
  { id: "t_sausage",   name: "Italian Sausage",    type: "nonveg", price: 85  },
  { id: "t_salami",    name: "Salami",             type: "nonveg", price: 80  },
  { id: "t_lamb",      name: "Spiced Lamb",        type: "nonveg", price: 100 },
];

const PIZZAS = {
  veg: [
    {
      id: "v1", name: "Margherita Royale", tagline: "The Classic Reborn",
      description: "San Marzano tomatoes, fresh buffalo mozzarella, hand-torn basil, extra virgin olive oil on a 48-hour cold-fermented crust.",
      basePrice: 299, spice: 1, rating: 4.8, tags: ["Classic", "Cheese", "Basil"],
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
      defaultToppings: ["t_mozzarella", "t_tomato"]
    },
    {
      id: "v2", name: "Truffle Funghi", tagline: "Earthy & Decadent",
      description: "Black truffle oil, cremini & shiitake mushrooms, taleggio cheese, rosemary, toasted pine nuts.",
      basePrice: 449, spice: 1, rating: 4.9, tags: ["Truffle", "Mushroom", "Gourmet"],
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
      defaultToppings: ["t_mushroom", "t_parmesan", "t_olive"]
    },
    {
      id: "v3", name: "Garden Harvest", tagline: "Fresh From The Earth",
      description: "Roasted bell peppers, zucchini, sun-dried tomatoes, kalamata olives, feta cheese, herb pesto base.",
      basePrice: 349, spice: 1, rating: 4.6, tags: ["Veggies", "Pesto", "Mediterranean"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
      defaultToppings: ["t_capsicum", "t_sundried", "t_olive", "t_feta"]
    },
    {
      id: "v4", name: "Spicy Arrabbiata", tagline: "Fire & Soul",
      description: "Fiery arrabbiata sauce, roasted garlic, chili flakes, capers, fresh basil, smoked mozzarella.",
      basePrice: 329, spice: 3, rating: 4.7, tags: ["Spicy", "Tomato", "Bold"],
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      defaultToppings: ["t_tomato", "t_jalapeno", "t_mozzarella"]
    },
    {
      id: "v5", name: "Quattro Formaggi", tagline: "Four Cheese Bliss",
      description: "Mozzarella, gorgonzola, parmigiano-reggiano, fontina — melted into golden perfection on a white cream base.",
      basePrice: 499, spice: 1, rating: 4.9, tags: ["Cheese", "Creamy", "Rich"],
      image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80",
      defaultToppings: ["t_mozzarella", "t_parmesan", "t_cheddar", "t_feta"]
    },
    {
      id: "v6", name: "Caramelized Onion", tagline: "Sweet Meets Savory",
      description: "Slow-caramelized onions, gruyère, thyme, balsamic glaze, walnuts on a crème fraîche base.",
      basePrice: 379, spice: 1, rating: 4.5, tags: ["Sweet", "Gourmet", "Balsamic"],
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80",
      defaultToppings: ["t_onion", "t_parmesan", "t_mushroom"]
    }
  ],
  nonveg: [
    {
      id: "n1", name: "Pepperoni Inferno", tagline: "The People's Champion",
      description: "Double-layered pepperoni, spicy Italian sausage, honey chili drizzle, fresh mozzarella, tomato base.",
      basePrice: 449, spice: 3, rating: 4.9, tags: ["Pepperoni", "Spicy", "Classic"],
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
      defaultToppings: ["t_pepperoni", "t_sausage", "t_mozzarella", "t_jalapeno"]
    },
    {
      id: "n2", name: "BBQ Chicken Royale", tagline: "Smoky Southern Soul",
      description: "Smoked BBQ chicken, red onions, jalapeños, cheddar, mozzarella, hickory BBQ sauce, cilantro finish.",
      basePrice: 479, spice: 2, rating: 4.8, tags: ["BBQ", "Chicken", "Smoky"],
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80",
      defaultToppings: ["t_chicken", "t_onion", "t_cheddar", "t_jalapeno"]
    },
    {
      id: "n3", name: "Prosciutto e Rucola", tagline: "Elegance On A Crust",
      description: "San Daniele prosciutto, fresh arugula, shaved parmigiano, lemon zest, truffle oil, mozzarella.",
      basePrice: 599, spice: 1, rating: 5.0, tags: ["Prosciutto", "Arugula", "Luxury"],
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80",
      defaultToppings: ["t_salami", "t_parmesan", "t_spinach"]
    },
    {
      id: "n4", name: "Meat Supremo", tagline: "For The Bold",
      description: "Pepperoni, spicy sausage, ground beef, smoked bacon, caramelized onions, mozzarella, rich tomato.",
      basePrice: 549, spice: 2, rating: 4.7, tags: ["Meaty", "Bold", "Hearty"],
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
      defaultToppings: ["t_pepperoni", "t_sausage", "t_bacon", "t_mozzarella", "t_onion"]
    },
    {
      id: "n5", name: "Salmon & Dill", tagline: "Nordic Luxe",
      description: "Cold-smoked salmon, crème fraîche base, capers, red onion, dill, lemon oil, no tomato.",
      basePrice: 649, spice: 1, rating: 4.8, tags: ["Salmon", "Creamy", "Premium"],
      image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&q=80",
      defaultToppings: ["t_onion", "t_feta", "t_olive"]
    },
    {
      id: "n6", name: "Spicy Lamb Harissa", tagline: "Middle Eastern Flair",
      description: "Slow-spiced lamb mince, harissa sauce, feta, pomegranate, mint yogurt, red onion.",
      basePrice: 579, spice: 3, rating: 4.6, tags: ["Lamb", "Harissa", "Exotic"],
      image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&q=80",
      defaultToppings: ["t_lamb", "t_onion", "t_feta", "t_jalapeno"]
    }
  ],
  deals: [
    {
      id: "d1", name: "Duo Feast", tagline: "Double The Joy",
      description: "Any 2 classic pizzas + 2 drinks + garlic bread. Perfect for two.",
      basePrice: 899, originalPrice: 1299, discount: "30% OFF",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80",
      tags: ["2 Pizzas", "Drinks", "Garlic Bread"], defaultToppings: []
    },
    {
      id: "d2", name: "Family Night", tagline: "Made For The Table",
      description: "2 large pizzas + 4 drinks + 2 sides of your choice. Feeds 4 comfortably.",
      basePrice: 1599, originalPrice: 2199, discount: "32% OFF",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
      tags: ["4 People", "2 Sides", "Best Value"], defaultToppings: []
    },
    {
      id: "d3", name: "Midnight Special", tagline: "Late Night Cravings",
      description: "1 pizza of your choice + loaded fries + dessert calzone. Only after 9PM.",
      basePrice: 699, originalPrice: 999, discount: "38% OFF",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
      tags: ["Fries", "Dessert", "Night Only"], defaultToppings: []
    }
  ]
};

function getToppingById(id) { return ALL_TOPPINGS.find(t => t.id === id); }

function computePrice(pizza, sizeKey, toppingIds) {
  const sizeMultiplier = SIZE_PRICES[sizeKey]?.multiplier || 1.0;
  const base = Math.round(pizza.basePrice * sizeMultiplier);
  const toppingCost = (toppingIds || []).reduce((sum, tid) => {
    const t = getToppingById(tid); return sum + (t ? t.price : 0);
  }, 0);
  return base + toppingCost;
}

function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}
