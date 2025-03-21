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
 console.log('Sending login request to:', userData)
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
    const response = await fetch('http://192.168.86.70:3000/product/productId', {
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
    const response = await fetch('http://192.168.86.70:3000/plan/plans', {
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
    const response = await fetch(`http://192.168.86.70:3000/plan/product/${productId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Retourne les plans groupés par billing_cycle
  } catch (error) {
    console.error('Failed to fetch plan by product ID:', error);
    throw error;
  }
};

export const createSubscription = async (subscriptionData: {
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: string;
}) => {
  console.log('Sending subscription data:', subscriptionData); // Log des données envoyées

  try {
    const response = await fetch('http://192.168.86.70:3000/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    });

    console.log('API response status:', response.status); // Log du statut de la réponse

    if (!response.ok) {
      const errorData = await response.json(); // Récupérer les détails de l'erreur
      console.error('API error response:', errorData); // Log des erreurs de l'API
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const data = await response.json();
    console.log('API success response:', data); // Log de la réponse réussie
    return data;
  } catch (error) {
    console.error('Error in createSubscription:', error); // Log des erreurs générales
    throw error;
  }
};