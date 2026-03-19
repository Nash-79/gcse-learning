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
    icon: "🖥️",
    color: "primary",
    description: "Understand the CPU, Von Neumann architecture, and factors affecting performance.",
    sections: [
      {
        id: "cpu-overview",
        title: "The Central Processing Unit (CPU)",
        icon: "⚡",
        content: "The CPU is the brain of the computer. It processes all instructions and data. Modern CPUs contain billions of transistors and can perform billions of operations per second. The CPU sits on the motherboard and communicates with other components via buses.",
        keyTerms: [
          { term: "CPU", definition: "Central Processing Unit — the main processor that executes program instructions" },
          { term: "Transistor", definition: "A tiny electronic switch that can be ON (1) or OFF (0), forming the basis of all computing" },
          { term: "Motherboard", definition: "The main circuit board that connects all computer components together" },
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
        examTip: "Always mention ALL THREE components of the CPU when asked: CU, ALU, and Cache/Registers.",
      },
      {
        id: "cu-alu",
        title: "Control Unit & ALU",
        icon: "🔧",
        content: "The Control Unit (CU) is the coordinator of the CPU. It fetches instructions from memory, decodes them, and directs other components to carry them out. It controls the timing of operations using the system clock.\n\nThe Arithmetic Logic Unit (ALU) performs two types of operations:\n• Arithmetic: addition, subtraction, multiplication, division\n• Logic: comparisons (AND, OR, NOT, greater than, equal to)",
        keyTerms: [
          { term: "Control Unit", definition: "Decodes instructions and coordinates the CPU's operations" },
          { term: "ALU", definition: "Arithmetic Logic Unit — performs calculations and logical comparisons" },
          { term: "System Clock", definition: "Generates regular electrical pulses to synchronise CPU operations" },
        ],
        comparisonData: {
          itemA: { title: "Control Unit (CU)", points: ["Fetches instructions from memory", "Decodes instructions", "Controls timing of operations", "Directs data flow between components", "Manages the fetch-decode-execute cycle"] },
          itemB: { title: "ALU", points: ["Performs arithmetic (+, -, ×, ÷)", "Performs logical comparisons", "Handles AND, OR, NOT operations", "Processes comparison operations (>, <, =)", "Returns results to registers"] },
        },
      },
      {
        id: "fetch-decode-execute",
        title: "The Fetch-Decode-Execute Cycle",
        icon: "🔄",
        content: "Every instruction the CPU processes goes through three stages. This cycle repeats billions of times per second.\n\n1. FETCH — The next instruction is fetched from RAM using the address stored in the Program Counter (PC). The instruction is placed in the Current Instruction Register (CIR). The PC is incremented to point to the next instruction.\n\n2. DECODE — The Control Unit decodes the instruction in the CIR to determine what operation needs to be performed.\n\n3. EXECUTE — The instruction is carried out. This may involve the ALU performing a calculation, data being moved, or a result being stored.",
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
        keyTerms: [
          { term: "Program Counter (PC)", definition: "Register that holds the memory address of the NEXT instruction to fetch" },
          { term: "Memory Address Register (MAR)", definition: "Holds the address of the memory location being accessed" },
          { term: "Memory Data Register (MDR)", definition: "Holds the data being read from or written to memory" },
          { term: "Current Instruction Register (CIR)", definition: "Holds the instruction currently being decoded/executed" },
        ],
        examTip: "In exam answers, always name the specific registers (PC, MAR, MDR, CIR) — don't just say 'a register'.",
      },
      {
        id: "cpu-performance",
        title: "Factors Affecting CPU Performance",
        icon: "📈",
        content: "Three main factors determine how fast a CPU can process instructions:",
        tableData: {
          headers: ["Factor", "What It Is", "How It Helps", "Limitation"],
          rows: [
            ["Clock Speed", "Number of cycles per second (measured in GHz)", "Higher speed = more instructions per second", "More heat generated, may need throttling"],
            ["Number of Cores", "Independent processing units within the CPU", "Multiple cores can process tasks simultaneously", "Not all programs can use multiple cores"],
            ["Cache Size", "Small, fast memory built into the CPU", "Frequently used data accessed faster than RAM", "Very expensive, limited physical space"],
          ],
        },
        examTip: "When asked about CPU performance, always give a BENEFIT and a DRAWBACK for each factor.",
      },
      {
        id: "von-neumann",
        title: "Von Neumann Architecture",
        icon: "🏗️",
        content: "The Von Neumann architecture is the design used by most modern computers. Its key principle is that both program instructions AND data are stored in the same memory (RAM).\n\nKey components:\n• CPU (with CU, ALU, registers)\n• Main Memory (RAM) storing both data and instructions\n• System Bus (Address Bus, Data Bus, Control Bus)\n• Input/Output devices",
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
        ],
      },
      {
        id: "embedded-systems",
        title: "Embedded Systems",
        icon: "📱",
        content: "An embedded system is a computer system built into a larger device to perform a dedicated function. Unlike general-purpose computers, embedded systems are designed for one specific task.\n\nExamples:\n• Washing machine controllers\n• Car engine management systems\n• Smart thermostat controllers\n• Traffic light systems\n• Digital watches",
        keyTerms: [
          { term: "Embedded System", definition: "A computer system designed to perform a dedicated function within a larger mechanical or electronic system" },
          { term: "Firmware", definition: "Software programmed into an embedded system's ROM, providing low-level control" },
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
    icon: "💾",
    color: "secondary",
    description: "Primary vs secondary storage, data representation, and units of storage.",
    sections: [
      {
        id: "ram-rom",
        title: "RAM vs ROM",
        icon: "🧠",
        content: "Computers use two types of primary memory: RAM and ROM. Both are connected directly to the CPU, but they serve very different purposes.",
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
        examTip: "A common exam question asks 'Why does a computer need both RAM and ROM?' — explain that ROM boots the system, while RAM holds running programs.",
      },
      {
        id: "secondary-storage",
        title: "Secondary Storage Types",
        icon: "💿",
        content: "Secondary storage is non-volatile storage used to permanently save data, programs, and the operating system. There are three main types:",
        tableData: {
          headers: ["Type", "How It Works", "Advantages", "Disadvantages", "Examples"],
          rows: [
            ["Magnetic (HDD)", "Spinning platters with magnetic coating read by a head", "High capacity, low cost per GB, reliable for large storage", "Moving parts can fail, slower than SSD, heavier", "Hard disk drives, magnetic tape"],
            ["Optical", "Laser reads/writes data on reflective disc surface", "Portable, cheap to produce, good for distribution", "Low capacity, slow access, easily scratched", "CD, DVD, Blu-ray"],
            ["Solid State (SSD)", "Electronic circuits with no moving parts (flash memory)", "Very fast, durable, silent, low power, lightweight", "More expensive per GB, limited write cycles", "SSD drives, USB flash drives, SD cards"],
          ],
        },
        examTip: "When comparing storage types, think about: capacity, speed, portability, durability, cost.",
      },
      {
        id: "units-storage",
        title: "Units of Storage",
        icon: "📊",
        content: "All data in a computer is stored as binary digits (bits). A bit is the smallest unit of data — either 0 or 1.\n\nStorage units follow a hierarchy based on powers of 1024:",
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
      },
      {
        id: "binary-hex",
        title: "Binary & Hexadecimal",
        icon: "🔢",
        content: "Computers use binary (base 2) because transistors have two states: ON (1) and OFF (0). Hexadecimal (base 16) is used as a shorthand for binary because it's more human-readable.\n\nBinary place values (8-bit): 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1\n\nHexadecimal uses digits 0-9 and letters A-F:\nA=10, B=11, C=12, D=13, E=14, F=15\n\nConversion example:\nDenary 156 → Binary: 128+16+8+4 = 10011100\nBinary 10011100 → Hex: 1001 = 9, 1100 = C → 9C\nHex 2F → Denary: 2×16 + 15 = 47",
        keyTerms: [
          { term: "Binary", definition: "Base 2 number system using only 0 and 1" },
          { term: "Denary", definition: "Base 10 number system (our everyday counting system)" },
          { term: "Hexadecimal", definition: "Base 16 number system using 0-9 and A-F" },
        ],
        examTip: "Always show your working in conversion questions — you get method marks even if the final answer is wrong!",
      },
      {
        id: "data-representation",
        title: "Data Representation",
        icon: "🎨",
        content: "All data — text, images, sound — must be converted to binary for a computer to process it.\n\n• Characters: Stored using character sets. ASCII uses 7 bits (128 characters). Unicode uses up to 32 bits (over 1 million characters including emojis).\n\n• Images: Made up of pixels. Each pixel's colour is stored as binary. Metadata includes width, height, and colour depth.\n\n• Sound: Analogue sound waves are converted to digital using sampling. Sample rate (Hz) = how often samples are taken. Bit depth = how many bits per sample.",
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
    icon: "🌐",
    color: "accent",
    description: "Network types, topologies, protocols, and the internet.",
    sections: [
      {
        id: "lan-wan",
        title: "LAN vs WAN",
        icon: "🔗",
        content: "A network is two or more computers connected together to share resources. There are two main types:",
        comparisonData: {
          itemA: { title: "LAN (Local Area Network)", points: ["Small geographical area (building/campus)", "Hardware owned by the organisation", "Higher data transfer speeds", "More secure — easier to manage", "Example: school network, office network"] },
          itemB: { title: "WAN (Wide Area Network)", points: ["Large geographical area (city/country/world)", "Infrastructure owned by third parties (telecom companies)", "Lower data transfer speeds over distance", "Less secure — data travels over public infrastructure", "Example: the Internet is the largest WAN"] },
        },
      },
      {
        id: "network-topologies",
        title: "Network Topologies",
        icon: "🕸️",
        content: "A network topology is the arrangement of devices and connections in a network.",
        comparisonData: {
          itemA: { title: "Star Topology", points: ["All devices connect to a central switch/hub", "If one cable fails, only that device is affected", "Easy to add new devices", "High performance — no data collisions", "If the central switch fails, the whole network goes down", "More cable required = higher cost"] },
          itemB: { title: "Mesh Topology", points: ["Every device connects to every other device", "Very reliable — multiple paths for data", "If one connection fails, data reroutes", "Expensive — lots of cabling/connections", "Complex to set up and manage", "Used in critical systems (military, hospitals)"] },
        },
        examTip: "OCR often asks you to compare star and mesh topologies. Know 2 advantages and 2 disadvantages of each.",
      },
      {
        id: "protocols",
        title: "Network Protocols",
        icon: "📋",
        content: "A protocol is a set of rules that govern how data is transmitted across a network. Protocols ensure that different devices can communicate with each other in a standardised way.",
        tableData: {
          headers: ["Protocol", "Full Name", "Purpose", "Layer"],
          rows: [
            ["TCP/IP", "Transmission Control Protocol/Internet Protocol", "Breaks data into packets, routes them across the internet", "Transport/Network"],
            ["HTTP/HTTPS", "HyperText Transfer Protocol (Secure)", "Transfers web pages between browser and server", "Application"],
            ["FTP", "File Transfer Protocol", "Transfers files between computers", "Application"],
            ["SMTP", "Simple Mail Transfer Protocol", "Sends emails from sender to email server", "Application"],
            ["IMAP/POP", "Internet Message Access Protocol / Post Office Protocol", "Retrieves emails from server to client", "Application"],
          ],
        },
        keyTerms: [
          { term: "Protocol", definition: "A set of rules governing data transmission across a network" },
          { term: "Packet", definition: "A small chunk of data with a header (source, destination, packet number) and payload" },
          { term: "Packet Switching", definition: "Data is split into packets that may take different routes and are reassembled at the destination" },
        ],
      },
      {
        id: "internet-dns",
        title: "The Internet, DNS & Hosting",
        icon: "🌍",
        content: "The Internet is a global network of networks. The World Wide Web (WWW) is a service that runs ON the internet — it's a collection of web pages accessed via HTTP.\n\nDNS (Domain Name System) translates human-readable domain names (e.g., google.com) into IP addresses (e.g., 142.250.80.46).\n\nHow DNS works:\n1. You type a URL into your browser\n2. Browser checks its local DNS cache\n3. If not found, request goes to your ISP's DNS server\n4. DNS server looks up the domain and returns the IP address\n5. Browser connects to the web server at that IP address",
        keyTerms: [
          { term: "IP Address", definition: "A unique numerical address assigned to every device on a network" },
          { term: "DNS", definition: "Domain Name System — translates domain names to IP addresses" },
          { term: "ISP", definition: "Internet Service Provider — company that provides internet access" },
          { term: "Hosting", definition: "Storing website files on a web server so they can be accessed over the internet" },
          { term: "The Cloud", definition: "Remote servers accessed over the internet to store data or run applications" },
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
    icon: "🔒",
    color: "destructive",
    description: "Threats, vulnerabilities, and methods of protection.",
    sections: [
      {
        id: "cyber-threats",
        title: "Types of Cyber Threat",
        icon: "⚠️",
        content: "Cyber threats are attacks designed to damage, disrupt, or gain unauthorised access to computer systems.",
        tableData: {
          headers: ["Threat", "Description", "How It Works", "Prevention"],
          rows: [
            ["Malware", "Malicious software designed to cause harm", "Installed via downloads, email attachments, infected websites", "Antivirus, don't download from untrusted sources"],
            ["Phishing", "Fraudulent emails/messages pretending to be legitimate", "Tricks users into revealing passwords or personal data", "User education, email filtering, verify sender"],
            ["Brute Force", "Systematically trying every possible password", "Automated tools try millions of combinations", "Strong passwords, account lockout policies"],
            ["SQL Injection", "Malicious SQL code inserted into web forms", "Exploits database vulnerabilities to access/modify data", "Input validation/sanitisation, parameterised queries"],
            ["DDoS", "Distributed Denial of Service attack", "Floods a server with traffic to make it unavailable", "Firewalls, traffic filtering, cloud protection"],
            ["Social Engineering", "Manipulating people into revealing information", "Exploits human trust rather than technical weaknesses", "Staff training, security policies, verification"],
          ],
        },
        examTip: "For each threat, always know: what it IS, how it WORKS, and how to PREVENT it. That's usually 3 marks.",
      },
      {
        id: "protection-methods",
        title: "Methods of Protection",
        icon: "🛡️",
        content: "Organisations use multiple layers of security to protect their networks and data:",
        tableData: {
          headers: ["Method", "What It Does", "How It Works"],
          rows: [
            ["Firewall", "Monitors and filters network traffic", "Examines incoming/outgoing packets against rules, blocks unauthorised access"],
            ["Encryption", "Scrambles data so it can't be read if intercepted", "Uses algorithms to convert plaintext to ciphertext; needs a key to decrypt"],
            ["Authentication", "Verifies user identity", "Passwords, biometrics, two-factor authentication (2FA)"],
            ["Access Control", "Limits who can access what", "User permissions, file-level access rights, network segmentation"],
            ["Antivirus/Anti-malware", "Detects and removes malicious software", "Scans files against database of known threats, quarantines infected files"],
            ["Penetration Testing", "Tests security by simulating attacks", "Ethical hackers attempt to breach the system to find vulnerabilities"],
          ],
        },
        keyTerms: [
          { term: "Encryption", definition: "Converting data into a coded form (ciphertext) that can only be read with the correct decryption key" },
          { term: "Firewall", definition: "Hardware or software that monitors and filters network traffic based on security rules" },
          { term: "Two-Factor Authentication", definition: "Requiring two different types of verification to prove identity (e.g., password + phone code)" },
          { term: "Penetration Testing", definition: "Authorised simulated attacks on a system to find and fix security weaknesses" },
        ],
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
    icon: "⚙️",
    color: "primary",
    description: "Operating systems, utility software, and translators.",
    sections: [
      {
        id: "os-functions",
        title: "Operating System Functions",
        icon: "🖥️",
        content: "An operating system (OS) is software that manages the computer's hardware and provides services for applications. Without an OS, you couldn't use a computer.\n\nThe OS acts as an intermediary between the user and the hardware.",
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
        examTip: "Know at least 4 OS functions with examples. 'User interface' alone is too vague — specify GUI or CLI.",
      },
      {
        id: "translators",
        title: "Translators: Compilers, Interpreters & Assemblers",
        icon: "🔄",
        content: "Source code written in high-level languages must be translated into machine code for the CPU to execute. There are three types of translator:",
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
      },
      {
        id: "utility-software",
        title: "Utility Software",
        icon: "🔧",
        content: "Utility software performs maintenance tasks to keep the computer running efficiently. These are usually included with the operating system.",
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
    icon: "⚖️",
    color: "secondary",
    description: "Legislation, ethical issues, and environmental impact of technology.",
    sections: [
      {
        id: "legislation",
        title: "Key Legislation",
        icon: "📜",
        content: "Several laws regulate how technology is used and how data is handled in the UK:",
        tableData: {
          headers: ["Law", "Year", "What It Covers", "Key Points"],
          rows: [
            ["Data Protection Act", "2018 (GDPR)", "How personal data is collected, stored, and used", "Data must be: used fairly/lawfully, for specified purposes, adequate/relevant, accurate, not kept longer than needed, kept secure"],
            ["Computer Misuse Act", "1990", "Unauthorised access to computer systems", "Three offences: (1) Unauthorised access, (2) Unauthorised access with intent to commit crime, (3) Unauthorised modification of data"],
            ["Copyright, Designs and Patents Act", "1988", "Protection of creative works", "Protects software, music, films, literature from being copied/distributed without permission"],
            ["Freedom of Information Act", "2000", "Right to access information held by public bodies", "Anyone can request information from government/public organisations"],
          ],
        },
        examTip: "You MUST know the name of each act and at least 2 key points about what it covers.",
      },
      {
        id: "ethical-issues",
        title: "Ethical Issues in Computing",
        icon: "🤔",
        content: "Technology raises many ethical questions about how we live and work:",
        tableData: {
          headers: ["Issue", "Description", "Arguments For", "Arguments Against"],
          rows: [
            ["Privacy", "How much personal data should be collected?", "Helps improve services, targeted advertising", "Surveillance concerns, data breaches, loss of anonymity"],
            ["AI & Automation", "Should AI replace human jobs?", "Increased efficiency, reduced human error", "Job losses, bias in AI decisions, accountability"],
            ["Digital Divide", "Gap between those with and without technology access", "Drives investment in infrastructure", "Widens inequality, excluded from services"],
            ["Open Source vs Proprietary", "Should software code be freely available?", "Collaboration, transparency, free access", "Less profit incentive, security concerns"],
            ["Censorship", "Should online content be controlled?", "Protects from harmful content, prevents fake news", "Limits free speech, who decides what's harmful?"],
          ],
        },
      },
      {
        id: "environmental-impact",
        title: "Environmental Impact of Technology",
        icon: "🌍",
        content: "Technology has both positive and negative environmental impacts:",
        comparisonData: {
          itemA: { title: "Negative Impacts", points: ["E-waste: discarded electronics pollute landfills with toxic materials", "Energy consumption: data centres use enormous amounts of electricity", "Manufacturing: mining rare earth metals causes habitat destruction", "Carbon footprint: production and shipping of devices globally", "Planned obsolescence: devices designed to be replaced frequently"] },
          itemB: { title: "Positive Impacts", points: ["Smart technology: sensors and AI can optimise energy usage", "Remote working: reduces commuting and transport emissions", "Paperless offices: digital documents reduce deforestation", "Renewable energy management: tech helps manage solar/wind farms", "Environmental monitoring: satellites track deforestation and pollution"] },
        },
        examTip: "In 'discuss' questions (6+ marks), always give BOTH positive and negative impacts with specific examples.",
      },
    ],
  },
];
