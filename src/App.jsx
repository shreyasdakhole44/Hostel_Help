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
import ComplaintDetail    from './pages/student/ComplaintDetail';

// Warden pages
import WardenDashboard        from './pages/warden/Dashboard';
import AssignedComplaints     from './pages/warden/AssignedComplaints';
import WardenComplaintDetail  from './pages/warden/ComplaintDetail';

// Admin pages
import AdminDashboard   from './pages/admin/Dashboard';
import AllComplaints    from './pages/admin/AllComplaints';
import UserManagement   from './pages/admin/UserManagement';
import Categories       from './pages/admin/Categories';

// redirect after login based on role
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
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>

            {/* public routes */}
            <Route path="/"             element={<Landing />}  />
            <Route path="/login"        element={<Login />}    />
            <Route path="/register"     element={<Register />} />
            <Route path="/unauthorized" element={<h2 style={{textAlign:'center', marginTop:'50px'}}>403 — Access Denied</h2>} />

            {/* role redirect */}
            <Route path="/dashboard"    element={<RoleRedirect />} />

            {/* student routes */}
            <Route element={<PrivateRoute role="STUDENT" />}>
              <Route path="/student/dashboard"        element={<StudentDashboard />}  />
              <Route path="/student/complaints"        element={<MyComplaints />}      />
              <Route path="/student/complaints/new"    element={<SubmitComplaint />}   />
              <Route path="/student/complaints/:id"    element={<ComplaintDetail />}   />
            </Route>

            {/* warden routes */}
            <Route element={<PrivateRoute role="WARDEN" />}>
              <Route path="/warden/dashboard"          element={<WardenDashboard />}       />
              <Route path="/warden/complaints"          element={<AssignedComplaints />}    />
              <Route path="/warden/complaints/:id"      element={<WardenComplaintDetail />} />
            </Route>

            {/* admin routes */}
            <Route element={<PrivateRoute role="ADMIN" />}>
              <Route path="/admin/dashboard"   element={<AdminDashboard />}  />
              <Route path="/admin/complaints"  element={<AllComplaints />}   />
              <Route path="/admin/users"       element={<UserManagement />}  />
              <Route path="/admin/categories"  element={<Categories />}      />
            </Route>

          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;