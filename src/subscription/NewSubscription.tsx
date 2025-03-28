import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import { fetchProducts, fetchPlanByProductId } from '../auth/core/_requests';
import PlanCard from './PlanCard';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import SubscriptionModal from './SubscriptionModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCartAsync, fetchCartItemsAsync, removeCartItemAsync } from '../features/authSlice';

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
  billing_cycle?: string;
  isSubscribed?: boolean;
}

interface PlansGroup {
  billing_cycle: string;
  plans: Plan[];
}

const PlanToggle: React.FC<{
  billingCycle: 'Monthly' | 'Annually';
  setBillingCycle: (cycle: 'Monthly' | 'Annually') => void;
}> = ({ billingCycle, setBillingCycle }) => {
  return (
    <div className="nav-group nav-group-outline mx-auto mb-15" data-kt-buttons="true">
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 me-2 fw-semibold ${billingCycle === 'Monthly' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Monthly')}
      >
        Monthly
      </button>
      <button
        className={`btn btn-color-gray-400 btn-active btn-active-secondary px-6 py-3 fw-semibold ${billingCycle === 'Annually' ? 'active' : ''}`}
        onClick={() => setBillingCycle('Annually')}
      >
        Annually
      </button>
    </div>
  );
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const NewSubscription: React.FC = () => {
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annually'>('Monthly');
  const [products, setProducts] = useState<Product[]>([]);
  const [plansByBillingCycle, setPlansByBillingCycle] = useState<PlansGroup[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const { user, cart } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItemsAsync());
    }
  }, [dispatch, user]);

  const handleAddToCart = async (plan: Plan) => {
    if (!user?._id || !user.subscriptions || user.subscriptions.length === 0) {
      toast.error('You must have an active subscription to upgrade');
      return;
    }

    const currentSubscriptionId = user.subscriptions[0]._id;
    setProcessingPlanId(plan._id);

    try {
      await dispatch(addToCartAsync({
        planId: plan._id,
        currentSubscriptionId
      })).unwrap();
      toast.success('Plan added to cart successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      toast.error(errorMessage);
    } finally {
      setProcessingPlanId(null);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      const itemToRemove = cart.items.find(item => item._id === itemId);
      if (!itemToRemove) {
        throw new Error('Item not found in cart');
      }
      await dispatch(removeCartItemAsync(itemToRemove.plan_id._id)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setLoadingProducts(true);
        const data = await fetchProducts();
        const productsWithImages = data.map(product => ({
          ...product,
          image: `https://rightcomsaasapi-if7l.onrender.com/uploads/${product._id}.png`,
        }));
        setProducts(productsWithImages);

        if (productsWithImages.length > 0) {
          setOpenProduct(productsWithImages[0]._id);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoadingProducts(false);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (openProduct) {
      const getPlans = async () => {
        setLoadingPlans(true);
        try {
          const plans = await fetchPlanByProductId(openProduct);
          
          // Mapper les plans pour conserver la propriété isSubscribed
          const updatedPlans = plans.map((group: PlansGroup) => ({
            ...group,
            plans: group.plans.map((plan: Plan) => ({
              ...plan,
              isSubscribed: plan.isSubscribed || 
                           (user?.subscriptions?.some(sub => sub.plan_id === plan._id) || false
            )}))
          }));
  
          setPlansByBillingCycle(updatedPlans);
          
        } catch (error) {
          console.error('Failed to fetch plans:', error);
        } finally {
          setLoadingPlans(false);
        }
      };
      getPlans();
    }
  }, [openProduct, user?.subscriptions]);

  useEffect(() => {
    if (openProduct && plansByBillingCycle.length > 0) {
      const filtered = plansByBillingCycle
        .find((group) => group.billing_cycle.toLowerCase() === billingCycle.toLowerCase())
        ?.plans || [];
      setFilteredPlans(filtered);
    }
  }, [openProduct, billingCycle, plansByBillingCycle]);

  const toggleProduct = (id: string) => {
    setOpenProduct(openProduct === id ? null : id);
  };

  return (
    <Layout>
      <ToastContainer />
      <style>{`
        .spinner-border {
          width: 1.2rem;
          height: 1.2rem;
          border-width: 0.25em;
        }
        .btn-danger-permanent {
          background-color: #dc3545;
          color: white;
          border-color: #dc3545;
          transition: none;
        }
        .btn-danger-permanent:hover,
        .btn-danger-permanent:focus,
        .btn-danger-permanent:active {
          background-color: #dc3545 !important;
          color: white !important;
          box-shadow: none !important;
        }
        .btn-danger-permanent:disabled {
          opacity: 0.65;
          background-color: #dc3545 !important;
        }
        .product-loader {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      
      <div style={{ marginTop: '30px', marginBottom: '30px', paddingRight: '80px', paddingLeft: '10px', paddingTop: '30px' }} className="container mt-lg-10">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem', marginLeft:'117%' }} role="status">
                <span  className="visually-hidden">Loading...</span>
              </div>
              <p style={{marginLeft:'108%'}} className="mt-3">Loading</p>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-3 col-md-4 mb-3 position-sticky top-0 vh-100 overflow-auto">
              <div className="p-3">
                {loadingProducts ? (
                  <div className="product-loader">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product._id} className="mb-3">
                      <button
                        className="btn text-center d-flex"
                        onClick={() => toggleProduct(product._id)}
                        aria-expanded={openProduct === product._id ? "true" : "false"}
                        style={{
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          backgroundColor: openProduct === product._id ? '#ffffff' : 'transparent',
                          color: openProduct === product._id ? '#000000' : '#6c757d', 
                          width: '100%',
                          margin: '0 auto',  
                          justifyContent: 'center'        
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
                          style={{ width: '100px' }}
                        />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card border-0 col-lg-9 col-md-8 position-relative">
              <div
                style={{
                  position: 'absolute',
                  top: window.innerWidth < 768 ? '10px' : '-80px',
                  right: window.innerWidth < 768 ? '10px' : '20px',
                  zIndex: 1,
                  padding: '16px',
                  margin: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <button
                  className="btn btn-primary d-flex align-items-center shadow-sm"
                  style={{ padding: '12px 17px', position: 'relative', marginTop: window.innerWidth < 768 ? '0' : '-5px' }}
                  onClick={handleShowModal}
                >
                  <AiOutlineShoppingCart />
                  <span className="ms-2">Cart</span>
                  {cart.items.length > 0 && (
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
                      {cart.items.length}
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
                <div className={`row justify-content-${filteredPlans.length === 2 ? 'center' : 'start'} me-2`}>
                  {loadingPlans ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading plans...</p>
                    </div>
                  ) : (
                    filteredPlans.map((plan, index) => {
                      const product = products.find((p) => p._id === plan.product_id);
                      const isActive = plan.isSubscribed || (user?.subscriptions?.some(s => s.plan_id === plan._id) ?? false);
                      const cartItem = cart.items.find(item => item.plan_id._id === plan._id);
                      return (
                        <PlanCard
                          key={plan._id}
                          name={capitalizeFirstLetter(plan.name)}
                          price={plan.price}
                          features={plan.features}
                          isFourthPlan={index === 3}
                          isActive={isActive}
                          logo={product?.image || ''}
                          billingCycle={billingCycle}
                          onAddToCard={() => handleAddToCart(plan)}
                          onRemoveFromCart={handleRemoveFromCart}
                          isProcessing={processingPlanId === plan._id}
                          isFreePlan={plan.name.toLowerCase() === 'free'}
                          isInCart={!!cartItem}
                          cartItemId={cartItem?._id}
                          isSubscribed={plan.isSubscribed}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SubscriptionModal
        show={showModal}
        onHide={handleCloseModal}
        cartItems={cart.items}
        products={products} 
        onDelete={handleRemoveFromCart}
      />
    </Layout>
  );
};

export default NewSubscription;