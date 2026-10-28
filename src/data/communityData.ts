import { CommunityPost } from '../types';

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-pinned-1',
    category: '서류/인증정보',
    title: '[공지/초보필독] 관세청 유니패스 전자상거래 간이수출신고로 1분 만에 면장 발급받고 부가세 영세율 챙기세요!',
    content: `안녕하세요, 수출 2년차 셀러입니다. 처음에 우체국이나 특송사로 그냥 목록통관 배송만 하다가 부가세 10% 영세율 환급을 못 받았던 뼈아픈 실수가 있었습니다.

소상공인 사장님들 꼭 기억하세요! 
FOB 금액 400만원 이하 건은 관세청 유니패스(UNI-PASS)에서 **'전자상거래 간이수출신고'**를 이용하시면 됩니다.

기존 일반 수출신고 항목이 57개나 되어 관세사 없이는 어려웠지만, 간이수출신고는 **12개 항목(송하인, 수하인, HS CODE, 금액, 중량 등)**만 넣으면 몇 초 만에 수출신고필증(수출면장)이 나옵니다.

수출면장이 있어야:
1. 분기별 부가세 신고 시 해외 매출로 잡혀 '영세율(매출세액 0원)' 적용받고 매입세액 전액 환급!
2. 중기부, KOTRA 수출바우처 신청 시 공식 '수출실적 증명'으로 가점 획득!

수수료도 0원(무료)이니 반드시 유니패스에서 사업자 통관고유부호 만들고 시작하세요!`,
    coreTip: 'FOB 400만원 이하는 관세청 유니패스 간이수출신고(12개 항목)로 즉시 면장 발급 후 부가세 환급 필수!',
    author: '관세통달박대표',
    companyType: '생활잡화 1인 제조사',
    targetCountryId: 'ALL',
    targetCountryName: '전 세계 공통',
    likes: 142,
    isLiked: false,
    views: 1850,
    isPinned: true,
    badge: '필독 노하우',
    createdAt: '2026-10-25',
    comments: [
      {
        id: 'c-1',
        author: '초보의류셀러',
        companyType: '동대문 자체제작',
        content: '와.. 여태 그냥 EMS 보내서 영세율 못 받고 있었는데 당장 유니패스 신청해야겠네요! 소중한 정보 감사합니다 ㅠㅠ',
        createdAt: '2026-10-26 10:14',
      },
      {
        id: 'c-2',
        author: 'K스낵대표',
        companyType: '식품 유통업',
        content: '맞습니다. 우체국 계약할 때 사업자통관부호 등록해두면 우체국 인터넷 접수 시 자동수출신고 연동도 가능하더라고요.',
        createdAt: '2026-10-26 14:20',
      },
    ],
  },
  {
    id: 'post-2',
    category: '수출성공후기',
    title: '🇺🇸 미국 아마존 첫 입점 후 MoCRA 완료 & K-선크림으로 3개월 만에 월매출 1,500만원 돌파 후기',
    content: `소규모로 자체 제작한 유기자차 선크림으로 미국 아마존에 도전했던 후기 남깁니다.

처음에 미국 FDA 화장품 규제(MoCRA) 때문에 겁을 많이 먹었는데, KOTRA 해외시장뉴스와 미국 대행사를 통해 시설등록(FEI) 및 제품 리스팅(SPL)을 2달에 걸쳐 마쳤습니다. 

준비하면서 깨달은 점 3가지:
1. **성분 라벨링**: 반드시 전성분 영문 INCI명 표기 및 알레르기 유발성분 투명 기재.
2. **배송 전략**: 처음부터 FBA 대량 입고하지 않고, 항공 포워딩 30kg 소량으로 반응 보고 FBA로 보냈습니다.
3. **디미니미스($800)**: 초반 자사몰/소액 주문은 미국 Section 321 덕분에 관세가 전혀 안 나와서 고객들이 부담 없이 구매했습니다.

초보 사장님들도 절대 포기하지 마시고 기본 서류부터 차근차근 준비하시면 충분히 미국 시장 열립니다! 화이팅입니다.`,
    coreTip: '미국은 FDA MoCRA 시설등록 사전 필수 + $800 면세한도(Section 321) 적극 활용',
    author: '글로우케이대표',
    companyType: 'K-뷰티 스타트업',
    targetCountryId: 'US',
    targetCountryName: '미국 (USA)',
    likes: 98,
    isLiked: false,
    views: 1240,
    badge: '성공 후기',
    createdAt: '2026-10-27',
    comments: [
      {
        id: 'c-3',
        author: '비건스킨케어',
        companyType: '화장품 1인 셀러',
        content: 'MoCRA 등록 대행 비용 대략 얼마 정도 드셨는지 여쭤봐도 될까요?',
        createdAt: '2026-10-27 18:02',
      },
      {
        id: 'c-4',
        author: '글로우케이대표',
        companyType: '작성자',
        content: '@비건스킨케어 저는 KOTRA 수출바우처 지원받아서 자부담 30만원 선에서 해결했습니다. 수출바우처 꼭 알아보세요!',
        createdAt: '2026-10-27 18:35',
      },
    ],
  },
  {
    id: 'post-3',
    category: '실패/주의사례',
    title: '🇯🇵 [주의] 일본 큐텐에서 가죽 신발/니트 의류 보냈다가 10,000엔 미만인데도 관세 폭탄 맞은 썰',
    content: `사장님들 중에 일본으로 패션/잡화 판매하시는 분들 꼭 참고하세요!

일본은 소액 수입 면세 한도가 과세가격 10,000엔(약 16,666엔 물품대금)으로 알려져 있어서 당연히 면세될 줄 알았습니다. 5,000엔짜리 가죽 로퍼 2켤레를 EMS로 보냈는데요...

일본 세관에서 면세 불가 통보를 받고 고객한테 2,000엔이 넘는 관세와 소비세가 청구되어 고객이 수취 거부하고 반송되었습니다 ㅠㅠ

알고 보니 **일본 관세법상 가죽 제품(가죽 신발, 가죽 가방), 모피, 일부 편직물(니트 티셔츠 등)**은 **소액 면세 제외 품목(면세 적용 배제 대상)**이었습니다!

이 품목들은 단돈 1,000엔짜리라도 관세가 1원부터 무조건 부과됩니다. 일본 판매 시 가죽 소재는 반드시 DDP(판매자 관세 완납)로 설정하시거나 사전에 관세청 유니패스/일본세관 품목표 확인하세요!`,
    coreTip: '일본은 가죽 신발, 가죽 제품, 일부 니트류가 소액면세(1만엔) 적용 배제 품목임에 주의!',
    author: '동대문슈즈마스터',
    companyType: '수제화 패션셀러',
    targetCountryId: 'JP',
    targetCountryName: '일본 (Japan)',
    likes: 125,
    isLiked: false,
    views: 2100,
    badge: '경험 주의보',
    createdAt: '2026-10-26',
    comments: [
      {
        id: 'c-5',
        author: '도쿄잡화상',
        companyType: '구매대행/역직구',
        content: '맞아요 ㅠㅠ 가죽 신발은 일본 관세가 기본 30% 또는 켤레당 4,300엔 중 높은 금액이라 진짜 치명적입니다. 저도 초창기에 반송비 5만원 날렸던 기억이 나네요.',
        createdAt: '2026-10-26 16:40',
      },
    ],
  },
  {
    id: 'post-4',
    category: '물류/배송후기',
    title: '📦 소상공인 2kg 이하 해외배송은 무조건 우체국 K-Packet 계약하세요 (FedEx/EMS 비교 분석)',
    content: `귀걸이, 포토카드, 의류 단품, 화장품 1~2개 파시는 소규모 셀러분들께 물류비 팁 드립니다.

- **EMS**: 기본 25,000원부터 시작 (너무 비쌈)
- **DHL/FedEx**: 소량 발송 시 기본 3만원 이상 + 유류할증료 24% (단품 보내면 마진 마이너스)
- **우체국 K-Packet**: 월 50통 이상 또는 계약고객 시 미국 6,000~9,000원대, 일본 4,000~6,000원대 가능!

배송 기간은 7~10일 정도로 EMS(3~5일)보다 약간 느리지만, 트래킹 번호(배송조회)가 100% 제공되고 미국 USPS, 일본 우체국과 직결되어 배송 성공률이 매우 높습니다.

처음에는 우체국 가서 "국제우편 K-Packet 기업고객 계약하러 왔습니다"라고 하시면 사업자등록증 확인 후 계약해 줍니다. 2kg 미만은 무조건 K-Packet이 답입니다.`,
    coreTip: '2kg 이하 경량 화물은 우체국 K-Packet 계약 시 배송비 건당 5,000~8,000원대로 극적 절감',
    author: '핸드메이드린',
    companyType: '수공예 악세서리 1인샵',
    targetCountryId: 'ALL',
    targetCountryName: '전 세계 공통',
    likes: 89,
    isLiked: false,
    views: 1430,
    badge: '물류 꿀팁',
    createdAt: '2026-10-27',
    comments: [
      {
        id: 'c-6',
        author: '문구덕후사장',
        companyType: '캐릭터 굿즈',
        content: '저도 스티커랑 키링 해외 배송할 때 K-Packet 쓰고 마진율 25%에서 40%로 올랐습니다. 강추합니다!',
        createdAt: '2026-10-27 21:11',
      },
    ],
  },
  {
    id: 'post-5',
    category: '꿀팁/노하우',
    title: '🇸🇬 쇼피(Shopee) 싱가포르/말레이시아 진입 시 한국 SLS 물류센터 200% 활용하는 법',
    content: `동남아 크로스보더 커머스 쇼피 코리아 입점 6개월 차입니다.

쇼피의 가장 큰 장점은 **SLS(Shopee Logistics Service)**입니다. 
주문이 들어오면 우리가 해외로 직접 쏘는 게 아니라, **김포나 군포에 있는 쇼피 집하지로 국내 택배(2,500원~3,000원)**만 보내면 됩니다!

그 이후 항공 운송 및 현지 통관, 현지 택배 배송은 쇼피가 전부 알아서 처리해 줍니다. 
주의할 점 2가지:
1. **송장 라벨 출력**: AWB 라벨을 바코드 번짐 없이 10x10cm 규격 라벨기로 선명하게 뽑아야 집하지 자동 스캔 탈락이 안 됩니다.
2. **배송 기한(DTS)**: 주문 접수 후 2영업일 이내에 김포 집하지에 도착해야 지연 페널티가 없으니 재고 확보가 생명입니다.`,
    coreTip: '쇼피 SLS 활용 시 국내 택배비로 해외 발송 해결, 송장 바코드 출력 품질 필수 점검',
    author: '아세안정복자',
    companyType: 'K-패션 & 뷰티',
    targetCountryId: 'SG',
    targetCountryName: '싱가포르 & 동남아',
    likes: 76,
    isLiked: false,
    views: 1180,
    createdAt: '2026-10-26',
    comments: [],
  },
  {
    id: 'post-6',
    category: '질문/답변',
    title: '🇪🇺 한-EU FTA 원산지증명서 자율발급 인보이스 문구 관련 확인 부탁드립니다',
    content: `유럽(독일) 바이어에게 자체 제작 패브릭 소품 1,500유로치를 첫 선적하려고 합니다.
바이어가 한-EU FTA 혜택으로 관세를 감면받으려면 Commercial Invoice에 원산지 신고 문구를 넣어달라고 하는데요.

건당 6,000유로 이하 물품은 관세청이나 상공회의소에 갈 필요 없이 인보이스에 아래 문구 적고 대표자 서명 날인하면 자율발급으로 인정된다고 들었는데 맞는지요?

"The exporter of the products covered by this document declares that, except where otherwise clearly indicated, these products are of Republic of Korea preferential origin."

혹시 세관에서 문제없이 통과되셨던 선배 사장님들 검토 부탁드립니다!`,
    coreTip: '한-EU FTA 6,000유로 이하는 인보이스 원산지 신고문안 자율발급으로 관세 특혜 가능',
    author: '패브릭스튜디오',
    companyType: '인테리어 소품 제조',
    targetCountryId: 'EU',
    targetCountryName: '유럽연합 (EU)',
    likes: 45,
    isLiked: false,
    views: 890,
    createdAt: '2026-10-27',
    comments: [
      {
        id: 'c-7',
        author: '관세통달박대표',
        companyType: '생활잡화 1인 제조사',
        content: '네 정확합니다! 6,000유로 이하는 원산지인증수출자 인증 없이도 해당 표준 문안 + 작성일자 + 대표자 자필 영문 서명만 넣으시면 독일 세관에서 FTA 0% 특혜관세 정상 적용됩니다 ^^',
        createdAt: '2026-10-27 15:30',
      },
      {
        id: 'c-8',
        author: '패브릭스튜디오',
        companyType: '작성자',
        content: '박대표님 확답 감사합니다! 안심하고 인보이스 출력해서 선적하겠습니다!!',
        createdAt: '2026-10-27 16:05',
      },
    ],
  },
];
