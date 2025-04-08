"use client"

import React, { useEffect, useState } from "react"
import Layout from "../layout/Layout"
import { FaPlus, FaKey, FaExclamationTriangle, FaCalendarTimes, FaEllipsisH, FaSpinner } from "react-icons/fa"
import "./dashboard.css"
import { Link } from "react-router-dom"
import { fetchProducts, fetchUserSubscriptions, fetchLicenses } from "../auth/core/_requests"
import { ProductLicenseItem } from "./ProductLicenceItem"

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

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const [licenses, setLicenses] = useState<License[]>([])
  const [loadingLicenses, setLoadingLicenses] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les produits
        const productsData = await fetchProducts()
        const productsWithImages = productsData.map((product) => ({
          ...product,
          image: `https://rightcomsaasapi-if7l.onrender.com/uploads/${product._id}.png`,
        }))
        setProducts(productsWithImages)

        // Charger les abonnements
        const subscriptionsData = await fetchUserSubscriptions()
        setSubscriptions(subscriptionsData)

        // Charger les licences
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

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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

  const ProductSkeletonLoader = () => (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
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

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center py-4 mb-2">
          <h2 className="m-0 fw-bold">Dashboard</h2>
          <Link className="text-decoration-none" to="/add-new">
            <button className="btn btn-primary d-flex align-items-center gap-2" title="Add Subscription">
              <FaPlus size={14} />
              <span>Add Subscription</span>
            </button>
          </Link>
        </div>

        <div className="row mb-4">
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-primary-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaKey className="text-primary" size={24} />
                </div>
                {loadingLicenses ? (
                  <FaSpinner className="fa-spin mb-1" size={24} />
                ) : (
                  <>
                    <h2 className="card-title fw-bold mb-1">{licenses?.length ?? 0}</h2>
                    <p className="card-text text-muted">All Licenses</p>
                  </>
                )}
              </div>
            </div>
          </div>

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
                    <p className="card-text text-muted">Expiring in 3 months</p>
                  </>
                )}
              </div>
            </div>
          </div>

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
                    <p className="card-text text-muted">Expired Licenses</p>
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
                  <h5 className="card-title fw-bold m-0">Licenses by products</h5>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    title="See more"
                    onClick={() => console.log('View all licenses')}
                  >
                    See more
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="products-loading-container">
                    <div className="products-loading-overlay">
                      <div className="spinner-container">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading products...</span>
                        </div>
                      </div>
                      <p className="loading-text mt-2">Loading products...</p>
                    </div>
                    <ProductSkeletonLoader />
                  </div>
                ) : error ? (
                  <div className="text-center text-danger py-4">
                    Error loading products: {error}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4">No products found</div>
                ) : (
                  products.map((product) => (
                    <ProductLicenseItem 
                      key={product._id} 
                      product={product} 
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">Subscriptions list</h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0">Order id</th>
                        <th className="border-0">Product</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Expire date</th>
                        <th className="border-0">Billing Cycle</th>
                        <th className="border-0">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingSubscriptions ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <FaSpinner className="fa-spin me-2" />
                            Loading subscriptions...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
                            No subscriptions found
                          </td>
                        </tr>
                      ) : (
                        subscriptions.slice(0, ).map((subscription) => (
                          <tr key={subscription.order_id}>
                            <td>{subscription.order_id.substring(0,)}...</td>
                            <td>{subscription.Product}</td>
                            <td>
                              <span className={`status-badge ${getStatusClass(subscription.Status)}`}>
                                {subscription.Status}
                              </span>
                            </td>
                            <td>{formatDate(subscription.expire_date)}</td>
                            <td>{subscription.Details.billing_cycle}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => console.log('View details', subscription.order_id)}
                                title="View details"
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
      </div>
    </Layout>
  )
}

export default Dashboard