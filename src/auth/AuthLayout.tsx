import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
    }
    return () => {
      if (root) {
        root.style.height = 'auto';
      }
    };
  }, []);

  return (
    <div className='d-flex flex-column flex-lg-row vh-100'>
      {/* begin::Aside (Image as Background) */}
      <div
        className='d-flex flex-column flex-center bgi-size-cover bgi-position-center bgi-no-repeat order-1 order-lg-2 w-100 w-lg-50 p-16'
        style={{ backgroundImage: 'url(/assets/auth-bg.png)' }}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center p-3 p-lg-5'>
          {/* begin::Title */}
          <h1 className='text-white fs-2hx fw-bold text-center'>
            Fast, Efficient and Productive
          </h1>
          {/* end::Title */}
          {/* begin::Text */}
          <div className='d-none d-lg-block text-white fs-base text-center'>
            In this kind of post,{' '}
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1 text-decoration-none'>
              the blogger
            </a>
            introduces a person they’ve interviewed <br /> and provides some background information about
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1 text-decoration-none'>
              the interviewee
            </a>
            and their <br /> work following this is a transcript of the interview.
          </div>
          {/* end::Text */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::Aside */}

      {/* begin::Body (Form) */}
      <div className='d-flex flex-column flex-lg-row-fluid flex-center w-100 order-2 order-lg-1 p-3 p-lg-5'>
        {/* begin::Form */}
        <div className='w-100 w-lg-500px p-3 p-lg-5'>
          <Outlet />
        </div>

        <div className='d-flex justify-content-center flex-wrap px-5 mt-auto'>
          <div className="d-flex align-items-center gap-4">
            <a style={{ cursor: 'pointer', textDecoration: 'none' }} href="#" target="_blank" className="text-primary fw-semibold fs-base">Terms</a>
            <a style={{ cursor: 'pointer', textDecoration: 'none' }} href="#" target="_blank" className="text-primary fw-semibold fs-base">Plans</a>
            <a style={{ cursor: 'pointer', textDecoration: 'none' }} href="#" target="_blank" className="text-primary fw-semibold fs-base">Contact Us</a>
          </div>
        </div>
      </div>
      {/* end::Body */}
    </div>
  );
};

export { AuthLayout };
