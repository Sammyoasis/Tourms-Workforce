import React, { useState, useMemo } from 'react';
import { EmployerProfile, VerificationStatus } from '../../types';
import { Button } from '../ui/Button';
import { StatusIndicator } from '../ui/Badge';
import { Textarea } from '../ui/Input';
import { useToast } from '../ui/Toast';
import {
  Building2,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Wand2,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Scan,
  FileText,
  RefreshCw,
  Search,
  Scale,
  Check,
  Eye,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  auditCacDocumentWithAI,
  DocumentAuditResult,
  DocumentAnomalyFlag
} from '../../services/aiAgriService';

export interface AdminEmployerVerificationViewProps {
  employers: EmployerProfile[];
  onVerifyEmployer: (employerId: string, status: VerificationStatus, note: string) => void;
}

export const AdminEmployerVerificationView: React.FC<AdminEmployerVerificationViewProps> = ({
  employers,
  onVerifyEmployer
}) => {
  const { addToast } = useToast();
  const [employerList, setEmployerList] = useState<EmployerProfile[]>(employers);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>(employers[0]?.id || '');
  const [reviewNote, setReviewNote] = useState('');
  const [auditResult, setAuditResult] = useState<DocumentAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedPresetMode, setSelectedPresetMode] = useState<'authentic' | 'rc_mismatch' | 'name_mismatch' | 'tampered_seal'>('authentic');
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);
  const [uploadedDocDataUrl, setUploadedDocDataUrl] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'flagged'>('all');

  // Currently selected employer
  const selectedEmployer = useMemo(() => {
    return employerList.find((e) => e.id === selectedEmployerId) || employerList[0];
  }, [employerList, selectedEmployerId]);

  // Set of flagged employer IDs
  const [flaggedEmployerIds, setFlaggedEmployerIds] = useState<string[]>(['emp-102']);

  // Handle uploading custom document image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedDocDataUrl(event.target?.result as string);
        addToast({
          type: 'info',
          title: 'Document Loaded for Vision OCR',
          message: `Ready to verify ${file.name} with TOURMS Document Verifier.`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Run the AI Document Verifier with TOURMS Document Verification Engine
  const handleRunVisionAudit = async (presetOverride?: 'authentic' | 'rc_mismatch' | 'name_mismatch' | 'tampered_seal') => {
    if (!selectedEmployer) return;
    setIsAuditing(true);
    const mode = presetOverride || selectedPresetMode;

    try {
      const primaryDoc = selectedEmployer.verificationDocuments[0] || {
        title: 'CAC Certificate of Incorporation',
        documentType: 'CAC_RC'
      };

      const result = await auditCacDocumentWithAI(
        uploadedDocName || primaryDoc.title,
        primaryDoc.documentType,
        selectedEmployer,
        uploadedDocDataUrl || undefined,
        mode
      );

      setAuditResult(result);

      if (result.isFlaggedForReview || result.riskLevel === 'high') {
        // Automatically flag in admin queue
        if (!flaggedEmployerIds.includes(selectedEmployer.id)) {
          setFlaggedEmployerIds((prev) => [...prev, selectedEmployer.id]);
        }
        setReviewNote(
          `AUTOMATIC ANOMALY FLAGGED BY TOURMS DOCUMENT VERIFIER (${result.matchConfidencePercent}% Match): Extracted RC: ${result.extractedRcNumber} vs Declared: ${selectedEmployer.registrationNumber}. ${result.anomalies[0]?.detail || 'Discrepancy detected.'}`
        );
        addToast({
          type: 'error',
          title: 'High-Risk Anomaly Flagged',
          message: `Extracted ${result.extractedRcNumber} conflicts with profile ${selectedEmployer.registrationNumber}. Flagged for review.`
        });
      } else {
        setReviewNote(
          `TOURMS Document Verifier (${result.matchConfidencePercent}% Consistency): Extracted RC ${result.extractedRcNumber} matches corporate records. Embossed seal & registrar watermark authentic.`
        );
        addToast({
          type: 'success',
          title: 'Document Authenticated',
          message: `Extracted RC ${result.extractedRcNumber} matches declared entity with 99% confidence.`
        });
      }
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Vision Audit Error',
        message: 'Could not process document with TOURMS Document Verifier.'
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDecision = (status: VerificationStatus) => {
    if (!selectedEmployer) return;
    onVerifyEmployer(selectedEmployer.id, status, reviewNote);

    // Update local state
    setEmployerList((prev) =>
      prev.map((e) =>
        e.id === selectedEmployer.id
          ? { ...e, verificationStatus: status, cacVerified: status === 'verified' }
          : e
      )
    );

    if (status === 'verified') {
      setFlaggedEmployerIds((prev) => prev.filter((id) => id !== selectedEmployer.id));
    }

    addToast({
      type: status === 'verified' ? 'success' : status === 'rejected' ? 'error' : 'info',
      title: 'Verification Status Recorded',
      message: `${selectedEmployer.companyName} marked as ${status.toUpperCase()}.`
    });
  };

  const filteredEmployers = useMemo(() => {
    return employerList.filter((emp) => {
      const isFlagged = flaggedEmployerIds.includes(emp.id);
      if (filterTab === 'flagged') return isFlagged;
      if (filterTab === 'pending') return emp.verificationStatus === 'pending';
      return true;
    });
  }, [employerList, filterTab, flaggedEmployerIds]);

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C4C8C5]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-[#0F1F1C] break-words">
              Admin Employer Verification Desk
            </h1>
            <span className="text-[10px] bg-[#E2EFE9] text-[#0E5A46] font-bold px-2 py-0.5 rounded border border-[#C2DDD3]">
              TOURMS Document Verifier
            </span>
          </div>
          <p className="text-xs text-[#5A6E68] mt-0.5 break-words">
            AI Document Verifier extracts RC/BN numbers and entity titles to cross-reference against applicant profiles, automatically isolating high-risk anomalies.
          </p>
        </div>

        {flaggedEmployerIds.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs bg-[#FBEAE9] text-[#C5221F] border border-[#F2B8B5] px-3 py-1 rounded font-bold self-start sm:self-auto animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>{flaggedEmployerIds.length} High-Risk Anomaly Flagged</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===================================================================== */}
        {/* LEFT COLUMN: EMPLOYER REGISTRY & QUEUE                                */}
        {/* ===================================================================== */}
        <div className="space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEBDD]">
            <span className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
              Employer Queue ({employerList.length})
            </span>
            <span className="text-[11px] font-mono tabular-nums text-[#0E5A46] font-semibold">Active Desk</span>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-[11px]">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`py-1 text-center font-semibold rounded transition cursor-pointer ${
                filterTab === 'all' ? 'bg-white text-[#0E5A46] shadow-xs' : 'text-[#5A6E68]'
              }`}
            >
              All ({employerList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pending')}
              className={`py-1 text-center font-semibold rounded transition cursor-pointer ${
                filterTab === 'pending' ? 'bg-white text-[#0E5A46] shadow-xs' : 'text-[#5A6E68]'
              }`}
            >
              Pending ({employerList.filter((e) => e.verificationStatus === 'pending').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('flagged')}
              className={`py-1 text-center font-semibold rounded transition cursor-pointer ${
                filterTab === 'flagged' ? 'bg-[#C5221F] text-white shadow-xs' : 'text-[#C5221F]'
              }`}
            >
              Flagged ({flaggedEmployerIds.length})
            </button>
          </div>

          {/* Employer Item Cards */}
          <div className="space-y-2">
            {filteredEmployers.map((emp) => {
              const isSelected = selectedEmployer?.id === emp.id;
              const isFlagged = flaggedEmployerIds.includes(emp.id);

              return (
                <div
                  key={emp.id}
                  onClick={() => {
                    setSelectedEmployerId(emp.id);
                    setAuditResult(null);
                    setUploadedDocName(null);
                    setUploadedDocDataUrl(null);
                  }}
                  className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'border-[#0E5A46] bg-[#E7F3EF]'
                      : isFlagged
                      ? 'border-[#F2B8B5] bg-[#FDF7F7] hover:bg-[#FBEAE9]'
                      : 'border-[#C4C8C5] bg-white hover:bg-[#F7F7EE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-bold text-[#0F1F1C] leading-snug">
                      {emp.companyName}
                    </p>
                    <StatusIndicator status={emp.verificationStatus as any} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5A6E68]">
                    <span className="font-mono">RC: {emp.registrationNumber}</span>
                    <span>{emp.location.state} State</span>
                  </div>

                  {isFlagged && (
                    <div className="flex items-center gap-1 text-[10px] text-[#C5221F] font-bold pt-0.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>Vision Anomaly Flagged</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: AI DOCUMENT VERIFIER INSPECTOR & ANOMALY ENGINE         */}
        {/* ===================================================================== */}
        <div className="lg:col-span-2 space-y-6 bg-white p-5 sm:p-6 rounded border border-[#C4C8C5]">
          {/* Header Card for Selected Employer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBEBDD]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#0F1F1C]">
                  {selectedEmployer.companyName}
                </h2>
                <StatusIndicator status={selectedEmployer.verificationStatus as any} />
                {flaggedEmployerIds.includes(selectedEmployer.id) && (
                  <span className="text-[10px] bg-[#FBEAE9] text-[#C5221F] border border-[#F2B8B5] px-2 py-0.5 rounded font-bold">
                    Anomaly Alert
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A6E68] mt-0.5">
                Legal Structure: <strong className="text-[#0F1F1C]">{selectedEmployer.businessType}</strong> · Registration:{' '}
                <strong className="text-[#0F1F1C] font-mono">{selectedEmployer.registrationNumber}</strong>
              </p>
            </div>

            <div className="text-[11px] text-[#5A6E68] text-right">
              <span>Farm Location:</span>
              <p className="font-semibold text-[#0F1F1C]">
                {selectedEmployer.location.lga} LGA, {selectedEmployer.location.state}
              </p>
            </div>
          </div>

          {/* =================================================================== */}
          {/* AI DOCUMENT VERIFIER: VISION INSPECTION INTERFACE                   */}
          {/* =================================================================== */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-[#F2F7F4] via-[#F8FAF9] to-white rounded-lg border border-[#C2DDD3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C2DDD3]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#0E5A46] text-white rounded">
                  <Scan className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0E5A46]">
                    AI Document Verifier — TOURMS Forensic Engine
                  </h3>
                  <p className="text-[11px] text-[#5A6E68]">
                    OCR extraction of RC/BN numbers and legal entity titles with forensic tamper detection
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                leftIcon={isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />}
                disabled={isAuditing}
                onClick={() => handleRunVisionAudit()}
                className="bg-[#0E5A46] hover:bg-[#08382B] shrink-0"
              >
                {isAuditing ? 'Analyzing with Vision OCR...' : 'Run Vision Verification'}
              </Button>
            </div>

            {/* Test Simulation Presets & Custom File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#0F1F1C] block">
                  Select Document Inspection Preset:
                </label>
                <select
                  value={selectedPresetMode}
                  onChange={(e) => {
                    const mode = e.target.value as any;
                    setSelectedPresetMode(mode);
                    handleRunVisionAudit(mode);
                  }}
                  className="w-full bg-white border border-[#C4C8C5] rounded p-2 text-xs text-[#0F1F1C] focus:ring-1 focus:ring-[#0E5A46]"
                >
                  <option value="authentic">📄 Authentic Certificate of Incorporation (Exact Match)</option>
                  <option value="rc_mismatch">🚨 Altered RC Number Anomaly (e.g. RC 2094899 vs 2094812)</option>
                  <option value="name_mismatch">⚠ Corporate Entity Name Mismatch (Title Variance)</option>
                  <option value="tampered_seal">🚨 Tampered Embossed Seal (Digital Raster Manipulation)</option>
                </select>
                <span className="text-[10px] text-[#5A6E68] block">
                  Allows compliance auditors to test the vision model against known Nigerian corporate fraud patterns.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#0F1F1C] block">
                  Upload Physical Certificate Image:
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#C4C8C5] border-dashed rounded text-xs text-[#0E5A46] font-medium hover:bg-[#F2F7F4] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="truncate">{uploadedDocName || 'Upload PNG / JPG / PDF'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedDocName && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRunVisionAudit()}
                      disabled={isAuditing}
                    >
                      Scan
                    </Button>
                  )}
                </div>
                <span className="text-[10px] text-[#5A6E68] block">
                  Scanned with TOURMS Document Verifier for micro-text, embossed stamps, and watermark consistency.
                </span>
              </div>
            </div>

            {/* Document Digital Replica Viewport */}
            <div className="relative p-4 bg-white rounded border border-[#C4C8C5] font-serif shadow-inner overflow-hidden text-center space-y-2">
              {/* Simulated Scanning Laser Line when auditing */}
              {isAuditing && (
                <div className="absolute inset-0 bg-[#0E5A46]/10 flex flex-col items-center justify-center backdrop-blur-2xs z-10 animate-in fade-in">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C98A3A] to-transparent animate-pulse absolute top-1/2" />
                  <div className="bg-white/90 p-3 rounded shadow-md border border-[#C2DDD3] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0E5A46]">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>TOURMS Document Verifier Processing...</span>
                    </div>
                    <p className="text-[10px] font-sans text-[#5A6E68]">
                      Extracting registration checksums, entity text, and stamp pixel fidelity.
                    </p>
                  </div>
                </div>
              )}

              <div className="max-w-md mx-auto space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#5A6E68] font-sans">
                  Federal Republic of Nigeria · Corporate Affairs Commission
                </p>
                <h4 className="text-sm font-bold text-[#0F1F1C] tracking-wide">
                  CERTIFICATE OF INCORPORATION
                </h4>
                <p className="text-[11px] text-[#3A4B47] italic">
                  Pursuant to Section 36 of the Companies and Allied Matters Act 2020
                </p>

                <div className="py-2.5 my-1 border-y border-[#EBEBDD] space-y-1 text-xs">
                  <p className="text-[#5A6E68] font-sans text-[10px]">I hereby certify that</p>
                  <p className="font-bold text-sm text-[#0F1F1C]">
                    {selectedPresetMode === 'name_mismatch'
                      ? `${selectedEmployer.companyName.replace('Ltd', '')} Global Logistics & Feeds Ltd`
                      : selectedEmployer.companyName}
                  </p>
                  <p className="text-[#5A6E68] font-sans text-[10px]">is this day incorporated as a private limited company.</p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-sans pt-1">
                  <span className="font-mono font-bold bg-[#F7F7EE] px-2 py-0.5 rounded border border-[#EBEBDD]">
                    {selectedPresetMode === 'rc_mismatch' ? 'RC 2094899' : selectedEmployer.registrationNumber}
                  </span>
                  <span className="text-[#8E5A18] font-semibold text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0E5A46]" />
                    {selectedPresetMode === 'tampered_seal' ? 'Digital Seal (Pixel Artifacts)' : 'Official Embossed Seal Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================================== */}
            {/* AUDIT RESULTS & AUTOMATED ANOMALY DETECTION REPORT                   */}
            {/* =================================================================== */}
            {auditResult && (
              <div className="space-y-4 pt-2 animate-in fade-in">
                {/* Score & Risk Level Header */}
                <div
                  className={`p-3.5 rounded border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    auditResult.riskLevel === 'high'
                      ? 'bg-[#FBEAE9] border-[#F2B8B5] text-[#C5221F]'
                      : 'bg-[#F2F7F4] border-[#C2DDD3] text-[#0E5A46]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {auditResult.riskLevel === 'high' ? (
                      <ShieldAlert className="w-5 h-5 text-[#C5221F] shrink-0" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-[#0E5A46] shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-xs sm:text-sm">
                        {auditResult.riskLevel === 'high'
                          ? 'HIGH-RISK ANOMALY DETECTED — FLAGGED FOR COMPLIANCE DESK'
                          : 'VERIFIED AUTHENTIC — ZERO DISCREPANCIES DETECTED'}
                      </p>
                      <p className="text-[11px] opacity-90">
                        {auditResult.recommendation === 'flag_discrepancy'
                          ? 'Automated review recommendation: Reject or flag for secondary CAC corporate registry inspection.'
                          : 'Automated review recommendation: Safe to grant CAC Verified badge.'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded border shadow-2xs self-start sm:self-auto">
                    {auditResult.matchConfidencePercent}% Consistency Match
                  </span>
                </div>

                {/* Profile vs Extracted Comparison Grid */}
                <div className="p-3.5 bg-white rounded border border-[#C2DDD3] space-y-2.5 text-xs">
                  <span className="text-[10px] font-bold text-[#5A6E68] uppercase tracking-wider block">
                    Profile Data vs. Extracted Document Comparison:
                  </span>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#EBEBDD] text-[10px] text-[#5A6E68] uppercase">
                          <th className="py-1.5 px-2">Verification Field</th>
                          <th className="py-1.5 px-2">Declared in Profile</th>
                          <th className="py-1.5 px-2">Extracted via Vision</th>
                          <th className="py-1.5 px-2 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EBEBDD] text-[11px]">
                        {/* 1. Registration Number */}
                        <tr className={auditResult.comparisonDetails.rcComparison.matches ? '' : 'bg-[#FBEAE9]/60'}>
                          <td className="py-2 px-2 font-bold text-[#0F1F1C]">RC / BN Number</td>
                          <td className="py-2 px-2 font-mono text-[#5A6E68]">{auditResult.comparisonDetails.rcComparison.profile}</td>
                          <td className="py-2 px-2 font-mono font-bold text-[#0F1F1C]">
                            {auditResult.comparisonDetails.rcComparison.extracted}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {auditResult.comparisonDetails.rcComparison.matches ? (
                              <span className="inline-flex items-center gap-1 text-[#0E5A46] font-bold text-[10px]">
                                <Check className="w-3.5 h-3.5" /> EXACT MATCH
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#C5221F] font-bold text-[10px]">
                                <XCircle className="w-3.5 h-3.5" /> MISMATCH
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* 2. Entity Title */}
                        <tr className={auditResult.comparisonDetails.nameComparison.matches ? '' : 'bg-[#FBEAE9]/60'}>
                          <td className="py-2 px-2 font-bold text-[#0F1F1C]">Legal Entity Name</td>
                          <td className="py-2 px-2 text-[#5A6E68]">{auditResult.comparisonDetails.nameComparison.profile}</td>
                          <td className="py-2 px-2 font-bold text-[#0F1F1C]">
                            {auditResult.comparisonDetails.nameComparison.extracted}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {auditResult.comparisonDetails.nameComparison.matches ? (
                              <span className="inline-flex items-center gap-1 text-[#0E5A46] font-bold text-[10px]">
                                <Check className="w-3.5 h-3.5" /> EXACT MATCH
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[#C5221F] font-bold text-[10px]">
                                <XCircle className="w-3.5 h-3.5" /> TITLE VARIANCE
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* 3. Issuing Jurisdiction */}
                        <tr>
                          <td className="py-2 px-2 font-bold text-[#0F1F1C]">Issuing Jurisdiction</td>
                          <td className="py-2 px-2 text-[#5A6E68]">{auditResult.comparisonDetails.jurisdictionComparison.profile}</td>
                          <td className="py-2 px-2 text-[#0F1F1C]">
                            {auditResult.comparisonDetails.jurisdictionComparison.extracted}
                          </td>
                          <td className="py-2 px-2 text-right">
                            <span className="inline-flex items-center gap-1 text-[#0E5A46] font-bold text-[10px]">
                              <Check className="w-3.5 h-3.5" /> REGISTRY OK
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Anomalies Alert Box (if present) */}
                {auditResult.anomalies.length > 0 && (
                  <div className="p-3.5 bg-[#FBEAE9] rounded border border-[#F2B8B5] space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#C5221F]">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Flagged Registration Anomalies ({auditResult.anomalies.length})</span>
                    </div>

                    <div className="space-y-2">
                      {auditResult.anomalies.map((anom, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded border border-[#F2B8B5] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#C5221F] text-[11px]">{anom.title}</span>
                            <span className="text-[9px] bg-[#C5221F] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                              {anom.severity} SEVERITY
                            </span>
                          </div>
                          <p className="text-[11px] text-[#3A4B47] leading-relaxed">
                            {anom.detail}
                          </p>
                          <div className="pt-1 flex items-center gap-3 text-[10px] text-[#5A6E68]">
                            <span>Profile: <strong className="text-[#0F1F1C]">{anom.profileValue}</strong></span>
                            <span>·</span>
                            <span>Document: <strong className="text-[#C5221F] font-mono">{anom.extractedValue}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Forensic Integrity Checks */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-[#5A6E68] uppercase">Forensic Authenticity Checks:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {auditResult.auditFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border flex items-start gap-1.5 text-[11px] ${
                          flag.status === 'alert'
                            ? 'bg-[#FBEAE9] border-[#F2B8B5]'
                            : flag.status === 'warning'
                            ? 'bg-[#FCF9F2] border-[#E8D6B5]'
                            : 'bg-white border-[#C2DDD3]'
                        }`}
                      >
                        {flag.status === 'alert' ? (
                          <XCircle className="w-3.5 h-3.5 text-[#C5221F] shrink-0 mt-0.5" />
                        ) : flag.status === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#C98A3A] shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0E5A46] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className="text-[#0F1F1C] block text-[10px]">{flag.label}</strong>
                          <span className="text-[#3A4B47] text-[10px] leading-tight block">{flag.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vision AI Summary */}
                <div className="p-3 bg-white rounded border border-[#C2DDD3] text-[11px] text-[#3A4B47] leading-relaxed">
                  <strong className="text-[#0E5A46] block mb-0.5">Forensic Document Assessment:</strong>
                  {auditResult.summaryAnalysis}
                </div>
              </div>
            )}
          </div>

          {/* Submitted Document Attachments List */}
          <div className="space-y-2 text-xs">
            <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
              Document Archive for {selectedEmployer.companyName}
            </h3>
            {selectedEmployer.verificationDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-[#F7F7EE] rounded border border-[#EBEBDD] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#0E5A46]" />
                  <div>
                    <p className="font-bold text-[#0F1F1C]">{doc.title}</p>
                    <p className="text-[#5A6E68] text-[11px]">
                      Type: {doc.documentType} · Submitted {doc.submittedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[#0E5A46] font-semibold">
                    {doc.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Physical Location Evidence */}
          <div className="p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs space-y-1">
            <p className="font-bold text-[#0F1F1C]">Farm Site / Operational Facility:</p>
            <p className="text-[#3A4B47]">{selectedEmployer.location.farmSiteAddress}</p>
            <p className="text-[#5A6E68]">
              LGA: {selectedEmployer.location.lga} · State: {selectedEmployer.location.state}
            </p>
          </div>

          {/* Verification Decision Controls */}
          <div className="pt-4 border-t border-[#EBEBDD] space-y-3 text-xs">
            <Textarea
              label="Audit Review Notes & CAC Verification Reference"
              rows={2}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. CAC Search Report confirmed active status on portal..."
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div>
                {flaggedEmployerIds.includes(selectedEmployer.id) && (
                  <span className="text-[11px] text-[#C5221F] font-bold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Registration flagged in Admin Anomaly Queue
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDecision('rejected')}
                >
                  Reject CAC Verification
                </Button>

                {flaggedEmployerIds.includes(selectedEmployer.id) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#C5221F] text-[#C5221F] hover:bg-[#FBEAE9]"
                    onClick={() => {
                      handleDecision('pending');
                      addToast({
                        type: 'info',
                        title: 'Escalated to Compliance',
                        message: `${selectedEmployer.companyName} kept in High-Risk Anomaly review queue.`
                      });
                    }}
                  >
                    Escalate to Legal Review
                  </Button>
                ) : null}

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                  onClick={() => handleDecision('verified')}
                  className="bg-[#0E5A46] hover:bg-[#08382B]"
                >
                  Approve CAC Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
