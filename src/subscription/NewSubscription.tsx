import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { fetchProducts, fetchPlans } from '../auth/core/_requests';
import PlanCard from './PlanCard';

interface Product {
  _id: string;
  product_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  image: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  billing_cycle: string;
  features: string[];
  product_id: string;
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PlanToggle: React.FC<{ billingCycle: 'Monthly' | 'Annually'; setBillingCycle: (cycle: 'Monthly' | 'Annually') => void }> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="nav-group nav-group-outline mx-auto mb-15" style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 ${billingCycle === 'Monthly' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Monthly')}
        style={{
          border: billingCycle === 'Monthly' ? '1px solid #007bff' : '1px solid #6c757d',
          backgroundColor: billingCycle === 'Monthly' ? '#e9ecef' : 'transparent',
          color: billingCycle === 'Monthly' ? '#007bff' : '#6c757d',
        }}
      >
        Monthly
      </button>
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 ${billingCycle === 'Annually' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Annually')}
        style={{
          border: billingCycle === 'Annually' ? '1px solid #007bff' : '1px solid #6c757d',
          backgroundColor: billingCycle === 'Annually' ? '#e9ecef' : 'transparent',
          color: billingCycle === 'Annually' ? '#007bff' : '#6c757d',
        }}
      >
        Annually
      </button>
    </div>
  );
};

const NewSubscription: React.FC = () => {
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annually'>('Monthly');
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        const productsWithImages = data.map(product => ({
          ...product,
          image: `http://192.168.86.131:5000/uploads/${product._id}.svg`,
        }));
        setProducts(productsWithImages);

        if (productsWithImages.length > 0) {
          setOpenProduct(productsWithImages[0]._id);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    const getPlans = async () => {
      try {
        const data = await fetchPlans();
        setPlans(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    getProducts();
    getPlans();
  }, []);

  useEffect(() => {
    if (openProduct) {
      const filtered = plans.filter(
        (plan) => plan.product_id === openProduct && plan.billing_cycle.toLowerCase() === billingCycle.toLowerCase()
      );
      setFilteredPlans(filtered);
    }
  }, [openProduct, billingCycle, plans]);

  const toggleProduct = (id: string) => {
    setOpenProduct(openProduct === id ? null : id);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-3 col-md-4 mb-3 position-sticky top-0 vh-100 overflow-auto">
            <div className="p-3">
              {products.map((product) => (
                <div key={product._id} className="mb-3">
                  <button
                    className="btn btn-outline-secondary w-100 text-left d-flex align-items-center"
                    onClick={() => toggleProduct(product._id)}
                    aria-expanded={openProduct === product._id ? "true" : "false"}
                    style={{
                      transition: 'background-color 0.3s ease, color 0.3s ease',
                      backgroundColor: openProduct === product._id ? '#ffffff' : 'transparent',
                      color: openProduct === product._id ? '#000000' : '#6c757d',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = openProduct === product._id ? '#ffffff' : 'transparent';
                      e.currentTarget.style.color = openProduct === product._id ? '#000000' : '#6c757d';
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.product_name}
                      style={{ width: '100px', height: '30px', marginRight: '-25px' }}
                    />
                    <span className='fw-bold fs-5'>{product.product_name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 col-lg-9 col-md-8">
            <div className="row">
              <div className="col-12 text-center mb-1 mt-5">
                <h2>Choose Your Plan</h2>
                <p className="mb-5">
                  If you need more info about our pricing, please check{' '}
                  <a href="#" className="text-primary text-decoration-none fw-semibold">
                    Pricing Guidelines
                  </a>
                </p>
                <PlanToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
              </div>
              <div className={`row justify-content-${filteredPlans.length === 2 ? 'center' : 'start'}`}>
                {filteredPlans.map((plan, index) => (
                  <PlanCard
                    key={plan._id}
                    name={capitalizeFirstLetter(plan.name)}
                    price={plan.price}
                    features={plan.features}
                    isFourthPlan={index === 3}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewSubscription;
