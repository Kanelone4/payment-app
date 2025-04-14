"use client"

import React, { useState, useEffect } from "react"
import Layout from "../layout/Layout"
import { FaPlus, FaSearch, FaFilter, FaInfoCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { fetchUserLicenses } from "../services/authService"
import "./ListOfSubscription.css"
import './tables-responsive.css'

interface License {
  licence_code: string
  product: string
  plan: string
  status: string | boolean // Union type to handle both string and boolean
  start_date: string
  end_date: string
}

const ListOfSubscription: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [licenses, setLicenses] = useState<License[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLicenses = async () => {
      try {
        setIsLoading(true)
        const data = await fetchUserLicenses()
        setLicenses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load licenses')
        console.error('Error loading licenses:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadLicenses()
  }, [])

  const filteredLicenses = licenses.filter(
    (license) =>
      license.licence_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.plan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewDetails = (licenseCode: string) => {
    console.log(`View details for license ${licenseCode}`)
    // Vous pourriez naviguer vers une page de détails ici
    // navigate(`/licenses/${licenseCode}`)
  }

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusBadgeClass = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? 'status-badge-active' : 'status-badge-canceled';
    }

    switch (status.toLowerCase()) {
      case 'active':
        return 'status-badge-active'
      case 'inactive':
        return 'status-badge-inactive'
      case 'expired':
        return 'status-badge-expired'
      case 'canceled':
        return 'status-badge-canceled'
      default:
        return 'status-badge'
    }
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-danger m-4">
          <h4>Error loading licenses</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container-fluid px-4">
        {/* Header with title and add button */}
        <div className="d-flex justify-content-between align-items-center py-4 mb-3">
          <h2 className="m-0 fw-bold">Licenses list</h2>
          <Link className="text-decoration-none" to="/add-new">
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <FaPlus size={14} />
              <span>Add License</span>
            </button>
          </Link>
        </div>

        {/* Main content card */}
        <div className="card border-0 shadow-sm mb-4">
          {isLoading ? (
           
           <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading licenses...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Card header with count, filter and search */}
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="card-title fw-bold mb-1 display-4">{licenses.length}</h2>
                    <p className="card-text text-muted">Licences</p>
                  </div>

                  {/* Enhanced filter and search section */}
                  <div className="search-filter-container">
                    <button
                      className={`filter-button ${isFilterActive ? "active" : ""}`}
                      onClick={toggleFilter}
                      aria-label="Filter options"
                    >
                      <FaFilter size={14} />
                      <span>Filter</span>
                    </button>

                    <div className="search-container">
                      <div className="search-icon-wrapper">
                        <FaSearch size={14} />
                      </div>
                      <input
                        type="text"
                        placeholder="Search licenses..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0">Licence code</th>
                        <th className="border-0">Product</th>
                        <th className="border-0">Plan</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Start date</th>
                        <th className="border-0">Expire date</th>
                        <th className="border-0">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLicenses.map((license, index) => (
                        <tr key={`${license.licence_code}-${index}`}>
                          <td>{license.licence_code}</td>
                          <td>{license.product}</td>
                          <td>
                            <span className="">{license.plan}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(license.status)}`}>
                              {typeof license.status === 'boolean' ? (license.status ? 'Active' : 'Inactive') : license.status}
                            </span>
                          </td>
                          <td>{formatDate(license.start_date)}</td>
                          <td>{formatDate(license.end_date)}</td>
                          <td>
                            <button
                              className="details-button"
                              onClick={() => handleViewDetails(license.licence_code)}
                            >
                              <FaInfoCircle className="me-1" />
                              Details
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
      </div>
    </Layout>
  )
}

export default ListOfSubscription
