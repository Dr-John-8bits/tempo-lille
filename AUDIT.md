# Audit Tempo Lille — V'Lille

> Audit mobile-first complet (code, performance, UX, accessibilité, robustesse, direction artistique).
> Méthode : analyse multi-agents par dimension + passe de vérification adverse contre le code réel.
> Contrainte respectée partout : **aucune étape de build** (fichiers statiques, GitHub Pages).

## Verdict

L'app **fonctionne et est plus soignée que la moyenne d'un projet perso** (gestion d'erreurs GBFS, fallback de stockage, dark mode, pull-to-refresh, géocodage d'adresse). Mais trois problèmes structurels la rendent lourde, incohérente et pas vraiment mobile-first :

1. **~245 Ko de dépendances tierces quasi inutilisées** (Bootstrap CSS + JS + Bootstrap Icons) pour une page qui n'en exploite presque rien.
2. **Deux systèmes de design qui se chevauchent** (`<style>` inline d'`index.html` ~945 lignes vs `tempo-ux.css`), avec ~165 couleurs codées en dur → dark mode dupliqué à la main, évolution pénible, rendu « cheap ».
3. **Pas réellement mobile-first** : ~300–360 px de chrome non-actionnable avant la 1re station, une barre de navigation morte sur mobile, et une vue par défaut (Favoris) vide pour le besoin n°1 (« un vélo dispo proche, vite »).

Tout est corrigeable sans build. Gains attendus : **-200 Ko et un démarrage nettement plus rapide**, un code deux fois plus court à maintenir, et une interface plus lisible et plus moderne.

---

## Plan d'action priorisé

### P0 — Quick wins (gros gain, faible risque, ~1 demi-journée)
| # | Action | Gain | Effort |
|---|--------|------|--------|
| 1 | Supprimer le bundle JS Bootstrap (mort : aucun `data-bs-*`, navbar sans toggler) | -24 Ko gzip + parsing | S |
| 2 | Supprimer Bootstrap Icons (police ~130 Ko pour 3 icônes) → SVG inline / Bootstrap Icons en SVG | -143 Ko transfert | S |
| 3 | Pause de l'auto-refresh quand l'onglet est caché (`visibilitychange`) | data + batterie | S |
| 4 | Vue par défaut = Favoris **seulement si favoris existants**, sinon flux « autour de moi » | UX | S |
| 5 | `.star` favori ≥ 44 px sur toutes tailles mobiles (actuellement 33 px de 481→820 px) | tap | S |
| 6 | Remplacer les `alert()` géoloc par un message inline non bloquant | UX + a11y | S |

### P1 — Structurel (le cœur de la refonte)
| # | Action | Gain | Effort |
|---|--------|------|--------|
| 7 | **Unifier les tokens CSS** (une seule source dans `tempo-ux.css`), supprimer le `:root` + dark inline | maintenabilité | M |
| 8 | **Remplacer les ~165 hex par des tokens** → supprime ~160 lignes de surcharge dark | -150 lignes | L |
| 9 | Retirer Bootstrap CSS, réimplémenter les ~10 classes utilisées en CSS natif | -31 Ko gzip | M |
| 10 | Réduire le chrome haut : fusionner navbar + hero, déplacer « Trier », supprimer la sous-nav morte | mobile-first | M |
| 11 | Refondre la liste station en mode compact (5–6 stations/écran) | lisibilité | M |
| 12 | Navigation clavier des suggestions (recherche + adresse) + ARIA combobox | a11y bloquant | M |
| 13 | Externaliser le CSS et découper le JS (modules ES, sans bundler) | maintenabilité + cache | L |

### P2 — Polish & robustesse
| # | Action | Effort |
|---|--------|--------|
| 14 | Diff des cartes/marqueurs au lieu de tout reconstruire à chaque tick | L |
| 15 | Service worker + manifest (PWA installable, offline) | M |
| 16 | Backoff sur échecs GBFS répétés + verrou anti-concurrence sur `fetchStations` | M |
| 17 | Indicateur de données périmées (comparer `last_updated` GBFS, pas l'heure client) | M |
| 18 | `theme-color` light/dark, contraste des 2 textes muted limites, focus au changement de vue | S |

---

## 1. Performance & poids

**~245 Ko de tiers sur le chemin critique, dont la majorité inutile.**

- **JS Bootstrap mort** (`index.html:2346`, appel `:2348`) — `bindMobileNavCollapse` cible `#tlNav.show` qui n'existe jamais (navbar sans toggler ni `.collapse`, aucun `data-bs-*`). ~24 Ko gzip à supprimer. **[majeur, S]**
- **Bootstrap Icons** (`index.html:26`) — CSS ~13,6 Ko + police WOFF2 ~130 Ko pour **3 glyphes** (`bi-bicycle`, `bi-buildings`, `bi-search`). À supprimer entièrement. **[majeur, S]**
- **Bootstrap CSS** (`index.html:25`) — ~31 Ko gzip pour ~10 classes (`navbar*`, `container`, `btn*`, `form-control*`, `visually-hidden`, quelques utilitaires flex/espacement), déjà largement réécrites par `tempo-ux.css`. Réimplémenter en natif. **[moyen, M]**
- **`render()` reconstruit ~290 cartes DOM** (`innerHTML=''` + `createElement`) à **chaque tick 60 s, chaque frappe de recherche et chaque toggle favori** (`index.html:1877-1956`, appels depuis `fetchStations`, `onSearchInput` ×2, toggle, etc.). Débrancher du keystroke (debounce), ne re-rendre que la liste concernée, et **differ** au tick (Map `id→élément`). **[majeur, L]**
- **`renderMap()` détruit/recrée tous les marqueurs Leaflet** à chaque render (`:1745-1773`), et la condition `state.currentView==='map' || state.map` (`:1953`) fait tourner ça **toutes les 60 s même hors vue carte** une fois la carte ouverte. Diff par `id`, et ne rendre que si la vue carte est active. **[majeur, L]**
- **Polling 60 s en arrière-plan** (`setInterval`, `:2176`) — aucun `visibilitychange`. Pause sur `document.hidden`, refetch au retour. **[moyen → S]**
- **Aucun cache / SW / manifest** alors que les meta PWA sont présentes (`:22-24`). SW minimal cache-first sur le shell + network-first GBFS. **[moyen, M]**
- **`updateHeaderHeight()` force un reflow à chaque `render()`** (`:1487-1493`, appel `:1954`). Le sortir de `render()` (resize/orientationchange seulement). **[mineur, S]**
- **Google Fonts** (Sora + Nunito Sans, 7 graisses, render-blocking, `:18`) — `display=swap` déjà présent ; self-host les WOFF2 pour cacheabilité (Nunito **est** bien utilisée pour le corps — ne pas l'élaguer). **[mineur, S]**

## 2. UX mobile-first

- **Sous-nav `.tl-subnav` morte sur mobile** mais toujours dans le DOM (`display:none` <820 px, `index.html:768-771`). Elle porte le seul bouton « Autour de moi » (`#subNear`) et un 2e champ recherche synchronisé à la main avec `#search`. Sur mobile, l'unique nav doit être la barre du bas → supprimer la sous-nav, migrer « Autour de moi », unifier la recherche. **[majeur, M]**
- **~300–360 px de chrome avant la 1re station** : navbar (titre répété) + hero volumineux (logo + titre ×2 + sous-titre décoratif + bouton 3,3 rem) + carte « Trier » pleine largeur + label « MES FAVORIS ». Compacter en une barre unique. **[majeur, M]**
- **Vue par défaut = Favoris vide** (`:1043`, `:2339`) à contre-emploi du job principal. → Favoris si favoris existants, sinon proximité/CTA d'action ; tenter une géoloc silencieuse si permission déjà accordée (`navigator.permissions.query`). **[majeur, M]**
- **Triple déclencheur géoloc** (hero `#heroLocateBtn`, sous-nav `#subNear` mort, carte `#heroMapLocateBtn`) ; la **barre du bas n'a aucun accès géoloc**. Un seul affordance clair, présent en liste ET carte. **[moyen, M]**
- **Cibles tactiles** : `.star` à 2,05 rem (~33 px) entre 481–820 px (`:351-361`), `.map-address-clear` à 2 rem. Passer ≥ 44 px partout. **[majeur, S]**
- **Ordre des onglets** : « Carte » au centre (zone pouce) au lieu de l'action prioritaire ; aucun onglet « Proche ». Icônes emoji incohérentes. Repenser : Proche / Carte / Favoris + `aria-current`. **[moyen, M]**
- **Empilement sticky fragile** : navbar sticky + `.search` sticky calée sur `--header-h` recalculé en JS à chaque render. Simplifier en sticky CSS pur. **[moyen, M]**
- **Densité des cartes** : une carte fait 150–180 px (titre 2 lignes + adresse + badges + 2 métriques 3,35 rem + timestamp redondant avec le « Live » global) → ~3-4 stations/écran. Viser une carte compacte, 5–6/écran, timestamp retiré. **[moyen, M]**
- **Parcours « plus proche dispo »** : `alert()` bloquant en cas de refus/échec, pas de spinner pendant l'acquisition GPS, pas de repli adresse depuis la liste. **[moyen, M]**

## 3. Code & architecture

- **Deux jeux de tokens `:root` concurrents** (`index.html:30-49` vs `tempo-ux.css:1-44`), reliés partiellement par `.tempo-vlille` (`:309-326`). La valeur effective d'une couleur dépend de 3 fichiers de cascade. → une seule source. **[majeur, M]**
- **~165 couleurs hex en dur** dans le `<style>` (`:186-972`) → bloc dark manuel de ~160 lignes (`:813-972`) à maintenir en double. Tokeniser supprime ~150 lignes. **[majeur, L]**
- **CSS mort** (jamais rendu) : `.bar`, `.title`, `.spacer`, `.logoBike`, `.seg`, `.filters`, `.stats`, `.chip`, `.station-name`, `.actions`, et dans `tempo-ux.css` les sections `.tempo-home` (`:256-307`) et `.tempo-air` (`:413-464`) qui ciblent d'autres pages. *(Vérif : `.btn`, `.pill`, `.map-near-chip` sont, eux, bien utilisés — à conserver.)* **[moyen, M]**
- **Règles CSS dupliquées** : `.nearby h2` (`:96` & `:466`), `.bottom-bar .wrap` (`:164` & `:754`), `.item/.icon/.label` scindées. Fusionner. **[moyen, S]**
- **Logique tri/filtre éclatée** en 4 fonctions mutuellement récursives (`applyFilter`/`setFilter`/`setSortMode`/`setDisplayMode`, `:1330-1413`) sur 3 champs d'état (`filter`/`sort`/`sortAuto`) ; `sortSelect.value` repositionné à 4 endroits. → un seul `state.displayMode`. **[majeur, L]**
- **Recherche dupliquée** `#search`/`#subSearch` synchronisée par dispatch d'`Event('input')` (`:2359-2367`, sync inverse `:1892`/`:2209`). → une seule source `state.query`. **[moyen, M]**
- **`index.html` monolithique** (~2371 lignes : ~945 CSS + ~1220 JS en IIFE). Externaliser le CSS (cacheable) + découper le JS en modules ES (`type="module"`, natif GitHub Pages). **[moyen, L]**
- **État global mutable** (24 champs dont 12 `map*`) + globals `window.requestVLilleLocation` + checks `typeof setView` entre `<script>`. Regrouper `state.map`, exposer une API unique. **[moyen, M]**
- **fetch adresse réimplémente `fetchJson`** sans le réutiliser, avec **double mécanisme d'annulation** (token + AbortController) (`:1608-1636`). Factoriser. **[mineur, S]**
- **Versions de build en triple** (footer `:1100` + `APP_VERSION`/`BUILD_LABEL` `:1127-1128` jamais consommés). Source unique ou suppression. **[mineur, S]**

## 4. Accessibilité (WCAG 2.1 AA)

Base honnête (skip-link, `focus-visible` 3px, `prefers-reduced-motion` géré, labels selects, `aria-pressed` favoris, live regions). Lacunes :

- **Suggestions inaccessibles au clavier** — `mousedown` uniquement (`:2228`, `:2278`), aucun `keydown` : impossible de sélectionner une suggestion au clavier. **WCAG 2.1.1, bloquant.** Ajouter Flèches/Entrée/Échap + `click`. **[critique, M]**
- **`role=listbox` sans pattern combobox** : inputs sans `role=combobox`/`aria-expanded`/`aria-controls`/`aria-activedescendant`, `<li>` sans `id`/`aria-selected`. **WCAG 4.1.2.** **[majeur, M]**
- **`alert()` géoloc** (`:1856`, `:1872`) — vole le focus, non stylé, annonce AT non garantie, pas de distinction refus/timeout. Réutiliser `#errorBanner` (`role=status`). **[majeur, S]**
- **Changement de vue** : focus non déplacé (sauf browse), état actif visuel seulement (pas d'`aria-current`) (`setView :2077-2101`). Donner le focus au `<h2>` de la vue (`tabindex=-1`) + `aria-current`. **[majeur, M]**
- **Liste résultats** : `aria-live` sur `#allList` reconstruit entièrement = annonces chaotiques ; déplacer le live sur `#browseMeta` (compteur). **[moyen, S]**
- **Emojis porteurs de sens** sans `aria-hidden` (icônes bottom-bar `:1106/1110/1114`, 🚲/🅿️ `:2025/2048`, flèches ↑↓ `:2038/2061`). **[moyen, S]**
- **Contraste limite** : `.station-updated` `#617799` (4,28–4,56:1 selon le dégradé, `:463`) et `#5e7698` (4,48:1 sur `#f9fbff`, `:564/570`). Unifier sur `--tempo-text-muted` (#4c6685, 5,92:1). **[moyen, S]**
- **Carte Leaflet** sans équivalent textuel permanent ni focus marqueurs fiable. **[moyen, M]**
- **Hiérarchie** : « À proximité » est un `<h2>` frère du `<h2>` de la vue (devrait être `<h3>`, `:1047`) ; lien footer `target=_blank` sans indice « nouvel onglet ». **[mineur, S]**

## 5. Robustesse & données

Bon socle (`fetchJson` timeout/HTTP/JSON, flux GBFS manquants détectés, `escapeHtml` sur name/address/label, majorité en `textContent`). Trous :

- **Auto-refresh non suspendu onglet caché** → ~90 requêtes inutiles après 30 min en arrière-plan. `visibilitychange`. **[majeur → S]**
- **Aucun backoff** sur échecs GBFS répétés (intervalle fixe 60 s) → martèle le réseau en tunnel/serveur down. Backoff exponentiel plafonné + `setTimeout` récursif. **[moyen, M]**
- **Géoloc `alert()` sans `err.code`** + `enableHighAccuracy` timeout 8 s (échoue souvent en intérieur), pas de feedback de chargement. **[majeur, M]**
- **fetch géocodage sans timeout** (`:1620`) → requête pendante possible, slot AbortController bloqué. Ajouter un timeout comme `fetchJson`. **[moyen, S]**
- **Pas de détection de données périmées** : « Live HH:MM » = heure du fetch client, pas `last_updated` GBFS (lu mais seulement par carte, `:2131-2160`). Flux figé = paraît frais. Comparer à `Date.now()`. **[moyen, M]**
- **Injection numérique non échappée** dans le `divIcon`/popups (`:1756`, `:1678-1679`, `:1766`) — risque nul aujourd'hui (`Number()` forcé) mais incohérence de convention. `Number()|0` ou `textContent`. **[mineur, S]**
- **Favoris** : `new Set(readJSON(...))` sans validation de type (`:1213`) ; IDs orphelins jamais purgés (gonflent le compteur). Valider Array + purge prudente. **[mineur, S]**
- **`fetchStations` sans verrou de concurrence** (PTR + tick + init peuvent se chevaucher, dernier arrivé écrase, `:2158`). Drapeau `inFlight` ou AbortController partagé. **[mineur, S]**
- **Timer de blur des suggestions jamais annulé** + sélection par `mousedown` fragile sur tactile iOS (`:2236`, `:2275`). Préférer `pointerdown`/`focusout`. **[mineur, S]**

## 6. Direction artistique

### Pourquoi l'actuelle paraît « cheap » (3 causes cumulées)
1. **Surcharge de dégradés bleus** partout (fond de page double, hero, cartes, pills, contrôles, shell carte, pins) → monochromie pâle sans hiérarchie (`index.html:224-227`, `:230`, `:270`, `:314`, `:343`, `:477` + `tempo-ux.css:5-8`). En prime, **deux fonds de page se cumulent** (`body.tempo-vlille` inline + `.tempo-app` de `tempo-ux.css`).
2. **Barre dégradée décorative en haut de chaque carte** (`tempo-ux.css:376-386`) → effet « template bricolé ».
3. **3 registres d'icônes** : emojis (⭐📍🗺️🔍🚲🅿️), Bootstrap Icons (`bi-*`), et caractères ★/☆ (`:1972`) → l'incohérence la plus visible sur mobile.
4. **Rayons (de .58 rem à 22 px), ombres (6 opacités navy + halos bleus/verts) et bordures bleues (6 opacités) hétérogènes** → patchwork « plastique ».
5. **Couleurs sémantiques (dispo/faible/vide) noyées** dans le bleu de marque → l'utilisateur doit lire les chiffres au lieu de scanner les couleurs.

### Concept proposé — « tableau de bord calme, données-first »
Interface **neutre et plate** (esprit transport / Citymapper sobre). La **seule couleur forte = l'état de disponibilité** (vert/orange/rouge). Le **bleu de marque devient un accent discret** (navigation, focus, liens). Surfaces mates, bords nets, ombres quasi invisibles, gros chiffres tabulaires lisibles au pouce en plein soleil. **Zéro emoji**, **un seul jeu d'icônes** (Bootstrap Icons en SVG, monochromes, `currentColor`).

### Tokens CSS (source unique, à coller dans `tempo-ux.css`)

```css
:root{
  /* neutres */
  --bg:#F7F8FA; --surface:#FFFFFF; --surface-2:#F1F3F6;
  --border:#E4E7EC; --border-strong:#D0D5DD;
  --text:#16202E; --text-muted:#5B6675; --text-faint:#8A93A2;
  /* accent marque (nav/focus/liens uniquement) */
  --accent:#1F5FE0; --accent-hover:#1A52C4; --accent-soft:#E8F0FF;
  /* sémantique disponibilité */
  --ok:#15803D; --ok-soft:#E7F6EC; --ok-border:#A7E0BB;
  --warn:#B45309; --warn-soft:#FCF1DE; --warn-border:#F3CE8E;
  --bad:#C2342B; --bad-soft:#FBEAE8; --bad-border:#F0B4AE;
  --fav:#EAB308;
  /* typo */
  --font-heading:"Sora",system-ui,sans-serif;
  --font-body:"Nunito Sans",system-ui,sans-serif;
  --fs-xs:.75rem; --fs-sm:.8125rem; --fs-base:.9375rem; --fs-md:1rem;
  --fs-lg:1.125rem; --fs-xl:1.375rem; --fs-2xl:1.75rem;
  /* espacement (échelle 4px) */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:20px; --sp-6:24px; --sp-8:32px;
  /* rayons */
  --radius-sm:8px; --radius-md:12px; --radius-lg:16px; --radius-pill:999px;
  /* ombres neutres */
  --shadow-xs:0 1px 2px rgba(16,24,40,.05);
  --shadow-sm:0 1px 3px rgba(16,24,40,.06),0 1px 2px rgba(16,24,40,.04);
  --shadow-md:0 4px 12px rgba(16,24,40,.08);
  --content-max:680px;
}
html[data-theme="dark"]{
  --bg:#0E1116; --surface:#161A21; --surface-2:#1C212B;
  --border:#2A313D; --border-strong:#3A434F;
  --text:#E7ECF3; --text-muted:#A4AEBD; --text-faint:#6E7888;
  --accent:#5B9BFF; --accent-hover:#79AEFF; --accent-soft:rgba(91,155,255,.16);
  --ok:#4ADE80; --ok-soft:#16301F; --ok-border:#2E5C3C;
  --warn:#FBBF24; --warn-soft:#3A2E14; --warn-border:#6B5223;
  --bad:#F87171; --bad-soft:#3A1D1D; --bad-border:#6B3232;
  --fav:#FACC15;
  --shadow-xs:0 1px 2px rgba(0,0,0,.3);
  --shadow-sm:0 1px 3px rgba(0,0,0,.35),0 1px 2px rgba(0,0,0,.25);
  --shadow-md:0 6px 16px rgba(0,0,0,.4);
}
/* Règle d'or : plus aucune règle ne contient de hex littéral ni de gradient décoratif — uniquement var(--…). */
```

### Composants clés
- **Carte station** : surface blanche plate, `border 1px`, `--radius-md`, `--shadow-xs`. **Supprimer le `::before` dégradé.** Liseré gauche coloré 3 px **uniquement** si état critique (vide/plein).
- **Métriques vélos/places** : 2 blocs, fond = couleur sémantique soft, icône `currentColor`, **gros chiffre Sora 1,75 rem tabular-nums**. La couleur du bloc EST l'information.
- **Barre de navigation basse** : fond surface + blur, 3 items icône + label ; item actif = accent + pastille `accent-soft` (pas de fond plein criard). Tap ≥ 56 px.
- **Épingles carte** : pastille ronde aplat sémantique plein, chiffre blanc, bordure blanche 2 px, ombre neutre. Favori = anneau jaune. Utilisateur = un seul halo atténué.
- **Hero/en-tête** : bandeau neutre (pas de dégradé), logo carré `accent-soft` + icône, pill « Live HH:MM » avec point vert discret, CTA proximité = bouton accent plein pleine largeur.
- **Icônes** : Bootstrap Icons (SVG) — `bi-star(-fill)`, `bi-geo-alt`, `bi-map`, `bi-search`, `bi-bicycle`, `bi-p-square`, `bi-clock`, `bi-exclamation-triangle`, `bi-arrow-clockwise`, `bi-caret-up/down-fill`.
- **Motion** : transitions 120–160 ms ; flèches de tendance → `bi-caret` colorés + léger fondu de fond sémantique au refresh ; skeleton neutre au chargement.
- **Système** : 2 `<meta theme-color>` light/dark alignées sur `--bg`.

---

## Annexe — corrections de la passe de vérification (faux positifs écartés)
- `.btn` et `.pill` ne sont **pas** du CSS mort (utilisés sur les boutons sous-nav et `#lastUpdate`).
- Nunito Sans **est** bien la police du corps (le body ne retombe pas sur `system-ui` : `tempo-ux.css` est chargé après le `<style>` inline et gagne la cascade).
- Le sens de l'« écrasement » CSS : c'est `tempo-ux.css` (chargé en dernier, sélecteurs à 2 classes) qui l'emporte, pas l'inline.
- `heroMapLocateBtn` n'est pas un doublon strict du bouton hero (affiché seulement en vue carte) ; le vrai doublon mort est `#subNear`.
- `stationCard` ne pose qu'**1** `addEventListener` (l'étoile), pas 2 ; ~18-22 `createElement` (pas 25).
- Le `display:none <820px` de la sous-nav est dans le `<style>` inline (`:768-771`), pas dans `tempo-ux.css`.
