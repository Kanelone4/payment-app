import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

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
  cartItems, 
  products,
  onDelete,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Grouper les items par produit
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Your cart</Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-8 mt-6'>
        {Object.values(groupedItems).map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4 border p-3 " style={{borderRadius:'10px'}}>
            <h4 style={{ marginTop: '-24px' }} className="fw-bold mb-3">
              {group.product?.product_name || 'Product'}
            </h4>
            
            {group.items.map((item) => (
              <div key={item._id} className="mb-3">
                <div className="row">
                  <div className="col-md-3 fw-bold">Plan</div>
                  <div className="col-md-2 fw-bold">Period</div>
                  <div className="col-md-2 fw-bold">Price</div>
                  <div style={{marginLeft:'30px'}} className="col-md-2 fw-bold">Actions</div>
                </div>
                <div className="row mt-2 align-items-center">
                  <div className="col-md-3">{item.plan_id.name}</div>
                  <div className="col-md-2">{item.plan_id.billing_cycle || 'Monthly'}</div>
                  <div className="col-md-2">${item.subtotal}</div>
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
            ))}
          </div>
        ))}

        <div className="text-end mt-4 border-top pt-3">
          <h5 className="fw-bold">Sub-total: ${totalAmount}</h5>
          <h5 className="fw-bold">Amount to pay: ${totalAmount}</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {cartItems.length > 0 && (
          <Button variant="primary" onClick={onHide}>
            Proceed to payment
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;