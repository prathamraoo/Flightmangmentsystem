import axios from 'axios';

const testAirportEndpoint = async () => {
  try {
    console.log('Testing airport endpoints...');
    
    // Test 1: Get airports without auth
    console.log('\n1. Testing GET /airports (no auth)...');
    try {
      const response = await axios.get('http://localhost:8000/airports');
      console.log('✅ GET /airports response:', response.data);
    } catch (err) {
      console.log('❌ GET /airports failed:', err.response?.status, err.response?.data);
    }
    
    // Test 2: Test with auth
    console.log('\n2. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:8000/auth/login', {
      useremail: 'admin@skybook.com',
      userpassword: 'admin123'
    });
    
    const token = loginResponse.data.token;
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    console.log('\n3. Testing GET /airports (with auth)...');
    try {
      const response = await axios.get('http://localhost:8000/airports', config);
      console.log('✅ GET /airports with auth response:', response.data);
    } catch (err) {
      console.log('❌ GET /airports with auth failed:', err.response?.status, err.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAirportEndpoint();
