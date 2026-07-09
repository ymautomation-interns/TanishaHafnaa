import { useState } from "react";

import EmployeeCardSection from "./sections/01-EmployeeCard.jsx";
import CounterSection from "./sections/02-Counter.jsx";
import LoginFormSection from "./sections/03-LoginForm.jsx";
import ThemeToggleSection from "./sections/04-ThemeToggle.jsx";
import TodoAppSection from "./sections/05-TodoApp.jsx";
import EmployeeListSection from "./sections/06-EmployeeList.jsx";
import SearchFilterSection from "./sections/07-SearchFilter.jsx";
import StatusBadgesSection from "./sections/08-StatusBadges.jsx";
import ReusableComponentsSection from "./sections/09-ReusableComponents.jsx";
import FetchUsersSection from "./sections/10-FetchUsers.jsx";

const sections = [
  { title: "Employee Card", Component: EmployeeCardSection },
  { title: "Counter", Component: CounterSection },
  { title: "Login Form", Component: LoginFormSection },
  { title: "Theme Toggle", Component: ThemeToggleSection },
  { title: "Todo App", Component: TodoAppSection },
  { title: "Employee List", Component: EmployeeListSection },
  { title: "Search Filter", Component: SearchFilterSection },
  { title: "Status Badges", Component: StatusBadgesSection },
  { title: "Button & Input", Component: ReusableComponentsSection },
  { title: "Fetch Users", Component: FetchUsersSection },
];

export default function App() {
  const [active, setActive] = useState(0);
  const Active = sections[active].Component;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 h-screen w-56 shrink-0 border-r border-slate-200 bg-white px-3 py-6">
          <p className="px-3 font-mono text-[11px] tracking-widest text-slate-400 mb-4">REACT PRACTICE</p>
          <nav className="space-y-0.5">
            {sections.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  active === i ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={`font-mono text-[10px] w-5 ${active === i ? "text-indigo-500" : "text-slate-300"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </button>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-10 py-10">
          <Active />
        </main>
      </div>
    </div>
  );
}
