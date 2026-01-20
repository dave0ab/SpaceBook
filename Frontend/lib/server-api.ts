import { cookies } from 'next/headers';
import axios from 'axios';
import https from 'https';
import { API_CONFIG } from './api.config';

export async function getServerApiClient() {
    const cookieStore = await cookies();
    const token = cookieStore.get('spacebook_access_token')?.value;

    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // Bypassing SSL certificate validation for server-side requests (DuckDNS/Dev environment)
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });

    return instance;
}

export async function fetchAdminBookings() {
    const api = await getServerApiClient();
    const response = await api.get(API_CONFIG.ENDPOINTS.BOOKINGS.BASE);
    return response.data;
}

export async function fetchBookings(params: { status?: string; userId?: string; date?: string } = {}) {
    const api = await getServerApiClient();
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.date) queryParams.append('date', params.date);

    const url = queryParams.toString()
        ? `${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}?${queryParams.toString()}`
        : API_CONFIG.ENDPOINTS.BOOKINGS.BASE;

    const response = await api.get(url);
    return response.data;
}

export async function fetchBookingCounts(startDate: string, endDate: string, userId?: string) {
    const api = await getServerApiClient();
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    if (userId) params.append('userId', userId);

    const response = await api.get(`${API_CONFIG.ENDPOINTS.BOOKINGS.BASE}/counts?${params.toString()}`);
    return response.data;
}

export async function fetchAdminUsers() {
    const api = await getServerApiClient();
    const response = await api.get(API_CONFIG.ENDPOINTS.USERS.BASE);
    return response.data;
}

export async function fetchAdminSpaces() {
    const api = await getServerApiClient();
    const response = await api.get(API_CONFIG.ENDPOINTS.SPACES.BASE);
    return response.data;
}

export async function fetchSpaces(type?: string) {
    const api = await getServerApiClient();
    const url = type ? `${API_CONFIG.ENDPOINTS.SPACES.BASE}?type=${type}` : API_CONFIG.ENDPOINTS.SPACES.BASE;
    const response = await api.get(url);
    return response.data;
}

export async function fetchCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('spacebook_access_token')?.value;

    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

        return {
            id: payload.sub,
            email: payload.email || '',
            name: payload.name || payload.email?.split('@')[0] || 'User',
            role: payload.role,
            status: payload.status || 'active',
            avatar: payload.avatar,
        };
    } catch (e) {
        return null;
    }
}
