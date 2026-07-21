import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearToken } from "../../api.js";
import HomeEditor from "./editors/HomeEditor.jsx";
import ServicesEditor from "./editors/ServicesEditor.jsx";
import ProjectsEditor from "./editors/ProjectsEditor.jsx";
import GalleryEditor from "./editors/GalleryEditor.jsx";
import CareerEditor from "./editors/CareerEditor.jsx";

const TABS = [
  { key: "home", label: "Home", Component: HomeEditor },
  { key: "services", label: "Services", Component: ServicesEditor },
  { key: "projects", label: "Projects", Component: ProjectsEditor },
  { key: "gallery", label: "Gallery", Component: GalleryEditor },
  { key: "career", label: "Career", Component: CareerEditor },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const Active = TABS.find((t) => t.key === activeTab).Component;

  function handleLogout() {
    clearToken();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Edit text and images for the Home, Services, Projects, Gallery, and Career
            pages. Changes go live for every visitor after you save.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-semibold text-neutral-600 hover:text-amber-500">
            View site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-red-300 hover:text-red-500"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-t-md px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "border-b-2 border-amber-400 text-neutral-900"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Active />
      </div>
    </div>
  );
}
