"use client";

import { useState } from "react";
import {
  Rocket,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Trophy,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useStudentStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const TYPE_TABS = [
  { value: "all", label: "All Opportunities" },
  { value: "internship", label: "Internships" },
  { value: "job", label: "Fresher Jobs" },
  { value: "hackathon", label: "Hackathons" },
  { value: "scholarship", label: "Scholarships" },
  { value: "competition", label: "Competitions" },
  { value: "course", label: "Courses" },
];

export default function OpportunitiesPage() {
  const {
    opportunities,
    bookmarkedOppIds,
    toggleBookmark,
  } = useStudentStore();

  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedType !== "all" && opp.type !== selectedType) return false;
    if (onlyBookmarked && !bookmarkedOppIds.includes(opp.id)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company?.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
            Campus Opportunity Hub
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--muted)" }}>
            Discover verified internships, fresher hiring drives, government scholarships, and hackathons.
          </p>
        </div>

        <button
          onClick={() => setOnlyBookmarked(!onlyBookmarked)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
            onlyBookmarked
              ? "gradient-bg text-white shadow-md shadow-purple-500/20"
              : "glass-card hover:border-purple-500/40"
          }`}
          style={{ borderColor: onlyBookmarked ? "transparent" : "var(--border)" }}
        >
          <Bookmark className={`w-4 h-4 ${onlyBookmarked ? "fill-white" : ""}`} />
          <span>Saved ({bookmarkedOppIds.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border space-y-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
            <input
              type="text"
              placeholder="Search by company (Google, Amazon), title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border text-xs outline-none"
              style={{ background: "rgba(11, 16, 32, 0.6)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === tab.value
                    ? "gradient-bg text-white"
                    : "border text-slate-400 hover:text-white"
                }`}
                style={{ borderColor: selectedType === tab.value ? "transparent" : "var(--border)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpportunities.length === 0 ? (
          <div className="md:col-span-2 glass-card p-12 text-center rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <Rocket className="w-10 h-10 mx-auto text-purple-400 mb-3 opacity-60" />
            <h3 className="text-sm font-bold" style={{ color: "var(--foreground)" }}>
              No opportunities found
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const isBookmarked = bookmarkedOppIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="glass-card p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-purple-500/40 relative group"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md gradient-bg text-white uppercase">
                        {opp.type}
                      </span>
                      {opp.is_sample_data && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border text-slate-400" style={{ borderColor: "var(--border)" }}>
                          Sample Opportunity Listing
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleBookmark(opp.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked ? "text-purple-400 border-purple-500/40 bg-purple-500/10" : "text-slate-400 hover:text-white"
                      }`}
                      style={{ borderColor: isBookmarked ? "rgba(124, 92, 252, 0.4)" : "var(--border)" }}
                      title={isBookmarked ? "Remove Bookmark" : "Save Opportunity"}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-sm font-bold mb-1 leading-snug" style={{ color: "var(--foreground)" }}>
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold mb-3 text-cyan-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{opp.company || "University Campus"}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "var(--muted)" }}>
                    {opp.description}
                  </p>
                </div>

                {/* Footer details: location, deadline, and Apply button */}
                <div className="pt-3 border-t space-y-3" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-wrap items-center justify-between text-[11px]" style={{ color: "var(--muted)" }}>
                    {opp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-400" />
                        {opp.location}
                      </span>
                    )}
                    {opp.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        Deadline: {formatDate(opp.deadline)}
                      </span>
                    )}
                  </div>

                  <a
                    href={opp.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm shadow-purple-500/20"
                  >
                    <span>Official Portal</span>
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
}
