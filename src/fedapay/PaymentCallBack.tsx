import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const reference = queryParams.get('id');
    const amount = queryParams.get('amount');

    if (status === 'success') {
      navigate('/payment-success', { 
        state: { 
          transaction: { reference, amount } 
        } 
      });
    } else if (status === 'canceled') {
      navigate('/add-new');
    } else {
      const errorMessage = queryParams.get('message') || 'Payment failed';
      navigate('/payment-error', { state: { error: errorMessage } });
    }
  }, [location, navigate]);

  return (
    <div className="text-center p-5">
      <Spinner animation="border" size="sm" className="me-2" />
      <h4>Processing your payment...</h4>
    </div>
  );
};

export default PaymentCallback;