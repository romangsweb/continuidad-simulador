'use client'

import { motion } from 'framer-motion'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Shield, 
  TrendingUp,
  Calendar,
  FileText,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react'
import RiskGauge from './RiskGauge'
import { getRiskLevel, RISK_DATA, BENCHMARK_DATA } from '@/lib/risk-data'

interface ResultsDashboardProps {
  riskScore: number
  financialImpact: {
    hourlyLoss: number
    downtimeDays: number
    operationalLoss: number
    dataBreachRisk: number
    potentialFines: number
    techRecoveryCost: number
    totalImpact: number
    securityInvestmentAnnual: number
    mitigatedRisk: number
    roi: number
    paybackHours: number
  }
  onRequestDemo: () => void
  onDownloadReport: () => void
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const StatCard = ({ 
  label, 
  value, 
  subtext, 
  icon: Icon, 
  color = 'accent',
  delay = 0 
}: {
  label: string
  value: string | number
  subtext?: string
  icon: React.ElementType
  color?: 'accent' | 'warning' | 'danger'
  delay?: number
}) => {
  const colorClasses = {
    accent: 'text-xamai-accent border-xamai-accent/20',
    warning: 'text-amber-400 border-amber-400/20',
    danger: 'text-red-400 border-red-400/20'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-card p-5 border-l-4 ${colorClasses[color].split(' ')[1]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <p className={`text-2xl font-display font-bold ${colorClasses[color].split(' ')[0]}`}>
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-slate-500 mt-1">{subtext}</p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]} opacity-50`} />
      </div>
    </motion.div>
  )
}

export default function ResultsDashboard({ 
  riskScore, 
  financialImpact, 
  onRequestDemo,
  onDownloadReport
}: ResultsDashboardProps) {
  const riskInfo = getRiskLevel(riskScore)

  // Datos para gráfica de costos
  const costBreakdown = [
    { name: 'Pérdida Operativa', value: financialImpact.operationalLoss, color: '#f97316' },
    { name: 'Riesgo de Datos', value: financialImpact.dataBreachRisk, color: '#dc2626' },
    { name: 'Multas LFPDPPP', value: financialImpact.potentialFines, color: '#8b5cf6' },
    { name: 'Recuperación TI', value: financialImpact.techRecoveryCost, color: '#3b82f6' },
  ]

  // Datos para comparativa de tiempos
  const timeComparison = [
    { 
      name: 'Detección', 
      sinProteccion: RISK_DATA.detectionTimes.withoutMonitoring, 
      conProteccion: RISK_DATA.detectionTimes.withLumu 
    },
    { 
      name: 'Respuesta', 
      sinProteccion: RISK_DATA.detectionTimes.mttrWithoutVisibility, 
      conProteccion: RISK_DATA.detectionTimes.mttrWithStack 
    },
    { 
      name: 'Recuperación', 
      sinProteccion: RISK_DATA.recoveryDays.withoutStack, 
      conProteccion: RISK_DATA.recoveryDays.withStack 
    },
  ]

  // Datos para ROI timeline
  const roiTimeline = [
    { month: 'Mes 1', ahorro: 0, inversion: financialImpact.securityInvestmentAnnual / 12 },
    { month: 'Mes 3', ahorro: financialImpact.mitigatedRisk * 0.25, inversion: financialImpact.securityInvestmentAnnual / 4 },
    { month: 'Mes 6', ahorro: financialImpact.mitigatedRisk * 0.5, inversion: financialImpact.securityInvestmentAnnual / 2 },
    { month: 'Mes 9', ahorro: financialImpact.mitigatedRisk * 0.75, inversion: financialImpact.securityInvestmentAnnual * 0.75 },
    { month: 'Mes 12', ahorro: financialImpact.mitigatedRisk, inversion: financialImpact.securityInvestmentAnnual },
  ]

  return (
    <div className="space-y-8">
      {/* Header con score principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <RiskGauge score={riskScore} size={300} />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-3">
                Tu Análisis de Riesgo SAP B1
              </h2>
              <p className="text-slate-400 leading-relaxed">
                {riskInfo.recommendation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5" style={{ color: riskInfo.color }} />
                <span className="font-semibold text-white">Impacto Financiero Potencial</span>
              </div>
              <p className="text-4xl font-display font-bold gradient-text">
                {formatCurrency(financialImpact.totalImpact)} MXN
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Costo estimado de un incidente sin protección adecuada
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Pérdida por Hora"
          value={formatCurrency(financialImpact.hourlyLoss)}
          subtext="Si SAP se detiene"
          icon={Clock}
          color="warning"
          delay={0.1}
        />
        <StatCard
          label="Días de Recuperación"
          value={financialImpact.downtimeDays}
          subtext="Sin stack de seguridad"
          icon={Calendar}
          color="danger"
          delay={0.2}
        />
        <StatCard
          label="ROI de Inversión"
          value={`${financialImpact.roi}%`}
          subtext="Retorno anual estimado"
          icon={TrendingUp}
          color="accent"
          delay={0.3}
        />
        <StatCard
          label="Payback"
          value={`${financialImpact.paybackHours} hrs`}
          subtext="de inactividad evitada"
          icon={Target}
          color="accent"
          delay={0.4}
        />
      </div>

      {/* Gráficas principales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Desglose de costos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-xamai-accent" />
            Desglose del Impacto Financiero
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costBreakdown} layout="vertical">
              <XAxis 
                type="number" 
                tickFormatter={(v) => formatCurrency(v)}
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120}
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip
                formatter={(value: number) => [`${formatCurrency(value)} MXN`, 'Costo']}
                contentStyle={{
                  backgroundColor: '#0a0f1c',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Comparativa de tiempos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-xamai-accent" />
            Tiempos de Respuesta (días)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={timeComparison}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} días`,
                  name === 'sinProteccion' ? 'Sin protección' : 'Con stack'
                ]}
                contentStyle={{
                  backgroundColor: '#0a0f1c',
                  border: '1px solid rgba(0,212,170,0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sinProteccion" name="Sin protección" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conProteccion" name="Con stack" fill="#00d4aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">Sin protección</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-xamai-accent" />
              <span className="text-sm text-slate-400">Con stack de seguridad</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ROI Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-xamai-accent" />
          Proyección de ROI a 12 Meses
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={roiTimeline}>
            <defs>
              <linearGradient id="ahorroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis 
              tickFormatter={(v) => formatCurrency(v)} 
              stroke="#64748b" 
              fontSize={12}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${formatCurrency(value)} MXN`,
                name === 'ahorro' ? 'Riesgo mitigado' : 'Inversión acumulada'
              ]}
              contentStyle={{
                backgroundColor: '#0a0f1c',
                border: '1px solid rgba(0,212,170,0.2)',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="ahorro"
              stroke="#00d4aa"
              fillOpacity={1}
              fill="url(#ahorroGradient)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="inversion"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-xamai-accent" />
            <span className="text-sm text-slate-400">Riesgo mitigado acumulado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-amber-500 border-dashed" style={{ borderStyle: 'dashed' }} />
            <span className="text-sm text-slate-400">Inversión acumulada</span>
          </div>
        </div>
      </motion.div>

      {/* Contexto de México */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 border border-amber-500/20"
      >
        <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Contexto de Amenazas en México 2025
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-slate-800/30">
            <p className="text-3xl font-display font-bold text-amber-400">
              {(BENCHMARK_DATA.attacksPerDay / 1_000_000).toFixed(0)}M
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Intentos de ataque/día en México
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/30">
            <p className="text-3xl font-display font-bold text-red-400">
              +{BENCHMARK_DATA.attackIncrease}%
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Incremento por ataques con IA
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-slate-800/30">
            <p className="text-3xl font-display font-bold text-xamai-accent">
              #1
            </p>
            <p className="text-sm text-slate-400 mt-1">
              País más atacado en LATAM
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center">
          Fuentes: FortiGuard Labs, IBM Cost of Data Breach 2025, Check Point Research
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <button
          onClick={onDownloadReport}
          className="group glass-card p-6 text-left hover:border-xamai-accent/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <FileText className="w-8 h-8 text-xamai-accent mb-3" />
              <h4 className="text-lg font-display font-semibold text-white mb-2">
                Descargar Reporte Completo
              </h4>
              <p className="text-sm text-slate-400">
                PDF personalizado con tu análisis detallado y recomendaciones específicas
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-xamai-accent group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        <button
          onClick={onRequestDemo}
          className="group p-6 text-left rounded-2xl bg-gradient-to-br from-xamai-accent/20 to-xamai-accent-bright/10 
                     border border-xamai-accent/30 hover:border-xamai-accent/60 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <Calendar className="w-8 h-8 text-xamai-accent mb-3" />
              <h4 className="text-lg font-display font-semibold text-white mb-2">
                Agendar con un Experto
              </h4>
              <p className="text-sm text-slate-400">
                Revisión gratuita de 30 minutos con especialista en seguridad SAP
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-xamai-accent group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </motion.div>
    </div>
  )
}
