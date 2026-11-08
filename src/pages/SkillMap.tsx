import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Lock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  FolderGit2,
  TrendingUp,
  Brain,
  Layers,
  Award,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { CareerGoal, RoadmapNode } from '../types';

export const SkillMap: React.FC = () => {
  const { careerGoals } = useStudent();
  const [selectedGoalId, setSelectedGoalId] = useState<string>(careerGoals[0]?.id || 'goal-1');

  const currentGoal = careerGoals.find((g) => g.id === selectedGoalId) || careerGoals[0];

  // Local state for toggling roadmap node completion
  const [roadmapNodes, setRoadmapNodes] = useState<Record<string, RoadmapNode[]>>(() => {
    const map: Record<string, RoadmapNode[]> = {};
    careerGoals.forEach((g) => {
      map[g.id] = g.learning_roadmap;
    });
    return map;
  });

  const toggleNodeStatus = (goalId: string, nodeId: string) => {
    setRoadmapNodes((prev) => {
      const currentList = prev[goalId] || [];
      const updated = currentList.map((n) => {
        if (n.id === nodeId) {
          const nextStatus = n.status === 'completed' ? 'in_progress' : 'completed';
          return { ...n, status: nextStatus as any };
        }
        return n;
      });
      return { ...prev, [goalId]: updated };
    });
  };

  const activeNodes = roadmapNodes[currentGoal.id] || currentGoal.learning_roadmap;
  const completedCount = activeNodes.filter((n) => n.status === 'completed').length;
  const progressPct = activeNodes.length > 0 ? Math.round((completedCount / activeNodes.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Career Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Skill Map & Roadmaps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Interactive career paths, prerequisite dependency graphs, and portfolio project blueprints
          </p>
        </div>
      </div>

      {/* Career Goal Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerGoals.map((g) => {
          const isSelected = g.id === selectedGoalId;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGoalId(g.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xl space-y-4 ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-950/40 via-[#171F35] to-[#11182B] border-purple-500 shadow-purple-500/10'
                  : 'bg-[#11182B] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                      {g.icon === 'Brain' ? <Brain className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </span>
                    <h4 className="text-lg font-bold text-white">{g.role_title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 max-w-md">{g.description}</p>
                </div>

                <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 shrink-0">
                  {g.demand_level} Demand
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-slate-400">
                  Avg Package: <strong className="text-white">{g.avg_salary}</strong>
                </span>
                <span className="text-purple-400 font-bold">
                  {g.match_percentage}% Academic Match
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Goal Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Dynamic Learning Roadmap (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {currentGoal.role_title} Learning Pathway
                </h3>
                <p className="text-xs text-slate-400">
                  {completedCount} of {activeNodes.length} nodes completed ({progressPct}%)
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Phase {completedCount + 1} Active
              </span>
            </div>

            {/* Vertical Roadmap Nodes */}
            <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
              {activeNodes.map((node, idx) => {
                const isCompleted = node.status === 'completed';
                const isLocked = node.status === 'locked';

                return (
                  <div key={node.id} className="relative pl-10 group">
                    {/* Node status icon */}
                    <button
                      onClick={() => !isLocked && toggleNodeStatus(currentGoal.id, node.id)}
                      className={`absolute left-1.5 top-3 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : isLocked
                          ? 'bg-[#171F35] text-slate-500 border border-white/10'
                          : 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      }`}
                      title={isLocked ? 'Prerequisite locked' : 'Click to toggle completion'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="p-5 rounded-2xl bg-[#171F35] border border-white/5 hover:border-purple-500/30 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {node.level}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            isCompleted ? 'text-emerald-400' : isLocked ? 'text-slate-500' : 'text-amber-400'
                          }`}
                        >
                          {node.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{node.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>

                      {node.resources && node.resources.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {node.resources.map((res, rIdx) => (
                            <span
                              key={rIdx}
                              className="text-[10px] px-2 py-1 rounded-lg bg-[#11182B] text-slate-300 border border-white/5 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3 text-purple-400" />
                              {res.name} ({res.type})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Required Skills & Project Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Required Skills Proficiency */}
          <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Core Technical Competencies
            </h3>

            <div className="space-y-3.5">
              {currentGoal.required_skills.map((skill, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{skill.name}</span>
                    <span className="text-purple-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-[#171F35] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-sky-400 rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Capstone Projects */}
          <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-sky-400" />
              Recommended Portfolio Projects
            </h3>

            <div className="space-y-3">
              {currentGoal.recommended_projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-[#171F35] border border-white/5 hover:border-purple-500/30 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                      {proj.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11182B] text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

