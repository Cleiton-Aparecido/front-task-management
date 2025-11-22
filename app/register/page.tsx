"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/services/api";
export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await registerUser({
        name,
        email,
        password,
        admin: isAdmin,
      });

      setSuccess("Usuário criado com sucesso! Você já pode fazer login.");
      setName("");
      setEmail("");
      setPassword("");
      setIsAdmin(false);
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-300">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
          <p className="text-sm text-gray-700">
            Cadastre um usuário admin ou normal
          </p>
        </header>

        {error && (
          <p className="text-red-600 text-sm text-center font-semibold mb-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center font-semibold mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fulano de Tal"
              required
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
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
              className="w-full border border-gray-400 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Tipo de usuário: Admin ou normal */}
          <div>
            <span className="block text-sm font-semibold text-gray-800 mb-1">
              Tipo de usuário
            </span>

            <div className="flex items-center gap-3 text-sm text-gray-900">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="role"
                  checked={!isAdmin}
                  onChange={() => setIsAdmin(false)}
                />
                Usuário normal
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="role"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(true)}
                />
                Administrador
              </label>
            </div>
          </div>

          {/* Botão salvar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md text-sm transition"
          >
            {loading ? "Salvando..." : "Criar usuário"}
          </button>
        </form>

        {/* Voltar para login */}
        <div className="mt-6 border-t pt-4">
          <p className="text-center text-gray-700 text-sm mb-2">
            Já tem conta?
          </p>
          <button
            className="w-full border border-blue-600 text-blue-700 font-semibold py-2 rounded-md text-sm hover:bg-blue-50 transition"
            onClick={() => router.push("/login")}
          >
            Voltar para login
          </button>
        </div>
      </div>
    </main>
  );
}
