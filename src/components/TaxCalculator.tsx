import React, { useState } from 'react';
import { DESTINATION_COUNTRIES, PRODUCT_CATEGORIES } from '../data/exportData';
import { DestinationCountry, ProductCategory } from '../types';
import {
  Calculator,
  Globe,
  Coins,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle,
  AlertTriangle,
  BadgePercent,
  RefreshCw,
} from 'lucide-react';

interface Props {
  onAskAIAboutProduct?: (prompt: string) => void;
}

export const TaxCalculator: React.FC<Props> = ({ onAskAIAboutProduct }) => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('US');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cosmetics');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KRW'>('USD');
  const [productPrice, setProductPrice] = useState<number>(150);
  const [shippingFee, setShippingFee] = useState<number>(25);
  const [insuranceFee, setInsuranceFee] = useState<number>(0);
  const [customDutyRate, setCustomDutyRate] = useState<number | null>(null);
  const [hasFtaCertificate, setHasFtaCertificate] = useState<boolean>(false);

  const country = DESTINATION_COUNTRIES.find((c) => c.id === selectedCountryId) || DESTINATION_COUNTRIES[0];
  const category = PRODUCT_CATEGORIES.find((p) => p.id === selectedCategoryId) || PRODUCT_CATEGORIES[0];

  // Exchange rate to convert USD to KRW
  const usdToKrwRate = 1380;

  // Normalize prices to USD for calculation
  const priceInUsd = currencyMode === 'USD' ? productPrice : productPrice / usdToKrwRate;
  const shippingInUsd = currencyMode === 'USD' ? shippingFee : shippingFee / usdToKrwRate;
  const insuranceInUsd = currencyMode === 'USD' ? insuranceFee : insuranceFee / usdToKrwRate;

  // CIF (Cost + Insurance + Freight) Value in USD
  const cifUsd = priceInUsd + shippingInUsd + insuranceInUsd;
  const cifKrw = cifUsd * usdToKrwRate;

  // Duty rate calculation
  const standardDutyRate = customDutyRate !== null ? customDutyRate : category.avgDutyRate;
  const effectiveDutyRate = hasFtaCertificate ? category.ftaBenefitRate : standardDutyRate;

  // De Minimis (소액면세) check
  // Note: For USA, Section 321 checks fair retail value (priceInUsd <= 800)
  // For Japan, CIF <= ~10,000 JPY
  // For EU, 150 EUR CIF
  const isDeMinimisExempt = country.deMinimisUsd > 0 && priceInUsd <= country.deMinimisUsd;

  // Customs Duty amount in USD
  const dutyAmountUsd = isDeMinimisExempt ? 0 : (cifUsd * effectiveDutyRate) / 100;
  const dutyAmountKrw = dutyAmountUsd * usdToKrwRate;

  // Taxable base for VAT in most countries is (CIF + Customs Duty)
  const vatRate = country.defaultVatRate;
  // Note: In EU, VAT applies even under 150 EUR. In US, no federal VAT (sales tax handled by platform).
  // In Japan, under 10k JPY consumption tax is exempt.
  let isVatExempt = false;
  if (country.id === 'US') {
    isVatExempt = true; // Handled by marketplace / state
  } else if (country.id === 'JP' && priceInUsd <= country.deMinimisUsd) {
    isVatExempt = true;
  } else if (country.id === 'AU' && priceInUsd <= country.deMinimisUsd) {
    isVatExempt = false; // GST still applies via marketplace
  }

  const vatAmountUsd = isVatExempt ? 0 : ((cifUsd + dutyAmountUsd) * vatRate) / 100;
  const vatAmountKrw = vatAmountUsd * usdToKrwRate;

  const totalTaxUsd = dutyAmountUsd + vatAmountUsd;
  const totalTaxKrw = totalTaxUsd * usdToKrwRate;

  // Potential FTA savings
  const potentialFtaSavingsUsd = isDeMinimisExempt ? 0 : (cifUsd * (standardDutyRate - category.ftaBenefitRate)) / 100;

  const handleAskAI = () => {
    if (!onAskAIAboutProduct) return;
    const prompt = `[수출 세금 및 서류 정밀 질의]
- 수출 대상국: ${country.nameKo}
- 품목: ${category.nameKo} (예상 HS: ${category.hsCodeExample})
- 상품금액: $${priceInUsd.toFixed(2)} USD (약 ${Math.round(priceInUsd * usdToKrwRate).toLocaleString()}원)
- 예상 배송비: $${shippingInUsd.toFixed(2)} USD
- 과세가격(CIF): $${cifUsd.toFixed(2)} USD

이 조건으로 ${country.nameKo}에 수출할 때:
1. 소액면세(디미니미스) 적용 가능 여부와 세부 주의점
2. 예상되는 관세 및 부가세/소비세 정확한 처리법 (DAP vs DDP 선택 팁)
3. 원산지증명서(한-${country.id === 'US' ? '미' : country.id === 'EU' ? 'EU' : '국가별'} FTA) 발급이 유리한지 여부
4. 화장품/식품 등 해당 카테고리의 필수 현지 인증 요건을 자세히 알려주세요.`;
    onAskAIAboutProduct(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold">
                2단계: 예상 세금 시뮬레이터
              </span>
              <span className="text-xs text-slate-500">관세 & 수입부가세 추산</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              국가별 예상 세금 & 면세 한도(De Minimis) 계산기
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              수출 대상국과 취급 품목을 선택하면 해당 국가의 소액 면세 혜택과 예상 관세·부가세를 실시간으로 시뮬레이션합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">통화 단위:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setCurrencyMode('USD')}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  currencyMode === 'USD' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrencyMode('KRW')}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  currencyMode === 'KRW' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
                }`}
              >
                KRW (원)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Section */}
        <div className="lg:col-span-7 space-y-5">
          {/* Country Selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              1. 수출 대상국 선택
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESTINATION_COUNTRIES.map((c) => {
                const isSelected = c.id === selectedCountryId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{c.currency}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{c.nameKo}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">면세 ~${c.deMinimisUsd}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Country Details Pill */}
            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-slate-500">면세 한도(De Minimis): </span>
                <strong className="text-blue-900">{country.deMinimisLocal}</strong>
              </div>
              <div>
                <span className="text-slate-500">현지 부가세/소비세: </span>
                <strong className="text-slate-800">{country.defaultVatRate}%</strong>
              </div>
            </div>
          </div>

          {/* Product Category Selection */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              2. 수출 상품 카테고리 & 대표 HS CODE
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setCustomDutyRate(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{cat.nameKo}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        기본관세 {cat.avgDutyRate}%
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-blue-700 block">
                      예시 HS: {cat.hsCodeExample}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">{cat.description}</span>
                  </button>
                );
              })}
            </div>

            {/* Special Regulations Alert for selected category */}
            <div className="mt-3 bg-amber-50/70 border border-amber-200/80 p-3 rounded-lg text-xs space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                {category.nameKo} 주요 해외 수입 규제 요건:
              </span>
              <ul className="list-disc list-inside text-amber-900 pl-1 space-y-0.5 text-[11px]">
                {category.specialRegulations.map((reg, idx) => (
                  <li key={idx}>{reg}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing & Value Inputs */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-purple-600" />
              3. 물품 금액 및 운송 비용 입력
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  순수 상품 금액 ({currencyMode})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currencyMode}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {currencyMode === 'USD'
                    ? `≈ ${Math.round(productPrice * usdToKrwRate).toLocaleString()} 원`
                    : `≈ $${(productPrice / usdToKrwRate).toFixed(2)} USD`}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  국제 운송비 ({currencyMode})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currencyMode}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {currencyMode === 'USD'
                    ? `≈ ${Math.round(shippingFee * usdToKrwRate).toLocaleString()} 원`
                    : `≈ $${(shippingFee / usdToKrwRate).toFixed(2)} USD`}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  적하보험료 ({currencyMode})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={insuranceFee}
                    onChange={(e) => setInsuranceFee(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    {currencyMode}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">소액특송은 보통 0원</span>
              </div>
            </div>

            {/* FTA Option */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasFtaCertificate}
                  onChange={(e) => setHasFtaCertificate(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span>FTA 원산지증명서(C/O) 발급하여 특혜관세(0%) 적용</span>
              </label>

              {hasFtaCertificate && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  관세율 0.0% 특혜적용
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Calculation Results Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                예상 세액 시뮬레이션 결과
              </span>
              <span className="text-sm">{country.flag} {country.nameKo}</span>
            </div>

            {/* De Minimis Status Banner */}
            <div className="my-4">
              {isDeMinimisExempt ? (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-emerald-200 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-emerald-300 font-bold">
                      소액 면세(De Minimis) 적용 대상!
                    </strong>
                    <p className="text-xs text-emerald-400/90 mt-0.5 leading-relaxed">
                      상품가($${priceInUsd.toFixed(2)})가 {country.nameKo} 면세 기준($${country.deMinimisUsd}) 이하이므로 수입 관세가 면제될 확률이 매우 높습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/70 border border-amber-500/50 p-4 rounded-xl text-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm text-amber-300 font-bold">
                      과세 대상 (면세 한도 초과)
                    </strong>
                    <p className="text-xs text-amber-300/80 mt-0.5 leading-relaxed">
                      면세 한도($${country.deMinimisUsd})를 초과하여 수입 관세 및 현지 세금이 부과될 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown List */}
            <div className="space-y-2.5 text-xs border-y border-slate-800 py-4 font-mono">
              <div className="flex justify-between text-slate-400 font-sans">
                <span>과세가격 (CIF = 상품+운임):</span>
                <span className="text-white font-mono font-semibold">
                  ${cifUsd.toFixed(2)} USD (약 {Math.round(cifKrw).toLocaleString()}원)
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="font-sans">
                  예상 관세 ({isDeMinimisExempt ? '면세 0%' : `${effectiveDutyRate}%`}):
                </span>
                <span className={`font-bold ${isDeMinimisExempt ? 'text-emerald-400' : 'text-white'}`}>
                  ${dutyAmountUsd.toFixed(2)} USD
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="font-sans">
                  현지 부가세/소비세 ({isVatExempt ? '면제' : `${vatRate}%`}):
                </span>
                <span className="font-bold text-white">${vatAmountUsd.toFixed(2)} USD</span>
              </div>

              {country.vatNotes && (
                <p className="text-[11px] text-slate-400 font-sans italic pt-1 border-t border-slate-800/80">
                  ℹ️ {country.vatNotes}
                </p>
              )}
            </div>

            {/* Total Estimated Taxes */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-sans">총 예상 세금액 (합계)</span>
                <span className="text-2xl font-black text-blue-400 font-mono">
                  ${totalTaxUsd.toFixed(2)} USD
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-sans">원화 환산 약</span>
                <span className="text-lg font-bold text-white font-mono">
                  약 {Math.round(totalTaxKrw).toLocaleString()} 원
                </span>
              </div>
            </div>

            {/* FTA Potential Savings */}
            {!hasFtaCertificate && potentialFtaSavingsUsd > 0 && (
              <div className="mt-4 bg-blue-950/60 border border-blue-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-blue-400" />
                  <span>FTA 원산지증명서 발급 시</span>
                </div>
                <strong className="text-emerald-400 font-mono font-bold">
                  -${potentialFtaSavingsUsd.toFixed(2)} USD 절감 가능!
                </strong>
              </div>
            )}

            {/* Direct Official Verification Link & Action */}
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5">
              <div className="bg-slate-800/70 p-3 rounded-lg text-[11px] text-slate-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>주의:</strong> 국가별/품목별 세칙에 따라 실 통관 시 세액 차이가 발생할 수 있으므로,
                  반드시 <a href="https://unipass.customs.go.kr" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 font-bold">관세청 유니패스</a>에서 공식 확인 바랍니다.
                </p>
              </div>

              {onAskAIAboutProduct && (
                <button
                  type="button"
                  onClick={handleAskAI}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>이 품목 AI 수출닥터에게 정밀 상담받기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
