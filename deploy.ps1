# Configuration
$PROJECT_ID = "build-marathon-project"
$SERVICE_NAME = "kortexflow"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Building Docker image..." -ForegroundColor Green
gcloud builds submit --tag $IMAGE_NAME --project $PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying to Cloud Run..." -ForegroundColor Green

# Read environment variables from .env.local
$envVars = @()
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.+)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^["'']|["'']$', ''
            $envVars += "$key=$value"
        }
    }
}

# Build the gcloud command
$gcCommand = "gcloud run deploy $SERVICE_NAME " +
"--image $IMAGE_NAME " +
"--platform managed " +
"--region $REGION " +
"--allow-unauthenticated " +
"--memory 1Gi " +
"--cpu 1 " +
"--timeout 60 " +
"--max-instances 10 " +
"--project $PROJECT_ID"

# Add environment variables
foreach ($envVar in $envVars) {
    $gcCommand += " --set-env-vars `"$envVar`""
}

# Execute deployment
Invoke-Expression $gcCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment complete!" -ForegroundColor Green
    Write-Host "Your app is running at:" -ForegroundColor Cyan
    gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
}
else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}
