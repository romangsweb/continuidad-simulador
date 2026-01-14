import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Simulador de Riesgo SAP B1 | Xamai',
  description: 'Evalúa el riesgo cibernético de tu empresa y calcula el ROI de invertir en seguridad para SAP Business One. Análisis basado en datos de IBM, INAI y estudios de ciberseguridad 2025.',
  keywords: 'SAP Business One, ciberseguridad, simulador riesgo, ROI seguridad, PYME México, ransomware, Xamai',
  authors: [{ name: 'Xamai' }],
  openGraph: {
    title: 'Simulador de Riesgo SAP B1 | Xamai',
    description: 'Evalúa el riesgo cibernético de tu empresa con SAP Business One',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-xamai-darker min-h-screen antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  )
}
