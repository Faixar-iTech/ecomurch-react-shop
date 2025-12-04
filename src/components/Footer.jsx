import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Shop: ["New Arrivals", "Best Sellers", "Sale", "All Products"],
    Company: ["About Us", "Careers", "Press", "Blog"],
    Support: ["Contact Us", "FAQs", "Shipping", "Returns"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-4">
              <span className="text-3xl font-display font-bold text-gradient-gold">
                LUXE
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Premium products for those who appreciate quality and timeless elegance.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 LUXE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <img
              src="https://cdn-icons-png.flaticon.com/128/349/349221.png"
              alt="Visa"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/349/349228.png"
              alt="Mastercard"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/349/349230.png"
              alt="PayPal"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
