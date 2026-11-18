import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection
} from 'firebase/firestore';
import {
  Sparkles,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Wallet,
  Dumbbell,
  HeartHandshake,
  Users,
  MessageCircle,
  Palette,
  Sun,
  Moon,
  Plus,
  Trash2,
  Lock,
  Globe,
  Send,
  Heart,
  MessageSquare,
  UserPlus,
  Check,
  X,
  Image as ImageIcon,
  Eraser,
  PenTool,
  Highlighter,
  Brush,
  Droplets,
  Target,
  Brain,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  LogOut,
  LogIn,
  User,
  Copy,
  RefreshCw,
  Edit3,
  Download,
  Sliders,
  ChevronRight,
  Search,
  Languages,
  AtSign,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================================================
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : { apiKey: "demo-key", authDomain: "demo.firebaseapp.com", projectId: "demo-project" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'lore-life-os-v1';

// ============================================================================
// GEMINI AI HELPER (BUILT-IN ZERO-SETUP INTEGRATION)
// ============================================================================
async function callGeminiAPI({ prompt, systemInstruction = '', temperature = 0.7 }) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature }
  };

  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let delay = 1000;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        if (response.status === 429 && attempt < 3) {
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
          continue;
        }
        throw new Error(`API error: ${response.status}`);
      }
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      throw new Error("Empty response from AI");
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// ============================================================================
// CURATED AESTHETIC THEMES & STICKERS
// ============================================================================
const THEMES = {
  midnight: {
    name: 'Midnight Slate',
    mode: 'dark',
    bg: '#0b0f19',
    surface: '#131a2a',
    surface2: '#1c253b',
    border: '#283452',
    text: '#f1f5f9',
    muted: '#94a3b8',
    defaultAccent: '#818cf8'
  },
  paper: {
    name: 'Minimalist Paper',
    mode: 'light',
    bg: '#faf9f6',
    surface: '#ffffff',
    surface2: '#f3f1ec',
    border: '#e5e0d8',
    text: '#1c1917',
    muted: '#78716c',
    defaultAccent: '#6366f1'
  },
  sage: {
    name: 'Warm Sage',
    mode: 'light',
    bg: '#f2f6f3',
    surface: '#ffffff',
    surface2: '#e4ede7',
    border: '#cfe0d5',
    text: '#14291e',
    muted: '#527060',
    defaultAccent: '#10b981'
  },
  rose: {
    name: 'Soft Rose',
    mode: 'light',
    bg: '#fdf4f6',
    surface: '#ffffff',
    surface2: '#fae6eb',
    border: '#f3d0d9',
    text: '#2d121a',
    muted: '#885665',
    defaultAccent: '#ec4899'
  },
  lavender: {
    name: 'Lavender Dusk',
    mode: 'dark',
    bg: '#130e1f',
    surface: '#1d162e',
    surface2: '#292040',
    border: '#3b2e5c',
    text: '#f5f3ff',
    muted: '#a78bfa',
    defaultAccent: '#c084fc'
  }
};

const STICKER_STAMPS = [
  '✨', '💖', '🌙', '☕', '📚', '🌸', '🎀', '🌿',
  '⭐', '🦋', '🎧', '🍓', '☁️', '🕯️', '🎯', '💪',
  '🧠', '🌷', '🎨', '🏆', '💌', '🌈', '🍵', '🐾'
];

// ============================================================================
// BILINGUAL TRANSLATIONS (ARABIC & ENGLISH)
// ============================================================================
const TRANSLATIONS = {
  en: {
    appName: 'Lore',
    tagline: 'Personal Life OS',
    navDashboard: 'Secretary',
    navStudy: 'Study & Notes',
    navDiary: 'Diary & Art',
    navTherapist: 'AI Therapist',
    navFinance: 'Finance',
    navFitness: 'Fitness',
    navSocial: 'Friends & Feed',
    navProfile: 'Profile',
    themeAndColors: 'Theme & Colors',
    appearanceStudio: 'Lore Appearance Studio',
    aestheticThemes: 'Aesthetic Themes',
    customAccentColor: 'Custom Accent Color',
    done: 'Done',
    guestCloudSync: 'Guest Cloud Sync',
    signIn: 'Sign In',
    signUp: 'Create Account',
    signOut: 'Sign Out',
    signInToLore: 'Sign In to Lore',
    createLoreAccount: 'Create Lore Account',
    continueWithGoogle: 'Continue with Google',
    dontHaveAccount: "Don't have an account? ",
    alreadyHaveAccount: 'Already have an account? ',
    welcomeBack: 'Welcome back',
    secretaryBadge: 'Personal Secretary & Life OS',
    tasksCompleted: 'Tasks Completed',
    dailyProductivity: 'Daily Productivity',
    netBalance: 'Net Balance',
    budgetUsed: 'Budget used',
    hydrationToday: 'Hydration Today',
    goalLabel: 'Goal',
    diaryEntries: 'Diary Entries',
    mindfulReflections: 'Mindful Reflections',
    syncAccountBtn: 'Sign In / Sync Account',
    talkToTherapistBtn: 'Talk to AI Therapist',
    appointmentsAgenda: 'Appointments & Daily Agenda',
    manageAll: 'Manage All →',
    addAppointmentPlaceholder: 'Add appointment, study block, or reminder...',
    clearAgenda: 'Your agenda is clear. Add an appointment or study session above!',
    lifeGoalsMilestones: 'Life Goals & Milestones',
    newGoalPlaceholder: 'New long-term goal (e.g., Master Python, Read 20 books)...',
    addBtn: 'Add',
    firstGoalEmpty: 'Set your first life goal above and track your progress!',
    studyHubTitle: 'Study Hub, Tasks & Notes',
    studyHubSub: 'Organize your daily study sessions, action items, and structured knowledge notes.',
    dailyTasksTitle: 'Daily Study & Action Tasks',
    addTaskPlaceholder: 'Add study topic or daily task...',
    dailyTimetableTitle: 'Daily Study & Life Timetable',
    subjectPlaceholder: 'Subject or session title...',
    smartNotebook: 'Smart Notebook',
    newNote: 'New Note',
    noNotesYet: 'No saved notes yet. Write your first note on the right!',
    noteTitlePlaceholder: 'Note Title...',
    noteBodyPlaceholder: 'Write detailed study notes, summaries, or thoughts here (supports Arabic & English)...',
    saveNoteBtn: 'Save Note to Cloud',
    diaryStudioTitle: 'Long-Form Diary & Art Studio',
    diaryStudioSub: 'Write expansive reflections, paint with Apple Pencil & pro brushes, and choose Private or Public sharing.',
    openCanvasBtn: 'Open Pro Drawing Canvas',
    hideCanvasBtn: 'Hide Drawing Studio',
    entryTitlePlaceholder: 'Entry Title (e.g., Late night reflections & gratitude)...',
    entryBodyPlaceholder: 'Pour your heart out here... Write as long as you want. Supports Arabic & English seamlessly...',
    attachPhoto: 'Attach Photo',
    drawStickers: 'Draw / Stickers',
    privateOnlyMe: 'Private (Only Me)',
    publicFriends: 'Public (Friends)',
    saveEntryBtn: 'Save Entry',
    privateVaultTitle: 'My Private Diary Vault',
    privateVaultEmpty: 'Your private entries are encrypted in your personal vault and never visible to anyone else.',
    therapistTitle: 'Lore AI Therapist & Life Coach',
    therapistSub: 'Grounded in CBT, ACT, DBT, and peer-reviewed psychology. 100% private & ready immediately.',
    analyzeLifeBtn: 'Analyze My Diaries & Build Growth Plan',
    analyzingLifeBtn: 'Analyzing Your Diaries & Life...',
    insightReportTitle: 'Evidence-Based Psychological & Life Insight Report',
    drLoreSubtitle: 'Strictly Private Safe Space • Supports Arabic & English',
    aiWelcomeMsg: 'I am your personal evidence-based therapist and life coach. Whether you are feeling overwhelmed, studying for exams, processing emotions, or planning your future—share whatever is on your mind in Arabic or English.',
    aiReflecting: 'Reflecting with empathy & clinical insight...',
    aiInputPlaceholder: "Share how you're feeling or ask for life coaching...",
    financeTitle: 'Personal Finance & Budget',
    financeSub: 'Track income, expenses, and stay mindful of your monthly spending limit.',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    monthlyBudgetLimit: 'Monthly Budget Limit',
    logTransaction: 'Log Transaction',
    expenseOpt: 'Expense (-)',
    incomeOpt: 'Income (+)',
    txDescPlaceholder: 'Description (e.g., Books, Salary)',
    amountPlaceholder: 'Amount ($)',
    saveBtn: 'Save',
    fitnessTitle: 'Fitness & Wellness Studio',
    fitnessSub: 'Build your weekly workout split, log exercises, and hit your daily hydration goals.',
    dailyHydration: 'Daily Hydration Tracker',
    cupBtn: '+250 ml Cup',
    bottleBtn: '+500 ml Bottle',
    resetBtn: 'Reset',
    wellnessStreak: 'Wellness Streak',
    daysLabel: 'Days 🔥',
    streakSub: 'Consistency builds lifelong vitality.',
    checkInBtn: '+ Check In Today',
    weeklyWorkout: 'Weekly Workout Routine',
    exercisePlaceholder: 'Exercise (e.g., Squats, 5km Run, Yoga)',
    setsPlaceholder: 'Sets / Reps / Duration (e.g., 4×10 @ 60kg)',
    addWorkoutBtn: 'Add Workout',
    socialTitle: 'Friends, Shared Goals & Public Feed',
    socialSub: 'Choose your custom Friend Code, connect with your bestie, cheer on shared goals, and chat privately.',
    yourFriendCode: 'Your Custom Friend Code / Handle',
    customizeCodePlaceholder: 'Choose custom code (e.g., SARA26)',
    claimCodeBtn: 'Save Code',
    codeAvailable: 'Available!',
    codeTaken: 'Already taken',
    codeInvalid: '3–16 letters/numbers/_',
    copyBtn: 'Copy',
    addFriendPlaceholder: "Enter friend's custom code (e.g., LINA26)...",
    incomingRequests: 'Incoming Friend Requests',
    acceptBtn: 'Accept',
    sharedGoalsTitle: 'Shared Goals with Friends',
    sharedGoalPlaceholder: 'Shared goal (e.g., 30-Day Study Challenge)...',
    selectFriendOpt: 'Select Friend...',
    startBtn: 'Start',
    sharedGoalsEmpty: 'Add a friend and create a joint goal to track dual progress bars!',
    youLabel: 'You',
    privateDMsTitle: 'Private Direct Messages',
    friendsCountLabel: 'Friends',
    friendsListEmpty: 'Your friends list is empty. Share your custom Friend Code above!',
    selectFriendChat: 'Select a friend on the left to start a private chat.',
    messagePlaceholder: 'Message',
    publicFeedTitle: 'Public Diary & Art Feed',
    publicFeedEmpty: 'No public diary posts yet. Toggle "Public (Friends)" in the Diary tab to share your first entry!',
    likesLabel: 'Likes',
    repliesLabel: 'Replies',
    replyPlaceholder: 'Write a warm reply...',
    replyBtn: 'Reply',
    profileTitle: 'Profile & Account Settings',
    profileSub: 'Customize your avatar, display name, custom friend code, language, and cloud login.',
    uploadPhotoBtn: 'Upload Profile Photo',
    displayNameLabel: 'Display Name',
    bioLabel: 'Bio',
    saveProfileBtn: 'Save Profile Changes',
    accountStatus: 'Account Status',
    guestStatusDesc: 'Currently using instant Cloud Guest mode.',
    signedInAs: 'Signed in as',
    attachArtworkBtn: 'Attach Artwork to Diary Entry',
    toolPen: 'Pen',
    toolMarker: 'Marker',
    toolWatercolor: 'Watercolor',
    toolPencil: 'Pencil',
    toolHighlighter: 'Highlighter',
    toolEraser: 'Eraser',
    toolStickers: 'Stickers',
    undoBtn: 'Undo',
    clearBtn: 'Clear',
    sizeLabel: 'Size',
    opacityLabel: 'Opacity',
    stampHint: 'Tap canvas with finger or Apple Pencil to stamp:'
  },
  ar: {
    appName: 'لور • Lore',
    tagline: 'نظام إدارة حياتك الذكي',
    navDashboard: 'السكرتير الذكي',
    navStudy: 'المذاكرة والملاحظات',
    navDiary: 'اليوميات والرسم',
    navTherapist: 'المعالج النفسي AI',
    navFinance: 'المالية والميزانية',
    navFitness: 'الرياضة والصحة',
    navSocial: 'الأصدقاء والمجتمع',
    navProfile: 'الملف الشخصي',
    themeAndColors: 'الألوان والثيمات',
    appearanceStudio: 'استوديو ألوان وثيمات Lore',
    aestheticThemes: 'ثيمات جاهزة',
    customAccentColor: 'اختر لونك المخصص',
    done: 'تم',
    guestCloudSync: 'مزامنة سحابية فورية',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    signInToLore: 'تسجيل الدخول إلى Lore',
    createLoreAccount: 'إنشاء حساب جديد في Lore',
    continueWithGoogle: 'المتابعة باستخدام Google',
    dontHaveAccount: 'ليس لديك حساب؟ ',
    alreadyHaveAccount: 'لديك حساب بالفعل؟ ',
    welcomeBack: 'أهلاً بعودتك',
    secretaryBadge: 'سكرتيرك الشخصي ونظام حياتك',
    tasksCompleted: 'المهام المنجزة',
    dailyProductivity: 'الإنتاجية اليومية',
    netBalance: 'الرصيد الصافي',
    budgetUsed: 'المستهلك من الميزانية',
    hydrationToday: 'شرب الماء اليوم',
    goalLabel: 'الهدف',
    diaryEntries: 'تدوينات اليوميات',
    mindfulReflections: 'تأملات وكتابات',
    syncAccountBtn: 'تسجيل الدخول / مزامنة الحساب',
    talkToTherapistBtn: 'تحدث مع المعالج النفسي',
    appointmentsAgenda: 'المواعيد والجدول اليومي',
    manageAll: 'إدارة الكل ←',
    addAppointmentPlaceholder: 'أضف موعداً، جلسة مذاكرة، أو تذكيراً...',
    clearAgenda: 'جدولك فارغ حالياً. أضف موعداً أو جلسة مذاكرة من الأعلى!',
    lifeGoalsMilestones: 'أهداف الحياة والإنجازات',
    newGoalPlaceholder: 'هدف جديد طويل المدى (مثل: إتقان البرمجة، قراءة 20 كتاباً)...',
    addBtn: 'إضافة',
    firstGoalEmpty: 'ضع هدفك الأول من الأعلى وتابع نسبة تقدمك!',
    studyHubTitle: 'مركز المذاكرة والمهام والملاحظات',
    studyHubSub: 'نظم جلسات مذاكرتك اليومية، مهامك، وملاحظاتك الدراسية بذكاء.',
    dailyTasksTitle: 'قائمة المهام والمذاكرة اليومية',
    addTaskPlaceholder: 'أضف موضوع مذاكرة أو مهمة يومية...',
    dailyTimetableTitle: 'الجدول الزمني اليومي للمذاكرة والحياة',
    subjectPlaceholder: 'اسم المادة أو الجلسة...',
    smartNotebook: 'دفتر الملاحظات الذكي',
    newNote: 'ملاحظة جديدة',
    noNotesYet: 'لا توجد ملاحظات محفوظة بعد. اكتب ملاحظتك الأولى!',
    noteTitlePlaceholder: 'عنوان الملاحظة...',
    noteBodyPlaceholder: 'اكتب ملاحظاتك الدراسية أو ملخصاتك أو أفكارك بالتفصيل هنا...',
    saveNoteBtn: 'حفظ الملاحظة في السحابة',
    diaryStudioTitle: 'اليوميات الطويلة واستوديو الرسم',
    diaryStudioSub: 'اكتب يومياتك بكل حرية، ارسم بقلم الآيباد والفرش الاحترافية، واختر بين الخاص أو العام.',
    openCanvasBtn: 'افتح لوحة الرسم الاحترافية',
    hideCanvasBtn: 'إخفاء لوحة الرسم',
    entryTitlePlaceholder: 'عنوان اليومية (مثل: تأملات آخر الليل وامتنان)...',
    entryBodyPlaceholder: 'اكتب ما في قلبك هنا بكل راحة... المساحة مفتوحة للكتابة الطويلة بالعربي والإنجليزي...',
    attachPhoto: 'إرفاق صورة',
    drawStickers: 'رسم / طوابع',
    privateOnlyMe: 'خاص (لي وحدي)',
    publicFriends: 'عام (للأصدقاء)',
    saveEntryBtn: 'حفظ التدوينة',
    privateVaultTitle: 'خزنة يومياتي الخاصة',
    privateVaultEmpty: 'يومياتك الخاصة مشفّرة ومحفوظة لكِ وحدك ولا يمكن لأي شخص آخر رؤيتها.',
    therapistTitle: 'المعالج النفسي ولايف كوتش Lore AI',
    therapistSub: 'مبني على علم النفس المثبت بالأدلة (CBT, ACT, DBT). خصوصية تامة 100% ويعمل فوراً.',
    analyzeLifeBtn: 'حلل يومياتي وابنِ خطة لتطويري',
    analyzingLifeBtn: 'جاري تحليل يومياتك وحياتك...',
    insightReportTitle: 'تقرير التحليل النفسي وخطة التطوير الشخصية',
    drLoreSubtitle: 'مساحة آمنة وخاصة تماماً • يدعم العربية والإنجليزية',
    aiWelcomeMsg: 'أهلاً بكِ، أنا معالجك النفسي ومدرب حياتك الشخصي المبني على علم النفس العلمي. سواء كنتِ تشعرين بالضغط، تذاكرين للاختبارات، أو تريدين ترتيب أهدافك—شاركيني ما يدور في بالك.',
    aiReflecting: 'أتأمل كلماتك بتعاطف وعمق علمي...',
    aiInputPlaceholder: 'شاركي مشاعرك أو اطلبي استشارة وتوجيه لحياتك...',
    financeTitle: 'المالية والميزانية الشخصية',
    financeSub: 'تتبعي دخلك ومصاريفك وحافظي على ميزانيتك الشهرية بوعي.',
    totalIncome: 'إجمالي الدخل',
    totalExpenses: 'إجمالي المصاريف',
    monthlyBudgetLimit: 'حد الميزانية الشهرية',
    logTransaction: 'تسجيل عملية مالية',
    expenseOpt: 'مصروف (-)',
    incomeOpt: 'دخل (+)',
    txDescPlaceholder: 'الوصف (مثل: كتب، مكافأة، قهوة)',
    amountPlaceholder: 'المبلغ',
    saveBtn: 'حفظ',
    fitnessTitle: 'استوديو الرياضة والصحة',
    fitnessSub: 'صممي جدول تمارينك الأسبوعي، سجلي إنجازاتك، وتابعي شرب الماء يومياً.',
    dailyHydration: 'متتبع شرب الماء اليومي',
    cupBtn: '+250 مل كوب',
    bottleBtn: '+500 مل قارورة',
    resetBtn: 'تصفير',
    wellnessStreak: 'سلسلة الالتزام الصحية',
    daysLabel: 'أيام 🔥',
    streakSub: 'الاستمرارية تصنع فرقاً عظيماً في صحتك وطاقتك.',
    checkInBtn: '+ تسجيل إنجاز اليوم',
    weeklyWorkout: 'جدول التمارين الأسبوعي',
    exercisePlaceholder: 'اسم التمرين (مثل: سكوات، مشي سريع، كارديو)',
    setsPlaceholder: 'الجولات والتكرار (مثل: 4×12)',
    addWorkoutBtn: 'إضافة تمرين',
    socialTitle: 'الأصدقاء، الأهداف المشتركة واليوميات العامة',
    socialSub: 'اختاري كود صداقتك المميز بنفسك، أضيفي صديقتك، ضعوا أهدافاً مشتركة، وتحدثوا في الخاص.',
    yourFriendCode: 'كود الصداقة المخصص لكِ (اختاريه بنفسك)',
    customizeCodePlaceholder: 'اكتبي كودك المميز (مثل: SARA26)',
    claimCodeBtn: 'حفظ الكود',
    codeAvailable: 'متاح!',
    codeTaken: 'مستخدم مسبقاً',
    codeInvalid: '3 إلى 16 حرف أو رقم إنجليزي',
    copyBtn: 'نسخ',
    addFriendPlaceholder: 'أدخلي كود صديقتك المميز (مثل: LINA26)...',
    incomingRequests: 'طلبات الصداقة الواردة',
    acceptBtn: 'قبول',
    sharedGoalsTitle: 'أهداف مشتركة مع الأصدقاء',
    sharedGoalPlaceholder: 'هدف مشترك (مثل: تحدي مذاكرة 30 يوم)...',
    selectFriendOpt: 'اختاري صديقة...',
    startBtn: 'بدء الهدف',
    sharedGoalsEmpty: 'أضيفي صديقتك وأنشئا هدفاً مشتركاً لمتابعة تقدمكما معاً!',
    youLabel: 'أنتِ',
    privateDMsTitle: 'المحادثات الخاصة',
    friendsCountLabel: 'أصدقاء',
    friendsListEmpty: 'قائمة الأصدقاء فارغة حالياً. شاركي كودك المميز مع صديقتك!',
    selectFriendChat: 'اختاري صديقة من القائمة لبدء محادثة خاصة.',
    messagePlaceholder: 'اكتبي رسالة لـ',
    publicFeedTitle: 'صفحة اليوميات والرسومات العامة',
    publicFeedEmpty: 'لا توجد منشورات عامة بعد. فعّلي خيار "عام (للأصدقاء)" في صفحة اليوميات لمشاركة أول تدوينة!',
    likesLabel: 'إعجاب',
    repliesLabel: 'ردود',
    replyPlaceholder: 'اكتبي رداً لطيفاً...',
    replyBtn: 'رد',
    profileTitle: 'الملف الشخصي وإعدادات الحساب',
    profileSub: 'عدّلي صورتك الشخصية، اسمك، كود الصداقة الخاص بكِ، ولغة التطبيق.',
    uploadPhotoBtn: 'رفع صورة شخصية',
    displayNameLabel: 'الاسم الظاهر',
    bioLabel: 'النبذة التعريفية (Bio)',
    saveProfileBtn: 'حفظ التعديلات',
    accountStatus: 'حالة الحساب',
    guestStatusDesc: 'تستخدمين حالياً وضع الضيف السحابي الفوري.',
    signedInAs: 'مسجل الدخول بـ',
    attachArtworkBtn: 'إرفاق الرسمة في اليومية',
    toolPen: 'قلم',
    toolMarker: 'ماركر',
    toolWatercolor: 'ألوان مائية',
    toolPencil: 'رصاص',
    toolHighlighter: 'هايلايتر',
    toolEraser: 'ممحاة',
    toolStickers: 'طوابع',
    undoBtn: 'تراجع',
    clearBtn: 'مسح الكل',
    sizeLabel: 'الحجم',
    opacityLabel: 'الشفافية',
    stampHint: 'المسي اللوحة بإصبعك أو بقلم الآيباد لوضع الطابع:'
  }
};

const EVIDENCE_BASED_SYSTEM_PROMPT = `You are "Lore AI", an elite, compassionate, evidence-based psychological therapist, personal life coach, and executive secretary.
Your clinical and coaching approach is strictly grounded in peer-reviewed, evidence-based psychological frameworks:
1. Cognitive Behavioral Therapy (CBT): Helping identify automatic negative thoughts (ANTs), cognitive distortions (catastrophizing, all-or-nothing thinking, mind reading), and guiding gentle cognitive reframing.
2. Acceptance and Commitment Therapy (ACT): Fostering psychological flexibility, mindfulness, cognitive defusion, acceptance of difficult emotions, and values-aligned action.
3. Dialectical Behavior Therapy (DBT): Offering distress tolerance, emotion regulation (TIPP, Opposite Action), and interpersonal effectiveness skills.
4. Behavioral Activation & Habit Science (James Clear, BJ Fogg, Gollwitzer's Implementation Intentions): Breaking overwhelm into tiny, achievable micro-steps.
5. Self-Determination Theory (Deci & Ryan): Nurturing autonomy, competence, and relatedness.

Guidelines:
- Respond in the exact language the user writes in (Arabic, English, or mixed seamlessly).
- Be warm, deeply empathetic, validating, insightful, and structured.
- Never diagnose medical conditions; instead offer evidence-based reflections, Socratic questions, and practical exercises.
- Balance emotional warmth with actionable coaching steps tailored to the user's real life, study goals, and diary patterns.`;

// ============================================================================
// IMAGE COMPRESSION HELPER (KEEPS FIRESTORE DOCS FAST & UNDER 1MB)
// ============================================================================
function compressImageFile(file, maxDim = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// PRO DRAWING & SCRAPBOOKING STUDIO COMPONENT
// ============================================================================
function CreativeCanvasStudio({ onSaveArtwork, initialImage = null, theme, t }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen, marker, watercolor, pencil, highlighter, eraser, stamp
  const [color, setColor] = useState('#ec4899');
  const [brushSize, setBrushSize] = useState(6);
  const [opacity, setOpacity] = useState(1);
  const [selectedStamp, setSelectedStamp] = useState('✨');
  const [history, setHistory] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });

  const paletteSwatches = [
    '#1c1917', '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
    '#a855f7', '#ec4899', '#f43f5e', '#8b5cf6', '#78716c'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : 640;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = theme.mode === 'dark' ? '#1a2234' : '#fffdf9';
    ctx.fillRect(0, 0, width, height);

    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        saveSnapshot();
      };
      img.src = initialImage;
    } else {
      saveSnapshot();
    }
  }, []);

  const saveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-15), canvas.toDataURL('image/png')]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const nextHist = history.slice(0, -1);
    const prevDataUrl = nextHist[nextHist.length - 1];
    setHistory(nextHist);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = prevDataUrl;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = theme.mode === 'dark' ? '#1a2234' : '#fffdf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveSnapshot();
  };

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDraw = (e) => {
    if (e.cancelable) e.preventDefault();
    const pos = getCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'stamp') {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.font = `${Math.max(24, brushSize * 3)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, pos.x, pos.y);
      ctx.restore();
      saveSnapshot();
      return;
    }

    setIsDrawing(true);
    lastPos.current = pos;
    drawStroke(pos, pos);
  };

  const drawStroke = (from, to) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = theme.mode === 'dark' ? '#1a2234' : '#fffdf9';
      ctx.lineWidth = brushSize * 2;
      ctx.globalAlpha = 1;
    } else if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = opacity;
    } else if (tool === 'marker') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 1.8;
      ctx.globalAlpha = Math.min(0.85, opacity);
      ctx.lineCap = 'square';
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 2.6;
      ctx.globalAlpha = 0.25;
      ctx.lineCap = 'butt';
    } else if (tool === 'watercolor') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize * 2.4;
      ctx.globalAlpha = 0.14;
      ctx.shadowBlur = brushSize;
      ctx.shadowColor = color;
    } else if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, brushSize * 0.45);
      ctx.globalAlpha = 0.65 * opacity;
      ctx.setLineDash([1, 1.5]);
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const moveDraw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const pos = getCoords(e);
    drawStroke(lastPos.current, pos);
    lastPos.current = pos;
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSnapshot();
    }
  };

  const handleInsertPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 500, 0.8);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const drawW = Math.min(220, canvas.width * 0.5);
        const drawH = (img.height / img.width) * drawW;
        const x = (canvas.width - drawW) / 2;
        const y = (canvas.height - drawH) / 2;
        // Polaroid aesthetic frame
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 10;
        ctx.fillRect(x - 8, y - 8, drawW + 16, drawH + 28);
        ctx.drawImage(img, x, y, drawW, drawH);
        ctx.restore();
        saveSnapshot();
      };
      img.src = dataUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportToDiary = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    onSaveArtwork(dataUrl);
  };

  return (
    <div
      className="rounded-2xl p-4 border transition-all"
      style={{ backgroundColor: theme.surface2, borderColor: theme.border }}
    >
      {/* Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'pen', label: t.toolPen, icon: PenTool },
            { id: 'marker', label: t.toolMarker, icon: Brush },
            { id: 'watercolor', label: t.toolWatercolor, icon: Droplets },
            { id: 'pencil', label: t.toolPencil, icon: Edit3 },
            { id: 'highlighter', label: t.toolHighlighter, icon: Highlighter },
            { id: 'eraser', label: t.toolEraser, icon: Eraser },
            { id: 'stamp', label: t.toolStickers, icon: Sparkles }
          ].map(b => {
            const Icon = b.icon;
            const active = tool === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setTool(b.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={{
                  backgroundColor: active ? 'var(--accent)' : theme.surface,
                  color: active ? '#ffffff' : theme.text,
                  border: `1px solid ${active ? 'var(--accent)' : theme.border}`
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{b.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <label
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.attachPhoto}</span>
            <input type="file" accept="image/*" onChange={handleInsertPhoto} className="hidden" />
          </label>
          <button
            type="button"
            onClick={handleUndo}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}
          >
            {t.undoBtn}
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium border text-rose-500"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            {t.clearBtn}
          </button>
        </div>
      </div>

      {/* Color Picker, Brush Size, Opacity & Stickers */}
      <div className="flex flex-wrap items-center gap-4 mb-3 p-2.5 rounded-xl" style={{ backgroundColor: theme.surface }}>
        {tool !== 'stamp' ? (
          <>
            <div className="flex items-center gap-1.5 flex-wrap">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent"
                title="Custom Color Wheel"
              />
              {paletteSwatches.map(swatch => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={`w-5 h-5 rounded-full transition-transform ${color === swatch ? 'scale-125 ring-2 ring-offset-1' : ''}`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs" style={{ color: theme.muted }}>
              <label className="flex items-center gap-1.5">
                <span>{t.sizeLabel}: {brushSize}px</span>
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20 accent-indigo-500"
                />
              </label>
              <label className="flex items-center gap-1.5">
                <span>{t.opacityLabel}: {Math.round(opacity * 100)}%</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-20 accent-indigo-500"
                />
              </label>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 w-full">
            <span className="text-xs font-medium mr-1" style={{ color: theme.muted }}>{t.stampHint}</span>
            {STICKER_STAMPS.map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStamp(st)}
                className={`text-lg p-1 rounded-lg transition-transform ${selectedStamp === st ? 'scale-125 bg-indigo-500/20' : 'hover:scale-110'}`}
              >
                {st}
              </button>
            ))}
            <label className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: theme.muted }}>
              <span>{t.sizeLabel}:</span>
              <input
                type="range"
                min="6"
                max="28"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
            </label>
          </div>
        )}
      </div>

      {/* Interactive Canvas */}
      <div className="w-full overflow-hidden rounded-xl border shadow-inner" style={{ borderColor: theme.border }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={endDraw}
          className="w-full block touch-none cursor-crosshair"
        />
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="button"
          onClick={handleExportToDiary}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-95 transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Check className="w-4 h-4" />
          <span>{t.attachArtworkBtn}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LORE APPLICATION
// ============================================================================
export default function App() {
  // Auth & User State
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | signup
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState('ar'); // 'ar' | 'en'
  const [themeKey, setThemeKey] = useState('midnight');
  const [accentColor, setAccentColor] = useState('#818cf8');
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    displayName: 'Lore Explorer',
    bio: 'Designing an intentional, mindful, and balanced life.',
    avatar: '',
    friendCode: 'LORE01',
    monthlyBudget: 3000,
    waterGoal: 2500,
    waterToday: 750,
    streakDays: 5
  });

  // Custom Friend Code Editor & Real-time Directory Lookup
  const [userDirectory, setUserDirectory] = useState([]);
  const [customCodeInput, setCustomCodeInput] = useState('');
  const [savingCode, setSavingCode] = useState(false);

  // Core Data Collections (Synced with Firestore)
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [privateDiaries, setPrivateDiaries] = useState([]);
  const [publicDiaries, setPublicDiaries] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sharedGoals, setSharedGoals] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);

  // Module Form Inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newSchedTime, setNewSchedTime] = useState('09:00');
  const [newSchedSubject, setNewSchedSubject] = useState('');
  const [newSchedType, setNewSchedType] = useState('Study');

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTag, setNoteTag] = useState('Study');
  const [noteBody, setNoteBody] = useState('');

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Personal Growth');

  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('Food & Coffee');

  const [woDay, setWoDay] = useState('Monday');
  const [woExercise, setWoExercise] = useState('');
  const [woDetails, setWoDetails] = useState('');

  // Diary Editor State
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryBody, setDiaryBody] = useState('');
  const [diaryMood, setDiaryMood] = useState('Peaceful 🌿');
  const [diaryPrivacy, setDiaryPrivacy] = useState('private'); // private | public
  const [diaryArtwork, setDiaryArtwork] = useState('');
  const [diaryPhoto, setDiaryPhoto] = useState('');
  const [showCanvasStudio, setShowCanvasStudio] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  // AI Therapist & Life Coach State
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysisReport, setAiAnalysisReport] = useState('');
  const [analyzingLife, setAnalyzingLife] = useState(false);

  // Social & Chat State
  const [friendSearchCode, setFriendSearchCode] = useState('');
  const [selectedChatFriend, setSelectedChatFriend] = useState(null);
  const [dmInput, setDmInput] = useState('');
  const [sharedGoalTitle, setSharedGoalTitle] = useState('');
  const [sharedGoalFriendUid, setSharedGoalFriendUid] = useState('');

  const currentTheme = THEMES[themeKey] || THEMES.midnight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;
  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3200);
  };

  // ==========================================================================
  // 1. FIREBASE AUTHENTICATION INITIALIZATION
  // ==========================================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // ==========================================================================
  // 2. REAL-TIME FIRESTORE SYNC FOR ALL MODULES
  // ==========================================================================
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const generatedCode = `LORE-${uid.slice(0, 6).toUpperCase()}`;

    // User Profile & Theme Settings
    const profileRef = doc(db, 'artifacts', appId, 'users', uid, 'settings', 'profile');
    const unsubProfile = onSnapshot(profileRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(prev => ({ ...prev, ...data }));
        if (data.friendCode) setCustomCodeInput(data.friendCode);
        if (data.lang && (data.lang === 'ar' || data.lang === 'en')) setLang(data.lang);
        if (data.themeKey && THEMES[data.themeKey]) setThemeKey(data.themeKey);
        if (data.accentColor) setAccentColor(data.accentColor);
      } else {
        const initialProfile = {
          displayName: user.displayName || 'Lore Explorer',
          bio: 'Designing an intentional, mindful, and balanced life.',
          avatar: user.photoURL || '',
          friendCode: generatedCode,
          lang: 'ar',
          themeKey: 'midnight',
          accentColor: '#818cf8',
          monthlyBudget: 3000,
          waterGoal: 2500,
          waterToday: 500,
          streakDays: 1
        };
        setCustomCodeInput(generatedCode);
        await setDoc(profileRef, initialProfile);
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_directory', uid), {
          uid,
          displayName: initialProfile.displayName,
          avatar: initialProfile.avatar,
          friendCode: generatedCode,
          bio: initialProfile.bio
        });
      }
    }, (err) => console.error('Profile sync error:', err));

    // Public User Directory (for real-time Friend Code uniqueness check & search)
    const unsubDir = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'user_directory'),
      (snap) => setUserDirectory(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error('Directory sync error:', err)
    );

    // Tasks
    const unsubTasks = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'tasks'),
      (snap) => setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // Study Schedule & Appointments
    const unsubSched = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'schedule'),
      (snap) => setSchedule(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.time || '').localeCompare(b.time || ''))),
      (err) => console.error(err)
    );

    // Notes
    const unsubNotes = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'notes'),
      (snap) => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))),
      (err) => console.error(err)
    );

    // Life Goals
    const unsubGoals = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'goals'),
      (snap) => setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // Finance Transactions
    const unsubFinance = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'transactions'),
      (snap) => setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // Workouts
    const unsubWorkouts = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'workouts'),
      (snap) => setWorkouts(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // Private Diaries (Strictly under user's private node)
    const unsubPrivDiaries = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'private_diaries'),
      (snap) => setPrivateDiaries(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // Public Diaries Feed
    const unsubPubDiaries = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'public_diaries'),
      (snap) => setPublicDiaries(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))),
      (err) => console.error(err)
    );

    // AI Therapist Messages (Strictly Private)
    const unsubAi = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'ai_therapist_chat'),
      (snap) => setAiMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))),
      (err) => console.error(err)
    );

    // Friends & Requests
    const unsubFriends = onSnapshot(
      collection(db, 'artifacts', appId, 'users', uid, 'friends'),
      (snap) => setFriends(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error(err)
    );

    const unsubRequests = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'friend_requests'),
      (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFriendRequests(all.filter(r => r.toUid === uid && r.status === 'pending'));
      },
      (err) => console.error(err)
    );

    // Shared Goals
    const unsubSharedGoals = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'shared_goals'),
      (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setSharedGoals(all.filter(g => g.ownerUid === uid || g.partnerUid === uid));
      },
      (err) => console.error(err)
    );

    // Direct Messages
    const unsubDMs = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'direct_messages'),
      (snap) => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setDirectMessages(
          all
            .filter(m => m.senderUid === uid || m.receiverUid === uid)
            .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        );
      },
      (err) => console.error(err)
    );

    return () => {
      unsubProfile();
      unsubDir();
      unsubTasks();
      unsubSched();
      unsubNotes();
      unsubGoals();
      unsubFinance();
      unsubWorkouts();
      unsubPrivDiaries();
      unsubPubDiaries();
      unsubAi();
      unsubFriends();
      unsubRequests();
      unsubSharedGoals();
      unsubDMs();
    };
  }, [user]);

  // ==========================================================================
  // THEME, LANGUAGE & CUSTOM FRIEND CODE UPDATERS
  // ==========================================================================
  const handleToggleLanguage = async () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    if (!user) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile'),
        { lang: nextLang },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const sanitizedCustomCode = customCodeInput.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
  const codeValidationStatus = useMemo(() => {
    if (!sanitizedCustomCode || sanitizedCustomCode.length < 3 || sanitizedCustomCode.length > 16) {
      return 'invalid';
    }
    if (sanitizedCustomCode === (profile.friendCode || '').toUpperCase()) {
      return 'current';
    }
    const taken = userDirectory.some(
      u => u.uid !== user?.uid && (u.friendCode || '').toUpperCase() === sanitizedCustomCode
    );
    return taken ? 'taken' : 'available';
  }, [sanitizedCustomCode, profile.friendCode, userDirectory, user]);

  const handleClaimCustomFriendCode = async (e) => {
    if (e) e.preventDefault();
    if (!user || savingCode) return;
    if (codeValidationStatus !== 'available' && codeValidationStatus !== 'current') {
      showToast(codeValidationStatus === 'taken' ? t.codeTaken : t.codeInvalid);
      return;
    }
    setSavingCode(true);
    try {
      await handleSaveProfile({ friendCode: sanitizedCustomCode });
      showToast(lang === 'ar' ? `تم حفظ كودك المميز: ${sanitizedCustomCode} ✨` : `Custom Friend Code saved: ${sanitizedCustomCode} ✨`);
    } finally {
      setSavingCode(false);
    }
  };

  const handleUpdateTheme = async (newThemeKey, newAccent = accentColor) => {
    setThemeKey(newThemeKey);
    setAccentColor(newAccent);
    if (!user) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile'),
        { themeKey: newThemeKey, accentColor: newAccent },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async (updates) => {
    if (!user) return;
    const nextProfile = { ...profile, ...updates };
    setProfile(nextProfile);
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile'),
        nextProfile,
        { merge: true }
      );
      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'user_directory', user.uid),
        {
          uid: user.uid,
          displayName: nextProfile.displayName,
          avatar: nextProfile.avatar,
          friendCode: nextProfile.friendCode,
          bio: nextProfile.bio
        },
        { merge: true }
      );
      showToast('Profile saved to cloud ✨');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 300, 0.8);
      await handleSaveProfile({ avatar: compressed });
    } catch (err) {
      showToast('Could not process image');
    }
  };

  // ==========================================================================
  // AUTHENTICATION HANDLERS (EMAIL/PASSWORD + GOOGLE)
  // ==========================================================================
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        if (authName.trim()) {
          await updateProfile(cred.user, { displayName: authName.trim() });
        }
        showToast('Welcome to Lore! Account created.');
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        showToast('Signed in successfully!');
      }
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setAuthModalOpen(false);
      showToast('Signed in with Google!');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
      showToast('Signed out');
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================================================
  // CRUD ACTIONS FOR MODULES
  // ==========================================================================
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'tasks'), {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      completed: false,
      createdAt: Date.now()
    });
    setNewTaskTitle('');
  };

  const toggleTask = async (task) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'tasks', task.id), {
      completed: !task.completed
    });
  };

  const deleteTask = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'tasks', id));
  };

  const addScheduleItem = async (e) => {
    e.preventDefault();
    if (!newSchedSubject.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'schedule'), {
      time: newSchedTime,
      subject: newSchedSubject.trim(),
      type: newSchedType,
      createdAt: Date.now()
    });
    setNewSchedSubject('');
    showToast('Added to schedule');
  };

  const saveNote = async () => {
    if (!noteTitle.trim() && !noteBody.trim()) return;
    if (!user) return;
    if (selectedNoteId) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'notes', selectedNoteId), {
        title: noteTitle.trim() || 'Untitled Note',
        tag: noteTag,
        body: noteBody,
        updatedAt: Date.now()
      });
      showToast('Note updated');
    } else {
      const ref = await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'notes'), {
        title: noteTitle.trim() || 'Untitled Note',
        tag: noteTag,
        body: noteBody,
        updatedAt: Date.now()
      });
      setSelectedNoteId(ref.id);
      showToast('Note created');
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'goals'), {
      title: newGoalTitle.trim(),
      category: newGoalCategory,
      progress: 10,
      createdAt: Date.now()
    });
    setNewGoalTitle('');
  };

  const updateGoalProgress = async (goalId, progress) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'goals', goalId), {
      progress: Number(progress)
    });
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'transactions'), {
      title: txTitle.trim(),
      amount: parseFloat(txAmount),
      type: txType,
      category: txCategory,
      createdAt: Date.now()
    });
    setTxTitle('');
    setTxAmount('');
    showToast('Transaction logged');
  };

  const addWorkout = async (e) => {
    e.preventDefault();
    if (!woExercise.trim() || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'workouts'), {
      day: woDay,
      exercise: woExercise.trim(),
      details: woDetails.trim() || '3 sets × 12 reps',
      done: false,
      createdAt: Date.now()
    });
    setWoExercise('');
    setWoDetails('');
    showToast('Workout added');
  };

  // ==========================================================================
  // DIARY & CREATIVE CANVAS SUBMISSION
  // ==========================================================================
  const handleDiaryPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImageFile(file, 700, 0.78);
    setDiaryPhoto(compressed);
    showToast('Photo attached to diary');
  };

  const publishDiaryEntry = async (e) => {
    e.preventDefault();
    if (!diaryBody.trim() && !diaryArtwork && !diaryPhoto) return;
    if (!user) return;

    const payload = {
      authorUid: user.uid,
      authorName: profile.displayName,
      authorAvatar: profile.avatar,
      title: diaryTitle.trim() || new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
      body: diaryBody.trim(),
      mood: diaryMood,
      privacy: diaryPrivacy,
      artwork: diaryArtwork,
      photo: diaryPhoto,
      likes: [],
      comments: [],
      createdAt: Date.now()
    };

    if (diaryPrivacy === 'private') {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'private_diaries'), payload);
      showToast('Saved to your Private Encrypted Diary 🔒');
    } else {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'public_diaries'), payload);
      showToast('Published to Friends Feed 🌍');
    }

    setDiaryTitle('');
    setDiaryBody('');
    setDiaryArtwork('');
    setDiaryPhoto('');
    setShowCanvasStudio(false);
  };

  const toggleLikePublicDiary = async (entry) => {
    if (!user) return;
    const likes = Array.isArray(entry.likes) ? entry.likes : [];
    const hasLiked = likes.includes(user.uid);
    const nextLikes = hasLiked ? likes.filter(id => id !== user.uid) : [...likes, user.uid];
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'public_diaries', entry.id), {
      likes: nextLikes
    });
  };

  const addCommentPublicDiary = async (entry) => {
    const text = (commentInputs[entry.id] || '').trim();
    if (!text || !user) return;
    const comments = Array.isArray(entry.comments) ? entry.comments : [];
    const nextComments = [
      ...comments,
      {
        id: crypto.randomUUID(),
        authorUid: user.uid,
        authorName: profile.displayName,
        text,
        createdAt: Date.now()
      }
    ];
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'public_diaries', entry.id), {
      comments: nextComments
    });
    setCommentInputs(prev => ({ ...prev, [entry.id]: '' }));
  };

  // ==========================================================================
  // AI THERAPIST, LIFE COACH & JOURNAL ANALYZER
  // ==========================================================================
  const handleSendAiMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || !user || aiLoading) return;
    const userText = aiInput.trim();
    setAiInput('');
    setAiLoading(true);

    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'ai_therapist_chat'), {
        role: 'user',
        text: userText,
        createdAt: Date.now()
      });

      const recentHistory = aiMessages
        .slice(-8)
        .map(m => `${m.role === 'user' ? 'User' : 'Lore AI'}: ${m.text}`)
        .join('\n');

      const recentMoods = privateDiaries.slice(0, 3).map(d => `${d.mood}: ${d.title}`).join('; ');
      const activeGoalsText = goals.map(g => `${g.title} (${g.progress}%)`).join(', ');

      const fullPrompt = `User Context:
- Name: ${profile.displayName}
- Active Goals: ${activeGoalsText || 'None listed yet'}
- Recent Diary Moods: ${recentMoods || 'None yet'}

Recent Conversation:
${recentHistory}

User's New Message:
${userText}`;

      const reply = await callGeminiAPI({
        prompt: fullPrompt,
        systemInstruction: EVIDENCE_BASED_SYSTEM_PROMPT,
        temperature: 0.72
      });

      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'ai_therapist_chat'), {
        role: 'assistant',
        text: reply,
        createdAt: Date.now()
      });
    } catch (err) {
      showToast('AI connection busy—please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeepLifeAnalysis = async () => {
    if (!user || analyzingLife) return;
    setAnalyzingLife(true);
    try {
      const allDiaries = [...privateDiaries, ...publicDiaries.filter(d => d.authorUid === user.uid)].slice(0, 8);
      const diarySummary = allDiaries
        .map(d => `[Mood: ${d.mood}] ${d.title}: ${d.body}`)
        .join('\n---\n');
      const tasksSummary = tasks.map(t => `${t.completed ? '[Done]' : '[Pending]'} ${t.title} (${t.priority})`).join(', ');
      const goalsSummary = goals.map(g => `${g.title}: ${g.progress}%`).join(', ');

      const analysisPrompt = `Perform a comprehensive, deeply compassionate, evidence-based psychological and life-coaching analysis for ${profile.displayName}.
Analyze the following real data from their Life OS:

1. RECENT DIARY ENTRIES & MOODS:
${diarySummary || 'No diary entries written yet.'}

2. CURRENT TASKS & PRODUCTIVITY:
${tasksSummary || 'No tasks logged yet.'}

3. LIFE GOALS:
${goalsSummary || 'No goals set yet.'}

Provide a structured report (in the same language as their entries, or English/Arabic harmoniously) covering:
- **Emotional & Cognitive Patterns (CBT/ACT Lens)**: Core themes, emotional triggers, and any subtle cognitive distortions noticed.
- **Core Strengths & Resilience**: Evidence of growth, values, and positive habits.
- **Personalized Evidence-Based Action Plan**: 3 concrete, scientifically grounded micro-habits or psychological exercises for this week.`;

      const report = await callGeminiAPI({
        prompt: analysisPrompt,
        systemInstruction: EVIDENCE_BASED_SYSTEM_PROMPT,
        temperature: 0.65
      });
      setAiAnalysisReport(report);
    } catch (err) {
      showToast('Could not complete analysis right now.');
    } finally {
      setAnalyzingLife(false);
    }
  };

  // ==========================================================================
  // SOCIAL, FRIENDS, SHARED GOALS & DIRECT MESSAGES
  // ==========================================================================
  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    const code = friendSearchCode.trim().toUpperCase().replace(/^@/, '');
    if (!code || !user) return;
    if (code === (profile.friendCode || '').toUpperCase()) {
      showToast(lang === 'ar' ? 'هذا كودك الشخصي!' : "That's your own Friend Code!");
      return;
    }

    try {
      const found = userDirectory.find(u => (u.friendCode || '').toUpperCase() === code);
      if (!found) {
        showToast(lang === 'ar' ? 'لم يتم العثور على مستخدم بهذا الكود' : 'No user found with that Friend Code');
        return;
      }
      if (friends.some(f => f.uid === found.uid)) {
        showToast(lang === 'ar' ? 'أنتما أصدقاء بالفعل!' : 'You are already friends!');
        return;
      }
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'friend_requests'), {
        fromUid: user.uid,
        fromName: profile.displayName,
        fromAvatar: profile.avatar,
        fromCode: profile.friendCode,
        toUid: found.uid,
        toName: found.displayName,
        status: 'pending',
        createdAt: Date.now()
      });
      setFriendSearchCode('');
      showToast(lang === 'ar' ? `تم إرسال طلب الصداقة إلى ${found.displayName}!` : `Friend request sent to ${found.displayName}!`);
    } catch (err) {
      showToast('Error sending friend request');
    }
  };

  const handleAcceptFriendRequest = async (req) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'friend_requests', req.id), {
      status: 'accepted'
    });
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'friends', req.fromUid), {
      uid: req.fromUid,
      displayName: req.fromName,
      avatar: req.fromAvatar || '',
      friendCode: req.fromCode || ''
    });
    await setDoc(doc(db, 'artifacts', appId, 'users', req.fromUid, 'friends', user.uid), {
      uid: user.uid,
      displayName: profile.displayName,
      avatar: profile.avatar || '',
      friendCode: profile.friendCode
    });
    showToast(`You and ${req.fromName} are now friends!`);
  };

  const handleCreateSharedGoal = async (e) => {
    e.preventDefault();
    if (!sharedGoalTitle.trim() || !sharedGoalFriendUid || !user) return;
    const friend = friends.find(f => f.uid === sharedGoalFriendUid);
    if (!friend) return;

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'shared_goals'), {
      title: sharedGoalTitle.trim(),
      ownerUid: user.uid,
      ownerName: profile.displayName,
      ownerProgress: 10,
      partnerUid: friend.uid,
      partnerName: friend.displayName,
      partnerProgress: 10,
      createdAt: Date.now()
    });
    setSharedGoalTitle('');
    showToast('Shared Goal created!');
  };

  const updateSharedGoalProgress = async (sg, newVal) => {
    if (!user) return;
    const isOwner = sg.ownerUid === user.uid;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'shared_goals', sg.id), {
      [isOwner ? 'ownerProgress' : 'partnerProgress']: Number(newVal)
    });
  };

  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!dmInput.trim() || !selectedChatFriend || !user) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'direct_messages'), {
      senderUid: user.uid,
      senderName: profile.displayName,
      receiverUid: selectedChatFriend.uid,
      text: dmInput.trim(),
      createdAt: Date.now()
    });
    setDmInput('');
  };

  // ==========================================================================
  // COMPUTED ANALYTICS
  // ==========================================================================
  const financeStats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    const budgetPct = profile.monthlyBudget > 0 ? Math.min(100, Math.round((expense / profile.monthlyBudget) * 100)) : 0;
    return { income, expense, balance, budgetPct };
  }, [transactions, profile.monthlyBudget]);

  const completedTasksCount = tasks.filter(t => t.completed).length;

  const activeChatMessages = useMemo(() => {
    if (!selectedChatFriend || !user) return [];
    return directMessages.filter(
      m =>
        (m.senderUid === user.uid && m.receiverUid === selectedChatFriend.uid) ||
        (m.senderUid === selectedChatFriend.uid && m.receiverUid === user.uid)
    );
  }, [directMessages, selectedChatFriend, user]);

  // ==========================================================================
  // NAVIGATION ITEMS
  // ==========================================================================
  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: Sparkles },
    { id: 'study', label: t.navStudy, icon: Calendar },
    { id: 'diary', label: t.navDiary, icon: BookOpen },
    { id: 'therapist', label: t.navTherapist, icon: HeartHandshake },
    { id: 'finance', label: t.navFinance, icon: Wallet },
    { id: 'fitness', label: t.navFitness, icon: Dumbbell },
    { id: 'social', label: t.navSocial, icon: Users }
  ];

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-10 h-10 text-indigo-400 animate-spin" />
          <p className="text-sm tracking-widest uppercase text-slate-400">Initializing Lore OS...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        '--accent': accentColor,
        backgroundColor: currentTheme.bg,
        color: currentTheme.text
      }}
      className="min-h-screen flex flex-col md:flex-row transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white"
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50 px-4 py-2.5 rounded-2xl shadow-2xl text-sm font-medium text-white flex items-center gap-2 animate-bounce`}
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DESKTOP & IPAD LANDSCAPE SIDEBAR                                     */}
      {/* ==================================================================== */}
      <aside
        className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 ${isRTL ? 'md:right-0 border-l' : 'md:left-0 border-r'} p-4 justify-between z-30`}
        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 py-3 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                L
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Lore</h1>
                <p className="text-xs" style={{ color: currentTheme.muted }}>{t.tagline}</p>
              </div>
            </div>
            <button
              onClick={handleToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all hover:opacity-80"
              style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: 'var(--accent)' }}
              title="Switch Language / تغيير اللغة"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'transparent',
                    color: active ? '#ffffff' : currentTheme.text
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.id === 'social' && friendRequests.length > 0 && (
                    <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full`}>
                      {friendRequests.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card & Theme Button */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: currentTheme.border }}>
          <button
            onClick={() => setThemeDrawerOpen(!themeDrawerOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all"
            style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span>{t.themeAndColors}</span>
            </span>
            <Sliders className="w-3.5 h-3.5" style={{ color: currentTheme.muted }} />
          </button>

          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all hover:opacity-90"
            style={{ backgroundColor: currentTheme.surface2 }}
          >
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{profile.displayName}</p>
              <p className="text-[11px] font-mono truncate" style={{ color: 'var(--accent)' }}>
                @{profile.friendCode}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MOBILE & IPAD PORTRAIT TOP BAR & BOTTOM NAVIGATION                   */}
      {/* ==================================================================== */}
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b backdrop-blur-md"
        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            L
          </div>
          <span className="font-bold text-lg">Lore</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLanguage}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border"
            style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: 'var(--accent)' }}
          >
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>
          <button
            onClick={() => setThemeDrawerOpen(!themeDrawerOpen)}
            className="p-2 rounded-xl border"
            style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
          >
            <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="p-2 rounded-xl border"
            style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around py-2 px-1 border-t backdrop-blur-md"
        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-medium relative"
              style={{ color: active ? 'var(--accent)' : currentTheme.muted }}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[54px]">{item.label.split(' ')[0]}</span>
              {item.id === 'social' && friendRequests.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ==================================================================== */}
      {/* LIVE THEME & COLOR CUSTOMIZER DRAWER                                 */}
      {/* ==================================================================== */}
      {themeDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-5"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span>{t.appearanceStudio}</span>
              </h3>
              <button onClick={() => setThemeDrawerOpen(false)} className="p-1.5 rounded-xl hover:opacity-75">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: currentTheme.muted }}>
                {t.aestheticThemes}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(THEMES).map(([key, th]) => (
                  <button
                    key={key}
                    onClick={() => handleUpdateTheme(key, th.defaultAccent)}
                    className="flex items-center justify-between p-3 rounded-2xl border text-start transition-all"
                    style={{
                      backgroundColor: th.bg,
                      color: th.text,
                      borderColor: themeKey === key ? accentColor : th.border,
                      borderWidth: themeKey === key ? '2px' : '1px'
                    }}
                  >
                    <span className="font-medium text-sm">{th.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: th.surface }} />
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: th.defaultAccent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: currentTheme.muted }}>
                {t.customAccentColor}
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleUpdateTheme(themeKey, e.target.value)}
                  className="w-12 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <div className="flex flex-wrap gap-2">
                  {['#818cf8', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#a855f7', '#f43f5e'].map(c => (
                    <button
                      key={c}
                      onClick={() => handleUpdateTheme(themeKey, c)}
                      className="w-7 h-7 rounded-full border-2 border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setThemeDrawerOpen(false)}
              className="w-full py-2.5 rounded-2xl font-semibold text-white text-sm"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {t.done}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* AUTHENTICATION MODAL (SIGN UP / LOGIN / GOOGLE)                      */}
      {/* ==================================================================== */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {authMode === 'login' ? t.signInToLore : t.createLoreAccount}
              </h3>
              <button onClick={() => setAuthModalOpen(false)} className="p-1.5 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder={t.displayNameLabel}
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border text-sm outline-none"
                  style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border text-sm outline-none"
                style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
              />
              <input
                type="password"
                placeholder="Password (min 6)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border text-sm outline-none"
                style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-semibold text-white text-sm shadow-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {authMode === 'login' ? t.signIn : t.signUp}
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 rounded-2xl font-semibold text-sm border flex items-center justify-center gap-2"
              style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
            >
              <Globe className="w-4 h-4" />
              <span>{t.continueWithGoogle}</span>
            </button>

            <p className="text-center text-xs" style={{ color: currentTheme.muted }}>
              {authMode === 'login' ? t.dontHaveAccount : t.alreadyHaveAccount}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="font-bold underline"
                style={{ color: 'var(--accent)' }}
              >
                {authMode === 'login' ? t.signUp : t.signIn}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN CONTENT WORKSPACE                                               */}
      {/* ==================================================================== */}
      <main className={`flex-1 ${isRTL ? 'md:pr-64' : 'md:pl-64'} pb-24 md:pb-10`}>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ================================================================ */}
          {/* TAB 1: SMART SECRETARY & LIFE DASHBOARD                          */}
          {/* ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Welcome Banner */}
              <div
                className="rounded-3xl p-6 sm:p-8 border relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
              >
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: currentTheme.surface2, color: 'var(--accent)' }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.secretaryBadge}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {t.welcomeBack}, {profile.displayName}
                  </h2>
                  <p className="text-sm max-w-xl" style={{ color: currentTheme.muted }}>
                    {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {user?.isAnonymous && (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <LogIn className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span>{t.syncAccountBtn}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('therapist')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-lg"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{t.talkToTherapistBtn}</span>
                  </button>
                </div>
              </div>

              {/* Quick KPI Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs font-medium" style={{ color: currentTheme.muted }}>{t.tasksCompleted}</p>
                  <p className="text-2xl font-bold mt-1">{completedTasksCount} / {tasks.length}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{t.dailyProductivity}</p>
                </div>
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs font-medium" style={{ color: currentTheme.muted }}>{t.netBalance}</p>
                  <p className="text-2xl font-bold mt-1">${financeStats.balance.toLocaleString()}</p>
                  <p className="text-xs mt-1 text-emerald-500">{t.budgetUsed}: {financeStats.budgetPct}%</p>
                </div>
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs font-medium" style={{ color: currentTheme.muted }}>{t.hydrationToday}</p>
                  <p className="text-2xl font-bold mt-1">{profile.waterToday} ml</p>
                  <p className="text-xs mt-1 text-sky-400">{t.goalLabel}: {profile.waterGoal} ml</p>
                </div>
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs font-medium" style={{ color: currentTheme.muted }}>{t.diaryEntries}</p>
                  <p className="text-2xl font-bold mt-1">{privateDiaries.length + publicDiaries.filter(d => d.authorUid === user?.uid).length}</p>
                  <p className="text-xs mt-1 text-pink-400">{t.mindfulReflections}</p>
                </div>
              </div>

              {/* Two Column Secretary Grid: Appointments/Reminders + Long-Term Goals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments & Secretary Reminders */}
                <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      <span>{t.appointmentsAgenda}</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('study')}
                      className="text-xs font-semibold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {t.manageAll}
                    </button>
                  </div>

                  <form onSubmit={addScheduleItem} className="flex gap-2">
                    <input
                      type="time"
                      value={newSchedTime}
                      onChange={(e) => setNewSchedTime(e.target.value)}
                      className="px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <input
                      type="text"
                      placeholder={t.addAppointmentPlaceholder}
                      value={newSchedSubject}
                      onChange={(e) => setNewSchedSubject(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {schedule.length === 0 ? (
                      <p className="text-xs py-6 text-center" style={{ color: currentTheme.muted }}>
                        {t.clearAgenda}
                      </p>
                    ) : (
                      schedule.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-2xl border"
                          style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                              {item.time}
                            </span>
                            <div>
                              <p className="text-sm font-medium">{item.subject}</p>
                              <p className="text-[11px]" style={{ color: currentTheme.muted }}>{item.type}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'schedule', item.id))}
                            className="p-1.5 text-rose-400 hover:opacity-75"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Life Goals & Progress Tracker */}
                <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                      <span>{t.lifeGoalsMilestones}</span>
                    </h3>
                  </div>

                  <form onSubmit={addGoal} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.newGoalPlaceholder}
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.addBtn}
                    </button>
                  </form>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {goals.length === 0 ? (
                      <p className="text-xs py-6 text-center" style={{ color: currentTheme.muted }}>
                        {t.firstGoalEmpty}
                      </p>
                    ) : (
                      goals.map(g => (
                        <div
                          key={g.id}
                          className="p-3.5 rounded-2xl border space-y-2"
                          style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{g.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{g.progress}%</span>
                              <button
                                onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'goals', g.id))}
                                className="text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={g.progress}
                            onChange={(e) => updateGoalProgress(g.id, e.target.value)}
                            className="w-full cursor-pointer"
                            style={{ accentColor: accentColor }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: STUDY TIMETABLE, TASKS & SMART NOTES                      */}
          {/* ================================================================ */}
          {activeTab === 'study' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{t.studyHubTitle}</h2>
                <p className="text-sm" style={{ color: currentTheme.muted }}>
                  {t.studyHubSub}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Study & Task Checklist */}
                <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span>{t.dailyTasksTitle}</span>
                  </h3>

                  <form onSubmit={addTask} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.addTaskPlaceholder}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="px-2.5 py-2.5 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.addBtn}
                    </button>
                  </form>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {tasks.map(tk => (
                      <div
                        key={tk.id}
                        className="flex items-center justify-between p-3 rounded-2xl border"
                        style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                      >
                        <button
                          onClick={() => toggleTask(tk)}
                          className="flex items-center gap-3 text-start flex-1"
                        >
                          {tk.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 shrink-0" style={{ color: currentTheme.muted }} />
                          )}
                          <span className={`text-sm ${tk.completed ? 'line-through opacity-50' : ''}`}>
                            {tk.title}
                          </span>
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/15" style={{ color: 'var(--accent)' }}>
                            {tk.priority}
                          </span>
                          <button onClick={() => deleteTask(tk.id)} className="text-rose-400 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Study Timetable Planner */}
                <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span>{t.dailyTimetableTitle}</span>
                  </h3>

                  <form onSubmit={addScheduleItem} className="flex flex-wrap gap-2">
                    <input
                      type="time"
                      value={newSchedTime}
                      onChange={(e) => setNewSchedTime(e.target.value)}
                      className="px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <select
                      value={newSchedType}
                      onChange={(e) => setNewSchedType(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    >
                      <option value="Study">Study</option>
                      <option value="Appointment">Appointment</option>
                      <option value="Deep Work">Deep Work</option>
                      <option value="Self-Care">Self-Care</option>
                    </select>
                    <input
                      type="text"
                      placeholder={t.subjectPlaceholder}
                      value={newSchedSubject}
                      onChange={(e) => setNewSchedSubject(e.target.value)}
                      className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.addBtn}
                    </button>
                  </form>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {schedule.map(s => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-3 rounded-2xl border"
                        style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--accent)' }}>
                            {s.time}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{s.subject}</p>
                            <p className="text-[11px]" style={{ color: currentTheme.muted }}>{s.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'schedule', s.id))}
                          className="text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rich Notes Workspace */}
              <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span>{t.smartNotebook}</span>
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedNoteId(null);
                      setNoteTitle('');
                      setNoteBody('');
                      setNoteTag('Study');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.newNote}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Saved Notes List */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notes.length === 0 ? (
                      <p className="text-xs p-4 text-center" style={{ color: currentTheme.muted }}>
                        {t.noNotesYet}
                      </p>
                    ) : (
                      notes.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setSelectedNoteId(n.id);
                            setNoteTitle(n.title);
                            setNoteTag(n.tag || 'Study');
                            setNoteBody(n.body);
                          }}
                          className="p-3.5 rounded-2xl border cursor-pointer transition-all"
                          style={{
                            backgroundColor: selectedNoteId === n.id ? 'var(--accent)' : currentTheme.surface2,
                            color: selectedNoteId === n.id ? '#ffffff' : currentTheme.text,
                            borderColor: currentTheme.border
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm truncate">{n.title}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'notes', n.id));
                                if (selectedNoteId === n.id) {
                                  setSelectedNoteId(null);
                                  setNoteTitle('');
                                  setNoteBody('');
                                }
                              }}
                              className="opacity-70 hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs opacity-75 truncate mt-1">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Note Editor */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t.noteTitlePlaceholder}
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none"
                        style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                      />
                      <select
                        value={noteTag}
                        onChange={(e) => setNoteTag(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                        style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                      >
                        <option value="Study">Study</option>
                        <option value="Ideas">Ideas</option>
                        <option value="Life">Life</option>
                        <option value="Book Summary">Book Summary</option>
                      </select>
                    </div>
                    <textarea
                      rows={7}
                      placeholder={t.noteBodyPlaceholder}
                      value={noteBody}
                      onChange={(e) => setNoteBody(e.target.value)}
                      dir="auto"
                      className="w-full p-4 rounded-2xl border text-sm outline-none resize-y leading-relaxed"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={saveNote}
                        className="px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-md"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        {t.saveNoteBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: LONG-FORM DIARY & PRO CREATIVE DRAWING STUDIO             */}
          {/* ================================================================ */}
          {activeTab === 'diary' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{t.diaryStudioTitle}</h2>
                  <p className="text-sm" style={{ color: currentTheme.muted }}>
                    {t.diaryStudioSub}
                  </p>
                </div>
                <button
                  onClick={() => setShowCanvasStudio(!showCanvasStudio)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-lg"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Palette className="w-4 h-4" />
                  <span>{showCanvasStudio ? t.hideCanvasBtn : t.openCanvasBtn}</span>
                </button>
              </div>

              {/* Pro Drawing & Scrapbooking Studio */}
              {showCanvasStudio && (
                <CreativeCanvasStudio
                  theme={currentTheme}
                  t={t}
                  initialImage={diaryArtwork}
                  onSaveArtwork={(dataUrl) => {
                    setDiaryArtwork(dataUrl);
                    setShowCanvasStudio(false);
                    showToast(lang === 'ar' ? 'تم إرفاق الرسمة في اليومية! 🎨' : 'Artwork attached to your diary entry! 🎨');
                  }}
                />
              )}

              {/* Long-Form Diary Composer */}
              <form
                onSubmit={publishDiaryEntry}
                className="p-6 rounded-3xl border space-y-4"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder={t.entryTitlePlaceholder}
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                    dir="auto"
                    className="flex-1 min-w-[220px] px-4 py-3 rounded-2xl border text-base font-bold outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />

                  <select
                    value={diaryMood}
                    onChange={(e) => setDiaryMood(e.target.value)}
                    className="px-3.5 py-3 rounded-2xl border text-xs font-semibold outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    <option value="Peaceful 🌿">Peaceful 🌿</option>
                    <option value="Joyful ✨">Joyful ✨</option>
                    <option value="Motivated 🔥">Motivated 🔥</option>
                    <option value="Reflective 🌙">Reflective 🌙</option>
                    <option value="Anxious 🌧️">Anxious 🌧️</option>
                    <option value="Tired 🍂">Tired 🍂</option>
                    <option value="Grateful 💖">Grateful 💖</option>
                  </select>
                </div>

                {/* Expansive Long-Form Textarea */}
                <textarea
                  rows={10}
                  placeholder={t.entryBodyPlaceholder}
                  value={diaryBody}
                  onChange={(e) => setDiaryBody(e.target.value)}
                  dir="auto"
                  className="w-full p-5 rounded-2xl border text-sm leading-loose outline-none resize-y"
                  style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                />

                {/* Attached Media Previews */}
                {(diaryArtwork || diaryPhoto) && (
                  <div className="flex flex-wrap gap-4">
                    {diaryArtwork && (
                      <div className="relative rounded-2xl overflow-hidden border max-w-xs" style={{ borderColor: currentTheme.border }}>
                        <img src={diaryArtwork} alt="Drawing" className="w-full h-40 object-cover" />
                        <button
                          type="button"
                          onClick={() => setDiaryArtwork('')}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {diaryPhoto && (
                      <div className="relative rounded-2xl overflow-hidden border max-w-xs" style={{ borderColor: currentTheme.border }}>
                        <img src={diaryPhoto} alt="Attached" className="w-full h-40 object-cover" />
                        <button
                          type="button"
                          onClick={() => setDiaryPhoto('')}
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Controls: Photo Upload, Privacy Toggle, Save Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <ImageIcon className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span>{t.attachPhoto}</span>
                      <input type="file" accept="image/*" onChange={handleDiaryPhotoUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowCanvasStudio(!showCanvasStudio)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <Brush className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      <span>{t.drawStickers}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Privacy Switch */}
                    <div
                      className="flex items-center p-1 rounded-2xl border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <button
                        type="button"
                        onClick={() => setDiaryPrivacy('private')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: diaryPrivacy === 'private' ? 'var(--accent)' : 'transparent',
                          color: diaryPrivacy === 'private' ? '#ffffff' : currentTheme.muted
                        }}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t.privateOnlyMe}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiaryPrivacy('public')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: diaryPrivacy === 'public' ? 'var(--accent)' : 'transparent',
                          color: diaryPrivacy === 'public' ? '#ffffff' : currentTheme.muted
                        }}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{t.publicFriends}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-2xl text-white text-xs font-bold shadow-lg"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.saveEntryBtn}
                    </button>
                  </div>
                </div>
              </form>

              {/* My Private Diary Vault */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span>{t.privateVaultTitle} ({privateDiaries.length})</span>
                </h3>

                {privateDiaries.length === 0 ? (
                  <div className="p-8 rounded-3xl border text-center" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <p className="text-sm" style={{ color: currentTheme.muted }}>
                      {t.privateVaultEmpty}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {privateDiaries.map(entry => (
                      <div
                        key={entry.id}
                        className="p-5 rounded-3xl border space-y-3"
                        style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: currentTheme.surface2 }}>
                            {entry.mood}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px]" style={{ color: currentTheme.muted }}>
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'private_diaries', entry.id))}
                              className="text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-bold text-base" dir="auto">{entry.title}</h4>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed" dir="auto" style={{ color: currentTheme.text }}>
                          {entry.body}
                        </p>
                        {entry.artwork && (
                          <img src={entry.artwork} alt="Diary Artwork" className="w-full rounded-2xl border" style={{ borderColor: currentTheme.border }} />
                        )}
                        {entry.photo && (
                          <img src={entry.photo} alt="Diary Photo" className="w-full rounded-2xl border" style={{ borderColor: currentTheme.border }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 4: EVIDENCE-BASED AI THERAPIST, LIFE COACH & JOURNAL ANALYZER*/}
          {/* ================================================================ */}
          {activeTab === 'therapist' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                    <span>{t.therapistTitle}</span>
                  </h2>
                  <p className="text-sm" style={{ color: currentTheme.muted }}>
                    {t.therapistSub}
                  </p>
                </div>

                <button
                  onClick={handleDeepLifeAnalysis}
                  disabled={analyzingLife}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg disabled:opacity-60"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Sparkles className={`w-4 h-4 ${analyzingLife ? 'animate-spin' : ''}`} />
                  <span>{analyzingLife ? t.analyzingLifeBtn : t.analyzeLifeBtn}</span>
                </button>
              </div>

              {/* Deep Diary & Psychological Analysis Report */}
              {aiAnalysisReport && (
                <div
                  className="p-6 rounded-3xl border space-y-3 shadow-xl"
                  style={{ backgroundColor: currentTheme.surface, borderColor: 'var(--accent)' }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                      <Sparkles className="w-5 h-5" />
                      <span>{t.insightReportTitle}</span>
                    </h3>
                    <button onClick={() => setAiAnalysisReport('')} className="p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed" dir="auto">
                    {aiAnalysisReport}
                  </div>
                </div>
              )}

              {/* Private AI Therapy Chat Room */}
              <div
                className="rounded-3xl border flex flex-col h-[520px] overflow-hidden"
                style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
              >
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: 'var(--accent)' }}>
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Dr. Lore (CBT / ACT / Life Coach)</p>
                      <p className="text-[11px]" style={{ color: currentTheme.muted }}>{t.drLoreSubtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {aiMessages.length === 0 && (
                    <div className="p-5 rounded-2xl max-w-lg text-sm leading-relaxed" style={{ backgroundColor: currentTheme.surface2 }}>
                      {t.aiWelcomeMsg}
                    </div>
                  )}

                  {aiMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        dir="auto"
                        className="max-w-[82%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed"
                        style={{
                          backgroundColor: msg.role === 'user' ? 'var(--accent)' : currentTheme.surface2,
                          color: msg.role === 'user' ? '#ffffff' : currentTheme.text
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl text-xs animate-pulse" style={{ backgroundColor: currentTheme.surface2 }}>
                        {t.aiReflecting}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form
                  onSubmit={handleSendAiMessage}
                  className="p-3 border-t flex gap-2"
                  style={{ borderColor: currentTheme.border }}
                >
                  <input
                    type="text"
                    placeholder={t.aiInputPlaceholder}
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    dir="auto"
                    className="flex-1 px-4 py-3 rounded-2xl border text-sm outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-5 py-3 rounded-2xl text-white font-semibold flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 5: FINANCE & BUDGET TRACKER                                  */}
          {/* ================================================================ */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{t.financeTitle}</h2>
                <p className="text-sm" style={{ color: currentTheme.muted }}>
                  {t.financeSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs" style={{ color: currentTheme.muted }}>{t.totalIncome}</p>
                  <p className="text-2xl font-bold text-emerald-500 mt-1">+${financeStats.income.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <p className="text-xs" style={{ color: currentTheme.muted }}>{t.totalExpenses}</p>
                  <p className="text-2xl font-bold text-rose-500 mt-1">-${financeStats.expense.toLocaleString()}</p>
                </div>
                <div className="p-5 rounded-3xl border" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: currentTheme.muted }}>{t.monthlyBudgetLimit}</p>
                    <span className="text-xs font-bold">{financeStats.budgetPct}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold">$</span>
                    <input
                      type="number"
                      value={profile.monthlyBudget}
                      onChange={(e) => handleSaveProfile({ monthlyBudget: Number(e.target.value) })}
                      className="w-28 px-2 py-1 rounded-lg border text-sm font-bold outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div className="w-full h-2 rounded-full mt-3 overflow-hidden" style={{ backgroundColor: currentTheme.surface2 }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${financeStats.budgetPct}%`, backgroundColor: financeStats.budgetPct > 85 ? '#f43f5e' : 'var(--accent)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <h3 className="font-bold text-base">{t.logTransaction}</h3>
                <form onSubmit={addTransaction} className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    <option value="expense">{t.expenseOpt}</option>
                    <option value="income">{t.incomeOpt}</option>
                  </select>
                  <input
                    type="text"
                    placeholder={t.txDescPlaceholder}
                    value={txTitle}
                    onChange={(e) => setTxTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t.amountPlaceholder}
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {t.saveBtn}
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {transactions.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <div className="flex items-center gap-3">
                        {tx.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-rose-500" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">{tx.title}</p>
                          <p className="text-[11px]" style={{ color: currentTheme.muted }}>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id))}
                          className="text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 6: FITNESS, WORKOUT SCHEDULE & HYDRATION                      */}
          {/* ================================================================ */}
          {activeTab === 'fitness' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{t.fitnessTitle}</h2>
                <p className="text-sm" style={{ color: currentTheme.muted }}>
                  {t.fitnessSub}
                </p>
              </div>

              {/* Water & Habit Streak Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-sky-400" />
                      <span>{t.dailyHydration}</span>
                    </h3>
                    <span className="text-sm font-bold text-sky-400">{profile.waterToday} / {profile.waterGoal} ml</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.surface2 }}>
                    <div
                      className="h-full bg-sky-400 transition-all"
                      style={{ width: `${Math.min(100, (profile.waterToday / profile.waterGoal) * 100)}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleSaveProfile({ waterToday: profile.waterToday + 250 })}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white"
                    >
                      {t.cupBtn}
                    </button>
                    <button
                      onClick={() => handleSaveProfile({ waterToday: profile.waterToday + 500 })}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      {t.bottleBtn}
                    </button>
                    <button
                      onClick={() => handleSaveProfile({ waterToday: 0 })}
                      className="px-3 py-2 rounded-xl text-xs text-rose-400"
                    >
                      {t.resetBtn}
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border flex items-center justify-between gap-3" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.muted }}>{t.wellnessStreak}</p>
                    <p className="text-3xl font-bold mt-1">{profile.streakDays} {t.daysLabel}</p>
                    <p className="text-xs mt-1" style={{ color: currentTheme.muted }}>{t.streakSub}</p>
                  </div>
                  <button
                    onClick={() => handleSaveProfile({ streakDays: profile.streakDays + 1 })}
                    className="px-4 py-3 rounded-2xl text-white text-xs font-bold shadow-lg shrink-0"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {t.checkInBtn}
                  </button>
                </div>
              </div>

              {/* Weekly Workout Split Planner */}
              <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span>{t.weeklyWorkout}</span>
                </h3>

                <form onSubmit={addWorkout} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <select
                    value={woDay}
                    onChange={(e) => setWoDay(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder={t.exercisePlaceholder}
                    value={woExercise}
                    onChange={(e) => setWoExercise(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                  <input
                    type="text"
                    placeholder={t.setsPlaceholder}
                    value={woDetails}
                    onChange={(e) => setWoDetails(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-white text-xs font-semibold"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {t.addWorkoutBtn}
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {workouts.map(w => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'workouts', w.id), { done: !w.done })}
                        >
                          {w.done ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: currentTheme.surface, color: 'var(--accent)' }}>
                            {w.day}
                          </span>
                          <p className={`text-sm font-semibold mt-1 ${w.done ? 'line-through opacity-50' : ''}`}>{w.exercise}</p>
                          <p className="text-xs" style={{ color: currentTheme.muted }}>{w.details}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'workouts', w.id))}
                        className="text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 7: FRIENDS, PUBLIC DIARY FEED, SHARED GOALS & PRIVATE CHAT   */}
          {/* ================================================================ */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{t.socialTitle}</h2>
                <p className="text-sm" style={{ color: currentTheme.muted }}>
                  {t.socialSub}
                </p>
              </div>

              {/* Custom Friend Code Selector & Add Friend Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl border space-y-3" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: currentTheme.muted }}>
                      {t.yourFriendCode}
                    </p>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        codeValidationStatus === 'available' || codeValidationStatus === 'current'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {codeValidationStatus === 'taken'
                        ? t.codeTaken
                        : codeValidationStatus === 'invalid'
                        ? t.codeInvalid
                        : t.codeAvailable}
                    </span>
                  </div>

                  {/* Interactive Custom Code Input + Save + Copy */}
                  <form onSubmit={handleClaimCustomFriendCode} className="flex flex-wrap items-center gap-2">
                    <div
                      className="flex-1 min-w-[160px] flex items-center gap-1.5 px-3 py-2 rounded-2xl border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <AtSign className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                      <input
                        type="text"
                        dir="ltr"
                        maxLength={16}
                        placeholder={t.customizeCodePlaceholder}
                        value={customCodeInput}
                        onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                        className="w-full bg-transparent font-mono font-bold text-sm tracking-wider outline-none uppercase"
                        style={{ color: 'var(--accent)' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingCode || (codeValidationStatus !== 'available' && codeValidationStatus !== 'current')}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-40"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.claimCodeBtn}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(profile.friendCode);
                        showToast(lang === 'ar' ? 'تم نسخ كودك المميز!' : 'Friend Code copied!');
                      }}
                      className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyBtn}</span>
                    </button>
                  </form>

                  {/* Search & Add Friend by Custom Code */}
                  <form onSubmit={handleSendFriendRequest} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      dir="ltr"
                      placeholder={t.addFriendPlaceholder}
                      value={friendSearchCode}
                      onChange={(e) => setFriendSearchCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs outline-none uppercase font-mono"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{t.addBtn}</span>
                    </button>
                  </form>

                  {/* Incoming Requests */}
                  {friendRequests.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-rose-400">{t.incomingRequests} ({friendRequests.length})</p>
                      {friendRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-2.5 rounded-xl" style={{ backgroundColor: currentTheme.surface2 }}>
                          <span className="text-xs font-semibold">{req.fromName} (@{req.fromCode})</span>
                          <button
                            onClick={() => handleAcceptFriendRequest(req)}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-emerald-500"
                          >
                            {t.acceptBtn}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shared Goals with Friends */}
                <div className="p-5 rounded-3xl border space-y-3" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Award className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                    <span>{t.sharedGoalsTitle}</span>
                  </h3>

                  <form onSubmit={handleCreateSharedGoal} className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      placeholder={t.sharedGoalPlaceholder}
                      value={sharedGoalTitle}
                      onChange={(e) => setSharedGoalTitle(e.target.value)}
                      className="flex-1 min-w-[150px] px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                    <select
                      value={sharedGoalFriendUid}
                      onChange={(e) => setSharedGoalFriendUid(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border text-xs outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    >
                      <option value="">{t.selectFriendOpt}</option>
                      {friends.map(f => (
                        <option key={f.uid} value={f.uid}>{f.displayName}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl text-white text-xs font-semibold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.startBtn}
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {sharedGoals.length === 0 ? (
                      <p className="text-xs py-4 text-center" style={{ color: currentTheme.muted }}>
                        {t.sharedGoalsEmpty}
                      </p>
                    ) : (
                      sharedGoals.map(sg => {
                        const isOwner = sg.ownerUid === user?.uid;
                        const myProg = isOwner ? sg.ownerProgress : sg.partnerProgress;
                        const partnerProg = isOwner ? sg.partnerProgress : sg.ownerProgress;
                        const partnerName = isOwner ? sg.partnerName : sg.ownerName;

                        return (
                          <div key={sg.id} className="p-3 rounded-2xl border space-y-2" style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}>
                            <p className="text-xs font-bold">{sg.title}</p>
                            <div className="space-y-1 text-[11px]">
                              <div className="flex justify-between">
                                <span>{t.youLabel}: {myProg}%</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={myProg}
                                  onChange={(e) => updateSharedGoalProgress(sg, e.target.value)}
                                  className="w-28"
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span>{partnerName}: {partnerProg}%</span>
                                <div className="w-28 h-2 rounded-full overflow-hidden bg-black/20">
                                  <div className="h-full bg-emerald-500" style={{ width: `${partnerProg}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Private 1-on-1 Direct Messaging */}
              <div className="p-5 rounded-3xl border space-y-4" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span>{t.privateDMsTitle} ({friends.length} {t.friendsCountLabel})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    {friends.length === 0 ? (
                      <p className="text-xs p-3" style={{ color: currentTheme.muted }}>
                        {t.friendsListEmpty}
                      </p>
                    ) : (
                      friends.map(f => (
                        <button
                          key={f.uid}
                          onClick={() => setSelectedChatFriend(f)}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl border text-start transition-all"
                          style={{
                            backgroundColor: selectedChatFriend?.uid === f.uid ? 'var(--accent)' : currentTheme.surface2,
                            color: selectedChatFriend?.uid === f.uid ? '#ffffff' : currentTheme.text,
                            borderColor: currentTheme.border
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center font-bold text-xs">
                            {f.displayName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold truncate">{f.displayName}</span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="md:col-span-2 rounded-2xl border p-4 flex flex-col h-64" style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}>
                    {!selectedChatFriend ? (
                      <div className="flex-1 flex items-center justify-center text-xs text-center" style={{ color: currentTheme.muted }}>
                        {t.selectFriendChat}
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                          {activeChatMessages.map(m => (
                            <div key={m.id} className={`flex ${m.senderUid === user?.uid ? 'justify-end' : 'justify-start'}`}>
                              <div
                                dir="auto"
                                className="px-3.5 py-2 rounded-2xl text-xs max-w-[75%]"
                                style={{
                                  backgroundColor: m.senderUid === user?.uid ? 'var(--accent)' : currentTheme.surface,
                                  color: m.senderUid === user?.uid ? '#ffffff' : currentTheme.text
                                }}
                              >
                                {m.text}
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendDirectMessage} className="flex gap-2 pt-2">
                          <input
                            type="text"
                            placeholder={`${t.messagePlaceholder} ${selectedChatFriend.displayName}...`}
                            value={dmInput}
                            onChange={(e) => setDmInput(e.target.value)}
                            dir="auto"
                            className="flex-1 px-3 py-2 rounded-xl border text-xs outline-none"
                            style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: currentTheme.text }}
                          />
                          <button type="submit" className="px-3.5 py-2 rounded-xl text-white" style={{ backgroundColor: 'var(--accent)' }}>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Public Diary & Artwork Feed */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span>{t.publicFeedTitle}</span>
                </h3>

                {publicDiaries.length === 0 ? (
                  <div className="p-8 rounded-3xl border text-center" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                    <p className="text-sm" style={{ color: currentTheme.muted }}>
                      {t.publicFeedEmpty}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publicDiaries.map(post => {
                      const likes = Array.isArray(post.likes) ? post.likes : [];
                      const comments = Array.isArray(post.comments) ? post.comments : [];
                      const isLiked = user && likes.includes(user.uid);

                      return (
                        <div
                          key={post.id}
                          className="p-6 rounded-3xl border space-y-4"
                          style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {post.authorAvatar ? (
                                <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--accent)' }}>
                                  {(post.authorName || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold">{post.authorName}</p>
                                <p className="text-[11px]" style={{ color: currentTheme.muted }}>
                                  {new Date(post.createdAt).toLocaleString()} • {post.mood}
                                </p>
                              </div>
                            </div>
                            {post.authorUid === user?.uid && (
                              <button
                                onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'public_diaries', post.id))}
                                className="text-rose-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <h4 className="font-bold text-lg" dir="auto">{post.title}</h4>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed" dir="auto">{post.body}</p>

                          {post.artwork && (
                            <img src={post.artwork} alt="Artwork" className="max-h-80 rounded-2xl border" style={{ borderColor: currentTheme.border }} />
                          )}
                          {post.photo && (
                            <img src={post.photo} alt="Photo" className="max-h-80 rounded-2xl border" style={{ borderColor: currentTheme.border }} />
                          )}

                          {/* Like & Reply Actions */}
                          <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: currentTheme.border }}>
                            <button
                              onClick={() => toggleLikePublicDiary(post)}
                              className="flex items-center gap-1.5 text-xs font-semibold transition-transform active:scale-125"
                              style={{ color: isLiked ? '#ec4899' : currentTheme.muted }}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
                              <span>{likes.length} {t.likesLabel}</span>
                            </button>
                            <span className="flex items-center gap-1.5 text-xs" style={{ color: currentTheme.muted }}>
                              <MessageSquare className="w-4 h-4" />
                              <span>{comments.length} {t.repliesLabel}</span>
                            </span>
                          </div>

                          {/* Comments Thread */}
                          <div className="space-y-2">
                            {comments.map(c => (
                              <div key={c.id} className="p-2.5 rounded-xl text-xs" style={{ backgroundColor: currentTheme.surface2 }}>
                                <span className="font-bold mx-1.5">{c.authorName}:</span>
                                <span dir="auto">{c.text}</span>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder={t.replyPlaceholder}
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                dir="auto"
                                className="flex-1 px-3.5 py-2 rounded-xl border text-xs outline-none"
                                style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                              />
                              <button
                                onClick={() => addCommentPublicDiary(post)}
                                className="px-4 py-2 rounded-xl text-white text-xs font-semibold"
                                style={{ backgroundColor: 'var(--accent)' }}
                              >
                                {t.replyBtn}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 8: USER PROFILE, AVATAR UPLOAD & CUSTOM CODE SETTINGS        */}
          {/* ================================================================ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{t.profileTitle}</h2>
                  <p className="text-sm" style={{ color: currentTheme.muted }}>
                    {t.profileSub}
                  </p>
                </div>
                <button
                  onClick={handleToggleLanguage}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border"
                  style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: 'var(--accent)' }}
                >
                  <Languages className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl border space-y-5" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border }}>
                <div className="flex items-center gap-4">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: 'var(--accent)' }} />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {profile.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>{t.uploadPhotoBtn}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                    <p className="text-xs" style={{ color: currentTheme.muted }}>
                      @{profile.friendCode}
                    </p>
                  </div>
                </div>

                {/* Custom Friend Code Picker inside Profile */}
                <div className="p-4 rounded-2xl border space-y-2" style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold">{t.yourFriendCode}</label>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        codeValidationStatus === 'available' || codeValidationStatus === 'current'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {codeValidationStatus === 'taken'
                        ? t.codeTaken
                        : codeValidationStatus === 'invalid'
                        ? t.codeInvalid
                        : t.codeAvailable}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={16}
                      value={customCodeInput}
                      onChange={(e) => setCustomCodeInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))}
                      placeholder={t.customizeCodePlaceholder}
                      className="flex-1 px-3.5 py-2 rounded-xl border font-mono font-bold text-sm uppercase outline-none"
                      style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.border, color: 'var(--accent)' }}
                    />
                    <button
                      type="button"
                      onClick={handleClaimCustomFriendCode}
                      disabled={savingCode || (codeValidationStatus !== 'available' && codeValidationStatus !== 'current')}
                      className="px-4 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-40"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      {t.claimCodeBtn}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: currentTheme.muted }}>{t.displayNameLabel}</label>
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: currentTheme.muted }}>{t.bioLabel}</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border, color: currentTheme.text }}
                    />
                  </div>
                  <button
                    onClick={() => handleSaveProfile({ displayName: profile.displayName, bio: profile.bio })}
                    className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {t.saveProfileBtn}
                  </button>
                </div>

                <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: currentTheme.border }}>
                  <div>
                    <p className="text-xs font-bold">{t.accountStatus}</p>
                    <p className="text-xs" style={{ color: currentTheme.muted }}>
                      {user?.isAnonymous ? t.guestStatusDesc : `${t.signedInAs} ${user?.email}`}
                    </p>
                  </div>
                  {user?.isAnonymous ? (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t.signIn} / {t.signUp}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border text-rose-400"
                      style={{ backgroundColor: currentTheme.surface2, borderColor: currentTheme.border }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.signOut}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
