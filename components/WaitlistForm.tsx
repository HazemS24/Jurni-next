'use client'

import { useState } from 'react'
import './WaitlistForm.css'

interface FormData {
  email: string
  firstName: string
  lastName: string
  role: 'investor' | 'employer' | 'applicant'
  heardAbout: string
  heardAboutOther?: string
  specificInterest: string
}

interface FieldErrors {
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  heardAbout?: string
  heardAboutOther?: string
}

interface ErrorResponse {
  error: string
  details: string
}

export default function WaitlistForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'applicant',
    heardAbout: '',
    heardAboutOther: '',
    specificInterest: ''
  })
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [errorDetails, setErrorDetails] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }

    // Clear other field when heardAbout changes
    if (name === 'heardAbout' && value !== 'other') {
      setFormData(prev => ({
        ...prev,
        heardAboutOther: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors: FieldErrors = {}
    let isValid = true

    // Validate required fields
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
      isValid = false
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
      isValid = false
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }
    }
    if (!formData.role) {
      errors.role = 'Please select a role'
      isValid = false
    }
    if (!formData.heardAbout) {
      errors.heardAbout = 'Please tell us how you heard about us'
      isValid = false
    }
    if (formData.heardAbout === 'other' && !formData.heardAboutOther?.trim()) {
      errors.heardAboutOther = 'Please elaborate on how you heard about us'
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    setErrorDetails('')

    try {
      // Prepare the data to send
      const submitData = {
        ...formData,
        heardAbout: formData.heardAbout === 'other' ? (formData.heardAboutOther || '') : formData.heardAbout
      }

      const response = await fetch('/api/interests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          role: 'applicant',
          heardAbout: '',
          heardAboutOther: '',
          specificInterest: ''
        })
        setFieldErrors({})
      } else {
        const errorData: ErrorResponse = await response.json()
        setErrorMessage(errorData.error || 'Something went wrong. Please try again.')
        setErrorDetails(errorData.details || '')
        setSubmitStatus('error')
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection and try again.')
      setErrorDetails('Make sure you have a stable internet connection and try submitting the form again.')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <section className="waitlist-form">
        <div className="container">
          <div className="form-container">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Thank You!</h2>
              <p>You've successfully joined the Jurni waitlist. We'll be in touch soon with updates and early access opportunities.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="waitlist-form">
      <div className="container">
        <div className="form-container">
          <div className="form-header">
            <h2>Join the Waitlist</h2>
            <p>Be among the first to experience Jurni's revolutionary career platform</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                  placeholder="Enter your first name"
                />
                {fieldErrors.firstName && (
                  <div className="field-error">{fieldErrors.firstName}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                  placeholder="Enter your last name"
                />
                {fieldErrors.lastName && (
                  <div className="field-error">{fieldErrors.lastName}</div>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {fieldErrors.email && (
                <div className="field-error">{fieldErrors.email}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="role">What will you be? *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`form-select ${fieldErrors.role ? 'error' : ''}`}
              >
                <option value="applicant">Applicant - Looking for opportunities</option>
                <option value="employer">Employer - Hiring talent</option>
                <option value="investor">Investor - Interested in the platform</option>
              </select>
              {fieldErrors.role && (
                <div className="field-error">{fieldErrors.role}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="heardAbout">How did you hear about us? *</label>
              <select
                id="heardAbout"
                name="heardAbout"
                value={formData.heardAbout}
                onChange={handleInputChange}
                className={`form-select ${fieldErrors.heardAbout ? 'error' : ''}`}
              >
                <option value="">Select an option</option>
                <option value="search">Search Engine (Google, Safari, Bing, etc…)</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="wordofmouth">Word of Mouth</option>
                <option value="referral">Referral</option>
                <option value="news">Online News Article / Blog</option>
                <option value="newsletter">Email Newsletters</option>
                <option value="sms">SMS Marketing</option>
                <option value="ads">Online Ads</option>
                <option value="other">Other</option>
              </select>
              {fieldErrors.heardAbout && (
                <div className="field-error">{fieldErrors.heardAbout}</div>
              )}
            </div>

            {formData.heardAbout === 'other' && (
              <div className="form-group full-width">
                <label htmlFor="heardAboutOther">Please elaborate on how you heard about us *</label>
                <input
                  type="text"
                  id="heardAboutOther"
                  name="heardAboutOther"
                  value={formData.heardAboutOther}
                  onChange={handleInputChange}
                  className={`form-input ${fieldErrors.heardAboutOther ? 'error' : ''}`}
                  placeholder="Please tell us how you heard about Jurni..."
                />
                {fieldErrors.heardAboutOther && (
                  <div className="field-error">{fieldErrors.heardAboutOther}</div>
                )}
              </div>
            )}

            <div className="form-group full-width">
              <label htmlFor="specificInterest">What specifically are you looking for?</label>
              <textarea
                id="specificInterest"
                name="specificInterest"
                value={formData.specificInterest}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Tell us what you're hoping to get from Jurni..."
                rows={3}
              />
            </div>

            {submitStatus === 'error' && (
              <div className="error-message">
                <div className="error-title">{errorMessage}</div>
                {errorDetails && <div className="error-details">{errorDetails}</div>}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-submit"
            >
              {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
