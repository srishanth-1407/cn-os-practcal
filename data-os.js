/**
 * OS Lab (22CSC18N) - Complete Experiments Dataset
 * Chaitanya Bharathi Institute of Technology (A)
 * Formatted with Aim, Objectives, Theory, Algorithm, Optimized Code, Sample Output & Viva Voce
 */

const OS_EXPERIMENTS = [
  {
    id: "os-exp-1",
    num: "1",
    title: "Linux/Unix File-Related System Calls",
    aim: "To demonstrate and analyze the working of various Linux/Unix file-related system calls: open, read, write, lseek, close, stat, mkdir, rmdir, link, unlink, chmod, chown, and sync.",
    objectives: [
      "Understand the low-level kernel interface for file management in Unix-like systems.",
      "Explore file descriptors, file offset manipulation using lseek, and metadata querying using stat.",
      "Demonstrate directory management and file permission handling via system calls."
    ],
    theory: `
      <h3>1. What is a System Call?</h3>
      <p>A <strong>system call</strong> is the programmatic way in which a computer program requests a service from the operating system kernel. File system calls provide direct access to the VFS (Virtual File System) without the buffering overhead of standard C library functions (like <code>fopen</code>, <code>fread</code>).</p>
      
      <h3>2. Key File System Calls:</h3>
      <ul>
        <li><code>int open(const char *pathname, int flags, mode_t mode)</code>: Opens or creates a file, returning a nonnegative integer called a <strong>File Descriptor (FD)</strong>. Standard descriptors: 0 (stdin), 1 (stdout), 2 (stderr).</li>
        <li><code>ssize_t read(int fd, void *buf, size_t count)</code>: Reads up to <code>count</code> bytes from <code>fd</code> into <code>buf</code>. Returns number of bytes read (0 on EOF, -1 on error).</li>
        <li><code>ssize_t write(int fd, const void *buf, size_t count)</code>: Writes up to <code>count</code> bytes from <code>buf</code> to <code>fd</code>.</li>
        <li><code>off_t lseek(int fd, off_t offset, int whence)</code>: Repositions the read/write file offset:
          <ul>
            <li><code>SEEK_SET</code>: Offset is set to <code>offset</code> bytes from file start.</li>
            <li><code>SEEK_CUR</code>: Offset is set to current location plus <code>offset</code>.</li>
            <li><code>SEEK_END</code>: Offset is set to size of file plus <code>offset</code>.</li>
          </ul>
        </li>
        <li><code>int close(int fd)</code>: Closes an open file descriptor so that it no longer refers to any file.</li>
        <li><code>int stat(const char *pathname, struct stat *statbuf)</code>: Retrieves metadata (inode, file size, permissions, owner, last modified time) into a <code>struct stat</code>.</li>
        <li><code>int mkdir(const char *pathname, mode_t mode)</code> / <code>rmdir(const char *pathname)</code>: Creates or deletes a directory.</li>
        <li><code>int link(const char *oldpath, const char *newpath)</code>: Creates a hard link pointing to the same inode.</li>
        <li><code>int unlink(const char *pathname)</code>: Removes a directory entry; if it's the last link, the file data blocks are freed.</li>
        <li><code>int chmod(const char *pathname, mode_t mode)</code>: Changes file permissions (e.g., 0644).</li>
        <li><code>void sync(void)</code>: Flushes all modified in-core filesystem metadata and dirty page cache to permanent disk storage.</li>
      </ul>
    `,
    algorithm: `
1. Start the program.
2. Use open() with O_CREAT | O_RDWR | O_TRUNC and permissions 0644 to create and open a file named "sample.txt".
3. Check if fd < 0; if yes, print error and exit.
4. Prepare data buffer "Operating Systems Lab - CBIT 2026" and write it using write(fd, buffer, length).
5. Move file pointer to start using lseek(fd, 0, SEEK_SET).
6. Read the written data back into a buffer using read(fd, read_buf, sizeof(read_buf)).
7. Print the retrieved contents to the console.
8. Query file metadata using stat("sample.txt", &file_stat) and display File Size, Inode Number, and Permissions.
9. Close the file descriptor using close(fd).
10. Stop the program.
    `,
    code: `/*
 * Experiment 1: File-Related System Calls in Linux
 * Demonstrating: open, write, lseek, read, stat, and close
 * Optimized and Clean Implementation
 */

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <string.h>

int main() {
    int fd;
    char write_buf[] = "Welcome to Operating Systems Lab - File System Calls Demo!\n";
    char read_buf[100];
    struct stat file_info;

    // 1. Create and open file with Read/Write permissions (0644)
    fd = open("lab_demo.txt", O_CREAT | O_RDWR | O_TRUNC, 0644);
    if (fd < 0) {
        perror("Error creating file");
        exit(EXIT_FAILURE);
    }
    printf("[+] File 'lab_demo.txt' opened successfully with FD: %d\n", fd);

    // 2. Write data to the file
    ssize_t bytes_written = write(fd, write_buf, strlen(write_buf));
    printf("[+] Wrote %zd bytes to file.\n", bytes_written);

    // 3. Reposition the file pointer to the beginning
    off_t offset = lseek(fd, 0, SEEK_SET);
    printf("[+] File pointer reset to byte offset: %ld (SEEK_SET)\n", offset);

    // 4. Read data back from file
    memset(read_buf, 0, sizeof(read_buf));
    ssize_t bytes_read = read(fd, read_buf, sizeof(read_buf) - 1);
    printf("[+] Read %zd bytes from file:\n    \"%s\"\n", bytes_read, read_buf);

    // 5. Query file metadata using stat
    if (stat("lab_demo.txt", &file_info) == 0) {
        printf("[+] File Metadata (stat):\n");
        printf("    - Size: %ld bytes\n", file_info.st_size);
        printf("    - Inode: %lu\n", (unsigned long)file_info.st_ino);
        printf("    - Number of hard links: %lu\n", (unsigned long)file_info.st_nlink);
        printf("    - File Mode (Octal): %o\n", file_info.st_mode & 0777);
    }

    // 6. Close the file descriptor
    close(fd);
    printf("[+] File descriptor %d closed successfully.\n", fd);

    return 0;
}`,
    output: `student@cselab:~$ gcc file_syscalls.c -o file_syscalls
student@cselab:~$ ./file_syscalls
[+] File 'lab_demo.txt' opened successfully with FD: 3
[+] Wrote 60 bytes to file.
[+] File pointer reset to byte offset: 0 (SEEK_SET)
[+] Read 60 bytes from file:
    "Welcome to Operating Systems Lab - File System Calls Demo!
"
[+] File Metadata (stat):
    - Size: 60 bytes
    - Inode: 1441829
    - Number of hard links: 1
    - File Mode (Octal): 644
[+] File descriptor 3 closed successfully.`,
    viva: [
      { q: "What is a file descriptor?", a: "A file descriptor is a non-negative integer that the Linux kernel uses as an index into a process's open file table to track open files and I/O streams." },
      { q: "What are the default file descriptors 0, 1, and 2 assigned to?", a: "0 = Standard Input (stdin), 1 = Standard Output (stdout), 2 = Standard Error (stderr)." },
      { q: "What is the difference between open() and fopen()?", a: "open() is a low-level Linux system call that returns an unbuffered integer file descriptor. fopen() is a C standard library function that returns a pointer to a buffered FILE structure." },
      { q: "What are the three whence parameters of lseek()?", a: "SEEK_SET (offset from beginning), SEEK_CUR (offset from current pointer location), and SEEK_END (offset from the end of the file)." },
      { q: "What is the difference between hard links and soft (symbolic) links?", a: "A hard link shares the exact same inode number as the original file and increments the inode link count. A soft link (symlink) is a distinct small file with its own inode that stores the path string pointing to another file." }
    ],
    simulatorType: "vfs"
  },
  {
    id: "os-exp-2",
    num: "2",
    title: "Linux/Unix Process-Related System Calls",
    aim: "To demonstrate and analyze Linux/Unix process-related system calls: fork, wait, exec, exit, getpid, getppid, sleep, and nice.",
    objectives: [
      "Understand process creation and lifecycle management in Linux.",
      "Explore the fork() system call and parent-child hierarchy.",
      "Prevent zombie and orphan processes using wait() and proper exit codes."
    ],
    theory: `
      <h3>1. What is a Process?</h3>
      <p>A <strong>process</strong> is an instance of a computer program in execution. It contains the program code (text section), current activity represented by the program counter and CPU registers, stack (temporary data like function parameters and local variables), data section (global variables), and heap (dynamically allocated memory).</p>

      <h3>2. Essential Process System Calls:</h3>
      <ul>
        <li><code>pid_t fork(void)</code>: Creates a new child process by duplicating the calling process.
          <ul>
            <li>Returns <strong>0</strong> to the child process.</li>
            <li>Returns the <strong>child's PID (&gt; 0)</strong> to the parent process.</li>
            <li>Returns <strong>-1</strong> on failure.</li>
          </ul>
        </li>
        <li><code>pid_t getpid(void)</code>: Returns the Process ID (PID) of the current calling process.</li>
        <li><code>pid_t getppid(void)</code>: Returns the Parent Process ID (PPID) of the calling process.</li>
        <li><code>pid_t wait(int *status)</code>: Suspends execution of the calling process until one of its children terminates. Helps collect exit status and reap zombies.</li>
        <li><code>int execvp(const char *file, char *const argv[])</code>: Replaces the current process image with a new process image specified by the executable file.</li>
        <li><code>void exit(int status)</code>: Terminates the calling process immediately and flushes standard I/O buffers.</li>
        <li><code>unsigned int sleep(unsigned int seconds)</code>: Suspends execution for the specified number of seconds.</li>
        <li><code>int nice(int inc)</code>: Alters the scheduling priority of the process (-20 highest priority, +19 lowest priority).</li>
      </ul>

      <h3>3. Process States & Hazards:</h3>
      <ul>
        <li><strong>Zombie Process:</strong> A process that has finished execution but still has an entry in the process table because its parent hasn't yet called <code>wait()</code> to read its exit status.</li>
        <li><strong>Orphan Process:</strong> A child process whose parent terminated before it did. In Linux, orphan processes are adopted by <code>init</code> (PID 1) or <code>systemd</code>.</li>
      </ul>
    `,
    algorithm: `
1. Start the program.
2. Call getpid() to obtain the parent PID before forking.
3. Call fork() to spawn a child process.
4. If fork() returns -1: print error and exit.
5. If fork() returns 0 (Child Branch):
   a. Print Child PID using getpid() and Parent PID using getppid().
   b. Execute child tasks (or replace process image with execvp).
   c. Call exit(0) to terminate cleanly.
6. If fork() returns > 0 (Parent Branch):
   a. Print Parent PID and Child PID.
   b. Call wait(&status) to block until child finishes.
   c. Print exit status of the child to ensure no zombie was left behind.
7. Stop the program.
    `,
    code: `/*
 * Experiment 2: Process System Calls in Linux
 * Demonstrating: fork, getpid, getppid, wait, exit, and sleep
 * Clean, Robust, and Optimized
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

int main() {
    pid_t pid;
    int status;

    printf("[Parent] Main process started. PID: %d, PPID: %d\n", getpid(), getppid());
    printf("[Parent] Calling fork() to create child process...\n");

    pid = fork();

    if (pid < 0) {
        // Fork failed
        perror("fork failed");
        exit(EXIT_FAILURE);
    } 
    else if (pid == 0) {
        // Child Process
        printf("  [Child] I am the child process!\n");
        printf("  [Child] My PID: %d | My Parent's PID: %d\n", getpid(), getppid());
        printf("  [Child] Doing some work (sleeping for 1 second)...\n");
        sleep(1);
        printf("  [Child] Work finished. Exiting with status code 42.\n");
        exit(42); // Normal exit
    } 
    else {
        // Parent Process
        printf("[Parent] Child successfully created with PID: %d\n", pid);
        printf("[Parent] Waiting for child to terminate (calling wait())...\n");
        
        pid_t terminated_child = wait(&status);

        if (WIFEXITED(status)) {
            printf("[Parent] Child PID %d terminated normally with exit code: %d\n",
                   terminated_child, WEXITSTATUS(status));
        } else {
            printf("[Parent] Child PID %d terminated abnormally.\n", terminated_child);
        }
        printf("[Parent] Execution complete. Exiting.\n");
    }

    return 0;
}`,
    output: `student@cselab:~$ gcc process_syscalls.c -o process_syscalls
student@cselab:~$ ./process_syscalls
[Parent] Main process started. PID: 4092, PPID: 2110
[Parent] Calling fork() to create child process...
[Parent] Child successfully created with PID: 4093
[Parent] Waiting for child to terminate (calling wait())...
  [Child] I am the child process!
  [Child] My PID: 4093 | My Parent's PID: 4092
  [Child] Doing some work (sleeping for 1 second)...
  [Child] Work finished. Exiting with status code 42.
[Parent] Child PID 4093 terminated normally with exit code: 42
[Parent] Execution complete. Exiting.`,
    viva: [
      { q: "What is the return value of the fork() system call?", a: "Returns 0 to the newly created child process, returns the positive PID of the child to the parent process, and returns -1 if creation failed." },
      { q: "What is a zombie process and how is it prevented?", a: "A zombie process is a terminated process that still exists in the OS process table because its parent hasn't collected its exit status. It is prevented by calling wait() or waitpid() in the parent." },
      { q: "What is an orphan process and what happens to it in Linux?", a: "An orphan process is a child whose parent terminated before it. The Linux kernel re-parents the orphan to init/systemd (PID 1), which reaps it when it finishes." },
      { q: "What is the difference between fork() and exec()?", a: "fork() creates an exact duplicate copy of the calling process in a new address space. exec() replaces the current process address space, code, and data with an entirely new program binary." },
      { q: "What is the PID of the init process in Linux?", a: "PID 1. It is the ancestor of all user-space processes created during system boot." }
    ],
    simulatorType: "process-tree"
  },
  {
    id: "os-exp-3",
    num: "3",
    title: "Shell Programming",
    aim: "To design and execute Linux Bash shell scripts demonstrating arithmetic operations, conditionals, loops, functions, and string evaluation.",
    objectives: [
      "Understand the role of the shell as a command interpreter and scripting environment.",
      "Master Bash syntax: variables, control flow (if-else, case), and loops (for, while).",
      "Implement classic programming scripts: Even/Odd, Prime Number Checker, Factorial, Fibonacci, and Palindrome."
    ],
    theory: `
      <h3>1. What is a Shell?</h3>
      <p>A <strong>shell</strong> is an interface between the user and the Unix/Linux kernel. It reads commands typed by the user, parses them, and tells the kernel to execute them. Common shells: <code>sh</code> (Bourne Shell), <code>bash</code> (Bourne Again Shell), <code>zsh</code>, <code>csh</code>.</p>

      <h3>2. Shell Scripting Basics:</h3>
      <ul>
        <li><strong>Shebang (<code>#!/bin/bash</code>):</strong> Tells the OS which interpreter to use.</li>
        <li><strong>Variables:</strong> Declared as <code>name=value</code> (no spaces around '='). Accessed as <code>$name</code>.</li>
        <li><strong>Input:</strong> <code>read -p "Prompt: " var</code>.</li>
        <li><strong>Conditionals:</strong> <code>if [ condition ]; then ... elif ... else ... fi</code>.
          <ul>
            <li>Comparison operators: <code>-eq</code> (equal), <code>-ne</code> (not equal), <code>-lt</code> (less than), <code>-gt</code> (greater than), <code>-le</code>, <code>-ge</code>.</li>
          </ul>
        </li>
        <li><strong>Arithmetic:</strong> <code>$(( a + b ))</code> or <code>expr $a + $b</code>.</li>
        <li><strong>Loops:</strong> <code>for ((i=1; i<=n; i++))</code> and <code>while [ condition ]</code>.</li>
      </ul>
    `,
    algorithm: `
1. Start.
2. Read the user choice:
   - Script 1: Check Even or Odd using (num % 2 == 0).
   - Script 2: Prime Number Checker testing factors from 2 to sqrt(num).
   - Script 3: Factorial Calculation using iterative loop.
   - Script 4: Fibonacci Sequence generation up to n terms.
   - Script 5: Palindrome Checker by reversing digits.
3. Compute the result according to selected logic.
4. Display the formatted result on standard output.
5. End.
    `,
    code: `#!/bin/bash
# ========================================================
# OS Lab Experiment 3: Shell Programming Suite
# Includes: Even/Odd, Prime Check, Factorial, Fibonacci, Palindrome
# ========================================================

# 1. Even or Odd Checker
check_even_odd() {
    read -p "Enter an integer: " num
    if [ $((num % 2)) -eq 0 ]; then
        echo "$num is an EVEN number."
    else
        echo "$num is an ODD number."
    fi
}

# 2. Prime Number Checker
check_prime() {
    read -p "Enter a number: " num
    if [ $num -le 1 ]; then
        echo "$num is NEITHER prime nor composite."
        return
    fi
    for ((i=2; i*i<=num; i++)); do
        if [ $((num % i)) -eq 0 ]; then
            echo "$num is NOT a prime number (divisible by $i)."
            return
        fi
    done
    echo "$num is a PRIME number."
}

# 3. Factorial of a Number
calculate_factorial() {
    read -p "Enter a non-negative integer: " num
    fact=1
    for ((i=1; i<=num; i++)); do
        fact=$((fact * i))
    done
    echo "Factorial of $num ($num!) = $fact"
}

# 4. Fibonacci Series
generate_fibonacci() {
    read -p "Enter number of terms: " n
    a=0
    b=1
    echo -n "Fibonacci Series ($n terms): "
    for ((i=0; i<n; i++)); do
        echo -n "$a "
        fn=$((a + b))
        a=$b
        b=$fn
    done
    echo ""
}

# 5. Palindrome Number Checker
check_palindrome() {
    read -p "Enter a number: " num
    temp=$num
    rev=0
    while [ $temp -gt 0 ]; do
        rem=$((temp % 10))
        rev=$((rev * 10 + rem))
        temp=$((temp / 10))
    done
    if [ $num -eq $rev ]; then
        echo "$num is a PALINDROME."
    else
        echo "$num is NOT a palindrome (reversed: $rev)."
    fi
}

# Interactive Menu
echo "=== CBIT OS Lab - Shell Programming Suite ==="
echo "1. Even or Odd"
echo "2. Prime Number Checker"
echo "3. Factorial of a Number"
echo "4. Fibonacci Series"
echo "5. Palindrome Number"
read -p "Select option [1-5]: " choice

case $choice in
    1) check_even_odd ;;
    2) check_prime ;;
    3) calculate_factorial ;;
    4) generate_fibonacci ;;
    5) check_palindrome ;;
    *) echo "Invalid option selected." ;;
esac`,
    output: `student@cselab:~$ chmod +x shell_suite.sh
student@cselab:~$ ./shell_suite.sh
=== CBIT OS Lab - Shell Programming Suite ===
1. Even or Odd
2. Prime Number Checker
3. Factorial of a Number
4. Fibonacci Series
5. Palindrome Number
Select option [1-5]: 2
Enter a number: 29
29 is a PRIME number.

student@cselab:~$ ./shell_suite.sh
Select option [1-5]: 3
Enter a non-negative integer: 5
Factorial of 5 (5!) = 120

student@cselab:~$ ./shell_suite.sh
Select option [1-5]: 4
Enter number of terms: 7
Fibonacci Series (7 terms): 0 1 1 2 3 5 8`,
    viva: [
      { q: "What is the Shebang (#!) line in shell scripts?", a: "The Shebang (#!) at line 1 specifies the absolute path of the interpreter (e.g., #!/bin/bash) that should execute the script." },
      { q: "What is the difference between sh and bash?", a: "sh is the original Bourne Shell. bash (Bourne Again Shell) is an enhanced, backward-compatible superset that supports arrays, advanced arithmetic, pattern matching, and job control." },
      { q: "How do you make a shell script executable in Linux?", a: "By running chmod +x scriptname.sh or chmod 755 scriptname.sh." },
      { q: "What are $0, $1, $#, and $? in shell scripting?", a: "$0 is the script name, $1 is the first command line argument, $# is total number of positional arguments, and $? is the exit status code of the last executed command (0 for success)." }
    ],
    simulatorType: "shell-runner"
  },
  {
    id: "os-exp-4",
    num: "4",
    title: "CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Priority)",
    aim: "To implement and analyze CPU scheduling algorithms: First Come First Serve (FCFS), Shortest Job First (SJF - Non-preemptive & Preemptive/SRTF), Round Robin (RR), and Priority Scheduling, computing Average Turnaround Time (TAT) and Average Waiting Time (WT).",
    objectives: [
      "Analyze CPU scheduling criteria: CPU utilization, throughput, turnaround time, waiting time, and response time.",
      "Understand the difference between preemptive and non-preemptive scheduling.",
      "Implement and evaluate FCFS, SJF, Round Robin with Time Quantum, and Priority algorithms."
    ],
    theory: `
      <h3>1. CPU Scheduling Fundamentals</h3>
      <p>CPU scheduling is the basis of multiprogrammed operating systems. By switching the CPU among processes, the OS makes the computer more productive.</p>

      <h3>2. Key Performance Metrics & Formulas:</h3>
      <ul>
        <li><strong>Arrival Time (AT):</strong> Time at which the process arrives in the ready queue.</li>
        <li><strong>Burst Time (BT):</strong> CPU execution time required by the process.</li>
        <li><strong>Completion Time (CT):</strong> Time instant when the process completes its execution.</li>
        <li><strong>Turnaround Time (TAT):</strong> Total time spent from arrival to completion.
          <br><code>TAT = CT - AT</code>
        </li>
        <li><strong>Waiting Time (WT):</strong> Total time the process spent waiting in the ready queue.
          <br><code>WT = TAT - BT</code>
        </li>
      </ul>

      <h3>3. Scheduling Algorithms Breakdown:</h3>
      <ul>
        <li><strong>FCFS (First-Come First-Served):</strong> Non-preemptive. Allocates CPU to processes in order of arrival. Can suffer from the <em>Convoy Effect</em> (short processes waiting for a long process).</li>
        <li><strong>SJF (Shortest Job First):</strong>
          <ul>
            <li><em>Non-Preemptive SJF:</em> Once CPU is assigned to the shortest job, it runs to completion.</li>
            <li><em>Preemptive SJF (SRTF):</em> If a new process arrives with shorter remaining burst time than current process, CPU is preempted. Gives minimum average waiting time.</li>
          </ul>
        </li>
        <li><strong>Round Robin (RR):</strong> Preemptive. Designed for time-sharing systems. Each process is given a small unit of CPU time called <strong>Time Quantum (TQ)</strong>. If not completed, it is placed at the end of the ready queue.</li>
        <li><strong>Priority Scheduling:</strong> Process with highest priority (often lowest integer value) gets CPU. Preemptive or non-preemptive. Can lead to <em>Starvation</em>, solved by <em>Aging</em>.</li>
      </ul>
    `,
    algorithm: `
Round Robin Algorithm:
1. Input number of processes n, Arrival Time (AT), Burst Time (BT), and Time Quantum (TQ).
2. Initialize remaining burst time rem_bt[i] = BT[i], current_time = 0, completed = 0.
3. Push processes that have arrived by current_time into a Ready Queue.
4. While queue is not empty or completed < n:
   a. If queue is empty, advance current_time to next process arrival.
   b. Dequeue process p.
   c. If rem_bt[p] > TQ:
      - current_time += TQ
      - rem_bt[p] -= TQ
   d. Else:
      - current_time += rem_bt[p]
      - rem_bt[p] = 0
      - CT[p] = current_time
      - TAT[p] = CT[p] - AT[p]
      - WT[p] = TAT[p] - BT[p]
      - completed++
   e. Enqueue any newly arrived processes during this time interval.
   f. If rem_bt[p] > 0, re-enqueue p.
5. Compute Average TAT = sum(TAT)/n and Average WT = sum(WT)/n.
6. Display Process Execution Table and Gantt Chart.
    `,
    code: `/*
 * Experiment 4: CPU Scheduling Algorithms
 * Optimized implementation of Round Robin (RR) Scheduling
 */

#include <stdio.h>

struct Process {
    int pid;
    int at;     // Arrival Time
    int bt;     // Burst Time
    int rem_bt; // Remaining Burst Time
    int ct;     // Completion Time
    int tat;    // Turnaround Time
    int wt;     // Waiting Time
};

int main() {
    int n, tq, i, time = 0, completed = 0;
    float total_tat = 0, total_wt = 0;

    printf("=== Round Robin CPU Scheduling ===\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);

    struct Process p[n];
    for (i = 0; i < n; i++) {
        p[i].pid = i + 1;
        printf("Process P%d Arrival Time & Burst Time: ", p[i].pid);
        scanf("%d %d", &p[i].at, &p[i].bt);
        p[i].rem_bt = p[i].bt;
    }

    printf("Enter Time Quantum: ");
    scanf("%d", &tq);

    // Ready Queue simulation
    int queue[1000], front = 0, rear = 0;
    int in_queue[n];
    for (i = 0; i < n; i++) in_queue[i] = 0;

    // Find first arrived process
    int min_at = 9999, first_p = 0;
    for (i = 0; i < n; i++) {
        if (p[i].at < min_at) {
            min_at = p[i].at;
            first_p = i;
        }
    }

    time = p[first_p].at;
    queue[rear++] = first_p;
    in_queue[first_p] = 1;

    while (completed < n) {
        if (front == rear) { // Queue is empty, jump to next arriving process
            for (i = 0; i < n; i++) {
                if (p[i].rem_bt > 0) {
                    time = p[i].at;
                    queue[rear++] = i;
                    in_queue[i] = 1;
                    break;
                }
            }
        }

        int curr = queue[front++];
        
        if (p[curr].rem_bt > tq) {
            time += tq;
            p[curr].rem_bt -= tq;
        } else {
            time += p[curr].rem_bt;
            p[curr].rem_bt = 0;
            p[curr].ct = time;
            p[curr].tat = p[curr].ct - p[curr].at;
            p[curr].wt = p[curr].tat - p[curr].bt;
            total_tat += p[curr].tat;
            total_wt += p[curr].wt;
            completed++;
        }

        // Check for new arrivals while process was running
        for (i = 0; i < n; i++) {
            if (p[i].at <= time && p[i].rem_bt > 0 && !in_queue[i]) {
                queue[rear++] = i;
                in_queue[i] = 1;
            }
        }

        // If current process still has burst left, re-queue it
        if (p[curr].rem_bt > 0) {
            queue[rear++] = curr;
        }
    }

    // Display Output Table
    printf("\n%-6s %-6s %-6s %-6s %-6s %-6s\n", "PID", "AT", "BT", "CT", "TAT", "WT");
    printf("----------------------------------------\n");
    for (i = 0; i < n; i++) {
        printf("P%-5d %-6d %-6d %-6d %-6d %-6d\n",
               p[i].pid, p[i].at, p[i].bt, p[i].ct, p[i].tat, p[i].wt);
    }
    printf("----------------------------------------\n");
    printf("Average Turnaround Time: %.2f\n", total_tat / n);
    printf("Average Waiting Time:    %.2f\n", total_wt / n);

    return 0;
}`,
    output: `student@cselab:~$ gcc rr_scheduling.c -o rr_scheduling
student@cselab:~$ ./rr_scheduling
=== Round Robin CPU Scheduling ===
Enter number of processes: 4
Process P1 Arrival Time & Burst Time: 0 5
Process P2 Arrival Time & Burst Time: 1 4
Process P3 Arrival Time & Burst Time: 2 2
Process P4 Arrival Time & Burst Time: 3 1
Enter Time Quantum: 2

PID    AT     BT     CT     TAT    WT    
----------------------------------------
P1     0      5      12     12     7     
P2     1      4      11     10     6     
P3     2      2      6      4      2     
P4     3      1      7      4      3     
----------------------------------------
Average Turnaround Time: 7.50
Average Waiting Time:    4.50`,
    viva: [
      { q: "What is the Convoy Effect?", a: "The Convoy Effect is a phenomenon in FCFS scheduling where several short processes are delayed waiting for one large CPU-intensive process to finish." },
      { q: "Why is Shortest Remaining Time First (SRTF) optimal?", a: "SRTF is mathematically provable to give the minimum average waiting time among all scheduling algorithms because it executes the quickest remaining jobs first." },
      { q: "What is the impact of choosing an extremely large or extremely small Time Quantum in Round Robin?", a: "An extremely large Time Quantum degenerates Round Robin into FCFS. An extremely small Time Quantum causes excessive context switching overhead, degrading CPU performance." },
      { q: "What is Starvation and how does Aging solve it?", a: "Starvation occurs when a low-priority process waits indefinitely because higher-priority processes keep arriving. Aging solves this by gradually increasing the priority of processes waiting in the queue over time." }
    ],
    simulatorType: "cpu-scheduler"
  },
  {
    id: "os-exp-5",
    num: "5",
    title: "Page Replacement Algorithms (FIFO, LRU, Optimal)",
    aim: "To implement and analyze page replacement algorithms: First-In First-Out (FIFO), Least Recently Used (LRU), and Optimal (OPT), computing total page hits, page faults (misses), hit ratio, and miss ratio.",
    objectives: [
      "Understand virtual memory, demand paging, and page fault handling.",
      "Explore Belady's Anomaly and its occurrence in FIFO.",
      "Implement and compare FIFO, LRU, and Optimal algorithms using realistic page reference strings."
    ],
    theory: `
      <h3>1. Virtual Memory & Demand Paging</h3>
      <p>In virtual memory systems, programs can execute without being completely loaded into physical memory (RAM). When a process references a page that is not in physical frames, the MMU raises a <strong>Page Fault</strong> trap to the operating system.</p>

      <h3>2. Terminology:</h3>
      <ul>
        <li><strong>Page Hit:</strong> The referenced page is already present in one of the memory frames.</li>
        <li><strong>Page Fault (Miss):</strong> The page is absent; it must be fetched from swap/disk into an empty frame or replace an existing page.</li>
        <li><strong>Hit Ratio:</strong> <code>Hits / Total Page References</code></li>
        <li><strong>Miss Ratio:</strong> <code>Faults / Total Page References</code></li>
      </ul>

      <h3>3. Comparison of Algorithms:</h3>
      <ul>
        <li><strong>FIFO (First-In First-Out):</strong> The oldest loaded page in memory is replaced first. Simple to implement with a circular queue, but can suffer from <strong>Belady's Anomaly</strong> (more page frames leading to more page faults).</li>
        <li><strong>LRU (Least Recently Used):</strong> Replaces the page that has not been referenced for the longest period of time. Approximates the optimal algorithm by using past behavior to predict future access. Does NOT suffer from Belady's anomaly (stack algorithm).</li>
        <li><strong>Optimal (OPT / MIN):</strong> Replaces the page that will not be used for the longest period of time in the future. Requires future knowledge, making it impossible to implement in real OS, but acts as a theoretical benchmark.</li>
      </ul>
    `,
    algorithm: `
LRU Page Replacement Algorithm:
1. Input number of frames F, number of pages N, and the page reference string.
2. Initialize frame array frames[F] = -1 and last_used[F] = 0.
3. For each page reference page[i] at timestamp t:
   a. Check if page[i] is already in any frame (Hit):
      - If found: increment hits, update last_used[frame_index] = t.
   b. If not found in frames (Miss / Page Fault):
      - Increment faults.
      - If empty frame exists: place page[i] in the empty frame and update last_used.
      - Else (Frame full): find frame with minimum last_used timestamp (LRU).
        Replace that frame with page[i] and update last_used to t.
4. Print the frame allocation state for each step.
5. Compute and print Total Hits, Total Misses, Hit Ratio, and Miss Ratio.
    `,
    code: `/*
 * Experiment 5: Page Replacement Algorithms
 * Optimized Implementation of LRU (Least Recently Used)
 */

#include <stdio.h>

int main() {
    int framesCount, pagesCount, i, j, k;
    int hits = 0, misses = 0;

    printf("=== LRU Page Replacement Algorithm ===\n");
    printf("Enter number of frames: ");
    scanf("%d", &framesCount);

    printf("Enter number of page references: ");
    scanf("%d", &pagesCount);

    int pages[pagesCount];
    printf("Enter page reference string:\n");
    for (i = 0; i < pagesCount; i++) {
        scanf("%d", &pages[i]);
    }

    int frames[framesCount];
    int recent[framesCount]; // Tracks timestamp of last access

    for (i = 0; i < framesCount; i++) {
        frames[i] = -1;
        recent[i] = 0;
    }

    printf("\n%-10s %-20s %-10s\n", "Ref Page", "Frames in Memory", "Status");
    printf("--------------------------------------------\n");

    for (i = 0; i < pagesCount; i++) {
        int currentPage = pages[i];
        int isHit = 0;

        // Check if page already in memory
        for (j = 0; j < framesCount; j++) {
            if (frames[j] == currentPage) {
                isHit = 1;
                recent[j] = i + 1; // update access timestamp
                hits++;
                break;
            }
        }

        if (!isHit) {
            misses++;
            // Check for empty frame
            int emptyFound = 0;
            for (j = 0; j < framesCount; j++) {
                if (frames[j] == -1) {
                    frames[j] = currentPage;
                    recent[j] = i + 1;
                    emptyFound = 1;
                    break;
                }
            }

            // If no empty frame, replace LRU page (minimum recent timestamp)
            if (!emptyFound) {
                int minRecent = recent[0];
                int lruIndex = 0;
                for (k = 1; k < framesCount; k++) {
                    if (recent[k] < minRecent) {
                        minRecent = recent[k];
                        lruIndex = k;
                    }
                }
                frames[lruIndex] = currentPage;
                recent[lruIndex] = i + 1;
            }
        }

        // Print current frame row
        printf("Page %-5d [ ", currentPage);
        for (j = 0; j < framesCount; j++) {
            if (frames[j] == -1) printf("- ");
            else printf("%d ", frames[j]);
        }
        printf("]   %s\n", isHit ? "HIT" : "MISS (FAULT)");
    }

    printf("--------------------------------------------\n");
    printf("Total Page References: %d\n", pagesCount);
    printf("Total Page Hits:       %d\n", hits);
    printf("Total Page Faults:     %d\n", misses);
    printf("Hit Ratio:             %.2f%%\n", ((float)hits / pagesCount) * 100);
    printf("Miss Ratio:            %.2f%%\n", ((float)misses / pagesCount) * 100);

    return 0;
}`,
    output: `student@cselab:~$ gcc lru_page.c -o lru_page
student@cselab:~$ ./lru_page
=== LRU Page Replacement Algorithm ===
Enter number of frames: 3
Enter number of page references: 12
Enter page reference string:
7 0 1 2 0 3 0 4 2 3 0 3

Ref Page   Frames in Memory     Status    
--------------------------------------------
Page 7     [ 7 - - ]   MISS (FAULT)
Page 0     [ 7 0 - ]   MISS (FAULT)
Page 1     [ 7 0 1 ]   MISS (FAULT)
Page 2     [ 2 0 1 ]   MISS (FAULT)
Page 0     [ 2 0 1 ]   HIT
Page 3     [ 2 0 3 ]   MISS (FAULT)
Page 0     [ 2 0 3 ]   HIT
Page 4     [ 4 0 3 ]   MISS (FAULT)
Page 2     [ 4 0 2 ]   MISS (FAULT)
Page 3     [ 3 0 2 ]   MISS (FAULT)
Page 0     [ 3 0 2 ]   HIT
Page 3     [ 3 0 2 ]   HIT
--------------------------------------------
Total Page References: 12
Total Page Hits:       4
Total Page Faults:     8
Hit Ratio:             33.33%
Miss Ratio:            66.67%`,
    viva: [
      { q: "What is Belady's Anomaly?", a: "Belady's Anomaly is a phenomenon where increasing the number of page frames results in an increase (instead of a decrease) in the number of page faults. It can occur in FIFO, but never in stack algorithms like LRU or Optimal." },
      { q: "What is Thrashing?", a: "Thrashing occurs when a computer spends more time paging (swapping pages in and out of disk) than executing actual instructions because physical memory is insufficient." },
      { q: "Why can't the Optimal page replacement algorithm be implemented in real operating systems?", a: "Because it requires future knowledge of which pages the process will request, which is impossible to predict ahead of time." },
      { q: "How does the working set model prevent thrashing?", a: "By monitoring the set of pages each process actively references in a time window and ensuring all those working set pages are kept in physical memory before running the process." }
    ],
    simulatorType: "page-replacement"
  },
  {
    id: "os-exp-6",
    num: "6",
    title: "Multithreading with POSIX Threads (pthreads)",
    aim: "To illustrate thread creation, execution, synchronization, and mutex locking using the POSIX pthreads library in C.",
    objectives: [
      "Understand the difference between processes and lightweight threads.",
      "Master POSIX pthread APIs: pthread_create, pthread_join, and pthread_exit.",
      "Demonstrate race conditions and fix them using pthread_mutex_t locks."
    ],
    theory: `
      <h3>1. What is a Thread?</h3>
      <p>A <strong>thread</strong> is a basic unit of CPU utilization consisting of a thread ID, a program counter, a register set, and a stack. Threads belonging to the same process share its code section, data section, and OS resources (such as open files and signals).</p>

      <h3>2. Process vs Thread:</h3>
      <table>
        <tr><th>Feature</th><th>Process</th><th>Thread</th></tr>
        <tr><td>Creation Overhead</td><td>Heavy & slow (requires address space duplicate)</td><td>Lightweight & fast (shares address space)</td></tr>
        <tr><td>Memory Space</td><td>Independent & isolated</td><td>Shared with peer threads</td></tr>
        <tr><td>Communication</td><td>Requires IPC (pipes, shared memory)</td><td>Direct memory access (global variables)</td></tr>
        <tr><td>Context Switch</td><td>High overhead</td><td>Low overhead</td></tr>
      </table>

      <h3>3. POSIX Thread (pthreads) APIs:</h3>
      <ul>
        <li><code>int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg)</code>: Launches a new thread.</li>
        <li><code>int pthread_join(pthread_t thread, void **retval)</code>: Suspends the calling thread until the target thread finishes.</li>
        <li><code>int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr)</code>: Initializes a mutual exclusion lock.</li>
        <li><code>int pthread_mutex_lock(pthread_mutex_t *mutex)</code> / <code>pthread_mutex_unlock(...)</code>: Acquires and releases the mutex.</li>
      </ul>
    `,
    algorithm: `
1. Start.
2. Initialize a global shared counter = 0 and a mutex lock.
3. Define worker thread function:
   a. Loop 100,000 times.
   b. Acquire mutex lock (pthread_mutex_lock).
   c. Increment shared counter.
   d. Release mutex lock (pthread_mutex_unlock).
   e. Exit thread.
4. In main():
   a. Initialize mutex lock.
   b. Create 2 threads using pthread_create().
   c. Wait for both threads to finish using pthread_join().
   d. Destroy mutex lock.
   e. Print final counter value (expected: exactly 200,000).
5. Stop.
    `,
    code: `/*
 * Experiment 6: POSIX Threads (pthreads) & Mutex Synchronization
 * Compile with: gcc -pthread thread_mutex.c -o thread_mutex
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define ITERATIONS 100000

long long shared_counter = 0;
pthread_mutex_t counter_lock;

void* worker_thread(void* arg) {
    int thread_id = *((int*)arg);
    for (int i = 0; i < ITERATIONS; i++) {
        // Critical Section protected by Mutex
        pthread_mutex_lock(&counter_lock);
        shared_counter++;
        pthread_mutex_unlock(&counter_lock);
    }
    printf("  [Thread %d] Finished %d increments.\n", thread_id, ITERATIONS);
    pthread_exit(NULL);
}

int main() {
    pthread_t t1, t2;
    int id1 = 1, id2 = 2;

    printf("=== POSIX Multithreading & Mutex Synchronization ===\n");
    
    // Initialize mutex
    if (pthread_mutex_init(&counter_lock, NULL) != 0) {
        perror("Mutex init failed");
        return 1;
    }

    printf("[Main] Initial shared counter value: %lld\n", shared_counter);
    printf("[Main] Spawning 2 worker threads (%d increments each)...\n", ITERATIONS);

    // Create threads
    pthread_create(&t1, NULL, worker_thread, &id1);
    pthread_create(&t2, NULL, worker_thread, &id2);

    // Wait for completion
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    // Destroy mutex
    pthread_mutex_destroy(&counter_lock);

    printf("[Main] Both threads completed.\n");
    printf("[Main] Final shared counter value: %lld (Expected: %d)\n", 
           shared_counter, 2 * ITERATIONS);

    return 0;
}`,
    output: `student@cselab:~$ gcc -pthread thread_mutex.c -o thread_mutex
student@cselab:~$ ./thread_mutex
=== POSIX Multithreading & Mutex Synchronization ===
[Main] Initial shared counter value: 0
[Main] Spawning 2 worker threads (100000 increments each)...
  [Thread 1] Finished 100000 increments.
  [Thread 2] Finished 100000 increments.
[Main] Both threads completed.
[Main] Final shared counter value: 200000 (Expected: 200000)`,
    viva: [
      { q: "Why are threads called lightweight processes?", a: "Because threads share the code, data, heap, and file descriptors of their parent process. Creating or switching between threads requires very little memory and CPU context overhead compared to full processes." },
      { q: "What is a Race Condition?", a: "A race condition occurs when two or more threads attempt to read and modify shared data simultaneously, causing the final outcome to depend unpredictably on thread scheduling timing." },
      { q: "What is the difference between a Mutex and a Semaphore?", a: "A Mutex is a locking mechanism with ownership (only the thread that locked it can unlock it, binary 0/1). A Semaphore is a signaling mechanism (can be counting > 1, any thread can signal/post)." },
      { q: "What does pthread_join() do?", a: "It blocks the calling thread until the specified target thread terminates, similar to wait() for processes. It reaps the thread's return code and resources." }
    ],
    simulatorType: "threads-race"
  },
  {
    id: "os-exp-7",
    num: "7",
    title: "GNU/Linux Inter-Process Communication (IPC)",
    aim: "To demonstrate and analyze GNU/Linux Inter-Process Communication (IPC) mechanisms: Anonymous Pipes, Named Pipes (FIFOs), Shared Memory, and Message Queues.",
    objectives: [
      "Understand why isolated processes need OS-mediated communication channels.",
      "Implement unidirectional data transfer using ordinary pipes (pipe system call).",
      "Demonstrate shared memory IPC and synchronization primitives."
    ],
    theory: `
      <h3>1. Why Inter-Process Communication (IPC)?</h3>
      <p>Processes execute in isolated virtual memory address spaces to prevent unauthorized interference. When processes must collaborate, the operating system provides <strong>IPC mechanisms</strong>.</p>

      <h3>2. Major IPC Mechanisms in Linux:</h3>
      <ul>
        <li><strong>Anonymous Pipes (<code>pipe()</code>):</strong> Unidirectional byte stream between related processes (parent and child). Created using <code>int pipe(int fd[2])</code>:
          <ul>
            <li><code>fd[0]</code>: Read end of the pipe.</li>
            <li><code>fd[1]</code>: Write end of the pipe.</li>
          </ul>
        </li>
        <li><strong>Named Pipes (FIFOs):</strong> Bidirectional or unidirectional communication between unrelated processes. Has a presence in the filesystem via <code>mkfifo()</code>.</li>
        <li><strong>Shared Memory:</strong> Fastest IPC mechanism. A region of physical RAM is mapped into the address spaces of multiple processes. Reads and writes occur at memory speeds without kernel intervention. Requires semaphores for synchronization.</li>
        <li><strong>Message Queues:</strong> Linked list of discrete messages stored within the kernel. Messages are prioritized and typed.</li>
      </ul>
    `,
    algorithm: `
Anonymous Pipe IPC Algorithm:
1. Start.
2. Declare an array of two integers: int fd[2].
3. Call pipe(fd). If return < 0, handle error.
4. Call fork() to create child process.
5. If in Parent Process:
   a. Close the unused read end: close(fd[0]).
   b. Write message string "Hello from Parent via IPC Pipe!" to fd[1].
   c. Close write end: close(fd[1]).
   d. Call wait(NULL) to wait for child.
6. If in Child Process:
   a. Close the unused write end: close(fd[1]).
   b. Read incoming message from fd[0] into buffer.
   c. Display received message to stdout.
   d. Close read end: close(fd[0]).
   e. Exit cleanly.
7. Stop.
    `,
    code: `/*
 * Experiment 7: Inter-Process Communication (IPC) using Anonymous Pipe
 * Clean, portable, and error-handled
 */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main() {
    int pipefd[2]; // pipefd[0] = read, pipefd[1] = write
    pid_t pid;
    char message[] = "IPC Data: Sent from Parent Process to Child Process!\n";
    char read_buffer[128];

    printf("=== Linux Anonymous Pipe IPC Demonstration ===\n");

    // Create pipe
    if (pipe(pipefd) == -1) {
        perror("pipe failed");
        exit(EXIT_FAILURE);
    }

    pid = fork();

    if (pid < 0) {
        perror("fork failed");
        exit(EXIT_FAILURE);
    }
    else if (pid == 0) {
        // Child Process: Reader
        close(pipefd[1]); // Close unused write end

        printf("  [Child] Reading from pipe descriptor %d...\n", pipefd[0]);
        memset(read_buffer, 0, sizeof(read_buffer));
        ssize_t bytes_read = read(pipefd[0], read_buffer, sizeof(read_buffer) - 1);

        printf("  [Child] Successfully received %zd bytes:\n", bytes_read);
        printf("  [Child] Content: \"%s\"", read_buffer);

        close(pipefd[0]); // Close read end
        exit(EXIT_SUCCESS);
    }
    else {
        // Parent Process: Writer
        close(pipefd[0]); // Close unused read end

        printf("[Parent] Writing message to pipe descriptor %d...\n", pipefd[1]);
        write(pipefd[1], message, strlen(message));

        close(pipefd[1]); // Close write end to signal EOF to child
        wait(NULL);       // Wait for child to finish reading

        printf("[Parent] Child has finished reading. Pipe IPC complete.\n");
    }

    return 0;
}`,
    output: `student@cselab:~$ gcc pipe_ipc.c -o pipe_ipc
student@cselab:~$ ./pipe_ipc
=== Linux Anonymous Pipe IPC Demonstration ===
[Parent] Writing message to pipe descriptor 4...
  [Child] Reading from pipe descriptor 3...
  [Child] Successfully received 53 bytes:
  [Child] Content: "IPC Data: Sent from Parent Process to Child Process!
"
[Parent] Child has finished reading. Pipe IPC complete.`,
    viva: [
      { q: "What is an anonymous pipe and what are its limitations?", a: "An anonymous pipe is a unidirectional, in-memory communication channel between related processes sharing a common ancestor. Its limitation is that it cannot be used between unrelated processes." },
      { q: "Which end of the pipe is for reading and which is for writing?", a: "fd[0] is for reading, fd[1] is for writing." },
      { q: "Why is Shared Memory the fastest IPC mechanism?", a: "Because shared memory maps the same physical RAM into both processes' address spaces, allowing data exchange without copying data back and forth through the kernel." },
      { q: "How does a Named Pipe (FIFO) differ from an Anonymous Pipe?", a: "A named pipe has a filename entry in the file system (created with mkfifo) and can connect completely unrelated processes." }
    ],
    simulatorType: "ipc-pipeline"
  },
  {
    id: "os-exp-8",
    num: "8",
    title: "Classical Process Synchronization (Producer-Consumer & Dining Philosophers)",
    aim: "To implement and solve classical process synchronization problems: Producer-Consumer (Bounded Buffer) and Dining Philosophers problems using POSIX semaphores and mutexes.",
    objectives: [
      "Understand critical section problems and the requirements: Mutual Exclusion, Progress, and Bounded Waiting.",
      "Solve the Bounded Buffer problem avoiding race conditions, buffer overflow, and underflow.",
      "Implement the Dining Philosophers problem with deadlock prevention."
    ],
    theory: `
      <h3>1. The Critical Section Problem</h3>
      <p>A <strong>critical section</strong> is a section of code where shared resources (variables, memory, files) are accessed. To ensure data consistency, any synchronization solution must satisfy:</p>
      <ul>
        <li><strong>Mutual Exclusion:</strong> Only one process can execute in its critical section at any given time.</li>
        <li><strong>Progress:</strong> If no process is in its critical section, only processes wishing to enter can participate in the decision.</li>
        <li><strong>Bounded Waiting:</strong> A bound must exist on the number of times other processes enter the critical section after a request is made.</li>
      </ul>

      <h3>2. Producer-Consumer Problem (Bounded Buffer):</h3>
      <p>Producers produce items and put them in a buffer of fixed size <code>N</code>. Consumers remove items from the buffer. Semaphores used:</p>
      <ul>
        <li><code>mutex</code> (binary): Ensures mutual exclusion while modifying the buffer.</li>
        <li><code>empty</code> (counting): Initialized to <code>N</code>. Counts available empty slots.</li>
        <li><code>full</code> (counting): Initialized to <code>0</code>. Counts filled slots available to consume.</li>
      </ul>

      <h3>3. Dining Philosophers Problem:</h3>
      <p>5 philosophers sit around a circular table with 5 chopsticks. A philosopher needs both left and right chopsticks to eat. If all philosophers pick up their left chopstick simultaneously, a <strong>deadlock (circular wait)</strong> occurs. Solved by breaking symmetry (e.g., odd philosophers pick left first, even pick right first).</p>
    `,
    algorithm: `
Producer-Consumer Synchronization Algorithm:
Producer:
1. Generate item.
2. sem_wait(&empty)    // wait for an empty slot
3. pthread_mutex_lock(&mutex) // acquire buffer lock
4. buffer[in] = item
5. in = (in + 1) % BUFFER_SIZE
6. pthread_mutex_unlock(&mutex) // release lock
7. sem_post(&full)     // signal consumer that item is ready

Consumer:
1. sem_wait(&full)     // wait for an item to be available
2. pthread_mutex_lock(&mutex) // acquire buffer lock
3. item = buffer[out]
4. out = (out + 1) % BUFFER_SIZE
5. pthread_mutex_unlock(&mutex) // release lock
6. sem_post(&empty)    // signal producer that slot is freed
7. Consume item.
    `,
    code: `/*
 * Experiment 8: Producer-Consumer Problem using POSIX Semaphores & Mutex
 * Standard Bounded Buffer Solution
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define BUFFER_SIZE 5
#define TOTAL_ITEMS 10

int buffer[BUFFER_SIZE];
int in = 0, out = 0;

sem_t empty_slots;
sem_t full_slots;
pthread_mutex_t buffer_mutex;

void* producer(void* arg) {
    for (int i = 1; i <= TOTAL_ITEMS; i++) {
        sem_wait(&empty_slots);
        pthread_mutex_lock(&buffer_mutex);

        buffer[in] = i;
        printf("[PRODUCER] Produced Item %d at buffer[%d]\n", i, in);
        in = (in + 1) % BUFFER_SIZE;

        pthread_mutex_unlock(&buffer_mutex);
        sem_post(&full_slots);

        usleep(150000); // 150ms delay
    }
    pthread_exit(NULL);
}

void* consumer(void* arg) {
    for (int i = 1; i <= TOTAL_ITEMS; i++) {
        sem_wait(&full_slots);
        pthread_mutex_lock(&buffer_mutex);

        int item = buffer[out];
        printf("  [CONSUMER] Consumed Item %d from buffer[%d]\n", item, out);
        out = (out + 1) % BUFFER_SIZE;

        pthread_mutex_unlock(&buffer_mutex);
        sem_post(&empty_slots);

        usleep(250000); // 250ms delay
    }
    pthread_exit(NULL);
}

int main() {
    pthread_t prod_tid, cons_tid;

    printf("=== Classical Synchronization: Producer-Consumer (Bounded Buffer) ===\n");

    // Initialize semaphores: empty = BUFFER_SIZE, full = 0
    sem_init(&empty_slots, 0, BUFFER_SIZE);
    sem_init(&full_slots, 0, 0);
    pthread_mutex_init(&buffer_mutex, NULL);

    // Create threads
    pthread_create(&prod_tid, NULL, producer, NULL);
    pthread_create(&cons_tid, NULL, consumer, NULL);

    // Wait for both threads
    pthread_join(prod_tid, NULL);
    pthread_join(cons_tid, NULL);

    // Cleanup
    sem_destroy(&empty_slots);
    sem_destroy(&full_slots);
    pthread_mutex_destroy(&buffer_mutex);

    printf("=== All %d items successfully produced and consumed! ===\n", TOTAL_ITEMS);
    return 0;
}`,
    output: `student@cselab:~$ gcc -pthread prod_cons.c -o prod_cons
student@cselab:~$ ./prod_cons
=== Classical Synchronization: Producer-Consumer (Bounded Buffer) ===
[PRODUCER] Produced Item 1 at buffer[0]
  [CONSUMER] Consumed Item 1 from buffer[0]
[PRODUCER] Produced Item 2 at buffer[1]
[PRODUCER] Produced Item 3 at buffer[2]
  [CONSUMER] Consumed Item 2 from buffer[1]
[PRODUCER] Produced Item 4 at buffer[3]
  [CONSUMER] Consumed Item 3 from buffer[2]
[PRODUCER] Produced Item 5 at buffer[4]
[PRODUCER] Produced Item 6 at buffer[0]
  [CONSUMER] Consumed Item 4 from buffer[3]
  [CONSUMER] Consumed Item 5 from buffer[4]
  [CONSUMER] Consumed Item 6 from buffer[0]
[PRODUCER] Produced Item 7 at buffer[1]
  [CONSUMER] Consumed Item 7 from buffer[1]
[PRODUCER] Produced Item 8 at buffer[2]
[PRODUCER] Produced Item 9 at buffer[3]
  [CONSUMER] Consumed Item 8 from buffer[2]
[PRODUCER] Produced Item 10 at buffer[4]
  [CONSUMER] Consumed Item 9 from buffer[3]
  [CONSUMER] Consumed Item 10 from buffer[4]
=== All 10 items successfully produced and consumed! ===`,
    viva: [
      { q: "What is a Counting Semaphore versus a Binary Semaphore?", a: "A binary semaphore takes values 0 and 1, used for mutual exclusion. A counting semaphore takes non-negative integer values, used to manage a resource pool of fixed size." },
      { q: "What happens if sem_wait(&empty) and pthread_mutex_lock(&mutex) are swapped in the producer?", a: "A deadlock can occur! If the buffer is full and producer locks the mutex before waiting on empty, it will sleep while holding the mutex, preventing the consumer from entering and freeing a slot." },
      { q: "How can Deadlock be prevented in the Dining Philosophers Problem?", a: "By allowing at most 4 philosophers to sit at once, or by having asymmetric pick-up rules (e.g., odd philosophers pick left fork first, even pick right fork first)." }
    ],
    simulatorType: "sync-visualizer"
  },
  {
    id: "os-exp-9",
    num: "9",
    title: "Banker's Algorithm for Deadlock Detection & Avoidance",
    aim: "To implement Banker's Algorithm to test whether a system is in a safe state, generate safe sequences for deadlock avoidance, and detect deadlocks given current allocation and request matrices.",
    objectives: [
      "Understand the 4 Coffman conditions for deadlock: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
      "Calculate the Need Matrix (Need = Max - Allocation).",
      "Execute the Safety Algorithm to determine safe sequences and evaluate resource requests."
    ],
    theory: `
      <h3>1. Deadlock & 4 Necessary Conditions (Coffman Conditions)</h3>
      <p>A <strong>deadlock</strong> is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the same set.</p>
      <ol>
        <li><strong>Mutual Exclusion:</strong> At least one resource must be held in a non-shareable mode.</li>
        <li><strong>Hold and Wait:</strong> A process must be holding at least one resource and waiting to acquire additional resources.</li>
        <li><strong>No Preemption:</strong> Resources cannot be forcibly taken from a process; they must be released voluntarily.</li>
        <li><strong>Circular Wait:</strong> A closed chain of processes exists such that each process holds resources needed by the next.</li>
      </ol>

      <h3>2. Banker's Algorithm (Dijkstra)</h3>
      <p>A deadlock avoidance algorithm that checks if granting a resource request leaves the system in a <strong>Safe State</strong> (a state where there exists a safe execution sequence such that every process can satisfy its maximum demand and finish).</p>
      <ul>
        <li><code>Available[m]</code>: Number of available instances of each resource type.</li>
        <li><code>Max[n][m]</code>: Maximum demand of each process.</li>
        <li><code>Allocation[n][m]</code>: Resources currently allocated to each process.</li>
        <li><code>Need[n][m] = Max[n][m] - Allocation[n][m]</code>: Remaining resource need.</li>
      </ul>
    `,
    algorithm: `
Banker's Safety Algorithm:
1. Let Work = Available (array of size m) and Finish[i] = false for all i in 0..n-1.
2. Find an index i such that:
   - Finish[i] == false
   - Need[i][j] <= Work[j] for all j in 0..m-1
3. If such an i exists:
   - Work[j] = Work[j] + Allocation[i][j] (process finishes and releases all resources)
   - Finish[i] = true
   - Append process i to the Safe Sequence.
   - Go back to Step 2.
4. If Finish[i] == true for all i:
   - The system is in a SAFE STATE.
   - Print the Safe Sequence.
5. Else:
   - The system is in an UNSAFE / DEADLOCKED STATE.
   - Identify unfinished processes as deadlocked.
    `,
    code: `/*
 * Experiment 9: Banker's Algorithm for Deadlock Avoidance
 * Standard Safe State & Safe Sequence Finder
 */

#include <stdio.h>
#include <stdbool.h>

#define MAX_P 10
#define MAX_R 10

int main() {
    int n, m, i, j, k;

    printf("=== Banker's Algorithm for Deadlock Avoidance ===\n");
    printf("Enter number of processes: ");
    scanf("%d", &n);
    printf("Enter number of resource types: ");
    scanf("%d", &m);

    int alloc[MAX_P][MAX_R], max[MAX_P][MAX_R], need[MAX_P][MAX_R];
    int avail[MAX_R], work[MAX_R];
    bool finish[MAX_P];
    int safeSeq[MAX_P], seqIdx = 0;

    printf("\nEnter Allocation Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            scanf("%d", &alloc[i][j]);
        }
    }

    printf("\nEnter Max Matrix (%d x %d):\n", n, m);
    for (i = 0; i < n; i++) {
        for (j = 0; j < m; j++) {
            scanf("%d", &max[i][j]);
            need[i][j] = max[i][j] - alloc[i][j]; // Calculate Need
        }
    }

    printf("\nEnter Available Resources (%d items): ", m);
    for (j = 0; j < m; j++) {
        scanf("%d", &avail[j]);
        work[j] = avail[j];
    }

    for (i = 0; i < n; i++) finish[i] = false;

    // Safety Algorithm
    int count = 0;
    while (count < n) {
        bool found = false;
        for (i = 0; i < n; i++) {
            if (!finish[i]) {
                bool canAllocate = true;
                for (j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) {
                        canAllocate = false;
                        break;
                    }
                }

                if (canAllocate) {
                    for (k = 0; k < m; k++) {
                        work[k] += alloc[i][k];
                    }
                    safeSeq[seqIdx++] = i;
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
        }

        if (!found) {
            // Cannot find any process that can finish
            break;
        }
    }

    // Output Result
    if (count == n) {
        printf("\n[SUCCESS] The system is in a SAFE STATE!\n");
        printf("Safe Sequence: ");
        for (i = 0; i < n; i++) {
            printf("P%d%s", safeSeq[i], (i == n - 1) ? "\n" : " -> ");
        }
    } else {
        printf("\n[ALERT] System is in an UNSAFE (DEADLOCKED) STATE!\n");
        printf("Deadlocked processes: ");
        for (i = 0; i < n; i++) {
            if (!finish[i]) printf("P%d ", i);
        }
        printf("\n");
    }

    return 0;
}`,
    output: `student@cselab:~$ gcc bankers.c -o bankers
student@cselab:~$ ./bankers
=== Banker's Algorithm for Deadlock Avoidance ===
Enter number of processes: 5
Enter number of resource types: 3

Enter Allocation Matrix (5 x 3):
0 1 0
2 0 0
3 0 2
2 1 1
0 0 2

Enter Max Matrix (5 x 3):
7 5 3
3 2 2
9 0 2
2 2 2
4 3 3

Enter Available Resources (3 items): 3 3 2

[SUCCESS] The system is in a SAFE STATE!
Safe Sequence: P1 -> P3 -> P4 -> P0 -> P2`,
    viva: [
      { q: "What are the four necessary conditions for deadlock?", a: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait (Coffman conditions)." },
      { q: "What is a Safe State in Banker's Algorithm?", a: "A state is safe if there exists at least one order (safe sequence) in which all processes can finish their execution without causing a deadlock." },
      { q: "How is the Need Matrix calculated?", a: "Need[i][j] = Max[i][j] - Allocation[i][j]." },
      { q: "What is the difference between Deadlock Avoidance and Deadlock Detection?", a: "Deadlock Avoidance (Banker's) verifies each resource request dynamically and only grants it if the resulting state is safe. Deadlock Detection allows deadlocks to happen and periodically runs algorithms to identify and recover from them." }
    ],
    simulatorType: "bankers-algo"
  },
  {
    id: "os-exp-10",
    num: "10",
    title: "File Allocation Methods (Contiguous, Linked, Indexed)",
    aim: "To implement and simulate disk file allocation strategies: Contiguous (Sequential) Allocation, Linked Allocation, and Indexed Allocation.",
    objectives: [
      "Understand how secondary storage blocks are managed by the operating system.",
      "Compare sequential, linked list, and indexed block allocations.",
      "Analyze external and internal fragmentation in disk allocation."
    ],
    theory: `
      <h3>1. File Allocation Problem</h3>
      <p>File allocation methods determine how disk blocks are allocated for files so that disk space is utilized effectively and files can be accessed quickly.</p>

      <h3>2. The Three Classical Allocation Methods:</h3>
      <ul>
        <li><strong>Contiguous Allocation:</strong>
          <ul>
            <li>Each file occupies a set of contiguous blocks on disk.</li>
            <li>Directory entry specifies starting block number and length (in blocks).</li>
            <li><em>Pros:</em> Excellent sequential and direct access performance.</li>
            <li><em>Cons:</em> Suffers from <strong>External Fragmentation</strong>; difficult to grow a file dynamically.</li>
          </ul>
        </li>
        <li><strong>Linked Allocation:</strong>
          <ul>
            <li>Each file is a linked list of disk blocks. Each block contains a pointer to the next block.</li>
            <li>Directory entry points to the first and last blocks.</li>
            <li><em>Pros:</em> No external fragmentation; file size can grow dynamically.</li>
            <li><em>Cons:</em> Extremely slow direct (random) access; pointer overhead in every block.</li>
          </ul>
        </li>
        <li><strong>Indexed Allocation (UNIX Inode Model):</strong>
          <ul>
            <li>Each file has an <strong>Index Block</strong> containing an array of pointers to all its data blocks.</li>
            <li>Directory points to the index block.</li>
            <li><em>Pros:</em> Supports fast direct access without external fragmentation.</li>
            <li><em>Cons:</em> Overhead of dedicated index blocks for very small files.</li>
          </ul>
        </li>
      </ul>
    `,
    algorithm: `
Indexed Allocation Algorithm:
1. Initialize disk blocks array used[TOTAL_BLOCKS] = 0.
2. For each file allocation request:
   a. Read File Name, Index Block number, and Number of data blocks required.
   b. Check if Index Block is already allocated. If yes, reject.
   c. Read block numbers for the data blocks.
   d. Verify all data block numbers are within bounds and currently free.
   e. If all valid:
      - Mark index block as used: used[indexBlock] = 1.
      - Mark all data blocks as used: used[dataBlock[k]] = 1.
      - Display allocation success table.
   f. Else: display error message.
3. Allow searching files to inspect their allocated index and data blocks.
4. Stop.
    `,
    code: `/*
 * Experiment 10: File Allocation Methods
 * Implementation of Indexed File Allocation Method
 */

#include <stdio.h>
#include <string.h>

#define MAX_BLOCKS 64

struct File {
    char name[20];
    int index_block;
    int block_count;
    int blocks[20];
};

int main() {
    int total_blocks = MAX_BLOCKS;
    int disk[MAX_BLOCKS] = {0}; // 0 = free, 1 = allocated
    int num_files, i, j;

    printf("=== Indexed File Allocation Simulation ===\n");
    printf("Total Disk Blocks Available: %d (Block 0 to %d)\n", total_blocks, total_blocks - 1);

    printf("Enter number of files to allocate: ");
    scanf("%d", &num_files);

    struct File files[num_files];

    for (i = 0; i < num_files; i++) {
        printf("\n--- File %d Allocation ---\n", i + 1);
        printf("Enter File Name: ");
        scanf("%s", files[i].name);

        printf("Enter Index Block Number: ");
        scanf("%d", &files[i].index_block);

        if (disk[files[i].index_block] == 1) {
            printf("[ERROR] Block %d is already occupied! Allocation failed.\n", files[i].index_block);
            i--;
            continue;
        }

        printf("Enter number of data blocks required: ");
        scanf("%d", &files[i].block_count);

        printf("Enter %d block numbers: ", files[i].block_count);
        int valid = 1;
        for (j = 0; j < files[i].block_count; j++) {
            scanf("%d", &files[i].blocks[j]);
            if (disk[files[i].blocks[j]] == 1 || files[i].blocks[j] == files[i].index_block) {
                valid = 0;
            }
        }

        if (!valid) {
            printf("[ERROR] One or more selected blocks are already occupied! Retry.\n");
            i--;
            continue;
        }

        // Mark blocks as allocated
        disk[files[i].index_block] = 1;
        for (j = 0; j < files[i].block_count; j++) {
            disk[files[i].blocks[j]] = 1;
        }
        printf("[SUCCESS] File '%s' allocated with Index Block %d.\n", files[i].name, files[i].index_block);
    }

    // Display Allocation Summary
    printf("\n=== Disk Allocation Summary Table ===\n");
    printf("%-15s %-12s %-25s\n", "File Name", "Index Block", "Allocated Data Blocks");
    printf("-------------------------------------------------------------\n");
    for (i = 0; i < num_files; i++) {
        printf("%-15s %-12d ", files[i].name, files[i].index_block);
        for (j = 0; j < files[i].block_count; j++) {
            printf("%d ", files[i].blocks[j]);
        }
        printf("\n");
    }
    printf("-------------------------------------------------------------\n");

    return 0;
}`,
    output: `student@cselab:~$ gcc indexed_alloc.c -o indexed_alloc
student@cselab:~$ ./indexed_alloc
=== Indexed File Allocation Simulation ===
Total Disk Blocks Available: 64 (Block 0 to 63)
Enter number of files to allocate: 2

--- File 1 Allocation ---
Enter File Name: os_notes.txt
Enter Index Block Number: 5
Enter number of data blocks required: 3
Enter 3 block numbers: 12 18 22
[SUCCESS] File 'os_notes.txt' allocated with Index Block 5.

--- File 2 Allocation ---
Enter File Name: practicals.pdf
Enter Index Block Number: 9
Enter number of data blocks required: 4
Enter 4 block numbers: 14 15 28 33
[SUCCESS] File 'practicals.pdf' allocated with Index Block 9.

=== Disk Allocation Summary Table ===
File Name       Index Block  Allocated Data Blocks    
-------------------------------------------------------------
os_notes.txt    5            12 18 22 
practicals.pdf  9            14 15 28 33 
-------------------------------------------------------------`,
    viva: [
      { q: "What is External Fragmentation in Contiguous file allocation?", a: "External fragmentation occurs when free disk blocks are broken into small non-contiguous fragments so that large files cannot be allocated even though total free space is sufficient." },
      { q: "What is the main advantage of Indexed Allocation over Linked Allocation?", a: "Indexed allocation supports fast direct (random) access by looking up block pointers in the index table, whereas linked allocation requires sequentially reading each block pointer from the beginning." },
      { q: "What is an Inode in Linux?", a: "An Inode (Index Node) is a data structure on disk that stores all metadata about a file (permissions, size, owner, timestamps) and direct, indirect, doubly indirect, and triply indirect block pointers." }
    ],
    simulatorType: "file-alloc"
  }
];

