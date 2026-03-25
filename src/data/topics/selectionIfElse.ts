import type { TopicContent } from "../topicContent";

export const selectionIfElse: TopicContent = {
  topicSlug: "selection-if-else",
  explanation: [
    "Selection is one of the three basic programming constructs (alongside sequence and iteration). It allows your program to make decisions by choosing which block of code to execute based on whether a condition is True or False. Without selection, programs would just run the same instructions every time.",
    "Python uses the keywords if, elif (short for 'else if'), and else to implement selection. An 'if' statement checks a condition: if the condition is True, the indented code block below it runs. If False, Python skips it and moves on. You MUST end the if/elif/else line with a colon (:), and the code block below MUST be indented (typically 4 spaces).",
    "Relational operators (also called comparison operators) are used to create conditions: == (equal to), != (not equal to), > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to). These all produce Boolean (True/False) results.",
    "Boolean operators (AND, OR, NOT) let you combine multiple conditions. 'and' requires BOTH conditions to be True. 'or' requires at LEAST ONE condition to be True. 'not' flips True to False and False to True. For example: if age >= 13 and age <= 19 checks if someone is a teenager.",
    "You can nest if statements (put one inside another) for more complex decisions. However, too much nesting makes code hard to read — often you can use elif instead. Python checks conditions from top to bottom and runs the FIRST block whose condition is True, then skips the rest."
  ],
  codeExamples: [
    {
      title: "Simple If Statement",
      code: `age = int(input("How old are you? "))

if age >= 18:
    print("You are an adult.")
    print("You can vote!")

print("Thanks for checking!")`,
      description: "If the condition is True, the indented block runs. If False, it's skipped. The last print always runs because it's not indented inside the if."
    },
    {
      title: "If / Else — Two Choices",
      code: `password = input("Enter password: ")

if password == "secret123":
    print("Access granted!")
    print("Welcome back!")
else:
    print("Access denied!")
    print("Incorrect password.")`,
      description: "If the condition is True, the if-block runs. If False, the else-block runs instead. Exactly one of them will always execute."
    },
    {
      title: "If / Elif / Else — Multiple Choices",
      code: `score = int(input("Enter your test score: "))

if score >= 90:
    print("Grade: A*")
elif score >= 80:
    print("Grade: A")
elif score >= 70:
    print("Grade: B")
elif score >= 60:
    print("Grade: C")
elif score >= 50:
    print("Grade: D")
else:
    print("Grade: U (Ungraded)")`,
      description: "Python checks conditions top to bottom. It runs the FIRST block that is True and skips the rest. 'else' catches everything that didn't match."
    },
    {
      title: "Boolean Operators — AND, OR, NOT",
      code: `age = int(input("Age: "))
has_ticket = input("Have a ticket? (yes/no): ")

if age >= 18 and has_ticket == "yes":
    print("Welcome to the concert!")
elif age >= 18 and has_ticket != "yes":
    print("You need a ticket!")
elif age < 18:
    print("Sorry, you must be 18 or over.")

temp = int(input("Temperature: "))
if temp < 0 or temp > 40:
    print("Extreme weather warning!")

raining = True
if not raining:
    print("No umbrella needed!")
else:
    print("Take an umbrella!")`,
      description: "'and' = both must be True. 'or' = at least one must be True. 'not' flips the condition."
    },
    {
      title: "All Comparison Operators",
      code: `x = 10
y = 20

print(x == y)    # False (equal to)
print(x != y)    # True  (not equal to)
print(x > y)     # False (greater than)
print(x < y)     # True  (less than)
print(x >= 10)   # True  (greater than or equal)
print(x <= 5)    # False (less than or equal)`,
      description: "These six comparison operators all return True or False. Remember: == checks equality, = assigns a value!"
    }
  ],
  keyPoints: [
    "Selection uses if, elif, and else to make decisions based on conditions.",
    "Always put a colon (:) at the end of if, elif, and else lines.",
    "The code inside the block MUST be indented (4 spaces is standard).",
    "Use == for comparison (equality check), NOT = (which is assignment).",
    "Comparison operators: == != > < >= <= — all return True or False.",
    "Boolean operators: 'and' (both true), 'or' (at least one true), 'not' (flip).",
    "Python checks conditions top to bottom and runs only the FIRST matching block."
  ],
  commonMistakes: [
    { mistake: "Forgetting the colon: if age > 18", fix: "Always add a colon: if age > 18:" },
    { mistake: "Using = instead of ==: if password = 'secret':", fix: "Use == for comparison: if password == 'secret':" },
    { mistake: "Not indenting the code block: if True:\\nprint('yes')", fix: "Indent the block: if True:\\n    print('yes')" },
    { mistake: "Using elif after else (else must be last)", fix: "Put elif BEFORE else. else has no condition and catches everything remaining." }
  ],
  workedExample: {
    title: "Theme Park Ride Checker",
    problem: "Ask for a person's age and height (in cm). They can ride if they are at least 12 years old AND at least 140cm tall. Display an appropriate message for each case.",
    solution: "Use 'and' to check both conditions are met. Handle the failure cases with elif/else.",
    code: `age = int(input("Enter your age: "))
height = int(input("Enter your height in cm: "))

if age >= 12 and height >= 140:
    print("You can go on the ride! Enjoy!")
elif age < 12:
    print("Sorry, you must be at least 12 years old.")
else:
    print("Sorry, you must be at least 140cm tall.")`
  },
  videoUrl: "https://www.youtube.com/embed/Zp5MuPOtsSY",
  quiz: [
    { question: "What symbol is used to check if two values are equal?", options: ["=", "==", "===", "equals"], correctIndex: 1, explanation: "== checks equality. = is for assignment (storing a value).", hint: "One of these is a double symbol.", difficulty: "easy" },
    { question: "What is missing from this line: if score > 50", options: ["The word 'then'", "Brackets around the condition", "A colon (:) at the end", "A semicolon (;)"], correctIndex: 2, explanation: "All if/elif/else lines in Python must end with a colon (:).", hint: "Python needs a specific punctuation mark at the end of the line.", difficulty: "easy" },
    { question: "What does 'elif' mean?", options: ["End If", "Else If", "Either If", "Equal If"], correctIndex: 1, explanation: "elif is short for 'else if' — it provides an additional condition to check.", hint: "It's a shortened version of two words.", difficulty: "easy" },
    { question: "How does Python know which code belongs inside an if block?", options: ["Curly brackets {}", "The 'end if' keyword", "Indentation (spacing)", "Semicolons"], correctIndex: 2, explanation: "Python uses indentation (spaces at the start of lines) to determine which code is inside a block.", hint: "It's about the spacing at the beginning of each line.", difficulty: "easy" },
    { question: "What does the 'and' operator require?", options: ["At least one condition to be True", "Both conditions to be True", "Neither condition to be True", "Exactly one condition to be True"], correctIndex: 1, explanation: "'and' returns True only if BOTH conditions are True.", hint: "Think about what 'and' means in everyday English.", difficulty: "medium" },
    { question: "What is the output if x = 5: if x > 10: print('Big') elif x > 3: print('Medium') else: print('Small')?", options: ["Big", "Medium", "Small", "Nothing"], correctIndex: 1, explanation: "x=5 is not > 10 (skip), but is > 3 (True) → prints 'Medium'. elif stops checking after first match.", hint: "Check each condition in order — which is the first one that's True?", difficulty: "medium" },
    { question: "Which operator means 'not equal to'?", options: ["<>", "!==", "!=", "=/="], correctIndex: 2, explanation: "!= is the 'not equal to' operator in Python.", hint: "It starts with an exclamation mark.", difficulty: "easy" },
    { question: "What does 'not True' evaluate to?", options: ["True", "False", "None", "Error"], correctIndex: 1, explanation: "The 'not' operator flips Boolean values: not True = False, not False = True.", hint: "'not' flips the value to its opposite.", difficulty: "hard" }
  ]
};
