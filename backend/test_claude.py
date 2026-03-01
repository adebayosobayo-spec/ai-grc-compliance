import os
import sys
import json

# Add backend to path
sys.path.append(os.path.abspath("c:\\Users\\DEBAYO\\Desktop\\ai-grc-compliance\\backend"))

from app.services.claude_service import ClaudeService

def test():
    service = ClaudeService()
    try:
        print("Testing gap analysis...")
        res1 = service.perform_gap_analysis("ISO_27001", "TestOrg", "We use AWS with MFA and no formal policies.", [{"id": "A.5.1", "name": "Policies for info sec", "description": "Info sec policy shall be defined and approved by management."}])
        print("Gap analysis success!")
        print(json.dumps(res1, indent=2))
    except Exception as e:
        print(f"Gap analysis error: {e}")
        
    try:
        print("\nTesting generate policy...")
        res2 = service.generate_policy("ISO_27001", "TestOrg", "Information Security Policy", "Tech startup.")
        print("Generate policy success!")
        print(json.dumps(res2, indent=2))
    except Exception as e:
        print(f"Generate policy error: {e}")

if __name__ == "__main__":
    test()
