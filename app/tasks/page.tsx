"use client";

import {
  Task,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/src/services/api";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function ensureAuth() {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }

  async function loadTasks() {
    try {
      setLoadingList(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tasks");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    ensureAuth();
    loadTasks();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoadingForm(true);
      setError(null);

      if (editingId) {
        await updateTask(editingId, { title, description });
      } else {
        await createTask({ title, description });
      }

      resetForm();
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar task");
      console.log(err.message);
    } finally {
      setLoadingForm(false);
    }
  }

  function handleEdit(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir esta task?")) return;

    try {
      setLoadingForm(true);
      setError(null);
      await deleteTask(id);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir task");
    } finally {
      setLoadingForm(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Gerenciador de Tasks
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-red-600 font-semibold hover:text-red-700 transition"
        >
          <FiLogOut size={18} /> Sair
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiPlusCircle size={20} />
            {editingId ? "Editar Task" : "Criar Nova Task"}
          </h2>

          {error && <p className="text-red-600 mb-3 font-medium">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Título
              </label>
              <input
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da task"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Descrição
              </label>
              <textarea
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-black h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição"
                required
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loadingForm}
                className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-60"
              >
                {loadingForm
                  ? "Salvando..."
                  : editingId
                  ? "Atualizar"
                  : "Criar"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-400 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>

          {loadingList && (
            <p className="text-gray-500 text-sm">Carregando...</p>
          )}

          {!loadingList && tasks.length === 0 && (
            <p className="text-gray-600 text-sm">Nenhuma task cadastrada.</p>
          )}

          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition group flex justify-between items-start gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="text-blue-600" size={16} />
                    </div>
                    <span className="font-medium">
                      {task.userName || "Usuário desconhecido"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-400">
                      Created: {task.userName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex items-center justify-center gap-1  hover:bg-yellow-200 text-yellow-800 font-semibold px-3 py-1 rounded-md text-xs transition"
                    title="Editar"
                  >
                    <FiEdit size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex items-center justify-center gap-1 bg-red-200 hover:bg-red-500 text-white font-semibold px-3 py-1 rounded-md text-xs transition"
                    title="Excluir"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
