#!/bin/bash

echo "🚀 Setting up Farhan Ali Peerzada Portfolio Website"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "Node.js and npm are installed"

# Check current directory structure
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please run this script from the project root directory."
    exit 1
fi

# Navigate to backend directory and install dependencies
print_info "Installing backend dependencies..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

npm install

if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create necessary directories
mkdir -p logs uploads public temp
touch logs/.gitkeep uploads/.gitkeep public/.gitkeep temp/.gitkeep

print_status "Created necessary directories"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_info "Please update the .env file with your actual credentials"
fi

# Go back to root directory
cd ..

print_status "Setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 📧 Configure Email Settings:"
echo "   cd backend"
echo "   nano .env  # Update EMAIL_USER and EMAIL_PASS"
echo ""
echo "2. 🚀 Start the Backend Server:"
echo "   npm run dev"
echo ""
echo "3. 🌐 Open the Frontend:"
echo "   Open index.html in your browser or use a local server"
echo "   (Recommended: Use Live Server extension in VS Code)"
echo ""
echo "4. 🧪 Test the Contact Form:"
echo "   Fill out and submit the contact form to test email functionality"
echo ""
echo "📧 Email Configuration:"
echo "======================"
echo "Gmail: farhan.peerzadaa@gmail.com"
echo "App Password: Farhan@#12"
echo "LinkedIn: farhan-ali-peerzada"
echo "GitHub: farhan11000"
echo ""
echo "🔗 Important URLs:"
echo "=================="
echo "Backend API: http://localhost:5000"
echo "Health Check: http://localhost:5000/health"
echo "Contact API: http://localhost:5000/api/contact/send"
echo ""
echo "🎉 Your portfolio is ready to go!"