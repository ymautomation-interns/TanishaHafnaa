import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import AboutUsPage from "./pages/AboutUsPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ContactUsPage from "./pages/ContactUsPage.jsx";
import CareerPage from "./pages/CareerPage.jsx";
import JobApplicationPage from "./pages/JobApplicationPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RequireAdmin from "./pages/admin/RequireAdmin.jsx";
import { useLocation } from "react-router-dom";

function SiteChrome({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return children;
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <ScrollToTop />
      <SiteChrome>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/career/apply/:id" element={<JobApplicationPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </SiteChrome>
    </div>
  );
}

