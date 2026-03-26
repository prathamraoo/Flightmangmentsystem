// API Configuration
export const API_BASE_URL = "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    CREATE: `${API_BASE_URL}/users/create`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_ONE: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/delete/${id}`,
  },
  
  // Airports
  AIRPORTS: {
    BASE: `${API_BASE_URL}/airports`,
    CREATE: `${API_BASE_URL}/airports/create`,
    GET_ALL: `${API_BASE_URL}/airports`,
    UPDATE: (id) => `${API_BASE_URL}/airports/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/airports/delete/${id}`,
  },
  
  // Flights
  FLIGHTS: {
    BASE: `${API_BASE_URL}/flights`,
    CREATE: `${API_BASE_URL}/flights/create`,
    GET_ALL: `${API_BASE_URL}/flights`,
    UPDATE: (id) => `${API_BASE_URL}/flights/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/flights/delete/${id}`,
  },
  
  // Bookings
  BOOKINGS: {
    BASE: `${API_BASE_URL}/bookings`,
    BOOK: `${API_BASE_URL}/bookings/book`,
    GET_ALL: `${API_BASE_URL}/bookings`,
    GET_ONE: (id) => `${API_BASE_URL}/bookings/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/bookings/status/${id}`,
    DELETE: (id) => `${API_BASE_URL}/bookings/delete/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    BASE: `${API_BASE_URL}/payments`,
    PROCESS: `${API_BASE_URL}/payments/process`,
    PAY: `${API_BASE_URL}/payments/pay`,
    GET_ALL: `${API_BASE_URL}/payments`,
    BY_BOOKING: (bookingId) => `${API_BASE_URL}/payments/booking/${bookingId}`,
    BY_TRANSACTION: (transactionId) => `${API_BASE_URL}/payments/transaction/${transactionId}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/payments/${id}/status`,
    DELETE: (id) => `${API_BASE_URL}/payments/delete/${id}`,
  },
  
  // Tickets
  TICKETS: {
    BASE: `${API_BASE_URL}/tickets`,
    MY_TICKETS: `${API_BASE_URL}/tickets/my-tickets`,
    GET_ONE: (id) => `${API_BASE_URL}/tickets/${id}`,
    DELETE: (id) => `${API_BASE_URL}/tickets/delete/${id}`,
  },
  
  // Reviews
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
    GET_ALL: `${API_BASE_URL}/reviews`,
    GET_ALL_ADMIN: `${API_BASE_URL}/reviews/all`,
    CREATE: `${API_BASE_URL}/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`,
  },
  
  // Seats
  SEATS: {
    BASE: `${API_BASE_URL}/seats`,
    BY_FLIGHT: (flightId) => `${API_BASE_URL}/seats/flight/${flightId}`,
    BOOK: `${API_BASE_URL}/seats/book`,
    RELEASE: (bookingId) => `${API_BASE_URL}/seats/release/${bookingId}`,
    STATS: (flightId) => `${API_BASE_URL}/seats/stats/${flightId}`,
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Helper function to get auth config with custom headers
export const getAuthConfig = (customHeaders = {}) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...customHeaders,
    },
  };
};
