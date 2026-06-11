# Cashi API v2.0

API REST de finanzas personales con autenticacion JWT y subida de comprobantes a Cloudflare R2.

**URL de produccion:** (se agrega despues del despliegue en Render)

---

## Tecnologias utilizadas

| Herramienta | Rol |
|---|---|
| Node.js + TypeScript | Lenguaje y runtime |
| Hono | Framework web liviano |
| Prisma | ORM para la base de datos |
| PostgreSQL | Base de datos relacional |
| Docker | Levantar la base de datos en desarrollo |
| Zod | Validacion de datos |
| bcryptjs | Hasheo de contrasenas |
| jsonwebtoken | Generacion y verificacion de tokens JWT |
| Cloudflare R2 | Almacenamiento de comprobantes en la nube |
| @aws-sdk/client-s3 | Cliente S3 compatible con R2 |
| Render | Plataforma de despliegue |

---

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | URL de conexion a PostgreSQL |
| `PORT` | Puerto del servidor (default 3000) |
| `JWT_SECRET` | Secreto para firmar los tokens JWT |
| `R2_ENDPOINT` | Endpoint de Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | Access Key ID de R2 |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key de R2 |
| `R2_BUCKET_NAME` | Nombre del bucket de R2 |
| `R2_PUBLIC_URL` | URL publica del bucket de R2 |

Copia `.env.example` a `.env` y completa los valores para desarrollo local.

---

## Instalacion local paso a paso

```bash
npm install
docker compose up -d
npm run db:generate
npm run db:migrate
npm run dev
```

---

## Endpoints

### Autenticacion (publicos)

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| POST | `/auth/register` | Crear cuenta. Devuelve JWT |
| POST | `/auth/login` | Iniciar sesion. Devuelve JWT |

### Rutas protegidas

Todas requieren el header:
```
Authorization: Bearer <token>
```

### Categorias

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| GET | `/categories` | Listar todas |
| GET | `/categories/:id` | Ver detalle |
| POST | `/categories` | Crear |
| PATCH | `/categories/:id` | Editar |
| DELETE | `/categories/:id` | Eliminar |

### Transacciones

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| GET | `/transactions` | Listar las del usuario autenticado |
| GET | `/transactions/balance` | Balance del usuario autenticado |
| GET | `/transactions/:id` | Ver detalle |
| POST | `/transactions` | Crear |
| PATCH | `/transactions/:id` | Editar (solo el dueno) |
| DELETE | `/transactions/:id` | Eliminar (solo el dueno) |
| POST | `/transactions/upload` | Subir comprobante a R2 |

---

## Arquitectura N-Layer

```
src/
├── index.ts                          <- Servidor, middleware aplicado aca
├── middlewares/
│   └── auth.middleware.ts            <- Verifica el JWT
├── routes/
│   ├── auth.routes.ts
│   ├── category.routes.ts
│   └── transaction.routes.ts
├── controllers/
│   ├── auth.controller.ts            <- Hasheo y generacion de token
│   ├── category.controller.ts
│   ├── transaction.controller.ts    <- Balance y ownership check
│   └── upload.controller.ts         <- Subida a Cloudflare R2
├── repositories/
│   ├── auth.repository.ts
│   ├── category.repository.ts
│   └── transaction.repository.ts
├── schemas/
│   ├── auth.schema.ts
│   ├── category.schema.ts
│   └── transaction.schema.ts
└── lib/
    └── prisma.ts
```

---

## Despliegue en Render

1. Crear Web Service conectado al repositorio GitHub
2. Build Command: `npm install && npm run build`
3. Start Command: `npx prisma migrate deploy && node dist/index.js`
4. Configurar todas las variables de entorno en el dashboard de Render

---

## Uso de IA

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) para:
- Generacion de la estructura base del proyecto
- Configuracion de Prisma, JWT, bcrypt, Zod y Cloudflare R2
- Redaccion del README

Todo el codigo fue revisado y comprendido por el equipo.
