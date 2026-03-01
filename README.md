# AI GRC Compliance Assistant

An AI-powered GRC (Governance, Risk, and Compliance) compliance assistant specifically designed to help organizations, AI agents, startups, and businesses achieve compliance with **ISO 27001:2022** (Information Security Management) and **ISO 42001:2023** (AI Management Systems).

## 🚀 Features

### Core Capabilities

1. **Gap Analysis** 📊
   - Comprehensive assessment of current compliance posture
   - Identification of gaps against ISO 27001 and ISO 42001 requirements
   - Risk-based prioritization of remediation efforts
   - Actionable recommendations for each gap

2. **Policy Generator** 📝
   - AI-powered generation of compliance policies
   - Customized for your organization and industry
   - Covers all major policy types for both frameworks
   - Ready-to-use, professionally written documents

3. **Assessment & Audit** ✅
   - Control-by-control compliance assessment
   - Detailed findings and scoring
   - Strengths and weaknesses analysis
   - Audit preparation guidance

4. **Action Plans** 📋
   - Automated remediation plan generation
   - Clear ownership and timelines
   - Dependency management
   - Milestone tracking and budget estimates

5. **AI Chat Assistant** 💬
   - Interactive compliance expert
   - Real-time answers to compliance questions
   - Context-aware guidance
   - Control references and best practices

## 🏗️ Architecture

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **AI Engine**: Anthropic Claude (via API)
- **Knowledge Base**: Comprehensive ISO 27001 & ISO 42001 control mappings
- **API**: RESTful API with OpenAPI documentation

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios

### Knowledge Base
- Complete ISO 27001:2022 control library (93 controls across 4 themes)
- Complete ISO 42001:2023 control library (AI governance framework)
- Implementation guidance for each control
- Control relationships and mappings

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Anthropic API key

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
cd C:\Users\DEBAYO\Desktop\ai-grc-compliance
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env file and add your Anthropic API key
# ANTHROPIC_API_KEY=your-api-key-here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend

# Activate virtual environment if not already activated
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Run the server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- API: http://localhost:8000
- Interactive API Documentation: http://localhost:8000/api/v1/docs
- ReDoc Documentation: http://localhost:8000/api/v1/redoc

### Start Frontend Application

```bash
cd frontend

# Run the development server
npm run dev
```

The frontend will be available at: http://localhost:3000

## 📖 Usage Guide

### 1. Gap Analysis

1. Navigate to the "Gap Analysis" page
2. Select your framework (ISO 27001 or ISO 42001)
3. Enter your organization details
4. Describe your current practices
5. Click "Perform Gap Analysis"
6. Review identified gaps and recommendations

### 2. Policy Generation

1. Navigate to the "Policy Generator" page
2. Select your framework
3. Enter organization details
4. Choose a policy type from the dropdown
5. Add any additional context
6. Click "Generate Policy"
7. Download the generated policy

### 3. Control Assessment

1. Navigate to the "Assessment" page
2. Enter organization name
3. Enter the specific control ID (e.g., A.5.1 for ISO 27001)
4. Provide evidence of current implementation (optional)
5. Click "Perform Assessment"
6. Review assessment results and recommendations

### 4. Action Plan Generation

1. Navigate to the "Action Plan" page
2. Enter organization name
3. Add identified compliance gaps
4. Set priority level
5. Specify desired timeline
6. Click "Generate Action Plan"
7. Review detailed action items and milestones

### 5. Chat with AI Assistant

1. Navigate to the "Chat" page
2. Type your compliance question
3. Get instant expert answers with references
4. Ask follow-up questions for deeper understanding

## 🔧 API Reference

### Endpoints

#### Gap Analysis
```http
POST /api/v1/compliance/gap-analysis
Content-Type: application/json

{
  "framework": "ISO_27001",
  "organization_name": "Your Company",
  "industry": "Technology",
  "current_practices": "Description of current practices...",
  "specific_controls": ["A.5.1", "A.8.1"]  // Optional
}
```

#### Policy Generation
```http
POST /api/v1/compliance/generate-policy
Content-Type: application/json

{
  "framework": "ISO_27001",
  "organization_name": "Your Company",
  "industry": "Technology",
  "policy_type": "Information Security Policy",
  "context": "Additional context..."  // Optional
}
```

#### Assessment
```http
POST /api/v1/compliance/assessment
Content-Type: application/json

{
  "framework": "ISO_27001",
  "organization_name": "Your Company",
  "control_id": "A.5.1",
  "evidence": "Current implementation details..."  // Optional
}
```

#### Action Plan
```http
POST /api/v1/compliance/action-plan
Content-Type: application/json

{
  "framework": "ISO_27001",
  "organization_name": "Your Company",
  "gaps": ["Gap 1", "Gap 2", "Gap 3"],
  "priority": "high",
  "timeline": "6 months"  // Optional
}
```

#### Chat
```http
POST /api/v1/compliance/chat
Content-Type: application/json

{
  "framework": "ISO_27001",
  "question": "What are the requirements for access control?"
}
```

## 🎯 ISO 27001 Coverage

### Control Categories
- **A.5 - Organizational Controls** (10 controls)
- **A.6 - People Controls** (8 controls)
- **A.7 - Physical Controls** (14 controls)
- **A.8 - Technological Controls** (34 controls)

Total: **93 controls**

## 🤖 ISO 42001 Coverage

### Control Categories
- **AI.1 - AI Governance**
- **AI.2 - Data Governance for AI**
- **AI.3 - AI System Development**
- **AI.4 - AI System Deployment**
- **AI.5 - AI Operations and Monitoring**
- **AI.6 - Transparency and Explainability**
- **AI.7 - AI Ethics and Responsibility**
- **AI.8 - AI Security**

## 🔐 Security & Privacy

- API key stored securely in environment variables
- No sensitive data persisted by default
- HTTPS recommended for production
- Rate limiting implemented
- CORS configured for frontend-backend communication

## 🚀 Deployment

### Backend Deployment (Example with Docker)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 📝 Configuration

### Environment Variables

Backend (.env):
```env
# Application
APP_NAME="AI GRC Compliance Assistant"
ENVIRONMENT="production"
DEBUG=False

# API
API_HOST="0.0.0.0"
API_PORT=8000

# Anthropic Claude
ANTHROPIC_API_KEY="your-api-key-here"
CLAUDE_MODEL="claude-3-5-sonnet-20241022"

# Security
SECRET_KEY="your-secret-key-here"

# CORS
ALLOWED_ORIGINS="https://yourdomain.com"
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📚 Additional Resources

### ISO 27001 Resources
- [ISO 27001:2022 Standard](https://www.iso.org/standard/27001)
- [ISMS Implementation Guide](https://www.iso.org/isoiec-27001-information-security.html)

### ISO 42001 Resources
- [ISO 42001:2023 Standard](https://www.iso.org/standard/81230.html)
- [AI Management System Guide](https://www.iso.org/artificial-intelligence)

### Anthropic Claude Resources
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Model Information](https://www.anthropic.com/claude)

## 🤝 Contributing

This is a private project. For issues or suggestions, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For questions or support:
- Review the documentation above
- Check the API documentation at `/api/v1/docs`
- Contact your system administrator

## 🎉 Acknowledgments

- Built with Anthropic Claude AI
- ISO 27001:2022 standard
- ISO 42001:2023 standard
- FastAPI framework
- React and Tailwind CSS

---

**Version**: 1.0.0
**Last Updated**: February 2026
**Status**: Production Ready
