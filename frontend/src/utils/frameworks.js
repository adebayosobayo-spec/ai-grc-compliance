// Central framework definitions used across all pages
export const FRAMEWORKS = {
    ISO_27001: { label: 'ISO 27001', full: 'ISO/IEC 27001:2022', desc: 'Information Security Management' },
    ISO_42001: { label: 'ISO 42001', full: 'ISO/IEC 42001:2023', desc: 'AI Governance' },
    NDPR: { label: 'NDPR', full: 'Nigeria Data Protection Regulation', desc: 'Nigerian Data Protection' },
    GDPR: { label: 'GDPR', full: 'EU General Data Protection Regulation', desc: 'EU Data Protection' },
    UK_GDPR: { label: 'UK GDPR', full: 'UK General Data Protection Regulation', desc: 'UK Data Protection' },
    POPIA: { label: 'POPIA', full: 'Protection of Personal Information Act', desc: 'South African Data Protection' },
    LGPD: { label: 'LGPD', full: 'Lei Geral de Proteção de Dados', desc: 'Brazilian Data Protection' },
    CCPA: { label: 'CCPA/CPRA', full: 'California Consumer Privacy Act / CPRA', desc: 'California Privacy' },
    PDPA: { label: 'PDPA', full: 'Personal Data Protection Act', desc: 'Singapore/Thailand Data Protection' },
}

export function getFrameworkLabel(key) {
    return FRAMEWORKS[key]?.label || key
}

export function getFrameworkFull(key) {
    return FRAMEWORKS[key]?.full || key
}

// Options array for radio/select groups
export const FRAMEWORK_OPTIONS = Object.entries(FRAMEWORKS).map(([value, fw]) => ({
    value,
    label: `${fw.label} — ${fw.desc}`,
}))
