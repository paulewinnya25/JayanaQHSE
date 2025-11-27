# Instructions pour pousser vers GitHub

## Problème d'authentification détecté

Vous êtes actuellement connecté avec le compte `pauleCdl2025` mais le dépôt appartient à `paulewinnya25`.

## Solutions possibles:

### Solution 1: Utiliser un Personal Access Token (Recommandé)

1. **Créer un token GitHub:**
   - Allez sur GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Cliquez sur "Generate new token (classic)"
   - Donnez un nom au token (ex: "JayanaQHSE")
   - Sélectionnez les permissions: `repo` (toutes les permissions)
   - Cliquez sur "Generate token"
   - **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après)

2. **Pousser avec le token:**
   ```bash
   git push https://VOTRE_TOKEN@github.com/paulewinnya25/JayanaQHSE.git main
   ```
   Remplacer `VOTRE_TOKEN` par le token copié.

### Solution 2: Changer les identifiants Windows

1. Ouvrez "Gestionnaire d'identifiants Windows"
2. Allez dans "Identifiants Windows"
3. Recherchez "github.com"
4. Supprimez les identifiants enregistrés
5. Relancez `git push -u origin main`
6. Entrez vos identifiants pour `paulewinnya25`

### Solution 3: Utiliser SSH au lieu de HTTPS

1. **Générer une clé SSH (si vous n'en avez pas):**
   ```bash
   ssh-keygen -t ed25519 -C "votre_email@example.com"
   ```

2. **Ajouter la clé SSH à GitHub:**
   - Copiez le contenu de `C:\Users\surface\.ssh\id_ed25519.pub`
   - Allez sur GitHub.com → Settings → SSH and GPG keys
   - Cliquez sur "New SSH key"
   - Collez la clé

3. **Changer le remote vers SSH:**
   ```bash
   git remote set-url origin git@github.com:paulewinnya25/JayanaQHSE.git
   git push -u origin main
   ```

### Solution 4: Utiliser GitHub Desktop ou GitHub CLI

- Téléchargez GitHub Desktop et connectez-vous avec le compte `paulewinnya25`
- Ou installez GitHub CLI (`gh`) et connectez-vous avec `gh auth login`

## Après avoir résolu l'authentification:

Le commit est déjà fait localement. Il suffit de pousser:

```bash
git push -u origin main
```

