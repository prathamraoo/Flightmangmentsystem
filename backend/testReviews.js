import axios from 'axios';

const testReviews = async () => {
  try {
    console.log('Testing review functionality...');
    
    // Test 1: Get all reviews
    console.log('\n1. Fetching reviews...');
    const getResponse = await axios.get('http://localhost:8000/reviews');
    console.log('✅ Get reviews response:', getResponse.data);
    
    // Test 2: Submit a review
    console.log('\n2. Submitting a review...');
    const reviewData = {
      name: 'Test User',
      rating: 5,
      comment: 'This is a test review from the backend test script!'
    };
    
    const postResponse = await axios.post('http://localhost:8000/reviews', reviewData);
    console.log('✅ Submit review response:', postResponse.data);
    
    // Test 3: Verify the review was added
    console.log('\n3. Verifying review was added...');
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

testReviews();
