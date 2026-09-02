export type CourseInfo = {
  slug: string;
  title: string;
  arabicTitle: string;
  tagline: string;
  image: string;
  verseArabic: string;
  verseTranslation: string;
  verseRef: string;
  description: string[];
  audience: string;
  formats: string;
  learn: { title: string; summary: string }[];
  fees: { label: string; detail: string }[];
  isFree?: boolean;
};

export const COURSES: CourseInfo[] = [
  {
    slug: "qaidah",
    title: "Qa'idah",
    arabicTitle: "القاعدة",
    tagline: "Your first step to reading the Qur'an — from the alphabet to fluent recognition.",
    image: "/images/qaidah.jpg",
    verseArabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    verseTranslation: "Read in the name of your Lord who created.",
    verseRef: "Surah Al-‘Alaq 96:1",
    description: [
      "Qa'idah is the foundation of everything that follows. Using the trusted Ahsanul Qawa'id method, our teachers take complete beginners from recognising the Arabic letters to reading Qur'anic words and sentences with confidence.",
      "Because every teacher speaks English as a first language, each rule is explained clearly and simply — no guessing, no rote repetition without understanding. Lessons are patient, structured and paced to the student, whether they are five years old or fifty.",
    ],
    audience:
      "Complete beginners of any age — children starting their Qur'an journey and adults who never had the chance, or who want to rebuild their foundations properly. Classes for children and adults are kept separate.",
    formats: "Group classes (Mon–Thu, including a weekly revision class) or one-to-one lessons.",
    learn: [
      { title: "The Arabic alphabet", summary: "Recognising and pronouncing every letter correctly, in all its shapes and positions." },
      { title: "Harakaat (vowel signs)", summary: "Fathah, kasrah and dammah — joining letters into syllables and words." },
      { title: "Madd & leen letters", summary: "Lengthening sounds correctly and reading elongated words with ease." },
      { title: "Sukoon, tanween & shaddah", summary: "Reading compound words fluently with all the essential signs." },
      { title: "Practical reading", summary: "Applying every rule to real Qur'anic words, phrases and short surahs." },
      { title: "Reading fluency", summary: "Graduating ready to begin Qur'an recitation with tajweed." },
    ],
    fees: [
      { label: "Group classes (Mon–Thu)", detail: "£48 per month — 5 classes a week including a revision class" },
      { label: "One-to-one", detail: "£15 per hour" },
    ],
  },
  {
    slug: "tajweed",
    title: "Tajweed & Qur'an Recitation",
    arabicTitle: "التجويد",
    tagline: "Recite the Qur'an the way it was revealed — with precision, beauty and understanding.",
    image: "/images/tajweed.jpg",
    verseArabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    verseTranslation: "And recite the Qur'an with measured recitation.",
    verseRef: "Surah Al-Muzzammil 73:4",
    description: [
      "Tajweed is the science of reciting the Qur'an correctly — giving every letter its right and its due. This course takes students who can already read Arabic and refines their recitation until the rules become second nature.",
      "Our qualified teachers correct your recitation live, explain the reasoning behind every rule in clear English, and build a lasting relationship between you and the Book of Allah.",
    ],
    audience:
      "Anyone who has completed Qa'idah or can already read the Qur'an and wants to recite it correctly and beautifully. Adults and children learn in separate classes.",
    formats: "Group classes (Mon–Thu, including a weekly revision class) or one-to-one lessons.",
    learn: [
      { title: "Makharij al-huroof", summary: "The precise articulation points of every Arabic letter." },
      { title: "Sifaat al-huroof", summary: "The characteristics of the letters — heavy and light, strong and soft." },
      { title: "Rules of noon & meem", summary: "Ikhfa, idghaam, iqlab, izhaar and the rules of noon sakinah and meem sakinah." },
      { title: "Rules of madd", summary: "The types of elongation and when each applies." },
      { title: "Waqf & ibtidaa", summary: "Where to stop, where to begin, and how it affects meaning." },
      { title: "Fluent recitation", summary: "Regular recitation to your teacher with live correction, working through the Qur'an." },
    ],
    fees: [
      { label: "Group classes (Mon–Thu)", detail: "£48 per month — 5 classes a week including a revision class" },
      { label: "One-to-one", detail: "£15 per hour" },
    ],
  },
  {
    slug: "arabic",
    title: "Arabic Language",
    arabicTitle: "اللغة العربية",
    tagline: "Understand the language of the Qur'an — grammar, vocabulary and conversation.",
    image: "/images/arabic.jpg",
    verseArabic: "إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ",
    verseTranslation: "Indeed, We have sent it down as an Arabic Qur'an so that you may understand.",
    verseRef: "Surah Yusuf 12:2",
    description: [
      "There is nothing like the moment the Qur'an begins to speak to you directly, without translation. Our Arabic Language course builds genuine comprehension — grammar, vocabulary, and the confidence to read and understand classical texts.",
      "Taught by teachers fluent in both Arabic and English, the course moves step by step from the building blocks of the language towards reading real Qur'anic and classical passages with understanding.",
    ],
    audience:
      "Adults and older children who can read Arabic script and want to understand what they read. No prior grammar knowledge needed.",
    formats: "Weekend group classes (Saturday & Sunday) or one-to-one lessons.",
    learn: [
      { title: "Foundations", summary: "Nouns, verbs and particles — how Arabic sentences are built." },
      { title: "Essential vocabulary", summary: "High-frequency Qur'anic vocabulary that unlocks the majority of the text." },
      { title: "Sarf (morphology)", summary: "Verb patterns and word derivation — the engine room of Arabic." },
      { title: "Nahw (grammar)", summary: "I'raab, sentence structure and the classical rules of the language." },
      { title: "Reading practice", summary: "Applying grammar to Qur'anic verses, ahadith and simple classical texts." },
      { title: "Expression", summary: "Building towards writing and speaking in clear, correct Arabic." },
    ],
    fees: [
      { label: "Weekend group (Sat & Sun)", detail: "£38 per month — 2 classes a week" },
      { label: "One-to-one", detail: "£15 per hour" },
    ],
  },
  {
    slug: "hifz",
    title: "Hifz al-Qur'an",
    arabicTitle: "حفظ القرآن",
    tagline: "Memorise the Book of Allah with a personal teacher, a proven method and steady revision.",
    image: "/images/hifz.jpg",
    verseArabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    verseTranslation: "And We have certainly made the Qur'an easy to remember — so is there anyone who will remember?",
    verseRef: "Surah Al-Qamar 54:17",
    description: [
      "Memorising the Qur'an is a journey of years, and it deserves a teacher who walks it with you personally. That is why our Hifz programme is one-to-one only: every lesson is your lesson, paced to your memory, your schedule and your goals.",
      "Your teacher sets daily sabaq (new memorisation), sabqi (recent revision) and manzil (long-term revision), listens to every line, and keeps your old memorisation as strong as your new. Progress is tracked in your student portal so you always know where you stand.",
    ],
    audience:
      "Dedicated students — children and adults — who can already recite fluently with tajweed and are ready to commit to regular memorisation and daily revision.",
    formats: "One-to-one only, so every minute of the lesson is spent on your memorisation.",
    learn: [
      { title: "A personal hifz plan", summary: "Realistic targets built around your pace, from Juz 'Amma to the complete Qur'an." },
      { title: "Sabaq — new lesson", summary: "Daily new memorisation, recited to your teacher and perfected." },
      { title: "Sabqi — recent revision", summary: "Consolidating the last few pages so new hifz becomes firm." },
      { title: "Manzil — long-term revision", summary: "A rotating cycle that keeps everything you have memorised strong." },
      { title: "Tajweed maintenance", summary: "Ongoing correction so memorisation never comes at the cost of recitation." },
      { title: "Completion & beyond", summary: "Khatm of your goal, and a revision routine that lasts a lifetime." },
    ],
    fees: [{ label: "One-to-one (only format)", detail: "£15 per hour" }],
  },
  {
    slug: "islamic-studies",
    title: "Islamic Studies",
    arabicTitle: "العلوم الإسلامية",
    tagline: "Aqeedah, fiqh, seerah and akhlaq — a rounded Islamic education in clear English.",
    image: "/images/islamic-studies.jpg",
    verseArabic: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    verseTranslation: "Allah raises those who believe among you, and those given knowledge, by degrees.",
    verseRef: "Surah Al-Mujadila 58:11",
    description: [
      "A Muslim's education is more than recitation. Our Islamic Studies course gives students a structured grounding in belief, worship, the life of the Prophet ﷺ and Islamic character — taught from authentic sources, in plain English, at the level of the student.",
      "For children, lessons build identity and love for the deen. For adults, they answer the questions you have always wanted to ask, with teachers who understand life in the West because they live it too.",
    ],
    audience:
      "Children and adults at every level — from a child's first lessons about Allah to adults seeking structured, authentic knowledge. Separate classes for children and adults.",
    formats: "Group classes (Mon–Thu, including a weekly revision class) or one-to-one lessons.",
    learn: [
      { title: "Aqeedah (belief)", summary: "Tawheed, the pillars of imaan, and sound belief from authentic sources." },
      { title: "Fiqh of worship", summary: "Purification, salaah, fasting, zakah and hajj — how to worship correctly." },
      { title: "Seerah", summary: "The life of the Prophet Muhammad ﷺ, and lessons drawn for our time." },
      { title: "Stories of the Prophets", summary: "The messengers of Allah and the guidance in their stories." },
      { title: "Akhlaq & adab", summary: "Islamic character, manners and dealing with others excellently." },
      { title: "Living Islam today", summary: "Applying the deen with confidence as a Muslim in the modern world." },
    ],
    fees: [
      { label: "Group classes (Mon–Thu)", detail: "£48 per month — 5 classes a week including a revision class" },
      { label: "One-to-one", detail: "£15 per hour" },
    ],
  },
  {
    slug: "weekly-tafsir",
    title: "Weekly Tafsir",
    arabicTitle: "التفسير الأسبوعي",
    tagline: "A free weekly journey through the meanings of the Qur'an — open to absolutely everyone.",
    image: "/images/dua.jpg",
    verseArabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
    verseTranslation: "A blessed Book We have revealed to you, that they may reflect upon its verses.",
    verseRef: "Surah Sad 38:29",
    description: [
      "Every week, our principal Mufti Ateiq-ur Rehman opens the Qur'an and walks through its meanings — verse by verse, in English, drawing on the classical books of tafsir and connecting them to the lives we live today.",
      "There is no fee, no enrolment requirement and no prior knowledge needed. Whether you are an An-Nur student or simply someone who wants to sit closer to the Book of Allah, you are warmly invited to attend.",
    ],
    audience:
      "Everyone — enrolled students, their families, and any member of the community anywhere in the world. Brothers and sisters, adults and older children, all welcome.",
    formats: "A live weekly online gathering led by Mufti Ateiq-ur Rehman. Completely free of charge.",
    learn: [
      { title: "Verse-by-verse tafsir", summary: "A steady journey through the Qur'an with the classical mufassiroon." },
      { title: "Context of revelation", summary: "Asbab an-nuzool — when and why verses were revealed." },
      { title: "Language & meaning", summary: "The depth of the Arabic that translation cannot carry." },
      { title: "Lessons for today", summary: "Practical reflection: what each passage asks of us this week." },
      { title: "Questions & answers", summary: "Time to ask Mufti Ateiq your questions on the passage." },
    ],
    fees: [{ label: "Weekly Tafsir", detail: "Free — open to all, no enrolment needed" }],
    isFree: true,
  },
];

export function getCourse(slug: string): CourseInfo | undefined {
  return COURSES.find((c) => c.slug === slug);
}
