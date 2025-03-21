import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { Plan } from '../auth/core/types';

interface SubscriptionModalProps {
  show: boolean;
  onHide: () => void;
  subscriptions: Plan[];
  onDelete: (index: number) => void; 
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ show, onHide, subscriptions, onDelete }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Souscriptions</Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-8 mt-6'>
        {subscriptions.map((subscription, index) => (
          <div key={index} style={{ borderRadius: '6px' }} className="mb-4 border p-3">
            <h4 style={{ marginTop: '-24px' }} className="fw-bold mb-3">{subscription.product_name}</h4>
            <div className="row">
              <div className="col-md-3 fw-bold">Plan</div>
              <div className="col-md-3 fw-bold">Billing Cycle</div>
              <div className="col-md-3 fw-bold">Price</div>
              <div className="col-md-2 fw-bold ms-6">Actions</div>
            </div>
            <div className="row mt-2">
              <div className="col-md-3">{subscription.name}</div>
              <div className="col-md-3">{subscription.billing_cycle}</div>
              <div className="col-md-3">${subscription.price}</div>
              <div className="col-md-2 d-flex flex-column align-items-end">
                <FaTrash
                  style={{ cursor: 'pointer' }}
                  onClick={() => onDelete(index)} 
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-end mt-4">
          <p className="fw-bold">Sub-total: ${subscriptions.reduce((sum, sub) => sum + sub.price, 0)}</p>
          <p className="fw-bold">Amount to pay: ${subscriptions.reduce((sum, sub) => sum + sub.price, 0)}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Proceed to payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;