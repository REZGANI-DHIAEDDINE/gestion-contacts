# Gestion de contacts (Vue.js 3)

Application Vue 3 + Vite + Vue Router : liste de contacts avec photo, fiche de détail
modifiable, appel (`tel:`), e-mail (`mailto:`), photo via galerie ou caméra.
Les données sont conservées dans le `localStorage` (pas de serveur).

## Prérequis
Node.js 18 ou plus récent (https://nodejs.org).

## Installation et exécution
```bash
npm install
npm run dev
```
Ouvrir http://localhost:5173

Pour tester sur téléphone (même Wi-Fi) : `npm run dev -- --host`, puis ouvrir l'adresse « Network » affichée.
La caméra du navigateur exige HTTPS ou localhost ; sur téléphone, le bouton Caméra utilise l'appareil photo natif via `capture`.

## Pages
| Route | Page |
|---|---|
| /contacts | ListeContacts |
| /contacts/ajouter | DetailContact (nouveau) |
| /contacts/:id | DetailContact (modification) |

## Structure
- `src/composables/useContacts.js` : état partagé + localStorage
- `src/components/ContactItem.vue` : ligne de contact (photo, nom, prénom, téléphone)
- `src/components/CameraModal.vue` : prise de photo par webcam (avec message si indisponible)
- `src/views/` : les deux pages

## Captures d'écran
Voir le dossier `captures/`.
