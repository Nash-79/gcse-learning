import { TopicTheoryData } from "./theoryTypes";

export const paper2Theory: TopicTheoryData[] = [
  // ============================================
  // ALGORITHMS
  // ============================================
  {
    slug: "algorithms",
    title: "Algorithms",
    paper: "2",
    ocrRef: "2.1",
    icon: "🧮",
    color: "primary",
    description: "Searching, sorting, and computational thinking concepts.",
    sections: [
      {
        id: "computational-thinking",
        title: "Computational Thinking",
        icon: "🧠",
        content: "Computational thinking is the process of breaking down complex problems so they can be solved by a computer. It involves three key techniques:",
        tableData: {
          headers: ["Technique", "Description", "Example"],
          rows: [
            ["Abstraction", "Removing unnecessary details to focus on what's important", "A school attendance system tracks names and attendance — not eye colour or phone numbers"],
            ["Decomposition", "Breaking a large problem into smaller, manageable sub-problems", "A game project → player movement, scoring, graphics, sound, menus"],
            ["Algorithmic Thinking", "Creating a step-by-step solution (algorithm) to solve each sub-problem", "Writing pseudocode or a flowchart for each sub-task"],
          ],
        },
        keyTerms: [
          { term: "Abstraction", definition: "Removing unnecessary detail to focus on the important aspects of a problem" },
          { term: "Decomposition", definition: "Breaking a complex problem into smaller, manageable sub-problems" },
          { term: "Algorithmic Thinking", definition: "The ability to define clear, step-by-step instructions to solve a problem" },
          { term: "Pattern Recognition", definition: "Identifying similarities or shared features between problems to reuse solutions" },
        ],
        examTip: "In 'explain' questions, always give a specific example. Don't just say 'removing unnecessary detail' — say WHAT details are unnecessary and WHY.",
      },
      {
        id: "flowcharts-pseudocode",
        title: "Flowcharts & Pseudocode",
        icon: "📐",
        content: "Algorithms can be represented visually (flowcharts) or in structured English (pseudocode). You need to both read and create them.\n\nFlowchart symbols you MUST know:\n• Oval/Rounded rectangle — Start/End (terminator)\n• Rectangle — Process (action/calculation)\n• Diamond — Decision (Yes/No question)\n• Parallelogram — Input/Output\n• Arrow — Flow of control",
        tableData: {
          headers: ["Symbol Shape", "Name", "Purpose", "Example"],
          rows: [
            ["Oval", "Terminator", "Start or End of the algorithm", "Start / Stop"],
            ["Rectangle", "Process", "An action or calculation", "total = total + 1"],
            ["Diamond", "Decision", "A Yes/No question that branches the flow", "Is age >= 18?"],
            ["Parallelogram", "Input/Output", "Data entering or leaving the system", "Enter name / Display result"],
            ["Arrow", "Flow Line", "Shows the direction of the algorithm", "→"],
          ],
        },
        examTip: "When drawing flowcharts: use a ruler, label all arrows from decisions (Yes/No), and always include Start and Stop terminators.",
      },
      {
        id: "trace-tables",
        title: "Trace Tables",
        icon: "📊",
        content: "A trace table (dry run) shows how variable values change as an algorithm executes, step by step. Each row represents a line of code being executed.\n\nHow to complete a trace table:\n1. Create a column for each variable and one for any output\n2. Work through the algorithm line by line\n3. Only write a value when it CHANGES\n4. If a variable doesn't change on that line, leave it blank\n5. Record any output in the output column",
        codeExample: {
          language: "python",
          code: "# Trace this code:\nx = 1\nfor i in range(1, 4):\n    x = x * i\n    print(x)\n\n# Trace table:\n# | i | x | Output |\n# |---|---|--------|\n# |   | 1 |        |\n# | 1 | 1 |   1    |\n# | 2 | 2 |   2    |\n# | 3 | 6 |   6    |",
          explanation: "Each iteration, i takes the next value from range. x is multiplied by i. The output column shows what is printed.",
        },
        examTip: "Trace table questions are VERY common in Paper 2. Practice them regularly. Always include ALL variables and outputs. Work through one line at a time — don't skip ahead.",
      },
      {
        id: "exam-reference-language",
        title: "OCR Exam Reference Language",
        icon: "📝",
        content: "OCR uses its own Exam Reference Language (ERL) in exam papers. You need to be able to read and write it. It looks similar to Python but has some key differences:",
        tableData: {
          headers: ["Feature", "OCR ERL Syntax", "Python Equivalent"],
          rows: [
            ["Output", "print(\"Hello\")", "print(\"Hello\")"],
            ["Input", "name = input(\"Enter name\")", "name = input(\"Enter name: \")"],
            ["Casting", "int(\"5\")  str(5)  real(\"3.14\")", "int(\"5\")  str(5)  float(\"3.14\")"],
            ["For Loop", "for i = 0 to 9 ... next i", "for i in range(0, 10):"],
            ["While Loop", "while condition ... endwhile", "while condition:"],
            ["If Statement", "if ... then ... elseif ... else ... endif", "if ... : ... elif ... : ... else:"],
            ["Function", "function name(params) ... return ... endfunction", "def name(params): ... return ..."],
            ["Procedure", "procedure name(params) ... endprocedure", "def name(params):"],
            ["Array", "array name[size]", "name = []"],
            ["File Read", "openRead(\"file.txt\")", "open(\"file.txt\", \"r\")"],
            ["File Write", "openWrite(\"file.txt\")", "open(\"file.txt\", \"w\")"],
            ["String Length", "name.length", "len(name)"],
            ["Substring", "name.substring(0, 4)", "name[0:4]"],
            ["Random", "random(1, 10)", "import random; random.randint(1, 10)"],
          ],
        },
        examTip: "You can answer code questions in EITHER ERL or Python — but be consistent within one answer. Don't mix them!",
      },
      {
        id: "what-is-algorithm",
        title: "What Is an Algorithm?",
        icon: "📝",
        content: "An algorithm is a step-by-step set of instructions to solve a problem or complete a task. Algorithms can be represented as:\n\n• Pseudocode — structured English-like instructions\n• Flowcharts — visual diagrams using standard symbols\n• Program code — actual code in a programming language\n\nGood algorithms are: unambiguous, finite (they terminate), effective (each step is doable), and produce correct output.",
        keyTerms: [
          { term: "Algorithm", definition: "A finite sequence of well-defined instructions to solve a problem" },
          { term: "Pseudocode", definition: "Structured English used to describe algorithms without specific programming syntax" },
          { term: "Flowchart", definition: "A diagram using standard shapes to represent an algorithm's steps and decisions" },
          { term: "Decomposition", definition: "Breaking a complex problem into smaller, manageable sub-problems" },
          { term: "Abstraction", definition: "Removing unnecessary detail to focus on the important aspects of a problem" },
        ],
      },
      {
        id: "linear-search",
        title: "Linear Search",
        icon: "🔍",
        content: "Linear search checks each item in a list one by one until the target is found or the end of the list is reached.\n\nHow it works:\n1. Start at the first element\n2. Compare with the target value\n3. If it matches, return the position\n4. If not, move to the next element\n5. Repeat until found or end of list\n\nTime complexity: O(n) — in the worst case, every element must be checked.",
        codeExample: {
          language: "python",
          code: "def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i  # Found at index i\n    return -1  # Not found\n\n# Example\nnumbers = [4, 7, 2, 9, 1, 5]\nresult = linear_search(numbers, 9)\nprint(f\"Found at index: {result}\")  # Output: Found at index: 3",
          explanation: "The function loops through each element. If the target is found, it returns the index. If the loop finishes without finding it, it returns -1.",
        },
        keyTerms: [
          { term: "Linear Search", definition: "A search algorithm that checks each element sequentially until the target is found" },
          { term: "Time Complexity", definition: "A measure of how the running time of an algorithm grows with input size" },
        ],
        comparisonData: {
          itemA: { title: "✅ Advantages", points: ["Works on unsorted data", "Simple to understand and implement", "Efficient for small lists", "No pre-processing needed"] },
          itemB: { title: "❌ Disadvantages", points: ["Slow for large datasets — O(n)", "Has to check every element in worst case", "Inefficient compared to binary search on sorted data", "Performance degrades linearly with size"] },
        },
      },
      {
        id: "binary-search",
        title: "Binary Search",
        icon: "✂️",
        content: "Binary search repeatedly halves the search space by comparing the middle element. It requires a SORTED list.\n\nHow it works:\n1. Find the middle element\n2. If it matches the target, return it\n3. If the target is LESS, search the LEFT half\n4. If the target is GREATER, search the RIGHT half\n5. Repeat until found or the sublist is empty\n\nTime complexity: O(log n) — much faster than linear for large lists.",
        codeExample: {
          language: "python",
          code: "def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    \n    while low <= high:\n        mid = (low + high) // 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Example (list MUST be sorted)\nnumbers = [1, 3, 5, 7, 9, 11, 13, 15]\nresult = binary_search(numbers, 7)\nprint(f\"Found at index: {result}\")  # Output: Found at index: 3",
          explanation: "Each iteration halves the search space. For a list of 1000 items, binary search needs at most 10 comparisons vs 1000 for linear search.",
        },
        examTip: "ALWAYS state that binary search requires a SORTED list. This is a key prerequisite that often earns a mark.",
      },
      {
        id: "bubble-sort",
        title: "Bubble Sort",
        icon: "🫧",
        content: "Bubble sort repeatedly compares adjacent pairs and swaps them if they're in the wrong order. The largest values 'bubble' to the end.\n\nHow it works:\n1. Compare the first two adjacent elements\n2. If they're in the wrong order, swap them\n3. Move to the next pair and repeat\n4. After one pass, the largest element is at the end\n5. Repeat passes until no swaps are needed\n\nTime complexity: O(n²) — inefficient for large datasets.",
        codeExample: {
          language: "python",
          code: "def bubble_sort(data):\n    n = len(data)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - 1 - i):\n            if data[j] > data[j + 1]:\n                data[j], data[j + 1] = data[j + 1], data[j]\n                swapped = True\n        if not swapped:\n            break  # Already sorted\n    return data\n\nnumbers = [64, 34, 25, 12, 22, 11, 90]\nprint(bubble_sort(numbers))",
          explanation: "The outer loop runs n-1 passes. The inner loop compares adjacent pairs. The 'swapped' flag optimises by stopping early if already sorted.",
        },
      },
      {
        id: "insertion-sort",
        title: "Insertion Sort",
        icon: "📥",
        content: "Insertion sort builds a sorted portion one element at a time, like sorting playing cards in your hand.\n\nHow it works:\n1. Take the next unsorted element (the 'key')\n2. Compare it with elements in the sorted portion\n3. Shift larger elements right to make space\n4. Insert the key in its correct position\n5. Repeat until all elements are sorted\n\nTime complexity: O(n²) worst case, but O(n) for nearly-sorted data.",
        codeExample: {
          language: "python",
          code: "def insertion_sort(data):\n    for i in range(1, len(data)):\n        key = data[i]\n        j = i - 1\n        while j >= 0 and data[j] > key:\n            data[j + 1] = data[j]\n            j -= 1\n        data[j + 1] = key\n    return data\n\nnumbers = [12, 11, 13, 5, 6]\nprint(insertion_sort(numbers))  # [5, 6, 11, 12, 13]",
          explanation: "Starting from the second element, each 'key' is compared backwards through the sorted portion. Larger elements shift right until the correct position is found.",
        },
        comparisonData: {
          itemA: { title: "Bubble Sort", points: ["Compares adjacent pairs", "Swaps if in wrong order", "Simple to understand", "O(n²) time complexity", "Large values 'bubble' to the end", "Can detect sorted list early (with flag)"] },
          itemB: { title: "Insertion Sort", points: ["Takes next unsorted element", "Inserts into correct position in sorted portion", "Like sorting cards in your hand", "O(n²) worst, O(n) for nearly sorted", "Efficient for small/nearly sorted lists", "Generally faster than bubble sort in practice"] },
        },
      },
    ],
  },

  // ============================================
  // PROGRAMMING FUNDAMENTALS
  // ============================================
  {
    slug: "programming-fundamentals",
    title: "Programming Fundamentals",
    paper: "2",
    ocrRef: "2.2",
    icon: "💻",
    color: "secondary",
    description: "Variables, data types, operators, selection, iteration, arrays, and subroutines.",
    sections: [
      {
        id: "variables-constants",
        title: "Variables & Constants",
        icon: "📦",
        content: "A variable is a named location in memory that stores a value which can change during program execution. A constant stores a value that cannot change once set.\n\nIn Python, constants are written in UPPER_CASE by convention (though Python doesn't enforce this).",
        codeExample: {
          language: "python",
          code: "# Variables — value CAN change\nname = \"Alice\"\nage = 15\nage = 16  # Value changed\n\n# Constants — value SHOULD NOT change\nPI = 3.14159\nMAX_ATTEMPTS = 3\nSCHOOL_NAME = \"Greenfield Academy\"",
          explanation: "Variables use lowercase/camelCase. Constants use UPPER_CASE to show they shouldn't be changed.",
        },
        keyTerms: [
          { term: "Variable", definition: "A named memory location whose value can change during execution" },
          { term: "Constant", definition: "A named value that remains fixed throughout program execution" },
          { term: "Assignment", definition: "Setting the value of a variable using the = operator" },
          { term: "Identifier", definition: "The name given to a variable, constant, function, or other element" },
        ],
      },
      {
        id: "data-types",
        title: "Data Types & Casting",
        icon: "🏷️",
        content: "Every piece of data has a type that determines what operations can be performed on it.",
        tableData: {
          headers: ["Data Type", "Description", "Python Example", "OCR Pseudocode"],
          rows: [
            ["Integer", "Whole number (positive or negative)", "age = 15", "age = 15"],
            ["Float/Real", "Decimal number", "price = 9.99", "price = 9.99"],
            ["String", "Text (sequence of characters)", "name = \"Alice\"", "name = \"Alice\""],
            ["Boolean", "True or False", "found = True", "found = TRUE"],
            ["Character", "Single character", "grade = 'A'", "grade = 'A'"],
          ],
        },
        codeExample: {
          language: "python",
          code: "# Casting — converting between types\nnum_str = \"42\"\nnum_int = int(num_str)    # String → Integer\nnum_float = float(\"3.14\") # String → Float\ntext = str(100)           # Integer → String\n\n# Input always returns a string!\nage = input(\"Enter age: \")  # Returns \"15\" (string)\nage = int(input(\"Enter age: \"))  # Converts to integer",
          explanation: "Casting is essential when using input() because it always returns a string. Without casting, 5 + 5 would give '55' instead of 10.",
        },
        examTip: "The most common mistake: forgetting to cast input(). Always wrap with int() or float() for numbers.",
      },
      {
        id: "operators",
        title: "Operators",
        icon: "➕",
        content: "Python supports several types of operators for calculations and comparisons.",
        tableData: {
          headers: ["Operator", "Name", "Example", "Result"],
          rows: [
            ["+", "Addition", "5 + 3", "8"],
            ["-", "Subtraction", "10 - 4", "6"],
            ["*", "Multiplication", "3 * 7", "21"],
            ["/", "Division (float)", "10 / 3", "3.333..."],
            ["//", "Integer Division (DIV)", "10 // 3", "3"],
            ["%", "Modulus (MOD)", "10 % 3", "1"],
            ["**", "Exponent (power)", "2 ** 3", "8"],
            ["==", "Equal to", "5 == 5", "True"],
            ["!=", "Not equal to", "5 != 3", "True"],
            [">", "Greater than", "7 > 3", "True"],
            ["<", "Less than", "2 < 8", "True"],
            [">=", "Greater than or equal", "5 >= 5", "True"],
            ["<=", "Less than or equal", "3 <= 7", "True"],
          ],
        },
        examTip: "DIV (//) gives the whole number quotient. MOD (%) gives the remainder. These are heavily tested in OCR exams!",
      },
      {
        id: "selection",
        title: "Selection (If/Elif/Else)",
        icon: "🔀",
        content: "Selection allows a program to make decisions and execute different code based on conditions.",
        codeExample: {
          language: "python",
          code: "# Simple if/else\nage = int(input(\"Enter your age: \"))\nif age >= 18:\n    print(\"Adult\")\nelif age >= 13:\n    print(\"Teenager\")\nelse:\n    print(\"Child\")\n\n# Nested selection\nscore = int(input(\"Enter score: \"))\nif score >= 50:\n    if score >= 80:\n        print(\"Distinction\")\n    else:\n        print(\"Pass\")\nelse:\n    print(\"Fail\")",
          explanation: "If the condition is True, that block runs. Elif checks additional conditions. Else catches everything else. Conditions are checked top-to-bottom.",
        },
      },
      {
        id: "iteration",
        title: "Iteration (Loops)",
        icon: "🔁",
        content: "Iteration means repeating a block of code. Python has two main loop types:\n\n• FOR loop — count-controlled (repeats a known number of times)\n• WHILE loop — condition-controlled (repeats while a condition is true)",
        codeExample: {
          language: "python",
          code: "# FOR loop — known number of iterations\nfor i in range(5):        # 0, 1, 2, 3, 4\n    print(i)\n\nfor i in range(1, 11):    # 1 to 10\n    print(i)\n\nfor i in range(0, 20, 2): # 0, 2, 4, ... 18 (step 2)\n    print(i)\n\n# WHILE loop — unknown number of iterations\npassword = \"\"\nwhile password != \"secret\":\n    password = input(\"Enter password: \")\nprint(\"Access granted!\")\n\n# WHILE with counter\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1",
          explanation: "Use FOR when you know how many times to repeat. Use WHILE when you need to repeat until a condition changes.",
        },
        comparisonData: {
          itemA: { title: "FOR Loop", points: ["Count-controlled iteration", "Repeats a known number of times", "Uses range() in Python", "Counter variable is automatic", "Example: printing 1 to 10", "OCR: FOR i = 0 TO 9"] },
          itemB: { title: "WHILE Loop", points: ["Condition-controlled iteration", "Repeats until condition is False", "Must update condition or infinite loop!", "Need to manage counter manually", "Example: password validation", "OCR: WHILE condition"] },
        },
      },
      {
        id: "arrays-lists",
        title: "Arrays, Lists & Dictionaries",
        icon: "📋",
        content: "Data structures allow you to store multiple values together.",
        codeExample: {
          language: "python",
          code: "# Lists (arrays in OCR terminology)\nfruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits[0])      # \"apple\" (0-indexed)\nfruits.append(\"date\") # Add to end\nfruits.remove(\"banana\") # Remove item\nprint(len(fruits))    # Length: 3\n\n# 2D Array (list of lists)\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6],\n    [7, 8, 9]\n]\nprint(grid[1][2])  # Row 1, Col 2 = 6\n\n# Dictionary (key-value pairs)\nstudent = {\n    \"name\": \"Alice\",\n    \"age\": 15,\n    \"grade\": \"A\"\n}\nprint(student[\"name\"])  # \"Alice\"",
          explanation: "Lists are ordered, 0-indexed collections. 2D arrays are lists within lists. Dictionaries store key-value pairs for fast lookup.",
        },
      },
      {
        id: "subroutines",
        title: "Subroutines: Functions & Procedures",
        icon: "🧩",
        content: "Subroutines are named blocks of reusable code. They help break programs into smaller, manageable parts.",
        codeExample: {
          language: "python",
          code: "# Procedure — does something, returns nothing\ndef greet(name):\n    print(f\"Hello, {name}!\")\n\ngreet(\"Alice\")  # Output: Hello, Alice!\n\n# Function — returns a value\ndef calculate_area(length, width):\n    area = length * width\n    return area\n\nresult = calculate_area(5, 3)\nprint(f\"Area: {result}\")  # Output: Area: 15\n\n# Scope — local vs global variables\ntotal = 0  # Global variable\n\ndef add_score(points):\n    global total\n    total += points  # Modifies global\n    local_var = \"I only exist here\"  # Local",
          explanation: "Functions return values; procedures don't. Parameters pass data in. Local variables only exist inside their subroutine. Global variables are accessible everywhere.",
        },
        keyTerms: [
          { term: "Subroutine", definition: "A named block of code that can be called from other parts of the program" },
          { term: "Function", definition: "A subroutine that returns a value" },
          { term: "Procedure", definition: "A subroutine that performs a task but does not return a value" },
          { term: "Parameter", definition: "A variable in a subroutine definition that receives a value when called" },
          { term: "Argument", definition: "The actual value passed to a subroutine when it is called" },
          { term: "Local Variable", definition: "A variable only accessible within the subroutine where it is declared" },
          { term: "Global Variable", definition: "A variable accessible from anywhere in the program" },
        ],
      },
      {
        id: "file-handling",
        title: "File Handling",
        icon: "📁",
        content: "Programs need to read from and write to files for permanent data storage.",
        codeExample: {
          language: "python",
          code: "# Reading a file\nwith open(\"data.txt\", \"r\") as file:\n    content = file.read()        # Read entire file\n    # OR\n    lines = file.readlines()     # Read as list of lines\n    # OR\n    for line in file:            # Read line by line\n        print(line.strip())\n\n# Writing to a file (overwrites)\nwith open(\"output.txt\", \"w\") as file:\n    file.write(\"Hello World\\n\")\n    file.write(\"Line 2\\n\")\n\n# Appending to a file (adds to end)\nwith open(\"log.txt\", \"a\") as file:\n    file.write(\"New entry\\n\")",
          explanation: "'r' = read, 'w' = write (overwrites), 'a' = append. Using 'with' automatically closes the file. The .strip() method removes trailing newline characters.",
        },
        tableData: {
          headers: ["Mode", "Description", "File Exists?", "File Doesn't Exist?"],
          rows: [
            ["\"r\"", "Read only", "Opens for reading", "Error"],
            ["\"w\"", "Write (overwrite)", "Overwrites contents", "Creates new file"],
            ["\"a\"", "Append", "Adds to end", "Creates new file"],
          ],
        },
      },
    ],
  },

  // ============================================
  // PRODUCING ROBUST PROGRAMS
  // ============================================
  {
    slug: "producing-robust-programs",
    title: "Producing Robust Programs",
    paper: "2",
    ocrRef: "2.3",
    icon: "🛡️",
    color: "accent",
    description: "Input validation, testing, error handling, and defensive design.",
    sections: [
      {
        id: "defensive-design",
        title: "Defensive Design",
        icon: "🏰",
        content: "Defensive design means writing code that anticipates and handles potential problems. A robust program should handle unexpected inputs and situations gracefully.\n\nKey principles:\n• Input validation — check all user inputs before processing\n• Authentication — verify user identity\n• Error handling — catch and manage errors\n• Maintainability — write readable, well-structured code\n• Comments — explain complex logic\n• Indentation — consistent code structure",
        keyTerms: [
          { term: "Robust", definition: "A program that handles errors and unexpected inputs without crashing" },
          { term: "Input Validation", definition: "Checking that data entered meets specified criteria before processing" },
          { term: "Authentication", definition: "Verifying the identity of a user (e.g., username + password)" },
          { term: "Maintainability", definition: "How easy it is to read, understand, and modify code" },
        ],
        codeExample: {
          language: "python",
          code: "# Input validation example\ndef get_valid_age():\n    while True:\n        try:\n            age = int(input(\"Enter age (0-120): \"))\n            if 0 <= age <= 120:\n                return age\n            else:\n                print(\"Age must be between 0 and 120.\")\n        except ValueError:\n            print(\"Please enter a valid number.\")\n\n# Authentication example\ndef login():\n    MAX_ATTEMPTS = 3\n    for attempt in range(MAX_ATTEMPTS):\n        username = input(\"Username: \")\n        password = input(\"Password: \")\n        if username == \"admin\" and password == \"pass123\":\n            print(\"Login successful!\")\n            return True\n        print(f\"Invalid. {MAX_ATTEMPTS - attempt - 1} attempts left.\")\n    print(\"Account locked.\")\n    return False",
          explanation: "The validation loop keeps asking until valid input is received. The login system limits attempts to prevent brute force attacks.",
        },
      },
      {
        id: "testing",
        title: "Testing Strategies",
        icon: "🧪",
        content: "Testing ensures a program works correctly. Three types of test data should be used:",
        tableData: {
          headers: ["Test Type", "Purpose", "Example (age 0-120)", "Expected Result"],
          rows: [
            ["Normal", "Typical valid data that should be accepted", "25, 50, 70", "Accepted"],
            ["Boundary", "Values at the edge of valid ranges", "0, 1, 119, 120", "Accepted (at limits)"],
            ["Erroneous", "Invalid data that should be rejected", "-5, 121, \"hello\", 3.5", "Rejected with error message"],
          ],
        },
        examTip: "For boundary testing, always test BOTH sides of the boundary. For range 0-120: test -1, 0, 120, 121.",
        codeExample: {
          language: "python",
          code: "# Testing a grade function\ndef get_grade(score):\n    if score >= 80: return \"A\"\n    elif score >= 60: return \"B\"\n    elif score >= 40: return \"C\"\n    else: return \"Fail\"\n\n# Test plan:\n# Normal:    get_grade(75) → \"B\"  ✓\n# Boundary:  get_grade(80) → \"A\"  ✓\n# Boundary:  get_grade(79) → \"B\"  ✓\n# Erroneous: get_grade(-1) → \"Fail\" ✓\n# Erroneous: get_grade(\"abc\") → Error!",
          explanation: "A good test plan tests normal, boundary, and erroneous data. The erroneous test reveals we need error handling for non-numeric input.",
        },
      },
      {
        id: "errors",
        title: "Types of Error",
        icon: "🐛",
        content: "Programs can contain three types of error:",
        tableData: {
          headers: ["Error Type", "What It Is", "When Detected", "Example"],
          rows: [
            ["Syntax Error", "Code breaks the rules of the language", "Before/during execution (by translator)", "print(\"hello\" — missing closing bracket"],
            ["Logic Error", "Code runs but produces wrong results", "During testing (by programmer)", "average = total * count instead of total / count"],
            ["Runtime Error", "Error occurs while program is running", "During execution", "Dividing by zero, file not found, index out of range"],
          ],
        },
        codeExample: {
          language: "python",
          code: "# Error handling with try/except\ntry:\n    num = int(input(\"Enter a number: \"))\n    result = 100 / num\n    print(f\"Result: {result}\")\nexcept ValueError:\n    print(\"That's not a valid number!\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")\nexcept Exception as e:\n    print(f\"An error occurred: {e}\")\nfinally:\n    print(\"Program complete.\")",
          explanation: "try/except catches runtime errors before they crash the program. Different except blocks handle different error types. 'finally' always runs.",
        },
      },
    ],
  },

  // ============================================
  // BOOLEAN LOGIC
  // ============================================
  {
    slug: "boolean-logic",
    title: "Boolean Logic",
    paper: "2",
    ocrRef: "2.4",
    icon: "🔲",
    color: "primary",
    description: "Logic gates, truth tables, and Boolean expressions.",
    sections: [
      {
        id: "logic-gates",
        title: "Logic Gates & Truth Tables",
        icon: "⚡",
        content: "Boolean logic uses TRUE (1) and FALSE (0) values. Logic gates perform operations on these values. There are three fundamental gates you need to know:",
        tableData: {
          headers: ["Gate", "Symbol", "Rule", "Expression"],
          rows: [
            ["AND", "∧", "Output is 1 only if BOTH inputs are 1", "A AND B"],
            ["OR", "∨", "Output is 1 if EITHER or BOTH inputs are 1", "A OR B"],
            ["NOT", "¬", "Output is the OPPOSITE of the input", "NOT A"],
          ],
        },
        keyTerms: [
          { term: "Logic Gate", definition: "An electronic circuit that performs a Boolean operation on one or more inputs" },
          { term: "Truth Table", definition: "A table showing all possible input combinations and their corresponding outputs" },
          { term: "Boolean Expression", definition: "A mathematical expression that evaluates to either True or False" },
        ],
        examTip: "Draw truth tables systematically — list ALL input combinations. For 2 inputs: 4 rows (00, 01, 10, 11). For 3 inputs: 8 rows.",
      },
      {
        id: "truth-tables",
        title: "Complete Truth Tables",
        icon: "📊",
        content: "Here are the complete truth tables for all three gates:",
        tableData: {
          headers: ["A", "B", "A AND B", "A OR B", "NOT A"],
          rows: [
            ["0", "0", "0", "0", "1"],
            ["0", "1", "0", "1", "1"],
            ["1", "0", "0", "1", "0"],
            ["1", "1", "1", "1", "0"],
          ],
        },
        codeExample: {
          language: "python",
          code: "# Boolean operators in Python\na = True\nb = False\n\nprint(a and b)   # False (AND)\nprint(a or b)    # True  (OR)\nprint(not a)     # False (NOT)\n\n# Combining gates\n# Expression: (A AND B) OR (NOT C)\nA, B, C = True, True, False\nresult = (A and B) or (not C)\nprint(result)  # True",
          explanation: "Python uses 'and', 'or', 'not' keywords for Boolean operations. These map directly to AND, OR, NOT logic gates.",
        },
      },
      {
        id: "boolean-expressions",
        title: "Building Boolean Expressions",
        icon: "🔧",
        content: "Boolean expressions combine logic gates to create more complex conditions. You need to be able to:\n\n1. Read a description and write the Boolean expression\n2. Create truth tables for combined expressions\n3. Trace through logic circuits\n\nExample: \"The alarm (Q) sounds if the door is open (D) AND the system is armed (A), OR if the panic button (P) is pressed.\"\n\nExpression: Q = (D AND A) OR P",
        codeExample: {
          language: "python",
          code: "# Alarm system example\ndef check_alarm(door_open, system_armed, panic_button):\n    alarm = (door_open and system_armed) or panic_button\n    return alarm\n\n# Truth table for Q = (D AND A) OR P\nprint(\"D | A | P | Q\")\nprint(\"-\" * 16)\nfor d in [False, True]:\n    for a in [False, True]:\n        for p in [False, True]:\n            q = (d and a) or p\n            print(f\"{int(d)} | {int(a)} | {int(p)} | {int(q)}\")",
          explanation: "This generates the complete truth table for the alarm expression. With 3 inputs, there are 2³ = 8 possible combinations.",
        },
        examTip: "When building expressions from descriptions, identify the INPUTS, the OUTPUT, and the CONDITIONS (AND/OR/NOT) connecting them.",
      },
    ],
  },

  // ============================================
  // PROGRAMMING LANGUAGES & IDEs
  // ============================================
  {
    slug: "programming-languages-and-ides",
    title: "Programming Languages & IDEs",
    paper: "2",
    ocrRef: "2.5",
    icon: "🛠️",
    color: "secondary",
    description: "High-level vs low-level languages and IDE features.",
    sections: [
      {
        id: "language-levels",
        title: "High-Level vs Low-Level Languages",
        icon: "📊",
        content: "Programming languages exist at different levels of abstraction from the hardware.",
        comparisonData: {
          itemA: { title: "High-Level Languages", points: ["Closer to human language / English-like", "Easier to read, write, and debug", "Portable — runs on different platforms", "One statement = many machine instructions", "Must be translated (compiled/interpreted)", "Examples: Python, Java, C#, JavaScript"] },
          itemB: { title: "Low-Level Languages", points: ["Closer to machine code / hardware", "Harder to read and write", "Platform-specific — tied to processor", "Detailed control over hardware", "Assembly → Assembler, Machine code → direct", "Used for: drivers, embedded systems, OS kernels"] },
        },
        keyTerms: [
          { term: "High-Level Language", definition: "A programming language that uses English-like syntax and abstracts away hardware details" },
          { term: "Low-Level Language", definition: "A programming language close to machine code that provides direct hardware control" },
          { term: "Machine Code", definition: "Binary instructions directly executed by the CPU — the lowest level of programming" },
          { term: "Assembly Language", definition: "Low-level language using mnemonics (e.g., ADD, MOV) instead of binary codes" },
        ],
      },
      {
        id: "ide-features",
        title: "IDE Features",
        icon: "🖥️",
        content: "An Integrated Development Environment (IDE) is software that provides tools for writing, testing, and debugging code. All the tools a programmer needs are in one application.",
        tableData: {
          headers: ["Feature", "What It Does", "How It Helps"],
          rows: [
            ["Syntax Highlighting", "Colours different code elements (keywords, strings, comments)", "Makes code easier to read; errors stand out"],
            ["Auto-complete", "Suggests code as you type", "Speeds up coding, reduces typos"],
            ["Error Diagnostics", "Highlights errors with descriptions", "Identifies bugs early, suggests fixes"],
            ["Debugging Tools", "Breakpoints, stepping, variable watching", "Find and fix logic errors by examining execution"],
            ["Line Numbering", "Shows line numbers alongside code", "Easy reference for errors and collaboration"],
            ["Code Editor", "The main area where code is written", "Text editing with undo, find/replace, etc."],
            ["Run/Compile Button", "Execute the program from within the IDE", "Quick testing without switching applications"],
          ],
        },
        keyTerms: [
          { term: "IDE", definition: "Integrated Development Environment — software providing comprehensive tools for programming" },
          { term: "Breakpoint", definition: "A marker in code where execution pauses so the programmer can inspect variables" },
          { term: "Stepping", definition: "Executing code one line at a time to trace through logic" },
          { term: "Watch Window", definition: "A panel showing the current values of selected variables during debugging" },
        ],
        examTip: "When asked about IDE features, always say WHAT the feature does AND HOW it helps the programmer. That's usually 2 marks per feature.",
      },
    ],
  },
];
