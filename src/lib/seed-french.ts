import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lessons, questions } from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding French lessons...");

  const insertedLessons = await db
    .insert(lessons)
    .values([
      {
        title: "Greetings",
        description:
          "Learn how to say hello, goodbye, and ask how someone is doing in French.",
        category: "Basics",
        order: 1,
        difficulty: "Beginner",
        language: "French",
      },
      {
        title: "Numbers",
        description:
          "Count from 1 to 20 and use numbers in everyday French conversation.",
        category: "Basics",
        order: 2,
        difficulty: "Beginner",
        language: "French",
      },
      {
        title: "Food & Drink",
        description:
          "Order at a French restaurant and talk about your favourite foods.",
        category: "Daily Life",
        order: 3,
        difficulty: "Beginner",
        language: "French",
      },
    ])
    .returning();

  const [greetings, numbers, food] = insertedLessons;

  await db.insert(questions).values([
    // French Greetings
    {
      lessonId: greetings.id,
      prompt: "Comment allez-vous?",
      options: [
        "What is your name?",
        "How are you?",
        "Where are you from?",
        "How old are you?",
      ],
      correctIndex: 1,
      hint: "Comment = how, allez-vous = are you",
    },
    {
      lessonId: greetings.id,
      prompt: "Bonjour",
      options: ["Good night", "Goodbye", "Good morning/Hello", "See you later"],
      correctIndex: 2,
      hint: "Bon = good, jour = day",
    },
    {
      lessonId: greetings.id,
      prompt: "Comment vous appelez-vous?",
      options: [
        "How are you?",
        "Where do you live?",
        "What do you do?",
        "What is your name?",
      ],
      correctIndex: 3,
      hint: "Appelez-vous = do you call yourself",
    },
    {
      lessonId: greetings.id,
      prompt: "Enchanté",
      options: [
        "You are welcome",
        "Nice to meet you",
        "See you later",
        "Thank you",
      ],
      correctIndex: 1,
      hint: "Enchanté = enchanted/delighted to meet you",
    },
    {
      lessonId: greetings.id,
      prompt: "Au revoir",
      options: ["Good morning", "Nice to meet you", "Goodbye", "How are you?"],
      correctIndex: 2,
      hint: "Au revoir = until we see again",
    },
    {
      lessonId: greetings.id,
      prompt: "S'il vous plaît",
      options: ["Thank you", "Sorry", "Please", "Excuse me"],
      correctIndex: 2,
      hint: "The polite way to ask for something",
    },
    {
      lessonId: greetings.id,
      prompt: "De rien",
      options: ["No problem", "You are welcome", "See you soon", "Good luck"],
      correctIndex: 1,
      hint: "The reply to merci",
    },
    {
      lessonId: greetings.id,
      prompt: "Je suis désolé",
      options: ["I am tired", "I am hungry", "I am sorry", "I am happy"],
      correctIndex: 2,
      hint: "Désolé = sorry/desolate",
    },

    // French Numbers
    {
      lessonId: numbers.id,
      prompt: "Translate: trois",
      options: ["Two", "Four", "Five", "Three"],
      correctIndex: 3,
      hint: "Trois = three",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: dix",
      options: ["Six", "Ten", "Eight", "Nine"],
      correctIndex: 1,
      hint: "Dix = ten",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "seven" in French?',
      options: ["Six", "Huit", "Sept", "Neuf"],
      correctIndex: 2,
      hint: "Sept = seven",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: vingt",
      options: ["Twelve", "Fifteen", "Twenty", "Eleven"],
      correctIndex: 2,
      hint: "Vingt = twenty",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "fifteen" in French?',
      options: ["Quatorze", "Quinze", "Treize", "Seize"],
      correctIndex: 1,
      hint: "Quinze = fifteen",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: douze",
      options: ["Ten", "Eleven", "Thirteen", "Twelve"],
      correctIndex: 3,
      hint: "Douze = twelve",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "first" in French?',
      options: ["Deuxième", "Troisième", "Premier", "Quatrième"],
      correctIndex: 2,
      hint: "Premier = first",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: zéro",
      options: ["One", "Zero", "Two", "Three"],
      correctIndex: 1,
      hint: "Sounds like zero",
    },

    // French Food
    {
      lessonId: food.id,
      prompt: "Où sont les toilettes?",
      options: [
        "What time is it?",
        "Where is the bathroom?",
        "How much does it cost?",
        "I am hungry",
      ],
      correctIndex: 1,
      hint: "Où = where, toilettes = bathroom",
    },
    {
      lessonId: food.id,
      prompt: "J'ai faim",
      options: ["I am thirsty", "I am full", "I am hungry", "I want water"],
      correctIndex: 2,
      hint: "Faim = hunger",
    },
    {
      lessonId: food.id,
      prompt: "L'addition, s'il vous plaît",
      options: [
        "The menu please",
        "More water please",
        "The bill please",
        "A table please",
      ],
      correctIndex: 2,
      hint: "L'addition = the bill",
    },
    {
      lessonId: food.id,
      prompt: "Translate: l'eau",
      options: ["The food", "The juice", "The coffee", "The water"],
      correctIndex: 3,
      hint: "L'eau = water",
    },
    {
      lessonId: food.id,
      prompt: "Que recommandez-vous?",
      options: [
        "What is the price?",
        "What do you recommend?",
        "What is in this dish?",
        "What time do you close?",
      ],
      correctIndex: 1,
      hint: "Recommandez = recommend",
    },
    {
      lessonId: food.id,
      prompt: "Translate: le petit-déjeuner",
      options: ["Lunch", "Dinner", "Snack", "Breakfast"],
      correctIndex: 3,
      hint: "Petit = small, déjeuner = lunch — the small lunch!",
    },
    {
      lessonId: food.id,
      prompt: "Je suis rassasié",
      options: ["I am hungry", "I am thirsty", "I am full", "I want more"],
      correctIndex: 2,
      hint: "Rassasié = satisfied/full",
    },
    {
      lessonId: food.id,
      prompt: 'How do you say "delicious" in French?',
      options: ["Épicé", "Délicieux", "Salé", "Sucré"],
      correctIndex: 1,
      hint: "Sounds very similar to the English word",
    },
  ]);

  console.log("Done! French lessons seeded.");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
