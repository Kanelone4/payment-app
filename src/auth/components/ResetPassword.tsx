import { useState } from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from '../core/_requests';

const initialValues = {
  newPassword: '',
};

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .required('Password is required'),
});

export function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

 
  console.log('Reset Password Token:', token);

  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        if (!token) {
          throw new Error('Invalid or missing token.');
        }

        console.log('Submitting with token:', token);

        const response = await resetPassword(values.newPassword, token);
        toast.success(response.message || 'Password has been successfully reset!');
        navigate('/auth/login');
      } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  if (!token) {
    toast.error('Invalid or missing token. Please try again.');
    setTimeout(() => navigate('/auth/login'), 3000);
    return (
      <div className="bg-gray-100 flex items-center justify-center h-screen">
        <ToastContainer />
        <div className="text-center">
          <p>Invalid or missing token. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <form
          className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
          noValidate
          id='kt_reset_password_form'
          onSubmit={formik.handleSubmit}
        >
          <div className='text-center mb-10'>
            <h1 className='text-dark fw-bolder mb-3'>Reset Password</h1>
          </div>

          <div className='fv-row mb-8'>
            <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
            <input
              type='password'
              placeholder=''
              {...formik.getFieldProps('newPassword')}
              className={clsx(
                'form-control bg-transparent',
                {'is-invalid': formik.touched.newPassword && formik.errors.newPassword},
                {
                  'is-valid': formik.touched.newPassword && !formik.errors.newPassword,
                }
              )}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.newPassword}</span>
                </div>
              </div>
            )}
          </div>

          <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
            <button type='submit' id='kt_reset_password_submit' className='btn btn-primary me-4'>
              <span className='indicator-label'>Submit</span>
              {loading && (
                <span className='indicator-progress'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
