export const Registration = async (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch('http://localhost:5000/api/auth/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  };
  
  export const login = async (userData: { email: string; password: string }) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  };