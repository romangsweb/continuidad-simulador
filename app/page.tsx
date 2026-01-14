'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  Target, 
  ArrowRight,
  Menu,
  X,
  Download,
  Calendar,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import RiskForm from '@/components/RiskForm'
import ResultsDashboard from '@/components/ResultsDashboard'
import LeadForm from '@/components/LeadForm'
import { RISK_DATA, calculateRiskScore, calculateFinancialImpact, getRiskLevel } from '@/lib/risk-data'

type Step = 'intro' | 'form' | 'results' | 'leadCapture' | 'success'

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

const defaultFormData: FormData = {
  sapVersion: '9.3',
  database: 'sql_server',
  deployment: 'on_premise',
  remoteAccess: 'rdp_open',
  perimeter: 'basic',
  monitoring: 'none',
  industry: 'manufactura',
  region: 'centro',
  annualRevenue: 50_000_000,
  employees: 35,
  sapRecords: 5000
}

export default function SimulatorPage() {
  const [step, setStep] = useState<Step>('intro')
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [riskScore, setRiskScore] = useState(0)
  const [financialImpact, setFinancialImpact] = useState<ReturnType<typeof calculateFinancialImpact> | null>(null)
  const [successData, setSuccessData] = useState<{ downloadUrl: string; meetingUrl: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleFormChange = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleCalculate = () => {
    const score = calculateRiskScore(formData)
    const impact = calculateFinancialImpact({
      annualRevenue: formData.annualRevenue,
      sapRecords: formData.sapRecords,
      employees: formData.employees,
      riskScore: score
    })
    
    setRiskScore(score)
    setFinancialImpact(impact)
    setStep('results')
    
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRequestDemo = () => {
    setStep('leadCapture')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDownloadReport = () => {
    setStep('leadCapture')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLeadSuccess = (data: { downloadUrl: string; meetingUrl: string }) => {
    setSuccessData(data)
    setStep('success')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startSimulator = () => {
    setStep('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-xamai-darker bg-grid">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-xamai-accent to-xamai-accent-bright 
                              flex items-center justify-center">
                <Shield className="w-6 h-6 text-xamai-darker" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg">Xamai</span>
                <span className="text-slate-500 text-sm block -mt-1">Security Analysis</span>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="https://xamai.com" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-white transition-colors text-sm">
                Sobre Nosotros
              </a>
              <a href="https://xamai.com/servicios" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-white transition-colors text-sm">
                Servicios
              </a>
              <a href="https://xamai.com/contacto" target="_blank" rel="noopener noreferrer"
                 className="px-4 py-2 rounded-lg bg-xamai-accent/10 text-xamai-accent 
                           hover:bg-xamai-accent/20 transition-colors text-sm font-medium">
                Contacto
              </a>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800/50"
            >
              <nav className="flex flex-col p-4 gap-3">
                <a href="https://xamai.com" className="text-slate-400 hover:text-white py-2">
                  Sobre Nosotros
                </a>
                <a href="https://xamai.com/servicios" className="text-slate-400 hover:text-white py-2">
                  Servicios
                </a>
                <a href="https://xamai.com/contacto" 
                   className="px-4 py-2 rounded-lg bg-xamai-accent/10 text-xamai-accent text-center">
                  Contacto
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                               bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    México: #1 en ciberataques en LATAM
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
                  >
                    ¿Cuánto le costaría a tu empresa{' '}
                    <span className="gradient-text">un ciberataque</span>?
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-slate-400 mb-8 leading-relaxed"
                  >
                    Evalúa el riesgo real de tu infraestructura SAP Business One 
                    con datos de IBM, INAI y análisis de vulnerabilidades 2025.
                  </motion.p>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={startSimulator}
                    className="group inline-flex items-center gap-3 px-8 py-4 
                               bg-gradient-to-r from-xamai-accent to-xamai-accent-bright 
                               rounded-xl font-display font-semibold text-xamai-darker text-lg
                               hover:shadow-[0_0_50px_rgba(0,212,170,0.4)] transition-all duration-300
                               transform hover:scale-105"
                  >
                    Iniciar Análisis Gratuito
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-slate-500 mt-4"
                  >
                    ✓ 3 minutos &nbsp; ✓ Sin costo &nbsp; ✓ Resultados inmediatos
                  </motion.p>
                </div>

                {/* Stats */}
                <motion.div 
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid md:grid-cols-3 gap-6 mt-16"
                >
                  {[
                    { 
                      value: '$2.8M USD', 
                      label: 'Costo promedio de brecha en LATAM',
                      source: 'IBM 2025'
                    },
                    { 
                      value: '200 días', 
                      label: 'Tiempo promedio de detección sin monitoreo',
                      source: 'Mandiant'
                    },
                    { 
                      value: '+112%', 
                      label: 'Incremento de ataques con IA en México',
                      source: 'FortiGuard'
                    }
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="glass-card p-6 text-center"
                    >
                      <p className="text-3xl font-display font-bold gradient-text mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-400 mb-2">{stat.label}</p>
                      <p className="text-xs text-slate-600">Fuente: {stat.source}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="glass-card p-8"
                >
                  <h2 className="text-2xl font-display font-bold text-white text-center mb-8">
                    ¿Qué incluye el análisis?
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: Target,
                        title: 'Score de Riesgo',
                        description: 'Evaluación de 0-100 basada en tu versión SAP, infraestructura y controles actuales.'
                      },
                      {
                        icon: AlertTriangle,
                        title: 'Impacto Financiero',
                        description: 'Cálculo del costo potencial de un incidente: pérdida operativa, multas y recuperación.'
                      },
                      {
                        icon: Shield,
                        title: 'ROI de Seguridad',
                        description: 'Retorno de inversión proyectado al implementar un stack de protección.'
                      }
                    ].map((feature) => (
                      <div key={feature.title} className="text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl 
                                        bg-gradient-to-br from-xamai-accent/20 to-transparent
                                        flex items-center justify-center border border-xamai-accent/20">
                          <feature.icon className="w-7 h-7 text-xamai-accent" />
                        </div>
                        <h3 className="text-lg font-display font-semibold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* FORM */}
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-display font-bold text-white mb-3">
                    Evaluación de Riesgo SAP B1
                  </h1>
                  <p className="text-slate-400">
                    Responde estas preguntas sobre tu infraestructura para calcular tu nivel de riesgo.
                  </p>
                </div>
                
                <RiskForm 
                  formData={formData}
                  onChange={handleFormChange}
                  onSubmit={handleCalculate}
                />
              </motion.div>
            )}

            {/* RESULTS */}
            {step === 'results' && financialImpact && (
              <motion.div
                key="results"
                ref={resultsRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ResultsDashboard
                  riskScore={riskScore}
                  financialImpact={financialImpact}
                  onRequestDemo={handleRequestDemo}
                  onDownloadReport={handleDownloadReport}
                />
              </motion.div>
            )}

            {/* LEAD CAPTURE */}
            {step === 'leadCapture' && financialImpact && (
              <motion.div
                key="leadCapture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto"
              >
                <LeadForm
                  simulatorResults={{
                    riskScore,
                    totalImpact: financialImpact.totalImpact,
                    roi: financialImpact.roi,
                    sapVersion: formData.sapVersion,
                    industry: formData.industry,
                    region: formData.region
                  }}
                  onSuccess={handleLeadSuccess}
                />
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 'success' && successData && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-xamai-accent/20 
                             flex items-center justify-center border-2 border-xamai-accent"
                >
                  <CheckCircle className="w-12 h-12 text-xamai-accent" />
                </motion.div>
                
                <h1 className="text-3xl font-display font-bold text-white mb-4">
                  ¡Listo! Tu análisis está en camino
                </h1>
                <p className="text-slate-400 mb-8">
                  Revisa tu correo para descargar el reporte completo. 
                  Mientras tanto, agenda tu consulta gratuita con nuestro equipo.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <a
                    href={successData.downloadUrl}
                    className="glass-card p-6 flex items-center gap-4 hover:border-xamai-accent/50 transition-all group"
                  >
                    <Download className="w-8 h-8 text-xamai-accent" />
                    <div className="text-left">
                      <p className="font-semibold text-white">Descargar Reporte</p>
                      <p className="text-sm text-slate-400">PDF con análisis completo</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-500 ml-auto group-hover:text-xamai-accent" />
                  </a>
                  
                  <a
                    href={successData.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 flex items-center gap-4 rounded-2xl 
                               bg-gradient-to-br from-xamai-accent/20 to-xamai-accent-bright/10 
                               border border-xamai-accent/30 hover:border-xamai-accent/60 transition-all group"
                  >
                    <Calendar className="w-8 h-8 text-xamai-accent" />
                    <div className="text-left">
                      <p className="font-semibold text-white">Agendar Consulta</p>
                      <p className="text-sm text-slate-400">30 min con especialista</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-xamai-accent ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    setStep('intro')
                    setFormData(defaultFormData)
                    setRiskScore(0)
                    setFinancialImpact(null)
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ← Realizar otro análisis
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-xamai-accent" />
            <span className="text-slate-400 text-sm">
              © 2025 Xamai. Implementadores SAP Business One en México.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="https://xamai.com/privacidad" className="text-slate-500 hover:text-slate-300">
              Privacidad
            </a>
            <a href="https://xamai.com/terminos" className="text-slate-500 hover:text-slate-300">
              Términos
            </a>
            <a href="https://xamai.com" target="_blank" rel="noopener noreferrer" 
               className="text-xamai-accent hover:text-xamai-accent-bright">
              xamai.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
