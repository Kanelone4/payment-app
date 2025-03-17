import React from 'react';
import Layout from '../layout/Layout';



const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row mb-3">
          <h2 className='py-4'>Dashboard</h2>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">67</h5>
                <p className="card-text">All licenses</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">45</h5>
                <p className="card-text">Expiring in 3 months</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">12</h5>
                <p className="card-text">Expired</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body" style={{ }}>
                <h5 className="card-title mb-2">Subscriptions by products</h5>
                <img className='py-1' src="./public/assets/Images/RightPlayer.png" alt="RightPlayer Logo" style={{ width: '130px', height: '30px', cursor: 'pointer'}} />
                <ul className="list-group list-group-flush border-0 mt-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 " style={{ marginLeft: '90%', bottom: '40px' }}>
                    
                    <span className=''>Total</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title px">Subscriptions list</h5>
                <table className="table  border-0">
                  <thead>
                    <tr>
                      <th>Order id</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Expire date</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XXXXXX</td>
                      <td>RightPlayer</td>
                      <td>Used</td>
                      <td>XX-XX-XXXX</td>
                      <td>...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
