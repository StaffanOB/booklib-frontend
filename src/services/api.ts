import axios from 'axios';

const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'http://booklib-api:5000'  // Container network
  : '/api'; // Local development via Vite proxy

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export interface Book {
  id: number;
  title: string;
  author?: string;
  description?: string;
  isbn?: string;
  publish_year?: number | null;
  series?: string | null;
  cover_url?: string | null;
  tags?: string[];
}

export interface Review {
  id: number;
  book_id: number;
  user_id: number;
  username: string;
  review_text: string;
  reading_format: 'paperback' | 'audiobook' | 'ebook';
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  user_id: number;
  rating: number;
}

export interface Comment {
  id: number;
  user_id: number;
  text: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/users/login', { username, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post('/users/register', { username, email, password }),
};

// Books API
export const booksAPI = {
  getAll: () => api.get<Book[]>('/books'),
  
  getById: (id: number) => api.get<Book>(`/books/${id}`),
  
  getFull: (id: number) => api.get(`/books/${id}/full`),
  
  create: (book: Partial<Book>) => api.post('/books', book),
  
  update: (id: number, book: Partial<Book>) => api.put(`/books/${id}`, book),
  
  delete: (id: number) => api.delete(`/books/${id}`),
  
  recheck: (id: number, plugin?: string) => 
    api.post(`/books/${id}/recheck`, { plugin }),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get<Review[]>('/reviews'),
  
  getById: (id: number) => api.get<Review>(`/reviews/${id}`),
  
  getByBook: (bookId: number) => api.get<Review[]>(`/reviews/book/${bookId}`),
  
  getByUser: (userId: number) => api.get<Review[]>(`/reviews/user/${userId}`),
  
  create: (review: { book_id: number; review_text: string; reading_format: 'paperback' | 'audiobook' | 'ebook' }) =>
    api.post<Review>('/reviews', review),
  
  update: (id: number, review: { review_text?: string; reading_format?: 'paperback' | 'audiobook' | 'ebook' }) =>
    api.put<Review>(`/reviews/${id}`, review),
  
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

// Ratings API
export const ratingsAPI = {
  getAverage: (bookId: number) => api.get<{ average: number | null }>(`/books/${bookId}/ratings`),
  
  create: (bookId: number, rating: number) => 
    api.post(`/books/${bookId}/ratings`, { rating }),
  
  update: (bookId: number, ratingId: number, rating: number) =>
    api.put(`/books/${bookId}/ratings/${ratingId}`, { rating }),
  
  delete: (bookId: number, ratingId: number) =>
    api.delete(`/books/${bookId}/ratings/${ratingId}`),
};

// Comments API
export const commentsAPI = {
  getByBook: (bookId: number) => api.get<Comment[]>(`/books/${bookId}/comments`),
  
  create: (bookId: number, text: string) =>
    api.post(`/books/${bookId}/comments`, { text }),
  
  update: (bookId: number, commentId: number, text: string) =>
    api.put(`/books/${bookId}/comments/${commentId}`, { text }),
  
  delete: (bookId: number, commentId: number) =>
    api.delete(`/books/${bookId}/comments/${commentId}`),
};

export default api;
