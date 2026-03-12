import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import EmployerProfile from './pages/EmployerProfile';
import SeekerProfile from './pages/SeekerProfile';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          
          {/* Protected Routes - Require Login */}
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/employer" element={
            <ProtectedRoute>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer-profile/:id" element={
            <ProtectedRoute>
              <EmployerProfile />
            </ProtectedRoute>
          } />
          <Route path="/seeker-profile" element={
            <ProtectedRoute>
              <SeekerProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
