import { GoogleGenerativeAI } from '@google/generative-ai';

// Retrieve Gemini key from environment or user settings in localStorage
const getGeminiApiKey = (): string => {
  const localKey = localStorage.getItem('studentverse_gemini_key');
  if (localKey && localKey.trim()) return localKey.trim();
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
};

export const hasValidGeminiKey = (): boolean => {
  const key = getGeminiApiKey();
  return Boolean(key && !key.includes('your-gemini') && key.length > 15);
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

/**
 * Send an academic query to Gemini or the built-in intelligent engine
 */
export async function askStudyAssistant(
  prompt: string,
  mode: 'general' | 'explain' | 'summarize' | 'quiz' = 'general'
): Promise<string> {
  const apiKey = getGeminiApiKey();

  if (hasValidGeminiKey()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let systemInstruction = 'You are StudentVerse AI, an expert, encouraging university tutor. Provide clear, structured, engaging academic answers with markdown headers, bullet points, and code examples if appropriate.';
      if (mode === 'explain') {
        systemInstruction += ' Break down difficult concepts into simple, intuitive analogies, core mechanisms, real-world examples, and key interview takeaways.';
      } else if (mode === 'summarize') {
        systemInstruction += ' Provide an executive summary, key definitions, core formulas/principles, and bulleted revision highlights.';
      }

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nStudent Query: ${prompt}` }] }],
      });

      const text = response.response.text();
      if (text) return text;
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to intelligent knowledge base:', err);
    }
  }

  // Built-in intelligent academic fallback generator
  return getIntelligentFallbackResponse(prompt, mode);
}

/**
 * Generate interactive Multiple-Choice Questions (MCQs) for revision
 */
export async function generateQuizQuestions(
  subject: string,
  topic: string,
  count: number = 4
): Promise<QuizQuestion[]> {
  const apiKey = getGeminiApiKey();

  if (hasValidGeminiKey()) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Generate ${count} high-quality university exam-level multiple choice questions on the subject "${subject}" specifically focusing on "${topic}".
Return ONLY valid JSON matching this schema:
[
  {
    "id": "q1",
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why option A is correct..."
  }
]
Do not wrap in markdown quotes or extra text.`;

      const response = await model.generateContent(prompt);
      const rawText = response.response.text().trim();
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('AI quiz generation fallback:', e);
    }
  }

  // Pre-compiled high yield university quiz questions
  return getDefaultQuizQuestions(subject, topic);
}

/**
 * Analyze student resume against job roles
 */
export async function analyzeResumeFeedback(
  resumeText: string,
  targetRole: string = 'Full Stack Developer'
): Promise<{ score: number; strengths: string[]; improvements: string[]; suggestions: string[] }> {
  await new Promise((r) => setTimeout(r, 1200)); // Smooth simulation

  const wordCount = resumeText.trim().split(/\s+/).length;
  const hasGithub = resumeText.toLowerCase().includes('github') || resumeText.toLowerCase().includes('project');
  const hasMetrics = /\d+%|\d+x|\$\d+|\d+\s*users/i.test(resumeText);
  const hasTech = /react|node|python|sql|docker|aws|git|api|database|typescript/i.test(resumeText);

  let score = 65;
  if (wordCount > 150) score += 10;
  if (hasGithub) score += 10;
  if (hasMetrics) score += 10;
  if (hasTech) score += 5;

  return {
    score: Math.min(score, 94),
    strengths: [
      `Clear alignment with core requirements for ${targetRole}`,
      hasTech ? 'Strong visibility of modern technical skills and frameworks' : 'Good foundational academic credentials',
      hasGithub ? 'Clear inclusion of project repositories and hands-on deliverables' : 'Structured educational background and course projects',
    ],
    improvements: [
      hasMetrics ? 'Expand on individual ownership metrics' : 'Quantify project achievements with measurable results (e.g., "Reduced latency by 32%")',
      'Include a concise 2-line technical summary highlighting your specialty at the very top',
      'Add standard ATS-friendly bullet points starting with action verbs (Architected, Engineered, Deployed)',
    ],
    suggestions: [
      `Incorporate 2-3 trending keywords for ${targetRole}: Docker, CI/CD, System Design, RESTful APIs`,
      'Ensure contact links (LinkedIn, GitHub, Portfolio) are clickable and prominently located in the header',
      'Prioritize recent real-world projects over early college textbook assignments',
    ],
  };
}

/**
 * Intelligent fallback generator with deep educational content
 */
function getIntelligentFallbackResponse(prompt: string, mode: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('binary search') || lower.includes('search')) {
    return `### ⚡ Binary Search: Concept & Mechanics

**Binary Search** is an optimal search algorithm that finds the position of a target value within a **sorted array** in logarithmic time: $\\mathcal{O}(\\log n)$.

#### 1. Core Principle
Divide and Conquer:
1. Compare target with the middle element: $\\text{mid} = \\text{low} + \\lfloor(\\text{high} - \\text{low}) / 2\\rfloor$.
2. If $\\text{arr}[\\text{mid}] == \\text{target}$, return index.
3. If $\\text{target} < \\text{arr}[\\text{mid}]$, narrow search space to the left half: $\\text{high} = \\text{mid} - 1$.
4. Otherwise, narrow search space to the right half: $\\text{low} = \\text{mid} + 1$.

\`\`\`typescript
function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}
\`\`\`

#### 🎯 Key University & Interview Takeaway:
* **Time Complexity**: $\\mathcal{O}(1)$ Best case, $\\mathcal{O}(\\log n)$ Average & Worst case.
* **Space Complexity**: $\\mathcal{O}(1)$ Iterative, $\\mathcal{O}(\\log n)$ Recursive call stack.
* **Common Bug**: Avoid \`(low + high) / 2\` because in languages with 32-bit signed integers, it can overflow. Always use \`low + (high - low) / 2\`.`;
  }

  if (lower.includes('b+ tree') || lower.includes('dbms') || lower.includes('index')) {
    return `### 🌳 B+ Trees in Relational Database Indexing

**B+ Trees** are self-balancing $m$-way search trees widely used in relational database engines (PostgreSQL, MySQL InnoDB) for table indexing.

#### Why B+ Trees instead of Binary Search Trees?
1. **High Fan-Out (Wide and Shallow)**: A B+ Tree node holds hundreds of keys, keeping tree height small ($3-4$ levels for millions of rows), minimizing expensive disk I/O operations.
2. **Data Pointers Only in Leaves**: Internal nodes contain only routing keys; all actual record pointers are stored strictly in leaf nodes.
3. **Sequential Leaf Linking**: Leaf nodes are doubly linked lists. This makes **range queries** (e.g., \`WHERE age BETWEEN 20 AND 30\`) extraordinarily fast compared to standard balanced BSTs.

#### Key Exam Points:
* **Lookup Time**: $\\mathcal{O}(\\log_B N)$ where $B$ is the block size.
* **Range Scan**: $\\mathcal{O}(\\log_B N + K)$ where $K$ is the number of matched items.`;
  }

  if (lower.includes('react') || lower.includes('state') || lower.includes('hook')) {
    return `### ⚛️ React 19 State Management & Re-renders

In modern React, components re-render when their **state** or **props** change.

#### Essential Rules:
1. **Immutability First**: Always produce new objects/arrays when updating state rather than mutating in place.
2. **Batching**: React batches multiple state updates inside event handlers and async promises automatically.
3. **Virtual DOM Diffing**: React computes the minimal DOM diff using key attributes and fiber reconciliation.

\`\`\`jsx
// Clean idiomatic update
const [students, setStudents] = useState(['Aarav', 'Neha']);

const addStudent = (name) => {
  setStudents((prev) => [...prev, name]); // New array reference
};
\`\`\`

💡 **Pro-Tip for Interviews**: State setters with callbacks (\`setCount(c => c + 1)\`) prevent race conditions when multiple updates are triggered sequentially!`;
  }

  // Default response
  return `### 🎓 Academic Overview: ${prompt}

Here is a structured breakdown curated for your semester revision:

#### 1. Core Principles
* **Definition**: Understanding the foundational architecture and primary objectives.
* **Application**: Real-world implementation in software engineering and modern systems.
* **Mathematical/Logical Basis**: How inputs transition through state transformations to produce verified outputs.

#### 2. Key Insights for Exams & Technical Interviews
* Always verify edge cases, boundary conditions, and failure modes.
* Keep space and time complexity trade-offs top-of-mind.
* Structure your responses using the **STAR** method (Situation, Task, Action, Result) for behavioral questions and **Problem-Architecture-Tradeoff** for technical designs.

*💡 Would you like an interactive MCQ quiz on this topic or code implementation examples? Just ask!*`;
}

function getDefaultQuizQuestions(subject: string, topic: string): QuizQuestion[] {
  return [
    {
      id: 'q1',
      question: `In ${subject || 'Computer Science'}, what is the worst-case time complexity of finding an element in a balanced search structure with n nodes?`,
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswerIndex: 1,
      explanation: 'Balanced search structures such as AVL trees or Red-Black trees guarantee O(log n) worst-case height and search time.',
    },
    {
      id: 'q2',
      question: 'Which ACID property guarantees that all operations in a database transaction complete successfully, or none take effect?',
      options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'],
      correctAnswerIndex: 2,
      explanation: 'Atomicity ensures the "all-or-nothing" rule for transactions.',
    },
    {
      id: 'q3',
      question: 'In TCP/IP networking, which protocol provides connection-oriented, reliable, and ordered byte-stream delivery?',
      options: ['UDP', 'TCP', 'ICMP', 'ARP'],
      correctAnswerIndex: 1,
      explanation: 'TCP (Transmission Control Protocol) implements sequence numbering, acknowledgments, and flow control.',
    },
    {
      id: 'q4',
      question: 'Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?',
      options: ['First-Come First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correctAnswerIndex: 2,
      explanation: 'Shortest Job First (SJF) is mathematically optimal with respect to minimum average waiting time.',
    },
  ];
}

