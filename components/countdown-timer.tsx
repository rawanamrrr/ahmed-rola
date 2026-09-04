"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { useTranslation } from "@/lib/translations"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer = memo(function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const t = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Memoize target timestamp to avoid recalculation
  const targetTimestamp = useMemo(() => targetDate.getTime(), [targetDate])

  // Optimize calculation with useCallback
  const calculateTimeLeft = useCallback(() => {
    const difference = targetTimestamp - Date.now()

    if (difference > 0) {
      const newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
      
      // Only update if values actually changed to prevent unnecessary re-renders
      setTimeLeft(prev => {
        if (prev.days !== newTimeLeft.days || 
            prev.hours !== newTimeLeft.hours || 
            prev.minutes !== newTimeLeft.minutes || 
            prev.seconds !== newTimeLeft.seconds) {
          return newTimeLeft
        }
        return prev
      })
    }
  }, [targetTimestamp])

  useEffect(() => {
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Memoize time units array to prevent recreation on every render
  const timeUnits = useMemo(() => [
    { key: 'days', value: timeLeft.days },
    { key: 'hours', value: timeLeft.hours },
    { key: 'minutes', value: timeLeft.minutes },
    { key: 'seconds', value: timeLeft.seconds },
  ], [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds])

  return (
    <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-2 md:gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide justify-center">
      {timeUnits.map((unit, index) => (
        <div
          key={unit.key}
          className="group relative flex-shrink-0 w-[85px] h-[100px] md:w-full md:h-auto"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Unique hexagonal/diamond-inspired shape with diagonal cuts */}
          <div className="relative flex flex-col items-center justify-center h-full bg-gradient-to-br from-card via-card/95 to-accent/10 backdrop-blur-sm border border-accent/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 md:p-10"
            style={{ 
              willChange: 'transform',
              clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)',
            }}
          >
            <div className="text-3xl md:text-7xl lg:text-8xl font-serif text-accent font-bold tracking-tight drop-shadow-md md:drop-shadow-lg" style={{ willChange: 'contents' }}>
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] md:text-sm text-muted-foreground mt-1 md:mt-4 uppercase tracking-[0.1em] md:tracking-widest font-semibold border-t border-accent/20 pt-1 md:pt-3 w-[80%] md:w-full text-center">
              {t(unit.key as any)}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
})

export default CountdownTimer