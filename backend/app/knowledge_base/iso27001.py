"""
ISO 27001:2022 Information Security Management System knowledge base.
Contains all 93 controls, requirements, and guidance.
"""

ISO_27001_INFO = {
    "name": "ISO/IEC 27001:2022",
    "full_title": "Information Security Management Systems - Requirements",
    "version": "2022",
    "description": "International standard for information security management systems (ISMS)",
    "purpose": "Helps organizations manage and protect their information assets through a systematic approach"
}

# ISO 27001 Annex A Controls (93 controls organized in 4 themes)
ISO_27001_CONTROLS = {
    "A.5": {
        "name": "Organizational Controls",
        "controls": {
            "A.5.1": {
                "name": "Policies for information security",
                "description": "Information security policy and topic-specific policies should be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.1",
                "implementation_guidance": [
                    "Develop and document information security policies",
                    "Obtain management approval",
                    "Communicate policies to all relevant parties",
                    "Review and update policies regularly"
                ]
            },
            "A.5.2": {
                "name": "Information security roles and responsibilities",
                "description": "Information security roles and responsibilities should be defined and allocated according to the organization needs.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.2",
                "implementation_guidance": [
                    "Define security roles and responsibilities",
                    "Assign responsibilities to specific individuals",
                    "Document role descriptions",
                    "Ensure segregation of duties"
                ]
            },
            "A.5.3": {
                "name": "Segregation of duties",
                "description": "Conflicting duties and areas of responsibility should be segregated.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.3",
                "implementation_guidance": [
                    "Identify conflicting duties and areas of responsibility",
                    "Implement controls to enforce segregation",
                    "Review segregation of duties regularly",
                    "Document compensating controls where segregation is not feasible"
                ]
            },
            "A.5.4": {
                "name": "Management responsibilities",
                "description": "Management should require all personnel to apply information security in accordance with the established information security policy, topic-specific policies and procedures of the organization.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.4",
                "implementation_guidance": [
                    "Ensure management demonstrates leadership in information security",
                    "Require personnel to comply with security policies",
                    "Provide adequate resources for information security",
                    "Integrate information security into business processes"
                ]
            },
            "A.5.5": {
                "name": "Contact with authorities",
                "description": "The organization should establish and maintain contact with relevant authorities.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.5",
                "implementation_guidance": [
                    "Identify relevant authorities and regulatory bodies",
                    "Establish communication channels with authorities",
                    "Maintain a register of relevant authority contacts",
                    "Define procedures for reporting incidents to authorities"
                ]
            },
            "A.5.6": {
                "name": "Contact with special interest groups",
                "description": "The organization should establish and maintain contact with special interest groups or other specialist security forums and professional associations.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.6",
                "implementation_guidance": [
                    "Identify relevant special interest groups and forums",
                    "Participate in industry security groups",
                    "Subscribe to threat intelligence sharing communities",
                    "Share and receive security best practices"
                ]
            },
            "A.5.7": {
                "name": "Threat intelligence",
                "description": "Information relating to information security threats should be collected and analyzed to produce threat intelligence.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.7",
                "implementation_guidance": [
                    "Establish threat intelligence collection processes",
                    "Analyze threat data for relevance to the organization",
                    "Integrate threat intelligence into risk management",
                    "Share threat intelligence with relevant parties"
                ]
            },
            "A.5.8": {
                "name": "Information security in project management",
                "description": "Information security should be integrated into project management.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.8",
                "implementation_guidance": [
                    "Include security requirements in project planning",
                    "Conduct security risk assessments for projects",
                    "Integrate security reviews into project milestones",
                    "Ensure security is addressed in project deliverables"
                ]
            },
            "A.5.9": {
                "name": "Inventory of information and other associated assets",
                "description": "An inventory of information and other associated assets, including owners, should be developed and maintained.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.9",
                "implementation_guidance": [
                    "Create and maintain an asset inventory",
                    "Assign ownership for each asset",
                    "Classify assets based on criticality and sensitivity",
                    "Review and update the inventory regularly"
                ]
            },
            "A.5.10": {
                "name": "Acceptable use of information and other associated assets",
                "description": "Rules for the acceptable use and procedures for handling information and other associated assets should be identified, documented and implemented.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.10",
                "implementation_guidance": [
                    "Define acceptable use policies for information assets",
                    "Communicate acceptable use rules to all personnel",
                    "Implement procedures for handling sensitive information",
                    "Monitor compliance with acceptable use policies"
                ]
            },
            "A.5.11": {
                "name": "Return of assets",
                "description": "Personnel and other interested parties as appropriate should return all the organization's assets in their possession upon change or termination of their employment, contract or agreement.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.11",
                "implementation_guidance": [
                    "Establish a formal asset return process for departing personnel",
                    "Maintain records of all assets issued to personnel",
                    "Verify return of all physical and digital assets upon termination",
                    "Include asset return requirements in employment contracts and agreements"
                ]
            },
            "A.5.12": {
                "name": "Classification of information",
                "description": "Information should be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.12",
                "implementation_guidance": [
                    "Define an information classification scheme with clear levels",
                    "Classify information based on its value, sensitivity, and criticality",
                    "Assign classification responsibilities to information owners",
                    "Review and update classifications periodically or when context changes"
                ]
            },
            "A.5.13": {
                "name": "Labelling of information",
                "description": "An appropriate set of procedures for information labelling should be developed and implemented in accordance with the information classification scheme adopted by the organization.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.13",
                "implementation_guidance": [
                    "Develop labelling procedures aligned with the classification scheme",
                    "Apply labels to information in all formats (physical and digital)",
                    "Train personnel on proper labelling practices",
                    "Ensure labelling is consistent across systems and media"
                ]
            },
            "A.5.14": {
                "name": "Information transfer",
                "description": "Information transfer rules, procedures, or agreements should be in place for all types of transfer facilities within the organization and between the organization and other parties.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.14",
                "implementation_guidance": [
                    "Define policies and procedures for secure information transfer",
                    "Implement technical controls to protect information in transit",
                    "Establish agreements for information transfer with external parties",
                    "Maintain records of information transfers for audit purposes"
                ]
            },
            "A.5.15": {
                "name": "Access control",
                "description": "Rules to control physical and logical access to information and other associated assets should be established and implemented based on business and information security requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.15",
                "implementation_guidance": [
                    "Define and document an access control policy",
                    "Implement role-based access control mechanisms",
                    "Apply the principle of least privilege and need-to-know",
                    "Review access rights regularly and upon role changes"
                ]
            },
            "A.5.16": {
                "name": "Identity management",
                "description": "The full lifecycle of identities should be managed.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.16",
                "implementation_guidance": [
                    "Establish processes for identity provisioning and de-provisioning",
                    "Implement unique identity assignment for all users",
                    "Manage the full identity lifecycle from creation to deletion",
                    "Conduct periodic identity reviews and reconciliation"
                ]
            },
            "A.5.17": {
                "name": "Authentication information",
                "description": "Allocation and management of authentication information should be controlled by a management process including advising personnel on the appropriate handling of authentication information.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.17",
                "implementation_guidance": [
                    "Establish secure processes for allocating authentication credentials",
                    "Enforce strong password policies and multi-factor authentication",
                    "Educate users on protecting their authentication information",
                    "Implement controls for temporary and emergency authentication"
                ]
            },
            "A.5.18": {
                "name": "Access rights",
                "description": "Access rights to information and other associated assets should be provisioned, reviewed, modified and removed in accordance with the organization's topic-specific policy on and rules for access control.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.18",
                "implementation_guidance": [
                    "Implement formal access rights provisioning procedures",
                    "Conduct regular access rights reviews with asset owners",
                    "Promptly revoke or modify access upon role change or termination",
                    "Maintain audit logs of access rights changes"
                ]
            },
            "A.5.19": {
                "name": "Information security in supplier relationships",
                "description": "Processes and procedures should be defined and implemented to manage the information security risks associated with the use of supplier's products or services.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.19",
                "implementation_guidance": [
                    "Identify and document information security requirements for suppliers",
                    "Assess supplier security capabilities before engagement",
                    "Establish risk management processes for supplier relationships",
                    "Maintain a register of suppliers with access to sensitive information"
                ]
            },
            "A.5.20": {
                "name": "Addressing information security within supplier agreements",
                "description": "Relevant information security requirements should be established and agreed with each supplier based on the type of supplier relationship.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.20",
                "implementation_guidance": [
                    "Include information security clauses in all supplier contracts",
                    "Define security requirements, responsibilities, and obligations",
                    "Specify incident notification and response requirements",
                    "Address right-to-audit and compliance monitoring provisions"
                ]
            },
            "A.5.21": {
                "name": "Managing information security in the ICT supply chain",
                "description": "Processes and procedures should be defined and implemented to manage the information security risks associated with the ICT products and services supply chain.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.21",
                "implementation_guidance": [
                    "Map and document the ICT supply chain and its security risks",
                    "Define security requirements for ICT products and services acquisition",
                    "Implement controls to verify integrity of ICT supply chain components",
                    "Monitor and review ICT supply chain security practices regularly"
                ]
            },
            "A.5.22": {
                "name": "Monitoring, review and change management of supplier services",
                "description": "The organization should regularly monitor, review, evaluate and manage change in supplier information security practices and service delivery.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.22",
                "implementation_guidance": [
                    "Conduct regular reviews of supplier service delivery and security",
                    "Monitor supplier compliance with agreed security requirements",
                    "Manage changes to supplier services through a formal process",
                    "Reassess supplier risks when significant changes occur"
                ]
            },
            "A.5.23": {
                "name": "Information security for use of cloud services",
                "description": "Processes for acquisition, use, management and exit from cloud services should be established in accordance with the organization's information security requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.23",
                "implementation_guidance": [
                    "Define information security requirements for cloud service usage",
                    "Assess cloud provider security capabilities and certifications",
                    "Implement controls for data protection in cloud environments",
                    "Establish exit strategies and data portability plans for cloud services"
                ]
            },
            "A.5.24": {
                "name": "Information security incident management planning and preparation",
                "description": "The organization should plan and prepare for managing information security incidents by defining, establishing and communicating information security incident management processes, roles and responsibilities.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.24",
                "implementation_guidance": [
                    "Develop and document an information security incident management plan",
                    "Define incident response roles, responsibilities, and escalation procedures",
                    "Establish communication protocols for incident reporting and notification",
                    "Conduct regular incident response training and simulation exercises"
                ]
            },
            "A.5.25": {
                "name": "Assessment and decision on information security events",
                "description": "The organization should assess information security events and decide if they are to be categorized as information security incidents.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.25",
                "implementation_guidance": [
                    "Define criteria for categorizing security events as incidents",
                    "Implement a triage process for assessing security events",
                    "Assign trained personnel to evaluate and classify events",
                    "Document assessment decisions and rationale for categorization"
                ]
            },
            "A.5.26": {
                "name": "Response to information security incidents",
                "description": "Information security incidents should be responded to in accordance with the documented procedures.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.26",
                "implementation_guidance": [
                    "Execute incident response procedures as defined in the incident management plan",
                    "Contain, eradicate, and recover from security incidents promptly",
                    "Communicate with affected parties and stakeholders during incidents",
                    "Document all incident response actions and outcomes"
                ]
            },
            "A.5.27": {
                "name": "Learning from information security incidents",
                "description": "Knowledge gained from information security incidents should be used to strengthen and improve the information security controls.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.27",
                "implementation_guidance": [
                    "Conduct post-incident reviews and root cause analysis",
                    "Identify lessons learned and improvement opportunities",
                    "Update security controls, policies, and procedures based on findings",
                    "Share relevant lessons across the organization to prevent recurrence"
                ]
            },
            "A.5.28": {
                "name": "Collection of evidence",
                "description": "The organization should establish and implement procedures for the identification, collection, acquisition and preservation of evidence related to information security events.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.28",
                "implementation_guidance": [
                    "Define procedures for evidence collection that ensure admissibility",
                    "Implement chain of custody controls for digital and physical evidence",
                    "Train personnel on proper evidence handling and preservation techniques",
                    "Ensure evidence collection complies with legal and regulatory requirements"
                ]
            },
            "A.5.29": {
                "name": "Information security during disruption",
                "description": "The organization should plan how to maintain information security at an appropriate level during disruption.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.29",
                "implementation_guidance": [
                    "Integrate information security into business continuity planning",
                    "Define security controls that must be maintained during disruptions",
                    "Establish procedures for maintaining security in degraded operations",
                    "Test and validate security continuity plans regularly"
                ]
            },
            "A.5.30": {
                "name": "ICT readiness for business continuity",
                "description": "ICT readiness should be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.30",
                "implementation_guidance": [
                    "Identify ICT services and infrastructure critical to business operations",
                    "Define recovery time and recovery point objectives for ICT systems",
                    "Implement redundancy and failover mechanisms for critical ICT services",
                    "Conduct regular testing of ICT continuity and disaster recovery plans"
                ]
            },
            "A.5.31": {
                "name": "Legal, statutory, regulatory and contractual requirements",
                "description": "Legal, statutory, regulatory and contractual requirements relevant to information security and the organization's approach to meet these requirements should be identified, documented and kept up to date.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.31",
                "implementation_guidance": [
                    "Identify all applicable legal, regulatory, and contractual requirements",
                    "Maintain a register of compliance obligations related to information security",
                    "Assign responsibility for monitoring changes in requirements",
                    "Review and update compliance approaches when requirements change"
                ]
            },
            "A.5.32": {
                "name": "Intellectual property rights",
                "description": "The organization should implement appropriate procedures to protect intellectual property rights.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.32",
                "implementation_guidance": [
                    "Identify and document intellectual property assets and their protection needs",
                    "Ensure compliance with software licensing and copyright requirements",
                    "Implement controls to prevent unauthorized copying of proprietary materials",
                    "Train personnel on intellectual property rights and obligations"
                ]
            },
            "A.5.33": {
                "name": "Protection of records",
                "description": "Records should be protected from loss, destruction, falsification, unauthorized access and unauthorized release in accordance with legislatory, regulatory, contractual and business requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.33",
                "implementation_guidance": [
                    "Classify records according to retention and protection requirements",
                    "Implement secure storage and access controls for records",
                    "Define and enforce records retention and disposal schedules",
                    "Protect records against deterioration, loss, and unauthorized modification"
                ]
            },
            "A.5.34": {
                "name": "Privacy and protection of PII",
                "description": "The organization should identify and meet the requirements regarding the preservation of privacy and protection of PII as applicable according to relevant laws and regulations and contractual requirements.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.34",
                "implementation_guidance": [
                    "Identify all PII processed and applicable privacy regulations",
                    "Implement privacy impact assessments for systems processing PII",
                    "Apply data protection principles including data minimization and purpose limitation",
                    "Establish procedures for handling data subject rights requests"
                ]
            },
            "A.5.35": {
                "name": "Independent review of information security",
                "description": "The organization's approach to managing information security and its implementation including people, processes and technologies should be reviewed independently at planned intervals, or when significant changes occur.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.35",
                "implementation_guidance": [
                    "Schedule regular independent reviews of the information security program",
                    "Engage qualified internal or external auditors for reviews",
                    "Ensure reviews cover policies, processes, technologies, and personnel",
                    "Track and address findings from independent reviews"
                ]
            },
            "A.5.36": {
                "name": "Compliance with policies, rules and standards for information security",
                "description": "Compliance with the organization's information security policy, topic-specific policies, rules and standards should be regularly reviewed.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.36",
                "implementation_guidance": [
                    "Conduct regular compliance reviews of information security practices",
                    "Monitor adherence to security policies and standards across the organization",
                    "Report compliance status to management and relevant stakeholders",
                    "Implement corrective actions for identified non-conformities"
                ]
            },
            "A.5.37": {
                "name": "Documented operating procedures",
                "description": "Operating procedures for information processing facilities should be documented and made available to personnel who need them.",
                "control_type": "Organizational",
                "clause_reference": "ISO 27001:2022 Annex A, A.5.37",
                "implementation_guidance": [
                    "Document operating procedures for all critical information processing activities",
                    "Ensure procedures are accessible to authorized personnel who need them",
                    "Review and update operating procedures regularly and after changes",
                    "Implement version control and change management for operating procedures"
                ]
            }
        }
    },
    "A.6": {
        "name": "People Controls",
        "controls": {
            "A.6.1": {
                "name": "Screening",
                "description": "Background verification checks on all candidates to become personnel should be carried out prior to joining the organization and on an ongoing basis taking into consideration applicable laws, regulations and ethics and be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.1",
                "implementation_guidance": [
                    "Conduct background checks for new hires",
                    "Verify employment history and credentials",
                    "Check references",
                    "Comply with local laws and regulations"
                ]
            },
            "A.6.2": {
                "name": "Terms and conditions of employment",
                "description": "The employment contractual agreements should state the personnel's and the organization's responsibilities for information security.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.2",
                "implementation_guidance": [
                    "Include information security responsibilities in employment contracts",
                    "Define consequences for security policy violations",
                    "Specify confidentiality obligations that extend beyond employment",
                    "Ensure personnel acknowledge and accept security responsibilities"
                ]
            },
            "A.6.3": {
                "name": "Information security awareness, education and training",
                "description": "Personnel of the organization and relevant interested parties should receive appropriate information security awareness, education and training and regular updates of the organization's information security policy, topic-specific policies and procedures, as relevant for their job function.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.3",
                "implementation_guidance": [
                    "Develop and deliver security awareness training programs",
                    "Provide role-specific security training for relevant personnel",
                    "Conduct regular security awareness campaigns and updates",
                    "Measure and track training effectiveness and completion"
                ]
            },
            "A.6.4": {
                "name": "Disciplinary process",
                "description": "A disciplinary process should be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.4",
                "implementation_guidance": [
                    "Establish a formal disciplinary process for security violations",
                    "Communicate the disciplinary process to all personnel",
                    "Ensure the process is fair, proportionate, and consistently applied",
                    "Document all disciplinary actions and outcomes"
                ]
            },
            "A.6.5": {
                "name": "Responsibilities after termination or change of employment",
                "description": "Information security responsibilities and duties that remain valid after termination or change of employment should be defined, enforced and communicated to relevant personnel and other interested parties.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.5",
                "implementation_guidance": [
                    "Define ongoing security obligations after employment changes",
                    "Communicate continuing confidentiality requirements",
                    "Enforce non-disclosure agreements beyond termination",
                    "Revoke access rights promptly upon role change or departure"
                ]
            },
            "A.6.6": {
                "name": "Confidentiality or non-disclosure agreements",
                "description": "Confidentiality or non-disclosure agreements reflecting the organization's needs for the protection of information should be identified, documented, regularly reviewed and signed by personnel and other relevant interested parties.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.6",
                "implementation_guidance": [
                    "Identify requirements for confidentiality and non-disclosure agreements",
                    "Ensure all relevant personnel sign appropriate NDAs",
                    "Review and update NDAs periodically to reflect current needs",
                    "Maintain records of signed agreements and their terms"
                ]
            },
            "A.6.7": {
                "name": "Remote working",
                "description": "Security measures should be implemented when personnel are working remotely to protect information accessed, processed or stored outside the organization's premises.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.7",
                "implementation_guidance": [
                    "Define remote working security policies and guidelines",
                    "Implement secure connectivity solutions such as VPN",
                    "Ensure endpoint security for remote devices",
                    "Address physical security of information in remote locations"
                ]
            },
            "A.6.8": {
                "name": "Information security event reporting",
                "description": "The organization should provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner.",
                "control_type": "People",
                "clause_reference": "ISO 27001:2022 Annex A, A.6.8",
                "implementation_guidance": [
                    "Establish clear reporting channels for security events",
                    "Train personnel to recognize and report security events",
                    "Implement a process for timely triage of reported events",
                    "Provide feedback to reporters on reported events where appropriate"
                ]
            }
        }
    },
    "A.7": {
        "name": "Physical Controls",
        "controls": {
            "A.7.1": {
                "name": "Physical security perimeters",
                "description": "Security perimeters should be defined and used to protect areas that contain information and other associated assets.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.1",
                "implementation_guidance": [
                    "Define physical security perimeters around sensitive areas",
                    "Implement barriers such as walls, fences, and locked doors",
                    "Monitor perimeters with surveillance and intrusion detection",
                    "Review and test perimeter security controls regularly"
                ]
            },
            "A.7.2": {
                "name": "Physical entry",
                "description": "Secure areas should be protected by appropriate entry controls and access points.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.2",
                "implementation_guidance": [
                    "Implement access control systems for secure areas",
                    "Verify identity and authorization before granting physical access",
                    "Maintain visitor logs and escort procedures",
                    "Review and audit physical access records regularly"
                ]
            },
            "A.7.3": {
                "name": "Securing offices, rooms and facilities",
                "description": "Physical security for offices, rooms and facilities should be designed and implemented.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.3",
                "implementation_guidance": [
                    "Assess security requirements for offices, rooms, and facilities",
                    "Implement appropriate physical security measures for each area",
                    "Restrict knowledge of activities within secure areas",
                    "Ensure vacant secure areas are locked and checked periodically"
                ]
            },
            "A.7.4": {
                "name": "Physical security monitoring",
                "description": "Premises should be continuously monitored for unauthorized physical access.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.4",
                "implementation_guidance": [
                    "Install surveillance systems such as CCTV in critical areas",
                    "Implement intrusion detection and alarm systems",
                    "Monitor and review security footage and alerts",
                    "Maintain and test monitoring equipment regularly"
                ]
            },
            "A.7.5": {
                "name": "Protecting against physical and environmental threats",
                "description": "Protection against physical and environmental threats, such as natural disasters and other intentional or unintentional physical threats to infrastructure should be designed and implemented.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.5",
                "implementation_guidance": [
                    "Assess risks from physical and environmental threats",
                    "Implement fire suppression and flood prevention systems",
                    "Design facilities to withstand relevant natural disasters",
                    "Establish emergency response plans for physical threats"
                ]
            },
            "A.7.6": {
                "name": "Working in secure areas",
                "description": "Security measures for working in secure areas should be designed and implemented.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.6",
                "implementation_guidance": [
                    "Define and communicate rules for working in secure areas",
                    "Restrict use of recording devices in secure areas",
                    "Supervise work by third parties in secure areas",
                    "Ensure secure areas are locked when unoccupied"
                ]
            },
            "A.7.7": {
                "name": "Clear desk and clear screen",
                "description": "Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities should be defined and appropriately enforced.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.7",
                "implementation_guidance": [
                    "Define and communicate clear desk and clear screen policies",
                    "Implement automatic screen locking after inactivity",
                    "Provide secure storage for sensitive documents",
                    "Conduct periodic compliance checks for clear desk rules"
                ]
            },
            "A.7.8": {
                "name": "Equipment siting and protection",
                "description": "Equipment should be sited securely and protected.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.8",
                "implementation_guidance": [
                    "Site equipment to minimize unnecessary access and environmental risks",
                    "Protect equipment from power failures and environmental hazards",
                    "Control environmental conditions such as temperature and humidity",
                    "Implement physical security for equipment housing sensitive data"
                ]
            },
            "A.7.9": {
                "name": "Security of assets off-premises",
                "description": "Off-site assets should be protected.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.9",
                "implementation_guidance": [
                    "Define security requirements for off-premises assets",
                    "Implement encryption and physical protection for portable equipment",
                    "Establish rules for safe transport and storage of assets",
                    "Maintain records of assets taken off-premises"
                ]
            },
            "A.7.10": {
                "name": "Storage media",
                "description": "Storage media should be managed through their lifecycle in accordance with the organization's classification scheme and handling requirements.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.10",
                "implementation_guidance": [
                    "Implement procedures for managing removable storage media",
                    "Apply appropriate handling based on information classification",
                    "Securely erase or destroy media when no longer required",
                    "Maintain an inventory and tracking system for storage media"
                ]
            },
            "A.7.11": {
                "name": "Supporting utilities",
                "description": "Information processing facilities should be protected from power failures and other disruptions caused by failures in supporting utilities.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.11",
                "implementation_guidance": [
                    "Install uninterruptible power supply (UPS) systems",
                    "Implement backup power generators for critical facilities",
                    "Regularly test and maintain supporting utility systems",
                    "Monitor utility supply and alert on failures or anomalies"
                ]
            },
            "A.7.12": {
                "name": "Cabling security",
                "description": "Cables carrying power, data or supporting information services should be protected from interception, interference or damage.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.12",
                "implementation_guidance": [
                    "Route cables through secure conduits and pathways",
                    "Separate power cables from communications cables",
                    "Use shielded cabling in areas prone to interference",
                    "Inspect and maintain cabling infrastructure regularly"
                ]
            },
            "A.7.13": {
                "name": "Equipment maintenance",
                "description": "Equipment should be maintained correctly to ensure availability, integrity and confidentiality of information.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.13",
                "implementation_guidance": [
                    "Establish scheduled maintenance programs for all equipment",
                    "Use only authorized maintenance personnel and service providers",
                    "Maintain records of all maintenance activities and faults",
                    "Verify equipment functionality after maintenance"
                ]
            },
            "A.7.14": {
                "name": "Secure disposal or re-use of equipment",
                "description": "Items of equipment containing storage media should be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use.",
                "control_type": "Physical",
                "clause_reference": "ISO 27001:2022 Annex A, A.7.14",
                "implementation_guidance": [
                    "Implement secure data wiping procedures before equipment disposal",
                    "Physically destroy storage media that cannot be securely wiped",
                    "Maintain records of equipment disposal and data destruction",
                    "Verify data removal before releasing equipment for re-use"
                ]
            }
        }
    },
    "A.8": {
        "name": "Technological Controls",
        "controls": {
            "A.8.1": {
                "name": "User endpoint devices",
                "description": "Information stored on, processed by or accessible via user endpoint devices should be protected.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.1",
                "implementation_guidance": [
                    "Implement endpoint protection solutions on all user devices",
                    "Define and enforce endpoint security policies and configurations",
                    "Enable remote wipe and device management capabilities",
                    "Ensure encryption of data on endpoint devices"
                ]
            },
            "A.8.2": {
                "name": "Privileged access rights",
                "description": "The allocation and use of privileged access rights should be restricted and managed.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.2",
                "implementation_guidance": [
                    "Identify and restrict privileged access rights to authorized personnel",
                    "Implement privileged access management (PAM) solutions",
                    "Monitor and log all privileged access activities",
                    "Review privileged access rights regularly and revoke when no longer needed"
                ]
            },
            "A.8.3": {
                "name": "Information access restriction",
                "description": "Access to information and other associated assets should be restricted in accordance with the established topic-specific policy on access control.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.3",
                "implementation_guidance": [
                    "Implement access control mechanisms based on business requirements",
                    "Restrict access to information based on classification and need-to-know",
                    "Use technical controls to enforce access restrictions",
                    "Monitor and audit access to sensitive information"
                ]
            },
            "A.8.4": {
                "name": "Access to source code",
                "description": "Read and write access to source code, development tools and software libraries should be appropriately managed.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.4",
                "implementation_guidance": [
                    "Restrict source code access to authorized development personnel",
                    "Implement version control systems with access controls",
                    "Monitor and log access to source code repositories",
                    "Protect source code from unauthorized modification"
                ]
            },
            "A.8.5": {
                "name": "Secure authentication",
                "description": "Secure authentication technologies and procedures should be implemented based on information access restrictions and the topic-specific policy on access control.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.5",
                "implementation_guidance": [
                    "Implement multi-factor authentication for critical systems",
                    "Use secure authentication protocols and technologies",
                    "Enforce strong password policies and complexity requirements",
                    "Protect authentication credentials during transmission and storage"
                ]
            },
            "A.8.6": {
                "name": "Capacity management",
                "description": "The use of resources should be monitored and adjusted in line with current and expected capacity requirements.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.6",
                "implementation_guidance": [
                    "Monitor system resource utilization continuously",
                    "Forecast future capacity requirements based on trends",
                    "Implement alerting for capacity thresholds",
                    "Plan and implement capacity upgrades proactively"
                ]
            },
            "A.8.7": {
                "name": "Protection against malware",
                "description": "Protection against malware should be implemented and supported by appropriate user awareness.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.7",
                "implementation_guidance": [
                    "Deploy and maintain anti-malware solutions across all systems",
                    "Keep malware definitions and signatures up to date",
                    "Train users to recognize and avoid malware threats",
                    "Implement email and web filtering to block malicious content"
                ]
            },
            "A.8.8": {
                "name": "Management of technical vulnerabilities",
                "description": "Information about technical vulnerabilities of information systems in use should be obtained, the organization's exposure to such vulnerabilities should be evaluated and appropriate measures should be taken.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.8",
                "implementation_guidance": [
                    "Establish a vulnerability management program",
                    "Conduct regular vulnerability scans and assessments",
                    "Prioritize and remediate vulnerabilities based on risk",
                    "Monitor vulnerability intelligence sources for new threats"
                ]
            },
            "A.8.9": {
                "name": "Configuration management",
                "description": "Configurations, including security configurations, of hardware, software, services and networks should be established, documented, implemented, monitored and reviewed.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.9",
                "implementation_guidance": [
                    "Define and document standard security configurations",
                    "Implement configuration management tools and processes",
                    "Monitor configurations for unauthorized changes",
                    "Review and update configurations regularly"
                ]
            },
            "A.8.10": {
                "name": "Information deletion",
                "description": "Information stored in information systems, devices or in any other storage media should be deleted when no longer required.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.10",
                "implementation_guidance": [
                    "Define information retention periods and deletion schedules",
                    "Implement secure deletion methods appropriate to data sensitivity",
                    "Verify successful deletion of information",
                    "Maintain records of information deletion activities"
                ]
            },
            "A.8.11": {
                "name": "Data masking",
                "description": "Data masking should be used in accordance with the organization's topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.11",
                "implementation_guidance": [
                    "Identify data requiring masking based on classification and regulations",
                    "Implement appropriate masking techniques for different data types",
                    "Ensure masked data retains utility for authorized purposes",
                    "Test and validate data masking effectiveness"
                ]
            },
            "A.8.12": {
                "name": "Data leakage prevention",
                "description": "Data leakage prevention measures should be applied to systems, networks and any other devices that process, store or transmit sensitive information.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.12",
                "implementation_guidance": [
                    "Implement data loss prevention (DLP) tools and policies",
                    "Monitor data flows for unauthorized transfers of sensitive information",
                    "Define rules for detecting and blocking data leakage attempts",
                    "Investigate and respond to DLP alerts promptly"
                ]
            },
            "A.8.13": {
                "name": "Information backup",
                "description": "Backup copies of information, software and systems should be maintained and regularly tested in accordance with the agreed topic-specific policy on backup.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.13",
                "implementation_guidance": [
                    "Define backup policies covering frequency, scope, and retention",
                    "Implement automated backup processes for critical data and systems",
                    "Test backup restoration procedures regularly",
                    "Store backups securely, including off-site or cloud-based copies"
                ]
            },
            "A.8.14": {
                "name": "Redundancy of information processing facilities",
                "description": "Information processing facilities should be implemented with redundancy sufficient to meet availability requirements.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.14",
                "implementation_guidance": [
                    "Identify availability requirements for information processing facilities",
                    "Implement redundant components and failover mechanisms",
                    "Test redundancy and failover capabilities regularly",
                    "Monitor system availability and respond to failures promptly"
                ]
            },
            "A.8.15": {
                "name": "Logging",
                "description": "Logs that record activities, exceptions, faults and other relevant events should be produced, stored, protected and analyzed.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.15",
                "implementation_guidance": [
                    "Define logging requirements for all critical systems and applications",
                    "Implement centralized log management and analysis solutions",
                    "Protect log integrity from tampering and unauthorized access",
                    "Review and analyze logs regularly for security events"
                ]
            },
            "A.8.16": {
                "name": "Monitoring activities",
                "description": "Networks, systems and applications should be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.16",
                "implementation_guidance": [
                    "Implement security monitoring tools and SIEM solutions",
                    "Define monitoring rules and alerting thresholds",
                    "Monitor for anomalous behaviour and indicators of compromise",
                    "Investigate and respond to monitoring alerts in a timely manner"
                ]
            },
            "A.8.17": {
                "name": "Clock synchronization",
                "description": "The clocks of information processing systems used by the organization should be synchronized to approved time sources.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.17",
                "implementation_guidance": [
                    "Configure all systems to synchronize with approved NTP sources",
                    "Ensure consistent time zone configuration across systems",
                    "Monitor clock synchronization accuracy and alert on drift",
                    "Document time synchronization requirements and configurations"
                ]
            },
            "A.8.18": {
                "name": "Use of privileged utility programs",
                "description": "The use of utility programs that can be capable of overriding system and application controls should be restricted and tightly controlled.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.18",
                "implementation_guidance": [
                    "Identify and inventory privileged utility programs",
                    "Restrict access to privileged utilities to authorized personnel only",
                    "Log and monitor the use of privileged utility programs",
                    "Remove or disable unnecessary privileged utilities"
                ]
            },
            "A.8.19": {
                "name": "Installation of software on operational systems",
                "description": "Procedures and measures should be implemented to securely manage software installation on operational systems.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.19",
                "implementation_guidance": [
                    "Define policies for software installation on operational systems",
                    "Restrict software installation to authorized personnel",
                    "Validate software integrity before installation",
                    "Maintain records of installed software and versions"
                ]
            },
            "A.8.20": {
                "name": "Networks security",
                "description": "Networks and network devices should be secured, managed and controlled to protect information in systems and applications.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.20",
                "implementation_guidance": [
                    "Implement network security controls such as firewalls and IDS/IPS",
                    "Define and enforce network security architecture and policies",
                    "Monitor network traffic for security threats and anomalies",
                    "Regularly review and update network security configurations"
                ]
            },
            "A.8.21": {
                "name": "Security of network services",
                "description": "Security mechanisms, service levels and service requirements of network services should be identified, implemented and monitored.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.21",
                "implementation_guidance": [
                    "Define security requirements for all network services",
                    "Include security provisions in network service agreements",
                    "Monitor network service performance and security compliance",
                    "Implement secure configurations for network services"
                ]
            },
            "A.8.22": {
                "name": "Segregation of networks",
                "description": "Groups of information services, users and information systems should be segregated in the organization's networks.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.22",
                "implementation_guidance": [
                    "Design network architecture with appropriate segmentation",
                    "Implement VLANs and network zones based on security requirements",
                    "Control traffic between network segments with firewalls and ACLs",
                    "Review and validate network segregation effectiveness regularly"
                ]
            },
            "A.8.23": {
                "name": "Web filtering",
                "description": "Access to external websites should be managed to reduce exposure to malicious content.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.23",
                "implementation_guidance": [
                    "Implement web filtering solutions to block malicious websites",
                    "Define and maintain web access policies and URL categories",
                    "Monitor and log web browsing activity",
                    "Update web filtering rules to address emerging threats"
                ]
            },
            "A.8.24": {
                "name": "Use of cryptography",
                "description": "Rules for the effective use of cryptography, including cryptographic key management, should be defined and implemented.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.24",
                "implementation_guidance": [
                    "Define a cryptography policy covering algorithms, key lengths, and usage",
                    "Implement cryptographic key management procedures",
                    "Use encryption for data at rest and in transit as required",
                    "Review and update cryptographic controls to maintain effectiveness"
                ]
            },
            "A.8.25": {
                "name": "Secure development lifecycle",
                "description": "Rules for the secure development of software and systems should be established and applied.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.25",
                "implementation_guidance": [
                    "Integrate security practices into all phases of the development lifecycle",
                    "Define secure development standards and coding guidelines",
                    "Conduct security reviews at each development phase",
                    "Provide security training for development personnel"
                ]
            },
            "A.8.26": {
                "name": "Application security requirements",
                "description": "Information security requirements should be identified, specified and approved when developing or acquiring applications.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.26",
                "implementation_guidance": [
                    "Define security requirements during application design and specification",
                    "Include security requirements in application procurement processes",
                    "Validate that applications meet defined security requirements",
                    "Review application security requirements when changes occur"
                ]
            },
            "A.8.27": {
                "name": "Secure system architecture and engineering principles",
                "description": "Principles for engineering secure systems should be established, documented, maintained and applied to any information system development activities.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.27",
                "implementation_guidance": [
                    "Document secure system architecture and engineering principles",
                    "Apply defense-in-depth and least privilege design principles",
                    "Review system architectures against security principles",
                    "Update security engineering principles based on emerging threats"
                ]
            },
            "A.8.28": {
                "name": "Secure coding",
                "description": "Secure coding principles should be applied to software development.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.28",
                "implementation_guidance": [
                    "Establish and enforce secure coding standards and guidelines",
                    "Conduct code reviews with a focus on security vulnerabilities",
                    "Use automated static and dynamic analysis tools",
                    "Train developers on common vulnerabilities and secure coding practices"
                ]
            },
            "A.8.29": {
                "name": "Security testing in development and acceptance",
                "description": "Security testing processes should be defined and implemented in the development lifecycle.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.29",
                "implementation_guidance": [
                    "Define security testing requirements for all development projects",
                    "Conduct penetration testing and vulnerability assessments",
                    "Include security criteria in acceptance testing procedures",
                    "Document and track security testing results and remediation"
                ]
            },
            "A.8.30": {
                "name": "Outsourced development",
                "description": "The organization should direct, monitor and review the activities related to outsourced system development.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.30",
                "implementation_guidance": [
                    "Define security requirements for outsourced development activities",
                    "Include security clauses in outsourced development contracts",
                    "Monitor and review outsourced development security practices",
                    "Conduct security testing of outsourced developed systems"
                ]
            },
            "A.8.31": {
                "name": "Separation of development, test and production environments",
                "description": "Development, testing and production environments should be separated and secured.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.31",
                "implementation_guidance": [
                    "Maintain separate development, testing, and production environments",
                    "Implement access controls between environments",
                    "Prevent production data from being used in development and testing without safeguards",
                    "Define and enforce procedures for promoting code between environments"
                ]
            },
            "A.8.32": {
                "name": "Change management",
                "description": "Changes to information processing facilities and information systems should be subject to change management procedures.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.32",
                "implementation_guidance": [
                    "Establish formal change management procedures",
                    "Assess the security impact of proposed changes",
                    "Test changes before deployment to production",
                    "Maintain records of all changes and their approvals"
                ]
            },
            "A.8.33": {
                "name": "Test information",
                "description": "Test information should be appropriately selected, protected and managed.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.33",
                "implementation_guidance": [
                    "Avoid using production data for testing where possible",
                    "Anonymize or mask sensitive data used in testing",
                    "Protect test data with appropriate access controls",
                    "Remove test data after testing is complete"
                ]
            },
            "A.8.34": {
                "name": "Protection of information systems during audit testing",
                "description": "Audit tests and other assurance activities involving assessment of operational systems should be planned and agreed between the tester and appropriate management.",
                "control_type": "Technological",
                "clause_reference": "ISO 27001:2022 Annex A, A.8.34",
                "implementation_guidance": [
                    "Plan and coordinate audit testing activities with management",
                    "Minimize disruption to operational systems during audit testing",
                    "Protect audit tools and results from unauthorized access",
                    "Document audit testing scope, procedures, and outcomes"
                ]
            }
        }
    }
}


def get_all_controls():
    """Get all ISO 27001 controls as a flat list."""
    all_controls = []
    for category_id, category in ISO_27001_CONTROLS.items():
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
    for category_id, category in ISO_27001_CONTROLS.items():
        if control_id in category["controls"]:
            return category["controls"][control_id]
    return None


def get_controls_by_category(category: str):
    """Get all controls in a category."""
    for category_id, cat_data in ISO_27001_CONTROLS.items():
        if cat_data["name"].lower() == category.lower():
            return cat_data["controls"]
    return {}
