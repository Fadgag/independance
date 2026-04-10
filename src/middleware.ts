// Point d'entrée Next.js pour le middleware d'authentification.
// Next.js exige que ce fichier s'appelle exactement `middleware.ts` (src/ ou racine).
// La logique est centralisée dans `src/proxy.ts` pour la clarté.
export { middleware as default, config } from './proxy'

