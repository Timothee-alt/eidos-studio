# Feuille de route — niveau Awwwards (Eidos Studio)

Document de référence pour viser **Honorable Mention**, **Site of the Day** ou au-delà. Les jurys Awwwards évaluent surtout **design**, **utilisabilité**, **créativité**, **contenu** et **développement** (y compris performance et détails). Ce n’est pas une garantie de prix : c’est une grille de travail exigeante et vérifiable.

---

## 1. Objectif et critères de réussite

| Objectif | Indicateur concret |
|----------|-------------------|
| **Mémorabilité** | Un visiteur peut décrire *une* chose unique du site en une phrase après 30 secondes. |
| **Cohérence** | Même langage visuel, typo, rythme et ton du hero jusqu’au footer et pages secondaires. |
| **Finition** | Aucun placeholder, aucun faux envoi de formulaire, pas de lien mort, pas d’URL canonique contradictoire. |
| **Inclusivité** | Navigation clavier, focus visible, `prefers-reduced-motion` respecté partout où il y a du mouvement « décoratif ». |
| **Performance** | WebGL et animations justifiées par la charge : pas de GPU chauffé pour un effet remplaçable par du CSS. |

---

## 2. Piliers jury (à traiter en parallèle)

### 2.1 Design & direction artistique

- [X] **Identité différenciante** : sortir du combo « dark + sans géométrique + mono + sphère WebGL » sans abandonner la marque — au moins un choix typographique ou colorimétrique nettement moins « catalogue agence ».
- [X] **Hiérarchie** : une échelle claire titre / sous-titre / corps / légende ; pas de concurrence visuelle entre le hero et les CTA secondaires.
- [X] **Grille & rythme** : espacements et alignements ressentis comme intentionnels sur toutes les largeurs (mobile inclus).
- [X] **Micro-détails** : états hover/focus/active cohérents, transitions courtes et maîtrisées, pas d’effets « par défaut » non assumés.

### 2.2 Créativité & « wow »

- [X] **Un moment signature** : une interaction, une transition ou une narration visuelle *propre au positionnement* (WebGL au service du message, pas seulement en fond).
- [X] **Éviter le remplissage** : marquee de tags, stats sans contexte, manifestes longs — réduire ou remplacer par faits vérifiables et mise en scène.

### 2.3 Contenu & crédibilité

- [ ] **Chiffres sourcés** : Lighthouse, conversions, heures gagnées — méthode en une phrase ou renvoi vers la case détaillée. (plus tard)
- [X] **Moins de répétition** : une seule formulation forte pour l’argument « parlons-en / conversation directe » ; le reste = preuves, processus, résultats.
- [X] **Ton** : français soigné, phrases courtes, jargon technique quand il apporte une info (stack, contraintes), pas pour l’effet.

### 2.4 Utilisabilité (UX)

- [ ] **Parcours principal** : en ≤ 3 interactions depuis l’accueil : contact réel ou prise de rendez-vous / email.
- [ ] **Navigation** : menu, ancres, retour depuis pages services et études de cas — prévisibles, intitulés explicites.
- [ ] **Formulaire** : envoi réel (API, service tiers), messages d’erreur et de succès clairs, pas de simulation.

### 2.5 Accessibilité (a11y)

- [ ] **Landmarks & titres** : conserver / renforcer `main`, `nav`, régions nommées, `h1`–`h3` logiques.
- [ ] **Contraste** : texte gris sur noir validé (WCAG visé : AA minimum sur les textes importants).
- [ ] **Contrôles** : `aria-label` **descriptifs** (ex. nom du service, pas seulement « Aller au service 2 »).
- [ ] **Mouvement** : désactiver ou simplifier scramble, parallaxe, WebGL non essentiel quand `prefers-reduced-motion: reduce`.
- [ ] **Focus** : ordre de tabulation logique, anneau de focus visible sur composants custom et menu.

### 2.6 Développement & performance

- [ ] **WebGL** : lazy load, pause hors viewport / onglet inactif, fallback si contexte perdu, résolution adaptée au DPR.
- [ ] **JavaScript** : chunks critiques minimaux ; pas de double chargement inutile ; dynamic imports là où c’est déjà amorcé (ex. WebGL).
- [ ] **Assets** : images next-gen, polices avec `display: swap`, éviter dépendances tierces non critiques (ex. textures / bruit externes hébergées en local si possible).
- [ ] **SEO technique** : `metadataBase`, Open Graph, canonical alignés sur le **domaine officiel** (pas de divergence deploy Vercel vs domaine prod sans redirect).

### 2.7 Qualité transverse (finition jury)

- [x] **404** : page à la hauteur du reste du site.
- [x] **États de chargement** : skeleton ou transitions qui ne bloquent pas l’accès au contenu textuel.
- [ ] **Cross-browser** : Safari iOS, Chrome Android, Firefox desktop — au minimum sur homepage + une étude de cas.

---

## 3. Plan d’exécution recommandé (phases)

### Phase A — Fondations (bloquant)

1. Formulaire de contact fonctionnel + gestion d’erreurs.
2. Alignement domaine / métadonnées / sitemap / redirections.
3. Audit accessibilité rapide : focus, labels, `aria-*`, reduced motion sur tous les effets « gadgets ».

### Phase B — Différenciation créative

4. Définir **le** moment signature (prototype avant d’étendre partout).
5. Serrer le copy : stats contextualisées, répétitions supprimées.
6. Pages études de cas : variation contrôlée par projet (sans casser la lisibilité).

### Phase C — Polish & soumission

7. Pass performance (Lighthouse + profil bas de gamme + throttling).
8. Revue mobile pixel-par-section.
9. Enregistrement d’une **video case** propre (si soumission Awwwards) : parcours fluide, pas de bugs visibles.

---

## 4. Matrice de priorisation

| Priorité | Thème | Exemples |
|----------|--------|----------|
| **P0** | Confiance & légal implicite | Vrai envoi formulaire, pas de fausses métriques ambiguës |
| **P0** | SEO / canonical | Une seule URL canonique pour le contenu principal |
| **P1** | A11y | Labels services, scramble + reduced motion, focus menu |
| **P1** | Performance WebGL | Pause, fallback, coût GPU justifié |
| **P2** | Identité typo / couleur | Raffinement DA pour sortir du cliché « agence tech » |
| **P2** | Moment signature | Interaction mémorable alignée marque |

---

## 5. Validation avant envoi (checklist courte)

- [ ] Aucun TODO / faux endpoint dans le code visible en prod.
- [ ] Un pair teste au clavier uniquement sur homepage + contact.
- [ ] `prefers-reduced-motion` : vérification manuelle (OS + navigateur).
- [ ] Lighthouse (mobile) sur URL **finale** ; noter les régressions liées au WebGL et les documenter ou les corriger.
- [ ] Relecture complète du français sur toutes les routes publiques.

---

## 6. Note réaliste

Le niveau Awwwards combine **idée forte**, **exécution irréprochable** et **originalité dans un marché saturé**. Ce document aligne le projet sur des critères proches du jury ; la partie « idée forte » reste un choix créatif stratégique, pas une liste technique.

*Document généré pour le dépôt Eidos Studio — à faire évoluer avec la ligne éditoriale et le domaine de production définitifs.*
