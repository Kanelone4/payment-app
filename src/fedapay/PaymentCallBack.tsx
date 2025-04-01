import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { initiateCheckout } from '../services/authService';

interface Plan {
  _id: string;
  name: string;
  price: number;
  billing_cycle?: string;
  features: string[];
  product_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  _id: string;
  plan_id: Plan;
  quantity: number;
  metadata: {
    isUpgrade: boolean;
    currentSubscriptionId: string;
  };
  added_at: string;
  subtotal: number;
}

interface Product {
  _id: string;
  product_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: string;
}

interface SubscriptionModalProps {
  show: boolean;
  onHide: () => void;
  cartItems: CartItem[];
  products: Product[];
  onDelete: (itemId: string) => Promise<void>;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ 
  show, 
  onHide, 
  cartItems = [], 
  products = [],
  onDelete = async () => {},
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const FIXED_QUANTITY_PRODUCT_ID = '67d7edf4f1ae50540c903cd4';

  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    cartItems.reduce((acc, item) => ({
      ...acc,
      [item._id]: item.plan_id.product_id === FIXED_QUANTITY_PRODUCT_ID ? 1 : Math.max(1, item.quantity)
    }), {})
  );

  const isFixedQuantityItem = (item: CartItem) => {
    return item.plan_id.product_id === FIXED_QUANTITY_PRODUCT_ID;
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    const quantity = localQuantities[item._id] || 1;
    const price = item.plan_id?.price || 0;
    return sum + (price * quantity);
  }, 0);

  const groupedItems = cartItems.reduce((acc, item) => {
    const productId = item.plan_id.product_id;
    if (!acc[productId]) {
      acc[productId] = {
        product: products.find(p => p._id === productId),
        items: []
      };
    }
    acc[productId].items.push(item);
    return acc;
  }, {} as Record<string, { product?: Product; items: CartItem[] }>);

  const handleDelete = async (itemId: string) => {
    setDeletingId(itemId);
    try {
      await onDelete(itemId);
    } catch (error) {
      console.error('Error during deletion:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuantityChange = (itemId: string, item: CartItem, change: number) => {
    if (isFixedQuantityItem(item)) {
      return; 
    }

    setLocalQuantities(prev => {
      const current = prev[itemId] || 1;
      const newValue = Math.max(1, current + change);
      return {
        ...prev,
        [itemId]: newValue
      };
    });
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    
    try {
      const response = await initiateCheckout('mtn', 'fedapay');
      
      if (response.success && response.data.payment_details?.redirect_url) {
        window.location.href = response.data.payment_details.redirect_url;
      } else {
        throw new Error('No payment URL provided');
      }
    } catch (error) {
      console.error('Payment error:', error);
      navigate('/payment-error', { 
        state: { 
          error: error instanceof Error ? error.message : 'Payment processing error' 
        } 
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Your cart</Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-8 mt-6'>
        {Object.values(groupedItems).map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4 border p-3" style={{borderRadius:'10px'}}>
            <h4 style={{ marginTop: '-24px', marginLeft: '30px' }} className="fw-bold mb-3">
              {group.product?.product_name || 'Product'}
            </h4>
            {group.items.map((item) => {
              const isFixed = isFixedQuantityItem(item);
              return (
                <div key={item._id} className="mb-3">
                  <div className="row">
                    <div style={{paddingLeft:'60px'}} className="col-md-3 fw-bold">Plan</div>
                    <div className="col-md-2 fw-bold">Period</div>
                    <div className="col-md-2 fw-bold">Price</div>
                    <div className="col-md-2 fw-bold px-4">Quantity</div>
                    <div style={{marginLeft:'30px'}} className="col-md-2 fw-bold">Actions</div>
                  </div>
                  <div className="row mt-2 align-items-center">
                    <div style={{paddingLeft:'60px'}} className="col-md-3">{item.plan_id.name}</div>
                    <div className="col-md-2">{item.plan_id.billing_cycle || 'Monthly'}</div>
                    <div className="col-md-2">
                      {(item.plan_id.price * (localQuantities[item._id] || 1)).toFixed(2)} $
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex align-items-center">
                        {!isFixed ? (
                          <>
                            <Button 
                              variant=''
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item, -1)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{localQuantities[item._id] || 1}</span>
                            <Button 
                              variant="" 
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item, 1)}
                            >
                              +
                            </Button>
                          </>
                        ) : (
                          <span style={{marginLeft:'40px'}} className="d-flex justify-content-center text-center align-items-center">1</span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                        <Button 
                          variant="link" 
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <FaTrash
                              style={{ cursor: 'pointer', color:'black' }}
                              onClick={() => handleDelete(item._id)}
                            />
                          )}
                        </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div className="text-end mt-4 border-top pt-3">
          <h5 className="fw-bold">Sub-Total: {totalAmount.toFixed(2)} $</h5>
          <h5 className="fw-bold">Amount to pay: {totalAmount.toFixed(2)} $</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {cartItems.length > 0 && (
          <Button 
            variant="primary" 
            onClick={handlePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Proceed to payment'
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;