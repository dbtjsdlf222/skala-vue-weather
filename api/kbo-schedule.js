const KBO_SCHEDULE_URL = 'https://www.koreabaseball.com/ws/Schedule.asmx/GetScheduleList'

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ message: 'POST 요청만 사용할 수 있습니다.' })
  }

  const body =
    typeof request.body === 'string'
      ? request.body
      : new URLSearchParams(request.body || {}).toString()

  try {
    const kboResponse = await fetch(KBO_SCHEDULE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: 'https://www.koreabaseball.com',
        Referer: 'https://www.koreabaseball.com/Schedule/Schedule.aspx',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body,
    })

    const data = await kboResponse.json()
    return response.status(kboResponse.ok ? 200 : 502).json(data)
  } catch (error) {
    console.error(error)
    return response.status(502).json({ message: 'KBO 일정을 불러오지 못했습니다.' })
  }
}
