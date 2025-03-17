import React from 'react';

interface PlanProps {
  name: string;
  price: number;
  features: string[];
  isFourthPlan?: boolean; 
}

const PlanCard: React.FC<PlanProps> = ({ name, price, features, isFourthPlan = false }) => {
  return (
    <div className={`col-md-4 ${isFourthPlan ? 'mt-4' : ''}`}>
      <div className='card border-0 text-center p-4' style={{ height: '100%', display: 'flex', flexDirection: 'column',backgroundColor: '#f0f4f6', marginBottom: isFourthPlan ? '20px' : '0' }}>
        <span className='fw-bold fs-3' style={{ flex: '1 0 auto' }}>
          {name}
        </span>
        <p className='fw-bold' style={{ color: '#50cd89', fontSize: '20px', flex: '1 0 auto' }}>
          {price}$/Mon
        </p>
        <div style={{ flex: '2 0 auto' }}>
          <ul className="list-unstyled" style={{ textAlign: 'left', paddingLeft: '20px' }}>
            {features.map((feature, index) => (
              <li key={index} style={{ listStyleType: 'disc', marginBottom: '8px' }}>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
