"use client";

import { login } from "@/src/services/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await login(email, password);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.access_token);
      }

      router.push("/tasks");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-300">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-sm text-gray-700">Faça login para continuar</p>
        </header>

        {error && (
          <p className="text-red-600 text-sm text-center font-semibold mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Senha
            </label>
            <input
              type="password"
              className="w-full border border-gray-400 rounded px-3 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Botão Criar Usuário */}
        <div className="mt-6 border-t pt-4">
          <p className="text-center text-gray-700 text-sm mb-2">
            Ainda não tem usuário?
          </p>
          <button
            className="w-full border border-green-600 text-green-700 font-semibold py-2 rounded-md text-sm hover:bg-green-50 transition"
            onClick={() => router.push("/register")}
          >
            Criar novo usuário
          </button>
        </div>
      </div>
    </main>
  );
}
