import React, { useState } from 'react';
import { SHIPPING_METHODS, DESTINATION_COUNTRIES } from '../data/exportData';
import { ShippingMethod } from '../types';
import {
  Truck,
  Package,
  Scale,
  Box,
  Coins,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
  DollarSign,
  ChevronRight,
} from 'lucide-react';

export const LogisticsCalculator: React.FC = () => {
  // Package dimensions & weight
  const [actualWeightKg, setActualWeightKg] = useState<number>(1.2);
  const [boxLengthCm, setBoxLengthCm] = useState<number>(25);
  const [boxWidthCm, setBoxWidthCm] = useState<number>(20);
  const [boxHeightCm, setBoxHeightCm] = useState<number>(15);
  const [destinationCountry, setDestinationCountry] = useState<string>('US');

  // Profit Margin Calculator fields
  const [sellingPriceUsd, setSellingPriceUsd] = useState<number>(45);
  const [cogsKrw, setCogsKrw] = useState<number>(15000); // 원가 (KRW)
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(12); // 플랫폼 수수료 (아마존 15%, 쇼피 8~10%)
  const [selectedMethodId, setSelectedMethodId] = useState<string>('ems');

  const usdToKrwRate = 1380;

  // Calculate CBM
  const cbm = (boxLengthCm * boxWidthCm * boxHeightCm) / 1000000;

  // Volumetric weight for divisor 5000 (Express) and 6000 (Postal)
  const volWeight5000 = (boxLengthCm * boxWidthCm * boxHeightCm) / 5000;
  const volWeight6000 = (boxLengthCm * boxWidthCm * boxHeightCm) / 6000;

  // Calculate rate for each method
  const shippingEstimates = SHIPPING_METHODS.map((method) => {
    const divisor = method.volumetricDivisor;
    const volWeight = (boxLengthCm * boxWidthCm * boxHeightCm) / divisor;
    const chargeableWeightKg = Math.max(actualWeightKg, volWeight);

    let isEligible = true;
    let ineligibilityReason = '';

    if (method.maxWeightKg && chargeableWeightKg > method.maxWeightKg) {
      isEligible = false;
      ineligibilityReason = `최대 ${method.maxWeightKg}kg 초과`;
    }

    // Rough country multiplier
    let countryMultiplier = 1.0;
    if (destinationCountry === 'US') countryMultiplier = 1.25;
    else if (destinationCountry === 'JP') countryMultiplier = 0.85;
    else if (destinationCountry === 'SG') countryMultiplier = 0.95;
    else if (destinationCountry === 'EU' || destinationCountry === 'GB') countryMultiplier = 1.35;
    else if (destinationCountry === 'AU') countryMultiplier = 1.2;

    // Weight calculation
    const extraWeight = Math.max(0, chargeableWeightKg - method.baseWeightKg);
    const rawCost = (method.basePriceKrw + extraWeight * method.perAdditionalKgKrw) * countryMultiplier;
    const fuelCost = (rawCost * method.fuelSurchargePercent) / 100;
    const totalCostKrw = Math.round(rawCost + fuelCost);
    const totalCostUsd = parseFloat((totalCostKrw / usdToKrwRate).toFixed(2));

    return {
      ...method,
      chargeableWeightKg: parseFloat(chargeableWeightKg.toFixed(2)),
      volWeight: parseFloat(volWeight.toFixed(2)),
      isVolumetricBigger: volWeight > actualWeightKg,
      totalCostKrw,
      totalCostUsd,
      fuelCostKrw: Math.round(fuelCost),
      isEligible,
      ineligibilityReason,
    };
  });

  const selectedShipping = shippingEstimates.find((m) => m.id === selectedMethodId) || shippingEstimates[0];

  // Margin calculation
  const revenueKrw = sellingPriceUsd * usdToKrwRate;
  const platformFeeKrw = (revenueKrw * platformFeePercent) / 100;
  const shippingCostKrw = selectedShipping.totalCostKrw;
  const totalCostBeforeTaxKrw = cogsKrw + platformFeeKrw + shippingCostKrw;
  const netProfitKrw = revenueKrw - totalCostBeforeTaxKrw;
  const netProfitUsd = netProfitKrw / usdToKrwRate;
  const marginPercent = revenueKrw > 0 ? (netProfitKrw / revenueKrw) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
                3단계: 해외 배송비 & 마진 계산기
              </span>
              <span className="text-xs text-slate-500">실중량 vs 부피무게 비교</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              국제 배송 물류비 견적 & 실수령 마진 분석
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              박스 규격을 입력하면 실중량과 부피무게를 비교하여 실제 청구 중량을 확인하고, 우체국 EMS/특송/포워딩 운임과 최종 마진율을 계산합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">목적지:</span>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-blue-500"
            >
              {DESTINATION_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.nameKo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dimension & Weight Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Packaging & Weight Input Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-blue-600" />
              <span>포장 박스 크기 및 무게 입력</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  가로 길 (Length)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={boxLengthCm}
                    onChange={(e) => setBoxLengthCm(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">cm</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  세로 너비 (Width)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={boxWidthCm}
                    onChange={(e) => setBoxWidthCm(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">cm</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  상자 높이 (Height)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={boxHeightCm}
                    onChange={(e) => setBoxHeightCm(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">cm</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                실제 측정 무게 (Gross Weight)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.05"
                  step="0.1"
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(Math.max(0.05, parseFloat(e.target.value) || 0.1))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">kg</span>
              </div>
            </div>

            {/* Crucial Concept Callout: Actual vs Volumetric Weight */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">📦 화물 부피 (CBM):</span>
                <span className="font-mono font-bold text-slate-900">{cbm.toFixed(4)} CBM</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[11px]">
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">특송사 부피무게 (/5000)</span>
                  <strong className={`font-mono text-xs ${volWeight5000 > actualWeightKg ? 'text-amber-600' : 'text-slate-800'}`}>
                    {volWeight5000.toFixed(2)} kg
                  </strong>
                </div>
                <div className="bg-white p-2 rounded border border-slate-100">
                  <span className="text-slate-500 block">우체국 부피무게 (/6000)</span>
                  <strong className={`font-mono text-xs ${volWeight6000 > actualWeightKg ? 'text-amber-600' : 'text-slate-800'}`}>
                    {volWeight6000.toFixed(2)} kg
                  </strong>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-600 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>초보 사장님 필수 상식:</strong> 국제 물류사는 저울로 잰 <em>실무게</em>와 상자 부피로 계산한 <em>부피무게</em> 중 <strong>더 큰 쪽</strong>을 청구 중량(Chargeable Weight)으로 삼습니다. 박스가 크면 요금이 급증하니 알맞은 크기로 포장하세요!
                </span>
              </div>
            </div>
          </div>

          {/* Margin & Profit Calculator */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>해외판매 순마진(Net Margin) 시뮬레이터</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">해외 판매가 (USD)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={sellingPriceUsd}
                    onChange={(e) => setSellingPriceUsd(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">$</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  ≈ {Math.round(revenueKrw).toLocaleString()}원
                </span>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">상품 제조/매입원가 (KRW)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={cogsKrw}
                    onChange={(e) => setCogsKrw(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">원</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">플랫폼/결제 수수료 (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={platformFeePercent}
                    onChange={(e) => setPlatformFeePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">%</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">아마존 15%, 쇼피 8%</span>
              </div>
            </div>

            {/* Calculated Profit Card */}
            <div className={`p-4 rounded-xl border ${netProfitKrw >= 0 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50/60 border-red-200'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">선택된 운송비 ({selectedShipping.nameKo}):</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedShipping.totalCostKrw.toLocaleString()} 원 (${selectedShipping.totalCostUsd})
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mt-1 pt-1 border-t border-slate-200/60">
                <span className="text-slate-600">플랫폼 수수료 ({platformFeePercent}%):</span>
                <span className="font-mono text-slate-700">
                  {Math.round(platformFeeKrw).toLocaleString()} 원
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">최종 실수령 순이익</span>
                  <span className={`text-xl font-black font-mono ${netProfitKrw >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {Math.round(netProfitKrw).toLocaleString()} 원 (${netProfitUsd.toFixed(2)})
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">순마진율</span>
                  <span className={`text-lg font-black font-mono ${marginPercent >= 20 ? 'text-emerald-700' : marginPercent > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                    {marginPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Shipping Options Comparison Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>운송 옵션별 예상 운임 비교표</span>
              </h3>
              <span className="text-xs text-slate-500">
                중량: {actualWeightKg}kg / {cbm.toFixed(3)} CBM
              </span>
            </div>

            <div className="space-y-2.5">
              {shippingEstimates.map((method) => {
                const isSelected = method.id === selectedMethodId;

                return (
                  <div
                    key={method.id}
                    onClick={() => method.isEligible && setSelectedMethodId(method.id)}
                    className={`p-3.5 rounded-xl border transition-all ${
                      !method.isEligible
                        ? 'opacity-50 bg-slate-100/60 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs cursor-pointer'
                        : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{method.nameKo}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {method.typicalDays}
                          </span>
                          {method.isVolumetricBigger && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                              부피무게 적용
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5">{method.recommendedFor}</p>
                      </div>

                      <div className="text-right shrink-0">
                        {method.isEligible ? (
                          <>
                            <span className="text-base font-extrabold text-blue-900 font-mono block">
                              {method.totalCostKrw.toLocaleString()} 원
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ≈ ${method.totalCostUsd} USD (청구 {method.chargeableWeightKg}kg)
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-red-500">{method.ineligibilityReason}</span>
                        )}
                      </div>
                    </div>

                    {method.fuelSurchargePercent > 0 && method.isEligible && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>유류할증료 ({method.fuelSurchargePercent}%) 포함됨</span>
                        <span>할증액 약 +{method.fuelCostKrw.toLocaleString()}원</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official EMS Rates Link & Caution */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span>* 실제 운임은 환율 및 분기별 유류비에 따라 변동될 수 있습니다.</span>
              <a
                href="https://ems.epost.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
              >
                <span>우체국 공식 요금표 조회</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
