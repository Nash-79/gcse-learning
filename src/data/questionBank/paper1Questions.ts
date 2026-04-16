import { ExamQuestion } from "./types";

export const paper1Questions: ExamQuestion[] = [
  // === Systems Architecture ===
  {
    id: "p1-sa-001", question: "State what is meant by the term 'CPU' (Central Processing Unit).", marks: 2, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "short",
    correctAnswer: "The CPU is the main processing unit of a computer that carries out instructions from programs by performing basic arithmetic, logic, control, and input/output operations.",
    modelAnswer: "The CPU is the electronic circuitry (1) that executes instructions making up a computer program (1).",
    markScheme: ["The main processing unit/chip of a computer (1)", "Executes/carries out instructions from programs (1)"],
  },
  {
    id: "p1-sa-002", question: "Describe the purpose of the ALU (Arithmetic Logic Unit) within the CPU.", marks: 2, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "explain",
    correctAnswer: "The ALU performs all arithmetic calculations (addition, subtraction, etc.) and logical comparisons (AND, OR, NOT) within the CPU.",
    modelAnswer: "The ALU performs arithmetic calculations such as addition and subtraction (1) and logical operations/comparisons such as AND, OR, NOT (1).",
    markScheme: ["Performs arithmetic calculations (e.g., addition, subtraction) (1)", "Performs logical comparisons/operations (e.g., AND, OR, NOT) (1)"],
  },
  {
    id: "p1-sa-003", question: "Explain how the fetch-decode-execute cycle works.", marks: 3, difficulty: "mixed", topic: "Systems Architecture", paper: "1", type: "explain",
    correctAnswer: "The CPU fetches the next instruction from memory using the address in the program counter. The instruction is then decoded by the control unit to determine what action is needed. Finally, the instruction is executed, which may involve the ALU performing a calculation.",
    modelAnswer: "The program counter holds the address of the next instruction. The instruction is fetched from RAM and placed in the MAR/MDR (1). The control unit decodes the instruction to determine the operation (1). The instruction is then executed, which may involve the ALU (1).",
    markScheme: ["Fetch: instruction retrieved from memory using address in PC (1)", "Decode: control unit interprets/decodes the instruction (1)", "Execute: instruction is carried out, possibly using ALU (1)"],
  },
  {
    id: "p1-sa-004", question: "Which of the following is NOT a component of the CPU?", marks: 1, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "multiple-choice",
    options: ["ALU", "Control Unit", "RAM", "Cache"],
    correctAnswer: "RAM",
    modelAnswer: "RAM is not a component of the CPU — it is the main memory of the computer, separate from the processor.",
    markScheme: ["RAM (1) — RAM is main memory, not part of the CPU"],
  },
  {
    id: "p1-sa-005", question: "Explain the difference between RAM and ROM.", marks: 4, difficulty: "mixed", topic: "Systems Architecture", paper: "1", type: "explain",
    correctAnswer: "RAM is volatile (loses data when power is off), can be read and written to, and stores currently running programs. ROM is non-volatile (retains data without power), is read-only, and stores the BIOS/bootstrap program.",
    modelAnswer: "RAM is volatile (1) meaning data is lost when power is turned off. ROM is non-volatile (1) meaning data is retained without power. RAM can be read from and written to (1) while ROM can only be read from (1).",
    markScheme: ["RAM is volatile / ROM is non-volatile (1)", "RAM loses data when powered off / ROM retains data (1)", "RAM is read-write / ROM is read-only (1)", "RAM stores running programs / ROM stores BIOS/boot instructions (1)"],
  },
  {
    id: "p1-sa-006", question: "State two factors that affect the performance of the CPU.", marks: 2, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "short",
    correctAnswer: "Clock speed and number of cores.",
    modelAnswer: "Clock speed (1) and number of cores (1). Other acceptable answers: cache size.",
    markScheme: ["Clock speed (1)", "Number of cores (1)", "Cache size (1) — any two"],
  },
  {
    id: "p1-sa-007", question: "Explain why increasing the clock speed of a CPU does not always improve performance.", marks: 3, difficulty: "challenge", topic: "Systems Architecture", paper: "1", type: "explain",
    correctAnswer: "Increasing clock speed generates more heat which may require throttling. Programs may be limited by other bottlenecks like memory speed or I/O operations. Some tasks cannot be parallelised so faster processing of single instructions has diminishing returns.",
    modelAnswer: "Higher clock speed generates more heat (1) which can cause the CPU to throttle/slow down to prevent damage (1). Performance may be limited by other components such as RAM speed or hard drive access times (1).",
    markScheme: ["More heat generated (1)", "May cause throttling/overheating (1)", "Bottlenecked by other components like RAM or storage (1)"],
  },
  {
    id: "p1-sa-008", question: "Describe the role of the control unit in the CPU.", marks: 2, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "explain",
    correctAnswer: "The control unit manages and coordinates the operations of the CPU. It decodes instructions, controls the timing of operations, and directs the flow of data between the CPU, memory, and I/O devices.",
    modelAnswer: "The control unit decodes instructions (1) and controls/coordinates the flow of data within the CPU and between other components (1).",
    markScheme: ["Decodes instructions (1)", "Controls/coordinates data flow between components (1)"],
  },

  // === Memory & Storage ===
  {
    id: "p1-ms-001", question: "State what is meant by 'volatile' memory.", marks: 1, difficulty: "foundation", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "Volatile memory loses its contents when the power is turned off.",
    modelAnswer: "Memory that loses its data/contents when the power supply is removed/turned off (1).",
    markScheme: ["Memory that loses data when power is off (1)"],
  },
  {
    id: "p1-ms-002", question: "Compare magnetic, optical and solid-state storage. Give one advantage of each.", marks: 3, difficulty: "mixed", topic: "Memory & Storage", paper: "1", type: "explain",
    correctAnswer: "Magnetic (HDD): high capacity for low cost. Optical (CD/DVD): portable and cheap to produce. Solid-state (SSD): fast access speeds and no moving parts.",
    modelAnswer: "Magnetic: large storage capacity at low cost per GB (1). Optical: portable, cheap to manufacture, good for distribution (1). Solid-state: very fast read/write speeds, durable with no moving parts (1).",
    markScheme: ["Magnetic: high capacity / low cost (1)", "Optical: portable / cheap to produce / good for distribution (1)", "Solid-state: fast access / no moving parts / durable (1)"],
  },
  {
    id: "p1-ms-003", question: "Calculate how many bits are in 4 kilobytes.", marks: 2, difficulty: "foundation", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "32,768 bits. 4 KB = 4 × 1024 bytes = 4096 bytes. 4096 × 8 = 32,768 bits.",
    modelAnswer: "4 × 1024 = 4096 bytes (1). 4096 × 8 = 32,768 bits (1).",
    markScheme: ["4 × 1024 = 4096 bytes (1)", "4096 × 8 = 32,768 bits (1)"],
  },
  {
    id: "p1-ms-004", question: "Explain why a computer needs both RAM and secondary storage.", marks: 4, difficulty: "mixed", topic: "Memory & Storage", paper: "1", type: "explain",
    correctAnswer: "RAM is needed to store data and instructions currently being used by the CPU for fast access. However, RAM is volatile so data is lost when powered off. Secondary storage is needed to permanently store data, programs, and the operating system so they persist between sessions.",
    modelAnswer: "RAM provides fast access to data currently being processed (1). The CPU cannot access secondary storage directly (1). RAM is volatile so cannot store data permanently (1). Secondary storage is non-volatile and retains data when powered off (1).",
    markScheme: ["RAM provides fast access for currently running programs (1)", "CPU cannot directly access secondary storage (1)", "RAM is volatile (1)", "Secondary storage is non-volatile / stores data permanently (1)"],
  },
  {
    id: "p1-ms-005", question: "Convert the denary number 156 to binary.", marks: 2, difficulty: "foundation", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "10011100",
    modelAnswer: "128 + 16 + 8 + 4 = 156. Binary: 10011100 (2).",
    markScheme: ["Correct binary: 10011100 (2)", "Allow 1 mark for working with one error"],
  },
  {
    id: "p1-ms-006", question: "Convert the hexadecimal number 2F to denary.", marks: 2, difficulty: "mixed", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "47. 2 × 16 = 32, F = 15. 32 + 15 = 47.",
    modelAnswer: "2 × 16 = 32 (1). F = 15. 32 + 15 = 47 (1).",
    markScheme: ["2 × 16 = 32 (1)", "32 + 15 = 47 (1)"],
  },

  // === Computer Networks ===
  {
    id: "p1-cn-001", question: "State two advantages of a star network topology over a bus topology.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "If one cable fails, only that device is affected (not the whole network). Better performance as data doesn't have to travel along a shared backbone.",
    modelAnswer: "If one cable fails, other stations are not affected (1). Better performance / less data collisions as each device has its own connection (1).",
    markScheme: ["Failure of one cable doesn't affect other devices (1)", "Better performance / fewer collisions / each device has dedicated connection (1)"],
  },
  {
    id: "p1-cn-002", question: "Explain what a protocol is and why protocols are needed in computer networks.", marks: 3, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "A protocol is a set of rules that govern how data is transmitted across a network. Protocols are needed so that different devices and software can communicate with each other in a standardised way, ensuring data is sent, received, and interpreted correctly.",
    modelAnswer: "A protocol is a set of rules for data transmission (1). Protocols ensure devices from different manufacturers can communicate (1). They standardise how data is formatted, transmitted and received (1).",
    markScheme: ["Set of rules for communication/data transmission (1)", "Enables different devices/systems to communicate (1)", "Standardises data format/transmission/error checking (1)"],
  },
  {
    id: "p1-cn-003", question: "Which protocol is used to send emails?", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "multiple-choice",
    options: ["HTTP", "FTP", "SMTP", "TCP"],
    correctAnswer: "SMTP",
    modelAnswer: "SMTP (Simple Mail Transfer Protocol) is used for sending emails.",
    markScheme: ["SMTP (1)"],
  },
  {
    id: "p1-cn-004", question: "Describe the difference between a LAN and a WAN.", marks: 4, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "A LAN covers a small geographical area like a building. A WAN covers a large geographical area, potentially worldwide. LANs use privately owned infrastructure. WANs use third-party telecommunications infrastructure.",
    modelAnswer: "A LAN covers a small geographical area such as a building or campus (1). A WAN covers a large geographical area, possibly worldwide (1). LAN infrastructure is owned by the organisation (1). WAN infrastructure is owned by third parties/telecommunications companies (1).",
    markScheme: ["LAN: small area (building/campus) (1)", "WAN: large area (country/worldwide) (1)", "LAN: privately owned hardware (1)", "WAN: third-party/rented infrastructure (1)"],
  },

  // === Network Security ===
  {
    id: "p1-ns-001", question: "Describe what is meant by 'phishing'.", marks: 2, difficulty: "foundation", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Phishing is a social engineering attack where criminals send fraudulent emails or messages that appear to be from a legitimate source, attempting to trick the user into revealing personal information such as passwords or bank details.",
    modelAnswer: "A fraudulent attempt to obtain sensitive information (1) by disguising as a trustworthy entity via email or other communication (1).",
    markScheme: ["Attempt to obtain sensitive/personal information (1)", "By pretending to be a legitimate/trustworthy source (1)"],
  },
  {
    id: "p1-ns-002", question: "Explain two methods an organisation can use to protect against network attacks.", marks: 4, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Firewalls monitor incoming and outgoing network traffic and block unauthorised access. Encryption scrambles data so that if intercepted, it cannot be read without the decryption key.",
    modelAnswer: "Firewall: monitors and filters network traffic (1) blocking unauthorised access to the network (1). Encryption: scrambles/encodes data (1) so intercepted data cannot be read without the key (1).",
    markScheme: ["Firewall: monitors/filters traffic (1)", "Firewall: blocks unauthorised access (1)", "Encryption: encodes/scrambles data (1)", "Encryption: unreadable without decryption key (1)"],
  },
  {
    id: "p1-ns-003", question: "Explain what SQL injection is.", marks: 3, difficulty: "challenge", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "SQL injection is a technique where malicious SQL code is inserted into input fields of a web application. This exploits vulnerabilities in the application to manipulate the database, potentially accessing, modifying, or deleting data.",
    modelAnswer: "Malicious SQL code is entered into input fields / forms (1). This exploits vulnerabilities in a web application (1). It can allow unauthorised access to / manipulation of the database (1).",
    markScheme: ["SQL code inserted into input fields (1)", "Exploits application vulnerabilities (1)", "Can access/modify/delete database data (1)"],
  },

  // === Systems Software ===
  {
    id: "p1-ss-001", question: "State three functions of an operating system.", marks: 3, difficulty: "foundation", topic: "Systems Software", paper: "1", type: "short",
    correctAnswer: "Memory management, process management (multitasking), and user interface provision.",
    modelAnswer: "Memory management (1). Process/task management (multitasking) (1). Providing a user interface (1).",
    markScheme: ["Memory management (1)", "Process management/multitasking (1)", "User interface (1)", "File management (1)", "Peripheral/device management (1) — any three"],
  },
  {
    id: "p1-ss-002", question: "Explain the difference between a compiler and an interpreter.", marks: 4, difficulty: "mixed", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "A compiler translates the entire source code into machine code at once before execution, producing an executable file. An interpreter translates and executes the code one line at a time, without producing a separate executable file.",
    modelAnswer: "A compiler translates all the source code at once (1) and produces an executable/object file (1). An interpreter translates one line/instruction at a time (1) and executes it immediately without producing a separate file (1).",
    markScheme: ["Compiler: translates entire code at once (1)", "Compiler: produces executable file (1)", "Interpreter: translates one line at a time (1)", "Interpreter: executes immediately / no separate file (1)"],
  },
  {
    id: "p1-ss-003", question: "Give two advantages of using an interpreter over a compiler during program development.", marks: 2, difficulty: "foundation", topic: "Systems Software", paper: "1", type: "short",
    correctAnswer: "Interpreter stops at the first error, making it easier to find bugs. No separate compilation step is needed before running the code.",
    modelAnswer: "Stops immediately when it finds an error, making it easier to identify which line has the bug (1). No compilation step is needed — code can be tested immediately as it is written (1).",
    markScheme: ["Stops at first error / easier to debug (1)", "No compilation step needed / run immediately (1)"],
  },
  {
    id: "p1-ss-004", question: "Describe what utility software is and give two examples.", marks: 3, difficulty: "foundation", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "Utility software performs maintenance tasks to keep the computer running efficiently. Examples include antivirus software and disk defragmentation software.",
    modelAnswer: "Software that performs maintenance/housekeeping tasks to keep the computer running efficiently (1). Example 1: antivirus — detects and removes malware (1). Example 2: disk defragmenter — reorganises fragmented files on a HDD for faster access (1).",
    markScheme: ["Utility software: performs maintenance/housekeeping tasks (1)", "Valid example 1 with description (1)", "Valid example 2 with description (1) — antivirus, defragmenter, backup, compression, encryption all valid"],
  },
  {
    id: "p1-ss-005", question: "Explain why disk defragmentation software should NOT be used on a solid state drive (SSD).", marks: 2, difficulty: "mixed", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "SSDs have no moving parts and access all locations equally fast, so defragmentation provides no performance benefit. Running it also causes unnecessary write cycles, shortening the SSD's lifespan.",
    modelAnswer: "SSDs have no moving parts / access all locations equally fast (1), so there is no performance benefit from defragmenting. Running defragmentation causes unnecessary read/write cycles which reduces the SSD's lifespan (1).",
    markScheme: ["No benefit as SSDs access data equally fast / no seek time (1)", "Causes unnecessary write cycles / reduces SSD lifespan (1)"],
  },
  {
    id: "p1-ss-006", question: "State two differences between lossy and lossless compression.", marks: 4, difficulty: "mixed", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "Lossy compression permanently removes some data, so the original cannot be recovered. Lossless compression reduces file size without losing any data, allowing the original to be perfectly restored.",
    modelAnswer: "Lossy: data is permanently removed / cannot recover original file (1). Lossless: no data is lost / original can be perfectly restored (1). Lossy produces smaller files (1). Lossless is suitable for text/data files where accuracy is essential (1).",
    markScheme: ["Lossy: data permanently removed (1)", "Lossless: no data lost / original recoverable (1)", "Lossy produces smaller files (1)", "Lossless used for text/code/data (1) — any two clear differences for 4 marks"],
  },
  {
    id: "p1-ss-007", question: "A 24-bit colour image has a resolution of 1200 × 900 pixels. Calculate the file size in megabytes (MB). Show your working.", marks: 4, difficulty: "challenge", topic: "Systems Software", paper: "1", type: "short",
    correctAnswer: "File size = 1200 × 900 × 24 = 25,920,000 bits. ÷ 8 = 3,240,000 bytes. ÷ 1024 = 3164 KB. ÷ 1024 ≈ 3.09 MB.",
    modelAnswer: "1200 × 900 × 24 = 25,920,000 bits (1). ÷ 8 = 3,240,000 bytes (1). ÷ 1024 = 3164 KB (1). ÷ 1024 ≈ 3.09 MB (1).",
    markScheme: ["Correct multiplication of width × height × colour depth (1)", "Correct conversion to bytes ÷8 (1)", "Correct conversion to KB ÷1024 (1)", "Correct final MB answer (accept 3.09–3.10 MB) (1)"],
  },
  {
    id: "p1-ss-008", question: "Explain the purpose of virtual memory.", marks: 3, difficulty: "mixed", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "Virtual memory uses part of the secondary storage (hard drive or SSD) as an extension of RAM. When RAM is full, the operating system moves some data to the disk temporarily, allowing more programs to run than the RAM would otherwise support.",
    modelAnswer: "Virtual memory uses secondary storage (HDD/SSD) as if it were RAM (1). Used when RAM is full / insufficient for all running programs (1). Allows more programs to run simultaneously / system to continue functioning (1).",
    markScheme: ["Uses secondary storage as an extension of RAM (1)", "Used when RAM is full (1)", "Allows more programs to run simultaneously (1)"],
  },
  {
    id: "p1-ss-009", question: "Explain the difference between a GUI (Graphical User Interface) and a CLI (Command Line Interface). State one advantage of each.", marks: 4, difficulty: "mixed", topic: "Systems Software", paper: "1", type: "explain",
    correctAnswer: "A GUI uses windows, icons, and a mouse for interaction — easier for non-technical users. A CLI requires text commands to be typed — harder to learn but more powerful and efficient for experienced users and scripting.",
    modelAnswer: "GUI: uses graphical elements such as windows, icons, menus and a pointer/mouse (1). CLI: text-based interface where the user types commands (1). GUI advantage: easier for non-technical users to use (1). CLI advantage: more efficient for experienced users / can be used for scripting/automation (1).",
    markScheme: ["GUI description (1)", "CLI description (1)", "GUI advantage (1)", "CLI advantage (1)"],
  },
  {
    id: "p1-ss-010", question: "What is an assembler and what type of language does it translate?", marks: 2, difficulty: "foundation", topic: "Systems Software", paper: "1", type: "short",
    correctAnswer: "An assembler translates assembly language (a low-level language using mnemonics like MOV and ADD) into machine code that the CPU can execute directly.",
    modelAnswer: "An assembler translates assembly language (1) into machine code / binary (1).",
    markScheme: ["Translates assembly language (1)", "Into machine code / binary instructions (1)"],
  },

  // === Ethical, Legal & Environmental ===
  {
    id: "p1-el-001", question: "State the purpose of the Data Protection Act.", marks: 2, difficulty: "foundation", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "The Data Protection Act controls how personal information is used by organisations, businesses, or the government. It ensures personal data is used fairly, lawfully, and transparently.",
    modelAnswer: "To protect individuals' personal data (1) by controlling how it is collected, stored and used by organisations (1).",
    markScheme: ["Protects personal data/information (1)", "Controls how organisations collect/store/use data (1)"],
  },
  {
    id: "p1-el-002", question: "Discuss the environmental impact of technology. Include both positive and negative impacts.", marks: 6, difficulty: "challenge", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Negative: E-waste from discarded devices pollutes landfills. Energy consumption of data centres contributes to carbon emissions. Mining rare earth metals causes habitat destruction. Positive: Smart technology can reduce energy usage. Remote working reduces commuting. Digital documents reduce paper waste.",
    modelAnswer: "Negative: E-waste/discarded devices cause pollution (1). Data centres consume large amounts of energy (1). Manufacturing requires mining of rare earth metals/resources (1). Positive: Smart systems can monitor and reduce energy use (1). Remote working/video conferencing reduces travel/emissions (1). Digital communication reduces paper waste (1).",
    markScheme: ["E-waste / disposal issues (1)", "Energy consumption of data centres (1)", "Mining/resource extraction (1)", "Smart technology reduces energy use (1)", "Remote working reduces travel (1)", "Reduced paper usage (1)"],
  },
  {
    id: "p1-el-003", question: "Explain why the Computer Misuse Act was introduced.", marks: 2, difficulty: "foundation", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "The Computer Misuse Act was introduced to criminalise unauthorised access to computer systems (hacking), unauthorised modification of data, and creating/distributing malware.",
    modelAnswer: "To make it illegal to gain unauthorised access to computer systems (1) and to prevent unauthorised modification of computer material/data (1).",
    markScheme: ["Criminalise unauthorised access to computer systems (1)", "Prevent unauthorised modification of data / creating malware (1)"],
  },

  // Additional foundation questions for Five-A-Day
  {
    id: "p1-fad-001", question: "What does 'SSD' stand for?", marks: 1, difficulty: "foundation", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "Solid State Drive",
    modelAnswer: "Solid State Drive (1).",
    markScheme: ["Solid State Drive (1)"],
  },
  {
    id: "p1-fad-002", question: "What type of network covers a small geographical area?", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "multiple-choice",
    options: ["WAN", "LAN", "MAN", "PAN"],
    correctAnswer: "LAN",
    modelAnswer: "LAN (Local Area Network) covers a small geographical area like a building.",
    markScheme: ["LAN (1)"],
  },
  {
    id: "p1-fad-003", question: "State one purpose of cache memory.", marks: 1, difficulty: "foundation", topic: "Systems Architecture", paper: "1", type: "short",
    correctAnswer: "To store frequently accessed data/instructions so the CPU can access them faster than from RAM.",
    modelAnswer: "To store frequently used data/instructions for faster access by the CPU (1).",
    markScheme: ["Stores frequently accessed data for faster CPU access (1)"],
  },
  {
    id: "p1-fad-004", question: "What is malware?", marks: 1, difficulty: "foundation", topic: "Network Security", paper: "1", type: "short",
    correctAnswer: "Malicious software designed to damage, disrupt, or gain unauthorised access to a computer system.",
    modelAnswer: "Software designed to cause damage or gain unauthorised access to a system (1).",
    markScheme: ["Malicious/harmful software (1)"],
  },
  {
    id: "p1-fad-005", question: "Give one example of utility software.", marks: 1, difficulty: "foundation", topic: "Systems Software", paper: "1", type: "short",
    correctAnswer: "Antivirus software, disk defragmenter, backup software, or file compression.",
    modelAnswer: "Antivirus / disk defragmenter / backup utility / compression (1).",
    markScheme: ["Any valid utility software example (1)"],
  },
  {
    id: "p1-fad-006", question: "What is the purpose of a MAC address?", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "A MAC address uniquely identifies a network interface card (NIC) / device on a network.",
    modelAnswer: "To uniquely identify a device/NIC on a network (1).",
    markScheme: ["Unique identifier for a device/NIC on a network (1)"],
  },
  {
    id: "p1-fad-007", question: "Convert the binary number 11010110 to denary.", marks: 2, difficulty: "foundation", topic: "Memory & Storage", paper: "1", type: "short",
    correctAnswer: "214. 128+64+16+4+2 = 214",
    modelAnswer: "128 + 64 + 16 + 4 + 2 = 214 (2).",
    markScheme: ["Correct answer: 214 (2)", "1 mark for working with one error"],
  },
  {
    id: "p1-fad-008", question: "What does HTTP stand for?", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "HyperText Transfer Protocol",
    modelAnswer: "HyperText Transfer Protocol (1).",
    markScheme: ["HyperText Transfer Protocol (1)"],
  },
  {
    id: "p1-fad-009", question: "Name the three types of bus in a computer system.", marks: 3, difficulty: "mixed", topic: "Systems Architecture", paper: "1", type: "short",
    correctAnswer: "Address bus, data bus, and control bus.",
    modelAnswer: "Address bus (1), data bus (1), control bus (1).",
    markScheme: ["Address bus (1)", "Data bus (1)", "Control bus (1)"],
  },
  {
    id: "p1-fad-010", question: "What legislation protects creative works such as music, films and software?", marks: 1, difficulty: "foundation", topic: "Ethical, Legal & Environmental", paper: "1", type: "short",
    correctAnswer: "Copyright, Designs and Patents Act (1988)",
    modelAnswer: "Copyright, Designs and Patents Act (1).",
    markScheme: ["Copyright, Designs and Patents Act / Copyright Act (1)"],
  },

  // ============================================
  // ENRICHED: Computer Networks (1.3)
  // ============================================
  {
    id: "p1-cn-010", question: "Describe the role of a router in a network.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "A router connects two or more networks together and directs data packets between them using IP addresses.",
    modelAnswer: "A router sends and receives data packets between different networks (1) by identifying the most efficient path using IP addresses (1).",
    markScheme: ["Connects/directs data between networks (1)", "Uses IP addresses to route data packets (1)"],
  },
  {
    id: "p1-cn-011", question: "Describe the role of a switch in a LAN.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "A switch forwards data packets to the correct device within a LAN by using MAC addresses stored in its table.",
    modelAnswer: "A switch stores the MAC addresses of devices on the LAN (1) and forwards data packets to the correct destination device (1).",
    markScheme: ["Stores MAC addresses of connected devices (1)", "Forwards packets to correct device (1)"],
  },
  {
    id: "p1-cn-012", question: "Explain the difference between an IP address and a MAC address.", marks: 4, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "An IP address is assigned by a router and can change. It identifies a device on a network for routing purposes. A MAC address is hard-coded into the NIC by the manufacturer and never changes. It uniquely identifies the physical hardware.",
    modelAnswer: "An IP address is assigned by a router (1) and can change each time a device connects (1). A MAC address is permanently assigned by the manufacturer (1) and is unique to each network interface card (NIC) (1).",
    markScheme: ["IP address assigned by router / can change (1)", "IP used for routing between networks (1)", "MAC address hard-coded by manufacturer / permanent (1)", "MAC address unique to hardware / NIC (1)"],
  },
  {
    id: "p1-cn-013", question: "State the purpose of a Network Interface Card (NIC).", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "A NIC allows a computer to connect to a network. It has a unique MAC address and provides the physical circuitry for communication.",
    modelAnswer: "Allows a device to connect to a network (1) and has a unique MAC address for identification (1).",
    markScheme: ["Enables connection to a network (1)", "Contains unique MAC address (1)"],
  },
  {
    id: "p1-cn-014", question: "A company is choosing between a star topology and a mesh topology for its new office network. Compare the two topologies.", marks: 6, difficulty: "challenge", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "Star: all devices connect to a central switch, easy to add devices, if one cable fails only that device loses connection, but if the switch fails the whole network goes down, less cabling needed. Mesh: every device connects to every other device, very reliable as multiple paths exist, if one connection fails data reroutes, but requires much more cabling and is expensive to set up.",
    modelAnswer: "Star: all devices connect to a central switch (1). If one cable fails, only that device is affected (1). If the central switch fails, the whole network goes down (1). Mesh: every device connects to every other device (1). Very reliable — if one connection fails, data can be rerouted (1). Much more cabling and equipment needed, making it more expensive (1).",
    markScheme: ["Star: central switch/hub connection (1)", "Star: single cable failure only affects one device (1)", "Star: central switch failure = whole network down (1)", "Mesh: every device connected to every other (1)", "Mesh: reliable / multiple paths / data reroutes (1)", "Mesh: expensive / lots of cabling (1)"],
  },
  {
    id: "p1-cn-015", question: "State two factors that affect the performance of a network.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "Number of users on the network and bandwidth available.",
    modelAnswer: "Number of users — more users means more data collisions and latency (1). Bandwidth — the maximum amount of data that can be transferred per second (1).",
    markScheme: ["Number of users (1)", "Bandwidth (1)", "Also accept: type of connection (wired/wireless), hardware quality, network traffic"],
  },
  {
    id: "p1-cn-016", question: "Compare a client-server network with a peer-to-peer network.", marks: 4, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "Client-server has a central server that manages files and security, making it more secure and easier to back up, but requires specialist equipment and staff. Peer-to-peer has no central server, all computers are equal, it's cheaper and easier to set up, but less secure and harder to manage files.",
    modelAnswer: "Client-server: has a dedicated server that manages data and security (1), files are stored centrally making backups easier (1). Peer-to-peer: no central server, all computers are equal importance (1), easier and cheaper to set up but less secure (1).",
    markScheme: ["Client-server: dedicated server manages data/security (1)", "Client-server: centralised files/backups (1)", "Peer-to-peer: no server / equal computers (1)", "Peer-to-peer: cheaper/easier but less secure (1)"],
  },
  {
    id: "p1-cn-017", question: "Explain how the Domain Name System (DNS) works when a user types a URL into their browser.", marks: 4, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "The user types a URL. The browser sends a request to a DNS server. The DNS server looks up the domain name in its database and returns the corresponding IP address. The browser then uses this IP address to connect to the web server and load the page.",
    modelAnswer: "The user types a URL (e.g., www.bbc.co.uk) into the browser (1). The browser sends the domain name to a DNS server (1). The DNS server looks up the domain and returns the corresponding IP address (1). The browser uses the IP address to connect to the correct web server (1).",
    markScheme: ["URL entered into browser (1)", "Request sent to DNS server (1)", "DNS looks up domain → returns IP address (1)", "Browser connects to web server using IP address (1)"],
  },
  {
    id: "p1-cn-018", question: "Which of the following is used to send emails?", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "multiple-choice",
    options: ["IMAP", "SMTP", "FTP", "HTTP"],
    correctAnswer: "SMTP",
    modelAnswer: "SMTP (Simple Mail Transfer Protocol) is the protocol used for sending emails.",
    markScheme: ["SMTP (1)"],
  },
  {
    id: "p1-cn-019", question: "Explain the difference between HTTP and HTTPS.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "HTTP transfers web page data in plain text. HTTPS encrypts the data using SSL/TLS, making it secure so intercepted data cannot be read.",
    modelAnswer: "HTTP sends data in plain text / unencrypted (1). HTTPS encrypts the data using SSL/TLS so it cannot be read if intercepted (1).",
    markScheme: ["HTTP: data sent unencrypted / plain text (1)", "HTTPS: data is encrypted / secure (1)"],
  },
  {
    id: "p1-cn-020", question: "Explain why network protocols are organised into layers.", marks: 3, difficulty: "challenge", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "Layers allow each protocol to be self-contained with its own purpose. One layer can be changed without affecting others. Individual protocols are simpler to manage. Different layers can interface with different hardware.",
    modelAnswer: "Each layer is self-contained and has its own specific function (1). A layer can be modified or replaced without affecting the other layers (1). It makes each protocol smaller and simpler to develop and debug (1).",
    markScheme: ["Each layer has specific/independent purpose (1)", "One layer can change without affecting others (1)", "Simpler to develop/manage/debug (1)"],
  },
  {
    id: "p1-cn-021", question: "Explain the difference between IPv4 and IPv6 addresses.", marks: 3, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "IPv4 uses four numbers between 0 and 255 separated by dots (e.g., 192.168.1.1). IPv6 uses 8 groups of hexadecimal numbers (e.g., 2001:0db8:85a3::7334). IPv6 was introduced because IPv4 doesn't have enough addresses for all modern devices.",
    modelAnswer: "IPv4 uses 4 denary numbers between 0-255 separated by dots (1). IPv6 uses 8 hexadecimal groups providing far more possible addresses (1). IPv6 was needed because the number of internet-connected devices exceeded IPv4's capacity (1).",
    markScheme: ["IPv4: 4 numbers 0-255, dotted format (1)", "IPv6: 8 hexadecimal groups (1)", "IPv6 needed due to address exhaustion (1)"],
  },
  {
    id: "p1-cn-022", question: "State the purpose of a Wireless Access Point (WAP).", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "A WAP allows wireless devices to connect to a wired network. It bridges the wired and wireless parts of the network.",
    modelAnswer: "Allows wireless devices to connect to a network (1). Bridges a wired and wireless network (1).",
    markScheme: ["Enables wireless connection to network (1)", "Bridges wired and wireless networks (1)"],
  },
  {
    id: "p1-cn-023", question: "Explain how encryption protects data transmitted across a network.", marks: 3, difficulty: "mixed", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "Encryption scrambles data using an algorithm so that it becomes unreadable ciphertext. If the data is intercepted during transmission, it cannot be understood without the correct decryption key. Only the intended recipient with the key can unscramble and read the data.",
    modelAnswer: "Encryption scrambles/encodes the data using an algorithm (1). If intercepted, the data cannot be read as it appears as random/incomprehensible text (1). Only someone with the correct decryption key can unscramble and read the data (1).",
    markScheme: ["Data is scrambled/encoded (1)", "Intercepted data cannot be read/understood (1)", "Requires decryption key to unscramble (1)"],
  },
  {
    id: "p1-cn-024", question: "A school uses a client-server network. The file server has failed. Explain two effects this would have on the school network.", marks: 4, difficulty: "challenge", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "Students and staff would not be able to access their files stored on the server. Shared applications installed on the server would not be available. Centralised backup would stop working. User authentication may not work if managed by the server.",
    modelAnswer: "Users would not be able to access files stored centrally on the server (1) meaning they cannot open or save their work (1). Shared software hosted on the server would not be available (1) so users could not run applications they need (1).",
    markScheme: ["Cannot access centrally stored files (1)", "Impact on users' work (1)", "Shared applications unavailable (1)", "Impact on productivity/operations (1)"],
  },
  {
    id: "p1-cn-025", question: "State what is meant by 'bandwidth' in the context of computer networks.", marks: 1, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "short",
    correctAnswer: "The maximum amount of data that can be transferred across a network in a given time period, usually measured in bits per second.",
    modelAnswer: "The maximum amount of data that can be transmitted per second across a network (1).",
    markScheme: ["Maximum data transfer rate per second (1)"],
  },
  {
    id: "p1-cn-026", question: "Describe the role of a modem in a network.", marks: 2, difficulty: "foundation", topic: "Computer Networks", paper: "1", type: "explain",
    correctAnswer: "A modem converts digital data from a computer into analogue signals that can be sent over phone lines, and converts analogue signals back to digital data when receiving.",
    modelAnswer: "Converts digital data into analogue signals for transmission over phone lines (1). Converts received analogue signals back into digital data (1).",
    markScheme: ["Converts digital to analogue (modulation) (1)", "Converts analogue to digital (demodulation) (1)"],
  },

  // ============================================
  // ENRICHED: Network Security (1.4)
  // ============================================
  {
    id: "p1-ns-010", question: "Describe the difference between a virus and a trojan horse.", marks: 4, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "A virus copies itself from machine to machine causing harm as it spreads, often attaching to files. A trojan horse disguises itself as legitimate/useful software and only causes damage once downloaded and installed.",
    modelAnswer: "A virus replicates/copies itself from machine to machine (1) causing harm as it spreads, often by attaching to legitimate files (1). A trojan horse is disguised as beneficial software such as a game or utility (1) and only causes damage once the user downloads and runs it (1).",
    markScheme: ["Virus: self-replicating / copies itself (1)", "Virus: attaches to files / spreads (1)", "Trojan: disguised as legitimate software (1)", "Trojan: causes harm once installed/run (1)"],
  },
  {
    id: "p1-ns-011", question: "Explain how a Distributed Denial of Service (DDoS) attack works.", marks: 3, difficulty: "challenge", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "A hacker takes control of multiple computers (a botnet). These compromised computers are used simultaneously to flood a target web server with requests. The server cannot handle the volume and crashes or becomes unavailable to legitimate users.",
    modelAnswer: "A hacker takes control of many computers forming a botnet (1). All compromised computers simultaneously send requests to the target server (1). The server is overwhelmed and cannot respond to legitimate users, causing it to crash or become unavailable (1).",
    markScheme: ["Multiple computers controlled / botnet (1)", "Flood target with requests simultaneously (1)", "Server overwhelmed / unavailable to real users (1)"],
  },
  {
    id: "p1-ns-012", question: "Explain how penetration testing helps protect a network.", marks: 3, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "A company hires ethical hackers to deliberately try to break into their system. If successful, they report the vulnerabilities found. The company can then fix these weaknesses before real attackers exploit them.",
    modelAnswer: "Ethical hackers are hired to simulate attacks on the system (1). They identify weaknesses and vulnerabilities (1). The company can then fix these security holes before they are exploited by real attackers (1).",
    markScheme: ["Simulated/authorised attack on system (1)", "Identifies vulnerabilities/weaknesses (1)", "Allows company to fix issues before real attack (1)"],
  },
  {
    id: "p1-ns-013", question: "Explain the difference between phishing and vishing.", marks: 2, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Phishing uses fraudulent emails to trick users into revealing personal information. Vishing is similar but uses voice calls (phone calls) instead of emails.",
    modelAnswer: "Phishing uses fake emails pretending to be from a trusted source to steal information (1). Vishing uses phone/voice calls instead of emails to trick victims (1).",
    markScheme: ["Phishing: fraudulent emails (1)", "Vishing: voice calls / phone-based (1)"],
  },
  {
    id: "p1-ns-014", question: "Describe what spyware does and explain why it is dangerous.", marks: 3, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Spyware secretly monitors the user's activity, including recording keystrokes. It can capture passwords, personal information, and bank details without the user knowing, sending this data to criminals.",
    modelAnswer: "Spyware secretly monitors user activity such as recording keystrokes (1). It can capture sensitive information like passwords and bank details (1). The stolen data is sent to criminals without the user's knowledge (1).",
    markScheme: ["Monitors/records user activity / keystrokes (1)", "Captures sensitive data (passwords, bank details) (1)", "Sends data to criminals / operates without user knowledge (1)"],
  },
  {
    id: "p1-ns-015", question: "Explain how user access levels help protect data in an organisation.", marks: 3, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Different users are given different permissions based on their role. Some users may only be able to read data, while others can write or delete. Sensitive data is restricted to users with higher authority levels.",
    modelAnswer: "Different users are assigned different permission levels (e.g., read, write, delete) (1). This restricts sensitive data to authorised personnel only (1). It prevents accidental or malicious modification/deletion of important data (1).",
    markScheme: ["Different permission levels assigned (1)", "Sensitive data restricted to authorised users (1)", "Prevents unauthorised modification/deletion (1)"],
  },
  {
    id: "p1-ns-016", question: "Which of the following is an example of social engineering?", marks: 1, difficulty: "foundation", topic: "Network Security", paper: "1", type: "multiple-choice",
    options: ["Installing a firewall", "Shoulder surfing someone's password", "Defragmenting a hard drive", "Using encryption"],
    correctAnswer: "Shoulder surfing someone's password",
    modelAnswer: "Shoulder surfing is a social engineering technique where someone watches over your shoulder to see your password.",
    markScheme: ["Shoulder surfing (1)"],
  },
  {
    id: "p1-ns-017", question: "Explain how a firewall protects a network.", marks: 3, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "A firewall monitors all incoming and outgoing network traffic. It compares traffic against a set of security rules. It blocks any traffic that does not meet the criteria and can block specific IP addresses or ports.",
    modelAnswer: "A firewall scans incoming and outgoing network traffic (1). It compares the traffic against pre-set security rules/criteria (1). Traffic that doesn't meet the rules is blocked, including specific IP addresses or ports (1).",
    markScheme: ["Monitors/scans incoming and outgoing traffic (1)", "Compares against security rules (1)", "Blocks unauthorised traffic / specific IPs/ports (1)"],
  },
  {
    id: "p1-ns-018", question: "Explain what ransomware is and how it affects users.", marks: 3, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Ransomware is malware that encrypts/locks all files on a computer so the user cannot access them. The attacker demands payment (ransom) to unlock the files. Even after paying, there is no guarantee the files will be restored.",
    modelAnswer: "Ransomware locks/encrypts files on a computer (1) so the user cannot access any of their data (1). The attacker demands a payment (ransom) to provide the decryption key, but paying does not guarantee recovery (1).",
    markScheme: ["Locks/encrypts files (1)", "User cannot access data (1)", "Demands payment / no guarantee of recovery (1)"],
  },
  {
    id: "p1-ns-019", question: "Explain what 'tailgating' means in the context of network security.", marks: 2, difficulty: "mixed", topic: "Network Security", paper: "1", type: "explain",
    correctAnswer: "Tailgating is when an unauthorised person follows someone with legitimate access through a secure door or entrance. The authorised person may hold the door open without checking who is behind them.",
    modelAnswer: "An unauthorised person follows someone with access through a secure entrance (1). Often the authorised person holds the door open, unknowingly allowing entry (1).",
    markScheme: ["Following authorised person through secure area (1)", "Gains physical access without authorisation (1)"],
  },

  // ============================================
  // ENRICHED: Ethical, Legal & Environmental (1.6)
  // ============================================
  {
    id: "p1-el-010", question: "Explain what is meant by 'The Digital Divide'.", marks: 3, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "The Digital Divide is the gap between people who have access to technology and those who do not. This can be due to geography (rural vs urban), wealth (rich vs poor countries), or age (younger people more comfortable with technology).",
    modelAnswer: "The Digital Divide is the gap between those with access to technology and those without (1). This can be due to geography — people in cities have better infrastructure than rural areas (1). It can also be due to wealth or age — richer and younger people tend to have better access (1).",
    markScheme: ["Gap between those with/without technology access (1)", "Geographical factors (urban vs rural, rich vs poor countries) (1)", "Other factors: age, wealth, education (1)"],
  },
  {
    id: "p1-el-011", question: "Describe two negative environmental impacts of technology.", marks: 4, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "E-waste: Discarded electronics contain toxic chemicals that pollute landfill sites and damage the environment. Energy consumption: Data centres and devices use huge amounts of electricity, contributing to carbon emissions and climate change.",
    modelAnswer: "E-waste: discarded electronics contain noxious chemicals that end up in landfill sites, damaging the environment for decades (1)(1). Energy consumption: data centres and computers use large amounts of energy, meaning fossil fuels are burned which contributes to climate change (1)(1).",
    markScheme: ["E-waste / toxic chemicals in landfill (1)", "Environmental damage from e-waste (1)", "Energy consumption of devices/data centres (1)", "Link to carbon emissions / climate change (1)"],
  },
  {
    id: "p1-el-012", question: "Explain the three offences covered by the Computer Misuse Act 1990.", marks: 3, difficulty: "challenge", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "1) Unauthorised access to computer material (basic hacking). 2) Unauthorised access with intent to commit a further offence (hacking to steal data/money). 3) Unauthorised modification of computer material (deleting/changing data, distributing malware).",
    modelAnswer: "Unauthorised access to computer material — e.g., basic hacking (1). Unauthorised access with intent to commit further crime — e.g., accessing data to commit fraud (1). Unauthorised modification of computer material — e.g., deleting data or creating/distributing malware (1).",
    markScheme: ["Unauthorised access to computer systems (1)", "Unauthorised access with intent to commit further offence (1)", "Unauthorised modification of data / creating malware (1)"],
  },
  {
    id: "p1-el-013", question: "State four principles of the Data Protection Act 2018.", marks: 4, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "short",
    correctAnswer: "Data must be: processed fairly and lawfully; used only for the purpose it was gathered; adequate, relevant, and not excessive; accurate and up to date; not kept longer than necessary; processed with the rights of data subjects; protected against unauthorised access; not transferred outside the EEA without adequate protection.",
    modelAnswer: "Data must be processed fairly and lawfully (1). Data must only be used for the stated purpose (1). Data must be accurate and kept up to date (1). Data must not be kept longer than necessary (1).",
    markScheme: ["Processed fairly and lawfully (1)", "Used for stated purpose only (1)", "Accurate and up to date (1)", "Not kept longer than necessary (1)", "Adequate, relevant, not excessive (1)", "Any four from DPA principles"],
  },
  {
    id: "p1-el-014", question: "Discuss the impact of technology on employment. Give arguments for and against.", marks: 6, difficulty: "challenge", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "For: technology creates new job roles (web developers, data analysts), increases efficiency and productivity, enables remote working and flexible hours, automates dangerous tasks. Against: automation replaces manual jobs (factory workers, cashiers), AI threatens professional roles, creates a skills gap where workers need retraining, can lead to unemployment in certain sectors.",
    modelAnswer: "For: creates new job roles like web developers and data analysts (1). Increases productivity and efficiency in businesses (1). Enables flexible/remote working arrangements (1). Against: automation replaces manual/repetitive jobs such as factory workers (1). AI threatens to replace more skilled roles (1). Workers may need expensive retraining, creating a skills gap (1).",
    markScheme: ["Creates new technology jobs (1)", "Increases efficiency/productivity (1)", "Enables remote/flexible working (1)", "Replaces manual/repetitive jobs (1)", "AI threatens skilled roles (1)", "Skills gap / retraining needed (1)"],
  },
  {
    id: "p1-el-015", question: "Explain the difference between proprietary (closed source) and open source software.", marks: 4, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Proprietary software: the source code is not available, you pay for a licence, you cannot modify or redistribute it. Open source software: the source code is freely available, you can modify and redistribute it, it is usually free and maintained by volunteers.",
    modelAnswer: "Proprietary: source code is hidden/closed (1), you pay for a licence and cannot modify or redistribute it (1). Open source: source code is freely available (1), you can edit, modify and redistribute it, usually free and maintained by volunteers (1).",
    markScheme: ["Proprietary: source code not available (1)", "Proprietary: paid licence / cannot modify (1)", "Open source: source code available (1)", "Open source: can modify / free / community maintained (1)"],
  },
  {
    id: "p1-el-016", question: "Explain why privacy is a concern in modern society. Give two examples.", marks: 4, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Privacy is the right not to be watched or monitored. Modern technology has eroded this right. Examples: CCTV cameras in town centres constantly record people; phone GPS systems track your location; ISPs can record your internet browsing history; number plate recognition tracks vehicle movements.",
    modelAnswer: "Privacy is the right to not be monitored/watched (1). Modern technology has made it easier to track individuals (1). Example: CCTV cameras record people in public spaces (1). Example: phone GPS / ISPs can track movements and internet habits (1).",
    markScheme: ["Privacy = right to not be monitored (1)", "Technology erodes this right (1)", "Example: CCTV / surveillance (1)", "Example: GPS tracking / ISP records / ANPR (1)"],
  },
  {
    id: "p1-el-017", question: "A company stores customer data in a database. State two responsibilities they have under the Data Protection Act.", marks: 2, difficulty: "foundation", topic: "Ethical, Legal & Environmental", paper: "1", type: "short",
    correctAnswer: "They must keep the data secure/protected against unauthorised access. They must not keep the data for longer than necessary.",
    modelAnswer: "They must protect data against unauthorised access (1). They must not keep data longer than necessary (1).",
    markScheme: ["Protect against unauthorised access (1)", "Not keep longer than necessary (1)", "Also accept: use only for stated purpose, keep accurate, process fairly"],
  },
  {
    id: "p1-el-018", question: "Explain what 'embedded bias' means in the context of AI systems.", marks: 3, difficulty: "challenge", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Embedded bias is when AI systems have unintended prejudices built into them, often reflecting biases in their training data. For example, facial recognition systems may be less accurate at recognising certain ethnic groups because training data was not diverse enough.",
    modelAnswer: "Embedded bias is when AI systems have unintended prejudices built in (1). This often comes from biased training data (1). For example, facial recognition being less accurate for certain ethnic groups due to unrepresentative training data (1).",
    markScheme: ["Unintended prejudice/bias in AI systems (1)", "Caused by biased/unrepresentative training data (1)", "Example showing real-world impact (1)"],
  },
  {
    id: "p1-el-019", question: "Describe two positive environmental impacts of technology.", marks: 4, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Remote working reduces commuting, lowering carbon emissions. Digital communication (emails, digital documents) reduces paper usage and deforestation.",
    modelAnswer: "Remote working/video conferencing reduces the need to travel, lowering carbon emissions (1)(1). Digital storage and emails reduce paper usage, saving trees and reducing waste (1)(1).",
    markScheme: ["Remote working reduces travel/emissions (1)", "Link to environmental benefit (1)", "Digital documents reduce paper usage (1)", "Link to environmental benefit (1)"],
  },
  {
    id: "p1-el-020", question: "Which law makes it illegal to copy and distribute software without permission?", marks: 1, difficulty: "foundation", topic: "Ethical, Legal & Environmental", paper: "1", type: "multiple-choice",
    options: ["Data Protection Act 2018", "Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "Freedom of Information Act 2000"],
    correctAnswer: "Copyright, Designs and Patents Act 1988",
    modelAnswer: "The Copyright, Designs and Patents Act 1988 protects creative works including software from being copied or distributed without permission.",
    markScheme: ["Copyright, Designs and Patents Act 1988 (1)"],
  },
  {
    id: "p1-el-021", question: "Explain what the Freedom of Information Act 2000 allows.", marks: 2, difficulty: "mixed", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "The Freedom of Information Act gives anyone the right to request information held by public bodies such as government departments, NHS trusts, and councils.",
    modelAnswer: "It gives individuals the right to request information (1) held by public bodies such as government departments or councils (1).",
    markScheme: ["Right to request information (1)", "From public bodies / government organisations (1)"],
  },
  {
    id: "p1-el-022", question: "Explain what 'planned obsolescence' means and its environmental impact.", marks: 3, difficulty: "challenge", topic: "Ethical, Legal & Environmental", paper: "1", type: "explain",
    correctAnswer: "Planned obsolescence is when manufacturers deliberately design products to have a limited lifespan so customers need to buy replacements. This increases e-waste as devices are discarded more frequently, contributing to landfill pollution and resource depletion.",
    modelAnswer: "Planned obsolescence is when devices are deliberately designed to become outdated or stop working after a set period (1). This encourages consumers to buy replacements more frequently (1). It increases e-waste and the demand for raw materials, harming the environment (1).",
    markScheme: ["Devices designed to have limited lifespan (1)", "Encourages frequent replacement/purchasing (1)", "Increases e-waste / environmental damage (1)"],
  },
];
