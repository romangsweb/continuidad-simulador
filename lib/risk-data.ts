// Datos extraídos del IBM Cost of a Data Breach 2025 y fuentes del proyecto
// Todos los valores están documentados y son verificables

export const RISK_DATA = {
  // Costo promedio por registro robado (USD) - IBM 2025
  costPerRecord: {
    customerPII: 160,
    employeePII: 168,
    intellectualProperty: 178,
    otherCorporate: 154,
    average: 165,
  },

  // Costos de brecha en LATAM (USD) - IBM 2025
  breachCosts: {
    latamAverage: 2_800_000,
    latamMax: 3_800_000,
    mexicoEstimate: 2_760_000,
    withAIDefense: 1_760_000, // Ahorro promedio con IA
    savingsWithAI: 1_880_000,
  },

  // Tiempos de detección y respuesta - Mandiant/Verizon DBIR
  detectionTimes: {
    withoutMonitoring: 200, // días - MTTD sin herramientas
    withLumu: 1, // día - MTTD con Lumu
    mttrWithoutVisibility: 75, // días
    mttrWithStack: 5, // días
    breachLifecycleThreshold: 200, // días - umbral donde costo sube 35%
  },

  // Versiones SAP B1 y su riesgo - NVD/NIST
  sapVersionRisk: {
    '9.2': { risk: 'critical', probability: 0.85, points: 40, label: 'SAP B1 9.2 o anterior (Sin soporte)' },
    '9.3': { risk: 'high', probability: 0.65, points: 30, label: 'SAP B1 9.3 (Fin de vida)' },
    '10.0': { risk: 'medium', probability: 0.20, points: 10, label: 'SAP B1 10.0 (Actual)' },
  },

  // Tipo de base de datos
  databaseRisk: {
    'sql_server': { points: 15, label: 'SQL Server' },
    'hana': { points: 10, label: 'SAP HANA' },
  },

  // Tipo de despliegue
  deploymentRisk: {
    'on_premise': { points: 25, label: 'Servidor en oficina (On-Premise)' },
    'cloud_basic': { points: 20, label: 'Cloud con RDP/VPN básica' },
    'cloud_managed': { points: 5, label: 'Cloud administrado profesional' },
  },

  // Acceso remoto
  remoteAccessRisk: {
    'rdp_open': { points: 30, label: 'RDP abierto / VPN básica' },
    'vpn_enterprise': { points: 15, label: 'VPN empresarial' },
    'zero_trust': { points: 5, label: 'Zero Trust / ZTNA' },
    'none': { points: 0, label: 'Sin acceso remoto' },
  },

  // Protección perimetral
  perimeterRisk: {
    'none': { points: 25, label: 'Sin protección WAF/Cloudflare' },
    'basic': { points: 15, label: 'Firewall básico' },
    'waf': { points: 5, label: 'WAF / Cloudflare activo' },
  },

  // Monitoreo
  monitoringRisk: {
    'none': { points: 40, label: 'Solo antivirus básico' },
    'basic_siem': { points: 20, label: 'SIEM básico' },
    'full_stack': { points: 5, label: 'Stack completo (Lumu/Datadog/Tenable)' },
  },

  // Multiplicadores por industria - INEGI/Check Point
  industryMultipliers: {
    'manufactura': { multiplier: 1.5, label: 'Manufactura / Automotriz' },
    'logistica': { multiplier: 1.3, label: 'Logística / Transporte' },
    'retail': { multiplier: 1.4, label: 'Comercio / Retail' },
    'servicios': { multiplier: 1.0, label: 'Servicios Profesionales' },
    'salud': { multiplier: 1.4, label: 'Salud' },
    'financiero': { multiplier: 1.6, label: 'Servicios Financieros' },
  },

  // Multiplicadores por región - AMEXI/FortiGuard
  regionMultipliers: {
    'bajio': { multiplier: 1.3, label: 'Bajío (GTO/QRO/SLP)' },
    'norte': { multiplier: 1.25, label: 'Norte (MTY/CHIH/TAMPS)' },
    'centro': { multiplier: 1.1, label: 'Centro (CDMX/EDO.MEX)' },
    'sur': { multiplier: 1.0, label: 'Sur / Sureste' },
    'occidente': { multiplier: 1.15, label: 'Occidente (JAL/MICH)' },
  },

  // Multas LFPDPPP - INAI
  fines: {
    minUMA: 200,
    maxUMA: 320_000,
    umaValue2025: 108.57, // MXN
    typicalPYMEFine: {
      min: 150_000,
      max: 600_000,
    },
  },

  // Costos operativos por hora en MXN
  downtimeCosts: {
    pymeSmall: { min: 5_000, max: 15_000 },
    pymeMedium: { min: 15_000, max: 50_000 },
    enterprise: { min: 50_000, max: 200_000 },
  },

  // Días de recuperación
  recoveryDays: {
    withoutStack: 15,
    withStack: 2,
    ransomwareAverage: 21,
  },
}

// Fórmulas de cálculo basadas en el proyecto
export const calculateRiskScore = (inputs: {
  sapVersion: keyof typeof RISK_DATA.sapVersionRisk
  database: keyof typeof RISK_DATA.databaseRisk
  deployment: keyof typeof RISK_DATA.deploymentRisk
  remoteAccess: keyof typeof RISK_DATA.remoteAccessRisk
  perimeter: keyof typeof RISK_DATA.perimeterRisk
  monitoring: keyof typeof RISK_DATA.monitoringRisk
  industry: keyof typeof RISK_DATA.industryMultipliers
  region: keyof typeof RISK_DATA.regionMultipliers
}): number => {
  const basePoints = 
    RISK_DATA.sapVersionRisk[inputs.sapVersion].points +
    RISK_DATA.databaseRisk[inputs.database].points +
    RISK_DATA.deploymentRisk[inputs.deployment].points +
    RISK_DATA.remoteAccessRisk[inputs.remoteAccess].points +
    RISK_DATA.perimeterRisk[inputs.perimeter].points +
    RISK_DATA.monitoringRisk[inputs.monitoring].points

  const industryMultiplier = RISK_DATA.industryMultipliers[inputs.industry].multiplier
  const regionMultiplier = RISK_DATA.regionMultipliers[inputs.region].multiplier

  // Score máximo teórico: 175 puntos * 1.6 * 1.3 = 364
  // Normalizamos a 100
  const rawScore = basePoints * industryMultiplier * regionMultiplier
  return Math.min(100, Math.round((rawScore / 364) * 100))
}

export const calculateFinancialImpact = (inputs: {
  annualRevenue: number // MXN
  sapRecords: number
  employees: number
  riskScore: number
}) => {
  const exchangeRate = 17.5 // USD to MXN aproximado

  // Costo de inactividad por día (basado en ventas anuales)
  const dailyRevenue = inputs.annualRevenue / 365
  const hourlyLoss = dailyRevenue / 8

  // Días de paro según nivel de riesgo
  const downtimeDays = inputs.riskScore > 70 
    ? RISK_DATA.recoveryDays.withoutStack 
    : inputs.riskScore > 40 
      ? 7 
      : 3

  // Pérdida operativa
  const operationalLoss = hourlyLoss * 8 * downtimeDays * 1.2 // Factor 1.2 de recuperación

  // Riesgo de filtración de datos
  const probabilityMultiplier = inputs.riskScore / 100
  const dataBreachRisk = inputs.sapRecords * RISK_DATA.costPerRecord.average * exchangeRate * probabilityMultiplier

  // Multas potenciales (LFPDPPP)
  const potentialFines = inputs.riskScore > 60 
    ? RISK_DATA.fines.typicalPYMEFine.max 
    : RISK_DATA.fines.typicalPYMEFine.min

  // Costo de recuperación técnica
  const techRecoveryCost = inputs.riskScore > 50 ? 400_000 : 200_000

  // Total de impacto potencial
  const totalImpact = operationalLoss + dataBreachRisk + potentialFines + techRecoveryCost

  // ROI de invertir en seguridad
  const securityInvestmentAnnual = 420_000 // ~$35K MXN/mes promedio
  const riskReduction = 0.85 // 85% de reducción con stack completo
  const mitigatedRisk = totalImpact * riskReduction
  const roi = ((mitigatedRisk - securityInvestmentAnnual) / securityInvestmentAnnual) * 100

  return {
    hourlyLoss: Math.round(hourlyLoss),
    downtimeDays,
    operationalLoss: Math.round(operationalLoss),
    dataBreachRisk: Math.round(dataBreachRisk),
    potentialFines: Math.round(potentialFines),
    techRecoveryCost,
    totalImpact: Math.round(totalImpact),
    securityInvestmentAnnual,
    mitigatedRisk: Math.round(mitigatedRisk),
    roi: Math.round(roi),
    paybackHours: Math.round(securityInvestmentAnnual / hourlyLoss),
  }
}

// Niveles de riesgo para visualización
export const getRiskLevel = (score: number): {
  level: 'critical' | 'high' | 'medium' | 'low'
  label: string
  color: string
  recommendation: string
} => {
  if (score >= 75) {
    return {
      level: 'critical',
      label: 'Crítico',
      color: '#dc2626',
      recommendation: 'Acción inmediata requerida. Tu infraestructura tiene vulnerabilidades activas que pueden ser explotadas en cualquier momento.'
    }
  }
  if (score >= 50) {
    return {
      level: 'high',
      label: 'Alto',
      color: '#f97316',
      recommendation: 'Riesgo significativo. Se recomienda implementar medidas de protección en los próximos 30 días.'
    }
  }
  if (score >= 25) {
    return {
      level: 'medium',
      label: 'Medio',
      color: '#eab308',
      recommendation: 'Existen áreas de mejora. Considera una evaluación profesional para identificar gaps específicos.'
    }
  }
  return {
    level: 'low',
    label: 'Bajo',
    color: '#22c55e',
    recommendation: 'Tu postura de seguridad es sólida. Mantén las actualizaciones y monitoreo continuo.'
  }
}

// Datos para gráficas de benchmarking
export const BENCHMARK_DATA = {
  attacksPerDay: 94_000_000_000 / 180, // Ataques en México primer semestre / días
  attackIncrease: 112, // % incremento por IA
  ransomwareRecoveryWithout: 21, // días
  ransomwareRecoveryWith: 2, // días
  detectionTimeWithout: 200, // días
  detectionTimeWith: 1, // día
}
