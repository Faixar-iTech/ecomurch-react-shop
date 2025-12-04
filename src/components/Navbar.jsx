import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "#products" },
    { name: "Collections", href: "#collections" },
     { name: "Products", href: "/admin/products" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('#')) {
      // Hash link handle korbe
      if (location.pathname !== '/') {
        // Jodi home page e na thaki, home e navigate korbo tarpor scroll korbo
        navigate('/');
        // Small delay diye scroll korbo
        setTimeout(() => {
          const element = document.getElementById(href.substring(1));
          if (element) {
            const yOffset = -80; // Navbar height adjust korar jonno
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Jodi home e thaki, direct scroll
        const element = document.getElementById(href.substring(1));
        if (element) {
          const yOffset = -80; // Navbar height adjust korar jonno
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search functionality
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/40">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-gold to-primary rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <span className="relative text-2xl lg:text-3xl font-display font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                LUXEO
              </span>
            </div>
          <span className="p-3"></span>
             

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.href.startsWith('#')) {
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </button>
                );
              }
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Add Product Button (Admin) */}
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:flex gap-2"
              asChild
            >
              <Link to="/admin/products/new">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </Button>

            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => {/* Implement mobile search */}}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User Account */}
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative group"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center animate-bounce-once">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="pt-4 border-t border-border">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-secondary border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                if (link.href.startsWith('#')) {
                  return (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.href)}
                      className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-3 text-left"
                    >
                      {link.name}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {/* Mobile Add Product Link */}
              <Link
                to="/admin/products/new"
                className="px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
              
              {/* Mobile Account Link */}
              <Link
                to="#"
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center gap-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;