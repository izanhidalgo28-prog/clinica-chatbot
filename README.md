# Chatbot IA para Clínicas Estéticas
## Guía de despliegue — paso a paso

---

## Estructura del proyecto

```
chatbot-clinica/
├── api/
│   └── chat.js          ← Servidor seguro (tu API key vive aquí)
├── public/
│   └── widget.html      ← Widget que va en la web del cliente
├── vercel.json          ← Configuración de Vercel
└── README.md
```

---

## Paso 1 — Crear cuenta en Vercel (gratis)

1. Ve a https://vercel.com y crea una cuenta con tu email o GitHub.
2. Instala la CLI de Vercel en tu ordenador:
   ```
   npm install -g vercel
   ```
3. Inicia sesión desde la terminal:
   ```
   vercel login
   ```

---

## Paso 2 — Obtener tu API key de Anthropic

1. Ve a https://console.anthropic.com
2. En el menú lateral → "API Keys" → "Create Key"
3. Copia la key (empieza por `sk-ant-...`)
4. Guárdala en un lugar seguro — solo la verás una vez.

---

## Paso 3 — Subir el proyecto a Vercel

Desde la carpeta del proyecto en tu terminal:

```bash
cd chatbot-clinica
vercel deploy --prod
```

Vercel te hará dos preguntas:
- ¿Nombre del proyecto? → escribe algo como `chatbot-clinica`
- ¿Directorio raíz? → pulsa Enter (usa el actual)

Al finalizar te dará una URL tipo:
```
https://chatbot-clinica.vercel.app
```
Esa es la URL de tu servidor. Apúntala.

---

## Paso 4 — Añadir la API key como variable de entorno (IMPORTANTE)

En Vercel, la API key se guarda de forma privada:

1. Ve a https://vercel.com → tu proyecto → "Settings" → "Environment Variables"
2. Añade:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-xxxxxxxxxxxx` (tu key)
   - **Environment:** Production ✓
3. Pulsa "Save"
4. Haz un nuevo deploy para que se aplique:
   ```
   vercel deploy --prod
   ```

La API key NUNCA aparece en el código. Solo vive en Vercel.

---

## Paso 5 — Personalizar para cada cliente

Abre `public/widget.html` y edita el bloque CONFIG:

```javascript
const CONFIG = {
  // Pon la URL de tu servidor Vercel (la misma para TODOS los clientes)
  apiUrl: "https://chatbot-clinica.vercel.app/api/chat",

  // Cambia esto por la info real de cada clínica
  systemPrompt: `Eres la asistente de NOMBRE_CLINICA...
  Tratamientos: ...
  Precios: ...
  Horarios: ...`
};
```

El servidor (`api/chat.js`) es tuyo y no cambia nunca.
Solo cambia el widget HTML por cliente.

---

## Paso 6 — Instalar en la web del cliente

**Opción A — Incrustar en su web existente (recomendado)**

Copia el bloque del widget (botón + ventana + script) y pégalo justo antes del `</body>` en el HTML de su web. Su webmaster lo hace en 5 minutos.

**Opción B — Página independiente**

Si no tienen web o prefieren un enlace directo, súbeles el `widget.html` a su hosting. Pueden enlazarlo desde Instagram, WhatsApp, etc.

**Opción C — iFrame**

```html
<iframe src="https://chatbot-clinica.vercel.app/widget.html"
        style="position:fixed;bottom:0;right:0;width:400px;height:600px;border:none;z-index:9999">
</iframe>
```

---

## Costes reales por cliente

| Concepto | Coste real tuyo |
|---|---|
| Servidor Vercel | Gratis (plan hobby) |
| API Anthropic (clínica pequeña, ~500 consultas/mes) | ~1–3 €/mes |
| Total coste real | ~1–3 €/mes |
| Lo que cobras al cliente | 89 €/mes |
| **Margen** | **~86–88 €/mes por cliente** |

Con 10 clientes → ~860 €/mes recurrentes con mínimo mantenimiento.

---

## Seguridad — checklist

- [ ] La API key solo está en Vercel Environment Variables, nunca en el código
- [ ] El archivo `api/chat.js` no se ejecuta en el navegador, solo en el servidor
- [ ] Si quieres limitar qué dominios pueden usar tu servidor, cambia en `chat.js`:
  ```javascript
  res.setHeader("Access-Control-Allow-Origin", "https://clinicadelcliente.com");
  ```

---

## Soporte

¿Dudas técnicas? Abre una consulta en:
- Documentación Vercel: https://vercel.com/docs
- Documentación Anthropic: https://docs.anthropic.com
