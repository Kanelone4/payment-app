import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Header from '../layout/header/header';
import '../../src/layout/Layout';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get('status');
    const transactionId = searchParams.get('id');
    const errorMessage = searchParams.get('message') || 'Payment failed';

    if (status === 'approved') {
      navigate('/payment-success', { 
        state: { 
          transaction: { reference: transactionId } 
        } 
      });
    } else {
      
      navigate('/payment-error', { 
        state: { 
          error: errorMessage,
          transactionId 
        } 
      });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ backgroundColor: '#f0f4f6', minHeight: '100vh' }}>
      {/* Header avec fond blanc et ombre */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Header toggleSidebar={() => {}} />
      </div>
      
      {/* Contenu principal avec spinner */}
      <div className="text-center p-5" style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        marginTop: '80px',
        position: 'relative'
      }}>
        <Spinner 
          animation="border" 
          role="status"
          style={{ 
            color: '#0089e1',
            width: '3rem',
            height: '3rem',
            marginBottom: '1.5rem'
          }}
        />
        <h4 style={{ 
          color: '#495057', 
          fontSize: '1.5rem',
          fontWeight: 500
        }}>
          Processing your payment...
        </h4>
        <p style={{ 
          color: '#6c757d',
          marginTop: '1rem'
        }}>
          Please wait while we verify your transaction
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;