import React, { useState } from 'react';
import { InsightArticle, InsightStatus, InsightCategory } from '../../types';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Edit3,
  Send,
  Plus,
  Pencil,
  Trash2,
  Search,
  AlertTriangle,
  User,
  Tag,
  Bookmark,
  Calendar,
  FileText
} from 'lucide-react';

const INSIGHT_CATEGORIES: InsightCategory[] = [
  'Article',
  'Research Brief',
  'Explainer',
  'Field Notes',
  'Industry Analysis',
  'Guide',
  'Career Intelligence',
  'Technology & Data'
];

export interface AdminContentManagementViewProps {
  insights: InsightArticle[];
  onUpdateStatus: (id: string, status: InsightStatus) => void;
  onAddInsight?: (newInsight: InsightArticle) => void;
  onEditInsight?: (updatedInsight: InsightArticle) => void;
  onDeleteInsight?: (id: string) => void;
}

export const AdminContentManagementView: React.FC<AdminContentManagementViewProps> = ({
  insights,
  onUpdateStatus,
  onAddInsight,
  onEditInsight,
  onDeleteInsight
}) => {
  const { addToast } = useToast();
  const [selectedArticleId, setSelectedArticleId] = useState<string>(insights[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<InsightArticle | null>(null);

  // Form Fields State
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<InsightCategory>('Article');
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('');
  const [formAuthorAffiliation, setFormAuthorAffiliation] = useState('');
  const [formReadingTime, setFormReadingTime] = useState<number>(5);
  const [formPublishedDate, setFormPublishedDate] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formCitations, setFormCitations] = useState('');
  const [formStatus, setFormStatus] = useState<InsightStatus>('published');

  const selectedArticle = insights.find((a) => a.id === selectedArticleId) || insights[0];

  const filteredArticles = insights.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setFormMode('create');
    const newId = `art-${Date.now()}`;
    setFormId(newId);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Article');
    setFormAuthorName('Dr. Aisha Bello');
    setFormAuthorRole('Senior Agronomist & Agribusiness Analyst');
    setFormAuthorAffiliation('Tourms Agricultural Research Network');
    setFormReadingTime(5);
    setFormPublishedDate(new Date().toISOString().split('T')[0]);
    setFormExcerpt('');
    setFormContent('');
    setFormTags('Agro-Economics, Irrigation, Crop Yields, Nigeria');
    setFormCitations('Federal Ministry of Agriculture and Rural Development (FMARD) Annual Review\nNational Bureau of Statistics (NBS) Agricultural GDP Bulletin');
    setFormStatus('published');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (article: InsightArticle) => {
    setFormMode('edit');
    setFormId(article.id);
    setFormTitle(article.title);
    setFormSlug(article.slug);
    setFormCategory(article.category);
    setFormAuthorName(article.author.name);
    setFormAuthorRole(article.author.role);
    setFormAuthorAffiliation(article.author.affiliation);
    setFormReadingTime(article.readingTimeMinutes);
    setFormPublishedDate(article.publishedDate);
    setFormExcerpt(article.excerpt);
    setFormContent(article.content.join('\n\n'));
    setFormTags(article.tags?.join(', ') || '');
    setFormCitations(article.citations?.join('\n') || '');
    setFormStatus(article.status);
    setIsFormModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formExcerpt.trim() || !formContent.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please provide article title, excerpt, and content.'
      });
      return;
    }

    const slug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const paragraphs = formContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const citationsArray = formCitations
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: InsightArticle = {
      id: formId,
      title: formTitle.trim(),
      slug,
      excerpt: formExcerpt.trim(),
      content: paragraphs.length > 0 ? paragraphs : [formContent.trim()],
      author: {
        name: formAuthorName.trim() || 'Tourms Research Team',
        role: formAuthorRole.trim() || 'Editorial Desk',
        affiliation: formAuthorAffiliation.trim() || 'Tourms Agro-Solutions'
      },
      category: formCategory,
      readingTimeMinutes: Number(formReadingTime) || 5,
      publishedDate: formPublishedDate || new Date().toISOString().split('T')[0],
      status: formStatus,
      tags: tagsArray,
      citations: citationsArray
    };

    if (formMode === 'create') {
      if (onAddInsight) {
        onAddInsight(payload);
      }
      setSelectedArticleId(payload.id);
      addToast({
        type: 'success',
        title: 'Article Published',
        message: `"${payload.title}" has been published to Insights.`
      });
    } else {
      if (onEditInsight) {
        onEditInsight(payload);
      }
      addToast({
        type: 'success',
        title: 'Article Updated',
        message: `"${payload.title}" has been updated.`
      });
    }

    setIsFormModalOpen(false);
  };

  const handleOpenDeleteConfirm = (art: InsightArticle) => {
    setArticleToDelete(art);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!articleToDelete) return;
    if (onDeleteInsight) {
      onDeleteInsight(articleToDelete.id);
    }
    addToast({
      type: 'info',
      title: 'Article Removed',
      message: `"${articleToDelete.title}" has been removed from the platform.`
    });
    setDeleteConfirmOpen(false);
    setArticleToDelete(null);

    const remaining = insights.filter((a) => a.id !== articleToDelete.id);
    if (remaining.length > 0) {
      setSelectedArticleId(remaining[0].id);
    }
  };

  const handleStatusChange = (status: InsightStatus) => {
    if (!selectedArticle) return;
    onUpdateStatus(selectedArticle.id, status);
    addToast({
      type: 'success',
      title: 'Editorial Lifecycle Updated',
      message: `"${selectedArticle.title}" transitioned to ${status.toUpperCase()}.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl text-left overflow-x-hidden min-w-0 break-words">
      {/* Header & Desk Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#C4C8C5]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F1F1C] tracking-tight">
            Insights, Editorial & Research Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6E68] mt-1">
            Produce, curate, and govern agricultural intelligence, agronomic best practices, market price analysis, and field research.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
          className="shrink-0"
        >
          Publish New Article / Research
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
            placeholder="Search by title, author, or topic..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
          />
        </div>

        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Editorial Statuses' },
              { value: 'published', label: 'Published (Publicly Visible)' },
              { value: 'approved', label: 'Approved (Ready to Schedule)' },
              { value: 'in_review', label: 'In Editorial Review' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' }
            ]}
          />
        </div>

        <div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Content Categories' },
              ...INSIGHT_CATEGORIES.map((c) => ({ value: c, label: c }))
            ]}
          />
        </div>
      </div>

      {/* Main Grid: Articles Roster vs Inspection / Full View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Articles Roster (5 cols) */}
        <div className="lg:col-span-5 space-y-3 bg-white p-4 rounded border border-[#C4C8C5] h-fit">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBEBDD]">
            <p className="text-xs font-bold text-[#5A6E68] uppercase tracking-wider">
              Research & Articles ({filteredArticles.length})
            </p>
            <span className="text-[11px] font-mono tabular-nums text-[#0E5A46] font-semibold">
              Total: {insights.length}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5A6E68] space-y-2">
              <p>No articles match your search filter.</p>
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
              {filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer text-xs space-y-1.5 ${
                      isSelected
                        ? 'border-[#0E5A46] bg-[#E7F3EF]'
                        : 'border-[#C4C8C5] hover:bg-[#F7F7EE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#0F1F1C] leading-snug line-clamp-2">
                        {art.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase shrink-0 border ${
                          art.status === 'published'
                            ? 'bg-[#0E5A46] text-white border-[#0E5A46]'
                            : art.status === 'approved'
                            ? 'bg-[#E7F3EF] text-[#0E5A46] border-[#0E5A46]'
                            : art.status === 'archived'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#EBEBDD] text-[#0F1F1C] border-[#C4C8C5]'
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#0E5A46] font-semibold">{art.category}</span>
                      <span className="text-[#5A6E68] font-mono tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readingTimeMinutes} min read
                      </span>
                    </div>

                    <p className="text-[#5A6E68] text-[11px] truncate flex items-center gap-1">
                      <User className="w-3 h-3 shrink-0" />
                      {art.author.name} · {art.author.affiliation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Editorial Management Card (7 cols) */}
        {selectedArticle ? (
          <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded border border-[#C4C8C5]">
            {/* Header info & action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EBEBDD]">
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold text-[#0E5A46] uppercase tracking-wider">
                  {selectedArticle.category} · {selectedArticle.readingTimeMinutes} min read
                </span>
                <h2 className="text-lg font-bold text-[#0F1F1C] leading-snug">
                  {selectedArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6E68] pt-1">
                  <span className="flex items-center gap-1 font-medium text-[#0F1F1C]">
                    <User className="w-3.5 h-3.5 text-[#0E5A46]" />
                    {selectedArticle.author.name}
                  </span>
                  <span>·</span>
                  <span>{selectedArticle.author.role}</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#5A6E68]" />
                    {selectedArticle.publishedDate}
                  </span>
                </div>
              </div>

              {/* Edit & Delete Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Pencil className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenEditModal(selectedArticle)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-600" />}
                  onClick={() => handleOpenDeleteConfirm(selectedArticle)}
                  className="hover:border-red-600 hover:text-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Abstract / Excerpt */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#8E5A18]" />
                Abstract & Executive Summary
              </h3>
              <p className="text-xs text-[#3A4B47] leading-relaxed p-3.5 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
                {selectedArticle.excerpt}
              </p>
            </div>

            {/* Full Body Content */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0E5A46]" />
                Full Publication Content ({selectedArticle.content.length} paragraphs)
              </h3>
              <div className="space-y-2.5 text-xs text-[#3A4B47] leading-relaxed max-h-60 overflow-y-auto p-4 bg-[#F7F7EE] rounded border border-[#EBEBDD]">
                {selectedArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {/* Tags and Topics */}
            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5A6E68]" />
                  Indexed Focus Topics & Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArticle.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded bg-[#EBEBDD] text-[#0F1F1C] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Citations & Evidence Grounding */}
            {selectedArticle.citations && selectedArticle.citations.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-[#0F1F1C] uppercase tracking-wider">
                  Academic Citations & Field Sources
                </h3>
                <ul className="text-xs text-[#3A4B47] space-y-1 p-3 bg-white rounded border border-[#EBEBDD]">
                  {selectedArticle.citations.map((cite, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[#0E5A46] font-bold text-[11px] shrink-0">
                        [{i + 1}]
                      </span>
                      <span>{cite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editorial Lifecycle Controls */}
            <div className="pt-4 border-t border-[#EBEBDD] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('in_review')}
                  className={selectedArticle.status === 'in_review' ? 'border-[#0E5A46] font-bold' : ''}
                >
                  Request Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('approved')}
                  className={selectedArticle.status === 'approved' ? 'border-[#0E5A46] font-bold' : ''}
                >
                  Approve Draft
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('archived')}
                  className={selectedArticle.status === 'archived' ? 'border-red-500 text-red-600 font-bold' : ''}
                >
                  Archive
                </Button>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send className="w-4 h-4" />}
                onClick={() => handleStatusChange('published')}
              >
                Publish to Insights
              </Button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white p-12 text-center text-sm text-[#5A6E68] rounded border border-[#C4C8C5]">
            Select an article from the list to review, or click "Publish New Article / Research" to compose a new piece.
          </div>
        )}
      </div>

      {/* Add / Edit Article Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={formMode === 'create' ? 'Publish Agricultural Research or Article' : 'Edit Article Content'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Modernizing Dry Season Sorghum Cultivation in Northern Nigeria"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Category *</label>
              <Select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as InsightCategory)}
                options={INSIGHT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Reading Time (minutes)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={formReadingTime}
                onChange={(e) => setFormReadingTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Author Full Name *</label>
              <input
                type="text"
                required
                value={formAuthorName}
                onChange={(e) => setFormAuthorName(e.target.value)}
                placeholder="e.g. Dr. Aisha Bello"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Author Role & Title</label>
              <input
                type="text"
                value={formAuthorRole}
                onChange={(e) => setFormAuthorRole(e.target.value)}
                placeholder="e.g. Senior Agronomist"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Institutional Affiliation
              </label>
              <input
                type="text"
                value={formAuthorAffiliation}
                onChange={(e) => setFormAuthorAffiliation(e.target.value)}
                placeholder="e.g. Institute for Agricultural Research, Ahmadu Bello University"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Abstract & Executive Summary *
              </label>
              <textarea
                rows={3}
                required
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                placeholder="A concise summary of findings, agronomic recommendations, or economic implications..."
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Article Body Content (separate paragraphs with blank lines) *
              </label>
              <textarea
                rows={6}
                required
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Full article content. Leave an empty line between paragraphs..."
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Tags & Research Focus (comma-separated)
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Irrigation, Northern Nigeria, Agribusiness Finance"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#0F1F1C] mb-1">
                Citations & Sources (one per line)
              </label>
              <textarea
                rows={2}
                value={formCitations}
                onChange={(e) => setFormCitations(e.target.value)}
                placeholder="FMARD Agricultural Policy Framework&#10;FAO West Africa Bulletin"
                className="w-full px-3 py-2 rounded border border-[#C4C8C5] bg-[#F7F7EE] text-[#0F1F1C] focus:bg-white focus:outline-none focus:border-[#0E5A46]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F1F1C] mb-1">Lifecycle Status</label>
              <Select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as InsightStatus)}
                options={[
                  { value: 'published', label: 'Published (Immediate Public Access)' },
                  { value: 'approved', label: 'Approved (Ready to publish)' },
                  { value: 'in_review', label: 'In Editorial Review' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' }
                ]}
              />
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
              {formMode === 'create' ? 'Publish Article' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Article Removal"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3 p-3 bg-red-50 text-red-800 rounded border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Permanent Removal</p>
              <p className="mt-0.5">
                Are you sure you want to delete <span className="font-bold">"{articleToDelete?.title}"</span>? This will permanently remove the article from public Insights and admin archives.
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
