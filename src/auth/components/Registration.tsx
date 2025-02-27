import { useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { getUserByToken, register } from '../core/_requests'
import { useAuth } from '../core/Auth'
import { AuthModel } from '../core/_models'

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
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().oneOf([true], 'You must accept the terms and conditions'),
})

// Définition des props
interface RegistrationProps {
  onSuccess: () => void;
}

export default function Registration({ onSuccess }: RegistrationProps) {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await register(
          values.email,
          values.firstname,
          values.lastname,
          values.password,
          values.changepassword
        ) as { data: AuthModel | undefined } 

        if (auth) {
          saveAuth(auth)

          if (auth.api_token) {
            const { data: user } = await getUserByToken(auth.api_token)
            setCurrentUser(user)
          }

          // Appeler la fonction de succès passée en prop
          onSuccess()
        } else {
          throw new Error('Invalid authentication data')
        }
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The registration details are incorrect')
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })
  
  return (
    <form className='form w-100' noValidate id='kt_login_signup_form' onSubmit={formik.handleSubmit}>
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Sign Up</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Your Social Campaigns</div>
      </div>

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>First name</label>
        <input
          placeholder='First name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('firstname')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.firstname && formik.errors.firstname,
            'is-valid': formik.touched.firstname && !formik.errors.firstname,
          })}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
        <input
          placeholder='Last name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('lastname')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.lastname && formik.errors.lastname,
            'is-valid': formik.touched.lastname && !formik.errors.lastname,
          })}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.lastname}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.email && formik.errors.email,
            'is-valid': formik.touched.email && !formik.errors.email,
          })}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Password</label>
        <input
          type='password'
          placeholder='Password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.password && formik.errors.password,
            'is-valid': formik.touched.password && !formik.errors.password,
          })}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx('form-control bg-transparent', {
            'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
          })}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-check'>
          <input className='form-check-input' type='checkbox' {...formik.getFieldProps('acceptTerms')} />
          <span>I accept the <a href='#' className='ms-1 link-primary'>Terms</a>.</span>
        </label>
      </div>

      <button type='submit' className='btn btn-primary' disabled={loading}>
        {loading ? 'Please wait...' : 'Sign Up'}
      </button>
    </form>
  )
}

