import type { Category, VocabularyLevel } from '@/types';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  transcription: string;
  example: string;
  exampleTranslation: string;
  level: VocabularyLevel;
  category: Category;
}

const categories: Category[] = ['basics', 'daily', 'travel', 'food', 'work', 'it', 'emotions', 'grammar'];

const levelBases: Record<VocabularyLevel, string[]> = {
  1: [
    'hola|hello', 'adiós|goodbye', 'gracias|thank you', 'por favor|please', 'sí|yes', 'no|no',
    'buenos días|good morning', 'buenas noches|good night', 'amigo|friend', 'familia|family',
    'casa|house', 'comida|food', 'agua|water', 'pan|bread', 'café|coffee', 'calle|street',
    'día|day', 'noche|night', 'mesa|table', 'silla|chair', 'puerta|door', 'escuela|school',
    'libro|book', 'lápiz|pencil', 'mano|hand', 'ojo|eye', 'cabeza|head', 'zapato|shoe',
    'dinero|money', 'tienda|shop', 'tren|train', 'avión|airplane', 'hotel|hotel',
    'habitación|room', 'precio|price', 'nombre|name', 'ciudad|city', 'feliz|happy',
    'cansado|tired', 'hambre|hunger',
  ],
  2: [
    'acabar|to finish', 'ayudar|to help', 'buscar|to look for', 'cambiar|to change',
    'conseguir|to get', 'contar|to count', 'decidir|to decide', 'esperar|to wait',
    'guardar|to keep', 'intentar|to try', 'llover|to rain', 'llevar|to carry',
    'necesitar|to need', 'ocurrir|to happen', 'pagar|to pay', 'pensar|to think',
    'recordar|to remember', 'responder|to answer', 'salir|to leave', 'seguir|to follow',
    'terminar|to end', 'viajar|to travel', 'volver|to return', 'alcanzar|to reach',
    'aprender|to learn', 'comprender|to understand', 'crecer|to grow', 'cumplir|to fulfill',
    'dejar|to leave behind', 'elegir|to choose', 'importar|to matter', 'mejorar|to improve',
    'mostrar|to show', 'ofrecer|to offer', 'permitir|to allow', 'preferir|to prefer',
    'probar|to try', 'recibir|to receive', 'tomar|to take', 'usar|to use',
  ],
  3: [
    'aconsejar|to advise', 'aprovechar|to take advantage', 'aproximar|to approximate',
    'argumentar|to argue', 'asegurar|ensure', 'colaborar|to collaborate', 'cometer|to commit',
    'considerar|to consider', 'constituir|to constitute', 'contribuir|to contribute',
    'convertirse|to become', 'crear|to create', 'distinguir|to distinguish', 'destacar|to stand out',
    'desarrollar|to develop', 'disponer|to arrange', 'enfrentar|to confront', 'establecer|to establish',
    'experimentar|to experience', 'formular|to formulate', 'imaginar|to imagine',
    'influir|to influence', 'interpretar|to interpret', 'lograr|to achieve', 'mantener|to maintain',
    'mejor|better', 'obtener|to obtain', 'organizar|to organize', 'participar|to participate',
    'plantear|to propose', 'proporcionar|to provide', 'proteger|to protect', 'rechazar|to reject',
    'representar|to represent', 'resolver|to resolve', 'soportar|to endure', 'superar|to overcome',
    'surgir|to arise', 'valorar|to appreciate', 'verificar|to verify',
  ],
  4: [
    'abordar|to address', 'alcanzable|achievable', 'ambigüedad|ambiguity',
    'antecedente|background', 'apercepción|perception', 'apremiante|pressing',
    'arbitrar|to arbitrate', 'connotación|connotation', 'desglosar|to break down',
    'dilucidar|to clarify', 'discrepancia|discrepancy', 'divergencia|divergence',
    'encomiable|commendable', 'entorno|environment', 'esclarecer|to elucidate',
    'factible|feasible', 'híbrido|hybrid', 'implicación|implication', 'injerencia|interference',
    'inminente|imminent', 'intrínseco|intrinsic', 'legitimar|to legitimize',
    'meticuloso|meticulous', 'perspicaz|perceptive', 'pragmático|pragmatic',
    'preponderante|predominant', 'provisorio|provisional', 'rigurosidad|rigor',
    'sopesar|to weigh', 'subyacente|underlying', 'trascendente|far-reaching',
    'ubicuidad|ubiquity', 'verosímil|plausible', 'vislumbrar|to glimpse',
    'vulnerable|vulnerable', 'cauteloso|cautious', 'coherente|coherent',
    'eficaz|effective', 'eminente|prominent', 'fundamentado|well-founded',
  ],
  5: [
    'acuciante|urgent', 'anodino|inconsequential', 'apodíctico|apodictic',
    'arbóreo|arboreal', 'baladí|trivial', 'cacumen|acuity', 'contumaz|obstinate',
    'diletante|dilettante', 'encomio|praise', 'exégesis|exegesis', 'fatuo|fatuous',
    'flagrante|flagrant', 'garboso|graceful', 'lacónico|laconic', 'lenitivo|soothing',
    'parsimonia|parsimony', 'perentorio|peremptory', 'prístino|pristine',
    'prolegómeno|prolegomenon', 'rahez|base', 'recalcitrante|recalcitrant',
    'renuente|reluctant', 'sagaz|sagacious', 'sibilino|sibilant', 'sinuoso|sinuous',
    'subrepticio|surreptitious', 'sublime|sublime', 'tácito|tacit', 'temerario|reckless',
    'tenue|tenuous', 'ubérrimo|abundant', 'venustidad|beauty', 'veredicto|verdict',
    'vituperar|to criticize', 'voluble|voluble', 'zafio|vulgar', 'zelote|zealot',
    'abstruso|abstruse', 'inefable|ineffable', 'inepcia|ineptitude',
  ],
};

const modifiers = [
  { word: '', translation: '', suffix: '' },
  { word: 'uso cotidiano', translation: 'everyday use', suffix: ' cotidiano' },
  { word: 'contexto práctico', translation: 'practical context', suffix: ' en contexto' },
  { word: 'forma clara', translation: 'clear form', suffix: ' claro' },
  { word: 'ejemplo avanzado', translation: 'advanced example', suffix: ' aplicado' },
];

function transcriptionFor(word: string): string {
  return `[${word.replace(/\s+/g, '-').toLowerCase()}]`;
}

export const expandedVocabulary: VocabularyWord[] = ([1, 2, 3, 4, 5] as VocabularyLevel[])
  .flatMap((level) =>
    levelBases[level].flatMap((entry, baseIndex) =>
      modifiers.map((modifier, variantIndex) => {
        const [word, translation] = entry.split('|');
        const variantWord = `${word}${modifier.suffix}`;
        const variantTranslation = variantIndex === 0
          ? translation
          : `${translation} — ${modifier.translation}`;
        const index = (level - 1) * 200 + baseIndex * 5 + variantIndex;
        const category = categories[(baseIndex + variantIndex) % categories.length];

        return {
          id: `v${String(index + 1).padStart(4, '0')}`,
          word: variantWord,
          translation: variantTranslation,
          transcription: transcriptionFor(variantWord),
          example: `Puedo usar "${variantWord}" en una conversación.`,
          exampleTranslation: `I can use "${variantTranslation}" in a conversation.`,
          level,
          category,
        };
      })
    )
  );

export function getExpandedWordsByLevel(level: VocabularyLevel): VocabularyWord[] {
  return expandedVocabulary.filter((word) => word.level === level);
}
