# Contribuer à Tempo Lille

Merci pour ton aide.
Le projet est volontairement simple: webapp statique, sans build, avec une priorité mobile-first.

## Stack
- HTML + CSS + JavaScript (vanilla)
- Bootstrap 5 (CDN)
- Données open data (APIs externes)

## Lancer en local
1. Ouvrir le dossier du projet.
2. Lancer un serveur statique:
   - `python3 -m http.server`
3. Ouvrir `http://localhost:8000`.

Aucune étape de compilation n'est nécessaire.

## Principes techniques
- Priorité mobile-first.
- Accessibilité de base obligatoire (`h1`, focus visible, labels/ARIA utiles).
- Conserver la cohérence visuelle entre pages via:
  - `assets/tempo-ux.css`
  - `assets/tempo-common.js`
- Éviter les dépendances supplémentaires non indispensables.

## Conventions de contribution
- Garder les changements petits et ciblés.
- Mettre à jour la documentation (`README.md`, etc.) si le comportement change.
- Préférer des noms explicites et un code lisible.

## Commits
Utiliser de préférence les Conventional Commits:
- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `chore:`

## Vérifications minimales avant PR
- Test mobile (petite largeur + navigation tactile).
- Test desktop.
- Test dark mode auto.
- Test sans géolocalisation (permission refusée).
- Vérification des erreurs console sur les pages modifiées.

Merci.
