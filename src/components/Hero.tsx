import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6">
            <span 
              className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              New Collection 2024
            </span>
            
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              Discover
              <span className="block text-gradient-gold">Premium Style</span>
            </h1>
            
            <p 
              className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              Curated collection of premium products designed for those who appreciate quality and timeless elegance.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button variant="hero" size="xl" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline-gold" size="xl" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                View Collections
              </Button>
            </div>

            {/* Stats */}
            <div 
              className="flex gap-8 justify-center lg:justify-start pt-8 animate-fade-up"
              style={{ animationDelay: "0.5s" }}
            >
              {[
                { value: "10K+", label: "Products" },
                { value: "50K+", label: "Customers" },
                { value: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-display font-bold text-gradient-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div 
            className="relative animate-fade-up hidden lg:block"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform scale-75" />
              
              {/* Main image container */}
              <div className="relative bg-gradient-card rounded-3xl p-8 shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop"
                  alt="Featured Product"
                  className="w-full h-full object-cover rounded-2xl"
                />
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-gold font-semibold">
                  25% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to products"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2 hover:border-primary transition-colors">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </button>
    </section>
  );
};

export default Hero;
