import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    const response = await axios.post('http://localhost:8000/auth/login', {
      useremail: 'admin@skybook.com',
      userpassword: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
    if (response.data.success) {
      console.log('Token:', response.data.token);
      console.log('Role:', response.data.role);
    }
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAdminLogin();
