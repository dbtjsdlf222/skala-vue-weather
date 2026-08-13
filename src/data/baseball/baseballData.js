// 과제 화면에서 사용하는 실습용 야구 경기 데이터다.
export const baseballGames = [
  {
    id: 'game_01', time: '18:30', stadium: '잠실야구장', city: '서울',
    latitude: 37.5122, longitude: 127.0719, isDome: false,
    away: { name: 'KT 위즈', shortName: 'KT', wins: 48, losses: 44, rank: 5, streak: '2연승' },
    home: { name: 'LG 트윈스', shortName: 'LG', wins: 55, losses: 38, rank: 2, streak: '1패' },
    expectedScore: { away: 3, home: 5 },
    weather: { status: '약한 비', temp: 24, humidity: 88, wind: 6.3, rain: 2.1 },
    point: 'LG의 홈 승률과 KT의 최근 연승 흐름이 맞붙습니다.',
  },
  {
    id: 'game_02', time: '18:30', stadium: '광주 챔피언스필드', city: '광주',
    latitude: 35.1681, longitude: 126.8889, isDome: false,
    away: { name: 'SSG 랜더스', shortName: 'SSG', wins: 46, losses: 47, rank: 6, streak: '1승' },
    home: { name: 'KIA 타이거즈', shortName: 'KIA', wins: 58, losses: 35, rank: 1, streak: '3연승' },
    expectedScore: { away: 2, home: 6 },
    weather: { status: '강한 비', temp: 25, humidity: 93, wind: 8.2, rain: 8.4 },
    point: '강수량이 많아 경기 시작 전 구단 공지를 꼭 확인해야 합니다.',
  },
  {
    id: 'game_03', time: '18:30', stadium: '대구 삼성라이온즈파크', city: '대구',
    latitude: 35.8412, longitude: 128.6817, isDome: false,
    away: { name: '두산 베어스', shortName: '두산', wins: 51, losses: 42, rank: 4, streak: '2패' },
    home: { name: '삼성 라이온즈', shortName: '삼성', wins: 53, losses: 40, rank: 3, streak: '2연승' },
    expectedScore: { away: 4, home: 5 },
    weather: { status: '구름', temp: 29, humidity: 68, wind: 3.2, rain: 0 },
    point: '한 점 차 승부가 예상되는 오늘의 접전 후보 경기입니다.',
  },
  {
    id: 'game_04', time: '18:30', stadium: '창원 NC파크', city: '창원',
    latitude: 35.2225, longitude: 128.5823, isDome: false,
    away: { name: '롯데 자이언츠', shortName: '롯데', wins: 43, losses: 50, rank: 8, streak: '1패' },
    home: { name: 'NC 다이노스', shortName: 'NC', wins: 45, losses: 48, rank: 7, streak: '1승' },
    expectedScore: { away: 4, home: 4 },
    weather: { status: '이슬비', temp: 27, humidity: 82, wind: 5.1, rain: 0.8 },
    point: '동점 예상 경기로 불펜 운영이 승부를 가를 가능성이 큽니다.',
  },
  {
    id: 'game_05', time: '18:30', stadium: '고척스카이돔', city: '서울',
    latitude: 37.4982, longitude: 126.8671, isDome: true,
    away: { name: '한화 이글스', shortName: '한화', wins: 40, losses: 53, rank: 9, streak: '2연승' },
    home: { name: '키움 히어로즈', shortName: '키움', wins: 36, losses: 57, rank: 10, streak: '3패' },
    expectedScore: { away: 5, home: 3 },
    weather: { status: '흐림', temp: 24, humidity: 79, wind: 4.4, rain: 1.2 },
    point: '돔구장 경기라 비 걱정 없이 편하게 관람할 수 있습니다.',
  },
]

export const riskOptions = [
  { label: '전체 경기', value: 'all' },
  { label: '정상 예상', value: 'safe' },
  { label: '진행 주의', value: 'warning' },
  { label: '취소 위험', value: 'danger' },
]
