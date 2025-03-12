import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';

const ProductLogo = styled.div`
  width: 50px;
  height: 50px;
  background-color: #ccc;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
`;




const NewSubscription: React.FC = () => {
  const [openProduct, setOpenProduct] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');

  const toggleProduct = (id: number) => {
    setOpenProduct(id);
  };

  // const handleDashboardClick = () => {
  //   window.location.href = '/dashboard'; 
  // };
  const products = [
    { id: 1, name: 'RightPlayer' },
    { id: 2, name: 'RightSurvey' },
    { id: 3, name: 'RightBot' },
  ];


  interface Plan {
    id: number;
    title: string;
    description: string;
    priceMonthly: number;
    priceAnnual: number;
  }

  const plans: Plan[] = [
    {
      id: 1,
      title: 'Startup',
      description: 'Optimal for 10+ team size and new startup',
      priceMonthly: 39,
      priceAnnual: 399,
    },
    {
      id: 2,
      title: 'Advanced',
      description: 'Optimal for 100+ team size and company',
      priceMonthly: 339,
      priceAnnual: 3399,
    },
    {
      id: 3,
      title: 'Enterprise',
      description: 'Optimal for 1000+ team and enterprise',
      priceMonthly: 999,
      priceAnnual: 9999,
    },
  ];

  return (
    
  <Layout>
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-3 col-md-4 mb-3">
          <div className="p-3">

            {products.map((product) => (
              <div key={product.id} className="mb-3">
                <button
                  className="btn btn-link text-start text-decoration-none w-100 text-left"
                  onClick={() => toggleProduct(product.id)}
                  aria-expanded={openProduct === product.id ? "true" : "false"}
                  style={{ color: 'inherit' }}
                >
                  <ProductLogo />
                  <span style={{ verticalAlign: 'middle' }}>{product.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-9 col-md-8">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h2>Choose Your Plan</h2>
              <p className="mb-5">
                If you need more info about our pricing, please check{' '}
                <a href="#" className="text-primary text-decoration-none fw-semibold">
                  Pricing Guidelines
                </a>
              </p>
              <div className="d-flex justify-content-center mb-4">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label
                    className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 ${billingCycle === 'Monthly' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('Monthly')}
                  >
                    <input type="radio" name="options" autoComplete="off" /> Monthly
                  </label>
                  <label
                    className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 ${billingCycle === 'Annual' ? 'active' : ''}`}
                    onClick={() => setBillingCycle('Annual')}
                  >
                    <input type="radio" name="options" autoComplete="off" /> Annual
                  </label>
                </div>
              </div>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="col-md-4 mb-4">
                <div className="card border-0 text-center p-3 h-100 bg-light shadow-sm">
                  <h5>{plan.title}</h5>
                  <p className="text-muted">{plan.description}</p>
                  <div className="price my-3">
                    ${billingCycle === 'Monthly' ? plan.priceMonthly : plan.priceAnnual + 9}
                    /Mon
                  </div>
                  <ul className="list-unstyled">
                    <li><i className="text-success">✓</i> Up to 10 Active Users</li>
                    <li><i className="text-success">✓</i> Up to 30 Project Integrations</li>
                    <li><i className="text-success">✓</i> Analytics Module</li>
                      <li><i className="text-success">✓</i> Finance Module</li>
                      <>
                        <li><i className="text-success">✓</i> Accounting Module</li>
                        <li><i className="text-success">✓</i> Network Platform</li>
                      </>
                    <li><i className="text-success">✓</i> Unlimited Cloud Space</li>
                  </ul>
                  <button className="btn btn-sm btn-primary">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default NewSubscription;
