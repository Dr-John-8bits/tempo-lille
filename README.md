# Tempo Lille

Portail personnel de mini-webapps urbaines (mobile-first) pour Lille : V’Lille, métro Ilévia, qualité de l’air, Citiz, points relais, etc.  
**Démo :** https://dr-john-8bits.github.io/tempo-lille/ (GitHub Pages)

## Sommaire
- [Fonctionnalités](#fonctionnalités)
- [Aperçu](#aperçu)
- [Lancer en local](#lancer-en-local)
- [Déployer sur GitHub Pages](#déployer-sur-github-pages)
- [Structure du dépôt](#structure-du-dépôt)
- [Sources de données](#sources-de-données)
- [Confidentialité & limites](#confidentialité--limites)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Fonctionnalités
- Mobile-first, dark mode auto (selon l’OS).
- Apps statiques, sans backend : HTML/Bootstrap + JS.
- Géoloc (si autorisée), favoris, pull-to-refresh, etc.

## Aperçu
- **Vite un V’Lille !** — stations, vélos/places en temps quasi réel.
- **Métro Ilévia** — état des lignes M1/M2.
- **Air de Lille** — EAQI + pluie, températures (Open-Meteo).
- **Vite un Citiz !** — dispo des voitures Citiz HDF (GBFS).
- **Points Relais** — lockers/pickups via OpenStreetMap (Overpass).

## Lancer en local
Option simple avec VS Code :
1. Installer l’extension **Live Server**.
2. Ouvrir le repo → clic droit sur `index.html` → **Open with Live Server**.
3. Ou, sans VS Code : `python3 -m http.server` puis http://localhost:8000

_Aucune étape de build nécessaire._

## Déployer sur GitHub Pages
1. **Settings → Pages →** Source: **Deploy from a branch**, Branche: `main`, dossier `/root`.
2. Attendre l’URL de démo (quelques minutes).
3. Mettre l’URL ci-dessus dans ce README (section Démo).

## Structure du dépôt
/
├─ index.html # Portail
├─ ViteVlille.html # V'Lille
├─ metroilevia.html # Métro Ilévia
├─ airdelille.html # Qualité de l’air + météo
├─ citiz.html # Citiz (autopartage)
├─ parcels.html # Points relais (OSM/Overpass)
├─ docs/ # (optional) captures, notes
├─ .github/
│ ├─ ISSUE_TEMPLATE/
│ │ ├─ bug_report.yml
│ │ └─ feature_request.yml
│ ├─ PULL_REQUEST_TEMPLATE.md
│ └─ workflows/
│ └─ links.yml # CI: vérif des liens
├─ .editorconfig
├─ .gitignore
├─ LICENSE
└─ CHANGELOG.md


## Sources de données
- **V’Lille (Ilévia GBFS)** via transport.data.gouv.fr  
- **Citiz HDF (GBFS)** via backend Citiz  
- **Qualité de l’air / météo** : Open-Meteo (CAMS/ECMWF)  
- **Points Relais** : Overpass API (OpenStreetMap)

## Confidentialité & limites
- Pas de cookies, pas de tracking. Les favoris restent en local (`localStorage`).
- Données ouvertes = **non garanties**. L’app peut être incomplète/erronée.
- Géolocalisation : facultative, sur l’appareil, non transmise à des tiers.

## Contribuer
Voir [CONTRIBUTING.md](CONTRIBUTING.md).  
Style de commit : **Conventional Commits** (`feat: …`, `fix: …`, `chore: …`).

## Licence

[MIT](LICENSE) — voir le fichier de licence.


## Crédits / Transparence

- **Conception / design :** Dr. John  
- **Développement :** réalisé avec l’aide de ChatGPT (OpenAI), puis ajusté manuellement dans le code.  
- **Hébergement :** GitHub Pages

[![Licence: CC BY-SA 4.0](https://img.shields.io/badge/Licence-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
