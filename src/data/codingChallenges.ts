export type ChallengeDifficulty = "beginner" | "intermediate" | "hard";

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  starterCode: string;
  expectedOutput?: string;
  hints: string[];
  examStyle?: boolean;
  ocrRef?: string;
}

// Challenges mapped to topic slugs
export const topicChallenges: Record<string, CodingChallenge[]> = {
  "intro-to-python": [
    { id: "intro-1", title: "Hello World", description: "Write a program that prints 'Hello, World!' to the screen.", difficulty: "beginner", starterCode: `# Print a greeting message\n`, expectedOutput: "Hello, World!", hints: ["Use the print() function", "Put text inside quotes"], examStyle: false },
    { id: "intro-2", title: "Personal Info Display", description: "Create variables for your name, age, and favourite subject. Print them in a formatted sentence.", difficulty: "beginner", starterCode: `# Create three variables and print a message\nname = \nage = \nsubject = \n`, hints: ["Assign values with =", "Use f-strings: f\"My name is {name}\""], examStyle: false },
    { id: "intro-3", title: "OCR Exam: Program Output", description: "What will this program output? Write the answer as a comment, then verify by running it.\n\nx = 5\ny = 3\nprint(x + y)\nprint(x * y)\nx = x + 1\nprint(x)", difficulty: "intermediate", starterCode: `# First predict the output, then run to check\nx = 5\ny = 3\nprint(x + y)\nprint(x * y)\nx = x + 1\nprint(x)`, hints: ["Work through line by line", "x changes value on line 5"], examStyle: true, ocrRef: "2.2" },
  ],
  "variables-data-types": [
    { id: "var-1", title: "Swap Two Variables", description: "Swap the values of two variables without using a third variable.", difficulty: "beginner", starterCode: `a = 10\nb = 20\nprint(f"Before: a={a}, b={b}")\n\n# Swap them here\n\nprint(f"After: a={a}, b={b}")`, hints: ["Python allows: a, b = b, a", "Or use a temp variable"], examStyle: false },
    { id: "var-2", title: "Temperature Converter", description: "Convert a temperature from Celsius to Fahrenheit. Formula: F = (C × 9/5) + 32", difficulty: "beginner", starterCode: `celsius = 25\n\n# Convert to Fahrenheit\n\nprint(f"{celsius}°C = {fahrenheit}°F")`, hints: ["Use the formula: F = (C * 9/5) + 32", "Store the result in a variable called fahrenheit"], examStyle: false },
    { id: "var-3", title: "OCR Exam: Data Types", description: "A student writes this code. Identify the data type of each variable and fix any errors.\n\nname = Alice\nage = \"16\"\nheight = 1.65\nis_student = true", difficulty: "intermediate", starterCode: `# Fix the errors in this code\nname = Alice\nage = "16"\nheight = 1.65\nis_student = true\n\n# Print each variable and its type\nprint(type(name))\nprint(type(age))\nprint(type(height))\nprint(type(is_student))`, hints: ["Strings need quotes", "Boolean values are True/False (capital T/F)", "age should probably be an integer"], examStyle: true, ocrRef: "2.2" },
    { id: "var-4", title: "OCR Exam: Casting Challenge", description: "Write a program that takes a decimal number as input, converts it to an integer, and displays both values.", difficulty: "hard", starterCode: `# Get a decimal number and show it as both float and int\n`, hints: ["Use float() to convert input", "Use int() to truncate", "int() truncates, it doesn't round"], examStyle: true, ocrRef: "2.2" },
  ],
  "arithmetic-operators": [
    { id: "arith-1", title: "Calculator", description: "Create a simple calculator that performs +, -, *, / on two numbers.", difficulty: "beginner", starterCode: `num1 = 15\nnum2 = 4\n\n# Show all four operations\n`, hints: ["Use +, -, *, /", "Use // for integer division and % for remainder"], examStyle: false },
    { id: "arith-2", title: "Exam: DIV and MOD", description: "Given the number 157, use integer division (//) and modulus (%) to extract the hundreds, tens, and units digits.", difficulty: "intermediate", starterCode: `number = 157\n\n# Extract each digit using // and %\nhundreds = \ntens = \nunits = \n\nprint(f"Hundreds: {hundreds}")\nprint(f"Tens: {tens}")\nprint(f"Units: {units}")`, hints: ["hundreds = number // 100", "For tens: first remove hundreds, then // 10", "units = number % 10"], examStyle: true, ocrRef: "2.2" },
    { id: "arith-3", title: "OCR Exam: Time Converter", description: "Write a program that converts a total number of seconds into hours, minutes, and remaining seconds. Use only // and %.", difficulty: "hard", starterCode: `total_seconds = 7384\n\n# Convert to hours, minutes, seconds using // and %\n\nprint(f"{total_seconds} seconds = {hours}h {minutes}m {seconds}s")`, hints: ["hours = total_seconds // 3600", "remaining = total_seconds % 3600", "minutes = remaining // 60"], examStyle: true, ocrRef: "2.2" },
  ],
  "selection-if-else": [
    { id: "sel-1", title: "Grade Calculator", description: "Write a program that converts a score (0-100) into a grade: A (≥70), B (≥60), C (≥50), D (≥40), U (<40).", difficulty: "beginner", starterCode: `score = 72\n\n# Determine the grade\n`, hints: ["Use if/elif/else", "Check from highest to lowest", "The order of conditions matters"], examStyle: false },
    { id: "sel-2", title: "Leap Year Checker", description: "Determine if a year is a leap year. Rules: divisible by 4, except centuries unless also divisible by 400.", difficulty: "intermediate", starterCode: `year = 2024\n\n# Check if leap year\n`, hints: ["if year % 400 == 0: leap year", "elif year % 100 == 0: not leap year", "elif year % 4 == 0: leap year"], examStyle: false },
    { id: "sel-3", title: "OCR Exam: Ticket Pricing", description: "A cinema charges: Child (under 12) £5, Teen (12-17) £7.50, Adult (18-64) £10, Senior (65+) £6. Write a program that asks for age and displays the price.", difficulty: "hard", starterCode: `age = int(input("Enter age: "))\n\n# Calculate and display ticket price\n`, hints: ["Use if/elif/else with age ranges", "Remember to handle all age groups", "Use comparison operators: <, >="], examStyle: true, ocrRef: "2.2" },
  ],
  "string-handling": [
    { id: "str-1", title: "String Basics", description: "Given a name, print its length, first character, last character, and the name in uppercase.", difficulty: "beginner", starterCode: `name = "Python"\n\n# Print length, first char, last char, uppercase\n`, hints: ["len(name) for length", "name[0] for first, name[-1] for last", "name.upper() for uppercase"], examStyle: false },
    { id: "str-2", title: "Email Validator", description: "Check if a string contains '@' and '.' and is at least 5 characters long.", difficulty: "intermediate", starterCode: `email = "test@example.com"\n\n# Validate the email\n`, hints: ["Use 'in' to check for characters", "Use len() for length check", "Combine conditions with 'and'"], examStyle: false },
    { id: "str-3", title: "OCR Exam: Initials Extractor", description: "Write a program that takes a full name and returns the initials. E.g., 'John Smith' → 'JS'.", difficulty: "hard", starterCode: `full_name = input("Enter full name: ")\n\n# Extract and display initials\n`, hints: ["Use .split() to separate words", "Access first character of each word", "Loop through the split result"], examStyle: true, ocrRef: "2.2" },
  ],
  "data-types-casting": [
    { id: "cast-1", title: "Type Checker", description: "Create variables of each data type (int, float, str, bool) and print their types.", difficulty: "beginner", starterCode: `# Create one variable of each type\n\n# Print each variable and its type\n`, hints: ["Use type() to check", "int: 42, float: 3.14, str: 'hello', bool: True"], examStyle: false },
    { id: "cast-2", title: "OCR Exam: Safe Input", description: "Write a program that asks for two numbers and adds them. Handle the case where the user enters text instead of a number.", difficulty: "intermediate", starterCode: `# Get two numbers from user and add them safely\n`, hints: ["Use try/except", "Convert with int() or float()", "ValueError is raised for invalid conversions"], examStyle: true, ocrRef: "2.2" },
  ],
  "input-output-casting": [
    { id: "io-1", title: "Personal Greeter", description: "Ask for the user's name and age, then print a greeting including what year they'll turn 100.", difficulty: "beginner", starterCode: `# Ask for name and age, calculate their 100th birthday year\n`, hints: ["Use input() for both", "Cast age to int", "Calculate: 2024 + (100 - age)"], examStyle: false },
    { id: "io-2", title: "OCR Exam: Receipt Calculator", description: "Write a program that asks for 3 item prices and a discount percentage, then displays the total before and after discount.", difficulty: "hard", starterCode: `# Get 3 prices and a discount %, show before and after\n`, hints: ["Cast inputs to float", "Sum the prices", "discount_amount = total * (percentage / 100)"], examStyle: true, ocrRef: "2.2" },
  ],
  "variables-constants": [
    { id: "const-1", title: "Circle Calculator", description: "Use a constant PI = 3.14159 to calculate the area and circumference of a circle.", difficulty: "beginner", starterCode: `PI = 3.14159\nradius = 5\n\n# Calculate area and circumference\n`, hints: ["Area = PI * radius ** 2", "Circumference = 2 * PI * radius", "Constants are written in UPPERCASE"], examStyle: false },
    { id: "const-2", title: "OCR Exam: VAT Calculator", description: "Using a constant VAT_RATE = 0.20, calculate the price including VAT for 3 items.", difficulty: "intermediate", starterCode: `VAT_RATE = 0.20\n\n# Calculate prices with VAT\n`, hints: ["price_with_vat = price * (1 + VAT_RATE)", "Use a constant because VAT rate shouldn't change in the program"], examStyle: true, ocrRef: "2.2" },
  ],
  "2d-arrays": [
    { id: "2d-1", title: "Grid Display", description: "Create a 3x3 grid of numbers and display it as a formatted table.", difficulty: "beginner", starterCode: `grid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\n\n# Display as a formatted grid\n`, hints: ["Use nested for loops", "Use end=' ' to print on same line", "Use print() for a new line after each row"], examStyle: false },
    { id: "2d-2", title: "OCR Exam: Seat Booking", description: "Create a 5x4 seating plan. Allow the user to book a seat by entering row and column. Mark booked seats with 'X'.", difficulty: "intermediate", starterCode: `# Create a 5x4 seating plan with 'O' for empty seats\nseats = []\nfor i in range(5):\n    seats.append(["O"] * 4)\n\n# Display the seating plan and book a seat\n`, hints: ["Use nested loops to display", "Check if seat is already booked", "seats[row][col] = 'X' to book"], examStyle: true, ocrRef: "2.2" },
    { id: "2d-3", title: "OCR Exam: Noughts & Crosses", description: "Implement a noughts and crosses board. Allow two players to take turns placing X and O. Check for a winner after each turn.", difficulty: "hard", starterCode: `board = [[" "]*3 for _ in range(3)]\n\ndef display_board():\n    for row in board:\n        print(" | ".join(row))\n        print("---------")\n\n# Implement the game logic\ndisplay_board()`, hints: ["Track whose turn it is with a variable", "Check rows, columns, and diagonals for a win", "Validate the cell is empty before placing"], examStyle: true, ocrRef: "2.2" },
  ],
  "random-numbers": [
    { id: "rand-1", title: "Dice Roller", description: "Simulate rolling two dice and display the total.", difficulty: "beginner", starterCode: `import random\n\n# Roll two dice and show results\n`, hints: ["Use random.randint(1, 6)", "Add both dice for the total"], examStyle: false },
    { id: "rand-2", title: "OCR Exam: Random Password", description: "Generate a random password of a user-specified length using letters and numbers.", difficulty: "intermediate", starterCode: `import random\n\n# Generate a random password\nlength = int(input("Password length: "))\n`, hints: ["Create a string of possible characters", "Use random.choice() in a loop", "Include uppercase, lowercase, and digits"], examStyle: true, ocrRef: "2.2" },
    { id: "rand-3", title: "OCR Exam: Maths Quiz", description: "Create a maths quiz with 10 random questions using +, -, *. Track score and show percentage at the end.", difficulty: "hard", starterCode: `import random\n\nscore = 0\noperators = ["+", "-", "*"]\n\n# Create a 10-question maths quiz\n`, hints: ["Use random.choice(operators) for random operation", "Use eval() or if/elif to calculate the correct answer", "Keep a running score"], examStyle: true, ocrRef: "2.2" },
  ],
  "robust-programming": [
    { id: "robust-1", title: "Range Validator", description: "Ask for a number between 1 and 10. Keep asking until valid input is given.", difficulty: "beginner", starterCode: `# Get a number between 1 and 10 with validation\n`, hints: ["Use a while loop", "Check: 1 <= number <= 10", "Wrap in try/except for type checking"], examStyle: false },
    { id: "robust-2", title: "OCR Exam: Login System", description: "Create a login system with stored username/password. Allow 3 attempts before locking.", difficulty: "intermediate", starterCode: `correct_user = "admin"\ncorrect_pass = "python123"\nmax_attempts = 3\n\n# Implement the login system\n`, hints: ["Use a while loop with attempt counter", "Check both username AND password", "Lock out after max_attempts"], examStyle: true, ocrRef: "2.3" },
    { id: "robust-3", title: "OCR Exam: Robust Data Entry", description: "Create a program that collects 5 test scores (0-100). Validate each with type AND range checks. Display min, max, and average.", difficulty: "hard", starterCode: `scores = []\n\n# Collect 5 validated scores, then display statistics\n`, hints: ["Nested validation: try/except inside while loop", "Check 0 <= score <= 100", "Use min(), max(), sum()/len() for stats"], examStyle: true, ocrRef: "2.3" },
  ],
  "boolean-logic": [
    { id: "bool-1", title: "Logic Gate Simulator", description: "Simulate AND, OR, NOT gates. Ask for two inputs and show results of each gate.", difficulty: "beginner", starterCode: `# Simulate logic gates\na = True\nb = False\n\n# Show AND, OR, NOT results\n`, hints: ["Use 'and', 'or', 'not' keywords", "NOT only takes one input", "Print results in a truth table format"], examStyle: false },
    { id: "bool-2", title: "OCR Exam: Truth Table Generator", description: "Generate a complete truth table for: (A AND B) OR (NOT C)", difficulty: "intermediate", starterCode: `# Generate truth table for (A AND B) OR (NOT C)\nprint("A     | B     | C     | Result")\nprint("------+-------+-------+-------")\n`, hints: ["Use 3 nested for loops for True/False combinations", "8 rows total (2³)", "Calculate: (a and b) or (not c)"], examStyle: true, ocrRef: "2.4" },
  ],
  "insertion-sort": [
    { id: "ins-1", title: "Sort Numbers", description: "Implement insertion sort to sort a list of 7 random numbers. Print the list after each pass.", difficulty: "intermediate", starterCode: `numbers = [42, 17, 93, 8, 55, 31, 76]\n\n# Implement insertion sort with tracing\n`, hints: ["Start from index 1", "Compare key with elements to the left", "Shift elements right until correct position found"], examStyle: false },
    { id: "ins-2", title: "OCR Exam: Sort & Count", description: "Sort a list using insertion sort. Count and display the total number of comparisons and shifts made.", difficulty: "hard", starterCode: `data = [64, 34, 25, 12, 22, 11]\ncomparisons = 0\nshifts = 0\n\n# Sort and count operations\n`, hints: ["Increment comparisons each time you compare", "Increment shifts each time you move an element", "Display both counts at the end"], examStyle: true, ocrRef: "2.1" },
  ],
  "sql-basics": [
    { id: "sql-1", title: "SQL Query Writing", description: "Write the SQL to: (1) Get all records, (2) Get names where age > 16, (3) Sort by score descending. Test by simulating in Python.", difficulty: "beginner", starterCode: `# Write SQL queries as comments, then simulate in Python\n# Table: students (name, age, score)\n\nstudents = [\n    {"name": "Alice", "age": 15, "score": 88},\n    {"name": "Bob", "age": 17, "score": 72},\n    {"name": "Charlie", "age": 16, "score": 95},\n]\n\n# Query 1: SELECT * FROM students\nprint("All students:")\n`, hints: ["Use list comprehension for WHERE", "sorted() with key for ORDER BY", "Remember SQL uses <> not !="], examStyle: false },
    { id: "sql-2", title: "OCR Exam: Database Queries", description: "Given a 'products' table with columns: name, category, price — write SQL for: (1) Products under £10, (2) Products in 'Electronics' sorted by price, (3) Products whose name starts with 'S'.", difficulty: "hard", starterCode: `# Write your SQL answers as comments:\n# Query 1: Products under £10\n# \n# Query 2: Electronics sorted by price\n# \n# Query 3: Names starting with 'S'\n# \n\n# Now simulate:\nproducts = [\n    {"name": "Speaker", "category": "Electronics", "price": 29.99},\n    {"name": "Stapler", "category": "Office", "price": 5.99},\n    {"name": "Screen", "category": "Electronics", "price": 149.99},\n    {"name": "Notebook", "category": "Office", "price": 2.99},\n]\n`, hints: ["SELECT * FROM products WHERE price < 10", "Use ORDER BY price ASC", "WHERE name LIKE 'S%'"], examStyle: true, ocrRef: "2.2" },
  ],
};

// Get challenges for a topic, optionally filtered by difficulty
export function getChallengesForTopic(slug: string, difficulty?: ChallengeDifficulty): CodingChallenge[] {
  const all = topicChallenges[slug] || [];
  if (!difficulty) return all;
  return all.filter(c => c.difficulty === difficulty);
}
