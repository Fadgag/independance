// Augmentation des types Next.js pour supporter la propriété `auth`
// Injectée par le middleware `auth()` (next-auth v5).
// Nous gardons un type conservateur (Record<string, unknown> | null) —
// l'objectif est d'éviter les casts non sûrs dans l'application.
declare module 'next/server' {
  interface NextRequest {
    /**
     * Claim d'authentification injecté par next-auth v5 middleware.
     * Optionnel (nullable) : le runtime peut ne pas l'ajouter sur les requêtes publiques.
     */
    auth?: Record<string, unknown> | null
  }
}

