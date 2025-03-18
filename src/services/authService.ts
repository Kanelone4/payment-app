export const requestPasswordForgot = async (email: string) => {
  const response = await fetch('http://192.168.86.70:3000/users/forgot-password', {
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
  const response = await fetch('http://192.168.86.70:3000/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
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
  const response = await fetch('http://192.168.86.70:3000/users/register', {
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
  const response = await fetch('http://192.168.86.70:3000/users/login', {
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

export const fetchProducts = async () => {
  try {
    const response = await fetch('http://192.168.86.70:5000/product/product', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

export const fetchPlans = async () => {
  try {
    const response = await fetch('http://192.168.86.70:5000/plan/plans', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    throw error;
  }
};

export const fetchPlanByProductId = async (productId: string) => {
  try {
    const response = await fetch(`http://192.168.86.70:5000/plan/product/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.plan;
  } catch (error) {
    console.error('Failed to fetch plan by product ID:', error);
    throw error;
  }
};
