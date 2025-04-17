"use client"

import React, { useState, useEffect } from "react"
import Layout from "../layout/Layout"
import { FaPlus, FaSearch, FaFilter, FaInfoCircle, FaTimes, FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { fetchUserSubscriptions } from "../services/authService"
import "./ListOfSubscription.css"
import "./tables-responsive.css"
import ReactDOM from "react-dom"
import { useTranslation } from 'react-i18next'

interface Subscription {
  order_id: string
  Product: string
  Status: string
  Plan: string
  start_date: string
  expire_date: string
  Details: {
    billing_cycle: string
  }
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
    expire_date: string
  }
}

const SubscriptionDetailsModal: React.FC<{
  subscription: UserSubscription | null
  onClose: () => void
  onDelete: (orderId: string) => void
}> = ({ subscription, onClose, onDelete }) => {
  const { t } = useTranslation('subscriptions')

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
            <span>{subscription.Plan.toLowerCase()}</span>
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
                ? new Date(subscription.expire_date).toLocaleDateString()
                : t('modal.forever')}
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

const FilterDropdownPortal: React.FC<{
  onClose: () => void
  onApply: (filters: any) => void
  plans: string[]
  cycles: string[]
  statuses: string[]
}> = ({ onClose, onApply, cycles, statuses, plans }) => {
  const { t } = useTranslation('subscriptions')
  const [selectedCycles, setSelectedCycles] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])

  const handleApply = () => {
    onApply({
      cycles: selectedCycles,
      statuses: selectedStatuses,
      plans: selectedPlans,
    })
    onClose()
  }

  const toggleCycle = (cycle: string) => {
    setSelectedCycles(prev =>
      prev.includes(cycle) ? prev.filter(c => c !== cycle) : [...prev, cycle]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const togglePlan = (plan: string) => {
    setSelectedPlans(prev =>
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    )
  }

  return ReactDOM.createPortal(
    <div className="filter-dropdown-portal">
      <div className="filter-dropdown-header">
        <h5>{t('filter.title')}</h5>
        <button title={t('filter.close')} className="filter-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="filter-section">
        <h6>{t('filter.byCycle')}</h6>
        <div className="filter-options">
          {cycles.map(cycle => (
            <div
              key={cycle}
              className={`filter-option ${selectedCycles.includes(cycle) ? "active" : ""}`}
              onClick={() => toggleCycle(cycle)}
            >
              {cycle}
            </div>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h6>{t('filter.byPlan')}</h6>
        <div className="filter-options">
          {plans.map(plan => (
            <div
              key={plan}
              className={`filter-option ${selectedPlans.includes(plan) ? "active" : ""}`}
              onClick={() => togglePlan(plan)}
            >
              {plan}
            </div>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h6>{t('filter.byStatus')}</h6>
        <div className="filter-options">
          {statuses.map(status => (
            <div
              key={status}
              className={`filter-option ${selectedStatuses.includes(status) ? "active" : ""}`}
              onClick={() => toggleStatus(status)}
            >
              {t(`${status.toLowerCase()}`)}
            </div>
          ))}
        </div>
      </div>
      <div className="filter-dropdown-footer">
        <button className="btn btn-secondary me-2" onClick={onClose}>
          {t('filter.close')}
        </button>
        <button className="btn btn-primary" onClick={handleApply}>
          {t('filter.apply')}
        </button>
      </div>
    </div>,
    document.body
  )
}

const ListOfSubscription: React.FC = () => {
  const { t } = useTranslation('subscriptions')
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null)
  const [subscriptionCount, setSubscriptionCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState({
    cycles: [] as string[],
    statuses: [] as string[],
    plans: [] as string[],
  })

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        setIsLoading(true)
        const { subscriptions, count } = await fetchUserSubscriptions()
        setSubscriptions(subscriptions)
        setFilteredSubscriptions(subscriptions)
        setCount(count)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.loading'))
        console.error("Error loading subscriptions:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSubscriptions()
  }, [t])

  useEffect(() => {
    let result = subscriptions

    if (searchTerm) {
      result = result.filter(
        sub =>
          sub.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.Details.billing_cycle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.cycles.length > 0) {
      result = result.filter(sub => filters.cycles.includes(sub.Details.billing_cycle))
    }

    if (filters.statuses.length > 0) {
      result = result.filter(sub => filters.statuses.includes(sub.Status))
    }

    if (filters.plans.length > 0) {
      result = result.filter(sub => filters.plans.includes(sub.Plan))
    }

    setFilteredSubscriptions(result)
  }, [searchTerm, filters, subscriptions])

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal)
  }

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
  }

  const formatDate = (expire_date: string) => {
    if (!expire_date || expire_date === "N/A") return t('modal.forever')
    const date = new Date(expire_date)
    if (isNaN(date.getTime())) return t('modal.forever')
    return date.toLocaleDateString()
  }

  const handleDeleteSubscription = (orderId: string) => {
    console.log("Deleting subscription:", orderId)
    setSubscriptions(subscriptions.filter(sub => sub.order_id !== orderId))
    setSubscriptionCount(prev => prev - 1)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "status-badge-active"
      case "inactive": return "status-badge-inactive"
      case "expired": return "status-badge-expired"
      case "canceled": return "status-badge-canceled"
      default: return "status-badge"
    }
  }

  const uniqueCycle = [...new Set(subscriptions.map(sub => sub.Details.billing_cycle))]
  const uniqueStatuses = [...new Set(subscriptions.map(sub => sub.Status))]
  const uniquePlans = [...new Set(subscriptions.map(sub => sub.Plan))]

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger m-4">
          <h4>{t('error.title')}</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            {t('error.retry')}
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center py-4 mb-3">
          <h2 className="m-0 fw-bold">{t('title')}</h2>
          <Link className="text-decoration-none" to="/add-new">
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <FaPlus size={14} />
              <span>{t('addButton')}</span>
            </button>
          </Link>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                  <span className="visually-hidden">{t('loading')}</span>
                </div>
                <p className="mt-3">{t('loading')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="card-title fw-bold mb-1 display-4 px-4">{count}</h2>
                    <p className="card-text text-muted">{t('subscriptions')}</p>
                  </div>

                  <div className="search-filter-container">
                    <button
                      className={`filter-button ${filters.plans.length > 0 || filters.statuses.length > 0 || filters.cycles.length > 0 ? "active" : ""}`}
                      onClick={toggleFilterModal}
                      aria-label={t('filter.button')}
                    >
                      <FaFilter size={14} />
                      <span>{t('filter.button')}</span>
                    </button>

                    <div className="search-container">
                      <div className="search-icon-wrapper">
                        <FaSearch size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder={t('search.placeholder')}
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0">{t('table.product')}</th>
                        <th className="border-0">{t('table.billingCycle')}</th>
                        <th className="border-0">{t('table.plan')}</th>
                        <th className="border-0">{t('table.status')}</th>
                        <th className="border-0">{t('table.expireDate')}</th>
                        <th className="border-0">{t('table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.order_id}>
                          <td>{subscription.Product}</td>
                          <td>{subscription.Details.billing_cycle}</td>
                          <td>{subscription.Plan}</td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(subscription.Status)}`}>
                              {t(`${subscription.Status.toLowerCase()}`)}
                            </span>
                          </td>
                          <td>{formatDate(subscription.expire_date)}</td>
                          <td>
                            <button
                              className="details-button"
                              onClick={() => setSelectedSubscription(subscription)}
                            >
                              <FaInfoCircle className="me-1" />
                              {t('table.details')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedSubscription && (
          <SubscriptionDetailsModal
            subscription={selectedSubscription}
            onClose={() => setSelectedSubscription(null)}
            onDelete={handleDeleteSubscription}
          />
        )}

        {showFilterModal && (
          <FilterDropdownPortal
            onClose={toggleFilterModal}
            onApply={handleApplyFilters}
            cycles={uniqueCycle}
            plans={uniquePlans}
            statuses={uniqueStatuses}
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

        .filter-dropdown-portal {
          position: absolute;
          top: 260px;
          right: 70px;
          width: 300px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          animation: fadeIn 0.2s ease-out;
          padding: 16px;
        }
        .filter-dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .filter-dropdown-header h5 {
          margin: 0;
          font-size: 16px;
        }
        .filter-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }
        .filter-section {
          margin-bottom: 16px;
        }
        .filter-section h6 {
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .filter-option {
          padding: 6px 10px;
          border-radius: 14px;
          cursor: pointer;
          background-color: white;
          border: 1px solid #ddd;
          font-size: 12px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .filter-option.active {
          background-color: #007bff;
          color: white;
        }
        .filter-dropdown-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      `}</style>
    </Layout>
  )
}

export default ListOfSubscription