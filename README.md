# 🛡️ Xamai Security Simulator

Simulador de Riesgo y ROI para SAP Business One. Herramienta de generación de leads que evalúa el riesgo cibernético de empresas PyME en México y calcula el ROI de invertir en seguridad.

## 📊 Características

- **Simulador de Riesgo**: Evaluación de 0-100 basada en versión SAP, infraestructura y controles
- **Calculadora de ROI**: Impacto financiero potencial y retorno de inversión
- **Integración HubSpot**: Captura de leads con propiedades personalizadas
- **Generación de Reportes**: PDF descargable con análisis completo
- **Agenda de Reuniones**: Integración con calendario de HubSpot

## 🚀 Despliegue Rápido en Vercel

### 1. Clonar/Subir a GitHub

```bash
# Crear nuevo repositorio en GitHub y subir el código
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/xamai-simulator.git
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio de GitHub
3. Configura las variables de entorno:
   - `HUBSPOT_API_KEY`: Tu API key de HubSpot
   - `HUBSPOT_MEETING_URL`: URL de tu calendario de reuniones
4. Click en **Deploy**

### 3. Configurar Dominio Personalizado (Opcional)

En Vercel Dashboard > Settings > Domains, agrega tu dominio:
- `simulator.xamai.com` o
- `seguridad.xamai.com`

---

## 🔧 Configuración de HubSpot

### Crear Propiedades Personalizadas

Ve a **HubSpot > Settings > Properties > Create property** y crea las siguientes propiedades para Contactos:

| Nombre Interno | Label | Tipo |
|----------------|-------|------|
| `xamai_simulator_risk_score` | Xamai - Score de Riesgo | Number |
| `xamai_simulator_total_impact` | Xamai - Impacto Total (MXN) | Number |
| `xamai_simulator_roi` | Xamai - ROI Proyectado (%) | Number |
| `xamai_simulator_sap_version` | Xamai - Versión SAP | Single-line text |
| `xamai_simulator_industry` | Xamai - Industria | Single-line text |
| `xamai_simulator_region` | Xamai - Región | Single-line text |
| `xamai_simulator_date` | Xamai - Fecha Análisis | Date |

### Obtener API Key

1. Ve a **Settings > Integrations > API Key**
2. Genera una nueva API key (o usa Private App Token para más seguridad)
3. Copia la key y agrégala como variable de entorno

### Configurar Calendario de Reuniones

1. Ve a **Sales > Meetings**
2. Crea un tipo de reunión llamado "Consulta de Seguridad SAP"
3. Configura:
   - Duración: 30 minutos
   - Disponibilidad según tu calendario
4. Copia el link de reunión y agrégalo como `HUBSPOT_MEETING_URL`

### Crear Workflow de Seguimiento (Recomendado)

1. Ve a **Automation > Workflows**
2. Crea un workflow que se active cuando:
   - `xamai_simulator_risk_score` > 0 (contacto del simulador)
3. Acciones sugeridas:
   - Notificar a BDR asignado
   - Enviar email de seguimiento con el reporte
   - Crear tarea de seguimiento si score > 70

---

## 📱 Integración con WordPress

### Opción 1: Iframe (Más Simple)

Agrega esto en tu página de WordPress:

```html
<iframe 
  src="https://tu-simulator.vercel.app" 
  width="100%" 
  height="1200" 
  frameborder="0"
  style="border-radius: 16px; max-width: 1200px; margin: 0 auto; display: block;">
</iframe>
```

### Opción 2: Plugin Personalizado

Crea un shortcode en tu tema de WordPress:

```php
// En functions.php de tu tema
function xamai_simulator_shortcode($atts) {
    $atts = shortcode_atts(array(
        'height' => '1200',
    ), $atts);
    
    return '<div class="xamai-simulator-container">
        <iframe 
            src="https://tu-simulator.vercel.app" 
            width="100%" 
            height="' . esc_attr($atts['height']) . '" 
            frameborder="0"
            loading="lazy">
        </iframe>
    </div>';
}
add_shortcode('xamai_simulator', 'xamai_simulator_shortcode');
```

Uso en WordPress:
```
[xamai_simulator height="1400"]
```

### Opción 3: Next.js como Subdirectorio

Si quieres más control, puedes servir Next.js desde un subdirectorio de tu dominio WordPress usando reverse proxy en nginx:

```nginx
location /simulador/ {
    proxy_pass https://tu-simulator.vercel.app/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 🎨 Personalización

### Colores de Marca

Edita `tailwind.config.js` para cambiar los colores:

```javascript
colors: {
  'xamai': {
    dark: '#0a0f1c',      // Fondo oscuro
    accent: '#00d4aa',    // Color primario
    'accent-bright': '#00ffc8', // Hover/énfasis
    // ... más colores
  }
}
```

### Logo y Branding

1. Agrega tu logo en `/public/logo.svg`
2. Actualiza el header en `app/page.tsx`
3. Modifica los textos según tu marca

### Datos de Riesgo

Los multiplicadores y fórmulas están en `lib/risk-data.ts`. Puedes ajustar:
- Multiplicadores por industria/región
- Costos por hora de inactividad
- Tiempos de detección/respuesta

---

## 📈 Métricas del Simulador

El simulador captura y envía a HubSpot:

### Datos del Contacto
- Nombre, Email, Empresa, Teléfono
- Cargo/Rol en la empresa
- Consentimiento de marketing

### Datos del Análisis
- Score de riesgo (0-100)
- Impacto financiero estimado (MXN)
- ROI proyectado (%)
- Versión de SAP B1
- Industria y región

### Recomendaciones para BDR

Con estos datos, el equipo de ventas puede:
1. Priorizar leads por score de riesgo
2. Personalizar la conversación según industria
3. Usar el impacto financiero como argumento de venta
4. Comparar con benchmark del sector

---

## 🔒 Seguridad

- No almacena datos sensibles en el frontend
- Comunicación cifrada con HubSpot (HTTPS)
- Variables de entorno protegidas en Vercel
- Sin cookies de rastreo de terceros

---

## 📚 Fuentes de Datos

Los cálculos del simulador están basados en:

- **IBM Cost of a Data Breach Report 2025**: Costos por registro, tiempos de detección
- **LFPDPPP / INAI**: Multas y marco legal en México
- **NVD/NIST**: Vulnerabilidades de SAP Business One
- **FortiGuard Labs**: Volumen de ataques en México
- **Mandiant M-Trends**: Tiempos de permanencia (dwell time)
- **Check Point Research**: Multiplicadores por industria

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

---

## 📝 Licencia

MIT License - Libre para uso comercial y modificación.

---

## 🤝 Soporte

- **Documentación**: [docs.xamai.com](https://docs.xamai.com)
- **Email**: desarrollo@xamai.com
- **Issues**: Usar el sistema de issues de GitHub

---

Desarrollado con ❤️ por el equipo de Xamai para la comunidad SAP Business One en México.
