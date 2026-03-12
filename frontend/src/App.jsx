import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';

import EmployerProfile from './pages/EmployerProfile';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/employer-profile/:id" element={<EmployerProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
