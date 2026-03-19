import type { TopicContent } from "../topicContent";

export const stringHandling: TopicContent = {
  topicSlug: "string-handling",
  explanation: [
    "Strings are sequences of characters (letters, digits, symbols, spaces) enclosed in quotes. You can use single quotes ('Hello') or double quotes (\"Hello\") — they work the same way. Strings are one of the most commonly used data types in programming, and the OCR GCSE specification requires you to be confident with string manipulation.",
    "Every character in a string has a position number called an index. Python uses zero-based indexing, meaning the FIRST character is at position 0, the second at position 1, and so on. You can also use negative indexes to count from the end: -1 is the last character, -2 is second-to-last. Access individual characters using square brackets: word[0] gives the first character.",
    "Slicing lets you extract a portion (substring) of a string using the syntax string[start:stop]. The start index is included, but the stop index is NOT included. For example, 'Python'[0:3] gives 'Pyt' (characters at index 0, 1, 2). You can omit start (defaults to 0) or stop (defaults to end): 'Python'[2:] gives 'thon'.",
    "Python has many built-in string methods that you should know for GCSE: upper() converts to uppercase, lower() converts to lowercase, strip() removes whitespace from both ends, split() breaks a string into a list, replace() swaps one substring for another, find() searches for a substring and returns its index, and len() gives the length. Remember: strings are IMMUTABLE — these methods return NEW strings, they do not change the original.",
    "String concatenation joins strings using the + operator. String repetition repeats a string using the * operator: 'Ha' * 3 gives 'HaHaHa'. These operations create new strings. You can also check if a substring exists inside a string using the 'in' keyword: 'py' in 'python' returns True."
  ],
  codeExamples: [
    {
      title: "String Indexing (Accessing Characters)",
      code: `word = "Python"

print(word[0])     # P (first character)
print(word[1])     # y (second character)
print(word[5])     # n (sixth/last character)
print(word[-1])    # n (last character)
print(word[-2])    # o (second from end)

print("Length:", len(word))`,
      description: "Indexing starts at 0! The first character is [0], not [1]. Negative indexes count backwards from the end."
    },
    {
      title: "String Slicing (Extracting Parts)",
      code: `text = "Computer Science"

print(text[0:8])     # Computer
print(text[9:16])    # Science
print(text[:8])      # Computer (from start)
print(text[9:])      # Science (to end)
print(text[-7:])     # Science (last 7 chars)
print(text[::2])     # Cmue cec (every 2nd char)
print(text[::-1])    # ecneicS retupmoC (reversed!)`,
      description: "Slicing: string[start:stop:step]. Stop is EXCLUSIVE (not included). Omit start/stop to go from beginning/to end."
    },
    {
      title: "Essential String Methods",
      code: `name = "  Alex Johnson  "

print(name.upper())         # "  ALEX JOHNSON  "
print(name.lower())         # "  alex johnson  "
print(name.strip())         # "Alex Johnson" (no spaces)
print(name.replace("Alex", "Sam"))  # "  Sam Johnson  "
print(name.find("Johnson")) # 7 (index where found)
print(name.count("o"))      # 1
print(len(name))            # 16 (includes spaces)`,
      description: "String methods return NEW strings — they never change the original! You must store the result if you want to keep it."
    },
    {
      title: "Split and Join",
      code: `csv_data = "Alice,Bob,Charlie,Diana"
names = csv_data.split(",")
print(names)

sentence = "Hello World Python"
words = sentence.split(" ")
print(words)

result = " & ".join(names)
print(result)`,
      description: "split() breaks a string into a list using a delimiter. join() does the reverse — combines a list into a string."
    },
    {
      title: "Checking String Content",
      code: `email = "student@school.co.uk"

print("@" in email)
print(email.startswith("student"))
print(email.endswith(".co.uk"))

pin = "1234"
print(pin.isdigit())

name = "Alex"
print(name.isalpha())`,
      description: "Use 'in' to check if a substring exists. isdigit() checks if all characters are numbers. isalpha() checks for letters only."
    }
  ],
  keyPoints: [
    "Strings use zero-based indexing: first character is [0], not [1].",
    "Negative indexes count from the end: [-1] is the last character.",
    "Slicing: string[start:stop] — stop is EXCLUSIVE (not included).",
    "Strings are IMMUTABLE — methods like upper() return new strings, they don't change the original.",
    "Key methods: upper(), lower(), strip(), split(), replace(), find(), len().",
    "split() turns a string into a list. join() turns a list back into a string.",
    "Use 'in' to check if a substring exists: 'py' in 'python' returns True."
  ],
  commonMistakes: [
    { mistake: "Thinking the first character is at index 1", fix: "Python is zero-indexed. The first character is at index [0]." },
    { mistake: "Expecting text.upper() to change the variable text", fix: "Strings are immutable. Reassign: text = text.upper() to keep the change." },
    { mistake: "Off-by-one in slicing: 'Hello'[1:3] gives 'el', not 'ell'", fix: "The stop index is exclusive. 'Hello'[1:4] gives 'ell' (indexes 1, 2, 3)." },
    { mistake: "Confusing len() with the last index: len('Hello') is 5, but last index is 4", fix: "Length is count of characters. Last index = len - 1 because indexing starts at 0." }
  ],
  workedExample: {
    title: "Email Username Extractor",
    problem: "Ask the user for their email address. Extract and display just the username (everything before the @ symbol) in lowercase.",
    solution: "Use find() to locate the @ symbol, then slice from 0 to that position, and convert to lowercase.",
    code: `email = input("Enter your email: ")

at_pos = email.find("@")
username = email[:at_pos]
username = username.lower()

print(f"Your username is: {username}")`
  },
  videoUrl: "https://www.youtube.com/embed/k9TUPpGqYTo",
  quiz: [
    { question: "What is 'Python'[0]?", options: ["y", "P", "'Python'", "Error"], correctIndex: 1, explanation: "Python uses zero-based indexing. Index [0] is the first character: 'P'.", hint: "Indexing starts at 0, not 1.", difficulty: "easy" },
    { question: "What does 'Hello'[1:4] return?", options: ["'Hel'", "'ell'", "'ello'", "'Hell'"], correctIndex: 1, explanation: "Slicing [1:4] gives characters at index 1, 2, 3 (stop is exclusive): 'e', 'l', 'l' = 'ell'.", hint: "Start is included, stop is NOT included.", difficulty: "medium" },
    { question: "What does 'hello'.upper() return?", options: ["'Hello'", "'HELLO'", "'hello'", "Error"], correctIndex: 1, explanation: "upper() converts ALL characters to uppercase.", hint: "Upper means all capital letters.", difficulty: "easy" },
    { question: "Which method removes whitespace from both ends of a string?", options: ["trim()", "clean()", "strip()", "remove()"], correctIndex: 2, explanation: "strip() removes leading and trailing whitespace (spaces, tabs, newlines).", hint: "It 'strips away' the extra space.", difficulty: "easy" },
    { question: "Are Python strings mutable or immutable?", options: ["Mutable (can be changed)", "Immutable (cannot be changed in place)", "It depends on the string", "Mutable if you use upper()"], correctIndex: 1, explanation: "Strings are immutable. Methods like upper() return NEW strings — the original is unchanged.", hint: "If you do text.upper(), does 'text' itself change?", difficulty: "medium" },
    { question: "What does 'a,b,c'.split(',') return?", options: ["'a b c'", "['a', 'b', 'c']", "('a', 'b', 'c')", "'abc'"], correctIndex: 1, explanation: "split() breaks the string at each comma and returns a list of the parts.", hint: "split() always returns a list.", difficulty: "medium" },
    { question: "What is len('Hello World')?", options: ["10", "11", "12", "9"], correctIndex: 1, explanation: "len() counts ALL characters including the space. 'Hello World' has 11 characters.", hint: "Don't forget to count the space between the words!", difficulty: "medium" },
    { question: "What does 'Python'[::-1] produce?", options: ["'Python'", "'nohtyP'", "'Pytho'", "Error"], correctIndex: 1, explanation: "[::-1] reverses the string by stepping backwards through every character.", hint: "A step of -1 goes through the string in reverse order.", difficulty: "hard" }
  ]
};
