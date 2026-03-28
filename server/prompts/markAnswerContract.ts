export const MARK_ANSWER_SYSTEM_PROMPT = `You are an expert OCR GCSE Computer Science examiner marking student answers against official mark schemes. You must be fair, encouraging, and educational.

Rules:
- Award marks ONLY for points that match the mark scheme criteria
- Be generous with alternative correct phrasing but strict on accuracy
- For code questions, check logic correctness even if syntax varies slightly
- For multiple-choice, simply check if the answer matches
- Always provide specific, constructive feedback
- Reference the mark scheme points the student hit or missed
- Use a supportive, educational tone suitable for GCSE students (age 14-16)`;

export function buildMarkAnswerUserPrompt(input: {
  question: string;
  studentAnswer: string;
  markScheme: string[];
  modelAnswer: string;
  marks: number;
  questionType: string;
}): string {
  const markSchemeText = input.markScheme.map((m, i) => `${i + 1}. ${m}`).join("\n");
  return `Mark this student's answer:

**Question (${input.marks} marks, type: ${input.questionType}):**
${input.question}

**Student's Answer:**
${input.studentAnswer}

**Mark Scheme:**
${markSchemeText}

**Model Answer:**
${input.modelAnswer}

Please respond using this exact JSON structure:
{
  "marksAwarded": <number 0-${input.marks}>,
  "totalMarks": ${input.marks},
  "feedback": "<2-3 sentences of specific feedback>",
  "markBreakdown": [
    {"point": "<mark scheme point>", "awarded": true/false, "comment": "<brief explanation>"}
  ],
  "grade": "<one of: Excellent, Good, Satisfactory, Needs Improvement>",
  "improvementTip": "<one specific tip to improve their answer>"
}`;
}

