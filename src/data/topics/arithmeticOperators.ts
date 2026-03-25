import type { TopicContent } from "../topicContent";

export const arithmeticOperators: TopicContent = {
  topicSlug: "arithmetic-operators",
  explanation: [
    "Python supports seven arithmetic operators that you need to know for GCSE. The basic four are: addition (+), subtraction (-), multiplication (*), and division (/). Python also has three special operators: integer division (//), modulo (%), and exponentiation (**).",
    "Division in Python 3 always returns a float (decimal), even if the result is a whole number. For example, 10 / 2 gives 5.0, not 5. If you want a whole number result, use integer division (//) which drops the decimal part. For example, 17 // 5 gives 3 (not 3.4).",
    "The modulo operator (%) gives the remainder after division. For example, 17 % 5 gives 2 because 17 ÷ 5 = 3 remainder 2. This is extremely useful for checking if a number is odd or even (number % 2 == 0 means even), or for wrapping values around (like clock arithmetic).",
    "The exponentiation operator (**) raises a number to a power. For example, 2 ** 3 means 2³ = 8, and 5 ** 2 means 5² = 25. This is used instead of the ^ symbol (which in Python does something completely different — bitwise XOR).",
    "Python follows the standard order of operations (BIDMAS/BODMAS): Brackets first, then Indices (powers/**), then Division and Multiplication (left to right), then Addition and Subtraction (left to right). You can use brackets () to change the order. For example, 2 + 3 * 4 = 14 (multiplication first), but (2 + 3) * 4 = 20 (brackets first)."
  ],
  codeExamples: [
    {
      title: "All Seven Arithmetic Operators",
      code: `a = 17
b = 5

print("Addition:", a + b)        # 22
print("Subtraction:", a - b)     # 12
print("Multiplication:", a * b)  # 85
print("Division:", a / b)        # 3.4 (always float)
print("Integer Division:", a // b)  # 3 (drops decimal)
print("Modulo:", a % b)          # 2 (remainder)
print("Exponentiation:", a ** 2) # 289 (17 squared)`,
      description: "Division (/) always gives a float. Integer division (//) drops the decimal. Modulo (%) gives the remainder."
    },
    {
      title: "Modulo — Checking Odd and Even",
      code: `num = int(input("Enter a number: "))

if num % 2 == 0:
    print(num, "is EVEN")
else:
    print(num, "is ODD")

print()
print("10 % 3 =", 10 % 3)
print("20 % 4 =", 20 % 4)
print("7 % 2 =", 7 % 2)`,
      description: "If number % 2 equals 0, the number is even. If it equals 1, it's odd. This is a very common GCSE exam pattern!"
    },
    {
      title: "Order of Operations (BIDMAS)",
      code: `result1 = 2 + 3 * 4
print("2 + 3 * 4 =", result1)

result2 = (2 + 3) * 4
print("(2 + 3) * 4 =", result2)

result3 = 10 - 2 ** 2
print("10 - 2 ** 2 =", result3)

result4 = (10 - 2) ** 2
print("(10 - 2) ** 2 =", result4)`,
      description: "BIDMAS: Brackets, Indices, Division/Multiplication, Addition/Subtraction. Use brackets to change the order."
    },
    {
      title: "Shorthand Assignment Operators",
      code: `score = 100

score += 10
print("After += 10:", score)

score -= 25
print("After -= 25:", score)

score *= 2
print("After *= 2:", score)

score //= 3
print("After //= 3:", score)`,
      description: "Shorthand operators like += combine an operation with assignment. score += 10 means score = score + 10."
    },
    {
      title: "Practical Example — Shop Calculator",
      code: `price = float(input("Item price: "))
quantity = int(input("Quantity: "))

subtotal = price * quantity
vat = subtotal * 0.20
total = subtotal + vat

print(f"Subtotal: {subtotal:.2f}")
print(f"VAT (20%): {vat:.2f}")
print(f"Total: {total:.2f}")`,
      description: "Arithmetic operators are used everywhere — calculations, formulas, games, business logic."
    }
  ],
  keyPoints: [
    "/ (division) ALWAYS returns a float. 10 / 2 gives 5.0, not 5.",
    "// (integer division) drops the decimal part. 17 // 5 gives 3.",
    "% (modulo) gives the remainder. 17 % 5 gives 2. Essential for odd/even checks.",
    "** (exponentiation) raises to a power. 2 ** 3 gives 8. Do NOT use ^ in Python.",
    "BIDMAS order: Brackets → Indices (**) → Division/Multiplication → Addition/Subtraction.",
    "Shorthand operators: += -= *= /= //= %= combine operation and assignment.",
    "Use brackets () to force operations to happen in the order you want."
  ],
  commonMistakes: [
    { mistake: "Using ^ for powers: 2 ^ 3", fix: "Use ** for exponentiation: 2 ** 3. In Python, ^ is bitwise XOR." },
    { mistake: "Expecting 10 / 2 to give 5 (int)", fix: "/ always gives a float: 10 / 2 = 5.0. Use // if you want an integer." },
    { mistake: "Forgetting BIDMAS: writing 2 + 3 * 4 and expecting 20", fix: "Multiplication happens first: result is 14. Use brackets: (2 + 3) * 4 for 20." },
    { mistake: "Confusing // and %", fix: "// gives the quotient (whole result). % gives the remainder. 17 // 5 = 3, 17 % 5 = 2." }
  ],
  workedExample: {
    title: "Seconds Converter",
    problem: "Ask the user for a number of seconds. Convert it to minutes and remaining seconds. For example, 200 seconds = 3 minutes and 20 seconds.",
    solution: "Use integer division (//) to get whole minutes, and modulo (%) to get remaining seconds.",
    code: `total_seconds = int(input("Enter seconds: "))

minutes = total_seconds // 60
seconds = total_seconds % 60

print(f"{total_seconds} seconds = {minutes} minutes and {seconds} seconds")`
  },
  videoUrl: "https://www.youtube.com/embed/Aj8FQRIHJSc",
  quiz: [
    { question: "What does 17 % 5 evaluate to?", options: ["3", "2", "3.4", "85"], correctIndex: 1, explanation: "% gives the remainder. 17 ÷ 5 = 3 remainder 2. So 17 % 5 = 2.", hint: "% gives the remainder after division. How many are left over?", difficulty: "easy" },
    { question: "What is the result of 10 / 2 in Python 3?", options: ["5", "5.0", "5.00", "Error"], correctIndex: 1, explanation: "The / operator ALWAYS returns a float in Python 3. 10 / 2 = 5.0.", hint: "Division (/) always returns a specific type, even for whole number results.", difficulty: "easy" },
    { question: "How do you raise 3 to the power of 4 in Python?", options: ["3 ^ 4", "3 * 4", "3 ** 4", "pow 3 4"], correctIndex: 2, explanation: "** is the exponentiation operator. 3 ** 4 = 81.", hint: "It uses a double star/asterisk symbol.", difficulty: "easy" },
    { question: "What does 20 // 3 give?", options: ["6.67", "7", "6", "Error"], correctIndex: 2, explanation: "// is integer division — it drops the decimal part. 20 ÷ 3 = 6.67, so // gives 6.", hint: "Integer division drops everything after the decimal point.", difficulty: "medium" },
    { question: "What is the result of 2 + 3 * 4?", options: ["20", "14", "24", "Error"], correctIndex: 1, explanation: "BIDMAS: multiplication before addition. 3 * 4 = 12, then 2 + 12 = 14.", hint: "Remember BIDMAS — which operation has higher priority?", difficulty: "medium" },
    { question: "Which operator would you use to check if a number is even?", options: ["/", "//", "%", "**"], correctIndex: 2, explanation: "% (modulo) gives the remainder. If number % 2 == 0, the number is even.", hint: "An even number has no remainder when divided by 2.", difficulty: "medium" },
    { question: "What does score += 10 mean?", options: ["score equals 10", "score = score + 10", "score = 10 + 10", "score = score * 10"], correctIndex: 1, explanation: "+= is a shorthand: score += 10 is the same as score = score + 10.", hint: "It combines an addition with an assignment.", difficulty: "medium" },
    { question: "What is the value of (10 + 5) ** 2 - 100?", options: ["125", "15", "225", "Error"], correctIndex: 0, explanation: "Brackets first: 10 + 5 = 15. Then power: 15 ** 2 = 225. Then subtract: 225 - 100 = 125.", hint: "Follow BIDMAS: brackets, then indices (power), then subtraction.", difficulty: "hard" }
  ]
};
