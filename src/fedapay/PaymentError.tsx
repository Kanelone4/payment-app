import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { VscError } from "react-icons/vsc";

const PaymentError = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div  className="text-center p-5" style={{ 
      maxWidth: '600px', 
      margin: '2rem auto',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor:'white',
      marginTop:'130px'
    }}>
      <VscError 
        style={{ 
          color: '#dc3545', 
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
        Payment Failed
      </h1>
      
      <p style={{ 
          color: '#6c757d', 
          fontSize: '1.2rem', 
          marginBottom: '2rem' 
        }}>
        An error occurred while processing your payment.
      </p>

      {state?.error && (
        <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '2rem',
            color: '#dc3545',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
          <p style={{ margin: '0' }}>Error detail: {state.error}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Button 
          variant="danger" 
          onClick={() => navigate('/add-new')}
          style={{ 
            backgroundColor: '#dc3545', 
            borderColor: '#dc3545', 
            padding: '1rem 15rem', 
            fontSize: '1rem', 
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
          }}
        >
          TRY AGAIN
        </Button>
        
      </div>
    </div>
  );
};

export default PaymentError;