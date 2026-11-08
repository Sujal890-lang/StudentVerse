import React, { useState } from 'react';
import {
  Rocket,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { Opportunity } from '../types';

export const Opportunities: React.FC = () => {
  const {
    opportunities,
    toggleOpportunityBookmark,
    updateOpportunityStatus,
  } = useStudent();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'internship' | 'hackathon' | 'scholarship' | 'job'>('all');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const filtered = opportunities.filter((opp) => {
    if (selectedType !== 'all' && opp.type !== selectedType) return false;
    if (showBookmarkedOnly && !opp.is_bookmarked) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company_or_org.toLowerCase().includes(q);
      const matchTag = opp.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Verified Student Opportunities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Opportunity Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Discover premier summer internships, international hackathons, scholarships, and new-grad roles
          </p>
        </div>

        <button
          onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            showBookmarkedOnly
              ? 'bg-purple-600 text-white border-purple-500 shadow-md'
              : 'bg-[#11182B] text-slate-300 border-white/10 hover:border-purple-500/40'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          {showBookmarkedOnly ? 'Showing Bookmarks' : 'My Bookmarks'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#11182B] p-4 rounded-2xl border border-white/5">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search company, role, or tags (e.g. Google, Python)..."
            className="w-full bg-[#171F35] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {(['all', 'internship', 'hackathon', 'scholarship', 'job'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                selectedType === t
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'all' ? 'All Opportunities' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 p-8 rounded-3xl bg-[#11182B] border border-white/5 space-y-2">
            <Rocket className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No opportunities found</p>
            <p className="text-xs text-slate-400">Try adjusting your search keywords or clearing active filters.</p>
          </div>
        ) : (
          filtered.map((opp) => {
            const isBookmarked = opp.is_bookmarked;
            const status = opp.status || 'not_applied';

            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/30 transition-all shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {opp.type}
                      </span>
                      <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-1.5 leading-snug">
                        {opp.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">
                        {opp.company_or_org}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleOpportunityBookmark(opp.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-white/5 transition-colors"
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-300">{opp.stipend_or_prize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] text-slate-400">
                        Deadline: {opp.deadline}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {opp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#171F35] text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Status and Apply */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <select
                    value={status}
                    onChange={(e: any) => updateOpportunityStatus(opp.id, e.target.value)}
                    className="bg-[#171F35] text-[11px] text-slate-200 px-2 py-1.5 rounded-lg border border-white/10 font-medium"
                  >
                    <option value="not_applied">Not Applied</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="accepted">Accepted 🎉</option>
                  </select>

                  <a
                    href={opp.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    Apply Now
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

