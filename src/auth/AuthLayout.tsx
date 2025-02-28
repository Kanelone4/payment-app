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
        <div className='d-flex vh-100'>
      {/* begin::Aside (Image as Background) */}
      <div
        className='d-flex w-100 flex-column flex-center bgi-size-cover bgi-position-center bgi-no-repeat'
        style={{ backgroundImage: 'url(/assets/auth-bg.png)' }}
      >
        {/* begin::Content */}
        <div className='d-flex flex-column flex-center'>
          {/* begin::Title */}
          <h1 className='text-white fs-2hx fw-bold text-center'>
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
      <div className='w-100'>
        {/* begin::Form */}
        <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
          {/* begin::Wrapper */}
          <div className='w-lg-500px p-10'>
            <Outlet />
          </div>
          {/* end::Wrapper */}
        </div>
        
        <div className='d-flex flex-center flex-wrap px-5'>
          <div className="d-flex flex-column align-items-start px-5">
              <div className="d-flex fw-semibold text-primary fs-base gap-4">
                <a href="#" className="" target="_blank">
                  Terms
                </a>
                <a href="#" className="" target="_blank">
                  Plans
                </a>
                <a href="#" className="" target="_blank">
                  Contact Us
                </a>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export { AuthLayout }
