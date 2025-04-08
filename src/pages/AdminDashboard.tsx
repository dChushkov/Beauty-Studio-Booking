import React, { useState, useEffect } from 'react';
import { Shield, Calendar, CheckCircle, XCircle, Clock, User, Mail, Phone, ExternalLink, Trash } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from 'date-fns';
import { api, formatDateYMD, parseYMDString, isSameYMDDate } from '../services/api';
import { BookingType } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<boolean | null>(null);
  
  useEffect(() => {
    fetchBookingsForMonth(currentMonth);
  }, [currentMonth]);
  
  const fetchBookingsForMonth = async (date: Date) => {
    setLoading(true);
    try {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const data = await api.getBookingsInRange(start, end);
      setBookings(data);
      console.log('Fetched bookings:', data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedBooking(null);
  };
  
  const handleViewBooking = (booking: BookingType) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
    // Reset email states when opening a booking
    setEmailSuccess(null);
  };
  
  const handleUpdateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const updatedBooking = await api.updateBookingStatus(id, status);
      
      // If the status is confirmed, send confirmation email
      if (status === 'confirmed' && selectedBooking) {
        setIsSendingEmail(true);
        
        try {
          // Send confirmation email
          const emailSent = await api.sendConfirmationEmail({
            ...selectedBooking,
            status: 'confirmed' // Update the status in the booking object
          });
          
          setEmailSuccess(emailSent);
          
          if (emailSent) {
            console.log('Confirmation email sent successfully');
          } else {
            console.warn('Failed to send confirmation email');
          }
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          setEmailSuccess(false);
        } finally {
          setIsSendingEmail(false);
        }
      }
      
      // Refresh bookings after update
      fetchBookingsForMonth(currentMonth);
      
      // Update the selected booking if still open
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({
          ...selectedBooking,
          status
        });
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      setError('Failed to update booking status. Please try again.');
    }
  };
  
  // Generate days for the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Get bookings for the selected date using the timezone-safe comparison
  const getBookingsForDate = (date: Date) => {
    // Debug logging
    console.log("Checking date:", formatDateYMD(date));
    console.log("All bookings:", bookings);
    
    return bookings.filter(booking => {
      // If no date field, skip
      if (!booking.date) {
        console.log("Booking without date:", booking);
        return false;
      }
      
      // Get date string in YYYY-MM-DD format
      const bookingDateStr = typeof booking.date === 'string' 
        ? booking.date.split('T')[0] // Handle ISO strings
        : formatDateYMD(booking.date);
      
      const selectedDateStr = formatDateYMD(date);
      
      console.log(`Comparing booking ${bookingDateStr} with selected ${selectedDateStr}`);
      
      // Compare the date strings
      return bookingDateStr === selectedDateStr;
    });
  };
  
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Booking Calendar</h2>
            <div className="flex space-x-2">
              <button 
                onClick={handlePreviousMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                &lt;
              </button>
              <div className="font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                &gt;
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {/* Calendar Header - Sunday first */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calculate the day of week for the first day of the month */}
              {(() => {
                // Get days in month
                const days = daysInMonth;
                
                // Get the day of week (0-6) for the first day, where 0 is Sunday
                const firstDayOfWeek = days[0].getDay();
                
                // Create empty placeholders for days before the 1st of the month
                // Sunday is 0, so this is already in the expected format
                const placeholders = Array(firstDayOfWeek).fill(null);
                
                return (
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty placeholders */}
                    {placeholders.map((_, i) => (
                      <div key={`empty-${i}`} className="h-24 p-1 border border-gray-100 rounded-md"></div>
                    ))}
                    
                    {/* Calendar Days */}
                    {days.map((day, i) => {
                      const dayBookings = getBookingsForDate(day);
                      const hasBookings = dayBookings.length > 0;
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handleDateClick(day)}
                          className={`h-24 p-1 border rounded-md flex flex-col transition-colors ${
                            isToday(day) ? 'border-blue-500' : 'border-gray-200'
                          } ${
                            isSelected ? 'bg-blue-50' : hasBookings ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className={`text-right p-1 ${
                            isToday(day) ? 'font-bold text-blue-600' : 'text-gray-700'
                          }`}>
                            {format(day, 'd')}
                          </div>
                          
                          {/* Booking indicators */}
                          <div className="flex flex-col gap-1 mt-auto">
                            {hasBookings && (
                              <div className={`text-xs p-1 rounded-sm bg-blue-100 text-blue-800 text-center`}>
                                {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        
        {/* Selected Date Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedDate 
              ? `Bookings for ${format(selectedDate, 'MMMM d, yyyy')}` 
              : 'Select a date to view bookings'}
          </h2>
          
          {selectedDate && (
            <div className="space-y-3">
              {selectedDateBookings.length > 0 ? (
                selectedDateBookings.map((booking) => (
                  <div 
                    key={booking._id?.toString()} 
                    className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">{booking.time}</div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(booking.status || 'pending')}
                        <span className={`text-xs ${getStatusColor(booking.status || 'pending')}`}>
                          {booking.status || 'pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{booking.clientName}</div>
                    <div className="text-xs text-gray-500 mb-2">{booking.serviceId}</div>
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No bookings for this date
                </div>
              )}
            </div>
          )}
          
          {!selectedDate && (
            <div className="text-gray-500 text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              Select a date from the calendar to view bookings
            </div>
          )}
        </div>
      </div>
      
      {/* Booking Detail Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-between">
                Booking Details
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Date & Time</div>
                    <div className="font-medium">
                      {(() => {
                        // Format date safely
                        if (!selectedBooking.date) return 'Unknown date';
                        
                        // If it's a string, parse it first
                        let displayDate;
                        if (typeof selectedBooking.date === 'string') {
                          // Extract YYYY-MM-DD part
                          const datePart = selectedBooking.date.split('T')[0];
                          // Parse to Date object
                          const [year, month, day] = datePart.split('-').map(Number);
                          displayDate = new Date(year, month - 1, day);
                        } else {
                          displayDate = selectedBooking.date;
                        }
                        
                        return format(displayDate, 'MMMM d, yyyy');
                      })()}
                      {' at '}{selectedBooking.time}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Client</div>
                    <div className="font-medium">{selectedBooking.clientName}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="font-medium">{selectedBooking.clientEmail}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="font-medium">{selectedBooking.clientPhone}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Service</div>
                  <div className="font-medium capitalize">{selectedBooking.serviceId} Makeup</div>
                </div>
                
                {selectedBooking.notes && (
                  <div>
                    <div className="text-xs text-gray-500">Notes</div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                      {selectedBooking.notes}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-medium flex items-center gap-1 ${getStatusColor(selectedBooking.status || 'pending')}`}>
                    {getStatusIcon(selectedBooking.status || 'pending')}
                    {selectedBooking.status || 'pending'}
                  </div>
                </div>
              </div>
              
              {/* Email notification status */}
              {emailSuccess !== null && (
                <div className={`mb-4 p-2 rounded-md text-sm ${
                  emailSuccess 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {emailSuccess 
                    ? 'Confirmation email sent successfully!' 
                    : 'Failed to send confirmation email. Client was notified manually.'}
                </div>
              )}
              
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id as string, 'confirmed')}
                  className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex-1 flex justify-center items-center ${
                    selectedBooking.status === 'confirmed' || isSendingEmail ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  disabled={selectedBooking.status === 'confirmed' || isSendingEmail}
                >
                  {isSendingEmail ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </>
                  ) : selectedBooking.status === 'confirmed' ? (
                    'Confirmed'
                  ) : (
                    'Confirm'
                  )}
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id as string, 'cancelled')}
                  className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1 ${
                    selectedBooking.status === 'cancelled' || isSendingEmail ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  disabled={selectedBooking.status === 'cancelled' || isSendingEmail}
                >
                  {selectedBooking.status === 'cancelled' ? 'Cancelled' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;