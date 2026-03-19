import type { TopicContent } from "../topicContent";

export const booleanLogic: TopicContent = {
  topicSlug: "boolean-logic",
  explanation: [
    "Boolean logic is the foundation of how computers make decisions. Everything in a computer ultimately comes down to True or False (1 or 0). The OCR specification (J277, Section 2.4) requires you to understand AND, OR, and NOT logic gates and their truth tables.",
    "The three Boolean operators are: AND (both inputs must be True), OR (at least one input must be True), and NOT (flips True to False and vice versa). These correspond directly to Python's 'and', 'or', and 'not' keywords.",
    "Truth tables show every possible combination of inputs and the resulting output. For AND and OR with two inputs, there are 4 possible combinations (2² = 4). You must be able to complete truth tables in the exam — both for simple gates and combined expressions.",
    "In Python, you can combine Boolean operators to create complex conditions. The order of precedence is: NOT first, then AND, then OR. Use brackets to make your intention clear and override this order when needed."
  ],
  codeExamples: [
    {
      title: "AND, OR, NOT in Python",
      code: `# AND — both must be True
print(True and True)    # True
print(True and False)   # False
print(False and False)  # False

# OR — at least one must be True
print(True or False)    # True
print(False or False)   # False

# NOT — flips the value
print(not True)         # False
print(not False)        # True`,
      description: "AND requires both True. OR requires at least one True. NOT flips the value."
    },
    {
      title: "Truth Tables in Code",
      code: `# Generate AND truth table
print("A     | B     | A AND B")
print("------+-------+--------")
for a in [True, False]:
    for b in [True, False]:
        result = a and b
        print(f"{str(a):5} | {str(b):5} | {result}")

print()

# Generate OR truth table
print("A     | B     | A OR B")
print("------+-------+--------")
for a in [True, False]:
    for b in [True, False]:
        result = a or b
        print(f"{str(a):5} | {str(b):5} | {result}")`,
      description: "Truth tables show all possible input combinations and their outputs."
    },
    {
      title: "Combining Boolean Operators",
      code: `age = 16
has_ticket = True
is_vip = False

# Complex condition
if (age >= 18 and has_ticket) or is_vip:
    print("Entry allowed")
else:
    print("Entry denied")

# NOT example
raining = True
if not raining:
    print("No umbrella needed")
else:
    print("Take an umbrella!")

# Precedence: NOT > AND > OR
x = True or False and not True
print(x)  # True (not True = False, False and False = False, True or False = True)`,
      description: "Use brackets to make complex expressions clear. NOT > AND > OR precedence."
    },
    {
      title: "OCR Exam-Style: Combined Expression",
      code: `# Evaluate: NOT (A AND B) OR C
# This is common in OCR J277 exam questions

A = True
B = False
C = True

result = not (A and B) or C

print(f"A = {A}, B = {B}, C = {C}")
print(f"A AND B = {A and B}")
print(f"NOT (A AND B) = {not (A and B)}")
print(f"NOT (A AND B) OR C = {result}")`,
      description: "Break complex expressions into steps — this is how to show working in the exam."
    }
  ],
  keyPoints: [
    "AND: True only when BOTH inputs are True. All other combinations give False.",
    "OR: True when AT LEAST ONE input is True. Only False when both are False.",
    "NOT: Flips True to False and False to True. Only has one input.",
    "Precedence order: NOT is evaluated first, then AND, then OR.",
    "Use brackets () to override precedence and make expressions clearer.",
    "Truth tables have 2ⁿ rows where n is the number of inputs (2 inputs = 4 rows).",
    "Boolean logic maps directly to logic gates in hardware (covered in Paper 1)."
  ],
  commonMistakes: [
    { mistake: "Thinking OR means 'one or the other but not both' (that's XOR)", fix: "OR returns True if EITHER or BOTH inputs are True." },
    { mistake: "Forgetting NOT has highest precedence: not True and False", fix: "not True and False = False and False = False. Use brackets: not (True and False) = True." },
    { mistake: "Leaving blank rows in a truth table", fix: "A truth table must have ALL combinations: for 2 inputs that's TT, TF, FT, FF." },
    { mistake: "Confusing AND with OR in conditions", fix: "AND = stricter (both must be true). OR = more lenient (only one needs to be true)." }
  ],
  workedExample: {
    title: "Access Control System",
    problem: "A door opens if: (the person has a keycard AND the time is between 9-17) OR they are an admin. Write the logic and create a truth table for: (keycard AND office_hours) OR admin.",
    solution: "Implement the Boolean expression and generate its truth table.",
    code: `keycard = True
hour = 14
admin = False

office_hours = 9 <= hour <= 17

if (keycard and office_hours) or admin:
    print("Door opens")
else:
    print("Access denied")

# Truth table for (A AND B) OR C
print("\\nTruth Table: (A AND B) OR C")
print("A     | B     | C     | Result")
print("------+-------+-------+-------")
for a in [True, False]:
    for b in [True, False]:
        for c in [True, False]:
            result = (a and b) or c
            print(f"{str(a):5} | {str(b):5} | {str(c):5} | {result}")`
  },
  videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
  quiz: [
    { question: "What does True AND False evaluate to?", options: ["True", "False", "Error", "None"], correctIndex: 1, explanation: "AND requires BOTH inputs to be True. Since one is False, the result is False.", hint: "AND is strict — both must be True.", difficulty: "easy" },
    { question: "What does False OR True evaluate to?", options: ["True", "False", "Error", "None"], correctIndex: 0, explanation: "OR only needs ONE input to be True. Since one is True, the result is True.", hint: "OR is lenient — only one needs to be True.", difficulty: "easy" },
    { question: "What does NOT False evaluate to?", options: ["False", "True", "0", "Error"], correctIndex: 1, explanation: "NOT flips the value: NOT False = True.", hint: "NOT reverses whatever it's given.", difficulty: "easy" },
    { question: "How many rows does a truth table with 3 inputs have?", options: ["3", "6", "8", "9"], correctIndex: 2, explanation: "2ⁿ rows where n = number of inputs. 2³ = 8 rows.", hint: "Each input can be True or False — multiply the possibilities.", difficulty: "medium" },
    { question: "What is the precedence order of Boolean operators?", options: ["AND, OR, NOT", "OR, AND, NOT", "NOT, AND, OR", "NOT, OR, AND"], correctIndex: 2, explanation: "NOT is evaluated first, then AND, then OR.", hint: "The single-input operator has highest priority.", difficulty: "medium" },
    { question: "OCR exam: Evaluate NOT (True AND True) OR False", options: ["True", "False", "Error", "None"], correctIndex: 1, explanation: "True AND True = True. NOT True = False. False OR False = False.", hint: "Work from the inside brackets outward.", difficulty: "hard" },
    { question: "Which gate only outputs True when BOTH inputs are True?", options: ["OR gate", "NOT gate", "AND gate", "XOR gate"], correctIndex: 2, explanation: "The AND gate requires both inputs to be True to output True.", hint: "This gate is the strictest — it needs everything to be True.", difficulty: "easy" },
    { question: "In Python, what does 'not (age >= 18)' mean when age is 16?", options: ["age is not 18", "age < 18, so True", "Error", "age >= 18"], correctIndex: 1, explanation: "age >= 18 is False (16 < 18). not False = True. So the person is under 18.", hint: "Evaluate the inner expression first, then flip it with NOT.", difficulty: "medium" }
  ]
};
