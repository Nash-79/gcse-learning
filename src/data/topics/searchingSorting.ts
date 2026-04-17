import { TopicContent } from "../topicContent";

export const searchingSorting: TopicContent = {
  topicSlug: "searching-sorting",
  explanation: [
    "Algorithms are like recipes for computers — a specific set of instructions to solve a problem. In your GCSE, you need to master two main types: Searching (finding an item) and Sorting (organising a list).",
    "Searching involves locating a specific 'target' within a dataset. We use Linear Search for unsorted or small lists, and Binary Search for large, sorted datasets because it's significantly faster.",
    "Sorting is the process of arranging data into a specific order (like A-Z or 1-10). Bubble Sort is a simple method that swaps items side-by-side, while Merge Sort is a 'divide and conquer' approach that handles massive amounts of data efficiently."
  ],
  codeExamples: [
    {
      title: "The Simple Search (Linear)",
      code: `def find_item(collection, target):
    for index in range(len(collection)):
        if collection[index] == target:
            return index  # Found it! Here is the position
    return -1  # Looked everywhere, it's not here`,
      description: "Linear search checks every single item one by one. It's reliable but gets slow if the list is huge."
    },
    {
      title: "The Fast Search (Binary)",
      code: `def quick_find(sorted_list, target):
    left = 0
    right = len(sorted_list) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if sorted_list[mid] == target:
            return mid
        elif sorted_list[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      description: "Binary search works by jumping to the middle and throwing away half the list every time. It MUST be sorted first!"
    }
  ],
  keyPoints: [
    "An algorithm is a sequence of logical steps to complete a task.",
    "Decomposition: Breaking a big problem into smaller, bite-sized tasks.",
    "Abstraction: Hiding complex details to focus on the essential logic.",
    "Binary Search is 'O(log n)' - it gets faster relative to list size than Linear Search.",
    "Merge Sort is more efficient than Bubble Sort but uses more memory (RAM)."
  ],
  commonMistakes: [
    { 
      mistake: "Trying to Binary Search an unsorted list.", 
      fix: "Always sort your data first, or use a Linear Search instead." 
    },
    { 
      mistake: "Forgetting the 'Divide' phase in Merge Sort.", 
      fix: "Remember: Merge sort first splits the list down to single items before rebuilding." 
    }
  ],
  workedExample: {
    title: "The Guessing Game",
    problem: "You have a sorted list of IDs [102, 245, 567, 890, 999]. How many steps does a Binary Search take to find 890?",
    solution: "1. Mid is index 2 (567). 890 > 567, search right. 2. Mid of [890, 999] is index 3 (890). Found! Total steps: 2.",
    code: `ids = [102, 245, 567, 890, 999]
# Step 1: Check 567 (Too low)
# Step 2: Check 890 (Found!)`
  },
  videoUrl: "https://www.youtube.com/embed/P3YID7liBug",
  quiz: [
    { 
      question: "Which algorithm is best for searching an unsorted list of 10 items?", 
      options: ["Binary Search", "Linear Search", "Merge Sort", "Bubble Sort"], 
      correctIndex: 1, 
      explanation: "Binary search requires sorting first. For only 10 items, the simplicity of Linear Search is best.",
      difficulty: "easy"
    },
    { 
      question: "What happens to the search area in each step of a Binary Search?", 
      options: ["It decreases by 1", "It stays the same", "It is halved", "It doubles"], 
      correctIndex: 2, 
      explanation: "Binary search eliminates 50% of the remaining items in every single step.",
      difficulty: "medium"
    }
  ]
};
