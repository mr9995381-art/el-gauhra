export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation
    nav_home: 'الرئيسية',
    nav_about: 'من نحن',
    nav_courses: 'الكورسات',
    nav_faq: 'الأسئلة الشائعة',
    nav_contact: 'تواصل معنا',
    nav_master_login: 'دخول المستر',
    nav_student_view: 'معاينة الطالب',
    nav_master_dashboard: 'لوحة المستر',
    nav_student_dashboard: 'لوحتي التعليمية',
    nav_logout: 'تسجيل الخروج',
    nav_login: 'تسجيل الدخول',
    nav_get_started: 'ابدأ الآن',
    nav_login_register: 'تسجيل الدخول / الاشتراك',
    
    // Theme & Language
    theme_light: 'الوضع الفاتح',
    theme_dark: 'الوضع الداكن',
    lang_ar: 'العربية',
    lang_en: 'English',
    lang_switch: 'اللغة',

    // Hero & Home
    hero_badge: 'المنصة الأولى المعتمدة لتعليم اللغة الإنجليزية 🇬🇧',
    hero_title_1: 'منصة مستر عبدالله سيد التعليمية',
    hero_title_highlight: 'نحو القمة والدرجة النهائية',
    hero_title_2: 'في اللغة الإنجليزية للمرحلتين الإعدادية والثانوية',
    hero_subtitle: 'المنظومة التعليمية الرقمية الأقوى لخبير اللغة الإنجليزية مستر عبدالله سيد. كبسولات الجرامر، بنك الأسئلة الشامل، فنيات الترجمة والقطع المتحررة، مع متابعة شخصية واختبارات دورية تحاكي أحدث مواصفات الامتحانات.',
    hero_btn_start: 'ابدأ رحلة التفوق الآن',
    hero_btn_courses: 'استكشف كورسات ومحاضرات الإنجليزي',
    hero_stat_students: 'طالب وطالبة متفوقين',
    hero_stat_lessons: 'محاضرة ومذكرة معتمدة',
    hero_stat_success: 'نسبة تفوق أوائل الطلاب',
    hero_stat_support: 'دعم ومتابعة مستمرة',

    // Features Section
    features_title: 'لماذا منصة مستر عبدالله سيد هي اختيارك الأفضل؟',
    features_subtitle: 'نوفر للطالب بيئة تعليمية متكاملة تضمن إتقان الجرامر والكلمات والترجمة وأساليب حل الامتحانات بأحدث التقنيات.',
    feat_1_title: 'كبسولات الجرامر السحرية',
    feat_1_desc: 'تفكيك وتبسيط قواعد وأزمنة اللغة الإنجليزية التراكمية بأسلوب مبتكر يثبت في الذاكرة.',
    feat_2_title: 'اختبارات وكويزات تفاعلية فورية',
    feat_2_desc: 'امتحانات دورية تحاكي مواصفات الامتحان النهائي مع تصحيح إلكتروني وتفسير لكل إجابة.',
    feat_3_title: 'سلسلة مذكرات The Master بصيغة PDF',
    feat_3_desc: 'مذكرات الشرح وبنك الأسئلة وتوقعات ليلة الامتحان قابلة للتحميل والطباعة بجودة فائقة.',
    feat_4_title: 'مشغل حصص متطور وآمن',
    feat_4_desc: 'مشاهدة سلسة على جميع الأجهزة مع علامة مائية ذكية لحماية المحتوى وخصوصية الطالب.',
    feat_5_title: 'دعم وتواصل مستمر مع المستر',
    feat_5_desc: 'تواصل مباشر مع مستر عبدالله سيد وفريق المساعدين للإجابة عن أسئلتك اللغوية على مدار الساعة.',
    feat_6_title: 'بوابة متابعة ولي الأمر',
    feat_6_desc: 'نظام متكامل لولي الأمر للاطلاع على التزام الطالب ونسب حضوره ودرجات امتحاناته أولاً بأول.',

    // Courses & Grades Section
    grades_title: 'المراحل والصفوف الدراسية',
    grades_subtitle: 'محتوى مخصص ومصمم بدقة للشهادة الثانوية والإعدادية في اللغة الإنجليزية',
    grade_prep_1: 'الصف الأول الإعدادي',
    grade_prep_2: 'الصف الثاني الإعدادي',
    grade_prep_3: 'الصف الثالث الإعدادي',
    grade_sec_1: 'الصف الأول الثانوي',
    grade_sec_2: 'الصف الثاني الثانوي',
    grade_sec_3: 'الصف الثالث الثانوي',
    sys_general: 'التعليم العام',
    sys_azhar: 'التعليم الأزهري',
    sys_languages: 'مدارس اللغات',
    sys_other: 'أنظمة أخرى',
    stage_prep: 'المرحلة الإعدادية',
    stage_sec: 'المرحلة الثانوية',

    // Course Card
    course_lessons_count: 'دروس ومذكرات',
    course_view_btn: 'عرض الكورس والدروس',
    course_no_courses: 'لا توجد كورسات مضافة لهذا الصف حالياً.',

    // Why Section
    why_title: 'عن مستر عبدالله سيد وخبرته الأكاديمية',
    why_desc_1: 'خبير ومحاضر أول مادة اللغة الإنجليزية بخبرة تزيد عن 12 عاماً في إعداد أوائل الجمهورية والمحافظات.',
    why_desc_2: 'أسلوب مبتكر يعتمد على الفهم والتحليل وحل آلاف الأسئلة ونماذج امتحانات السنوات السابقة بدقة.',
    why_desc_3: 'متابعة دورية مستمرة مع الطلاب وأولياء الأمور لضمان ثبات التفوق والحصول على الدرجة النهائية (Full Mark).',

    // CTA
    cta_title: 'جاهز لتحقيق الدرجة النهائية في اللغة الإنجليزية؟',
    cta_subtitle: 'انضم الآن لآلاف الطلاب المتفوقين مع مستر عبدالله سيد وابدأ رحلتك نحو القمة والدرجة النهائية.',
    cta_btn: 'انشئ حسابك وابدأ الآن',

    // About Page
    about_title: 'عن منصة مستر عبدالله سيد التعليمية',
    about_bio_title: 'خبير أول ومحاضر مادة اللغة الإنجليزية',
    about_bio_p1: 'منصة مستر عبدالله سيد هي المنظومة التعليمية الرقمية المتخصصة لطلاب المرحلة الإعدادية والثانوية لدراسة اللغة الإنجليزية بأسهل وأشمل طريقة.',
    about_bio_p2: 'يقود المنصة مستر عبدالله سيد، صاحب سلسلة مذكرات The Master ومبتكر كبسولات الجرامر وفنيات الترجمة والقطع المتحررة.',
    about_values_title: 'قيمنا ورسالتنا التعليمية',
    val_1_title: 'التبسيط والابتكار',
    val_1_desc: 'تفكيك القواعد المعقدة وتحويلها إلى مهارات سهلة وممتعة للطالب.',
    val_2_title: 'التدريب الامتحاني المكثف',
    val_2_desc: 'حل مئات الأسئلة التطبيقية ونماذج الامتحانات المعتمدة ونماذج الوزارة.',
    val_3_title: 'المتابعة والتفوق المستمر',
    val_3_desc: 'شراكة حقيقية مع الطالب وولي الأمر لضمان الانضباط والوصول للدرجة النهائية.',

    // Contact Page
    contact_title: 'تواصل مع مستر عبدالله سيد',
    contact_subtitle: 'فريق الدعم الفني والأكاديمي في خدمتكم على مدار الساعة للإجابة عن كافة الاستفسارات وحجز الكورسات.',
    contact_info_title: 'معلومات التواصل المباشرة',
    contact_whatsapp: 'واتساب المنصة والمستر',
    contact_phone: 'الخط الساخن والاتصال',
    contact_email: 'البريد الإلكتروني الرسمي',
    contact_location: 'جمهورية مصر العربية',
    contact_form_title: 'أرسل لنا استفسارك أو طلبك',
    contact_form_name: 'اسم الطالب / ولي الأمر',
    contact_form_phone: 'رقم الهاتف (واتساب)',
    contact_form_subject: 'المرحلة الدراسية / الموضوع',
    contact_form_msg: 'نص الرسالة أو الاستفسار',
    contact_form_send: 'إرسال الرسالة',
    contact_form_success: 'تم استلام رسالتك بنجاح! سيتواصل معك فريق مستر عبدالله سيد فوراً.',

    // FAQ Page
    faq_title: 'الأسئلة الشائعة حول المنصة وكورسات الإنجليزي',
    faq_subtitle: 'إجابات شاملة على كافة تساؤلات طلاب وأولياء أمور المنصة.',

    // Terms & Privacy
    terms_title: 'الشروط والأحكام - منصة مستر عبدالله سيد',
    privacy_title: 'سياسة الخصوصية وحماية المحتوى',

    // Footer
    footer_platform_name: 'منصة مستر عبدالله سيد للغة الإنجليزية',
    footer_desc: 'المنصة التعليمية الأولى لطلاب الشهادة الثانوية والإعدادية مع خبير اللغة الإنجليزية مستر عبدالله سيد.',
    footer_quick_links: 'روابط سريعة',
    footer_contact_info: 'تواصل مع مستر عبدالله سيد',
    footer_rights: 'جميع الحقوق محفوظة منصة مستر عبدالله سيد التعليمية ©',
    footer_dev_by: 'Mr. Abdullah Sayed Platform',

    // Auth Modal & Onboarding
    auth_login_tab: 'تسجيل الدخول',
    auth_register_tab: 'إنشاء حساب جديد',
    auth_master_tab: 'دخول المستر',
    auth_google_btn: 'تسجيل الدخول بـ Google',
    auth_email_label: 'البريد الإلكتروني',
    auth_pass_label: 'كلمة المرور',
    auth_name_label: 'الاسم الثلاثي للطالب',
    auth_phone_label: 'رقم هاتف الطالب',
    auth_parent_phone_label: 'رقم هاتف ولي الأمر',
    auth_sys_label: 'نظام التعليم',
    auth_stage_label: 'المرحلة الدراسية',
    auth_grade_label: 'الصف الدراسي',
    auth_submit_login: 'دخول الحساب',
    auth_submit_register: 'إنشاء الحساب الآن',
    auth_passcode_label: 'رمز دخول المستر (Passcode)',
    auth_passcode_placeholder: 'أدخل الرمز الخاص بـ مستر عبدالله',
    auth_passcode_submit: 'تأكيد الدخول بصلحية المستر',
    auth_invalid_passcode: 'رمز دخول المستر غير صحيح!',

    // Student Onboarding Modal
    onboarding_title: 'استكمال بيانات حساب الطالب',
    onboarding_subtitle: 'يرجى إكمال بياناتك الأساسية لتفعيل حسابك وعرض المحتوى المناسب لصفك ونظامك الدراسي.',
    onboarding_save_btn: 'حفظ وتأكيد البيانات',

    // Student Dashboard
    sd_welcome: 'أهلاً بك يا بطل',
    sd_active_sub: 'اشتراكك مفعل ونشط',
    sd_pending_sub: 'طلب الاشتراك قيد المراجعة لدى المستر',
    sd_no_sub: 'حسابك غير مفعل حالياً - يرجى تفعيل كود الاشتراك أو طلب التفعيل',
    sd_enter_code: 'تفعيل كود الاشتراك',
    sd_code_placeholder: 'أدخل كود الاشتراك المكون من أرقام وحروف',
    sd_code_submit: 'تفعيل الكود',
    sd_request_sub_btn: 'إرسال طلب اشتراك للمستر',
    sd_sub_req_sent: 'تم إرسال طلب الاشتراك بنجاح',
    
    // Student Tabs
    tab_courses: 'الكورسات والدروس',
    tab_memos: 'المذكرات والملخصات',
    tab_tests: 'سجل الاختبارات',
    tab_sub: 'الاشتراك والتفعيل',
    tab_announcements: 'الإشعارات والتنويهات',

    // Test Solver
    test_title: 'اختبار إلكتروني',
    test_submit_btn: 'إنهاء وتصحيح الاختبار',
    test_score_title: 'نتيجة الاختبار',
    test_score_msg: 'لقد حصلت على',
    test_out_of: 'من',
    test_review_btn: 'مراجعة الإجابات والحلول',
    test_close_btn: 'إغلاق',

    // Master Dashboard
    md_title: 'لوحة تحكم مستر عبدالله سيد',
    md_tab_stats: 'الإحصائيات العامة',
    md_tab_students: 'إدارة الطلاب',
    md_tab_content: 'المحتوى والدروس',
    md_tab_tests: 'الاختبارات الإلكترونية',
    md_tab_sub_reqs: 'طلبات الاشتراك',
    md_tab_codes: 'أكواد التفعيل',
    md_tab_announcements: 'التنويهات والإشعارات',
    md_tab_settings: 'إعدادات النظام',

    // Master Controls
    md_add_course: 'إضافة كورس جديد',
    md_add_unit: 'إضافة وحدة جيدة',
    md_add_lesson: 'إضافة درس جديد',
    md_add_test: 'إضافة اختبار جديد',
    md_add_announcement: 'إضافة تنويه جديد',
    md_gen_codes: 'توليد أكواد تفعيل جديدة',
    md_search_student: 'ابحث باسم الطالب أو رقم الهاتف...',
    md_approve: 'قبول وتفعيل',
    md_reject: 'رفض',
    md_edit: 'تعديل',
    md_delete: 'حذف',
    md_save: 'حفظ التغييرات',
    md_cancel: 'إلغاء',
    md_total_students: 'إجمالي الطلاب المسجلين',
    md_active_subs: 'الاشتراكات النشطة',
    md_pending_reqs: 'الطلبات قيد الانتظار',
    md_total_courses: 'عدد الكورسات والدروس',

    // Toast Messages
    toast_success: 'تمت العملية بنجاح',
    toast_error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    toast_login_success: 'تم تسجيل الدخول بنجاح!',
    toast_logout_success: 'تم تسجيل الخروج بنجاح.',
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_courses: 'Courses',
    nav_faq: 'FAQ',
    nav_contact: 'Contact Us',
    nav_master_login: 'Teacher Login',
    nav_student_view: 'Student View',
    nav_master_dashboard: 'Teacher Dashboard',
    nav_student_dashboard: 'My Dashboard',
    nav_logout: 'Logout',
    nav_login: 'Sign In',
    nav_get_started: 'Get Started',
    nav_login_register: 'Sign In / Register',
    
    // Theme & Language
    theme_light: 'Light Mode',
    theme_dark: 'Dark Mode',
    lang_ar: 'العربية',
    lang_en: 'English',
    lang_switch: 'Language',

    // Hero & Home
    hero_badge: '#1 Educational Platform for English Language',
    hero_title_1: 'Your Path to Excellence & Top Marks in',
    hero_title_highlight: 'English Language',
    hero_title_2: 'with Mr. Abdullah Sayed',
    hero_subtitle: 'Comprehensive interactive platform for Preparatory & Secondary students across all education systems. Clear explanations, intensive practice, and instant online quizzes.',
    hero_btn_start: 'Start Your Journey Now',
    hero_btn_courses: 'Explore Available Courses',
    hero_stat_students: 'Students Registered',
    hero_stat_lessons: 'Lessons & Notes',
    hero_stat_success: 'Success Rate',
    hero_stat_support: 'Continuous Support',

    // Features Section
    features_title: 'Why Choose Mr. Abdullah Sayed Platform?',
    features_subtitle: 'We provide a complete modern learning environment to help you master English effortlessly.',
    feat_1_title: 'Clear & Professional Teaching',
    feat_1_desc: 'Full curriculum and grammar coverage with intensive exercises and easy techniques.',
    feat_2_title: 'Instant Online Quizzes',
    feat_2_desc: 'Automated instant grading showing your final score and step-by-step model answers.',
    feat_3_title: 'PDF Summaries & Worksheets',
    feat_3_desc: 'Comprehensive downloadable notes and study materials accessible anytime.',
    feat_4_title: 'Multi-Device Access',
    feat_4_desc: 'Access your lessons seamlessly across all your devices without restrictions.',
    feat_5_title: 'Continuous Support',
    feat_5_desc: 'Direct interaction with Mr. Abdullah and support staff to answer all your queries.',
    feat_6_title: 'Parent Progress Monitoring',
    feat_6_desc: 'Accurate periodic reports to track student performance and quiz results.',

    // Courses & Grades Section
    grades_title: 'Select Your Grade & Start Learning',
    grades_subtitle: 'Meticulously crafted educational content for each grade and stage',
    grade_prep_1: 'Preparatory Grade 1 (Prep 1)',
    grade_prep_2: 'Preparatory Grade 2 (Prep 2)',
    grade_prep_3: 'Preparatory Grade 3 (Prep 3)',
    grade_sec_1: 'Secondary Grade 1 (Sec 1)',
    grade_sec_2: 'Secondary Grade 2 (Sec 2)',
    grade_sec_3: 'Secondary Grade 3 (Sec 3)',
    sys_general: 'General Education',
    sys_azhar: 'Al-Azhar Education',
    sys_languages: 'Language Schools',
    sys_other: 'Other Systems',
    stage_prep: 'Preparatory Stage',
    stage_sec: 'Secondary Stage',

    // Course Card
    course_lessons_count: 'Lessons & Notes',
    course_view_btn: 'View Course & Lessons',
    course_no_courses: 'No courses added for this grade yet.',

    // Why Section
    why_title: 'About Mr. Abdullah Sayed',
    why_desc_1: 'Extensive experience in teaching English language for Thanawya Amma, Azhar, and Language Schools.',
    why_desc_2: 'An innovative teaching methodology built on deep understanding rather than memorization, simplifying complex grammar.',
    why_desc_3: 'Continuous student evaluations and comprehensive unit reviews to ensure top academic achievement.',

    // CTA
    cta_title: 'Ready to Score Full Marks in English?',
    cta_subtitle: 'Join thousands of top-performing students today and achieve academic success.',
    cta_btn: 'Create Account & Register Now',

    // About Page
    about_title: 'About Mr. Abdullah Sayed & The Platform',
    about_bio_title: 'Biography & Educational Vision',
    about_bio_p1: 'Mr. Abdullah Sayed is a specialized English language educator and lecturer with vast experience in teaching Egyptian curricula across all Preparatory and Secondary stages.',
    about_bio_p2: 'The platform aims to provide a modern digital learning experience combining flexibility and interactivity, allowing students to absorb vocabulary and grammar effortlessly.',
    about_values_title: 'Our Core Values',
    val_1_title: 'Simplification',
    val_1_desc: 'Explaining complex grammar with clean visual techniques for easy retention.',
    val_2_title: 'Continuous Practice',
    val_2_desc: 'Solving hundreds of exam questions, previous year papers, and governorate tests.',
    val_3_title: 'Follow-up & Discipline',
    val_3_desc: 'Regular tracking of attendance and test outcomes to keep students motivated.',

    // Contact Page
    contact_title: 'Contact Us',
    contact_subtitle: 'We are here to assist you with any questions regarding courses, subscriptions, or technical support.',
    contact_info_title: 'Direct Contact Details',
    contact_whatsapp: 'WhatsApp Support',
    contact_phone: 'Mobile Phone',
    contact_email: 'Email Address',
    contact_location: 'Location / Governorate',
    contact_form_title: 'Send Us a Direct Message',
    contact_form_name: 'Full Name',
    contact_form_phone: 'Phone Number (WhatsApp)',
    contact_form_subject: 'Subject',
    contact_form_msg: 'Your Message',
    contact_form_send: 'Send Message',
    contact_form_success: 'Your message was sent successfully! We will contact you shortly.',

    // FAQ Page
    faq_title: 'Frequently Asked Questions',
    faq_subtitle: 'Answers to common inquiries regarding the platform, subscriptions, and courses.',

    // Terms & Privacy
    terms_title: 'Terms of Service',
    privacy_title: 'Privacy Policy',

    // Footer
    footer_quick_links: 'Quick Links',
    footer_contact_info: 'Contact Info',
    footer_rights: 'All Rights Reserved. Mr. Abdullah Sayed Platform.',
    footer_dev_by: 'Designed & Developed by',

    // Auth Modal & Onboarding
    auth_login_tab: 'Sign In',
    auth_register_tab: 'Register New Account',
    auth_master_tab: 'Teacher Access',
    auth_google_btn: 'Sign In with Google',
    auth_email_label: 'Email Address',
    auth_pass_label: 'Password',
    auth_name_label: 'Student Full Name',
    auth_phone_label: 'Student Phone Number',
    auth_parent_phone_label: 'Parent Phone Number',
    auth_sys_label: 'Education System',
    auth_stage_label: 'Education Stage',
    auth_grade_label: 'Grade Level',
    auth_submit_login: 'Sign In',
    auth_submit_register: 'Create Account Now',
    auth_passcode_label: 'Teacher Passcode',
    auth_passcode_placeholder: 'Enter Mr. Abdullah passcode',
    auth_passcode_submit: 'Confirm Teacher Access',
    auth_invalid_passcode: 'Invalid Teacher Passcode!',

    // Student Onboarding Modal
    onboarding_title: 'Complete Student Account Profile',
    onboarding_subtitle: 'Please complete your basic profile information to activate your account and view content tailored to your grade.',
    onboarding_save_btn: 'Save & Confirm Details',

    // Student Dashboard
    sd_welcome: 'Welcome, Hero',
    sd_active_sub: 'Your subscription is Active',
    sd_pending_sub: 'Subscription request is under review',
    sd_no_sub: 'Account is currently inactive - Please enter activation code or request activation',
    sd_enter_code: 'Activate Subscription Code',
    sd_code_placeholder: 'Enter activation code',
    sd_code_submit: 'Activate Code',
    sd_request_sub_btn: 'Send Subscription Request to Teacher',
    sd_sub_req_sent: 'Subscription request sent successfully',

    // Student Tabs
    tab_courses: 'Courses & Lessons',
    tab_memos: 'Memorandums & PDFs',
    tab_tests: 'Test History',
    tab_sub: 'Subscription & Activation',
    tab_announcements: 'Announcements & Alerts',

    // Test Solver
    test_title: 'Online Quiz',
    test_submit_btn: 'Finish & Submit Quiz',
    test_score_title: 'Quiz Result',
    test_score_msg: 'You scored',
    test_out_of: 'out of',
    test_review_btn: 'Review Answers',
    test_close_btn: 'Close',

    // Master Dashboard
    md_title: 'Mr. Abdullah Sayed Control Panel',
    md_tab_stats: 'Overview Statistics',
    md_tab_students: 'Student Management',
    md_tab_content: 'Content & Lessons',
    md_tab_tests: 'Online Quizzes',
    md_tab_sub_reqs: 'Subscription Requests',
    md_tab_codes: 'Activation Codes',
    md_tab_announcements: 'Announcements',
    md_tab_settings: 'System Settings',

    // Master Controls
    md_add_course: 'Add New Course',
    md_add_unit: 'Add New Unit',
    md_add_lesson: 'Add New Lesson',
    md_add_test: 'Add New Quiz',
    md_add_announcement: 'Add New Announcement',
    md_gen_codes: 'Generate Activation Codes',
    md_search_student: 'Search by student name or phone number...',
    md_approve: 'Approve & Activate',
    md_reject: 'Reject',
    md_edit: 'Edit',
    md_delete: 'Delete',
    md_save: 'Save Changes',
    md_cancel: 'Cancel',
    md_total_students: 'Total Enrolled Students',
    md_active_subs: 'Active Subscriptions',
    md_pending_reqs: 'Pending Requests',
    md_total_courses: 'Total Courses & Lessons',

    // Toast Messages
    toast_success: 'Operation completed successfully',
    toast_error: 'An error occurred, please try again',
    toast_login_success: 'Signed in successfully!',
    toast_logout_success: 'Signed out successfully.',
  }
};

export type TranslationKey = keyof typeof translations['ar'];
