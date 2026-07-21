import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchAllContent } from "../api.js";

// These defaults match the site's original hardcoded content exactly, so if
// the API is unreachable (server not running yet, network hiccup, etc.) the
// site still renders normally instead of breaking.
const DEFAULTS = {
  hero: {
    titleLine1: "Smart Solutions for",
    titleLine2: "Industry 4.0",
    subtitle:
      "Our advanced automation, IoT-enabled systems, and smart controls help manufacturers maximize efficiency, precision, and output.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
  services: [
    { label: "IoT & Industry 4.0", icon: "Cloud" },
    { label: "Industrial Automation", icon: "Bot" },
    { label: "Special Purpose Machines", icon: "Settings" },
    { label: "Machine Retrofits & Upgrades", icon: "Wrench" },
    { label: "Custom Software", icon: "Code" },
    { label: "Renewable Energy", icon: "Zap" },
    { label: "Control Panels & HMI", icon: "Cpu" },
    { label: "Machine Vision systems", icon: "Eye" },
  ],
  services_page: [
    {
      title: "IoT & Industry 4.0",
      subtitle: "Subtitles",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      image: "/iot.jpg",
    },
    {
      title: "Service Type",
      subtitle: "Subtitles",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      image: "/servicetype.jpg",
    },
  ],
  projects_home: {
    intro:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    items: [
      {
        title: "Project Title",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Project Title",
        image:
          "https://images.unsplash.com/photo-1565087389965-a6dfda4a95f0?q=80&w=800&auto=format&fit=crop",
      },
      {
        title: "Project Title",
        image:
          "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  projects_details: {
    categories: ["Software", "Electrical", "Mechanical"],
    items: [
      {
        category: "Software",
        title: "AI-Based Control System",
        startDate: "15-01-2024",
        endDate: "30-06-2024",
        about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
        ],
      },
      {
        category: "Electrical",
        title: "CNC Machine Integration",
        startDate: "01-02-2024",
        endDate: "15-08-2024",
        about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1565087389965-a6dfda4a95f0?q=80&w=800&auto=format&fit=crop",
        ],
      },
      {
        category: "Mechanical",
        title: "Industrial Automation Setup",
        startDate: "10-03-2024",
        endDate: "20-09-2024",
        about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=800&auto=format&fit=crop",
        ],
      },
    ],
  },
  gallery: [
    "/projimage2.jpg",
    "/projimage3.jpg",
    "/slide1.png",
    "/slide2.png",
    "/slide3.png",
    "/slide4.png",
    "/slide5.png",
    "/slide6.png",
    "/slide7.png",
  ],
  career: {
    joinTeamText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    joinTeamImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=900&auto=format&fit=crop",
    jobOpenings: [
      {
        id: "1",
        title: "Job Title",
        location: "Coimbatore",
        experience: "2 - 3 years",
        type: "Full Time",
        salary: "₹200,000.00 - ₹300,000.00 per year",
        skills: "JavaScript, HTML, CSS, and JSX",
        description: "Lorem Ipsum dolor sit amet consectetur. Amet sed diam pharetra scelerisque arcu arcu cursus. At pharetra dictumst aliquam ut a posuere. Massa a porttitor lacus elementum sagittis nibh lectus tortor. Duis morbi mauris tincidunt faucibus sed fringilla. Molestie mattis arcu mauris eu. Convallis elit nunc consectetur enim maecenas tempus risus amet quis. Mi sed sagittis vitae sem mi. Eget imperdiet elit id eleifend aliquam libero gravida. Sed et imperdiet tortor nam tortor sapien amet tristique mauris. Sed quis risus tempor ac bibendum sit quis fringilla iaculis.",
        skillSet: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]
      },
      {
        id: "2",
        title: "Job Title",
        location: "Coimbatore",
        experience: "2 - 3 years",
        type: "Full Time",
        salary: "₹200,000.00 - ₹300,000.00 per year",
        skills: "JavaScript, HTML, CSS, and JSX",
        description: "Lorem Ipsum dolor sit amet consectetur. Amet sed diam pharetra scelerisque arcu arcu cursus. At pharetra dictumst aliquam ut a posuere. Massa a porttitor lacus elementum sagittis nibh lectus tortor. Duis morbi mauris tincidunt faucibus sed fringilla. Molestie mattis arcu mauris eu. Convallis elit nunc consectetur enim maecenas tempus risus amet quis. Mi sed sagittis vitae sem mi. Eget imperdiet elit id eleifend aliquam libero gravida. Sed et imperdiet tortor nam tortor sapien amet tristique mauris. Sed quis risus tempor ac bibendum sit quis fringilla iaculis.",
        skillSet: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]
      },
      {
        id: "3",
        title: "Job Title",
        location: "Coimbatore",
        experience: "2 - 3 years",
        type: "Full Time",
        salary: "₹200,000.00 - ₹300,000.00 per year",
        skills: "JavaScript, HTML, CSS, and JSX",
        description: "Lorem Ipsum dolor sit amet consectetur. Amet sed diam pharetra scelerisque arcu arcu cursus. At pharetra dictumst aliquam ut a posuere. Massa a porttitor lacus elementum sagittis nibh lectus tortor. Duis morbi mauris tincidunt faucibus sed fringilla. Molestie mattis arcu mauris eu. Convallis elit nunc consectetur enim maecenas tempus risus amet quis. Mi sed sagittis vitae sem mi. Eget imperdiet elit id eleifend aliquam libero gravida. Sed et imperdiet tortor nam tortor sapien amet tristique mauris. Sed quis risus tempor ac bibendum sit quis fringilla iaculis.",
        skillSet: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"]
      }
    ]
  },
};

const ContentContext = createContext({
  content: DEFAULTS,
  loading: true,
  error: null,
  refresh: () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchAllContent();
      setContent((prev) => ({ ...prev, ...data }));
      setError(null);
    } catch (err) {
      // Keep showing defaults/previous content; don't break the site.
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentContext.Provider value={{ content, loading, error, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
