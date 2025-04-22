"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Button, Spinner, Toast, ToastContainer } from "react-bootstrap"
import { FaTrash, FaMinus, FaPlus, FaCheckCircle, FaCreditCard } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { initiateCheckout, clearCart } from "../services/authService"
import './subscription-responsive-modal.css'
import './responsive-fixes.css'

interface Plan {
  _id: string
  name: string
  price: number
  billing_cycle?: string
  features: string[]
  product_id: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface CartItem {
  _id: string
  plan_id: Plan
  quantity: number
  metadata: {
    isUpgrade: boolean
    currentSubscriptionId: string
  }
  added_at: string
  subtotal: number
}

interface Product {
  _id: string
  product_name: string
  description: string
  createdAt: string
  updatedAt: string
  __v: number
  image: string
}

interface SubscriptionModalProps {
  show: boolean
  onHide: () => void
  cartItems: CartItem[]
  products: Product[]
  onDelete: (itemId: string) => Promise<void>
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  show,
  onHide,
  cartItems = [],
  products = [],
  onDelete = async () => {},
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"idle" | "processing" | "redirecting">("idle")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const navigate = useNavigate()

  const FIXED_QUANTITY_PRODUCT_ID = "67d7edf4f1ae50540c903cd4"

  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    cartItems.reduce(
      (acc, item) => ({
        ...acc,
        [item._id]: item.plan_id.product_id === FIXED_QUANTITY_PRODUCT_ID ? 1 : Math.max(1, item.quantity),
      }),
      {},
    ),
  )

  const isFixedQuantityItem = (item: CartItem) => {
    return item.plan_id.product_id === FIXED_QUANTITY_PRODUCT_ID
  }

  const totalAmount = cartItems.reduce((sum, item) => {
    const quantity = localQuantities[item._id] || 1
    const price = item.plan_id?.price || 0
    return sum + price * quantity
  }, 0)

  const groupedItems = cartItems.reduce(
    (acc, item) => {
      const productId = item.plan_id.product_id
      if (!acc[productId]) {
        acc[productId] = {
          product: products.find((p) => p._id === productId),
          items: [],
        }
      }
      acc[productId].items.push(item)
      return acc
    },
    {} as Record<string, { product?: Product; items: CartItem[] }>,
  )

  const handleDelete = async (itemId: string) => {
    setDeletingId(itemId)
    try {
      await onDelete(itemId)
    } catch (error) {
      console.error("Error during deletion:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleQuantityChange = (itemId: string, item: CartItem, change: number) => {
    if (isFixedQuantityItem(item)) {
      return
    }

    setLocalQuantities((prev) => {
      const current = prev[itemId] || 1
      const newValue = Math.max(1, current + change)
      return {
        ...prev,
        [itemId]: newValue,
      }
    })
  }

  const handlePaymentSuccess = async () => {
    try {

      await clearCart();
      
      setToastMessage("Payment successful! Your cart has been cleared.");
      setPaymentStep("idle");
      
      setTimeout(() => {
        onHide();
      }, 2000);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setToastMessage("Payment succeeded but failed to clear cart");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentStep("processing");
    setShowToast(true);
    setToastMessage("Processing your payment...");
  
    try {
      localStorage.setItem(
        "pendingPayment",
        JSON.stringify({
          items: cartItems,
          totalAmount,
        }),
      );
  
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      setPaymentStep("redirecting");
      setToastMessage("Payment processed! Redirecting to payment gateway...");
  
      const response = await initiateCheckout("mtn", "fedapay");
  
      if (response.success && response.data.payment_details?.redirect_url) {
        localStorage.setItem('shouldClearCart', 'true');
        setTimeout(() => {
          window.location.href = response.data.payment_details.redirect_url;
        }, 1000);
      } else {
        await handlePaymentSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setShowToast(false);
      navigate("/payment-error", {
        state: {
          error: error instanceof Error ? error.message : "Payment processing failed",
          cartItems,
        },
      });
    }
  };
  
  useEffect(() => {
    const checkCartClear = async () => {
      if (localStorage.getItem('shouldClearCart') === 'true') {
        try {
          await clearCart();
        } catch (error) {
          console.error("Error clearing cart:", error);
        } finally {
          localStorage.removeItem('shouldClearCart');
        }
      }
    };
  
    checkCartClear();
  }, []);

  return (
    <>
      <Modal
        show={show}
        onHide={paymentLoading ? undefined : onHide}
        size="lg"
        centered
        backdrop={paymentLoading ? "static" : true}
        keyboard={!paymentLoading}
      >
        <Modal.Header closeButton={!paymentLoading}>
          <Modal.Title>Your cart</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-8 mt-6">
          {paymentLoading && (
            <div className="payment-processing-overlay">
              <div className="payment-processing-content">
                <div className="spinner-container">
                  <Spinner animation="border" variant="light" />
                </div>
                <h4 className="mt-3 text-white">
                  {paymentStep === "processing" ? "Processing Payment..." : "Redirecting to Payment Gateway..."}
                </h4>
                <div className="payment-steps mt-3">
                  <div
                    className={`payment-step ${paymentStep === "processing" || paymentStep === "redirecting" ? "active" : ""}`}
                  >
                    <div className="step-indicator">1</div>
                    <div className="step-label">Processing</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`payment-step ${paymentStep === "redirecting" ? "active" : ""}`}>
                    <div className="step-indicator">2</div>
                    <div className="step-label">Redirecting</div>
                  </div>
                </div>
                <p className="text-white-50 mt-3">
                  Please do not close this window. You will be redirected to the payment gateway shortly.
                </p>
              </div>
            </div>
          )}

          {Object.values(groupedItems).map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4 border p-3 py-3" style={{ borderRadius: "10px", marginBottom: "50px" }}>
              <h4 style={{ marginTop: "-24px", marginLeft: "30px" }} className="fw-bold mb-3">
                {group.product?.product_name || "Product"}
              </h4>

              <div className="row">
                <div style={{ paddingLeft: "60px" }} className="col-md-3 fw-bold">
                  Plan
                </div>
                <div className="col-md-2 fw-bold">Period</div>
                <div className="col-md-2 fw-bold">Price</div>
                <div className="col-md-2 fw-bold px-4">Quantity</div>
                <div style={{ marginLeft: "30px" }} className="col-md-2 fw-bold">
                  Actions
                </div>
              </div>

              
              {group.items.map((item) => {
                const isFixed = isFixedQuantityItem(item)
                return (
                  <div key={item._id} className="row mt-2 align-items-center">
                    <div style={{ paddingLeft: "60px" }} className="col-md-3">
                      {item.plan_id.name}
                    </div>
                    <div className="col-md-2">{item.plan_id.billing_cycle || "Monthly"}</div>
                    <div className="col-md-2">
                      {(item.plan_id.price * (localQuantities[item._id] || 1)).toFixed(2)} $
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex align-items-center justify-content-center me-4">
                        {!isFixed ? (
                          <>
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item, -1)}
                              disabled={paymentLoading}
                            >
                              <FaMinus size={12} />
                            </Button>
                            <span className="mx-2">{localQuantities[item._id] || 1}</span>
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item, 1)}
                              disabled={paymentLoading}
                            >
                              <FaPlus size={12} />
                            </Button>
                          </>
                        ) : (
                          <span
                            style={{ marginRight: "20px" }}
                            className="d-flex justify-content-center text-center align-items-center"
                          >
                            1
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2 text-center">
                      <Button
                        variant="link"
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id || paymentLoading}
                      >
                        {deletingId === item._id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <FaTrash
                            style={{
                              cursor: paymentLoading ? "not-allowed" : "pointer",
                              color: paymentLoading ? "#ccc" : "black",
                            }}
                            onClick={() => !paymentLoading && handleDelete(item._id)}
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          <div className="text-end mt-4 border-top pt-3">
            <h5 className="fw-bold">Sub-Total: {totalAmount.toFixed(2)} $</h5>
            <h5 className="fw-bold">Amount to pay: {totalAmount.toFixed(2)} $</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ height: "40px", width: "70px" }} variant="secondary" onClick={onHide} disabled={paymentLoading}>
            Close
          </Button>
          {cartItems.length > 0 && (
            <Button  style={{ height: "40px" }} variant="primary" onClick={handlePayment} disabled={paymentLoading} className="payment-button">
              {paymentLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {paymentStep === "processing" ? "Processing..." : "Redirecting..."}
                </>
              ) : (
                <>
                  <FaCreditCard className="me-2" />
                  Proceed to payment
                </>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide={false}
          bg={paymentStep === "redirecting" ? "success" : "primary"}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Payment Status</strong>
          </Toast.Header>
          <Toast.Body className="text-white d-flex align-items-center">
            {paymentStep === "redirecting" ? (
              <FaCheckCircle className="me-2" size={18} />
            ) : (
              <Spinner animation="border" size="sm" className="me-2" />
            )}
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style >{`
        .payment-processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          border-radius: 0.3rem;
        }

        .payment-processing-content {
          text-align: center;
          padding: 2rem;
          max-width: 80%;
        }

        .spinner-container {
          display: flex;
          justify-content: center;
        }

        .payment-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1.5rem;
        }

        .payment-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .payment-step.active {
          opacity: 1;
        }

        .step-indicator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #6c757d;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          margin-bottom: 0.5rem;
          transition: background-color 0.3s ease;
        }

        .payment-step.active .step-indicator {
          background-color: #0d6efd;
        }

        .step-label {
          font-size: 0.875rem;
          color: white;
        }

        .step-connector {
          width: 50px;
          height: 2px;
          background-color: #6c757d;
          margin: 0 1rem;
          margin-bottom: 2rem;
        }

        .payment-button {
          min-width: 160px;
          transition: all 0.3s ease;
        }

        .payment-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  )
}

export default SubscriptionModal

