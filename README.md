# Tempo Lille

Webapp urbaine mobile-first pour Lille, centrée sur V'Lille et le métro Ilévia.

## Démo
- [https://dr-john-8bits.github.io/tempo-lille/](https://dr-john-8bits.github.io/tempo-lille/)

## Applications actives
- **V'Lille** (`index.html`): disponibilité des vélos et places en temps réel, favoris, recherche, géolocalisation, vue carte OpenStreetMap.
- **Métro Ilévia** (`metroilevia.html`): état M1/M2 à partir des perturbations open data MEL.

## Expérience UX
- Design premium et uniforme entre pages.
- Responsive web design, mobile-first.
- Dark mode automatique (préférence système).
- Navigation cohérente et ergonomique (menu principal + interactions tactiles).
- Accessibilité de base: hiérarchie sémantique, focus visible, labels ARIA utiles.

## Stack technique
- HTML, CSS, JavaScript (vanilla)
- Bootstrap 5 (CDN)
- Icônes Bootstrap Icons
- Leaflet (carte OpenStreetMap)
- Données temps réel via APIs open data

## Structure du projet
- `index.html` - app principale V'Lille
- `ViteVlille.html` - alias de redirection vers `index.html`
- `metroilevia.html` - app métro
- `airdelille.html` - alias de redirection (section météo retirée)
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
- Fond de carte OpenStreetMap (tuiles publiques)

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
