import { Link } from 'react-router-dom';
import { Briefcase, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    if (user && user.role === 'SEEKER' && user.occupation) {
      alert(`We will notify you about new ${user.occupation} jobs in your area!`);
    }
    logout();
    navigate('/');
  };
  
  const navLinks = [
    { to: '/search', label: 'Find Jobs' },
    { to: '/post-job', label: 'Post Job' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Local<span className="text-blue-600">Bridge</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'EMPLOYER' ? '/employer' : '/seeker-profile'} className="text-gray-600 hover:text-blue-600 flex flex-col items-center transition-colors">
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Profile</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 flex flex-col items-center transition-colors">
                  <LogOut className="w-5 h-5" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-semibold px-3 py-2 text-sm transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to}
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link 
                  to={user.role === 'EMPLOYER' ? '/employer' : '/seeker-profile'}
                  className="block px-4 py-2 text-center text-gray-600 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full block px-4 py-2 text-center text-red-600 hover:bg-red-50 font-medium rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link 
                  to="/login" 
                  className="block px-4 py-2 text-center text-gray-600 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-orange-500 text-white font-bold rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
