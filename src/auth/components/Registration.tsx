import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { registerUser } from '../../features/authSlice';
import { Link } from 'react-router-dom';
import "../../../public/assets/css/style.css"
import "../../../public/assets/css/plugins.css"
const initialValues = {
  nom: '',
  prenom: '',
  email: '',
  password: ''
};

const registrationSchema = Yup.object().shape({
  nom: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Nom is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  prenom: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Prenom is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .max(50, 'Maximum 50 symbols')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
    
 
});

export default function Registration() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000); 
      
      } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        toast.error("Failed to register. Please check your connection and try again.");
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <form className='form' noValidate id='kt_login_signup_form' onSubmit={formik.handleSubmit}>
          <div className='text-center mb-8'>
            <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
          </div>

          <div className='row g-3 mb-9'>
            <div className='col-md-6'>
              <a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100 py-3 fs-6">
                <img alt="Logo" src="/assets/google-icon.svg" className="h-20px me-3" />
                Sign in with Google
              </a>
            </div>
            <div className='col-md-6'>
              <a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100 py-3 fs-6">
                <img alt="Logo" src="/assets/apple-black.svg" className="theme-light-show h-20px me-3" />
                <img alt="Logo" src="/assets/apple-black-dark.svg" className="theme-dark-show h-20px me-3" />
                Sign in with Apple
              </a>
            </div>
          </div>

          
          <div className='separator separator-content my-14'>
            <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
          </div>

          <div className='row g-4 mb-6'>
          
            <div className='col-md-6'>
              <input
                placeholder='Nom'
                type='text'
                {...formik.getFieldProps('nom')}
                className={clsx('form-control py-3', {
                  'is-invalid': formik.touched.nom && formik.errors.nom,
                })}
              />
              {formik.touched.nom && formik.errors.nom && (
                <div className='invalid-feedback'>{formik.errors.nom}</div>
              )}
            </div>

            
            <div className='col-md-6'>
              <input
                placeholder='Prénom'
                type='text'
                {...formik.getFieldProps('prenom')}
                className={clsx('form-control py-3', {
                  'is-invalid': formik.touched.prenom && formik.errors.prenom,
                })}
              />
              {formik.touched.prenom && formik.errors.prenom && (
                <div className='invalid-feedback'>{formik.errors.prenom}</div>
              )}
            </div>
          </div>

          
          <div className='mb-4'>
            <input
              placeholder='Email'
              type='email'
              {...formik.getFieldProps('email')}
              className={clsx('form-control py-3', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='invalid-feedback'>{formik.errors.email}</div>
            )}
          </div>

          <div className='mb-4'>
            <input
              type='password'
              placeholder='Password'
              {...formik.getFieldProps('password')}
              className={clsx('form-control py-3', {
                'is-invalid': formik.touched.password && formik.errors.password,
              })}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='invalid-feedback'>{formik.errors.password}</div>
            )}
          </div>

                   
          <div className='d-grid mb-4'>
            <button
              type='submit'
              id='kt_sign_in_submit'
              className='btn btn-primary'
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {!formik.isSubmitting && <span className='indicator-label fw-semibold'>Sign up</span>}
              {formik.isSubmitting && (
                <span className='indicator-progress d-block'>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>

          <div className='text-gray-500 text-center fw-semibold fs-6'>
            Already have an Account?{' '}
            <Link to='/auth/login' className='link-primary fw-semibold text-decoration-none'>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
