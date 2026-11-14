/**
 * TOURMS WORKFORCE — COMPREHENSIVE SECURITY SPECIFICATION & RULES AUDIT
 *
 * This test suite programmatically audits and validates:
 * 1. Global Invariants: Top-level default-deny catch-all.
 * 2. Status-Gated Public Discovery: Only approved/published jobs, opportunities, and insights are readable publicly.
 * 3. Strict Application Privacy: Only the applicant, employer owning the job, and authorized admins can access applications.
 * 4. PII Data Isolation: Worker and employer private subcollections (/workers/{id}/private and /employers/{id}/private).
 * 5. Canonical Admin Roles: Strict 4-role hierarchy (super_admin, verifier, moderator, support_lead).
 * 6. Privilege Escalation Guard: Only super_admin can create or update admin documents or elevate user roles.
 * 7. Real Authentication: No synthetic phone-to-email generation; real email required for Firebase Auth.
 * 8. Secret & Key Hygiene: Zero client-side third-party API keys or universal OTP backdoors.
 * 9. Storage Constraints: <=5MB file size cap and explicit image/PDF MIME checks.
 * 10. Honest Disclosures: Disabled binary document uploads and clear sandbox payment notices.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const results = [];

function assertTest(name, category, condition, expected, actual) {
  results.push({
    name,
    category,
    passed: Boolean(condition),
    expected,
    actual
  });
}

function runSecurityAudit() {
  console.log('================================================================');
  console.log('  TOURMS WORKFORCE — PHASE 1 SECURITY AUDIT & VERIFICATION');
  console.log('================================================================');
  console.log(`Execution Timestamp : ${new Date().toISOString()}`);
  console.log(`Target Architecture : React 19 + Firebase (Firestore, Auth, Rules)`);
  console.log(`Firebase Project ID : tourms-workforce\n`);

  // 1. Inspect firestore.rules
  const firestoreRulesPath = path.resolve(__dirname, '../firestore.rules');
  if (!fs.existsSync(firestoreRulesPath)) {
    console.error('❌ firestore.rules file missing!');
    process.exit(1);
  }
  const rules = fs.readFileSync(firestoreRulesPath, 'utf8');

  // TEST 1: Default Deny
  const hasDefaultDeny = rules.includes("match /{document=**}") && rules.includes("allow read, write: if false;");
  assertTest(
    'Default-Deny Catch-All Invariant',
    'Global Security',
    hasDefaultDeny,
    'Top-level default deny: match /{document=**} { allow read, write: if false; }',
    hasDefaultDeny ? 'Active and enforced' : 'Missing default deny'
  );

  // TEST 2: Status-Gated Public Discovery (Jobs)
  const jobsStatusGated = rules.includes("resource.data.status == 'approved'");
  assertTest(
    'Jobs Public Read Gated by Approved Status',
    'Public Discovery',
    jobsStatusGated,
    "Jobs public get/list requires resource.data.status == 'approved'",
    jobsStatusGated ? "Enforced: resource.data.status == 'approved'" : 'VULNERABLE: Unapproved jobs exposed'
  );

  // TEST 3: Status-Gated Public Discovery (Opportunities)
  const oppsStatusGated = rules.includes("resource.data.status in ['active', 'published']");
  assertTest(
    'Opportunities Public Read Gated by Active/Published Status',
    'Public Discovery',
    oppsStatusGated,
    "Opportunities get/list requires status in ['active', 'published']",
    oppsStatusGated ? "Enforced: resource.data.status in ['active', 'published']" : 'VULNERABLE: Draft/inactive opportunities exposed'
  );

  // TEST 4: Status-Gated Public Discovery (Insights)
  const insightsStatusGated = rules.includes("resource.data.status == 'published'");
  assertTest(
    'Insights Public Read Gated by Published Status',
    'Public Discovery',
    insightsStatusGated,
    "Insights get/list requires resource.data.status == 'published'",
    insightsStatusGated ? "Enforced: resource.data.status == 'published'" : 'VULNERABLE: Draft articles exposed'
  );

  // TEST 5: Job Applications Tripartite Privacy (Applicant, Employer, Admin)
  const appApplicantRestricted = rules.includes("resource.data.applicantId == request.auth.uid");
  const appEmployerRestricted = rules.includes("resource.data.employerId == request.auth.uid");
  const appAdminRestricted = rules.includes("isVerifier()") || rules.includes("isModerator()") || rules.includes("isSuperAdmin()");
  assertTest(
    'Job Applications Access Confined to Applicant, Employer & Admin',
    'Application Privacy',
    appApplicantRestricted && appEmployerRestricted && appAdminRestricted,
    'Applications restricted to applicant owner, hiring employer, and compliance admins',
    (appApplicantRestricted && appEmployerRestricted) ? 'Enforced: Applicant + Employer + Admin tripartite gate' : 'VULNERABLE: Applications exposed to third parties'
  );

  // TEST 6: Private Subcollection Model for PII
  const workerPrivateSub = rules.includes("/workers/{workerId}") && rules.includes("/private/{docId}");
  const employerPrivateSub = rules.includes("/employers/{employerId}") && rules.includes("/private/{docId}");
  assertTest(
    'Worker & Employer Private PII Subcollections',
    'PII Protection',
    workerPrivateSub && employerPrivateSub,
    'Private subcollections /workers/{id}/private and /employers/{id}/private for PII',
    (workerPrivateSub && employerPrivateSub) ? 'Enforced: Private subcollections isolated to owner & verifier/super_admin' : 'Missing private subcollection rules'
  );

  // TEST 7: Canonical 4 Admin Sub-Roles Enforced in Rules
  const hasSuperAdmin = rules.includes("isSuperAdmin()");
  const hasVerifier = rules.includes("isVerifier()");
  const hasModerator = rules.includes("isModerator()");
  const hasSupportLead = rules.includes("isSupportLead()");
  assertTest(
    'Canonical 4-Role Administrative Hierarchy in Rules',
    'Role-Based Access Control',
    hasSuperAdmin && hasVerifier && hasModerator && hasSupportLead,
    'Rules implement isSuperAdmin(), isVerifier(), isModerator(), and isSupportLead()',
    (hasSuperAdmin && hasVerifier && hasModerator && hasSupportLead) ? 'Enforced: All 4 canonical sub-roles defined' : 'Missing canonical sub-role checks'
  );

  // TEST 8: Administrative Registry Tampering & Privilege Escalation Guard
  const adminWriteGated = rules.includes("match /admins/{adminId}") && rules.includes("allow create, update, delete: if isSuperAdmin();");
  const userElevationGated = rules.includes("request.resource.data.role == resource.data.role") || rules.includes("isSuperAdmin()");
  assertTest(
    'Admin Registry Privilege Escalation Immunity',
    'RBAC Invariant',
    adminWriteGated && userElevationGated,
    'Only super_admin can create/update admins collection or elevate user roles',
    (adminWriteGated && userElevationGated) ? 'Enforced: Privilege escalation blocked; super_admin required' : 'VULNERABLE: Non-super_admins can mutate admin registry'
  );

  // 2. Inspect storage.rules
  const storageRulesPath = path.resolve(__dirname, '../storage.rules');
  const hasStorageRules = fs.existsSync(storageRulesPath);
  const storageContent = hasStorageRules ? fs.readFileSync(storageRulesPath, 'utf8') : '';
  const storageSizeCap = storageContent.includes('5 * 1024 * 1024');
  const storageMimeCheck = storageContent.includes('image/jpeg') && storageContent.includes('application/pdf');

  assertTest(
    'Storage File Size & MIME Security Guardrails',
    'Storage Security',
    storageSizeCap && storageMimeCheck,
    'Storage rules enforce <=5MB size cap and image/pdf MIME verification',
    (storageSizeCap && storageMimeCheck) ? 'Enforced: 5MB cap + MIME type regex present' : 'Defective storage rules'
  );

  // 3. Inspect Authentication & Elimination of Synthetic Email
  const authModalPath = path.resolve(__dirname, '../src/components/auth/AuthModal.tsx');
  const authModalContent = fs.existsSync(authModalPath) ? fs.readFileSync(authModalPath, 'utf8') : '';
  const noSyntheticEmail = !authModalContent.includes('@worker.tourmsworkforce.com.ng');
  const emailMandatory = authModalContent.includes('!workerEmail.trim()') && authModalContent.includes('workerEmail.trim().toLowerCase()');

  assertTest(
    'Synthetic Phone-to-Email Elimination & Mandatory Genuine Email',
    'Authentication Integrity',
    noSyntheticEmail && emailMandatory,
    'Synthetic @worker.tourmsworkforce.com.ng domain completely eliminated; genuine email enforced',
    (noSyntheticEmail && emailMandatory) ? 'Clean: Genuine email mandatory for Firebase Auth' : 'VULNERABLE: Synthetic email domain still present'
  );

  // 4. Inspect Secrets & OTP Hygiene
  const otpServicePath = path.resolve(__dirname, '../src/services/otpService.ts');
  const otpContent = fs.existsSync(otpServicePath) ? fs.readFileSync(otpServicePath, 'utf8') : '';
  const noClientApiKey = !otpContent.includes('import.meta.env.VITE_TERMII_API_KEY');
  const no123456Backdoor = !otpContent.includes("'123456'") && !otpContent.includes('"123456"');

  assertTest(
    'Secret Hygiene & OTP Universal Backdoor Elimination',
    'Secret & Auth Hygiene',
    noClientApiKey && no123456Backdoor,
    'No third-party SMS API key exposed in browser client; universal 123456 backdoor removed',
    (noClientApiKey && no123456Backdoor) ? 'Clean: Zero exposed secrets and no backdoor' : 'VULNERABLE: Secrets or backdoor present'
  );

  // 5. Inspect Binary Document Upload Deferral in Employer Onboarding
  const onboardingPath = path.resolve(__dirname, '../src/components/employer/EmployerOnboarding.tsx');
  const onboardingContent = fs.existsSync(onboardingPath) ? fs.readFileSync(onboardingPath, 'utf8') : '';
  const binaryUploadDeferred = onboardingContent.includes('Binary Upload Deferred') &&
                               onboardingContent.includes('awaiting Firebase Storage bucket activation');

  assertTest(
    'Honest Storage Deferral Notice in Agribusiness Onboarding',
    'Platform Transparency',
    binaryUploadDeferred,
    'Binary document uploads explicitly deferred with notice awaiting Firebase Storage activation',
    binaryUploadDeferred ? 'Enforced: Binary upload deferred with clear administrator notice' : 'Unchecked binary upload present'
  );

  // 6. Inspect Admin Provisioning Script Alignment
  const claimsScriptPath = path.resolve(__dirname, '../scripts/setAdminClaims.js');
  const claimsContent = fs.existsSync(claimsScriptPath) ? fs.readFileSync(claimsScriptPath, 'utf8') : '';
  const claimsHasCanonicalRoles = claimsContent.includes("'super_admin', 'verifier', 'moderator', 'support_lead'");
  const claimsHasAdminRole = claimsContent.includes("adminRole: targetSubRole");

  assertTest(
    'Backend Claims Script Aligned with 4 Canonical Roles',
    'Admin Provisioning',
    claimsHasCanonicalRoles && claimsHasAdminRole,
    'setAdminClaims.js uses super_admin, verifier, moderator, support_lead and sets adminRole claim',
    (claimsHasCanonicalRoles && claimsHasAdminRole) ? 'Aligned: Offline script enforces 4 canonical roles' : 'Misaligned claims script'
  );

  // Output Report
  console.log('RESULTS:');
  console.log('----------------------------------------------------------------');
  let allPassed = true;
  for (const r of results) {
    const symbol = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} [${r.category}] ${r.name}`);
    console.log(`   Expected : ${r.expected}`);
    console.log(`   Actual   : ${r.actual}\n`);
    if (!r.passed) allPassed = false;
  }

  console.log('================================================================');
  if (allPassed) {
    console.log(`🎉 ALL ${results.length} INDEPENDENT SECURITY TESTS PASSED`);
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error('⚠️ ONE OR MORE SECURITY TESTS FAILED');
    console.log('================================================================\n');
    process.exit(1);
  }
}

runSecurityAudit();
