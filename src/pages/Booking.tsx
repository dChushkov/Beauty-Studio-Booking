import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare, X, Star } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  time: string;
  notes: string;
  service: string;
}

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = 9 + i; // Starting from 9 AM
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Booking = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locationServiceId = location.state?.serviceId || 'bridal';
  const { theme } = useTheme();

  const [form, setForm] = useState<BookingForm>({
    name: '',
    email: '',
    phone: '',
    date: undefined,
    time: '',
    notes: '',
    service: locationServiceId,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(timeSlots);
  const [occupiedTimeSlots, setOccupiedTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Available service types
  const currentLang = i18n.language;
  const serviceTypes = [
    { 
      id: 'bridal', 
      label: currentLang === 'bg' ? 'Сватбен грим' : 'Bridal Makeup'
    },
    { 
      id: 'evening', 
      label: currentLang === 'bg' ? 'Вечерен грим' : 'Evening Makeup'
    },
    { 
      id: 'daily', 
      label: currentLang === 'bg' ? 'Ежедневен грим' : 'Daily Makeup'
    }
  ];

  // Load available time slots whenever date changes
  useEffect(() => {
    if (form.date) {
      loadAvailableTimeSlots(form.date);
    }
  }, [form.date]);

  const loadAvailableTimeSlots = async (date: Date) => {
    setLoading(true);
    setAvailableTimeSlots([]);
    setOccupiedTimeSlots([]);
    
    try {
      console.log('Loading available time slots for date:', date);
      
      const available: string[] = [];
      const occupied: string[] = [];
      
      // Check each time slot sequentially rather than in parallel
      // This is slower but more reliable, especially when the server is under load
      for (const time of timeSlots) {
        try {
          const isAvailable = await api.checkAvailability(date, time);
          if (isAvailable) {
            available.push(time);
          } else {
            occupied.push(time);
          }
        } catch (err) {
          console.error(`Error checking availability for ${time}:`, err);
          // In case of error, add the time to occupied slots for safety
          occupied.push(time);
        }
      }
      
      console.log('Available slots:', available);
      console.log('Occupied slots:', occupied);
      
      setAvailableTimeSlots(available);
      setOccupiedTimeSlots(occupied);
      
      // If the selected time is no longer available, reset it
      if (form.time && !available.includes(form.time)) {
        setForm(prev => ({ ...prev, time: '' }));
      }
    } catch (err) {
      console.error('Failed to load available time slots:', err);
      setError(t('booking.errors.loadSlotsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setForm(prev => ({ ...prev, date, time: '' })); // Reset time when date changes
    setShowDatePicker(false);
  };

  const handleTimeSelect = (time: string) => {
    setForm(prev => ({ ...prev, time }));
    setShowTimePicker(false);
  };

  const handleServiceSelect = (serviceId: string) => {
    setForm(prev => ({ ...prev, service: serviceId }));
    setShowServicePicker(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      errors.name = t('booking.errors.nameRequired');
    }
    
    if (!form.email.trim()) {
      errors.email = t('booking.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = t('booking.errors.emailInvalid');
    }
    
    if (!form.phone.trim()) {
      errors.phone = t('booking.errors.phoneRequired');
    }
    
    if (!form.date) {
      errors.date = t('booking.errors.dateRequired');
    }
    
    if (!form.time) {
      errors.time = t('booking.errors.timeRequired');
    }
    
    if (!form.service) {
      errors.service = t('booking.errors.serviceRequired');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (!form.date) throw new Error(t('booking.errors.dateRequired'));
      
      // Double-check if the slot is still available
      const isAvailable = await api.checkAvailability(form.date, form.time);
      
      if (!isAvailable) {
        setError(t('booking.errors.timeSlotTaken'));
        setForm(prev => ({ ...prev, time: '' }));
        await loadAvailableTimeSlots(form.date);
        setLoading(false);
        return;
      }
      
      // Create the booking
      await api.createBooking({
        serviceId: form.service as 'bridal' | 'evening' | 'daily',
        date: form.date,
        time: form.time,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        notes: form.notes,
      });
      
      // Show success message
      setSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(t('booking.errors.submissionFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Disable past dates and Sundays
  const disabledDays = { 
    before: new Date(),
    daysOfWeek: [0], // 0 is Sunday
  };
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-lavender-50'} py-12 px-4 transition-colors duration-300`}>
      {/* Success Overlay */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`${theme === 'dark' ? 'bg-black/90 border-lavender-500/30' : 'bg-white/90 border-lavender-300/50'} border rounded-3xl p-10 max-w-md text-center transition-colors duration-300`}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-lavender-400 to-mauve-600 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-lavender-500' : 'text-lavender-700'} font-cormorant transition-colors duration-300`}>{t('booking.success.title')}</h2>
            <p className={`${theme === 'dark' ? 'text-lavender-100/70' : 'text-lavender-900/70'} mb-6 transition-colors duration-300`}>
              {t('booking.success.message')}
            </p>
            <p className={`${theme === 'dark' ? 'text-lavender-100/50' : 'text-lavender-900/50'} text-sm transition-colors duration-300`}>{t('booking.success.redirecting')}</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-cormorant"
          >
            <span className="bg-gradient-to-r from-lavender-400 via-mauve-500 to-lavender-600 text-transparent bg-clip-text">
              {t('booking.title')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`${theme === 'dark' ? 'text-lavender-100/80' : 'text-lavender-900/80'} text-lg transition-colors duration-300`}
          >
            {t('booking.subtitle')}
          </motion.p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 flex items-center"
          >
            <span className="flex-grow">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400/70 hover:text-red-400">
              <X size={18} />
            </button>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className={`${theme === 'dark' ? 'bg-black/50 border-lavender-500/20' : 'bg-white/80 border-lavender-300/30'} backdrop-blur-xl border rounded-3xl p-8 space-y-6 transition-colors duration-300`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.name')}</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full ${theme === 'dark' ? 'bg-black/30 text-lavender-100 placeholder:text-lavender-500/30' : 'bg-white/80 text-lavender-900 placeholder:text-lavender-700/40'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors
                      ${formErrors.name ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                    placeholder={t('booking.form.namePlaceholder')}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.email')}</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full ${theme === 'dark' ? 'bg-black/30 text-lavender-100 placeholder:text-lavender-500/30' : 'bg-white/80 text-lavender-900 placeholder:text-lavender-700/40'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors
                      ${formErrors.email ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                    placeholder={t('booking.form.emailPlaceholder')}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.phone')}</label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full ${theme === 'dark' ? 'bg-black/30 text-lavender-100 placeholder:text-lavender-500/30' : 'bg-white/80 text-lavender-900 placeholder:text-lavender-700/40'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors
                      ${formErrors.phone ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                    placeholder={t('booking.form.phonePlaceholder')}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.service')}</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowServicePicker(!showServicePicker)}
                    className={`w-full flex items-center ${theme === 'dark' ? 'bg-black/30 text-lavender-100' : 'bg-white/80 text-lavender-900'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors relative
                      ${formErrors.service ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                  >
                    <Star className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                    <span className="flex-grow text-left">
                      {serviceTypes.find(type => type.id === form.service)?.label || t('booking.form.selectService')}
                    </span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showServicePicker && (
                    <div className={`absolute z-50 mt-2 ${theme === 'dark' ? 'bg-black/95 border-lavender-500/20' : 'bg-white/95 border-lavender-300/40'} border rounded-xl p-4 shadow-xl w-full transition-colors duration-300`}>
                      <div className="grid grid-cols-1 gap-2">
                        {serviceTypes.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => handleServiceSelect(service.id)}
                            className={`py-2 px-4 rounded-lg transition-colors text-left ${
                              form.service === service.id
                                ? theme === 'dark' ? 'bg-lavender-500 text-white' : 'bg-lavender-600 text-white'
                                : theme === 'dark' ? 'text-lavender-100 hover:bg-lavender-500/20' : 'text-lavender-900 hover:bg-lavender-300/30'
                            }`}
                          >
                            {service.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {formErrors.service && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.service}</p>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.date')}</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full flex items-center ${theme === 'dark' ? 'bg-black/30 text-lavender-100' : 'bg-white/80 text-lavender-900'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors relative
                      ${formErrors.date ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                  >
                    <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                    <span className="text-left flex-grow">
                      {form.date ? format(form.date, 'PPP') : t('booking.form.selectDate')}
                    </span>
                  </button>
                  {showDatePicker && (
                    <div className={`absolute z-50 mt-2 ${theme === 'dark' ? 'bg-black/95 border-lavender-500/20' : 'bg-white/95 border-lavender-300/40'} border rounded-xl p-4 shadow-xl transition-colors duration-300`}>
                      <DayPicker
                        mode="single"
                        selected={form.date}
                        onSelect={handleDateSelect}
                        disabled={disabledDays}
                        className={theme === 'dark' ? 'text-lavender-100' : 'text-lavender-900'}
                        classNames={{
                          day_selected: `${theme === 'dark' ? 'bg-lavender-500 text-white' : 'bg-lavender-600 text-white'}`,
                          day_today: `${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} font-bold`,
                          button: `hover:${theme === 'dark' ? 'bg-lavender-500/20' : 'bg-lavender-300/30'} transition-colors`,
                          day_disabled: `${theme === 'dark' ? 'text-lavender-500/20' : 'text-lavender-900/20'}`,
                        }}
                      />
                    </div>
                  )}
                </div>
                {formErrors.date && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.date}</p>
                )}
              </div>

              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.time')}</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => form.date && setShowTimePicker(!showTimePicker)}
                    disabled={!form.date}
                    className={`w-full flex items-center ${theme === 'dark' ? 'bg-black/30 text-lavender-100' : 'bg-white/80 text-lavender-900'} border rounded-xl py-3 px-10 
                      focus:outline-none transition-colors relative
                      ${!form.date ? 'opacity-50 cursor-not-allowed border-lavender-500/10' : ''} 
                      ${formErrors.time ? 'border-red-500/50' : theme === 'dark' ? 'border-lavender-500/20' : 'border-lavender-400/30'}`}
                  >
                    <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                    <span className="text-left flex-grow">
                      {form.time || (!form.date ? t('booking.form.selectDateFirst') : t('booking.form.selectTime'))}
                    </span>
                  </button>
                  {showTimePicker && form.date && (
                    <div className={`absolute z-50 mt-2 ${theme === 'dark' ? 'bg-black/95 border-lavender-500/20' : 'bg-white/95 border-lavender-300/40'} border rounded-xl p-4 shadow-xl w-full transition-colors duration-300`}>
                      {loading ? (
                        <div className="flex justify-center p-4">
                          <div className={`animate-spin rounded-full h-6 w-6 border-t-2 ${theme === 'dark' ? 'border-lavender-500' : 'border-lavender-600'} transition-colors duration-300`}></div>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => {
                              const isAvailable = availableTimeSlots.includes(time);
                              const isSelected = form.time === time;
                              
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => isAvailable && handleTimeSelect(time)}
                                  disabled={!isAvailable}
                                  className={`py-2 px-4 rounded-lg transition-colors relative ${
                                    isSelected
                                      ? theme === 'dark' ? 'bg-lavender-500 text-white' : 'bg-lavender-600 text-white'
                                      : isAvailable
                                      ? theme === 'dark' ? 'text-lavender-100 hover:bg-lavender-500/20' : 'text-lavender-900 hover:bg-lavender-300/30'
                                      : 'bg-red-500/20 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {time}
                                  {!isAvailable && (
                                    <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1">
                                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          
                          {availableTimeSlots.length === 0 && (
                            <p className="text-red-400 text-center mt-2">
                              {t('booking.errors.noAvailableSlots')}
                            </p>
                          )}
                          
                          <div className={`mt-3 text-xs ${theme === 'dark' ? 'text-lavender-500/70' : 'text-lavender-700/70'} flex items-center transition-colors duration-300`}>
                            <div className="w-3 h-3 bg-red-500/20 mr-1 rounded"></div>
                            <span>{t('booking.form.occupiedSlots')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {formErrors.time && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.time}</p>
                )}
              </div>

              <div className="relative">
                <label className={`block ${theme === 'dark' ? 'text-lavender-400' : 'text-lavender-700'} mb-2 text-sm transition-colors duration-300`}>{t('booking.form.notes')}</label>
                <div className="relative">
                  <MessageSquare className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} transition-colors duration-300`} />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className={`w-full ${theme === 'dark' ? 'bg-black/30 text-lavender-100 placeholder:text-lavender-500/30 border-lavender-500/20' : 'bg-white/80 text-lavender-900 placeholder:text-lavender-700/40 border-lavender-400/30'} border rounded-xl py-3 px-10 
                      focus:outline-none ${theme === 'dark' ? 'focus:border-lavender-500/50' : 'focus:border-lavender-500/80'} transition-colors min-h-[100px]`}
                    placeholder={t('booking.form.notesPlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-r from-lavender-600 to-mauve-600 text-white font-semibold py-3 px-8 rounded-xl
                hover:from-lavender-500 hover:to-mauve-500 transition-all duration-300 transform relative
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  {t('booking.form.processing')}
                </span>
              ) : (
                t('booking.form.submit')
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Booking;