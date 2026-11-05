# Jumeau IA — Younouss Athie

Assistant conversationnel intégré à mon portfolio : il répond aux visiteurs à ma place (parcours, projets, compétences), en français ou en anglais.

- **Widget** : `public/twin.js` — un seul fichier, sans dépendance, isolé dans un Shadow DOM (n'interfère pas avec le site hôte), réponses affichées en direct.
- **Serveur** : `supabase/functions/twin-chat` — Edge Function Supabase qui appelle Google Gemini en flux ; la clé reste côté serveur ; limites par adresse IP et par jour.
- **Démo** : https://jumeau-younouss.netlify.app

## Intégration dans un site

```html
<script src="https://jumeau-younouss.netlify.app/twin.js" defer></script>
```

Options : `data-lang="fr|en"` (sinon langue du navigateur), `data-open="true"` (ouvert au chargement).
