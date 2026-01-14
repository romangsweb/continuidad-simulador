'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Mail, 
  Building2, 
  Phone, 
  Briefcase,
  CheckCircle,
  Loader2,
  Shield,
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react'

interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  jobTitle: string
  acceptsMarketing: boolean
}

interface SimulatorResults {
  riskScore: number
  totalImpact: number
  roi: number
  sapVersion: string
  industry: string
  region: string
}

interface LeadFormProps {
  simulatorResults: SimulatorResults
  onSuccess: (data: { downloadUrl: string; meetingUrl: string }) => void
}

export default function LeadForm({ simulatorResults, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    jobTitle: '',
    acceptsMarketing: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: formData,
          simulatorResults
        }),
      })

      if (!response.ok) {
        throw new Error('Error al enviar los datos')
      }

      const data = await response.json()
      onSuccess(data)
    } catch (err) {
      setError('Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof LeadFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputClasses = `
    w-full px-4 py-3 rounded-xl bg-xamai-dark/50 border border-slate-700/50 
    text-white placeholder-slate-500 focus:border-xamai-accent transition-all duration-300
    hover:border-slate-600
  `

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-xamai-accent/20 to-xamai-accent-bright/10 
                     flex items-center justify-center border border-xamai-accent/30"
        >
          <FileText className="w-8 h-8 text-xamai-accent" />
        </motion.div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Obtén tu Reporte Personalizado
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Ingresa tus datos para recibir el análisis completo y agendar una consulta gratuita con nuestros expertos.
        </p>
      </div>

      {/* Preview de lo que recibirán */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-xamai-accent" />
            <span className="font-medium text-white">Reporte PDF</span>
          </div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Análisis detallado de vulnerabilidades</li>
            <li>• Proyección financiera personalizada</li>
            <li>• Plan de mitigación por fases</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-xamai-accent" />
            <span className="font-medium text-white">Consulta Gratuita</span>
          </div>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• 30 minutos con especialista SAP</li>
            <li>• Revisión de tu arquitectura</li>
            <li>• Cotización sin compromiso</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <User className="w-4 h-4 text-xamai-accent" />
              Nombre
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="Tu nombre"
              className={inputClasses}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <User className="w-4 h-4 text-xamai-accent" />
              Apellido
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              placeholder="Tu apellido"
              className={inputClasses}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Mail className="w-4 h-4 text-xamai-accent" />
            Correo Corporativo
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="tu@empresa.com"
            className={inputClasses}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Building2 className="w-4 h-4 text-xamai-accent" />
              Empresa
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder="Nombre de tu empresa"
              className={inputClasses}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
              <Phone className="w-4 h-4 text-xamai-accent" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+52 55 1234 5678"
              className={inputClasses}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Briefcase className="w-4 h-4 text-xamai-accent" />
            Cargo
          </label>
          <select
            value={formData.jobTitle}
            onChange={(e) => updateField('jobTitle', e.target.value)}
            className={inputClasses}
          >
            <option value="">Selecciona tu cargo</option>
            <option value="ceo">CEO / Director General</option>
            <option value="cfo">CFO / Director Financiero</option>
            <option value="cio">CIO / Director de TI</option>
            <option value="ciso">CISO / Director de Seguridad</option>
            <option value="it_manager">Gerente de TI</option>
            <option value="sap_manager">Gerente SAP / Basis</option>
            <option value="operations">Director de Operaciones</option>
            <option value="other">Otro</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3"
        >
          <input
            type="checkbox"
            id="marketing"
            checked={formData.acceptsMarketing}
            onChange={(e) => updateField('acceptsMarketing', e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-700 bg-xamai-dark/50 
                       text-xamai-accent focus:ring-xamai-accent focus:ring-offset-0"
          />
          <label htmlFor="marketing" className="text-sm text-slate-400">
            Acepto recibir contenido sobre ciberseguridad y SAP Business One. 
            Puedo cancelar mi suscripción en cualquier momento.
          </label>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full group relative py-4 bg-gradient-to-r from-xamai-accent to-xamai-accent-bright 
                     rounded-xl font-display font-semibold text-xamai-darker text-lg
                     hover:shadow-[0_0_40px_rgba(0,212,170,0.4)] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Obtener Mi Análisis Gratuito
            </span>
          )}
        </motion.button>

        <p className="text-center text-xs text-slate-500">
          Al enviar este formulario, aceptas nuestra{' '}
          <a href="#" className="text-xamai-accent hover:underline">
            Política de Privacidad
          </a>
          . Tus datos están protegidos y nunca serán compartidos con terceros.
        </p>
      </form>
    </motion.div>
  )
}
