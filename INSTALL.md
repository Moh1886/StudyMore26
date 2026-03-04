# 🚀 خطوات إعداد وتثبيت Git رفع المشروع على GitHub

## الخطوة 1️⃣: تثبيت Git

### على Windows:
1. اذهب إلى [git-scm.com](https://git-scm.com/download/win)
2. حمل الإصدار الأحدث (64-bit)
3. ثبت Git واقبل الخيارات الافتراضية
4. أعد تشغيل PowerShell بعد التثبيت

### تحقق من التثبيت:
```powershell
git --version
```

---

## الخطوة 2️⃣: تكوين Git الأول (المرة الأولى فقط)

```powershell
git config --global user.name "اسمك"
git config --global user.email "بريدك@gmail.com"
```

---

## الخطوة 3️⃣: إنشاء مستودع محلي

انتقل إلى مجلد المشروع:
```powershell
cd "d:\بب\6g"
```

أنشئ مستودع Git:
```powershell
git init
git add .
git commit -m "الإطلاق الأول: موقع منظم المذاكرة"
```

---

## الخطوة 4️⃣: إنشاء مستودع على GitHub

1. اذهب إلى [github.com](https://github.com)
2. سجل الدخول (أو أنشئ حساب مجاني)
3. انقر على ➕ أيقونة في الزاوية اليمنى العليا
4. اختر "New repository"
5. أدخل البيانات:
   - **Repository name**: `study-organizer` (أو أي اسم تفضله)
   - **Description**: منظم المذاكرة - موقع لتنظيم الدراسة
   - اختر **Public** (حتى يراه الجميع)
   - تجاهل خيارات الملفات (لا تنشئ README)
6. انقر **Create repository**

---

## الخطوة 5️⃣: ربط المستودع المحلي بـ GitHub

سيظهر لك صفحة بتعليمات. انسخ واحدة من الأوامر التالية حسب حالتك:

### إذا لم تنشئ مستودع محلي بعد:

```powershell
cd "d:\بب\6g"
git init
git add .
git commit -m "الإطلاق الأول: موقع منظم المذاكرة"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/study-organizer.git
git push -u origin main
```

### أو للحفظ الأمن (يُفضل):

إذا كنت تريد استخدام SSH بدلاً من HTTPS:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/study-organizer.git
git branch -M main
git push -u origin main
```

**⚠️ استبدل `YOUR_USERNAME` باسم حسابك على GitHub**

---

## الخطوة 6️⃣: إدخال بيانات اعتماد GitHub

عند أول push، قد يطلب منك:

### خيار 1: HTTPS (الأسهل)
سيطلب منك كلمة المرور:
- اسم المستخدم: اسم حسابك على GitHub
- كلمة المرور: **استخدم GitHub Personal Access Token** بدلاً من كلمة المرور الفعلية

### إنشاء Personal Access Token:
1. اذهب إلى: [github.com/settings/tokens](https://github.com/settings/tokens)
2. انقر **Generate new token (classic)**
3. اختر صلاحيات: `repo` (كل شيء)
4. انقر **Generate token**
5. انسخ التوكن (لن تراه مرة أخرى!)

---

## الخطوة 7️⃣: تحديث المشروع لاحقاً

كلما أردت رفع التحديثات:

```powershell
cd "d:\بب\6g"
git add .
git commit -m "وصف التغييرات"
git push
```

---

## 📝 أمثلة رسائل Commit جيدة:

```
إضافة ميزة الجدول الدراسي
إصلاح خطأ في حساب ساعات المذاكرة
تحديث واجهة المستخدم
إضافة دعم اللغة الإنجليزية
```

---

## 🔍 التحقق من الحالة

```powershell
git status       # حالة التغييرات الحالية
git log          # سجل الـ commits
git remote -v    # عرض المستودع البعيد
```

---

## ⚡ نصائح مهمة

✅ **افعل:**
- اكتب رسائل commit واضحة ومختصرة
- أضف ملفات مهمة فقط
- استخدم .gitignore لاستبعاد الملفات غير الضرورية

❌ **لا تفعل:**
- لا تضع بيانات حساسة (مفاتيح API، كلمات المرور)
- لا تحمّل ملفات ضخمة جداً
- لا تستخدم كلمة المرور الفعلية (استخدم Personal Access Token)

---

## 🆘 حل مشاكل شائعة

### خطأ: "fatal: not a git repository"
```powershell
git init
```

### خطأ: "Permission denied"
تأكد من استخدام التوكن بدلاً من كلمة المرور

### خطأ: "origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/study-organizer.git
```

---

## 📚 موارد إضافية

- [دليل GitHub الرسمي](https://docs.github.com)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [سجل تغييرات Git](https://git-scm.com/book)

---

استمتع برفع مشروعك! 🎉
