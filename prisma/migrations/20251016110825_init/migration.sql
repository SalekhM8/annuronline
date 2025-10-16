-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "forWhom" TEXT,
    "studentName" TEXT,
    "relationship" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "courses" TEXT NOT NULL,
    "preferences" TEXT,
    "comments" TEXT,
    "heardAbout" TEXT
);
