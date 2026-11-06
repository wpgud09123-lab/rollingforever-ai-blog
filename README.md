# 롤링포에버 AI 블로그 자동화 V1

## 기능
직원 공용 비밀번호 로그인, 광고주 등록, OpenAI 글 생성, Supabase 저장, 최근 글 조회, 편집 및 복사. **네이버 자동 발행 기능은 포함되지 않습니다.**

## 준비물
GitHub, Supabase, OpenAI API(별도 사용 요금), Vercel 계정.

## 1. Supabase DB 생성
1. https://supabase.com 에서 프로젝트 생성
2. SQL Editor에서 `schema.sql` 내용 실행
3. Project Settings → API 또는 API Keys에서 Project URL과 `service_role`/secret key 확인. **공개 금지**

## 2. 로컬 실행 (PC)
Node.js 20 이상 설치 후 프로젝트 폴더에서:
```bash
npm install
```
`.env.example`을 `.env.local`로 복사하고 실제 환경변수 값 입력:
```
OPENAI_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STAFF_PASSWORD=긴_직원_비밀번호
SESSION_SECRET=별도의_긴_무작위_문자열
```
이후:
```bash
npm run dev
```
http://localhost:3000 접속. `npm run build`로 배포 전 확인.

## 3. GitHub 업로드
GitHub에서 새 **Private** 저장소 생성 후, 프로젝트 폴더에서:
```bash
git init
git add .
git commit -m "Rolling Forever AI blog V1"
git branch -M main
git remote add origin https://github.com/본인아이디/저장소명.git
git push -u origin main
```
`.env.local`은 `.gitignore`로 제외됨. API 키를 GitHub에 올리지 마세요.

## 4. Vercel 배포
1. https://vercel.com → Add New Project → GitHub 저장소 Import
2. Framework: Next.js, Root Directory: 기본값
3. Environment Variables에 위 5개 값 등록 (Production)
4. Deploy 클릭 → 생성된 `*.vercel.app` 주소로 접속
5. 갤럭시 Chrome에서 해당 주소 열고 로그인

## 보안/운영 유의사항
- 직원 전체가 하나의 비밀번호를 공유하는 **소규모 MVP**입니다. 실제 운영 전 직원별 계정, 권한, 로그인 시도 제한, 비밀번호 변경/회수 기능을 권장합니다.
- API 키와 Supabase service role 키는 **서버 환경변수**에만 저장합니다.
- 생성된 AI 글은 사실관계 및 광고 표시를 검수하고 발행하세요.
- 초안 수정 후 영구 저장은 V2에서 추가할 기능입니다.
- AI API 호출은 비용이 발생할 수 있습니다. 악용 방지를 위해 운영 시 사용량 제한과 호출 제한을 추가하세요.
