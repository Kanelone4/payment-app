import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="text-center p-5 " style={{ maxWidth: '600px', margin: '0 auto',borderRadius: '0.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor:'white',
      marginTop:'130px' }}>
      <IoMdCheckmarkCircleOutline 
        style={{ 
          color: '#28a745', 
          fontSize: '4rem', 
          marginBottom: '1rem' 
        }} 
      />
      <h1 style={{ 
          color: '#000', 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
        Payment Successful
      </h1>
      
      <p style={{ 
          color: '#6c757d', 
          fontSize: '1.2rem', 
          marginBottom: '2rem' 
        }}>
        Thank you for your payment. Your transaction has been completed successfully.
      </p>

      {state?.transaction && (
        <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '2rem' 
          }}>
          <p style={{ margin: '0.5rem 0' }}>Reference: {state.transaction.reference}</p>
          <p style={{ margin: '0.5rem 0' }}>Amount: {state.transaction.amount} $</p>
        </div>
      )}

      <Button 
        variant="success" 
        onClick={() => navigate('/')} 
        style={{ 
          backgroundColor: '#28a745', 
          borderColor: '#28a745', 
          padding: '1rem 15rem', 
          fontSize: '1rem', 
          fontWeight: 'bold',
          borderRadius: '0.5rem' 
        }}
      >
        GO TO DASHBOARD
      </Button>
    </div>
  );
};

export default PaymentSuccess;