import React, { useState } from 'react';
import { OpportunityListing, OpportunityStatus, OpportunityCategory } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';

const CATEGORY_OPTIONS: OpportunityCategory[] = [
  'Grant',
  'Loan',
  'Scholarship',
  'Fellowship',
  'Training Programme',
  'Funding Call',
  'Competition',
  'Internship',
  'Research Opportunity',
  'Event',
  'Professional Development',
  'Institutional Programme'
];

export interface AdminOpportunitiesReviewViewProps {
  opportunities: OpportunityListing[];
  onUpdateOpportunityStatus: (id: string, status: OpportunityStatus) => void;
  onAddOpportunity?: (newOpp: OpportunityListing) => void;
  onEditOpportunity?: (updatedOpp: OpportunityListing) => void;
  onDeleteOpportunity?: (id: string) => void;
}

export const AdminOpportunitiesReviewView: React.FC<AdminOpportunitiesReviewViewProps> = ({
  opportunities,
  onUpdateOpportunityStatus,
  onAddOpportunity,
  onEditOpportunity,
  onDeleteOpportunity
}) => {
  const { addToast } = useToast();
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunities[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<OpportunityListing | null>(null);

  // Form Fields State
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formProvider, setFormProvider] = useState('');
  const [formProviderVerified, setFormProviderVerified] = useState(true);
  const [formCategory, setFormCategory] = useState<OpportunityCategory>('Grant');
  const [formDescription, setFormDescription] = useState('');
  const [formEligibility, setFormEligibility] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formLocationScope, setFormLocationScope] = useState('Nigeria-wide');
  const [formDeadline, setFormDeadline] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formStatus, setFormStatus] = useState<OpportunityStatus>('published');
  const [formVerificationSource, setFormVerificationSource] = useState('Tourms Verification Desk');

  const selectedOpp = opportunities.find((o) => o.id === selectedOppId) || opportunities[0];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || opp.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setFormId(`opp-${Date.now()}`);
    setFormTitle('');
    setFormProvider('');
    setFormProviderVerified(true);
    setFormCategory('Grant');
    setFormDescription('');
    setFormEligibility('Active Nigerian agribusiness or registered agricultural enterprise\nMinimum 1 season of verifiable farm operations\nValid bank verification number (BVN) and CAC certificate');
    setFormBenefits('Direct matching grant funding up to ₦10,000,000\nTechnical advisory and farm management assistance\nGuaranteed offtake linkages');
    setFormLocationScope('Nigeria-wide');
    setFormDeadline(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFormSourceUrl('https://tourmsworkforce.com.ng');
    setFormStatus('published');
    setFormVerificationSource('Federal Ministry of Agriculture & Tourms Verification Desk');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (opp: OpportunityListing) => {
    setFormMode('edit');
    setFormId(opp.id);
    setFormTitle(opp.title);
    setFormProvider(opp.provider);
    setFormProviderVerified(opp.providerVerified);
    setFormCategory(opp.category);
    setFormDescription(opp.description);
    setFormEligibility(opp.eligibility.join('\n'));
    setFormBenefits(opp.benefits.join('\n'));
    setFormLocationScope(opp.locationScope);
    setFormDeadline(opp.deadline);
    setFormSourceUrl(opp.sourceUrl);
    setFormStatus(opp.status);
    setFormVerificationSource(opp.verificationSource || 'Tourms Desk');
    setIsFormModalOpen(true);
  };

  const handleSaveOpportunity = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formProvider.trim() || !formDescription.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide a title, provider name, and description.'
      });
      return;
    }

    const payload: OpportunityListing = {
      id: formId,
      title: formTitle.trim(),
      provider: formProvider.trim(),
      providerVerified: formProviderVerified,
      category: formCategory,
      description: formDescription.trim(),
      eligibility: formEligibility
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: formBenefits
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      locationScope: formLocationScope.trim() || 'Nigeria-wide',
      deadline: formDeadline.trim() || 'Rolling Basis',
      sourceUrl: formSourceUrl.trim() || 'https://tourmsworkforce.com.ng',
      status: formStatus,
      verificationSource: formVerificationSource.trim(),
      verifiedBy: 'TOURMS Admin Operations',
      verifiedDate: new Date().toISOString().split('T')[0]
    };

    if (formMode === 'create') {
      if (onAddOpportunity) {
        onAddOpportunity(payload);
      }
      setSelectedOppId(payload.id);
      addToast({
        type: 'success',
        title: 'Opportunity Created',
        message: `"${payload.title}" has been successfully created and published.`
      });
    } else {
      if (onEditOpportunity) {
        onEditOpportunity(payload);
      }
      addToast({
        type: 'success',
        title: 'Opportunity Updated',
        message: `"${payload.title}" details have been updated successfully.`
      });
    }

    setIsFormModalOpen(false);
  };

  const handleOpenDeleteConfirm = (opp: OpportunityListing) => {
    setOpportunityToDelete(opp);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!opportunityToDelete) return;
    if (onDeleteOpportunity) {
      onDeleteOpportunity(opportunityToDelete.id);
    }
    addToast({
      type: 'info',
      title: 'Opportunity Removed',
      message: `"${opportunityToDelete.title}" has been deleted from the registry.`
    });
    setDeleteConfirmOpen(false);
    setOpportunityToDelete(null);

    // Switch selection to remaining item
    const remaining = opportunities.filter((o) => o.id !== opportunityToDelete.id);
    if (remaining.length > 0) {
      setSelectedOppId(remaining[0].id);
    }
  };

  const handleStatusChange = (status: OpportunityStatus) => {
    if (!selectedOpp) return;
    onUpdateOpportunityStatus(selectedOpp.id, status);
    addToast({
      type: 'success',
      title: 'Lifecycle Status Updated',
      message: `"${selectedOpp.title}" is now marked as ${status.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      {/* Top Header & Production Management Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F1F1C] tracking-tight">
            Agricultural Funding & Opportunities Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6E68] mt-1">
            Authoritative registry for agricultural grants, credit facilities, fellowships, and capacity-building programs across Nigeria.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
          className="shrink-0"
        >
          Add New Opportunity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded border border-[#C4C8C5]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#5A6E68] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, provider, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Lifecycle Statuses' },
              { value: 'published', label: 'Published (Publicly Visible)' },
              { value: 'verified', label: 'Verified by Tourms' },
              { value: 'submitted', label: 'Submitted (Pending Review)' },
              { value: 'expired', label: 'Expired / Closed' }
            ]}
          />
        </div>

        <div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))
            ]}
          />
        </div>
      </div>

      {/* Main Grid: Listings vs Detailed Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Opportunities List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEBDD]">
            <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
              Registered Opportunities ({filteredOpportunities.length})
            </p>
            <span className="text-[11px] font-mono tabular-nums text-[#0E5A46] font-semibold">
              Total: {opportunities.length}
            </span>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5A6E68] space-y-2">
              <p>No opportunities match your search filter.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {filteredOpportunities.map((opp) => {
                const isSelected = selectedOpp?.id === opp.id;
                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOppId(opp.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1.5 ${
                      isSelected
                        ? 'border-[#0E5A46] bg-[#E7F3EF]'
                        : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#0F1F1C] leading-snug line-clamp-2">
                        {opp.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase shrink-0 border ${
                          opp.status === 'published'
                            ? 'bg-[#0E5A46] text-white border-[#0E5A46]'
                            : opp.status === 'verified'
                            ? 'bg-[#E7F3EF] text-[#0E5A46] border-[#0E5A46]'
                            : opp.status === 'expired'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#EBEBDD] text-[#0F1F1C] border-[#C4C8C5]'
                        }`}
                      >
                        {opp.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E5A18] font-semibold">{opp.category}</span>
                      <span className="text-[#5A6E68] font-mono tabular-nums">
                        Due: {opp.deadline}
                      </span>
                    </div>

                    <p className="text-[#5A6E68] text-[11px] truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {opp.provider}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Management Card (7 cols) */}
        {selectedOpp ? (
          <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
            {/* Header info & quick edit/delete actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EBEBDD]">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold text-[#8E5A18] uppercase tracking-wider">
                  {selectedOpp.category} · {selectedOpp.locationScope}
                </span>
                <h2 className="text-lg font-bold text-[#0F1F1C] leading-snug">
                  {selectedOpp.title}
                </h2>
                <p className="text-xs text-[#5A6E68] flex items-center gap-1.5 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0E5A46]" />
                  <span className="font-medium text-[#0F1F1C]">{selectedOpp.provider}</span>
                  {selectedOpp.providerVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#0E5A46] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Source
                    </span>
                  )}
                </p>
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Pencil className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenEditModal(selectedOpp)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
                  onClick={() => handleOpenDeleteConfirm(selectedOpp)}
                  className="hover:border-red-600 hover:text-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] text-xs">
              <div className="space-y-0.5">
                <span className="text-[#5A6E68] block">Geographic Scope</span>
                <span className="font-bold text-[#0F1F1C] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8E5A18]" />
                  {selectedOpp.locationScope}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#5A6E68] block">Application Deadline</span>
                <span className="font-bold text-[#0F1F1C] flex items-center gap-1 font-mono tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-[#0E5A46]" />
                  {selectedOpp.deadline}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[#5A6E68] block">Verification Status</span>
                <span className="font-bold text-[#0E5A46] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selectedOpp.verificationSource || 'Verified by Tourms'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
                Opportunity Description & Objectives
              </h3>
              <p className="text-xs text-[#3A4B47] leading-relaxed p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD] whitespace-pre-line">
                {selectedOpp.description}
              </p>
            </div>

            {/* Benefits & Value Proposition */}
            {selectedOpp.benefits && selectedOpp.benefits.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
                  Funding, Support & Package Value
                </h3>
                <ul className="text-xs text-[#3A4B47] space-y-1.5 p-3.5 bg-white rounded border border-[#EBEBDD]">
                  {selectedOpp.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#8E5A18] mt-0.5 shrink-0" />
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility Requirements */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
                Eligibility & Candidate Selection Criteria
              </h3>
              <ul className="text-xs text-[#3A4B47] space-y-1.5 p-3.5 bg-white rounded border border-[#EBEBDD]">
                {selectedOpp.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0E5A46] mt-0.5 shrink-0" />
                    <span className="leading-snug">{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* External Application URL Preview */}
            <div className="flex items-center justify-between p-3 bg-[#E7F3EF] rounded border border-[#0E5A46]/20 text-xs">
              <div className="truncate pr-2">
                <span className="text-[#5A6E68] block text-[11px]">Direct Portal / Application URL:</span>
                <span className="font-mono text-[#0E5A46] font-semibold truncate block">
                  {selectedOpp.sourceUrl}
                </span>
              </div>
              <a
                href={selectedOpp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E5A46] text-white rounded text-xs font-semibold shrink-0 hover:bg-[#08382B] transition-colors"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="pt-4 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('submitted')}
                  className={selectedOpp.status === 'submitted' ? 'border-[#0E5A46] font-bold' : ''}
                >
                  Mark Pending
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('verified')}
                  className={selectedOpp.status === 'verified' ? 'border-[#0E5A46] font-bold' : ''}
                >
                  Mark Verified
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('expired')}
                  className={selectedOpp.status === 'expired' ? 'border-red-500 text-red-600 font-bold' : ''}
                >
                  Mark Expired
                </Button>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                onClick={() => handleStatusChange('published')}
              >
                Publish to Directory
              </Button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white p-12 text-center text-sm text-[#5A6E68] rounded border border-[#C4C8C5]">
            Select an opportunity from the list to inspect details or click "Add New Opportunity" to create a new listing.
          </div>
        )}
      </div>

      {/* Add / Edit Opportunity Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={formMode === 'create' ? 'Create Agricultural Opportunity' : 'Edit Opportunity Details'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveOpportunity} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Bank of Agriculture Commercial Farm Growth Facility"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Provider / Organization *
              </label>
              <input
                type="text"
                required
                value={formProvider}
                onChange={(e) => setFormProvider(e.target.value)}
                placeholder="e.g. Bank of Agriculture (BOA)"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Category *</label>
              <Select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as OpportunityCategory)}
                options={CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Geographic Scope</label>
              <input
                type="text"
                value={formLocationScope}
                onChange={(e) => setFormLocationScope(e.target.value)}
                placeholder="e.g. Nigeria-wide, South-West, Kano State"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Application Deadline</label>
              <input
                type="text"
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                placeholder="e.g. 2026-10-31 or Rolling Basis"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Official Application / Portal URL
              </label>
              <input
                type="url"
                value={formSourceUrl}
                onChange={(e) => setFormSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Description & Programme Scope *
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Detailed explanation of the funding or training initiative..."
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Benefits & Funding Package (one per line)
              </label>
              <textarea
                rows={3}
                value={formBenefits}
                onChange={(e) => setFormBenefits(e.target.value)}
                placeholder="Grant of up to ₦10,000,000&#10;Agro-inputs subsidization&#10;Mentorship"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Eligibility Criteria (one per line)
              </label>
              <textarea
                rows={3}
                value={formEligibility}
                onChange={(e) => setFormEligibility(e.target.value)}
                placeholder="Must be an operational Nigerian farm enterprise&#10;CAC Certificate of Registration"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Initial Status</label>
              <Select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as OpportunityStatus)}
                options={[
                  { value: 'published', label: 'Published (Immediate Public Access)' },
                  { value: 'verified', label: 'Verified' },
                  { value: 'submitted', label: 'Submitted (Draft)' },
                  { value: 'expired', label: 'Expired' }
                ]}
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="providerVerifiedCheckbox"
                checked={formProviderVerified}
                onChange={(e) => setFormProviderVerified(e.target.checked)}
                className="w-4 h-4 text-[#0E5A46] rounded focus:ring-[#0E5A46]"
              />
              <label htmlFor="providerVerifiedCheckbox" className="font-semibold text-[#0F1F1C]">
                Verified Institutional Provider
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#C4C8C5] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {formMode === 'create' ? 'Create & Publish Opportunity' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Opportunity Deletion"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Irreversible Action</p>
              <p className="mt-0.5">
                Are you sure you want to delete <span className="font-bold">"{opportunityToDelete?.title}"</span>? This will remove the listing from both the administrator database and the public directory.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
