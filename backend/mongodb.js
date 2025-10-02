// mongodb.js - MongoDB integration for Medilocker
const API_URL = 'http://localhost:5000/api';

class MongoDBService {
  // Save user registration
  static async saveUser(userData) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.username,
          email: userData.email || `${userData.username}@medilocker.com`,
          message: 'User registered via Medilocker'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('MongoDB Save Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Save hospital search
  static async saveSearch(hospitalName, state, action) {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Hospital Search',
          email: 'search@medilocker.com',
          message: `${action}: ${hospitalName} in ${state} at ${new Date().toLocaleString()}`
        })
      });
      return await response.json();
    } catch (error) {
      console.error('MongoDB Search Save Error:', error);
    }
  }

  // Get all user data (for admin purposes)
  static async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`);
      return await response.json();
    } catch (error) {
      console.error('MongoDB Fetch Error:', error);
      return [];
    }
  }
}