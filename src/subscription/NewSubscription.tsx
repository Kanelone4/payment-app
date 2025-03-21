import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { fetchProducts, fetchPlanByProductId, createSubscription } from '../auth/core/_requests';
import PlanCard from './PlanCard';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import SubscriptionModal from './SubscriptionModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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
  features: string[];
  product_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PlansGroup {
  billing_cycle: string;
  plans: Plan[];
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPrice = (price: number) => {
  return price.toFixed(2);
}

const PlanToggle: React.FC<{ billingCycle: 'Monthly' | 'Annually'; setBillingCycle: (cycle: 'Monthly' | 'Annually') => void }> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="nav-group nav-group-outline mx-auto mb-15 " data-kt-buttons="true">
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 fw-semibold ${billingCycle === 'Monthly' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Monthly')}
        data-kt-plan="month"
      >
        Monthly
      </button>
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 fw-semibold ${billingCycle === 'Annually' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Annually')}
        data-kt-plan="annual"
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
  const [plansByBillingCycle, setPlansByBillingCycle] = useState<PlansGroup[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Plan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isPaymentCompleted] = useState(false); 

  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleAddToCard = async (plan: Plan, productName: string) => {
    console.log('handleAddToCard called'); 

    if (activePlanId && activePlanId !== plan._id && !isPaymentCompleted) {
      toast.error('You must complete the payment for the current plan before selecting another.');
      return;
    }

    const subscriptionWithProduct = {
      ...plan,
      product_name: productName,
    };
    setSubscriptions((prev) => [...prev, subscriptionWithProduct]);

    setActivePlanId(plan._id);

    console.log('User ID:', userId);
    console.log('Plan ID:', plan._id);

    if (userId && plan._id) {
      try {
        console.log('Calling createSubscription...'); 
        const response = await createSubscription(userId, plan._id);
        console.log('Subscription created successfully:', response);
        toast.success('Subscription created successfully!');
      } catch (error) {
        console.error('Failed to create subscription:', error);
        toast.error('Failed to create subscription.');
      }
    } else {
      console.error('User ID or Plan ID is missing'); 
      toast.error('User ID or Plan ID is missing.');
    }

  };

  const handleDeleteSubscription = (index: number) => {
    setSubscriptions((prev) => prev.filter((_: Plan, i: number) => i !== index));
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        const productsWithImages = data.map(product => ({
          ...product,
          image: `http://192.168.86.70:5000/uploads/${product._id}.png`,
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

    getProducts();
  }, []);

  useEffect(() => {
    if (openProduct) {
      const getPlans = async () => {
        try {
          const plans = await fetchPlanByProductId(openProduct); 
          setPlansByBillingCycle(plans);

        } catch (error) {
          console.error('Failed to fetch plans:', error);
          setError('Failed to fetch plans');
        }
      };
      getPlans();
    }
  }, [openProduct]);

  useEffect(() => {
    if (openProduct && plansByBillingCycle.length > 0) {
      const filtered = plansByBillingCycle
        .find((group) => group.billing_cycle.toLowerCase() === billingCycle.toLowerCase())
        ?.plans || [];
      setFilteredPlans(filtered);

      
      console.log('Plans filtrés:', filtered);
    }
  }, [openProduct, billingCycle, plansByBillingCycle]);


  const toggleProduct = (id: string) => {
    console.log('Produit cliqué - ID:', id); 
    setOpenProduct(openProduct === id ? null : id);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <ToastContainer />
      <div style={{ marginTop: '30px', marginBottom: '30px', padding: '30px' }} className="container mt-lg-10">
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
                      style={{ width: '80%' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card border-0 col-lg-9 col-md-8 position-relative">
            <div
              style={{
                position: 'absolute',
                top: '-80px',
                right: '20px',
                zIndex: 1,
                padding: '16px',
                margin: '16px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <button
                className="btn btn-primary d-flex align-items-center shadow-sm "
                style={{ padding: '12px 17px', position: 'relative', marginTop:'-5px' }}
                onClick={handleShowModal}
              >
                <AiOutlineShoppingCart />
                <span className="ms-2">Card</span>
                {subscriptions.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-10px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '2px 8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    {subscriptions.length}
                  </span>
                )}
              </button>
            </div>

            <div className="row mb-3">
              <div className="col-12 text-center mb-3 mt-5">
                <h1>Choose Your Plan</h1>
                <p className="mb-5 fw-semibold" style={{ color: '#a5a8b0', fontSize: '14px' }}>
                  If you need more info about our pricing, please check{' '}
                  <a href="#" className="text-decoration-none fw-semibold" style={{ color: '#009ef7' }}>
                    Pricing Guidelines
                  </a>
                </p>
                <PlanToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
              </div>
              <div className={`row justify-content-${filteredPlans.length === 2 ? 'center' : 'start'} ms-0`}>
                {filteredPlans.map((plan, index) => {
                  const product = products.find((p) => p._id === plan.product_id);
                  return (
                    <PlanCard
                      key={plan._id}
                      name={capitalizeFirstLetter(plan.name)}
                      price={plan.price}
                      features={plan.features}
                      isFourthPlan={index === 3}
                      isActive={plan._id === activePlanId}
                      logo={product ? product.image : ''}
                      billingCycle={billingCycle}
                      onAddToCard={() => handleAddToCard(plan, product?.product_name || '')} 
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SubscriptionModal
        show={showModal}
        onHide={handleCloseModal}
        subscriptions={subscriptions}
        onDelete={handleDeleteSubscription}
      />
    </Layout>
  );
};

export default NewSubscription;