"""
ISO 42001:2023 AI Management System knowledge base.
Contains all controls, requirements, and guidance for AI governance.
"""

ISO_42001_INFO = {
    "name": "ISO/IEC 42001:2023",
    "full_title": "Information Technology - Artificial Intelligence - Management System",
    "version": "2023",
    "description": "First international standard for AI management systems",
    "purpose": "Helps organizations develop, provide, and use AI in a responsible way through an AI management system"
}

# ISO 42001 Control Objectives and Controls
ISO_42001_CONTROLS = {
    "AI.1": {
        "name": "AI Governance",
        "description": "Establish governance framework for AI systems",
        "controls": {
            "AI.1.1": {
                "name": "AI Policy",
                "description": "The organization shall establish, implement and maintain an AI policy that includes the organization's commitment to responsible AI development and use.",
                "control_type": "Governance",
                "clause_reference": "ISO 42001:2023 Annex A, AI.1.1",
                "implementation_guidance": [
                    "Define AI principles and values",
                    "Establish AI governance structure",
                    "Define roles and responsibilities for AI",
                    "Obtain management approval and commitment"
                ]
            },
            "AI.1.2": {
                "name": "AI Roles and Responsibilities",
                "description": "Roles and responsibilities for AI management should be defined and allocated.",
                "control_type": "Governance",
                "clause_reference": "ISO 42001:2023 Annex A, AI.1.2",
                "implementation_guidance": [
                    "Define AI-specific roles (AI Ethics Officer, Data Scientists, etc.)",
                    "Establish AI oversight committee",
                    "Document role descriptions",
                    "Ensure clear accountability"
                ]
            },
            "AI.1.3": {
                "name": "AI Risk Management",
                "description": "The organization shall establish and maintain processes for AI risk assessment and treatment.",
                "control_type": "Governance",
                "clause_reference": "ISO 42001:2023 Annex A, AI.1.3",
                "implementation_guidance": [
                    "Identify AI-specific risks (bias, fairness, transparency)",
                    "Assess impact and likelihood",
                    "Implement risk treatment plans",
                    "Monitor and review AI risks continuously"
                ]
            }
        }
    },
    "AI.2": {
        "name": "Data Governance for AI",
        "description": "Manage data quality, privacy, and security for AI systems",
        "controls": {
            "AI.2.1": {
                "name": "Data Quality for AI",
                "description": "The organization shall ensure that data used for AI systems is of appropriate quality, accuracy, completeness, and representativeness.",
                "control_type": "Data",
                "clause_reference": "ISO 42001:2023 Annex A, AI.2.1",
                "implementation_guidance": [
                    "Establish data quality metrics",
                    "Implement data validation processes",
                    "Monitor data quality continuously",
                    "Address data quality issues promptly"
                ]
            },
            "AI.2.2": {
                "name": "Data Privacy in AI",
                "description": "Personal data used in AI systems shall be processed in accordance with applicable privacy laws and regulations.",
                "control_type": "Data",
                "clause_reference": "ISO 42001:2023 Annex A, AI.2.2",
                "implementation_guidance": [
                    "Conduct privacy impact assessments for AI",
                    "Implement privacy-preserving techniques",
                    "Ensure data minimization",
                    "Obtain appropriate consents"
                ]
            },
            "AI.2.3": {
                "name": "Data Lineage and Provenance",
                "description": "The organization shall maintain records of data sources, transformations, and usage in AI systems.",
                "control_type": "Data",
                "clause_reference": "ISO 42001:2023 Annex A, AI.2.3",
                "implementation_guidance": [
                    "Track data sources and origins",
                    "Document data transformations",
                    "Maintain data versioning",
                    "Enable data traceability"
                ]
            },
            "AI.2.4": {
                "name": "Training Data Management",
                "description": "Training data for AI models shall be appropriately selected, labeled, and managed.",
                "control_type": "Data",
                "clause_reference": "ISO 42001:2023 Annex A, AI.2.4",
                "implementation_guidance": [
                    "Establish data selection criteria",
                    "Implement quality labeling processes",
                    "Validate training data representativeness",
                    "Manage training data versions"
                ]
            }
        }
    },
    "AI.3": {
        "name": "AI System Development",
        "description": "Responsible AI system design, development, and testing",
        "controls": {
            "AI.3.1": {
                "name": "AI System Design",
                "description": "AI systems shall be designed with consideration for transparency, fairness, accountability, and safety.",
                "control_type": "Development",
                "clause_reference": "ISO 42001:2023 Annex A, AI.3.1",
                "implementation_guidance": [
                    "Define AI system requirements including ethical requirements",
                    "Design for explainability and interpretability",
                    "Consider human oversight mechanisms",
                    "Document design decisions and trade-offs"
                ]
            },
            "AI.3.2": {
                "name": "AI Model Development",
                "description": "AI models shall be developed using appropriate methodologies and best practices.",
                "control_type": "Development",
                "clause_reference": "ISO 42001:2023 Annex A, AI.3.2",
                "implementation_guidance": [
                    "Select appropriate algorithms and techniques",
                    "Implement model training procedures",
                    "Use version control for models",
                    "Document model architectures and hyperparameters"
                ]
            },
            "AI.3.3": {
                "name": "AI Testing and Validation",
                "description": "AI systems shall undergo comprehensive testing including functional, performance, security, and fairness testing.",
                "control_type": "Development",
                "clause_reference": "ISO 42001:2023 Annex A, AI.3.3",
                "implementation_guidance": [
                    "Develop AI-specific test cases",
                    "Test for bias and fairness",
                    "Validate model performance on diverse datasets",
                    "Conduct adversarial testing"
                ]
            },
            "AI.3.4": {
                "name": "Bias Detection and Mitigation",
                "description": "The organization shall implement measures to detect and mitigate bias in AI systems.",
                "control_type": "Development",
                "clause_reference": "ISO 42001:2023 Annex A, AI.3.4",
                "implementation_guidance": [
                    "Conduct bias assessments",
                    "Implement fairness metrics",
                    "Apply bias mitigation techniques",
                    "Monitor for emerging biases"
                ]
            }
        }
    },
    "AI.4": {
        "name": "AI System Deployment",
        "description": "Safe and controlled deployment of AI systems",
        "controls": {
            "AI.4.1": {
                "name": "AI Deployment Planning",
                "description": "Deployment of AI systems shall be planned and controlled.",
                "control_type": "Deployment",
                "clause_reference": "ISO 42001:2023 Annex A, AI.4.1",
                "implementation_guidance": [
                    "Develop deployment plans",
                    "Define rollback procedures",
                    "Establish deployment criteria",
                    "Plan for gradual rollout"
                ]
            },
            "AI.4.2": {
                "name": "AI System Integration",
                "description": "AI systems shall be properly integrated into existing infrastructure and workflows.",
                "control_type": "Deployment",
                "clause_reference": "ISO 42001:2023 Annex A, AI.4.2",
                "implementation_guidance": [
                    "Test integration points",
                    "Validate system interactions",
                    "Ensure compatibility",
                    "Document integration procedures"
                ]
            },
            "AI.4.3": {
                "name": "Human Oversight",
                "description": "Appropriate human oversight shall be maintained for AI system decisions and operations.",
                "control_type": "Deployment",
                "clause_reference": "ISO 42001:2023 Annex A, AI.4.3",
                "implementation_guidance": [
                    "Define human-in-the-loop requirements",
                    "Implement human review processes",
                    "Establish escalation procedures",
                    "Train personnel on AI oversight"
                ]
            }
        }
    },
    "AI.5": {
        "name": "AI Operations and Monitoring",
        "description": "Ongoing operation, monitoring, and maintenance of AI systems",
        "controls": {
            "AI.5.1": {
                "name": "AI System Monitoring",
                "description": "AI systems shall be continuously monitored for performance, accuracy, and anomalies.",
                "control_type": "Operations",
                "clause_reference": "ISO 42001:2023 Annex A, AI.5.1",
                "implementation_guidance": [
                    "Implement AI monitoring tools",
                    "Define monitoring metrics and thresholds",
                    "Set up alerting mechanisms",
                    "Monitor for model drift"
                ]
            },
            "AI.5.2": {
                "name": "Model Performance Management",
                "description": "The organization shall monitor and maintain AI model performance over time.",
                "control_type": "Operations",
                "clause_reference": "ISO 42001:2023 Annex A, AI.5.2",
                "implementation_guidance": [
                    "Track model accuracy and precision",
                    "Detect model degradation",
                    "Implement retraining procedures",
                    "Validate model updates"
                ]
            },
            "AI.5.3": {
                "name": "Incident Response for AI",
                "description": "The organization shall establish procedures for responding to AI system incidents and failures.",
                "control_type": "Operations",
                "clause_reference": "ISO 42001:2023 Annex A, AI.5.3",
                "implementation_guidance": [
                    "Define AI incident types",
                    "Establish incident response procedures",
                    "Implement incident tracking",
                    "Conduct post-incident reviews"
                ]
            },
            "AI.5.4": {
                "name": "AI System Maintenance",
                "description": "AI systems shall be maintained and updated regularly.",
                "control_type": "Operations",
                "clause_reference": "ISO 42001:2023 Annex A, AI.5.4",
                "implementation_guidance": [
                    "Schedule regular maintenance",
                    "Update models and components",
                    "Apply security patches",
                    "Document maintenance activities"
                ]
            }
        }
    },
    "AI.6": {
        "name": "Transparency and Explainability",
        "description": "Ensure AI systems are transparent and explainable",
        "controls": {
            "AI.6.1": {
                "name": "AI Transparency",
                "description": "The organization shall provide transparency about AI system capabilities, limitations, and decision-making processes.",
                "control_type": "Transparency",
                "clause_reference": "ISO 42001:2023 Annex A, AI.6.1",
                "implementation_guidance": [
                    "Document AI system capabilities",
                    "Disclose AI usage to stakeholders",
                    "Communicate limitations clearly",
                    "Provide AI literacy resources"
                ]
            },
            "AI.6.2": {
                "name": "Explainability",
                "description": "AI systems shall provide explanations for their decisions appropriate to the context and stakeholders.",
                "control_type": "Transparency",
                "clause_reference": "ISO 42001:2023 Annex A, AI.6.2",
                "implementation_guidance": [
                    "Implement explainability techniques (SHAP, LIME, etc.)",
                    "Provide decision explanations to users",
                    "Document model reasoning",
                    "Tailor explanations to audience"
                ]
            },
            "AI.6.3": {
                "name": "AI Documentation",
                "description": "Comprehensive documentation shall be maintained for AI systems.",
                "control_type": "Transparency",
                "clause_reference": "ISO 42001:2023 Annex A, AI.6.3",
                "implementation_guidance": [
                    "Create model cards or datasheets",
                    "Document training processes",
                    "Maintain technical documentation",
                    "Keep audit trails"
                ]
            }
        }
    },
    "AI.7": {
        "name": "AI Ethics and Responsibility",
        "description": "Ensure ethical and responsible AI practices",
        "controls": {
            "AI.7.1": {
                "name": "AI Ethics Framework",
                "description": "The organization shall establish and maintain an AI ethics framework.",
                "control_type": "Ethics",
                "clause_reference": "ISO 42001:2023 Annex A, AI.7.1",
                "implementation_guidance": [
                    "Define AI ethical principles",
                    "Establish ethics review board",
                    "Conduct ethical impact assessments",
                    "Address ethical concerns proactively"
                ]
            },
            "AI.7.2": {
                "name": "Fairness and Non-discrimination",
                "description": "AI systems shall be designed and operated to promote fairness and avoid discrimination.",
                "control_type": "Ethics",
                "clause_reference": "ISO 42001:2023 Annex A, AI.7.2",
                "implementation_guidance": [
                    "Define fairness criteria",
                    "Test for discriminatory outcomes",
                    "Implement fairness constraints",
                    "Monitor for discriminatory patterns"
                ]
            },
            "AI.7.3": {
                "name": "Accountability",
                "description": "Clear accountability shall be established for AI system decisions and impacts.",
                "control_type": "Ethics",
                "clause_reference": "ISO 42001:2023 Annex A, AI.7.3",
                "implementation_guidance": [
                    "Define accountability mechanisms",
                    "Establish decision appeal processes",
                    "Implement audit capabilities",
                    "Assign clear ownership"
                ]
            },
            "AI.7.4": {
                "name": "Societal Impact Assessment",
                "description": "The organization shall assess broader societal impacts of AI systems.",
                "control_type": "Ethics",
                "clause_reference": "ISO 42001:2023 Annex A, AI.7.4",
                "implementation_guidance": [
                    "Conduct impact assessments",
                    "Engage with stakeholders",
                    "Consider unintended consequences",
                    "Address negative impacts"
                ]
            }
        }
    },
    "AI.8": {
        "name": "AI Security",
        "description": "Security of AI systems and infrastructure",
        "controls": {
            "AI.8.1": {
                "name": "AI System Security",
                "description": "AI systems shall be protected against security threats specific to AI.",
                "control_type": "Security",
                "clause_reference": "ISO 42001:2023 Annex A, AI.8.1",
                "implementation_guidance": [
                    "Implement model security measures",
                    "Protect against adversarial attacks",
                    "Secure training data and models",
                    "Conduct security testing"
                ]
            },
            "AI.8.2": {
                "name": "Model Protection",
                "description": "AI models shall be protected against unauthorized access, theft, and manipulation.",
                "control_type": "Security",
                "clause_reference": "ISO 42001:2023 Annex A, AI.8.2",
                "implementation_guidance": [
                    "Implement access controls for models",
                    "Encrypt models at rest and in transit",
                    "Prevent model extraction attacks",
                    "Monitor for unauthorized access"
                ]
            },
            "AI.8.3": {
                "name": "Adversarial Robustness",
                "description": "AI systems shall be resilient to adversarial inputs and attacks.",
                "control_type": "Security",
                "clause_reference": "ISO 42001:2023 Annex A, AI.8.3",
                "implementation_guidance": [
                    "Test against adversarial examples",
                    "Implement input validation",
                    "Use adversarial training",
                    "Monitor for attack attempts"
                ]
            }
        }
    }
}


def get_all_controls():
    """Get all ISO 42001 controls as a flat list."""
    all_controls = []
    for category_id, category in ISO_42001_CONTROLS.items():
        for control_id, control in category["controls"].items():
            all_controls.append({
                "id": control_id,
                "category": category["name"],
                "name": control["name"],
                "description": control["description"],
                "type": control["control_type"],
                "clause_reference": control.get("clause_reference", "")
            })
    return all_controls


def get_control_by_id(control_id: str):
    """Get specific control by ID."""
    for category_id, category in ISO_42001_CONTROLS.items():
        if control_id in category["controls"]:
            return category["controls"][control_id]
    return None


def get_controls_by_category(category: str):
    """Get all controls in a category."""
    for category_id, cat_data in ISO_42001_CONTROLS.items():
        if cat_data["name"].lower() == category.lower():
            return cat_data["controls"]
    return {}
