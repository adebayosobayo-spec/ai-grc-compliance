# Setup Guide - AI GRC Compliance Assistant

This guide will walk you through setting up and running the AI GRC Compliance Assistant on your local machine.

## Prerequisites Check

Before you begin, ensure you have the following installed:

### 1. Python 3.8+
Check your Python version:
```bash
python --version
```

If you don't have Python installed:
- Download from https://www.python.org/downloads/
- During installation, check "Add Python to PATH"

### 2. Node.js 18+
Check your Node.js version:
```bash
node --version
npm --version
```

If you don't have Node.js installed:
- Download from https://nodejs.org/
- Install the LTS (Long Term Support) version

### 3. Anthropic API Key
You'll need an API key from Anthropic:
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Save it securely (you'll need it during setup)

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv venv
```

#### 2.2 Activate Virtual Environment

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

This will install all required Python packages. It may take a few minutes.

#### 2.4 Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Open `.env` file in a text editor

3. Add your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

4. (Optional) Modify other settings as needed

#### 2.5 Verify Backend Setup

Test the backend:
```bash
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Open your browser and visit:
- http://localhost:8000 - Should show API info
- http://localhost:8000/api/v1/docs - Should show interactive API documentation

Press `Ctrl+C` to stop the server.

### Step 3: Frontend Setup

Open a new terminal window (keep the backend terminal open if running).

#### 3.1 Navigate to Frontend Directory

```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

This will install all required Node packages. It may take a few minutes.

#### 3.3 (Optional) Configure Frontend Environment

If you want to customize the API URL:
```bash
echo VITE_API_URL=http://localhost:8000/api/v1 > .env
```

#### 3.4 Verify Frontend Setup

Test the frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and visit http://localhost:3000

## Running the Application

### Quick Start

#### Terminal 1 - Backend:
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

#### Terminal 2 - Frontend:
```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance\frontend
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/v1/docs

## Troubleshooting

### Issue: "Python not found"
**Solution**:
- Ensure Python is installed and added to PATH
- Try `py --version` instead of `python --version` on Windows

### Issue: "pip not found"
**Solution**:
- Try `python -m pip` instead of `pip`
- Reinstall Python and check "Add to PATH" during installation

### Issue: "Module not found" errors
**Solution**:
- Ensure virtual environment is activated (you should see `(venv)` in prompt)
- Run `pip install -r requirements.txt` again
- Check that you're in the correct directory

### Issue: "npm not found"
**Solution**:
- Ensure Node.js is installed properly
- Restart your terminal after installing Node.js
- Try reinstalling Node.js

### Issue: "Port already in use"
**Solution**:
- Backend (8000): Change port in `.env` file: `API_PORT=8001`
- Frontend (3000): The dev server will automatically try the next available port

### Issue: "API key invalid"
**Solution**:
- Check that your Anthropic API key is correctly set in `.env`
- Ensure there are no extra spaces or quotes around the key
- Verify the key is active in your Anthropic console

### Issue: "CORS errors"
**Solution**:
- Ensure both backend and frontend are running
- Check `ALLOWED_ORIGINS` in backend `.env` file includes `http://localhost:3000`
- Clear browser cache and reload

### Issue: Frontend shows "Network Error"
**Solution**:
- Verify backend is running on http://localhost:8000
- Check firewall isn't blocking local connections
- Verify `.env` settings in frontend if you created one

## Testing the Application

### 1. Test Gap Analysis

1. Go to http://localhost:3000
2. Select ISO 27001 or ISO 42001 from dropdown
3. Click "Get Started" under Gap Analysis
4. Fill in the form:
   - Organization Name: "Test Company"
   - Industry: "Technology"
   - Current Practices: "We have basic security policies and procedures in place"
5. Click "Perform Gap Analysis"
6. Wait for AI to generate results

### 2. Test Policy Generator

1. Navigate to "Policy Generator"
2. Fill in the form:
   - Organization Name: "Test Company"
   - Industry: "Technology"
   - Policy Type: Select any policy type
3. Click "Generate Policy"
4. Review the generated policy
5. Click "Download" to save

### 3. Test Chat

1. Navigate to "Chat"
2. Try a sample question: "What are the key requirements for ISO 27001?"
3. Review the AI response
4. Ask follow-up questions

## Next Steps

After successful setup:

1. **Explore the Features**: Try all four main features (Gap Analysis, Policy Generator, Assessment, Action Plans)
2. **Read the Documentation**: Review README.md for detailed feature descriptions
3. **Customize**: Modify settings in `.env` files as needed
4. **Production Deployment**: See README.md deployment section

## Production Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` in backend `.env`
- [ ] Set `DEBUG=False` in backend `.env`
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure proper `ALLOWED_ORIGINS` for your domain
- [ ] Use HTTPS for all connections
- [ ] Set up proper database (if needed)
- [ ] Configure logging and monitoring
- [ ] Set up backups
- [ ] Review security settings

## Getting Help

If you encounter issues not covered here:

1. Check the main README.md file
2. Review the API documentation at http://localhost:8000/api/v1/docs
3. Check Python/Node.js error messages carefully
4. Verify all prerequisites are correctly installed

## Quick Reference Commands

### Backend

```bash
# Activate virtual environment
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run server
python -m uvicorn app.main:app --reload

# Run on different port
python -m uvicorn app.main:app --reload --port 8001

# Deactivate virtual environment
deactivate
```

### Frontend

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Need Help?** Contact your system administrator or refer to the troubleshooting section above.
