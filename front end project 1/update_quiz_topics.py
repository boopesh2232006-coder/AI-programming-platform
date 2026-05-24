import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update startAssessment state
content = content.replace("const startAssessment = () => setView('quiz');", "const [assessmentTopic, setAssessmentTopic] = useState('Java Programming');\n  const startAssessment = (topic: string | React.MouseEvent) => {\n    if (typeof topic === 'string') setAssessmentTopic(topic);\n    else setAssessmentTopic('Java Programming');\n    setView('quiz');\n  };")

# Add topic to AdaptiveQuiz
content = content.replace("<AdaptiveQuiz onComplete={handleComplete} />", "<AdaptiveQuiz topic={assessmentTopic} onComplete={handleComplete} />")

# Update AdaptiveQuiz signature
content = content.replace("const AdaptiveQuiz = ({ onComplete }: { onComplete: (score: number, total: number, answers: any[]) => void }) => {", "const AdaptiveQuiz = ({ topic, onComplete }: { topic: string; onComplete: (score: number, total: number, answers: any[]) => void }) => {")

# Update getAdaptiveQuestion call inside AdaptiveQuiz
content = content.replace("const nextQ = await getAdaptiveQuestion(performanceHistory, askedQuestions);", "const nextQ = await getAdaptiveQuestion(topic, performanceHistory, askedQuestions);")

def replacer(match):
    attrs = match.group(1) # e.g. className="..."
    inner_text = match.group(2)
    
    topic_match = re.search(r'Start\s+(.*?)\s+Assessment', inner_text)
    if topic_match:
        topic = topic_match.group(1).strip()
        # Edge case handling for ChevronRight in the text
        return f"onClick={{() => startAssessment('{topic}')}}\n                  {attrs}>{inner_text}"
    return match.group(0)

content = re.sub(r'onClick=\{startAssessment\}\s+(className="[^"]*?")\s*>([\s\S]*?</button>)', replacer, content)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/lib/gemini.ts', 'r', encoding='utf-8') as f:
    gemini = f.read()

gemini = gemini.replace("export async function getAdaptiveQuestion(previousPerformance: string, askedQuestions: string[] = []) {", "export async function getAdaptiveQuestion(topic: string, previousPerformance: string, askedQuestions: string[] = []) {")
gemini = gemini.replace("Generate a single multiple-choice question for a Java skill assessment.", "Generate a single multiple-choice question for a ${topic} skill assessment.")
gemini = gemini.replace("export function getFallbackQuestion(previousPerformance: string, askedQuestions: string[] = []) {", "export function getFallbackQuestion(topic: string, previousPerformance: string, askedQuestions: string[] = []) {")
gemini = gemini.replace("return getFallbackQuestion(previousPerformance, askedQuestions);", "return getFallbackQuestion(topic, previousPerformance, askedQuestions);")

with open('src/lib/gemini.ts', 'w', encoding='utf-8') as f:
    f.write(gemini)
