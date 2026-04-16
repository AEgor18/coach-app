# Запускать из корня проекта (где лежат папки backend/ и frontend/)
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Запуск всех тестов Coach App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 🔍 Путь к Python в виртуальном окружении
$venvPython = Join-Path $PWD "backend\venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "❌ Не найдено виртуальное окружение: $venvPython" -ForegroundColor Red
    Write-Host "💡 Настройка (выполните один раз в PowerShell):" -ForegroundColor Yellow
    Write-Host "   cd backend"
    Write-Host "   python -m venv venv"
    Write-Host "   .\venv\Scripts\Activate.ps1"
    Write-Host "   pip install -r requirements.txt"
    Write-Host "   deactivate"
    Write-Host "   cd .."
    exit 1
}

Write-Host "🐍 Используем: $venvPython" -ForegroundColor Green
Write-Host ""

# ==================== BACKEND ====================
Write-Host "→ Backend: Запуск тестов" -ForegroundColor Cyan
Push-Location "backend"

Write-Host "   • Unit тесты" -ForegroundColor Yellow
& $venvPython -m pytest tests/unit -q --tb=no -W ignore --disable-warnings
$unitStatus = $LASTEXITCODE

Write-Host "   • Integration тесты" -ForegroundColor Yellow
& $venvPython -m pytest tests/integration -q --tb=no -W ignore --disable-warnings
$intStatus = $LASTEXITCODE

Pop-Location

# ==================== FRONTEND ====================
Write-Host ""
Write-Host "→ Frontend: Unit тесты (Vitest)" -ForegroundColor Cyan
Push-Location "frontend"

# NODE_NO_WARNINGS=1 отключает предупреждения Node
# 2>$null перенаправляет stderr (предупреждения MUI/React) в никуда
$env:NODE_NO_WARNINGS = "1"
npm run test:run -- --reporter=dot 2>$null
$feUnitStatus = $LASTEXITCODE
Pop-Location

Write-Host ""
Write-Host "→ Frontend: E2E тесты (Playwright)" -ForegroundColor Cyan
Push-Location "frontend"

# --reporter=line + перенаправление stderr для чистого вывода
$env:NODE_NO_WARNINGS = "1"
npm run test:e2e -- --reporter=line 2>$null
$e2eStatus = $LASTEXITCODE
Pop-Location

# ==================== ИТОГ ====================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

$allPassed = ($unitStatus -eq 0) -and ($intStatus -eq 0) -and ($feUnitStatus -eq 0) -and ($e2eStatus -eq 0)

if ($allPassed) {
    Write-Host "✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!" -ForegroundColor Green
} else {
    Write-Host "❌ Некоторые тесты упали:" -ForegroundColor Red
    if ($unitStatus -ne 0) { Write-Host "   - Backend Unit тесты" -ForegroundColor Red }
    if ($intStatus -ne 0) { Write-Host "   - Backend Integration тесты" -ForegroundColor Red }
    if ($feUnitStatus -ne 0) { Write-Host "   - Frontend Unit тесты" -ForegroundColor Red }
    if ($e2eStatus -ne 0) { Write-Host "   - E2E тесты" -ForegroundColor Red }
}

Write-Host "========================================" -ForegroundColor Cyan