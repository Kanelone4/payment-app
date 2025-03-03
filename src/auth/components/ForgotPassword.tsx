import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestPassword } from '../core/_requests';

const initialValues = {
  email: '',
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
});

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
     
      setTimeout(() => {
        requestPassword(values.email)
          .then(() => {
          
            setLoading(false);
            toast.success('Password reset sent. Please check your email.');
          })
          .catch(() => {

            setLoading(false);
            setSubmitting(false);
            setStatus('The login detail is incorrect');
            toast.error('Failed to send password reset. Please try again.');
          });
      }, 1000);
    },
  });

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg  w-full max-w-md">
        <form
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_login_password_reset_form'
          onSubmit={formik.handleSubmit}
        >
          <div className='text-center mb-10'>
            <h1 className='text-dark fw-bolder mb-3'>Forgot Password?</h1>
            <div className='text-gray-500 fw-semibold fs-6'>
              Enter your email to reset your password.
            </div>
          </div>

          

          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
            <input
              type='email'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>

          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
              <span className='indicator-label'>Submit</span>
              {loading && (
                <span className='indicator-progress'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            <Link to='/auth/login'>
              <button
                type='button'
                id='kt_login_password_reset_form_cancel_button'
                className='btn btn-light'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
