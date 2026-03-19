import { twoDArrays } from "./topics/twoDArrays";
import { randomNumbers } from "./topics/randomNumbers";
import { robustProgramming } from "./topics/robustProgramming";
import { booleanLogic } from "./topics/booleanLogic";
import { insertionSort } from "./topics/insertionSort";
import { sqlBasics } from "./topics/sqlBasics";
import { arithmeticOperators } from "./topics/arithmeticOperators";
import { selectionIfElse } from "./topics/selectionIfElse";
import { stringHandling } from "./topics/stringHandling";
import { dataTypesCasting } from "./topics/dataTypesCasting";
import { variablesConstants } from "./topics/variablesConstants";

import { introToPython } from "./topics/introToPython";

export type Difficulty = "easy" | "medium" | "hard";
export type StepDifficulty = "beginner" | "intermediate" | "hard";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  difficulty?: Difficulty;
}

export interface LearningStep {
  title: string;
  difficulty: StepDifficulty;
  explanation: string;
  examples: Array<{ code: string; description?: string }>;
  hints: string[];
  interactiveTask?: { instruction: string; starterCode: string };
}

export interface TopicContent {
  topicSlug: string;
  explanation: string[];
  codeExamples: Array<{ title: string; code: string; description: string }>;
  keyPoints: string[];
  commonMistakes: Array<{ mistake: string; fix: string }>;
  workedExample: { title: string; problem: string; solution: string; code: string };
  videoUrl: string;
  quiz: QuizQuestion[];
  learningSteps?: LearningStep[];
}

export const topicData: Record<string, TopicContent> = {
  "variables-data-types": {
    topicSlug: "variables-data-types",
    explanation: [
      "Variables are like labelled boxes where you can store data in your program. When you create a variable, you give it a name and assign a value to it using the equals sign (=).",
      "Python automatically figures out what 'type' of data you are storing. The main data types you need for GCSE are Strings (text), Integers (whole numbers), Floats (decimal numbers), and Booleans (True or False).",
      "You can check a variable's type at any time using the type() function, which is very useful when debugging your code."
    ],
    codeExamples: [
      {
        title: "Creating Variables",
        code: `name = "Sarah"      # String (str)
age = 15            # Integer (int)
height = 1.65       # Float (float)
is_student = True   # Boolean (bool)

print(name, "is", age, "years old.")
print("Data type of age:", type(age))`,
        description: "Notice how we don't need to tell Python what type the data is, it just knows!"
      },
      {
        title: "Checking and Changing Types",
        code: `score = 45
print(type(score))      # <class 'int'>

score_text = str(score)
print(type(score_text)) # <class 'str'>`,
        description: "You can convert between types using int(), float(), str(), and bool()."
      }
    ],
    keyPoints: [
      "Variables must start with a letter or underscore, not a number.",
      "Variable names cannot contain spaces (use underscores_instead).",
      "The = sign means 'assign to', not 'equals to'.",
      "Booleans must start with a capital T or F (True, False).",
      "Use type() to check what kind of data a variable holds."
    ],
    commonMistakes: [
      { mistake: "Putting spaces in variable names (e.g. `first name = 'Alex'`)", fix: "Use underscores: `first_name = 'Alex'`" },
      { mistake: "Forgetting quotes around strings (e.g. `name = Alex`)", fix: "Always wrap text in quotes: `name = 'Alex'`" },
      { mistake: "Writing booleans in lowercase (e.g. `is_done = true`)", fix: "Capitalise them: `is_done = True`" }
    ],
    workedExample: {
      title: "Student Profile",
      problem: "Create variables for a student's name, age, and grade (a decimal like 7.5 out of 10). Print a summary line.",
      solution: "We need a string, an integer, and a float variable. Use print() with f-strings or commas to display them.",
      code: `student_name = "Jordan"
student_age = 15
grade = 8.5

print(student_name, "is", student_age, "years old.")
print("Grade:", grade, "out of 10")`
    },
    videoUrl: "https://www.youtube.com/embed/cQT33yu9pY8",
    quiz: [
      { question: "Which of these is a valid variable name in Python?", options: ["1st_name", "first name", "first_name", "first-name"], correctIndex: 2, explanation: "Variables cannot contain spaces or hyphens, and cannot start with a number.", hint: "Think about which characters are allowed in variable names.", difficulty: "easy" },
      { question: "What data type is 3.14?", options: ["Integer", "String", "Float", "Boolean"], correctIndex: 2, explanation: "Decimals are called Floats in Python.", hint: "It has a decimal point — what type handles decimals?", difficulty: "easy" },
      { question: "What symbol is used to assign a value to a variable?", options: ["==", "->", ":", "="], correctIndex: 3, explanation: "The single equals sign = is the assignment operator.", hint: "One of these symbols means 'store this value'.", difficulty: "easy" },
      { question: "What is the correct way to write a boolean value?", options: ["true", "True", "TRUE", "'True'"], correctIndex: 1, explanation: "Booleans must have a capital first letter and no quotes.", hint: "Python is case-sensitive for keywords.", difficulty: "medium" },
      { question: "What will print(type('75')) output?", options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "Error"], correctIndex: 1, explanation: "Because 75 is inside quotes, Python treats it as a String (str).", hint: "Pay attention to the quotation marks around 75.", difficulty: "medium" },
      { question: "What is the output of: x = 10; x = x + 5; print(x)?", options: ["10", "15", "x + 5", "Error"], correctIndex: 1, explanation: "Variables can be reassigned. x starts as 10, then becomes 10 + 5 = 15.", hint: "Variables can change their value — trace through each line.", difficulty: "medium" },
      { question: "Which line will cause an error?", options: ["age = '15'", "score = 99.5", "2name = 'Jo'", "is_valid = False"], correctIndex: 2, explanation: "Variable names cannot start with a digit. '2name' is invalid.", hint: "One of these breaks a naming rule about the first character.", difficulty: "hard" },
      { question: "After running: a = 5; b = a; a = 10 — what is b?", options: ["5", "10", "15", "Error"], correctIndex: 0, explanation: "b was assigned the value of a (5) at that moment. Changing a afterwards does not affect b.", hint: "Assignment copies the current value, it doesn't create a link.", difficulty: "hard" }
    ]
  },

  "input-output-casting": {
    topicSlug: "input-output-casting",
    explanation: [
      "Input allows your program to ask the user for information. Output allows your program to display information back to the user. In Python, we use input() and print().",
      "Crucially, everything typed into an input() is saved as a String. If you want to do math with a user's input, you must 'cast' (convert) it to an integer or float first.",
      "You can combine casting and input in a single line: `age = int(input('How old are you? '))` — this is very common in GCSE exam answers."
    ],
    codeExamples: [
      {
        title: "Basic Input and Output",
        code: `name = input("What is your name? ")
print("Hello", name)
print(f"Nice to meet you, {name}!")`,
        description: "The program pauses on line 1 to wait for the user. f-strings let you embed variables in text."
      },
      {
        title: "Type Casting",
        code: `age = int(input("How old are you? "))
next_year = age + 1
print("Next year you will be", next_year)

price = float(input("Enter item price: £"))
with_tax = price * 1.2
print(f"With 20% tax: £{with_tax:.2f}")`,
        description: "Use int() for whole numbers and float() for decimals."
      }
    ],
    keyPoints: [
      "print() displays text on the screen.",
      "input() pauses the program and waits for the user to type something.",
      "input() ALWAYS returns a string (str).",
      "Use int(), float(), or str() to convert between data types (Casting).",
      "f-strings (f'Hello {name}') make formatting output much easier."
    ],
    commonMistakes: [
      { mistake: "Trying to do math with a raw input: `age = input('Age?'); print(age + 5)`", fix: "Cast it first: `age = int(input('Age?'))`" },
      { mistake: "Forgetting the closing parenthesis when casting: `int(input('Age?' )`", fix: "Make sure brackets match: `int(input('Age?'))`" },
      { mistake: "No space after the prompt text: `input('Name:')`", fix: "Add a space: `input('Name: ')`" }
    ],
    workedExample: {
      title: "Age Calculator",
      problem: "Ask the user what year they were born, and calculate how old they turn in 2025.",
      solution: "We must ask for input, cast it to an integer, subtract it from 2025, and print the result.",
      code: `birth_year = int(input("What year were you born? "))
age = 2025 - birth_year
print("You turn", age, "in 2025!")`
    },
    videoUrl: "https://www.youtube.com/embed/4OX49nLNPEE",
    quiz: [
      { question: "What data type does the input() function always return?", options: ["Integer", "Float", "String", "Depends on what the user types"], correctIndex: 2, explanation: "input() always returns a String, even if the user types a number.", hint: "No matter what the user types, input() treats it all the same way.", difficulty: "easy" },
      { question: "Which function converts a string to a whole number?", options: ["string()", "num()", "float()", "int()"], correctIndex: 3, explanation: "int() stands for Integer and converts values to whole numbers.", hint: "The function name is short for 'integer'.", difficulty: "easy" },
      { question: "What will this code print? print('3' + '3')", options: ["6", "33", "Error", "Nothing"], correctIndex: 1, explanation: "Because they are strings, the + symbol joins them together (concatenation).", hint: "What happens when you use + with strings instead of numbers?", difficulty: "medium" },
      { question: "Identify the error: age = int(input('Enter age:')", options: ["int should be Int", "Missing closing bracket at the end", "Cannot convert age to int", "No error"], correctIndex: 1, explanation: "There are two opening brackets but only one closing bracket.", hint: "Count the opening and closing brackets carefully.", difficulty: "medium" },
      { question: "How do you display text on the screen?", options: ["output()", "display()", "print()", "write()"], correctIndex: 2, explanation: "print() is the built-in Python function for output.", hint: "Think about the word that means to show text on a page.", difficulty: "easy" },
      { question: "What happens if you run: print(int('hello'))?", options: ["Prints 0", "Prints 'hello'", "ValueError crash", "Prints nothing"], correctIndex: 2, explanation: "Python cannot convert 'hello' to an integer — it raises a ValueError.", hint: "Can the word 'hello' be turned into a number?", difficulty: "hard" },
      { question: "What does this output? x = input(); print(type(x)) — if user types 42", options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'number'>"], correctIndex: 1, explanation: "input() always returns a string, regardless of what the user types.", hint: "Remember: input() ALWAYS returns the same type.", difficulty: "hard" }
    ]
  },

  "arithmetic-string-ops": {
    topicSlug: "arithmetic-string-ops",
    explanation: [
      "Python supports standard arithmetic: addition (+), subtraction (-), multiplication (*), division (/), integer division (//), modulo (%), and exponentiation (**).",
      "String operations let you join (concatenate) strings using +, repeat them using *, and find their length using len(). String concatenation only works with strings — if you try to join a string and a number you'll get a TypeError.",
      "The modulo operator (%) is particularly useful in GCSE programming — it gives the remainder of division, which helps test if a number is odd/even or divisible by something."
    ],
    codeExamples: [
      {
        title: "Arithmetic Operations",
        code: `a = 17
b = 5

print(a + b)   # 22  — Addition
print(a - b)   # 12  — Subtraction
print(a * b)   # 85  — Multiplication
print(a / b)   # 3.4 — Division (always float)
print(a // b)  # 3   — Integer Division (no remainder)
print(a % b)   # 2   — Modulo (remainder)
print(a ** 2)  # 289 — Exponentiation`,
        description: "Note: / always returns a float even if the result is a whole number!"
      },
      {
        title: "String Operations",
        code: `first = "Python"
second = "GCSE"

joined = first + " " + second
print(joined)           # Python GCSE

repeated = "Ha" * 3
print(repeated)         # HaHaHa

print(len(joined))      # 11
print(joined.upper())   # PYTHON GCSE`,
        description: "Strings have many useful built-in methods like upper(), lower(), len()."
      }
    ],
    keyPoints: [
      "/ always returns a float. Use // for integer division.",
      "% (modulo) gives the remainder — useful for odd/even checks.",
      "** is the power/exponent operator.",
      "Concatenate strings with + but you cannot mix strings and numbers without casting.",
      "len() returns the number of characters in a string."
    ],
    commonMistakes: [
      { mistake: "`print('Score: ' + 95)`", fix: "Cast the integer: `print('Score: ' + str(95))`" },
      { mistake: "Confusing / (float division) with // (integer division)", fix: "Use // when you need a whole number result with no decimal." }
    ],
    workedExample: {
      title: "Odd/Even Checker",
      problem: "Ask the user for a number. Print whether it is odd or even.",
      solution: "Use the modulo operator: if number % 2 == 0, it's even; otherwise it's odd.",
      code: `number = int(input("Enter a number: "))

if number % 2 == 0:
    print(number, "is even")
else:
    print(number, "is odd")`
    },
    videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
    quiz: [
      { question: "What does 17 % 5 evaluate to?", options: ["3", "2", "3.4", "85"], correctIndex: 1, explanation: "Modulo gives the remainder of division. 17 ÷ 5 = 3 remainder 2.", hint: "Pseudocode: result ← 17 MOD 5. MOD returns the remainder after integer division.", difficulty: "easy" },
      { question: "What is the result of 10 / 2 in Python?", options: ["5", "5.0", "Integer 5", "Error"], correctIndex: 1, explanation: "The / operator always returns a float in Python 3.", hint: "In Python 3, the / operator always returns a float, even when dividing evenly.", difficulty: "easy" },
      { question: "How do you raise 3 to the power of 4?", options: ["3 ^ 4", "3 * 4", "3 ** 4", "pow(3,4)"], correctIndex: 2, explanation: "** is the exponentiation operator in Python.", hint: "Pseudocode: result ← 3 ^ 4. In Python, the power operator uses double asterisks.", difficulty: "easy" },
      { question: "What will 'Hi' * 3 produce?", options: ["Error", "Hi3", "HiHiHi", "Hi Hi Hi"], correctIndex: 2, explanation: "Multiplying a string by a number repeats it.", hint: "String * integer repeats the string that many times — no spaces added.", difficulty: "medium" },
      { question: "Which operator finds the integer remainder?", options: ["/", "//", "%", "^"], correctIndex: 2, explanation: "% is the modulo (remainder) operator.", hint: "Pseudocode: x MOD y gives the remainder. In Python this is written as x % y.", difficulty: "easy" },
      { question: "What does 15 // 4 evaluate to?", options: ["3", "3.75", "4", "3.0"], correctIndex: 0, explanation: "// is integer (floor) division. 15 ÷ 4 = 3.75, floored to 3.", hint: "Pseudocode: result ← 15 DIV 4. DIV gives the whole number part of division.", difficulty: "medium" },
      { question: "What is the output of: print('Score: ' + str(95))?", options: ["Score: 95", "Error", "Score: str(95)", "Score:95"], correctIndex: 0, explanation: "str(95) converts the integer to a string, allowing concatenation.", hint: "You cannot concatenate a string and integer directly. Use str() to cast first.", difficulty: "medium" },
      { question: "What will print(2 ** 3 + 1) output?", options: ["7", "9", "16", "Error"], correctIndex: 1, explanation: "2 ** 3 = 8, then 8 + 1 = 9. Exponentiation has higher precedence than addition.", hint: "Pseudocode: Step 1: 2^3 = 8, Step 2: 8 + 1 = 9. Power is evaluated before addition (BODMAS).", difficulty: "medium" },
      { question: "Which expression checks if a number is even?", options: ["number / 2 == 0", "number // 2 == 0", "number % 2 == 0", "number ** 2 == 0"], correctIndex: 2, explanation: "number % 2 == 0 checks if the remainder when dividing by 2 is zero.", hint: "Pseudocode: IF number MOD 2 = 0 THEN OUTPUT 'Even'", difficulty: "hard" },
      { question: "What is the result of: len('Hello' + ' ' + 'World')?", options: ["10", "11", "12", "Error"], correctIndex: 1, explanation: "'Hello' + ' ' + 'World' = 'Hello World' which has 11 characters including the space.", hint: "First concatenate: 'Hello World' (5 + 1 + 5 = 11 chars). Then len() counts all characters.", difficulty: "hard" },
      { question: "What does print(10 % 3 + 10 // 3) output?", options: ["4", "5", "6", "3"], correctIndex: 0, explanation: "10 % 3 = 1, 10 // 3 = 3, so 1 + 3 = 4.", hint: "Pseudocode: Step 1: 10 MOD 3 = 1, Step 2: 10 DIV 3 = 3, Step 3: 1 + 3 = 4.", difficulty: "hard" }
    ]
  },

  "selection": {
    topicSlug: "selection",
    explanation: [
      "Selection allows your program to make decisions. It uses 'if', 'elif' (else if), and 'else' statements to run different blocks of code depending on whether a condition is True or False.",
      "Conditions use comparison operators like == (equal to), != (not equal to), > (greater than), < (less than), >= (greater than or equal to), and <= (less than or equal to).",
      "You can combine conditions using 'and', 'or', and 'not'. All code inside a selection block must be consistently indented (4 spaces is standard)."
    ],
    codeExamples: [
      {
        title: "If / Elif / Else",
        code: `score = int(input("Enter test score: "))

if score >= 80:
    print("Grade: Distinction")
elif score >= 60:
    print("Grade: Merit")
elif score >= 40:
    print("Grade: Pass")
else:
    print("Grade: Fail")`,
        description: "The program checks conditions from top to bottom. It runs the first one that is True and skips the rest."
      },
      {
        title: "Logical Operators",
        code: `age = int(input("Age: "))
has_ticket = input("Have a ticket? (yes/no): ")

if age >= 18 and has_ticket == "yes":
    print("Welcome in!")
elif age < 18:
    print("Too young to enter.")
else:
    print("No ticket, no entry!")`,
        description: "Use 'and' to require both conditions to be True."
      }
    ],
    keyPoints: [
      "Always put a colon (:) at the end of if, elif, and else lines.",
      "The code inside the block MUST be indented (usually 4 spaces).",
      "Use == to check equality, not = (which is for assignment).",
      "You can have as many 'elif' statements as you need, but only one 'else'.",
      "Use 'and', 'or', 'not' to combine conditions."
    ],
    commonMistakes: [
      { mistake: "Forgetting the colon: `if age > 18`", fix: "Add a colon: `if age > 18:`" },
      { mistake: "Using single equals: `if password = 'secret':`", fix: "Use double equals for comparison: `if password == 'secret':`" }
    ],
    workedExample: {
      title: "Password Checker",
      problem: "Ask the user for a password. If it is 'python123', print 'Access Granted'. Otherwise, print 'Access Denied'.",
      solution: "Use an if/else statement with the == operator.",
      code: `pwd = input("Enter password: ")

if pwd == "python123":
    print("Access Granted")
else:
    print("Access Denied")`
    },
    videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
    quiz: [
      { question: "What symbol is used to check if two things are equal?", options: ["=", "==", "===", "!="], correctIndex: 1, explanation: "== checks equality. A single = assigns a value to a variable.", hint: "Pseudocode: IF x = y THEN... In Python, comparison uses == (double equals).", difficulty: "easy" },
      { question: "What is missing from this line: if score > 50", options: ["Then", "Brackets", "A colon (:)", "A semicolon (;)"], correctIndex: 2, explanation: "All selection statements in Python must end with a colon.", hint: "Pseudocode uses THEN, but Python uses a different symbol at the end of the line.", difficulty: "easy" },
      { question: "What does 'elif' stand for?", options: ["Else If", "End If", "Either If", "Equal If"], correctIndex: 0, explanation: "elif is short for 'else if'.", hint: "Pseudocode: ELSE IF condition THEN... Python shortens this to one keyword.", difficulty: "easy" },
      { question: "How does Python know which code belongs inside an if statement?", options: ["Curly brackets {}", "End if", "Indentation", "Semicolons"], correctIndex: 2, explanation: "Python uses indentation (spacing at the start of the line) to group blocks of code.", hint: "Unlike pseudocode which uses ENDIF, Python uses whitespace to define code blocks.", difficulty: "medium" },
      { question: "Which operator means 'Not Equal To'?", options: ["<>", "!==", "not=", "!="], correctIndex: 3, explanation: "!= means not equal to in Python.", hint: "Pseudocode: IF x ≠ y or IF x != y. Python uses != for 'not equal to'.", difficulty: "easy" },
      { question: "What is the output when score = 75?\nif score >= 80:\n    print('A')\nelif score >= 60:\n    print('B')\nelse:\n    print('C')", options: ["A", "B", "C", "A and B"], correctIndex: 1, explanation: "75 is not >= 80, so skip first block. 75 >= 60 is True, so 'B' prints. Python stops checking after the first true condition.", hint: "Pseudocode: IF score >= 80 THEN OUTPUT 'A' ELSE IF score >= 60 THEN OUTPUT 'B' ELSE OUTPUT 'C' ENDIF. Trace: 75 >= 80? No. 75 >= 60? Yes → B.", difficulty: "medium" },
      { question: "What does this output?\nx = 10\nif x > 5 and x < 15:\n    print('In range')\nelse:\n    print('Out of range')", options: ["In range", "Out of range", "Error", "Nothing"], correctIndex: 0, explanation: "x > 5 is True AND x < 15 is True. Both conditions are True, so 'In range' prints.", hint: "Pseudocode: IF x > 5 AND x < 15 THEN OUTPUT 'In range'. Trace: 10 > 5? Yes. 10 < 15? Yes. Both True → 'In range'.", difficulty: "medium" },
      { question: "How many elif statements can you have in a single if block?", options: ["Only 1", "Only 2", "As many as you need", "None — they don't exist"], correctIndex: 2, explanation: "You can have unlimited elif statements between if and else.", hint: "Pseudocode: You can have as many ELSE IF branches as needed before the final ELSE.", difficulty: "medium" },
      { question: "What happens if no condition is True and there is no else block?", options: ["Error", "Nothing happens — the code is skipped", "The last elif runs", "Python asks the user"], correctIndex: 1, explanation: "If no condition matches and there's no else, Python simply skips the entire block.", hint: "Pseudocode: IF condition THEN ... ENDIF — if condition is False, nothing executes.", difficulty: "hard" },
      { question: "What is wrong with: if age = 18: print('Adult')", options: ["Missing brackets", "= should be ==", "Missing indentation and = should be ==", "Nothing is wrong"], correctIndex: 2, explanation: "Two errors: = should be == for comparison, and print should be on an indented new line.", hint: "Pseudocode: IF age = 18 THEN \\n    OUTPUT 'Adult'. In Python: use ==, colon, and indentation.", difficulty: "hard" },
      { question: "What does NOT True evaluate to in Python?", options: ["True", "False", "None", "Error"], correctIndex: 1, explanation: "The NOT operator flips True to False and False to True.", hint: "Pseudocode: NOT TRUE = FALSE. The NOT operator inverts a Boolean value.", difficulty: "hard" }
    ]
  },

  "iteration": {
    topicSlug: "iteration",
    explanation: [
      "Iteration (looping) lets you repeat a block of code without writing it out multiple times. Python has two main loops: 'for' loops and 'while' loops.",
      "A 'for' loop iterates over a sequence a fixed number of times. Use range() to generate a sequence of numbers: range(5) gives 0,1,2,3,4.",
      "A 'while' loop keeps running as long as a condition remains True. Be careful — if the condition never becomes False, the loop runs forever (an infinite loop)!"
    ],
    codeExamples: [
      {
        title: "For Loop with range()",
        code: `# Count from 1 to 5
for i in range(1, 6):
    print(i)

# range(start, stop, step)
for i in range(0, 20, 5):
    print(i)  # 0, 5, 10, 15`,
        description: "range(start, stop) - stop is exclusive. range(5) goes from 0 to 4."
      },
      {
        title: "While Loop",
        code: `password = ""
while password != "secret":
    password = input("Enter password: ")

print("Access granted!")`,
        description: "The while loop keeps asking until the user types the correct password."
      },
      {
        title: "Iterating over a List",
        code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like", fruit)`,
        description: "For loops can iterate directly over a list, without needing range()."
      }
    ],
    keyPoints: [
      "for loops iterate a known number of times. while loops iterate until a condition is False.",
      "range(stop) — goes 0 to stop-1. range(start, stop, step) gives more control.",
      "Use 'break' to exit a loop early. Use 'continue' to skip to the next iteration.",
      "Always make sure your while loop has a way to end!"
    ],
    commonMistakes: [
      { mistake: "Using range(1, 5) when you want 1 to 5 inclusive", fix: "Use range(1, 6) — the stop value is exclusive." },
      { mistake: "Forgetting to update the variable in a while loop (creates infinite loop)", fix: "Ensure the loop condition can eventually become False." }
    ],
    workedExample: {
      title: "Times Table Generator",
      problem: "Ask the user for a number. Print its times table from 1 to 12.",
      solution: "Use a for loop with range(1, 13) and multiply the loop variable by the user's number.",
      code: `number = int(input("Which times table? "))

for i in range(1, 13):
    result = number * i
    print(f"{number} x {i} = {result}")`
    },
    videoUrl: "https://www.youtube.com/embed/6iF8Xb7Z3wQ",
    quiz: [
      { question: "How many times will range(5) loop?", options: ["4", "5", "6", "0"], correctIndex: 1, explanation: "range(5) generates 0,1,2,3,4 — that's 5 values.", hint: "Pseudocode: FOR i ← 0 TO 4. range(5) starts at 0 and goes up to but NOT including 5.", difficulty: "easy" },
      { question: "What type of loop runs as long as a condition is True?", options: ["for loop", "while loop", "repeat loop", "do loop"], correctIndex: 1, explanation: "While loops continue as long as their condition evaluates to True.", hint: "Pseudocode: WHILE condition DO ... ENDWHILE. This type checks a condition before each iteration.", difficulty: "easy" },
      { question: "What does range(2, 10, 2) generate?", options: ["2,4,6,8,10", "2,4,6,8", "0,2,4,6,8", "2,3,4,5,6,7,8,9,10"], correctIndex: 1, explanation: "range(2, 10, 2) starts at 2, stops before 10, stepping by 2: 2,4,6,8.", hint: "Pseudocode: FOR i ← 2 TO 9 STEP 2. The stop value (10) is exclusive.", difficulty: "medium" },
      { question: "Which keyword exits a loop immediately?", options: ["stop", "exit", "break", "end"], correctIndex: 2, explanation: "break immediately terminates the current loop.", hint: "When you need to leave a loop early (e.g., found what you're looking for), use this keyword.", difficulty: "easy" },
      { question: "What will happen if a while loop condition never becomes False?", options: ["The program crashes", "An infinite loop occurs", "The loop runs once", "A syntax error occurs"], correctIndex: 1, explanation: "An infinite loop runs forever until the program is force-stopped.", hint: "Pseudocode: WHILE TRUE DO ... ENDWHILE — this never ends because the condition is always True.", difficulty: "medium" },
      { question: "What is the output of:\nfor i in range(3):\n    print(i, end=' ')", options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"], correctIndex: 1, explanation: "range(3) generates 0, 1, 2. The end=' ' prints them on one line separated by spaces.", hint: "Pseudocode: FOR i ← 0 TO 2\n    OUTPUT i\nNEXT i\nTrace: i=0, i=1, i=2", difficulty: "medium" },
      { question: "What does 'continue' do in a loop?", options: ["Exits the loop", "Skips the rest of the current iteration", "Pauses the loop", "Restarts the loop from the beginning"], correctIndex: 1, explanation: "continue skips the remaining code in the current iteration and moves to the next one.", hint: "Unlike break (which exits), this keyword skips to the next iteration.", difficulty: "medium" },
      { question: "How would you loop through items in a list called 'names'?", options: ["for i in range(names):", "for name in names:", "while names:", "loop names:"], correctIndex: 1, explanation: "for name in names: iterates through each item in the list directly.", hint: "Pseudocode: FOR EACH name IN names\n    OUTPUT name\nNEXT name", difficulty: "easy" },
      { question: "What is the output of:\ntotal = 0\nfor i in range(1, 6):\n    total += i\nprint(total)", options: ["10", "15", "21", "6"], correctIndex: 1, explanation: "1+2+3+4+5 = 15. range(1,6) gives 1,2,3,4,5.", hint: "Pseudocode: total ← 0\nFOR i ← 1 TO 5\n    total ← total + i\nNEXT i\nTrace: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15", difficulty: "hard" },
      { question: "Which loop would you use when you don't know how many times to repeat?", options: ["for loop", "while loop", "Both work equally", "Neither"], correctIndex: 1, explanation: "While loops are condition-controlled — ideal when you don't know the number of iterations in advance.", hint: "Pseudocode: WHILE NOT finished DO ... ENDWHILE — used when repetition depends on user input or a changing condition.", difficulty: "hard" },
      { question: "What is wrong with:\nwhile True\n    print('Hello')", options: ["Nothing", "Missing colon after True", "True should be true", "while doesn't accept True"], correctIndex: 1, explanation: "The while statement needs a colon at the end: while True:", hint: "All Python compound statements (if, while, for, def) must end with a colon (:).", difficulty: "hard" }
    ]
  },

  "lists-tuples-dicts": {
    topicSlug: "lists-tuples-dicts",
    explanation: [
      "Data structures allow you to store multiple items in a single variable. Python has three key ones for GCSE: Lists, Tuples, and Dictionaries.",
      "Lists [] are ordered and changeable (mutable). Tuples () are ordered but unchangeable (immutable) — useful for data that shouldn't change. Dictionaries {} store pairs of data: a 'key' and a 'value'.",
      "Lists are zero-indexed: the first item is at position [0], the second at [1], and so on. Negative indexes count from the end: [-1] is the last item."
    ],
    codeExamples: [
      {
        title: "Lists",
        code: `fruits = ["Apple", "Banana", "Cherry"]
print(fruits[0])        # Apple (first item)
print(fruits[-1])       # Cherry (last item)

fruits.append("Orange") # Add to end
fruits.remove("Banana") # Remove by value
fruits.sort()           # Sort alphabetically

print(len(fruits))      # 3`,
        description: "Lists use square brackets and are zero-indexed."
      },
      {
        title: "Dictionaries",
        code: `student = {"name": "Alex", "age": 15, "grade": "A"}

print(student["name"])   # Alex
student["age"] = 16      # Update value
student["school"] = "GCSE Academy"  # Add new key

for key, value in student.items():
    print(key, ":", value)`,
        description: "Dictionaries use curly braces and key-value pairs. Access by key, not position."
      }
    ],
    keyPoints: [
      "Lists use square brackets [], Tuples use round brackets (), Dictionaries use curly brackets {}.",
      "Counting in lists/tuples starts from 0 (zero-indexed).",
      "Lists are mutable (changeable). Tuples are immutable (cannot be changed after creation).",
      "Dictionaries have keys and values. Keys must be unique.",
      "Common list methods: append(), remove(), sort(), pop(), len()."
    ],
    commonMistakes: [
      { mistake: "Trying to get the first item with list[1]", fix: "Use list[0] as Python starts counting at 0." },
      { mistake: "Trying to change a tuple value", fix: "If you need to change data, use a List instead of a Tuple." }
    ],
    workedExample: {
      title: "High Score Tracker",
      problem: "Create a list of 3 scores. Add a new score of 95, then print the highest score.",
      solution: "Create a list, use append() to add the new score, and max() to find the highest.",
      code: `scores = [45, 82, 67]
scores.append(95)
highest = max(scores)
print("Highest score is:", highest)
print("All scores:", scores)`
    },
    videoUrl: "https://www.youtube.com/embed/9OeznAkyQz4",
    quiz: [
      { question: "Which brackets are used to create a List?", options: ["()", "{}", "[]", "<>"], correctIndex: 2, explanation: "Lists use square brackets [].", hint: "Pseudocode: array myList[5]. In Python, lists use square brackets.", difficulty: "easy" },
      { question: "If names = ['Ali', 'Bob', 'Charlie'], what is names[1]?", options: ["Ali", "Bob", "Charlie", "Error"], correctIndex: 1, explanation: "Lists are zero-indexed, so names[0] is Ali, and names[1] is Bob.", hint: "Pseudocode: names[0] = 'Ali', names[1] = ?. Remember zero-indexing!", difficulty: "easy" },
      { question: "What is the main difference between a List and a Tuple?", options: ["Tuples hold numbers, Lists hold strings", "Tuples cannot be changed after creation", "Lists are faster", "Tuples use square brackets"], correctIndex: 1, explanation: "Tuples are immutable, meaning they cannot be modified once created.", hint: "One is mutable (changeable), the other is immutable (fixed). Which is which?", difficulty: "easy" },
      { question: "In a dictionary, data is stored in pairs. What are these called?", options: ["Item-Value", "Key-Value", "Name-Data", "Index-Value"], correctIndex: 1, explanation: "Dictionaries store data in Key-Value pairs.", hint: "Think of a real dictionary: the word is the ___, the definition is the ___.", difficulty: "medium" },
      { question: "How do you add a new item to the end of a list?", options: ["list.add()", "list.insert()", "list.append()", "list.push()"], correctIndex: 2, explanation: "The append() method adds an item to the end of a list.", hint: "Pseudocode: myList.append(newItem). The method name means 'add to the end'.", difficulty: "easy" },
      { question: "What does names[-1] return if names = ['Ali', 'Bob', 'Charlie']?", options: ["Ali", "Bob", "Charlie", "Error"], correctIndex: 2, explanation: "Negative indexing counts from the end. -1 is the last item.", hint: "Negative indexes wrap around: -1 = last, -2 = second last, etc.", difficulty: "medium" },
      { question: "What does len(['a', 'b', 'c', 'd']) return?", options: ["3", "4", "5", "Error"], correctIndex: 1, explanation: "len() returns the number of items in the list, which is 4.", hint: "Pseudocode: LENGTH(myList). Count the items in the list.", difficulty: "medium" },
      { question: "How do you access a dictionary value for key 'name'?", options: ["dict.name", "dict('name')", "dict['name']", "dict{name}"], correctIndex: 2, explanation: "Use square bracket notation with the key: dict['name'].", hint: "Pseudocode: value ← dict['key']. Access uses square brackets with the key string.", difficulty: "medium" },
      { question: "What happens if you try to change an item in a tuple?", options: ["It works normally", "TypeError is raised", "The tuple becomes a list", "Nothing happens"], correctIndex: 1, explanation: "Tuples are immutable — attempting to modify raises a TypeError.", hint: "Tuples are immutable. Any attempt to modify them causes an error.", difficulty: "hard" },
      { question: "What does scores.pop() do to a list?", options: ["Removes the first item", "Removes and returns the last item", "Deletes the entire list", "Sorts the list"], correctIndex: 1, explanation: "pop() removes and returns the last item. pop(i) removes at index i.", hint: "Pseudocode: item ← myList.pop(). Removes from the end and returns the removed item.", difficulty: "hard" }
    ]
  },

  "functions-scope": {
    topicSlug: "functions-scope",
    explanation: [
      "Functions let you group code into reusable blocks with a name. Instead of writing the same code multiple times, you define it once and call it whenever you need it. This makes programs easier to read and maintain.",
      "Functions are defined with the 'def' keyword. They can accept 'parameters' (inputs) and 'return' a value back. Parameters act like local variables inside the function.",
      "Scope refers to where a variable is accessible. Variables created inside a function (local scope) cannot be accessed outside it. Variables created outside (global scope) can be read inside functions, but to modify them you need the 'global' keyword."
    ],
    codeExamples: [
      {
        title: "Defining and Calling Functions",
        code: `def greet(name):
    message = "Hello, " + name + "!"
    return message

result = greet("Alex")
print(result)

# Functions with default parameters
def power(base, exponent=2):
    return base ** exponent

print(power(4))     # 16 (uses default exponent=2)
print(power(2, 8))  # 256`,
        description: "Use return to send a value back from a function."
      },
      {
        title: "Scope Example",
        code: `total = 0  # Global variable

def add_points(points):
    global total
    total = total + points

add_points(10)
add_points(25)
print("Total:", total)  # Total: 35`,
        description: "Use 'global' keyword to modify a global variable inside a function."
      }
    ],
    keyPoints: [
      "Define functions with 'def function_name(parameters):'.",
      "Call a function by writing its name followed by parentheses: function_name().",
      "Use 'return' to send a value back from a function.",
      "Local variables only exist inside the function they are created in.",
      "Functions should do one thing and do it well (Single Responsibility)."
    ],
    commonMistakes: [
      { mistake: "Calling a function before defining it", fix: "Define the function first (before calling it in the code)." },
      { mistake: "Forgetting to use the return value: `add(5, 3)` without storing result", fix: "Store or use the result: `result = add(5, 3)` or `print(add(5, 3))`." }
    ],
    workedExample: {
      title: "Area Calculator",
      problem: "Write a function called area_of_rectangle that takes width and height as parameters and returns the area. Call it with different values.",
      solution: "Define a function with two parameters, multiply them, and return the result.",
      code: `def area_of_rectangle(width, height):
    area = width * height
    return area

r1 = area_of_rectangle(5, 3)
r2 = area_of_rectangle(10, 7)

print("Room 1 area:", r1, "m²")
print("Room 2 area:", r2, "m²")`
    },
    videoUrl: "https://www.youtube.com/embed/9Os0o3wzS_I",
    quiz: [
      { question: "Which keyword is used to define a function?", options: ["function", "define", "def", "func"], correctIndex: 2, explanation: "In Python, functions are defined using the 'def' keyword.", hint: "Pseudocode: FUNCTION greet(name). In Python the keyword is shorter — just 3 letters.", difficulty: "easy" },
      { question: "What does the 'return' statement do?", options: ["Prints a value", "Sends a value back from the function", "Ends the program", "Creates a new variable"], correctIndex: 1, explanation: "return exits the function and sends a value back to where it was called.", hint: "Pseudocode: RETURN result. This sends a value back to the caller.", difficulty: "easy" },
      { question: "A variable created inside a function has:", options: ["Global scope", "Local scope", "No scope", "Module scope"], correctIndex: 1, explanation: "Variables defined inside a function are local — they only exist within that function.", hint: "Variables created inside a function are destroyed when the function ends.", difficulty: "medium" },
      { question: "What is it called when you execute/run a function?", options: ["Defining", "Returning", "Calling", "Declaring"], correctIndex: 2, explanation: "You 'call' a function by writing its name with parentheses.", hint: "Pseudocode: result ← greet('Alex'). Using a function is called ___ it.", difficulty: "easy" },
      { question: "What is a function parameter?", options: ["The return value", "A variable inside a function that receives a passed value", "The function's name", "A global variable"], correctIndex: 1, explanation: "Parameters are the variables listed in the function definition that receive the arguments passed to it.", hint: "Pseudocode: FUNCTION area(width, height) — width and height are the ___.", difficulty: "medium" },
      { question: "What is the output of:\ndef double(x):\n    return x * 2\nprint(double(7))", options: ["7", "14", "x * 2", "Error"], correctIndex: 1, explanation: "double(7) passes 7 as x, returns 7 * 2 = 14.", hint: "Pseudocode: FUNCTION double(x)\n    RETURN x * 2\nENDFUNCTION\nTrace: double(7) → 7 * 2 = 14", difficulty: "medium" },
      { question: "What happens if a function doesn't have a return statement?", options: ["Error", "Returns None", "Returns 0", "Returns an empty string"], correctIndex: 1, explanation: "Functions without a return statement implicitly return None.", hint: "In Python, if you don't explicitly return something, the function returns a special value meaning 'nothing'.", difficulty: "hard" },
      { question: "Can you call a function from inside another function?", options: ["No, never", "Yes, this is common", "Only with global keyword", "Only in classes"], correctIndex: 1, explanation: "Functions can call other functions — this is a fundamental part of programming.", hint: "Pseudocode: FUNCTION main()\n    result ← helper(5)\nENDFUNCTION. Functions calling other functions is very common.", difficulty: "medium" },
      { question: "What is the difference between arguments and parameters?", options: ["They are the same thing", "Parameters are in the definition, arguments are in the call", "Arguments are in the definition, parameters are in the call", "Parameters are only for while loops"], correctIndex: 1, explanation: "Parameters are in the function definition. Arguments are the actual values passed when calling.", hint: "def greet(name): ← 'name' is a parameter\ngreet('Alex') ← 'Alex' is an argument", difficulty: "hard" }
    ]
  },

  "string-manipulation": {
    topicSlug: "string-manipulation",
    explanation: [
      "Strings are sequences of characters. Python has a rich set of built-in methods to work with them. You can access individual characters using indexing (like a list), and extract parts of a string using slicing.",
      "String methods like upper(), lower(), strip(), split(), replace(), and find() are all commonly used in GCSE exam questions. Crucially, strings are immutable — methods return new strings, they don't change the original.",
      "String formatting with f-strings (f'Hello {name}') is the most modern and readable way to build strings containing variable values."
    ],
    codeExamples: [
      {
        title: "Common String Methods",
        code: `text = "  Hello, World!  "

print(text.upper())           # '  HELLO, WORLD!  '
print(text.lower())           # '  hello, world!  '
print(text.strip())           # 'Hello, World!' (removes spaces)
print(text.replace("World", "Python"))  # '  Hello, Python!  '
print(text.find("World"))     # 9 (index where it starts)
print(len(text))              # 18`,
        description: "String methods always return a NEW string — the original is not changed."
      },
      {
        title: "Slicing and Indexing",
        code: `s = "Python"
print(s[0])      # P (first character)
print(s[-1])     # n (last character)
print(s[0:3])    # Pyt (indices 0, 1, 2)
print(s[2:])     # thon (from index 2 to end)
print(s[::-1])   # nohtyP (reversed!)

# Split and Join
csv = "Alice,Bob,Charlie"
names = csv.split(",")      # ['Alice', 'Bob', 'Charlie']
rejoined = " & ".join(names) # 'Alice & Bob & Charlie'`,
        description: "Slicing: string[start:stop:step]. Any part can be omitted."
      }
    ],
    keyPoints: [
      "Strings are immutable — methods return new strings.",
      "Indexing starts at 0. Use negative indexes to count from the end.",
      "Slicing: string[start:stop] — stop is exclusive.",
      "split() breaks a string into a list. join() does the reverse.",
      "strip() removes leading/trailing whitespace. Useful for cleaning user input."
    ],
    commonMistakes: [
      { mistake: "Expecting `text.upper()` to change `text` itself", fix: "Reassign: `text = text.upper()` or use the result directly." },
      { mistake: "Off-by-one in slicing: s[1:5] when you want characters at positions 1-5", fix: "Remember the stop index is exclusive: s[1:6] gives positions 1,2,3,4,5." }
    ],
    workedExample: {
      title: "Username Generator",
      problem: "Ask for the user's first and last name. Create a username that is their first name initial + last name in lowercase, with no spaces.",
      solution: "Take the first character of first name, concatenate with lowercase last name.",
      code: `first = input("First name: ")
last = input("Last name: ")

username = first[0].lower() + last.lower()
print("Your username is:", username)`
    },
    videoUrl: "https://www.youtube.com/embed/k9TUPpGqYTo",
    quiz: [
      { question: "What does 'Python'[2:5] return?", options: ["Pyt", "tho", "thon", "Pyth"], correctIndex: 1, explanation: "Slicing is exclusive of the stop index. Index 2='t', 3='h', 4='o'.", hint: "Pseudocode: substring ← text[2:5]. Start at index 2, stop BEFORE index 5. Trace: P(0) y(1) t(2) h(3) o(4) n(5).", difficulty: "medium" },
      { question: "Which method removes whitespace from both ends of a string?", options: ["trim()", "clean()", "strip()", "remove()"], correctIndex: 2, explanation: "strip() removes leading and trailing whitespace characters.", hint: "This method 'strips' unwanted spaces from both ends of user input.", difficulty: "easy" },
      { question: "What does 'hello'.upper() return?", options: ["Hello", "HELLO", "hello", "hELLO"], correctIndex: 1, explanation: "upper() converts all characters to uppercase.", hint: "Pseudocode: result ← text.upper(). Converts every letter to UPPERCASE.", difficulty: "easy" },
      { question: "What is the result of 'a,b,c'.split(',')?", options: ["'a b c'", "['a', 'b', 'c']", "('a', 'b', 'c')", "Error"], correctIndex: 1, explanation: "split() divides a string at a delimiter and returns a list.", hint: "Pseudocode: parts ← text.split(','). Splits at each comma into a list of strings.", difficulty: "medium" },
      { question: "Are Python strings mutable (changeable)?", options: ["Yes, always", "No, they are immutable", "Only if created with single quotes", "Only if assigned to a variable"], correctIndex: 1, explanation: "Strings are immutable. String methods return new strings — the original cannot be changed in place.", hint: "Immutable means once created, it cannot be modified. String methods return NEW strings.", difficulty: "easy" },
      { question: "What does 'Python'[::-1] return?", options: ["Python", "nohtyP", "Pytho", "Error"], correctIndex: 1, explanation: "[::-1] reverses the string by stepping backwards.", hint: "Pseudocode: reversed ← REVERSE(text). The slice [::-1] steps through the string backwards.", difficulty: "medium" },
      { question: "What does 'hello world'.find('world') return?", options: ["1", "5", "6", "True"], correctIndex: 2, explanation: "find() returns the starting index where the substring is found. 'world' starts at index 6.", hint: "Pseudocode: pos ← text.find('world'). Counts characters: h(0) e(1) l(2) l(3) o(4) (5) w(6).", difficulty: "medium" },
      { question: "What does ' '.join(['a', 'b', 'c']) produce?", options: ["abc", "a b c", "a, b, c", "['a', 'b', 'c']"], correctIndex: 1, explanation: "join() connects list items with the separator string — here a space.", hint: "Pseudocode: result ← JOIN(list, ' '). The separator goes between each list item.", difficulty: "hard" },
      { question: "What is the output of:\nword = 'Python'\nprint(word[0] + word[-1])", options: ["Py", "Pn", "yn", "on"], correctIndex: 1, explanation: "word[0] = 'P' (first char), word[-1] = 'n' (last char). P + n = 'Pn'.", hint: "Pseudocode: first ← word[0], last ← word[-1]. Trace: P(0) y(1) t(2) h(3) o(4) n(5). word[-1] = n.", difficulty: "hard" },
      { question: "What does 'Hello'.replace('l', 'r') return?", options: ["Herro", "Herlo", "Hello", "Herr"], correctIndex: 0, explanation: "replace() replaces ALL occurrences. Both 'l's become 'r': 'Herro'.", hint: "Pseudocode: result ← REPLACE(text, 'l', 'r'). Replaces ALL matching characters, not just the first.", difficulty: "hard" }
    ]
  },

  "file-handling": {
    topicSlug: "file-handling",
    explanation: [
      "File handling allows your program to read data from files and write data to files. This is essential for creating programs that can store information permanently — beyond the program's runtime.",
      "Python uses the open() function to open files. You specify the filename and the mode: 'r' for read, 'w' for write (overwrites existing), and 'a' for append (adds to end). Always close files when you're done, or better yet, use the 'with' statement which closes them automatically.",
      "For GCSE, you need to know how to read all content from a file, read it line by line, write to a file, and append to an existing file."
    ],
    codeExamples: [
      {
        title: "Reading Files",
        code: `# Read entire file content
with open("data.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())  # strip removes the newline character`,
        description: "The 'with' statement automatically closes the file when the block ends."
      },
      {
        title: "Writing and Appending",
        code: `# Write to a file (overwrites if exists)
with open("scores.txt", "w") as f:
    f.write("Alex: 95\n")
    f.write("Jordan: 87\n")

# Append to existing file
with open("scores.txt", "a") as f:
    f.write("Sam: 78\n")`,
        description: "'w' overwrites the file. 'a' adds to the end without destroying existing content."
      }
    ],
    keyPoints: [
      "open(filename, mode) — modes: 'r' (read), 'w' (write, overwrites), 'a' (append).",
      "Always use 'with open(...) as f:' — it automatically closes the file.",
      "read() gets the whole file as a string. readlines() gets a list of lines.",
      "write() writes a string to the file. Use '\\n' for newlines.",
      "Files must exist before you can read them (otherwise FileNotFoundError)."
    ],
    commonMistakes: [
      { mistake: "Not using 'with', then forgetting to close the file", fix: "Always use 'with open(...) as f:' which handles closing automatically." },
      { mistake: "Writing an integer to a file: f.write(score)", fix: "Convert to string first: f.write(str(score))" }
    ],
    workedExample: {
      title: "Student Score Logger",
      problem: "Ask the user for their name and score. Save it to a file called 'results.txt'. Then read and display all scores.",
      solution: "Use 'a' mode to append the score, then 'r' mode to read and display all results.",
      code: `name = input("Name: ")
score = input("Score: ")

with open("results.txt", "a") as f:
    f.write(name + ": " + score + "\n")

print("All results:")
with open("results.txt", "r") as f:
    for line in f:
        print(line.strip())`
    },
    videoUrl: "https://www.youtube.com/embed/Uh2ebFW8OYM",
    quiz: [
      { question: "Which mode opens a file for writing and overwrites any existing content?", options: ["r", "a", "w", "x"], correctIndex: 2, explanation: "'w' (write) mode creates a new file or overwrites an existing one." },
      { question: "What does the 'a' mode do when opening a file?", options: ["Reads the file", "Overwrites the file", "Appends to the end", "Deletes the file"], correctIndex: 2, explanation: "'a' (append) mode adds content to the end of an existing file." },
      { question: "Why should you use 'with open(...) as f:'?", options: ["It runs faster", "It automatically closes the file", "It is the only way to open files", "It encrypts the file"], correctIndex: 1, explanation: "The 'with' statement ensures the file is closed properly when the block finishes." },
      { question: "What error occurs if you try to read a file that doesn't exist?", options: ["TypeError", "NameError", "FileNotFoundError", "IOError"], correctIndex: 2, explanation: "Python raises a FileNotFoundError if the file doesn't exist when opening in 'r' mode." },
      { question: "What method reads the entire file content as a single string?", options: ["readline()", "readlines()", "read()", "readall()"], correctIndex: 2, explanation: "read() returns the entire file content as a single string." }
    ]
  },

  "error-handling": {
    topicSlug: "error-handling",
    explanation: [
      "Errors (also called exceptions) happen when something goes wrong at runtime — like dividing by zero, or trying to convert a non-numeric string to an integer. Without error handling, your program crashes with an error message.",
      "Python uses try/except blocks to handle errors gracefully. Code that might fail goes in the 'try' block. If an error occurs, Python jumps to the 'except' block instead of crashing.",
      "You can handle specific error types (like ValueError, ZeroDivisionError) separately, or use a general except to catch anything. The 'finally' block runs regardless of whether an error occurred — useful for cleanup code."
    ],
    codeExamples: [
      {
        title: "Basic Try/Except",
        code: `try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print("100 /", number, "=", result)
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")`,
        description: "Separate except blocks handle different error types."
      },
      {
        title: "Finally Block",
        code: `try:
    with open("data.txt", "r") as f:
        content = f.read()
    print(content)
except FileNotFoundError:
    print("File not found! Creating a new one.")
    with open("data.txt", "w") as f:
        f.write("New file created.\n")
finally:
    print("File operation complete.")`,
        description: "The 'finally' block always runs, whether an error occurred or not."
      }
    ],
    keyPoints: [
      "try: contains code that might raise an error.",
      "except: handles the error if one occurs.",
      "You can handle specific exceptions: ValueError, ZeroDivisionError, FileNotFoundError, TypeError.",
      "finally: runs no matter what (good for cleanup).",
      "Without error handling, an unhandled exception crashes the program."
    ],
    commonMistakes: [
      { mistake: "Catching all exceptions with a bare `except:` and hiding the error", fix: "Catch specific exceptions, or at least print the error: `except Exception as e: print(e)`" },
      { mistake: "Putting too much code in the try block", fix: "Only put the risky operation in try. Handle all other logic outside." }
    ],
    workedExample: {
      title: "Safe Division Calculator",
      problem: "Ask the user for two numbers and divide the first by the second. Handle both invalid input and division by zero.",
      solution: "Wrap the input conversion and division in a try block. Handle ValueError and ZeroDivisionError separately.",
      code: `try:
    a = float(input("First number: "))
    b = float(input("Second number: "))
    result = a / b
    print(f"{a} / {b} = {result}")
except ValueError:
    print("Please enter valid numbers.")
except ZeroDivisionError:
    print("Error: Cannot divide by zero.")`
    },
    videoUrl: "https://www.youtube.com/embed/NIWwJbo-9_8",
    quiz: [
      { question: "What keyword begins an error-handling block?", options: ["catch", "except", "try", "handle"], correctIndex: 2, explanation: "The 'try' keyword starts the block of code that might raise an exception." },
      { question: "What exception occurs when dividing by zero?", options: ["ValueError", "ZeroDivisionError", "ArithmeticError", "MathError"], correctIndex: 1, explanation: "Python raises ZeroDivisionError when you try to divide by zero." },
      { question: "Which block of code always runs, error or not?", options: ["else", "except", "finally", "always"], correctIndex: 2, explanation: "The 'finally' block executes regardless of whether an exception was raised." },
      { question: "What error occurs if you try to convert 'hello' to an integer?", options: ["NameError", "TypeError", "ValueError", "InputError"], correctIndex: 2, explanation: "ValueError is raised when a conversion fails due to inappropriate value." },
      { question: "What is the purpose of error handling?", options: ["To make programs slower", "To prevent programs from crashing when errors occur", "To cause errors on purpose", "To delete the file"], correctIndex: 1, explanation: "Error handling allows programs to respond gracefully to unexpected situations instead of crashing." }
    ]
  },

  "oop": {
    topicSlug: "oop",
    explanation: [
      "Object-Oriented Programming (OOP) is a way of designing programs using 'objects'. An object is a collection of related data (attributes) and actions (methods). A 'class' is like a blueprint for creating objects.",
      "To create a class, use the 'class' keyword. The special __init__ method is the constructor — it runs automatically when you create a new object, setting up its initial attributes. 'self' refers to the current object.",
      "For GCSE, you need to understand: classes, objects, attributes (instance variables), methods, and the concept of encapsulation (keeping data and related functions together)."
    ],
    codeExamples: [
      {
        title: "Defining a Class",
        code: `class Dog:
    def __init__(self, name, breed, age):
        self.name = name      # attribute
        self.breed = breed
        self.age = age

    def bark(self):            # method
        print(self.name + " says: Woof!")

    def describe(self):
        print(f"{self.name} is a {self.breed}, aged {self.age}.")

# Create objects (instances)
dog1 = Dog("Rex", "Labrador", 3)
dog2 = Dog("Bella", "Poodle", 5)

dog1.bark()        # Rex says: Woof!
dog2.describe()    # Bella is a Poodle, aged 5.`,
        description: "A class is a blueprint. Objects are created (instantiated) from the class."
      }
    ],
    keyPoints: [
      "A class is a blueprint. An object is an instance of that class.",
      "__init__ is the constructor method — it runs when the object is created.",
      "self refers to the current object and must be the first parameter of every method.",
      "Attributes store the object's data. Methods define the object's behaviour.",
      "Encapsulation: bundling data and methods together in a class."
    ],
    commonMistakes: [
      { mistake: "Forgetting 'self' in method parameters: `def bark():` instead of `def bark(self):`", fix: "Always include self as the first parameter: `def bark(self):`" },
      { mistake: "Not using `self.` when accessing attributes: `name` instead of `self.name`", fix: "Always use `self.attribute_name` to access instance attributes." }
    ],
    workedExample: {
      title: "Bank Account Class",
      problem: "Create a BankAccount class with a balance attribute and deposit/withdraw methods.",
      solution: "Define __init__ to set up initial balance, and methods that update the balance.",
      code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited £{amount}. Balance: £{self.balance}")

    def withdraw(self, amount):
        if amount <= self.balance:
            self.balance -= amount
            print(f"Withdrew £{amount}. Balance: £{self.balance}")
        else:
            print("Insufficient funds!")

account = BankAccount("Alice", 100)
account.deposit(50)
account.withdraw(30)`
    },
    videoUrl: "https://www.youtube.com/embed/JeznW_7DlB0",
    quiz: [
      { question: "What is a class in Python?", options: ["A variable that holds numbers", "A blueprint for creating objects", "A type of loop", "A file that stores code"], correctIndex: 1, explanation: "A class is a blueprint/template used to create objects with shared structure and behaviour." },
      { question: "What does the __init__ method do?", options: ["Destroys the object", "Is the constructor and sets up the object's initial state", "Prints the object", "Imports a module"], correctIndex: 1, explanation: "__init__ is called automatically when a new object is created." },
      { question: "What does 'self' refer to in a class method?", options: ["The class itself", "The current instance (object)", "The parent class", "A global variable"], correctIndex: 1, explanation: "self refers to the specific instance of the class that the method is being called on." },
      { question: "What is an instance (object)?", options: ["The class definition", "A specific object created from a class", "A method inside a class", "A type of variable"], correctIndex: 1, explanation: "An instance is a specific object created using the class as a blueprint." },
      { question: "Which term describes bundling data and methods together in a class?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], correctIndex: 2, explanation: "Encapsulation is keeping data (attributes) and methods that operate on it together in a class." }
    ]
  },

  "searching-algorithms": {
    topicSlug: "searching-algorithms",
    explanation: [
      "A searching algorithm finds whether (and where) a specific value exists in a list. The two algorithms you must know for GCSE are Linear Search and Binary Search.",
      "Linear Search checks every item from the beginning to end — it works on any list (unsorted or sorted). Binary Search is much faster but requires the list to be sorted first. It works by repeatedly halving the search space.",
      "In terms of efficiency: Linear Search has O(n) complexity (worst case: checks all items). Binary Search has O(log n) complexity (much faster for large lists)."
    ],
    codeExamples: [
      {
        title: "Linear Search",
        code: `def linear_search(lst, target):
    for i in range(len(lst)):
        if lst[i] == target:
            return i  # Return the index where found
    return -1  # -1 means not found

scores = [45, 72, 31, 88, 56, 23]
result = linear_search(scores, 88)

if result != -1:
    print(f"Found 88 at index {result}")
else:
    print("88 not found")`,
        description: "Linear Search checks each element one by one. Simple but can be slow for large lists."
      },
      {
        title: "Binary Search",
        code: `def binary_search(lst, target):
    low = 0
    high = len(lst) - 1

    while low <= high:
        mid = (low + high) // 2
        if lst[mid] == target:
            return mid
        elif lst[mid] < target:
            low = mid + 1   # Search right half
        else:
            high = mid - 1  # Search left half
    return -1

sorted_list = [10, 23, 35, 47, 58, 69, 81]
result = binary_search(sorted_list, 47)
print(f"Found 47 at index: {result}")`,
        description: "Binary Search is much faster but the list MUST be sorted first."
      }
    ],
    keyPoints: [
      "Linear Search: checks every element. Works on unsorted lists. O(n) complexity.",
      "Binary Search: halves the search space each time. MUST be sorted. O(log n) complexity.",
      "If item is found, return its index. If not found, return -1.",
      "Binary Search is much more efficient for large sorted lists.",
      "For GCSE exams, you must be able to trace through both algorithms manually."
    ],
    commonMistakes: [
      { mistake: "Using Binary Search on an unsorted list", fix: "Always sort the list first before applying Binary Search." },
      { mistake: "Returning False/None instead of -1 for 'not found'", fix: "The standard convention is to return -1 when the item is not found." }
    ],
    workedExample: {
      title: "Name Finder",
      problem: "Use linear search to find a student's name in a class register. Return the position (1-indexed for readability).",
      solution: "Implement linear search, then add 1 to the found index before displaying.",
      code: `def find_student(register, name):
    for i in range(len(register)):
        if register[i] == name:
            return i
    return -1

register = ["Alice", "Bob", "Charlie", "Diana", "Edward"]
target = input("Find student: ")
pos = find_student(register, target)

if pos != -1:
    print(f"{target} is student number {pos + 1}")
else:
    print(f"{target} not found in register.")`
    },
    videoUrl: "https://www.youtube.com/embed/P3YID7liBug",
    quiz: [
      { question: "Which search requires the list to be sorted first?", options: ["Linear Search", "Sequential Search", "Binary Search", "Index Search"], correctIndex: 2, explanation: "Binary Search only works correctly on a sorted list." },
      { question: "What does a search algorithm return if the item is not found?", options: ["0", "-1", "False", "None"], correctIndex: 1, explanation: "By convention, -1 is returned to indicate the item was not found." },
      { question: "In Binary Search, how does the algorithm know which half to discard?", options: ["It checks the first half randomly", "It compares the target with the middle element", "It counts the number of elements", "It uses trial and error"], correctIndex: 1, explanation: "The middle element is compared to the target. If target is larger, search the right half; if smaller, search the left." },
      { question: "What is the worst case for Linear Search on a list of 100 items?", options: ["1 comparison", "10 comparisons", "100 comparisons", "50 comparisons"], correctIndex: 2, explanation: "In the worst case (item at the end or not present), Linear Search checks all 100 items." },
      { question: "Binary Search is described as having O(log n) complexity. What does this mean?", options: ["It searches all n items", "It does n*n comparisons", "The number of steps grows very slowly compared to n", "It only works for n items"], correctIndex: 2, explanation: "O(log n) means the number of steps needed grows very slowly even as n becomes very large." }
    ]
  },

  "sorting-algorithms": {
    topicSlug: "sorting-algorithms",
    explanation: [
      "Sorting algorithms arrange items in a list into order (ascending or descending). For GCSE, you need to know Bubble Sort and Merge Sort (and understand their differences in efficiency).",
      "Bubble Sort works by repeatedly comparing adjacent pairs and swapping them if they're in the wrong order. It 'bubbles' the largest item to the end each pass. It is simple but inefficient for large lists.",
      "Merge Sort uses a 'divide and conquer' approach: split the list in half, sort each half recursively, then merge them back together. It is much more efficient for large datasets."
    ],
    codeExamples: [
      {
        title: "Bubble Sort",
        code: `def bubble_sort(lst):
    n = len(lst)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lst[j] > lst[j + 1]:
                # Swap adjacent elements
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
    return lst

numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_nums = bubble_sort(numbers)
print("Sorted:", sorted_nums)`,
        description: "Bubble Sort: simple but inefficient. Good for small lists or exam demonstrations."
      },
      {
        title: "Merge Sort",
        code: `def merge_sort(lst):
    if len(lst) <= 1:
        return lst

    mid = len(lst) // 2
    left = merge_sort(lst[:mid])
    right = merge_sort(lst[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result += left[i:]
    result += right[j:]
    return result

print(merge_sort([38, 27, 43, 3, 9, 82]))`,
        description: "Merge Sort is much more efficient for large lists, using a recursive divide-and-conquer approach."
      }
    ],
    keyPoints: [
      "Bubble Sort: compare adjacent pairs, swap if wrong order. Repeat until sorted. O(n²) complexity.",
      "Merge Sort: divide the list, sort each half, merge back together. O(n log n) complexity.",
      "Bubble Sort is easy to understand and code but slow for large lists.",
      "Merge Sort is more efficient but harder to understand and implement.",
      "Python's built-in sorted() and list.sort() use Timsort (a hybrid of merge and insertion sort)."
    ],
    commonMistakes: [
      { mistake: "Not doing enough passes in Bubble Sort (stopping too early)", fix: "The outer loop must run n times to guarantee all elements are in place." },
      { mistake: "Confusing Bubble Sort and Insertion Sort in exam answers", fix: "Bubble Sort swaps ADJACENT elements. Insertion Sort inserts into the correct position." }
    ],
    workedExample: {
      title: "Sorting Exam Scores",
      problem: "You have a list of exam scores. Sort them in ascending order using bubble sort and display the sorted list.",
      solution: "Implement bubble sort with nested loops. The outer loop runs n times, the inner loop compares adjacent pairs.",
      code: `scores = [72, 45, 88, 31, 65, 90, 52]

n = len(scores)
for i in range(n):
    for j in range(0, n - i - 1):
        if scores[j] > scores[j + 1]:
            scores[j], scores[j + 1] = scores[j + 1], scores[j]

print("Sorted scores:", scores)`
    },
    videoUrl: "https://www.youtube.com/embed/xli_FI7CuzA",
    quiz: [
      { question: "What does Bubble Sort do in each pass?", options: ["Finds the minimum and puts it first", "Divides the list in half", "Swaps adjacent elements that are in the wrong order", "Removes duplicates"], correctIndex: 2, explanation: "Bubble Sort compares adjacent pairs and swaps them if they're in the wrong order." },
      { question: "What is the time complexity of Bubble Sort in the worst case?", options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], correctIndex: 2, explanation: "Bubble Sort has O(n²) complexity — it compares pairs for each element in the list." },
      { question: "What strategy does Merge Sort use?", options: ["Brute force", "Greedy algorithm", "Divide and Conquer", "Linear search"], correctIndex: 2, explanation: "Merge Sort divides the list into halves, sorts each, and merges them back together." },
      { question: "Which sorting algorithm is more efficient for very large lists?", options: ["Bubble Sort", "Merge Sort", "They are the same", "Selection Sort"], correctIndex: 1, explanation: "Merge Sort has O(n log n) complexity, which is far more efficient than Bubble Sort's O(n²) for large datasets." },
      { question: "After one complete pass of Bubble Sort on [5,3,1,4,2], where is the largest element?", options: ["Position 0", "Position 2", "Position 4 (last)", "Still unsorted"], correctIndex: 2, explanation: "Each complete pass of Bubble Sort places the largest remaining element at the end." }
    ]
  },

  "pseudocode-trace-tables": {
    topicSlug: "pseudocode-trace-tables",
    explanation: [
      "Pseudocode is an informal, plain-English description of an algorithm. It follows a structured format but isn't tied to any specific programming language. For GCSE, you need to read, write, and trace pseudocode in both AQA and OCR styles.",
      "A trace table is used to manually track how variables change as an algorithm executes line by line. Each column is a variable, each row is a step. Exam questions often ask you to complete a trace table to show you understand how code runs.",
      "Common pseudocode constructs: INPUT/OUTPUT, IF/ELSE/ENDIF, FOR/NEXT, WHILE/ENDWHILE, arrays (like lists), and PROCEDURE/FUNCTION."
    ],
    codeExamples: [
      {
        title: "AQA-Style Pseudocode",
        code: `# Python equivalent of this pseudocode:
# total <- 0
# FOR i <- 1 TO 5
#     INPUT num
#     total <- total + num
# ENDFOR
# OUTPUT total / 5

total = 0
for i in range(1, 6):
    num = int(input("Enter number: "))
    total = total + num

print(total / 5)`,
        description: "AQA uses <- for assignment, FOR/ENDFOR for loops, and OUTPUT for print."
      },
      {
        title: "Reading a Trace Table",
        code: `# Trace this code:
x = 5
y = 3
while x > 0:
    y = y + x
    x = x - 2

print(y)

# Trace table:
# | x  | y  |
# | 5  | 3  | (initial)
# | 3  | 8  | (y=3+5=8, x=5-2=3)
# | 1  | 11 | (y=8+3=11, x=3-2=1)
# | -1 | 12 | (y=11+1=12, x=1-2=-1, loop ends)
# Output: 12`,
        description: "In a trace table, track each variable's value after every significant step."
      }
    ],
    keyPoints: [
      "Pseudocode describes algorithms in plain English — not real Python code.",
      "AQA style: <- for assignment, ENDFOR, ENDWHILE, OUTPUT.",
      "OCR style: = for assignment, NEXT, ENDWHILE, PRINT/OUTPUT.",
      "Trace tables track every variable after each line of code executes.",
      "When tracing loops, remember to update ALL variables that change in each iteration."
    ],
    commonMistakes: [
      { mistake: "Forgetting to update a variable in every row of a trace table", fix: "Copy the previous value if a variable doesn't change — leave nothing blank." },
      { mistake: "Mixing pseudocode syntax with real Python syntax", fix: "Know which board style you're using and be consistent." }
    ],
    workedExample: {
      title: "Counter Trace",
      problem: "Trace this pseudocode: count = 0, FOR i = 1 TO 4: count = count + i: ENDFOR. What is the final value of count?",
      solution: "Track count and i through each iteration of the loop.",
      code: `# Python equivalent
count = 0
for i in range(1, 5):   # i goes 1,2,3,4
    count = count + i

print("Final count:", count)

# Trace:
# i=1: count = 0+1 = 1
# i=2: count = 1+2 = 3
# i=3: count = 3+3 = 6
# i=4: count = 6+4 = 10`
    },
    videoUrl: "https://www.youtube.com/embed/e_q1PFza-m8",
    quiz: [
      { question: "What is pseudocode used for?", options: ["Running programs", "Describing algorithms in plain English", "Fixing bugs", "Storing data"], correctIndex: 1, explanation: "Pseudocode describes the logic of an algorithm without being tied to a specific language." },
      { question: "In AQA pseudocode, which symbol is used for assignment?", options: ["=", "==", "<-", ":="], correctIndex: 2, explanation: "AQA pseudocode uses <- to assign a value to a variable." },
      { question: "What is a trace table used for?", options: ["Drawing flowcharts", "Tracking how variables change during algorithm execution", "Storing test results", "Generating random numbers"], correctIndex: 1, explanation: "Trace tables manually track variable values step by step through code." },
      { question: "In a trace table, what should you write if a variable's value doesn't change on a particular step?", options: ["Leave it blank", "Write N/A", "Copy the previous value", "Write 'unchanged'"], correctIndex: 2, explanation: "Copy the previous value — every cell should have a value to show the complete state." },
      { question: "FOR i <- 1 TO 5 in AQA pseudocode is equivalent to which Python loop?", options: ["for i in range(5):", "for i in range(1, 5):", "for i in range(1, 6):", "for i in range(0, 5):"], correctIndex: 2, explanation: "TO 5 means i goes up to and including 5, so Python needs range(1, 6)." }
    ]
  },

  "exam-tips": {
    topicSlug: "exam-tips",
    explanation: [
      "The GCSE Computer Science exam tests both theoretical knowledge and practical programming. Paper 1 covers theory (systems, networks, security etc.), while Paper 2 is the programming/algorithms paper where Python skills shine.",
      "Key strategies for the programming paper: always trace through your code mentally before writing it, use meaningful variable names, remember to handle edge cases, and for 4+ mark questions break your answer into clearly labelled steps.",
      "Common mark-scheme requirements: correct variable names, correct data types, correct use of selection/iteration, correct output, and error handling where appropriate. Practise writing code on paper regularly — you won't have an IDE in the exam!"
    ],
    codeExamples: [
      {
        title: "Classic Exam Pattern: Validation Loop",
        code: `# Very common in GCSE exams: input validation
score = int(input("Enter score (0-100): "))
while score < 0 or score > 100:
    print("Invalid. Must be between 0 and 100.")
    score = int(input("Enter score (0-100): "))

print("Score accepted:", score)`,
        description: "Validation loops are extremely common in GCSE programming questions."
      },
      {
        title: "Classic Exam Pattern: List Processing",
        code: `# Find average, max, and min of user-entered values
values = []
for i in range(5):
    n = int(input(f"Enter number {i+1}: "))
    values.append(n)

total = 0
for v in values:
    total += v

average = total / len(values)
print(f"Sum: {total}")
print(f"Average: {average:.2f}")
print(f"Maximum: {max(values)}")
print(f"Minimum: {min(values)}")`,
        description: "Processing a list of inputs and computing statistics is a very common exam task."
      }
    ],
    keyPoints: [
      "Always indent code correctly — Python is sensitive to indentation errors.",
      "Remember: input() returns a string, so cast with int() or float() before maths.",
      "Common exam tasks: validation loops, list processing, searching, sorting, file reading/writing.",
      "For 6-mark 'write a program' questions: plan first (pseudocode), then code.",
      "Learn to trace code on paper — the exam is written, not on a computer!"
    ],
    commonMistakes: [
      { mistake: "Writing `if x = 5:` in an exam instead of `if x == 5:`", fix: "Always use double equals == for comparison. Single = is assignment." },
      { mistake: "Forgetting that range() is exclusive: range(1, 10) gives 1-9 not 1-10", fix: "If you want 1 to 10 inclusive, use range(1, 11)." }
    ],
    workedExample: {
      title: "Full Exam-Style Question",
      problem: "Write a program that asks for 5 test scores, validates each is between 0 and 100, then outputs the average and whether the student passed (average >= 50).",
      solution: "Use a loop to collect scores with validation, then compute average and check pass/fail condition.",
      code: `scores = []
for i in range(5):
    score = int(input(f"Score {i+1} (0-100): "))
    while score < 0 or score > 100:
        print("Invalid score. Try again.")
        score = int(input(f"Score {i+1} (0-100): "))
    scores.append(score)

total = sum(scores)
average = total / 5

print(f"Average: {average:.1f}")
if average >= 50:
    print("Result: PASS")
else:
    print("Result: FAIL")`
    },
    videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8",
    quiz: [
      { question: "In the exam, what should you do before writing a multi-step program?", options: ["Start coding immediately", "Plan with pseudocode or a flowchart first", "Look up the answer", "Ask the teacher"], correctIndex: 1, explanation: "Planning with pseudocode first prevents logical errors and helps you structure your answer." },
      { question: "A validation loop asks for input until valid. Which loop is best for this?", options: ["for loop", "while loop", "repeat loop", "do-while loop"], correctIndex: 1, explanation: "A while loop with a condition is perfect for validation — it keeps asking until input is valid." },
      { question: "What should you include for a 6-mark programming question?", options: ["Just the code", "Just comments", "Code, meaningful variable names, and correct logic", "Only pseudocode"], correctIndex: 2, explanation: "6-mark questions need complete, correct code with appropriate variable names and logic." },
      { question: "How do you format a float to 2 decimal places in a print statement?", options: ["print(round(x, 2))", "print(f'{x:.2f}')", "print(format(x))", "print(x.2f)"], correctIndex: 1, explanation: "f-strings with :.2f format floats to 2 decimal places: f'{value:.2f}'." },
      { question: "If a GCSE question says 'write an algorithm', which of these is acceptable?", options: ["Pseudocode only", "Flowchart only", "Python code only", "Pseudocode, flowchart, or Python code"], correctIndex: 3, explanation: "Algorithm questions accept pseudocode, flowcharts, or real code — all are valid representations." }
    ]
  },

  // New OCR topics
  "2d-arrays": twoDArrays,
  "random-numbers": randomNumbers,
  "robust-programming": robustProgramming,
  "boolean-logic": booleanLogic,
  "insertion-sort": insertionSort,
  "sql-basics": sqlBasics,

  // Imported topic files
  "arithmetic-operators": arithmeticOperators,
  "selection-if-else": selectionIfElse,
  "string-handling": stringHandling,
  "data-types-casting": dataTypesCasting,
  "variables-constants": variablesConstants,
  "intro-to-python": introToPython,
};
