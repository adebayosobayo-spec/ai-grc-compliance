import os
import re
import sys
import subprocess
from pathlib import Path

# ANSI colors for terminal
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
RESET = '\033[0m'
BOLD = '\033[1m'

def print_header(text):
    print(f"\n{BOLD}{'='*50}{RESET}")
    print(f"{BOLD} {text}{RESET}")
    print(f"{BOLD}{'='*50}{RESET}")

def check_pass(msg):
    print(f"[{GREEN}PASS{RESET}] {msg}")

def check_warn(msg):
    print(f"[{YELLOW}WARN{RESET}] {msg}")

def check_fail(msg):
    print(f"[{RED}FAIL{RESET}] {msg}")
    return 1

def run_audit():
    errors = 0
    project_root = Path(__file__).parent.parent
    backend_dir = project_root / 'backend'
    frontend_dir = project_root / 'frontend'

    print_header("COMPLAI PRE-FLIGHT SECURITY AUDIT")

    # 1. Rate Limits
    print("\n🔍 1. Checking Rate Limiting...")
    main_py_path = backend_dir / 'app' / 'main.py'
    try:
        content = main_py_path.read_text()
        if 'slowapi' in content or 'RateLimiter' in content:
            check_pass("Rate limiting middleware found in main.py")
        else:
            check_warn("No standard 'slowapi' rate limiting detected in main.py")
    except Exception as e:
        check_fail(f"Could not read main.py: {e}")
        errors += 1

    # 2. Row Level Security (RLS)
    print("\n🔍 2. Checking Row Level Security...")
    config_py_path = backend_dir / 'app' / 'core' / 'config.py'
    try:
        content = config_py_path.read_text()
        if 'sqlite' in content.lower():
            check_warn("SQLite detected as database. SQLite DOES NOT support Row Level Security (RLS).")
            check_warn("Recommendation: Migrate to PostgreSQL/Supabase before opening to multi-tenant traffic.")
        else:
            check_pass("SQLite not detected in default config. Assuming RLS capable DB.")
    except Exception as e:
        check_fail(f"Could not read config.py: {e}")
        errors += 1

    # 3. CAPTCHA on Auth/Forms
    print("\n🔍 3. Checking CAPTCHA on public pages (Onboarding)...")
    onboarding_jsx = frontend_dir / 'src' / 'pages' / 'Onboarding.jsx'
    try:
        content = onboarding_jsx.read_text(encoding='utf-8')
        if 'captcha' in content.lower() or 'turnstile' in content.lower():
            check_pass("CAPTCHA integration found in Onboarding.")
        else:
            check_warn("No CAPTCHA or Turnstile component found in Onboarding page.")
    except Exception as e:
        check_fail(f"Could not read Onboarding.jsx: {e}")

    # 4. Server-Side Validation
    print("\n🔍 4. Checking Server-Side Validation (Pydantic Models)...")
    try:
        endpoints_dir = backend_dir / 'app' / 'api' / 'endpoints'
        validation_misses = []
        for file in endpoints_dir.glob('*.py'):
            content = file.read_text()
            if 'def ' in content and (': dict' in content or 'Request' in content) and 'schemas.' not in content:
                validation_misses.append(file.name)
                
        if validation_misses:
            check_warn(f"Found endpoints potentially bypassing Pydantic schemas: {', '.join(validation_misses)}")
        else:
            check_pass("Endpoints appear to strictly use Pydantic schemas.")
    except Exception as e:
        check_warn(f"Validation check skipped: {e}")

    # 5. API Keys Secured
    print("\n🔍 5. Scanning for hardcoded API keys...")
    found_secrets = False
    regex_patterns = [
        r'sk-ant-[a-zA-Z0-9_-]{40,}',  # Anthropic keys
        r'sk-[a-zA-Z0-9]{40,}',        # OpenAI keys
        r'eyJhbGciOi'                  # Base64 JWT header
    ]
    
    for ext in ['.py', '.jsx', '.js']:
        for file_path in project_root.rglob(f"*{ext}"):
            if 'node_modules' in file_path.parts or 'venv' in file_path.parts or '.vercel' in file_path.parts:
                continue
            if file_path.name == 'security_audit.py':
                continue
            try:
                content = file_path.read_text(encoding='utf-8', errors='ignore')
                for pattern in regex_patterns:
                    if re.search(pattern, content):
                        check_fail(f"Potential hardcoded secret found in: {file_path.relative_to(project_root)}")
                        found_secrets = True
                        errors += 1
            except Exception:
                pass
                
    if not found_secrets:
        check_pass("No hardcoded Anthropic/OpenAI keys or JWTs found in source code.")

    # 6. Env Vars Set Properly
    print("\n🔍 6. Checking Environment Variables...")
    env_example = backend_dir / '.env.example'
    env_file = backend_dir / '.env'
    if not env_example.exists():
        check_warn("No .env.example found to compare against.")
    elif not env_file.exists():
        check_fail("No .env file found in backend. (Skip if this is CI/CD)")
    else:
        check_pass("Environment file structure exists.")

    # 7. CORS Restrictions
    print("\n🔍 7. Checking CORS Restrictions...")
    try:
        content = config_py_path.read_text()
        if 'ALLOWED_ORIGINS="*"' in content.replace(' ', ''):
            check_fail("Wildcard (*) found in CORS ALLOWED_ORIGINS. This is highly insecure for production.")
            errors += 1
        elif 'http://localhost' in content and 'environment="production"' in content.lower():
            check_warn("Localhost is in ALLOWED_ORIGINS but environment might be set to production.")
        else:
            check_pass("CORS origins do not contain a gross wildcard.")
    except Exception:
        pass

    # 8. Dependency Audit
    print("\n🔍 8. Running Dependency Audits...")
    
    # Frontend Audit
    print("   -> Frontend (npm audit)")
    try:
        npm_cmd = 'npm.cmd' if os.name == 'nt' else 'npm'
        npm_audit = subprocess.run([npm_cmd, 'audit', '--audit-level=high'], cwd=frontend_dir, capture_output=True, text=True)
        if npm_audit.returncode != 0:
            check_warn("NPM audit found high/critical vulnerabilities. Please run `npm audit fix` in frontend.")
        else:
            check_pass("NPM audit passed.")
    except Exception as e:
        check_warn(f"Could not run npm audit: {e}")

    # Backend Audit (Using pip check / pip-audit if installed)
    print("   -> Backend (pip check)")
    try:
        python_exe = backend_dir / 'venv' / 'Scripts' / 'python.exe' if os.name == 'nt' else backend_dir / 'venv' / 'bin' / 'python'
        if python_exe.exists():
            pip_check = subprocess.run([str(python_exe), '-m', 'pip', 'check'], capture_output=True, text=True)
            if pip_check.returncode != 0:
                check_warn(f"pip check failed: {pip_check.stdout.strip()}")
            else:
                check_pass("pip check passed.")
        else:
            check_warn("Could not find virtual environment to run pip check.")
    except Exception as e:
        check_warn(f"Could not run pip check: {e}")

    # Summary
    print_header("AUDIT SUMMARY")
    if errors > 0:
        print(f"[{RED}FAILED{RESET}] The pre-flight audit found {errors} critical condition(s) that should be addressed before deployment.")
        sys.exit(1)
    else:
        print(f"[{GREEN}SUCCESS{RESET}] No critical blocking errors found. (Review warnings manually). Ready for launch!")
        sys.exit(0)

if __name__ == "__main__":
    run_audit()
