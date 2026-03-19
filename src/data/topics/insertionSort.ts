import type { TopicContent } from "../topicContent";

export const insertionSort: TopicContent = {
  topicSlug: "insertion-sort",
  explanation: [
    "Insertion Sort is one of three sorting algorithms required by the OCR specification (alongside Bubble Sort and Merge Sort). It works by building a sorted portion of the list one element at a time, inserting each new element into its correct position.",
    "Think of it like sorting a hand of playing cards: you pick up one card at a time and slide it into the right place among the cards you've already sorted. The first card is 'already sorted', then each subsequent card is inserted into position.",
    "Insertion Sort starts from the second element (index 1). For each element, it compares backwards through the sorted portion and shifts larger elements to the right until it finds the correct position, then inserts the element there.",
    "Compared to Bubble Sort, Insertion Sort is generally more efficient for small or nearly-sorted lists. It has the same worst-case O(n²) time complexity but performs fewer swaps on average. For OCR J277, you need to understand, trace, and compare all three sorting algorithms."
  ],
  codeExamples: [
    {
      title: "Insertion Sort — Step by Step",
      code: `def insertion_sort(data):
    for i in range(1, len(data)):
        key = data[i]           # The element to insert
        j = i - 1               # Start comparing from the left
        
        # Shift elements right until we find the correct position
        while j >= 0 and data[j] > key:
            data[j + 1] = data[j]
            j -= 1
        
        data[j + 1] = key       # Insert into correct position
    
    return data

numbers = [64, 34, 25, 12, 22, 11, 90]
print("Before:", numbers)
sorted_nums = insertion_sort(numbers)
print("After:", sorted_nums)`,
      description: "Pick each element and insert it into its correct position in the sorted portion."
    },
    {
      title: "Tracing Insertion Sort",
      code: `def insertion_sort_traced(data):
    print(f"Start: {data}")
    for i in range(1, len(data)):
        key = data[i]
        j = i - 1
        print(f"  Inserting {key}:")
        
        while j >= 0 and data[j] > key:
            data[j + 1] = data[j]
            j -= 1
        
        data[j + 1] = key
        print(f"  Result: {data}")
    
    return data

insertion_sort_traced([5, 3, 1, 4, 2])`,
      description: "See how each element is inserted into its correct position step by step."
    },
    {
      title: "Comparing Sorting Algorithms",
      code: `# Insertion Sort — good for small/nearly sorted data
data1 = [2, 1, 3, 5, 4]  # Nearly sorted
data2 = [5, 4, 3, 2, 1]  # Reverse sorted (worst case)

def count_operations(data):
    ops = 0
    data = data.copy()
    for i in range(1, len(data)):
        key = data[i]
        j = i - 1
        while j >= 0 and data[j] > key:
            data[j + 1] = data[j]
            j -= 1
            ops += 1
        data[j + 1] = key
    return ops

print(f"Nearly sorted: {count_operations(data1)} shifts")
print(f"Reverse sorted: {count_operations(data2)} shifts")`,
      description: "Insertion Sort performs fewer operations on nearly-sorted data — its best case is O(n)."
    }
  ],
  keyPoints: [
    "Start from index 1 — the first element is 'already sorted'.",
    "For each element, shift larger elements right and insert into the correct position.",
    "Best case: O(n) — when the list is already sorted (minimal comparisons).",
    "Worst case: O(n²) — when the list is reverse sorted.",
    "Sorts in-place — doesn't need extra memory (unlike Merge Sort).",
    "Generally more efficient than Bubble Sort for small or nearly-sorted data.",
    "OCR J277 requires you to know Bubble Sort, Merge Sort, AND Insertion Sort."
  ],
  commonMistakes: [
    { mistake: "Starting the loop at index 0 instead of index 1", fix: "Start at index 1 — the single element at index 0 is already 'sorted'." },
    { mistake: "Confusing Insertion Sort with Bubble Sort", fix: "Bubble Sort swaps adjacent elements. Insertion Sort inserts elements into the correct position." },
    { mistake: "Forgetting to shift elements before inserting", fix: "You must move larger elements to the right before inserting the key in its correct spot." }
  ],
  workedExample: {
    title: "Sort Student Scores",
    problem: "Use Insertion Sort to sort a list of student scores in ascending order. Show the list after each insertion.",
    solution: "Apply insertion sort with print statements to trace each step.",
    code: `scores = [72, 45, 88, 31, 65]
print(f"Original: {scores}")

for i in range(1, len(scores)):
    key = scores[i]
    j = i - 1
    
    while j >= 0 and scores[j] > key:
        scores[j + 1] = scores[j]
        j -= 1
    
    scores[j + 1] = key
    print(f"After inserting {key}: {scores}")

print(f"Sorted: {scores}")`
  },
  videoUrl: "https://www.youtube.com/embed/PqFKRqpHrjw",
  quiz: [
    { question: "Where does Insertion Sort start processing from?", options: ["Index 0", "Index 1", "The last element", "The middle element"], correctIndex: 1, explanation: "Insertion Sort starts from index 1 because the single element at index 0 is already 'sorted'.", hint: "The first element doesn't need inserting — it's already in the right place.", difficulty: "easy" },
    { question: "What is the best-case time complexity of Insertion Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"], correctIndex: 2, explanation: "When the list is already sorted, Insertion Sort only makes n-1 comparisons with no shifts — O(n).", hint: "What happens if every element is already in the right place?", difficulty: "medium" },
    { question: "How does Insertion Sort differ from Bubble Sort?", options: ["They are the same algorithm", "Insertion Sort inserts into position; Bubble Sort swaps adjacent elements", "Bubble Sort is always faster", "Insertion Sort divides the list in half"], correctIndex: 1, explanation: "Insertion Sort picks an element and inserts it in the correct position. Bubble Sort repeatedly swaps adjacent pairs.", hint: "Think about the core operation each algorithm performs.", difficulty: "medium" },
    { question: "Does Insertion Sort require extra memory?", options: ["Yes, it needs a second list", "No, it sorts in-place", "Only for large lists", "Yes, it needs a stack"], correctIndex: 1, explanation: "Insertion Sort sorts the list in-place, only using one extra variable (the key) at a time.", hint: "Consider whether a new list is created or the existing one is modified.", difficulty: "easy" },
    { question: "OCR exam: After one pass of Insertion Sort on [5, 3, 8, 1], what is the list?", options: ["[3, 5, 8, 1]", "[1, 3, 5, 8]", "[3, 5, 1, 8]", "[5, 3, 1, 8]"], correctIndex: 0, explanation: "First pass: key=3, compared with 5. 3 < 5, so 5 shifts right and 3 is inserted: [3, 5, 8, 1].", hint: "Only the second element is processed in the first pass.", difficulty: "hard" },
    { question: "When is Insertion Sort a better choice than Merge Sort?", options: ["Always", "For very large datasets", "For small or nearly-sorted lists", "Never"], correctIndex: 2, explanation: "Insertion Sort excels with small or nearly-sorted data due to low overhead and O(n) best case.", hint: "Think about when the overhead of dividing and merging isn't worth it.", difficulty: "medium" }
  ]
};
