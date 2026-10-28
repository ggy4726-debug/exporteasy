import React from 'react';
import { OFFICIAL_SITES } from '../data/exportData';
import { ExternalLink, CheckCircle2, Phone, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';

export const OfficialSitesGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Notice Card */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            정부 및 공인기관 공식 검증 센터
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            초보 사장님을 위한 공인 무역·통관 사이트 안내
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            해외수출은 상대국의 통관법과 관세법이 엄격히 적용되는 법적 상거래입니다.
            인터넷 정보나 비공식 채널에만 의존하지 마시고, <strong>관세청 및 KOTRA 등 국가 공인 사이트</strong>에서
            품목분류(HS CODE)와 관세율, 수출신고를 안전하게 최종 검증하세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-700/60 text-xs">
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl">
              <span className="text-blue-400 font-semibold block mb-0.5">📞 관세청 무료 콜센터</span>
              <strong className="text-white text-base">국번없이 125</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">평일 09:00~18:00 품목분류·통관 무료 상담</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl">
              <span className="text-emerald-400 font-semibold block mb-0.5">🏢 중소기업 수출지원</span>
              <strong className="text-white text-base">KOTRA 1600-7119</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">해외 규제 및 바이어 매칭 무료 지원</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl">
              <span className="text-purple-400 font-semibold block mb-0.5">⚖️ HS CODE 사전심사</span>
              <strong className="text-white text-base">관세평가분류원</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">세관 적발 방지 세번 법적 확정</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Verified Official Sites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {OFFICIAL_SITES.map((site, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  {site.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {site.role}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                {site.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                {site.description}
              </p>

              <div className="space-y-1.5 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-1">
                  💡 초보 사장님 핵심 활용 포인트:
                </span>
                {site.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{site.callCenter}</span>
              </div>

              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-xs"
              >
                <span>공식 사이트 방문</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Guide: How to search HS Code on UNI-PASS */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
        <h4 className="text-base font-bold text-amber-950 flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-amber-700" />
          관세청 유니패스에서 내 상품 HS CODE 검색하는 3단계 팁
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
          <li>
            <strong>관세청 유니패스(unipass.customs.go.kr)</strong> 상단 메뉴에서 <strong>[정보조회] → [품목분류] → [품목정보]</strong>로 이동합니다.
          </li>
          <li>
            내 제품의 핵심 키워드(예: <em>마스크팩, 원피스, 텀블러, 라면</em> 등)를 한글로 검색하여 유사한 10단위 세번(HSK)을 조회합니다.
          </li>
          <li>
            정확한 판단이 어렵거나 신제품인 경우, <strong>관세평가분류원 품목분류 사전심사 제도</strong>를 통해 법적 효력이 있는 공식 세번을 무료/저렴하게 확정받으실 수 있습니다.
          </li>
        </ol>
      </div>
    </div>
  );
};
