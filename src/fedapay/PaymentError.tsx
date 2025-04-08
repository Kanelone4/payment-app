import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { VscError } from "react-icons/vsc";
import Header from '../layout/header/header';
import '../../src/layout/Layout';

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('id');
  const { state } = useLocation();
  const navigate = useNavigate();

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
      
      {/* Contenu principal */}
      <div className="text-center p-5" style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        marginTop: '80px',
        position: 'relative'
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

        {(state?.error || transactionId) && (
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '0.25rem',
            marginBottom: '2rem'
          }}>
            {state?.error && <p style={{ margin: '0.5rem 0' }}>Error: {state.error}</p>}
            {transactionId && <p style={{ margin: '0.5rem 0' }}>Transaction ID: {transactionId}</p>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="danger" 
            onClick={() => navigate('/add-new')}
            style={{ 
              backgroundColor: '#dc3545', 
              borderColor: '#dc3545', 
              padding: '0.75rem 3rem', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
            }}
          >
            TRY AGAIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;