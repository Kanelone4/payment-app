import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Passwords do not match"),
  acceptTerms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
})

export default function Registration() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true)
      setTimeout(() => {
        console.log('Form submitted successfully:', values)
        setStatus('Registration successful!')
        setSubmitting(false)
        setLoading(false)
        navigate('/auth/login')
      }, 1000) 
    },
  })

  return (
    
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
          <div className="d-flex flex-center flex-column flex-lg-row-fluid">
            <div className="container d-flex align-items-center justify-content-center min-vh-50">
            <div className="w-lg-500px p-10">
            <form className='form w-100' noValidate id='kt_login_signup_form' onSubmit={formik.handleSubmit}>
              <div className='text-center mb-11'>
                <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
              </div>

              {status && <div className='mb-lg-15 alert alert-success'>{status}</div>}

              <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>First name</label>
                <input placeholder='First name' type='text' {...formik.getFieldProps('firstname')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.firstname && formik.errors.firstname,})} />
              </div>
              
              <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
                <input placeholder='Last name' type='text' {...formik.getFieldProps('lastname')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.lastname && formik.errors.lastname,})} />
              </div>
              
              <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                <input placeholder='Email' type='email' {...formik.getFieldProps('email')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.email && formik.errors.email,})} />
              </div>
              
              <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                <input type='password' placeholder='Password' {...formik.getFieldProps('password')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.password && formik.errors.password,})} />
              </div>
              
              <div className='fv-row mb-8'>
                <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
                <input type='password' placeholder='Password confirmation' {...formik.getFieldProps('changepassword')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.changepassword && formik.errors.changepassword,})} />
              </div>

              <div className='fv-row mb-8'>
                <label className='form-check'>
                  <input className='form-check-input' type='checkbox' {...formik.getFieldProps('acceptTerms')} />
                  <span>I accept the <a href='#' className='ms-1 link-primary text-decoration-none'>Terms</a>.</span>
                </label>
              </div>
                  <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-primary'
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && <span className='indicator-label'>Continue</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

