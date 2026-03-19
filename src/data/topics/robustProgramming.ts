import type { TopicContent } from "../topicContent";

export const robustProgramming: TopicContent = {
  topicSlug: "robust-programming",
  explanation: [
    "Defensive design is about writing programs that anticipate and handle potential problems. Rather than crashing when something unexpected happens, a robust program guides the user and recovers gracefully. The OCR spec (J277, Section 2.3) specifically requires knowledge of input validation, authentication, and testing.",
    "Input validation ensures that data entered by the user is sensible and within expected bounds before the program uses it. The five types of validation you must know are: range check, length check, presence check, type check, and format check. These are implemented using while loops that keep asking until valid data is entered.",
    "Authentication is the process of verifying a user's identity — typically through username and password. For GCSE, you should be able to implement a login system with a limited number of attempts (usually 3). This combines selection, iteration, and Boolean logic.",
    "Testing ensures your program works correctly. You need to know three types of test data: normal (typical valid input), boundary (edge cases at the limits), and erroneous/invalid (data that should be rejected). A test plan should cover all three."
  ],
  codeExamples: [
    {
      title: "Range Check Validation",
      code: `# Keep asking until a valid score is entered
score = int(input("Enter score (0-100): "))

while score < 0 or score > 100:
    print("Invalid! Score must be between 0 and 100.")
    score = int(input("Enter score (0-100): "))

print(f"Score accepted: {score}")`,
      description: "A range check ensures a value falls within acceptable minimum and maximum limits."
    },
    {
      title: "All Validation Types",
      code: `# Presence check — not empty
name = input("Enter your name: ")
while name == "":
    print("Name cannot be blank!")
    name = input("Enter your name: ")

# Length check — minimum 8 characters
password = input("Create password (min 8 chars): ")
while len(password) < 8:
    print(f"Too short! ({len(password)} chars). Need at least 8.")
    password = input("Create password (min 8 chars): ")

# Type check — must be a number
while True:
    try:
        age = int(input("Enter your age: "))
        break
    except ValueError:
        print("Please enter a whole number.")

print(f"Welcome {name}, age {age}")`,
      description: "Presence, length, and type checks — all common in OCR exam questions."
    },
    {
      title: "Authentication System",
      code: `stored_username = "admin"
stored_password = "pass123"
max_attempts = 3
attempts = 0

while attempts < max_attempts:
    username = input("Username: ")
    password = input("Password: ")
    
    if username == stored_username and password == stored_password:
        print("Login successful! Welcome.")
        break
    else:
        attempts += 1
        remaining = max_attempts - attempts
        if remaining > 0:
            print(f"Incorrect. {remaining} attempts remaining.")
        
if attempts == max_attempts:
    print("Account locked. Too many failed attempts.")`,
      description: "A login system with limited attempts — a classic OCR exam question."
    },
    {
      title: "Test Data Planning",
      code: `# Program to validate: age must be 0-120
def validate_age(age):
    return 0 <= age <= 120

# Test data examples:
# NORMAL data (typical valid input)
print("Normal test (25):", validate_age(25))   # True
print("Normal test (65):", validate_age(65))   # True

# BOUNDARY data (edge cases)
print("Boundary test (0):", validate_age(0))    # True
print("Boundary test (120):", validate_age(120)) # True
print("Boundary test (-1):", validate_age(-1))   # False
print("Boundary test (121):", validate_age(121)) # False

# ERRONEOUS data (invalid input)
# Would also test: "abc", "", None (handled by try/except)`,
      description: "Normal, boundary, and erroneous test data — required for OCR J277."
    }
  ],
  keyPoints: [
    "Defensive design anticipates problems and handles them gracefully.",
    "5 validation types: Range check, Length check, Presence check, Type check, Format check.",
    "Use while loops for validation — keep asking until input is valid.",
    "Authentication verifies identity using username/password with limited attempts.",
    "3 types of test data: Normal (valid), Boundary (edge cases), Erroneous (invalid).",
    "try/except handles type errors when casting user input.",
    "Always give clear error messages telling the user what went wrong."
  ],
  commonMistakes: [
    { mistake: "Using an if statement instead of a while loop for validation", fix: "Use while — if only checks once, while keeps asking until valid." },
    { mistake: "Not handling the case where all login attempts are used", fix: "After the while loop, check if attempts == max_attempts and lock the account." },
    { mistake: "Only testing with normal data and missing edge cases", fix: "Always test with boundary values (0, max) and erroneous data ('abc', -1)." },
    { mistake: "Forgetting the try/except for type validation", fix: "Wrap int(input()) in try/except ValueError to catch non-numeric input." }
  ],
  workedExample: {
    title: "Robust Score Entry System",
    problem: "Create a program that asks for 3 test scores (0-100). Validate each score using range and type checking. Calculate and display the average. Include proper error handling.",
    solution: "Use nested validation with try/except for type checking and a while loop for range checking.",
    code: `scores = []

for i in range(3):
    while True:
        try:
            score = int(input(f"Enter score {i+1} (0-100): "))
            if 0 <= score <= 100:
                scores.append(score)
                break
            else:
                print("Score must be between 0 and 100.")
        except ValueError:
            print("Please enter a whole number.")

average = sum(scores) / len(scores)
print(f"\\nScores: {scores}")
print(f"Average: {average:.1f}")
if average >= 50:
    print("Result: PASS")
else:
    print("Result: FAIL")`
  },
  videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
  quiz: [
    { question: "What is the purpose of input validation?", options: ["To make programs run faster", "To ensure user input is sensible before using it", "To encrypt the data", "To format the output"], correctIndex: 1, explanation: "Input validation checks that data entered by the user is reasonable and within expected bounds.", hint: "What could go wrong if you trust all user input?", difficulty: "easy" },
    { question: "Which type of check ensures a value is between 1 and 100?", options: ["Length check", "Presence check", "Range check", "Format check"], correctIndex: 2, explanation: "A range check verifies that a value falls within minimum and maximum limits.", hint: "The check name describes its purpose — checking a range of values.", difficulty: "easy" },
    { question: "Why use a while loop instead of an if statement for validation?", options: ["while loops are faster", "while loops keep asking until valid input is given", "if statements don't work with input()", "There is no difference"], correctIndex: 1, explanation: "A while loop repeats the prompt until the user provides valid data. An if only checks once.", hint: "What happens if the user enters invalid data a second time?", difficulty: "medium" },
    { question: "What are the three types of test data you should use?", options: ["Small, medium, large", "Normal, boundary, erroneous", "Input, process, output", "Integer, float, string"], correctIndex: 1, explanation: "Normal (typical valid), Boundary (edge cases), and Erroneous (invalid) test data covers all scenarios.", hint: "One tests typical use, one tests limits, one tests invalid input.", difficulty: "medium" },
    { question: "In a login system with max 3 attempts, what should happen after 3 failures?", options: ["Ask again", "Show the correct password", "Lock the account", "Delete the account"], correctIndex: 2, explanation: "After exhausting all attempts, the account should be locked to prevent brute-force attacks.", hint: "Think about security — what stops someone trying forever?", difficulty: "easy" },
    { question: "Which boundary test values would you use for a field accepting ages 0-120?", options: ["0, 60, 120", "-1, 0, 120, 121", "1, 50, 100", "0 and 120 only"], correctIndex: 1, explanation: "Boundary testing checks values at and just outside the limits: -1 (just below), 0 (lower bound), 120 (upper bound), 121 (just above).", hint: "Test the exact boundaries AND just outside them.", difficulty: "hard" },
    { question: "OCR exam: What exception type catches non-numeric input to int()?", options: ["TypeError", "InputError", "ValueError", "NumberError"], correctIndex: 2, explanation: "int('hello') raises a ValueError because the string cannot be converted to an integer.", hint: "The error is about the value not being valid for conversion.", difficulty: "medium" },
    { question: "What is authentication?", options: ["Checking if data is valid", "Verifying a user's identity", "Encrypting passwords", "Testing a program"], correctIndex: 1, explanation: "Authentication verifies who a user is, typically through username and password.", hint: "It's about proving you are who you say you are.", difficulty: "easy" }
  ]
};
