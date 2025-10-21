// lib/services/daily-plans.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface DailyPlan {
  id: string;
  day: number; // 0-6 (Monday-Sunday)
  startTime: string; // ISO string
  endTime: string; // ISO string
  note?: string;
  userId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyPlanDto {
  day: number; // 0-6
  startTime: string; // ISO string
  endTime: string; // ISO string
  note?: string;
  taskId: string;
}

export interface UpdateDailyPlanDto {
  day?: number;
  startTime?: string;
  endTime?: string;
  note?: string;
}

class DailyPlansService {
  private getAuthToken(): string | null {

    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getAllByUser(id : string ): Promise<DailyPlan[]> {
    return this.request<DailyPlan[]>(`/daily-plans?userId=${id}`);
  }

  async getOne(id: string): Promise<DailyPlan> {
    return this.request<DailyPlan>(`/daily-plans/${id}`);
  }

  async create(dto: CreateDailyPlanDto): Promise<DailyPlan> {
    return this.request<DailyPlan>('/daily-plans', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async update(id: string, dto: UpdateDailyPlanDto): Promise<DailyPlan> {
    return this.request<DailyPlan>(`/daily-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  }

  async delete(id: string): Promise<void> {
    return this.request<void>(`/daily-plans/${id}`, {
      method: 'DELETE',
    });
  }

  async getReminder(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/daily-plans/reminder');
  }
}

export const dailyPlansService = new DailyPlansService();