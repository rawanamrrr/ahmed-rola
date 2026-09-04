"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"

// Line-art SVG icons matching the reference image style with website accent theme
function CarIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 stroke-accent/80 hover:stroke-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 40h36c2 0 4-2 4-4v-7c0-2-1-4-3-4.5l-5-2-4-8.5c-1-2-3-3-5.5-3h-13c-2.5 0-4.5 1-5.5 3l-4 8.5-5 2c-2 0.5-3 2.5-3 4.5v7c0 2 2 4 4 4z" />
      <circle cx="21" cy="40" r="4" />
      <circle cx="43" cy="40" r="4" />
      <path d="M32 18c-2.5-3.5-7-3.5-9.5-1s-1 7.5 9.5 13c10.5-5.5 12-10.5 9.5-13s-7-2.5-9.5 1z" strokeWidth="1.2" />
    </svg>
  )
}

function DinnerIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 stroke-accent/80 hover:stroke-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="10" />
      <path d="M14 18v11c0 3 2 4.5 4 4.5v12.5" />
      <path d="M14 18v8M18 18v8M22 18v8M22 18v11c0 3-2 4.5-4 4.5" />
      <path d="M50 18c-3 0-5 3-5 7s2 7 5 7 5-3 5-7-2-7-5-7z" />
      <path d="M50 32v14" />
    </svg>
  )
}

function PartyIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 stroke-accent/80 hover:stroke-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Woman Dancing */}
      <circle cx="22" cy="16" r="4" />
      <path d="M22 20v18" />
      <path d="M22 38l-5 19" />
      <path d="M22 38l5 19" />
      <path d="M22 24l-7 5" />
      <path d="M22 24l10 6" />
      {/* Man Dancing */}
      <circle cx="42" cy="16" r="4" />
      <path d="M42 20v18" />
      <path d="M42 38l-5 19" />
      <path d="M42 38l5 19" />
      <path d="M42 24l-10 6" />
      <path d="M42 24l7 5" />
      {/* Heart Sparkle above */}
      <path d="M32 9c-1.5-2-4-2-5.5 0s0 4.5 5.5 7.5c5.5-3 7-5.5 5.5-7.5s-4-2-5.5 0z" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
    </svg>
  )
}

function PhotoIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16 stroke-accent/80 hover:stroke-accent transition-colors duration-300" viewBox="0 0 64 64" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 14c-6 0-10 6-10 13 0 8 10 15 10 15s10-7 10-15c0-7-4-13-10-13z" />
      <path d="M26 42l-2 3h4l-2-3" />
      <path d="M26 45c-2 4 3 7 1 11" />
      <path d="M42 10c-5 0-9 5-9 11 0 7 9 13 9 13s9-6 9-13c0-6-4-11-9-11z" />
      <path d="M42 34l-2 3h4l-2-3" />
      <path d="M42 37c2 4-3 7-1 11" />
    </svg>
  )
}

export default function TimelineSection() {
  const t = useTranslation()
  const { isRTL } = useLanguage()

  const items = [
    {
      time: isRTL ? '٠٩:٠٠' : '09:00',
      period: isRTL ? 'مساءً' : 'PM',
      title: t('timelineItem1Title'),
      Icon: CarIcon,
      isIconLeft: true
    },
    {
      time: isRTL ? '١٠:٣٠' : '10:30',
      period: isRTL ? 'مساءً' : 'PM',
      title: t('timelineItem2Title'),
      Icon: DinnerIcon,
      isIconLeft: false
    },
    {
      time: isRTL ? '١١:٣٠' : '11:30',
      period: isRTL ? 'مساءً' : 'PM',
      title: t('timelineItem3Title'),
      Icon: PartyIcon,
      isIconLeft: true
    },
    {
      time: isRTL ? '٠١:٠٠' : '01:00',
      period: isRTL ? 'صباحاً' : 'AM',
      title: t('timelineItem4Title'),
      Icon: PhotoIcon,
      isIconLeft: false
    }
  ]

  return (
    <section id="timeline" className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent overflow-hidden">
      {/* Background glowing blurs matching the website */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Title & Date */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-3 ${isRTL ? 'font-arabic tracking-normal' : 'font-heading font-luxury tracking-wide'}`}>
            {t('timelineTitle')}
          </h2>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-accent/30" />
            <span className={`text-sm sm:text-base md:text-lg text-accent font-medium ${isRTL ? 'font-arabic tracking-normal' : 'font-luxury tracking-[0.3em] uppercase'}`}>
              {t('timelineDate')}
            </span>
            <div className="w-12 h-px bg-accent/30" />
          </div>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Center Line */}
          <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-accent/20 via-accent/50 to-accent/20" />

          {/* Timeline Items List */}
          <div className="space-y-12 sm:space-y-16 relative">
            {items.map((item, idx) => {
              const IconComponent = item.Icon

              return (
                <motion.div
                  key={idx}
                  className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8"
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  {/* Left Column */}
                  <div className="flex justify-end text-right pr-2 sm:pr-4">
                    {item.isIconLeft ? (
                      <div className="flex items-center justify-center p-2 transform hover:scale-105 transition-transform duration-300">
                        <IconComponent />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className={`font-bold text-2xl sm:text-3xl md:text-4xl text-accent leading-none flex items-baseline justify-end gap-1.5 ${isRTL ? 'font-arabic tracking-normal' : 'font-luxury tracking-wider'}`}>
                          <span>{item.time}</span>
                          <span className="text-xs sm:text-sm font-semibold">{item.period}</span>
                        </div>
                        <div className={`text-xs sm:text-sm md:text-base text-foreground font-medium max-w-[170px] sm:max-w-xs ml-auto ${isRTL ? 'font-arabic tracking-normal' : 'font-luxury uppercase tracking-[0.2em]'}`}>
                          {item.title}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Center intersection tick mark */}
                  <div className="relative flex items-center justify-center z-10 w-6 h-6">
                    <div className="w-5 h-[1.5px] bg-accent/60" />
                  </div>

                  {/* Right Column */}
                  <div className="flex justify-start text-left pl-2 sm:pl-4">
                    {item.isIconLeft ? (
                      <div className="space-y-1">
                        <div className={`font-bold text-2xl sm:text-3xl md:text-4xl text-accent leading-none flex items-baseline justify-start gap-1.5 ${isRTL ? 'font-arabic tracking-normal' : 'font-luxury tracking-wider'}`}>
                          <span>{item.time}</span>
                          <span className="text-xs sm:text-sm font-semibold">{item.period}</span>
                        </div>
                        <div className={`text-xs sm:text-sm md:text-base text-foreground font-medium max-w-[170px] sm:max-w-xs ${isRTL ? 'font-arabic tracking-normal' : 'font-luxury uppercase tracking-[0.2em]'}`}>
                          {item.title}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-2 transform hover:scale-105 transition-transform duration-300">
                        <IconComponent />
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
