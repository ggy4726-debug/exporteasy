import React, { useState } from 'react';
import { OfficialDisclaimerHeader } from './components/OfficialDisclaimerHeader';
import { OfficialSitesGuide } from './components/OfficialSitesGuide';
import { DocumentChecklist } from './components/DocumentChecklist';
import { TaxCalculator } from './components/TaxCalculator';
import { LogisticsCalculator } from './components/LogisticsCalculator';
import { AIChatConsultant } from './components/AIChatConsultant';
import { CountryTrendsDashboard } from './components/CountryTrendsDashboard';
import { CommunityBoard } from './components/CommunityBoard';
import { TrendKeywordItem } from './types';
import {
  FileText,
  Calculator,
  Truck,
  MessageSquare,
  Building2,
  Ship,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Flame,
  Users,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'trends' | 'community' | 'documents' | 'taxes' | 'logistics' | 'chat' | 'official'
  >('trends');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  const handleAskAI = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setActiveTab('chat');
  };

  const handleSelectKeywordForTax = (keyword: TrendKeywordItem, countryId: string) => {
    setActiveTab('taxes');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. Official Customs Disclaimer Header (Strictly visible across all views) */}
      <OfficialDisclaimerHeader onOpenOfficialSites={() => setActiveTab('official')} />

      {/* 2. Main Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  수출이지 <span className="text-blue-600 text-sm font-bold font-mono">ExportEasy</span>
                </h1>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  소상공인 해외수출 도우미
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                실시간 트렌드 · 사장님 커뮤니티 · 필수 서류 · 예상 세금 및 디미니미스 · EMS 물류비 · 1:1 관세 AI 상담
              </p>
            </div>
          </div>

          {/* Quick Shortcuts & Official Hotline */}
          <div className="flex items-center gap-2 text-xs">
            <a
              href="https://unipass.customs.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>관세청 유니패스</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              onClick={() => setActiveTab('chat')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 수출닥터</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('trends')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'trends'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>1. 실시간 트렌드</span>
            <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded-full">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'community'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>2. 사장님 실전 커뮤니티</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded-full">
              NEW
            </span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. 필수 서류 & 체크리스트</span>
          </button>

          <button
            onClick={() => setActiveTab('taxes')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'taxes'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>4. 예상 관세 & 세금 계산기</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'logistics'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>5. 배송 물류비 & 마진 계산기</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>6. AI 수출닥터 상담실</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('official')}
            className={`py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'official'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>7. 관세청 & 공식기관 안내소</span>
          </button>
        </div>
      </header>

      {/* 3. Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {activeTab === 'trends' && (
          <CountryTrendsDashboard
            onSelectKeywordForTax={handleSelectKeywordForTax}
            onAskAIAboutTrend={handleAskAI}
          />
        )}
        {activeTab === 'community' && (
          <CommunityBoard onAskAIAboutPost={handleAskAI} />
        )}
        {activeTab === 'documents' && <DocumentChecklist />}
        {activeTab === 'taxes' && <TaxCalculator onAskAIAboutProduct={handleAskAI} />}
        {activeTab === 'logistics' && <LogisticsCalculator />}
        {activeTab === 'chat' && (
          <AIChatConsultant
            initialPrompt={chatInitialPrompt}
            onClearInitialPrompt={() => setChatInitialPrompt('')}
          />
        )}
        {activeTab === 'official' && <OfficialSitesGuide />}
      </main>

      {/* 4. Footer with Persistent Legal Notice */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-white font-bold text-sm">수출이지 (ExportEasy)</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                소규모 사업자 및 해외판매 1인 셀러를 위한 실시간 국가별 트렌드 · 사장님 커뮤니티 · 무역 서류 가이드 & 관부가세·배송비 추정 시스템
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href="https://unipass.customs.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <span>관세청 유니패스</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://cvci.customs.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <span>관세평가분류원 (HS심사)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://www.kotra.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <span>KOTRA 무역투자24</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://ems.epost.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition flex items-center gap-1"
              >
                <span>우체국 EMS 요금안내</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-[11px] leading-relaxed text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>정부 공인 사이트 확인 권고 (Legal & Customs Notice)</span>
            </div>
            <p>
              본 웹 애플리케이션에서 제공하는 실시간 트렌드, 커뮤니티 후기, 예상 관세, 현지 부가세, 면세 한도(De Minimis), 배송비 및 필요 서류 정보는
              소상공인 사장님의 이해를 돕기 위한 <strong>대략적인 참고용 시뮬레이션 가이드라인</strong>입니다.
            </p>
            <p>
              실제 물품 수출 시에는 제품의 성분, 재질, 가공 방식에 따라 <strong>품목분류(HS CODE 10단위)</strong>와
              적용 세율 및 해외 국가별 수입 요건(FDA, CPNP 등)이 달라질 수 있으므로,
              실제 선적 및 수출신고 전 반드시 <strong>관세청 전자통관시스템(UNI-PASS)</strong>,
              <strong>관세평가분류원</strong>, 또는 <strong>공인 관세사(Customs Broker)</strong>를 통해 최종 법적 적법성을 확인하시기 바랍니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-2">
            <span>© {new Date().getFullYear()} ExportEasy. 초보 사장님의 든든한 성공 수출 파트너.</span>
            <span>관세상담 무료 콜센터: 국번없이 125 (해외: +82-2-2181-1700)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
