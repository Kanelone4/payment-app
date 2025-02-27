import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <div className='d-flex flex-column flex-lg-row flex-column-fluid h-100 position-relative'>
      {/* begin::Aside (Image as Background) */}
      <div
        className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2'
        style={{ backgroundImage: 'url(/assets/auth-bg.png)' }}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100'>
          
          {/* begin::Image */}
          <img className='d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20' src='/assets/media/misc/auth-screens.png' alt='' />
          {/* end::Image */}
          {/* begin::Title */}
          <h1 className='d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7'>
            Fast, Efficient and Productive
          </h1>
          {/* end::Title */}
          {/* begin::Text */}
          <div className='d-none d-lg-block text-white fs-base text-center'>
            In this kind of post,{' '}
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
              the blogger
            </a>
            introduces a person they’ve interviewed <br /> and provides some background information about
            <a href='#' className='opacity-75-hover text-warning fw-bold me-1'>
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
      <div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1 position-relative z-index-2'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        
        <div className='d-flex flex-center flex-wrap px-5'>
          <div className='d-flex fw-semibold text-primary fs-base'>
            <a href='#' className='px-5' target='_blank'>
              Terms
            </a>
            <a href='#' className='px-5' target='_blank'>
              Plans
            </a>
            <a href='#' className='px-5' target='_blank'>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
