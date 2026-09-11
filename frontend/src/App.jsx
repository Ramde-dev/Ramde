import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WhatsAppButton from './components/WhatsAppButton';

// Admin imports
import ProtectedRoute from './admin/ProtectedRoute';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import EditHero from './admin/EditHero';
import EditAbout from './admin/EditAbout';
import ManageSkills from './admin/ManageSkills';
import ManageExperience from './admin/ManageExperience';
import ManageServices from './admin/ManageServices';
import ManageProjects from './admin/ManageProjects';
import ManageTestimonials from './admin/ManageTestimonials';
import EditContact from './admin/EditContact';
import Messages from './admin/Messages';
import ChangePassword from './admin/ChangePassword';   // ⬅

import './App.css';
import './admin/admin.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ============ PUBLIC ROUTES ============ */}
                <Route path="/" element={<Home />} />

                {/* ============ ADMIN LOGIN ============ */}
                <Route path="/admin/login" element={<Login />} />

                {/* ============ ADMIN (PROTECTED) ============ */}
                <Route path="/admin" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/admin/hero" element={
                    <ProtectedRoute><EditHero /></ProtectedRoute>
                } />
                <Route path="/admin/about" element={
                    <ProtectedRoute><EditAbout /></ProtectedRoute>
                } />
                <Route path="/admin/skills" element={
                    <ProtectedRoute><ManageSkills /></ProtectedRoute>
                } />
                <Route path="/admin/experience" element={
                    <ProtectedRoute><ManageExperience /></ProtectedRoute>
                } />
                <Route path="/admin/services" element={
                    <ProtectedRoute><ManageServices /></ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                    <ProtectedRoute><ManageProjects /></ProtectedRoute>
                } />
                <Route path="/admin/testimonials" element={
                    <ProtectedRoute><ManageTestimonials /></ProtectedRoute>
                } />
                <Route path="/admin/contact" element={
                    <ProtectedRoute><EditContact /></ProtectedRoute>
                } />
                <Route path="/admin/messages" element={
                    <ProtectedRoute><Messages /></ProtectedRoute>
                } />
                <Route path="/admin/change-password" element={
                    <ProtectedRoute><ChangePassword /></ProtectedRoute>
                } />
            </Routes>

          
            <WhatsAppButton />
        </BrowserRouter>
    );
}

export default App;