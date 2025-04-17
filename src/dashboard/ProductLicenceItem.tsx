import  { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { getLicensesByProductId } from "../auth/core/_requests"; 
import './ProductLicenceItem.css'; 
import { useTranslation } from "react-i18next";
interface ProductLicenseItemProps {
    product: Product;
  }
  interface Product {
    _id: string;
    product_name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  interface License {
    _id: string;
    key: string;
    user_id: string;
    plan_id: {
      _id: string;
      name: string;
      price: number;
      billing_cycle: string;
      features: string[];
      product_id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    subscription_id: string;
    expires_at: string;
    is_active: boolean;
    status: 'active' | 'inactive' | 'expired';
    created_at: string;
    __v: number;
  }
  
  export const ProductLicenseItem = ({ product }: ProductLicenseItemProps) => {
    const { t } = useTranslation('dashboard')
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchLicenses = async () => {
          try {
            const licenses: License[] = await getLicensesByProductId(product._id);
            const activeLicenses = licenses.filter((license: License) => license.is_active);
            setLicenses(activeLicenses);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load license data');
          } finally {
            setLoading(false);
          }
        };
  
      fetchLicenses();
    }, [product._id]);
  
    if (licenses.length === 0 && !loading && !error) {
      return null;
    }
  
    return (
      <div className="d-flex align-items-center mb-3 product-item">
        <div className="icon-wrapper me-3 d-flex align-items-center justify-content-center">
          <img
            src={`https://rightcomsaasapi-if7l.onrender.com/uploads/${product._id}.png`}
            alt=''
            style={{ 
              width: "120px", 
              objectFit: "contain",
              marginBottom: '40px', 
              marginLeft: '50px'
            }}
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div style={{marginLeft:'-75px', marginTop:'10px'}} className="flex-grow-1 me-3 px-4">
          <div className="fw-semi ">{t('modal.License Total')}</div>
          {loading ? (
            <div className="small text-muted"></div>
          ) : error ? (
            <div className="small text-danger">Error loading data</div>
          ) : (
            <div className="small text-muted">
             
            </div>
          )}
        </div>
        <div 
          className="ms-3 bg-primary-subtle d-flex align-items-center justify-content-center"
          style={{ width: "40px", height: "40px", borderRadius: "4px" }}
        >
          {loading ? (
            <FaSpinner className="fa-spin" size={14} />
          ) : error ? (
            <span className="text-danger">!</span>
          ) : (
            <span className="fw-bold px-4">{licenses.length}</span>
          )}
        </div>
      </div>
    );
  };