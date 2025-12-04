// Index.jsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ProductGrid from "@/components/ProductGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import Collections from "@/components/Collections";
import About from "@/components/About";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
          
          {/* Products Section */}
          <section id="products" className="scroll-mt-20">
            <ProductGrid />
          </section>
          
          {/* Collections Section */}
          <section id="collections" className="scroll-mt-20">
            <Collections />
          </section>
          
          {/* About Section */}
          <section id="about" className="scroll-mt-20">
            <About />
          </section>
          
          <Newsletter />
          
          {/* Contact Section */}
          <section id="contact" className="scroll-mt-20">
            <Contact />
          </section>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default Index;