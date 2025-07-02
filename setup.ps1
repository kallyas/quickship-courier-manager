# QuickShip Courier Manager - Windows Setup Script
# This script automates the complete setup process for the application

Write-Host "🚀 Starting QuickShip Courier Manager Setup..." -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Check if PHP is installed
Write-Host "🔍 Checking PHP installation..." -ForegroundColor Yellow
try {
    $phpVersion = php -v 2>$null
    if ($phpVersion) {
        Write-Host "✅ PHP is installed" -ForegroundColor Green
        Write-Host ($phpVersion -split "`n")[0] -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ PHP is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PHP and add it to your system PATH" -ForegroundColor Red
    exit 1
}

# Check if Composer is installed
Write-Host "🔍 Checking Composer installation..." -ForegroundColor Yellow
try {
    $composerVersion = composer --version 2>$null
    if ($composerVersion) {
        Write-Host "✅ Composer is installed" -ForegroundColor Green
        Write-Host $composerVersion -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Composer is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Composer from https://getcomposer.org/" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js is installed" -ForegroundColor Green
        Write-Host "Node.js version: $nodeVersion" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install PHP dependencies
Write-Host "`n📦 Installing PHP dependencies with Composer..." -ForegroundColor Yellow
try {
    composer install --no-dev --optimize-autoloader
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP dependencies installed successfully" -ForegroundColor Green
    } else {
        throw "Composer install failed"
    }
} catch {
    Write-Host "❌ Failed to install PHP dependencies" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Install Node.js dependencies
Write-Host "`n📦 Installing Node.js dependencies..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js dependencies installed successfully" -ForegroundColor Green
    } else {
        throw "npm install failed"
    }
} catch {
    Write-Host "❌ Failed to install Node.js dependencies" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Copy environment file
Write-Host "`n⚙️ Setting up environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    try {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created from .env.example" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create .env file" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
}

# Generate application key
Write-Host "`n🔑 Generating application key..." -ForegroundColor Yellow
try {
    php artisan key:generate --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Application key generated successfully" -ForegroundColor Green
    } else {
        throw "Key generation failed"
    }
} catch {
    Write-Host "❌ Failed to generate application key" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Run database migrations
Write-Host "`n🗄️ Running database migrations..." -ForegroundColor Yellow
try {
    php artisan migrate --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database migrations completed successfully" -ForegroundColor Green
    } else {
        throw "Database migration failed"
    }
} catch {
    Write-Host "❌ Failed to run database migrations" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "💡 Make sure your database is configured in the .env file" -ForegroundColor Yellow
    exit 1
}

# Seed the database
Write-Host "`n🌱 Seeding database with initial data..." -ForegroundColor Yellow
try {
    php artisan db:seed --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully" -ForegroundColor Green
    } else {
        throw "Database seeding failed"
    }
} catch {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Create storage symlink
Write-Host "`n🔗 Creating storage symlink..." -ForegroundColor Yellow
try {
    php artisan storage:link
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Storage symlink created successfully" -ForegroundColor Green
    } else {
        throw "Storage link failed"
    }
} catch {
    Write-Host "❌ Failed to create storage symlink" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Build frontend assets
Write-Host "`n🏗️ Building frontend assets..." -ForegroundColor Yellow
try {
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Frontend assets built successfully" -ForegroundColor Green
    } else {
        throw "Asset build failed"
    }
} catch {
    Write-Host "❌ Failed to build frontend assets" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Clear application cache
Write-Host "`n🧹 Clearing application cache..." -ForegroundColor Yellow
try {
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    Write-Host "✅ Application cache cleared" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to clear cache" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

# Setup complete
Write-Host "`n🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan

Write-Host "`n📋 Default Login Credentials:" -ForegroundColor Cyan
Write-Host "Super Admin: admin@quickship.com / password" -ForegroundColor Yellow
Write-Host "Customer: john.customer@example.com / password" -ForegroundColor Yellow

Write-Host "`n🚀 Starting development server..." -ForegroundColor Cyan
Write-Host "The application will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
try {
    php artisan serve
} catch {
    Write-Host "`n❌ Failed to start development server" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "You can manually start the server with: php artisan serve" -ForegroundColor Yellow
    exit 1
}