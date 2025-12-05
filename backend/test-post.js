// Simple test script for POST requests
// Run with: node test-post.js

const testRegister = async () => {
  const url = 'http://localhost:5000/api/auth/register';
  
  // Test data - change email each time you test
  const testData = {
    name: "Test User",
    email: `test${Date.now()}@example.com`, // Unique email each time
    password: "test123456",
    role: "consumer",
    phone: "1234567890",
    address: {
      street: "123 Test St",
      city: "Test City",
      state: "Test State",
      zipCode: "12345"
    }
  };

  try {
    console.log('Testing POST /api/auth/register');
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log('\nResponse Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Success! User registered.');
    } else {
      console.log('\n❌ Error:', data.message);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.log('\nMake sure the server is running on http://localhost:5000');
  }
};

const testLogin = async () => {
  const url = 'http://localhost:5000/api/auth/login';
  
  const testData = {
    email: "test@example.com", // Use an existing email
    password: "test123456",
  };

  try {
    console.log('\n\nTesting POST /api/auth/login');
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log('\nResponse Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Success! User logged in.');
      console.log('Token:', data.token);
    } else {
      console.log('\n❌ Error:', data.message);
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
};

// Run tests
console.log('🚀 Starting POST request tests...\n');
testRegister();
// Uncomment to test login:
// testLogin();


