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
];
