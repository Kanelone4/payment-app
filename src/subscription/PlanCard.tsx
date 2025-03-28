import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './PlanCard.css';

interface PlanProps {
  name: string;
  price: number;
  features: string[];
  isFourthPlan?: boolean;
  isActive?: boolean;
  logo: string;
  billingCycle: 'Monthly' | 'Annually';
  onAddToCard: () => Promise<void>; 
  onRemoveFromCart?: (itemId: string) => Promise<void>;
  isProcessing?: boolean;
  isFreePlan?: boolean;
  isInCart?: boolean;
  cartItemId?: string;
  isSubscribed?: boolean;
}

const PlanCard: React.FC<PlanProps> = ({ 
  name, 
  price, 
  features, 
  isFourthPlan = false, 
  isActive = false, 
  billingCycle, 
  onAddToCard,
  onRemoveFromCart,
  isProcessing = false,
  isInCart = false,
  cartItemId,
  isSubscribed 
  
  
}) => {
  const isFreePlan = name.toLowerCase() === 'free';
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAdd = async () => {
    try {
      await onAddToCard();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemove = async () => {
    if (!onRemoveFromCart || !cartItemId) return;
    
    setIsRemoving(true);
    try {
      await onRemoveFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className={`col-12 col-sm-6 col-md-4 ${isFourthPlan ? 'mt-4' : 'mb-4'}`}>
      <div
        className='card border-0 p-4 shadow-sm plan-card'
        style={{
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f0f4f6',
          marginBottom: isFourthPlan ? '20px' : '0',
          position: 'relative',
          margin: '10px',
        }}
      >
        {(isActive || isSubscribed) && (
          <div
            style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              padding: '15px 20px',
              backgroundColor: '#d1f5d3',
              borderRadius: '4px',
              color: '#28a745',
              fontSize: '13px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Active
          </div>
        )}

        <div style={{ flex: '0 0 auto', marginBottom: '10px', textAlign: 'center' }}>
          <span className='fw-bold fs-3'>{name}</span>
        </div>

        <div className="text-gray-400 fw-semibold mb-3" style={{ textAlign: 'center' }}>
          Optimal for 100+ team size and grown company
        </div>

        <div
          className='price-container mb-3'
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className='' style={{ color: '#009ef7', fontSize: '13px' }}>$</span>
          <p className='fw-bold' style={{ color: '#009ef7', fontSize: '40px', margin: '0 4px' }}>
            {price}
          </p>
          <span className='fw-bold fs-8 mb-2' style={{ color: '#a5a8b0' }}>
            /{billingCycle === 'Monthly' ? 'Mon' : 'Year'}
          </span>
        </div>

        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingLeft: '20px',
          }}
        >
          <div className="w-100 ">
            {features.map((feature, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <span className="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3" style={{ textAlign: 'left' }}>
                  {feature}
                </span>
                {index % 2 === 0 ? (
                  <span className="svg-icon svg-icon-1 svg-icon-success">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.3"
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="10"
                        fill="currentColor"
                      />
                      <path
                        d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="svg-icon svg-icon-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.3"
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="10"
                        fill="currentColor"
                      />
                      <rect
                        x="7"
                        y="15.3137"
                        width="12"
                        height="2"
                        rx="1"
                        transform="rotate(-45 7 15.3137)"
                        fill="currentColor"
                      />
                      <rect
                        x="8.41422"
                        y="7"
                        width="12"
                        height="2"
                        rx="1"
                        transform="rotate(45 8.41422 7)"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '0 0 auto', marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
          {isFreePlan ? (
            <Button variant="primary" size="sm">
              Active
            </Button>
          ) : isInCart ? (
            <button
              className="btn-danger-permanent"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Removing...
                </>
              ) : (
                'Remove from cart'
              )}
            </button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                'Add to Card'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;