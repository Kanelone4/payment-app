import { useState,  } from 'react'; 
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'; 
import { loginUser } from '../../features/authSlice';
import { AppDispatch, RootState } from '../../store';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .max(50, 'Maximum 50 symbols')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .required('Password is required'),
});

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token); 

    if (isAuthenticated) {
      navigate('/');
    }
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      console.log("Form submitted with values:", values); 
      try {
        console.log("Dispatching loginUser..."); 
        const resultAction = await dispatch(loginUser(values));
        console.log("Dispatch result:", resultAction); 
  
        if (loginUser.fulfilled.match(resultAction)) {
          toast.success('Login successful!');
          setTimeout(() => {
            navigate('/'); 
          }, 2000);
        } else {
          toast.error('Invalid email or password');
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        toast.error('Failed to connect. Please check your credentials and try again.');
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div style={{marginTop: '100px'}} className="bg-gray-100 flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <form
          className='form w-100'
          onSubmit={formik.handleSubmit}
          noValidate
          id='kt_login_signin_form'
        >
          <div className='text-center mb-11'>
            <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
          </div>

          <div className='fv-row mb-6'>
            <input
              placeholder='Email'
              type='email'
              {...formik.getFieldProps('email')}
              className={clsx('form-control py-3 bg-transparent border-gray-300', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container invalid-feedback'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>

          <div className='fv-row mb-6'>
            <input
              type='password'
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx('form-control py-3 bg-transparent border-gray-300', {
                'is-invalid': formik.touched.password && formik.errors.password,
              })}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container invalid-feedback'>
                <span role='alert'>{formik.errors.password}</span>
              </div>
            )}
          </div>

          <div className="d-flex flex-column align-items-center mb-8 fw-semibold ">
            <div className="d-none d-sm-block" />
            <Link to="/auth/forgot-password" className="link-primary text-decoration-none">
              Forgot Password ?
            </Link>
          </div>

          <div className='d-grid mb-10'>
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-primary'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!loading && <span className='indicator-label fw-semibold'>Sign in</span>}
              {loading && (
                <span className='indicator-progress d-block'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>

          <div className='text-gray-500 text-center fw-semibold fs-6'>
            Not a Member yet?{' '}
            <Link to='/auth/registration' className='link-primary fw-semibold text-decoration-none'>
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}