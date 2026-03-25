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
    aqaRef: ["3.3", "3.4"],
    examBoards: ["ocr", "aqa"],
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
    aqaRef: ["3.5"],
    examBoards: ["ocr", "aqa"],
    icon: "🌐",
    color: "accent",
    description: "Network types, topologies, protocols, and the internet.",
    sections: [
      {
        id: "lan-wan",
        title: "LAN vs WAN",
        icon: "🔗",
        content: "A network is two or more computers connected together to share resources like files, printers, and internet access. Not having a network (standalone) is more secure but misses these benefits.",
        comparisonData: {
          itemA: { title: "LAN (Local Area Network)", points: ["Small geographical area (building/campus)", "Hardware owned by the organisation", "Uses switches, routers, Ethernet or Wi-Fi", "Higher data transfer speeds", "Quick and easy to set up", "Cheaper to maintain"] },
          itemB: { title: "WAN (Wide Area Network)", points: ["Large geographical area (city/country/world)", "Infrastructure rented from third parties (telecom companies)", "Uses routers, undersea cables, satellites", "Lower speeds over long distances", "More expensive to set up and maintain", "The Internet is the largest WAN"] },
        },
      },
      {
        id: "network-hardware",
        title: "Networking Hardware",
        icon: "🔌",
        content: "Several hardware devices are needed to build and operate a network:",
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
        examTip: "Home 'routers' are actually all-in-one devices combining a router, modem, switch, and WAP in one box.",
      },
      {
        id: "network-topologies",
        title: "Network Topologies",
        icon: "🕸️",
        content: "A network topology is the arrangement of devices and connections in a network.",
        comparisonData: {
          itemA: { title: "Star Topology", points: ["All devices connect to a central switch", "If one cable fails, only that device is affected", "Easy to add new devices", "High performance — no data collisions", "If the central switch fails, whole network goes down", "Less cabling needed than mesh"] },
          itemB: { title: "Mesh Topology", points: ["Every device connects to every other device", "Very reliable — multiple paths for data", "If one connection fails, data reroutes", "No single point of failure", "Expensive — lots more cabling and equipment", "Partial mesh offers a compromise"] },
        },
        examTip: "OCR often asks you to compare star and mesh topologies. Know 2 advantages and 2 disadvantages of each.",
      },
      {
        id: "network-performance",
        title: "Factors Affecting Network Performance",
        icon: "📊",
        content: "Several factors affect how well a network performs:",
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
      },
      {
        id: "client-server-p2p",
        title: "Client-Server vs Peer-to-Peer",
        icon: "🖧",
        content: "Networks can be organised in two ways depending on whether a central server is used.",
        comparisonData: {
          itemA: { title: "Client-Server", points: ["Dedicated server manages data, files, and security", "Files stored centrally — easy backups", "Access levels for better security", "Requires specialist OS and network manager", "Expensive server hardware needed"] },
          itemB: { title: "Peer-to-Peer", points: ["No central server — all computers are equal", "No specialist OS needed", "Easier and cheaper to set up", "If one computer fails, rest continues", "Files spread across computers — harder to find", "Less secure — everyone responsible for security"] },
        },
        examTip: "Schools and businesses use client-server. Small home networks typically use peer-to-peer.",
      },
      {
        id: "wired-wireless",
        title: "Wired vs Wireless Networks",
        icon: "📡",
        content: "Networks can use wired or wireless connections:",
        tableData: {
          headers: ["Technology", "Type", "Speed", "Range", "Notes"],
          rows: [
            ["Ethernet", "Wired", "Up to 10 Gbps", "~100m", "Standardised, reliable, most common wired technology"],
            ["Wi-Fi (2.4 GHz)", "Wireless", "Varies", "~45m indoors", "Better range, penetrates walls, but more interference"],
            ["Wi-Fi (5 GHz)", "Wireless", "Often faster", "~15m indoors", "Less interference but shorter range"],
            ["Bluetooth", "Wireless", "Up to 2.1 Mbps", "~10m", "Short range, for nearby devices (phone + headphones)"],
          ],
        },
      },
      {
        id: "protocols",
        title: "Network Protocols",
        icon: "📋",
        content: "A protocol is a set of rules for data transmission. Protocols ensure devices from different manufacturers can communicate.",
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
      },
      {
        id: "layers",
        title: "The Concept of Layers",
        icon: "📚",
        content: "Protocols are divided into separate layers, each handling a specific aspect of communication:",
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
        examTip: "You don't need to memorise the full OSI model for GCSE, but know WHY protocols are layered — it's a common 3-mark question.",
      },
      {
        id: "encryption-addressing",
        title: "Encryption & Addressing",
        icon: "🔐",
        content: "Data sent across networks can be intercepted. Encryption scrambles data so only the intended recipient (with the key) can read it.\n\nEvery device needs addresses for identification:",
        comparisonData: {
          itemA: { title: "IP Address", points: ["Assigned by the router", "Can change each time device connects", "IPv4: four numbers 0-255 (e.g., 217.100.54.119)", "IPv6: eight hex groups — needed as IPv4 ran out", "Used to route data between networks"] },
          itemB: { title: "MAC Address", points: ["Hard-coded by manufacturer", "Permanent and unique worldwide", "12 hex characters (e.g., 00-B0-D0-63-C2-26)", "Used by switches within a LAN", "Cannot be changed"] },
        },
      },
      {
        id: "internet-dns",
        title: "The Internet, DNS & The Cloud",
        icon: "🌍",
        content: "The Internet is a global WAN. The WWW is a service that runs ON the internet.\n\nDNS translates domain names to IP addresses:\n1. User types URL into browser\n2. Browser sends domain to DNS server\n3. DNS returns the IP address\n4. Browser connects to web server\n\nThe Cloud refers to remote servers for storage, apps, and computing power.",
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
    sections: [
      {
        id: "malware-types",
        title: "Types of Malware",
        icon: "🦠",
        content: "Malware (malicious software) includes any software designed to cause harm:",
        tableData: {
          headers: ["Malware Type", "What It Does", "How It Spreads"],
          rows: [
            ["Virus", "Copies itself from machine to machine causing harm", "Attaches to legitimate files, spreads when files are shared"],
            ["Trojan Horse", "Disguises itself as useful software, causes damage once installed", "Downloaded by user thinking it's a game or utility"],
            ["Spyware", "Secretly monitors activity, records keystrokes and passwords", "Bundled with downloads or via malicious websites"],
            ["Ransomware", "Locks/encrypts all files, demands payment to unlock", "Delivered via phishing emails or malicious downloads"],
          ],
        },
      },
      {
        id: "social-engineering",
        title: "Social Engineering Attacks",
        icon: "🎭",
        content: "Sometimes people are the weak point. Social engineering tricks people into giving away data or passwords:",
        tableData: {
          headers: ["Attack", "Description", "Example"],
          rows: [
            ["Phishing", "Fake emails from a 'trusted' source with urgent requests", "Email claiming to be from your bank asking to 'verify' your account"],
            ["Vishing", "Voice call version of phishing", "Call pretending to be from HMRC saying you owe tax"],
            ["Shoulder Surfing", "Watching someone type their password", "Peering at someone's PIN at a cash machine"],
            ["Tailgating", "Following an authorised person through a secure door", "Having the door held open without being challenged"],
          ],
        },
        examTip: "Social engineering exploits PEOPLE, not technology. That's the key distinction from malware attacks.",
      },
      {
        id: "cyber-threats",
        title: "Other Cyber Threats",
        icon: "⚠️",
        content: "Beyond malware and social engineering, several other threats target networks:",
        tableData: {
          headers: ["Threat", "Description", "How It Works", "Prevention"],
          rows: [
            ["Brute Force", "Trying every possible password combination", "Automated tools try millions of combinations", "Strong passwords, account lockout"],
            ["SQL Injection", "Malicious SQL code inserted into web forms", "e.g., ;DROP TABLE Customer added to a query", "Input validation, parameterised queries"],
            ["DDoS", "Distributed Denial of Service", "Botnet floods server with requests until it crashes", "Firewalls, traffic filtering, IP blocking"],
            ["Data Interception", "Intercepting packets in transit", "Packet sniffing software captures data", "Encryption, HTTPS, VPNs"],
          ],
        },
        examTip: "For each threat, always know: what it IS, how it WORKS, and how to PREVENT it. That's usually 3 marks.",
      },
      {
        id: "protection-methods",
        title: "Methods of Protection",
        icon: "🛡️",
        content: "Organisations use multiple layers of security:",
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
      },
      {
        id: "threat-defence-summary",
        title: "Threat vs Defence Summary",
        icon: "📋",
        content: "Quick reference for matching threats to their best defences:",
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
      {
        id: "binary-arithmetic",
        title: "Binary Arithmetic",
        icon: "➕",
        content: "You need to be able to perform several operations with binary numbers.\n\nBinary Addition follows the same rules as denary but in base 2:\n0 + 0 = 0\n0 + 1 = 1\n1 + 0 = 1\n1 + 1 = 10 (carry the 1)\n1 + 1 + 1 = 11 (carry the 1)\n\nIf the result needs more bits than are available, this causes an overflow error.",
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
        examTip: "Always show your carry row when doing binary addition — you get method marks. For shifts, state the multiplication/division factor: shifting left by n positions multiplies by 2ⁿ.",
      },
      {
        id: "compression",
        title: "Compression",
        icon: "📦",
        content: "Compression reduces file size to save storage space or transmit data faster over a network. There are two types:",
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
        examTip: "Common exam question: 'Why would lossy compression be unsuitable for a text file?' — because losing characters/words would make the text meaningless.",
      },
      {
        id: "file-size-calculations",
        title: "Calculating File Sizes",
        icon: "🧮",
        content: "You need to be able to calculate file sizes for different types of data using these formulas:",
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
        content: "Ethical concerns are about whether something is 'right' or 'wrong'. There is no definite answer — having an opinion is valid as long as you can support it with evidence.",
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
      },
      {
        id: "privacy",
        title: "Privacy Concerns",
        icon: "👁️",
        content: "Privacy is the right that all people have to not be watched. Many people feel this right is being eroded in modern society:",
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
        examTip: "In 'discuss' questions about privacy, give specific examples of technology AND explain why some people think surveillance is justified (e.g., catching criminals).",
      },
      {
        id: "environmental-impact",
        title: "Environmental Impact of Technology",
        icon: "🌍",
        content: "Technology has both positive and negative environmental impacts:",
        comparisonData: {
          itemA: { title: "Negative Impacts", points: ["E-waste: discarded electronics contain noxious chemicals that damage landfills for decades", "Energy consumption: data centres and devices use huge amounts of electricity, burning fossil fuels", "Manufacturing: mining metals needed for computers has huge carbon implications", "Carbon footprint: global production and shipping of devices", "Planned obsolescence: devices designed to be replaced frequently"] },
          itemB: { title: "Positive Impacts", points: ["Emails and digital storage reduce paper usage and letters sent", "Video conferencing reduces the need to travel for meetings", "Remote working reduces commuting and carbon emissions", "Smart technology: sensors and AI can optimise energy usage", "Environmental monitoring: satellites track deforestation and pollution"] },
        },
        examTip: "In 'discuss' questions (6+ marks), always give BOTH positive and negative impacts with specific examples.",
      },
      {
        id: "software-licenses",
        title: "Software Licenses",
        icon: "📄",
        content: "When you buy software, you are technically buying a licence to use it. There are two main types:",
        comparisonData: {
          itemA: { title: "Proprietary (Closed Source)", points: ["Source code is hidden — you cannot see or modify it", "You pay for a licence to use the software", "Cannot change, resell, copy, or redistribute it", "Company maintains and updates the software", "Examples: Microsoft Office, Adobe Photoshop"] },
          itemB: { title: "Open Source", points: ["Source code is freely available to view and modify", "Usually free to download and use", "Can edit the code to suit your needs", "Created and maintained by volunteer communities", "Examples: Linux, LibreOffice, Firefox, Python"] },
        },
        examTip: "Know at least 2 advantages and 2 disadvantages of each licence type for comparison questions.",
      },
    ],
  },
];
