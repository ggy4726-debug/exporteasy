import React from 'react';
import { AlertTriangle, ExternalLink, ShieldAlert, PhoneCall, Building2 } from 'lucide-react';

interface Props {
  onOpenOfficialSites?: () => void;
}

export const OfficialDisclaimerHeader: React.FC<Props> = ({ onOpenOfficialSites }) => {
  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 border-y border-amber-300/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-sm text-amber-950">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] tracking-wide">
                법적 고지 및 공식 검증 필수
              </span>
              <span className="font-semibold text-slate-800">
                본 앱의 세금 및 물류비는 소규모 초보 사장님을 위한 대략적인 가이드라인(추정치)입니다.
              </span>
            </div>
            <p className="text-slate-600 mt-0.5 leading-relaxed">
              정확한 <strong>품목분류(HS CODE 10단위)</strong>, 국가별 수입 규제 요건 및 최종 관세·부가세는
              반드시 <strong>관세청 전자통관시스템(UNI-PASS)</strong> 및 <strong>관세평가분류원</strong>, 공인 관세사를 통해 최종 확인하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end pt-1 md:pt-0">
          <a
            href="https://unipass.customs.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>관세청 유니패스</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="tel:125"
            title="관세청 무료 민원 상담 콜센터 125"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-medium border border-amber-300 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-800" />
            <span>관세상담 125</span>
          </a>

          {onOpenOfficialSites && (
            <button
              onClick={onOpenOfficialSites}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition shadow-xs"
            >
              공인기관 모음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
