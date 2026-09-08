/**
 * Mock Scheme Data — SIH 130 Industrial Platform
 *
 * Centralized, realistic mock schemes for the Schemes & Incentives module.
 * All schemes are based on real Maharashtra/Central Government schemes.
 * Benefit figures and eligibility rules are representative, not legally authoritative.
 *
 * In production: replace with GET /api/v1/schemes
 */

import type { Scheme } from '@/types/scheme.types';

const now = new Date();
const closingSoon = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString();
const nextYear = new Date(now.getFullYear() + 1, 2, 31).toISOString(); // March 31 next year
const twoYears = new Date(now.getFullYear() + 2, 2, 31).toISOString();

export const MOCK_SCHEMES: Scheme[] = [
  // ── Scheme 1: Maharashtra Package Scheme of Incentives ──────────────────
  {
    id: 'sch_001',
    name: 'Maharashtra Package Scheme of Incentives (PSI)',
    department: 'Industries, Energy and Labour Department, Maharashtra',
    governmentLevel: 'state',
    state: 'Maharashtra',
    category: 'capital_subsidy',
    benefitType: ['capital_subsidy', 'electricity_duty_exemption', 'tax_benefit'],
    benefitSummary: 'Capital subsidy on fixed assets, electricity duty exemption, and local body tax benefits',
    benefitDetails: `Under the PSI, eligible industrial units in classified talukas receive:
- Capital subsidy ranging from 25% to 100% of eligible fixed capital investment (depending on taluka classification)
- Exemption from electricity duty for 7–15 years
- Exemption from stamp duty on land purchase and lease agreements
- Waiver of local body taxes for 5–10 years
Exact percentages depend on the taluka category (A, B, C, D, D+, No Industry District).`,
    description: 'The Package Scheme of Incentives provides a comprehensive set of fiscal incentives to new and expanding industrial units in Maharashtra to encourage industrial investment and balanced regional development.',
    eligibilitySummary: 'Manufacturing units in Maharashtra eligible for capital subsidy, electricity duty exemption, and tax benefits based on taluka classification.',
    whoCanApply: [
      'New manufacturing units set up in Maharashtra after the scheme notification date',
      'Existing units undertaking substantial expansion (minimum 25% increase in fixed capital investment)',
      'Units with a minimum fixed capital investment of ₹25 lakh',
      'Units that have not commenced commercial production before filing the application',
      'Micro, Small, and Medium Enterprises (MSMEs) as defined under the MSMED Act',
    ],
    applicationProcess: [
      'Register the unit and obtain MSME/Udyam Registration (if applicable)',
      'Obtain all mandatory approvals (Factory License, Pollution Consent, etc.)',
      'File the application with the District Industries Centre (DIC) within 12 months of commencement of commercial production',
      'District-level Joint Committee inspection of the unit',
      'State-level approval committee review',
      'Incentive disbursement in annual installments as per scheme guidelines',
    ],
    applicationStartDate: null,
    applicationEndDate: twoYears,
    schemeValidityInfo: 'Valid under Maharashtra Industrial Policy 2023. Applications accepted on a rolling basis until scheme end date.',
    officialSourceLabel: 'Maharashtra Industries Department — PSI Guidelines',
    officialSourceUrl: null, // Production: 'https://industries.maharashtra.gov.in'
    status: 'open',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_001_r01',
        schemeId: 'sch_001',
        profileField: 'state',
        operator: 'eq',
        expectedValue: 'Maharashtra',
        label: 'Business registered in Maharashtra',
        description: 'The PSI scheme is exclusively available to industrial units established within the state of Maharashtra.',
        requiredValueLabel: 'Maharashtra',
        isMandatory: true,
      },
      {
        id: 'sch_001_r02',
        schemeId: 'sch_001',
        profileField: 'sector',
        operator: 'in',
        expectedValue: ['manufacturing'],
        label: 'Manufacturing sector',
        description: 'Only manufacturing units are eligible for PSI benefits. Service sector units are not covered.',
        requiredValueLabel: 'Manufacturing',
        isMandatory: true,
      },
      {
        id: 'sch_001_r03',
        schemeId: 'sch_001',
        profileField: 'investmentLakh',
        operator: 'gte',
        expectedValue: 25,
        label: 'Minimum investment of ₹25 lakh',
        description: 'The unit must have a fixed capital investment of at least ₹25 lakh in land, building, plant, and machinery.',
        requiredValueLabel: '₹25 lakh or above',
        isMandatory: true,
      },
      {
        id: 'sch_001_r04',
        schemeId: 'sch_001',
        profileField: 'isGSTRegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'GST registered unit',
        description: 'The unit must have a valid GST registration to be eligible for fiscal incentives.',
        requiredValueLabel: 'Yes',
        isMandatory: true,
      },
      {
        id: 'sch_001_r05',
        schemeId: 'sch_001',
        profileField: 'businessType',
        operator: 'in',
        expectedValue: ['private_limited', 'public_limited', 'partnership', 'llp', 'proprietorship'],
        label: 'Eligible legal entity type',
        description: 'The unit must be a recognized legal entity (company, partnership, LLP, or proprietorship).',
        requiredValueLabel: 'Company, Partnership, LLP, or Proprietorship',
        isMandatory: true,
      },
    ],
    documentRequirements: [
      { id: 'sch_001_d01', schemeId: 'sch_001', documentCategory: 'corporate', documentName: 'Certificate of Incorporation / Partnership Deed', description: 'Proof of entity registration', isMandatory: true },
      { id: 'sch_001_d02', schemeId: 'sch_001', documentCategory: 'tax', documentName: 'GST Registration Certificate', description: 'Valid GST registration', isMandatory: true },
      { id: 'sch_001_d03', schemeId: 'sch_001', documentCategory: 'factory', documentName: 'Factory License', description: 'License under the Factories Act, if applicable', isMandatory: false },
      { id: 'sch_001_d04', schemeId: 'sch_001', documentCategory: 'financial', documentName: 'Investment Certificate / CA Certificate', description: 'Chartered Accountant certificate certifying the fixed capital investment', isMandatory: true },
      { id: 'sch_001_d05', schemeId: 'sch_001', documentCategory: 'identity', documentName: 'PAN Card (Company/Entity)', description: 'PAN of the legal entity', isMandatory: true },
    ],
    relatedApprovalIds: ['app_cat_001', 'app_cat_003'],
    tags: ['capital subsidy', 'Maharashtra', 'manufacturing', 'MSME', 'PSI'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-01T00:00:00Z',
  },

  // ── Scheme 2: PM Vishwakarma Yojana ─────────────────────────────────────
  {
    id: 'sch_002',
    name: 'PM Vishwakarma Yojana',
    department: 'Ministry of Micro, Small and Medium Enterprises, Government of India',
    governmentLevel: 'central',
    category: 'msme_support',
    benefitType: ['training_reimbursement', 'technology_subsidy', 'loan_guarantee'],
    benefitSummary: 'Collateral-free loans at concessional rate, skill training with stipend, and modern toolkits',
    benefitDetails: `PM Vishwakarma provides end-to-end support to traditional artisans and craftspeople:
- Recognition as Vishwakarma through PM Vishwakarma certificate and ID card
- Skill Training: 5-7 days basic training with daily stipend of ₹500; 15+ days advanced training
- Modern Toolkit: Up to ₹15,000 toolkit incentive via e-voucher
- Collateral-free credit support: Loan of up to ₹1 lakh (1st tranche) and ₹2 lakh (2nd tranche) at 5% concessional interest rate
- Digital transaction incentive: ₹1 per digital transaction, up to 100 transactions per month for 1 year
- Marketing support through linkage with national/international trade fairs`,
    description: 'PM Vishwakarma is a Central Government scheme to support artisans and craftspeople engaged in 18 traditional trades. It provides skills training, modern tools, collateral-free credit, and market linkage support.',
    eligibilitySummary: 'Traditional artisans and craftspeople working with hands and tools in 18 specified trade categories. MSME registration is beneficial but not mandatory.',
    whoCanApply: [
      'Artisans/craftspeople working in one of 18 specified trade categories',
      'Individual engaged in the trade on a self-employment basis (not salaried)',
      'Minimum age of 18 years at the time of registration',
      'Family should not have availed a loan under PMEGP/PM SVANidhi/Mudra in the last 5 years',
      'Should not be enrolled in similar Central/State Government schemes',
    ],
    applicationProcess: [
      'Apply online through the PM Vishwakarma portal or nearest Common Service Centre (CSC)',
      'Verify identity using Aadhaar biometrics',
      'Gram Panchayat / ULB verification of trade details',
      'District Implementation Committee approval',
      'Issuance of PM Vishwakarma certificate and credit card',
      'Enrollment in skill training program',
    ],
    applicationStartDate: null,
    applicationEndDate: null, // Ongoing scheme
    schemeValidityInfo: 'Ongoing scheme with a total outlay of ₹13,000 crore for the period 2023-24 to 2027-28.',
    officialSourceLabel: 'PM Vishwakarma Official Portal',
    officialSourceUrl: null,
    status: 'ongoing',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_002_r01',
        schemeId: 'sch_002',
        profileField: 'sector',
        operator: 'in',
        expectedValue: ['manufacturing', 'artisan', 'crafts'],
        label: 'Manufacturing or artisan sector',
        description: 'Scheme targets traditional manufacturing, artisan, and craft-based businesses.',
        requiredValueLabel: 'Manufacturing / Artisan / Crafts',
        isMandatory: true,
      },
      {
        id: 'sch_002_r02',
        schemeId: 'sch_002',
        profileField: 'isMSMERegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'MSME / Udyam Registration',
        description: 'Udyam (MSME) registration is required to access credit benefits under the scheme.',
        requiredValueLabel: 'Yes — Udyam Registration',
        isMandatory: true,
      },
      {
        id: 'sch_002_r03',
        schemeId: 'sch_002',
        profileField: 'investmentLakh',
        operator: 'lte',
        expectedValue: 500,
        label: 'Investment within MSME limits',
        description: 'The unit\'s investment must be within MSME classification limits (up to ₹500 crore for medium enterprises).',
        requiredValueLabel: 'Up to ₹500 lakh',
        isMandatory: false,
      },
      {
        id: 'sch_002_r04',
        schemeId: 'sch_002',
        profileField: 'isStartup',
        operator: 'eq',
        expectedValue: false,
        label: 'Not registered as a formal startup',
        description: 'This scheme targets traditional artisans, not formally registered technology startups.',
        requiredValueLabel: 'Traditional artisan/craftsman setup',
        isMandatory: false,
      },
    ],
    documentRequirements: [
      { id: 'sch_002_d01', schemeId: 'sch_002', documentCategory: 'identity', documentName: 'Aadhaar Card', description: 'For identity verification via biometrics', isMandatory: true },
      { id: 'sch_002_d02', schemeId: 'sch_002', documentCategory: 'corporate', documentName: 'Udyam Registration Certificate', description: 'MSME/Udyam registration', isMandatory: true },
      { id: 'sch_002_d03', schemeId: 'sch_002', documentCategory: 'financial', documentName: 'Bank Account Details', description: 'Bank passbook or cancelled cheque for subsidy disbursement', isMandatory: true },
    ],
    relatedApprovalIds: [],
    tags: ['MSME', 'artisan', 'skill training', 'credit', 'PM Vishwakarma', 'central'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z',
  },

  // ── Scheme 3: MSME Technology Upgrade Fund ───────────────────────────────
  {
    id: 'sch_003',
    name: 'Credit Linked Capital Subsidy Scheme (CLCSS) for Technology Upgradation',
    department: 'Ministry of MSME, Government of India — Implemented via SIDBI/Scheduled Banks',
    governmentLevel: 'central',
    category: 'technology_adoption',
    benefitType: ['capital_subsidy', 'technology_subsidy'],
    benefitSummary: '15% capital subsidy (up to ₹15 lakh) on institutional credit for technology upgradation',
    benefitDetails: `The Credit Linked Capital Subsidy Scheme (CLCSS) facilitates technology upgradation:
- Upfront capital subsidy of 15% on institutional credit up to ₹1 crore
- Maximum subsidy amount: ₹15 lakh per eligible unit
- Subsidy is credited directly to the borrower's loan account, reducing principal outstanding
- Applicable for new or improved well-established technology in specified sub-sectors
- Eligible for technology upgradation in plant and machinery, not for land and building`,
    description: 'The CLCSS for Technology Upgradation provides upfront capital subsidy to small-scale industrial units to facilitate technology upgradation in approved sub-sectors/products. It is implemented through scheduled banks and SIDBI.',
    eligibilitySummary: 'Small-scale manufacturing units (SSIs) with Udyam registration seeking technology upgradation with institutional credit.',
    whoCanApply: [
      'Micro and Small Enterprises (MSEs) as per the MSMED Act 2006',
      'Units that have taken institutional credit for technology upgradation',
      'Units engaged in manufacturing in specified eligible product/sub-sectors',
      'Both new and existing units upgrading from pre-approved technology to an improved technology',
    ],
    applicationProcess: [
      'Identify technology to be upgraded and the eligible sub-sector',
      'Obtain term loan from a scheduled bank or SIDBI for plant and machinery',
      'Bank submits subsidy claim to the Nodal Agency on behalf of the MSE',
      'Nodal Agency (SIDBI/SBI) processes and disburses subsidy to the lending institution',
      'Bank credits subsidy to the borrower\'s loan account',
    ],
    applicationStartDate: null,
    applicationEndDate: closingSoon, // Closing soon
    schemeValidityInfo: 'Scheme under periodic review. Current approval period ends this financial year. Apply before closing date.',
    officialSourceLabel: 'Ministry of MSME — CLCSS Scheme Guidelines',
    officialSourceUrl: null,
    status: 'closing_soon',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_003_r01',
        schemeId: 'sch_003',
        profileField: 'isMSMERegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'MSME / Udyam Registration required',
        description: 'The unit must hold valid Udyam Registration as a Micro or Small Enterprise.',
        requiredValueLabel: 'Udyam Registered Micro/Small Enterprise',
        isMandatory: true,
      },
      {
        id: 'sch_003_r02',
        schemeId: 'sch_003',
        profileField: 'sector',
        operator: 'in',
        expectedValue: ['manufacturing'],
        label: 'Manufacturing sector',
        description: 'CLCSS is applicable to manufacturing MSEs only, not service-sector enterprises.',
        requiredValueLabel: 'Manufacturing',
        isMandatory: true,
      },
      {
        id: 'sch_003_r03',
        schemeId: 'sch_003',
        profileField: 'investmentLakh',
        operator: 'lte',
        expectedValue: 500,
        label: 'Investment within Micro/Small enterprise limits',
        description: 'Only Micro and Small enterprises (investment ≤ ₹50 crore for small) are eligible.',
        requiredValueLabel: 'Up to ₹500 lakh (Small Enterprise)',
        isMandatory: true,
      },
      {
        id: 'sch_003_r04',
        schemeId: 'sch_003',
        profileField: 'isGSTRegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'GST registration required',
        description: 'Valid GST registration is required for availing this scheme.',
        requiredValueLabel: 'Yes',
        isMandatory: true,
      },
    ],
    documentRequirements: [
      { id: 'sch_003_d01', schemeId: 'sch_003', documentCategory: 'corporate', documentName: 'Udyam Registration Certificate', description: 'MSME registration as Micro/Small Enterprise', isMandatory: true },
      { id: 'sch_003_d02', schemeId: 'sch_003', documentCategory: 'tax', documentName: 'GST Certificate', description: 'Valid GST registration', isMandatory: true },
      { id: 'sch_003_d03', schemeId: 'sch_003', documentCategory: 'financial', documentName: 'Term Loan Sanction Letter', description: 'Bank sanction letter for the technology upgradation loan', isMandatory: true },
      { id: 'sch_003_d04', schemeId: 'sch_003', documentCategory: 'financial', documentName: 'Investment Certificate / CA Certificate', description: 'CA-certified investment in plant and machinery', isMandatory: true },
    ],
    relatedApprovalIds: ['app_cat_001'],
    tags: ['technology', 'MSME', 'capital subsidy', 'CLCSS', 'manufacturing', 'central'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
  },

  // ── Scheme 4: Employment Generation (NOT ELIGIBLE — investment too low) ──
  {
    id: 'sch_004',
    name: 'Employment Generation Subsidy Scheme — Maharashtra',
    department: 'Directorate of Employment & Self Employment, Maharashtra',
    governmentLevel: 'state',
    state: 'Maharashtra',
    category: 'employment_incentives',
    benefitType: ['employment_incentive'],
    benefitSummary: '50% reimbursement of EPF/ESIC contributions for new employment created (first 3 years)',
    benefitDetails: `The Employment Generation Subsidy Scheme reimburses the employer's share of:
- 50% of the employer's EPF contribution for new employees hired
- 50% of the employer's ESIC contribution for new employees hired
- Benefits applicable for 3 years from the date of hiring
- Minimum 50 new permanent employment positions must be created
- Reimbursement disbursed quarterly on verification of EPF/ESIC payment proofs`,
    description: 'The Employment Generation Subsidy Scheme encourages large-scale employment creation by reimbursing employer EPF/ESIC contributions for new hires. The scheme targets units creating significant new employment in the state.',
    eligibilitySummary: 'Manufacturing units in Maharashtra creating minimum 50 new permanent jobs. Investment threshold of ₹50 lakh applies.',
    whoCanApply: [
      'Manufacturing units registered in Maharashtra',
      'Units creating minimum 50 new permanent employment positions',
      'Units with fixed capital investment of at least ₹50 lakh',
      'Units with valid GST and MSME registration',
      'New units or substantially expanded existing units',
    ],
    applicationProcess: [
      'Register on the scheme portal with company details',
      'Submit application with employment creation plan',
      'DIC verification of employment numbers',
      'Maintain EPF/ESIC payment proofs for new employees',
      'File quarterly reimbursement claims',
    ],
    applicationStartDate: null,
    applicationEndDate: nextYear,
    schemeValidityInfo: 'Available under Maharashtra Employment Policy 2024. Applications until March next year.',
    officialSourceLabel: 'Directorate of Employment, Maharashtra',
    officialSourceUrl: null,
    status: 'open',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_004_r01',
        schemeId: 'sch_004',
        profileField: 'state',
        operator: 'eq',
        expectedValue: 'Maharashtra',
        label: 'Business registered in Maharashtra',
        description: 'Only units located and operating within Maharashtra are eligible.',
        requiredValueLabel: 'Maharashtra',
        isMandatory: true,
      },
      {
        id: 'sch_004_r02',
        schemeId: 'sch_004',
        profileField: 'sector',
        operator: 'in',
        expectedValue: ['manufacturing'],
        label: 'Manufacturing sector',
        description: 'Scheme targets manufacturing units only.',
        requiredValueLabel: 'Manufacturing',
        isMandatory: true,
      },
      {
        id: 'sch_004_r03',
        schemeId: 'sch_004',
        profileField: 'investmentLakh',
        operator: 'gte',
        expectedValue: 50,
        label: 'Minimum investment of ₹50 lakh',
        description: 'Fixed capital investment of at least ₹50 lakh is required for this scheme.',
        requiredValueLabel: '₹50 lakh or above',
        isMandatory: true,
      },
      {
        id: 'sch_004_r04',
        schemeId: 'sch_004',
        profileField: 'employeeCount',
        operator: 'gte',
        expectedValue: 50,
        label: 'Minimum 50 new employees created',
        description: 'The unit must create at least 50 new permanent employment positions.',
        requiredValueLabel: '50 or more employees',
        isMandatory: true,
      },
    ],
    documentRequirements: [
      { id: 'sch_004_d01', schemeId: 'sch_004', documentCategory: 'corporate', documentName: 'Certificate of Incorporation', description: 'Company registration document', isMandatory: true },
      { id: 'sch_004_d02', schemeId: 'sch_004', documentCategory: 'tax', documentName: 'GST Registration Certificate', description: 'Valid GST registration', isMandatory: true },
      { id: 'sch_004_d03', schemeId: 'sch_004', documentCategory: 'financial', documentName: 'EPF/ESIC Registration Certificate', description: 'Proof of EPF/ESIC registration for employees', isMandatory: true },
      { id: 'sch_004_d04', schemeId: 'sch_004', documentCategory: 'financial', documentName: 'Investment Certificate / CA Certificate', description: 'CA-certified fixed capital investment', isMandatory: true },
    ],
    relatedApprovalIds: ['app_cat_004'],
    tags: ['employment', 'EPF', 'ESIC', 'Maharashtra', 'manufacturing', 'subsidy'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-07-15T00:00:00Z',
  },

  // ── Scheme 5: Women Entrepreneurship — NOT ELIGIBLE for this business ────
  {
    id: 'sch_005',
    name: 'Maharashtra Women Entrepreneurship Development Scheme',
    department: 'Women and Child Development Department, Maharashtra',
    governmentLevel: 'state',
    state: 'Maharashtra',
    category: 'women_entrepreneurship',
    benefitType: ['capital_subsidy', 'training_reimbursement'],
    benefitSummary: 'Additional 5% capital subsidy for women-led enterprises + skill training support',
    benefitDetails: `Women Entrepreneurship Development Scheme benefits include:
- Additional 5% capital subsidy over and above the standard PSI subsidy rate
- Free skill development training up to 1 month duration
- Priority access to government industrial sheds and plots
- Mentorship support from Women Entrepreneurship Development Cell
- Interest subsidy on working capital loans up to 5%`,
    description: 'The Women Entrepreneurship Development Scheme provides additional fiscal incentives and support to enterprises owned and managed by women entrepreneurs in Maharashtra, complementing the standard PSI incentives.',
    eligibilitySummary: 'Enterprises where at least 51% ownership is held by women, operating in manufacturing or service sectors in Maharashtra.',
    whoCanApply: [
      'Enterprises with at least 51% ownership held by women entrepreneurs',
      'Individual women entrepreneurs or women-led groups',
      'Women Self Help Groups (SHGs) and Women Producer Organizations',
      'Units registered in Maharashtra under any eligible business structure',
    ],
    applicationProcess: [
      'Submit declaration of women ownership with CA certification',
      'Apply through DIC with supporting documents',
      'Women Entrepreneurship Cell verification',
      'Approval and benefit disbursement',
    ],
    applicationStartDate: null,
    applicationEndDate: nextYear,
    schemeValidityInfo: 'Ongoing scheme under Maharashtra Industrial Policy 2023.',
    officialSourceLabel: 'Maharashtra WCD Department — Scheme Guidelines',
    officialSourceUrl: null,
    status: 'open',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_005_r01',
        schemeId: 'sch_005',
        profileField: 'state',
        operator: 'eq',
        expectedValue: 'Maharashtra',
        label: 'Business registered in Maharashtra',
        description: 'Only Maharashtra-registered units are eligible.',
        requiredValueLabel: 'Maharashtra',
        isMandatory: true,
      },
      {
        id: 'sch_005_r02',
        schemeId: 'sch_005',
        profileField: 'ownershipCategory',
        operator: 'eq',
        expectedValue: 'women',
        label: 'Women-led enterprise (≥51% women ownership)',
        description: 'At least 51% of the enterprise must be owned by women to be eligible for this scheme.',
        requiredValueLabel: 'Women-owned enterprise',
        isMandatory: true,
      },
      {
        id: 'sch_005_r03',
        schemeId: 'sch_005',
        profileField: 'isMSMERegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'MSME / Udyam Registration',
        description: 'Valid Udyam registration is required.',
        requiredValueLabel: 'Yes',
        isMandatory: false,
      },
    ],
    documentRequirements: [
      { id: 'sch_005_d01', schemeId: 'sch_005', documentCategory: 'corporate', documentName: 'Certificate of Incorporation with women director proof', description: 'Shows women\'s majority ownership', isMandatory: true },
      { id: 'sch_005_d02', schemeId: 'sch_005', documentCategory: 'identity', documentName: 'PAN Card of Woman Promoter', description: 'Identity proof of the woman entrepreneur', isMandatory: true },
    ],
    relatedApprovalIds: [],
    tags: ['women', 'entrepreneurship', 'Maharashtra', 'subsidy', 'WCD'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },

  // ── Scheme 6: Green Manufacturing Initiative ─────────────────────────────
  {
    id: 'sch_006',
    name: 'Green Manufacturing Initiative — Pollution Control Board',
    department: 'Maharashtra Pollution Control Board & Industries Department',
    governmentLevel: 'state',
    state: 'Maharashtra',
    category: 'green_sustainability',
    benefitType: ['technology_subsidy', 'interest_reimbursement'],
    benefitSummary: 'Interest subsidy on green technology investments and fast-track pollution clearance',
    benefitDetails: `Green Manufacturing Initiative benefits:
- 4% interest subsidy on institutional credit taken for green technology upgradation
- Maximum subsidy amount: ₹10 lakh per unit per year for 5 years
- Fast-track Consent to Operate renewal for compliant units (30-day guarantee)
- Priority processing of environmental clearances
- Recognition as Green Industry unit with preferential treatment in government procurement`,
    description: 'The Green Manufacturing Initiative incentivizes industries to adopt cleaner production technologies, reduce pollution, and achieve higher environmental compliance standards through financial subsidies and process benefits.',
    eligibilitySummary: 'Manufacturing units in Maharashtra with valid Pollution Consent (CTO) investing in green/clean technology.',
    whoCanApply: [
      'Manufacturing units holding valid Consent to Operate (CTO)',
      'Units investing in pollution control, energy efficiency, or renewable energy',
      'Units with a clean compliance record with MPCB in the last 2 years',
      'Both MSMEs and large industries are eligible (different subsidy caps apply)',
    ],
    applicationProcess: [
      'Identify green technology investment (list approved technologies available on MPCB portal)',
      'Obtain institutional credit for the green technology',
      'Apply to MPCB regional office with investment details',
      'MPCB technical inspection of installed technology',
      'Subsidy disbursement quarterly',
    ],
    applicationStartDate: null,
    applicationEndDate: nextYear,
    schemeValidityInfo: 'Available under Maharashtra Climate Change Action Plan 2024-2029.',
    officialSourceLabel: 'Maharashtra Pollution Control Board',
    officialSourceUrl: null,
    status: 'open',
    isActive: true,
    eligibilityRules: [
      {
        id: 'sch_006_r01',
        schemeId: 'sch_006',
        profileField: 'state',
        operator: 'eq',
        expectedValue: 'Maharashtra',
        label: 'Business registered in Maharashtra',
        description: 'State scheme — only Maharashtra units qualify.',
        requiredValueLabel: 'Maharashtra',
        isMandatory: true,
      },
      {
        id: 'sch_006_r02',
        schemeId: 'sch_006',
        profileField: 'sector',
        operator: 'in',
        expectedValue: ['manufacturing'],
        label: 'Manufacturing sector',
        description: 'This scheme is specifically for manufacturing units requiring environmental compliance.',
        requiredValueLabel: 'Manufacturing',
        isMandatory: true,
      },
      {
        id: 'sch_006_r03',
        schemeId: 'sch_006',
        profileField: 'investmentLakh',
        operator: 'gte',
        expectedValue: 10,
        label: 'Minimum investment of ₹10 lakh',
        description: 'The green technology investment must be at least ₹10 lakh.',
        requiredValueLabel: '₹10 lakh or above',
        isMandatory: false,
      },
      {
        id: 'sch_006_r04',
        schemeId: 'sch_006',
        profileField: 'isGSTRegistered',
        operator: 'is_true',
        expectedValue: null,
        label: 'GST registered unit',
        description: 'Valid GST registration required.',
        requiredValueLabel: 'Yes',
        isMandatory: true,
      },
    ],
    documentRequirements: [
      { id: 'sch_006_d01', schemeId: 'sch_006', documentCategory: 'environment', documentName: 'Consent to Operate (CTO)', description: 'Valid pollution consent from MPCB', isMandatory: true },
      { id: 'sch_006_d02', schemeId: 'sch_006', documentCategory: 'corporate', documentName: 'Certificate of Incorporation', description: 'Company registration', isMandatory: true },
      { id: 'sch_006_d03', schemeId: 'sch_006', documentCategory: 'financial', documentName: 'Green Technology Investment Certificate', description: 'CA certificate for green technology investment', isMandatory: true },
    ],
    relatedApprovalIds: ['app_cat_003'],
    tags: ['green', 'environment', 'MPCB', 'Maharashtra', 'sustainability', 'CTO'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-08-15T00:00:00Z',
  },
];

/**
 * Category display labels — configurable, not hardcoded in JSX
 */
export const SCHEME_CATEGORY_LABELS: Record<string, string> = {
  capital_subsidy: 'Capital Subsidy',
  tax_incentives: 'Tax Incentives',
  interest_subsidy: 'Interest Subsidy',
  employment_incentives: 'Employment Incentives',
  startup_support: 'Startup Support',
  msme_support: 'MSME Support',
  export_incentives: 'Export Incentives',
  skill_development: 'Skill Development',
  technology_adoption: 'Technology Adoption',
  green_sustainability: 'Green & Sustainability',
  infrastructure: 'Infrastructure',
  women_entrepreneurship: 'Women Entrepreneurship',
  rural_regional: 'Rural & Regional Development',
  other: 'Other',
};

export const SCHEME_BENEFIT_TYPE_LABELS: Record<string, string> = {
  capital_subsidy: 'Capital Subsidy',
  interest_reimbursement: 'Interest Reimbursement',
  tax_benefit: 'Tax Benefit',
  electricity_duty_exemption: 'Electricity Duty Exemption',
  employment_incentive: 'Employment Incentive',
  training_reimbursement: 'Training Reimbursement',
  technology_subsidy: 'Technology Subsidy',
  loan_guarantee: 'Loan Guarantee',
  grant: 'Grant',
  other: 'Other',
};

export const SCHEME_APPLICATION_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  closing_soon: 'Closing Soon',
  closed: 'Closed',
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
};
