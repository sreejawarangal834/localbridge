import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Star, CheckCircle, MapPin as MapPinIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Real background images from Unsplash (Indian context)
const heroImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80";
const testimonialImage1 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80";
const testimonialImage2 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80";
const testimonialImage3 = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80";

export default function Home() {
  const { user } = useAuth();

  const categories = [
    { id: "electrician", label: "Electrician", icon: "⚡", color: "bg-orange-100 text-orange-600" },
    { id: "plumber", label: "Plumber", icon: "💧", color: "bg-blue-100 text-blue-600" },
    { id: "driver", label: "Driver", icon: "🚗", color: "bg-green-100 text-green-600" },
    { id: "cleaner", label: "Cleaner", icon: "🧹", color: "bg-purple-100 text-purple-600" },
    { id: "cook", label: "Cook", icon: "🍳", color: "bg-red-100 text-red-600" },
    { id: "construction", label: "Construction", icon: "🏗️", color: "bg-amber-100 text-amber-600" },
  ];

  const steps = [
    { number: 1, title: "Search Jobs", desc: "Browse hundreds of verified job listings in your area" },
    { number: 2, title: "Apply Instantly", desc: "Submit your application directly to employers" },
    { number: 3, title: "Get Hired", desc: "Connect with employers and start work quickly" },
  ];

  const testimonials = [
    { name: "Ramesh Kumar", role: "Electrician", text: "I found a great job as an electrician through LocalBridge. The application process was simple and I started work the next day!", image: testimonialImage1 },
    { name: "Priya Sharma", role: "Tailor", text: "As a tailor, I connected with multiple employers in my area. The platform made job hunting so much easier.", image: testimonialImage2 },
    { name: "Amit Patel", role: "Delivery Partner", text: "The delivery partner jobs I found here are reliable and pay well. Highly recommended for gig workers.", image: testimonialImage3 },
  ];

  const featuredJobs = [
    { id: 1, title: "Electrician Needed", employer: "Sri Sai Electricals", location: "Hanamkonda, Warangal", salary: "₹15,000 - ₹20,000", category: "Electrician" },
    { id: 2, title: "Plumber Required", employer: "City Plumbing Services", location: "Warangal City", salary: "₹12,000 - ₹18,000", category: "Plumber" },
    { id: 3, title: "Delivery Partner", employer: "Quick Delivery", location: "Multiple Locations", salary: "₹10,000 - ₹25,000", category: "Delivery" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Local job opportunities" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/80 to-orange-900/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-10 leading-tight">
            Discover Work. Connect Locally. Grow Together.
          </h1>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Job Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore high-demand job categories near you</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link 
                key={cat.id}
                to="/search"
                className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${cat.color} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Three simple steps to find your next job</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
                <div className="relative z-10 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
              <p className="text-gray-600">Top job openings from verified employers</p>
            </div>
            <Link 
              to="/search" 
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl shadow-lg shadow-gray-100/60 border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                      💼
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.employer}</p>
                    </div>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md">
                    {job.salary}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {job.category}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Link to="/search" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition text-center">
                    Apply Now
                  </Link>
                  <button className="px-4 py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 text-blue-600 font-semibold"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Map Integration */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Jobs Nearby</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our interactive map helps you find jobs close to your location. Click on any marker to see job details and apply instantly.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Live Job Map</h4>
                    <p className="text-sm text-gray-600">See all available jobs on an interactive map</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Distance Filter</h4>
                    <p className="text-sm text-gray-600">Filter jobs by how far you're willing to travel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Route Planning</h4>
                    <p className="text-sm text-gray-600">Get directions to your potential workplace</p>
                  </div>
                </div>
              </div>
              <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 inline-flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                Explore Map
              </Link>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" 
                alt="Map interface" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Live Job Map</p>
                      <p className="text-xs text-gray-500">Real-time job locations near you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Hear from workers and employers who found success on LocalBridge</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Next Opportunity?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of local workers and employers who trust LocalBridge to connect them with real opportunities.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95">
              Find Jobs
            </Link>
            <Link to="/post-job" className="bg-orange-600 hover:bg-orange-700 font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95">
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
