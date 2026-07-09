import { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";
import Panel from "../components/Panel.jsx";
import Button from "../components/Button.jsx";

export default function TodoAppSection() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Review pull request", done: true },
    { id: 2, text: "Write component tests", done: false },
  ]);
  const [text, setText] = useState("");

  function addTodo(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((t) => [...t, { id: Date.now(), text: text.trim(), done: false }]);
    setText("");
  }
  function toggleTodo(id) {
    setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  }
  function deleteTodo(id) {
    setTodos((t) => t.filter((todo) => todo.id !== id));
  }

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <Panel
      eyebrow="05 / LISTS"
      title="Todo App"
      description="Add, complete, and delete items — each action updates state immutably."
      note="Every toggle re-renders the whole list here; for large lists, memoize each row to limit re-renders to the changed item."
    >
      <div className="max-w-md rounded-xl border border-slate-200 bg-white p-5">
        <form onSubmit={addTodo} className="mb-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <Button type="submit" icon={Plus}>
            Add
          </Button>
        </form>
        <ul className="space-y-1.5">
          {todos.length === 0 && <p className="py-6 text-center text-sm text-slate-400">Nothing here yet.</p>}
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
                  todo.done ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300"
                }`}
              >
                {todo.done && <Check size={12} />}
              </button>
              <span className={`flex-1 text-sm ${todo.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
        {todos.length > 0 && <p className="mt-3 text-xs text-slate-400">{remaining} of {todos.length} remaining</p>}
      </div>
    </Panel>
  );
}
