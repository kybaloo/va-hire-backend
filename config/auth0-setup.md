# Configuration Auth0 - Guide de résolution

## Problèmes identifiés

1. **AUTH0_AUDIENCE** : La valeur actuelle semble être un Client ID plutôt qu'un Audience identifier
2. **AUTH0_CLIENT_SECRET** : Valeur par défaut non configurée
3. **Validation des tokens** : Configuration du middleware à améliorer

## Étapes de configuration

### 1. Configuration du Dashboard Auth0

1. Connectez-vous à votre dashboard Auth0 : https://manage.auth0.com/
2. Allez dans **Applications** > **APIs**
3. Créez une nouvelle API ou utilisez l'API existante
4. L'**Identifier** de cette API doit être utilisé comme `AUTH0_AUDIENCE`

### 2. Configuration de l'Application Auth0

1. Allez dans **Applications** > **Applications**
2. Sélectionnez votre application (ou créez-en une nouvelle)
3. Dans l'onglet **Settings** :
   - **Client ID** → utilisez cette valeur pour `AUTH0_CLIENT_ID`
   - **Client Secret** → utilisez cette valeur pour `AUTH0_CLIENT_SECRET`
   - **Domain** → déjà configuré correctement : `dev-88ygwppqgty64jel.eu.auth0.com`

### 3. URLs de callback autorisées

Dans les paramètres de votre application Auth0, configurez :

**Allowed Callback URLs:**

```
http://localhost:3000/callback,
http://localhost:5000/api/auth/auth0-callback
```

**Allowed Web Origins:**

```
http://localhost:3000,
http://localhost:5000
```

**Allowed Logout URLs:**

```
http://localhost:3000
```

### 4. Configuration recommandée pour .env

```env
# Auth0 Configuration
AUTH0_DOMAIN=dev-88ygwppqgty64jel.eu.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier  # À remplacer par l'identifier de votre API
AUTH0_CLIENT_ID=Ypqfam85ZdQR1sQsMpNMz2qE1yk0ONMv  # Votre Client ID
AUTH0_CLIENT_SECRET=your_actual_client_secret  # À remplacer par votre Client Secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback
```

### 5. Test de la configuration

Utilisez l'endpoint de test créé :

```
GET /api/auth/test-auth0
Authorization: Bearer YOUR_AUTH0_TOKEN
```

## Vérification des logs

Surveillez les logs du serveur pour identifier les erreurs spécifiques :

- Erreurs JWKS (clés de signature)
- Problèmes d'audience ou d'issuer
- Tokens expirés ou malformés

## Dépannage courant

### Erreur "Invalid audience"

- Vérifiez que `AUTH0_AUDIENCE` correspond à l'identifier de votre API Auth0

### Erreur "Invalid issuer"

- Vérifiez que `AUTH0_DOMAIN` est correct et n'a pas de slash final

### Erreur "Unable to verify signature"

- Vérifiez que votre application Auth0 utilise l'algorithme RS256
- Vérifiez que l'URL JWKS est accessible

### Token non reçu par le backend

- Vérifiez que le frontend envoie le token dans l'header `Authorization: Bearer TOKEN`
- Vérifiez les CORS si les requêtes viennent d'un domaine différent
