# 🚀 OS & CN Practicals Master Lab (CBIT R22A)

> **Complete Practical Exam Preparation Web Application for Operating Systems Lab (`22CSC18N`) & Computer Networks Lab (`22ITC11N`) at Chaitanya Bharathi Institute of Technology (A).**

Designed to be hosted anywhere (e.g. **GitHub Pages**, Vercel, Netlify) or run completely offline directly in any browser.

---

## 🌟 Key Features

1. **100% Complete Syllabus Coverage**:
   - Contains **every single experiment** mandated by the official CBIT R22A syllabus, as well as all uploaded lab records, assignments, and viva question banks.
2. **Standardized & Complete Structure for Every Experiment**:
   - 🎯 **Aim** & Objectives
   - 📖 **Theory & Concepts** (Formulas, state diagrams, protocols)
   - 📐 **Algorithm / Pseudocode** (Step-by-step logic)
   - 💻 **Optimized Source Code** (Clean, bug-free C / C++ / Python / Bash with syntax highlighting & 1-click Copy)
   - 🖥️ **Sample Execution Command & Output** (Exact realistic terminal outputs)
   - ⚡ **Interactive Algorithm Runner / Live Simulator** (Run the algorithm directly in your browser with custom inputs!)
   - 🎓 **High-Yield Viva Voce Q&A** (Answers to the exact questions asked by external examiners)
3. **Interactive In-Browser Algorithm Runners**:
   - **CPU Scheduling Visualizer**: Interactive Gantt chart & process table for FCFS, SJF (Preemptive/Non-preemptive), Round Robin, and Priority.
   - **Page Replacement Visualizer**: Step-by-step frame matrix for FIFO, LRU, and Optimal with hit/fault ratios.
   - **Banker's Algorithm Solver**: Safe state calculator and resource request evaluator with step-by-step work vector additions.
   - **Disk File Allocation Visualizer**: 32-block storage visualizer for Contiguous, Linked, and Indexed allocations.
   - **Process Synchronization**: Interactive Producer-Consumer circular buffer and Dining Philosophers table.
   - **POSIX Thread Race Condition**: Toggle Mutex ON/OFF to witness lost updates vs synchronized accuracy.
   - **VFS System Call Shell**: Execute `open`, `write`, `lseek`, `read`, `stat`, and `close`.
   - **Bash Script Runner**: Execute practical shell scripts (Even/Odd, Prime, Factorial, Fibonacci, Palindrome).
   - **CRC Calculator**: Modulo-2 division with step-by-step XOR table and interactive bit-flip error injection.
   - **Dual-Terminal Socket Simulator**: Live interactive client-server terminal running the exact `server.py` and `client.py` logic!
   - **Network Diagnostic CLI**: Interactive terminal running `ping`, `ipconfig`, `arp -a`, `netstat -ano`, `tracert`, `nslookup`.
   - **Sliding Window Protocol Visualizer**: Timeline comparing Go-Back-N vs Selective Repeat with packet loss.
   - **Routing Algorithms**: Dynamic Distance Vector (Bellman-Ford) and Link State (Dijkstra) table updates.
   - **Wireshark Packet Dissector**: Packet tree dissection and hex dump for TCP 3-way handshake, ARP, ICMP, UDP, and FTP.

---

## 🌐 How to Host on GitHub Pages (Takes 30 Seconds!)

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "Add complete OS & CN Practicals Master Lab with interactive runners"
   git push origin main
   ```
2. **Enable GitHub Pages**:
   - Go to your repository on **GitHub.com**.
   - Click on **Settings** &rarr; **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment &rarr; Branch**, select `main` branch and `/ (root)` folder.
   - Click **Save**.
3. **Access Anywhere**:
   - In 1 to 2 minutes, GitHub will give you a public URL (e.g., `https://<your-username>.github.io/<repo-name>/`).
   - Open it on your phone, tablet, or laptop to revise anywhere!

---

## 💻 How to Run Locally

### Option 1: Direct Browser Launch (Zero Installation)
Simply double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari!

### Option 2: Local HTTP Server (Python)
```bash
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## 📋 Complete List of Included Experiments

### 🖥️ Operating Systems Lab (`22CSC18N`)
| Exp # | Experiment Title | Key Highlights |
|:---:|:---|:---|
| **1** | Linux/Unix File-Related System Calls | `open`, `read`, `write`, `lseek`, `stat`, `close`, `mkdir`, `link`, `unlink` |
| **2** | Linux/Unix Process-Related System Calls | `fork`, `wait`, `exec`, `exit`, `getpid`, `getppid`, Zombie & Orphan processes |
| **3** | Shell Programming Suite | Even/Odd, Prime Checker, Factorial, Fibonacci, Palindrome |
| **4** | CPU Scheduling Algorithms | FCFS, SJF (Preemptive/Non-preemptive), Round Robin, Priority Scheduling |
| **5** | Page Replacement Algorithms | FIFO, LRU, Optimal Page Replacement, Belady's Anomaly |
| **6** | Multithreading with POSIX Threads | `pthread_create`, `pthread_join`, Mutex locks, Race condition elimination |
| **7** | Linux IPC Mechanisms | Anonymous Pipes (`pipe()`), Named Pipes (FIFOs), Shared Memory, Message Queues |
| **8** | Classical Synchronization Problems | Producer-Consumer (Bounded Buffer), Dining Philosophers (Deadlock avoidance) |
| **9** | Banker's Algorithm for Deadlock | Safe Sequence generation, Need Matrix calculation, Resource Request check |
| **10** | File Allocation Methods | Contiguous (Sequential), Linked List, Indexed Allocation (Inode model) |

---

### 🌐 Computer Networks Lab (`22ITC11N`) - Exactly 12 Experiments
| Exp # | Experiment Title (R22A Syllabus) | Key Highlights |
|:---:|:---|:---|
| **1** | Write and analyze output of Network commands | `ping`, `ipconfig /all`, `arp -a`, `netstat -ano`, `tracert`, `nslookup` |
| **2** | Configure Peer to Peer Network with at least 3 hosts | P2P 3-host configuration, Star, Mesh, Packet Tracer IP setup |
| **3** | Implement Cyclic Redundancy Check (CRC) method | Modulo-2 XOR binary division, Codeword generation, Error detection |
| **4** | Configuration of Cisco Router and VLAN | Cisco 2811 static routing & Cisco 2960 switch VLAN 10/20 with 802.1Q trunking |
| **5** | Installation setup of Network simulator software | NS-2, NS-3, NetAnim, Cisco Packet Tracer, OMNeT++ step-by-step setup |
| **6** | Simulation of Star topology | NS-3 C++ simulation (`starcsma.cc`), CSMA channels, NetAnim XML animation |
| **7** | Simulation of Stop and Wait Protocol | Flow control, ACKs, timeout retransmission, efficiency $\eta = 1/(1+2a)$ |
| **8** | Simulation of Sliding Window Protocol | Go-Back-N ARQ vs Selective Repeat ARQ, Cumulative vs Individual ACKs |
| **9** | Simulation of Routing algorithms | Distance Vector (Bellman-Ford / RIP v2) & Link State (Dijkstra / OSPF) |
| **10** | Use Wireshark Packet sniffer software | TCP 3-Way Handshake, UDP, IP, ARP, ICMP, Telnet, FTP dissections |
| **11** | **Implement Socket Programming (Server - Client)** | **Python TCP server & client (`server.py` and `client.py`), bidirectional messaging** |
| **12** | Implement SMTP protocol | Python `smtplib`, STARTTLS encryption, App Passwords, RFC dialogue |

---

## 📁 Repository Structure & Preserved Coursework

All your original coursework files are **100% preserved and intact** in this repository:
- `Case Study 2 — Airline Customer Segmentation/` (Jupyter Notebook, Python scripts, Clustering report)
- `Case Study 5 — Wine Quality Assessment/` (Jupyter Notebook, Python scripts, Quality report)
- `casestudies-jupyternb/` (Consolidated Jupyter notebooks)
- `FDS case study - 2,5.pdf` (Consolidated report)
- `R22A-Schema-Syllabus-BECSE-I-VIII-Semesters-Open-Electives.pdf` (Official schema syllabus)
- `server.py` & `client.py` (Tested Python socket programming scripts)
- `index.html`, `styles.css`, `app.js`, `simulators.js`, `data-os.js`, `data-cn.js` (Interactive Practicals Web App)

---

## 🐍 Standalone Python Socket Scripts Included

For practical exams, you can also execute the included socket files directly in two terminal windows:

### Terminal 1 (Server):
```bash
python server.py
```

### Terminal 2 (Client):
```bash
python client.py
```
Type any message to send to the server (receives `"accepted"`), or type `"close"` to disconnect cleanly.

---

## 🖨️ Print / PDF Export Friendly
Press **Ctrl + P** (or click the Print icon in the top header) to generate a clean, printer-friendly cheat sheet of any experiment or viva answers for quick offline revision right outside the examination hall!

---

*Best of luck with your practical exams tomorrow! You've got this!* 🎯

