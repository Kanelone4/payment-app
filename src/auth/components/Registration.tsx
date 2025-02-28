import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import { AppDispatch } from '../../store'; 
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/authSlice';
import { RootState } from '../../store';

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
};

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
  
});


export default function Registration() {
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth); // Accède à l'état Redux

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await dispatch(registerUser(values)).unwrap(); // Correction ici
        navigate('/auth/login');
      }  catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="" id="kt_app_root">
      <div className="">
        <div className="">
          <div className="">
            <div className="">
              <div className="">
                <form className='form w-100' noValidate id='kt_login_signup_form' onSubmit={formik.handleSubmit}>
                  <div className='text-center mb-11'>
                    <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
                  </div>

                  {/* Affiche les messages d'erreur ou de succès */}
                  {status === 'failed' && <div className='mb-lg-15 alert alert-danger'>{error}</div>}
                  {status === 'succeeded' && <div className='mb-lg-15 alert alert-success'>Registration successful!</div>}

                  {/* Champs du formulaire */}
                  <div className='fv-row mb-8'>
                    <label className='form-label fw-bolder text-dark fs-6'>First name</label>
                    <input placeholder='First name' type='text' {...formik.getFieldProps('firstname')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.firstname && formik.errors.firstname,})} />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.firstname}</div>
                      </div>
                    )}
                  </div>

                  <div className='fv-row mb-8'>
                    <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
                    <input placeholder='Last name' type='text' {...formik.getFieldProps('lastname')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.lastname && formik.errors.lastname,})} />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.lastname}</div>
                      </div>
                    )}
                  </div>

                  <div className='fv-row mb-8'>
                    <label className='form-label fw-bolder text-dark fs-6'>Email</label>
                    <input placeholder='Email' type='email' {...formik.getFieldProps('email')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.email && formik.errors.email,})} />
                    {formik.touched.email && formik.errors.email && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.email}</div>
                      </div>
                    )}
                  </div>

                  <div className='fv-row mb-8'>
                    <label className='form-label fw-bolder text-dark fs-6'>Password</label>
                    <input type='password' placeholder='Password' {...formik.getFieldProps('password')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.password && formik.errors.password,})} />
                    {formik.touched.password && formik.errors.password && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.password}</div>
                      </div>
                    )}
                  </div>

                  <div className='fv-row mb-8'>
                    <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
                    <input type='password' placeholder='Password confirmation' {...formik.getFieldProps('changepassword')} className={clsx('form-control bg-transparent', {'is-invalid': formik.touched.changepassword && formik.errors.changepassword,})} />
                    {formik.touched.changepassword && formik.errors.changepassword && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>{formik.errors.changepassword}</div>
                      </div>
                    )}
                  </div>

                 

                  <div className='d-grid mb-10'>
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-primary'
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      {!formik.isSubmitting && <span className='indicator-label'>Continue</span>}
                      {formik.isSubmitting && (
                        <span className='indicator-progress' style={{ display: 'block' }}>
                          Please wait...
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}