export const ASSESSMENT_SECTIONS = [
  {
    id: 'A',
    title: 'AI Governance & Leadership',
    questions: [
      { id: 'A1', text: 'Do you have a documented AI policy?', type: 'yesno' },
      { id: 'A2', text: 'Is there a designated AI governance owner?', type: 'yesno' },
      { id: 'A3', text: 'Does your board/leadership formally review AI governance?', type: 'yesno_inprog' },
      { id: 'A4', text: 'Have you documented your AI system inventory?', type: 'yesno' },
      { id: 'A5', text: 'Do you have incident response procedures for AI systems?', type: 'yesno' },
      { id: 'A6', text: 'Have you conducted an AI impact assessment?', type: 'yesno' },
    ]
  },
  {
    id: 'B',
    title: 'Data Governance for AI',
    questions: [
      { id: 'B1', text: 'Do you track data lineage for AI training data?', type: 'yesno' },
      { id: 'B2', text: 'Do you have data quality standards?', type: 'yesno' },
      { id: 'B3', text: 'Are you using personal data in your AI systems?', type: 'yesno' },
      { id: 'B4', text: 'Do you have processes to remove biased training data?', type: 'yesno' },
      { id: 'B5', text: 'Do you document all data sources used?', type: 'yesno' },
      { id: 'B6', text: 'Is sensitive/regulated data properly governed?', type: 'yesno' },
      { id: 'B7', text: 'Do you have data retention policies?', type: 'yesno' },
      { id: 'B8', text: 'Can you explain where AI decisions come from (explainability)?', type: 'yesno' },
    ]
  },
  {
    id: 'C',
    title: 'AI System Development & Testing',
    questions: [
      { id: 'C1', text: 'Do you test for AI model bias?', type: 'yesno' },
      { id: 'C2', text: 'Do you perform adversarial testing?', type: 'yesno' },
      { id: 'C3', text: 'Do you monitor model performance post-deployment?', type: 'yesno' },
      { id: 'C4', text: 'Do you have version control for AI models?', type: 'yesno' },
      { id: 'C5', text: 'Do you document model limitations and failure modes?', type: 'yesno' },
      { id: 'C6', text: 'Is there human review before deployment?', type: 'yesno' },
      { id: 'C7', text: 'Do you have rollback procedures if an AI system fails?', type: 'yesno' },
      { id: 'C8', text: 'Do you test for fairness/accuracy across demographics?', type: 'yesno' },
    ]
  },
  {
    id: 'D',
    title: 'Deployment & Monitoring',
    questions: [
      { id: 'D1', text: 'Do you monitor AI system performance in production?', type: 'yesno' },
      { id: 'D2', text: 'Can you detect AI drift (changing performance over time)?', type: 'yesno' },
      { id: 'D3', text: 'Do you have alerts for AI system failures?', type: 'yesno' },
      { id: 'D4', text: 'Do you log decisions made by AI systems?', type: 'yesno' },
      { id: 'D5', text: 'Can you quickly disable an AI system if needed?', type: 'yesno' },
      { id: 'D6', text: 'Do you have change management for AI updates?', type: 'yesno' },
      { id: 'D7', text: 'Do you document the reason for AI decisions?', type: 'yesno' },
      { id: 'D8', text: 'Do you have security controls around your AI models?', type: 'yesno' },
    ]
  },
  {
    id: 'E',
    title: 'Third-Party AI Systems',
    questions: [
      { id: 'E1', text: 'Do you use third-party AI (e.g., OpenAI, Claude API)?', type: 'yesno' },
      { id: 'E2', text: 'Do you have contracts with AI vendors?', type: 'yesno' },
      { id: 'E3', text: 'Do you understand how vendors use your data?', type: 'yesno' },
      { id: 'E4', text: 'Do you assess vendor security & compliance?', type: 'yesno' },
      { id: 'E5', text: 'Do you have data protection agreements (DPAs)?', type: 'yesno' },
      { id: 'E6', text: 'Do you know your AI vendors\' data retention policies?', type: 'yesno' },
    ]
  },
  {
    id: 'F',
    title: 'Ethics, Transparency & Compliance',
    questions: [
      { id: 'F1', text: 'Do you have an AI ethics framework or policy?', type: 'yesno' },
      { id: 'F2', text: 'Do you disclose to users when AI is making decisions?', type: 'yesno' },
      { id: 'F3', text: 'Can users appeal AI decisions?', type: 'yesno' },
      { id: 'F4', text: 'Do you comply with GDPR/CCPA regarding AI?', type: 'yesno' },
    ]
  },
];
