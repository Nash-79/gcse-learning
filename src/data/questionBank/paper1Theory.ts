import { TopicTheoryData } from "./theoryTypes";

export const paper1Theory: TopicTheoryData[] = [
  // ============================================
  // SYSTEMS ARCHITECTURE
  // ============================================
  {
    slug: "systems-architecture",
    title: "Systems Architecture",
    paper: "1",
    ocrRef: "1.1",
    aqaRef: ["3.4"],
    examBoards: ["ocr", "aqa"],
    icon: "🖥️",
    color: "primary",
    description: "Understand the CPU, Von Neumann architecture, and factors affecting performance.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    // Topic-level quick revision bullets (shown above all sections)
    revisionSummary: [
      "The CPU contains the Control Unit (CU), ALU, cache, and registers.",
      "The fetch-decode-execute cycle repeats billions of times per second using PC, MAR, MDR, and CIR registers.",
      "CPU performance depends on clock speed, number of cores, and cache size.",
      "Von Neumann architecture stores instructions and data in the same RAM, connected via address, data, and control buses.",
      "Embedded systems are computers built into larger devices to perform one dedicated function.",
    ],

    sections: [
      {
        id: "cpu-overview",
        title: "The Central Processing Unit (CPU)",
        icon: "⚡",
        specPoint: "OCR J277 1.1a — The purpose of the CPU and the function of its main components.",
        content: "The CPU is the brain of the computer. It processes all instructions and data. Modern CPUs contain billions of transistors and can perform billions of operations per second. The CPU sits on the motherboard and communicates with other components via buses.",

        revisionSummary: [
          "CPU = Control Unit + ALU + Cache + Registers.",
          "All connected to RAM via the system bus.",
          "Clock speed (GHz) sets how fast the cycle runs.",
        ],

        images: [
          {
            src: "/diagrams/cpu-components-block.svg",
            alt: "CPU block diagram showing CU, ALU, cache, and registers",
            caption: "Figure 1 — Internal structure of a CPU. The CU coordinates, the ALU calculates, cache stores frequently used data, and registers hold immediate values.",
            aiPrompt: "Create a clean technical SVG block diagram of a CPU for GCSE Computer Science. Show four labelled boxes: Control Unit (CU), ALU, Cache, and Registers. Use a blue colour scheme. Add a surrounding CPU boundary box. Keep it simple, clear, and suitable for a 14-16 year old student.",
          },
        ],

        diagram: {
          type: "block",
          title: "CPU Components",
          blocks: [
            { label: "Control Unit (CU)", detail: "Decodes instructions, controls data flow", color: "primary" },
            { label: "ALU", detail: "Arithmetic & Logic operations", color: "secondary" },
            { label: "Cache", detail: "Fast temporary storage", color: "accent" },
            { label: "Registers", detail: "Tiny ultra-fast storage", color: "primary" },
          ],
        },

        keyTerms: [
          { term: "CPU", definition: "Central Processing Unit — the main processor that executes program instructions" },
          { term: "Transistor", definition: "A tiny electronic switch that can be ON (1) or OFF (0), forming the basis of all computing" },
          { term: "Motherboard", definition: "The main circuit board that connects all computer components together" },
        ],

        commonMistakes: [
          {
            mistake: "Saying the CPU 'stores data' — it doesn't store programs, that's RAM.",
            correction: "The CPU processes instructions. RAM stores the currently running program and data.",
          },
          {
            mistake: "Confusing cache with RAM — they are not the same thing.",
            correction: "Cache is small, ultra-fast memory inside the CPU. RAM is larger, slower, and external to the CPU.",
          },
        ],

        flashcards: [
          { front: "What does CPU stand for?", back: "Central Processing Unit — the component that executes program instructions." },
          { front: "What are the three main components inside a CPU?", back: "Control Unit (CU), Arithmetic Logic Unit (ALU), and Cache/Registers." },
        ],

        examTip: "Always mention ALL THREE components of the CPU when asked: CU, ALU, and Cache/Registers.",
      },

      {
        id: "cu-alu",
        title: "Control Unit & ALU",
        icon: "🔧",
        specPoint: "OCR J277 1.1a — The function of the Control Unit and ALU.",
        content: "The Control Unit (CU) is the coordinator of the CPU. It fetches instructions from memory, decodes them, and directs other components to carry them out. It controls the timing of operations using the system clock.\n\nThe Arithmetic Logic Unit (ALU) performs two types of operations:\n• Arithmetic: addition, subtraction, multiplication, division\n• Logic: comparisons (AND, OR, NOT, greater than, equal to)",

        revisionSummary: [
          "CU fetches, decodes, and directs — it is the coordinator.",
          "ALU does all arithmetic (+, -, ×, ÷) and logic (AND, OR, NOT, comparisons).",
          "The system clock synchronises all CPU operations.",
        ],

        keyTerms: [
          { term: "Control Unit", definition: "Decodes instructions and coordinates the CPU's operations" },
          { term: "ALU", definition: "Arithmetic Logic Unit — performs calculations and logical comparisons" },
          { term: "System Clock", definition: "Generates regular electrical pulses to synchronise CPU operations" },
        ],

        comparisonData: {
          itemA: { title: "Control Unit (CU)", points: ["Fetches instructions from memory", "Decodes instructions", "Controls timing of operations", "Directs data flow between components", "Manages the fetch-decode-execute cycle"] },
          itemB: { title: "ALU", points: ["Performs arithmetic (+, -, ×, ÷)", "Performs logical comparisons", "Handles AND, OR, NOT operations", "Processes comparison operations (>, <, =)", "Returns results to registers"] },
        },

        commonMistakes: [
          {
            mistake: "Saying the CU 'performs calculations' — it doesn't.",
            correction: "The CU controls and directs. Calculations are done by the ALU.",
          },
        ],

        flashcards: [
          { front: "What does the Control Unit do?", back: "Fetches instructions from memory, decodes them, and directs other CPU components to carry them out." },
          { front: "What two categories of operation does the ALU perform?", back: "Arithmetic (add, subtract, multiply, divide) and Logic (AND, OR, NOT, comparisons)." },
          { front: "What is the system clock?", back: "A component that generates regular electrical pulses to synchronise all CPU operations. Measured in GHz." },
        ],
      },

      {
        id: "fetch-decode-execute",
        title: "The Fetch-Decode-Execute Cycle",
        icon: "🔄",
        specPoint: "OCR J277 1.1b — The fetch-decode-execute cycle and the role of registers.",
        content: "Every instruction the CPU processes goes through three stages. This cycle repeats billions of times per second.\n\n1. FETCH — The next instruction is fetched from RAM using the address stored in the Program Counter (PC). The instruction is placed in the Current Instruction Register (CIR). The PC is incremented to point to the next instruction.\n\n2. DECODE — The Control Unit decodes the instruction in the CIR to determine what operation needs to be performed.\n\n3. EXECUTE — The instruction is carried out. This may involve the ALU performing a calculation, data being moved, or a result being stored.",

        revisionSummary: [
          "FETCH: PC holds the address → copied to MAR → instruction fetched to MDR → copied to CIR → PC incremented.",
          "DECODE: CU reads and interprets the instruction in CIR.",
          "EXECUTE: ALU calculates, or data is moved/stored.",
        ],

        diagram: {
          type: "cycle",
          title: "Fetch-Decode-Execute Cycle",
          blocks: [
            { label: "FETCH", detail: "Get instruction from RAM → CIR. Increment PC.", color: "primary" },
            { label: "DECODE", detail: "CU interprets the instruction", color: "secondary" },
            { label: "EXECUTE", detail: "ALU processes / data moves / result stored", color: "accent" },
          ],
          connections: ["FETCH → DECODE", "DECODE → EXECUTE", "EXECUTE → FETCH"],
        },

        images: [
          {
            src: "/diagrams/fde-cycle-registers.svg",
            alt: "Fetch-decode-execute cycle showing register interactions: PC, MAR, MDR, CIR",
            caption: "Figure 2 — Register flow during the FDE cycle. Arrows show data movement between PC, MAR, MDR, CIR, and RAM.",
            aiPrompt: "Create a clean SVG diagram for GCSE Computer Science showing the fetch-decode-execute cycle with registers. Show RAM on the left and CPU on the right. Inside the CPU show 4 labelled registers: PC (Program Counter), MAR (Memory Address Register), MDR (Memory Data Register), CIR (Current Instruction Register). Use arrows to show: PC → MAR, RAM ↔ MDR, MDR → CIR, PC increments. Label each stage: Fetch, Decode, Execute. Use a blue/purple colour scheme. Keep it clear for 14-16 year olds.",
          },
        ],

        keyTerms: [
          { term: "Program Counter (PC)", definition: "Register that holds the memory address of the NEXT instruction to fetch" },
          { term: "Memory Address Register (MAR)", definition: "Holds the address of the memory location being accessed" },
          { term: "Memory Data Register (MDR)", definition: "Holds the data being read from or written to memory" },
          { term: "Current Instruction Register (CIR)", definition: "Holds the instruction currently being decoded/executed" },
        ],

        workedExample: {
          question: "Describe what happens during the FETCH stage of the FDE cycle. [3 marks]",
          steps: [
            {
              step: "PC contains the address of the next instruction.",
              explanation: "The Program Counter always points to the memory address of the next instruction to be executed.",
            },
            {
              step: "The address is copied from PC to MAR.",
              explanation: "The Memory Address Register is loaded with the address so the CPU knows where to look in RAM.",
            },
            {
              step: "The instruction at that address is fetched from RAM into the MDR, then copied to CIR. PC is incremented.",
              explanation: "The instruction travels RAM → MDR → CIR. Meanwhile PC is updated to point to the next instruction.",
            },
          ],
          answer: "The address in PC is copied to MAR. The instruction at that address is fetched from RAM into MDR, then loaded into CIR. The PC is incremented to point to the next instruction.",
          markScheme: [
            "PC contains address of next instruction (1)",
            "Address copied to MAR / instruction fetched from RAM to MDR (1)",
            "Instruction placed in CIR / PC incremented (1)",
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying 'the CPU fetches the instruction from the hard drive'.",
            correction: "Instructions are fetched from RAM (main memory), not secondary storage. The program must be loaded into RAM first.",
          },
          {
            mistake: "Confusing PC and CIR — PC holds the NEXT address, CIR holds the CURRENT instruction.",
            correction: "PC = address of next instruction. CIR = instruction currently being decoded/executed.",
          },
        ],

        flashcards: [
          { front: "What does the Program Counter (PC) hold?", back: "The memory address of the NEXT instruction to be fetched." },
          { front: "What does MAR stand for and what does it do?", back: "Memory Address Register — holds the address of the memory location currently being read from or written to." },
          { front: "What does MDR stand for and what does it do?", back: "Memory Data Register — holds the data that has just been fetched from, or is about to be written to, memory." },
          { front: "What happens to the PC after FETCH?", back: "It is incremented (increased by 1) to point to the address of the next instruction." },
        ],

        examTip: "In exam answers, always name the specific registers (PC, MAR, MDR, CIR) — don't just say 'a register'.",
      },
      {
        id: "cpu-performance",
        title: "Factors Affecting CPU Performance",
        icon: "📈",
        specPoint: "OCR J277 1.1c — Factors affecting CPU performance: clock speed, cores, cache.",
        content: "Three main factors determine how fast a CPU can process instructions:",

        revisionSummary: [
          "Clock speed (GHz) — more cycles per second = faster. Drawback: more heat.",
          "Number of cores — more cores = parallel tasks. Drawback: programs must be written to use them.",
          "Cache size — faster access than RAM for frequently used data. Drawback: expensive and physically limited.",
        ],

        tableData: {
          headers: ["Factor", "What It Is", "How It Helps", "Limitation"],
          rows: [
            ["Clock Speed", "Number of cycles per second (measured in GHz)", "Higher speed = more instructions per second", "More heat generated, may need throttling"],
            ["Number of Cores", "Independent processing units within the CPU", "Multiple cores can process tasks simultaneously", "Not all programs can use multiple cores"],
            ["Cache Size", "Small, fast memory built into the CPU", "Frequently used data accessed faster than RAM", "Very expensive, limited physical space"],
          ],
        },

        workedExample: {
          question: "Explain how increasing cache size can improve CPU performance. [2 marks]",
          steps: [
            {
              step: "Cache stores frequently used instructions and data closer to the CPU than RAM.",
              explanation: "RAM access takes many clock cycles; cache access takes just 1-2 cycles.",
            },
            {
              step: "With more cache, more data can be stored locally, reducing the need to wait for RAM.",
              explanation: "Fewer trips to RAM = fewer wait cycles = faster overall processing.",
            },
          ],
          answer: "Cache stores frequently accessed data closer to the CPU than RAM. A larger cache means more data is available without needing to wait for slower RAM access, so the CPU executes instructions faster.",
          markScheme: [
            "Cache stores frequently used data/instructions near the CPU (1)",
            "Larger cache reduces need to access slower RAM / fewer wait states (1)",
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying 'more cores always makes the computer faster'.",
            correction: "More cores only helps if the software is written to use multiple threads. A single-threaded program runs at the same speed regardless of core count.",
          },
          {
            mistake: "Confusing clock speed with cache — they are completely different things.",
            correction: "Clock speed is measured in GHz and controls cycle timing. Cache is a type of fast memory built into the CPU.",
          },
        ],

        flashcards: [
          { front: "What is clock speed and how is it measured?", back: "The number of fetch-decode-execute cycles per second, measured in GHz (gigahertz)." },
          { front: "Why doesn't doubling the number of cores always double performance?", back: "Programs must be written to use multiple threads. Single-threaded programs cannot benefit from extra cores." },
          { front: "Where is cache located and why is it faster than RAM?", back: "Cache is built into the CPU chip itself. It is physically closer to the processor and uses faster memory technology than RAM." },
        ],

        examTip: "When asked about CPU performance, always give a BENEFIT and a DRAWBACK for each factor.",
      },

      {
        id: "von-neumann",
        title: "Von Neumann Architecture",
        icon: "🏗️",
        specPoint: "OCR J277 1.1d — Von Neumann architecture: stored program concept and system buses.",
        content: "The Von Neumann architecture is the design used by most modern computers. Its key principle is that both program instructions AND data are stored in the same memory (RAM).\n\nKey components:\n• CPU (with CU, ALU, registers)\n• Main Memory (RAM) storing both data and instructions\n• System Bus (Address Bus, Data Bus, Control Bus)\n• Input/Output devices",

        revisionSummary: [
          "Von Neumann stores instructions AND data in the same memory — the stored program concept.",
          "Address bus: CPU sends memory addresses (one-way, CPU → RAM).",
          "Data bus: carries actual data or instructions (two-way, bidirectional).",
          "Control bus: carries read/write signals and clock pulses (two-way).",
          "The Von Neumann bottleneck: data and instructions share the same bus, limiting throughput.",
        ],

        images: [
          {
            src: "/diagrams/von-neumann-architecture.svg",
            alt: "Von Neumann architecture diagram showing CPU, RAM, input, output, and the three buses",
            caption: "Figure 3 — Von Neumann architecture. Both program instructions and data reside in RAM, connected to the CPU via address, data, and control buses.",
            aiPrompt: "Create a clean, labelled SVG diagram of Von Neumann architecture for GCSE Computer Science. Show: a CPU box (containing CU, ALU, Registers), a RAM box labelled 'Main Memory (instructions + data)', an Input box, and an Output box. Connect CPU and RAM with three labelled arrows: Address Bus (one arrow from CPU to RAM), Data Bus (double arrow), Control Bus (double arrow). Use blue for CPU, green for RAM, grey for I/O. Label everything clearly for 14-16 year old students.",
          },
        ],

        diagram: {
          type: "block",
          title: "Von Neumann Architecture",
          blocks: [
            { label: "CPU", detail: "CU + ALU + Registers", color: "primary" },
            { label: "Main Memory (RAM)", detail: "Stores instructions AND data", color: "secondary" },
            { label: "Address Bus", detail: "Carries memory addresses (one-way)", color: "accent" },
            { label: "Data Bus", detail: "Carries data (two-way)", color: "accent" },
            { label: "Control Bus", detail: "Carries control signals (two-way)", color: "accent" },
          ],
        },

        keyTerms: [
          { term: "Von Neumann Bottleneck", definition: "Data and instructions share the same bus, creating a bottleneck as they cannot be transferred simultaneously" },
          { term: "Address Bus", definition: "Carries the address of the memory location being accessed (unidirectional: CPU → memory)" },
          { term: "Data Bus", definition: "Carries data between CPU and memory (bidirectional)" },
          { term: "Control Bus", definition: "Carries control signals like read/write, clock, interrupt (bidirectional)" },
          { term: "Stored Program Concept", definition: "The principle that instructions and data are stored together in memory and can be accessed by the CPU" },
        ],

        commonMistakes: [
          {
            mistake: "Saying the address bus is bidirectional.",
            correction: "The address bus is unidirectional — it only carries addresses FROM the CPU TO memory, never in reverse.",
          },
          {
            mistake: "Thinking Von Neumann architecture means having separate buses for instructions and data.",
            correction: "Von Neumann uses the SAME memory for both instructions and data — that is what causes the bottleneck.",
          },
        ],

        flashcards: [
          { front: "What is the Von Neumann bottleneck?", back: "Because data and instructions share the same bus, they cannot be transferred simultaneously, limiting performance." },
          { front: "What is the stored program concept?", back: "The idea that program instructions and data are stored together in the same memory (RAM) and fetched by the CPU when needed." },
          { front: "Which bus is unidirectional?", back: "The address bus — it carries addresses from CPU to memory only." },
        ],
      },

      {
        id: "embedded-systems",
        title: "Embedded Systems",
        icon: "📱",
        specPoint: "OCR J277 1.1e — The characteristics and examples of embedded systems.",
        content: "An embedded system is a computer system built into a larger device to perform a dedicated function. Unlike general-purpose computers, embedded systems are designed for one specific task.\n\nExamples:\n• Washing machine controllers\n• Car engine management systems\n• Smart thermostat controllers\n• Traffic light systems\n• Digital watches",

        revisionSummary: [
          "Embedded system = computer built into a larger device to do ONE specific job.",
          "Runs firmware — software stored in ROM that rarely changes.",
          "Cannot be reprogrammed by the user like a general-purpose computer.",
          "Examples: washing machine, car ABS brakes, smart thermostat, pacemaker.",
        ],

        keyTerms: [
          { term: "Embedded System", definition: "A computer system designed to perform a dedicated function within a larger mechanical or electronic system" },
          { term: "Firmware", definition: "Software programmed into an embedded system's ROM, providing low-level control" },
        ],

        commonMistakes: [
          {
            mistake: "Saying a smartphone is an embedded system because it is 'built in'.",
            correction: "Smartphones are general-purpose computers. Embedded systems perform ONE dedicated function. A smartphone runs many different applications.",
          },
        ],

        workedExample: {
          question: "Give two characteristics of an embedded system and one example. [3 marks]",
          steps: [
            { step: "State that an embedded system is built into a larger device.", explanation: "This distinguishes it from a standalone computer — it is not a device on its own." },
            { step: "State that it performs one dedicated/specific function.", explanation: "It is purpose-built and cannot be reprogrammed to do something different by the user." },
            { step: "Give an appropriate example.", explanation: "Any device where a microcontroller runs a single task: washing machine, ABS braking system, traffic light controller, pacemaker, etc." },
          ],
          answer: "An embedded system is (1) built into a larger device and (2) performs one dedicated function. Example: a washing machine controller.",
          markScheme: [
            "Built into / part of a larger device (1)",
            "Performs a single / dedicated / specific function (1)",
            "Suitable example: washing machine, car ABS, traffic lights, pacemaker, etc. (1)",
          ],
        },

        flashcards: [
          { front: "What is an embedded system?", back: "A computer system built into a larger device to perform a single, dedicated function." },
          { front: "Give three examples of embedded systems.", back: "Washing machine controller, car engine management system, smart thermostat, pacemaker, traffic light controller." },
          { front: "What is firmware?", back: "Software stored in ROM inside an embedded system that controls its operation and rarely changes." },
        ],

        examTip: "When describing embedded systems, always state: (1) it's built into a larger device, (2) it performs a specific/dedicated function, (3) give an example.",
      },
    ],
  },

  // ============================================
  // MEMORY & STORAGE
  // ============================================
  {
    slug: "memory-and-storage",
    title: "Memory & Storage",
    paper: "1",
    ocrRef: "1.2",
    aqaRef: ["3.3", "3.4"],
    examBoards: ["ocr", "aqa"],
    icon: "💾",
    color: "secondary",
    description: "Primary vs secondary storage, data representation, and units of storage.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "RAM is volatile (loses data on power off); ROM is non-volatile (keeps BIOS permanently).",
      "Secondary storage types: magnetic (HDD), solid state (SSD), and optical (CD/DVD) — each with different speed, cost, and durability.",
      "Storage units: 8 bits = 1 byte; KB → MB → GB → TB each ×1024.",
      "Binary is base 2 (0s and 1s); hexadecimal is base 16 (0–F) and acts as shorthand for binary.",
      "Images = width × height × colour depth; sound = sample rate × duration × bit depth.",
    ],

    sections: [
      {
        id: "ram-rom",
        title: "RAM vs ROM",
        icon: "🧠",
        specPoint: "OCR J277 1.1c — The difference between RAM and ROM and their purposes.",
        content: "Computers use two types of primary memory: RAM and ROM. Both are connected directly to the CPU, but they serve very different purposes.",

        revisionSummary: [
          "RAM = volatile, read/write, holds current programs and data.",
          "ROM = non-volatile, read-only, holds the BIOS/boot instructions.",
          "More RAM means more programs can run at once without slowing down.",
        ],

        comparisonData: {
          itemA: { title: "RAM (Random Access Memory)", points: ["Volatile — loses data when power is off", "Read AND write capability", "Stores currently running programs and data", "Much larger capacity than ROM", "Can be upgraded/added to", "Contents change constantly"] },
          itemB: { title: "ROM (Read Only Memory)", points: ["Non-volatile — retains data without power", "Read-only (cannot be easily written to)", "Stores the BIOS/bootstrap program", "Very small capacity", "Built into the motherboard", "Contents rarely change"] },
        },
        keyTerms: [
          { term: "Volatile", definition: "Memory that loses its contents when the power supply is removed" },
          { term: "Non-volatile", definition: "Memory that retains its contents even without power" },
          { term: "BIOS", definition: "Basic Input/Output System — firmware that initialises hardware during boot-up" },
          { term: "Bootstrap", definition: "The initial program that loads the operating system when the computer starts" },
        ],

        commonMistakes: [
          {
            mistake: "Saying RAM is used to 'permanently store' data.",
            correction: "RAM is volatile — it loses all contents when the computer is switched off. Secondary storage is used for permanent storage.",
          },
          {
            mistake: "Confusing RAM with storage (hard drive/SSD).",
            correction: "RAM is primary memory — fast, temporary, directly accessed by CPU. A hard drive is secondary storage — slower, permanent, much larger.",
          },
        ],

        workedExample: {
          question: "Explain why a computer needs both RAM and ROM. [4 marks]",
          steps: [
            { step: "ROM is needed to store the BIOS.", explanation: "When the computer first powers on there are no programs in RAM, so ROM provides the initial boot instructions." },
            { step: "ROM is non-volatile.", explanation: "This means the boot instructions survive being powered off and are available every time the computer starts." },
            { step: "RAM is needed to run the operating system and applications.", explanation: "Once booted, the OS and open programs are loaded from secondary storage into RAM for fast access by the CPU." },
            { step: "RAM is volatile but fast.", explanation: "RAM can be read and written constantly, which is why it's suitable for active programs rather than permanent storage." },
          ],
          answer: "ROM stores the BIOS/boot instructions permanently (non-volatile), so the computer can start up. RAM then holds the OS and running programs (volatile, read/write, fast) for CPU access.",
          markScheme: "1 mark each for: ROM stores BIOS; ROM is non-volatile so survives power off; RAM holds running programs/OS; RAM is volatile/fast/read-write. Max 4.",
        },

        flashcards: [
          { front: "What does volatile mean?", back: "Memory that loses all its data when the power is switched off. RAM is volatile." },
          { front: "What is stored in ROM?", back: "The BIOS (Basic Input/Output System) — firmware that starts the computer and initialises hardware before the OS loads." },
          { front: "Why might upgrading RAM improve performance?", back: "More RAM allows more programs/data to be held in fast primary memory at once, reducing the need for slower virtual memory." },
        ],

        examTip: "A common exam question asks 'Why does a computer need both RAM and ROM?' — explain that ROM boots the system, while RAM holds running programs.",
      },
      {
        id: "secondary-storage",
        title: "Secondary Storage Types",
        icon: "💿",
        specPoint: "OCR J277 1.1d — Types of secondary storage and their characteristics.",
        content: "Secondary storage is non-volatile storage used to permanently save data, programs, and the operating system. There are three main types:",

        revisionSummary: [
          "Magnetic (HDD): slow, cheap, large capacity — moving parts can fail.",
          "Solid State (SSD): fast, durable, no moving parts — more expensive per GB.",
          "Optical (CD/DVD/Blu-ray): portable, cheap to produce — low capacity, easily scratched.",
        ],

        images: [
          {
            src: "/diagrams/storage-types-comparison.svg",
            alt: "Comparison of storage types: HDD, SSD, optical, and flash with speed, capacity, cost and volatility",
            caption: "Figure — Storage types comparison. Primary memory (RAM/ROM) is directly accessed by the CPU; secondary storage is persistent but slower.",
            aiPrompt: "Create an SVG comparison diagram for GCSE Computer Science showing primary vs secondary storage. Include cards for RAM, ROM, HDD, SSD, Optical, and Flash. Show key properties: speed, capacity, volatile/non-volatile, cost per GB. Use colour-coded cards: blue for primary, green for secondary.",
          },
        ],

        tableData: {
          headers: ["Type", "How It Works", "Advantages", "Disadvantages", "Examples"],
          rows: [
            ["Magnetic (HDD)", "Spinning platters with magnetic coating read by a head", "High capacity, low cost per GB, reliable for large storage", "Moving parts can fail, slower than SSD, heavier", "Hard disk drives, magnetic tape"],
            ["Optical", "Laser reads/writes data on reflective disc surface", "Portable, cheap to produce, good for distribution", "Low capacity, slow access, easily scratched", "CD, DVD, Blu-ray"],
            ["Solid State (SSD)", "Electronic circuits with no moving parts (flash memory)", "Very fast, durable, silent, low power, lightweight", "More expensive per GB, limited write cycles", "SSD drives, USB flash drives, SD cards"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying SSDs have 'no moving parts' is an advantage only for durability.",
            correction: "No moving parts also makes SSDs faster (no seek time), quieter, lighter, and more power-efficient — these are all separate advantages worth mentioning.",
          },
        ],

        flashcards: [
          { front: "What are the three types of secondary storage?", back: "Magnetic (HDD), Solid State (SSD), and Optical (CD/DVD/Blu-ray)." },
          { front: "Why is SSD better than HDD for a laptop?", back: "SSD has no moving parts — it's faster, more durable (survives drops), lighter, uses less power, and is quieter." },
          { front: "Give one advantage and one disadvantage of optical storage.", back: "Advantage: cheap and portable. Disadvantage: low capacity and easily scratched." },
        ],

        examTip: "When comparing storage types, think about: capacity, speed, portability, durability, cost.",
      },
      {
        id: "units-storage",
        title: "Units of Storage",
        icon: "📊",
        specPoint: "OCR J277 1.1b — Units of measurement: bits, bytes, and multiples.",
        content: "All data in a computer is stored as binary digits (bits). A bit is the smallest unit of data — either 0 or 1.\n\nStorage units follow a hierarchy based on powers of 1024:",

        revisionSummary: [
          "Bit (b) → Nibble (4 bits) → Byte (8 bits) → KB (1024 B) → MB (1024 KB) → GB (1024 MB) → TB.",
          "1 byte = 1 character of ASCII text.",
          "Multiplying or dividing by 1024 converts between consecutive units.",
        ],

        tableData: {
          headers: ["Unit", "Symbol", "Size", "Equivalent"],
          rows: [
            ["Bit", "b", "1 binary digit", "0 or 1"],
            ["Nibble", "-", "4 bits", "Half a byte"],
            ["Byte", "B", "8 bits", "1 character of text"],
            ["Kilobyte", "KB", "1,024 bytes", "A short email"],
            ["Megabyte", "MB", "1,024 KB", "An MP3 song"],
            ["Gigabyte", "GB", "1,024 MB", "A movie file"],
            ["Terabyte", "TB", "1,024 GB", "Large hard drive"],
            ["Petabyte", "PB", "1,024 TB", "Data centre storage"],
          ],
        },
        keyTerms: [
          { term: "Bit", definition: "Binary digit — the smallest unit of data (0 or 1)" },
          { term: "Byte", definition: "8 bits — enough to store one character" },
          { term: "Overflow", definition: "When a calculation produces a result too large to store in the available bits" },
        ],

        flashcards: [
          { front: "How many bits are in one byte?", back: "8 bits = 1 byte." },
          { front: "How many bytes are in one kilobyte (KB)?", back: "1,024 bytes = 1 KB. (Note: powers of 1024, not 1000)" },
          { front: "Convert 2 GB to MB.", back: "2 GB × 1024 = 2048 MB." },
        ],
      },
      {
        id: "binary-hex",
        title: "Binary & Hexadecimal",
        icon: "🔢",
        specPoint: "OCR J277 1.1a — Number systems: binary, denary and hexadecimal — conversion methods.",
        content: "Computers use binary (base 2) because transistors have two states: ON (1) and OFF (0). Hexadecimal (base 16) is used as a shorthand for binary because it's more human-readable.\n\nBinary place values (8-bit): 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1\n\nHexadecimal uses digits 0-9 and letters A-F:\nA=10, B=11, C=12, D=13, E=14, F=15\n\nConversion example:\nDenary 156 → Binary: 128+16+8+4 = 10011100\nBinary 10011100 → Hex: 1001 = 9, 1100 = C → 9C\nHex 2F → Denary: 2×16 + 15 = 47",

        revisionSummary: [
          "Binary → Denary: add up place values where bit = 1 (128, 64, 32, 16, 8, 4, 2, 1).",
          "Denary → Binary: subtract highest fitting place value repeatedly.",
          "Binary ↔ Hex: split into nibbles (4 bits each), convert each independently.",
          "Hex A=10, B=11, C=12, D=13, E=14, F=15.",
        ],

        images: [
          {
            src: "/diagrams/binary-hex-conversion.svg",
            alt: "Binary and hexadecimal conversion worked examples with nibble method and hex reference table",
            caption: "Figure — Binary ↔ Denary ↔ Hex conversion. Each hex digit represents exactly 4 binary bits (one nibble).",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing binary to denary to hexadecimal conversion. Include: an 8-bit place value table, a worked example converting 10110101 to denary, and a nibble method example converting B5 hex to binary. Include a small hex reference table (0-F with binary). Use blue and purple colour scheme.",
          },
        ],

        keyTerms: [
          { term: "Binary", definition: "Base 2 number system using only 0 and 1" },
          { term: "Denary", definition: "Base 10 number system (our everyday counting system)" },
          { term: "Hexadecimal", definition: "Base 16 number system using 0-9 and A-F" },
          { term: "Nibble", definition: "4 bits — half a byte. Each hex digit represents exactly one nibble." },
        ],

        commonMistakes: [
          {
            mistake: "Converting hex to denary without using the nibble method.",
            correction: "Split binary into groups of 4 (nibbles) from the right, then convert each nibble to its hex digit separately. This is much faster and less error-prone.",
          },
          {
            mistake: "Forgetting that hex A–F represent denary 10–15.",
            correction: "A=10, B=11, C=12, D=13, E=14, F=15. Learn these — they appear in almost every exam that includes hexadecimal.",
          },
        ],

        workedExample: {
          question: "Convert the denary number 202 to binary and then to hexadecimal. [4 marks]",
          steps: [
            { step: "Set up the 8-bit place value table: 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1", explanation: "Start with the highest bit value (128) for an 8-bit number." },
            { step: "128 fits into 202 (202 − 128 = 74) → place 1 under 128.", explanation: "Subtract 128 from 202, remainder is 74." },
            { step: "64 fits into 74 (74 − 64 = 10) → place 1 under 64.", explanation: "Continue subtracting the next fitting value." },
            { step: "8 fits into 10 (10 − 8 = 2) → place 1 under 8. 2 fits → place 1 under 2.", explanation: "32, 16, 4, 1 do not fit; place 0 under each." },
            { step: "Binary result: 11001010₂", explanation: "128+64+8+2 = 202 ✓" },
            { step: "Group into nibbles: 1100 | 1010", explanation: "Split the 8-bit number into two 4-bit groups from the right." },
            { step: "1100 = 12 = C; 1010 = 10 = A", explanation: "Convert each nibble using the hex table." },
          ],
          answer: "202₁₀ = 11001010₂ = CA₁₆",
          markScheme: "1 mark: correct binary; 1 mark: correct method shown; 1 mark: correct nibble splitting; 1 mark: correct hex CA.",
        },

        flashcards: [
          { front: "What is the denary value of binary 10101010?", back: "128+32+8+2 = 170." },
          { front: "Why is hexadecimal used instead of binary in programming?", back: "Hex is more compact and human-readable. Each hex digit represents exactly 4 binary bits, so 8-bit binary = 2 hex digits." },
          { front: "Convert hex 3F to binary.", back: "3 = 0011, F = 1111 → 0011 1111₂" },
        ],

        examTip: "Always show your working in conversion questions — you get method marks even if the final answer is wrong!",
      },
      {
        id: "data-representation",
        title: "Data Representation",
        icon: "🎨",
        specPoint: "OCR J277 1.1e–g — Representing text, images, and sound as binary data.",
        content: "All data — text, images, sound — must be converted to binary for a computer to process it.\n\n• Characters: Stored using character sets. ASCII uses 7 bits (128 characters). Unicode uses up to 32 bits (over 1 million characters including emojis).\n\n• Images: Made up of pixels. Each pixel's colour is stored as binary. Metadata includes width, height, and colour depth.\n\n• Sound: Analogue sound waves are converted to digital using sampling. Sample rate (Hz) = how often samples are taken. Bit depth = how many bits per sample.",

        revisionSummary: [
          "ASCII = 7-bit (128 chars); Unicode = up to 32-bit (1M+ chars including all world scripts).",
          "Image file size = width × height × colour depth (bits).",
          "Sound file size = sample rate (Hz) × duration (s) × bit depth × channels.",
          "Higher sample rate and bit depth = better quality audio but larger file.",
        ],

        tableData: {
          headers: ["Data Type", "How Stored", "Quality Factor", "File Size Factor"],
          rows: [
            ["Text", "Character codes (ASCII/Unicode)", "Character set size", "More bits per character = larger"],
            ["Images", "Binary colour values per pixel", "Resolution × Colour depth", "Higher res/depth = larger"],
            ["Sound", "Binary samples of audio wave", "Sample rate × Bit depth", "Higher rate/depth = larger"],
          ],
        },
        keyTerms: [
          { term: "ASCII", definition: "7-bit character encoding standard — 128 characters (English letters, numbers, symbols)" },
          { term: "Unicode", definition: "Character encoding standard supporting 100,000+ characters from all languages" },
          { term: "Pixel", definition: "The smallest element of a digital image — a single point of colour" },
          { term: "Sample Rate", definition: "Number of audio samples taken per second (measured in Hz)" },
          { term: "Bit Depth", definition: "Number of bits used to store each sample or pixel colour" },
          { term: "Colour Depth", definition: "Number of bits used to represent the colour of each pixel" },
        ],

        commonMistakes: [
          {
            mistake: "Saying 'increasing resolution increases quality' without linking to file size.",
            correction: "Higher resolution = more pixels = better quality image BUT also a larger file size. Always mention both in exam answers.",
          },
        ],

        workedExample: {
          question: "Calculate the file size in megabytes of an uncompressed image that is 800 × 600 pixels with a colour depth of 24 bits. [3 marks]",
          steps: [
            { step: "File size (bits) = width × height × colour depth", explanation: "Use the image file size formula." },
            { step: "= 800 × 600 × 24 = 11,520,000 bits", explanation: "Multiply all three values together." },
            { step: "Convert to bytes: 11,520,000 ÷ 8 = 1,440,000 bytes", explanation: "Divide by 8 since 8 bits = 1 byte." },
            { step: "Convert to KB: 1,440,000 ÷ 1024 ≈ 1406 KB", explanation: "Divide by 1024 to convert bytes to KB." },
            { step: "Convert to MB: 1406 ÷ 1024 ≈ 1.37 MB", explanation: "Divide by 1024 again to convert KB to MB." },
          ],
          answer: "≈ 1.37 MB",
          markScheme: "1 mark: correct formula used; 1 mark: correct multiplication to bits; 1 mark: correct conversion to MB (accept 1.37–1.38 MB).",
        },

        flashcards: [
          { front: "What is the difference between ASCII and Unicode?", back: "ASCII uses 7 bits (128 characters, English only). Unicode uses up to 32 bits, supporting 100,000+ characters from all world languages." },
          { front: "What is colour depth?", back: "The number of bits used to represent the colour of each pixel. 24-bit colour depth = 16.7 million possible colours." },
          { front: "How does increasing sample rate affect a sound file?", back: "Higher sample rate = better sound quality (more faithful to original) but larger file size." },
        ],
      },
    ],
  },

  // ============================================
  // COMPUTER NETWORKS
  // ============================================
  {
    slug: "computer-networks",
    title: "Computer Networks",
    paper: "1",
    ocrRef: "1.3",
    aqaRef: ["3.5"],
    examBoards: ["ocr", "aqa"],
    icon: "🌐",
    color: "accent",
    description: "Network types, topologies, protocols, and the internet.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "LAN = local area network (one site, own hardware); WAN = wide area (multiple sites, rented infrastructure).",
      "Star topology: all devices connect to central switch — easy to manage, switch is single point of failure.",
      "Mesh topology: every device connects to every other — reliable but expensive.",
      "Protocols are agreed rules for data transmission; TCP/IP, HTTP, HTTPS, FTP, SMTP, DNS are key examples.",
      "TCP/IP uses packet switching — data split into packets, routed independently, reassembled at destination.",
    ],

    sections: [
      {
        id: "lan-wan",
        title: "LAN vs WAN",
        icon: "🔗",
        specPoint: "OCR J277 1.3a — Types of network: LAN and WAN.",
        content: "A network is two or more computers connected together to share resources like files, printers, and internet access. Not having a network (standalone) is more secure but misses these benefits.",

        revisionSummary: [
          "LAN = small geographic area, hardware owned by organisation, fast speeds.",
          "WAN = large geographic area, infrastructure rented from telecoms, includes the internet.",
        ],

        comparisonData: {
          itemA: { title: "LAN (Local Area Network)", points: ["Small geographical area (building/campus)", "Hardware owned by the organisation", "Uses switches, routers, Ethernet or Wi-Fi", "Higher data transfer speeds", "Quick and easy to set up", "Cheaper to maintain"] },
          itemB: { title: "WAN (Wide Area Network)", points: ["Large geographical area (city/country/world)", "Infrastructure rented from third parties (telecom companies)", "Uses routers, undersea cables, satellites", "Lower speeds over long distances", "More expensive to set up and maintain", "The Internet is the largest WAN"] },
        },
      },
      {
        id: "network-hardware",
        title: "Networking Hardware",
        icon: "🔌",
        specPoint: "OCR J277 1.3b — Hardware needed to connect a device to a network.",
        content: "Several hardware devices are needed to build and operate a network:",

        revisionSummary: [
          "Router: connects networks, routes packets, assigns IP addresses.",
          "Switch: forwards packets to correct device within a LAN using MAC addresses.",
          "NIC: network interface card — every device needs one; has a unique MAC address.",
        ],

        tableData: {
          headers: ["Device", "Purpose", "Key Details"],
          rows: [
            ["Router", "Connects different networks and directs data packets", "Maintains routing tables, assigns IP addresses, finds most efficient path"],
            ["Switch", "Sends data packets between devices within a LAN", "Stores MAC addresses, forwards packets to correct device"],
            ["NIC", "Allows a device to connect to a network", "Has a unique MAC address hard-coded by manufacturer"],
            ["WAP", "Enables wireless devices to join a wired network", "Bridges wired/wireless networks, extends range, enables roaming"],
            ["Modem", "Converts digital data to analogue for phone lines", "Modulation (digital→analogue) and demodulation (analogue→digital)"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying a router and a switch do the same thing.",
            correction: "A switch forwards packets between devices on the SAME network (LAN) using MAC addresses. A router connects DIFFERENT networks and routes between them using IP addresses.",
          },
        ],

        flashcards: [
          { front: "What is the difference between a router and a switch?", back: "A switch connects devices within a LAN (uses MAC addresses). A router connects different networks and routes packets between them (uses IP addresses)." },
          { front: "What is a MAC address?", back: "A unique hardware address hard-coded into a NIC by the manufacturer. 12 hex characters. Used by switches to forward packets within a LAN." },
          { front: "What does a WAP do?", back: "A Wireless Access Point bridges wireless devices to a wired network, allowing Wi-Fi devices to join a LAN." },
        ],

        examTip: "Home 'routers' are actually all-in-one devices combining a router, modem, switch, and WAP in one box.",
      },
      {
        id: "network-topologies",
        title: "Network Topologies",
        icon: "🕸️",
        specPoint: "OCR J277 1.3c — Star and mesh network topologies: advantages and disadvantages.",
        content: "A network topology is the arrangement of devices and connections in a network.",

        revisionSummary: [
          "Star: all devices connect to a central switch — fast, easy to manage, but switch failure = network down.",
          "Mesh: every device connects to every other — very reliable, but expensive (lots of cabling).",
          "Partial mesh: compromise between full mesh reliability and cost.",
        ],

        images: [
          {
            src: "/diagrams/network-topologies.svg",
            alt: "Star topology with central switch and mesh topology with all devices interconnected",
            caption: "Figure — Star topology (left): one central switch manages all connections. Mesh topology (right): every device has a direct link to every other device.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing two network topologies side by side. Left: star topology with a central switch/hub and 6 PC nodes around it connected by lines. Right: mesh topology with 5 PC nodes each connected to every other node. Label each topology. Use blue for star, purple for mesh.",
          },
        ],

        comparisonData: {
          itemA: { title: "Star Topology", points: ["All devices connect to a central switch", "If one cable fails, only that device is affected", "Easy to add new devices", "High performance — no data collisions", "If the central switch fails, whole network goes down", "Less cabling needed than mesh"] },
          itemB: { title: "Mesh Topology", points: ["Every device connects to every other device", "Very reliable — multiple paths for data", "If one connection fails, data reroutes", "No single point of failure", "Expensive — lots more cabling and equipment", "Partial mesh offers a compromise"] },
        },

        commonMistakes: [
          {
            mistake: "Saying star topology has 'no single point of failure'.",
            correction: "The central switch IS a single point of failure — if it breaks, the whole network goes down. This is a key disadvantage of star topology.",
          },
        ],

        flashcards: [
          { front: "What is the single point of failure in a star topology?", back: "The central switch. If it fails, all devices lose network connectivity." },
          { front: "Why is mesh topology more expensive than star?", back: "Every device must connect to every other device — for 6 devices that's 15 cables. Far more cabling and equipment than star." },
          { front: "What is a partial mesh?", back: "A topology where some (not all) devices connect to multiple others — a compromise between full mesh reliability and star simplicity/cost." },
        ],

        examTip: "OCR often asks you to compare star and mesh topologies. Know 2 advantages and 2 disadvantages of each.",
      },
      {
        id: "network-performance",
        title: "Factors Affecting Network Performance",
        icon: "📊",
        specPoint: "OCR J277 1.3d — Factors affecting network performance.",
        content: "Several factors affect how well a network performs:",

        revisionSummary: [
          "Bandwidth: maximum data per second — limited bandwidth slows all users.",
          "Number of users: more users = more congestion and collisions.",
          "Interference: wireless networks suffer from physical obstacles and other signals.",
        ],

        tableData: {
          headers: ["Factor", "Description", "Impact"],
          rows: [
            ["Number of users", "More users on the network at any time", "Increases collisions, latency, and wait times"],
            ["Bandwidth", "Max data that can be transferred per second", "If limit reached, no more data can be transmitted"],
            ["Type of connection", "Wired (Ethernet) vs Wireless (Wi-Fi)", "Wired is faster/more reliable; wireless is more convenient"],
            ["Network hardware", "Quality of routers, switches, cables", "Old or cheap hardware bottlenecks performance"],
            ["Interference", "Physical objects, other signals", "Walls and microwaves can interfere with Wi-Fi"],
          ],
        },

        flashcards: [
          { front: "What is bandwidth?", back: "The maximum amount of data that can be transferred across a network in a given time, measured in Mbps or Gbps." },
          { front: "Why does having more users slow a network?", back: "More devices sending data at once increases collisions and congestion, meaning each device gets less bandwidth." },
        ],
      },
      {
        id: "client-server-p2p",
        title: "Client-Server vs Peer-to-Peer",
        icon: "🖧",
        specPoint: "OCR J277 1.3e — Client-server and peer-to-peer networks.",
        content: "Networks can be organised in two ways depending on whether a central server is used.",

        revisionSummary: [
          "Client-server: dedicated server manages all files and security — used in schools/businesses.",
          "Peer-to-peer (P2P): all computers equal, no central server — simpler, cheaper, less secure.",
        ],

        comparisonData: {
          itemA: { title: "Client-Server", points: ["Dedicated server manages data, files, and security", "Files stored centrally — easy backups", "Access levels for better security", "Requires specialist OS and network manager", "Expensive server hardware needed"] },
          itemB: { title: "Peer-to-Peer", points: ["No central server — all computers are equal", "No specialist OS needed", "Easier and cheaper to set up", "If one computer fails, rest continues", "Files spread across computers — harder to find", "Less secure — everyone responsible for security"] },
        },

        flashcards: [
          { front: "Why do schools use client-server networks rather than P2P?", back: "Client-server provides centralised file storage (easy backups), user access levels, central management, and better security." },
          { front: "Give one advantage and one disadvantage of peer-to-peer networking.", back: "Advantage: no expensive server hardware needed. Disadvantage: files are spread across all computers making them harder to find and manage." },
        ],

        examTip: "Schools and businesses use client-server. Small home networks typically use peer-to-peer.",
      },
      {
        id: "wired-wireless",
        title: "Wired vs Wireless Networks",
        icon: "📡",
        specPoint: "OCR J277 1.3f — Wired and wireless networks, including Ethernet, Wi-Fi, and Bluetooth.",
        content: "Networks can use wired or wireless connections:",

        revisionSummary: [
          "Ethernet (wired): fastest, most reliable, no interference — but requires physical cables.",
          "Wi-Fi 2.4 GHz: longer range, penetrates walls; Wi-Fi 5 GHz: faster but shorter range.",
          "Bluetooth: very short range (~10m), for personal device pairing.",
        ],

        tableData: {
          headers: ["Technology", "Type", "Speed", "Range", "Notes"],
          rows: [
            ["Ethernet", "Wired", "Up to 10 Gbps", "~100m", "Standardised, reliable, most common wired technology"],
            ["Wi-Fi (2.4 GHz)", "Wireless", "Varies", "~45m indoors", "Better range, penetrates walls, but more interference"],
            ["Wi-Fi (5 GHz)", "Wireless", "Often faster", "~15m indoors", "Less interference but shorter range"],
            ["Bluetooth", "Wireless", "Up to 2.1 Mbps", "~10m", "Short range, for nearby devices (phone + headphones)"],
          ],
        },

        flashcards: [
          { front: "Give two advantages of wired (Ethernet) over wireless.", back: "1. Faster and more reliable speeds. 2. No wireless interference from walls or other signals." },
          { front: "What is the main advantage of 2.4 GHz Wi-Fi over 5 GHz?", back: "2.4 GHz has a longer range and penetrates walls better. (5 GHz is faster but has shorter range.)" },
        ],
      },
      {
        id: "protocols",
        title: "Network Protocols",
        icon: "📋",
        specPoint: "OCR J277 1.3g — Common protocols: TCP/IP, HTTP, HTTPS, FTP, SMTP, POP, IMAP, DNS.",
        content: "A protocol is a set of rules for data transmission. Protocols ensure devices from different manufacturers can communicate.",

        revisionSummary: [
          "HTTP/HTTPS: web pages (HTTPS is encrypted).",
          "FTP: file transfers; SMTP: send email; POP: download email; IMAP: sync email across devices.",
          "DNS: translates domain names (google.com) to IP addresses.",
          "TCP/IP: the foundation — splits data into packets and routes them across the internet.",
        ],

        tableData: {
          headers: ["Protocol", "Full Name", "Purpose"],
          rows: [
            ["TCP/IP", "Transmission Control Protocol / Internet Protocol", "Breaks data into packets and routes them across the internet"],
            ["HTTP", "HyperText Transfer Protocol", "Transfers web pages between browser and server"],
            ["HTTPS", "HyperText Transfer Protocol Secure", "Same as HTTP but encrypted for security"],
            ["FTP", "File Transfer Protocol", "Transfers files between computers"],
            ["SMTP", "Simple Mail Transfer Protocol", "Sends emails from sender to server"],
            ["POP", "Post Office Protocol", "Downloads emails from server"],
            ["IMAP", "Internet Message Access Protocol", "Receives emails and syncs across devices"],
            ["DNS", "Domain Name System", "Converts domain names to IP addresses"],
          ],
        },
        keyTerms: [
          { term: "Protocol", definition: "A set of rules governing data transmission across a network" },
          { term: "Packet", definition: "A small chunk of data with a header (source, destination, packet number) and payload" },
          { term: "Packet Switching", definition: "Data is split into packets that may take different routes and are reassembled at the destination" },
        ],

        commonMistakes: [
          {
            mistake: "Confusing SMTP and POP/IMAP.",
            correction: "SMTP is for SENDING email (from you to mail server). POP and IMAP are for RECEIVING email (from mail server to you).",
          },
        ],

        flashcards: [
          { front: "What does DNS stand for and what does it do?", back: "Domain Name System — translates human-readable domain names (e.g. bbc.co.uk) into IP addresses so browsers can connect to web servers." },
          { front: "What is the difference between HTTP and HTTPS?", back: "HTTPS is HTTP with TLS encryption. Data sent over HTTPS is scrambled so it cannot be read if intercepted." },
          { front: "What is packet switching?", back: "Data is broken into small packets. Each packet may take a different route across the network. They are reassembled in the correct order at the destination." },
        ],
      },
      {
        id: "layers",
        title: "The Concept of Layers",
        icon: "📚",
        specPoint: "OCR J277 1.3h — Why protocols are layered and the TCP/IP model.",
        content: "Protocols are divided into separate layers, each handling a specific aspect of communication:",

        revisionSummary: [
          "TCP/IP has 4 layers: Application, Transport, Network/Internet, Link/Physical.",
          "Each layer is independent — change one without breaking others.",
          "Data flows DOWN the layers when sending, UP when receiving.",
        ],

        images: [
          {
            src: "/diagrams/protocol-layers.svg",
            alt: "TCP/IP four-layer stack with protocol examples at each layer",
            caption: "Figure — The TCP/IP model. Data passes down through layers when sent and up through layers when received.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing the TCP/IP 4-layer model as a stack. Top layer: Application (HTTP, FTP, SMTP, DNS). Second: Transport (TCP, UDP). Third: Network/Internet (IP). Bottom: Link/Physical (Ethernet, Wi-Fi). Use different colours per layer, label each clearly. Add arrows showing data flows down when sending, up when receiving.",
          },
        ],

        tableData: {
          headers: ["Benefit", "Explanation"],
          rows: [
            ["Independence", "A layer can be changed without affecting other layers"],
            ["Self-contained", "Each layer has its own specific purpose"],
            ["Simplicity", "Individual protocols are smaller and simpler to manage"],
            ["Hardware flexibility", "Different layers can interface with different hardware"],
            ["Parallel development", "Teams can work on different layers independently"],
          ],
        },
        keyTerms: [
          { term: "Application Layer", definition: "User-facing protocols (HTTP, FTP, SMTP, DNS)" },
          { term: "Transport Layer", definition: "End-to-end communication (TCP, UDP)" },
          { term: "Network Layer", definition: "Routing and IP addressing (IPv4, IPv6)" },
        ],

        workedExample: {
          question: "Explain two reasons why protocols are organised into layers. [4 marks]",
          steps: [
            { step: "Each layer is independent of others.", explanation: "A change to one layer (e.g., updating Wi-Fi to Wi-Fi 6) does not require changes to the other layers." },
            { step: "This makes individual protocols simpler to design and maintain.", explanation: "Each layer handles a specific job, keeping protocols smaller and easier to understand." },
            { step: "Different teams can work on different layers simultaneously.", explanation: "Hardware manufacturers design physical layer protocols while software teams design application layer protocols independently." },
          ],
          answer: "Layers allow independent development and modification of protocols without affecting other layers, and simplify the design by dividing complex communication into manageable stages.",
          markScheme: "2 marks per reason: 1 for stating the reason, 1 for explaining it. Any two of: independence, simplicity, parallel development, hardware flexibility.",
        },

        flashcards: [
          { front: "Name the four layers of the TCP/IP model (top to bottom).", back: "Application → Transport → Network/Internet → Link/Physical." },
          { front: "At which TCP/IP layer does HTTP operate?", back: "The Application layer — HTTP handles web page requests and responses." },
        ],

        examTip: "You don't need to memorise the full OSI model for GCSE, but know WHY protocols are layered — it's a common 3-mark question.",
      },
      {
        id: "encryption-addressing",
        title: "Encryption & Addressing",
        icon: "🔐",
        specPoint: "OCR J277 1.3i — IP and MAC addresses; encryption.",
        content: "Data sent across networks can be intercepted. Encryption scrambles data so only the intended recipient (with the key) can read it.\n\nEvery device needs addresses for identification:",

        revisionSummary: [
          "IP address: assigned by router, can change, used for routing between networks.",
          "MAC address: permanent, hard-coded, used by switches within a LAN.",
          "Encryption converts plaintext to ciphertext — only decryptable with the correct key.",
        ],

        comparisonData: {
          itemA: { title: "IP Address", points: ["Assigned by the router", "Can change each time device connects", "IPv4: four numbers 0-255 (e.g., 217.100.54.119)", "IPv6: eight hex groups — needed as IPv4 ran out", "Used to route data between networks"] },
          itemB: { title: "MAC Address", points: ["Hard-coded by manufacturer", "Permanent and unique worldwide", "12 hex characters (e.g., 00-B0-D0-63-C2-26)", "Used by switches within a LAN", "Cannot be changed"] },
        },

        flashcards: [
          { front: "What is the difference between an IP address and a MAC address?", back: "IP address is assigned by a router and can change — used for routing between networks. MAC address is permanent, hard-coded in hardware — used within a LAN." },
          { front: "Why was IPv6 introduced?", back: "IPv4 only supports ~4.3 billion unique addresses. As internet-connected devices grew, IPv4 addresses ran out. IPv6 supports 340 undecillion addresses." },
        ],
      },
      {
        id: "internet-dns",
        title: "The Internet, DNS & The Cloud",
        icon: "🌍",
        specPoint: "OCR J277 1.3j — The internet, DNS process, and cloud computing.",
        content: "The Internet is a global WAN. The WWW is a service that runs ON the internet.\n\nDNS translates domain names to IP addresses:\n1. User types URL into browser\n2. Browser sends domain to DNS server\n3. DNS returns the IP address\n4. Browser connects to web server\n\nThe Cloud refers to remote servers for storage, apps, and computing power.",

        revisionSummary: [
          "Internet = global network infrastructure (WAN); WWW = web pages/sites running on the internet.",
          "DNS = phonebook for the internet — converts bbc.co.uk → IP address.",
          "Cloud benefits: accessible anywhere, scalable, no hardware cost; risks: needs internet, data on third party servers.",
        ],

        comparisonData: {
          itemA: { title: "Cloud Advantages", points: ["Cost effective — no on-premises hardware", "Scalable — add resources on demand", "Accessible from anywhere with internet", "Advanced security from providers", "Built-in disaster recovery"] },
          itemB: { title: "Cloud Disadvantages", points: ["Requires internet connection", "Security threats (data breaches)", "Susceptible to downtime", "Fixed contracts may be inflexible", "Data on third-party servers"] },
        },
        keyTerms: [
          { term: "IP Address", definition: "A unique numerical address assigned to every device on a network" },
          { term: "DNS", definition: "Domain Name System — translates domain names to IP addresses" },
          { term: "ISP", definition: "Internet Service Provider — company that provides internet access" },
          { term: "Hosting", definition: "Storing website files on a web server so they can be accessed over the internet" },
          { term: "The Cloud", definition: "Remote servers accessed over the internet to store data or run applications" },
        ],

        flashcards: [
          { front: "What is the difference between the Internet and the World Wide Web?", back: "The Internet is the physical global network infrastructure (cables, routers, servers). The WWW is a service (websites, web pages) that runs on top of the internet." },
          { front: "Describe the DNS process when you type a URL.", back: "1. Browser asks DNS server to look up the domain. 2. DNS returns the IP address. 3. Browser connects to the web server at that IP address." },
          { front: "Give two advantages of cloud storage over local storage.", back: "Any two of: accessible from any device/location; automatic backups; no hardware maintenance; scales to need; often cheaper." },
        ],
      },
    ],
  },

  // ============================================
  // NETWORK SECURITY
  // ============================================
  {
    slug: "network-security",
    title: "Network Security",
    paper: "1",
    ocrRef: "1.4",
    aqaRef: ["3.6"],
    examBoards: ["ocr", "aqa"],
    icon: "🔒",
    color: "destructive",
    description: "Threats, vulnerabilities, and methods of protection.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "Malware types: virus (spreads via files), trojan (disguised software), spyware (records keystrokes), ransomware (encrypts files, demands payment).",
      "Social engineering exploits people not systems — phishing (fake emails), shoulder surfing, tailgating.",
      "Brute force = automated password guessing; SQL injection = malicious code in web forms; DDoS = flood server with traffic.",
      "Defences: firewall, encryption, anti-malware, 2FA, strong passwords, user access levels, penetration testing.",
      "Always match the defence to the specific threat in exam answers.",
    ],

    sections: [
      {
        id: "malware-types",
        title: "Types of Malware",
        icon: "🦠",
        specPoint: "OCR J277 1.4a — Forms of attack: malware types and their characteristics.",
        content: "Malware (malicious software) includes any software designed to cause harm:",

        revisionSummary: [
          "Virus: self-replicates and attaches to files.",
          "Trojan: disguised as legitimate software — user installs it unknowingly.",
          "Ransomware: encrypts files, demands payment for the decryption key.",
          "Spyware: secretly records keystrokes and sends data to attacker.",
        ],

        tableData: {
          headers: ["Malware Type", "What It Does", "How It Spreads"],
          rows: [
            ["Virus", "Copies itself from machine to machine causing harm", "Attaches to legitimate files, spreads when files are shared"],
            ["Trojan Horse", "Disguises itself as useful software, causes damage once installed", "Downloaded by user thinking it's a game or utility"],
            ["Spyware", "Secretly monitors activity, records keystrokes and passwords", "Bundled with downloads or via malicious websites"],
            ["Ransomware", "Locks/encrypts all files, demands payment to unlock", "Delivered via phishing emails or malicious downloads"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying a virus and a trojan are the same thing.",
            correction: "A virus self-replicates and spreads to other files/machines. A trojan does NOT self-replicate — it disguises itself as legitimate software to trick the user into installing it.",
          },
        ],

        flashcards: [
          { front: "What is ransomware and how does it work?", back: "Malware that encrypts all files on a device, then demands payment (usually cryptocurrency) in exchange for the decryption key." },
          { front: "How does a trojan horse differ from a virus?", back: "A trojan disguises itself as useful software — it does not self-replicate. A virus copies itself and spreads between files/computers." },
          { front: "What is spyware?", back: "Malware that secretly monitors user activity, records keystrokes, and sends captured passwords/data back to the attacker." },
        ],
      },
      {
        id: "social-engineering",
        title: "Social Engineering Attacks",
        icon: "🎭",
        specPoint: "OCR J277 1.4b — Social engineering: phishing, vishing, shoulder surfing, tailgating.",
        content: "Sometimes people are the weak point. Social engineering tricks people into giving away data or passwords:",

        revisionSummary: [
          "Phishing: fake emails pretending to be a trusted source — links to fake login pages.",
          "Vishing: voice call version of phishing.",
          "Shoulder surfing: watching someone enter a PIN or password.",
          "Tailgating: following an authorised person through a secure door.",
        ],

        tableData: {
          headers: ["Attack", "Description", "Example"],
          rows: [
            ["Phishing", "Fake emails from a 'trusted' source with urgent requests", "Email claiming to be from your bank asking to 'verify' your account"],
            ["Vishing", "Voice call version of phishing", "Call pretending to be from HMRC saying you owe tax"],
            ["Shoulder Surfing", "Watching someone type their password", "Peering at someone's PIN at a cash machine"],
            ["Tailgating", "Following an authorised person through a secure door", "Having the door held open without being challenged"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying phishing is a technical attack.",
            correction: "Phishing is social engineering — it exploits human psychology (urgency, fear, trust), not a technical vulnerability. The defence is training people, not just firewalls.",
          },
        ],

        flashcards: [
          { front: "What is phishing?", back: "A social engineering attack using fake emails or websites that impersonate a trusted source to steal login credentials or personal data." },
          { front: "What is the key difference between social engineering and malware?", back: "Social engineering exploits people (human weaknesses). Malware exploits software/technical vulnerabilities." },
          { front: "How can organisations defend against social engineering?", back: "Staff training/awareness, verifying email senders, physical security (ID checks for building entry), and two-factor authentication." },
        ],

        examTip: "Social engineering exploits PEOPLE, not technology. That's the key distinction from malware attacks.",
      },
      {
        id: "cyber-threats",
        title: "Other Cyber Threats",
        icon: "⚠️",
        specPoint: "OCR J277 1.4c — Brute force attacks, SQL injection, and DDoS.",
        content: "Beyond malware and social engineering, several other threats target networks:",

        revisionSummary: [
          "Brute force: automated trial of every password combination — defend with strong passwords and account lockout.",
          "SQL injection: malicious SQL inserted into a web form input to access/modify a database.",
          "DDoS: floods server with traffic via a botnet until it crashes — defend with rate limiting and firewalls.",
        ],

        images: [
          {
            src: "/diagrams/network-security-threats.svg",
            alt: "Six network security threat cards: Malware, Phishing, Brute Force, DDoS, Man-in-the-Middle, SQL Injection",
            caption: "Figure — Key network security threats with descriptions, examples and defences.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing 6 network security threat cards in a 3x2 grid. Cards: Malware, Phishing, Brute Force Attack, DDoS, Man-in-the-Middle, SQL Injection. Each card shows: threat name, brief description, example, and defence. Use red/amber colour scheme for threat cards.",
          },
        ],

        tableData: {
          headers: ["Threat", "Description", "How It Works", "Prevention"],
          rows: [
            ["Brute Force", "Trying every possible password combination", "Automated tools try millions of combinations", "Strong passwords, account lockout"],
            ["SQL Injection", "Malicious SQL code inserted into web forms", "e.g., ;DROP TABLE Customer added to a query", "Input validation, parameterised queries"],
            ["DDoS", "Distributed Denial of Service", "Botnet floods server with requests until it crashes", "Firewalls, traffic filtering, IP blocking"],
            ["Data Interception", "Intercepting packets in transit", "Packet sniffing software captures data", "Encryption, HTTPS, VPNs"],
          ],
        },

        workedExample: {
          question: "Describe how a SQL injection attack works and explain how it can be prevented. [4 marks]",
          steps: [
            { step: "The attacker finds a web form input (e.g., a login box) that passes data directly to a database query.", explanation: "Any input field that queries a database is potentially vulnerable." },
            { step: "The attacker types SQL code instead of normal input.", explanation: "For example, entering: ' OR '1'='1 into a username field might bypass login authentication." },
            { step: "If the server doesn't validate input, the injected SQL executes.", explanation: "This could return all records, delete tables, or grant unauthorised access." },
            { step: "Prevention: use input validation to reject unexpected characters.", explanation: "Parameterised queries separate SQL code from data so user input is never executed as code." },
          ],
          answer: "SQL injection inserts malicious SQL into an input field. The server executes it, granting unauthorised database access. Prevented by input validation and parameterised queries.",
          markScheme: "1 mark: attacker enters SQL into input field; 1 mark: SQL executes on database; 1 mark: input validation prevents it; 1 mark: parameterised queries explained.",
        },

        flashcards: [
          { front: "What is a DDoS attack?", back: "Distributed Denial of Service — a botnet (many hacked computers) floods a server with so many requests that it crashes and becomes unavailable to real users." },
          { front: "How does a brute force attack work?", back: "Automated software systematically tries every possible password combination until the correct one is found." },
          { front: "What is SQL injection?", back: "Inserting malicious SQL code into a web form input field. If not validated, the server executes the SQL, potentially exposing or deleting the entire database." },
        ],

        examTip: "For each threat, always know: what it IS, how it WORKS, and how to PREVENT it. That's usually 3 marks.",
      },
      {
        id: "protection-methods",
        title: "Methods of Protection",
        icon: "🛡️",
        specPoint: "OCR J277 1.4d — Methods to protect systems: firewalls, encryption, authentication, and more.",
        content: "Organisations use multiple layers of security:",

        revisionSummary: [
          "Firewall: filters network traffic by rules — blocks unauthorised packets.",
          "Encryption: converts data to ciphertext — unreadable without the key.",
          "2FA: requires two verification types — something you know + something you have.",
          "Penetration testing: ethical hackers find vulnerabilities before attackers do.",
        ],

        tableData: {
          headers: ["Method", "What It Does", "How It Works"],
          rows: [
            ["Firewall", "Monitors and filters network traffic", "Compares traffic against rules, blocks unauthorised access and specific IPs/ports"],
            ["Encryption", "Scrambles data so it can't be read if intercepted", "Converts plaintext to ciphertext; needs key to decrypt"],
            ["Anti-malware", "Detects and removes malicious software", "Constantly scans drives/memory, compares against threat database"],
            ["Authentication", "Verifies user identity", "Passwords, biometrics, two-factor authentication (2FA)"],
            ["User Access Levels", "Different permissions per user", "Read, write, delete permissions based on role"],
            ["Strong Passwords", "Protects against brute force", "Mix of uppercase, lowercase, numbers, special characters"],
            ["Physical Security", "Prevents physical access to hardware", "Keypad entry, biometrics, CCTV, locked server rooms"],
            ["Penetration Testing", "Tests security by simulating attacks", "Ethical hackers find and report vulnerabilities"],
          ],
        },
        keyTerms: [
          { term: "Encryption", definition: "Converting data into coded form that can only be read with the correct decryption key" },
          { term: "Firewall", definition: "Hardware or software that monitors and filters network traffic based on security rules" },
          { term: "Two-Factor Authentication", definition: "Requiring two different types of verification (e.g., password + phone code)" },
          { term: "Penetration Testing", definition: "Authorised simulated attacks to find and fix security weaknesses" },
        ],

        flashcards: [
          { front: "What does a firewall do?", back: "Monitors incoming and outgoing network traffic and blocks packets that don't match the allowed rules (e.g., blocks traffic from suspicious IP addresses or ports)." },
          { front: "What is two-factor authentication (2FA)?", back: "Requiring two separate types of verification to log in — e.g., a password (something you know) + a one-time code sent to your phone (something you have)." },
          { front: "Why is encryption important for network security?", back: "Even if data is intercepted during transmission, encryption ensures it cannot be read without the decryption key." },
        ],
      },
      {
        id: "threat-defence-summary",
        title: "Threat vs Defence Summary",
        icon: "📋",
        specPoint: "OCR J277 1.4 — Matching threats to appropriate defences.",
        content: "Quick reference for matching threats to their best defences:",

        revisionSummary: [
          "Each threat has a most appropriate defence — learn the pairings.",
          "Firewall defends against unauthorised access and DoS; encryption defends against interception.",
        ],

        tableData: {
          headers: ["Threat", "Best Defence"],
          rows: [
            ["Malware", "Anti-malware software + firewalls"],
            ["Social Engineering", "Staff training + physical security"],
            ["Brute Force", "Strong passwords + account lockout"],
            ["Denial of Service", "Firewall blocking suspicious IPs"],
            ["Data Interception", "Encryption (HTTPS, VPN)"],
            ["SQL Injection", "Input validation + parameterised queries"],
          ],
        },

        flashcards: [
          { front: "What is the best defence against SQL injection?", back: "Input validation (reject unexpected characters) and parameterised queries (so user input is never executed as SQL code)." },
          { front: "What is the best defence against data interception?", back: "Encryption — scrambles the data so even if intercepted, it cannot be read without the decryption key. HTTPS and VPNs both use encryption." },
        ],

        examTip: "In the exam, always match the defence to the specific threat — don't just say 'use a firewall' for everything!",
      },
    ],
  },

  // ============================================
  // SYSTEMS SOFTWARE
  // ============================================
  {
    slug: "systems-software",
    title: "Systems Software",
    paper: "1",
    ocrRef: "1.5",
    aqaRef: ["3.4"],
    examBoards: ["ocr", "aqa"],
    icon: "⚙️",
    color: "primary",
    description: "Operating systems, utility software, and translators.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "OS manages hardware, provides user interface, handles memory, processes, files, security, and peripheral devices.",
      "Compiler: translates all code at once → fast execution, no source needed to run.",
      "Interpreter: translates one line at a time → easy debugging, stops at first error.",
      "Utility software: anti-malware, disk defragmenter, backup, compression, encryption.",
      "Lossy compression loses data permanently (JPEG, MP3); lossless preserves all data (ZIP, PNG).",
    ],

    sections: [
      {
        id: "os-functions",
        title: "Operating System Functions",
        icon: "🖥️",
        specPoint: "OCR J277 1.5a — The purpose and main functions of an operating system.",
        content: "An operating system (OS) is software that manages the computer's hardware and provides services for applications. Without an OS, you couldn't use a computer.\n\nThe OS acts as an intermediary between the user and the hardware.",

        revisionSummary: [
          "OS hides hardware complexity from the user and applications.",
          "Key functions: memory management, process management, file management, UI, peripheral management, security.",
          "GUI = graphical user interface (icons, windows); CLI = command line interface (text commands).",
        ],

        images: [
          {
            src: "/diagrams/os-layers.svg",
            alt: "Operating system layer diagram showing hardware at base, OS in middle with subsystems, and user applications at top",
            caption: "Figure — OS architecture. The OS sits between hardware and applications, hiding complexity and providing services via system calls.",
            aiPrompt: "Create an SVG diagram for GCSE Computer Science showing the operating system layer model. Three horizontal layers stacked: bottom = Hardware (CPU, RAM, Storage, peripherals), middle = Operating System (with sub-boxes for Memory Manager, Process Manager, File System, Device Drivers, User Interface), top = User Applications. Show bidirectional arrows between layers. Use yellow for hardware, blue for OS, purple for applications.",
          },
        ],

        tableData: {
          headers: ["Function", "What It Does", "Example"],
          rows: [
            ["Memory Management", "Allocates and deallocates RAM for running programs", "Ensuring two programs don't use the same memory space"],
            ["Process Management", "Manages running programs (multitasking)", "Switching between apps, allocating CPU time"],
            ["File Management", "Organises files into folders, controls access", "Creating, deleting, moving files; file permissions"],
            ["User Interface", "Provides a way for users to interact with the computer", "GUI (windows, icons), CLI (command line)"],
            ["Peripheral Management", "Manages input/output devices using drivers", "Installing printer drivers, recognising USB devices"],
            ["Security", "User accounts, passwords, access control", "Login screens, file permissions, firewall settings"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Saying the OS 'runs programs' — apps run; the OS manages them.",
            correction: "The OS manages and schedules processes — it allocates CPU time to each. The programs themselves run; the OS controls when and how much resource each gets.",
          },
        ],

        workedExample: {
          question: "Describe two functions of an operating system. [4 marks]",
          steps: [
            { step: "Memory Management: the OS allocates areas of RAM to each running program.", explanation: "It ensures programs do not overlap in memory and deallocates space when a program closes." },
            { step: "Process Management: the OS schedules which process gets CPU time and when.", explanation: "By rapidly switching between processes (multitasking), it gives the impression that multiple programs run simultaneously." },
          ],
          answer: "Memory management allocates RAM to programs to prevent conflicts. Process management schedules CPU time, enabling multitasking.",
          markScheme: "For each function: 1 mark for naming it; 1 mark for a correct explanation. Max 4.",
        },

        flashcards: [
          { front: "What is the role of an operating system?", back: "To manage hardware resources, provide a user interface, and offer services to application programs — acting as an intermediary between users, applications, and hardware." },
          { front: "What is virtual memory?", back: "When RAM is full, the OS uses part of secondary storage (disk) as overflow RAM. This allows more programs to run simultaneously, but disk access is much slower than RAM." },
          { front: "What is the difference between a GUI and a CLI?", back: "GUI (Graphical User Interface) uses windows, icons, and a mouse — easier for beginners. CLI (Command Line Interface) uses typed text commands — harder but faster for experienced users/scripts." },
        ],

        examTip: "Know at least 4 OS functions with examples. 'User interface' alone is too vague — specify GUI or CLI.",
      },
      {
        id: "translators",
        title: "Translators: Compilers, Interpreters & Assemblers",
        icon: "🔄",
        specPoint: "OCR J277 1.5b — The need for translators and the differences between compilers, interpreters, and assemblers.",
        content: "Source code written in high-level languages must be translated into machine code for the CPU to execute. There are three types of translator:",

        revisionSummary: [
          "Compiler: translates all source code at once → produces standalone executable, fast to run.",
          "Interpreter: translates and runs one line at a time → stops at first error, easier debugging.",
          "Python uses an interpreter; C uses a compiler.",
        ],

        tableData: {
          headers: ["Translator", "How It Works", "Advantages", "Disadvantages"],
          rows: [
            ["Compiler", "Translates ALL code at once into an executable file", "Fast execution, code can be distributed without source, optimised", "Slow initial compilation, errors shown after full compile"],
            ["Interpreter", "Translates and executes one line at a time", "Easier debugging (stops at error line), no compilation step", "Slower execution, source code must be present to run"],
            ["Assembler", "Translates assembly language to machine code", "One-to-one translation, very efficient output", "Only works with assembly language (low-level)"],
          ],
        },
        comparisonData: {
          itemA: { title: "Compiler", points: ["Translates entire source code at once", "Produces standalone executable (.exe)", "Errors reported after full compilation", "Faster execution of final program", "Source code not needed to run", "Used for: C, C++, Java (partially)"] },
          itemB: { title: "Interpreter", points: ["Translates one line at a time", "No separate executable produced", "Stops immediately when error found", "Slower execution (re-translates each time)", "Source code must be present to run", "Used for: Python, JavaScript, Ruby"] },
        },

        commonMistakes: [
          {
            mistake: "Saying an interpreter is 'better' than a compiler.",
            correction: "Neither is universally better. Interpreters are better for development/debugging (stops at error line). Compilers produce faster programs for deployment. Choose based on context.",
          },
        ],

        flashcards: [
          { front: "What is the difference between a compiler and an interpreter?", back: "Compiler: translates all code at once → produces a standalone executable. Faster to run but errors only shown after full compilation. Interpreter: translates one line at a time, stops at first error. Easier to debug but slower." },
          { front: "Why is an interpreter useful during development?", back: "It stops immediately when it finds an error and shows the exact line — making it much faster to find and fix bugs during writing and testing." },
          { front: "What does an assembler do?", back: "Translates assembly language (low-level, uses mnemonics like MOV, ADD) directly into machine code (binary). One assembly instruction → one machine code instruction." },
        ],
      },
      {
        id: "utility-software",
        title: "Utility Software",
        icon: "🔧",
        specPoint: "OCR J277 1.5c — The role of utility software.",
        content: "Utility software performs maintenance tasks to keep the computer running efficiently. These are usually included with the operating system.",

        revisionSummary: [
          "Utility software = maintenance programs that come with the OS.",
          "Key examples: antivirus, disk defragmenter, backup software, file compression, encryption.",
          "Disk defragmenter only works on HDDs — never run on SSDs (no benefit, causes wear).",
        ],

        tableData: {
          headers: ["Utility", "Purpose", "How It Helps"],
          rows: [
            ["Antivirus", "Detects, quarantines, and removes malware", "Scans files and monitors activity for threats"],
            ["Disk Defragmenter", "Reorganises fragmented files on HDD", "Files stored contiguously = faster access (NOT for SSDs)"],
            ["Backup", "Creates copies of data for recovery", "Protects against data loss from hardware failure or malware"],
            ["File Compression", "Reduces file size", "Faster transfer, saves storage space (ZIP, RAR)"],
            ["Encryption", "Encrypts files/drives to protect data", "Prevents unauthorised access to sensitive data"],
          ],
        },

        flashcards: [
          { front: "Why should disk defragmentation NOT be used on an SSD?", back: "SSDs have no moving parts and access any location equally fast. Defragmenting an SSD provides no speed benefit and causes unnecessary write cycles, shortening SSD lifespan." },
          { front: "What does backup utility software do?", back: "Creates copies of important data stored on a separate medium (different drive or cloud) so it can be restored if the original is lost due to hardware failure, malware, or accidental deletion." },
        ],
      },
      {
        id: "binary-arithmetic",
        title: "Binary Arithmetic",
        icon: "➕",
        specPoint: "OCR J277 1.1a — Binary arithmetic: addition, overflow, and binary shifts.",
        content: "You need to be able to perform several operations with binary numbers.\n\nBinary Addition follows the same rules as denary but in base 2:\n0 + 0 = 0\n0 + 1 = 1\n1 + 0 = 1\n1 + 1 = 10 (carry the 1)\n1 + 1 + 1 = 11 (carry the 1)\n\nIf the result needs more bits than are available, this causes an overflow error.",

        revisionSummary: [
          "Add binary columns right to left: 1+1=10 (write 0, carry 1); 1+1+1=11 (write 1, carry 1).",
          "Overflow: when the result needs more bits than available.",
          "Left shift by 1 = multiply by 2; right shift by 1 = divide by 2.",
        ],

        tableData: {
          headers: ["Operation", "Rule", "Example"],
          rows: [
            ["Binary Addition", "Add columns right-to-left, carry as needed", "0110 + 0011 = 1001 (6 + 3 = 9)"],
            ["Overflow", "When the result exceeds the available bits", "1111 + 0001 = 10000 (needs 5 bits, only 4 available)"],
            ["Left Shift (×2)", "Shift all bits one position left, fill right with 0", "00001010 << 1 = 00010100 (10 × 2 = 20)"],
            ["Right Shift (÷2)", "Shift all bits one position right, fill left with 0", "00001010 >> 1 = 00000101 (10 ÷ 2 = 5)"],
          ],
        },
        keyTerms: [
          { term: "Overflow Error", definition: "Occurs when a calculation produces a result too large to store in the available number of bits" },
          { term: "Binary Shift", definition: "Moving all bits left or right — left shift multiplies by 2, right shift divides by 2" },
          { term: "Most Significant Bit (MSB)", definition: "The leftmost bit in a binary number — has the highest place value" },
          { term: "Least Significant Bit (LSB)", definition: "The rightmost bit in a binary number — has the lowest place value (1)" },
        ],

        workedExample: {
          question: "Add the binary numbers 01101011 and 00110110 and state whether overflow occurs in an 8-bit system. [3 marks]",
          steps: [
            { step: "Write the numbers aligned by column.", explanation: "  01101011\n+ 00110110" },
            { step: "Add from right to left with carries: ...1+1=10, carry 1...", explanation: "  Carry:  1 1 1 1\n  01101011\n+ 00110110\n= 10100001" },
            { step: "Result: 10100001₂ = 161₁₀", explanation: "Verify: 107 + 54 = 161 ✓" },
            { step: "No overflow — result fits in 8 bits (max 11111111 = 255).", explanation: "Overflow would only occur if the result exceeded 255 (needed more than 8 bits)." },
          ],
          answer: "01101011 + 00110110 = 10100001₂ (161₁₀). No overflow occurs (result fits in 8 bits).",
          markScheme: "1 mark: correct binary sum; 1 mark: correct method shown (carry row); 1 mark: correct overflow assessment.",
        },

        flashcards: [
          { front: "What is a binary overflow error?", back: "When the result of a binary addition is too large to fit in the available number of bits. E.g., 1111 + 0001 = 10000, which needs 5 bits — overflow in a 4-bit system." },
          { front: "What does a left binary shift by 2 positions do to a number?", back: "Multiplies the number by 4 (2² = 4). Each left shift multiplies by 2, so two left shifts = ×2 × ×2 = ×4." },
        ],

        examTip: "Always show your carry row when doing binary addition — you get method marks. For shifts, state the multiplication/division factor: shifting left by n positions multiplies by 2ⁿ.",
      },
      {
        id: "compression",
        title: "Compression",
        icon: "📦",
        specPoint: "OCR J277 1.1h — Lossy and lossless compression.",
        content: "Compression reduces file size to save storage space or transmit data faster over a network. There are two types:",

        revisionSummary: [
          "Lossy: permanently removes data → very small files, cannot restore original (JPEG, MP3, MP4).",
          "Lossless: no data lost → original can be restored exactly (ZIP, PNG, FLAC).",
          "Use lossy for media where small quality loss is acceptable; use lossless for text, code, and data.",
        ],

        comparisonData: {
          itemA: { title: "Lossy Compression", points: ["Permanently removes some data to reduce size", "Cannot restore original file after compression", "Produces much smaller files than lossless", "Used for media: images (JPEG), audio (MP3), video (MP4)", "Suitable when small loss in quality is acceptable", "Example: reducing image resolution or audio bit depth"] },
          itemB: { title: "Lossless Compression", points: ["Reduces file size without losing ANY data", "Original file can be perfectly restored", "Files are larger than lossy equivalents", "Used for text, code, spreadsheets, and important data", "Algorithms: Run-Length Encoding (RLE), Huffman Coding", "Example: ZIP files, PNG images"] },
        },
        keyTerms: [
          { term: "Lossy Compression", definition: "Compression that permanently removes some data — smaller files but quality is reduced" },
          { term: "Lossless Compression", definition: "Compression that reduces file size without losing any data — original can be perfectly restored" },
          { term: "Run-Length Encoding", definition: "A lossless algorithm that replaces repeated values with a count and value pair (e.g., AAAA → 4A)" },
          { term: "Huffman Coding", definition: "A lossless algorithm that assigns shorter binary codes to more frequently occurring characters" },
        ],

        commonMistakes: [
          {
            mistake: "Saying lossy compression is always worse than lossless.",
            correction: "For photographs and music, the quality loss in lossy compression is often imperceptible to humans, while file sizes are dramatically smaller. Context determines the best choice.",
          },
        ],

        flashcards: [
          { front: "Why is lossy compression unsuitable for a text file or a program?", back: "Text and executable files cannot afford any data loss — missing characters would make text unreadable and missing bytes would make a program crash." },
          { front: "How does Run-Length Encoding (RLE) work?", back: "RLE replaces consecutive repeated values with a count and value pair. E.g., AAAAAABBB becomes 6A3B — much smaller for images with large areas of the same colour." },
        ],

        examTip: "Common exam question: 'Why would lossy compression be unsuitable for a text file?' — because losing characters/words would make the text meaningless.",
      },
      {
        id: "file-size-calculations",
        title: "Calculating File Sizes",
        icon: "🧮",
        specPoint: "OCR J277 1.1f–g — Calculating file sizes for images and audio.",
        content: "You need to be able to calculate file sizes for different types of data using these formulas:",

        revisionSummary: [
          "Image: width × height (pixels) × colour depth (bits).",
          "Sound: sample rate (Hz) × duration (s) × bit depth × number of channels.",
          "Always convert final answer: ÷8 for bytes, ÷1024 for KB, ÷1024 for MB.",
        ],

        tableData: {
          headers: ["File Type", "Formula", "Example"],
          rows: [
            ["Image", "Width (px) × Height (px) × Colour Depth (bits)", "1920 × 1080 × 24 bits = 49,766,400 bits = 5.93 MB"],
            ["Sound", "Sample Rate (Hz) × Duration (s) × Bit Depth × Channels", "44,100 × 180 × 16 × 2 = 254,016,000 bits = 30.2 MB"],
            ["Text", "Number of characters × Bits per character", "1000 chars × 8 bits (ASCII) = 8000 bits = 1 KB"],
          ],
        },
        keyTerms: [
          { term: "Resolution", definition: "The number of pixels in an image, typically width × height (e.g., 1920×1080)" },
          { term: "Colour Depth", definition: "Number of bits used per pixel to represent colour — 8-bit = 256 colours, 24-bit = 16.7 million" },
          { term: "Sample Rate", definition: "How many times per second an analogue sound wave is sampled (measured in Hz)" },
          { term: "Bit Depth", definition: "Number of bits used to store each sound sample — higher = better quality" },
          { term: "Metadata", definition: "Data about data — for images includes resolution, colour depth, GPS location, device info" },
        ],

        flashcards: [
          { front: "What formula is used to calculate an image's file size?", back: "Width (pixels) × Height (pixels) × Colour Depth (bits). Divide by 8 for bytes, then 1024 for KB, then 1024 for MB." },
          { front: "A 10-second, 44,100 Hz, 16-bit, mono audio clip — what is its uncompressed size in KB?", back: "44,100 × 10 × 16 × 1 = 7,056,000 bits ÷ 8 = 882,000 bytes ÷ 1024 ≈ 861 KB." },
        ],

        examTip: "Always convert your final answer into appropriate units. Remember: 8 bits = 1 byte, 1024 bytes = 1 KB, 1024 KB = 1 MB. Show ALL working!",
      },
    ],
  },

  // ============================================
  // ETHICAL, LEGAL & ENVIRONMENTAL
  // ============================================
  {
    slug: "ethical-legal-environmental",
    title: "Ethical, Legal & Environmental",
    paper: "1",
    ocrRef: "1.6",
    aqaRef: ["3.8"],
    examBoards: ["ocr", "aqa"],
    icon: "⚖️",
    color: "secondary",
    description: "Legislation, ethical issues, and environmental impact of technology.",
    spec_code: "J277",
    spec_version: "2020",
    source_url: "https://www.ocr.org.uk/qualifications/gcse/computer-science-j277-from-2020/",
    last_reviewed_at: "2026-04-14",

    revisionSummary: [
      "Data Protection Act 2018: personal data must be lawfully used, accurate, not kept longer than needed.",
      "Computer Misuse Act 1990: three offences — unauthorised access, access with criminal intent, unauthorised modification.",
      "Social and ethical issues: digital divide, privacy erosion, AI bias, automation job losses.",
      "Environmental negatives: e-waste, data centre energy use, mining for components.",
      "Environmental positives: less paper, video conferencing reduces travel, smart energy management.",
    ],

    sections: [
      {
        id: "legislation",
        title: "Key Legislation",
        icon: "📜",
        specPoint: "OCR J277 1.6a — Legislation relevant to computer science: DPA, CMA, CDPA, FoIA.",
        content: "Several laws regulate how technology is used and how data is handled in the UK:",

        revisionSummary: [
          "DPA 2018: data must be lawfully used, accurate, secure, not kept longer than needed.",
          "CMA 1990: makes hacking, unauthorised access, and data modification illegal.",
          "CDPA 1988: protects software and creative works from copying without permission.",
        ],

        tableData: {
          headers: ["Law", "Year", "What It Covers", "Key Points"],
          rows: [
            ["Data Protection Act", "2018 (GDPR)", "How personal data is collected, stored, and used", "Data must be: used fairly/lawfully, for specified purposes, adequate/relevant, accurate, not kept longer than needed, kept secure"],
            ["Computer Misuse Act", "1990", "Unauthorised access to computer systems", "Three offences: (1) Unauthorised access, (2) Unauthorised access with intent to commit crime, (3) Unauthorised modification of data"],
            ["Copyright, Designs and Patents Act", "1988", "Protection of creative works", "Protects software, music, films, literature from being copied/distributed without permission"],
            ["Freedom of Information Act", "2000", "Right to access information held by public bodies", "Anyone can request information from government/public organisations"],
          ],
        },

        commonMistakes: [
          {
            mistake: "Confusing the Computer Misuse Act with the Data Protection Act.",
            correction: "CMA (1990) covers unauthorised access and hacking. DPA (2018) covers how organisations must handle personal data. They are separate laws with different purposes.",
          },
        ],

        workedExample: {
          question: "Describe two principles of the Data Protection Act 2018. [4 marks]",
          steps: [
            { step: "Personal data must be used fairly and lawfully.", explanation: "Organisations must have a valid legal reason for collecting and processing personal data — e.g., a person's consent." },
            { step: "Personal data must be kept accurate and up to date.", explanation: "Organisations must not store inaccurate data about individuals, and must correct mistakes when reported." },
          ],
          answer: "Data must be used fairly and lawfully (with consent); data must be accurate and kept up to date. Other valid principles: limited to purpose, not kept longer than necessary, kept secure.",
          markScheme: "1 mark per principle identified + 1 mark for correct explanation. Any two correct pairs. Max 4.",
        },

        flashcards: [
          { front: "What are the three offences under the Computer Misuse Act 1990?", back: "1. Unauthorised access to computer material. 2. Unauthorised access with intent to commit a further offence. 3. Unauthorised modification of computer material (e.g., deleting files, planting malware)." },
          { front: "What does the Data Protection Act require organisations to do?", back: "Collect personal data lawfully, only for stated purposes, keep it accurate and secure, not retain it longer than necessary, and give individuals the right to access their own data." },
          { front: "What does the Copyright, Designs and Patents Act protect?", back: "Creative works including software, music, films, books, and code. You cannot copy, distribute or modify these without the owner's permission." },
        ],

        examTip: "You MUST know the name of each act and at least 2 key points about what it covers.",
      },
      {
        id: "ethical-issues",
        title: "Ethical Issues in Computing",
        icon: "🤔",
        specPoint: "OCR J277 1.6b — Ethical, cultural, and environmental impact of technology.",
        content: "Ethical concerns are about whether something is 'right' or 'wrong'. There is no definite answer — having an opinion is valid as long as you can support it with evidence.",

        revisionSummary: [
          "Digital divide: gap between those with technology access and those without.",
          "AI bias: AI systems can reflect prejudices in their training data.",
          "Automation: technology replaces human jobs — both positive (efficiency) and negative (unemployment).",
          "For 'discuss' questions: give BOTH sides with specific examples.",
        ],

        tableData: {
          headers: ["Issue", "Description", "Arguments For", "Arguments Against"],
          rows: [
            ["The Digital Divide", "Some people have access to technology, some don't — due to geography, wealth, or age", "Drives investment in infrastructure and education", "Widens inequality, excludes people from services"],
            ["Privacy", "Right to not be watched — eroded by CCTV, GPS tracking, ISP records, phone tapping", "Helps improve services, catch criminals", "Surveillance concerns, data breaches, loss of anonymity"],
            ["AI & Automation", "Should AI replace human jobs? AI may have embedded biases", "Increased efficiency, reduced human error", "Job losses, bias in decisions, accountability issues"],
            ["Embedded Bias", "AI systems may have unintended prejudices from training data", "AI can be improved with better data", "Facial recognition less accurate for certain ethnic groups"],
            ["Censorship", "Should online content be controlled?", "Protects from harmful content, prevents fake news", "Limits free speech, who decides what's harmful?"],
          ],
        },

        flashcards: [
          { front: "What is the digital divide?", back: "The gap between people who have access to technology and the internet and those who do not, due to wealth, geography, age, or education." },
          { front: "What is AI bias?", back: "When an AI system produces unfair or prejudiced results because its training data contained biases. Example: facial recognition being less accurate for certain ethnic groups." },
          { front: "What are two arguments for and against automation replacing jobs?", back: "For: increased productivity, lower costs, fewer human errors. Against: job losses leading to unemployment, retraining costs, potential increase in inequality." },
        ],
      },
      {
        id: "privacy",
        title: "Privacy Concerns",
        icon: "👁️",
        specPoint: "OCR J277 1.6c — Privacy, surveillance, and the erosion of personal data rights.",
        content: "Privacy is the right that all people have to not be watched. Many people feel this right is being eroded in modern society:",

        revisionSummary: [
          "Technology that erodes privacy: CCTV, ANPR, GPS tracking, ISP records, phone tapping.",
          "Justifications: catching criminals, national security, improving services.",
          "Counter-arguments: chilling effect on behaviour, data breaches, lack of consent.",
        ],

        tableData: {
          headers: ["Technology", "Privacy Concern"],
          rows: [
            ["CCTV cameras", "Found in most town centres, constantly recording people"],
            ["Number plate recognition (ANPR)", "Tracks your car wherever you go"],
            ["Phone GPS", "Can track your movements on foot"],
            ["ISP records", "Your Internet Service Provider can keep records of your browsing"],
            ["Phone tapping", "Police can tap your phone under certain circumstances"],
            ["Social media", "Personal information shared publicly, used for profiling"],
          ],
        },

        flashcards: [
          { front: "Give two technologies that erode personal privacy.", back: "Any two of: CCTV, ANPR (number plate recognition), GPS tracking, ISP browsing records, social media data collection, smart devices (Alexa/Google Home)." },
          { front: "What is an argument FOR mass surveillance technology?", back: "It helps catch criminals, deters crime, can be used to find missing persons, and can improve national security." },
        ],

        examTip: "In 'discuss' questions about privacy, give specific examples of technology AND explain why some people think surveillance is justified (e.g., catching criminals).",
      },
      {
        id: "environmental-impact",
        title: "Environmental Impact of Technology",
        icon: "🌍",
        specPoint: "OCR J277 1.6d — Environmental issues: e-waste, energy consumption, and positive impacts.",
        content: "Technology has both positive and negative environmental impacts:",

        revisionSummary: [
          "E-waste: old devices contain toxic chemicals (lead, mercury) — pollute land and water if not disposed properly.",
          "Data centres: 1–2% of global electricity consumption, mostly powered by fossil fuels.",
          "Positive: less paper, reduced travel, smart energy systems.",
        ],

        comparisonData: {
          itemA: { title: "Negative Impacts", points: ["E-waste: discarded electronics contain noxious chemicals that damage landfills for decades", "Energy consumption: data centres and devices use huge amounts of electricity, burning fossil fuels", "Manufacturing: mining metals needed for computers has huge carbon implications", "Carbon footprint: global production and shipping of devices", "Planned obsolescence: devices designed to be replaced frequently"] },
          itemB: { title: "Positive Impacts", points: ["Emails and digital storage reduce paper usage and letters sent", "Video conferencing reduces the need to travel for meetings", "Remote working reduces commuting and carbon emissions", "Smart technology: sensors and AI can optimise energy usage", "Environmental monitoring: satellites track deforestation and pollution"] },
        },

        commonMistakes: [
          {
            mistake: "Only mentioning negative environmental impacts.",
            correction: "Technology has significant positive environmental impacts too — reduced paper use, less travel, smarter energy management. Always give both sides in 'discuss' questions.",
          },
        ],

        flashcards: [
          { front: "What is e-waste?", back: "Electronic waste — discarded computers, phones, and devices that contain toxic chemicals (lead, mercury, cadmium). Improper disposal contaminates soil and water." },
          { front: "Give two positive environmental impacts of technology.", back: "Any two of: emails reduce paper/mail; video calls reduce transport emissions; smart sensors optimise energy use; remote work cuts commuting; satellites monitor environmental change." },
        ],

        examTip: "In 'discuss' questions (6+ marks), always give BOTH positive and negative impacts with specific examples.",
      },
      {
        id: "software-licenses",
        title: "Software Licenses",
        icon: "📄",
        specPoint: "OCR J277 1.6e — Open source and proprietary software.",
        content: "When you buy software, you are technically buying a licence to use it. There are two main types:",

        revisionSummary: [
          "Proprietary/closed-source: hidden code, paid licence, cannot modify — e.g., Microsoft Office.",
          "Open source: code publicly available, usually free, can modify and redistribute — e.g., Linux, Python.",
          "Open source is not always better — proprietary software often has better support and quality control.",
        ],

        comparisonData: {
          itemA: { title: "Proprietary (Closed Source)", points: ["Source code is hidden — you cannot see or modify it", "You pay for a licence to use the software", "Cannot change, resell, copy, or redistribute it", "Company maintains and updates the software", "Examples: Microsoft Office, Adobe Photoshop"] },
          itemB: { title: "Open Source", points: ["Source code is freely available to view and modify", "Usually free to download and use", "Can edit the code to suit your needs", "Created and maintained by volunteer communities", "Examples: Linux, LibreOffice, Firefox, Python"] },
        },

        commonMistakes: [
          {
            mistake: "Saying open source is 'less secure' because 'anyone can see the code'.",
            correction: "Open source can be MORE secure because the community identifies and patches vulnerabilities quickly. The argument that 'anyone can see the code' also means 'anyone can spot and fix security flaws'.",
          },
        ],

        flashcards: [
          { front: "What is the key difference between open source and proprietary software?", back: "Open source: source code is publicly available, free to modify. Proprietary: source code is hidden, requires a paid licence, cannot be modified." },
          { front: "Give one advantage of open source software for a developer.", back: "They can read and modify the source code to customise it for their specific needs, without paying licensing fees." },
          { front: "Give one advantage of proprietary software over open source.", back: "Paid proprietary software usually comes with professional technical support, guaranteed updates, and quality assurance testing." },
        ],

        examTip: "Know at least 2 advantages and 2 disadvantages of each licence type for comparison questions.",
      },
    ],
  },
];
