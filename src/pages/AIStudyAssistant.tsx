import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Code,
  Zap,
  Lightbulb,
} from 'lucide-react';
import { askStudyAssistant, generateQuizQuestions, QuizQuestion, hasValidGeminiKey } from '../services/aiService';

export const AIStudyAssistant: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'explain' | 'summarize' | 'quiz'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat conversation history
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: 'user' | 'assistant'; text: string; timestamp: string }[]
  >([
    {
      id: 'm1',
      role: 'assistant',
      text: `Hello! I am your **StudentVerse AI Study Assistant**. 

I can help you:
* 💡 **Explain complex concepts** with simple analogies and real-world mechanisms
* ⚡ **Summarize lecture notes** into concise high-yield revision bullet points
* 🎯 **Generate exam-standard quizzes** with instant scoring and explanations
* 💻 **Debug algorithms & code** in Python, C++, Java, and TypeScript

What topic or problem would you like to master today?`,
      timestamp: 'Just now',
    },
  ]);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizSubject, setQuizSubject] = useState('Design & Analysis of Algorithms');
  const [quizTopic, setQuizTopic] = useState('Dynamic Programming & Graph Theory');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    const newMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: newMsgId,
      role: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await askStudyAssistant(userText, activeMode);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          text: 'Sorry, I encountered an issue while generating your response. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setUserAnswers({});
    setQuizSubmitted(false);
    try {
      const questions = await generateQuizQuestions(quizSubject, quizTopic, 4);
      setQuizQuestions(questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectQuizAnswer = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) score += 1;
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {hasValidGeminiKey() ? 'Gemini 1.5 Flash Connected' : 'High-Fidelity AI Intelligence Active'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Study Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Personalized academic explanations, instant quiz generation, and lecture summarization
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#11182B] p-1 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'chat'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Chat & Ask
          </button>
          <button
            onClick={() => setActiveMode('explain')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'explain'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Concept Explainer
          </button>
          <button
            onClick={() => setActiveMode('summarize')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'summarize'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Notes Summarizer
          </button>
          <button
            onClick={() => {
              setActiveMode('quiz');
              if (quizQuestions.length === 0) handleGenerateQuiz();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'quiz'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quiz Generator
          </button>
        </div>
      </div>

      {/* Main Mode View */}
      {activeMode !== 'quiz' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Messages Panel (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[650px] bg-[#11182B] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            {/* Conversation scroll area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[90%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gradient-to-tr from-purple-500 to-sky-400 text-slate-900 shadow-md'
                    }`}
                  >
                    {msg.role === 'user' ? 'Me' : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-[#171F35] text-slate-200 border border-white/5 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {/* Markdown render simulated cleanly */}
                      <div className="whitespace-pre-wrap font-sans space-y-2">
                        {msg.text}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                      <span>{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="hover:text-purple-400 transition-colors flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#171F35] border border-white/5 text-slate-400 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                    <span>Synthesizing academic answer...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-[#151C2F] border-t border-white/5 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  activeMode === 'explain'
                    ? 'Enter concept to explain (e.g. "Virtual Memory Page Replacement")...'
                    : activeMode === 'summarize'
                    ? 'Paste notes or prompt to summarize into revision highlights...'
                    : 'Ask anything (e.g. "Derive Dijkstra algorithm time complexity")...'
                }
                className="flex-1 bg-[#11182B] text-xs sm:text-sm text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-600/30 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Prompts & Topic Suggestions (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-[#11182B] border border-white/5 shadow-xl space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-300" />
                Popular University Prompts
              </h4>
              <p className="text-xs text-slate-400">Click any prompt to instantly run:</p>

              <div className="space-y-2 pt-1">
                {[
                  'Explain Binary Search algorithm and overflow edge case',
                  'Why are B+ Trees better than BST for databases?',
                  'Dijkstra vs Bellman-Ford negative cycle difference',
                  'Summarize ACID properties with banking transaction example',
                  'Explain React 19 state batching and reconciliation',
                ].map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputPrompt(promptText);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#171F35] hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/5 text-xs text-slate-300 transition-all leading-snug"
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 to-[#171F35] border border-purple-500/20 shadow-xl space-y-2 text-xs">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-300" />
                Semester Exam Revision Tip
              </p>
              <p className="text-slate-300 leading-relaxed">
                Use the <strong>Quiz Generator</strong> mode after reviewing any subject to test your active recall. Active testing improves retention by over 60% compared to passive re-reading.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Generator Mode */
        <div className="p-6 rounded-3xl bg-[#11182B] border border-white/5 shadow-2xl space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#171F35] border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full bg-[#11182B] text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="w-full bg-[#11182B] text-xs text-white px-3 py-2 rounded-xl border border-white/10"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Generate New Quiz
            </button>
          </div>

          {/* Questions List */}
          {quizQuestions.length > 0 && (
            <div className="space-y-6">
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-[#171F35] border border-white/5 space-y-3">
                  <p className="text-sm font-bold text-white flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      const isCorrect = optIdx === q.correctAnswerIndex;
                      let btnStyle = 'bg-[#11182B] text-slate-300 hover:bg-white/5 border-white/5';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600/30 text-emerald-200 border-emerald-500 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-600/30 text-rose-200 border-rose-500';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-600 text-white border-purple-500 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => selectQuizAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {/* Quiz Submit & Score Bar */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171F35] border border-white/5">
                <div>
                  {quizSubmitted ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-white">
                        Your Score: {calculateScore()} / {quizQuestions.length} (
                        {Math.round((calculateScore() / quizQuestions.length) * 100)}%)
                      </span>
                      <span className="text-xs text-emerald-400 font-bold">
                        {calculateScore() >= 3 ? '🎉 Excellent mastery!' : 'Keep practicing!'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Answered {Object.keys(userAnswers).length} of {quizQuestions.length} questions
                    </span>
                  )}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateQuiz}
                    className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    Retake / Next Topic
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

