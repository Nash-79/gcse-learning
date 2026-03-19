import type { TopicContent } from "../topicContent";

export const variablesConstants: TopicContent = {
  topicSlug: "variables-constants",
  explanation: [
    "A variable is like a labelled box in the computer's memory where you can store a piece of data. You create a variable by choosing a name and using the = sign (called the assignment operator) to give it a value. For example, age = 15 creates a variable called 'age' and stores the number 15 inside it.",
    "You can change what is stored in a variable at any time — that is why it is called a 'variable' (it can vary). When you assign a new value, the old value is lost. For example, if you write age = 15 and then age = 16, the variable age now holds 16 and the value 15 is gone.",
    "A constant is a value that should NOT change throughout the program. In many languages there is a special keyword for constants, but Python does not have one. Instead, Python programmers use UPPER_CASE names (like MAX_SCORE = 100 or PI = 3.14159) to signal that a value is intended to be constant. This is just a naming convention — Python will not actually stop you from changing it.",
    "Variable names must follow strict rules: they must start with a letter or underscore, they cannot contain spaces (use underscores_like_this instead), they cannot be Python reserved words (like print, if, for, while), and they are case-sensitive (Age and age are different variables). Good variable names are descriptive — 'student_name' is much better than just 'x'.",
    "The assignment operator = means 'store this value in this variable'. It does NOT mean 'equals' in the mathematical sense. The double equals == is used for comparison. This is one of the most common sources of confusion for beginners."
  ],
  codeExamples: [
    {
      title: "Creating and Using Variables",
      code: `name = "Sarah"
age = 15
height = 1.65
is_student = True

print(name)
print("Age:", age)
print("Height:", height, "metres")
print("Student?", is_student)`,
      description: "Variables can store different types of data. Python automatically works out what type of data you are storing."
    },
    {
      title: "Changing Variable Values (Reassignment)",
      code: `score = 0
print("Starting score:", score)

score = 10
print("After round 1:", score)

score = score + 5
print("After bonus:", score)

score += 20
print("After round 2:", score)`,
      description: "Variables can be updated. score = score + 5 adds 5 to the current value. The shorthand score += 20 does the same thing."
    },
    {
      title: "Constants (Naming Convention)",
      code: `MAX_LIVES = 3
TAX_RATE = 0.2
SCHOOL_NAME = "Riverside Academy"

lives_remaining = MAX_LIVES
print("You have", lives_remaining, "lives")

price = 50
total = price + (price * TAX_RATE)
print("Total with tax:", total)`,
      description: "Constants use UPPER_CASE names to show they should not be changed. This is a convention, not enforced by Python."
    },
    {
      title: "Variable Naming Rules",
      code: `# VALID variable names:
first_name = "Alex"
_private = True
score1 = 100
playerScore = 85

# INVALID variable names (these would cause errors):
# 1st_name = "Alex"    # Cannot start with a number
# first name = "Alex"  # Cannot contain spaces
# for = 10             # Cannot use Python keywords
# my-score = 50        # Cannot use hyphens

print(first_name, score1, playerScore)`,
      description: "Follow the naming rules! Use descriptive names with underscores for readability."
    },
    {
      title: "Assignment vs Comparison",
      code: `x = 10        # Assignment: STORE 10 in x
print(x)

y = x         # Assignment: STORE current value of x in y
print(y)

# Now change x - does y change?
x = 99
print("x is now:", x)
print("y is still:", y)`,
      description: "The = sign stores (assigns) a value. When you write y = x, it copies the VALUE at that moment. Changing x later does NOT change y."
    }
  ],
  keyPoints: [
    "A variable stores data in memory with a name you choose.",
    "The = sign is the assignment operator — it means 'store this value', not 'equals'.",
    "Variable names must start with a letter or underscore, contain no spaces, and are case-sensitive.",
    "Constants use UPPER_CASE names (e.g., MAX_SCORE = 100) — this is a convention, not enforced by Python.",
    "Variables can be reassigned (changed). Constants should NOT be changed once set.",
    "Good variable names are descriptive: student_name is better than sn or x.",
    "Python reserved words (if, for, while, print, etc.) cannot be used as variable names."
  ],
  commonMistakes: [
    { mistake: "Putting spaces in variable names: first name = 'Alex'", fix: "Use underscores: first_name = 'Alex'" },
    { mistake: "Starting a variable name with a number: 1st_score = 90", fix: "Start with a letter or underscore: first_score = 90 or score_1 = 90" },
    { mistake: "Confusing = (assignment) with == (comparison)", fix: "Use = to store a value. Use == to check if two things are equal." },
    { mistake: "Using vague variable names like x, a, temp for important data", fix: "Use descriptive names: student_age, total_score, user_password" }
  ],
  workedExample: {
    title: "Student Profile Card",
    problem: "Create variables for a student's name, age, year group, and whether they have a library card. Use a constant for the school name. Print a formatted profile.",
    solution: "Create variables for each piece of data, a constant in UPPER_CASE for the school, then use print() to display everything.",
    code: `SCHOOL_NAME = "Oakwood Academy"

student_name = "Jordan"
student_age = 15
year_group = 10
has_library_card = True

print("=== Student Profile ===")
print("School:", SCHOOL_NAME)
print("Name:", student_name)
print("Age:", student_age)
print("Year:", year_group)
print("Library Card:", has_library_card)`
  },
  videoUrl: "https://www.youtube.com/embed/cQT33yu9pY8",
  quiz: [
    { question: "What is a variable in Python?", options: ["A fixed value that never changes", "A named storage location in memory", "A type of function", "A Python keyword"], correctIndex: 1, explanation: "A variable is a named location in the computer's memory where you can store and retrieve data.", hint: "Think of it as a labelled box where you can put things.", difficulty: "easy" },
    { question: "Which of these is a valid variable name?", options: ["1st_name", "first name", "first_name", "first-name"], correctIndex: 2, explanation: "Variable names cannot start with a number, contain spaces, or use hyphens. first_name uses an underscore which is valid.", hint: "Think about which characters are allowed — letters, numbers, and one special character.", difficulty: "easy" },
    { question: "What does the = sign do in Python?", options: ["Checks if two values are equal", "Assigns (stores) a value in a variable", "Adds two numbers together", "Prints a value"], correctIndex: 1, explanation: "The single = is the assignment operator. It stores the value on the right into the variable on the left.", hint: "It means 'store this', not 'is equal to'.", difficulty: "easy" },
    { question: "How should you name a constant in Python?", options: ["In lowercase: max_score", "In UPPER_CASE: MAX_SCORE", "With a $ symbol: $MAX_SCORE", "Using the const keyword: const MAX_SCORE"], correctIndex: 1, explanation: "Python convention is to use UPPER_CASE names for constants. Python doesn't have a const keyword.", hint: "It's a naming convention using capital letters.", difficulty: "medium" },
    { question: "What is the output of: x = 5; y = x; x = 10; print(y)?", options: ["5", "10", "15", "Error"], correctIndex: 0, explanation: "When y = x is executed, y gets the VALUE of x at that moment (5). Changing x later does not affect y.", hint: "Assignment copies the current value — it doesn't create a permanent link.", difficulty: "medium" },
    { question: "Which of these is a Python keyword that CANNOT be used as a variable name?", options: ["score", "total", "while", "name"], correctIndex: 2, explanation: "'while' is a reserved keyword in Python (used for loops). You cannot use it as a variable name.", hint: "One of these is used to create a type of loop.", difficulty: "medium" },
    { question: "What will happen if you run: print = 5?", options: ["It stores 5 in a variable called print", "Syntax error — print is a keyword", "It prints the number 5", "Nothing happens"], correctIndex: 0, explanation: "Technically Python allows this — it overwrites the print function with the number 5. After this, print() will no longer work! This is why you should never use function names as variable names.", hint: "Python won't stop you, but it will break something important...", difficulty: "hard" },
    { question: "What is the difference between a variable and a constant?", options: ["Variables use lowercase, constants use numbers", "Constants can be changed, variables cannot", "Variables can change during the program, constants should stay the same", "There is no difference in Python"], correctIndex: 2, explanation: "Variables are meant to change. Constants (UPPER_CASE names) are values that should remain the same throughout the program.", hint: "The clue is in the names — 'variable' means it varies, 'constant' means it stays constant.", difficulty: "medium" }
  ]
};
