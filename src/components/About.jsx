// src/components/About.jsx
import React from 'react';
import { CheckCircle, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Premium Quality",
      description: "We source only the finest materials and work with skilled artisans."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Sustainability",
      description: "Committed to ethical practices and reducing our environmental impact."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We're here to help you shine."
    }
  ];

  const milestones = [
    { year: "2018", title: "Founded", description: "Started with a vision to redefine luxury" },
    { year: "2020", title: "10K Customers", description: "Reached our first major milestone" },
    { year: "2022", title: "Global Shipping", description: "Expanded to 50+ countries" },
    { year: "2024", title: "Award Winning", description: "Recognized for excellence in design" }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Redefining Luxury, One <span className="text-primary">Experience</span> at a Time
          </h1>
          <p className="text-xl text-muted-foreground">
            At Luxeoo, we believe true luxury lies in the details, the craftsmanship, 
            and the stories behind every product we curate.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column */}
          <div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-gold/20 rounded-3xl blur-xl opacity-50" />
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aeedc493f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Our Story"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2018, Luxeoo began as a passion project between a designer 
              and an artisan who shared a vision: to create a luxury brand that 
              values quality over quantity and craftsmanship over mass production.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Today, we collaborate with talented designers and artisans from 
              around the world, bringing you carefully curated collections that 
              tell a story and stand the test of time.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Handcrafted Excellence</h3>
                  <p className="text-muted-foreground">Each piece is carefully crafted by skilled artisans</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Ethical Sourcing</h3>
                  <p className="text-muted-foreground">Materials sourced from certified sustainable suppliers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Lifetime Support</h3>
                  <p className="text-muted-foreground">Dedicated customer care for the lifetime of your product</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-8 rounded-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                <h3 className="font-bold mb-2">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;