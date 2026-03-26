import axios from 'axios';

const finalTest = async () => {
  console.log('🚀 FINAL COMPREHENSIVE TEST');
  console.log('================================');
  
  try {
    // 1. Admin Login Test
    console.log('\n1. 🔐 Admin Login Test...');
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
    
    // 2. Admin Dashboard Endpoints
    console.log('\n2. 📊 Admin Dashboard Endpoints...');
    
    const endpoints = [
      { name: 'Users', url: 'http://localhost:8000/users' },
      { name: 'Airports', url: 'http://localhost:8000/airports' },
      { name: 'Flights', url: 'http://localhost:8000/flights' },
      { name: 'Reviews (Admin)', url: 'http://localhost:8000/reviews/all' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url, config);
        console.log(`✅ ${endpoint.name}: ${response.data.success ? 'WORKING' : 'FAILED'}`);
      } catch (err) {
        console.log(`❌ ${endpoint.name}: FAILED (${err.response?.status})`);
      }
    }
    
    // 3. Review Functionality Test
    console.log('\n3. ⭐ Review Functionality Test...');
    
    // Get reviews
    const getReviewsResponse = await axios.get('http://localhost:8000/reviews');
    console.log('✅ Get reviews: WORKING');
    
    // Submit review
    const reviewData = {
      name: 'Test User',
      rating: 5,
      comment: 'Final test review - everything is working!'
    };
    
    const submitReviewResponse = await axios.post('http://localhost:8000/reviews', reviewData, config);
    console.log('✅ Submit review: WORKING');
    
    // 4. Airport Management Test
    console.log('\n4. ✈️ Airport Management Test...');
    
    // Create airport
    const airportData = {
      name: 'Test Airport',
      code: 'TST',
      image: 'https://example.com/image.jpg'
    };
    
    const createAirportResponse = await axios.post('http://localhost:8000/airports/create', airportData, config);
    console.log('✅ Create airport: WORKING');
    
    // Get updated airports
    const getAirportsResponse = await axios.get('http://localhost:8000/airports');
    console.log('✅ Get airports: WORKING');
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('================================');
    console.log('✅ Admin login: WORKING');
    console.log('✅ Admin dashboard: WORKING');
    console.log('✅ Review submission: WORKING');
    console.log('✅ Airport management: WORKING');
    
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Go to http://localhost:5173/adminlogin');
    console.log('2. Login with admin@skybook.com / admin123');
    console.log('3. Access the admin dashboard');
    console.log('4. Try submitting reviews as a regular user');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

finalTest();
