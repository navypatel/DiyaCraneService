import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: 'General Inquiry' | 'HYDRA' | 'FARANA';
  projectDetails: string;
  agree: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  projectDetails?: string;
  agree?: string;
}

export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service: 'General Inquiry',
    projectDetails: '',
    agree: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  // Extract service from URL query params (e.g., ?service=hydra -> HYDRA)
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const canonical = serviceParam.toUpperCase();
      if (canonical === 'HYDRA' || canonical === 'FARANA') {
        setFormData((prev) => ({
          ...prev,
          service: canonical as 'HYDRA' | 'FARANA',
        }));
      }
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Full Name must be at least 3 characters';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email address is required';
    }

    // Accepts 10 digits as is, or with '+91' or '91' prefix
    const cleanedPhone = formData.phone.replace(/[\s-]/g, '');
    if (!/^(?:\+?91)?[6-9]\d{9}$/.test(cleanedPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.projectDetails.trim() || formData.projectDetails.trim().length < 10) {
      newErrors.projectDetails = 'Please provide details about the lift workload (minimum 10 characters)';
    }

    if (!formData.agree) {
      newErrors.agree = 'You must confirm that your lift details are accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      if (errors.agree) {
        setErrors((prev) => ({ ...prev, agree: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setApiErrorMessage('');

    try {
      const response = await fetch('/api/sheets/submit-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          projectDetails: formData.projectDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected submission');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'General Inquiry',
        projectDetails: '',
        agree: false,
      });
      
      // Auto close/reset success badge after 6 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 6000);
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setApiErrorMessage(err.message || 'Verification connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md border border-gray-150" id="contact-booking-form">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-extrabold text-brand-black tracking-tight">Request an Operational Quote</h3>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Complete the form below. Our certified ground crew will reach out within 24 hours.
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 text-green-800" id="contact-form-success">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Thank You!</p>
            <p className="text-xs text-green-700 font-sans mt-0.5">
              Your inquiry has been stored securely. Our Valsad dispatch crew will phone you shortly.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-brand-red" id="contact-form-error">
          <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Quotation Submission Error</p>
            <p className="text-xs text-red-700 font-sans mt-0.5">{apiErrorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Row 1: Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name-input" className="text-xs font-mono uppercase tracking-wider text-brand-black/70">
            Full Name <span className="text-brand-red">*</span>
          </label>
          <input
            id="name-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ketan Patel"
            className={`w-full px-4 py-3 bg-brand-gray border rounded text-sm focus:outline-none focus:ring-1 transition-all ${
              errors.name 
                ? 'border-brand-red focus:ring-brand-red' 
                : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
            }`}
          />
          {errors.name && <span className="text-xs text-brand-red font-sans">{errors.name}</span>}
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-input" className="text-xs font-mono uppercase tracking-wider text-brand-black/70">
              Email Address <span className="text-brand-red">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. k.patel@mills.com"
              className={`w-full px-4 py-3 bg-brand-gray border rounded text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.email 
                  ? 'border-brand-red focus:ring-brand-red' 
                  : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
              }`}
            />
            {errors.email && <span className="text-xs text-brand-red font-sans">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone-input" className="text-xs font-mono uppercase tracking-wider text-brand-black/70">
              Phone Number <span className="text-brand-red">*</span>
            </label>
            <input
              id="phone-input"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit Indian Number"
              className={`w-full px-4 py-3 bg-brand-gray border rounded text-sm focus:outline-none focus:ring-1 transition-all ${
                errors.phone 
                  ? 'border-brand-red focus:ring-brand-red' 
                  : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
              }`}
            />
            {errors.phone && <span className="text-xs text-brand-red font-sans">{errors.phone}</span>}
          </div>
        </div>

        {/* Row 3: Service Selection */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="service-select" className="text-xs font-mono uppercase tracking-wider text-brand-black/70">
            Service Required <span className="text-brand-red">*</span>
          </label>
          <select
            id="service-select"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-brand-gray border border-gray-250 rounded text-sm focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-all"
          >
            <option value="General Inquiry">General Crane Inquiry</option>
            <option value="HYDRA">HYDRA Mobile Crane Fleet (12T - 18T)</option>
            <option value="FARANA">FARANA Pick & Carry Series (15T - 25T)</option>
          </select>
        </div>

        {/* Row 4: Project Details */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="details-textarea" className="text-xs font-mono uppercase tracking-wider text-brand-black/70">
            Project and Lift Sizing Details <span className="text-brand-red">*</span>
          </label>
          <textarea
            id="details-textarea"
            name="projectDetails"
            value={formData.projectDetails}
            onChange={handleChange}
            rows={4}
            placeholder="e.g. Need to lift an 11-ton chemical tank off a trailer bed and position onto a 4-foot GIDC concrete base plat. Total hook vertical reach: 35 feet."
            className={`w-full px-4 py-3 bg-brand-gray border rounded text-sm focus:outline-none focus:ring-1 transition-all ${
              errors.projectDetails 
                ? 'border-brand-red focus:ring-brand-red' 
                : 'border-gray-250 focus:border-brand-yellow focus:ring-brand-yellow'
            }`}
          />
          {errors.projectDetails && <span className="text-xs text-brand-red font-sans">{errors.projectDetails}</span>}
        </div>

        {/* Row 5: Agree toggle */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-start gap-2.5">
            <input
              id="agree-checkbox"
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-brand-yellow accent-brand-yellow rounded border-gray-300 focus:ring-brand-yellow"
            />
            <label htmlFor="agree-checkbox" className="text-xs text-gray-600 font-sans select-none leading-relaxed">
              I agree that the details supplied about the lift load sizing, operational ground platform, and time schedules are accurate to the best of my knowledge. <span className="text-brand-red">*</span>
            </label>
          </div>
          {errors.agree && <span className="text-xs text-brand-red font-sans mt-0.5">{errors.agree}</span>}
        </div>

        {/* Submit */}
        <button
          id="contact-form-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3.5 bg-brand-yellow hover:bg-brand-yellow-hover disabled:bg-gray-200 disabled:text-gray-400 text-brand-black font-extrabold text-sm uppercase tracking-wider rounded transition-all active:scale-98 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brand-black" />
              Mobilizing Data...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-brand-black" />
              Send Enquiry
            </>
          )}
        </button>

      </form>
    </div>
  );
}
