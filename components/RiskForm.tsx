'use client'

import { motion } from 'framer-motion'
import { 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  Eye, 
  Factory, 
  MapPin,
  DollarSign,
  Users,
  FileStack
} from 'lucide-react'
import { RISK_DATA } from '@/lib/risk-data'

interface FormData {
  sapVersion: keyof typeof RISK_DATA.sapVersionRisk
  database: keyof typeof RISK_DATA.databaseRisk
  deployment: keyof typeof RISK_DATA.deploymentRisk
  remoteAccess: keyof typeof RISK_DATA.remoteAccessRisk
  perimeter: keyof typeof RISK_DATA.perimeterRisk
  monitoring: keyof typeof RISK_DATA.monitoringRisk
  industry: keyof typeof RISK_DATA.industryMultipliers
  region: keyof typeof RISK_DATA.regionMultipliers
  annualRevenue: number
  employees: number
  sapRecords: number
}

interface RiskFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  onSubmit: () => void
}

const SelectField = ({ 
  label, 
  icon: Icon, 
  value, 
  options, 
  onChange,
  delay = 0
}: {
  label: string
  icon: React.ElementType
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
      <Icon className="w-4 h-4 text-xamai-accent" />
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl bg-xamai-dark/50 border border-slate-700/50 
                 text-white focus:border-xamai-accent transition-all duration-300
                 hover:border-slate-600"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </motion.div>
)

const NumberInput = ({
  label,
  icon: Icon,
  value,
  onChange,
  min = 0,
  max = 999999999,
  step = 1,
  suffix = '',
  delay = 0
}: {
  label: string
  icon: React.ElementType
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  delay?: number
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="space-y-2"
  >
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
      <Icon className="w-4 h-4 text-xamai-accent" />
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 rounded-xl bg-xamai-dark/50 border border-slate-700/50 
                   text-white focus:border-xamai-accent transition-all duration-300
                   hover:border-slate-600 pr-16"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
          {suffix}
        </span>
      )}
    </div>
  </motion.div>
)

export default function RiskForm({ formData, onChange, onSubmit }: RiskFormProps) {
  const sapVersionOptions = Object.entries(RISK_DATA.sapVersionRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const databaseOptions = Object.entries(RISK_DATA.databaseRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const deploymentOptions = Object.entries(RISK_DATA.deploymentRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const remoteAccessOptions = Object.entries(RISK_DATA.remoteAccessRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const perimeterOptions = Object.entries(RISK_DATA.perimeterRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const monitoringOptions = Object.entries(RISK_DATA.monitoringRisk).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const industryOptions = Object.entries(RISK_DATA.industryMultipliers).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  const regionOptions = Object.entries(RISK_DATA.regionMultipliers).map(([key, val]) => ({
    value: key,
    label: val.label
  }))

  return (
    <div className="space-y-8">
      {/* Sección: Infraestructura SAP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-xamai-accent" />
          Infraestructura SAP
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="Versión de SAP Business One"
            icon={Server}
            value={formData.sapVersion}
            options={sapVersionOptions}
            onChange={(v) => onChange({ sapVersion: v as keyof typeof RISK_DATA.sapVersionRisk })}
            delay={0.1}
          />
          
          <SelectField
            label="Base de Datos"
            icon={Database}
            value={formData.database}
            options={databaseOptions}
            onChange={(v) => onChange({ database: v as keyof typeof RISK_DATA.databaseRisk })}
            delay={0.15}
          />
          
          <SelectField
            label="Tipo de Despliegue"
            icon={Cloud}
            value={formData.deployment}
            options={deploymentOptions}
            onChange={(v) => onChange({ deployment: v as keyof typeof RISK_DATA.deploymentRisk })}
            delay={0.2}
          />
          
          <SelectField
            label="Acceso Remoto"
            icon={Shield}
            value={formData.remoteAccess}
            options={remoteAccessOptions}
            onChange={(v) => onChange({ remoteAccess: v as keyof typeof RISK_DATA.remoteAccessRisk })}
            delay={0.25}
          />
        </div>
      </motion.div>

      {/* Sección: Seguridad Actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-6"
      >
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-xamai-accent" />
          Postura de Seguridad
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="Protección Perimetral"
            icon={Shield}
            value={formData.perimeter}
            options={perimeterOptions}
            onChange={(v) => onChange({ perimeter: v as keyof typeof RISK_DATA.perimeterRisk })}
            delay={0.3}
          />
          
          <SelectField
            label="Monitoreo de Seguridad"
            icon={Eye}
            value={formData.monitoring}
            options={monitoringOptions}
            onChange={(v) => onChange({ monitoring: v as keyof typeof RISK_DATA.monitoringRisk })}
            delay={0.35}
          />
        </div>
      </motion.div>

      {/* Sección: Contexto de Negocio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 space-y-6"
      >
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <Factory className="w-5 h-5 text-xamai-accent" />
          Contexto de Negocio
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField
            label="Industria"
            icon={Factory}
            value={formData.industry}
            options={industryOptions}
            onChange={(v) => onChange({ industry: v as keyof typeof RISK_DATA.industryMultipliers })}
            delay={0.4}
          />
          
          <SelectField
            label="Región de Operación"
            icon={MapPin}
            value={formData.region}
            options={regionOptions}
            onChange={(v) => onChange({ region: v as keyof typeof RISK_DATA.regionMultipliers })}
            delay={0.45}
          />
        </div>
      </motion.div>

      {/* Sección: Datos Financieros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 space-y-6"
      >
        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-xamai-accent" />
          Datos Operativos
          <span className="text-xs text-slate-500 font-normal ml-2">
            (Para calcular impacto financiero)
          </span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <NumberInput
            label="Facturación Anual"
            icon={DollarSign}
            value={formData.annualRevenue}
            onChange={(v) => onChange({ annualRevenue: v })}
            min={0}
            step={1000000}
            suffix="MXN"
            delay={0.5}
          />
          
          <NumberInput
            label="Número de Empleados"
            icon={Users}
            value={formData.employees}
            onChange={(v) => onChange({ employees: v })}
            min={1}
            max={10000}
            delay={0.55}
          />
          
          <NumberInput
            label="Registros en SAP"
            icon={FileStack}
            value={formData.sapRecords}
            onChange={(v) => onChange({ sapRecords: v })}
            min={100}
            step={1000}
            suffix="clientes"
            delay={0.6}
          />
        </div>
      </motion.div>

      {/* Botón de envío */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={onSubmit}
          className="group relative px-12 py-4 bg-gradient-to-r from-xamai-accent to-xamai-accent-bright 
                     rounded-xl font-display font-semibold text-xamai-darker text-lg
                     hover:shadow-[0_0_40px_rgba(0,212,170,0.4)] transition-all duration-300
                     transform hover:scale-105"
        >
          <span className="relative z-10 flex items-center gap-2">
            Calcular Mi Riesgo
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </motion.div>
    </div>
  )
}
