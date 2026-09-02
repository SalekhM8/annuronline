/**
 * An-Nur Academy v2 demo seed.
 * Run: node prisma/seed.mjs   (add --force to re-seed over existing v2 data)
 *
 * Demo logins (change in production!):
 *   admin:   info@an-nur.online            / Admin123!  (or $ADMIN_PASSWORD)
 *   teacher: yusuf.khan@an-nur.online      / Teacher123!
 *   teacher: maryam.ali@an-nur.online      / Teacher123!
 *   student: student1@example.com       / Student123!   (child, group Qa'idah + weekend Arabic)
 *   student: student2@example.com   / Student123!   (adult, Tajweed group + distance Islamic Studies)
 *   student: student3@example.com       / Student123!   (adult, 1:1 Hifz)
 *   student: student4@example.com       / Student123!   (LOCKED — overdue invoice demo)
 */
import { PrismaClient } from "@prisma/client";
import { createHash, randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const force = process.argv.includes("--force");

const day = 24 * 60 * 60 * 1000;
const now = new Date();
const at = (daysFromNow, hour, minute = 0) => {
  const d = new Date(now.getTime() + daysFromNow * day);
  d.setHours(hour, minute, 0, 0);
  return d;
};

async function main() {
  const existing = await prisma.course.count();
  if (existing > 0 && !force) {
    console.log("Already seeded (courses exist). Use --force to top up.");
    return;
  }

  const studentHash = await bcrypt.hash("Student123!", 12);
  const teacherHash = await bcrypt.hash("Teacher123!", 12);
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin123!", 12);

  // ---------- users ----------
  const admin = await prisma.user.upsert({
    where: { email: "info@an-nur.online" },
    update: { role: "ADMIN" },
    create: {
      email: "info@an-nur.online",
      passwordHash: adminHash,
      firstName: "Mufti",
      lastName: "Ateiq-ur Rehman",
      role: "ADMIN",
      phone: "+44 7724 343150",
    },
  });

  const yusuf = await prisma.user.upsert({
    where: { email: "yusuf.khan@an-nur.online" },
    update: {},
    create: {
      email: "yusuf.khan@an-nur.online",
      passwordHash: teacherHash,
      firstName: "Yusuf",
      lastName: "Khan",
      role: "TEACHER",
      phone: "+44 7700 900001",
    },
  });

  const maryam = await prisma.user.upsert({
    where: { email: "maryam.ali@an-nur.online" },
    update: {},
    create: {
      email: "maryam.ali@an-nur.online",
      passwordHash: teacherHash,
      firstName: "Maryam",
      lastName: "Ali",
      role: "TEACHER",
      phone: "+44 7700 900002",
    },
  });

  const amina = await prisma.user.upsert({
    where: { email: "student1@example.com" },
    update: {},
    create: {
      email: "student1@example.com",
      passwordHash: studentHash,
      firstName: "Amina",
      lastName: "Begum",
      role: "STUDENT",
      isChild: true,
      dateOfBirth: new Date("2015-03-12"),
      gender: "female",
      guardianName: "Fatima Begum",
      guardianEmail: "fatima.begum@example.com",
      guardianPhone: "+44 7700 900101",
      city: "Birmingham",
    },
  });

  const ibrahim = await prisma.user.upsert({
    where: { email: "student2@example.com" },
    update: {},
    create: {
      email: "student2@example.com",
      passwordHash: studentHash,
      firstName: "Ibrahim",
      lastName: "Hussain",
      role: "STUDENT",
      gender: "male",
      phone: "+44 7700 900102",
      city: "London",
    },
  });

  const zaynab = await prisma.user.upsert({
    where: { email: "student3@example.com" },
    update: {},
    create: {
      email: "student3@example.com",
      passwordHash: studentHash,
      firstName: "Zaynab",
      lastName: "Shah",
      role: "STUDENT",
      gender: "female",
      phone: "+44 7700 900103",
      city: "Manchester",
    },
  });

  const lockedDemo = await prisma.user.upsert({
    where: { email: "student4@example.com" },
    update: {},
    create: {
      email: "student4@example.com",
      passwordHash: studentHash,
      firstName: "Locked",
      lastName: "Demo",
      role: "STUDENT",
      gender: "male",
      lockedAt: new Date(now.getTime() - 3 * day),
      lockReason: "Invoice INV-DEMO-OVERDUE unpaid 7+ days",
    },
  });

  // ---------- courses & modules ----------
  const courseDefs = [
    {
      slug: "qaidah",
      title: "Qa'idah",
      arabicTitle: "القاعدة",
      tagline: "Start reading Arabic from the very beginning",
      description:
        "Step-by-step foundation in reading Arabic script, from the alphabet to joined words, using Ahsanul Qawa'id.",
      sortOrder: 1,
      modules: [
        "The Arabic alphabet",
        "Letter forms & joining",
        "Harakaat — Fathah, Kasrah, Dammah",
        "Tanween & Sukoon",
        "Madd letters & elongation",
        "Shaddah & practice drills",
        "Reading full words fluently",
      ],
    },
    {
      slug: "tajweed",
      title: "Tajweed",
      arabicTitle: "التجويد",
      tagline: "Recite the Quran beautifully and correctly",
      description:
        "The rules of Quranic recitation: articulation points, rules of noon and meem, madd, and beautification of recitation.",
      sortOrder: 2,
      modules: [
        "Introduction & virtues of Tajweed",
        "Makhaarij — articulation points",
        "Sifaat — characteristics of letters",
        "Rules of Noon Saakinah & Tanween",
        "Rules of Meem Saakinah",
        "The Madd rules",
        "Waqf — stopping correctly",
        "Applied recitation practice",
      ],
    },
    {
      slug: "arabic",
      title: "Arabic Language",
      arabicTitle: "اللغة العربية",
      tagline: "Understand the language of the Quran",
      description:
        "Weekend Arabic programme covering reading, vocabulary, grammar (nahw & sarf) and conversation for everyday and Quranic Arabic.",
      sortOrder: 3,
      modules: [
        "Arabic essentials & greetings",
        "Nouns, pronouns & possession",
        "Verb basics — past tense",
        "Present tense & commands",
        "Sentence construction",
        "Quranic vocabulary I",
        "Conversation practice",
      ],
    },
    {
      slug: "hifz",
      title: "Hifz",
      arabicTitle: "الحفظ",
      tagline: "Memorise the Book of Allah — one-to-one",
      description:
        "A personal memorisation journey with a dedicated teacher: new lesson, recent revision and long-term revision each session.",
      sortOrder: 4,
      modules: [
        "Juz 'Amma — An-Naas to Ad-Duha",
        "Juz 'Amma — completion",
        "Juz 29",
        "Juz 28",
        "Surah Al-Baqarah part 1",
        "Surah Al-Baqarah part 2",
      ],
    },
    {
      slug: "islamic-studies",
      title: "Islamic Studies",
      arabicTitle: "الدراسات الإسلامية",
      tagline: "Aqeedah, fiqh, seerah and daily practice",
      description:
        "A rounded programme covering beliefs, purification and prayer, the life of the Prophet ﷺ, and living Islam with confidence.",
      sortOrder: 5,
      offersDistance: true,
      modules: [
        "Aqeedah — the six pillars of Imaan",
        "Tahaarah — purification",
        "Salaah — how to pray with understanding",
        "Sawm & Zakaah",
        "Seerah — Makkan period",
        "Seerah — Madinan period",
        "Akhlaaq — character & manners",
      ],
    },
    {
      slug: "weekly-tafsir",
      title: "Weekly Tafsir",
      arabicTitle: "التفسير الأسبوعي",
      tagline: "Open to everyone, every week",
      description:
        "A weekly online tafsir circle with Mufti Ateiq — open to all, no enrolment required.",
      sortOrder: 6,
      modules: ["Ongoing tafsir circle"],
    },
  ];

  const courses = {};
  for (const def of courseDefs) {
    const course = await prisma.course.upsert({
      where: { slug: def.slug },
      update: {},
      create: {
        slug: def.slug,
        title: def.title,
        arabicTitle: def.arabicTitle,
        tagline: def.tagline,
        description: def.description,
        sortOrder: def.sortOrder,
        offersDistance: def.offersDistance ?? false,
        modules: {
          create: def.modules.map((title, i) => ({ order: i + 1, title })),
        },
      },
      include: { modules: { orderBy: { order: "asc" } } },
    });
    courses[def.slug] = course;
  }

  // ---------- class groups ----------
  const qaidahKids = await prisma.classGroup.create({
    data: {
      courseId: courses.qaidah.id,
      name: "Qa'idah — Children (Mon–Thu)",
      type: "GROUP",
      audience: "CHILD",
      teacherId: maryam.id,
      scheduleText: "Mon–Thu 5:00–6:00pm + Sat revision",
      monthlyFeePence: 4800,
      meetingLink: "https://zoom.us/j/demo-qaidah",
      capacity: 12,
    },
  });

  const weekendArabic = await prisma.classGroup.create({
    data: {
      courseId: courses.arabic.id,
      name: "Weekend Arabic — Group",
      type: "GROUP",
      audience: "MIXED",
      teacherId: yusuf.id,
      scheduleText: "Sat & Sun 10:00–11:00am",
      monthlyFeePence: 3800,
      meetingLink: "https://zoom.us/j/demo-arabic",
      capacity: 15,
    },
  });

  const tajweedAdults = await prisma.classGroup.create({
    data: {
      courseId: courses.tajweed.id,
      name: "Tajweed — Adults (Mon–Thu)",
      type: "GROUP",
      audience: "ADULT",
      teacherId: yusuf.id,
      scheduleText: "Mon–Thu 7:00–8:00pm + revision",
      monthlyFeePence: 4800,
      meetingLink: "https://zoom.us/j/demo-tajweed",
      capacity: 12,
    },
  });

  const hifzOneToOne = await prisma.classGroup.create({
    data: {
      courseId: courses.hifz.id,
      name: "Hifz — One-to-one (Zaynab)",
      type: "ONE_TO_ONE",
      audience: "ADULT",
      teacherId: maryam.id,
      scheduleText: "Tue & Thu 6:00–7:00pm",
      hourlyFeePence: 1500,
      meetingLink: "https://zoom.us/j/demo-hifz",
      capacity: 1,
    },
  });

  // ---------- enrolments ----------
  const enrolAminaQaidah = await prisma.enrolment.create({
    data: { studentId: amina.id, courseId: courses.qaidah.id, classGroupId: qaidahKids.id, status: "ACTIVE" },
  });
  const enrolAminaArabic = await prisma.enrolment.create({
    data: { studentId: amina.id, courseId: courses.arabic.id, classGroupId: weekendArabic.id, status: "ACTIVE" },
  });
  const enrolIbrahimTajweed = await prisma.enrolment.create({
    data: { studentId: ibrahim.id, courseId: courses.tajweed.id, classGroupId: tajweedAdults.id, status: "ACTIVE" },
  });
  const enrolIbrahimDistance = await prisma.enrolment.create({
    data: { studentId: ibrahim.id, courseId: courses["islamic-studies"].id, mode: "DISTANCE", status: "ACTIVE" },
  });
  const enrolZaynabHifz = await prisma.enrolment.create({
    data: { studentId: zaynab.id, courseId: courses.hifz.id, classGroupId: hifzOneToOne.id, status: "ACTIVE", paymentDayOfMonth: 5 },
  });
  const enrolLocked = await prisma.enrolment.create({
    data: { studentId: lockedDemo.id, courseId: courses.tajweed.id, classGroupId: tajweedAdults.id, status: "LOCKED" },
  });

  // ---------- mandates ----------
  for (const s of [amina, ibrahim, zaynab]) {
    await prisma.paymentMandate.create({
      data: { studentId: s.id, status: "ACTIVE", mandateRef: `MOCK-${s.firstName.toUpperCase()}` },
    });
  }
  await prisma.paymentMandate.create({
    data: { studentId: lockedDemo.id, status: "FAILED", mandateRef: "MOCK-LOCKED" },
  });

  // ---------- module progress & certificates ----------
  const qaidahMods = courses.qaidah.modules;
  await prisma.moduleProgress.createMany({
    data: [
      { enrolmentId: enrolAminaQaidah.id, moduleId: qaidahMods[0].id, status: "COMPLETED", startedAt: at(-60, 17), completedAt: at(-40, 18) },
      { enrolmentId: enrolAminaQaidah.id, moduleId: qaidahMods[1].id, status: "COMPLETED", startedAt: at(-40, 17), completedAt: at(-12, 18) },
      { enrolmentId: enrolAminaQaidah.id, moduleId: qaidahMods[2].id, status: "IN_PROGRESS", startedAt: at(-12, 17) },
    ],
  });
  await prisma.certificate.createMany({
    data: [
      {
        serial: "ANA-2026-00001",
        studentId: amina.id,
        moduleId: qaidahMods[0].id,
        studentName: "Amina Begum",
        moduleTitle: qaidahMods[0].title,
        courseTitle: "Qa'idah",
        issuedAt: at(-40, 18),
      },
      {
        serial: "ANA-2026-00002",
        studentId: amina.id,
        moduleId: qaidahMods[1].id,
        studentName: "Amina Begum",
        moduleTitle: qaidahMods[1].title,
        courseTitle: "Qa'idah",
        issuedAt: at(-12, 18),
      },
    ],
  });

  const tajweedMods = courses.tajweed.modules;
  await prisma.moduleProgress.createMany({
    data: [
      { enrolmentId: enrolIbrahimTajweed.id, moduleId: tajweedMods[0].id, status: "COMPLETED", startedAt: at(-50, 19), completedAt: at(-30, 20) },
      { enrolmentId: enrolIbrahimTajweed.id, moduleId: tajweedMods[1].id, status: "IN_PROGRESS", startedAt: at(-30, 19) },
    ],
  });

  const isMods = courses["islamic-studies"].modules;
  await prisma.moduleProgress.createMany({
    data: [
      { enrolmentId: enrolIbrahimDistance.id, moduleId: isMods[0].id, status: "COMPLETED", startedAt: at(-45, 9), completedAt: at(-20, 9) },
      { enrolmentId: enrolIbrahimDistance.id, moduleId: isMods[1].id, status: "IN_PROGRESS", startedAt: at(-20, 9) },
    ],
  });
  await prisma.certificate.create({
    data: {
      serial: "ANA-2026-00003",
      studentId: ibrahim.id,
      moduleId: isMods[0].id,
      studentName: "Ibrahim Hussain",
      moduleTitle: isMods[0].title,
      courseTitle: "Islamic Studies",
      issuedAt: at(-20, 9),
    },
  });

  await prisma.moduleProgress.create({
    data: { enrolmentId: enrolZaynabHifz.id, moduleId: courses.hifz.modules[0].id, status: "IN_PROGRESS", startedAt: at(-25, 18) },
  });

  // ---------- distance-learning audio submission ----------
  await prisma.audioSubmission.create({
    data: {
      enrolmentId: enrolIbrahimDistance.id,
      moduleId: isMods[1].id,
      audioUrl: "data:audio/webm;base64,",
      status: "SUBMITTED",
      submittedAt: at(-1, 14),
    },
  });

  // ---------- sessions, attendance, polls ----------
  const salt = process.env.POLL_ANON_SALT || "demo-salt";
  const voterHash = (userId, sessionId) =>
    createHash("sha256").update(`${userId}:${sessionId}:${salt}`).digest("hex");

  const groups = [
    { group: qaidahKids, students: [amina], hour: 17 },
    { group: tajweedAdults, students: [ibrahim, lockedDemo], hour: 19 },
    { group: weekendArabic, students: [amina], hour: 10 },
  ];

  for (const { group, students, hour } of groups) {
    for (const offset of [-7, -4, -2]) {
      const session = await prisma.classSession.create({
        data: {
          classGroupId: group.id,
          scheduledAt: at(offset, hour),
          topic: "Lesson & revision",
        },
      });
      for (const [i, student] of students.entries()) {
        const absent = offset === -4 && i === 0 && group.id === qaidahKids.id;
        await prisma.attendance.create({
          data: {
            sessionId: session.id,
            studentId: student.id,
            status: absent ? "ABSENT" : "PRESENT",
            absenceEmailSentAt: absent ? at(offset, hour + 2) : null,
            note: absent ? "Auto absence email sent to guardian" : null,
          },
        });
        if (!absent && offset !== -2) {
          await prisma.lessonFeedback.create({
            data: {
              sessionId: session.id,
              rating: 4 + (i % 2),
              comment: i === 0 ? "Really enjoyed the class, jazakAllah khair!" : null,
              voterHash: voterHash(student.id, session.id),
            },
          });
        }
      }
    }
    for (const offset of [1, 3, 5]) {
      await prisma.classSession.create({
        data: {
          classGroupId: group.id,
          scheduledAt: at(offset, hour),
          topic: "Upcoming lesson",
        },
      });
    }
  }

  // ---------- message boards ----------
  const broadcastId = randomUUID();
  await prisma.boardMessage.createMany({
    data: [
      {
        studentId: amina.id,
        authorId: maryam.id,
        authorRole: "TEACHER",
        body: "Assalamu alaikum Amina — excellent recitation this week, mashaAllah! Please revise page 12 of Ahsanul Qawa'id before Thursday.",
        createdAt: at(-3, 18, 15),
      },
      {
        studentId: amina.id,
        authorId: amina.id,
        authorRole: "STUDENT",
        body: "Wa alaikum assalam Ustadha, jazakAllah khair — I will practise it with my mum tonight inshaAllah.",
        createdAt: at(-3, 19, 5),
      },
      {
        studentId: amina.id,
        authorId: maryam.id,
        authorRole: "TEACHER",
        body: "Reminder to the whole class: Saturday's revision class starts 30 minutes earlier this week (4:30pm).",
        broadcastId,
        createdAt: at(-1, 12),
      },
      {
        studentId: ibrahim.id,
        authorId: yusuf.id,
        authorRole: "TEACHER",
        body: "Assalamu alaikum Ibrahim — strong progress on the rules of Noon Saakinah. Next session we begin Meem Saakinah, chapter 5 in your notes.",
        createdAt: at(-2, 20, 10),
      },
      {
        studentId: zaynab.id,
        authorId: admin.id,
        authorRole: "ADMIN",
        body: "Assalamu alaikum Zaynab — welcome to An-Nur Academy! Your Hifz journey starts this week. Any questions, message here any time.",
        createdAt: at(-24, 10),
      },
    ],
  });

  // ---------- journals ----------
  await prisma.journalEntry.createMany({
    data: [
      {
        studentId: ibrahim.id,
        title: "Noon Saakinah breakthrough",
        content: "Finally got the difference between ikhfa and idghaam today. Practised with Surah Yaseen verses 1-12.",
        entryDate: at(-2, 21),
      },
      {
        studentId: amina.id,
        title: "New letters",
        content: "Learned ص and ض today. They are tricky but Ustadha said my pronunciation is getting better!",
        entryDate: at(-3, 18, 30),
      },
    ],
  });

  // ---------- invoices ----------
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const lastMonth = month === 1 ? 12 : month - 1;
  const lastMonthYear = month === 1 ? year - 1 : year;

  await prisma.invoice.createMany({
    data: [
      {
        number: `INV-${lastMonthYear}-${String(lastMonth).padStart(2, "0")}-0001`,
        studentId: amina.id,
        enrolmentId: enrolAminaQaidah.id,
        periodYear: lastMonthYear,
        periodMonth: lastMonth,
        description: "Qa'idah — monthly fee",
        amountPence: 4800,
        status: "PAID",
        dueDate: new Date(lastMonthYear, lastMonth - 1, 1),
        paidAt: new Date(lastMonthYear, lastMonth - 1, 1, 8),
        emailedAt: new Date(lastMonthYear, lastMonth - 1, 1, 6),
      },
      {
        number: `INV-${year}-${String(month).padStart(2, "0")}-0001`,
        studentId: amina.id,
        enrolmentId: enrolAminaQaidah.id,
        periodYear: year,
        periodMonth: month,
        description: "Qa'idah — monthly fee",
        amountPence: 4800,
        status: "PAID",
        dueDate: new Date(year, month - 1, 1),
        paidAt: new Date(year, month - 1, 1, 8),
        emailedAt: new Date(year, month - 1, 1, 6),
      },
      {
        number: `INV-${year}-${String(month).padStart(2, "0")}-0002`,
        studentId: ibrahim.id,
        enrolmentId: enrolIbrahimTajweed.id,
        periodYear: year,
        periodMonth: month,
        description: "Tajweed — monthly fee",
        amountPence: 4800,
        status: "PENDING",
        dueDate: new Date(year, month - 1, Math.min(now.getDate() + 3, 28)),
        emailedAt: now,
      },
      {
        number: "INV-DEMO-OVERDUE",
        studentId: lockedDemo.id,
        enrolmentId: enrolLocked.id,
        periodYear: lastMonthYear,
        periodMonth: lastMonth,
        description: "Tajweed — monthly fee",
        amountPence: 4800,
        status: "OVERDUE",
        dueDate: new Date(now.getTime() - 12 * day),
        emailedAt: new Date(now.getTime() - 12 * day),
        reminderEmailedAt: new Date(now.getTime() - 5 * day),
      },
      {
        number: "INV-ADHOC-DEMO1",
        studentId: zaynab.id,
        enrolmentId: enrolZaynabHifz.id,
        periodYear: year,
        periodMonth: month,
        description: "Hifz one-to-one — 8 hours @ £15",
        amountPence: 12000,
        status: "PAID",
        dueDate: new Date(year, month - 1, 5),
        paidAt: new Date(year, month - 1, 5, 9),
        emailedAt: new Date(year, month - 1, 3),
      },
    ],
  });

  // ---------- login events ----------
  for (const [u, hours] of [[amina, 1.1], [ibrahim, 0.8], [zaynab, 0.5], [yusuf, 4.2], [maryam, 3.6]]) {
    for (const offset of [-6, -4, -2, -1]) {
      const start = at(offset, 16 + Math.floor(Math.random() * 4));
      await prisma.loginEvent.create({
        data: {
          userId: u.id,
          loggedInAt: start,
          lastSeenAt: new Date(start.getTime() + hours * 60 * 60 * 1000),
          userAgent: "Mozilla/5.0 (Macintosh) Chrome/128 Safari/537.36",
        },
      });
    }
  }

  // ---------- observations ----------
  await prisma.observation.createMany({
    data: [
      {
        teacherId: yusuf.id,
        observerId: admin.id,
        observedAt: at(-14, 19, 30),
        classContext: "Tajweed — Adults, Noon Saakinah lesson",
        score: 9,
        strengths: "Clear explanations, excellent student engagement, correct use of the portal message board for follow-ups.",
        improvements: "Allow slightly more individual recitation time per student.",
      },
      {
        teacherId: maryam.id,
        observerId: admin.id,
        observedAt: at(-10, 17, 30),
        classContext: "Qa'idah — Children",
        score: 10,
        strengths: "Wonderful energy with the children, strong classroom management, parents praised the feedback notes.",
        improvements: null,
      },
    ],
  });

  // ---------- public content ----------
  await prisma.muftiQuestion.createMany({
    data: [
      {
        name: null,
        email: "asker1@example.com",
        question: "Is it permissible to combine prayers when travelling for work within the UK?",
        answer:
          "Combining prayers (jam') is permitted for a traveller once the journey meets the distance of travel (approx. 48 miles) and you have left your town's boundaries. For daily commuting within your own city, prayers should be offered at their times; if genuine hardship arises, pray each salaah as soon as its time allows. And Allah knows best.",
        status: "PUBLISHED",
        askedAt: at(-20, 11),
        answeredAt: at(-18, 15),
      },
      {
        name: null,
        email: "asker2@example.com",
        question: "My child struggles to focus in salaah — any advice?",
        answer:
          "Keep it gentle and gradual: pray together, keep post-salaah moments warm and unhurried, and teach the meanings of what is recited — understanding builds focus. Praise consistency over perfection; the Prophet ﷺ taught gradually and with mercy. And Allah knows best.",
        status: "PUBLISHED",
        askedAt: at(-9, 20),
        answeredAt: at(-7, 13),
      },
      {
        name: "Bilal",
        email: "asker3@example.com",
        question: "What is the ruling on taking out a student loan in the UK?",
        status: "PENDING",
        askedAt: at(-1, 9),
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        slug: "ahsanul-qawaid",
        name: "Ahsanul Qawa'id",
        description: "The classic Qa'idah book we teach from — colour-coded and beginner friendly.",
        category: "BOOK",
        pricePence: 499,
        imageUrl: "/images/ahsanulqawaid.webp",
        sortOrder: 1,
      },
      {
        slug: "quran-15-line",
        name: "Quran (15-line)",
        description: "Beautiful 15-line mushaf, clear print — the standard for Hifz students.",
        category: "BOOK",
        pricePence: 1499,
        imageUrl: "/images/quran.png",
        sortOrder: 2,
      },
      {
        slug: "electronic-tasbeeh",
        name: "Electronic Tasbeeh",
        description: "Digital dhikr counter with clip — count your adhkaar anywhere.",
        category: "OTHER",
        pricePence: 599,
        imageUrl: "/images/tasbeehdigital.jpg",
        sortOrder: 3,
      },
      {
        slug: "musk-attar",
        name: "Musk Attar (6ml)",
        description: "Alcohol-free concentrated perfume oil — a soft, lasting musk.",
        category: "PERFUME",
        pricePence: 799,
        sortOrder: 4,
      },
    ],
  });

  await prisma.assessmentBooking.createMany({
    data: [
      {
        fullName: "Hamza Patel",
        email: "hamza.patel@example.com",
        phone: "+44 7700 900201",
        audience: "CHILD",
        courseInterest: "Qa'idah",
        preferredTimes: "Weekday evenings after 5pm",
        status: "PENDING",
        createdAt: at(-1, 10),
      },
      {
        fullName: "Sara Ahmed",
        email: "sara.ahmed@example.com",
        audience: "ADULT",
        courseInterest: "Tajweed",
        preferredTimes: "Weekends",
        status: "CONFIRMED",
        scheduledAt: at(2, 11),
        createdAt: at(-4, 15),
      },
    ],
  });

  await prisma.counsellingBooking.create({
    data: {
      fullName: "Anonymous Brother",
      email: "counsel.demo@example.com",
      type: "MARRIAGE",
      method: "ONLINE",
      message: "Would like a confidential conversation with Mufti sahib.",
      status: "PENDING",
      createdAt: at(-2, 13),
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "contact_email", value: "info@an-nur.online" },
      { key: "contact_phone", value: "+44 7724 343150" },
      { key: "absence_email_enabled", value: "true" },
      { key: "bank_details_text", value: "Bank transfer details to be confirmed — please contact us to donate." },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
  console.log("Logins — admin: info@an-nur.online / Admin123! (or $ADMIN_PASSWORD)");
  console.log("teachers: yusuf.khan@an-nur.online, maryam.ali@an-nur.online / Teacher123!");
  console.log("students: amina.begum@ / ibrahim.hussain@ / zaynab.shah@ example.com / Student123!");
  console.log("locked demo: student4@example.com / Student123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
