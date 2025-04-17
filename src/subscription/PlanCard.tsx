import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './PlanCard.css';
import './responsive-fixes.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('plan');
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

  // Fonction améliorée pour traduire les features dynamiques
  const translateFeature = (featureText: string) => {
    const exactKey = `features.${featureText.trim()}`;
    const cleanKey = `features.${featureText.trim().replace(/\*/g, '').replace(/,/g, '').replace(/\s+/g, ' ')}`;
    
    return t(exactKey, { 
      ns: 'plan',
      defaultValue: t(cleanKey, {
        ns: 'plan',
        defaultValue: featureText
      })
    });
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
          <div className="current-plan-banner">
            {t('yourcurrentPlan')}
          </div>
        )}

        <div style={{ flex: '0 0 auto', marginBottom: '10px', textAlign: 'center' }}>
          <span className='fw-bold fs-3'>
            {isFreePlan ? t('free_plan') : name}
          </span>
        </div>

        <div className="text-gray-400 fw-semibold mb-3" style={{ textAlign: 'center' }}>
          {t('Optimalfor100+teamsizeandgrowncompanys')}
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
            /{billingCycle === 'Monthly' ? t('monthly') : t('yearly')}
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
          <div className="w-100">
            {features.map((feature, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <span className="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3" style={{ textAlign: 'left' }}>
                  {translateFeature(feature)}
                </span>
                {index % 2 === 0 ? (
                  <span className="svg-icon svg-icon-1 svg-icon-success">
                    {/* Icône de validation */}
                  </span>
                ) : (
                  <span className="svg-icon svg-icon-1">
                    {/* Icône d'erreur */}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '0 0 auto', marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
          {isFreePlan || isSubscribed ? (
            <Button variant="primary" size="sm" disabled>
              {t('active')}
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
                  {t('removing')}
                </>
              ) : (
                t('remove_from_cart')
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
                  {t('processing')}
                </>
              ) : (
                t('add_to_card')
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;