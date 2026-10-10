#!/bin/bash
echo "🚀 جاري نشر التطبيق..."
echo ""

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

# Deploy
cd /home/z/my-project
vercel --yes --prod

echo ""
echo "✅ تم النشر!"
