// ===== AUTHENTICATION =====
// Check if user is logged in
let isCheckingAuth = false;

function checkAuthentication() {
    if (isCheckingAuth) return null; // Prevent multiple checks
    isCheckingAuth = true;
    
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        // Use location.replace to prevent back button issues
        window.location.replace('auth.html');
        return null;
    }
    
    try {
        return JSON.parse(userData);
    } catch (e) {
        console.error('Auth error:', e);
        localStorage.removeItem('currentUser');
        window.location.replace('auth.html');
        return null;
    }
}

// Initialize authentication
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuthentication();
    if (currentUser) {
        initializeApp();
    }
});

function initializeApp() {
    // Increment visit count
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    visitCount++;
    localStorage.setItem('visitCount', visitCount.toString());
    document.getElementById('visitCount').textContent = visitCount;

    // Display user info
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userName && currentUser) {
        userName.textContent = `👤 مرحباً، ${currentUser.name}`;
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                localStorage.removeItem('currentUser');
                window.location.replace('auth.html');
            }
        });
    }
    
    setupGradeSelection();
    setupTimer();
    updateSelectOptions();
    updateDashboard();
    updateStatistics();
    renderSchedules();
    renderSubjects();
    renderTasks();
    renderNotes();
    renderExams();
}

// Data Management
const DataManager = {
    getAll: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    add: (key, item) => {
        const items = DataManager.getAll(key);
        item.id = Date.now();
        items.push(item);
        DataManager.save(key, items);
        return item;
    },
    update: (key, id, updates) => {
        const items = DataManager.getAll(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            DataManager.save(key, items);
        }
    },
    delete: (key, id) => {
        const items = DataManager.getAll(key);
        DataManager.save(key, items.filter(item => item.id !== id));
    }
};

// Timer Data
let timerState = {
    isRunning: false,
    isPaused: false,
    timeLeft: 25 * 60,
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    isBreakTime: false,
    timerInterval: null,
    currentSubject: null
};

// Subjects Library Database
const subjectsDatabase = {
    'primary-1': [
        { name: 'اللغة العربية', description: 'تعلم أساسيات اللغة العربية', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'العمليات الحسابية الأساسية', color: '#3498db' },
        { name: 'العلوم', description: 'مقدمة في العلوم الطبيعية', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'معرفة أساسية عن المجتمع', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'تعلم اللغة الإنجليزية الأساسية', color: '#9b59b6' },
        { name: 'الفنون', description: 'التعبير الفني والرسم', color: '#e67e22' }
    ],
    'primary-2': [
        { name: 'اللغة العربية', description: 'تطور اللغة والكتابة', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الجمع والطرح والضرب', color: '#3498db' },
        { name: 'العلوم', description: 'الخصائص والمواد الأساسية', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'العائلة والمجتمع', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'كلمات وعبارات إنجليزية', color: '#9b59b6' },
        { name: 'التكنولوجيا', description: 'مقدمة في الحاسوب', color: '#16a085' }
    ],
    'primary-3': [
        { name: 'اللغة العربية', description: 'النحو والإملاء والقراءة', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الأعداد والكسور والقياس', color: '#3498db' },
        { name: 'العلوم', description: 'الأحياء والفيزياء الأساسية', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'الجغرافيا والتاريخ', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'المحادثة والكتابة البسيطة', color: '#9b59b6' },
        { name: 'الفنون والموسيقى', description: 'الفنون البصرية', color: '#e67e22' }
    ],
    'primary-4': [
        { name: 'اللغة العربية', description: 'الأدب والشعر والقواعد', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الهندسة والجبر والإحصاء', color: '#3498db' },
        { name: 'العلوم الطبيعية', description: 'الفيزياء والكيمياء والأحياء', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'التاريخ والجغرافيا والثقافة', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'القراءة والكتابة والنحو', color: '#9b59b6' },
        { name: 'التربية البدنية', description: 'الرياضة والصحة', color: '#16a085' }
    ],
    'primary-5': [
        { name: 'اللغة العربية', description: 'الدراسة الأدبية والنقدية', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الحساب المتقدم والهندسة', color: '#3498db' },
        { name: 'العلوم الطبيعية', description: 'موضوعات فيزيائية وكيميائية متقدمة', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'التاريخ القديم والحديث', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'قراءة متقدمة وكتابة', color: '#9b59b6' },
        { name: 'المعلومات', description: 'الحوسبة والبرمجة الأساسية', color: '#16a085' }
    ],
    'primary-6': [
        { name: 'اللغة العربية', description: 'الأدب والبلاغة والنقد', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الجبر والهندسة المتقدمة', color: '#3498db' },
        { name: 'العلوم الطبيعية', description: 'الفيزياء والكيمياء والأحياء المتقدمة', color: '#2ecc71' },
        { name: 'الدراسات الاجتماعية', description: 'دراسة عميقة للمجتمع والتاريخ', color: '#f39c12' },
        { name: 'اللغة الإنجليزية', description: 'حوار متقدم وأدب إنجليزي', color: '#9b59b6' },
        { name: 'المعلومات', description: 'البرمجة والتطبيقات', color: '#16a085' }
    ],
    'middle-1': [
        { name: 'اللغة العربية', description: 'النصوص الأدبية والنحو المتقدم', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الجبر والهندسة الإقليدية', color: '#3498db' },
        { name: 'الفيزياء', description: 'الحركة والقوة والطاقة الأساسية', color: '#2ecc71' },
        { name: 'الكيمياء', description: 'المادة والعناصر الأساسية', color: '#f39c12' },
        { name: 'الأحياء', description: 'الخلية والكائنات الحية', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'القراءة الناقدة والكتابة الإبداعية', color: '#e67e22' }
    ],
    'middle-2': [
        { name: 'اللغة العربية', description: 'الشعر والنثر والنقد الأدبي', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'الهندسة والدوال والمعادلات', color: '#3498db' },
        { name: 'الفيزياء', description: 'الحرارة والضوء والصوت', color: '#2ecc71' },
        { name: 'الكيمياء', description: 'التفاعلات الكيميائية والحسابات', color: '#f39c12' },
        { name: 'الأحياء', description: 'الوراثة والتطور الأساسي', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'الأدب الإنجليزي والمحادثة', color: '#e67e22' }
    ],
    'middle-3': [
        { name: 'اللغة العربية', description: 'الدراسة المتقدمة للأدب والنقد', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'التحليل والمتجهات والإحصاء', color: '#3498db' },
        { name: 'الفيزياء', description: 'الكهرباء والمغناطيسية والحركة المتقدمة', color: '#2ecc71' },
        { name: 'الكيمياء', description: 'الجدول الدوري والروابط الكيميائية', color: '#f39c12' },
        { name: 'الأحياء', description: 'الأنظمة الحية والوراثة المتقدمة', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'الأدب والنقد والكتابة الأكاديمية', color: '#e67e22' }
    ],
    'secondary-1': [
        { name: 'اللغة العربية', description: 'النصوص الأدبية التراثية والحديثة', color: '#e74c3c' },
        { name: 'الرياضيات التطبيقية', description: 'الجبر الخطي والهندسة التحليلية', color: '#3498db' },
        { name: 'الفيزياء', description: 'الميكانيكا والطاقة المتقدمة', color: '#2ecc71' },
        { name: 'الكيمياء', description: 'الكيمياء العضوية واللاعضوية', color: '#f39c12' },
        { name: 'الأحياء', description: 'علم الأحياء الجزيئية والوراثة', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'الأدب الإنجليزي الكلاسيكي', color: '#e67e22' }
    ],
    'secondary-2': [
        { name: 'اللغة العربية', description: 'الدراسات الأدبية والنقدية المتقدمة', color: '#e74c3c' },
        { name: 'الرياضيات', description: 'التفاضل والتكامل الأساسي', color: '#3498db' },
        { name: 'الفيزياء', description: 'الموجات والبصريات والكهرمغناطيسية', color: '#2ecc71' },
        { name: 'الكيمياء', description: 'الكيمياء الحرارية والحركية', color: '#f39c12' },
        { name: 'الأحياء', description: 'الفسيولوجيا والإيكولوجيا', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'الأدب المعاصر والدراسات النقدية', color: '#e67e22' }
    ],
    'secondary-3': [
        { name: 'اللغة العربية', description: 'الأدب والبلاغة والنقد الأدبي المتقدم', color: '#e74c3c' },
        { name: 'الرياضيات المتقدمة', description: 'التفاضل والتكامل والمتسلسلات', color: '#3498db' },
        { name: 'الفيزياء المتقدمة', description: 'الفيزياء الحديثة والنسبية', color: '#2ecc71' },
        { name: 'الكيمياء المتقدمة', description: 'الكيمياء الكمية والعضوية المتقدمة', color: '#f39c12' },
        { name: 'الأحياء المتقدمة', description: 'علم الأحياء الجزيئية والتطور', color: '#9b59b6' },
        { name: 'اللغة الإنجليزية', description: 'الأدب الإنجليزي والدراسات اللغوية', color: '#e67e22' }
    ]
};

// Current selected grade
let currentGrade = localStorage.getItem('currentGrade') || null;

// Section Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // Remove active from all links and sections
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Add active to current link and section
        link.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
        
        // Refresh section data
        refreshSection(sectionId);
    });
});

function refreshSection(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'schedule':
            renderSchedules();
            break;
        case 'subjects':
            renderSubjects();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'notes':
            renderNotes();
            break;
        case 'exams':
            renderExams();
            break;
        case 'stats':
            updateStatistics();
            break;
    }
}

// Modal Management
function setupModal(modalId, btnId, formId) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const closeBtn = modal.querySelector('.close');

    btn.addEventListener('click', () => {
        modal.classList.add('show');
        const form = document.getElementById(formId);
        if (form) form.reset();
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Remove the form submit listener from here since each form has its own handler
}

// ===== GRADE SELECTION & SUBJECT LIBRARY =====
function setupGradeSelection() {
    const gradeButtons = document.querySelectorAll('.grade-btn');
    const browseBtn = document.getElementById('browseSubjectsBtn');
    
    gradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const grade = btn.getAttribute('data-grade');
            selectGrade(grade);
            btn.classList.add('active');
            gradeButtons.forEach(b => {
                if (b !== btn) b.classList.remove('active');
            });
        });
    });
    
    browseBtn.addEventListener('click', () => {
        if (!currentGrade) {
            alert('اختر صفك الدراسي أولاً');
            return;
        }
        showAvailableSubjects();
    });
    
    // Restore selected grade
    if (currentGrade) {
        const btn = document.querySelector(`[data-grade="${currentGrade}"]`);
        if (btn) {
            btn.classList.add('active');
            updateGradeInfo();
        }
    }
}

function selectGrade(grade) {
    currentGrade = grade;
    localStorage.setItem('currentGrade', grade);
    updateGradeInfo();
    document.getElementById('subjectGrade').value = grade;
    document.getElementById('availableSubjectsSection').style.display = 'none';
}

function updateGradeInfo() {
    const gradeNames = {
        'primary-1': 'الابتدائي الأول',
        'primary-2': 'الابتدائي الثاني',
        'primary-3': 'الابتدائي الثالث',
        'primary-4': 'الابتدائي الرابع',
        'primary-5': 'الابتدائي الخامس',
        'primary-6': 'الابتدائي السادس',
        'middle-1': 'الإعدادي الأول',
        'middle-2': 'الإعدادي الثاني',
        'middle-3': 'الإعدادي الثالث',
        'secondary-1': 'الثانوي الأول',
        'secondary-2': 'الثانوي الثاني',
        'secondary-3': 'الثانوي الثالث'
    };
    
    if (currentGrade) {
        document.getElementById('selectedGradeInfo').innerHTML = 
            `✅ تم اختيار: <strong>${gradeNames[currentGrade]}</strong>`;
    }
}

function showAvailableSubjects() {
    const subjects = subjectsDatabase[currentGrade] || [];
    const container = document.getElementById('availableSubjectsList');
    const section = document.getElementById('availableSubjectsSection');
    
    if (subjects.length === 0) {
        container.innerHTML = '<p class="empty-subjects">لا توجد مواد متاحة</p>';
        section.style.display = 'block';
        return;
    }
    
    container.innerHTML = subjects.map(subject => `
        <div class="available-subject-card">
            <div style="text-align: center;">
                <div style="font-size: 2em; margin-bottom: 10px;">📚</div>
                <h4>${subject.name}</h4>
                <p>${subject.description}</p>
                <button class="btn btn-primary" onclick="addSubjectFromLibrary('${subject.name}', '${subject.color}')">
                    إضافة +
                </button>
            </div>
        </div>
    `).join('');
    
    section.style.display = 'block';
}

function addSubjectFromLibrary(name, color) {
    if (!currentGrade) {
        alert('اختر صفك الدراسي');
        return;
    }
    
    const subject = {
        grade: currentGrade,
        name: name,
        color: color,
        goalHours: 10,
        description: '',
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('subjects', subject);
    renderSubjects();
    updateSelectOptions();
    alert(`تمت إضافة مادة "${name}" بنجاح`);
}

// ===== SUBJECTS MANAGEMENT =====
const subjectModal = setupModal('subjectModal', 'addSubjectBtn', 'subjectForm');

document.getElementById('subjectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentGrade) {
        alert('اختر صفك الدراسي أولاً');
        return;
    }
    
    const subject = {
        grade: document.getElementById('subjectGrade').value,
        name: document.getElementById('subjectName').value,
        color: document.getElementById('subjectColor').value,
        goalHours: parseInt(document.getElementById('subjectGoalHours').value),
        description: document.getElementById('subjectDescription').value,
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('subjects', subject);
    renderSubjects();
    updateSelectOptions();
    subjectModal.classList.remove('show');
    document.getElementById('subjectForm').reset();
});

function renderSubjects() {
    const subjects = DataManager.getAll('subjects');
    const container = document.getElementById('subjectsList');
    
    const gradeNames = {
        'primary-1': 'الابتدائي 1',
        'primary-2': 'الابتدائي 2',
        'primary-3': 'الابتدائي 3',
        'primary-4': 'الابتدائي 4',
        'primary-5': 'الابتدائي 5',
        'primary-6': 'الابتدائي 6',
        'middle-1': 'الإعدادي 1',
        'middle-2': 'الإعدادي 2',
        'middle-3': 'الإعدادي 3',
        'secondary-1': 'الثانوي 1',
        'secondary-2': 'الثانوي 2',
        'secondary-3': 'الثانوي 3'
    };
    
    if (subjects.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">لا توجد مواد مضافة</p>';
        return;
    }
    
    container.innerHTML = subjects.map(subject => `
        <div class="card" style="border-right-color: ${subject.color}">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3>${subject.name}</h3>
                    <p style="font-size: 0.85em; color: #666; margin-bottom: 8px;">
                        📚 ${gradeNames[subject.grade] || 'بدون صف'}
                    </p>
                </div>
            </div>
            <p>${subject.description || 'بدون وصف'}</p>
            <p><strong>الهدف:</strong> ${subject.goalHours} ساعات</p>
            <div style="margin-top: 10px; display: flex; gap: 5px;">
                <button class="btn btn-danger" onclick="deleteSubject(${subject.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteSubject(id) {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
        DataManager.delete('subjects', id);
        renderSubjects();
        updateSelectOptions();
    }
}

function updateSelectOptions() {
    const subjects = DataManager.getAll('subjects');
    const selects = ['taskSubject', 'noteSubject', 'timerSubject'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">اختر المادة</option>' + 
                subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }
    });
}

// ===== SCHEDULE MANAGEMENT =====
const scheduleModal = setupModal('scheduleModal', 'addScheduleBtn', 'scheduleForm');

document.getElementById('scheduleForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const schedule = {
        subject: document.getElementById('scheduleSubject').value,
        date: document.getElementById('scheduleDate').value,
        startTime: document.getElementById('scheduleStartTime').value,
        endTime: document.getElementById('scheduleEndTime').value,
        notes: document.getElementById('scheduleNotes').value,
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('schedules', schedule);
    renderSchedules();
    scheduleModal.classList.remove('show');
    document.getElementById('scheduleForm').reset();
});

function renderSchedules() {
    const schedules = DataManager.getAll('schedules');
    const container = document.getElementById('scheduleList');
    
    if (schedules.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">لا توجد جلسات دراسية</p>';
        return;
    }
    
    const sorted = schedules.sort((a, b) => 
        new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime)
    );
    
    container.innerHTML = sorted.map(schedule => {
        const startTime = new Date(schedule.date + 'T' + schedule.startTime);
        const endTime = new Date(schedule.date + 'T' + schedule.endTime);
        const duration = (endTime - startTime) / (1000 * 60 * 60);
        
        return `
            <div class="schedule-item" style="border-right-color: #3498db">
                <div class="schedule-info">
                    <h4>${schedule.subject}</h4>
                    <p class="schedule-time">📅 ${formatDate(schedule.date)}</p>
                    <p class="schedule-time">⏰ ${schedule.startTime} - ${schedule.endTime} (${duration.toFixed(1)} ساعة)</p>
                    ${schedule.notes ? `<p class="schedule-time">📝 ${schedule.notes}</p>` : ''}
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-danger" onclick="deleteSchedule(${schedule.id})">حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteSchedule(id) {
    if (confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
        DataManager.delete('schedules', id);
        renderSchedules();
    }
}

// ===== TASKS MANAGEMENT =====
const taskModal = setupModal('taskModal', 'addTaskBtn', 'taskForm');

document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        title: document.getElementById('taskTitle').value,
        subject: document.getElementById('taskSubject').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        description: document.getElementById('taskDescription').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('tasks', task);
    renderTasks();
    taskModal.classList.remove('show');
    document.getElementById('taskForm').reset();
});

function renderTasks() {
    const tasks = DataManager.getAll('tasks');
    const filter = document.getElementById('taskFilter').value;
    const container = document.getElementById('tasksList');
    
    const subjects = DataManager.getAll('subjects');
    const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s.name]));
    
    let filtered = tasks;
    if (filter === 'active') filtered = tasks.filter(t => !t.completed);
    if (filter === 'completed') filtered = tasks.filter(t => t.completed);
    
    const sorted = filtered.sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
    );
    
    if (sorted.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">لا توجد مهام</p>';
        return;
    }
    
    container.innerHTML = sorted.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            >
            <div class="task-text">
                <h4>${task.title}</h4>
                <span class="task-subject">${subjectMap[task.subject] || 'بدون مادة'}</span>
                <span class="task-priority ${task.priority}">${getPriorityLabel(task.priority)}</span>
                <p style="margin-top: 5px; font-size: 0.9em; color: #999;">📅 ${formatDate(task.dueDate)}</p>
                ${task.description ? `<p style="margin-top: 5px; font-size: 0.9em;">${task.description}</p>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

function toggleTask(id) {
    const tasks = DataManager.getAll('tasks');
    const task = tasks.find(t => t.id === id);
    if (task) {
        DataManager.update('tasks', id, { completed: !task.completed });
        renderTasks();
        updateDashboard();
        updateStatistics();
    }
}

function deleteTask(id) {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        DataManager.delete('tasks', id);
        renderTasks();
    }
}

function getPriorityLabel(priority) {
    const labels = { low: 'منخفضة', medium: 'متوسطة', high: 'عالية' };
    return labels[priority] || priority;
}

document.getElementById('taskFilter').addEventListener('change', renderTasks);

// ===== NOTES MANAGEMENT =====
const noteModal = setupModal('noteModal', 'addNoteBtn', 'noteForm');

document.getElementById('noteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const note = {
        title: document.getElementById('noteTitle').value,
        subject: document.getElementById('noteSubject').value,
        content: document.getElementById('noteContent').value,
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('notes', note);
    renderNotes();
    noteModal.classList.remove('show');
    document.getElementById('noteForm').reset();
});

function renderNotes() {
    const notes = DataManager.getAll('notes');
    const container = document.getElementById('notesList');
    
    const subjects = DataManager.getAll('subjects');
    const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s.name]));
    
    if (notes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">لا توجد ملاحظات</p>';
        return;
    }
    
    container.innerHTML = notes.map(note => `
        <div class="note-card">
            <h4>${note.title}</h4>
            <p class="note-subject">📚 ${subjectMap[note.subject] || 'بدون مادة'}</p>
            <p>${note.content}</p>
            <small style="color: #999;">${formatDate(note.createdAt)}</small>
            <div class="note-actions">
                <button class="btn btn-danger" onclick="deleteNote(${note.id})">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteNote(id) {
    if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
        DataManager.delete('notes', id);
        renderNotes();
    }
}

// ===== EXAMS MANAGEMENT =====
const examModal = setupModal('examModal', 'addExamBtn', 'examForm');

document.getElementById('examForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const exam = {
        subject: document.getElementById('examSubject').value,
        date: document.getElementById('examDate').value,
        time: document.getElementById('examTime').value,
        location: document.getElementById('examLocation').value,
        duration: parseInt(document.getElementById('examDuration').value),
        weight: parseInt(document.getElementById('examWeight').value),
        notes: document.getElementById('examNotes').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    DataManager.add('exams', exam);
    renderExams();
    updateDashboard();
    examModal.classList.remove('show');
    document.getElementById('examForm').reset();
});

function renderExams() {
    const exams = DataManager.getAll('exams');
    const container = document.getElementById('examsList');
    
    if (exams.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">لا توجد امتحانات</p>';
        return;
    }
    
    const sorted = exams.sort((a, b) => 
        new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time)
    );
    
    container.innerHTML = sorted.map(exam => {
        const daysUntil = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
        const status = daysUntil < 0 ? 'انتهى' : (daysUntil === 0 ? 'اليوم' : `${daysUntil} يوم`);
        
        return `
            <div class="exam-item">
                <h4>${exam.subject}</h4>
                <div class="exam-details">
                    <div class="exam-detail">
                        <label>📅 التاريخ:</label>
                        <span>${formatDate(exam.date)}</span>
                    </div>
                    <div class="exam-detail">
                        <label>⏰ الوقت:</label>
                        <span>${exam.time}</span>
                    </div>
                    <div class="exam-detail">
                        <label>⏱️ المدة:</label>
                        <span>${exam.duration} دقيقة</span>
                    </div>
                    <div class="exam-detail">
                        <label>📍 المكان:</label>
                        <span>${exam.location || 'لم يحدد'}</span>
                    </div>
                    <div class="exam-detail">
                        <label>⭐ الوزن:</label>
                        <span>${exam.weight} درجة</span>
                    </div>
                    <div class="exam-detail">
                        <label>⏳ الحالة:</label>
                        <span>${status}</span>
                    </div>
                </div>
                ${exam.notes ? `<p><strong>ملاحظات:</strong> ${exam.notes}</p>` : ''}
                <div class="exam-actions">
                    <button class="btn btn-danger" onclick="deleteExam(${exam.id})">حذف</button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteExam(id) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
        DataManager.delete('exams', id);
        renderExams();
        updateDashboard();
    }
}

// ===== POMODORO TIMER =====
function setupTimer() {
    const startBtn = document.getElementById('timerStartBtn');
    const pauseBtn = document.getElementById('timerPauseBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const workInput = document.getElementById('workDuration');
    const breakInput = document.getElementById('breakDuration');
    
    startBtn.addEventListener('click', () => {
        if (!timerState.isRunning) {
            timerState.workDuration = parseInt(workInput.value) * 60;
            timerState.breakDuration = parseInt(breakInput.value) * 60;
            if (!timerState.isPaused) {
                timerState.timeLeft = timerState.workDuration;
            }
            timerState.isRunning = true;
            timerState.isPaused = false;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            workInput.disabled = true;
            breakInput.disabled = true;
            runTimer();
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        timerState.isRunning = false;
        timerState.isPaused = true;
        pauseBtn.disabled = true;
        startBtn.disabled = false;
        clearInterval(timerState.timerInterval);
    });
    
    resetBtn.addEventListener('click', () => {
        timerState.isRunning = false;
        timerState.isPaused = false;
        timerState.isBreakTime = false;
        timerState.timeLeft = timerState.workDuration;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        workInput.disabled = false;
        breakInput.disabled = false;
        clearInterval(timerState.timerInterval);
        updateTimerDisplay();
    });
}

function runTimer() {
    timerState.timerInterval = setInterval(() => {
        timerState.timeLeft--;
        updateTimerDisplay();
        
        if (timerState.timeLeft <= 0) {
            timerState.isBreakTime = !timerState.isBreakTime;
            timerState.timeLeft = timerState.isBreakTime ? 
                timerState.breakDuration : timerState.workDuration;
            
            // Save session to statistics
            const subject = document.getElementById('timerSubject').value;
            const duration = timerState.isBreakTime ? 
                timerState.workDuration / 60 : timerState.breakDuration / 60;
            recordStudySession(subject, duration);
            
            // Show notification
            showNotification(timerState.isBreakTime ? 'وقت الراحة!' : 'وقت المذاكرة!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerState.timeLeft / 60);
    const seconds = timerState.timeLeft % 60;
    document.getElementById('timerMinutes').textContent = 
        String(minutes).padStart(2, '0');
    document.getElementById('timerSeconds').textContent = 
        String(seconds).padStart(2, '0');
}

function recordStudySession(subject, duration) {
    const sessions = DataManager.getAll('studySessions');
    sessions.push({
        id: Date.now(),
        subject,
        duration,
        date: new Date().toISOString()
    });
    DataManager.save('studySessions', sessions);
    updateStatistics();
    updateDashboard();
}

function showNotification(message) {
    alert(message);
}

// ===== DASHBOARD =====
function updateDashboard() {
    // Update date
    const today = new Date();
    document.getElementById('todayDate').textContent = 
        today.toLocaleDateString('ar-EG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    // Update today's tasks
    const tasks = DataManager.getAll('tasks');
    const todayTasks = tasks.filter(t => t.dueDate === today.toISOString().split('T')[0]);
    const taskInfo = document.getElementById('todayTasks');
    taskInfo.textContent = `${todayTasks.length} مهام`;
    
    // Update active subjects
    const subjects = DataManager.getAll('subjects');
    const activeSubjectsEl = document.getElementById('activeSubjects');
    activeSubjectsEl.innerHTML = subjects.slice(0, 3).map(s => 
        `<li style="padding: 5px 0;"><span style="
            display: inline-block;
            width: 12px;
            height: 12px;
            background: ${s.color};
            border-radius: 50%;
            margin-left: 10px;
        "></span>${s.name}</li>`
    ).join('');
    
    if (subjects.length === 0) {
        activeSubjectsEl.innerHTML = '<li style="color: #999;">لا توجد مواد</li>';
    }
    
    // Update new users counter
    const newUsersCount = parseInt(localStorage.getItem('userCounter') || '0');
    const newUsersEl = document.getElementById('newUsersCount');
    if (newUsersEl) {
        newUsersEl.textContent = newUsersCount;
    }
    
    // Update statistics
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = tasks.length > 0 ? 
        Math.round((completedTasks / tasks.length) * 100) : 0;
    
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('completionRate').textContent = completionRate;
    
    // Calculate total hours
    const schedules = DataManager.getAll('schedules');
    let totalHours = 0;
    schedules.forEach(s => {
        const start = new Date('2000-01-01T' + s.startTime);
        const end = new Date('2000-01-01T' + s.endTime);
        totalHours += (end - start) / (1000 * 60 * 60);
    });
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    
    // Next session
    const now = new Date();
    const upcomingSessions = schedules
        .filter(s => new Date(s.date + 'T' + s.startTime) > now)
        .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));
    
    const nextSession = document.getElementById('nextSession');
    if (upcomingSessions.length > 0) {
        const session = upcomingSessions[0];
        nextSession.innerHTML = `
            <strong>${session.subject}</strong><br>
            ${formatDate(session.date)} في ${session.startTime}
        `;
    } else {
        nextSession.textContent = 'لا توجد جلسات مقررة';
    }
}

// ===== STATISTICS =====
function updateStatistics() {
    const sessions = DataManager.getAll('studySessions');
    const subjects = DataManager.getAll('subjects');
    const tasks = DataManager.getAll('tasks');
    const exams = DataManager.getAll('exams');
    
    // Calculate totals
    const totalHours = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = tasks.length > 0 ? 
        Math.round((completedTasks / tasks.length) * 100) : 0;
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;
    
    // Update stat cards
    document.getElementById('totalStudyHours').textContent = totalHours.toFixed(1);
    document.getElementById('statsCompletedTasks').textContent = completedTasks;
    document.getElementById('statsCompletionRate').textContent = completionRate + '%';
    document.getElementById('upcomingExams').textContent = upcomingExams;
    
    // Update subject stats
    const subjectStats = {};
    sessions.forEach(s => {
        if (s.subject) {
            subjectStats[s.subject] = (subjectStats[s.subject] || 0) + (s.duration || 0);
        }
    });
    
    const statsContainer = document.getElementById('subjectStats');
    if (Object.keys(subjectStats).length === 0) {
        statsContainer.innerHTML = '<p style="text-align: center; color: #999;">لا توجد بيانات إحصائية بعد</p>';
        return;
    }
    
    const maxHours = Math.max(...Object.values(subjectStats));
    
    statsContainer.innerHTML = Object.entries(subjectStats).map(([subjectId, hours]) => {
        const subject = subjects.find(s => s.id == subjectId);
        const percentage = (hours / maxHours) * 100;
        const subjectName = subject ? subject.name : 'غير محدد';
        
        return `
            <div class="stat-row">
                <div class="stat-label">${subjectName}</div>
                <div class="stat-bar">
                    <div class="stat-bar-fill" style="width: ${percentage}%">
                        ${hours.toFixed(1)}h
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('ar-EG', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function handleFormSubmit(formId) {
    // Handled by individual form listeners
}
