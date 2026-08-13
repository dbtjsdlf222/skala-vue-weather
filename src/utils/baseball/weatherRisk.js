// 날씨 값으로 경기 취소 가능성을 단순 계산한다.
export const calculateCancelRisk = (weather, isDome) => {
  // 돔구장은 날씨로 취소될 가능성을 매우 낮게 본다.
  if (isDome) return 2

  let risk = 5

  if (weather.rain >= 10) risk += 55
  else if (weather.rain >= 5) risk += 45
  else if (weather.rain >= 1) risk += 30
  else if (weather.status.includes('비')) risk += 20

  if (weather.humidity >= 90) risk += 12
  else if (weather.humidity >= 80) risk += 7

  if (weather.wind >= 12) risk += 18
  else if (weather.wind >= 8) risk += 10
  else if (weather.wind >= 5) risk += 5

  return Math.min(risk, 95)
}

// 확률에 따라 화면에서 사용할 상태를 정한다.
export const getRiskInfo = (risk, isDome = false) => {
  if (isDome) return { label: '돔구장 진행', level: 'dome' }
  if (risk >= 60) return { label: '취소 위험', level: 'danger' }
  if (risk >= 30) return { label: '진행 주의', level: 'warning' }
  return { label: '정상 예상', level: 'safe' }
}

// 사용자가 확률의 근거를 쉽게 확인할 수 있도록 설명을 만든다.
export const getRiskReasons = (weather, isDome) => {
  if (isDome) return ['돔구장이라 강수 영향을 거의 받지 않습니다.']

  return [
    `시간당 강수량 ${weather.rain}mm`,
    `습도 ${weather.humidity}%`,
    `풍속 ${weather.wind}m/s`,
  ]
}
