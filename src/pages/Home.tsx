import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Crown, Heart, Feather, Brush, Wand2, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Card3D from '../components/Card3D';
import Text3D from '../components/Text3D';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedCard from '../components/AnimatedCard';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();

  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      id: 'bridal',
      icon: Crown,
      title: t('home.services.bridal.title'),
      description: t('home.services.bridal.description'),
      color: 'from-mauve-500 to-lavender-500',
    },
    {
      id: 'evening',
      icon: Heart,
      title: t('home.services.evening.title'),
      description: t('home.services.evening.description'),
      color: 'from-lavender-500 to-mauve-500',
    },
    {
      id: 'daily',
      icon: Feather,
      title: t('home.services.daily.title'),
      description: t('home.services.daily.description'),
      color: 'from-mauve-400 to-lavender-600',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId);
    setTimeout(() => {
      navigate('/booking', { state: { serviceId } });
    }, 700);
  };

  const backgroundIcons = [
    { Icon: Palette, size: 'w-24 h-24', baseOpacity: '0.08' },
    { Icon: Brush, size: 'w-20 h-20', baseOpacity: '0.06' },
    { Icon: Wand2, size: 'w-18 h-18', baseOpacity: '0.08' },
  ];
  
  // Анимирани градиентни цветове
  const gradientColors = {
    dark: [
      'rgba(139, 92, 246, 0.15)',
      'rgba(168, 85, 247, 0.15)',
      'rgba(147, 51, 234, 0.15)',
      'rgba(139, 92, 246, 0.15)',
    ],
    light: [
      'rgba(139, 92, 246, 0.1)',
      'rgba(168, 85, 247, 0.1)',
      'rgba(147, 51, 234, 0.1)',
      'rgba(139, 92, 246, 0.1)',
    ],
  };

  return (
    <div className={`min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-lavender-50'} transition-colors duration-300 relative`}>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'opacity-20' : 'opacity-10'} transition-opacity duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-lavender-600/20 via-mauve-500/20 to-lavender-400/20 bg-gradient-size animate-gradient-slow" />
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const IconSet = backgroundIcons[i % backgroundIcons.length];
          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotate: Math.random() * 360,
                scale: 0.5 + Math.random() * 0.5,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
                  Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
                ],
                y: [
                  Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
                  Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
                ],
                rotate: [Math.random() * 360, Math.random() * 360],
              }}
              transition={{
                duration: 120,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                filter: 'blur(1px)',
              }}
            >
              <motion.div
                animate={{
                  opacity: [
                    Number(IconSet.baseOpacity),
                    Number(IconSet.baseOpacity) + 0.01,
                    Number(IconSet.baseOpacity),
                  ],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <IconSet.Icon className={`${IconSet.size} ${theme === 'dark' ? 'text-lavender-500' : 'text-lavender-600'}`} />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Ambient Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              background: theme === 'dark' 
                ? 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              width: '60vw',
              height: '60vw',
            }}
            initial={{
              x: Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
              y: Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
                Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
              ],
              y: [
                Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2,
                Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2,
              ],
              scale: [1, 1.01, 1],
              opacity: [0.1, 0.12, 0.1],
            }}
            transition={{
              duration: 90,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <motion.div
                className="mb-12"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-40 h-40 mx-auto mb-8 relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Основно сияние */}
                  <div className="absolute inset-0 bg-gradient-to-r from-lavender-400 via-mauve-500 to-lavender-600 rounded-full opacity-20 blur-2xl" />
                  
                  {/* Многоцветно сияние */}
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        `0 0 30px 15px ${theme === 'dark' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.3)'}`,
                        `0 0 50px 20px ${theme === 'dark' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.35)'}`,
                        `0 0 30px 15px ${theme === 'dark' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.3)'}`,
                      ],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  
                  {/* Пулсиращ пръстен */}
                  <motion.div 
                    className="absolute inset-0 border-2 rounded-full"
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.35)',
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.4, 0.7],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  {/* Вътрешен кръг с блестящ ефект */}
                  <motion.div 
                    className="absolute inset-[15%] bg-gradient-to-br from-lavender-300/10 via-lavender-400/15 to-lavender-500/10 rounded-full"
                    style={{
                      backdropFilter: "blur(8px)",
                    }}
                    animate={{
                      rotate: [0, -360], // Въртене в обратна посока
                      boxShadow: [
                        'inset 0 0 20px 5px rgba(139, 92, 246, 0.1)',
                        'inset 0 0 15px 3px rgba(139, 92, 246, 0.2)',
                        'inset 0 0 20px 5px rgba(139, 92, 246, 0.1)',
                      ],
                    }}
                    transition={{
                      rotate: {
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      boxShadow: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                    }}
                  />
                  
                  {/* Фантомни частици */}
                  {[...Array(24)].map((_, i) => {
                    // Създаваме различни цветове в гамата на сайта
                    const colors = [
                      'bg-lavender-300',
                      'bg-lavender-400',
                      'bg-lavender-500',
                      'bg-mauve-300',
                      'bg-mauve-400',
                      'bg-mauve-500',
                      'bg-white',
                    ];
                    
                    const color = colors[i % colors.length];
                    const size = 1.5 + Math.random() * 2; // По-големи размери на частиците
                    
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className={`absolute rounded-full ${color}`}
                        style={{
                          width: `${size}px`,
                          height: `${size}px`,
                          filter: 'blur(0.5px)',
                          boxShadow: `0 0 ${Math.floor(size * 2)}px ${Math.floor(size)}px ${color.replace('bg-', 'rgba(')}, 0.8)`,
                        }}
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 0,
                        }}
                        animate={{
                          x: [0, Math.sin(i / 24 * Math.PI * 2) * (80 + Math.random() * 40)],
                          y: [0, Math.cos(i / 24 * Math.PI * 2) * (80 + Math.random() * 40)],
                          opacity: [0, 1, 0],
                          scale: [0.2, 1.8, 0.2],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 3,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                  
                  {/* Допълнителни искрящи точки */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`spark-${i}`}
                      className="absolute rounded-full bg-white"
                      style={{
                        width: '2.5px',
                        height: '2.5px',
                        filter: 'blur(0.5px)',
                        boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.8)',
                      }}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 0,
                      }}
                      animate={{
                        x: [0, Math.sin((i / 12 * Math.PI * 2) + Math.PI/4) * (60 + Math.random() * 30)],
                        y: [0, Math.cos((i / 12 * Math.PI * 2) + Math.PI/4) * (60 + Math.random() * 30)],
                        opacity: [0, 1, 0],
                        scale: [0.2, 1.2, 0.2],
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                  
                  {/* Иконата Palette */}
                  <motion.div
                    className="absolute inset-[20%] flex items-center justify-center"
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <motion.div 
                      className="w-full h-full relative"
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity, 
                        ease: "easeInOut",
                      }}
                    >
                      <Palette
                        className={`w-full h-full ${theme === 'dark' ? 'text-lavender-500' : 'text-lavender-600'} drop-shadow-lg`}
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Text3D
                  fontSize="text-8xl"
                  fontWeight="font-bold font-cormorant"
                  depth={8}
                  followMouse={true}
                  shadowColor={theme === 'dark' ? 'rgba(138, 92, 246, 0.4)' : 'rgba(109, 40, 217, 0.3)'}
                  textColor="text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 via-mauve-500 to-lavender-600"
                  shadowOpacity={0.6}
                  glowColor={theme === 'dark' ? 'rgba(138, 92, 246, 0.1)' : 'rgba(138, 92, 246, 0.05)'}
                  glowIntensity={0.4}
                  className="tracking-tight"
                >
                  {t('home.hero.title')}
                </Text3D>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <Text3D
                  fontSize="text-2xl"
                  depth={3}
                  followMouse={true}
                  textColor={theme === 'dark' ? 'text-lavender-100/70' : 'text-lavender-900/70'}
                  shadowColor={theme === 'dark' ? 'rgba(138, 92, 246, 0.3)' : 'rgba(109, 40, 217, 0.2)'}
                  fontWeight="font-light"
                  shadowOpacity={0.3}
                  glowIntensity={0.2}
                  className="tracking-wide"
                >
                  {t('home.hero.subtitle')}
                </Text3D>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 mb-16 flex justify-center"
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  icon={<Calendar className="w-5 h-5" />}
                  onClick={() => navigate('/booking')}
                  animationIntensity="medium"
                >
                  {t('home.hero.cta')}
                </AnimatedButton>
              </motion.div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{
                    y: [0, 8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`${theme === 'dark' ? 'text-lavender-500/50' : 'text-lavender-700/50'} cursor-pointer transition-colors duration-300`}
                >
                  <ChevronDown className="w-8 h-8 mx-auto" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-10 px-4">
              <AnimatePresence>
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card3D
                        className="h-[400px] group"
                        shine={true}
                        shadow={true}
                        rotationIntensity={5}
                        shadowIntensity={theme === 'dark' ? 0.6 : 0.2}
                        shineIntensity={theme === 'dark' ? 0.1 : 0.2}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <div className={`relative ${theme === 'dark' ? 'bg-black/40' : 'bg-white/70'} backdrop-blur-xl border ${theme === 'dark' ? 'border-lavender-500/10' : 'border-lavender-300/30'} p-10 rounded-3xl h-full
                          ${theme === 'dark' ? 'group-hover:border-lavender-500/30' : 'group-hover:border-lavender-500/60'} transition-all duration-700 flex flex-col overflow-hidden`}>
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 
                              transition-opacity duration-700 rounded-3xl`}
                          />
                          
                          <div className="absolute -right-20 -top-20 w-40 h-40 bg-lavender-500/10 rounded-full blur-3xl group-hover:bg-lavender-500/20 transition-all duration-700"></div>
                          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-mauve-500/10 rounded-full blur-3xl group-hover:bg-mauve-500/20 transition-all duration-700"></div>
                          
                          <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="relative z-10 mb-8"
                          >
                            <Icon className={`h-16 w-16 ${theme === 'dark' ? 'text-lavender-500/90' : 'text-lavender-700/90'} transition-colors duration-300 group-hover:text-lavender-500`} />
                          </motion.div>
                          
                          <h3 className={`text-2xl font-[350] mb-4 ${theme === 'dark' ? 'text-lavender-400 group-hover:text-lavender-300' : 'text-lavender-700 group-hover:text-lavender-800'} 
                            transition-colors relative z-10 tracking-wide font-cormorant`}>{service.title}</h3>
                          
                          <p className={`${theme === 'dark' ? 'text-lavender-100/60 group-hover:text-lavender-100/80' : 'text-lavender-900/60 group-hover:text-lavender-900/80'} transition-colors relative z-10 
                            font-light leading-relaxed flex-grow`}>
                            {service.description}
                          </p>

                          <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${theme === 'dark' ? 'from-black/20' : 'from-white/20'} to-transparent rounded-b-3xl transition-colors duration-300`} />
                          
                          <motion.div 
                            className="absolute top-4 right-4 w-2 h-2 rounded-full bg-lavender-500/40"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          />
                          <motion.div 
                            className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-mauve-500/40"
                            animate={{ scale: [1, 1.8, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                          />
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Преживяване секция с AnimatedCard */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-24 mb-16"
            >
              <AnimatedCard
                variant="glass"
                hoverEffect="glow"
                className="p-10 max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h3 className={`text-3xl font-[400] mb-4 ${theme === 'dark' ? 'text-lavender-300' : 'text-lavender-800'} 
                      font-cormorant`}>{t('home.cta.title')}</h3>
                    <p className={`${theme === 'dark' ? 'text-lavender-100/70' : 'text-lavender-900/70'} 
                      font-light leading-relaxed mb-6`}>
                      {t('home.cta.subtitle')}
                    </p>
                    <div className="flex">
                      <AnimatedButton
                        variant="outline"
                        icon={<ArrowRight className="w-4 h-4" />}
                        onClick={() => navigate('/booking')}
                      >
                        {t('home.cta.button')}
                      </AnimatedButton>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <Palette className={`w-32 h-32 ${theme === 'dark' ? 'text-lavender-400/70' : 'text-lavender-600/70'}`} />
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;