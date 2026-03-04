الآن مستودع Git محلي جاهز! ✅

## 📦 الملفات المضافة:
- ✅ index.html - الصفحة الرئيسية
- ✅ app.js - التطبيق
- ✅ styles.css - الأنماط
- ✅ README.md - الوثائق
- ✅ LICENSE - ترخيص MIT
- ✅ CONTRIBUTING.md - دليل المساهمة
- ✅ INSTALL.md - تعليمات التثبيت
- ✅ .gitignore - ملفات مستبعدة

---

## 🚀 الخطوة التالية: رفع على GitHub

### 1️⃣ أنشئ حساب GitHub (إن لم يكن لديك):
👉 اذهب إلى: https://github.com

### 2️⃣ أنشئ مستودع جديد:
1. بعد تسجيل الدخول، انقر على ➕ في الزاوية اليمنى العليا
2. اختر "New repository"
3. أدخل البيانات:
   - **Repository name:** `study-organizer`
   - **Description:** Study organization website with grade selection and subject library
   - **Visibility:** Public
4. **لا تختر أي خيارات أخرى** (لا تنشئ README أو .gitignore)
5. انقر **Create repository**

---

## 3️⃣ انسخ الأمر التالي وشغله في PowerShell:

سيظهر لك شيء مشابه لهذا (استبدل YOUR_USERNAME باسمك):

```powershell
cd "D:\بب\6g"

# اختر أحد الطريقتين:

# الطريقة 1: HTTPS (الأسهل)
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR_USERNAME/study-organizer.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

أو

```powershell
# الطريقة 2: SSH (أكثر أماناً)
& "C:\Program Files\Git\bin\git.exe" branch -M main
& "C:\Program Files\Git\bin\git.exe" remote add origin git@github.com:YOUR_USERNAME/study-organizer.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

---

## 4️⃣ عند تشغيل الأمر:

### مع HTTPS:
سيطلب منك:
- **Username:** اسمك على GitHub
- **Password:** استخدم Personal Access Token بدلاً من كلمة المرور

### إنشاء Personal Access Token:
1. اذهب إلى: https://github.com/settings/tokens
2. انقر **Generate new token (classic)**
3. اكتب اسم: `github-push`
4. اختر الـ scopes:
   - ✅ `repo` (كل الصلاحيات)
5. انقر **Generate token**
6. **انسخ التوكن** وحفظه في مكان آمن

---

## ✨ بعد الرفع بنجاح:

سترى رسالة مشابهة:
```
Enumerating objects: 8, done.
Counting objects: 100% (8/8), done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🎉 تم! الآن مشروعك على GitHub

### شارك رابط مستودعك:
https://github.com/YOUR_USERNAME/study-organizer

---

## 📝 تحديثات المستقبل:

كلما أردت رفع تحديثات:

```powershell
cd "D:\بب\6g"
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "وصف التغيير"
& "C:\Program Files\Git\bin\git.exe" push
```

---

## 🆘 مشاكل شائعة:

### "fatal: remote origin already exists"
```powershell
& "C:\Program Files\Git\bin\git.exe" remote remove origin
# ثم شغل أمر push الأول مجدداً
```

### "Error: authentication failed"
- استخدم Personal Access Token بدلاً من كلمة المرور
- تأكد من تفعيل 2FA إن لزم الأمر

### "Connection refused"
- تأكد من اتصالك بالإنترنت
- جرب استخدام HTTPS بدلاً من SSH

---

📖 لمزيد من المعلومات، راجع: [INSTALL.md](INSTALL.md)
