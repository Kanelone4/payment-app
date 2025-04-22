"use client"

import React, { useEffect, useState } from "react"
import Layout from "../layout/Layout"
import { 
  FaPlus, 
  FaKey, 
  FaExclamationTriangle, 
  FaCalendarTimes, 
  FaEllipsisH, 
  FaSpinner,
  FaTrash,
} from "react-icons/fa"
import "./dashboard.css"
import { Link, useNavigate } from "react-router-dom"
import { fetchProducts, fetchUserSubscriptions, fetchLicenses } from "../auth/core/_requests"
import { ProductLicenseItem } from "./ProductLicenceItem"
import ReactDOM from "react-dom"
import { useTranslation } from 'react-i18next'

interface Product {
  _id: string
  product_name: string
  description: string
  createdAt: string
  updatedAt: string
  __v: number
  image: string
}

interface UserSubscription {
  order_id: string
  Product: string
  Status: string
  Plan: string
  expire_date: string
  Details: {
    billing_cycle: string
    start_date: string
  }
}

interface License {
  _id: string
  key: string
  user_id: string
  plan_id: {
    _id: string
    name: string
    price: number
    billing_cycle: string
    features: string[]
    product_id: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  subscription_id: string
  expires_at: string
  is_active: boolean
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  __v: number
}

const SubscriptionDetailsModal: React.FC<{
  subscription: UserSubscription | null
  onClose: () => void
  onDelete: (orderId: string) => void
}> = ({ subscription, onClose, onDelete }) => {
  const { t } = useTranslation('dashboard')

  if (!subscription) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>{t('modal.title')}</h5>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="detail-item">
            <span className="detail-label">{t('modal.product')}</span>
            <span>{subscription.Product}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('modal.status')}</span>
            <span className={`status-badge ${subscription.Status.toLowerCase()}`}>
              {t(`${subscription.Status.toLowerCase()}`)}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('modal.plan')}</span>
            <span>{subscription.Plan}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('modal.billingCycle')}</span>
            <span>{subscription.Details.billing_cycle}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('modal.startDate')}</span>
            <span>{new Date(subscription.Details.start_date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">{t('modal.expireDate')}</span>
            <span>
                {subscription.expire_date && !isNaN(new Date(subscription.expire_date).getTime())
                  ? new Date(subscription.expire_date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                  : 'unlimited'}
              </span>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-danger me-2"
            onClick={() => {
              onDelete(subscription.order_id)
              onClose()
            }}
          >
            <FaTrash className="me-1" /> {t('modal.delete')}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0)
  const [animatedCount, setAnimatedCount] = useState<number>(0)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllLicenses, setShowAllLicenses] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load products
        const productsData = await fetchProducts()
        const productsWithImages = productsData.map((product: Product) => ({
          ...product,
          image: `https://rightcomsaasapiv2.onrender.com/uploads/${product._id}.png`,
        }))
        setProducts(productsWithImages)

        // Load subscriptions and get count
        const { subscriptions, count } = await fetchUserSubscriptions()
        setSubscriptions(subscriptions)
        setSubscriptionCount(count)

        // Load licenses
        const licensesData = await fetchLicenses()
        setLicenses(licensesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
        console.error("Failed to load data:", err)
      } finally {
        setLoadingProducts(false)
        setLoadingSubscriptions(false)
        setLoadingLicenses(false)
      }
    }
    loadData()
  }, [])

  // Counter animation for subscriptions
  useEffect(() => {
    if (!loadingSubscriptions) {
      const duration = 1000 // animation duration in ms
      const fps = 60
      const totalFrames = Math.round((duration / 1000) * fps)
      const increment = subscriptionCount / totalFrames
      
      let frame = 0
      const interval = setInterval(() => {
        frame++
        setAnimatedCount(prev => {
          const nextValue = prev + increment
          if (frame >= totalFrames) {
            clearInterval(interval)
            return subscriptionCount
          }
          return Math.round(nextValue)
        })
      }, duration / totalFrames)
    }
  }, [loadingSubscriptions, subscriptionCount])

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return t('modal.forever')
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-badge-active'
      case 'inactive': return 'status-badge-inactive'
      case 'expired': return 'status-badge-expired'
      case 'canceled': return 'status-badge-canceled'
      default: return 'status-badge'
    }
  }

  const handleDeleteSubscription = (orderId: string) => {
    console.log("Deleting subscription:", orderId)
    setSubscriptions(subscriptions.filter(sub => sub.order_id !== orderId))
    setSubscriptionCount(prev => prev - 1)
  }

  const ProductSkeletonLoader = () => (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="d-flex align-items-center mb-3 product-skeleton">
          <div className="skeleton-image me-3"></div>
          <div className="flex-grow-1 me-3">
            <div className="skeleton-text"></div>
          </div>
          <div className="skeleton-badge ms-3"></div>
        </div>
      ))}
    </>
  )

  const handleViewAllSubscriptions = () => {
    navigate("/list")
  }

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center py-4 mb-2">
          <h2 className="m-0 fw-bold">{t('title')}</h2>
          <Link className="text-decoration-none" to="/add-new">
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <FaPlus size={14} />
              <span>{t('addSubscription')}</span>
            </button>
          </Link>
        </div>

        <div className="row mb-4">
          {/* All Subscriptions Card */}
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-primary-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaKey className="text-primary" size={24} />
                </div>
                {loadingSubscriptions ? (
                  <FaSpinner className="fa-spin mb-1" size={24} />
                ) : (
                  <>
                    <h2 className="card-title fw-bold mb-1">{animatedCount}</h2>
                    <p className="card-text text-muted">{t('cards.allSubscriptions')}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Expiring Licenses Card */}
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-success-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaExclamationTriangle className="text-success" size={24} />
                </div>
                {loadingLicenses ? (
                  <FaSpinner className="fa-spin mb-1" size={24} />
                ) : (
                  <>
                    <h2 className="card-title fw-bold mb-1">
                      {licenses?.filter(l => l.status === 'active').length ?? 0}
                    </h2>
                    <p className="card-text text-muted">{t('cards.expiringLicenses')}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Expired Licenses Card */}
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-danger-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaCalendarTimes className="text-danger" size={24} />
                </div>
                {loadingLicenses ? (
                  <FaSpinner className="fa-spin mb-1" size={24} />
                ) : (
                  <>
                    <h2 className="card-title fw-bold mb-1">
                      {licenses?.filter(l => l.status === 'expired').length ?? 0}
                    </h2>
                    <p className="card-text text-muted">{t('cards.expiredLicenses')}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          {/* Licenses by products */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title fw-bold m-0">{t('sections.licensesByProducts')}</h5>
                  {products.length > 4 && (
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => setShowAllLicenses(!showAllLicenses)}
                    >
                      {showAllLicenses ? t('sections.showLess') : t('sections.viewMore')}
                    </button>
                  )}
                </div>

                {loadingProducts ? (
                  <div className="products-loading-container">
                    <div className="products-loading-overlay">
                      <div className="spinner-container">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading products...</span>
                        </div>
                      </div>
                      <p className="loading-text mt-2">{t('table.loading')}</p>
                    </div>
                    <ProductSkeletonLoader />
                  </div>
                ) : error ? (
                  <div className="text-center text-danger py-4">
                    {error}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4">{t('table.noData')}</div>
                ) : (
                  (showAllLicenses ? products : products.slice(0, 4)).map((product) => (
                    <ProductLicenseItem 
                      key={product._id} 
                      product={product} 
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Subscriptions list */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title fw-bold m-0">{t('sections.subscriptionsList')}</h5>
                  {subscriptions.length > 5 && (
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleViewAllSubscriptions}
                    >
                      {t('sections.viewMore')}
                    </button>
                  )}
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0">{t('table.orderId')}</th>
                        <th className="border-0">{t('table.product')}</th>
                        <th className="border-0">{t('table.status')}</th>
                        <th className="border-0">{t('table.plan')}</th>
                        <th className="border-0">{t('table.expireDate')}</th>
                        <th className="border-0">{t('table.billingCycle')}</th>
                        <th className="border-0">{t('table.details')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingSubscriptions ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <FaSpinner className="fa-spin me-2" />
                            {t('table.loading')}
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            {error}
                          </td>
                        </tr>
                      ) : subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            {t('table.noData')}
                          </td>
                        </tr>
                      ) : (
                        subscriptions.slice(0, 5).map((subscription) => (
                          <tr key={subscription.order_id}>
                            <td>{subscription.order_id.substring(0, 5)}...</td>
                            <td>{subscription.Product}</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(subscription.Status)}`}>
                                {t(`${subscription.Status.toLowerCase()}`)}
                              </span>
                            </td>
                            <td>{subscription.Plan}</td>
                            <td>{formatDate(subscription.expire_date)}</td>
                            <td>{subscription.Details.billing_cycle}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setSelectedSubscription(subscription)}
                                title={t('table.details')}
                              >
                                <FaEllipsisH />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details Modal */}
        {selectedSubscription && (
          <SubscriptionDetailsModal
            subscription={selectedSubscription}
            onClose={() => setSelectedSubscription(null)}
            onDelete={handleDeleteSubscription}
          />
        )}
        
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .detail-label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
      `}</style>
    </Layout>
  )
}

export default Dashboard