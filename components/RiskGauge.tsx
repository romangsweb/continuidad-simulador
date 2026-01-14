'use client'

import { motion } from 'framer-motion'
import { getRiskLevel } from '@/lib/risk-data'

interface RiskGaugeProps {
  score: number
  size?: number
  showLabel?: boolean
}

export default function RiskGauge({ score, size = 280, showLabel = true }: RiskGaugeProps) {
  const riskInfo = getRiskLevel(score)
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (score / 100) * circumference * 0.75 // 270 grados

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 280 280"
        className="transform -rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="rgba(0, 212, 170, 0.1)"
          strokeWidth="20"
          strokeDasharray={circumference * 0.75}
          strokeLinecap="round"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated progress arc */}
        <motion.circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="url(#riskGradient)"
          strokeWidth="20"
          strokeDasharray={circumference * 0.75}
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick, i) => {
          const angle = (tick / 100) * 270 - 135
          const radian = (angle * Math.PI) / 180
          const x1 = 140 + 95 * Math.cos(radian)
          const y1 = 140 + 95 * Math.sin(radian)
          const x2 = 140 + 105 * Math.cos(radian)
          const y2 = 140 + 105 * Math.sin(radian)
          
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              className="transform rotate-[135deg] origin-center"
            />
          )
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-center"
        >
          <motion.span
            className="text-6xl font-display font-bold"
            style={{ color: riskInfo.color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {score}
          </motion.span>
          <span className="text-2xl text-slate-400 font-light">/100</span>
        </motion.div>
        
        {showLabel && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-2"
          >
            <span
              className="px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider"
              style={{ 
                backgroundColor: `${riskInfo.color}20`,
                color: riskInfo.color,
                border: `1px solid ${riskInfo.color}40`
              }}
            >
              Riesgo {riskInfo.label}
            </span>
          </motion.div>
        )}
      </div>

      {/* Pulsing indicator for high risk */}
      {score >= 70 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <div 
            className="w-8 h-8 rounded-full pulse-ring"
            style={{ backgroundColor: `${riskInfo.color}40` }}
          />
        </motion.div>
      )}
    </div>
  )
}
