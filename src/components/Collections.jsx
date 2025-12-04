// src/components/Collections.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

const Collections = () => {
  const collections = [
    {
      id: 1,
      name: "Summer Collection",
      description: "Fresh styles for the sunny season",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "120+ Products",
      tag: "New Arrivals",
      color: "bg-gradient-to-r from-blue-400 to-cyan-300"
    },
    {
      id: 2,
      name: "Winter Collection",
      description: "Warm and cozy for cold days",
      image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "85+ Products",
      tag: "Best Sellers",
      color: "bg-gradient-to-r from-purple-400 to-indigo-300"
    },
    {
      id: 3,
      name: "Premium Collection",
      description: "Exclusive luxury items",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "50+ Products",
      tag: "Limited Edition",
      color: "bg-gradient-to-r from-amber-400 to-orange-300"
    },
    {
      id: 4,
      name: "Casual Wear",
      description: "Everyday comfort and style",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "200+ Products",
      tag: "Most Popular",
      color: "bg-gradient-to-r from-green-400 to-emerald-300"
    },
    {
      id: 5,
      name: "Formal Collection",
      description: "Sophisticated outfits for special occasions",
      image: "https://images.unsplash.com/photo-1558769132-cb1aeedc493f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "75+ Products",
      tag: "Elegant",
      color: "bg-gradient-to-r from-gray-400 to-slate-300"
    },
    {
      id: 6,
      name: "Sports & Active",
      description: "Performance wear for active lifestyle",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: "95+ Products",
      tag: "Active Wear",
      color: "bg-gradient-to-r from-red-400 to-pink-300"
    }
  ];

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Handpicked materials for ultimate comfort"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Sustainable",
      description: "Ethically sourced and eco-friendly"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Shipping",
      description: "Free delivery on orders over $99"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Exclusive Collections
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Discover Our Curated Collections
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore handpicked selections for every occasion, crafted with attention to detail and premium quality.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {collections.map((collection) => (
            <div 
              key={collection.id} 
              className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Collection Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`${collection.color} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                    {collection.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Collection Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                <p className="text-muted-foreground mb-4">{collection.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {collection.items}
                  </span>
                  <Link 
                    to={`/collections/${collection.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    Shop Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl border border-primary/20">
            <div className="text-left">
              <h3 className="text-xl font-bold mb-2">Can't Find What You're Looking For?</h3>
              <p className="text-muted-foreground">
                Browse our complete catalog or contact our style consultants.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/products"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                View All Products
              </Link>
              <Link 
                to="/contact"
                className="px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Get Style Advice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;