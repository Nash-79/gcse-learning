import type { TopicContent } from "../topicContent";

export const twoDArrays: TopicContent = {
  topicSlug: "2d-arrays",
  explanation: [
    "A two-dimensional (2D) array is a list of lists — think of it as a table with rows and columns. Each element is accessed using two indexes: one for the row and one for the column. In Python, we create 2D arrays using nested lists.",
    "To access an element, use grid[row][column]. Remember that indexing starts at 0, so grid[0][0] is the first element (top-left), grid[0][2] is the third element in the first row, and grid[1][0] is the first element in the second row.",
    "You can loop through a 2D array using nested for loops: the outer loop goes through each row, and the inner loop goes through each element in that row. This is a common exam pattern you must know for OCR J277.",
    "2D arrays are used in many real-world scenarios: grids for games (noughts and crosses, battleships), seating plans, timetables, and spreadsheet-style data. The OCR specification requires you to create, traverse, and modify 2D arrays."
  ],
  codeExamples: [
    {
      title: "Creating and Accessing a 2D Array",
      code: `# A 3x3 grid (3 rows, 3 columns)
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Access: grid[row][column]
print(grid[0][0])    # 1 (first row, first column)
print(grid[1][2])    # 6 (second row, third column)
print(grid[2][1])    # 8 (third row, second column)

# Modify an element
grid[1][1] = 99
print(grid[1][1])    # 99`,
      description: "Access elements using grid[row][column]. Both indexes start at 0."
    },
    {
      title: "Looping Through a 2D Array",
      code: `grid = [
    ["A", "B", "C"],
    ["D", "E", "F"],
    ["G", "H", "I"]
]

# Print every element
for row in grid:
    for item in row:
        print(item, end=" ")
    print()  # New line after each row

# Output:
# A B C
# D E F
# G H I`,
      description: "Nested loops: outer loop for rows, inner loop for columns."
    },
    {
      title: "Practical Example — Class Register",
      code: `# Each row: [name, age, grade]
students = [
    ["Alice", 15, "A"],
    ["Bob", 16, "B"],
    ["Charlie", 15, "A"]
]

# Print all student names
for student in students:
    print(student[0])

# Find a specific student
search = "Bob"
for student in students:
    if student[0] == search:
        print(f"{search} is {student[1]} and got {student[2]}")`,
      description: "2D arrays can store records — each row is a record, each column is a field."
    },
    {
      title: "Noughts and Crosses Board",
      code: `board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "]
]

# Place some moves
board[1][1] = "X"  # Centre
board[0][0] = "O"  # Top-left
board[2][2] = "X"  # Bottom-right

# Display the board
for row in board:
    print(" | ".join(row))
    print("---------")`,
      description: "A classic OCR exam scenario — implementing a game board as a 2D array."
    }
  ],
  keyPoints: [
    "A 2D array is a list of lists — like a table with rows and columns.",
    "Access elements with two indexes: array[row][column]. Both start at 0.",
    "Use nested for loops to traverse all elements in a 2D array.",
    "The outer loop iterates through rows, the inner loop through columns.",
    "2D arrays are used for grids, tables, game boards, and structured data.",
    "You can modify individual elements: grid[1][2] = 'new value'."
  ],
  commonMistakes: [
    { mistake: "Confusing row and column order: grid[column][row]", fix: "Always use grid[row][column] — row first, then column." },
    { mistake: "Forgetting that indexes start at 0, not 1", fix: "grid[0][0] is the first element. grid[1][1] is the second row, second column." },
    { mistake: "Trying to access an index that doesn't exist: grid[3][0] on a 3-row grid", fix: "A 3-row grid has indexes 0, 1, 2. Index 3 causes an IndexError." }
  ],
  workedExample: {
    title: "Seating Plan Checker",
    problem: "Create a 3x4 seating plan. Allow the user to check if a seat is occupied by entering a row and column number.",
    solution: "Create a 2D array with names and empty strings. Use the user's input to check the seat.",
    code: `seats = [
    ["Alice", "Bob", "", "Charlie"],
    ["", "Diana", "Eve", ""],
    ["Frank", "", "Grace", "Henry"]
]

row = int(input("Row (0-2): "))
col = int(input("Column (0-3): "))

if seats[row][col] == "":
    print("Seat is EMPTY")
else:
    print(f"Seat taken by {seats[row][col]}")`
  },
  videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
  quiz: [
    { question: "How do you access the element in row 2, column 3 of a 2D array called grid?", options: ["grid[3][2]", "grid[2][3]", "grid(2,3)", "grid{2}{3}"], correctIndex: 1, explanation: "Use grid[row][column] — so grid[2][3] accesses row 2, column 3.", hint: "Row comes first, then column.", difficulty: "easy" },
    { question: "What is a 2D array in Python?", options: ["A list with two elements", "A list of lists", "A dictionary with two keys", "A tuple of tuples"], correctIndex: 1, explanation: "A 2D array in Python is implemented as a list of lists — each inner list is a row.", hint: "Think of rows and columns — how are they stored?", difficulty: "easy" },
    { question: "Given grid = [[1,2],[3,4],[5,6]], what is grid[2][0]?", options: ["2", "3", "5", "6"], correctIndex: 2, explanation: "grid[2] is [5,6], and [0] gives the first element: 5.", hint: "Count rows from 0: row 0=[1,2], row 1=[3,4], row 2=[5,6].", difficulty: "medium" },
    { question: "How many nested loops do you typically need to traverse every element in a 2D array?", options: ["1", "2", "3", "It depends"], correctIndex: 1, explanation: "Two nested loops: the outer for rows, the inner for columns/elements.", hint: "One loop per dimension.", difficulty: "easy" },
    { question: "What does grid[0] return for a 2D array?", options: ["The first element", "The first row (a list)", "The first column", "An error"], correctIndex: 1, explanation: "grid[0] returns the entire first row, which is itself a list.", hint: "A 2D array is a list of lists — what's the first item in the outer list?", difficulty: "medium" },
    { question: "OCR exam: In a 3x3 grid, how many elements are there in total?", options: ["3", "6", "9", "12"], correctIndex: 2, explanation: "3 rows × 3 columns = 9 elements.", hint: "Multiply rows by columns.", difficulty: "easy" }
  ]
};
