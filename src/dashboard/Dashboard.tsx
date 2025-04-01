import type React from "react"
import Layout from "../layout/Layout"
import { FaPlus, FaKey, FaExclamationTriangle, FaCalendarTimes, FaEllipsisH } from "react-icons/fa"
import './dashboard.css'
import { Link } from "react-router-dom"

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center py-4 mb-2">
          <h2 className="m-0 fw-bold">Dashboard</h2>
          <Link className="text-decoration-none" to="/add-new">
          <button className="btn btn-primary d-flex align-items-center gap-2">
            <FaPlus size={14} />
            <span >Add Subscription</span>
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
                <h2 className="card-title fw-bold mb-1">67</h2>
                <p className="card-text text-muted">All licenses</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-warning-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaExclamationTriangle className="text-warning" size={24} />
                </div>
                <h2 className="card-title fw-bold mb-1">45</h2>
                <p className="card-text text-muted">Expiring in 3 months</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100 transition-card">
              <div className="card-body d-flex flex-column align-items-center p-4">
                <div className="icon-wrapper bg-danger-subtle rounded-circle mb-3 d-flex align-items-center justify-content-center">
                  <FaCalendarTimes className="text-danger" size={24} />
                </div>
                <h2 className="card-title fw-bold mb-1">12</h2>
                <p className="card-text text-muted">Expired</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title fw-bold m-0">Subscriptions by products</h5>
                  <button className="btn btn-sm btn-outline-secondary">See more</button>
                </div>
                
                {/* Product 1 */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-primary-subtle me-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '4px' }}>
                    
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">PRODUCT NAME</div>
                    <div className="small text-muted">Subscription Total</div>
                  </div>
                  <div className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                    <span className="fw-bold">45</span>
                  </div>
                </div>
                
                {/* Product 2 */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-primary-subtle me-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '4px' }}>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">PRODUCT NAME</div>
                    <div className="small text-muted">Subscription Total</div>
                  </div>
                  <div className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                    <span className="fw-bold">32</span>
                  </div>
                </div>
                
                {/* Product 3 */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-primary-subtle me-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '4px' }}>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">PRODUCT NAME</div>
                    <div className="small text-muted">Subscription Total</div>
                  </div>
                  <div className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                    <span className="fw-bold">28</span>
                  </div>
                </div>
                
                {/* Product 4 */}
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-primary-subtle me-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '4px' }}>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">PRODUCT NAME</div>
                    <div className="small text-muted">Subscription Total</div>
                  </div>
                  <div className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                    <span className="fw-bold">15</span>
                  </div>
                </div>
                
                {/* Product 5 */}
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper bg-primary-subtle me-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px', borderRadius: '4px' }}>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">PRODUCT NAME</div>
                    <div className="small text-muted">Subscription Total</div>
                  </div>
                  <div className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                    <span className="fw-bold">10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7 mb-4">
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
                        <th className="border-0">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(6)].map((_, index) => (
                        <tr key={index}>
                          <td>XXXXXX</td>
                          <td>RightPlayer</td>
                          <td className="status-cell">
                            <span className="status-badge">Used</span>
                          </td>
                          <td>XX-XX-XXXX</td>
                          <td>
                            <FaEllipsisH className="text-muted" />
                          </td>
                        </tr>
                      ))}
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