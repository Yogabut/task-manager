const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  token?: string;
}

export interface ProjectDTO {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  leaderId?: string | { _id?: string };
  memberIds?: Array<string | { _id?: string }>;
  startDate?: string;
  endDate?: string;
  progress?: number;
  category?: string;
  color?: string;
}

export interface TaskDTO {
  _id: string;
  title: string;
  description?: string;
  projectId?: string | ProjectDTO;
  priority?: string;
  status?: string;
  assigneeIds?: Array<string | { _id?: string }>;
  dueDate?: string;
  checklist?: unknown[];
  comments?: unknown[];
}

async function request<T>(path: string, opts: { method?: HttpMethod; body?: unknown; token?: string; params?: Record<string, unknown> } = {}): Promise<T> {
  const { method = 'GET', body, token, params } = opts;
  let url = `${API_BASE}${path}`;
  if (params) {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) s.append(k, String(v));
    });
    const qs = s.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (data && data.message) || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export const auth = {
  register: (payload: { name: string; email: string; password: string; role?: string }) =>
    request<UserDTO>('/auth/register', { method: 'POST', body: payload }),
  login: (payload: { email: string; password: string }) =>
    request<UserDTO>('/auth/login', { method: 'POST', body: payload }),
  getMe: (token: string) => request<UserDTO>('/auth/me', { method: 'GET', token }),
};

export const projects = {
  list: (token: string) => request<ProjectDTO[]>('/projects', { method: 'GET', token }),
  create: (token: string, body: Partial<ProjectDTO>) => request<ProjectDTO>('/projects', { method: 'POST', token, body }),
  update: (token: string, id: string, body: Partial<ProjectDTO>) => request<ProjectDTO>(`/projects/${id}`, { method: 'PUT', token, body }),
  remove: (token: string, id: string) => request<{ message: string }>(`/projects/${id}`, { method: 'DELETE', token }),
};

export const tasks = {
  list: (token: string, params?: Record<string, unknown>) => request<TaskDTO[]>('/tasks', { method: 'GET', token, params }),
  create: (token: string, body: Partial<TaskDTO>) => request<TaskDTO>('/tasks', { method: 'POST', token, body }),
  update: (token: string, id: string, body: Partial<TaskDTO>) => request<TaskDTO>(`/tasks/${id}`, { method: 'PUT', token, body }),
  remove: (token: string, id: string) => request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE', token }),
};

export const users = {
  list: (token: string) => request<UserDTO[]>('/users', { method: 'GET', token }),
  create: (token: string, body: Partial<UserDTO>) => request<UserDTO>('/users', { method: 'POST', token, body }),
  update: (token: string, id: string, body: Partial<UserDTO>) => request<UserDTO>(`/users/${id}`, { method: 'PUT', token, body }),
  remove: (token: string, id: string) => request<{ message: string }>(`/users/${id}`, { method: 'DELETE', token }),
};

export const calendar = {
  list: (token: string) => request<{ projects: ProjectDTO[]; tasks: TaskDTO[] }>('/calendar', { method: 'GET', token }),
};

export default { auth, projects, tasks, users, calendar };
