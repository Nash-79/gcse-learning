import type { TopicContent } from "../topicContent";

export const sqlBasics: TopicContent = {
  topicSlug: "sql-basics",
  explanation: [
    "SQL (Structured Query Language) is used to manage and query databases. For OCR GCSE (J277, Section 2.2), you need to be able to read and write basic SQL statements. You won't run SQL in Python during the exam, but you must understand the syntax.",
    "The most important SQL command is SELECT, which retrieves data from a table. The basic format is: SELECT columns FROM table WHERE condition ORDER BY column. You can select specific columns or use * for all columns.",
    "WHERE filters rows based on conditions using comparison operators (=, <, >, <=, >=, <>) and logical operators (AND, OR, NOT). LIKE is used for pattern matching with wildcards: % matches any sequence of characters.",
    "ORDER BY sorts results in ascending (ASC, the default) or descending (DESC) order. These SQL keywords are not case-sensitive, but by convention they are written in UPPERCASE to distinguish them from table and column names."
  ],
  codeExamples: [
    {
      title: "Basic SELECT Queries (as comments — SQL cannot run in Python sandbox)",
      code: `# SQL queries you need to know for OCR J277:

# Select ALL columns from a table
# SELECT * FROM students

# Select specific columns
# SELECT name, age FROM students

# Filter with WHERE
# SELECT name, age FROM students WHERE age > 15

# Multiple conditions
# SELECT name FROM students WHERE age >= 15 AND grade = 'A'

# Sort results
# SELECT * FROM students ORDER BY name ASC
# SELECT * FROM students ORDER BY age DESC

# Pattern matching with LIKE
# SELECT * FROM students WHERE name LIKE 'A%'

print("SQL is written on paper in the exam, not run in Python.")
print("Study the syntax above — you'll need to write it from memory!")`,
      description: "SQL queries are tested on paper in the OCR exam. Learn the syntax by heart."
    },
    {
      title: "SQL Operators and Wildcards",
      code: `# SQL comparison operators:
# =    Equal to              WHERE age = 16
# <>   Not equal to          WHERE grade <> 'F'  
# <    Less than             WHERE score < 50
# >    Greater than          WHERE score > 80
# <=   Less than or equal    WHERE age <= 18
# >=   Greater than or equal WHERE score >= 90

# LIKE wildcards:
# %  matches any sequence of characters
# SELECT * FROM students WHERE name LIKE 'A%'    -- starts with A
# SELECT * FROM students WHERE name LIKE '%son'   -- ends with son
# SELECT * FROM students WHERE name LIKE '%an%'   -- contains 'an'

# AND, OR, NOT:
# SELECT * FROM students WHERE age > 15 AND grade = 'A'
# SELECT * FROM students WHERE grade = 'A' OR grade = 'B'
# SELECT * FROM students WHERE NOT grade = 'F'

print("SQL uses <> for 'not equal' (not != like Python)")
print("% is the wildcard in SQL (not * like in file systems)")`,
      description: "Know these operators for the exam — especially <> and LIKE with %."
    },
    {
      title: "Python Dictionary as a 'Database Table'",
      code: `# We can simulate SQL concepts in Python using lists of dictionaries
students = [
    {"name": "Alice", "age": 15, "grade": "A"},
    {"name": "Bob", "age": 16, "grade": "B"},
    {"name": "Charlie", "age": 15, "grade": "A"},
    {"name": "Diana", "age": 17, "grade": "C"},
    {"name": "Eve", "age": 16, "grade": "A"},
]

# Simulating: SELECT name, grade FROM students WHERE grade = 'A'
print("Students with grade A:")
for s in students:
    if s["grade"] == "A":
        print(f"  {s['name']} - Grade {s['grade']}")

# Simulating: SELECT * FROM students ORDER BY age DESC
print("\\nStudents sorted by age (descending):")
sorted_students = sorted(students, key=lambda s: s["age"], reverse=True)
for s in sorted_students:
    print(f"  {s['name']}, age {s['age']}")`,
      description: "Python lists of dictionaries work like database tables — helpful for understanding SQL concepts."
    }
  ],
  keyPoints: [
    "SELECT columns FROM table — retrieves data from a database table.",
    "WHERE filters rows: WHERE age > 15 AND grade = 'A'.",
    "ORDER BY sorts results: ASC (ascending, default) or DESC (descending).",
    "Use * to select all columns: SELECT * FROM students.",
    "LIKE with % for pattern matching: WHERE name LIKE 'A%' (starts with A).",
    "SQL uses <> for 'not equal to' (not != like Python).",
    "SQL keywords are conventionally written in UPPERCASE."
  ],
  commonMistakes: [
    { mistake: "Using != instead of <> for 'not equal to' in SQL", fix: "SQL uses <> for not equal: WHERE grade <> 'F'" },
    { mistake: "Forgetting quotes around string values: WHERE name = Alice", fix: "Strings must be in quotes: WHERE name = 'Alice'" },
    { mistake: "Using * as a wildcard in LIKE instead of %", fix: "SQL uses % as the wildcard: WHERE name LIKE 'A%', not 'A*'" },
    { mistake: "Writing Python syntax in SQL exam answers", fix: "SQL has its own syntax: SELECT/FROM/WHERE, not print/for/if." }
  ],
  workedExample: {
    title: "School Database Queries",
    problem: "Given a table called 'pupils' with columns: name, year_group, score — write SQL to: (1) Find all Year 11 pupils, (2) Find pupils who scored over 80 sorted by score descending, (3) Find pupils whose name starts with 'J'.",
    solution: "Use SELECT with WHERE for filtering, ORDER BY for sorting, and LIKE for pattern matching.",
    code: `# Query 1: All Year 11 pupils
# SELECT * FROM pupils WHERE year_group = 11

# Query 2: Scored over 80, sorted descending
# SELECT name, score FROM pupils WHERE score > 80 ORDER BY score DESC

# Query 3: Names starting with J
# SELECT * FROM pupils WHERE name LIKE 'J%'

# Simulating in Python:
pupils = [
    {"name": "Jake", "year": 11, "score": 85},
    {"name": "Sarah", "year": 10, "score": 92},
    {"name": "James", "year": 11, "score": 78},
    {"name": "Jenny", "year": 11, "score": 95},
]

print("Year 11 pupils:")
for p in pupils:
    if p["year"] == 11:
        print(f"  {p['name']}: {p['score']}")

print("\\nScored > 80 (desc):")
high = sorted([p for p in pupils if p["score"] > 80], key=lambda p: p["score"], reverse=True)
for p in high:
    print(f"  {p['name']}: {p['score']}")

print("\\nNames starting with J:")
for p in pupils:
    if p["name"].startswith("J"):
        print(f"  {p['name']}")`
  },
  videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
  quiz: [
    { question: "What does SELECT * FROM students do?", options: ["Deletes all students", "Returns all columns from the students table", "Creates a new table", "Counts the students"], correctIndex: 1, explanation: "SELECT * returns all columns. FROM specifies which table to query.", hint: "The * means 'everything' in SQL.", difficulty: "easy" },
    { question: "Which SQL keyword filters rows based on a condition?", options: ["FILTER", "WHERE", "IF", "WHEN"], correctIndex: 1, explanation: "WHERE is used to filter rows that match a specific condition.", hint: "It's the SQL equivalent of Python's 'if' for filtering data.", difficulty: "easy" },
    { question: "How do you sort results in descending order?", options: ["SORT BY column DESC", "ORDER BY column DESC", "ARRANGE BY column DESC", "GROUP BY column DESC"], correctIndex: 1, explanation: "ORDER BY column DESC sorts results from highest to lowest.", hint: "The keyword contains 'ORDER' and the direction is abbreviated.", difficulty: "easy" },
    { question: "What does WHERE name LIKE 'S%' match?", options: ["Names equal to 'S%'", "Names starting with S", "Names ending with S", "Names containing S"], correctIndex: 1, explanation: "% is a wildcard matching any characters. 'S%' means starts with S followed by anything.", hint: "The % goes after S — what position does that represent?", difficulty: "medium" },
    { question: "What is the SQL operator for 'not equal to'?", options: ["!=", "<>", "NOT=", "=/="], correctIndex: 1, explanation: "SQL uses <> for 'not equal to', not != like Python.", hint: "It uses two angle bracket symbols.", difficulty: "medium" },
    { question: "OCR exam: Write SQL to find all students aged over 16 with grade A", options: ["SELECT * FROM students WHERE age > 16 AND grade = 'A'", "SELECT students WHERE age > 16 AND grade = A", "FIND * IN students IF age > 16", "GET students WHERE age > 16"], correctIndex: 0, explanation: "Correct SQL uses SELECT * FROM table WHERE condition AND condition, with string values in quotes.", hint: "Remember: SELECT...FROM...WHERE, and strings need quotes.", difficulty: "hard" }
  ]
};
