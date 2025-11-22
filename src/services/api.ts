const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não definida no .env.local");
}

// ==================== AUTH ====================

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("E-mail ou senha inválidos");
  }

  return res.json() as Promise<{ access_token: string }>;
}

// ==================== TASKS ====================

export type Task = {
  id: string;
  title: string;
  description: string;
  userName: string;
};

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/task`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar tasks");
  }

  return res.json();
}

export async function createTask(data: { title: string; description: string }) {
  const res = await fetch(`${API_URL}/task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar task");
  }

  return res.json();
}

export async function updateTask(
  id: string,
  data: { title: string; description: string }
) {
  const res = await fetch(`${API_URL}/task/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar task");
  }

  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_URL}/task/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir task");
  }

  return res.json();
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erro ao criar usuário");
  }

  return res.json();
}
