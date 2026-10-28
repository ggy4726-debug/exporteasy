import React, { useState } from 'react';
import { DESTINATION_COUNTRIES, INITIAL_COUNTRY_TRENDS } from '../data/exportData';
import { CountryTrendData, TrendKeywordItem } from '../types';
import {
  TrendingUp,
  Flame,
  Globe,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  Lightbulb,
  ArrowRight,
  Calculator,
  MessageSquare,
  AlertCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onSelectKeywordForTax?: (keyword: TrendKeywordItem, countryId: string) => void;
  onAskAIAboutTrend?: (prompt: string) => void;
}

export const CountryTrendsDashboard: React.FC<Props> = ({
  onSelectKeywordForTax,
  onAskAIAboutTrend,
}) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('US');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('전체');
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [liveTrends, setLiveTrends] = useState<Record<string, { content: string; sources: Array<{ title: string; url: string }>; fetchedAt: string }>>({});

  const country = DESTINATION_COUNTRIES.find((c) => c.id === selectedCountryId) || DESTINATION_COUNTRIES[0];
  const initialData: CountryTrendData = INITIAL_COUNTRY_TRENDS[selectedCountryId] || INITIAL_COUNTRY_TRENDS['US'];
  const liveSyncData = liveTrends[selectedCountryId];

  // Filter trend keywords by selected category
  const filteredKeywords = initialData.trendKeywords.filter((item) => {
    if (selectedCategoryFilter === '전체') return true;
    return item.category.includes(selectedCategoryFilter);
  });

  const handleLiveSync = async () => {
    setIsSyncingLive(true);
    try {
      const res = await fetch('/api/country-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryName: country.nameKo,
          countryCode: country.id,
          category: selectedCategoryFilter,
        }),
      });

      if (!res.ok) {
        throw new Error('실시간 트렌드 동기화 실패');
      }

      const data = await res.json();
      setLiveTrends((prev) => ({
        ...prev,
        [selectedCountryId]: {
          content: data.content,
          sources: data.sources || [],
          fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      }));
    } catch (err: unknown) {
      console.error('Error syncing live trends:', err);
      alert('실시간 트렌드 데이터를 불러오는 중 오류가 발생했습니다. 기본 데이터셋으로 표시합니다.');
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleAskAIAboutKeyword = (item: TrendKeywordItem) => {
    if (!onAskAIAboutTrend) return;
    const prompt = `[${country.nameKo} 최신 트렌드 키워드 공략 상담]
- 타겟 국가: ${country.nameKo}
- 트렌드 키워드: ${item.keyword} (${item.keywordEn || ''})
- 카테고리: ${item.category}
- 추천 HS CODE: ${item.recommendedHsCode || '미정'}
- 인기 요인: ${item.reason}

소규모 1인 셀러가 이 아이템으로 ${country.nameKo} 온라인 시장(아마존/쇼피/이커머스)에 진입하려 할 때:
1. 소자본 셀러의 차별화 상품 기획 및 패키징 전략
2. 수출 시 반드시 챙겨야 할 현지 인증(FDA, CE 등) 및 필수 통관 서류
3. 관세청 유니패스에서 검색할 공식 HS CODE 확인 팁
4. 배송비와 파손율을 줄일 수 있는 포장 노하우를 알려주세요.`;
    onAskAIAboutTrend(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>실시간 글로벌 이커머스 트렌드 & 키워드 레이더</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              수출 대상국 실시간 트렌드 키워드 대시보드
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              수출하려는 국가의 현지 소비자들이 지금 가장 열광하는 <strong>실시간 검색 키워드, 마켓플레이스 인기 상품, 소상공인 틈새 아이템</strong>을 Google Search AI 그라운딩으로 실시간 분석합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLiveSync}
              disabled={isSyncingLive}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>{isSyncingLive ? '웹 검색 실시간 분석 중...' : '실시간 AI 트렌드 동기화'}</span>
            </button>
          </div>
        </div>

        {/* Live sync status banner */}
        {liveSyncData && (
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google Search 실시간 웹 검색 기반 최신 동기화 완료 ({liveSyncData.fetchedAt} 기준)</span>
            </span>
            <span className="text-slate-400 text-[11px]">검색 출처 {liveSyncData.sources.length}건 연동</span>
          </div>
        )}
      </div>

      {/* Country Selection & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Country Selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>수출 대상국 선택:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {DESTINATION_COUNTRIES.map((c) => {
              const isSelected = c.id === selectedCountryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountryId(c.id)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{c.flag}</span>
                  <span className="text-xs font-semibold">{c.nameKo.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-slate-500 font-medium mr-1">품목 분류:</span>
            {['전체', 'K-뷰티', 'K-푸드', 'K-패션', 'K-굿즈', '라이프스타일'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            선택 국가: <strong className="text-slate-800">{country.flag} {country.nameKo}</strong>
          </span>
        </div>
      </div>

      {/* Live Grounded AI Insights View (If user clicked live sync) */}
      {liveSyncData && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-white rounded-2xl border border-blue-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                {country.nameKo} 실시간 웹 검색 기반 시장 심층 분석 리포트
              </h3>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-md">
              Live Google Search Grounded
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-2 bg-white/80 p-4 rounded-xl border border-blue-100">
            {liveSyncData.content}
          </div>

          {/* Sources Chunks */}
          {liveSyncData.sources.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>실시간 검색 인용 출처 ({liveSyncData.sources.length}건):</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {liveSyncData.sources.map((src, sIdx) => (
                  <a
                    key={sIdx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 hover:text-blue-700 flex items-center justify-between gap-2 transition shadow-2xs"
                  >
                    <span className="line-clamp-1 font-medium">{src.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time Trend Keywords Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {country.nameKo} 실시간 급상승 키워드 & 유망 아이템
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            총 {filteredKeywords.length}개 트렌드 키워드
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKeywords.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all p-4 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      item.growthTag.includes('급상승')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : item.growthTag.includes('바이럴')
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : item.growthTag.includes('틈새')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {item.growthTag}
                  </span>

                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    검색량 {item.surgeScore}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {item.keyword}
                </h4>
                {item.keywordEn && (
                  <span className="text-[11px] text-slate-400 font-sans block mb-2">
                    {item.keywordEn}
                  </span>
                )}

                <p className="text-xs text-slate-600 leading-relaxed mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {item.reason}
                </p>

                {item.recommendedHsCode && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span>추정 HS CODE:</span>
                    <strong className="text-blue-700 font-mono font-bold">
                      {item.recommendedHsCode}
                    </strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {onSelectKeywordForTax && (
                  <button
                    onClick={() => onSelectKeywordForTax(item, country.id)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition cursor-pointer"
                    title="이 품목으로 세금 및 물류비 계산하기"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>비용 계산하기</span>
                  </button>
                )}

                {onAskAIAboutTrend && (
                  <button
                    onClick={() => handleAskAIAboutKeyword(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI 공략법 묻기</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Grid: Marketplace Trends & Small Business Niche Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Marketplace Popular Items */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>{country.nameKo} 주요 온라인 플랫폼별 히트 상품</span>
          </h3>

          <div className="space-y-3">
            {initialData.platformTrends.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs">{p.platform}</span>
                  <span className="text-[11px] text-blue-600 font-semibold">인기 마켓</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {p.topItems.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                    >
                      #{item}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded border border-slate-200/60 leading-relaxed">
                  💡 <strong>셀러 팁:</strong> {p.sellerTip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Small Business Niche Recommendations */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>초보 소상공인을 위한 저위험 틈새(Niche) 아이템 3선</span>
          </h3>

          <div className="space-y-3">
            {initialData.nicheOpportunities.map((niche, nIdx) => (
              <div
                key={nIdx}
                className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 text-xs">{niche.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    {niche.category}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  <strong>선정 이유:</strong> {niche.benefit}
                </p>
                <p className="text-emerald-800 text-[11px] font-medium">
                  ✅ <strong>소상공인 적합도:</strong> {niche.smallSellerFit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer on Trends & Customs Service confirmation */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-800 font-bold block">
            트렌드 상품 수출 전 필수 통관 확인 안내
          </strong>
          <p>
            위 트렌드 키워드는 현지 이커머스 검색량과 소비 선호도 데이터에 기반한 시장 인사이트입니다.
            실제 상품을 소싱하거나 수출할 때는 성분 및 안전성(화장품 MoCRA/CPNP, 식품 FDA FFR, 전자제품 FCC 등)에 따라
            수출입 규제가 적용되므로, <strong>관세청 유니패스(UNI-PASS)</strong> 및 <strong>KOTRA 해외시장뉴스</strong>에서
            정식 통관 요건을 반드시 사전에 확인하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};
