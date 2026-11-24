# 네이버 쇼핑 키워드를 Google Sheets에 기록하기

스킨케어 검색어 상위 20개를 수집하고 이전 기간 순위와 비교해, 날짜별 조사 기록을 시트에 쌓는 예제입니다. 이 저장소는 **해당 Apify Actor의 제작자가 공개한 사용 예제**입니다. 유료 Actor의 비공개 수집 소스나 인증 정보는 포함하지 않습니다.

[Actor 실행 화면](https://apify.com/frank_conifer_af4/naver-shopping-insight?utm_source=github&utm_medium=tutorial&utm_campaign=naver_pilot_20261124&utm_content=korean_readme) · [샘플 CSV](samples/skincare-keywords-2026-11-24.csv) · [샘플 JSON](samples/skincare-keywords-2026-11-24.json) · [English](README.md)

## 실제 결과 미리 보기

2026년 11월 24일 제작자 테스트에서 스킨케어 20건을 정상 수집했습니다. 공개 미리보기는 그중 **5건**입니다. 수집 대상 기간은 **10월 25일~11월 23일**, 비교 기간은 **9월 25일~10월 24일**입니다. 고객 매출이나 도입 사례로 집계한 실행이 아닙니다.

| 순위 | 검색어 | 이전 기간 순위 | 변화 |
| --- | --- | --- | --- |
| 1 | ahc아이크림 | 1 | 동일 |
| 2 | 세포랩 | 2 | 동일 |
| 3 | 마데카크림 | 3 | 동일 |

네이버 데이터랩의 **카테고리 검색어 클릭 순위**입니다. 상품별 판매량, 절대 검색량, 광고 효율, 상품 노출 순위 또는 판매 성공을 뜻하지 않습니다. 같은 순위는 그대로 표시하며 상승 신호를 만들어내지 않습니다. 출처와 한계는 [provenance.json](samples/provenance.json)에 있습니다.

## 처음에는 한 번만 실행

1. Actor의 Input JSON 편집기에 [starter-input.json](examples/starter-input.json)을 사용합니다.
2. 최대 실행 요금을 **$0.10**, 메모리를 **256 MB**로 설정하고 한 번 실행합니다.
3. Dataset에서 CSV·Excel·JSON을 내려받습니다. `status: "ok"`, 조회 기간과 `SUMMARY.stats.errorRows`를 먼저 확인합니다.

11월 24일 확인한 기본 이벤트 가격에서 20건은 **$0.06005**입니다. 계산은 `20 x $0.003 + 시작비 $0.00005`이며, 할인·세금·저장소·별도 서비스 비용 등은 제외합니다. 최신 가격은 Store Pricing 탭을 확인해야 합니다. 오류·빈 결과 행에는 키워드 결과 요금이 없지만 시작비는 발생할 수 있습니다.

## 매일 시트에 쌓기

1. [n8n 워크플로 JSON](templates/n8n-workflow.json)을 가져옵니다. 처음에는 **비활성 상태**입니다.
2. `Run keyword radar`에서 본인의 Header Auth 자격증명을 선택합니다. 헤더는 `Authorization`, 값은 `Bearer 본인_APIFY_TOKEN`입니다. 토큰을 워크플로 JSON이나 시트에 적지 않습니다.
3. `Append to Google Sheets`에서 본인의 Google 자격증명을 연결하고 `YOUR_SPREADSHEET_ID`를 바꿉니다. `Keywords` 탭에 [헤더](templates/sheet-header.csv)를 넣습니다.
4. 수동 테스트에서 시트 도착을 확인합니다. 첫 비교는 `baseline`이고, 이후 실행은 날짜별 행을 추가합니다.
5. 전달이 확인된 뒤에만 오전 9시(서울 시간) 일정을 활성화하거나 주간 일정으로 바꿉니다. Apify에도 같은 일정을 만들면 중복 실행될 수 있습니다.

30회 모두 20건을 반환하면 기본 이벤트 요금 합계는 **$1.80150**이며 별도 서비스 비용과 가격 변경은 제외합니다. 순위가 같아도 매번 데이터를 받는 실행에는 요금이 발생합니다. 공개 예제를 가져오는 것만으로 일정이 활성화되지는 않습니다.

같은 감시 목록은 필터·수집 개수·스냅샷 이름을 유지하고 겹쳐 실행하지 않습니다. 별도 목록은 `snapshotStoreName`을 다르게 설정합니다. `last30days`를 매일 조회한 비교는 겹치는 30일 기간의 변화이지 일별 판매량이 아닙니다. Sheets에는 수식으로 실행하지 않도록 `RAW`로 기록합니다. 요청이 끊겼다면 재시도 전에 기존 Apify 실행이 남아 있는지 확인합니다.

Apify 자체 일정이나 선택적 Slack 알림은 [자동화 가이드](templates/automation-guide.md)를 참고하세요. Google·Slack 실제 계정으로의 전달은 본인 자격증명과 목적지가 있어야 검증할 수 있습니다. 웹훅 주소도 비밀 정보이므로 공개하면 안 됩니다.

## 피드백과 출처

실제 업무에서 사용한다면 필요한 카테고리·보고 주기·컬럼을 알려주세요. 고객사 정보, API 키, 비공개 실행 링크, 결제 정보는 이슈에 올리지 않습니다. 비공개 지원은 Actor Store 지원 채널을 사용합니다.

원 출처는 [NAVER DataLab Shopping Insight](https://datalab.naver.com/shoppingInsight/sCategory.naver)입니다. NAVER와 제휴 관계를 주장하지 않으며, 데이터 재배포 전 원 출처의 이용 조건과 표시 요건을 확인해야 합니다. 예제 공개가 원 데이터에 대한 권리 부여를 뜻하지 않습니다.
