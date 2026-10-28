import React, { useState, useEffect } from 'react';
import { EXPORT_DOCUMENTS_GUIDE } from '../data/exportData';
import { ExportDocumentItem, CommercialInvoiceData } from '../types';
import {
  FileText,
  CheckCircle2,
  Circle,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Download,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react';

export const DocumentChecklist: React.FC = () => {
  // Local storage checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('export_doc_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [expandedId, setExpandedId] = useState<string | null>('commercial_invoice');
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState<boolean>(false);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);

  // Sample Commercial Invoice State
  const [invoiceData, setInvoiceData] = useState<CommercialInvoiceData>({
    shipperName: '홍길동 (Hong Gil-Dong)',
    shipperCompany: '한국글로벌컴퍼니 (K-Global Co., Ltd.)',
    shipperAddress: '서울특별시 강남구 테헤란로 123 (Teheran-ro 123, Seoul, Korea)',
    shipperTel: '+82-10-1234-5678',
    consigneeName: 'John Smith',
    consigneeCompany: 'Pacific Retail LLC',
    consigneeAddress: '456 Market St, Suite 200, San Francisco, CA 94105, USA',
    consigneeCountry: 'UNITED STATES',
    consigneeTel: '+1-415-555-0199',
    invoiceNo: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-001`,
    invoiceDate: new Date().toISOString().split('T')[0],
    incoterms: 'DAP (Delivered at Place)',
    items: [
      {
        description: 'K-Beauty Moisture Facial Sheet Mask (10pcs/box)',
        hsCode: '3304.99',
        quantity: 50,
        unitPriceUsd: 12.0,
        origin: 'Republic of Korea',
      },
      {
        description: 'Cotton Oversized Graphic T-Shirt',
        hsCode: '6109.10',
        quantity: 20,
        unitPriceUsd: 25.0,
        origin: 'Republic of Korea',
      },
    ],
  });

  useEffect(() => {
    try {
      localStorage.setItem('export_doc_checklist', JSON.stringify(checkedItems));
    } catch {
      // Ignore local storage error
    }
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = EXPORT_DOCUMENTS_GUIDE.filter((doc) => checkedItems[doc.id]).length;
  const progressPercent = Math.round((completedCount / EXPORT_DOCUMENTS_GUIDE.length) * 100);

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unitPriceUsd, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyInvoiceText = () => {
    const text = `
========================================
COMMERCIAL INVOICE
Invoice No: ${invoiceData.invoiceNo}
Date: ${invoiceData.invoiceDate}
Terms: ${invoiceData.incoterms}
----------------------------------------
[SHIPPER / EXPORTER]
Company: ${invoiceData.shipperCompany}
Contact: ${invoiceData.shipperName} (${invoiceData.shipperTel})
Address: ${invoiceData.shipperAddress}

[CONSIGNEE / IMPORTER]
Company: ${invoiceData.consigneeCompany}
Contact: ${invoiceData.consigneeName} (${invoiceData.consigneeTel})
Address: ${invoiceData.consigneeAddress}, ${invoiceData.consigneeCountry}
----------------------------------------
[ITEMS & PRICING]
${invoiceData.items
  .map(
    (item, i) =>
      `${i + 1}. ${item.description} | HS: ${item.hsCode} | Qty: ${item.quantity} | Unit: $${item.unitPriceUsd.toFixed(2)} | Total: $${(item.quantity * item.unitPriceUsd).toFixed(2)} [Origin: ${item.origin}]`
  )
  .join('\n')}
----------------------------------------
TOTAL AMOUNT: $${calculateSubtotal().toFixed(2)} USD
----------------------------------------
DECLARATION:
I hereby certify that this invoice is true and correct and that the goods are of Republic of Korea origin.
Authorized Signature: ${invoiceData.shipperName}
========================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
                1단계: 필수 서류 마스터
              </span>
              <span className="text-xs text-slate-500">초보 수출 기업 표준 가이드</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              수출 준비 필수 서류 & 체크리스트
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              수출을 위해 구비해야 하는 6대 핵심 서류의 용도, 발급처, 작성법을 체크하고 진행 상황을 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInvoiceGenerator(!showInvoiceGenerator)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{showInvoiceGenerator ? '서류 목록 보기' : '상업송장(Invoice) 자동 작성기'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700">서류 준비 진행률</span>
            <span className="text-blue-600 font-bold">
              {completedCount} / {EXPORT_DOCUMENTS_GUIDE.length} 완료 ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conditional: Interactive Commercial Invoice Generator & Print View */}
      {showInvoiceGenerator ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Interactive Document Generator
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                상업송장 (Commercial Invoice) 간이 생성기
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                해외 세관 및 특송사에 제출할 영문 상업송장을 입력하고 즉시 인쇄하거나 텍스트로 복사할 수 있습니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyInvoiceText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                {copiedInvoice ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>양식 복사</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>인쇄 / PDF 저장</span>
              </button>
            </div>
          </div>

          {/* Form Inputs for Customizing Invoice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">1. 수출자 정보 (Shipper / Exporter)</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">회사명 (영문)</label>
                  <input
                    type="text"
                    value={invoiceData.shipperCompany}
                    onChange={(e) => setInvoiceData({ ...invoiceData, shipperCompany: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">담당자명 & 연락처</label>
                  <input
                    type="text"
                    value={invoiceData.shipperName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, shipperName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">사업장 주소 (영문)</label>
                  <input
                    type="text"
                    value={invoiceData.shipperAddress}
                    onChange={(e) => setInvoiceData({ ...invoiceData, shipperAddress: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-2">2. 수입자 정보 (Consignee / Importer)</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">수취인/회사명 (영문)</label>
                  <input
                    type="text"
                    value={invoiceData.consigneeCompany}
                    onChange={(e) => setInvoiceData({ ...invoiceData, consigneeCompany: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-0.5">수취인 국가 & 주소 (영문)</label>
                  <input
                    type="text"
                    value={invoiceData.consigneeAddress}
                    onChange={(e) => setInvoiceData({ ...invoiceData, consigneeAddress: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">인코텀즈 거래조건</label>
                    <select
                      value={invoiceData.incoterms}
                      onChange={(e) => setInvoiceData({ ...invoiceData, incoterms: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                    >
                      <option value="DAP (Delivered at Place - 관세 바이어 부담)">DAP (관세 바이어부담)</option>
                      <option value="DDP (Delivered Duty Paid - 관세 판매자 완납)">DDP (관세 판매자완납)</option>
                      <option value="FOB (Free On Board - 선적 인도)">FOB (본선 인도)</option>
                      <option value="CIF (Cost, Insurance & Freight)">CIF (운임보험료 포함)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">인보이스 번호</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNo}
                      onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Printable Invoice Sheet Preview */}
          <div className="border-2 border-slate-800 rounded-xl p-6 font-mono text-xs bg-white text-slate-900 shadow-inner">
            <div className="text-center pb-4 border-b-2 border-slate-800">
              <h2 className="text-2xl font-black tracking-widest uppercase">COMMERCIAL INVOICE</h2>
              <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                (Non-negotiable / For Customs Clearance Purposes)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-300">
              <div>
                <span className="font-bold text-slate-600 block text-[10px]">SHIPPER / EXPORTER</span>
                <p className="font-bold text-sm">{invoiceData.shipperCompany}</p>
                <p>{invoiceData.shipperName} ({invoiceData.shipperTel})</p>
                <p className="text-slate-600">{invoiceData.shipperAddress}</p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2 mb-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="font-bold text-slate-600 block text-[10px]">INVOICE NO:</span>
                    <p className="font-bold">{invoiceData.invoiceNo}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block text-[10px]">DATE:</span>
                    <p>{invoiceData.invoiceDate}</p>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block text-[10px]">CONSIGNEE (TO):</span>
                  <p className="font-bold">{invoiceData.consigneeCompany}</p>
                  <p>{invoiceData.consigneeName} ({invoiceData.consigneeTel})</p>
                  <p className="text-slate-600">{invoiceData.consigneeAddress}</p>
                  <p className="font-semibold text-blue-800">{invoiceData.consigneeCountry}</p>
                </div>
              </div>
            </div>

            {/* Terms Row */}
            <div className="py-2 border-b border-slate-300 flex justify-between text-[11px]">
              <div>
                <span className="text-slate-500">TERMS OF DELIVERY: </span>
                <span className="font-bold text-blue-900">{invoiceData.incoterms}</span>
              </div>
              <div>
                <span className="text-slate-500">COUNTRY OF ORIGIN: </span>
                <span className="font-bold">REPUBLIC OF KOREA</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-[11px]">
                    <th className="py-1.5">NO</th>
                    <th className="py-1.5">ITEM DESCRIPTION</th>
                    <th className="py-1.5">HS CODE</th>
                    <th className="py-1.5 text-right">QTY</th>
                    <th className="py-1.5 text-right">UNIT PRICE</th>
                    <th className="py-1.5 text-right">AMOUNT (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-2 text-slate-500">{idx + 1}</td>
                      <td className="py-2 font-medium">{item.description}</td>
                      <td className="py-2 text-blue-700 font-mono">{item.hsCode}</td>
                      <td className="py-2 text-right">{item.quantity} EA</td>
                      <td className="py-2 text-right">${item.unitPriceUsd.toFixed(2)}</td>
                      <td className="py-2 text-right font-bold">
                        ${(item.quantity * item.unitPriceUsd).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t-2 border-slate-800 text-sm">
                    <td colSpan={5} className="py-3 text-right">
                      TOTAL INVOICE VALUE (USD):
                    </td>
                    <td className="py-3 text-right text-blue-900">
                      ${calculateSubtotal().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Certification Statement */}
            <div className="pt-4 border-t border-slate-300 text-[11px] text-slate-600 space-y-2">
              <p>
                <strong>DECLARATION:</strong> I hereby certify that the information on this invoice is true and correct, and the contents and value of this shipment are as stated above.
              </p>
              <div className="flex justify-between items-end pt-3">
                <span className="text-[10px] text-slate-400">ExportEasy Auto-Generated Commercial Invoice</span>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500">AUTHORIZED SIGNATURE & STAMP</span>
                  <span className="font-serif italic text-slate-800 font-bold border-b border-slate-400 pb-0.5 inline-block min-w-36">
                    {invoiceData.shipperName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* List of 6 Essential Export Documents */}
      <div className="space-y-3">
        {EXPORT_DOCUMENTS_GUIDE.map((doc) => {
          const isChecked = !!checkedItems[doc.id];
          const isExpanded = expandedId === doc.id;

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-xl border transition-all ${
                isChecked
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleCheck(doc.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                    title={isChecked ? '완료 취소' : '준비 완료로 체크'}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {doc.stage} 단계
                      </span>
                      {doc.isMandatory ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                          필수
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          선택 / 혜택
                        </span>
                      )}
                      <h3
                        className={`text-base font-bold cursor-pointer ${
                          isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                        onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                      >
                        {doc.title}
                      </h3>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        ({doc.titleEn})
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-xs space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        발급 기관
                      </span>
                      <strong className="text-slate-800 text-xs">{doc.issuer}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        발급 비용
                      </span>
                      <strong className="text-slate-800 text-xs">{doc.issuingCost}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block mb-1">상세 설명 및 필요성</span>
                    <p className="text-slate-600 leading-relaxed">{doc.description}</p>
                  </div>

                  <div className="bg-blue-50/70 border border-blue-200/70 p-3 rounded-lg">
                    <span className="font-bold text-blue-950 block mb-1">신청 및 발급 방법</span>
                    <p className="text-blue-900 leading-relaxed">{doc.howToGet}</p>
                  </div>

                  {doc.tips && doc.tips.length > 0 && (
                    <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-lg">
                      <span className="font-bold text-amber-950 block mb-1">
                        ⚠️ 초보 사장님 주의 팁
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-amber-900">
                        {doc.tips.map((tip, tIdx) => (
                          <li key={tIdx} className="leading-relaxed">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doc.officialSiteUrl && (
                    <div className="pt-2 flex justify-end">
                      <a
                        href={doc.officialSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition"
                      >
                        <span>{doc.officialSiteName || '관련 공인기관 바로가기'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
