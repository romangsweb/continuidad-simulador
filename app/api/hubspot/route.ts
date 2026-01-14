import { NextRequest, NextResponse } from 'next/server'

// Esta API manejará:
// 1. Crear/actualizar contacto en HubSpot
// 2. Crear propiedades custom con los resultados del simulador
// 3. Generar URL de reunión

interface ContactData {
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

interface HubSpotRequestBody {
  contact: ContactData
  simulatorResults: SimulatorResults
}

// Mapeo de job titles a valores de HubSpot
const jobTitleMapping: Record<string, string> = {
  'ceo': 'CEO / Director General',
  'cfo': 'CFO / Director Financiero',
  'cio': 'CIO / Director de TI',
  'ciso': 'CISO / Director de Seguridad',
  'it_manager': 'Gerente de TI',
  'sap_manager': 'Gerente SAP / Basis',
  'operations': 'Director de Operaciones',
  'other': 'Otro'
}

export async function POST(request: NextRequest) {
  try {
    const body: HubSpotRequestBody = await request.json()
    const { contact, simulatorResults } = body

    // Validación básica
    if (!contact.email || !contact.firstName || !contact.lastName) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY
    
    // Si no hay API key, retornamos datos simulados para desarrollo
    if (!HUBSPOT_API_KEY) {
      console.log('⚠️ No HubSpot API key found - returning mock response')
      console.log('Contact data:', contact)
      console.log('Simulator results:', simulatorResults)
      
      // Generar un ID único para el reporte
      const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      return NextResponse.json({
        success: true,
        contactId: 'mock-contact-id',
        reportId,
        // URL del reporte PDF (en producción se generaría dinámicamente)
        downloadUrl: `/api/report/${reportId}`,
        // URL del calendario de HubSpot (reemplazar con tu URL real)
        meetingUrl: 'https://meetings.hubspot.com/xamai/consulta-seguridad',
        message: 'Contacto creado exitosamente (modo desarrollo)'
      })
    }

    // Preparar las propiedades del contacto para HubSpot
    const hubspotProperties = {
      // Datos del contacto
      firstname: contact.firstName,
      lastname: contact.lastName,
      email: contact.email,
      company: contact.company,
      phone: contact.phone,
      jobtitle: jobTitleMapping[contact.jobTitle] || contact.jobTitle,
      
      // Propiedades custom del simulador (deben crearse primero en HubSpot)
      // Naming convention: xamai_simulator_[property]
      xamai_simulator_risk_score: simulatorResults.riskScore.toString(),
      xamai_simulator_total_impact: simulatorResults.totalImpact.toString(),
      xamai_simulator_roi: simulatorResults.roi.toString(),
      xamai_simulator_sap_version: simulatorResults.sapVersion,
      xamai_simulator_industry: simulatorResults.industry,
      xamai_simulator_region: simulatorResults.region,
      xamai_simulator_date: new Date().toISOString().split('T')[0],
      
      // Lead source
      hs_lead_status: 'NEW',
      lifecyclestage: 'marketingqualifiedlead',
      lead_source: 'Simulador de Riesgo SAP B1',
      
      // Marketing consent
      hs_marketing_contact_status: contact.acceptsMarketing ? 'true' : 'false'
    }

    // Crear o actualizar contacto en HubSpot
    const hubspotResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: hubspotProperties
        }),
      }
    )

    // Si el contacto ya existe, actualizarlo
    if (hubspotResponse.status === 409) {
      // Buscar contacto existente
      const searchResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filterGroups: [{
              filters: [{
                propertyName: 'email',
                operator: 'EQ',
                value: contact.email
              }]
            }]
          }),
        }
      )

      const searchData = await searchResponse.json()
      
      if (searchData.results && searchData.results.length > 0) {
        const existingContactId = searchData.results[0].id

        // Actualizar contacto existente
        await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${existingContactId}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              properties: hubspotProperties
            }),
          }
        )

        const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        return NextResponse.json({
          success: true,
          contactId: existingContactId,
          reportId,
          downloadUrl: `/api/report/${reportId}`,
          meetingUrl: 'https://meetings.hubspot.com/xamai/consulta-seguridad',
          message: 'Contacto actualizado exitosamente'
        })
      }
    }

    if (!hubspotResponse.ok) {
      const errorData = await hubspotResponse.json()
      console.error('HubSpot error:', errorData)
      throw new Error('Error al crear contacto en HubSpot')
    }

    const hubspotData = await hubspotResponse.json()
    const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      contactId: hubspotData.id,
      reportId,
      downloadUrl: `/api/report/${reportId}`,
      meetingUrl: 'https://meetings.hubspot.com/xamai/consulta-seguridad',
      message: 'Contacto creado exitosamente'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET endpoint para verificar el estado de la API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hubspotConfigured: !!process.env.HUBSPOT_API_KEY
  })
}
