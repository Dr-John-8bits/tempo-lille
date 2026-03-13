# Sécurité

Tempo Lille est une webapp statique (sans backend applicatif), mais des risques existent quand même:
- consommation de données externes,
- manipulation du DOM,
- dépendances chargées via CDN.

## Signaler une vulnérabilité
Merci de privilégier un signalement responsable:
- Via l'onglet Security (advisory privée) si disponible.
- Ou par contact direct avec le mainteneur.

Merci d'inclure:
- contexte (page/fichier concerné),
- étapes de reproduction,
- impact potentiel,
- proposition de correction si possible.

## Engagement de traitement
- Accusé de réception visé sous 72 heures.
- Correctif ou plan de mitigation communiqué dès validation.
- Divulgation publique après disponibilité du correctif.

## Bonnes pratiques en place
- Échappement/sanitation des contenus dynamiques.
- Ajout d'attributs `integrity` sur les assets CDN critiques.
- Relecture manuelle des changements UI/JS avant publication.
