# Tempo Lille

Portail personnel de mini-webapps urbaines pour Lille, pensé mobile-first, lisible et rapide.

## Démo
- [https://dr-john-8bits.github.io/tempo-lille/](https://dr-john-8bits.github.io/tempo-lille/)

## Applications actives
- **Vite un V'Lille !** (`ViteVlille.html`): disponibilité des vélos et places en temps réel, favoris, recherche, géolocalisation.
- **Métro Ilévia** (`metroilevia.html`): état M1/M2 à partir des perturbations open data MEL.
- **Air de Lille** (`airdelille.html`): météo + qualité de l'air (EAQI), pluie dans l'heure, recommandations contextuelles.

## Expérience UX
- Design premium et uniforme entre pages.
- Responsive web design, mobile-first.
- Dark mode automatique (préférence système).
- Navigation cohérente et ergonomique (menu principal + interactions tactiles).
- Accessibilité de base: hiérarchie sémantique, focus visible, labels ARIA utiles.

## Stack technique
- HTML, CSS, JavaScript (vanilla)
- Bootstrap 5 (CDN)
- Icônes Bootstrap Icons / Font Awesome (selon pages)
- Données temps réel via APIs open data

## Structure du projet
- `index.html` - portail principal
- `ViteVlille.html` - app V'Lille
- `metroilevia.html` - app métro
- `airdelille.html` - app météo/air
- `assets/tempo-ux.css` - design system commun
- `assets/tempo-common.js` - logique commune (thème + navigation)
- `citiz.html` - page existante non prioritaire actuellement
- `parcels.html` - page existante non prioritaire actuellement
- `OLD*.html` - versions historiques conservées

## Lancer en local
1. Depuis le dossier du projet:
   - `python3 -m http.server`
2. Ouvrir:
   - `http://localhost:8000`

Aucune étape de build n'est nécessaire.

## Déploiement GitHub Pages
1. Aller dans **Settings > Pages** du dépôt GitHub.
2. Choisir **Deploy from a branch**.
3. Sélectionner la branche (`main`) et le dossier (`/root`).

## Sources de données
- V'Lille (GBFS Ilévia)
- Open Data MEL (perturbations Ilévia)
- Open-Meteo (météo + qualité de l'air)

## Confidentialité et limites
- Pas de backend applicatif.
- Pas de suivi utilisateur côté serveur.
- Les favoris restent côté navigateur (`localStorage`).
- Les données open data peuvent être incomplètes ou temporairement indisponibles.

## Contribuer
Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Sécurité
Voir [SECURITY.md](SECURITY.md).

## Licence
Ce projet est sous licence **CC BY-SA 4.0**.
Voir [LICENSE.md](LICENSE.md).

## Crédits
Voir [CREDITS.md](CREDITS.md).
