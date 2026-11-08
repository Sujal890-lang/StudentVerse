import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Send,
  Sparkles,
  Tag,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';

export const Community: React.FC = () => {
  const {
    communityPosts,
    createCommunityPost,
    upvoteCommunityPost,
    addCommentToPost,
  } = useStudent();
  const { profile } = useAuth();

  const [activeTag, setActiveTag] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('Academic');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const tags = ['all', 'Academic', 'Hackathons', 'PlacementPrep', 'TeamBuilding', 'IoT'];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    createCommunityPost({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      tags: [newPostTag],
      author_name: profile?.full_name || 'Anonymous Student',
      author_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      author_college: profile?.college || 'Apex Institute of Technology',
      author_course: `${profile?.course || 'B.Tech CSE'} - Sem ${profile?.semester || 5}`,
    });

    setNewPostTitle('');
    setNewPostContent('');
    setShowCreateModal(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addCommentToPost(
      postId,
      commentInput.trim(),
      profile?.full_name || 'Student',
      profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    );
    setCommentInput('');
  };

  const filteredPosts = communityPosts.filter((p) => {
    if (activeTag === 'all') return true;
    return p.tags.includes(activeTag);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Peer Collaboration Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Campus Community
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ask technical doubts, form hackathon teams, and share university interview insights
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTag === tag
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#11182B] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tag === 'all' ? 'All Channels' : `#${tag}`}
          </button>
        ))}
      </div>

      {/* Community Feed */}
      <div className="space-y-6 max-w-4xl">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-[#11182B] border border-white/5 hover:border-purple-500/25 transition-all shadow-xl space-y-4"
          >
            {/* Author Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author_avatar}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{post.author_name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {post.author_college} • {post.author_course}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-500">{post.created_at}</span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#171F35] text-purple-300 border border-purple-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Actions: Upvote & Comments toggle */}
            <div className="pt-3 border-t border-white/5 flex items-center gap-4 text-xs">
              <button
                onClick={() => upvoteCommunityPost(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  post.has_upvoted
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#171F35] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.upvotes} Upvotes</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPostId(
                    activeCommentPostId === post.id ? null : post.id
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171F35] text-slate-400 hover:text-white border border-white/5 transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>{post.comment_count} Comments</span>
              </button>
            </div>

            {/* Expandable Comment Section */}
            {activeCommentPostId === post.id && (
              <div className="pt-4 border-t border-white/5 space-y-3 animate-in fade-in">
                {/* Existing comments */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {post.comments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No responses yet. Be the first to answer!</p>
                  ) : (
                    post.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-2xl bg-[#171F35] border border-white/5 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{c.author_name}</span>
                          <span className="text-[10px] text-slate-500">{c.created_at}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add comment box */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a constructive student response..."
                    className="flex-1 bg-[#171F35] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171F35] border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-lg font-bold text-white">Share with Campus Community</h3>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Tag</label>
                <select
                  value={newPostTag}
                  onChange={(e) => setNewPostTag(e.target.value)}
                  className="w-full bg-[#11182B] text-xs text-white px-3 py-2.5 rounded-xl border border-white/10"
                >
                  <option value="Academic">#Academic (Questions, Algorithms, Labs)</option>
                  <option value="Hackathons">#Hackathons (Teams, Projects, Ideas)</option>
                  <option value="PlacementPrep">#PlacementPrep (Interviews, Coding)</option>
                  <option value="TeamBuilding">#TeamBuilding (Co-founders, Collaborators)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Post Title *</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. How to intuitively visualize Dynamic Programming state transitions?"
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Details & Question *</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Provide context, problem statement, edge cases you have considered..."
                  rows={4}
                  className="w-full bg-[#11182B] text-xs text-white px-3.5 py-2.5 rounded-xl border border-white/10"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

