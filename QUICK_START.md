# Quick Start Guide

Get up and running with the AI GRC Compliance Assistant in 5 minutes!

## 🚀 Quick Setup (Windows)

### 1. Get Your Anthropic API Key
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys → Create Key
4. Copy your key (starts with `sk-ant-`)

### 2. Setup Backend

Open Command Prompt or PowerShell:

```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
copy .env.example .env
notepad .env
```

In notepad, replace `your-anthropic-api-key-here` with your actual API key, then save and close.

### 3. Setup Frontend

Open a NEW Command Prompt or PowerShell window:

```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\frontend

# Install dependencies
npm install
```

## ▶️ Run the Application

### Terminal 1 - Start Backend:
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

Wait for: `Application startup complete.`

### Terminal 2 - Start Frontend:
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\frontend
npm run dev
```

Wait for: `Local: http://localhost:3000/`

## ✅ Test It

1. Open browser: http://localhost:3000
2. Select "ISO 27001" from dropdown
3. Click "Chat" in navigation
4. Type: "What is ISO 27001?"
5. Hit Send

If you get a response, you're all set! 🎉

## 📋 Try the Features

### Gap Analysis
1. Click "Gap Analysis"
2. Fill in:
   - Organization: "My Startup"
   - Industry: "Technology"
   - Current Practices: "We have basic policies"
3. Click "Perform Gap Analysis"

### Policy Generator
1. Click "Policy Generator"
2. Select a policy type
3. Click "Generate Policy"
4. Download your policy!

### Assessment
1. Click "Assessment"
2. Enter Control ID: "A.5.1" (for ISO 27001)
3. Click "Perform Assessment"

### Action Plan
1. Click "Action Plan"
2. Add gaps like: "No incident response plan"
3. Click "Generate Action Plan"

## 🐛 Common Issues

**"Python not found"**
- Install Python from python.org
- Check "Add to PATH" during install

**"npm not found"**
- Install Node.js from nodejs.org
- Restart terminal after install

**"Port 8000 already in use"**
- Kill the process or change port in backend/.env

**"API key invalid"**
- Check .env file has correct key
- No spaces or quotes around key

**Frontend can't connect**
- Ensure backend is running first
- Check http://localhost:8000/health

## 📚 Next Steps

- Read full [README.md](README.md) for details
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting
- Explore API docs: http://localhost:8000/api/v1/docs

## 🔄 Starting Again Later

Just run these commands:

**Terminal 1:**
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**Terminal 2:**
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\frontend
npm run dev
```

## 📞 Need Help?

Check SETUP_GUIDE.md for detailed troubleshooting!

---

**Ready in**: ~5 minutes
**Difficulty**: Easy
**Requirements**: Python, Node.js, Anthropic API key
