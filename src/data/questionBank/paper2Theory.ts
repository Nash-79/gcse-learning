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
    aqaRef: ["3.1"],
    examBoards: ["ocr", "aqa"],
    icon: "🧮",
    color: "primary",
    description: "Searching, sorting, and computational thinking concepts.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "Computational thinking: abstraction (remove irrelevant detail), decomposition (break into sub-problems), algorithmic thinking (step-by-step solution).",
      "Linear search: O(n), works on unsorted lists. Binary search: O(log n), requires sorted list.",
      "Bubble sort: O(n²), compares adjacent pairs. Insertion sort: O(n²) worst, O(n) nearly sorted.",
      "Flowchart symbols: oval=terminator, rectangle=process, diamond=decision, parallelogram=I/O.",
      "Trace tables show how variable values change line by line during algorithm execution.",
    ],

    sections: [
      {
        id: "computational-thinking",
        title: "Computational Thinking",
        icon: "🧠",
        specPoint: "OCR J277 2.1a — Computational thinking: abstraction, decomposition, and algorithmic thinking.",
        content: "Computational thinking is the process of breaking down complex problems so they can be solved by a computer. It involves three key techniques:",

        revisionSummary: [
          "Abstraction: remove unnecessary detail — only keep what's needed to solve the problem.",
          "Decomposition: break a big problem into smaller, independently solvable sub-problems.",
          "Algorithmic thinking: create precise, step-by-step instructions for each sub-problem.",
        ],

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

        commonMistakes: [
          {
            mistake: "Describing abstraction as just 'simplifying' without explaining what is removed.",
            correction: "Abstraction means identifying and removing irrelevant details for the specific problem. Always state WHAT is being ignored and WHY it doesn't matter.",
          },
        ],

        flashcards: [
          { front: "What is abstraction in computational thinking?", back: "Removing unnecessary detail from a problem to focus only on the relevant information needed to solve it. E.g., a map uses abstraction — it shows roads but not grass colours." },
          { front: "What is decomposition?", back: "Breaking a complex problem down into smaller, more manageable sub-problems that can each be solved independently." },
          { front: "Give an example of decomposition for building a school attendance system.", back: "Sub-problems: student login, register/mark attendance, store records in database, generate reports, send alerts for absences." },
        ],

        examTip: "In 'explain' questions, always give a specific example. Don't just say 'removing unnecessary detail' — say WHAT details are unnecessary and WHY.",
      },
      {
        id: "flowcharts-pseudocode",
        title: "Flowcharts & Pseudocode",
        icon: "📐",
        specPoint: "OCR J277 2.1b — Algorithm representation: flowcharts and pseudocode.",
        content: "Algorithms can be represented visually (flowcharts) or in structured English (pseudocode). You need to both read and create them.\n\nFlowchart symbols you MUST know:\n• Oval/Rounded rectangle — Start/End (terminator)\n• Rectangle — Process (action/calculation)\n• Diamond — Decision (Yes/No question)\n• Parallelogram — Input/Output\n• Arrow — Flow of control",

        revisionSummary: [
          "Oval = Start/Stop; Rectangle = Process; Diamond = Decision; Parallelogram = Input/Output.",
          "All decisions must have exactly two labelled outputs (Yes/No or True/False).",
          "Always include Start and Stop terminators.",
        ],

        images: [
          {
            src: "/diagrams/flowchart-symbols.svg",
            alt: "Standard flowchart symbols: terminator oval, process rectangle, decision diamond, input/output parallelogram",
            caption: "Figure — Standard flowchart symbols used in GCSE Computer Science. Every flowchart must use these shapes consistently.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing the 4 standard flowchart symbols side by side with labels and examples. Include: 1) Oval (Terminator) - Start/Stop, 2) Rectangle (Process) - e.g. total = total + 1, 3) Diamond (Decision) - e.g. Is score >= 50? with Yes/No exits, 4) Parallelogram (Input/Output) - e.g. Input name. Use clean, clear design with colour coding.",
          },
        ],

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
        flashcards: [
          { front: "What shape is used for a decision in a flowchart?", back: "A diamond (rhombus). It must always have exactly two exit paths, labelled Yes and No (or True/False)." },
          { front: "What is a parallelogram used for in a flowchart?", back: "Input or Output — data entering or leaving the algorithm. E.g., 'Enter name' or 'Display total'." },
        ],

        examTip: "When drawing flowcharts: use a ruler, label all arrows from decisions (Yes/No), and always include Start and Stop terminators.",
      },
      {
        id: "trace-tables",
        title: "Trace Tables",
        icon: "📊",
        specPoint: "OCR J277 2.1c — Tracing algorithms using trace tables.",
        content: "A trace table (dry run) shows how variable values change as an algorithm executes, step by step. Each row represents a line of code being executed.\n\nHow to complete a trace table:\n1. Create a column for each variable and one for any output\n2. Work through the algorithm line by line\n3. Only write a value when it CHANGES\n4. If a variable doesn't change on that line, leave it blank\n5. Record any output in the output column",
        codeExample: {
          language: "python",
          code: "# Trace this code:\nx = 1\nfor i in range(1, 4):\n    x = x * i\n    print(x)\n\n# Trace table:\n# | i | x | Output |\n# |---|---|--------|\n# |   | 1 |        |\n# | 1 | 1 |   1    |\n# | 2 | 2 |   2    |\n# | 3 | 6 |   6    |",
          explanation: "Each iteration, i takes the next value from range. x is multiplied by i. The output column shows what is printed.",
        },
        flashcards: [
          { front: "What is a trace table used for?", back: "To manually simulate (dry run) an algorithm step by step, tracking how each variable changes and what is output — used to find logic errors." },
          { front: "When completing a trace table, when do you write in a cell?", back: "Only when the value of that variable CHANGES on that line. Leave cells blank if the value stays the same." },
        ],

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
        specPoint: "OCR J277 2.1d — Search algorithms: linear search.",
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

        flashcards: [
          { front: "What is linear search and when is it used?", back: "Linear search checks each item in order from start to finish. Used when the list is unsorted or very small." },
          { front: "What is the time complexity of linear search?", back: "O(n) — in the worst case, all n items must be checked (target is last or not present)." },
        ],
      },
      {
        id: "binary-search",
        title: "Binary Search",
        icon: "✂️",
        specPoint: "OCR J277 2.1d — Search algorithms: binary search.",
        content: "Binary search repeatedly halves the search space by comparing the middle element. It requires a SORTED list.\n\nHow it works:\n1. Find the middle element\n2. If it matches the target, return it\n3. If the target is LESS, search the LEFT half\n4. If the target is GREATER, search the RIGHT half\n5. Repeat until found or the sublist is empty\n\nTime complexity: O(log n) — much faster than linear for large lists.",
        codeExample: {
          language: "python",
          code: "def binary_search(data, target):\n    low = 0\n    high = len(data) - 1\n    \n    while low <= high:\n        mid = (low + high) // 2\n        if data[mid] == target:\n            return mid\n        elif data[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Example (list MUST be sorted)\nnumbers = [1, 3, 5, 7, 9, 11, 13, 15]\nresult = binary_search(numbers, 7)\nprint(f\"Found at index: {result}\")  # Output: Found at index: 3",
          explanation: "Each iteration halves the search space. For a list of 1000 items, binary search needs at most 10 comparisons vs 1000 for linear search.",
        },
        images: [
          {
            src: "/diagrams/binary-search-steps.svg",
            alt: "Binary search trace on sorted list [2,5,8,12,16,23,38,45,72,91] finding 23 in 3 steps",
            caption: "Figure — Binary search finds 23 in just 3 comparisons. Each step halves the remaining search space.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing binary search step by step. Use a sorted array of 10 numbers. Show 3 steps: highlight the mid element, cross out the eliminated half, and show the found element. Label low, high, and mid pointers. Use blue for active search area, grey for eliminated, green for found.",
          },
        ],

        workedExample: {
          question: "Trace a binary search for the value 38 in the sorted list [2, 5, 8, 12, 16, 23, 38, 45, 72, 91]. [4 marks]",
          steps: [
            { step: "low=0, high=9, mid=4. list[4]=16. 38>16, so search right: low=5.", explanation: "First comparison. Target is larger than mid, discard left half." },
            { step: "low=5, high=9, mid=7. list[7]=45. 38<45, so search left: high=6.", explanation: "Second comparison. Target is smaller than mid, discard right half." },
            { step: "low=5, high=6, mid=5. list[5]=23. 38>23, so search right: low=6.", explanation: "Third comparison. Target is larger, discard left." },
            { step: "low=6, high=6, mid=6. list[6]=38. Found! Return index 6.", explanation: "Fourth comparison. Target matches mid — return position." },
          ],
          answer: "38 found at index 6 after 4 comparisons.",
          markScheme: "1 mark per step correctly shown (mid calculated correctly, correct comparison, correct half discarded). Full marks for correct final index.",
        },

        flashcards: [
          { front: "What is the key prerequisite for binary search?", back: "The list MUST be sorted in order (ascending or descending) before binary search can be applied." },
          { front: "Why is binary search faster than linear search?", back: "Binary search is O(log n) — it halves the search space each step. For 1024 items: at most 10 comparisons. Linear search would need up to 1024 comparisons." },
          { front: "How is the middle element calculated in binary search?", back: "mid = (low + high) // 2 (integer division to get a whole number index)." },
        ],

        examTip: "ALWAYS state that binary search requires a SORTED list. This is a key prerequisite that often earns a mark.",
      },
      {
        id: "bubble-sort",
        title: "Bubble Sort",
        icon: "🫧",
        specPoint: "OCR J277 2.1e — Sort algorithms: bubble sort and insertion sort.",
        content: "Bubble sort repeatedly compares adjacent pairs and swaps them if they're in the wrong order. The largest values 'bubble' to the end.\n\nHow it works:\n1. Compare the first two adjacent elements\n2. If they're in the wrong order, swap them\n3. Move to the next pair and repeat\n4. After one pass, the largest element is at the end\n5. Repeat passes until no swaps are needed\n\nTime complexity: O(n²) — inefficient for large datasets.",
        codeExample: {
          language: "python",
          code: "def bubble_sort(data):\n    n = len(data)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - 1 - i):\n            if data[j] > data[j + 1]:\n                data[j], data[j + 1] = data[j + 1], data[j]\n                swapped = True\n        if not swapped:\n            break  # Already sorted\n    return data\n\nnumbers = [64, 34, 25, 12, 22, 11, 90]\nprint(bubble_sort(numbers))",
          explanation: "The outer loop runs n-1 passes. The inner loop compares adjacent pairs. The 'swapped' flag optimises by stopping early if already sorted.",
        },

        images: [
          {
            src: "/diagrams/sorting-algorithms.svg",
            alt: "Bubble sort step-by-step trace on [5, 3, 8, 1, 4]",
            caption: "Figure — Bubble sort trace. After each pass, the largest unsorted value 'bubbles' to its final position.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing bubble sort step by step on the list [5, 3, 8, 1, 4]. Show each pass with swapped pairs highlighted in red, unchanged pairs in blue, and final sorted positions in green. Label each pass. Include a complexity box showing O(n²).",
          },
        ],

        workedExample: {
          question: "Perform one pass of bubble sort on the list [7, 3, 9, 2, 5]. Show all comparisons and swaps. [3 marks]",
          steps: [
            { step: "Compare 7 and 3: 7>3 → swap → [3, 7, 9, 2, 5]", explanation: "First pair — wrong order, so swap." },
            { step: "Compare 7 and 9: 7<9 → no swap → [3, 7, 9, 2, 5]", explanation: "Second pair — correct order, no change." },
            { step: "Compare 9 and 2: 9>2 → swap → [3, 7, 2, 9, 5]", explanation: "Third pair — wrong order, swap." },
            { step: "Compare 9 and 5: 9>5 → swap → [3, 7, 2, 5, 9]", explanation: "Fourth pair — wrong order, swap. After pass 1: [3, 7, 2, 5, 9]. 9 is now in final position." },
          ],
          answer: "After one pass: [3, 7, 2, 5, 9]. Three swaps were made. 9 (the largest) is now in its final position.",
          markScheme: "1 mark: correct final list; 1 mark: 3 swaps identified; 1 mark: largest element at end.",
        },

        flashcards: [
          { front: "What happens after each complete pass of bubble sort?", back: "The largest unsorted value is moved to its final correct position at the end of the unsorted portion. After n-1 passes, the list is sorted." },
          { front: "What is the best case time complexity of bubble sort?", back: "O(n) — if the list is already sorted, one pass is needed with no swaps, and the algorithm detects it's done (using a 'swapped' flag)." },
        ],
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

        flashcards: [
          { front: "How does insertion sort work?", back: "Takes the next unsorted element (the 'key'), compares it backwards through the sorted portion, shifts larger elements right, and inserts the key in its correct position." },
          { front: "When is insertion sort more efficient than bubble sort?", back: "When the list is already nearly sorted — insertion sort is O(n) for nearly-sorted data, while bubble sort is still O(n²) unless a 'no swap' optimisation is used." },
        ],
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
    aqaRef: ["3.2", "3.7"],
    examBoards: ["ocr", "aqa"],
    icon: "💻",
    color: "secondary",
    description: "Variables, data types, operators, selection, iteration, arrays, and subroutines.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "Variables store changeable values; constants store fixed values (UPPER_CASE by convention).",
      "input() always returns a string — cast to int() or float() for numbers.",
      "FOR loops are count-controlled; WHILE loops are condition-controlled.",
      "Functions return a value; procedures do not.",
      "Local variables exist only in their subroutine; global variables are accessible everywhere.",
    ],

    sections: [
      {
        id: "variables-constants",
        title: "Variables & Constants",
        icon: "📦",
        specPoint: "OCR J277 2.2a — Variables and constants.",
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

        flashcards: [
          { front: "What is the difference between a variable and a constant?", back: "A variable's value can change during program execution. A constant's value is set once and should not change (e.g., PI = 3.14159, MAX_SIZE = 100)." },
          { front: "Why use constants instead of magic numbers?", back: "Constants make code more readable (PI is clearer than 3.14159) and easier to maintain — change in one place affects the whole program." },
        ],
      },
      {
        id: "data-types",
        title: "Data Types & Casting",
        icon: "🏷️",
        specPoint: "OCR J277 2.2b — Data types: integer, real, Boolean, character, string; casting.",
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
        commonMistakes: [
          {
            mistake: "Using input() result directly in maths without casting.",
            correction: "input() always returns a string. '5' + '3' = '53' (concatenation). int(input()) or float(input()) converts to a number first.",
          },
        ],

        flashcards: [
          { front: "What data type does input() always return in Python?", back: "A string (str). You must cast to int() or float() if you need to do arithmetic with the result." },
          { front: "What is casting?", back: "Converting a value from one data type to another. E.g., int('42') converts the string '42' to the integer 42; str(100) converts integer 100 to the string '100'." },
        ],

        examTip: "The most common mistake: forgetting to cast input(). Always wrap with int() or float() for numbers.",
      },
      {
        id: "operators",
        title: "Operators",
        icon: "➕",
        specPoint: "OCR J277 2.2c — Arithmetic, comparison, and Boolean operators.",
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
        flashcards: [
          { front: "What is the difference between / and // in Python?", back: "/ is float division (10/3 = 3.333). // is integer (floor) division (10//3 = 3). In OCR ERL this is called DIV." },
          { front: "What does the % operator do?", back: "Returns the remainder after division (modulus). E.g., 10 % 3 = 1. In OCR ERL this is called MOD. Used to check if a number is even: num % 2 == 0." },
        ],

        examTip: "DIV (//) gives the whole number quotient. MOD (%) gives the remainder. These are heavily tested in OCR exams!",
      },
      {
        id: "selection",
        title: "Selection (If/Elif/Else)",
        icon: "🔀",
        specPoint: "OCR J277 2.2d — Selection statements: if, elif, else.",
        content: "Selection allows a program to make decisions and execute different code based on conditions.",
        codeExample: {
          language: "python",
          code: "# Simple if/else\nage = int(input(\"Enter your age: \"))\nif age >= 18:\n    print(\"Adult\")\nelif age >= 13:\n    print(\"Teenager\")\nelse:\n    print(\"Child\")\n\n# Nested selection\nscore = int(input(\"Enter score: \"))\nif score >= 50:\n    if score >= 80:\n        print(\"Distinction\")\n    else:\n        print(\"Pass\")\nelse:\n    print(\"Fail\")",
          explanation: "If the condition is True, that block runs. Elif checks additional conditions. Else catches everything else. Conditions are checked top-to-bottom.",
        },

        flashcards: [
          { front: "What is the difference between if/elif and nested if?", back: "if/elif checks conditions in sequence (only one branch runs). Nested if puts an if inside another if — both outer and inner conditions must be true for the inner branch." },
          { front: "What happens if none of the if/elif conditions are true and there is no else?", back: "Nothing happens — no code in the selection block runs. The program continues after the if/elif block." },
        ],
      },
      {
        id: "iteration",
        title: "Iteration (Loops)",
        icon: "🔁",
        specPoint: "OCR J277 2.2e — Iteration: for loops and while loops.",
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

        commonMistakes: [
          {
            mistake: "Using a FOR loop when the number of iterations isn't known.",
            correction: "Use a WHILE loop when you don't know how many times to repeat — e.g., asking for input until it's valid, or a game loop that runs until the player wins.",
          },
        ],

        flashcards: [
          { front: "When should you use a for loop vs a while loop?", back: "FOR loop: when you know how many iterations are needed (e.g., process 10 items). WHILE loop: when you need to repeat until a condition changes (e.g., repeat until valid input)." },
          { front: "What causes an infinite loop in a while loop?", back: "If the condition never becomes False — usually because the variable that the condition checks is never updated inside the loop body." },
        ],
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
        specPoint: "OCR J277 2.2f — Subroutines: functions, procedures, parameters, and scope.",
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

        commonMistakes: [
          {
            mistake: "Confusing parameters and arguments.",
            correction: "Parameters are the variable names in the subroutine definition (def greet(name)). Arguments are the actual values passed when calling it (greet('Alice')).",
          },
        ],

        flashcards: [
          { front: "What is the difference between a function and a procedure?", back: "A function returns a value (uses return). A procedure performs a task but does not return a value." },
          { front: "What is variable scope?", back: "Scope defines where a variable can be accessed. Local variables only exist inside the subroutine they're declared in. Global variables are accessible anywhere in the program." },
          { front: "Why should you use subroutines?", back: "They allow code reuse (write once, call many times), make programs easier to read/debug, support decomposition, and reduce repetition." },
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
      {
        id: "string-manipulation",
        title: "String Manipulation",
        icon: "✂️",
        content: "String handling is a very commonly tested topic. You must know how to manipulate strings in both Python and OCR Exam Reference Language.",
        tableData: {
          headers: ["Operation", "Python", "OCR ERL", "Example Output"],
          rows: [
            ["Length", "len(name)", "name.length", "9 (for \"Frederick\")"],
            ["Substring/Slice", "name[0:4]", "name.substring(0, 4)", "\"Fred\""],
            ["Upper Case", "name.upper()", "name.upper", "\"FREDERICK\""],
            ["Lower Case", "name.lower()", "name.lower", "\"frederick\""],
            ["Char to ASCII", "ord(\"A\")", "ASC(\"A\")", "65"],
            ["ASCII to Char", "chr(65)", "CHR(65)", "\"A\""],
            ["Concatenation", "\"Hello \" + name", "\"Hello \" + name", "\"Hello Frederick\""],
          ],
        },
        codeExample: {
          language: "python",
          code: "# String slicing\nword = \"Computer\"\nprint(word[0])      # \"C\" (first character)\nprint(word[0:4])    # \"Comp\" (index 0 to 3)\nprint(word[-1])     # \"r\" (last character)\nprint(word[4:])     # \"uter\" (from index 4 to end)\n\n# Useful methods\nemail = \"  User@Email.COM  \"\nprint(email.strip())   # \"User@Email.COM\" (remove whitespace)\nprint(email.lower())   # \"  user@email.com  \"\n\n# ASCII conversion\nfor char in \"ABC\":\n    print(f\"{char} = {ord(char)}\")  # A=65, B=66, C=67",
          explanation: "String indexing starts at 0. Slicing uses [start:end] where end is exclusive. Negative indices count from the end.",
        },
        examTip: "ASCII values: A=65, a=97, 0=48. You can convert between upper and lower case by adding/subtracting 32 from the ASCII value.",
      },
      {
        id: "records",
        title: "Records (Dictionaries)",
        icon: "📋",
        content: "A record is a data structure that groups related data of DIFFERENT types under one identifier. Each piece of data is stored in a field.\n\nIn Python, records are implemented using dictionaries. In OCR ERL, the concept may be explained in the question.",
        codeExample: {
          language: "python",
          code: "# Python dictionary (record)\nstudent = {\n    \"name\": \"Alice\",\n    \"age\": 15,\n    \"grade\": \"A\",\n    \"enrolled\": True\n}\n\n# Accessing fields\nprint(student[\"name\"])     # \"Alice\"\nprint(student[\"age\"])      # 15\n\n# Modifying a field\nstudent[\"age\"] = 16\n\n# Array of records\nclass_list = [\n    {\"name\": \"Alice\", \"score\": 85},\n    {\"name\": \"Bob\", \"score\": 72},\n    {\"name\": \"Charlie\", \"score\": 91}\n]\n\nfor pupil in class_list:\n    print(f\"{pupil['name']}: {pupil['score']}\")",
          explanation: "Dictionaries store key-value pairs. Keys are strings, values can be any data type. This makes them ideal for representing records with mixed data types.",
        },
        keyTerms: [
          { term: "Record", definition: "A data structure that combines multiple fields of different data types under one identifier" },
          { term: "Field", definition: "An individual piece of data within a record (e.g., name, age, grade)" },
          { term: "Dictionary", definition: "Python's implementation of a record — stores key-value pairs" },
        ],
      },
      {
        id: "sql-detail",
        title: "SQL (Structured Query Language)",
        icon: "🗃️",
        content: "SQL is used to search and manage databases. At GCSE level you need to SELECT, filter with WHERE, and sort with ORDER BY.\n\nSQL is NOT case-sensitive but keywords are conventionally written in UPPERCASE.",
        tableData: {
          headers: ["SQL Keyword", "Purpose", "Example"],
          rows: [
            ["SELECT", "Choose which fields to retrieve", "SELECT name, age FROM students"],
            ["FROM", "Specify which table to query", "SELECT * FROM heroes"],
            ["WHERE", "Filter rows based on conditions", "WHERE age > 16"],
            ["AND / OR", "Combine multiple conditions", "WHERE age > 16 AND grade = 'A'"],
            ["ORDER BY", "Sort results (ASC/DESC)", "ORDER BY score DESC"],
            ["LIKE", "Pattern matching with wildcards", "WHERE name LIKE 'A%'"],
            ["* (wildcard)", "Select all fields", "SELECT * FROM table"],
            ["% (wildcard)", "Any number of characters (in LIKE)", "WHERE name LIKE '%son'"],
          ],
        },
        codeExample: {
          language: "python",
          code: "# SQL Examples (not Python — for reference):\n\n# Get all students\n# SELECT * FROM students\n\n# Get names where score > 80\n# SELECT name FROM students WHERE score > 80\n\n# Get students ordered by score (highest first)\n# SELECT name, score FROM students ORDER BY score DESC\n\n# Get students whose name starts with 'A'\n# SELECT * FROM students WHERE name LIKE 'A%'\n\n# Multiple conditions\n# SELECT name FROM students WHERE age > 14 AND grade = 'A'",
          explanation: "SELECT chooses columns, FROM chooses the table, WHERE filters rows, ORDER BY sorts results. DESC = descending (Z-A, 9-0), ASC = ascending (A-Z, 0-9).",
        },
        examTip: "In the exam, write SQL on separate lines for clarity. Don't forget: strings need quotes in WHERE (grade = 'A'), numbers don't (age > 16).",
      },
      {
        id: "random-numbers",
        title: "Random Number Generation",
        icon: "🎲",
        content: "Most programs that involve games, simulations, or security need random numbers. Each language has its own way of generating them.",
        tableData: {
          headers: ["Language", "Code", "Output"],
          rows: [
            ["OCR ERL", "r = random(1, 10)", "Random integer 1-10"],
            ["Python", "import random\\nr = random.randint(1, 10)", "Random integer 1-10"],
          ],
        },
        codeExample: {
          language: "python",
          code: "import random\n\n# Random integer between 1 and 6 (inclusive)\ndice = random.randint(1, 6)\nprint(f\"You rolled: {dice}\")\n\n# Random choice from a list\ncolours = [\"red\", \"blue\", \"green\", \"yellow\"]\npick = random.choice(colours)\nprint(f\"Random colour: {pick}\")\n\n# Guessing game\nsecret = random.randint(1, 100)\nguess = 0\nwhile guess != secret:\n    guess = int(input(\"Guess (1-100): \"))\n    if guess < secret:\n        print(\"Too low!\")\n    elif guess > secret:\n        print(\"Too high!\")\nprint(\"Correct!\")",
          explanation: "random.randint(a, b) generates an integer from a to b inclusive. random.choice() picks a random item from a list.",
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
    aqaRef: ["3.2", "3.6"],
    examBoards: ["ocr", "aqa"],
    icon: "🛡️",
    color: "accent",
    description: "Input validation, testing, error handling, and defensive design.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "Defensive design: anticipate errors, validate inputs, authenticate users, write maintainable code.",
      "Testing types: normal (typical values), boundary (edge of valid range), erroneous (should be rejected).",
      "Syntax errors: code violates language rules. Logic errors: code runs but gives wrong output. Runtime errors: crash during execution.",
      "try/except handles runtime errors gracefully instead of crashing.",
    ],

    sections: [
      {
        id: "defensive-design",
        title: "Defensive Design",
        icon: "🏰",
        specPoint: "OCR J277 2.3a — Defensive design: input validation, authentication, maintainability.",
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

        flashcards: [
          { front: "What is input validation?", back: "Checking that data entered by the user meets the required format, type, and range before the program processes it." },
          { front: "What is authentication in programming?", back: "Verifying a user's identity before granting access — typically using a username and password, with limited attempts to prevent brute force." },
        ],
      },
      {
        id: "testing",
        title: "Testing Strategies",
        icon: "🧪",
        specPoint: "OCR J277 2.3b — Testing: normal, boundary, and erroneous data.",
        content: "Testing ensures a program works correctly. Three types of test data should be used:",
        tableData: {
          headers: ["Test Type", "Purpose", "Example (age 0-120)", "Expected Result"],
          rows: [
            ["Normal", "Typical valid data that should be accepted", "25, 50, 70", "Accepted"],
            ["Boundary", "Values at the edge of valid ranges", "0, 1, 119, 120", "Accepted (at limits)"],
            ["Erroneous", "Invalid data that should be rejected", "-5, 121, \"hello\", 3.5", "Rejected with error message"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Only testing values in the middle of the valid range.",
            correction: "Always test boundary values too — values AT the edge of the range (0 and 120) AND just outside it (-1 and 121). Boundary errors are a very common bug.",
          },
        ],

        workedExample: {
          question: "A program accepts passwords between 8 and 20 characters. Create a test plan with at least 4 test cases. [4 marks]",
          steps: [
            { step: "Normal: 12-character password → accepted", explanation: "Typical mid-range valid input." },
            { step: "Boundary: 8-character password → accepted", explanation: "At the minimum valid boundary." },
            { step: "Boundary: 20-character password → accepted", explanation: "At the maximum valid boundary." },
            { step: "Erroneous: 7-character password → rejected", explanation: "Just below minimum boundary — should fail." },
            { step: "Erroneous: 21-character password → rejected", explanation: "Just above maximum boundary — should fail." },
          ],
          answer: "5-row test plan with: normal (e.g., 12 chars → accepted), boundary at 8 and 20 (accepted), erroneous at 7 and 21 (rejected).",
          markScheme: "1 mark per correct test case (test data + expected result). Must include at least one boundary and one erroneous case for full marks.",
        },

        flashcards: [
          { front: "What is the difference between boundary and erroneous test data?", back: "Boundary data tests values AT the edge of the valid range (should be accepted). Erroneous data is completely invalid (wrong type or outside valid range — should be rejected)." },
          { front: "For a valid range of 1-100, what are the boundary test values?", back: "Test: 1 (min boundary, accept), 100 (max boundary, accept), 0 (just below min, reject), 101 (just above max, reject)." },
        ],

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
        specPoint: "OCR J277 2.3c — Syntax, logic, and runtime errors.",
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

        commonMistakes: [
          {
            mistake: "Calling a logic error a 'syntax error'.",
            correction: "Syntax errors are detected by the translator BEFORE the program runs. Logic errors are NOT detected — the program runs fine but gives the wrong answer. You must find these through testing.",
          },
        ],

        flashcards: [
          { front: "What is a syntax error?", back: "When code breaks the rules of the programming language (e.g., missing colon, mismatched brackets). Detected by the translator before the program runs." },
          { front: "What is a logic error?", back: "Code runs without crashing but produces the wrong output. E.g., writing average = total * count instead of total / count. Must be found through testing." },
          { front: "What is a runtime error?", back: "An error that occurs while the program is running, causing it to crash. E.g., dividing by zero, accessing an index that doesn't exist, or file not found." },
        ],
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
    aqaRef: ["3.4"],
    examBoards: ["ocr", "aqa"],
    icon: "🔲",
    color: "primary",
    description: "Logic gates, truth tables, and Boolean expressions.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "AND: output 1 only when BOTH inputs are 1. OR: output 1 when AT LEAST ONE input is 1. NOT: inverts the input.",
      "Truth tables: 2 inputs = 4 rows (2²), 3 inputs = 8 rows (2³).",
      "NAND = NOT + AND (circle on output of AND). NOR = NOT + OR (circle on output of OR).",
      "Boolean expressions use AND, OR, NOT — map directly to Python and, or, not keywords.",
    ],

    sections: [
      {
        id: "logic-gates",
        title: "Logic Gates & Truth Tables",
        icon: "⚡",
        specPoint: "OCR J277 2.4a — Logic gates: AND, OR, NOT and their truth tables.",
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

        images: [
          {
            src: "/diagrams/logic-gates.svg",
            alt: "AND, OR, NOT, NAND, NOR logic gate symbols with truth table outputs",
            caption: "Figure — Logic gate symbols with truth tables. The small circle on NAND/NOR output represents inversion (NOT).",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing 5 logic gate symbols side by side: AND, OR, NOT, NAND, NOR. For each gate show: the standard symbol shape, input labels (A, B), output label, and a mini truth table. Use colour coding per gate type. Include a key exam tips box.",
          },
        ],

        flashcards: [
          { front: "What is the rule for an AND gate?", back: "Output is 1 ONLY when BOTH inputs are 1. Any 0 input gives 0 output." },
          { front: "What is the rule for an OR gate?", back: "Output is 1 when AT LEAST ONE input is 1. Only outputs 0 when ALL inputs are 0." },
          { front: "What does a NOT gate do?", back: "Inverts the input — 0 becomes 1, 1 becomes 0. It has only one input and one output." },
        ],

        examTip: "Draw truth tables systematically — list ALL input combinations. For 2 inputs: 4 rows (00, 01, 10, 11). For 3 inputs: 8 rows.",
      },
      {
        id: "truth-tables",
        title: "Complete Truth Tables",
        icon: "📊",
        specPoint: "OCR J277 2.4b — Complete truth tables for AND, OR, NOT.",
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

        workedExample: {
          question: "Complete a truth table for the expression Q = (A AND B) OR (NOT C). [4 marks]",
          steps: [
            { step: "List all 8 combinations for 3 inputs (A, B, C): 000, 001, 010, 011, 100, 101, 110, 111", explanation: "2³ = 8 rows needed." },
            { step: "Calculate A AND B column first.", explanation: "A AND B = 1 only when both A=1 and B=1." },
            { step: "Calculate NOT C column.", explanation: "NOT C: flip each C value." },
            { step: "Q = (A AND B) OR (NOT C): combine with OR.", explanation: "1 if either column is 1." },
          ],
          answer: "Row by row: (0,0,0)→1; (0,0,1)→0; (0,1,0)→1; (0,1,1)→0; (1,0,0)→1; (1,0,1)→0; (1,1,0)→1; (1,1,1)→1",
          markScheme: "1 mark: correct A AND B column; 1 mark: correct NOT C column; 2 marks: all 8 Q values correct (deduct 1 per error).",
        },

        flashcards: [
          { front: "How many rows does a truth table need for 3 inputs?", back: "2³ = 8 rows. In general, n inputs requires 2ⁿ rows." },
          { front: "For Q = (A AND B) OR (NOT C), what is Q when A=1, B=1, C=1?", back: "(1 AND 1) OR (NOT 1) = 1 OR 0 = 1." },
        ],
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
        flashcards: [
          { front: "An alarm sounds if door is open AND armed, OR if panic button is pressed. Write the Boolean expression.", back: "Q = (D AND A) OR P  (where D=door open, A=armed, P=panic button, Q=alarm)" },
          { front: "How do you read a Boolean expression: NOT (A AND B)?", back: "Calculate A AND B first, then invert the result. This is a NAND operation." },
        ],

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
    aqaRef: ["3.2", "3.7"],
    examBoards: ["ocr", "aqa"],
    icon: "🛠️",
    color: "secondary",
    description: "High-level vs low-level languages and IDE features.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "High-level: English-like, portable, easier to read/write, needs translator (compiler/interpreter).",
      "Low-level: closer to hardware, harder to write, platform-specific, used for OS/drivers/embedded systems.",
      "IDE features: syntax highlighting, auto-complete, error diagnostics, debugger (breakpoints, stepping, variable watch).",
      "Breakpoints pause execution so you can inspect variable values at a specific line.",
    ],

    sections: [
      {
        id: "language-levels",
        title: "High-Level vs Low-Level Languages",
        icon: "📊",
        specPoint: "OCR J277 2.5a — High-level and low-level languages, machine code, and assembly.",
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

        commonMistakes: [
          {
            mistake: "Saying high-level languages are always better.",
            correction: "Low-level languages give direct hardware control, produce faster/smaller programs, and are essential for device drivers, embedded systems, and OS kernels where high-level abstractions are inappropriate.",
          },
        ],

        flashcards: [
          { front: "Give two advantages of a high-level language over assembly language.", back: "Any two: easier to read and write; portable (runs on multiple platforms); one statement = many machine instructions; faster to develop; easier to debug." },
          { front: "Why are low-level languages used for embedded systems?", back: "Embedded systems have very limited memory and processing power. Low-level code produces small, fast programs with direct hardware control — essential for microcontrollers in devices like washing machines." },
        ],
      },
      {
        id: "ide-features",
        title: "IDE Features",
        icon: "🖥️",
        specPoint: "OCR J277 2.5b — IDE features: editor, syntax highlighting, auto-complete, debugging tools.",
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

        workedExample: {
          question: "Describe two features of an IDE that help a programmer find and fix errors. [4 marks]",
          steps: [
            { step: "Error diagnostics: the IDE highlights lines with errors and describes the problem.", explanation: "This helps the programmer identify where a syntax error is without having to run the code first." },
            { step: "Breakpoints allow execution to pause at a specific line.", explanation: "The programmer can then inspect variable values at that point to understand why a logic error is occurring." },
          ],
          answer: "Error diagnostics highlight syntax errors with descriptions; breakpoints pause execution so variable values can be inspected to find logic errors.",
          markScheme: "1 mark per feature named + 1 mark for how it helps the programmer. Max 4 marks for 2 features.",
        },

        flashcards: [
          { front: "What is a breakpoint in an IDE?", back: "A marker set by the programmer on a specific line. When the program is run in debug mode, execution pauses at the breakpoint so variable values can be inspected." },
          { front: "How does syntax highlighting help a programmer?", back: "Different code elements (keywords, strings, comments) appear in different colours, making code easier to read and making errors like unclosed strings immediately visible." },
          { front: "What is auto-complete in an IDE?", back: "The IDE suggests function names, variable names, and keywords as you type, reducing typos and helping programmers remember available methods." },
        ],

        examTip: "When asked about IDE features, always say WHAT the feature does AND HOW it helps the programmer. That's usually 2 marks per feature.",
      },
    ],
  },
];
