import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, addMonths, getDay, isBefore, isSameDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { api, formatDateYMD } from '../services/api';
import CustomButton from './CustomButton';
import { z } from 'zod';
import type { FieldErrors } from 'react-hook-form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define form schema
const formSchema = z.object({
  serviceId: z.enum(['bridal', 'evening', 'daily']),
  date: z.date({
    required_error: 'Моля, изберете дата'
  }),
  time: z.string({
    required_error: 'Моля, изберете час'
  }),
  clientName: z.string().min(2, 'Името трябва да е поне 2 символа'),
  clientEmail: z.string().email('Невалиден email адрес'),
  clientPhone: z.string().min(6, 'Телефонният номер трябва да е поне 6 цифри'),
  notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

// Available times
const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Service options
const SERVICE_OPTIONS = [
  { id: 'bridal', name: 'Булчински грим', duration: 90 },
  { id: 'evening', name: 'Вечерен грим', duration: 60 },
  { id: 'daily', name: 'Дневен грим', duration: 45 }
];

const BookingForm = () => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form handling with react-hook-form
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: 'daily',
      notes: ''
    }
  });
  
  const selectedDate = watch('date');
  const selectedService = watch('serviceId');
  
  // Check available times when date changes
  useEffect(() => {
    if (selectedDate) {
      checkAvailableTimesForDate(selectedDate);
    }
  }, [selectedDate, selectedService]);
  
  // Check which times are available for the selected date
  const checkAvailableTimesForDate = async (date: Date) => {
    setLoading(true);
    try {
      console.log(`Checking available times for date: ${formatDateYMD(date)}`);
      
      const available = [...AVAILABLE_TIMES];
      const unavailable = [];
      
      // Check each time slot
      for (const time of AVAILABLE_TIMES) {
        const isAvailable = await api.checkAvailability(date, time);
        if (!isAvailable) {
          const index = available.indexOf(time);
          if (index !== -1) {
            available.splice(index, 1);
            unavailable.push(time);
          }
        }
      }
      
      console.log('Available times:', available);
      console.log('Unavailable times:', unavailable);
      
      setAvailableTimes(available);
      
      // If the currently selected time is not available, reset it
      const selectedTime = watch('time');
      if (selectedTime && !available.includes(selectedTime)) {
        setValue('time', '');
      }
    } catch (error) {
      console.error('Error checking available times:', error);
      setError('Грешка при проверка на свободните часове. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };
  
  // Disable past dates, Sundays, and Christmas
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return true;
    }
    
    // Disable Sundays (0 is Sunday)
    if (getDay(date) === 0) {
      return true;
    }
    
    // Disable Christmas (December 25)
    if (date.getMonth() === 11 && date.getDate() === 25) {
      return true;
    }
    
    return false;
  };
  
  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting booking data:', data);
      
      const bookingData = {
        ...data,
        // Pass the date directly - api.createBooking will format it correctly 
        date: data.date
      };
      
      // Check availability one more time before submission
      const isAvailable = await api.checkAvailability(data.date, data.time);
      
      if (!isAvailable) {
        setError('Този час вече не е свободен. Моля, изберете друг час.');
        setLoading(false);
        return;
      }
      
      const response = await api.createBooking(bookingData);
      console.log('Booking created:', response);
      
      // Reset form and show success message
      reset();
      setSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Грешка при запазване на час. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form errors
  const handleError = (errors: FieldErrors<FormData>) => {
    console.error('Form validation errors:', errors);
  };
  
  return (
    <div className="card bg-gradient-to-br from-lavender-50 to-mauve-50 rounded-2xl shadow-elegant p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-cormorant text-center mb-2 font-bold bg-gradient-to-r from-lavender-600 via-mauve-500 to-lavender-600 text-transparent bg-clip-text">Запазете час</h2>
      <div className="w-12 h-1 bg-gradient-to-r from-lavender-400 to-mauve-500 mx-auto mb-8 rounded-full"></div>
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-soft animate-pulse-soft">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Успешно запазен час!</p>
              <p className="text-xs mt-1">Ще получите имейл с потвърждение.</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-soft">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Възникна грешка!</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit, handleError)} className="space-y-6">
        {/* Service Selection */}
        <div>
          <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
            Изберете услуга
          </label>
          <select
            id="serviceId"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lavender-400 focus:border-lavender-500 outline-none transition-colors"
            {...register('serviceId')}
          >
            {SERVICE_OPTIONS.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration} мин.)
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
          )}
        </div>
        
        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Изберете дата
          </label>
          <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-lavender-400 focus-within:border-lavender-500">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DayPicker
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => date && field.onChange(date)}
                  disabled={isDateDisabled}
                  locale={bg}
                  weekStartsOn={1}
                  fixedWeeks
                  fromMonth={new Date()}
                  toMonth={addMonths(new Date(), 2)}
                  className="mx-auto"
                  modifiersClassNames={{
                    selected: 'bg-lavender-500',
                    today: 'rdp-today'
                  }}
                />
              )}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
        
        {/* Time Selection */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Изберете час
          </label>
          {selectedDate ? (
            loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-lavender-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableTimes.map(time => (
                  <label 
                    key={time} 
                    className={`
                      flex items-center justify-center py-2 px-3 border rounded-md cursor-pointer transition-colors
                      ${watch('time') === time 
                        ? 'bg-lavender-500 text-white border-lavender-600' 
                        : 'bg-white hover:bg-lavender-50 text-gray-700 border-gray-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={time}
                      className="sr-only"
                      {...register('time')}
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-red-500">Няма свободни часове за избраната дата.</p>
            )
          ) : (
            <p className="text-center py-4 text-gray-500">Моля, първо изберете дата.</p>
          )}
          {errors.time && (
            <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
          )}
        </div>
        
        {/* Personal Information */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-cormorant font-semibold mb-4 text-gray-800">Лична информация</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                Име
              </label>
              <input
                id="clientName"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lavender-400 focus:border-lavender-500 outline-none"
                placeholder="Вашето име"
                {...register('clientName')}
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Имейл
              </label>
              <input
                id="clientEmail"
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lavender-400 focus:border-lavender-500 outline-none"
                placeholder="your@email.com"
                {...register('clientEmail')}
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.clientEmail.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                id="clientPhone"
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lavender-400 focus:border-lavender-500 outline-none"
                placeholder="Вашият телефонен номер"
                {...register('clientPhone')}
              />
              {errors.clientPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.clientPhone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Бележки (незадължително)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-lavender-400 focus:border-lavender-500 outline-none"
                placeholder="Допълнителна информация за вашата резервация"
                {...register('notes')}
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className={`
              py-3 px-8 rounded-lg text-white font-medium text-center focus:outline-none transition-all
              ${loading || isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-lavender-600 to-mauve-600 hover:from-lavender-500 hover:to-mauve-500 shadow-md hover:shadow-lg'
              }
            `}
          >
            {loading || isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Обработка...</span>
              </div>
            ) : 'Запази час'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 