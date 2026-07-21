// Populates the database with the site's current content, so nothing
// visually changes the first time the admin panel + API go live.
// Run with: npm run seed
import "dotenv/config";
import { pool, initSchema, setSection } from "./db.js";

const DEFAULT_CONTENT = {
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
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Service Type",
      subtitle: "Subtitles",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
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
        title: "Project name",
        startDate: "00-00-0000",
        endDate: "00-00-000",
        about:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        category: "Mechanical",
        title: "Project name",
        startDate: "00-00-0000",
        endDate: "00-00-000",
        about:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1565087389965-a6dfda4a95f0?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        category: "Software",
        title: "Project name",
        startDate: "00-00-0000",
        endDate: "00-00-000",
        about:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop",
        ],
      },
      {
        category: "Electrical",
        title: "Project name",
        startDate: "00-00-0000",
        endDate: "00-00-000",
        about:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        images: [
          "https://images.unsplash.com/photo-1581093458791-9d42e2f9e5b3?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=900&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=900&auto=format&fit=crop",
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
};

async function seed() {
  await initSchema();
  for (const [section, data] of Object.entries(DEFAULT_CONTENT)) {
    const existing = await pool.query(
      "SELECT 1 FROM site_content WHERE section = $1",
      [section]
    );
    if (existing.rowCount > 0) {
      console.log(`- Skipping "${section}" (already exists)`);
      continue;
    }
    await setSection(section, data);
    console.log(`- Seeded "${section}"`);
  }
  console.log("Done.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
