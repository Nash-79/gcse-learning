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
];
