import axios from 'axios';

const testAdminDashboard = async () => {
  try {
    console.log('Testing admin dashboard functionality...');
    
    // First, login as admin to get token
    console.log('\n1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:8000/auth/login', {
      useremail: 'admin@skybook.com',
      userpassword: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    // Test 2: Get users
    console.log('\n2. Testing users endpoint...');
    try {
      const usersResponse = await axios.get('http://localhost:8000/users', config);
      console.log('✅ Users endpoint works:', usersResponse.data.success ? 'YES' : 'NO');
    } catch (err) {
      console.log('❌ Users endpoint failed:', err.response?.status || err.message);
    }
    
    // Test 3: Get airports
    console.log('\n3. Testing airports endpoint...');
    try {
      const airportsResponse = await axios.get('http://localhost:8000/airport/view', config);
      console.log('✅ Airports endpoint works:', airportsResponse.data.success ? 'YES' : 'NO');
    } catch (err) {
      console.log('❌ Airports endpoint failed:', err.response?.status || err.message);
    }
    
    // Test 4: Get flights
    console.log('\n4. Testing flights endpoint...');
    try {
      const flightsResponse = await axios.get('http://localhost:8000/flights', config);
      console.log('✅ Flights endpoint works:', flightsResponse.data.success ? 'YES' : 'NO');
    } catch (err) {
      console.log('❌ Flights endpoint failed:', err.response?.status || err.message);
    }
    
    // Test 5: Get all reviews (admin)
    console.log('\n5. Testing admin reviews endpoint...');
    try {
      const reviewsResponse = await axios.get('http://localhost:8000/reviews/all', config);
      console.log('✅ Admin reviews endpoint works:', reviewsResponse.data.success ? 'YES' : 'NO');
    } catch (err) {
      console.log('❌ Admin reviews endpoint failed:', err.response?.status || err.message);
    }
    
    console.log('\n✅ Admin dashboard test completed!');
    
  } catch (error) {
    console.error('❌ Admin dashboard test failed:', error.message);
  }
};

testAdminDashboard();
