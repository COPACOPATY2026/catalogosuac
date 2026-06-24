# Catálogo de Servicios · Alcaldía Cuauhtémoc 2021

Sitio web estático con el catálogo completo de 161 servicios de la Alcaldía Cuauhtémoc.

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Página principal (single-file, todo el UI y lógica) |
| `services-data.js` | Base de datos de 161 servicios + 16 áreas |
| `vercel.json` | Configuración de despliegue para Vercel |

## Despliegue en Vercel (5 pasos)

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Catalogo servicios Alcaldia Cuauhtemoc 2021"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/catalogo-cuauhtemoc.git
git push -u origin main
```

### 2. Desplegar en Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio de GitHub
3. Framework Preset: **Other** (ninguno)
4. Click **Deploy**

El sitio quedará disponible en `https://catalogo-cuauhtemoc.vercel.app` (o el nombre que elijas).

### 3. Dominio personalizado (opcional)

En Vercel → Settings → Domains → agregar tu dominio.

## KPIs del catálogo

- **161 servicios** totales
- **156 tramitables vía CESAC/SUAC**
- **5 solo con dependencia directa**
- **114 con escrito libre**
- **6 requieren formato oficial**
- **16 dependencias** (8 centrales + 8 territoriales)
- Tiempo mínimo: **20 días hábiles** | Promedio: **~40 d.h.** | Máximo: **45 d.h.**

## CESAC

- Aldama y Mina s/n, Col. Buenavista, Alc. Cuauhtémoc
- Lunes–Viernes 09:00–14:00 hrs
- cesac@alcaldiacuauhtemoc.mx
- SUAC: https://atencionciudadana.cdmx.gob.mx/
