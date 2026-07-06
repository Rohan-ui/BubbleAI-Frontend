import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Sparkles, MessageSquare, ThumbsUp, Send, 
  Award, Flame, TrendingUp, Search, Plus, Filter, 
  Compass, ArrowUpRight, HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export function TeamCommunityWorkspace() {
  const [activeTab, setActiveTab] = useState<'trending' | 'collaborations' | 'feedback' | 'challenges'>('trending');
  const [commentInput, setCommentInput] = useState('');

  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 'post-1',
      author: {
        name: 'Sarah Villeneuve',
        handle: '@sarah_director',
        avatar: 'SV',
        role: 'Director'
      },
      title: 'How to maintain pacing in slow-burn Sci-Fi screenplay structure?',
      content: 'I am drafting a neo-classic screenplay utilizing Gemini AI director cues. Looking for general ideas on keeping audience engagement tight in silent cinematic intervals without adding audio/action bloat. Any recommendations from the community?',
      tags: ['Screenplay', 'SciFi', 'Pacing'],
      likes: 42,
      replies: 15,
      time: '3 hours ago',
      category: 'feedback'
    },
    {
      id: 'post-2',
      author: {
        name: 'Koji Takahashi',
        handle: '@koji_manga',
        avatar: 'KT',
        role: 'Manga Artist'
      },
      title: 'Collaboration Invitation: Designing Cyberpunk Webtoon Layout',
      content: 'Hello creators! I have a fully fleshed-out script for a 3-chapter cyberpunk comic. Looking for screenwriters or visual layout designers specializing in vertical-scrolling webtoon boards. Willing to build collaboratively in the workspace database.',
      tags: ['Comic', 'Collab', 'Cyberpunk'],
      likes: 58,
      replies: 24,
      time: '1 day ago',
      category: 'collaborations'
    },
    {
      id: 'post-3',
      author: {
        name: 'Alex Rivera',
        handle: '@arivera_creative',
        avatar: 'AR',
        role: 'Producer'
      },
      title: 'Weekly Challenge: The 3-Sentence Inciting Incident Challenge',
      content: 'Unleash your creative skills! Pitch an eye-catching, high-tension inciting incident for a modern spy thriller using exactly three sentences. Winners get their idea peer-reviewed by our community panel of Directors!',
      tags: ['Challenge', 'IncitingIncident', 'Tension'],
      likes: 112,
      replies: 48,
      time: '2 days ago',
      category: 'challenges'
    }
  ]);

  const handleLike = (id: string) => {
    setCommunityPosts(posts => 
      posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-blue mb-2">
            <Users className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Global Network</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Team Community</h1>
          <p className="text-brand-light-grey text-sm mt-1">
            Exchange director strategies, collaborate on multi-media drafts, and refine your concepts with active peers.
          </p>
        </div>

        <button className="bg-brand-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2 transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4" />
          Start Discussion
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Discussions/Workspace Feed */}
        <section className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex bg-brand-grey/15 p-1 rounded-xl border border-white/5">
            {(['trending', 'collaborations', 'feedback', 'challenges'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  activeTab === tab 
                    ? "bg-brand-blue/20 text-brand-blue shadow-inner border border-brand-blue/10" 
                    : "text-brand-light-grey hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts list */}
          <div className="space-y-6">
            {communityPosts
              .filter(p => activeTab === 'trending' ? true : p.category === activeTab)
              .map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-brand-grey/25 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 flex items-center justify-center font-bold text-sm">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{post.author.name}</span>
                          <span className="text-brand-light-grey/40 text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{post.author.role}</span>
                        </div>
                        <span className="text-brand-light-grey text-xs">{post.author.handle}</span>
                      </div>
                    </div>
                    <span className="text-brand-light-grey/40 text-xs">{post.time}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-white leading-snug hover:text-brand-blue transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-brand-light-grey text-sm leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-brand-blue bg-brand-blue/5 border border-brand-blue/10 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-brand-light-grey text-sm">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 hover:text-white transition-colors group"
                    >
                      <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform text-brand-light-grey/60 group-hover:text-[#FFC857]" />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button className="flex items-center gap-2 hover:text-white transition-colors group">
                      <MessageSquare className="w-4 h-4 text-brand-light-grey/60 group-hover:text-brand-blue" />
                      <span>{post.replies} Replies</span>
                    </button>

                    <button className="flex items-center gap-1 hover:text-white transition-colors text-brand-blue font-bold text-xs uppercase tracking-widest">
                      Discuss
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.article>
            ))}
          </div>
        </section>

        {/* Right Sidebar: Guidelines, Active Challenge & Top Directors */}
        <aside className="space-y-8">
          {/* Active Campaign / Challenge */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-blue/30 via-transparent to-transparent border border-brand-blue/15 space-y-4">
            <div className="flex items-center gap-2 text-brand-blue">
              <Flame className="w-5 h-5 text-brand-blue" />
              <h4 className="font-bold uppercase text-xs tracking-widest">Active Challenge</h4>
            </div>
            <div>
              <h5 className="font-extrabold text-base mb-1">Weekly Screenplay Pitch</h5>
              <p className="text-brand-light-grey text-xs leading-relaxed">
                Pitch an eye-catching Spy Thriller opening that utilizes less than three dialogue lines. Complete prior to Sunday to stand a chance of peer recognition.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-lg bg-brand-blue text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors">
              Submit Draft Pitch
            </button>
          </div>

          {/* Top Creative Directors of the Week */}
          <div className="bg-brand-grey/20 border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#FFC857] flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Top Creators
            </p>
            <div className="space-y-4">
              {[
                { name: 'Sarah Villeneuve', score: '3.4k pts', rank: '#1', act: 'Director' },
                { name: 'Koji Takahashi', score: '2.9k pts', rank: '#2', act: 'Illustrator' },
                { name: 'Michael Crichton', score: '2.5k pts', rank: '#3', act: 'Editor' }
              ].map((creator, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-brand-light-grey">
                      {creator.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-none">{creator.name}</p>
                      <span className="text-[10px] text-brand-light-grey/40 uppercase tracking-widest font-bold">{creator.act}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#FFC857]">{creator.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Help & Forum Rules */}
          <div className="bg-brand-grey/10 border border-white/5 rounded-2xl p-6 space-y-4 text-xs text-brand-light-grey">
            <div className="flex items-center gap-2 text-brand-light-grey/70 font-semibold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Guidelines</span>
            </div>
            <ul className="space-y-2 list-disc pl-4 leading-relaxed">
              <li>Keep all interactions professional.</li>
              <li>Only post materials with clean authorship or collaborative intent.</li>
              <li>AI-generated text or graphics must be designated as such.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
