import React from 'react';
import styled from 'styled-components';


const ProductLogo = styled.div`
  width: 50px;
  height: 50px;
  background-color: #ccc;
  margin-right: 10px;
`;
const Dashboard: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <h2>Dashboard</h2>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">67</h5>
              <p className="card-text">All licenses</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">45</h5>
              <p className="card-text">Expiring in 3 months</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">12</h5>
              <p className="card-text">Expired</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-3">
          <div className="card">
            <div className="card-body" style={{height:'155px'}}>
              <h5 className="card-title">Subscriptions by products</h5>
              <ProductLogo />
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center" style={{marginLeft:'50px', bottom:'40px'}}>
                  RightPlayer
                  <span>Subscription Total</span>
                </li>
               
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Subscriptions list</h5>
              <table className="table table-striped">
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

    
    
  );
};

export default Dashboard;
