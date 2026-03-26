import axios from 'axios';

const testReviewsWithAuth = async () => {
  try {
    console.log('Testing review functionality with authentication...');
    
    // First, login to get a token
    console.log('\n1. Logging in to get token...');
    const loginResponse = await axios.post('http://localhost:8000/auth/login', {
      useremail: 'admin@skybook.com',
      userpassword: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token');
    
    // Test 1: Get all reviews
    console.log('\n2. Fetching reviews...');
    const getResponse = await axios.get('http://localhost:8000/reviews');
    console.log('✅ Get reviews response:', getResponse.data);
    
    // Test 2: Submit a review with authentication
    console.log('\n3. Submitting a review with authentication...');
    const reviewData = {
      name: 'Test User',
      rating: 5,
      comment: 'This is a test review from the backend test script with auth!'
    };
    
    const postResponse = await axios.post('http://localhost:8000/reviews', reviewData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Submit review response:', postResponse.data);
    
    // Test 3: Verify the review was added
    console.log('\n4. Verifying review was added...');
    const verifyResponse = await axios.get('http://localhost:8000/reviews');
    console.log('✅ Updated reviews list:', verifyResponse.data);
    
  } catch (error) {
    console.error('❌ Review test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testReviewsWithAuth();
