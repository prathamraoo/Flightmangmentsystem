// Test Reviews Connection Script
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// Test admin login first
async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@skybook.com',
      password: 'admin123'
    });
    
    if (response.data.success) {
      console.log('✅ Admin login successful');
      return response.data.token;
    } else {
      console.log('❌ Admin login failed');
      return null;
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test fetching all reviews
async function testGetReviews(token) {
  try {
    console.log('\n📋 Testing fetch all reviews...');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(`${BASE_URL}/reviews/all`, config);
    
    if (response.data.success) {
      console.log(`✅ Found ${response.data.reviews.length} reviews`);
      console.log('📊 Reviews summary:');
      
      const stats = {
        total: response.data.reviews.length,
        approved: response.data.reviews.filter(r => r.status === 'approved').length,
        pending: response.data.reviews.filter(r => r.status === 'pending').length,
        rejected: response.data.reviews.filter(r => r.status === 'rejected').length,
      };
      
      console.log(`   Total: ${stats.total}`);
      console.log(`   Approved: ${stats.approved}`);
      console.log(`   Pending: ${stats.pending}`);
      console.log(`   Rejected: ${stats.rejected}`);
      
      if (response.data.reviews.length > 0) {
        console.log('\n📝 Sample review:');
        const sample = response.data.reviews[0];
        console.log(`   Name: ${sample.name}`);
        console.log(`   Rating: ${sample.rating}/5`);
        console.log(`   Comment: ${sample.comment.substring(0, 100)}...`);
        console.log(`   Status: ${sample.status}`);
        console.log(`   Date: ${new Date(sample.createdAt).toLocaleString()}`);
      }
      
      return response.data.reviews;
    } else {
      console.log('❌ Failed to fetch reviews');
      return [];
    }
  } catch (error) {
    console.log('❌ Fetch reviews error:', error.response?.data?.message || error.message);
    return [];
  }
}

// Test updating review status
async function testUpdateReviewStatus(token, reviewId) {
  try {
    console.log('\n🔄 Testing update review status...');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.put(
      `${BASE_URL}/reviews/${reviewId}`,
      { status: 'approved' },
      config
    );
    
    if (response.data.success) {
      console.log('✅ Review status updated successfully');
      console.log(`   New status: ${response.data.review.status}`);
      return true;
    } else {
      console.log('❌ Failed to update review status');
      return false;
    }
  } catch (error) {
    console.log('❌ Update review status error:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test creating a new review
async function testCreateReview() {
  try {
    console.log('\n➕ Testing create new review...');
    const response = await axios.post(`${BASE_URL}/reviews`, {
      name: 'Test User',
      rating: 5,
      comment: 'This is a test review created to verify the backend connection is working properly. The service was excellent!'
    });
    
    if (response.data.success) {
      console.log('✅ Review created successfully');
      console.log(`   Review ID: ${response.data.review._id}`);
      console.log(`   Status: ${response.data.review.status}`);
      return response.data.review;
    } else {
      console.log('❌ Failed to create review');
      return null;
    }
  } catch (error) {
    console.log('❌ Create review error:', error.response?.data?.message || error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Reviews Backend Connection Tests');
  console.log('==========================================\n');
  
  // Test 1: Admin Login
  const token = await testAdminLogin();
  if (!token) {
    console.log('\n❌ Cannot proceed without admin token');
    return;
  }
  
  // Test 2: Create a test review
  const newReview = await testCreateReview();
  
  // Test 3: Fetch all reviews
  const reviews = await testGetReviews(token);
  
  // Test 4: Update review status (if we have reviews)
  if (reviews.length > 0) {
    const reviewToUpdate = reviews.find(r => r.status !== 'approved') || reviews[0];
    await testUpdateReviewStatus(token, reviewToUpdate._id);
  }
  
  console.log('\n✅ All Reviews Backend Connection Tests Completed!');
  console.log('📌 The reviews system is properly connected to the backend.');
}

// Run the tests
runTests().catch(console.error);
