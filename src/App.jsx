import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Register from './pages/Register';

// Student pages
import StudentDashboard   from './pages/student/Dashboard';
import SubmitComplaint    from './pages/student/SubmitComplaint';
import MyComplaints       from './pages/student/MyComplaints';
import StudentComplaintDetail    from './pages/student/ComplaintDetail';
import StudentProfile     from './pages/student/Profile';
import KnowledgeBase      from './pages/student/KnowledgeBase';

// Warden pages
import WardenDashboard        from './pages/warden/Dashboard';
import WardenComplaints       from './pages/warden/Complaints';
import WardenComplaintDetail  from './pages/warden/ComplaintDetail';

// Admin pages
import AdminDashboard   from './pages/admin/Dashboard';
import AllComplaints    from './pages/admin/AllComplaints';
import Students         from './pages/admin/Students';
import Wardens          from './pages/admin/Wardens';
import Categories       from './pages/admin/Categories';
import Analytics        from './pages/admin/Analytics';

// Redirect after login based on role
const RoleRedirect = () => {
  const { user } = useAuth(); 
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN')   return <Navigate to="/admin/dashboard"   replace />;
  if (user.role === 'WARDEN')  return <Navigate to="/warden/dashboard"  replace />;
  if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          <Routes>
            {/* Public routes */}
            <Route path="/"             element={<Landing />}  />
            <Route path="/login"        element={<Login />}    />
            <Route path="/register"     element={<Register />} />
            <Route path="/unauthorized" element={
              <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Inter, sans-serif' }}>
                <h1 style={{ fontSize: '48px', color: '#7C3AED', marginBottom: '16px' }}>403</h1>
                <h2 style={{ fontSize: '24px', color: '#111827', marginBottom: '8px' }}>Access Denied</h2>
                <p style={{ color: '#6B7280', marginBottom: '24px' }}>You do not have permission to view this page.</p>
                <a href="/login" style={{ color: '#7C3AED', textDecoration: 'none', fontWeight: '600' }}>Back to Login</a>
              </div>
            } />

            {/* Role-based dashboard redirect */}
            <Route path="/dashboard"    element={<RoleRedirect />} />

            {/* Student routes */}
            <Route element={<PrivateRoute role="STUDENT" />}>
              <Route path="/student/dashboard"        element={<StudentDashboard />}  />
              <Route path="/student/complaints"       element={<MyComplaints />}      />
              <Route path="/student/complaints/new"   element={<SubmitComplaint />}   />
              <Route path="/student/complaints/:id"   element={<StudentComplaintDetail />}   />
              <Route path="/student/profile"          element={<StudentProfile />}    />
              <Route path="/student/knowledge"        element={<KnowledgeBase />}     />
            </Route>

            {/* Warden routes */}
            <Route element={<PrivateRoute role="WARDEN" />}>
              <Route path="/warden/dashboard"          element={<WardenDashboard />}       />
              <Route path="/warden/complaints"         element={<WardenComplaints />}    />
              <Route path="/warden/complaints/:id"     element={<WardenComplaintDetail />} />
            </Route>

            {/* Admin routes */}
            <Route element={<PrivateRoute role="ADMIN" />}>
              <Route path="/admin/dashboard"   element={<AdminDashboard />}  />
              <Route path="/admin/complaints"  element={<AllComplaints />}   />
              <Route path="/admin/users/students" element={<Students />}    />
              <Route path="/admin/users/wardens"  element={<Wardens />}     />
              <Route path="/admin/categories"  element={<Categories />}      />
              <Route path="/admin/analytics"   element={<Analytics />}       />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;