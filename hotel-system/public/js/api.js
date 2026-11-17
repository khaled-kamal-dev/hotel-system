// Nile House API Client
const API = (function () {
  'use strict';

  const BASE_URL = '/api';
  const TOKEN_KEY = 'nile_house_jwt_token';
  const USER_KEY = 'nile_house_user_data';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setSession(token, user) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  async function request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          clearSession();
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  return {
    getToken,
    getUser,
    setSession,
    clearSession,

    // Auth
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.token) {
        setSession(data.token, data.user);
      }
      return data;
    },

    async register(name, email, password, phone) {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone })
      });
      if (data.token) {
        setSession(data.token, data.user);
      }
      return data;
    },

    async getMe() {
      return request('/auth/me');
    },

    // Rooms
    async getRooms(params = {}) {
      const query = new URLSearchParams();
      if (params.checkIn) query.append('checkIn', params.checkIn);
      if (params.checkOut) query.append('checkOut', params.checkOut);
      if (params.type && params.type !== 'Any') query.append('type', params.type);
      const q = query.toString() ? `?${query.toString()}` : '';
      return request(`/rooms${q}`);
    },

    async updateRoomStatus(roomId, newStatus) {
      return request(`/rooms/${roomId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ newStatus })
      });
    },

    async getRoomStatusLog() {
      return request('/rooms/status-log');
    },

    // Reservations
    async createReservation(payload) {
      return request('/reservations', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async getMyReservations() {
      return request('/reservations/my');
    },

    async getReservation(id) {
      return request(`/reservations/${id}`);
    },

    async cancelReservation(id) {
      return request(`/reservations/${id}/cancel`, {
        method: 'PUT'
      });
    },

    async modifyReservation(id, newCheckInDate, newCheckOutDate) {
      return request(`/reservations/${id}/modify`, {
        method: 'PUT',
        body: JSON.stringify({ newCheckInDate, newCheckOutDate })
      });
    },

    async checkInGuest(reservationId) {
      return request(`/reservations/${reservationId}/check-in`, {
        method: 'POST'
      });
    },

    async checkOutGuest(reservationId, paymentMethod = 'Credit Card') {
      return request(`/reservations/${reservationId}/check-out`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod })
      });
    },

    async getDeskBoard() {
      return request('/reservations/desk/board');
    },

    // Payments
    async processPayment(reservationId, amount, method, cardInfo) {
      return request('/payments/process', {
        method: 'POST',
        body: JSON.stringify({ reservationId, amount, method, cardInfo })
      });
    },

    // Room Service
    async getMenu() {
      return request('/room-service/menu');
    },

    async placeRoomServiceOrder(reservationId, items, totalPrice) {
      return request('/room-service/order', {
        method: 'POST',
        body: JSON.stringify({ reservationId, items, totalPrice })
      });
    },

    async updateOrderStatus(orderId, status) {
      return request(`/room-service/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    },

    // Reviews
    async submitReview(reservationId, rating, comment) {
      return request('/reviews', {
        method: 'POST',
        body: JSON.stringify({ reservationId, rating, comment })
      });
    },

    async getReviews() {
      return request('/reviews');
    },

    // Chatbot
    async sendChatMessage(message) {
      return request('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
    },

    async getChatHistory() {
      return request('/chatbot/history');
    },

    async escalateChat() {
      return request('/chatbot/escalate', {
        method: 'POST'
      });
    },

    async getEscalatedChats() {
      return request('/chatbot/escalated');
    },

    async replyToChat(chatId, replyMessage) {
      return request(`/chatbot/${chatId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyMessage })
      });
    }
  };
})();
