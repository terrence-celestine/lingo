import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lessons, questions, leaderboard } from "./schema.js";
import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log("Seeding...");

  const insertedLessons = await db
    .insert(lessons)
    .values([
      {
        title: "Greetings",
        description:
          "Learn how to say hello, goodbye, and ask how someone is doing.",
        category: "Basics",
        order: 1,
        difficulty: "Beginner",
      },
      {
        title: "Numbers",
        description:
          "Count from 1 to 20 and use numbers in everyday conversation.",
        category: "Basics",
        order: 2,
        difficulty: "Beginner",
      },
      {
        title: "Food & Drink",
        description:
          "Order at a restaurant and talk about your favorite foods.",
        category: "Daily Life",
        order: 3,
        difficulty: "Beginner",
      },
    ])
    .returning();

  const [greetings, numbers, food] = insertedLessons;

  await db.insert(questions).values([
    {
      lessonId: greetings.id,
      prompt: "¿Cómo estás?",
      options: [
        "What is your name?",
        "How are you?",
        "Where are you from?",
        "How old are you?",
      ],
      correctIndex: 1,
      hint: "Cómo = how, estás = you are",
    },
    {
      lessonId: greetings.id,
      prompt: "Buenos días",
      options: ["Good night", "Good afternoon", "Good morning", "Goodbye"],
      correctIndex: 2,
      hint: 'Días = days, think "day" time',
    },
    {
      lessonId: greetings.id,
      prompt: "¿Cómo te llamas?",
      options: [
        "How are you?",
        "Where do you live?",
        "What do you do?",
        "What is your name?",
      ],
      correctIndex: 3,
      hint: "Llamas comes from llamarse — to call oneself",
    },
    {
      lessonId: greetings.id,
      prompt: "Mucho gusto",
      options: [
        "You are welcome",
        "Nice to meet you",
        "See you later",
        "Thank you",
      ],
      correctIndex: 1,
      hint: "Gusto = pleasure",
    },
    {
      lessonId: greetings.id,
      prompt: "Hasta luego",
      options: [
        "Good morning",
        "Nice to meet you",
        "See you later",
        "How are you?",
      ],
      correctIndex: 2,
      hint: "Hasta = until, luego = later",
    },
    {
      lessonId: greetings.id,
      prompt: "Por favor",
      options: ["Thank you", "Sorry", "Please", "Excuse me"],
      correctIndex: 2,
      hint: "A very common polite word",
    },
    {
      lessonId: greetings.id,
      prompt: "De nada",
      options: ["No problem", "You are welcome", "See you soon", "Good luck"],
      correctIndex: 1,
      hint: "The reply to gracias",
    },
    {
      lessonId: greetings.id,
      prompt: "Lo siento",
      options: ["I am tired", "I am hungry", "I am sorry", "I am happy"],
      correctIndex: 2,
      hint: "Siento comes from sentir — to feel",
    },

    {
      lessonId: numbers.id,
      prompt: "Translate: tres",
      options: ["Two", "Four", "Five", "Three"],
      correctIndex: 3,
      hint: 'Sounds a little like "three"',
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: diez",
      options: ["Six", "Ten", "Eight", "Nine"],
      correctIndex: 1,
      hint: "Diez = ten",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "seven" in Spanish?',
      options: ["Seis", "Ocho", "Siete", "Nueve"],
      correctIndex: 2,
      hint: "Starts with S",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: veinte",
      options: ["Twelve", "Fifteen", "Twenty", "Eleven"],
      correctIndex: 2,
      hint: "Veinte = twenty",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "fifteen" in Spanish?',
      options: ["Catorce", "Quince", "Trece", "Dieciséis"],
      correctIndex: 1,
      hint: "Quince also means a type of fruit in English",
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: doce",
      options: ["Ten", "Eleven", "Thirteen", "Twelve"],
      correctIndex: 3,
      hint: "Doce = twelve",
    },
    {
      lessonId: numbers.id,
      prompt: 'How do you say "first" in Spanish?',
      options: ["Segundo", "Tercero", "Primero", "Cuarto"],
      correctIndex: 2,
      hint: 'Think "primary"',
    },
    {
      lessonId: numbers.id,
      prompt: "Translate: cero",
      options: ["One", "Zero", "Two", "Three"],
      correctIndex: 1,
      hint: 'Sounds like "zero"',
    },

    {
      lessonId: food.id,
      prompt: "¿Dónde está el baño?",
      options: [
        "What time is it?",
        "Where is the bathroom?",
        "How much does it cost?",
        "I am hungry",
      ],
      correctIndex: 1,
      hint: "Dónde = where, baño = bathroom",
    },
    {
      lessonId: food.id,
      prompt: "Tengo hambre",
      options: ["I am thirsty", "I am full", "I am hungry", "I want water"],
      correctIndex: 2,
      hint: "Hambre = hunger",
    },
    {
      lessonId: food.id,
      prompt: "La cuenta, por favor",
      options: [
        "The menu please",
        "More water please",
        "The bill please",
        "A table please",
      ],
      correctIndex: 2,
      hint: "Cuenta = bill or account",
    },
    {
      lessonId: food.id,
      prompt: "Translate: el agua",
      options: ["The food", "The juice", "The coffee", "The water"],
      correctIndex: 3,
      hint: "Agua = water",
    },
    {
      lessonId: food.id,
      prompt: "¿Qué recomienda usted?",
      options: [
        "What is the price?",
        "What do you recommend?",
        "What is in this dish?",
        "What time do you close?",
      ],
      correctIndex: 1,
      hint: "Recomienda = recommend",
    },
    {
      lessonId: food.id,
      prompt: "Translate: el desayuno",
      options: ["Lunch", "Dinner", "Snack", "Breakfast"],
      correctIndex: 3,
      hint: "The first meal of the day",
    },
    {
      lessonId: food.id,
      prompt: "Estoy lleno",
      options: ["I am hungry", "I am thirsty", "I am full", "I want more"],
      correctIndex: 2,
      hint: "Lleno = full",
    },
    {
      lessonId: food.id,
      prompt: 'How do you say "delicious" in Spanish?',
      options: ["Picante", "Delicioso", "Salado", "Dulce"],
      correctIndex: 1,
      hint: "Sounds very similar to the English word",
    },
  ]);

  await db.insert(leaderboard).values([
    { name: "Maria L.", xp: 1240, streak: 12 },
    { name: "James K.", xp: 980, streak: 8 },
    { name: "Sofia R.", xp: 290, streak: 3 },
    { name: "Alex R.", xp: 210, streak: 2 },
  ]);

  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
