import type { TopicContent } from "../topicContent";

export const introToPython: TopicContent = {
  topicSlug: "intro-to-python",
  explanation: [
    "Python is a high-level programming language created by Guido van Rossum in 1991. It is one of the most popular languages in the world and is the language used in the OCR GCSE Computer Science course (J277). Python is known for being easy to read and write because its syntax (rules) look very close to plain English.",
    "When you write Python code, you type instructions into a text file (called a script). The Python interpreter then reads your script line by line and executes each instruction in order — this is called sequence. Every program you write follows this principle: instructions run from top to bottom, one after another.",
    "To write Python, you need two things: an editor (where you type your code) and an interpreter (which runs your code). An IDE (Integrated Development Environment) like IDLE, Thonny, or VS Code combines both into one application. The Python Shell (also called the interactive console) lets you type individual lines of code and see results immediately — great for quick experiments. A script file (.py) lets you write longer programs and save them.",
    "There are three main types of programming errors you will encounter: Syntax errors (you broke Python's grammar rules — like forgetting a colon), Logic errors (your code runs but gives the wrong answer — like using + instead of *), and Runtime errors (your code crashes while running — like dividing by zero). Learning to spot and fix these is a huge part of programming."
  ],
  codeExamples: [
    {
      title: "Your First Python Program",
      code: `print("Hello, World!")
print("Welcome to GCSE Computer Science!")
print("I am learning Python.")`,
      description: "The print() function displays text on the screen. Each print() statement creates a new line of output. This is the simplest possible Python program."
    },
    {
      title: "Comments in Code",
      code: `# This is a single-line comment - Python ignores it
# Comments are notes for humans, not for the computer

print("Hello!")  # You can also put comments at the end of a line

# Good comments explain WHY, not WHAT
# Bad:  print the name (obvious)
# Good: Display welcome message for new users`,
      description: "Comments start with the # symbol. Python completely ignores everything after # on that line. Use comments to explain your code to other programmers (and your future self!)."
    },
    {
      title: "Sequence — Code Runs Top to Bottom",
      code: `print("Step 1: Wake up")
print("Step 2: Brush teeth")
print("Step 3: Eat breakfast")
print("Step 4: Go to school")

# Try swapping the order of these lines
# and see how the output changes!`,
      description: "Python executes code in sequence — from the first line to the last. The order matters! This is the most fundamental concept in programming."
    },
    {
      title: "Spotting Syntax Errors",
      code: `# These lines have syntax errors (try to spot them!)
# Uncomment each one to see what error Python gives

# print("Hello)         # Missing closing quote
# print "Hello"         # Missing brackets (parentheses)
# Print("Hello")        # Capital P - Python is case-sensitive!

# This is correct:
print("Hello, World!")`,
      description: "Syntax errors happen when you break Python's grammar rules. Python is case-sensitive — print() works but Print() does not!"
    }
  ],
  keyPoints: [
    "Python is the programming language used in OCR GCSE Computer Science (J277).",
    "Programs execute in sequence — instructions run from top to bottom, one line at a time.",
    "The Python Shell lets you run code line by line. Script files (.py) let you save and run whole programs.",
    "An IDE (like IDLE or Thonny) combines a code editor and interpreter in one application.",
    "Comments start with # and are ignored by Python — use them to explain your code.",
    "Python is case-sensitive: print() works, but Print() or PRINT() will cause an error.",
    "There are three error types: Syntax (grammar), Logic (wrong answer), and Runtime (crash while running)."
  ],
  commonMistakes: [
    { mistake: "Writing Print() or PRINT() with a capital letter", fix: "Python is case-sensitive. Always use lowercase: print()" },
    { mistake: "Forgetting brackets around print: print 'Hello'", fix: "In Python 3, print is a function and needs brackets: print('Hello')" },
    { mistake: "Missing a closing quote mark: print(\"Hello)", fix: "Always match your quotes: print(\"Hello\") or print('Hello')" },
    { mistake: "Thinking comments affect the program output", fix: "Comments (lines starting with #) are completely ignored by Python — they are just notes for humans." }
  ],
  workedExample: {
    title: "Personal Introduction Program",
    problem: "Write a program that displays your name, age, favourite subject, and a fun fact about yourself — each on a separate line.",
    solution: "Use four print() statements, one for each piece of information. Remember to put text inside quotes.",
    code: `print("Name: Alex Johnson")
print("Age: 15")
print("Favourite Subject: Computer Science")
print("Fun Fact: I can solve a Rubik's cube in under 2 minutes!")`
  },
  videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
  quiz: [
    { question: "What does the print() function do in Python?", options: ["Saves data to a file", "Asks the user a question", "Displays text on the screen", "Creates a variable"], correctIndex: 2, explanation: "print() outputs (displays) text or values on the screen.", hint: "Think about what you see on screen when you run print('Hello').", difficulty: "easy" },
    { question: "What symbol starts a comment in Python?", options: ["//", "/*", "#", "--"], correctIndex: 2, explanation: "In Python, comments begin with the # symbol. Everything after # on that line is ignored.", hint: "It's a symbol you might see on a phone keyboard, sometimes called 'hash'.", difficulty: "easy" },
    { question: "Which of these is a valid Python statement?", options: ["Print('Hello')", "print('Hello')", "PRINT('Hello')", "printf('Hello')"], correctIndex: 1, explanation: "Python is case-sensitive. The correct function is print() with a lowercase 'p'.", hint: "Python cares about uppercase vs lowercase letters.", difficulty: "easy" },
    { question: "What is an IDE?", options: ["A type of programming language", "An Integrated Development Environment — a tool for writing and running code", "A type of computer error", "A file format for Python scripts"], correctIndex: 1, explanation: "An IDE (Integrated Development Environment) combines a text editor, interpreter, and debugging tools in one application.", hint: "It stands for Integrated Development Environment.", difficulty: "medium" },
    { question: "What is a syntax error?", options: ["When the program gives the wrong answer", "When Python crashes during execution", "When you break Python's grammar rules", "When the program runs too slowly"], correctIndex: 2, explanation: "A syntax error occurs when your code breaks Python's rules — like missing a colon or bracket. Python cannot run the code at all.", hint: "Think of 'syntax' as the grammar rules of a programming language.", difficulty: "medium" },
    { question: "In what order does Python execute lines of code?", options: ["Randomly", "From bottom to top", "From top to bottom (sequence)", "All at once"], correctIndex: 2, explanation: "Python executes code in sequence — from the first line to the last, one line at a time.", hint: "Think about reading a book — which direction do you go?", difficulty: "easy" },
    { question: "Which of these would cause a syntax error?", options: ["print(\"Hello\")", "# This is a comment", "print(Hello)", "print('Hello')"], correctIndex: 2, explanation: "print(Hello) without quotes tries to use Hello as a variable name — if it's not defined, you get a NameError. But even conceptually, missing quotes around text is a very common syntax mistake.", hint: "What happens if you forget to put quotes around text?", difficulty: "hard" },
    { question: "What is the difference between a logic error and a syntax error?", options: ["Logic errors crash the program, syntax errors don't", "Syntax errors prevent the program from running, logic errors produce wrong results", "They are the same thing", "Logic errors only happen with numbers"], correctIndex: 1, explanation: "Syntax errors stop Python from running your code at all. Logic errors let the code run, but it produces the wrong output.", hint: "One stops the program from starting, the other lets it run but gives wrong answers.", difficulty: "hard" }
  ]
};
