
export const requestPasswordForgot = async (email: string) => {
  const response = await fetch('http://192.168.86.97:5000/users/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const requestPasswordReset = async (token: string, newPassword: string) => {
    const response = await  fetch('http://192.168.86.97:5000/users/reset-password', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json'},
       body: JSON.stringify({ token, newPassword}),
    });  

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.json();
    return data;
  };
  
export const Registration = async (userData: {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}) => {
  const response = await fetch('http://192.168.86.97:5000/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await fetch('http://192.168.86.97:5000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
