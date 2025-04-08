import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        admin: 'Admin Panel',
        bookNow: 'Book Now',
        logout: 'Logout'
      },
      auth: {
        adminLogin: 'Admin Login',
        emailAddress: 'Email address',
        password: 'Password',
        signIn: 'Sign In',
        invalidCredentials: 'Invalid email or password',
        loginError: 'An error occurred during login. Please try again.',
        unauthorized: 'You do not have permission to access this page.',
        demoNote: 'This is a demo version. Use the credentials below to log in as an administrator.',
        demoCredentials: 'Demo credentials:'
      },
      logo: {
        subtitle: 'Beauty Studio'
      },
      home: {
        hero: {
          title: 'Transform Your Look',
          subtitle: 'Select a service to begin your beauty journey',
          cta: 'Book Now'
        },
        services: {
          title: 'Our Services',
          bridal: {
            title: 'Bridal Makeup',
            description: 'Make your special day unforgettable with our signature bridal makeup service, designed to enhance your natural beauty.'
          },
          evening: {
            title: 'Evening Makeup',
            description: 'Glamorous looks for special events and occasions, tailored to make you stand out.'
          },
          daily: {
            title: 'Daily Makeup',
            description: 'Effortless, natural beauty enhanced with professional techniques for your everyday life.'
          }
        },
        cta: {
          title: 'Ready to Book Your Appointment?',
          subtitle: 'Choose your preferred date and time, and let us take care of the rest.',
          button: 'Book Your Session'
        }
      },
      booking: {
        title: 'Book Your Session',
        subtitle: 'Fill in your details below and we\'ll get back to you shortly',
        form: {
          name: 'Name',
          namePlaceholder: 'Your full name',
          email: 'Email',
          emailPlaceholder: 'your@email.com',
          phone: 'Phone',
          phonePlaceholder: 'Your phone number',
          date: 'Date',
          selectDate: 'Select a date',
          time: 'Time',
          selectTime: 'Select a time',
          selectDateFirst: 'First select a date',
          notes: 'Additional Notes',
          notesPlaceholder: 'Any special requests or notes',
          service: 'Service Type',
          selectService: 'Select a service type',
          submit: 'Book Appointment',
          processing: 'Processing...',
          occupiedSlots: 'Occupied slots'
        },
        serviceType: 'Service Type',
        yourDetails: 'Your Details',
        book: 'Book Now',
        success: {
          title: 'Booking Successful!',
          message: 'Thank you for your booking. We\'ll contact you shortly to confirm your appointment.',
          redirecting: 'Redirecting to home page...'
        },
        errors: {
          nameRequired: 'Name is required',
          emailRequired: 'Email is required',
          emailInvalid: 'Email is invalid',
          phoneRequired: 'Phone number is required',
          dateRequired: 'Date is required',
          timeRequired: 'Time is required',
          serviceRequired: 'Service type is required',
          timeSlotTaken: 'This time slot is no longer available. Please select another time.',
          submissionFailed: 'Failed to submit booking. Please try again.',
          noAvailableSlots: 'No available times for this date. Please choose a different date.',
          loadSlotsFailed: 'Failed to load available time slots. Please try again.'
        },
        timeSlots: 'Available Time Slots',
        loading: 'Loading...',
        noSlotsAvailable: 'No slots available on this date',
        selectDate: 'Please select a date',
        backToHome: 'Back to Home'
      },
      footer: {
        rights: '© 2024 Beauty Style. All rights reserved.'
      }
    }
  },
  bg: {
    translation: {
      nav: {
        home: 'Начало',
        admin: 'Админ Панел',
        bookNow: 'Запази час',
        logout: 'Изход'
      },
      auth: {
        adminLogin: 'Вход за Админ',
        emailAddress: 'Имейл адрес',
        password: 'Парола',
        signIn: 'Вход',
        invalidCredentials: 'Невалиден имейл или парола',
        loginError: 'Възникна грешка при входа. Моля, опитайте отново.',
        unauthorized: 'Нямате права за достъп до тази страница.',
        demoNote: 'Това е демо версия. Използвайте данните по-долу за вход като администратор.',
        demoCredentials: 'Демо данни за вход:'
      },
      logo: {
        subtitle: 'Салон за красота'
      },
      home: {
        hero: {
          title: 'Преобрази своята визия',
          subtitle: 'Изберете услуга, за да започнете своето beauty пътешествие',
          cta: 'Запази час'
        },
        services: {
          title: 'Нашите услуги',
          bridal: {
            title: 'Сватбен грим',
            description: 'Направете специалния си ден незабравим с нашия сватбен грим, създаден да подчертае естествената ви красота.'
          },
          evening: {
            title: 'Вечерен грим',
            description: 'Визии за специални събития и поводи, създадени да ви накарат да блестите.'
          },
          daily: {
            title: 'Ежедневен грим',
            description: 'Естествена красота, подчертана с професионални техники за вашето ежедневие.'
          }
        },
        cta: {
          title: 'Готови ли сте да запазите час?',
          subtitle: 'Изберете предпочитана дата и час, а ние ще се погрижим за останалото.',
          button: 'Запазете своя час'
        }
      },
      booking: {
        title: 'Запазете час',
        subtitle: 'Попълнете своите данни и ще се свържем с вас скоро',
        form: {
          name: 'Име',
          namePlaceholder: 'Вашето пълно име',
          email: 'Имейл',
          emailPlaceholder: 'вашият@имейл.com',
          phone: 'Телефон',
          phonePlaceholder: 'Вашият телефонен номер',
          date: 'Дата',
          selectDate: 'Изберете дата',
          time: 'Час',
          selectTime: 'Изберете час',
          selectDateFirst: 'Изберете първо дата',
          notes: 'Допълнителни бележки',
          notesPlaceholder: 'Специални изисквания или бележки',
          service: 'Тип грим',
          selectService: 'Изберете тип грим',
          submit: 'Запази час',
          processing: 'Обработване...',
          occupiedSlots: 'Заети часове'
        },
        serviceType: 'Вид услуга',
        yourDetails: 'Вашите данни',
        book: 'Запази час',
        success: {
          title: 'Успешно записване!',
          message: 'Благодарим ви за резервацията. Ще се свържем с вас скоро, за да потвърдим часа ви.',
          redirecting: 'Пренасочване към началната страница...'
        },
        errors: {
          nameRequired: 'Името е задължително',
          emailRequired: 'Имейлът е задължителен',
          emailInvalid: 'Невалиден имейл адрес',
          phoneRequired: 'Телефонният номер е задължителен',
          dateRequired: 'Датата е задължителна',
          timeRequired: 'Часът е задължителен',
          serviceRequired: 'Типът грим е задължителен',
          timeSlotTaken: 'Този час вече е зает от друг клиент. Моля, изберете друг час.',
          submissionFailed: 'Възникна грешка при запазването на часа. Моля, опитайте отново.',
          noAvailableSlots: 'Всички часове за тази дата са заети. Моля, изберете друга дата.',
          loadSlotsFailed: 'Грешка при зареждане на наличните часове. Моля, опитайте отново.'
        },
        timeSlots: 'Свободни часове',
        loading: 'Зареждане...',
        noSlotsAvailable: 'Няма свободни часове за тази дата',
        selectDate: 'Моля, изберете дата',
        backToHome: 'Обратно към начало'
      },
      footer: {
        rights: '© 2024 Beauty Style. Всички права запазени.'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'bg', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for React
    },
  });

export default i18n; 