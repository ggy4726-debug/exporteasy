export interface DestinationCountry {
  id: string;
  name: string;
  nameKo: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToKrw: number; // 1 단위 당 원화
  deMinimisUsd: number; // 관세 면세 한도 (USD 기준 환산치)
  deMinimisLocal: string; // 현지 기준 면세 한도 설명
  defaultVatRate: number; // 현지 부가세/소비세율 (%)
  vatNotes: string;
  customsAuthority: string;
  customsUrl: string;
  popularPlatforms: string[];
}

export interface ProductCategory {
  id: string;
  nameKo: string;
  nameEn: string;
  icon: string;
  hsCodeExample: string;
  description: string;
  avgDutyRate: number; // 평균 기본 관세율 (%)
  ftaBenefitRate: number; // FTA 협정세율 적용시 (%)
  specialRegulations: string[]; // 인증/요건 예: FDA, CPNP 등
}

export interface ShippingMethod {
  id: string;
  name: string;
  nameKo: string;
  provider: string;
  type: 'air_express' | 'postal' | 'forwarding_air' | 'forwarding_sea';
  typicalDays: string;
  baseWeightKg: number;
  basePriceKrw: number;
  perAdditionalKgKrw: number;
  fuelSurchargePercent: number;
  volumetricDivisor: number; // 5000 또는 6000
  recommendedFor: string;
  maxWeightKg?: number;
}

export interface ExportDocumentItem {
  id: string;
  stage: '준비' | '계약' | '통관' | '선적' | '환급';
  title: string;
  titleEn: string;
  issuer: string;
  isMandatory: boolean;
  summary: string;
  description: string;
  issuingCost: string;
  howToGet: string;
  officialSiteUrl?: string;
  officialSiteName?: string;
  tips: string[];
}

export interface CommercialInvoiceData {
  shipperName: string;
  shipperCompany: string;
  shipperAddress: string;
  shipperTel: string;
  consigneeName: string;
  consigneeCompany: string;
  consigneeAddress: string;
  consigneeCountry: string;
  consigneeTel: string;
  invoiceNo: string;
  invoiceDate: string;
  incoterms: string;
  items: Array<{
    description: string;
    hsCode: string;
    quantity: number;
    unitPriceUsd: number;
    origin: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface TrendKeywordItem {
  keyword: string;
  keywordEn?: string;
  category: string;
  growthTag: '🔥 급상승' | '⭐ 스테디' | '💎 틈새유망' | '📈 바이럴';
  surgeScore: string; // e.g. "+145%" or "+82%"
  reason: string;
  recommendedHsCode?: string;
}

export interface PlatformTrendItem {
  platform: string;
  topItems: string[];
  sellerTip: string;
}

export interface CountryTrendData {
  countryId: string;
  countryNameKo: string;
  marketSummary: string;
  trendKeywords: TrendKeywordItem[];
  platformTrends: PlatformTrendItem[];
  nicheOpportunities: Array<{
    title: string;
    category: string;
    benefit: string;
    smallSellerFit: string;
  }>;
  consumerPreferences: string[];
  groundingSources?: Array<{
    title: string;
    url: string;
  }>;
  liveAnalysisContent?: string;
  lastUpdated: string;
}

export type CommunityCategory =
  | '꿀팁/노하우'
  | '수출성공후기'
  | '실패/주의사례'
  | '물류/배송후기'
  | '질문/답변'
  | '서류/인증정보';

export interface CommunityComment {
  id: string;
  author: string;
  companyType?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  coreTip?: string; // 1줄 핵심 요약 팁
  author: string;
  companyType: string; // e.g. "K-뷰티 1인 셀러", "동대문 자체제작", "스낵제조 스타트업"
  targetCountryId: string; // e.g. "US", "JP", "SG", "ALL"
  targetCountryName: string;
  likes: number;
  isLiked?: boolean;
  views: number;
  comments: CommunityComment[];
  createdAt: string;
  isPinned?: boolean;
  badge?: string; // e.g. "베스트 팁", "초보필독"
}
