import React, { useState, useEffect } from 'react';
import { INITIAL_COMMUNITY_POSTS } from '../data/communityData';
import { DESTINATION_COUNTRIES } from '../data/exportData';
import { CommunityPost, CommunityCategory, CommunityComment } from '../types';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  PenLine,
  Search,
  Filter,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Pin,
  Building,
  Globe,
  Tag,
} from 'lucide-react';

interface Props {
  onAskAIAboutPost?: (prompt: string) => void;
}

const CATEGORIES: Array<CommunityCategory | '전체'> = [
  '전체',
  '꿀팁/노하우',
  '수출성공후기',
  '실패/주의사례',
  '물류/배송후기',
  '서류/인증정보',
  '질문/답변',
];

export const CommunityBoard: React.FC<Props> = ({ onAskAIAboutPost }) => {
  // Load posts from localStorage or initialize with curated preset
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('export_community_posts');
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | '전체'>('전체');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPostIds, setExpandedPostIds] = useState<Record<string, boolean>>({
    'post-pinned-1': true,
  });

  // Write Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('꿀팁/노하우');
  const [newTargetCountry, setNewTargetCountry] = useState<string>('ALL');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCompanyType, setNewCompanyType] = useState<string>('');
  const [newCoreTip, setNewCoreTip] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentAuthors, setCommentAuthors] = useState<Record<string, string>>({});

  // Save to localStorage whenever posts change
  useEffect(() => {
    try {
      localStorage.setItem('export_community_posts', JSON.stringify(posts));
    } catch {
      // Ignore storage errors
    }
  }, [posts]);

  // Handle Like Toggle
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          };
        }
        return post;
      })
    );
  };

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpandedPostIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle New Post Submission
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('제목과 상세 내용을 입력해 주세요.');
      return;
    }

    const countryObj = DESTINATION_COUNTRIES.find((c) => c.id === newTargetCountry);
    const countryName = countryObj ? countryObj.nameKo : '전 세계 공통';

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      coreTip: newCoreTip.trim() || undefined,
      author: newAuthor.trim() || '익명 사장님',
      companyType: newCompanyType.trim() || '소상공인 셀러',
      targetCountryId: newTargetCountry,
      targetCountryName: countryName,
      likes: 1,
      isLiked: true,
      views: 1,
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      badge: '신규 나눔',
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsWriteModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewCoreTip('');
    setNewAuthor('');
    setNewCompanyType('');
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const author = (commentAuthors[postId] || '').trim() || '동료 사장님';
    const newComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      author,
      content: text,
      createdAt: '방금 전',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Category filter
    if (selectedCategory !== '전체' && post.category !== selectedCategory) {
      return false;
    }
    // Country filter
    if (selectedCountryFilter !== 'ALL' && post.targetCountryId !== selectedCountryFilter && post.targetCountryId !== 'ALL') {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTip = post.coreTip?.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchTip && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  const handleAskAIAboutPostContent = (post: CommunityPost) => {
    if (!onAskAIAboutPost) return;
    const prompt = `[동료 셀러 커뮤니티 후기 검토 및 추가 상담]
- 글 제목: ${post.title}
- 카테고리: ${post.category} (${post.targetCountryName})
- 공유된 핵심 팁: ${post.coreTip || '없음'}
- 본문 요약: ${post.content.slice(0, 300)}...

위 후기/팁과 관련하여:
1. 해당 방식이 현재 관세청 및 대상국 세관 규정상 적법한지 검증해 주세요.
2. 초보 사장님이 이 경험을 적용할 때 주의해야 할 세부 리스크나 추가 서류는 무엇이 있나요?
3. 관세청 유니패스(UNI-PASS)에서 공식 확인할 사항을 정리해 주세요.`;
    onAskAIAboutPost(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Community Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>소상공인 수출 사장님 실전 경험 & 꿀팁 나눔터</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              이용업체 실전 후기 & 수출 노하우 커뮤니티
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              수출 성공 후기, 세관 통관 지연/실패 경험담, K-Packet·특송 물류비 절감 팁, 국가별 인증 노하우를 실제 사장님들과 자유롭게 나누고 질문하세요.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>내 수출 후기 & 팁 작성하기</span>
            </button>
          </div>
        </div>

        {/* Community Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">누적 공유된 실전 팁</span>
            <strong className="text-white text-sm font-bold">{posts.length}개 스토리</strong>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">서로 나눈 추천·공감</span>
            <strong className="text-emerald-400 text-sm font-bold">
              {posts.reduce((sum, p) => sum + p.likes, 0)}회 도움됨
            </strong>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">소통 댓글</span>
            <strong className="text-blue-400 text-sm font-bold">
              {posts.reduce((sum, p) => sum + p.comments.length, 0)}건 작성
            </strong>
          </div>
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block text-[11px]">참여 업종</span>
            <strong className="text-purple-300 text-sm font-bold">뷰티/식품/패션/잡화</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Search & Country */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="키워드 검색 (예: 간이수출신고, MoCRA, K-Packet, 가죽관세, 아마존...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-blue-500"
            >
              <option value="ALL">전체 국가 후기</option>
              {DESTINATION_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.nameKo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Community Posts Thread List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">해당 조건에 맞는 후기가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">검색어를 바꾸거나 첫 후기를 직접 남겨보세요!</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isExpanded = !!expandedPostIds[post.id];

            return (
              <div
                key={post.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs ${
                  post.isPinned
                    ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Post Header */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          <Pin className="w-3 h-3 text-blue-600 fill-blue-600" />
                          <span>공지 필독</span>
                        </span>
                      )}

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          post.category === '실패/주의사례'
                            ? 'bg-red-100 text-red-800'
                            : post.category === '수출성공후기'
                            ? 'bg-emerald-100 text-emerald-800'
                            : post.category === '물류/배송후기'
                            ? 'bg-purple-100 text-purple-800'
                            : post.category === '서류/인증정보'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {post.category}
                      </span>

                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {post.targetCountryName}
                      </span>

                      {post.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                          {post.badge}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <span>{post.createdAt}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => toggleExpand(post.id)}
                    className="text-base sm:text-lg font-bold text-slate-900 cursor-pointer hover:text-blue-600 transition"
                  >
                    {post.title}
                  </h3>

                  {/* Core Tip Highlight Banner */}
                  {post.coreTip && (
                    <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-amber-900 block mb-0.5">
                          💡 사장님의 1줄 핵심 꿀팁:
                        </strong>
                        <p className="leading-relaxed">{post.coreTip}</p>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div
                    className={`text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed ${
                      !isExpanded ? 'line-clamp-3' : ''
                    }`}
                  >
                    {post.content}
                  </div>

                  {/* Author Row & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[10px]">
                        {post.author[0]}
                      </div>
                      <span className="font-bold text-slate-800">{post.author}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{post.companyType}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                          post.isLiked
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-blue-600' : ''}`} />
                        <span>도움돼요 {post.likes}</span>
                      </button>

                      {onAskAIAboutPost && (
                        <button
                          onClick={() => handleAskAIAboutPostContent(post)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition cursor-pointer"
                          title="이 후기 내용에 대해 AI 수출닥터에게 질문하기"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI 검증 질문</span>
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                      >
                        <span>{isExpanded ? '접기' : '더보기 & 댓글'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Section: Comments List & Input */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">
                      💬 동료 사장님들의 댓글 ({post.comments.length})
                    </span>

                    {/* Comment list */}
                    {post.comments.length > 0 ? (
                      <div className="space-y-2">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800">{comment.author}</span>
                                {comment.companyType && (
                                  <span className="text-slate-400">({comment.companyType})</span>
                                )}
                              </div>
                              <span className="text-slate-400">{comment.createdAt}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">아직 작성된 댓글이 없습니다. 첫 의견을 남겨보세요!</p>
                    )}

                    {/* Comment Input */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch gap-2">
                      <input
                        type="text"
                        placeholder="닉네임 (예: 1인셀러)"
                        value={commentAuthors[post.id] || ''}
                        onChange={(e) =>
                          setCommentAuthors({ ...commentAuthors, [post.id]: e.target.value })
                        }
                        className="w-full sm:w-36 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                      />
                      <input
                        type="text"
                        placeholder="동료 사장님에게 응원이나 질문을 남겨보세요..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>등록</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Community Disclaimer Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">
            커뮤니티 이용 수칙 및 법적 주의사항
          </strong>
          <p>
            본 커뮤니티는 해외수출을 진행하는 개별 소상공인 사장님들이 실제 현장에서 겪은 <strong>경험담과 노하우를 자율적으로 공유하는 공간</strong>입니다.
            각국의 통관 세법 및 인증 기준(FDA, CPNP, 관세율 등)은 수시로 변동되므로, 실제 선적 및 수출신고 전에는 반드시
            <strong> 관세청 전자통관시스템(UNI-PASS)</strong> 및 <strong>관세평가분류원</strong>, 또는 공인 관세사를 통해 최종 확인하시기 바랍니다.
          </p>
        </div>
      </div>

      {/* Write New Post Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PenLine className="w-5 h-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  수출 후기 & 실전 팁 공유하기
                </h3>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CommunityCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-blue-500"
                  >
                    <option value="꿀팁/노하우">꿀팁/노하우</option>
                    <option value="수출성공후기">수출성공후기</option>
                    <option value="실패/주의사례">실패/주의사례</option>
                    <option value="물류/배송후기">물류/배송후기</option>
                    <option value="서류/인증정보">서류/인증정보</option>
                    <option value="질문/답변">질문/답변</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">관련 수출 국가</label>
                  <select
                    value={newTargetCountry}
                    onChange={(e) => setNewTargetCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-blue-500"
                  >
                    <option value="ALL">전 세계 공통</option>
                    {DESTINATION_COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.nameKo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">작성자 닉네임</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 뷰티셀러김대표"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">업종 / 형태</label>
                  <input
                    type="text"
                    placeholder="예: K-뷰티 1인 제조, 동대문 패션"
                    value={newCompanyType}
                    onChange={(e) => setNewCompanyType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: [미국 아마존] 첫 FBA 입고 시 바코드 라벨링 주의점 공유합니다"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold text-xs sm:text-sm focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-amber-900 block mb-1">
                  💡 1줄 핵심 팁 (선택 사항)
                </label>
                <input
                  type="text"
                  placeholder="동료 사장님들이 바로 적용할 수 있는 1줄 요약 팁"
                  value={newCoreTip}
                  onChange={(e) => setNewCoreTip(e.target.value)}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2 text-amber-950 placeholder-amber-700/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">상세 경험담 & 노하우 내용</label>
                <textarea
                  rows={6}
                  required
                  placeholder="수출 준비 과정에서 겪었던 시행착오, 서류 발급 요령, 배송비 절감 방법 등을 자세히 적어주시면 다른 사장님들께 큰 도움이 됩니다."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed focus:bg-white focus:outline-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  후기 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
