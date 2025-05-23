import { ChatSession, ChatMessage } from "@/types/ai-chat";

// Conversion des timestamps en format ISO pour correspondre au type attendu
const convertTimestampToISO = (time: string): string => {
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  now.setHours(hours, minutes, 0, 0);
  return now.toISOString();
};

// Messages de la conversation sur les algorithmes de tri
const algorithmMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Bonjour ! Je suis l'assistant IA de SkillUp. Comment puis-je vous aider aujourd'hui avec vos études ?",
    timestamp: convertTimestampToISO("12:30"),
  },
  {
    id: "2",
    role: "user",
    content: "J'ai besoin d'aide pour comprendre les algorithmes de tri.",
    timestamp: convertTimestampToISO("12:31"),
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Bien sûr ! Les algorithmes de tri sont des méthodes pour organiser les éléments d'une liste dans un ordre spécifique. Voici les principaux algorithmes de tri :\n\n1. Tri à bulles : Compare les éléments adjacents et les échange si nécessaire. Complexité O(n²).\n\n2. Tri par insertion : Construit le tableau trié un élément à la fois. Complexité O(n²).\n\n3. Tri par sélection : Trouve le plus petit élément et le place au début. Complexité O(n²).\n\n4. Tri rapide (Quicksort) : Utilise la stratégie diviser pour régner. Complexité moyenne O(n log n).\n\n5. Tri fusion (Mergesort) : Divise, trie et fusionne. Complexité O(n log n).\n\nQuel algorithme vous intéresse particulièrement ?",
    timestamp: convertTimestampToISO("12:32"),
  },
  {
    id: "4",
    role: "user",
    content: "Je voudrais comprendre le tri rapide (Quicksort) plus en détail.",
    timestamp: convertTimestampToISO("12:33"),
  },
  {
    id: "5",
    role: "assistant",
    content:
      "Le tri rapide (Quicksort) est un algorithme efficace qui utilise la stratégie de division et conquête. Voici comment il fonctionne :\n\n1. Choisir un élément pivot dans le tableau.\n2. Réorganiser le tableau de sorte que tous les éléments inférieurs au pivot soient placés avant lui, et tous les éléments supérieurs après lui. Le pivot est maintenant à sa position finale.\n3. Appliquer récursivement les étapes 1 et 2 aux sous-tableaux à gauche et à droite du pivot.\n\nLe choix du pivot est crucial pour la performance. Dans le pire cas (si on choisit toujours le plus petit ou le plus grand élément), la complexité est O(n²). Mais en moyenne, elle est O(n log n).\n\nVoulez-vous voir un exemple concret ou un pseudo-code de l'algorithme ?",
    timestamp: convertTimestampToISO("12:35"),
  },
];

// Exemple de conversations pour le chat IA
export const chatHistoryData: ChatSession[] = [
  {
    id: "1",
    title: "Algorithmes de tri",
    messages: algorithmMessages,
    createdAt: convertTimestampToISO("12:30"),
    updatedAt: convertTimestampToISO("12:35"),
  },
  {
    id: "2",
    title: "Structures de données",
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "Bonjour ! Comment puis-je vous aider avec les structures de données ?",
        timestamp: convertTimestampToISO("14:00"),
      },
      {
        id: "2",
        role: "user",
        content: "Pouvez-vous m'expliquer la différence entre une pile et une file ?",
        timestamp: convertTimestampToISO("14:01"),
      },
      {
        id: "3",
        role: "assistant",
        content: "Bien sûr ! Une pile (stack) suit le principe LIFO (Last In, First Out), où le dernier élément ajouté est le premier à être retiré. Une file (queue) suit le principe FIFO (First In, First Out), où le premier élément ajouté est le premier à être retiré.",
        timestamp: convertTimestampToISO("14:02"),
      },
    ],
    createdAt: convertTimestampToISO("14:00"),
    updatedAt: convertTimestampToISO("14:02"),
  },
  {
    id: "3",
    title: "Programmation orientée objet",
    messages: [
      {
        id: "1",
        role: "assistant",
        content: "Bonjour ! Comment puis-je vous aider avec la programmation orientée objet ?",
        timestamp: convertTimestampToISO("15:30"),
      },
      {
        id: "2",
        role: "user",
        content: "Quels sont les principes fondamentaux de la POO ?",
        timestamp: convertTimestampToISO("15:31"),
      },
      {
        id: "3",
        role: "assistant",
        content: "Les quatre principes fondamentaux de la programmation orientée objet sont : l'encapsulation, l'héritage, le polymorphisme et l'abstraction. Voulez-vous que je vous explique chacun d'eux en détail ?",
        timestamp: convertTimestampToISO("15:32"),
      },
    ],
    createdAt: convertTimestampToISO("15:30"),
    updatedAt: convertTimestampToISO("15:32"),
  },
];
