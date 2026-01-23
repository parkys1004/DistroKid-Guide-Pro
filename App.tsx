import React, { useState, useEffect } from 'react';

// Checklist Data Structure
const checklistSteps = [
  {
    badge: "D-42",
    title: "콘텐츠 준비",
    items: [
      { id: "d42-wav", text: "최종 WAV 마스터 (24-bit)" },
      { id: "d42-art", text: "앨범 아트 (3000px)" },
      { id: "d42-canvas", text: "Spotify Canvas 제작" },
      { id: "d42-motion", text: "Apple Motion Art 제작" },
    ]
  },
  {
    badge: "D-28",
    title: "업로드 및 설정",
    items: [
      { id: "d28-upload", text: "금요일 발매일 지정 업로드" },
      { id: "d28-meta", text: "메타데이터/크레딧 정밀 입력 [20]" },
      { id: "d28-split", text: "Splits 수익 배분 초대 [11]" },
      { id: "d28-contentid", text: "YouTube Content ID 신청 [21]" },
    ]
  },
  {
    badge: "D-14",
    title: "사전 마케팅",
    items: [
      { id: "d14-hyper", text: "HyperFollow 페이지 공개" },
      { id: "d14-presave", text: "Pre-save 캠페인 집중 홍보" },
      { id: "d14-pitch", text: "Spotify 에디토리얼 피칭 [20, 22, 23]" },
      { id: "d14-ads", text: "소셜 광고 집행 시작" },
    ]
  },
  {
    badge: "Day 1+",
    title: "정산 및 분석",
    items: [
      { id: "day1-tax", text: "W-8BEN 세금 양식 완료" },
      { id: "day1-stats", text: "실시간 통계 유입 분석 [6]" },
      { id: "day1-retarget", text: "주요 국가 마케팅 리타겟팅" },
      { id: "day1-payout", text: "수익 인출 수단 연동 [24]" },
    ]
  }
];

const App = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string>('');
  
  // Checklist Persistence State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('distrokid_checklist_v1');
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        console.error("Failed to load checklist", e);
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    // Fetch current exchange rate
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        setExchangeRate(data.rates.KRW);
        setRateDate(new Date(data.date).toLocaleDateString('ko-KR'));
      })
      .catch(err => {
        console.error("Failed to fetch rates", err);
        setExchangeRate(1450); // Fallback rate
      });
  }, []);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      localStorage.setItem('distrokid_checklist_v1', JSON.stringify(newState));
      return newState;
    });
  };

  // Block display for Plans (Main pricing)
  const renderPlanKRW = (usdPrice: number) => {
    if (!exchangeRate) return <span className="text-xs text-slate-500 animate-pulse">환율 계산 중...</span>;
    const krw = Math.round((usdPrice * exchangeRate) / 10) * 10;
    return (
      <div className="flex items-center gap-2 mt-1">
        <span className="text-lg font-bold text-sky-400">
          약 ₩{krw.toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 font-normal">
          (오늘 시세)
        </span>
      </div>
    );
  };

  // Inline display for small texts/tables
  const formatKRW = (usd: number) => {
    if (!exchangeRate) return "...";
    const krw = usd * exchangeRate;
    // For small amounts (rates), show decimal. For large amounts, round to 10 won.
    if (krw < 100) {
      return `약 ₩${krw.toFixed(1)}`;
    }
    return `약 ₩${(Math.round(krw / 10) * 10).toLocaleString()}`;
  };

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                    <i className="fas fa-compact-disc text-sky-400 text-2xl"></i>
                    <span className="font-bold text-xl tracking-tight">DistroKid <span className="text-sky-400">2026</span></span>
                </div>
                <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
                    <a href="#market" className="hover:text-sky-400 transition">시장 환경</a>
                    <a href="#pricing" className="hover:text-sky-400 transition">요금제</a>
                    <a href="#tech" className="hover:text-sky-400 transition">기술 규격</a>
                    <a href="#marketing" className="hover:text-sky-400 transition">마케팅</a>
                    <a href="#payout" className="hover:text-sky-400 transition">정산</a>
                    <a href="#checklist" className="hover:text-sky-400 transition">체크리스트</a>
                </div>
            </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500 rounded-full filter blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                2026 글로벌 음악 시장<br/><span className="gradient-text">완벽 가이드</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                '아티스트 중심' 로열티 구조와 AI 기술 규제 시대, <br/>독립 아티스트의 수익 극대화를 위한 DistroKid 활용 전략의 모든 것.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <a href="#checklist" className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-full transition shadow-lg shadow-sky-500/20">
                    실행 가이드 시작하기
                </a>
                <a href="#pricing" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full transition border border-slate-700">
                    요금제 비교
                </a>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-20">

        {/* Market Section */}
        <section id="market" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-3xl font-bold">2026년 산업 패러다임</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="card p-8">
                    <h3 className="text-xl font-bold mb-4 text-sky-400"><i className="fas fa-users-viewfinder mr-2"></i>아티스트 중심 모델 (Artist-Centric)</h3>
                    <ul className="space-y-3 text-slate-300">
                        <li>• <strong>정산 임계치:</strong> 연간 최소 1,000회 스트리밍 및 고유 리스너 확보 필요 </li>
                        <li>• <strong>품질 필터링:</strong> 화이트 노이즈 등 기능성 오디오 정산 제외 </li>
                        <li>• <strong>가중치:</strong> 진성 팬의 스트리밍에 더 높은 로열티 배분 </li>
                    </ul>
                </div>
                <div className="card p-8">
                    <h3 className="text-xl font-bold mb-4 text-indigo-400"><i className="fas fa-robot mr-2"></i>AI 음원 규제 및 Disclosure</h3>
                    <ul className="space-y-3 text-slate-300">
                        <li>• <strong>AI 태깅 의무화:</strong> DDEX 표준에 따른 AI 참여 정보 명시 필요 [1, 2]</li>
                        <li>• <strong>사칭 금지:</strong> 특정 아티스트 목소리 무단 복제 시 배포 반려 </li>
                        <li>• <strong>권리 증명:</strong> 유료 플랜을 통한 상업적 권리 확보 필수 [3, 4]</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <div>
                  <h2 className="text-3xl font-bold">전략적 요금제 분석</h2>
                  {exchangeRate && (
                    <p className="text-xs text-slate-400 mt-2">
                      <i className="fas fa-coins mr-1"></i>
                      적용 환율: 1 USD = {exchangeRate.toLocaleString()} KRW ({rateDate} 기준)
                    </p>
                  )}
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {/* Musician */}
                <div className="card p-6 flex flex-col border-slate-700">
                    <h3 className="text-lg font-bold mb-2">Musician</h3>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">$24.99 <span className="text-sm font-normal text-slate-400">/연간</span></p>
                      {renderPlanKRW(24.99)}
                    </div>
                    <p className="text-sm text-slate-400 mb-6 font-medium">취미 아티스트용 기본 플랜 </p>
                    <ul className="text-sm space-y-3 mb-8 flex-grow">
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 무제한 음원 업로드</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 아티스트 1인</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 로열티 100% 정산</li>
                        <li className="flex items-center text-slate-500"><i className="fas fa-times mr-2"></i> 발매일 지정 불가</li>
                        <li className="flex items-center text-slate-500"><i className="fas fa-times mr-2"></i> 일일 통계 미제공</li>
                    </ul>
                </div>
                {/* Musician Plus */}
                <div className="card p-6 flex flex-col border-sky-500/50 bg-sky-500/5 shadow-xl shadow-sky-500/10 relative">
                    <div className="bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded absolute -top-3 right-6">MOST POPULAR</div>
                    <h3 className="text-lg font-bold mb-2">Musician Plus</h3>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">$44.99 <span className="text-sm font-normal text-slate-400">/연간</span></p>
                      {renderPlanKRW(44.99)}
                    </div>
                    <p className="text-sm text-slate-400 mb-6 font-medium">전략적 마케팅 필수 </p>
                    <ul className="text-sm space-y-3 mb-8 flex-grow">
                        <li className="flex items-center font-semibold text-sky-400"><i className="fas fa-check mr-2"></i> 발매일/예약일 지정</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 아티스트 2인</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 상세 일일 통계</li>
                        <li className="flex items-center text-sky-400"><i className="fas fa-check mr-2"></i> 커스텀 레이블명</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> iTunes 가격 설정</li>
                    </ul>
                </div>
                {/* Ultimate */}
                <div className="card p-6 flex flex-col border-slate-700">
                    <h3 className="text-lg font-bold mb-2">Ultimate</h3>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">$89.99 <span className="text-sm font-normal text-slate-400">/연간</span></p>
                      {renderPlanKRW(89.99)}
                    </div>
                    <p className="text-sm text-slate-400 mb-6 font-medium">레이블 및 대규모 관리 </p>
                    <ul className="text-sm space-y-3 mb-8 flex-grow">
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 아티스트 5~100인</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 1TB Instant Share</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> 플레이리스트 연락처 정보</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> RIAA 골드/플래티넘 모니터링</li>
                        <li className="flex items-center text-indigo-400"><i className="fas fa-check mr-2"></i> Artist Protection</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Tech Section */}
        <section id="tech" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-3xl font-bold">기술적 규격 및 시각화</h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="card p-8">
                    <h3 className="font-bold text-lg mb-4 underline decoration-sky-500">Audio (WAV)</h3>
                    <p className="text-sm text-slate-400 mb-4">최소 16-bit/44.1kHz 필수 [5, 6, 7]</p>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                            <span>권장 포맷</span><span className="text-sky-400">24-bit / 96kHz</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2 flex-wrap">
                            <span>Dolby Atmos</span>
                            <span className="text-indigo-400 flex flex-col items-end">
                                <span>$26.99</span>
                                <span className="text-xs text-slate-500 font-normal">{formatKRW(26.99)} (선택)</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="card p-8">
                    <h3 className="font-bold text-lg mb-4 underline decoration-green-500">Spotify Canvas</h3>
                    <p className="text-sm text-slate-400 mb-4">공유 횟수 145% 증가 효과 </p>
                    <div className="space-y-2 text-sm">
                        <p>• 비율: 9:16 (세로형)</p>
                        <p>• 길이: 3~8초 </p>
                        <p>• 형식: MP4 / JPG </p>
                        <p>• 사운드: 오디오 트랙 없음 </p>
                    </div>
                </div>
                <div className="card p-8">
                    <h3 className="font-bold text-lg mb-4 underline decoration-indigo-500">Apple Motion Art</h3>
                    <p className="text-sm text-slate-400 mb-4">첫 프레임과 정적 아트 일치 필수 [8, 5, 1]</p>
                    <div className="space-y-2 text-sm">
                        <p>• 3:4 (iPhone/Android) [8, 5, 1]</p>
                        <p>• 1:1 (iPad/Mac/TV) [8, 5, 1]</p>
                        <p>• 길이: 15~35초 [8, 5, 1]</p>
                        <p>• 코덱: H.264 / ProRes 422 [8, 5, 1]</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Payout Section */}
        <section id="payout" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-3xl font-bold">수익 시뮬레이션 (초기 6개월)</h2>
            </div>
            <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                        <tr>
                            <th className="p-4">플랫폼</th>
                            <th className="p-4">기준 수치</th>
                            <th className="p-4">예상 수익 (USD)</th>
                            <th className="p-4">핵심 포인트</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <tr>
                            <td className="p-4 font-bold">Spotify</td>
                            <td className="p-4">100,000 Streams</td>
                            <td className="p-4 text-sky-400">
                                <div>$400.00</div>
                                <div className="text-xs text-slate-500 font-normal">{formatKRW(400)}</div>
                            </td>
                            <td className="p-4">
                                평균 $0.004 <span className="text-slate-500">({formatKRW(0.004)})</span> 적용 
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold">Apple Music</td>
                            <td className="p-4">20,000 Streams</td>
                            <td className="p-4 text-indigo-400">
                                <div>$160.00</div>
                                <div className="text-xs text-slate-500 font-normal">{formatKRW(160)}</div>
                            </td>
                            <td className="p-4">
                                평균 $0.008 <span className="text-slate-500">({formatKRW(0.008)})</span> 적용 (고단가) 
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold">TikTok</td>
                            <td className="p-4">1,000 Creations</td>
                            <td className="p-4 text-pink-400">
                                <div>$30.00</div>
                                <div className="text-xs text-slate-500 font-normal">{formatKRW(30)}</div>
                            </td>
                            <td className="p-4">
                                영상 생성당 $0.03 <span className="text-slate-500">({formatKRW(0.03)})</span> 정산 
                            </td>
                        </tr>
                        <tr>
                            <td className="p-4 font-bold">YouTube Content ID</td>
                            <td className="p-4">50,000 Views (UGC)</td>
                            <td className="p-4 text-red-500">
                                <div>$50.00</div>
                                <div className="text-xs text-slate-500 font-normal">{formatKRW(50)}</div>
                            </td>
                            <td className="p-4">UGC 광고 수익 80% 정산 </td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-slate-800/50">
                        <tr>
                            <td colSpan={2} className="p-4 text-right font-bold">합계 (추정값)</td>
                            <td className="p-4 text-xl font-bold text-white">
                                <div>$640.00</div>
                                <div className="text-sm text-slate-400 font-normal">{formatKRW(640)}</div>
                            </td>
                            <td className="p-4"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-500">
                * 위 수치는 2026년 평균 시장 단가 기준이며, 청취 국가 및 유료/무료 계정 비율에 따라 크게 달라질 수 있습니다. 
            </div>
        </section>

        {/* Marketing Section */}
        <section id="marketing" className="scroll-mt-20">
            <div className="flex md:flex-row flex-col gap-12">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold">알고리즘 마케팅 전략</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h4 className="font-bold text-sky-400 mb-2">Pre-save 캠페인 효과</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                발매 전 Pre-save는 Spotify Release Radar의 가장 강력한 트리거입니다. 정량 분석 결과, 사전 저장이 많은 곡은 발매 첫 주 노출이 3.5배 증가합니다. [9, 10, 11, 12]
                            </p>
                        </div>
                        <div className="card p-6 border-l-4 border-l-indigo-500">
                            <h4 className="font-bold text-indigo-400 mb-2">Algorithm Priority 모델</h4>
                            <p className="text-sm bg-slate-950 p-4 rounded font-mono text-center">
                                $Algorithm\ Priority = \alpha \times (Initial\ Saves) + \beta \times (Completion\ Rate) - \gamma \times (Skip\ Rate)$
                            </p>
                            <p className="mt-4 text-xs text-slate-400">
                                2026년에는 저장과 청취 완료율의 가중치(α, β)가 스킵률(γ) 페널티보다 높게 설정됩니다. [13, 10, 14]
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 p-8 rounded-2xl border border-slate-800">
                    <h3 className="text-xl font-bold mb-6"><i className="fas fa-bullseye mr-2 text-red-400"></i>HyperFollow 활용법</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">1</div>
                            <p className="text-sm">팬의 이메일 수집을 통한 직접 마케팅 채널 확보 [15, 16, 17]</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">2</div>
                            <p className="text-sm">소셜 미디어 유입 플랫폼(FB, IG, TikTok) 데이터 분석 [12, 15, 18]</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 bg-sky-500 rounded-full flex items-center justify-center font-bold">3</div>
                            <p className="text-sm">전환 최적화를 위한 픽셀 연동 및 광고 타겟팅 데이터로 활용 [13, 12, 19]</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Checklist Section */}
        <section id="checklist" className="scroll-mt-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2 bg-sky-500 rounded-full"></div>
                <h2 className="text-3xl font-bold">발매 타임라인 체크리스트</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {checklistSteps.map((step) => (
                <div key={step.badge} className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative">
                    <span className="absolute -top-4 -left-4 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-bold text-sky-400 border border-slate-700">
                      {step.badge}
                    </span>
                    <h4 className="font-bold mb-4 pt-2">{step.title}</h4>
                    <div className="space-y-3 text-xs text-slate-300">
                      {step.items.map((item) => (
                        <label 
                          key={item.id} 
                          className={`flex items-center gap-2 cursor-pointer select-none transition-opacity ${checkedItems[item.id] ? 'opacity-50' : 'opacity-100'}`}
                        >
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-700 accent-sky-500"
                            checked={!!checkedItems[item.id]}
                            onChange={() => toggleCheck(item.id)}
                          /> 
                          <span className={checkedItems[item.id] ? 'line-through text-slate-500' : ''}>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                </div>
              ))}
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-400 text-sm">
                <p>&copy; 2026 DistroKid Strategy Report. <br/>본 가이드는 실제 2026년 1월 음악 시장 환경 리서치를 바탕으로 제작되었습니다.</p>
            </div>
            <div>
              <a 
                href="https://kmong.com/self-marketing/730531/ZQh4nXZpK5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-2 px-6 rounded-full transition flex items-center gap-2"
              >
                <span>SUNO 패키지 구매</span>
                <i className="fas fa-external-link-alt text-sm"></i>
              </a>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;