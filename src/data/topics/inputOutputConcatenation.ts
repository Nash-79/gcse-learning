import type { TopicContent } from "../topicContent";

export const inputOutputConcatenation: TopicContent = {
  topicSlug: "input-output-concatenation",
  explanation: [
    "Output means displaying information to the user. In Python, we use the print() function for output. You can print text (strings), numbers, variables, or a combination of them. print() automatically adds a new line at the end, so each print() statement appears on a separate line.",
    "Input means getting data from the user while the program is running. The input() function pauses the program, displays a prompt message, waits for the user to type something and press Enter, then returns whatever they typed. IMPORTANT: input() ALWAYS returns a string (str), even if the user types a number.",
    "Concatenation means joining strings together using the + operator. For example, 'Hello' + ' ' + 'World' gives 'Hello World'. You can only concatenate strings with other strings — trying to join a string and a number (like 'Age: ' + 15) will cause a TypeError. You must convert numbers to strings first using str().",
    "F-strings (formatted string literals) are the modern, recommended way to include variables inside strings. Start the string with the letter f before the opening quote, then put variable names inside curly braces: f'Hello {name}, you are {age} years old'. F-strings automatically convert numbers to text for you, which makes them much easier than concatenation.",
    "You can also use commas in print() to separate multiple items: print('Name:', name, 'Age:', age). Python automatically adds spaces between comma-separated items and handles different data types for you."
  ],
  codeExamples: [
    {
      title: "Basic Output with print()",
      code: `print("Hello, World!")
print("My name is Alex.")
print()
print("The line above is blank!")

score = 95
print("Your score is:", score)
print("Well done!")`,
      description: "print() displays text on the screen. Use print() with no arguments to create a blank line."
    },
    {
      title: "Getting Input from the User",
      code: `name = input("What is your name? ")
print("Hello,", name)

colour = input("What is your favourite colour? ")
print("Nice!", colour, "is a great colour!")`,
      description: "input() pauses the program and waits for the user to type something. The text in the brackets is the prompt message."
    },
    {
      title: "String Concatenation with +",
      code: `first_name = "Alex"
last_name = "Johnson"

full_name = first_name + " " + last_name
print(full_name)

greeting = "Hello, " + full_name + "!"
print(greeting)

age = 15
print("Age: " + str(age))`,
      description: "The + operator joins strings together. You must convert numbers to strings using str() before concatenating."
    },
    {
      title: "F-Strings (The Modern Way)",
      code: `name = "Jordan"
age = 15
score = 87.5

print(f"Hello, {name}!")
print(f"You are {age} years old.")
print(f"Your score is {score}%")
print(f"Next year you will be {age + 1}.")`,
      description: "F-strings start with f before the quote. Put variables or expressions inside {curly braces}. Numbers are converted automatically!"
    },
    {
      title: "Multiple Ways to Print Variables",
      code: `name = "Sam"
age = 16

print("Name: " + name + ", Age: " + str(age))

print("Name:", name, ", Age:", age)

print(f"Name: {name}, Age: {age}")`,
      description: "Three ways to combine text and variables: concatenation (+), commas (,), and f-strings (f''). F-strings are cleanest for exams."
    }
  ],
  keyPoints: [
    "print() displays output on the screen. It automatically adds a new line after each call.",
    "input() pauses the program and returns whatever the user types — ALWAYS as a string.",
    "Always include a clear prompt message in input(): input('Enter your name: ')",
    "Concatenation (+) joins strings, but you CANNOT mix strings and numbers without str().",
    "F-strings (f'Hello {name}') are the easiest way to include variables in strings.",
    "Commas in print() automatically add spaces: print('Score:', score) outputs 'Score: 95'.",
    "Remember: input() returns a STRING even if the user types a number."
  ],
  commonMistakes: [
    { mistake: "Trying to concatenate a string and a number: 'Score: ' + 95", fix: "Convert the number first: 'Score: ' + str(95) or use f-strings: f'Score: {95}'" },
    { mistake: "Forgetting the prompt message in input(): name = input()", fix: "Always include a helpful prompt: name = input('Enter your name: ')" },
    { mistake: "No space at the end of the prompt: input('Name:')", fix: "Add a space so it looks right: input('Name: ')" },
    { mistake: "Forgetting that input() returns a string, then trying to do maths with it", fix: "Cast to int or float before doing maths: age = int(input('Age: '))" }
  ],
  workedExample: {
    title: "Greeting Card Generator",
    problem: "Ask the user for their name and their friend's name. Display a greeting card message using f-strings that says 'Dear [friend], Happy Birthday! From [name]'.",
    solution: "Use two input() calls to get both names, then use f-strings to format the greeting.",
    code: `sender = input("Enter your name: ")
friend = input("Enter your friend's name: ")

print()
print("========================")
print(f"  Dear {friend},")
print(f"  Happy Birthday!")
print(f"  Wishing you a great day!")
print(f"  From {sender}")
print("========================")`
  },
  videoUrl: "https://www.youtube.com/embed/4OX49nLNPEE",
  quiz: [
    { question: "What does the input() function do?", options: ["Displays text on the screen", "Pauses the program and waits for the user to type something", "Creates a new variable", "Reads from a file"], correctIndex: 1, explanation: "input() pauses program execution and waits for the user to type something and press Enter.", hint: "It lets the user type something into the program.", difficulty: "easy" },
    { question: "What data type does input() always return?", options: ["Integer", "Float", "String", "It depends on what the user types"], correctIndex: 2, explanation: "input() ALWAYS returns a string (str), even if the user types a number like 42.", hint: "No matter what the user types — a number, a word, anything — it always comes back as the same type.", difficulty: "easy" },
    { question: "What is string concatenation?", options: ["Deleting part of a string", "Joining strings together using the + operator", "Converting a string to a number", "Splitting a string into parts"], correctIndex: 1, explanation: "Concatenation means joining strings together. In Python, you use the + operator: 'Hello' + ' ' + 'World'.", hint: "Think about what + does when used with text instead of numbers.", difficulty: "easy" },
    { question: "What will print('Hello' + ' ' + 'World') output?", options: ["Hello World", "Hello+World", "'Hello' ' ' 'World'", "Error"], correctIndex: 0, explanation: "The + operator joins the three strings together into one: 'Hello World'.", hint: "The + joins strings without adding anything extra — you need to include spaces yourself.", difficulty: "easy" },
    { question: "What will happen if you run: print('Age: ' + 15)?", options: ["Prints 'Age: 15'", "Prints 'Age: '15", "TypeError — cannot concatenate str and int", "Prints nothing"], correctIndex: 2, explanation: "You cannot use + to join a string and an integer. You need str(15) first or use f-strings.", hint: "Python is strict about data types when using the + operator.", difficulty: "medium" },
    { question: "Which f-string correctly includes a variable called 'name'?", options: ["f'Hello name'", "f'Hello {name}'", "'Hello {name}'", "f(Hello {name})"], correctIndex: 1, explanation: "F-strings use f before the quote and {variable_name} inside the string.", hint: "F-strings need the letter f AND curly braces around variable names.", difficulty: "medium" },
    { question: "What is the output of: print('Ha' + 'Ha' + 'Ha')?", options: ["Ha Ha Ha", "HaHaHa", "Ha+Ha+Ha", "Error"], correctIndex: 1, explanation: "Concatenation joins strings directly with no spaces: 'Ha' + 'Ha' + 'Ha' = 'HaHaHa'.", hint: "The + operator doesn't add spaces — it joins strings exactly as they are.", difficulty: "medium" },
    { question: "What is the difference between print('Score:', score) and print('Score: ' + str(score))?", options: ["They produce different output", "The first adds a space automatically, the second requires you to add the space", "The first causes an error", "There is no difference at all"], correctIndex: 1, explanation: "Commas in print() automatically add spaces between items. Concatenation requires you to manage spacing yourself.", hint: "Try both approaches — one adds a space for you, the other doesn't.", difficulty: "hard" }
  ]
};
