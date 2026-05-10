# 📱 Style Stock Manager — دليل بناء APK

## 🏗️ هيكل المشروع

```
clowthex-android/
├── src/                        # كود React (لم يتغير)
│   ├── components/             # مكونات UI
│   ├── pages/                  # صفحات التطبيق
│   ├── lib/db.ts               # قاعدة البيانات IndexedDB
│   ├── contexts/               # AppContext
│   ├── i18n/                   # الترجمات
│   ├── styles.css              # تصميم Tailwind
│   └── main.tsx               ← جديد: نقطة دخول SPA
├── public/                    ← جديد: أيقونات التطبيق
│   ├── icon.svg
│   └── icon-192.png
├── android/                   ← ينشأ بعد تشغيل: npx cap add android
├── android-config/            ← ملفات جاهزة للنسخ إلى android/
│   ├── AndroidManifest.xml
│   ├── network_security_config.xml
│   ├── app-build.gradle
│   ├── variables.gradle
│   ├── icons/                 ← أيقونات Android
│   └── splash.png
├── index.html                 ← جديد: entry point HTML
├── vite.config.ts             ← محدّث: SPA mode
├── capacitor.config.ts        ← جديد: إعدادات Capacitor
├── package.json               ← محدّث: بدون SSR + Capacitor
├── tsconfig.json              ← محدّث
└── .github/workflows/
    └── build-apk.yml          ← جديد: GitHub Actions
```

---

## 🚀 الخطوات الكاملة خطوة بخطوة

### الخطوة 1 — تجهيز الملفات

1. حمّل ملف ZIP هذا وافتحه
2. افتح Terminal (موجه الأوامر) داخل مجلد `clowthex-android`

### الخطوة 2 — تثبيت الحزم

```bash
# تثبيت جميع حزم npm
npm install
```

### الخطوة 3 — بناء تطبيق الويب

```bash
npm run build
```

يجب أن ترى مجلد `dist/` ينشأ بنجاح.

### الخطوة 4 — إضافة منصة Android

```bash
npx cap add android
```

> سيُنشئ هذا مجلد `android/` كاملاً.

### الخطوة 5 — نسخ ملفات Android المخصصة

```bash
# شبكة الأمان
cp android-config/network_security_config.xml \
   android/app/src/main/res/xml/network_security_config.xml

# variables.gradle
cp android-config/variables.gradle android/variables.gradle

# الأيقونات
cp -r android-config/icons/mipmap-* android/app/src/main/res/
```

> ملاحظة: `AndroidManifest.xml` و `app-build.gradle` —
> الملفات في `android-config/` هي مرجع. راجعها وعدّل نسخة Android
> إذا احتجت لتغيير permissions أو applicationId.

### الخطوة 6 — مزامنة Capacitor

```bash
npx cap sync android
```

### الخطوة 7 — بناء APK محلياً (اختياري)

إذا عندك Android Studio أو Java 17 + Android SDK:

```bash
cd android
./gradlew assembleDebug
```

ملف APK سيكون في:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🤖 GitHub Actions — البناء التلقائي

### الخطوة 1 — رفع المشروع إلى GitHub

```bash
# داخل مجلد clowthex-android
git init
git add .
git commit -m "feat: setup Capacitor Android app"

# أنشئ Repo جديد في GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### الخطوة 2 — تفعيل GitHub Actions

1. افتح الـ Repository في GitHub
2. اضغط تبويب **Actions**
3. إذا طُلب منك: اضغط **"I understand my workflows, enable them"**

### الخطوة 3 — تشغيل Workflow يدوياً

1. في تبويب **Actions** → اختر **"🤖 Build Android APK"**
2. اضغط **"Run workflow"** على اليمين
3. اختر `debug` أو `release`
4. اضغط **"Run workflow"** (الزر الأخضر)

### الخطوة 4 — تحميل APK

1. انتظر انتهاء البناء (5-10 دقائق)
2. اضغط على الـ workflow run الذي اكتمل (✅)
3. في أسفل الصفحة: قسم **"Artifacts"**
4. اضغط على `app-debug-XXX` لتحميل ZIP
5. افتح ZIP → داخله `app-debug.apk`

### الخطوة 5 — تثبيت APK على الهاتف

1. انقل `app-debug.apk` إلى هاتفك
2. في هاتفك: **الإعدادات → الأمان → السماح بمصادر غير معروفة** ✓
3. افتح ملف APK وثبّته
4. التطبيق سيظهر باسم **"Style Stock Manager"**

---

## 🔑 إعداد Release APK (APK موقّع للنشر)

### إنشاء Keystore

```bash
keytool -genkey -v -keystore release.keystore \
  -alias haythemgroup \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

### إضافة Secrets إلى GitHub

1. في GitHub Repo → **Settings → Secrets and variables → Actions**
2. أضف هذه Secrets:

| اسم السر | القيمة |
|----------|--------|
| `KEYSTORE_BASE64` | `base64 release.keystore` (انسخ الناتج) |
| `KEY_ALIAS` | `haythemgroup` |
| `KEY_PASSWORD` | كلمة مرور المفتاح |
| `STORE_PASSWORD` | كلمة مرور الـ keystore |

```bash
# لتحويل keystore إلى base64:
base64 -w 0 release.keystore
```

---

## ⚡ تغيير App ID (مهم!)

في `capacitor.config.ts` غيّر:
```ts
appId: "com.haythemgroup.stockmanager",
appName: "Style Stock Manager",
```

إلى أي اسم تريده مثل:
```ts
appId: "com.clowthex.pos",
appName: "Clowthex POS",
```

---

## 🛠️ استكشاف الأخطاء

### خطأ: `JAVA_HOME is not set`
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### خطأ: `SDK location not found`
```bash
echo "sdk.dir=/home/$USER/Android/Sdk" > android/local.properties
```

### خطأ: `npm ci fails`
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate lockfile"
```

### خطأ في Vite build: تعارض مع TanStack Start
تأكد أن هذه الملفات غير موجودة في مشروعك:
- `src/routes/` ← احذفه
- `src/router.tsx` ← احذفه
- `src/server.ts` ← احذفه
- `src/start.ts` ← احذفه
- `src/routeTree.gen.ts` ← احذفه
- `wrangler.jsonc` ← احذفه

---

## 📊 ملاحظات تقنية

| الميزة | الحالة |
|--------|--------|
| يعمل Offline | ✅ 100% (IndexedDB) |
| Firebase/Supabase | ✅ لا يوجد |
| Camera (Barcode) | ✅ مدعوم بـ html5-qrcode |
| RTL (Arabic) | ✅ مدعوم |
| Dark Mode | ✅ مدعوم |
| Android 10+ | ✅ API 29+ |
| Splash Screen | ✅ Capacitor SplashScreen |
| Status Bar | ✅ Capacitor StatusBar |
| إشعارات | ❌ غير مطلوبة |
| Push Notifications | ❌ غير مطلوبة |
