import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Header from '../layout/header/header';
import { verifyPaymentStatus } from '../services/authService';
import { Spinner } from 'react-bootstrap';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const transactionId = searchParams.get('id');
  const status = searchParams.get('status');

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        if (!transactionId || !status) {
          throw new Error('Missing payment parameters');
        }

        const response = await verifyPaymentStatus(transactionId, status);
        setPaymentDetails(response);
      } catch (err) {
        console.error('Failed to verify payment:', err);
        setError(err.message || 'Failed to verify payment');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [transactionId, status]);

  const handleNavigation = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p>Finalizing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5">
        <h4>Payment Verification Error</h4>
        <p>{error}</p>
        <Button variant="primary" onClick={handleNavigation}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f0f4f6', minHeight: '100vh' }}>
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Header toggleSidebar={() => {}} />
      </div>
      
      <div className="text-center p-5" style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        marginTop: '80px',
        position: 'relative'
      }}>
        <IoMdCheckmarkCircleOutline 
          style={{ color: '#28a745', fontSize: '4rem', marginBottom: '1rem' }} 
        />
        <h1 style={{ color: '#000', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Payment Successful
        </h1>
        
        <p style={{ color: '#6c757d', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Thank you for your payment. Your transaction has been completed successfully.
        </p>

        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '0.25rem',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: '0.5rem 0' }}><strong>Transaction ID:</strong> {transactionId || 'N/A'}</p>
        </div>

        <Button 
          variant="success" 
          onClick={handleNavigation} 
          style={{ 
            backgroundColor: '#28a745', 
            borderColor: '#28a745', 
            padding: '0.75rem 3rem', 
            fontSize: '1rem', 
            fontWeight: 'bold',
            borderRadius: '0.5rem' 
          }}
        >
          GO TO DASHBOARD
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;