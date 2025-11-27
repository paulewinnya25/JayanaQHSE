# Script pour configurer l'authentification GitHub

Write-Host "=== Configuration de l'authentification GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Supprimer les anciens identifiants GitHub
Write-Host "1. Suppression des anciens identifiants GitHub..." -ForegroundColor Yellow
$credentials = cmdkey /list | Select-String "github"
if ($credentials) {
    foreach ($cred in $credentials) {
        if ($cred -match "target:(.*)") {
            $target = $matches[1].Trim()
            Write-Host "   Suppression de: $target" -ForegroundColor Gray
            cmdkey /delete:$target /silent 2>$null
        }
    }
    Write-Host "   ✓ Identifiants supprimés" -ForegroundColor Green
} else {
    Write-Host "   Aucun identifiant GitHub trouvé" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Configuration de l'authentification..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Vous avez deux options:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPTION 1: Utiliser un Personal Access Token (Recommandé)" -ForegroundColor Green
Write-Host "   a) Créez un token sur: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   b) Cliquez sur 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   c) Donnez un nom (ex: JayanaQHSE)" -ForegroundColor White
Write-Host "   d) Sélectionnez la permission 'repo' (toutes)" -ForegroundColor White
Write-Host "   e) Cliquez sur 'Generate token' et COPIEZ le token" -ForegroundColor White
Write-Host ""
Write-Host "   Ensuite, exécutez:" -ForegroundColor Yellow
Write-Host "   git push https://VOTRE_TOKEN@github.com/paulewinnya25/JayanaQHSE.git main" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPTION 2: Ré-authentifier avec Windows Credential Manager" -ForegroundColor Green
Write-Host "   Les identifiants ont été supprimés. Au prochain push," -ForegroundColor White
Write-Host "   Windows vous demandera de vous reconnecter avec paulewinnya25" -ForegroundColor White
Write-Host ""
Write-Host "Pour tester, exécutez:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""

# Vérifier la configuration du remote
Write-Host "3. Configuration du remote actuelle:" -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "=== Configuration terminée ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "  1. Si vous choisissez l'option 1, créez le token et utilisez la commande avec le token" -ForegroundColor White
Write-Host "  2. Si vous choisissez l'option 2, lancez simplement: git push -u origin main" -ForegroundColor White
Write-Host ""

