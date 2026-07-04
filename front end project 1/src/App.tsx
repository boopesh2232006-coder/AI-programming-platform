import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Brain, 
  Accessibility, 
  ShieldCheck, 
  Code, 
  ChevronRight, 
  Volume2, 
  Mic, 
  Settings,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  Trophy,
  User,
  LayoutDashboard,
  Play,
  Bookmark,
  Search,
  Flame,
  Star,
  Moon,
  Sun,
  Award,
  Zap,
  BookMarked,
  Layers,
  RotateCcw,
  Send,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Trash2,
  Sparkles,
  Menu,
  Type as TypeIcon,
  List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getPersonalizedFeedback, getAdaptiveQuestion, topicVideos, getVideosByTopic, getAllUnits, evaluateCode, getInterviewResponse, summarizeContent } from './lib/gemini';
import { cn } from './lib/utils';

// --- Types ---
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: string;
  explanation: string;
}

// --- Components ---

const Header = ({ darkMode, streak, bookmarkCount, onToggleDark, onSignOut, toggleSidebar, userEmail, userRole, searchQuery, setSearchQuery, onNavigate }: any) => {
  const [showProfile, setShowProfile] = useState(false);

  const searchableItems = [
    { label: 'Home', view: 'home', icon: BookOpen },
    { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Code Arena', view: 'arena', icon: Zap },
    { label: 'Skill Inventory', view: 'inventory', icon: BarChart3 },
    { label: 'Video Learning', view: 'videos', icon: Play },
    { label: 'Interview Prep', view: 'interview', icon: Mic },
    { label: 'My Notes', view: 'notes', icon: Layers },
    { label: 'Saved Items', view: 'bookmarks', icon: Bookmark },
    { label: 'Flashcards', view: 'flashcards', icon: Brain },
    { label: 'Code Snippets', view: 'snippets', icon: Code },
    { label: 'Achievements', view: 'achievements', icon: Trophy },
    { label: 'Leaderboard', view: 'leaderboard', icon: Trophy },
  ];

  const results = searchQuery 
    ? searchableItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className={`h-16 border-b sticky top-0 z-30 flex items-center justify-between px-6 ${darkMode ? 'border-gray-800 bg-gray-950/80' : 'border-gray-200 bg-white/80'} backdrop-blur-md`}>
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative max-w-md hidden sm:block">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-transparent'} focus-within:ring-2 focus-within:ring-indigo-500 group`}>
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, topics..." 
              className={`bg-transparent outline-none text-sm w-48 transition-all ${darkMode ? 'text-white' : 'text-gray-900'}`} 
            />
          </div>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`absolute left-0 right-0 mt-2 rounded-2xl shadow-2xl border p-2 z-50 overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
              >
                {results.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onNavigate(item.view);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-indigo-50 text-gray-700'}`}
                  >
                    <item.icon className="w-4 h-4 opacity-50" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600">{streak}</span>
          </div>
        )}
        
        <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`} onClick={onToggleDark}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}>
          <Mic className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent hover:border-indigo-300 transition-all overflow-hidden"
          >
            <User className="w-5 h-5 text-indigo-600" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-xl p-2 border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} z-50`}
              >
                <div className="p-3 border-b border-gray-100 mb-2">
                  <p className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userEmail || 'Guest'}</p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{userRole || 'Learner'}</p>
                </div>
                <button onClick={onSignOut} className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ currentView, setView, darkMode, onClose }: any) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Skill Inventory', icon: BarChart3 },
    { id: 'videos', label: 'Video Learning', icon: Play },
    { id: 'arena', label: 'Code Arena', icon: Zap },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'snippets', label: 'Code Snippets', icon: Code },
    { id: 'interview', label: 'Interview Prep', icon: Mic },
    { id: 'bookmarks', label: 'Saved Items', icon: Bookmark },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'notes', label: 'My Notes', icon: Layers },
  ];

  const sectionItems = [
    { id: 'ecosystem', label: 'Skill Ecosystem', icon: Accessibility },
    { id: 'accessibility', label: 'Accessibility', icon: ShieldCheck },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform lg:translate-x-0 transition-transform duration-300 ease-in-out border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} lg:static lg:inset-0`}>
      <div className="h-full flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>InclusiAssess</span>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Core Platform</p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); onClose?.(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    currentView === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Research & Impact</p>
            <nav className="space-y-1">
              {sectionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setView('home'); setTimeout(() => {
                    const el = document.getElementById(item.id);
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100); onClose?.(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className={`mt-auto pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Premium Account</p>
              <p className="text-[10px] text-gray-500 font-medium">Full Access Level</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};


const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const AdaptiveQuiz = ({ onComplete }: { onComplete: (score: number, total: number, answers: any[]) => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<string>("Initial assessment");

  const TOTAL_QUESTIONS = 5;

  const fetchNextQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setShowExplanation(false);
    const nextQ = await getAdaptiveQuestion(performanceHistory, askedQuestions);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setQuestionCount(prev => prev + 1);
      setAskedQuestions(prev => [...prev, nextQ.question]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    const isCorrect = index === currentQuestion?.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    
    const newAnswer = {
      question: currentQuestion?.question,
      selected: currentQuestion?.options[index],
      correct: currentQuestion?.options[currentQuestion.correctAnswer],
      isCorrect,
      difficulty: currentQuestion?.difficulty
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    setPerformanceHistory(prev => `${prev}. Last difficulty: ${currentQuestion?.difficulty}, Result: ${isCorrect ? 'Correct' : 'Incorrect'}`);
  };

  const handleNext = () => {
    if (questionCount >= TOTAL_QUESTIONS) {
      onComplete(score, TOTAL_QUESTIONS, answers);
    } else {
      fetchNextQuestion();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">AI is adapting to your level...</p>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {currentQuestion.difficulty}
          </span>
          <span className="text-sm text-gray-400">Question {questionCount} of {TOTAL_QUESTIONS}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
              window.speechSynthesis.speak(utterance);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" 
            title="Read Aloud"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Voice Input">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        key={questionCount}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrect = showExplanation && isCorrect;
            const showWrong = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
                className={cn(
                  "w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between group",
                  isSelected ? "border-indigo-600 bg-indigo-50" : "border-gray-100 hover:border-indigo-200 hover:bg-gray-50",
                  showCorrect && "border-emerald-500 bg-emerald-50",
                  showWrong && "border-rose-500 bg-rose-50"
                )}
              >
                <span className={cn(
                  "font-medium",
                  isSelected ? "text-indigo-900" : "text-gray-700",
                  showCorrect && "text-emerald-900",
                  showWrong && "text-rose-900"
                )}>
                  {option}
                </span>
                {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {showWrong && <XCircle className="w-5 h-5 text-rose-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <h4 className="font-bold text-gray-900 mb-2">Explanation</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentQuestion.explanation}
              </p>
              <button
                onClick={handleNext}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {questionCount >= TOTAL_QUESTIONS ? 'Finish Assessment' : 'Next Question'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ResultsView = ({ score, total, answers, onStartLearningPath }: any) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateFeedback = async () => {
      const result = await getPersonalizedFeedback(score, total, answers);
      setFeedback(result);
      setLoading(false);
    };
    generateFeedback();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
          <Trophy className="w-10 h-10 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Assessment Complete!</h1>
        <p className="text-gray-500 text-lg">You scored <span className="text-indigo-600 font-bold">{score}</span> out of {total}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">AI-Driven Skill Analysis</h2>
            </div>
            {loading ? (
              <div className="flex items-center gap-3 text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating your personalized skill ecosystem report...</span>
              </div>
            ) : (
              <div className="prose prose-indigo max-w-none text-gray-600">
                <ReactMarkdown>{feedback || ''}</ReactMarkdown>
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-bold text-gray-900">Question Breakdown</h2>
            </div>
            <div className="space-y-4">
              {answers.map((ans: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{ans.question}</p>
                      <p className="text-xs text-gray-500">Difficulty: {ans.difficulty}</p>
                    </div>
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white">
            <h3 className="text-lg font-bold mb-4">Next Steps</h3>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 shrink-0" />
                <span>Review Java Multithreading basics</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Implement Spring Security in your next project</span>
              </li>
              <li className="flex items-start gap-3">
                <Code className="w-5 h-5 shrink-0" />
                <span>Practice 5 medium-level LeetCode problems</span>
              </li>
            </ul>
            <button 
              onClick={onStartLearningPath}
              className="mt-8 w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              Start Learning Path
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Accessibility Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">TTS Usage</span>
                <span className="font-bold text-gray-900">12%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Voice Input</span>
                <span className="font-bold text-gray-900">0%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Language</span>
                <span className="font-bold text-gray-900">English</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ answers, results }: { answers: any[], results?: { score: number; total: number; answers: any[] } | null }) => {
  // Import fallback questions to show all available questions
  const allQuestions = [
    // Unit 1: Java Fundamentals
    {
      question: "What does JVM stand for in Java?",
      options: ["Java Virtual Machine", "Java Verified Module", "Just Variable Memory", "Java Version Manager"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "JVM stands for Java Virtual Machine, which executes Java bytecode on any platform.",
      unit: "Java Fundamentals",
      topic: "Core Concepts"
    },
    {
      question: "Which keyword is used to define a class in Java?",
      options: ["function", "class", "struct", "module"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "The keyword 'class' is used in Java to define a class.",
      unit: "Java Fundamentals",
      topic: "Syntax"
    },
    {
      question: "Which Java collection preserves insertion order and allows duplicate elements?",
      options: ["HashSet", "TreeSet", "ArrayList", "PriorityQueue"],
      correctAnswer: 2,
      difficulty: "Medium",
      explanation: "ArrayList preserves insertion order and allows duplicate values.",
      unit: "Java Fundamentals",
      topic: "Collections"
    },
    {
      question: "Which access modifier allows visibility only within the same package?",
      options: ["public", "private", "protected", "default"],
      correctAnswer: 3,
      difficulty: "Medium",
      explanation: "Default access in Java is package-private, meaning it is visible only within the same package.",
      unit: "Java Fundamentals",
      topic: "Access Modifiers"
    },
    {
      question: "What is the output type of the 'main' method in Java?",
      options: ["void", "int", "String", "boolean"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "The main method in Java is declared with return type void because it does not return any value.",
      unit: "Java Fundamentals",
      topic: "Methods"
    },
    {
      question: "What is method overloading in Java?",
      options: ["Having multiple methods with the same name but different parameters", "Having multiple classes with the same name", "Having multiple variables with the same name", "Having multiple constructors in a class"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "Method overloading allows multiple methods with the same name but different parameter lists.",
      unit: "Java Fundamentals",
      topic: "OOP Concepts"
    },
    {
      question: "Which of these is not a primitive data type in Java?",
      options: ["int", "boolean", "String", "char"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "String is a class in Java, not a primitive data type. Primitive types are: byte, short, int, long, float, double, boolean, char.",
      unit: "Java Fundamentals",
      topic: "Data Types"
    },
    // Unit 2: Web Development
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "HTML stands for HyperText Markup Language, the standard markup language for creating web pages.",
      unit: "Web Development",
      topic: "HTML Basics"
    },
    {
      question: "Which CSS property is used to change the text color?",
      options: ["font-color", "text-color", "color", "foreground-color"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "The 'color' property in CSS is used to set the color of text.",
      unit: "Web Development",
      topic: "CSS Basics"
    },
    {
      question: "What is the purpose of JavaScript in web development?",
      options: ["To style web pages", "To create interactive web pages", "To structure web content", "To store data on servers"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "JavaScript is used to add interactivity and dynamic behavior to web pages.",
      unit: "Web Development",
      topic: "JavaScript Basics"
    },
    {
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML.",
      unit: "Web Development",
      topic: "HTML Elements"
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "CSS stands for Cascading Style Sheets, used for describing the presentation of web pages.",
      unit: "Web Development",
      topic: "CSS Basics"
    },
    {
      question: "Which JavaScript method is used to select an HTML element by its ID?",
      options: ["getElementById()", "querySelector()", "getElementsByClassName()", "getElementsByTagName()"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "getElementById() is a DOM method that returns the element with the specified ID.",
      unit: "Web Development",
      topic: "DOM Manipulation"
    },
    {
      question: "What is responsive web design?",
      options: ["Design that responds to user interactions", "Design that adapts to different screen sizes", "Design that loads quickly", "Design that uses animations"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Responsive web design ensures web pages look good on all devices by adapting to different screen sizes.",
      unit: "Web Development",
      topic: "Responsive Design"
    },
    // Unit 3: Python Programming
    {
      question: "What is the correct way to declare a variable in Python?",
      options: ["var x = 5", "int x = 5", "x = 5", "declare x = 5"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "In Python, variables are declared simply by assigning a value: x = 5",
      unit: "Python Programming",
      topic: "Variables"
    },
    {
      question: "Which of these is not a Python data type?",
      options: ["list", "tuple", "array", "dictionary"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "Python has lists, tuples, and dictionaries as built-in data types, but 'array' is not a built-in type (though available via numpy).",
      unit: "Python Programming",
      topic: "Data Types"
    },
    {
      question: "What does 'PEP 8' refer to in Python?",
      options: ["A Python package", "Python Enhancement Proposal for coding style", "A Python framework", "Python's version number"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "PEP 8 is the Python Enhancement Proposal that provides coding conventions for Python code.",
      unit: "Python Programming",
      topic: "Best Practices"
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "define", "func"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "The 'def' keyword is used to define functions in Python.",
      unit: "Python Programming",
      topic: "Functions"
    },
    {
      question: "What is a Python list comprehension?",
      options: ["A way to create lists using loops", "A method to sort lists", "A function to filter lists", "A way to copy lists"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "List comprehensions provide a concise way to create lists using a single line of code with loops and conditions.",
      unit: "Python Programming",
      topic: "List Operations"
    },
    {
      question: "Which module is used for regular expressions in Python?",
      options: ["regex", "re", "regexp", "pattern"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "The 're' module provides regular expression matching operations in Python.",
      unit: "Python Programming",
      topic: "Modules"
    },
    {
      question: "What is the purpose of 'pip' in Python?",
      options: ["Python interpreter", "Package installer", "Code formatter", "Virtual environment manager"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "pip is the package installer for Python, used to install and manage Python packages.",
      unit: "Python Programming",
      topic: "Package Management"
    },
    // Unit 4: Database Management
    {
      question: "What does SQL stand for?",
      options: ["Simple Query Language", "Structured Query Language", "Standard Query Language", "System Query Language"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
      unit: "Database Management",
      topic: "SQL Basics"
    },
    {
      question: "Which SQL command is used to retrieve data from a database?",
      options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "The SELECT statement is used to query and retrieve data from a database.",
      unit: "Database Management",
      topic: "SQL Commands"
    },
    {
      question: "What is a primary key in a database?",
      options: ["The first column in a table", "A unique identifier for each record", "The most important data in a table", "A password for database access"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "A primary key is a unique identifier for each record in a database table.",
      unit: "Database Management",
      topic: "Database Design"
    },
    {
      question: "Which SQL clause is used to filter records?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "The WHERE clause is used to filter records based on specified conditions.",
      unit: "Database Management",
      topic: "SQL Queries"
    },
    {
      question: "What is normalization in database design?",
      options: ["Making data smaller", "Organizing data to reduce redundancy", "Sorting data alphabetically", "Encrypting database files"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.",
      unit: "Database Management",
      topic: "Database Design"
    },
    {
      question: "Which type of database uses tables with relationships?",
      options: ["NoSQL", "Relational", "Hierarchical", "Network"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Relational databases use tables with relationships between them, following the relational model.",
      unit: "Database Management",
      topic: "Database Types"
    },
    {
      question: "What is a foreign key?",
      options: ["A key from another country", "A field that links to the primary key of another table", "An encrypted key", "A backup key"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "A foreign key is a field in one table that refers to the primary key in another table, creating a relationship.",
      unit: "Database Management",
      topic: "Relationships"
    },
    // Unit 5: Data Structures & Algorithms
    {
      question: "Which data structure follows Last In First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "A stack follows the LIFO (Last In First Out) principle - the last element added is the first one removed.",
      unit: "Data Structures & Algorithms",
      topic: "Stacks & Queues"
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Binary search has O(log n) time complexity as it divides the search space in half with each comparison.",
      unit: "Data Structures & Algorithms",
      topic: "Search Algorithms"
    },
    {
      question: "Which sorting algorithm has the best average case time complexity?",
      options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Quick Sort has an average time complexity of O(n log n), which is optimal for comparison-based sorting.",
      unit: "Data Structures & Algorithms",
      topic: "Sorting Algorithms"
    },
    {
      question: "What is a hash table?",
      options: ["A table for storing hash values", "A data structure that maps keys to values using a hash function", "A table that stores hashed passwords", "A database table"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "A hash table is a data structure that implements an associative array using a hash function to map keys to values.",
      unit: "Data Structures & Algorithms",
      topic: "Hash Tables"
    },
    {
      question: "Which data structure is used for implementing recursion?",
      options: ["Stack", "Queue", "Array", "Tree"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "The call stack is used to implement recursion - each recursive call adds a new frame to the stack.",
      unit: "Data Structures & Algorithms",
      topic: "Recursion"
    },
    {
      question: "What is Big O notation used for?",
      options: ["Measuring algorithm performance", "Writing complex code", "Creating data structures", "Debugging programs"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "Big O notation is used to describe the upper bound of an algorithm's time or space complexity.",
      unit: "Data Structures & Algorithms",
      topic: "Algorithm Analysis"
    },
    {
      question: "Which traversal visits the root node first in a tree?",
      options: ["Inorder", "Preorder", "Postorder", "Level order"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Preorder traversal visits the root node first, then the left subtree, then the right subtree.",
      unit: "Data Structures & Algorithms",
      topic: "Tree Traversal"
    },
    // Unit 6: React & Frontend Frameworks
    {
      question: "What is JSX in React?",
      options: ["A JavaScript framework", "A syntax extension for JavaScript", "A CSS preprocessor", "A database query language"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React components.",
      unit: "React & Frontend Frameworks",
      topic: "React Basics"
    },
    {
      question: "What is the purpose of useState in React?",
      options: ["To create components", "To manage component state", "To handle events", "To make API calls"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "useState is a React Hook that allows functional components to manage local state.",
      unit: "React & Frontend Frameworks",
      topic: "React Hooks"
    },
    {
      question: "What is component lifecycle in React?",
      options: ["The time a component exists", "The methods called during a component's existence", "The styling of components", "The routing between components"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Component lifecycle refers to the series of methods that are invoked at different stages of a component's existence.",
      unit: "React & Frontend Frameworks",
      topic: "Component Lifecycle"
    },
    {
      question: "What does 'props' stand for in React?",
      options: ["Properties", "Parameters", "Functions", "Variables"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "Props is short for properties - they are inputs to React components.",
      unit: "React & Frontend Frameworks",
      topic: "Props & State"
    },
    {
      question: "Which hook is used for side effects in React?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "useEffect is used to perform side effects in functional components, such as data fetching or DOM manipulation.",
      unit: "React & Frontend Frameworks",
      topic: "React Hooks"
    },
    {
      question: "What is the virtual DOM in React?",
      options: ["A copy of the real DOM", "A lightweight representation of the real DOM", "A database for React components", "A testing framework"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "The virtual DOM is a lightweight JavaScript representation of the real DOM that React uses for efficient updates.",
      unit: "React & Frontend Frameworks",
      topic: "Virtual DOM"
    },
    {
      question: "What is Redux used for in React applications?",
      options: ["Styling components", "State management", "Routing", "Testing"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Redux is a state management library commonly used with React to manage complex application state.",
      unit: "React & Frontend Frameworks",
      topic: "State Management"
    },
    // Unit 7: Backend Development
    {
      question: "What is REST API?",
      options: ["A type of database", "A set of rules for building web services", "A programming language", "A testing framework"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "REST (Representational State Transfer) API is an architectural style for building web services using HTTP methods.",
      unit: "Backend Development",
      topic: "APIs"
    },
    {
      question: "Which HTTP method is used to create new resources?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "POST is used to create new resources on the server.",
      unit: "Backend Development",
      topic: "HTTP Methods"
    },
    {
      question: "What is middleware in backend development?",
      options: ["Database software", "Code that runs between request and response", "Frontend framework", "Testing tool"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Middleware is software that runs between the request and response in a web application, often for authentication, logging, etc.",
      unit: "Backend Development",
      topic: "Middleware"
    },
    {
      question: "What is JWT used for?",
      options: ["Database encryption", "User authentication", "File compression", "Code minification"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "JWT (JSON Web Tokens) are commonly used for user authentication and authorization in web applications.",
      unit: "Backend Development",
      topic: "Authentication"
    },
    {
      question: "Which framework is commonly used for building REST APIs in Python?",
      options: ["Django", "Flask", "React", "Vue.js"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Flask is a lightweight web framework for Python that's commonly used to build REST APIs.",
      unit: "Backend Development",
      topic: "Frameworks"
    },
    {
      question: "What is CORS in web development?",
      options: ["A database system", "Cross-Origin Resource Sharing policy", "A CSS framework", "A testing tool"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access resources on a web server.",
      unit: "Backend Development",
      topic: "Security"
    },
    {
      question: "What is the purpose of environment variables in backend development?",
      options: ["To store user data", "To configure application settings securely", "To create database schemas", "To write test cases"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Environment variables are used to store configuration settings like API keys, database URLs, and other sensitive information.",
      unit: "Backend Development",
      topic: "Configuration"
    },
    // Unit 8: DevOps & Tools
    {
      question: "What is Git used for?",
      options: ["Writing code", "Version control", "Testing applications", "Deploying to production"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Git is a distributed version control system used to track changes in source code during software development.",
      unit: "DevOps & Tools",
      topic: "Version Control"
    },
    {
      question: "What is Docker?",
      options: ["A programming language", "A containerization platform", "A database", "A testing framework"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Docker is a platform for developing, shipping, and running applications in containers.",
      unit: "DevOps & Tools",
      topic: "Containerization"
    },
    {
      question: "What is CI/CD?",
      options: ["Continuous Integration/Continuous Deployment", "Code Integration/Code Deployment", "Cloud Infrastructure/Cloud Development", "Container Integration/Container Deployment"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "CI/CD stands for Continuous Integration/Continuous Deployment - practices for automating software delivery.",
      unit: "DevOps & Tools",
      topic: "CI/CD"
    },
    {
      question: "Which command is used to create a new branch in Git?",
      options: ["git new branch", "git create branch", "git branch <name>", "git checkout -b <name>"],
      correctAnswer: 3,
      difficulty: "Easy",
      explanation: "git checkout -b <name> creates and switches to a new branch in one command.",
      unit: "DevOps & Tools",
      topic: "Git Commands"
    },
    {
      question: "What is the purpose of package.json in a Node.js project?",
      options: ["To store user data", "To define project dependencies and scripts", "To configure the database", "To write documentation"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "package.json defines project metadata, dependencies, and scripts for Node.js projects.",
      unit: "DevOps & Tools",
      topic: "Package Management"
    },
    {
      question: "What is a linter used for?",
      options: ["To compile code", "To check code quality and style", "To run tests", "To deploy applications"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "A linter analyzes code for potential errors, bugs, and style violations.",
      unit: "DevOps & Tools",
      topic: "Code Quality"
    },
    {
      question: "What is the purpose of environment variables in deployment?",
      options: ["To store source code", "To configure different settings for different environments", "To create backups", "To monitor performance"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Environment variables allow different configurations for development, staging, and production environments.",
      unit: "DevOps & Tools",
      topic: "Environment Management"
    },
    // Unit 9: Mobile Development
    {
      question: "What is Android Studio?",
      options: ["A music player", "An IDE for Android development", "A database tool", "A web browser"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Android Studio is the official Integrated Development Environment (IDE) for Android app development.",
      unit: "Mobile Development",
      topic: "Android Basics"
    },
    {
      question: "What programming language is primarily used for iOS development?",
      options: ["Java", "Kotlin", "Swift", "Python"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "Swift is Apple's programming language for iOS, macOS, watchOS, and tvOS development.",
      unit: "Mobile Development",
      topic: "iOS Basics"
    },
    {
      question: "What is React Native used for?",
      options: ["Web development", "Cross-platform mobile app development", "Desktop applications", "Game development"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "React Native is a framework for building native mobile apps using React and JavaScript.",
      unit: "Mobile Development",
      topic: "Cross-Platform"
    },
    {
      question: "What is an APK file?",
      options: ["An Android application package", "An iOS application package", "A programming language", "A database file"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "APK (Android Package Kit) is the file format used by Android for distributing and installing mobile applications.",
      unit: "Mobile Development",
      topic: "Android Deployment"
    },
    {
      question: "What is the purpose of mobile app permissions?",
      options: ["To restrict app functionality", "To protect user privacy and security", "To increase app file size", "To make apps slower"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Mobile app permissions protect user privacy by controlling what resources and data an app can access.",
      unit: "Mobile Development",
      topic: "Security"
    },
    {
      question: "What is a mobile app manifest file?",
      options: ["A file containing app metadata and configuration", "A file with user data", "A file with app icons", "A file with app code"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "A manifest file contains essential information about the app, such as permissions, components, and metadata.",
      unit: "Mobile Development",
      topic: "App Configuration"
    },
    {
      question: "What is the purpose of mobile UI/UX design?",
      options: ["To make apps look good", "To create intuitive and user-friendly interfaces", "To increase app file size", "To make development harder"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Mobile UI/UX design focuses on creating interfaces that are easy to use and provide a good user experience.",
      unit: "Mobile Development",
      topic: "UI/UX Design"
    },
    // Unit 10: AI & Machine Learning
    {
      question: "What is machine learning?",
      options: ["Teaching computers to think like humans", "A type of computer hardware", "A programming language", "A database system"],
      correctAnswer: 0,
      difficulty: "Easy",
      explanation: "Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.",
      unit: "AI & Machine Learning",
      topic: "ML Basics"
    },
    {
      question: "What is supervised learning?",
      options: ["Learning without any guidance", "Learning with labeled training data", "Learning from unstructured data", "Learning from computer games"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "Supervised learning uses labeled training data to learn patterns and make predictions.",
      unit: "AI & Machine Learning",
      topic: "Learning Types"
    },
    {
      question: "What is a neural network?",
      options: ["A computer network", "A system inspired by biological neural networks", "A type of database", "A programming framework"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "A neural network is a computing system inspired by biological neural networks in animal brains.",
      unit: "AI & Machine Learning",
      topic: "Neural Networks"
    },
    {
      question: "What is the purpose of training data in machine learning?",
      options: ["To test the model", "To teach the model patterns and relationships", "To deploy the model", "To visualize results"],
      correctAnswer: 1,
      difficulty: "Easy",
      explanation: "Training data is used to teach machine learning models to recognize patterns and make predictions.",
      unit: "AI & Machine Learning",
      topic: "Data Preparation"
    },
    {
      question: "What is overfitting in machine learning?",
      options: ["When the model performs too well on training data", "When the model performs poorly on training data", "When the model is too simple", "When there's not enough training data"],
      correctAnswer: 0,
      difficulty: "Medium",
      explanation: "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data.",
      unit: "AI & Machine Learning",
      topic: "Model Evaluation"
    },
    {
      question: "Which library is commonly used for machine learning in Python?",
      options: ["React", "Django", "TensorFlow", "Flask"],
      correctAnswer: 2,
      difficulty: "Easy",
      explanation: "TensorFlow is a popular open-source library for machine learning and artificial intelligence.",
      unit: "AI & Machine Learning",
      topic: "ML Libraries"
    },
    {
      question: "What is natural language processing (NLP)?",
      options: ["Processing computer languages", "Teaching computers to understand human language", "Creating new programming languages", "Translating between programming languages"],
      correctAnswer: 1,
      difficulty: "Medium",
      explanation: "NLP is a field of AI that focuses on enabling computers to understand, interpret, and generate human language.",
      unit: "AI & Machine Learning",
      topic: "NLP"
    }
  ];

  // Group questions by unit
  const questionsByUnit = allQuestions.reduce((acc, question) => {
    if (!acc[question.unit!]) {
      acc[question.unit!] = [];
    }
    acc[question.unit!].push(question);
    return acc;
  }, {} as Record<string, typeof allQuestions>);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-8">
        <p className="text-sm text-indigo-600 font-semibold uppercase tracking-[0.2em]">Dashboard</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4">All Available Questions</h1>
        <p className="text-gray-500 mt-3 max-w-2xl">Browse through all {allQuestions.length} questions organized by topic. Each question includes the correct answer, difficulty level, and detailed explanation.</p>
      </div>

      {/* Assessment Results Section */}
      {answers.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recent Assessment</h2>
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Assessment Results</p>
                <p className="text-gray-500">Score: {results?.score}/{results?.total} questions correct</p>
              </div>
              <span className={cn(
                "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
                (results?.score || 0) >= (results?.total || 0) * 0.7 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {(results?.score || 0) >= (results?.total || 0) * 0.7 ? "Passed" : "Needs Improvement"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Questions Answered</h3>
            {answers.map((ans: any, index: number) => (
              <div key={index} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Question {index + 1}</p>
                    <p className="text-gray-700">{ans.question}</p>
                  </div>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                    ans.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {ans.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500">Your answer</p>
                    <p className="text-sm text-gray-900 mt-1">{ans.selected}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Correct answer</p>
                    <p className="text-sm text-gray-900 mt-1">{ans.correct}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Difficulty: {ans.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Questions by Unit */}
      <div className="space-y-12">
        {Object.entries(questionsByUnit).map(([unitName, unitQuestions]) => (
          <div key={unitName} className="border-t border-gray-200 pt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{unitName}</h2>
              <p className="text-gray-500 mt-1">{unitQuestions.length} questions available</p>
            </div>

            <div className="space-y-4">
              {unitQuestions.map((question, index) => (
                <div key={index} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-sm font-semibold text-gray-900">Question {index + 1}</p>
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
                          question.difficulty === 'Easy' ? "bg-green-100 text-green-700" :
                          question.difficulty === 'Medium' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {question.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {question.topic}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-4">{question.question}</p>

                      <div className="grid gap-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={cn(
                              "p-3 rounded-lg border text-sm",
                              optionIndex === question.correctAnswer
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                                : "bg-gray-50 border-gray-200 text-gray-700"
                            )}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            {option}
                            {optionIndex === question.correctAnswer && (
                              <span className="ml-2 text-emerald-600">✓ Correct Answer</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Explanation:</p>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getYouTubeId = (url: string): string | null => {
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const VideoCard = ({ video, isBookmarked, onBookmark, darkMode }: { 
  video: { title: string; url: string; duration: string; unit: string; topic: string }; 
  isBookmarked?: boolean;
  onBookmark?: (v: any) => void;
  darkMode?: boolean;
}) => {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(video.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <div className={`group rounded-3xl border overflow-hidden transition-all hover:shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setPlaying(true)}>
        {playing && videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                <Play className="w-12 h-12 text-indigo-300" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-indigo-600 ml-1" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-mono font-bold">
              {video.duration}
            </span>
          </>
        )}
      </div>
      <div className="p-5">
        <h3 className={`font-bold text-sm line-clamp-2 mb-4 leading-relaxed ${darkMode ? 'text-white' : 'text-gray-900'}`}>{video.title}</h3>
        <div className="flex items-center justify-between">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
          >
            Open in YouTube <ChevronRight className="w-3 h-3" />
          </a>
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark?.(video); }}
            className={`p-2 rounded-xl transition-all ${isBookmarked ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const VideoLearningCenter = ({ onBack, bookmarks, onBookmark, darkMode }: { onBack?: () => void; bookmarks: any[]; onBookmark: (v: any) => void; darkMode?: boolean }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('Java Fundamentals');
  const [selectedTopic, setSelectedTopic] = useState<string>('Core Concepts');
  const [search, setSearch] = useState('');
  
  const units = getAllUnits();
  const currentUnitVideos = topicVideos[selectedUnit as keyof typeof topicVideos] || {};
  const topics = Object.keys(currentUnitVideos);
  const videos = getVideosByTopic(selectedUnit, selectedTopic) as Array<{ title: string; url: string; duration: string; unit: string; topic: string }>;

  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Play className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Video Center</h1>
              <p className="text-gray-500 mt-1 font-medium italic">Master your skills visually</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search in this topic..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`pl-12 pr-6 py-3 rounded-2xl border-2 outline-none transition-all w-full md:w-80 ${darkMode ? 'bg-gray-900 border-gray-800 text-white focus:border-indigo-500' : 'bg-white border-gray-100 focus:border-indigo-400 shadow-sm'}`}
          />
        </div>
      </div>

      {/* Selection Area */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Unit Selector */}
        <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h2 className={`font-bold mb-4 uppercase tracking-widest text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Learning Unit</h2>
          <div className="space-y-2">
            {units.map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setSelectedUnit(unit);
                  const firstTopic = Object.keys(topicVideos[unit as keyof typeof topicVideos])[0];
                  setSelectedTopic(firstTopic);
                }}
                className={cn(
                  "w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm",
                  selectedUnit === unit
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : darkMode ? "bg-gray-800 border-transparent text-gray-400 hover:text-gray-200" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                )}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Selector */}
        <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
          <h2 className={`font-bold mb-4 uppercase tracking-widest text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Specific Topic</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  "w-full text-left px-5 py-3.5 rounded-2xl border-2 transition-all font-bold text-sm",
                  selectedTopic === topic
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : darkMode ? "bg-gray-800 border-transparent text-gray-400 hover:text-gray-200" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Display */}
      <div className={`rounded-3xl border p-8 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTopic}</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">{filteredVideos.length} resources matching</p>
          </div>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredVideos.map((video, index) => (
              <VideoCard 
                key={index} 
                video={video} 
                darkMode={darkMode}
                isBookmarked={bookmarks.some(b => b.url === video.url)}
                onBookmark={onBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="text-gray-500 font-bold text-lg">No matches found for "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear search</button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Units', value: units.length, icon: Layers },
          { label: 'Topics', value: topics.length, icon: Brain },
          { label: 'Matches', value: filteredVideos.length, icon: Search },
          { label: 'Saved', value: bookmarks.length, icon: Bookmark },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <stat.icon className="w-5 h-5 text-indigo-500 mb-3" />
            <div className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const flashcardsData: Record<string, { front: string; back: string }[]> = {
  "Java": [
    { front: "What is the difference between JDK, JRE, and JVM?", back: "JVM runs bytecode. JRE = JVM + libraries. JDK = JRE + dev tools (compiler, debugger)." },
    { front: "What is polymorphism in Java?", back: "Ability of an object to take many forms — method overriding (runtime) and method overloading (compile-time)." },
    { front: "What does 'static' mean in Java?", back: "A static member belongs to the class, not any instance. Callable without creating an object." },
    { front: "ArrayList vs LinkedList?", back: "ArrayList = dynamic array (fast random access). LinkedList = doubly-linked nodes (fast insert/delete at ends)." },
    { front: "What is an interface in Java?", back: "A contract that classes implement. Contains abstract methods. Java 8+ allows default methods." },
    { front: "What is a constructor?", back: "A special method called on object creation. Same name as class, no return type. Initializes variables." },
  ],
  "Python": [
    { front: "What is a Python decorator?", back: "A function that wraps another to extend behavior without modifying it. Applied using the @ syntax." },
    { front: "List vs Tuple?", back: "Lists are mutable (changeable). Tuples are immutable (cannot change). Tuples are faster and hashable." },
    { front: "What is a generator in Python?", back: "A function that yields values one-by-one using 'yield'. Memory-efficient for large datasets." },
    { front: "What is __init__ in Python?", back: "The constructor method — called automatically when an object is created to initialize its attributes." },
    { front: "What is list comprehension?", back: "A concise way to create lists: [x*2 for x in range(10)]. Faster and more readable than a for loop." },
  ],
  "Data Structures": [
    { front: "What is a Binary Search Tree?", back: "A tree where left < parent < right. Supports O(log n) search, insert, delete on average." },
    { front: "Time complexity of QuickSort?", back: "Average: O(n log n), Worst: O(n²). In-place sorting using a pivot element." },
    { front: "Stack vs Queue?", back: "Stack = LIFO (Last In First Out). Queue = FIFO (First In First Out)." },
    { front: "What is dynamic programming?", back: "Solving complex problems by breaking into overlapping subproblems and caching results (memoization/tabulation)." },
    { front: "What is Big O notation?", back: "Describes algorithm time/space complexity as input grows. O(1) constant, O(n) linear, O(n²) quadratic." },
  ],
  "Web Dev": [
    { front: "GET vs POST?", back: "GET: reads data, params in URL, idempotent. POST: data in body, creates/updates resources." },
    { front: "What is the DOM?", back: "Document Object Model — a tree of the HTML page that JavaScript can read and modify." },
    { front: "What is REST?", back: "Representational State Transfer. API style using HTTP verbs: GET, POST, PUT, DELETE." },
    { front: "CSS Box Model?", back: "Every element: Content → Padding → Border → Margin. box-sizing controls how dimensions are calculated." },
    { front: "What is CORS?", back: "Cross-Origin Resource Sharing. Browser security that restricts HTTP requests from different origins." },
  ],
};

const FlashcardsView = ({ darkMode }: { darkMode?: boolean }) => {
  const topics = Object.keys(flashcardsData);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const cards = flashcardsData[selectedTopic];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<number[]>([]);
  const card = cards[index];

  const next = () => { setFlipped(false); setTimeout(() => setIndex(i => (i + 1) % cards.length), 200); };
  const prev = () => { setFlipped(false); setTimeout(() => setIndex(i => (i - 1 + cards.length) % cards.length), 200); };
  const toggleMastered = () => setMastered(m => m.includes(index) ? m.filter(x => x !== index) : [...m, index]);
  useEffect(() => { setIndex(0); setFlipped(false); setMastered([]); }, [selectedTopic]);

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textMain = darkMode ? 'text-white' : 'text-gray-900';
  const textSub = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-extrabold ${textMain}`}>⚡ Flashcards</h1>
        <p className={`${textSub} mt-1`}>Flip cards to test your knowledge. Mark ones you've mastered!</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map(t => (
          <button key={t} onClick={() => setSelectedTopic(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${selectedTopic === t ? 'bg-indigo-600 text-white' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
        </div>
        <span className={`text-sm font-bold ${textSub}`}>{index + 1}/{cards.length}</span>
        <span className="text-sm font-bold text-emerald-600">{mastered.length} mastered</span>
      </div>
      <div className={`relative w-full rounded-3xl border shadow-lg cursor-pointer ${cardBg} select-none`} style={{ minHeight: '260px' }} onClick={() => setFlipped(f => !f)}>
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
              <span className={`text-xs font-bold uppercase tracking-widest mb-4 ${textSub}`}>Question — Click to flip</span>
              <p className={`text-xl font-bold ${textMain}`}>{card.front}</p>
            </motion.div>
          ) : (
            <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-indigo-50 rounded-3xl">
              <span className="text-xs font-bold uppercase tracking-widest mb-4 text-indigo-500">Answer</span>
              <p className="text-lg leading-relaxed text-gray-900">{card.back}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={prev} className={`px-5 py-2.5 rounded-xl font-bold text-sm ${darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>← Prev</button>
        <button onClick={toggleMastered}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${mastered.includes(index) ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white border border-gray-200 text-gray-600'}`}>
          <Star className={`w-4 h-4 ${mastered.includes(index) ? 'fill-emerald-500 text-emerald-500' : ''}`} />
          {mastered.includes(index) ? 'Mastered!' : 'Mark as mastered'}
        </button>
        <button onClick={next} className={`px-5 py-2.5 rounded-xl font-bold text-sm ${darkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Next →</button>
      </div>
    </div>
  );
};

const SnippetLibraryView = ({ darkMode }: { darkMode?: boolean }) => {
  const snippets = [
    { title: "Java: Binary Search", lang: "Java", code: "public int binarySearch(int[] arr, int target) {\n  int left = 0, right = arr.length - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (arr[mid] == target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}" },
    { title: "Python: List Comprehension", lang: "Python", code: "numbers = [1, 2, 3, 4, 5]\nsquares = [x**2 for x in numbers if x % 2 == 0]\nprint(squares) # Output: [4, 16]" },
    { title: "Java: Singleton Pattern", lang: "Java", code: "public class Database {\n  private static Database instance;\n  private Database() {}\n  public static Database getInstance() {\n    if (instance == null) instance = new Database();\n    return instance;\n  }\n}" },
    { title: "Python: Decorator Template", lang: "Python", code: "def my_decorator(func):\n  def wrapper(*args, **kwargs):\n    print('Before call')\n    result = func(*args, **kwargs)\n    print('After call')\n    return result\n  return wrapper" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>📚 Code Snippets</h1>
        <p className="text-gray-500 mt-1">Quick-reference templates for common algorithms and patterns.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {snippets.map((s, i) => (
          <div key={i} className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="px-6 py-4 border-b border-inherit flex items-center justify-between bg-gray-50/50">
              <span className="font-bold text-sm text-gray-700">{s.title}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.lang === 'Java' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{s.lang}</span>
            </div>
            <div className="p-6">
              <pre className={`text-xs font-mono p-4 rounded-xl overflow-x-auto ${darkMode ? 'bg-black text-emerald-400' : 'bg-gray-900 text-gray-100'}`}>
                <code>{s.code}</code>
              </pre>
              <button className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors">
                Copy Snippet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InterviewPrepView = ({ darkMode }: { darkMode?: boolean }) => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [topic, setTopic] = useState('Java Core');
  const [history, setHistory] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('Tell me about yourself and your experience with ' + topic);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);

  const startSession = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setSessionStarted(true);
    setCurrentQuestion(`Tell me about your experience with ${selectedTopic}. What are some key projects you've worked on?`);
    setHistory([{ role: 'interviewer', content: `Tell me about your experience with ${selectedTopic}. What are some key projects you've worked on?` }]);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    
    const response = await getInterviewResponse(topic, currentQuestion, userAnswer, history);
    
    const newHistory = [
      ...history,
      { role: 'user', content: userAnswer },
      { role: 'interviewer', content: response.nextQuestion, evaluation: response.evaluation, score: response.score }
    ];
    
    setHistory(newHistory);
    setCurrentQuestion(response.nextQuestion);
    setEvaluation(response.evaluation);
    setUserAnswer('');
    setLoading(false);
  };

  if (!sessionStarted) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-3xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Interview Coach</h2>
            <p className="text-gray-500">Practice with our professional AI interviewer and get real-time feedback.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
              <Zap className="w-3.5 h-3.5" />
              AI Powered
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {['Java Core', 'Web Development', 'System Design'].map((t) => (
            <motion.div
              key={t}
              whileHover={{ y: -5 }}
              onClick={() => startSession(t)}
              className={`p-8 rounded-4xl border transition-all cursor-pointer group hover:shadow-2xl hover:shadow-indigo-100 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                <Mic className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Simulate a high-pressure technical interview focusing on {t} concepts and best practices.</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                Start Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => setSessionStarted(false)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Session
        </button>
        <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-indigo-200">
          Interviewing for: {topic}
        </span>
      </div>

      <div className={`flex-1 overflow-y-auto mb-6 p-8 rounded-4xl border custom-scrollbar space-y-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        {history.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: msg.role === 'interviewer' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-5 rounded-2xl shadow-sm ${
              msg.role === 'interviewer' 
                ? (darkMode ? 'bg-gray-800 text-gray-100 rounded-bl-none' : 'bg-indigo-50 text-indigo-900 rounded-bl-none')
                : 'bg-indigo-600 text-white rounded-br-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.evaluation && (
                <div className={`mt-4 pt-4 border-t border-indigo-200/50`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">AI Feedback (Score: {msg.score}/10)</span>
                  </div>
                  <p className="text-xs italic opacity-80">{msg.evaluation}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your response here..."
          className={`w-full p-6 pr-16 rounded-3xl border-2 outline-none focus:ring-4 transition-all resize-none shadow-xl ${
            darkMode 
              ? 'bg-gray-900 border-gray-800 text-white focus:border-indigo-500 focus:ring-indigo-500/10' 
              : 'bg-white border-gray-100 text-gray-900 focus:border-indigo-600 focus:ring-indigo-600/5'
          }`}
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submitAnswer();
            }
          }}
        />
        <button 
          onClick={submitAnswer}
          disabled={loading || !userAnswer.trim()}
          className="absolute right-4 bottom-4 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:scale-95 shadow-lg shadow-indigo-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const AchievementsView = ({ darkMode, streak, score, bookmarksCount }: { darkMode?: boolean, streak: number, score: number, bookmarksCount: number }) => {
  const badges = [
    { title: "Early Bird", desc: "First quiz completed", icon: Sun, color: "text-amber-500", locked: score === 0 },
    { title: "Java Master", desc: "Score 100% in any assessment", icon: Trophy, color: "text-indigo-500", locked: score < 100 },
    { title: "Snippet Collector", desc: "Saved 5 code snippets", icon: Bookmark, color: "text-emerald-500", locked: bookmarksCount < 5 },
    { title: "Consistency King", desc: "Maintain a 3-day streak", icon: Flame, color: "text-orange-500", locked: streak < 3 },
    { title: "Knowledge Seeker", desc: "Watch 3 learning videos", icon: Play, color: "text-blue-500", locked: bookmarksCount < 3 },
    { title: "The Architect", desc: "Completed 5 mock interviews", icon: Layers, color: "text-purple-500", locked: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>🏆 Achievements</h1>
        <p className="text-gray-500 mt-1">Unlock badges as you master new skills and explore InclusiAssess.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border text-center transition-all ${b.locked ? 'grayscale opacity-50 bg-gray-50 dark:bg-gray-900/50' : `hover:scale-105 ${darkMode ? 'bg-gray-900 border-gray-800 shadow-xl shadow-indigo-900/10' : 'bg-white border-gray-100 shadow-md'}`}`}>
            <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <b.icon className={`w-10 h-10 ${b.color}`} />
            </div>
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.title}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{b.desc}</p>
            {b.locked ? (
               <div className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Locked</div>
            ) : (
                <div className="mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Unlocked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LeaderboardView = ({ darkMode, userScore, userEmail }: { darkMode?: boolean, userScore: number, userEmail: string }) => {
  const users = [
    { name: "Arjun S.", points: 12450, streak: 12, rank: 1 },
    { name: "Priya M.", points: 11820, streak: 8, rank: 2 },
    { name: userEmail.split('@')[0] || "You", points: userScore, streak: 5, rank: 3, isUser: true },
    { name: "Rahul D.", points: 9500, streak: 15, rank: 4 },
    { name: "Ananya K.", points: 8900, streak: 4, rank: 5 },
  ].sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h1 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>⚔️ Global Rankings</h1>
        <p className="text-gray-500 mt-1">Consistency and performance determine your place in the ecosystem.</p>
      </div>
      <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <table className="w-full text-left border-collapse">
          <thead className={darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}>
            <tr>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Rank</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Learner</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest">Score</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-center">Streak</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
            {users.map((u, i) => (
              <tr key={i} className={`hover:bg-indigo-600/5 transition-all ${u.isUser ? (darkMode ? 'bg-indigo-400/10' : 'bg-indigo-50') : ''}`}>
                <td className="px-8 py-6">
                  {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : <span className="text-gray-400 font-mono">#0{u.rank}</span>}
                </td>
                <td className={`px-8 py-6`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${u.isUser ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} ${u.isUser ? 'text-indigo-600' : ''}`}>
                      {u.name} {u.isUser && '(You)'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-indigo-600 font-black">{u.points.toLocaleString()}</span>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">
                    <Flame className="w-3.5 h-3.5" /> {u.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NotesView = ({ darkMode }: { darkMode?: boolean }) => {
  const [notes, setNotes] = useState(() => localStorage.getItem('userNotes') || '# My Learning Journey \n\nUse this space to jot down key concepts, code snippets, or thoughts as you learn!');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  useEffect(() => {
    localStorage.setItem('userNotes', notes);
  }, [notes]);

  const handleAIAction = async (action: 'summarize' | 'explain') => {
    setIsSummarizing(true);
    const result = await summarizeContent(notes);
    setNotes(prev => prev + `\n\n### AI ${action === 'summarize' ? 'Summary' : 'Explanation'}\n` + result);
    setIsSummarizing(false);
  };

  const toolbarBtn = `p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Workspace</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Advanced Markdown Editor</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
          <button 
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600' : 'text-gray-500'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600' : 'text-gray-500'}`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className={`flex-1 flex flex-col rounded-4xl border overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
        {/* Toolbar */}
        <div className={`h-12 border-b flex items-center justify-between px-4 shrink-0 ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-50 bg-gray-50/50'}`}>
          <div className="flex items-center gap-1">
            <button className={toolbarBtn} title="Bold" onClick={() => setNotes(n => n + ' **bold**')}><TypeIcon className="w-4 h-4" /></button>
            <button className={toolbarBtn} title="List" onClick={() => setNotes(n => n + '\n- ')}><ListIcon className="w-4 h-4" /></button>
            <button className={toolbarBtn} title="Code" onClick={() => setNotes(n => n + '\n```\n\n```')}><Code className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => handleAIAction('summarize')}
              disabled={isSummarizing}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100 hover:bg-indigo-100 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" /> {isSummarizing ? 'AIing...' : 'AI Summarize'}
            </button>
            <button onClick={() => setNotes('')} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'editor' ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-8 font-mono text-sm leading-relaxed outline-none resize-none bg-transparent ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
              placeholder="Write your markdown here..."
              spellCheck={false}
            />
          ) : (
            <div className={`w-full p-8 overflow-y-auto custom-scrollbar prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              <ReactMarkdown>{notes}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BookmarksView = ({ bookmarks, onRemove, darkMode }: {
  bookmarks: { title: string; url: string; duration: string; unit: string; topic: string }[];
  onRemove: (url: string) => void;
  darkMode?: boolean;
}) => {
  const textMain = darkMode ? 'text-white' : 'text-gray-900';
  const textSub = darkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-extrabold ${textMain}`}>🔖 Saved Bookmarks</h1>
        <p className={`${textSub} mt-1`}>{bookmarks.length} saved video{bookmarks.length !== 1 ? 's' : ''}</p>
      </div>
      {bookmarks.length === 0 ? (
        <div className={`rounded-3xl border ${cardBg} p-16 text-center`}>
          <Bookmark className={`w-12 h-12 mx-auto mb-4 ${textSub}`} />
          <p className={`text-lg font-semibold ${textMain}`}>No bookmarks yet</p>
          <p className={`${textSub} text-sm mt-1`}>Go to Video Learning and bookmark videos to save them here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookmarks.map((b, i) => (
            <motion.div key={i} whileHover={{ y: -3 }} className={`rounded-2xl border ${cardBg} p-5 flex gap-4 items-start`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${textMain} line-clamp-2`}>{b.title}</p>
                <p className={`text-xs ${textSub} mt-1`}>{b.unit} • {b.topic} • {b.duration}</p>
                <div className="flex gap-3 mt-3">
                  <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 font-bold hover:underline">▶ Watch</a>
                  <button onClick={() => onRemove(b.url)} className="text-xs text-rose-500 font-bold hover:underline">Remove</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const CodeArena = ({ darkMode }: { darkMode?: boolean }) => {
  const [code, setCode] = useState('// Write your solution here\n\npublic class Solution {\n    public int findMax(int[] nums) {\n        // Your code\n    }\n}');
  const [language, setLanguage] = useState('java');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const problem = {
    title: "Find Maximum Element",
    difficulty: "Easy",
    description: "Given an array of integers `nums`, return the maximum element in the array.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    examples: [
      { input: "nums = [1, 5, 3, 9, 2]", output: "9" }
    ]
  };

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    const evaluation = await evaluateCode(language, code, problem.title + ": " + problem.description);
    setResult(evaluation);
    setLoading(false);
  };

  const codeBg = darkMode ? 'bg-gray-950 text-emerald-400' : 'bg-gray-900 text-gray-100';
  const sidebarBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-gray-200 shadow-2xl">
      {/* Top Bar */}
      <div className={`h-14 border-b flex items-center justify-between px-6 shrink-0 ${sidebarBg}`}>
        <div className="flex items-center gap-4">
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{problem.title}</h2>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">{problem.difficulty}</span>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
          >
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button 
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Run Test Cases
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem Statement */}
        <div className={`w-1/3 overflow-y-auto p-8 border-r custom-scrollbar ${sidebarBg}`}>
          <div className="prose prose-sm max-w-none">
            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description</h3>
            <p className="text-gray-600 leading-relaxed mb-6">{problem.description}</p>
            
            <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Examples</h4>
            {problem.examples.map((ex, i) => (
              <div key={i} className={`p-4 rounded-xl mb-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-xs font-mono mb-1"><span className="font-bold opacity-50">Input:</span> {ex.input}</p>
                <p className="text-xs font-mono"><span className="font-bold opacity-50">Output:</span> {ex.output}</p>
              </div>
            ))}

            <h4 className={`text-sm font-bold mb-3 uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Constraints</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-500 text-sm">
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>

        {/* Right: Editor & Results */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="flex-1 overflow-hidden relative group">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-8 bg-transparent text-emerald-400 font-mono text-sm outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Code className="text-gray-600 w-5 h-5" />
            </div>
          </div>

          {/* Result Panel */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: 'auto' }} 
                className={`border-t p-6 max-h-64 overflow-y-auto custom-scrollbar ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {result.status === 'Accepted' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className={`font-bold ${result.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {result.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Score: {result.score}/100</span>
                </div>
                
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{result.feedback}</p>
                
                {result.optimizationHints?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Optimization Hints</p>
                    <div className="flex flex-wrap gap-2">
                      {result.optimizationHints.map((hint: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-medium border border-indigo-100">
                          {hint}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const SkillInventoryView = ({ darkMode, results }: { darkMode?: boolean, results: any }) => {
  const data = [
    { label: 'Java', value: 85, color: '#f87171' },
    { label: 'Python', value: 65, color: '#60a5fa' },
    { label: 'DS & Algo', value: 75, color: '#fbbf24' },
    { label: 'Web Dev', value: 45, color: '#34d399' },
    { label: 'Security', value: 55, color: '#818cf8' },
    { label: 'DevOps', value: 30, color: '#a78bfa' },
  ];

  const size = 300;
  const center = size / 2;
  const radius = center * 0.8;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (val: number, i: number) => {
    const r = (val / 100) * radius;
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => getPoint(d.value, i));
  const pathData = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Skill Inventory</h2>
          <p className="text-gray-500">A visual breakdown of your technical proficiency across domains.</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Rank</p>
            <p className="text-xl font-black text-indigo-600">Top 15%</p>
          </div>
          <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
          <div className="text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Points</p>
            <p className="text-xl font-black text-indigo-600">4,250</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Radar Chart Card */}
        <div className={`p-12 rounded-[3rem] border shadow-2xl flex items-center justify-center relative overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-indigo-500 rounded-full blur-[100px]" />
          </div>
          
          <svg width={size} height={size} className="relative z-10 drop-shadow-2xl">
            {/* Background Spidelines */}
            {[20, 40, 60, 80, 100].map((r, i) => {
              const bgPoints = data.map((_, idx) => getPoint(r, idx));
              const d = `M ${bgPoints[0].x} ${bgPoints[0].y} ` + bgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
              return <path key={i} d={d} fill="none" stroke={darkMode ? '#374151' : '#f3f4f6'} strokeWidth="1" />;
            })}
            {data.map((_, i) => {
              const p = getPoint(100, i);
              return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke={darkMode ? '#374151' : '#f3f4f6'} strokeWidth="1" />;
            })}
            
            {/* The Actual Data Path */}
            <motion.path
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
              d={pathData}
              fill="rgba(79, 70, 229, 0.2)"
              stroke="#4f46e5"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            
            {/* Data Points and Labels */}
            {data.map((d, i) => {
              const p = getPoint(d.value, i);
              const labelP = getPoint(115, i);
              return (
                <g key={i}>
                  <motion.circle 
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    cx={p.x} cy={p.y} fill={d.color} stroke="white" strokeWidth="2" 
                  />
                  <text 
                    x={labelP.x} y={labelP.y} 
                    textAnchor="middle" 
                    className={`text-[10px] font-bold ${darkMode ? 'fill-gray-400' : 'fill-gray-500'}`}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-6">
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Domain Proficiency</h3>
          <div className="space-y-4">
            {data.map((item, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`} style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'login' | 'home' | 'quiz' | 'results' | 'dashboard' | 'videos' | 'flashcards' | 'bookmarks' | 'achievements' | 'leaderboard' | 'snippets' | 'interview' | 'notes' | 'arena' | 'inventory'>('login');
  const [showSidebar, setShowSidebar] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'employee'>('student');
  const [collegeName, setCollegeName] = useState('');
  const [results, setResults] = useState<{ score: number; total: number; answers: any[] } | null>(null);
  const [totalScore, setTotalScore] = useState(() => parseInt(localStorage.getItem('totalScore') || '0', 10));
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [bookmarks, setBookmarks] = useState<{ title: string; url: string; duration: string; unit: string; topic: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    const lastDate = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();
    if (lastDate === today) return parseInt(saved || '0', 10);
    if (lastDate === new Date(Date.now() - 86400000).toDateString()) return parseInt(saved || '0', 10);
    return 0;
  });
  const ecosystemRef = useRef<HTMLDivElement | null>(null);
  const accessibilityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((video: { title: string; url: string; duration: string; unit: string; topic: string }) => {
    setBookmarks(prev => {
      if (prev.find(b => b.url === video.url)) return prev.filter(b => b.url !== video.url);
      return [...prev, video];
    });
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('lastActiveDate');
    if (lastDate !== today) {
      localStorage.setItem('lastActiveDate', today);
      setStreak(prev => {
        const newStreak = prev + 1;
        localStorage.setItem('streak', String(newStreak));
        return newStreak;
      });
    }
  }, []);

  useEffect(() => { if (view !== 'login') updateStreak(); }, [view]);

  const startAssessment = () => setView('quiz');
  const handleComplete = (score: number, total: number, answers: any[]) => {
    const points = score * 10;
    setTotalScore(prev => {
      const newTotal = prev + points;
      localStorage.setItem('totalScore', String(newTotal));
      return newTotal;
    });
    setResults({ score, total, answers });
    setView('results');
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    // Only change view if not already on home
    if (view !== 'home') {
      setView('home');
      // Wait for render, then scroll
      setTimeout(() => {
        try {
          if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('Scroll target not found after view change');
          }
        } catch (error) {
          console.error('Error scrolling to section:', error);
        }
      }, 150);
    } else {
      // Already on home, scroll immediately
      try {
        if (ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('Scroll target not found');
        }
      } catch (error) {
        console.error('Error scrolling to section:', error);
      }
    }
  };

  const handleNavigate = (section: 'ecosystem' | 'accessibility') => {
    if (section === 'ecosystem') {
      scrollToSection(ecosystemRef);
    } else {
      scrollToSection(accessibilityRef);
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#fafafa] font-sans flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 my-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-2xl">
              <Brain className="text-white w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {authMode === 'login' ? 'Sign in to continue to your dashboard.' : 'Join us to start learning today.'}
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (authMode === 'signup') {
              alert('Account created successfully! Please log in.');
              setAuthMode('login');
              setPassword('');
            } else {
              if (userEmail.trim()) {
                setView('home');
              }
            }
          }} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-none outline-none transition-colors"
                placeholder="you@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-none outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {authMode === 'signup' && (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserRole('student')}
                      className={`py-2 px-4 rounded-xl border-2 font-medium transition-colors ${userRole === 'student' ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-gray-100 text-gray-500 hover:border-indigo-200'}`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserRole('employee')}
                      className={`py-2 px-4 rounded-xl border-2 font-medium transition-colors ${userRole === 'employee' ? 'border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-gray-100 text-gray-500 hover:border-indigo-200'}`}
                    >
                      Employee
                    </button>
                  </div>
                </div>

                {/* College Name (Only for Students) */}
                <AnimatePresence>
                  {userRole === 'student' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1 mt-4">College / University Name</label>
                      <input
                        type="text"
                        id="college"
                        required={userRole === 'student'}
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-600 focus:ring-none outline-none transition-colors"
                        placeholder="Institute of Technology"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-2"
            >
              {authMode === 'login' ? 'Continue to Dashboard' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-[#fafafa] text-gray-900'}`}>
      <Sidebar 
        currentView={view} 
        setView={setView} 
        darkMode={darkMode} 
        onClose={() => setShowSidebar(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header 
          userEmail={userEmail} 
          userRole={userRole}
          darkMode={darkMode}
          streak={streak}
          bookmarkCount={bookmarks.length}
          toggleSidebar={() => setShowSidebar(!showSidebar)}
          onSignOut={() => { alert('Signed out successfully!'); window.location.reload(); }}
          onToggleDark={() => setDarkMode(d => !d)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNavigate={setView}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {view === 'home' && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8"
              >
                <Brain className="w-4 h-4" />
                AI-Driven Inclusive Assessment
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight"
              >
                Transforming the <span className="text-indigo-600">Skill Ecosystem</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-500 mb-10 leading-relaxed"
              >
                Fair, adaptive, and personalized evaluation methods powered by Java and AI. 
                Breaking barriers for every learner, everywhere.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={startAssessment}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
                >
                  Start Java Assessment
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleNavigate('ecosystem')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
                >
                  Explore Ecosystem
                </button>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div ref={ecosystemRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={Accessibility}
                title="Inclusive Design"
                description="Accessibility features like TTS, STT, and multilingual support integrated into the core."
                color="bg-amber-500"
              />
              <FeatureCard
                icon={RefreshCw}
                title="Adaptive Testing"
                description="Real-time difficulty adjustment based on learner performance for optimal challenge."
                color="bg-emerald-500"
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Secure & Scalable"
                description="Built with Java's robust security features, ensuring data privacy and trust."
                color="bg-blue-500"
              />
              <FeatureCard
                icon={LayoutDashboard}
                title="Skill Analysis"
                description="AI algorithms detect patterns to provide deep insights into individual learning styles."
                color="bg-indigo-500"
              />
            </div>

            {/* Programming Language Modules */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Select from our comprehensive collection of programming language modules, each designed with adaptive assessments and detailed explanations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Java Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Java Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Master object-oriented programming with Java fundamentals, collections, and enterprise development.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>15 Questions</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Beginner to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-red-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=eIrMbAQbolU" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• Java Full Course - Telusko</a>
                      <a href="https://www.youtube.com/watch?v=grEKMHGYyns" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• OOP Concepts - Programming with Mosh</a>
                      <a href="https://www.youtube.com/watch?v=DmymOC7JQ1w" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• Java Collections - Code Decode</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Start Java Assessment
                  </button>
                </motion.div>

                {/* Python Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Python Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Learn Python for data science, web development, and automation with comprehensive exercises.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>15 Questions</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Beginner to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-blue-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=_uQrJ0TkSuc" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Python Full Course - Programming with Mosh</a>
                      <a href="https://www.youtube.com/watch?v=t8pPdKYpowI" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Data Science with Python - Krish Naik</a>
                      <a href="https://www.youtube.com/watch?v=swV0TZfM0HY" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Python Fundamentals - Telusko</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    Start Python Assessment
                  </button>
                </motion.div>

                {/* JavaScript Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">JavaScript & Web Dev</h3>
                  <p className="text-gray-500 text-sm mb-4">Master modern JavaScript, React, Node.js, and full-stack web development techniques.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>20 Questions</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Intermediate to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-yellow-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=PkZNo7MFNFg" target="_blank" rel="noopener noreferrer" className="block text-xs text-yellow-700 hover:text-yellow-800 hover:underline">• JavaScript Complete Tutorial - Clever Programmer</a>
                      <a href="https://www.youtube.com/watch?v=SqcY0GlETPk" target="_blank" rel="noopener noreferrer" className="block text-xs text-yellow-700 hover:text-yellow-800 hover:underline">• React Full Course - Traversy Media</a>
                      <a href="https://www.youtube.com/watch?v=TlB_eWDSMt4" target="_blank" rel="noopener noreferrer" className="block text-xs text-yellow-700 hover:text-yellow-800 hover:underline">• Node.js Complete Guide - Academind</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors"
                  >
                    Start JS Assessment
                  </button>
                </motion.div>

                {/* C/C++ Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">C/C++ Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Deep dive into system programming, memory management, and performance optimization.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>18 Questions</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-gray-700" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=vLnPJ8-A1EQ" target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-700 hover:text-gray-900 hover:underline">• C++ Complete Course - Buckys C++ Programming</a>
                      <a href="https://www.youtube.com/watch?v=1v1TL41SV-0" target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-700 hover:text-gray-900 hover:underline">• C++ STL Containers - Telusko</a>
                      <a href="https://www.youtube.com/watch?v=y7Oe3blevUg" target="_blank" rel="noopener noreferrer" className="block text-xs text-gray-700 hover:text-gray-900 hover:underline">• Memory Management in C++ - Code Decay</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    Start C/C++ Assessment
                  </button>
                </motion.div>

                {/* C# Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">C# & .NET</h3>
                  <p className="text-gray-500 text-sm mb-4">Build enterprise applications with C#, ASP.NET, and modern .NET ecosystem.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>16 Questions</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-purple-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=gfkTfcpWqAY" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• C# Complete Course - Brackeys</a>
                      <a href="https://www.youtube.com/watch?v=k8ekiLw3m0w" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• ASP.NET Core Basics - Kudvenkat</a>
                      <a href="https://www.youtube.com/watch?v=OM5Xqrz_zLI" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• LINQ in C# - Code Monkey</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                  >
                    Start C# Assessment
                  </button>
                </motion.div>

                {/* Go Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Go Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Learn concurrent programming, cloud-native development, and efficient system design.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>14 Questions</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-cyan-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=yyUHQIec83I" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Go Complete Course - freeCodeCamp</a>
                      <a href="https://www.youtube.com/watch?v=YzawK1PjlWw" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Goroutines & Channels - Dave Cheney</a>
                      <a href="https://www.youtube.com/watch?v=LOn1BwS5J5I" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Build Web APIs with Go - Sentdex</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition-colors"
                  >
                    Start Go Assessment
                  </button>
                </motion.div>

                {/* Rust Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rust Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Master memory safety, zero-cost abstractions, and systems programming with Rust.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>16 Questions</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-orange-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=OX9HJsJUDxA" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• Rust Programming for Beginners - dcode</a>
                      <a href="https://www.youtube.com/watch?v=MsocPEZBr28" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• Ownership & Borrowing - Let's Get Rusty</a>
                      <a href="https://www.youtube.com/watch?v=vqavHxz2z50" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• Rust WebAssembly - Traversy Media</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                  >
                    Start Rust Assessment
                  </button>
                </motion.div>

                {/* PHP Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PHP & Laravel</h3>
                  <p className="text-gray-500 text-sm mb-4">Build dynamic web applications with PHP, Laravel framework, and modern backend development.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>15 Questions</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">Beginner to Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-indigo-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=OK_JCtrrv-c" target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:text-indigo-700 hover:underline">• PHP Complete Course - Telusko</a>
                      <a href="https://www.youtube.com/watch?v=yS2s6mtE514" target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:text-indigo-700 hover:underline">• Laravel 8 Full Course - Programming with Mosh</a>
                      <a href="https://www.youtube.com/watch?v=EU7PRmCpx-0" target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:text-indigo-700 hover:underline">• PHP OOP & Design Patterns - Traversy Media</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Start PHP Assessment
                  </button>
                </motion.div>

                {/* Ruby Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ruby & Rails</h3>
                  <p className="text-gray-500 text-sm mb-4">Develop elegant web applications with Ruby, Rails framework, and convention over configuration.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>14 Questions</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-red-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=t_isHoVTR24" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• Ruby Programming - Traversy Media</a>
                      <a href="https://www.youtube.com/watch?v=fmyvWz5TUWg" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• Rails Complete Guide - freeCodeCamp</a>
                      <a href="https://www.youtube.com/watch?v=_bhvbnHIw78" target="_blank" rel="noopener noreferrer" className="block text-xs text-red-600 hover:text-red-700 hover:underline">• Ruby on Rails API - Udacity</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Start Ruby Assessment
                  </button>
                </motion.div>

                {/* Swift Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Swift & iOS</h3>
                  <p className="text-gray-500 text-sm mb-4">Create iOS and macOS applications with Swift, Apple's modern programming language.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>13 Questions</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-orange-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=comQ1-x2CX0" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• Swift iOS Development - Traversy Media</a>
                      <a href="https://www.youtube.com/watch?v=09TeUXjzrMQ" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• SwiftUI Complete Course - CodeWithChris</a>
                      <a href="https://www.youtube.com/watch?v=DPSNZrAFnhc" target="_blank" rel="noopener noreferrer" className="block text-xs text-orange-600 hover:text-orange-700 hover:underline">• iOS App Development - Stanford University</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
                  >
                    Start Swift Assessment
                  </button>
                </motion.div>

                {/* Kotlin Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kotlin & Android</h3>
                  <p className="text-gray-500 text-sm mb-4">Build Android apps with Kotlin, modern Android development, and Jetpack components.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>15 Questions</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-teal-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=-Z98jddDwEo" target="_blank" rel="noopener noreferrer" className="block text-xs text-teal-600 hover:text-teal-700 hover:underline">• Kotlin Programming - Telusko</a>
                      <a href="https://www.youtube.com/watch?v=7CKmRhqWQvs" target="_blank" rel="noopener noreferrer" className="block text-xs text-teal-600 hover:text-teal-700 hover:underline">• Android Development with Kotlin - Philipp Lackner</a>
                      <a href="https://www.youtube.com/watch?v=FJ-n4pXVCWQ" target="_blank" rel="noopener noreferrer" className="block text-xs text-teal-600 hover:text-teal-700 hover:underline">• Jetpack Compose - Google Developers</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors"
                  >
                    Start Kotlin Assessment
                  </button>
                </motion.div>

                {/* TypeScript Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript & Node.js</h3>
                  <p className="text-gray-500 text-sm mb-4">Master typed JavaScript with TypeScript, Node.js, and full-stack development.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>17 Questions</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Intermediate to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-blue-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=sZ8nXSiB340" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• TypeScript Complete Course - academind</a>
                      <a href="https://www.youtube.com/watch?v=TlB_eWDSMt4" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Node.js Full Tutorial - Traversy Media</a>
                      <a href="https://www.youtube.com/watch?v=2QQnzW302L0" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Express.js API - Code With Antonio</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start TypeScript Assessment
                  </button>
                </motion.div>

                {/* Scala Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Scala Programming</h3>
                  <p className="text-gray-500 text-sm mb-4">Functional programming with Scala, JVM ecosystem, and big data processing.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>12 Questions</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-pink-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=Dm6pNsNVpqk" target="_blank" rel="noopener noreferrer" className="block text-xs text-pink-600 hover:text-pink-700 hover:underline">• Scala Complete Course - Simplilearn</a>
                      <a href="https://www.youtube.com/watch?v=Bb9-8ZhCRvE" target="_blank" rel="noopener noreferrer" className="block text-xs text-pink-600 hover:text-pink-700 hover:underline">• Functional Programming in Scala - Udemy Free</a>
                      <a href="https://www.youtube.com/watch?v=wVLmzvGZ0A4" target="_blank" rel="noopener noreferrer" className="block text-xs text-pink-600 hover:text-pink-700 hover:underline">• Apache Spark with Scala - DataCamp</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors"
                  >
                    Start Scala Assessment
                  </button>
                </motion.div>

                {/* TypeScript Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript & Advanced JS</h3>
                  <p className="text-gray-500 text-sm mb-4">Build type-safe JavaScript applications with TypeScript, async programming, and modern tooling.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>18 Questions</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Intermediate to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-blue-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=d56mHVMyE0E" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• TypeScript Complete Tutorial - Academind</a>
                      <a href="https://www.youtube.com/watch?v=ts1kEND7msA" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• TypeScript Advanced Patterns - Matt Pocock</a>
                      <a href="https://www.youtube.com/watch?v=FrJxUcSzzks" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:text-blue-700 hover:underline">• Advanced TypeScript - Traversy Media</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start TypeScript Assessment
                  </button>
                </motion.div>

                {/* C# & .NET Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">C# & .NET</h3>
                  <p className="text-gray-500 text-sm mb-4">Enterprise development with C#, ASP.NET Core, and Windows/cloud applications.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>17 Questions</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Beginner to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-purple-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=P7CoAwl6Pc4" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• C# Complete Course - Bro Code</a>
                      <a href="https://www.youtube.com/watch?v=Fvr39V-cGlc" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• ASP.NET Core Fundamentals - freeCodeCamp</a>
                      <a href="https://www.youtube.com/watch?v=OzUQHVfqFkg" target="_blank" rel="noopener noreferrer" className="block text-xs text-purple-600 hover:text-purple-700 hover:underline">• C# OOP Concepts - Code Monkey</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                  >
                    Start C# Assessment
                  </button>
                </motion.div>

                {/* Dart & Flutter Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dart & Flutter</h3>
                  <p className="text-gray-500 text-sm mb-4">Cross-platform mobile development with Flutter and modern async/await patterns in Dart.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>16 Questions</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">Intermediate</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-cyan-500" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=1gDhl4leEzA" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Flutter Complete Course - Traversy Media</a>
                      <a href="https://www.youtube.com/watch?v=VPvVD8bAPAY" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Dart Programming Language - Coding with Marty</a>
                      <a href="https://www.youtube.com/watch?v=pTJJMoromOE" target="_blank" rel="noopener noreferrer" className="block text-xs text-cyan-600 hover:text-cyan-700 hover:underline">• Flutter Advanced Patterns - ResoCoder</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition-colors"
                  >
                    Start Dart Assessment
                  </button>
                </motion.div>

                {/* Julia Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Julia & Scientific Computing</h3>
                  <p className="text-gray-500 text-sm mb-4">High-performance numerical computing with Julia for data science and mathematical modeling.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>14 Questions</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-green-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=sE67bP2PnOo" target="_blank" rel="noopener noreferrer" className="block text-xs text-green-600 hover:text-green-700 hover:underline">• Julia Programming Basics - The Julia Language</a>
                      <a href="https://www.youtube.com/watch?v=Li6FwCF-iF0" target="_blank" rel="noopener noreferrer" className="block text-xs text-green-600 hover:text-green-700 hover:underline">• Scientific Computing with Julia - MIT OpenCourseWare</a>
                      <a href="https://www.youtube.com/watch?v=4igQkdB_278" target="_blank" rel="noopener noreferrer" className="block text-xs text-green-600 hover:text-green-700 hover:underline">• Data Science with Julia - DataCamp</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Start Julia Assessment
                  </button>
                </motion.div>

                {/* R Programming Module */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">R Programming & Statistics</h3>
                  <p className="text-gray-500 text-sm mb-4">Statistical analysis and data visualization with R, ggplot2, and the tidyverse ecosystem.</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>15 Questions</span>
                    <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">Intermediate to Advanced</span>
                  </div>
                  
                  {/* Video Resources Section */}
                  <div className="mb-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="w-4 h-4 text-sky-600" />
                      <p className="font-medium text-sm text-gray-900">Video Tutorials</p>
                    </div>
                    <div className="space-y-1">
                      <a href="https://www.youtube.com/watch?v=_V-EfVHmZck" target="_blank" rel="noopener noreferrer" className="block text-xs text-sky-600 hover:text-sky-700 hover:underline">• R Programming for Data Science - edureka!</a>
                      <a href="https://www.youtube.com/watch?v=9F2t9jd9OWU" target="_blank" rel="noopener noreferrer" className="block text-xs text-sky-600 hover:text-sky-700 hover:underline">• Data Visualization with ggplot2 - DataCamp</a>
                      <a href="https://www.youtube.com/watch?v=aqvxWZpPKrQ" target="_blank" rel="noopener noreferrer" className="block text-xs text-sky-600 hover:text-sky-700 hover:underline">• R Tidyverse Tutorial - Posit</a>
                    </div>
                  </div>
                  
                  <button
                    onClick={startAssessment}
                    className="w-full py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
                  >
                    Start R Assessment
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Java Focus Section */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-16 shadow-sm flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Code className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Java-Oriented Perspective</h2>
                <p className="text-gray-500 leading-relaxed">
                  Leveraging Java's platform independence and robust frameworks like Spring Boot to build 
                  scalable assessment systems. Our platform ensures that enterprise-grade security 
                  meets cutting-edge AI capabilities.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Spring Boot', 'Encryption', 'Secure APIs', 'Scalability'].map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full max-w-md bg-gray-900 rounded-3xl p-8 text-indigo-400 font-mono text-sm shadow-2xl">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <pre className="overflow-x-auto">
                  <code>{`@RestController
@RequestMapping("/api/assessment")
public class AdaptiveController {

  @PostMapping("/next")
  public ResponseEntity<Question> getNext(
    @RequestBody Performance history
  ) {
    // AI-Driven Logic here
    return ResponseEntity.ok(
      aiService.generate(history)
    );
  }
}`}</code>
                </pre>
              </div>
            </div>

            {/* Accessibility Section */}
            <div ref={accessibilityRef} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Accessibility Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">TTS Usage</span>
                  <span className="font-bold text-gray-900">12%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Voice Input</span>
                  <span className="font-bold text-gray-900">0%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Language</span>
                  <span className="font-bold text-gray-900">English</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <AdaptiveQuiz onComplete={handleComplete} />
        )}

        {view === 'dashboard' && (
          <DashboardView answers={results?.answers || []} results={results} />
        )}

        {view === 'videos' && (
          <VideoLearningCenter 
            onBack={() => setView('home')} 
            bookmarks={bookmarks}
            onBookmark={addBookmark}
            darkMode={darkMode}
          />
        )}

        {view === 'flashcards' && (
          <FlashcardsView darkMode={darkMode} />
        )}

        {view === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onRemove={(url) => setBookmarks(prev => prev.filter(b => b.url !== url))}
            darkMode={darkMode}
          />
        )}

        {view === 'achievements' && <AchievementsView darkMode={darkMode} streak={streak} score={totalScore} bookmarksCount={bookmarks.length} />}
        {view === 'leaderboard' && <LeaderboardView darkMode={darkMode} userScore={totalScore} userEmail={userEmail} />}
        {view === 'snippets' && <SnippetLibraryView darkMode={darkMode} />}
        {view === 'interview' && <InterviewPrepView darkMode={darkMode} />}
        {view === 'notes' && <NotesView darkMode={darkMode} />}
        {view === 'arena' && <CodeArena darkMode={darkMode} />}
        {view === 'inventory' && <SkillInventoryView darkMode={darkMode} results={results} />}

        {view === 'results' && results && (
          <ResultsView {...results} onStartLearningPath={() => setView('dashboard')} />
        )}
          </div>
        </main>

        <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-t py-12`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
              © 2026 InclusiAssess. Built with Java, React, and Google Gemini AI.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
