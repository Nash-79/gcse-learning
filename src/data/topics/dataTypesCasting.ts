import type { TopicContent } from "../topicContent";

export const dataTypesCasting: TopicContent = {
  topicSlug: "data-types-casting",
  explanation: [
    "Every piece of data in Python has a 'type' that tells Python what kind of data it is and what operations can be done with it. The four main data types you need to know for GCSE are: Integer (int) — whole numbers like 5, -3, 100; Real/Float (float) — decimal numbers like 3.14, -0.5, 99.99; String (str) — text in quotes like 'Hello', '42', 'True'; and Boolean (bool) — True or False (only two possible values).",
    "You can check what type a variable holds using the type() function. This is very useful when debugging: if your maths isn't working, it might be because your variable is actually a string, not a number! For example, type(42) returns <class 'int'> and type('42') returns <class 'str'> — they look similar but are completely different.",
    "Casting (also called type conversion) means converting data from one type to another. The main casting functions are: int() converts to integer (drops decimals), float() converts to decimal, str() converts to text, and bool() converts to True/False. You MUST cast user input before doing maths, because input() always returns a string.",
    "Casting is essential because input() always returns a string. If a user types '25', Python stores it as the STRING '25', not the NUMBER 25. If you try to add 1 to it, Python will either concatenate ('25' + '1' = '251') or throw a TypeError. You must write int(input('Enter age: ')) or float(input('Enter price: ')) to convert it to a number first.",
    "Boolean values are either True or False (with capital T and F). They are the foundation of all decision-making in programming. Any comparison operation (like 5 > 3) produces a Boolean result. Python also treats certain values as 'truthy' or 'falsy': 0, empty string '', empty list [], and None are all treated as False in Boolean context."
  ],
  codeExamples: [
    {
      title: "The Four Main Data Types",
      code: `name = "Alex"          # String (str)
age = 15               # Integer (int)
height = 1.72          # Float (float)
is_student = True      # Boolean (bool)

print(name, type(name))
print(age, type(age))
print(height, type(height))
print(is_student, type(is_student))`,
      description: "Python automatically determines the data type based on the value you assign. Use type() to check."
    },
    {
      title: "Type Casting — Converting Between Types",
      code: `x = "42"
print(x, "is a", type(x))

x_int = int(x)
print(x_int, "is a", type(x_int))

x_float = float(x)
print(x_float, "is a", type(x_float))

y = 3.7
y_int = int(y)
print(y, "cast to int is:", y_int)`,
      description: "int() drops decimals (does NOT round). float() adds a decimal point. str() converts anything to text."
    },
    {
      title: "Why Casting Matters with input()",
      code: `num_str = input("Enter a number: ")
print("Type:", type(num_str))

num = int(num_str)
print("Type:", type(num))

doubled = num * 2
print(f"{num} doubled is {doubled}")`,
      description: "input() ALWAYS returns a string. You must cast it to int or float before doing arithmetic."
    },
    {
      title: "Combining Casting and Input (One Line)",
      code: `age = int(input("How old are you? "))
price = float(input("Enter the price: "))

print(f"In 5 years you will be {age + 5}")
print(f"Price with 20% VAT: {price * 1.2:.2f}")`,
      description: "You can cast and input in one line: int(input('...')). This is the most common pattern in GCSE exams."
    },
    {
      title: "Boolean Values and Comparisons",
      code: `is_raining = True
is_sunny = False

print(is_raining)
print(type(is_raining))

x = 10
print(x > 5)
print(x == 10)
print(x < 3)

print(bool(0))
print(bool(1))
print(bool(""))
print(bool("hello"))`,
      description: "Booleans are True or False. Comparisons produce Boolean results. 0, empty strings, and empty lists are 'falsy'."
    }
  ],
  keyPoints: [
    "Integer (int): whole numbers — 5, -3, 100. No decimal point.",
    "Float (float): decimal numbers — 3.14, -0.5, 99.0. Always has a decimal point.",
    "String (str): text in quotes — 'Hello', \"42\". Even '42' is a string, not a number!",
    "Boolean (bool): True or False only. Must have capital T/F.",
    "type() tells you what data type a variable holds.",
    "int() casts to integer (drops decimals — does NOT round). float() casts to decimal. str() casts to text.",
    "input() ALWAYS returns a string. Cast with int() or float() before doing arithmetic."
  ],
  commonMistakes: [
    { mistake: "Forgetting to cast input() before doing maths: age = input('Age? '); print(age + 1)", fix: "Cast first: age = int(input('Age? ')); print(age + 1)" },
    { mistake: "Writing booleans in lowercase: is_happy = true", fix: "Booleans must be capitalised: is_happy = True" },
    { mistake: "Thinking int() rounds numbers: int(3.9) is 4", fix: "int() truncates (drops) the decimal — int(3.9) is 3, not 4!" },
    { mistake: "Confusing '42' (string) with 42 (integer)", fix: "Quotes make it a string: '42' is text. Without quotes, 42 is a number." }
  ],
  workedExample: {
    title: "Temperature Converter",
    problem: "Ask the user for a temperature in Celsius. Convert it to Fahrenheit using the formula: F = (C × 9/5) + 32. Display the result to 1 decimal place.",
    solution: "Use float(input()) to get the temperature, apply the formula, then use an f-string with :.1f to format the output.",
    code: `celsius = float(input("Enter temperature in Celsius: "))

fahrenheit = (celsius * 9/5) + 32

print(f"{celsius}°C = {fahrenheit:.1f}°F")`
  },
  videoUrl: "https://www.youtube.com/embed/gCCVsvgR2KU",
  quiz: [
    { question: "What data type is the value 3.14?", options: ["Integer (int)", "String (str)", "Float (float)", "Boolean (bool)"], correctIndex: 2, explanation: "3.14 has a decimal point, making it a float (floating-point number).", hint: "Look for the decimal point — what type handles decimals?", difficulty: "easy" },
    { question: "What data type is the value '42'?", options: ["Integer", "Float", "String", "Boolean"], correctIndex: 2, explanation: "The quotation marks around 42 make it a string (text), not a number.", hint: "Pay attention to the quote marks around the value.", difficulty: "easy" },
    { question: "What does int(3.9) return?", options: ["4", "3", "3.9", "Error"], correctIndex: 1, explanation: "int() truncates (removes) the decimal part — it does NOT round. 3.9 becomes 3.", hint: "int() doesn't round — it chops off everything after the decimal point.", difficulty: "medium" },
    { question: "Why must you cast input() before doing arithmetic?", options: ["Because input() is slow", "Because input() always returns a string", "Because Python requires it for print()", "Because integers are faster"], correctIndex: 1, explanation: "input() always returns a string. You cannot do maths with strings — you must cast to int or float first.", hint: "What type does input() always return?", difficulty: "medium" },
    { question: "What is the correct way to get a whole number from the user?", options: ["num = input('Number: ')", "num = int('Number: ')", "num = int(input('Number: '))", "num = number(input('Number: '))"], correctIndex: 2, explanation: "int(input('Number: ')) first gets a string from input(), then converts it to an integer.", hint: "You need to wrap input() inside a casting function.", difficulty: "medium" },
    { question: "What does type(True) return?", options: ["<class 'str'>", "<class 'int'>", "<class 'bool'>", "<class 'true'>"], correctIndex: 2, explanation: "True is a Boolean value, so type(True) returns <class 'bool'>.", hint: "True and False are the two values of which data type?", difficulty: "easy" },
    { question: "What happens if you run: int('hello')?", options: ["Returns 0", "Returns 'hello'", "Raises a ValueError", "Returns None"], correctIndex: 2, explanation: "Python cannot convert the text 'hello' into a number, so it raises a ValueError.", hint: "Can the word 'hello' be meaningfully turned into a number?", difficulty: "hard" },
    { question: "What is the output of: print(type(10 / 2))?", options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'number'>"], correctIndex: 1, explanation: "The / operator ALWAYS returns a float in Python 3, even when the result is a whole number. 10 / 2 = 5.0 (float).", hint: "Division in Python 3 always produces a specific type, even if the result looks like a whole number.", difficulty: "hard" }
  ]
};
