import { ExamQuestion } from "./types";

export const paper2Questions: ExamQuestion[] = [
  // === Algorithms ===
  {
    id: "p2-al-001", question: "Describe the steps of a linear search algorithm.", marks: 3, difficulty: "foundation", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "Start at the first item. Compare the current item with the target value. If it matches, return the position. If not, move to the next item. Repeat until found or the end of the list is reached.",
    modelAnswer: "Start at the first element of the list (1). Compare each element with the search value (1). If found return the position, if not found after checking all elements return 'not found' (1).",
    markScheme: ["Start at the first element (1)", "Compare each element with the target (1)", "Return position if found / not found if end reached (1)"],
    pseudocodeHint: "FOR i = 0 TO LEN(list) - 1\n  IF list[i] == target THEN\n    RETURN i\n  ENDIF\nNEXT i\nRETURN -1",
  },
  {
    id: "p2-al-002", question: "Explain how a binary search algorithm works. State one prerequisite for using binary search.", marks: 4, difficulty: "mixed", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "The list must be sorted. Find the middle element and compare with the target. If the target is smaller, search the left half. If larger, search the right half. Repeat until found or the sublist is empty.",
    modelAnswer: "The list must be sorted (1). Find the middle item and compare to search value (1). If target is less, discard the right half (1). If target is greater, discard the left half. Repeat until found or sublist is empty (1).",
    markScheme: ["List must be sorted (1)", "Find and compare middle element (1)", "Discard appropriate half (1)", "Repeat until found or empty (1)"],
    pseudocodeHint: "low = 0\nhigh = LEN(list) - 1\nWHILE low <= high\n  mid = (low + high) DIV 2\n  IF list[mid] == target THEN\n    RETURN mid\n  ELSEIF list[mid] < target THEN\n    low = mid + 1\n  ELSE\n    high = mid - 1\n  ENDIF\nENDWHILE",
  },
  {
    id: "p2-al-003", question: "Compare the efficiency of linear search and binary search.", marks: 3, difficulty: "challenge", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "Binary search is much more efficient for large sorted datasets as it halves the search space each time (O(log n)). Linear search checks each item one by one (O(n)) but works on unsorted data. Binary search requires sorted data.",
    modelAnswer: "Binary search is more efficient for large datasets (1). Binary search has O(log n) time complexity vs O(n) for linear search (1). However, binary search requires data to be sorted first, while linear search does not (1).",
    markScheme: ["Binary search more efficient for large datasets (1)", "Binary = O(log n), Linear = O(n) (1)", "Binary requires sorted data / linear works on unsorted (1)"],
  },
  {
    id: "p2-al-004", question: "Describe how a bubble sort algorithm works.", marks: 3, difficulty: "foundation", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "Compare adjacent pairs of items. If they are in the wrong order, swap them. Repeat passes through the list until no swaps are needed, meaning the list is sorted.",
    modelAnswer: "Compare adjacent/neighbouring pairs of elements (1). Swap them if they are in the wrong order (1). Repeat passes through the list until a complete pass is made with no swaps (1).",
    markScheme: ["Compare adjacent pairs (1)", "Swap if in wrong order (1)", "Repeat until no swaps needed in a pass (1)"],
    pseudocodeHint: "FOR i = 0 TO LEN(list) - 2\n  FOR j = 0 TO LEN(list) - i - 2\n    IF list[j] > list[j+1] THEN\n      SWAP list[j], list[j+1]\n    ENDIF\n  NEXT j\nNEXT i",
  },
  {
    id: "p2-al-005", question: "Describe how an insertion sort algorithm works.", marks: 3, difficulty: "mixed", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "Take the next unsorted item. Compare it with items in the sorted portion. Shift larger items to the right to make space. Insert the item in its correct position. Repeat for all items.",
    modelAnswer: "Take the next item from the unsorted portion (1). Compare with items in the sorted portion, shifting items right as needed (1). Insert the item into its correct position in the sorted portion (1).",
    markScheme: ["Take next unsorted item (1)", "Compare and shift items in sorted portion (1)", "Insert into correct position (1)"],
    pseudocodeHint: "FOR i = 1 TO LEN(list) - 1\n  key = list[i]\n  j = i - 1\n  WHILE j >= 0 AND list[j] > key\n    list[j+1] = list[j]\n    j = j - 1\n  ENDWHILE\n  list[j+1] = key\nNEXT i",
  },
  {
    id: "p2-al-006", question: "Trace through the following algorithm and state the output.\n\nx = 5\ny = 3\nWHILE x > 0\n  y = y + x\n  x = x - 2\nENDWHILE\nPRINT(y)", marks: 3, difficulty: "mixed", topic: "Algorithms", paper: "2", type: "short",
    correctAnswer: "12. Trace: x=5,y=8 → x=3,y=11 → x=1,y=12 → x=-1 (loop ends). Output: 12",
    modelAnswer: "x=5, y=3+5=8 (1). x=3, y=8+3=11. x=1, y=11+1=12 (1). x=-1, loop ends. Output: 12 (1).",
    markScheme: ["Correct trace values shown (1)", "Loop terminates when x = -1 (1)", "Final output: 12 (1)"],
  },

  // === Programming Fundamentals ===
  {
    id: "p2-pf-001", question: "State the difference between a variable and a constant.", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "A variable is a named location in memory whose value can change during program execution. A constant is a named value that cannot be changed once assigned.",
    modelAnswer: "A variable stores a value that can change during the program (1). A constant stores a value that cannot be changed once set (1).",
    markScheme: ["Variable: value can change during execution (1)", "Constant: value fixed / cannot change (1)"],
  },
  {
    id: "p2-pf-002", question: "Name four data types used in programming and give an example of each.", marks: 4, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Integer (42), Float/Real (3.14), String (\"hello\"), Boolean (True/False).",
    modelAnswer: "Integer, e.g. 42 (1). Float/Real, e.g. 3.14 (1). String, e.g. \"hello\" (1). Boolean, e.g. True (1).",
    markScheme: ["Integer with example (1)", "Float/Real with example (1)", "String with example (1)", "Boolean with example (1)"],
  },
  {
    id: "p2-pf-003", question: "What is the output of the following Python code?\n\nx = \"Hello\"\ny = \"World\"\nprint(x + \" \" + y)\nprint(len(x))", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Hello World\n5",
    modelAnswer: "Hello World (1). 5 (1).",
    markScheme: ["Hello World (1)", "5 (1)"],
    pseudocodeHint: "x = \"Hello\"\ny = \"World\"\nOUTPUT x + \" \" + y\nOUTPUT LEN(x)",
  },
  {
    id: "p2-pf-004", question: "Explain the difference between a FOR loop and a WHILE loop.", marks: 4, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "A FOR loop iterates a fixed number of times (count-controlled). A WHILE loop repeats as long as a condition is true (condition-controlled). FOR loops are used when you know how many iterations are needed. WHILE loops are used when the number of iterations is unknown.",
    modelAnswer: "A FOR loop is count-controlled / repeats a set number of times (1). A WHILE loop is condition-controlled / repeats until a condition is false (1). FOR is used when iterations are known in advance (1). WHILE is used when iterations are not known (1).",
    markScheme: ["FOR: count-controlled / fixed iterations (1)", "WHILE: condition-controlled (1)", "FOR: known number of iterations (1)", "WHILE: unknown number of iterations (1)"],
  },
  {
    id: "p2-pf-005", question: "Write a Python program that asks the user for a number and prints whether it is positive, negative or zero.", marks: 4, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "num = int(input(\"Enter a number: \"))\nif num > 0:\n    print(\"Positive\")\nelif num < 0:\n    print(\"Negative\")\nelse:\n    print(\"Zero\")",
    modelAnswer: "num = int(input(\"Enter a number: \"))\nif num > 0:\n    print(\"Positive\")\nelif num < 0:\n    print(\"Negative\")\nelse:\n    print(\"Zero\")",
    markScheme: ["Correct input with casting to int (1)", "Correct if condition for positive (1)", "Correct elif condition for negative (1)", "Correct else for zero (1)"],
    pseudocodeHint: "num = INT(INPUT(\"Enter a number: \"))\nIF num > 0 THEN\n  OUTPUT \"Positive\"\nELSEIF num < 0 THEN\n  OUTPUT \"Negative\"\nELSE\n  OUTPUT \"Zero\"\nENDIF",
  },
  {
    id: "p2-pf-006", question: "What is the purpose of indentation in Python?", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "Indentation defines code blocks in Python. It shows which statements belong to a particular control structure (if, for, while, function). Unlike other languages that use braces, Python requires consistent indentation.",
    modelAnswer: "Indentation defines which lines of code belong to a code block / control structure (1). Python uses indentation instead of curly braces to group statements (1).",
    markScheme: ["Defines code blocks / groups statements (1)", "Required by Python syntax / replaces braces (1)"],
  },
  {
    id: "p2-pf-007", question: "Explain what is meant by 'casting' in programming. Give an example.", marks: 3, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "Casting is converting a value from one data type to another. For example, int(\"42\") converts the string \"42\" to the integer 42.",
    modelAnswer: "Casting is changing/converting a value from one data type to another (1). Example: int(\"42\") converts string to integer (1). This is needed because input() returns a string, so numbers must be cast for calculations (1).",
    markScheme: ["Converting between data types (1)", "Valid example (1)", "Reason why casting is needed (1)"],
  },
  {
    id: "p2-pf-008", question: "Write a Python program using a FOR loop that prints the numbers 1 to 10.", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "for i in range(1, 11):\n    print(i)",
    modelAnswer: "for i in range(1, 11):\n    print(i)",
    markScheme: ["Correct range (1, 11) or equivalent (1)", "Correct print statement inside loop (1)"],
    pseudocodeHint: "FOR i = 1 TO 10\n  OUTPUT i\nNEXT i",
  },

  // === Producing Robust Programs ===
  {
    id: "p2-rp-001", question: "Explain what is meant by 'input validation' and why it is important.", marks: 3, difficulty: "foundation", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Input validation checks that data entered by a user meets certain criteria before it is processed. It is important to prevent errors, crashes, and security vulnerabilities such as SQL injection.",
    modelAnswer: "Input validation is checking that data entered meets specified criteria/rules (1). It prevents the program from processing invalid data which could cause errors (1). It helps protect against security attacks such as SQL injection (1).",
    markScheme: ["Checking input meets criteria/rules (1)", "Prevents errors/crashes from invalid data (1)", "Security protection (1)"],
  },
  {
    id: "p2-rp-002", question: "State the difference between syntax errors and logic errors.", marks: 2, difficulty: "foundation", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Syntax errors are mistakes in the grammar of the programming language that prevent the code from running. Logic errors are mistakes in the program's logic that produce incorrect results but the program still runs.",
    modelAnswer: "Syntax errors break the rules of the programming language and prevent the program from running (1). Logic errors allow the program to run but produce incorrect/unexpected results (1).",
    markScheme: ["Syntax: breaks language rules / prevents execution (1)", "Logic: program runs but gives wrong results (1)"],
  },
  {
    id: "p2-rp-003", question: "Write Python code to validate that a user enters a number between 1 and 100 (inclusive).", marks: 4, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "code",
    correctAnswer: "num = int(input(\"Enter a number: \"))\nwhile num < 1 or num > 100:\n    print(\"Invalid. Please enter a number between 1 and 100.\")\n    num = int(input(\"Enter a number: \"))\nprint(\"Valid number:\", num)",
    modelAnswer: "num = int(input(\"Enter a number: \"))\nwhile num < 1 or num > 100:\n    print(\"Invalid. Enter 1-100.\")\n    num = int(input(\"Enter a number: \"))\nprint(\"Valid:\", num)",
    markScheme: ["Correct input with int casting (1)", "While loop with correct condition (1)", "Error message displayed (1)", "Re-prompts user for input (1)"],
    pseudocodeHint: "num = INT(INPUT(\"Enter number:\"))\nWHILE num < 1 OR num > 100\n  OUTPUT \"Invalid\"\n  num = INT(INPUT(\"Enter number:\"))\nENDWHILE",
  },
  {
    id: "p2-rp-004", question: "Explain the purpose of testing and describe two types of test data.", marks: 4, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Testing ensures the program works correctly and meets requirements. Normal data tests typical valid inputs. Boundary data tests values at the edge of valid ranges. Erroneous data tests invalid inputs that should be rejected.",
    modelAnswer: "Testing ensures the program functions correctly and is free from errors (1). Normal/valid test data: typical data the program should accept (1). Boundary/edge test data: data at the limits of acceptable ranges (1). Erroneous/invalid test data: data the program should reject (1).",
    markScheme: ["Purpose of testing (1)", "Normal test data explained (1)", "Boundary test data explained (1)", "Erroneous test data explained (1) — any two types for 2 marks"],
  },

  // === Boolean Logic ===
  {
    id: "p2-bl-001", question: "Complete the truth table for A AND B.\n\nA | B | Output\n0 | 0 | ?\n0 | 1 | ?\n1 | 0 | ?\n1 | 1 | ?", marks: 2, difficulty: "foundation", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "0, 0, 0, 1",
    modelAnswer: "0 AND 0 = 0, 0 AND 1 = 0, 1 AND 0 = 0, 1 AND 1 = 1 (2).",
    markScheme: ["All four correct: 0, 0, 0, 1 (2)", "Two or three correct (1)"],
  },
  {
    id: "p2-bl-002", question: "Write the Boolean expression for: 'The alarm sounds if the door is open AND the system is armed, OR if the panic button is pressed.'\nUse variables: D (door), A (armed), P (panic), Q (alarm).", marks: 2, difficulty: "mixed", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "Q = (D AND A) OR P",
    modelAnswer: "Q = (D AND A) OR P (2).",
    markScheme: ["Correct AND for door and armed (1)", "Correct OR with panic button (1)"],
  },
  {
    id: "p2-bl-003", question: "Complete the truth table for NOT(A OR B).\n\nA | B | A OR B | NOT(A OR B)\n0 | 0 | ? | ?\n0 | 1 | ? | ?\n1 | 0 | ? | ?\n1 | 1 | ? | ?", marks: 3, difficulty: "mixed", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "A OR B: 0,1,1,1. NOT(A OR B): 1,0,0,0",
    modelAnswer: "A OR B: 0,1,1,1. NOT(A OR B): 1,0,0,0 (3).",
    markScheme: ["Correct OR column (1)", "Correct NOT column (1)", "All values correct (1)"],
  },

  // === Programming Languages & IDEs ===
  {
    id: "p2-pi-001", question: "State three features of an IDE (Integrated Development Environment) that help a programmer.", marks: 3, difficulty: "foundation", topic: "Programming Languages & IDEs", paper: "2", type: "short",
    correctAnswer: "Syntax highlighting, auto-complete/code completion, debugging tools, error diagnostics, line numbering, bracket matching.",
    modelAnswer: "Syntax highlighting / colour coding of keywords (1). Auto-complete / code suggestions (1). Debugging tools such as breakpoints and stepping (1).",
    markScheme: ["Syntax highlighting (1)", "Auto-complete / code completion (1)", "Debugging tools (1)", "Error diagnostics (1)", "Line numbering (1) — any three"],
  },
  {
    id: "p2-pi-002", question: "Explain the difference between high-level and low-level programming languages.", marks: 4, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "High-level languages are closer to human language, easier to read and write, and are portable across different machines. Low-level languages are closer to machine code, harder to read but give more control over hardware and are generally faster.",
    modelAnswer: "High-level: closer to human language / easier to read and write (1). High-level: portable across different platforms (1). Low-level: closer to machine code / harder to read (1). Low-level: more control over hardware / faster execution (1).",
    markScheme: ["High-level: readable / human-like (1)", "High-level: portable (1)", "Low-level: closer to machine code (1)", "Low-level: more hardware control / faster (1)"],
  },

  // === String Handling ===
  {
    id: "p2-sh-001", question: "What is the output of the following Python code?\n\nword = \"COMPUTER\"\nprint(word[0:4])\nprint(word[-3:])\nprint(word.lower())", marks: 3, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "COMP\nTER\ncomputer",
    modelAnswer: "COMP (1). TER (1). computer (1).",
    markScheme: ["COMP (1)", "TER (1)", "computer (1)"],
  },
  {
    id: "p2-sh-002", question: "Write a Python function that takes a string and returns it reversed.", marks: 3, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "def reverse_string(text):\n    return text[::-1]",
    modelAnswer: "def reverse_string(text):\n    return text[::-1]\n\n# Alternative:\ndef reverse_string(text):\n    result = \"\"\n    for char in text:\n        result = char + result\n    return result",
    markScheme: ["Correct function definition with parameter (1)", "Correct reversal logic (1)", "Returns the result (1)"],
    pseudocodeHint: "FUNCTION reverseString(text)\n  result = \"\"\n  FOR i = LEN(text) - 1 TO 0 STEP -1\n    result = result + text[i]\n  NEXT i\n  RETURN result\nENDFUNCTION",
  },

  // === Arrays / Lists ===
  {
    id: "p2-ar-001", question: "Write Python code to find and print the largest number in a list called 'numbers'.", marks: 3, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "numbers = [4, 7, 2, 9, 1]\nlargest = numbers[0]\nfor num in numbers:\n    if num > largest:\n        largest = num\nprint(largest)",
    modelAnswer: "largest = numbers[0]\nfor num in numbers:\n    if num > largest:\n        largest = num\nprint(largest)",
    markScheme: ["Initialise largest to first element (1)", "Loop through all elements (1)", "Correct comparison and update (1)"],
    pseudocodeHint: "largest = numbers[0]\nFOR i = 1 TO LEN(numbers) - 1\n  IF numbers[i] > largest THEN\n    largest = numbers[i]\n  ENDIF\nNEXT i\nOUTPUT largest",
  },
  {
    id: "p2-ar-002", question: "Explain what a two-dimensional (2D) array is and give a real-world example of when one might be used.", marks: 3, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "A 2D array is an array of arrays, creating a grid/table structure with rows and columns. Example: storing a seating plan for a cinema, where rows represent seat rows and columns represent individual seats.",
    modelAnswer: "A 2D array is an array that contains other arrays, forming a table/grid structure (1). Data is accessed using two indices: row and column (1). Example: a school timetable / game board / seating plan (1).",
    markScheme: ["Array of arrays / grid/table structure (1)", "Accessed with two indices (1)", "Valid real-world example (1)"],
  },

  // === Subroutines ===
  {
    id: "p2-sub-001", question: "Explain the difference between a function and a procedure.", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "explain",
    correctAnswer: "A function returns a value to the calling code. A procedure performs a task but does not return a value.",
    modelAnswer: "A function returns a value (1). A procedure carries out a task but does not return a value (1).",
    markScheme: ["Function: returns a value (1)", "Procedure: does not return a value (1)"],
  },
  {
    id: "p2-sub-002", question: "State two advantages of using subroutines in a program.", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Code reuse (write once, use multiple times). Makes the program easier to read, test, and debug.",
    modelAnswer: "Code can be reused without rewriting (1). Makes the program easier to read/test/debug/maintain (1).",
    markScheme: ["Code reuse (1)", "Easier to read/test/debug/maintain (1)", "Allows teamwork / modular development (1) — any two"],
  },

  // === File Handling ===
  {
    id: "p2-fh-001", question: "Write Python code to read all lines from a file called 'data.txt' and print each line.", marks: 3, difficulty: "mixed", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "file = open(\"data.txt\", \"r\")\nfor line in file:\n    print(line.strip())\nfile.close()",
    modelAnswer: "file = open(\"data.txt\", \"r\")\nfor line in file:\n    print(line.strip())\nfile.close()\n\n# Or using with:\nwith open(\"data.txt\", \"r\") as file:\n    for line in file:\n        print(line.strip())",
    markScheme: ["Correct file open with read mode (1)", "Loop through lines (1)", "Print each line / close file (1)"],
    pseudocodeHint: "file = OPENREAD(\"data.txt\")\nWHILE NOT file.endOfFile()\n  line = file.readLine()\n  OUTPUT line\nENDWHILE\nfile.close()",
  },
  {
    id: "p2-fh-002", question: "Write Python code to write the text 'Hello World' to a file called 'output.txt'.", marks: 2, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "code",
    correctAnswer: "file = open(\"output.txt\", \"w\")\nfile.write(\"Hello World\")\nfile.close()",
    modelAnswer: "file = open(\"output.txt\", \"w\")\nfile.write(\"Hello World\")\nfile.close()",
    markScheme: ["Correct file open with write mode (1)", "Correct write and close (1)"],
    pseudocodeHint: "file = OPENWRITE(\"output.txt\")\nfile.writeLine(\"Hello World\")\nfile.close()",
  },

  // Additional Five-A-Day questions
  {
    id: "p2-fad-001", question: "What is the result of 17 MOD 5?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "2",
    modelAnswer: "17 MOD 5 = 2 (remainder when 17 is divided by 5) (1).",
    markScheme: ["2 (1)"],
  },
  {
    id: "p2-fad-002", question: "What is the result of 17 DIV 5?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "3",
    modelAnswer: "17 DIV 5 = 3 (integer division, whole number result) (1).",
    markScheme: ["3 (1)"],
  },
  {
    id: "p2-fad-003", question: "What data type would be most suitable to store a person's age?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "multiple-choice",
    options: ["String", "Integer", "Float", "Boolean"],
    correctAnswer: "Integer",
    modelAnswer: "Integer — age is a whole number.",
    markScheme: ["Integer (1)"],
  },
  {
    id: "p2-fad-004", question: "State what == means in Python.", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Comparison operator that checks if two values are equal.",
    modelAnswer: "Equal to / comparison operator (checks if two values are the same) (1).",
    markScheme: ["Equal to / comparison operator (1)"],
  },
  {
    id: "p2-fad-005", question: "What is a syntax error?", marks: 1, difficulty: "foundation", topic: "Producing Robust Programs", paper: "2", type: "short",
    correctAnswer: "A mistake in the code that breaks the rules of the programming language, preventing it from running.",
    modelAnswer: "An error that breaks the rules/grammar of the programming language (1).",
    markScheme: ["Breaks language rules / prevents program from running (1)"],
  },
  {
    id: "p2-fad-006", question: "What does the len() function do in Python?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Returns the number of items in a list or the number of characters in a string.",
    modelAnswer: "Returns the length/number of items in a list or characters in a string (1).",
    markScheme: ["Returns length/count of items or characters (1)"],
  },
  {
    id: "p2-fad-007", question: "What is the output of: print(3 ** 2)?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "9",
    modelAnswer: "9 (** is the exponent/power operator: 3 to the power of 2) (1).",
    markScheme: ["9 (1)"],
  },
  {
    id: "p2-fad-008", question: "Name the Boolean operator that returns True only if both inputs are True.", marks: 1, difficulty: "foundation", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "AND",
    modelAnswer: "AND (1).",
    markScheme: ["AND (1)"],
  },
  {
    id: "p2-fad-009", question: "What is concatenation?", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "Joining two or more strings together.",
    modelAnswer: "Joining/combining two or more strings together (1).",
    markScheme: ["Joining strings together (1)"],
  },
  {
    id: "p2-fad-010", question: "State one advantage of using a constant instead of a variable.", marks: 1, difficulty: "foundation", topic: "Programming Fundamentals", paper: "2", type: "short",
    correctAnswer: "The value cannot be accidentally changed during the program, making the code more reliable.",
    modelAnswer: "Value cannot be accidentally changed / makes program more reliable/secure (1).",
    markScheme: ["Cannot be accidentally changed / more reliable (1)"],
  },

  // ── Programming Languages & IDEs (expanding from 2 to 10) ──────────────────
  {
    id: "p2-pi-003", question: "Explain the difference between a compiler and an interpreter.", marks: 4, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "A compiler translates the entire source code into machine code in one go, producing an executable file. An interpreter translates and executes the source code line by line. Compiled programs run faster; interpreted programs are easier to debug.",
    modelAnswer: "Compiler: translates whole program at once (1), produces standalone executable (1). Interpreter: translates line by line (1), stops at first error making debugging easier (1).",
    markScheme: [
      "Compiler translates entire program at once (1)",
      "Compiler produces standalone executable / faster at runtime (1)",
      "Interpreter translates line by line (1)",
      "Interpreter easier to debug / stops at first error (1)",
    ],
  },
  {
    id: "p2-pi-004", question: "Explain what an assembler does and state one advantage of using assembly language over machine code.", marks: 3, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "An assembler converts assembly language (mnemonics) into machine code (binary). Assembly language uses human-readable mnemonics like MOV and ADD instead of binary, making it easier to write and understand than pure machine code.",
    modelAnswer: "Assembler converts assembly language/mnemonics into machine code/binary (2). Advantage: easier to read/write than machine code / uses meaningful mnemonics (1).",
    markScheme: [
      "Assembler translates assembly language into machine code (1)",
      "Assembly uses mnemonics not binary (1)",
      "Advantage: easier to read/write/understand than machine code (1)",
    ],
  },
  {
    id: "p2-pi-005", question: "State four features that an IDE provides to help a programmer write and debug code.", marks: 4, difficulty: "foundation", topic: "Programming Languages & IDEs", paper: "2", type: "short",
    correctAnswer: "Auto-completion, syntax highlighting, error highlighting/debugging, breakpoints/step-through execution, variable watch window, code templates/snippets.",
    modelAnswer: "Any four from: auto-completion (1), syntax highlighting (1), error highlighting / debugging tools (1), breakpoints / step-through execution (1), run/execute button (1), variable watch window (1). 1 mark each.",
    markScheme: [
      "Auto-completion / intellisense (1)",
      "Syntax highlighting (1)",
      "Error highlighting / live error detection (1)",
      "Debugger / breakpoints / step-through (1)",
      "Variable watch / inspector (1)",
      "Run/build/execute facility (1)",
    ],
  },
  {
    id: "p2-pi-006", question: "Give two advantages and one disadvantage of using a high-level language compared to a low-level language.", marks: 3, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "Advantages: easier to read and write; portable across different hardware. Disadvantage: less control over hardware / slower execution than low-level code.",
    modelAnswer: "Advantage 1: easier to read/write/understand (1). Advantage 2: portable/works on different hardware (1). Disadvantage: less direct control over hardware / slower / needs translator (1).",
    markScheme: [
      "Advantage: easier to read / write / understand (1)",
      "Advantage: portable across different processors/platforms (1)",
      "Disadvantage: less control over hardware / slower / requires translator (1)",
    ],
  },
  {
    id: "p2-pi-007", question: "A programmer writes code in Python. Explain whether Python uses a compiler or an interpreter, and state one consequence of this for the programmer.", marks: 3, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "Python uses an interpreter, which translates and executes code line by line. A consequence is that the program will stop at the first error encountered, making it easier to locate bugs.",
    modelAnswer: "Python uses an interpreter (1) which translates line by line / at runtime (1). Consequence: program stops at first error making it easy to find bugs / no separate compile step needed (1).",
    markScheme: [
      "Python uses an interpreter (1)",
      "Interpreter translates line by line / at runtime (1)",
      "Consequence: stops at first error / easier to debug / no compile step (1)",
    ],
  },
  {
    id: "p2-pi-008", question: "Explain what is meant by 'machine code' and why processors can only execute machine code.", marks: 3, difficulty: "mixed", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "Machine code is a set of binary instructions (0s and 1s) that the CPU can directly understand and execute. Processors can only execute machine code because the processor's circuits are designed to interpret specific binary patterns as operations.",
    modelAnswer: "Machine code is binary/0s and 1s (1) that the CPU can directly execute (1). Processors are built with circuits that only recognise binary patterns / all other languages must be translated (1).",
    markScheme: [
      "Machine code is binary / 0s and 1s (1)",
      "CPU can directly execute machine code without translation (1)",
      "Processor circuits only understand binary / other languages need translator (1)",
    ],
  },
  {
    id: "p2-pi-009", question: "State two advantages of using an IDE's debugger over adding print statements to find errors.", marks: 2, difficulty: "challenge", topic: "Programming Languages & IDEs", paper: "2", type: "short",
    correctAnswer: "A debugger allows you to pause execution at any line (breakpoint) and inspect all variable values at once, without modifying the code. Print statements require code changes and only show values you think to print.",
    modelAnswer: "Any two from: can inspect all variables at once without changing code (1); can step through code line by line (1); can set breakpoints at any line (1); no need to remove debug code afterwards (1).",
    markScheme: [
      "Can inspect all variables without modifying code (1)",
      "Can step through execution line by line (1)",
      "Can set breakpoints to pause at a specific line (1)",
      "No need to remove debug statements afterwards (1)",
    ],
  },
  {
    id: "p2-pi-010", question: "Explain why a programmer might choose to write a program in assembly language rather than a high-level language. Give two reasons.", marks: 4, difficulty: "challenge", topic: "Programming Languages & IDEs", paper: "2", type: "explain",
    correctAnswer: "Assembly language gives direct control over hardware registers and memory, so it can be more efficient. It produces very fast, compact code which is important for embedded systems or device drivers where memory and speed are critical.",
    modelAnswer: "Reason 1: direct control over hardware/registers/memory (1) — useful for device drivers/embedded systems (1). Reason 2: produces faster/more efficient code (1) — important where resources are limited (1).",
    markScheme: [
      "Direct control over hardware / CPU registers / memory (1)",
      "Context: device drivers / embedded systems / where hardware control needed (1)",
      "Produces faster / more memory-efficient code (1)",
      "Context: limited resources / real-time systems (1)",
    ],
  },

  // ── Boolean Logic (expanding from 4 to 10) ─────────────────────────────────
  {
    id: "p2-bl-004", question: "Complete the truth table for A OR B.\n\nA | B | Output\n0 | 0 | ?\n0 | 1 | ?\n1 | 0 | ?\n1 | 1 | ?", marks: 2, difficulty: "foundation", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "0, 1, 1, 1",
    modelAnswer: "A=0,B=0→0 (½); A=0,B=1→1 (½); A=1,B=0→1 (½); A=1,B=1→1 (½). All four correct = 2 marks; any two correct = 1 mark.",
    markScheme: [
      "All four rows correct: 0, 1, 1, 1 (2)",
      "2–3 rows correct (1)",
    ],
  },
  {
    id: "p2-bl-005", question: "Complete the truth table for NOT A.\n\nA | NOT A\n0 | ?\n1 | ?", marks: 1, difficulty: "foundation", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "1, 0",
    modelAnswer: "A=0→1; A=1→0. Both correct (1).",
    markScheme: ["Both rows correct: 1, 0 (1)"],
  },
  {
    id: "p2-bl-006", question: "Draw the logic gate symbols for AND, OR and NOT gates and label each one.", marks: 3, difficulty: "foundation", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "AND: D-shape with flat left edge. OR: curved shield shape. NOT: triangle with circle (bubble) at output. Each correctly drawn and labelled.",
    modelAnswer: "Correct AND gate symbol and label (1). Correct OR gate symbol and label (1). Correct NOT gate symbol and label (1).",
    markScheme: [
      "AND gate: correct D-shape with label (1)",
      "OR gate: correct curved shape with label (1)",
      "NOT gate: triangle with bubble at output with label (1)",
    ],
  },
  {
    id: "p2-bl-007", question: "Evaluate the Boolean expression: Q = (A AND B) OR (NOT C)\nfor A=1, B=0, C=0.", marks: 3, difficulty: "mixed", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "A AND B = 1 AND 0 = 0. NOT C = NOT 0 = 1. Q = 0 OR 1 = 1.",
    modelAnswer: "A AND B = 0 (1). NOT C = 1 (1). Q = 0 OR 1 = 1 (1).",
    markScheme: [
      "A AND B = 0 (1)",
      "NOT C = 1 (1)",
      "Q = 1 (1)",
    ],
  },
  {
    id: "p2-bl-008", question: "Complete the full truth table for: Q = A AND (NOT B)\n\nA | B | NOT B | Q\n0 | 0 | ? | ?\n0 | 1 | ? | ?\n1 | 0 | ? | ?\n1 | 1 | ? | ?", marks: 3, difficulty: "mixed", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "NOT B: 1,0,1,0. Q: 0,0,1,0.",
    modelAnswer: "NOT B column: 1,0,1,0 (1). Q column: 0,0,1,0 (1). All correct with working shown (1).",
    markScheme: [
      "NOT B column all correct: 1, 0, 1, 0 (1)",
      "Q column all correct: 0, 0, 1, 0 (1)",
      "All values correct with evidence of method (1)",
    ],
  },
  {
    id: "p2-bl-009", question: "A security system output Q is described by: Q = (A OR B) AND (NOT C). Construct the full truth table for all combinations of A, B and C.", marks: 4, difficulty: "challenge", topic: "Boolean Logic", paper: "2", type: "short",
    correctAnswer: "8 rows. A OR B gives 0,1,1,1,1,1,1,1. NOT C gives 1,1,0,0,1,1,0,0. Q = (A OR B) AND (NOT C): 0,1,0,0,1,1,0,0.",
    modelAnswer: "Correct 8-row table with columns A,B,C,A OR B,NOT C,Q (1). A OR B column correct (1). NOT C column correct (1). Final Q column correct (1).",
    markScheme: [
      "8 rows with all input combinations listed (A,B,C from 000 to 111) (1)",
      "A OR B intermediate column correct (1)",
      "NOT C intermediate column correct (1)",
      "Q column correct: 0,1,0,0,1,1,0,0 (1)",
    ],
  },

  // ── Producing Robust Programs (expanding from 5 to 11) ─────────────────────
  {
    id: "p2-rp-005", question: "Explain the difference between a runtime error and a logic error, giving an example of each.", marks: 4, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "A runtime error occurs while the program is running and causes it to crash (e.g. dividing by zero). A logic error does not crash the program but produces incorrect output (e.g. using + instead of * in a calculation).",
    modelAnswer: "Runtime error: occurs during execution (1), causes program to crash / example: divide by zero, index out of range (1). Logic error: program runs but gives wrong output (1), example: wrong operator / off-by-one in loop (1).",
    markScheme: [
      "Runtime error: occurs during execution / causes crash (1)",
      "Runtime error example: divide by zero / accessing invalid index (1)",
      "Logic error: program runs but output is incorrect (1)",
      "Logic error example: wrong operator / incorrect loop condition (1)",
    ],
  },
  {
    id: "p2-rp-006", question: "Write Python code to validate that a user enters a whole number that is either 1, 2 or 3.", marks: 4, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "code",
    correctAnswer: "choice = int(input('Enter 1, 2 or 3: '))\nwhile choice not in [1, 2, 3]:\n    print('Invalid input.')\n    choice = int(input('Enter 1, 2 or 3: '))\nprint('Valid:', choice)",
    modelAnswer: "Input with prompt (1). Loop/condition checking value is in {1,2,3} (1). Error message inside loop (1). Re-prompts for input inside loop (1).",
    markScheme: [
      "Reads input and converts to integer (1)",
      "Checks value is in [1, 2, 3] / valid range (1)",
      "Loop repeats while invalid (1)",
      "Re-prompts for input inside loop (1)",
    ],
  },
  {
    id: "p2-rp-007", question: "Explain what is meant by 'defensive design' in programming and give two techniques used.", marks: 4, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Defensive design means writing code that anticipates and handles unexpected or invalid inputs to prevent crashes and security vulnerabilities. Techniques include: input validation (checking inputs are in range/correct type) and authentication (requiring passwords to access features).",
    modelAnswer: "Defensive design: writing code to handle unexpected inputs / prevent errors/crashes (1). Technique 1: input validation — checking input is correct type/range (1). Technique 2: authentication — verifying user identity before access (1). Third technique for full marks: sanitisation of inputs (1).",
    markScheme: [
      "Defensive design: anticipating/handling invalid inputs to prevent errors (1)",
      "Technique 1: input validation / checking type and range (1)",
      "Technique 2: authentication / access control (1)",
      "Technique 3 or elaboration: input sanitisation / error handling (1)",
    ],
  },
  {
    id: "p2-rp-008", question: "Explain the purpose of using test data when testing a program. Describe what is meant by normal, boundary and erroneous test data, with an example of each for a program that accepts ages 0–120.", marks: 6, difficulty: "challenge", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Testing ensures the program works correctly for all inputs. Normal: typical valid input (e.g. 25). Boundary: values at the edge of the valid range (e.g. 0 and 120). Erroneous: data that should be rejected (e.g. -5 or 200 or 'abc').",
    modelAnswer: "Purpose: to verify program produces correct output for all input types (1). Normal: valid input within range e.g. 25 (1). Boundary: at the edges of valid range e.g. 0 and 120 (1). Erroneous: input outside valid range or wrong type e.g. -1, 200, or 'abc' (1). Boundary tests limits/edge cases (1). Erroneous tests rejection of invalid data (1).",
    markScheme: [
      "Purpose: verifies correct output for different input types (1)",
      "Normal: valid typical value e.g. 25 (1)",
      "Boundary: edge of valid range e.g. 0 or 120 (1)",
      "Erroneous: invalid value that should be rejected e.g. -5 or 200 or 'abc' (1)",
      "Boundary tests program behaves correctly at limits (1)",
      "Erroneous tests program correctly rejects invalid inputs (1)",
    ],
  },
  {
    id: "p2-rp-009", question: "Look at this code:\n\ndef divide(a, b):\n    return a / b\n\nresult = divide(10, 0)\nprint(result)\n\nIdentify the type of error and explain how to fix it.", marks: 3, difficulty: "mixed", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "This is a runtime error (ZeroDivisionError). It can be fixed by adding a check before dividing: if b == 0: return None (or print an error). Alternatively, use a try/except block to catch the ZeroDivisionError.",
    modelAnswer: "Runtime error / ZeroDivisionError (1). Fix: check if b == 0 before dividing (1). Alternative fix: try/except to handle the exception (1).",
    markScheme: [
      "Runtime error / ZeroDivisionError (1)",
      "Fix: check if b == 0 before dividing / guard clause (1)",
      "Or: try/except ZeroDivisionError (1)",
    ],
  },
  {
    id: "p2-rp-010", question: "Explain why programs should be thoroughly tested before release. State two consequences of releasing software with bugs.", marks: 4, difficulty: "foundation", topic: "Producing Robust Programs", paper: "2", type: "explain",
    correctAnswer: "Testing ensures the software works correctly, is reliable, and secure. Consequences of releasing buggy software include: loss of user trust/reputation damage, financial cost of fixing bugs after release, security vulnerabilities that could be exploited, or data loss.",
    modelAnswer: "Testing ensures software is correct/reliable/secure before users depend on it (2). Consequence 1: damage to reputation / loss of user trust (1). Consequence 2: security vulnerabilities / data loss / financial cost (1).",
    markScheme: [
      "Ensures software is correct / reliable / works as intended (1)",
      "Ensures software is secure / no vulnerabilities (1)",
      "Consequence 1: damage to reputation / loss of trust (1)",
      "Consequence 2: security vulnerability exploited / data loss / costly patches (1)",
    ],
  },

  // ── Algorithms (expanding from 6 to 10) ────────────────────────────────────
  {
    id: "p2-al-007", question: "Trace through one complete pass of bubble sort on the list: [5, 3, 8, 1, 9, 2]\nShow the list after each swap.", marks: 4, difficulty: "mixed", topic: "Algorithms", paper: "2", type: "short",
    correctAnswer: "Compare 5,3 → swap → [3,5,8,1,9,2]. Compare 5,8 → no swap. Compare 8,1 → swap → [3,5,1,8,9,2]. Compare 8,9 → no swap. Compare 9,2 → swap → [3,5,1,8,2,9].",
    modelAnswer: "[3,5,8,1,9,2] after first swap (1). [3,5,1,8,9,2] after third swap (1). [3,5,1,8,2,9] after final swap (1). Correctly identifies 3 swaps in first pass (1).",
    markScheme: [
      "[3,5,8,1,9,2] — first swap of 5 and 3 (1)",
      "[3,5,1,8,9,2] — swap of 8 and 1 (1)",
      "[3,5,1,8,2,9] — swap of 9 and 2 (1)",
      "Correct number of comparisons (6) identified (1)",
    ],
  },
  {
    id: "p2-al-008", question: "Explain what is meant by the time complexity of an algorithm. State the time complexity of linear search and binary search in terms of n (the number of items).", marks: 4, difficulty: "challenge", topic: "Algorithms", paper: "2", type: "explain",
    correctAnswer: "Time complexity describes how the running time of an algorithm grows as the input size n increases. Linear search is O(n) — worst case checks every item. Binary search is O(log n) — halves the search space each step.",
    modelAnswer: "Time complexity: how running time scales/grows with input size n (2). Linear search: O(n) / worst case checks all n items (1). Binary search: O(log n) / halves search space each step (1).",
    markScheme: [
      "Time complexity: how running time grows with input size (1)",
      "Measured in terms of worst/average case number of operations (1)",
      "Linear search: O(n) — checks up to n items (1)",
      "Binary search: O(log n) — halves search space each step (1)",
    ],
  },
  {
    id: "p2-al-009", question: "Write pseudocode for a function that uses linear search to find a target value in a list called 'items'. The function should return the index of the target or -1 if not found.", marks: 4, difficulty: "mixed", topic: "Algorithms", paper: "2", type: "short",
    correctAnswer: "FUNCTION linearSearch(items, target)\n  FOR i = 0 TO LEN(items) - 1\n    IF items[i] == target THEN\n      RETURN i\n    ENDIF\n  ENDFOR\n  RETURN -1\nENDFUNCTION",
    modelAnswer: "Function/procedure definition with parameters (1). Loop through all elements (1). Comparison of each element to target (1). Return index if found, -1 if not found (1).",
    markScheme: [
      "Function with appropriate parameters (items, target) (1)",
      "Loop iterating through all elements (1)",
      "Comparison of element to target (1)",
      "Return index on match; return -1 if loop completes without match (1)",
    ],
  },
  {
    id: "p2-al-010", question: "A sorted list contains 1024 items. What is the maximum number of comparisons needed to find an item using binary search? Show your working.", marks: 3, difficulty: "challenge", topic: "Algorithms", paper: "2", type: "short",
    correctAnswer: "Binary search halves the list each step. 1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1. That is 10 steps. log₂(1024) = 10 comparisons maximum.",
    modelAnswer: "log₂(1024) = 10 (1). Shows halving: 1024→512→...→1 taking 10 steps (1). States maximum 10 comparisons (1).",
    markScheme: [
      "Method: log₂(n) or repeated halving shown (1)",
      "log₂(1024) = 10 or 10 halving steps shown (1)",
      "Answer: 10 comparisons maximum (1)",
    ],
  },
  {
    id: "p2-al-011",
    question:
      "A local hospital maintains a patient record system containing 25,000 records. Each record has a unique patient ID and the file is already sorted by ID. The records team want a search routine that finds any patient record as quickly as possible.\n\nCompare linear search and binary search, then recommend which the hospital should use for this system. Justify your choice with reference to the scale of the dataset and the ordering of the records.",
    marks: 6,
    difficulty: "challenge",
    topic: "Algorithms",
    paper: "2",
    type: "explain",
    correctAnswer:
      "Linear search inspects each record in turn until it finds the target ID or runs out of records. It works on any list whether ordered or not. Binary search repeatedly looks at the middle record: if the ID matches it returns, if the target ID is lower it keeps the lower half, if higher it keeps the upper half. Binary search only works when the list is already sorted. For 25,000 sorted records, linear search could need up to 25,000 comparisons in the worst case, while binary search needs at most log₂(25,000) ≈ 15 comparisons. Because the hospital data is already sorted by patient ID and the dataset is large, binary search is the appropriate choice — it satisfies the sorted-data prerequisite and offers dramatically faster lookups for users of the records system.",
    modelAnswer:
      "Explains linear search: sequential check of each record, works on sorted or unsorted data (1). Explains binary search: examines the middle item of a sorted list then discards the half that cannot contain the target, repeating until found (1). States binary search prerequisite that data must already be sorted (1). Compares worst-case behaviour: linear up to 25,000 comparisons vs binary ~15 comparisons / log₂(n) (1). Justifies recommendation referencing scale and sorted order already met (1). Recommends binary search with coherent reasoning linked to the hospital scenario (1).",
    markScheme: [
      "L1 (1–2): Describes one or both algorithms with some accuracy; recommendation unclear or missing justification (1 mark each).",
      "L2 (3–4): Clear description of both algorithms with at least one comparison point; recommendation stated with partial justification (1 mark each).",
      "L3 (5–6): Accurate description of both algorithms including binary search's sorted-data prerequisite; comparison quantifies the efficiency gap (linear ≤ 25,000 vs binary ≈ log₂ n); recommendation of binary search is explicitly tied to the sorted hospital dataset and the scale of the records (1 mark each).",
    ],
    hint: "Think about what each algorithm does step-by-step, what data they require, and how many checks each could need in the worst case for 25,000 items.",
    board: "ocr",
    spec_code: "J277/02",
    spec_version: "2020",
    last_reviewed_at: "2026-04-18",
  },
  {
    id: "p2-al-012",
    question:
      "A bookseller runs an online shop with 5,000,000 products in its catalogue. The catalogue is kept sorted alphabetically by product name. When a customer types a query, the site must return matches fast enough that the page feels instant, otherwise customers leave for a competitor.\n\nAnalyse how linear search and binary search would perform in this context. Evaluate which algorithm is most appropriate and justify your recommendation, discussing the size of the catalogue, the sorted-data requirement, and the impact on customer experience.",
    marks: 9,
    difficulty: "challenge",
    topic: "Algorithms",
    paper: "2",
    type: "explain",
    correctAnswer:
      "Linear search scans each product in turn from the first until the target is found or the end is reached; it makes no assumption about order and works on sorted or unsorted data. For 5,000,000 products the worst case is 5,000,000 comparisons, and the average case is roughly 2,500,000 — both noticeable to a user. Binary search repeatedly halves a sorted list: it examines the middle entry, returns if it matches, otherwise discards the half that cannot contain the target and repeats on the other half. For 5,000,000 items the worst case is at most log₂(5,000,000) ≈ 23 comparisons. Binary search's prerequisite — sorted data — is already met because the catalogue is stored alphabetically by product name, so no additional sorting work is required. At this scale, linear search would introduce user-visible latency that damages customer experience in a market where slow search directly costs the business. Binary search delivers results in a handful of comparisons regardless of where the match sits in the catalogue, making it the appropriate choice. Recommendation: binary search, because the sorted prerequisite is already satisfied, the catalogue is large enough that linear search would be noticeably slow, and fast search directly supports the commercial goal of retaining customers.",
    modelAnswer:
      "Describes linear search: sequential comparison, works on sorted or unsorted data, worst case = n comparisons (1). Describes binary search: examines middle of sorted list and halves the search space each step (1). States binary search prerequisite that data must be sorted (1). Analyses database size: quantifies worst-case comparisons for linear (up to 5,000,000) versus binary (~23 / log₂ n) for this catalogue (1). Analyses sorted-data requirement: identifies that the catalogue is already alphabetically sorted so the prerequisite is met without extra work (1). Analyses user-experience impact: linear search at this scale causes user-visible delay; binary search is near-instant (1). Links the user-experience point back to the commercial consequence (customers leaving for competitors) (1). Makes a clear, well-reasoned recommendation of binary search (1). Reasoning integrates all three factors — size, sorted order, user experience — into a coherent justification (1).",
    markScheme: [
      "L1 (1–3): Basic explanation of one or both algorithms; analysis is limited to one factor; recommendation made but poorly justified (1 mark per credit-worthy point).",
      "L2 (4–6): Sound explanation of both algorithms including the sorted-data prerequisite; considers at least two of the three factors (size, sorted order, UX); recommendation is stated with partial justification tied to the scenario.",
      "L3 (7–9): Comprehensive and accurate explanation of both algorithms with quantified worst-case comparisons; evaluates all three factors — catalogue scale (≈ log₂ 5,000,000 vs linear n), sorted-data prerequisite already met, and measurable UX/commercial impact; recommends binary search with justification that integrates all three factors.",
    ],
    hint: "Quantify the worst-case comparisons for both algorithms at n = 5,000,000, then tie the efficiency gap to the user experience and business impact.",
    board: "ocr",
    spec_code: "J277/02",
    spec_version: "2020",
    last_reviewed_at: "2026-04-18",
  },
];
