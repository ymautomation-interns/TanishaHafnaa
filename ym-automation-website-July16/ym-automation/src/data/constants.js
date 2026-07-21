import {
  Home,
  User,
  Handshake,
  LayoutGrid,
  Image as ImageIcon,
  Briefcase,
  Cloud,
  Bot,
  Settings,
  Wrench,
  Code,
  Zap,
  Cpu,
  Eye,
  Ruler,
  PenTool,
  Monitor,
  Rocket,
  Headphones,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Home", icon: Home, path: "/" },
  { label: "About Us", icon: User, path: "/about" },
  { label: "Services", icon: Handshake, path: "/services" },
  { label: "Projects", icon: LayoutGrid, path: "/projects" },
  { label: "Gallery", icon: ImageIcon, path: "/gallery" },
  { label: "Career", icon: Briefcase, path: "/career" },
];

export const SERVICES = [
  { label: "IoT & Industry 4.0", icon: Cloud },
  { label: "Industrial Automation", icon: Bot },
  { label: "Special Purpose Machines", icon: Settings },
  { label: "Machine Retrofits & Upgrades", icon: Wrench },
  { label: "Custom Software", icon: Code },
  { label: "Renewable Energy", icon: Zap },
  { label: "Control Panels & HMI", icon: Cpu },
  { label: "Machine Vision systems", icon: Eye },
];

export const STATS = [
  { value: "5+", label: "Experience in Industry" },
  { value: "50+", label: "Completed Projects" },
  { value: "10+", label: "Happy Customer" },
  { value: "20+", label: "Expert Team" },
];

export const APPROACH = [
  { label: "Research & Planning", icon: Ruler },
  { label: "Design & Engineering", icon: PenTool },
  { label: "Implementation", icon: Monitor },
  { label: "Testing & Handover", icon: Rocket },
  { label: "Support", icon: Headphones },
];

export const PROJECTS = [
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
];

export const CUSTOMERS = [
  { name: "salzer", color: "#16a34a", font: "font-black italic" },
  { name: "EnergySYS", color: "#16a34a", ring: "#f97316", font: "font-black" },
  { name: "Armor Grandeur", color: "#0f2f1f", font: "font-serif", badge: true },
  { name: "Eurus Helios", color: "#1c1c1c", font: "font-serif", frame: true },
  { name: "COGENT automation", color: "#2563eb", font: "font-bold" },
  { name: "IIITDM Kancheepuram", color: "#c026d3", font: "font-semibold" },
];

export const PROJECT_CATEGORIES = ["Software", "Electrical", "Mechanical"];

export const PROJECT_ABOUT =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

export const PROJECT_DETAILS = [
  {
    category: "Software",
    title: "Project name",
    startDate: "00-00-0000",
    endDate: "00-00-000",
    about: PROJECT_ABOUT,
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
    about: PROJECT_ABOUT,
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
    about: PROJECT_ABOUT,
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
    about: PROJECT_ABOUT,
    images: [
      "https://images.unsplash.com/photo-1581093458791-9d42e2f9e5b3?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555617981-dac3880eac6e?q=80&w=900&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=900&auto=format&fit=crop",
    ],
  },
];

export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614851099518-05e8b4a56f8d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614851099518-05e8b4a56f8d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614851099518-05e8b4a56f8d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=800&auto=format&fit=crop",
];

const JOB_DESCRIPTION =
  "Lorem Ipsum dolor sit amet consectetur. Amet sed diam pharetra scelerisque arcu arcu cursus. At pharetra dictumst aliquam ut a posuere. Massa a porttitor lacus elementum sagittis nibh lectus tortor. Duis morbi mauris tincidunt faucibus sed fringilla. Molestie mattis arcu mauris eu. Convallis elit nunc consectetur enim maecenas tempus risus amet quis. Mi sed sagittis vitae sem mi. Eget imperdiet elit id eleifend aliquam libero gravida. Sed et imperdiet tortor nam tortor sapien amet tristique mauris. Sed quis risus tempor ac bibendum sit quis fringilla iaculis.";

const JOB_SKILLS = [
  "Lorem Ipsum",
  "Lorem Ipsum",
  "Lorem Ipsum",
  "Lorem Ipsum",
  "Lorem Ipsum",
];

export const JOB_OPENINGS = [
  {
    id: "1",
    title: "Job Title",
    location: "Coimbatore",
    experience: "2 - 3 years",
    type: "Full Time",
    salary: "₹200,000.00 - ₹300,000.00 per year",
    skills: "JavaScript, HTML, CSS, and JSX",
    description: JOB_DESCRIPTION,
    skillSet: JOB_SKILLS,
  },
  {
    id: "2",
    title: "Job Title",
    location: "Coimbatore",
    experience: "2 - 3 years",
    type: "Full Time",
    salary: "₹200,000.00 - ₹300,000.00 per year",
    skills: "JavaScript, HTML, CSS, and JSX",
    description: JOB_DESCRIPTION,
    skillSet: JOB_SKILLS,
  },
  {
    id: "3",
    title: "Job Title",
    location: "Coimbatore",
    experience: "2 - 3 years",
    type: "Full Time",
    salary: "₹200,000.00 - ₹300,000.00 per year",
    skills: "JavaScript, HTML, CSS, and JSX",
    description: JOB_DESCRIPTION,
    skillSet: JOB_SKILLS,
  },
];

export const LOREM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
