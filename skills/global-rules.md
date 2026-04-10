# 🌍 Global Coding Standards (Universal)

Toute modification de code effectuée par un agent (Builder, AutoFixer, ou autre) DOIT respecter ces règles.

## 🛑 Règle d'Or : Type Safety (Zéro Compromis)
- **Interdiction du `any` :** L'usage de `any` est strictement interdit. Si un type est complexe, utilise les types générés par Prisma ou crée une interface dédiée dans `@/types/`.
- **Interdiction du `unknown` :** Sauf pour la capture d'erreurs (`catch (err: unknown)`), le type `unknown` doit être réduit (narrowing) immédiatement via un type guard ou un schéma Zod.
- **Type Casting :** Le mot-clé `as` ne doit être utilisé qu'en dernier recours et doit être documenté par un commentaire `// RAISON: ...`.

## 🛡️ Sécurité & Data Isolation
- **Organization Scoping :** Aucune donnée ne doit être lue ou écrite sans vérifier l'appartenance à `session.organizationId`.
- **Zod Validation :** Toute donnée provenant de l'extérieur (API Request, SearchParams) doit être validée par un schéma Zod avant traitement.

## 🧪 Intégrité des Tests
- **Non-Régression :** Aucun agent n'a le droit de modifier un test existant pour faire passer son code. Si un test échoue, le code source doit être corrigé, pas le test.
- **Atomicité :** Les opérations sur les compteurs ou les stocks doivent utiliser des transactions Prisma ou des opérations atomiques.

## 🧹 Propreté du Code
- **Pas de Logs de Debug :** Supprimer tous les `console.log` avant de finaliser.
- **Imports :** Nettoyer les imports inutilisés (`pnpm lint --fix`).
- 
## 🔒 Git & Push Policy
- **Pas de push automatique :** Aucun agent ne doit effectuer de `git push` vers un remote sans confirmation explicite de l'utilisateur. Les étapes minimales avant push sont :
  1. créer une branche dédiée (ex: `feature/xxx` ou `fix/yyy`),
  2. produire un résumé des changements (changelog),
  3. demander la validation humaine `GO` avant d'exécuter `git push`.
  
## 🛡️ Proxy & Sécurité (Nouveau Standard Next.js 16)

> ⚠️ **Breaking Change Next.js 16** — La convention du fichier middleware a changé.

- **Convention :** Le fichier `middleware.ts` est **PROSCRIT** en Next.js 16. Le fichier de middleware s'appelle désormais **`src/proxy.ts`** (ou `proxy.ts` à la racine selon la config `src/`).
- **Ne JAMAIS créer les deux en même temps :** Si `src/middleware.ts` ET `src/proxy.ts` coexistent, Next.js 16 lève une erreur de build fatale :
  ```
  Error: Both middleware file "./src/middleware.ts" and proxy file "./src/proxy.ts" are detected. Please use "./src/proxy.ts" only.
  ```
- **Typage Auth :** Dans `proxy.ts`, utiliser `NextAuthRequest` (importé de `'next-auth'`) et NON `NextRequest` de `'next/server'`. `NextAuthRequest` étend `NextRequest` avec `auth: Session | null`.
- **Rôle du Proxy :**
  1. Intercepter la session via `req.auth`.
  2. Rediriger vers `/auth/signin` si non authentifié (hors pages `/auth/*`).
  3. Valider l'authentification avant d'atteindre les Server Components.
- **Interdiction :** Ne jamais implémenter de logique de redirection complexe dans le code métier si elle peut être gérée au niveau de `proxy.ts`.
