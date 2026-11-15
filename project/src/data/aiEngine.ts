import type { ChatMessage } from '@/types';

interface AIResponse {
  content: string;
  correction?: string | null;
}

const rolePlayGreetings: Record<string, string> = {
  restaurant:
    '¡Bienvenido al restaurante! Soy su camarero hoy. ¿Qué le gustaría pedir? Tenemos una carta muy variada — ¿quiere que le recomiende algo especial de la casa?',
  airport:
    '¡Bienvenido al aeropuerto! ¿En qué puedo ayudarle? ¿Necesita información sobre su vuelo, facturación, o cómo llegar a su puerta de embarque?',
  hotel:
    '¡Bienvenido a nuestro hotel! ¿Tiene una reserva con nosotros? ¿En qué puedo ayudarle hoy — check-in, información sobre las habitaciones, o servicios del hotel?',
  meeting:
    '¡Hola! Mucho gusto en conocerte. ¿De dónde eres? Cuéntame un poco sobre ti — ¿qué te trae a aprender español?',
  shopping:
    '¡Hola! Bienvenido a la tienda. ¿Busca algo en particular hoy? Tenemos mucha variedad y puedo ayudarle a encontrar lo que necesita.',
};

const grammarExplanations: { keywords: string[]; response: string }[] = [
  {
    keywords: ['ser', 'estar', 'ser vs estar', 'ser vs. estar'],
    response:
      'Great question! **Ser vs. Estar** is one of the most important distinctions in Spanish:\n\n**Ser** — used for permanent/essential qualities:\n• Identity: *Soy Ana* (I am Ana)\n• Origin: *Soy de España* (I am from Spain)\n• Profession: *Soy doctor* (I am a doctor)\n• Characteristics: *La casa es grande* (The house is big)\n\n**Estar** — used for temporary states and locations:\n• Feelings: *Estoy cansado* (I am tired)\n• Location: *El libro está en la mesa* (The book is on the table)\n• Progressive: *Estoy comiendo* (I am eating)\n\n💡 Trick: **Ser** = "essence", **Estar** = "state". If it\'s WHO you are → Ser. If it\'s HOW you are → Estar.',
  },
  {
    keywords: ['por', 'para', 'por vs para', 'por vs. para'],
    response:
      '**Por vs. Para** — both mean "for", but they\'re used differently:\n\n**Para** — destination, purpose, recipient, deadline:\n• *Este regalo es para ti* (This gift is for you)\n• *Estudio para ser doctor* (I study to be a doctor)\n• *El pastel es para mañana* (The cake is for tomorrow)\n\n**Por** — reason, cause, through, exchange, duration:\n• *Gracias por tu ayuda* (Thanks for your help)\n• *Caminamos por el parque* (We walk through the park)\n• *Pagué diez euros por el café* (I paid 10 euros for the coffee)\n• *Por dos horas* (for two hours)\n\n💡 Trick: **Para** = destination/purpose, **Por** = reason/cause.',
  },
  {
    keywords: ['preterite', 'preterito', 'pretérito', 'past tense', 'past'],
    response:
      '**El Pretérito** (simple past) describes completed actions at a specific time:\n\nRegular -ar verbs (hablar):\n• *Hablé, hablaste, habló, hablamos, hablasteis, hablaron*\n\nRegular -er/-ir verbs (comer):\n• *Comí, comiste, comió, comimos, comisteis, comieron*\n\nUse it for: "Ayer **comí** pizza" (Yesterday I ate pizza), "El año pasado **viajé** a España" (Last year I traveled to Spain).\n\n💡 Use the preterite for actions with a clear beginning and end.',
  },
  {
    keywords: ['imperfect', 'imperfecto', 'imperfect tense'],
    response:
      '**El Imperfecto** describes habitual or ongoing past actions:\n\nRegular -ar verbs:\n• *Hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban*\n\nRegular -er/-ir verbs:\n• *Comía, comías, comía, comíamos, comíais, comían*\n\nUse it for: "Cuando era niño, **jugaba** al fútbol" (When I was a child, I used to play soccer).\n\n💡 Preterite = completed action. Imperfect = background/habitual. "Estaba en casa cuando llamó" (I was at home when he called).',
  },
  {
    keywords: ['subjunctive', 'subjuntivo', 'el subjuntivo'],
    response:
      '**El Subjuntivo** expresses doubt, desire, emotion, or uncertainty:\n\nFormation: take the opposite vowel ending:\n• -ar verbs → -e (hable → hable, hables, hable...)\n• -er/-ir verbs → -a (coma → coma, comas, coma...)\n\nTriggers:\n• Desire: *Quiero que **vengas*** (I want you to come)\n• Emotion: *Me alegra que **estés** aquí* (I\'m glad you\'re here)\n• Doubt: *Dudo que **llueva*** (I doubt it will rain)\n\n💡 The subjunctive is about what you WANT, FEEL, or DOUBT — not what IS.',
  },
  {
    keywords: ['gerund', 'gerundio', 'ing form', '-ing', 'present progressive'],
    response:
      '**El Gerundio** (-ing form) is used for ongoing actions:\n\nFormation:\n• -ar verbs: -ando (hablar → hablando)\n• -er/-ir verbs: -iendo (comer → comiendo, vivir → viviendo)\n\nUse with "estar": *Estoy aprendiendo español* (I am learning Spanish).\n• *¿Qué estás haciendo?* — What are you doing?\n• *Están comiendo* — They are eating.\n\n💡 Irregular gerunds: leer → **leyendo**, dormir → **durmiendo**, pedir → **pidiendo**.',
  },
  {
    keywords: ['reflexive', 'reflexivos', 'reflexive verbs'],
    response:
      '**Verbos Reflexivos** — when the subject does the action to itself:\n\nCommon reflexive verbs:\n• *Levantarse* — to get up: *Me levanto a las siete*\n• *Lavarse* — to wash: *Me lavo las manos*\n• *Llamarse* — to be called: *Me llamo Carlos*\n• *Despertarse* — to wake up: *Me despierto temprano*\n\nReflexive pronouns: me, te, se, nos, os, se\n\n💡 The pronoun goes BEFORE the conjugated verb: *Me baño* (I bathe myself).',
  },
  {
    keywords: ['pronoun', 'pronombres', 'los pronombres'],
    response:
      '**Los Pronombres Personales** (Subject Pronouns):\n\n• **Yo** — I\n• **Tú** — You (informal)\n• **Él/Ella/Usted** — He/She/You (formal)\n• **Nosotros/Nosotras** — We\n• **Vosotros/Vosotras** — You all (informal, Spain)\n• **Ellos/Ellas/Ustedes** — They/You all (formal)\n\n💡 "Usted" (formal you) uses third-person conjugation. In Latin America, "ustedes" replaces "vosotros".',
  },
];

const commonCorrections: { wrong: string; correct: string; note: string }[] = [
  { wrong: 'soy cansado', correct: 'estoy cansado', note: 'Use "estar" for temporary states like being tired.' },
  { wrong: 'estoy de españa', correct: 'soy de españa', note: 'Use "ser" for origin.' },
  { wrong: 'no problemo', correct: 'no hay problema', note: '"No problemo" is not correct Spanish — say "no hay problema".' },
  { wrong: 'muchos gracias', correct: 'muchas gracias', note: '"Gracias" is feminine, so it\'s "muchas", not "muchos".' },
  { wrong: 'donde es', correct: 'dónde está', note: 'For location, use "estar" (¿Dónde está...?), not "ser".' },
  { wrong: 'yo tengo hambre', correct: 'tengo hambre', note: 'Subject pronouns (yo, tú, él) are often dropped in Spanish — "tengo hambre" is enough.' },
  { wrong: 'la cuenta por favor', correct: 'la cuenta, por favor', note: 'Add a comma before "por favor" for correct punctuation.' },
  { wrong: 'estoy bieno', correct: 'estoy bien', note: '"Bien" is an adverb — it doesn\'t change for gender.' },
  { wrong: 'yo es', correct: 'yo soy', note: 'With "yo", use "soy" (from ser), not "es".' },
  { wrong: 'tu es', correct: 'tú eres', note: 'With "tú", use "eres" (from ser), not "es".' },
  { wrong: 'el casa', correct: 'la casa', note: '"Casa" is feminine — use "la", not "el".' },
  { wrong: 'una agua', correct: 'un agua', note: 'Before a stressed "a" sound, use "un" even for feminine nouns.' },
  { wrong: 'vamos a comeremos', correct: 'vamos a comer', note: 'After "vamos a", use the infinitive, not the conjugated form.' },
  { wrong: 'me llamo es', correct: 'me llamo', note: '"Me llamo" already means "my name is" — no need for "es".' },
  { wrong: '¿como estas?', correct: '¿cómo estás?', note: 'Remember accents: "cómo" (question word) and "estás" (tú form).' },
  { wrong: 'que pasa', correct: '¿qué pasa?', note: 'Questions need opening and closing question marks in Spanish.' },
  { wrong: 'ciao', correct: 'hola / adiós', note: '"Ciao" is Italian — in Spanish, use "hola" or "adiós".' },
  { wrong: 'grazie', correct: 'gracias', note: '"Grazie" is Italian — in Spanish, say "gracias".' },
];

const motivationalResponses = [
  '¡Excelente! You\'re making great progress. Every word you learn brings you closer to fluency. 🎉',
  '¡Muy bien! Keep practicing — consistency is the key to mastering Spanish.',
  '¡Perfecto! Your Spanish is improving with every conversation. Don\'t be afraid to make mistakes — they\'re part of learning!',
  '¡Genial! You\'re building real communication skills. Try using this phrase in a real conversation today.',
  '¡Fantástico! Remember: learning a language is a marathon, not a sprint. You\'re doing great!',
];

const roleKeywords: { keywords: string[]; scenario: string }[] = [
  { keywords: ['restaurant', 'restaurante', 'food role', 'cafe', 'café', 'order food', 'ordering', 'waiter'], scenario: 'restaurant' },
  { keywords: ['airport', 'aeropuerto', 'flight', 'vuelo', 'check in', 'boarding'], scenario: 'airport' },
  { keywords: ['hotel', 'room', 'habitación', 'reservation', 'reserva', 'check-in'], scenario: 'hotel' },
  { keywords: ['meeting', 'meet', 'introduce', 'conocer', 'name', 'new person'], scenario: 'meeting' },
  { keywords: ['shopping', 'shop', 'store', 'tienda', 'buy', 'comprar'], scenario: 'shopping' },
];

function checkCorrection(text: string): { correction: string; note: string } | null {
  const lower = text.toLowerCase().trim();
  for (const c of commonCorrections) {
    if (lower === c.wrong || lower.includes(c.wrong)) {
      return { correction: c.correct, note: c.note };
    }
  }
  return null;
}

function checkGrammar(text: string): string | null {
  const lower = text.toLowerCase();
  for (const g of grammarExplanations) {
    for (const kw of g.keywords) {
      if (lower.includes(kw)) return g.response;
    }
  }
  return null;
}

function detectRolePlay(text: string): string | null {
  const lower = text.toLowerCase();
  for (const r of roleKeywords) {
    for (const kw of r.keywords) {
      if (lower.includes(kw)) return r.scenario;
    }
  }
  return null;
}

function generateGeneralResponse(text: string): string {
  const lower = text.toLowerCase().trim();

  // Greetings
  if (lower.match(/^(hola|hi|hello|hey|buenos|buenas)/)) {
    return '¡Hola! 😊 I\'m your Spanish tutor. I can help you with:\n\n• **Vocabulary** — ask me what a word means\n• **Grammar** — ask about ser/estar, por/para, subjunctive, etc.\n• **Role-play** — say "restaurant roleplay" or "hotel scenario" to practice\n• **Corrections** — type in Spanish and I\'ll check your spelling\n\n¿En qué puedo ayudarte hoy?';
  }

  if (lower.match(/(thank|gracias)/)) {
    return '¡De nada! 😊 Feel free to ask me anything else about Spanish. I\'m here to help you learn!';
  }

  if (lower.match(/(how are you|cómo estás|como estas)/)) {
    return '¡Estoy muy bien, gracias por preguntar! 😄 I\'m always ready to help you practice Spanish. How about you? ¿Y tú, cómo estás? Try answering me in Spanish!';
  }

  if (lower.match(/(help|ayuda|what can you)/)) {
    return 'I can help you with:\n\n• **Grammar explanations** — ser/estar, por/para, tenses, subjunctive, reflexives\n• **Role-play scenarios** — restaurant, airport, hotel, meeting, shopping\n• **Vocabulary practice** — ask me to translate words\n• **Corrections** — type a Spanish sentence and I\'ll correct any mistakes\n• **Conversation practice** — just chat with me in Spanish!\n\nWhat would you like to practice?';
  }

  if (lower.match(/(translate|traducir|what does|what is|qué es|que es)/)) {
    return 'I can help translate! Tell me the word or phrase you\'d like translated, and whether it\'s Spanish → English or English → Spanish. For example: "What does \'la cuenta\' mean?"';
  }

  if (lower.match(/(practice|practicar|let's start|empezar|quiz|test)/)) {
    return '¡Vamos a practicar! 🚀 Let\'s start with a simple question:\n\n**¿Cómo te llamas y de dónde eres?**\n\n(Try answering: "My name is... and I am from...")\n\nTake your time — I\'ll correct any mistakes gently!';
  }

  if (lower.match(/(bye|adiós|adios|chao|hasta)/)) {
    return '¡Hasta luego! 👋 Keep practicing every day to maintain your streak. ¡Buena suerte con tu español! Come back anytime you want to practice more.';
  }

  // Detect if the user wrote in Spanish
  const spanishWords = lower.match(/\b(hola|gracias|por favor|buenos|buenas|sí|no|quiero|tengo|soy|estoy|es|son|la|el|los|las|una|un|de|en|con|para|por|que|qué|cómo|como|dónde|donde|cuándo|cuando|mucho|mucha|bueno|buena|malo|mala|casa|agua|comida|amigo|amiga|trabajo|quiero|puedo|vas|vamos|tiene|tengo|eres|es|fui|fue|hago|hace|haces|como|como|leer|escribir|hablar|escuchar|entender|aprender|sé|saber|dinero|tiempo|día|noche|mañana|tarde|año|mes|semana|hora|minuto)\b/g);
  
  if (spanishWords && spanishWords.length >= 2) {
    // Try to respond in Spanish
    const responses = [
      '¡Muy bien! Estás practicando tu español. Tu mensaje tiene buen vocabulario. ¿Puedes decirme más sobre lo que quieres practicar?',
      '¡Excelente esfuerzo! Entiendo lo que dices. Vamos a seguir conversando — cuéntame, ¿por qué quieres aprender español?',
      '¡Genial! Puedo ver que estás usando vocabulario español. Si quieres, puedo corregir algún error o explicar alguna regla gramatical. ¿Qué te gustaría hacer?',
      '¡Buen trabajo! Tu español es comprensible. Para mejorar, intenta usar frases más largas. ¿Puedes contarme algo sobre tu día en español?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default
  return 'That\'s interesting! 😊 I\'m here to help you learn Spanish. You can:\n\n• Ask me about **grammar rules** (ser/estar, past tenses, subjunctive)\n• Start a **role-play** (restaurant, hotel, airport, meeting)\n• Type in **Spanish** and I\'ll help correct mistakes\n• Ask me to **translate** words or phrases\n\n¿Qué te gustaría practicar?';
}

export function generateAIResponse(userText: string, history: ChatMessage[]): AIResponse {
  const text = userText.trim();

  if (!text) {
    return { content: '¿Puedes repetir eso, por favor? No entendí tu mensaje.' };
  }

  // Check for corrections first
  const correction = checkCorrection(text);
  if (correction) {
    return {
      content: `I noticed a small issue in your sentence. 😊\n\nYou wrote: *"${text}"*\n✅ Correct: *"${correction.correction}"*\n\n**Why:** ${correction.note}\n\nTry saying it again with the correction — you\'re learning fast!`,
      correction: correction.correct,
    };
  }

  // Check for grammar questions
  const grammar = checkGrammar(text);
  if (grammar) {
    return { content: grammar };
  }

  // Check for role-play requests
  const rolePlay = detectRolePlay(text);
  if (rolePlay && rolePlayGreetings[rolePlay]) {
    return { content: rolePlayGreetings[rolePlay] };
  }

  // Check if user is continuing a role-play
  const recentAssistantMessages = history
    .filter((m) => m.role === 'assistant')
    .slice(-2);
  
  for (const msg of recentAssistantMessages) {
    for (const [, greeting] of Object.entries(rolePlayGreetings)) {
      if (msg.content === greeting) {
        // User is in a role-play, respond in character
        const lower = text.toLowerCase();
        if (lower.match(/(gracias|thank|no más|nada más|eso es todo|la cuenta)/)) {
          return {
            content: '¡Perfecto! ¡Gracias por su visita! Espero que haya disfrutado su experiencia con nosotros. ¿Hay algo más en lo que pueda ayudarle antes de que se vaya?',
          };
        }
        if (lower.match(/(sí|yes|quiero|me gustaría|i would like|i want|can i|puedo)/)) {
          return {
            content: '¡Por supuesto! Con mucho gusto. Dígame, ¿qué más necesita? Estoy aquí para ayudarle en lo que necesite. Intente decirlo en español si puede — no se preocupe por los errores, estoy aquí para ayudar.',
          };
        }
        return {
          content: '¡Entendido! Muy bien. Siga practicando — su español está mejorando con cada frase. ¿Hay algo más que quiera decir o preguntar? Recuerde, no tenga miedo de cometer errores, así es como se aprende.',
        };
      }
    }
  }

  // General response
  return { content: generateGeneralResponse(text) };
}

export function getRandomMotivation(): string {
  return motivationalResponses[Math.floor(Math.random() * motivationalResponses.length)];
}
