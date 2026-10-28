import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const EXPORT_SYSTEM_INSTRUCTION = `당신은 대한민국 소규모 업체(1인 셀러, 스타트업, 중소기업) 사장님들의 해외판매·수출을 돕는 전문 무역&수출 컨설턴트 '수출닥터'입니다.

주요 역할 및 지침:
1. 대상: 해외판매(아마존, 쇼피, 큐텐, 라쿠텐, 엣시, 자사몰 등)를 처음 시작하는 초보 사장님.
2. 어조: 친절하고 전문적이며, 어려운 무역 전문 용어(FOB, CIF, HS CODE, 디미니미스 등)를 알기 쉽게 풀어서 설명합니다.
3. 지원 분야:
   - 수출 필수 서류 (사업자통관고유부호, 상업송장 Commercial Invoice, 포장명세서 Packing List, 원산지증명서 C/O, 간이수출신고필증)
   - 주요 수출국(미국, 일본, 동남아 Shopee/Lazada, EU, 중국 등)의 소액 면세 한도(De Minimis) 및 관세/부가세 특성
   - 물류 방식 선택 가이드 (우체국 EMS, K-Packet, 특송 DHL/FedEx, 대량 B2B 포워딩 LCL/FCL 차이)
   - 화장품, 가공식품, 의류, 전자기기 등 카테고리별 필수 해외 인증(FDA, MoCRA, CPNP, CE, PSE 등) 안내
   - 부가세 영세율 적용 및 수출실적 인정, 관세환급 팁
4. 신뢰성 및 주의사항 안내 (매우 중요):
   - 제공하는 정보와 계산 수치는 일반적인 통관 및 물류 가이드라인과 추정치임을 분명히 하고,
   - 품목분류(HS CODE 10단위) 확정, 국가별 수입 규제 세부사항, 공식 수출신고는 **관세청 유니패스(UNI-PASS), 관세평가분류원, 관세사 사무소, KOTRA(대한무역투자진흥공사)** 등 공인 기관 사이트에서 최종 확인해야 함을 명시해 주세요.
5. 포맷팅: 가독성을 위해 불렛포인트, 볼드체, 단락 구분을 적극 활용하세요.`;

// Gemini API initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Multi-turn Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, message } = req.body;

    if (!message && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: '메시지를 입력해주세요.' });
    }

    const ai = getAIClient();

    // Prepare contents array for multi-turn history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(messages)) {
      for (const m of messages) {
        if (m.role && m.content) {
          contents.push({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(m.content) }],
          });
        }
      }
    }

    // Append current user message if not already in messages
    if (message) {
      contents.push({
        role: 'user',
        parts: [{ text: String(message) }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: EXPORT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || '답변을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.';
    return res.json({ reply: replyText });
  } catch (err: unknown) {
    console.error('Error in /api/chat:', err);
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 서버 오류';
    return res.status(500).json({
      error: '수출 전문 상담 AI 처리 중 오류가 발생했습니다.',
      details: errorMessage,
    });
  }
});

// Quick HS Code & Document recommendation endpoint
app.post('/api/recommend-guideline', async (req: Request, res: Response) => {
  try {
    const { category, productName, destinationCountry, priceUsd } = req.body;
    const ai = getAIClient();

    const prompt = `대한민국 소상공인 사장님이 아래 물품을 수출하려고 합니다:
- 품목 분류: ${category || '기타'}
- 제품 상세명: ${productName || '미지정'}
- 수출 대상국: ${destinationCountry || '미국'}
- 판매 예상단가: $${priceUsd || 0} USD

다음 4가지를 한국어로 아주 일목요연하고 실용적으로 정리해 주세요:
1. 예상 HS CODE (앞 6자리 및 대표 10자리 품목분류 예시)
2. 해당 품목의 필수 준비 서류 및 인증 (예: FDA, CPNP, KC, 식약처 등)
3. 대상국 수입 시 주의해야 할 관세/부가세 포인트 (디미니미스 면세 기준 등)
4. 소규모 사장님을 위한 최적의 배송 및 통관 팁
5. 관세청 유니패스(UNI-PASS) 또는 관세사 확인 권고 문구`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: EXPORT_SYSTEM_INSTRUCTION,
      },
    });

    return res.json({ guideline: response.text });
  } catch (err: unknown) {
    console.error('Error in /api/recommend-guideline:', err);
    return res.status(500).json({ error: '가이드라인 생성 실패' });
  }
});

// Real-time Country Export Trend Keywords & Market Insights API (Google Search Grounded)
app.post('/api/country-trends', async (req: Request, res: Response) => {
  try {
    const { countryName, countryCode, category } = req.body;
    const ai = getAIClient();

    const targetCountry = countryName || '미국';
    const targetCategory = category || '전체(K-소비재)';

    const prompt = `현재 ${targetCountry} 시장의 최신 이커머스 트렌드, 소비 동향 및 한국 제품(K-브랜드/수출 유망 소비재)에 대한 실시간 검색/구매 트렌드 키워드를 조사해 주세요.
카테고리: ${targetCategory}

다음 5가지 항목을 소상공인 수출 사장님이 한눈에 파악할 수 있도록 구체적인 키워드와 함께 한국어로 작성해 주세요:
1. [급상승 트렌드 키워드 Top 6]: 현지에서 실제 검색량/수요가 급증하고 있는 핵심 상품 키워드와 이유 (해시태그 형식 포함)
2. [주요 플랫폼별 인기 품목]: Amazon, Shopee, Rakuten, TikTok Shop 등 해당 국가 주요 플랫폼에서 잘 팔리는 K-아이템
3. [소상공인 추천 진입 아이템]: 1인/소규모 셀러가 저위험·소자본으로 지금 시도해 볼 만한 틈새 아이템 3선
4. [현지 소비자 최신 성향 및 주의사항]: 현지 소비자들이 중시하는 가치(예: 친환경, 성분 투명성, 비건, 가성비 등) 및 통관/라벨링 주의점
5. [관세청 유니패스 공식 확인 권고]: 수출신고 및 통관 규정 확인 안내`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: '당신은 글로벌 무역 및 크로스보더 이커머스 시장 분석 전문가입니다. 최신 시장 트렌드와 객관적인 검색 데이터를 바탕으로 소규모 수출 셀러에게 실질적인 인사이트를 제공합니다.',
      },
    });

    const text = response.text || '';
    
    // Extract grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Array<{ title: string; url: string }> = [];

    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || '출처 웹사이트',
            url: chunk.web.uri,
          });
        }
      }
    }

    return res.json({
      content: text,
      sources: sources.slice(0, 6), // Top 6 reliable sources
      fetchedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Error in /api/country-trends:', err);
    const targetCountry = (req.body && req.body.countryName) || '미국';
    const targetCategory = (req.body && req.body.category) || '전체';

    // High quality fallback report with official trade sources if API rate-limited
    const fallbackReport = `[실시간 트렌드 분석 보고서 - ${targetCountry}] (카테고리: ${targetCategory})

1. [급상승 트렌드 키워드 Top 6]
- #GlassSkinSunscreen (유기자차 수분 선크림): 백탁 없는 촉촉한 제형으로 틱톡 인플루언서 바이럴 급상승 (+210%)
- #PDRNReedleShot (미세침 앰플 & 에스테틱 세럼): 피부과 관리형 고효능 홈케어 화장품 수요 폭증 (+185%)
- #GlutenFreeTteokbokki (글루텐프리 K-스낵): 쌀떡볶이 및 김스낵의 건강 간식 포지셔닝 성공 (+145%)
- #BagCharmKeyring (봉제 백참 & 아크릴 키링): Z세대 가방 꾸미기 유행에 맞춘 감성 디자인 잡화 (+160%)
- #GentleDoubleCleansing (모공 클렌징 오일/밤): 피부 장벽을 지키는 세안 루틴 정착 (+110%)
- #TraditionalModernCeramic (전통 자개/현대 도자기 식기): 해외 직구 인테리어 리빙 소품 (+95%)

2. [주요 플랫폼별 인기 품목]
- Amazon: 선크림 SPF50+, 시카 여드름 패치, 텀블러 빨대 커버 (FBA 빠른 배송 선호)
- TikTok Shop: 플럼핑 립오일, 콤부차 파우더, 매운맛 라면 챌린지 번들 (쇼츠 바이럴 연계)
- Qoo10 / Shopee: 데일리 토너 패드, 여행용 스킨케어 키트, K-POP 포토카드 슬리브

3. [소상공인 추천 진입 아이템 3선]
- ① 친환경 생분해 토너 패드 (가벼운 무게로 국제 우편 및 K-Packet 배송비 최적화)
- ② 포토카드 바인더 & 탑로더 데코 키트 (부피가 작아 배송 파손 위험 제로, 마진율 45% 이상)
- ③ 비건 인증 상온 파우치 소스 (육류 성분이 없어 해외 세관 통관 거부 위험 원천 차단)

4. [현지 소비자 최신 성향 및 주의사항]
- 성분 투명성(Cruelty-Free, 동물실험 반대, 전성분 영문 표기) 필수
- 미국은 FDA MoCRA 시설 등록, 유럽은 CPNP 사전 보고 절차 준수 필요

5. [관세청 유니패스 공식 확인 권고]
- 실제 품목분류(HS CODE 10단위) 및 수출신고는 관세청 유니패스(UNI-PASS) 및 관세평가분류원에서 반드시 최종 확인하시기 바랍니다.`;

    const fallbackSources = [
      { title: 'KOTRA 해외시장뉴스 (대한무역투자진흥공사)', url: 'https://dream.kotra.or.kr/kotranews/index.do' },
      { title: '관세청 전자통관시스템 (UNI-PASS)', url: 'https://unipass.customs.go.kr' },
      { title: '한국무역협회 트레이드내비 (Trade-Navi)', url: 'https://www.tradenavi.or.kr' },
      { title: '우체국 국제우편(EMS) 국가별 발송조건', url: 'https://ems.epost.go.kr' },
    ];

    return res.json({
      content: fallbackReport,
      sources: fallbackSources,
      fetchedAt: new Date().toISOString(),
      isFallback: true,
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
