import React, { useRef, useCallback } from 'react'
import { useHistory } from "react-router-dom"
import { Formik, Field, ErrorMessage } from 'formik'

import SigninValidateSchema from '../../validate/authValidate'
import { postData } from '../functions/requests'

const SignIn = () => {
  const history = useHistory()
  const formikRef = useRef()
  const onSubmit = useCallback((values) => {
    async function foo() {
      try {
        const errorsFromServer = await postData(values, '/api/v1/auth')
        if (errorsFromServer) {
          formikRef.current.setErrors(errorsFromServer)
          if (errorsFromServer.success === "Login successful." && errorsFromServer.user) {
            setTimeout(() => history.push({
              pathname: "/",
              user: errorsFromServer.user
            }), 1000)
          }
          // console.log('errorsFromServer:', formikRef.current)
        }

        formikRef.current.setSubmitting(false)
      } catch (e) {
        formikRef.current.setErrors({ error: 'Sorry, something went wrong, please try again.' })
        formikRef.current.setSubmitting(false)
      }
    }
    foo()
  })

  return (
    <>

      <div className="form">
        <div className="header">Sign In!</div>
        <Formik
          innerRef={formikRef}
          initialValues={{ email: '', password: '' }}
          validationSchema={SigninValidateSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            isSubmitting, }) => (
            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label className={values.email ? "active" : ""} htmlFor="email">Email Address<span>*</span></label>
                <Field type="email" name="email" id="email" onChange={handleChange} />
                <ErrorMessage name="email" component="div" />
              </div>
              <div className="field-wrap">
                <label className={values.password ? "active" : ""} htmlFor="password">Password<span>*</span></label>
                <Field type="password" name="password" id="password" />
                <ErrorMessage name="password" component="div" />
                <div>
                  {errors.success ? (<div className="success">{errors.success} </div>) : null}
                  {errors.error ? (<div>{errors.error} </div>) : null}
                </div>
              </div>

              <button type="submit" className="button" disabled={isSubmitting}>
                Submit
                </button>
            </form>
          )}
        </Formik >
      </div>
    </>
  )
}

export default SignIn
