# Careery Backend

باك إند جاهز (Node.js + Express + MongoDB) لمشروع Careery.

## التشغيل

```bash
cd careery-backend
npm install
npm run dev   # أو npm start
```

تأكد إن MongoDB شغال محلي على `mongodb://127.0.0.1:27017` أو غيّر `MONGO_URI` في ملف `.env` لو هتستخدم Atlas.

السيرفر هيشتغل على: `http://localhost:5000`

---

## API Endpoints

### 1) Auth

**POST** `/api/auth/signup`
```json
{ "firstName": "Mohamed", "lastName": "Zaki", "email": "m@test.com", "password": "123456" }
```
Response: `{ "token": "...", "user": {...} }`

**POST** `/api/auth/login`
```json
{ "email": "m@test.com", "password": "123456" }
```
Response: `{ "token": "...", "user": {...} }`

> خزّن الـ token في `localStorage` وابعته في كل request في الهيدر:
> `Authorization: Bearer <token>`

---

### 2) Profile

**GET** `/api/users/me` (محتاج Token)
Response:
```json
{ "user": { "id": "...", "firstName": "Mohamed", "lastName": "Zaki", "initials": "MZ", "recommendedField": "programming", "quizCompleted": true } }
```
> استخدم `user.initials` بدل "MZ" الثابتة فوق في الـ icon.

**PUT** `/api/users/me` (محتاج Token) - تعديل الاسم
```json
{ "firstName": "Ahmed", "lastName": "Ali" }
```

---

### 3) Quiz

**POST** `/api/quiz/submit` (محتاج Token)

طريقة 1 - تبعت الإجابات كأرقام (0=Programming, 1=Networking, 2=Communications):
```json
{ "answers": [0,1,0,2,0,1,0,0,1,2] }
```

طريقة 2 - تبعت النقط جاهزة:
```json
{ "scores": { "programming": 6, "networking": 3, "communications": 1 } }
```

Response:
```json
{ "recommendedField": "programming", "scores": { "programming": 6, "networking": 3, "communications": 1 } }
```

**GET** `/api/quiz/result` (محتاج Token) - رجوع نتيجة الكويز المحفوظة

---

### 4) Roadmap

**GET** `/api/roadmap` (محتاج Token)
Response:
```json
{
  "field": "programming",
  "title": { "en": "Programming Roadmap", "ar": "خارطة طريق البرمجة" },
  "steps": [
    { "id": "prog-1", "title": {...}, "completed": false },
    ...
  ],
  "progress": { "completed": 2, "total": 10, "percentage": 20 }
}
```

**POST** `/api/roadmap/progress` (محتاج Token) - تحديث حالة خطوة
```json
{ "stepId": "prog-3", "completed": true }
```

---

### 5) Explore

**GET** `/api/explore` (مفتوح بدون Token)
Response:
```json
{ "items": [...], "byField": { "programming": [...], "networking": [...], "communications": [...] } }
```

---

## ملاحظات الربط بالفرونت اند

1. **Login/Signup page**: لما المستخدم يضغط "Get Started" في `index.html`، وجّهه لصفحة auth (موجودة في `frontend-auth.html` المرفقة). بعد تسجيل الدخول/التسجيل احفظ `token` و `user` في `localStorage` وروح لصفحة الكويز أو الـ Home.

2. **Profile icon**: بدل `MZ` الثابتة، اقرأ `user.initials` من `/api/users/me` أو من `localStorage` بعد اللوجين، واعمل onClick يوديك لـ `profile.html`.

3. **Quiz → Roadmap**: بعد ما يخلص الكويز، ابعت النتيجة لـ `/api/quiz/submit`، والسيرفر هيحفظ `recommendedField` ويبني عليه الـ roadmap تلقائيًا.

4. **Roadmap → Explore**: في `roadmap.html` ضيف زرار/لينك واضح فوق يودي لـ `explore.html`.

5. **Progress**: كل ما المستخدم يعلّم خطوة "تمت" في `roadmap.html`، ابعت `POST /api/roadmap/progress` فورًا، وعند فتح الصفحة تاني اعمل `GET /api/roadmap` لاسترجاع الحالة المحفوظة.
