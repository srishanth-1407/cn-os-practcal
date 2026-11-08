/**
 * CN Lab (22ITC11N) - Complete Experiments Dataset
 * Chaitanya Bharathi Institute of Technology (A) - R22A Schema Syllabus
 * Exactly 12 Experiments matching R22A Syllabus 1-to-1:
 *  1. Network Commands
 *  2. Configure Peer to Peer Network
 *  3. Implement Cyclic Redundancy Check (CRC)
 *  4. Configuration of Cisco Router and VLAN
 *  5. Installation Setup of Network Simulator Software
 *  6. Simulation of Star Topology
 *  7. Simulation of Stop and Wait Protocol
 *  8. Simulation of Sliding Window Protocol
 *  9. Simulation of Routing Algorithms
 * 10. Wireshark Packet Sniffer
 * 11. Implement Socket Programming (Server - Client Programming)
 * 12. Implement SMTP Protocol
 */

const CN_EXPERIMENTS = [
  {
    id: "cn-exp-1",
    num: "1",
    title: "Write and Analyze Output of Network Commands",
    aim: "To write, execute, and analyze the output of various network commands: ping, ipconfig/ifconfig, arp, netstat, tracert/traceroute, nslookup, hostname, and systeminfo.",
    objectives: [
      "Understand diagnostic command-line utilities used for network monitoring and troubleshooting.",
      "Analyze IP addressing, ARP cache mappings, TCP/UDP listening states, and DNS name resolution.",
      "Trace multi-hop internet route paths and packet round-trip times (RTT)."
    ],
    theory: `
      <h3>1. Diagnostic Network Commands Overview</h3>
      <p>Network commands allow system and network administrators to query host configuration, inspect active sockets, verify path reachability, and troubleshoot protocol failures.</p>

      <h3>2. Essential Network Commands:</h3>
      <ul>
        <li><code>ping &lt;host&gt;</code>: Sends ICMP (Internet Control Message Protocol) Echo Request packets and listens for Echo Replies to test reachability and RTT.</li>
        <li><code>ipconfig /all</code> (Windows) / <code>ifconfig</code> / <code>ip a</code> (Linux): Displays TCP/IP network configuration, MAC addresses, IPv4/IPv6 addresses, subnet masks, default gateways, and DHCP/DNS server addresses.</li>
        <li><code>arp -a</code>: Displays the Address Resolution Protocol cache mapping IPv4 addresses to physical MAC addresses on the local link.</li>
        <li><code>netstat -ano</code>: Displays active TCP/UDP connections, listening ports, process IDs (PID), and socket connection states (ESTABLISHED, LISTENING, TIME_WAIT).</li>
        <li><code>tracert &lt;host&gt;</code> (Windows) / <code>traceroute</code> (Linux): Determines the route packets take to a network host using ICMP/UDP packets with incrementing TTL (Time to Live) values.</li>
        <li><code>nslookup &lt;domain&gt;</code>: Queries Domain Name System (DNS) servers to resolve hostnames to IP addresses and query DNS records (A, AAAA, MX, NS).</li>
        <li><code>hostname</code>: Displays the current host computer name.</li>
        <li><code>systeminfo</code>: Displays comprehensive operating system and hardware configuration information.</li>
      </ul>
    `,
    algorithm: `
1. Open Windows Command Prompt / PowerShell as Administrator (or Linux Terminal).
2. Test local stack: run ping 127.0.0.1 (loopback test).
3. Query adapter configuration: run ipconfig /all to note Default Gateway and DNS servers.
4. Test default gateway reachability: run ping <default-gateway-ip>.
5. Inspect the local ARP cache: run arp -a.
6. Trace path to external server: run tracert cbit.ac.in (or google.com) and observe TTL expiry per hop.
7. Query DNS server for IP records: run nslookup google.com.
8. Inspect active listening ports: run netstat -ano | findstr LISTENING.
9. Record output and diagnostic deductions.
    `,
    code: `# Network Diagnostic Script (Batch / PowerShell / Bash equivalent)
# Demonstrating multi-command network diagnostic pipeline

echo "============================================="
echo "1. Hostname and IP Configuration"
hostname
ipconfig | findstr /i "IPv4 Default Gateway"

echo "============================================="
echo "2. Testing Reachability with Ping (4 packets)"
ping -n 4 8.8.8.8

echo "============================================="
echo "3. Querying DNS Record with nslookup"
nslookup google.com

echo "============================================="
echo "4. Address Resolution Protocol (ARP) Cache"
arp -a

echo "============================================="
echo "5. Active TCP Listening Sockets"
netstat -an | findstr /i "LISTENING"`,
    output: `C:\\Users\\Student> ping -n 4 8.8.8.8

Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=18ms TTL=116
Reply from 8.8.8.8: bytes=32 time=17ms TTL=116
Reply from 8.8.8.8: bytes=32 time=19ms TTL=116
Reply from 8.8.8.8: bytes=32 time=17ms TTL=116

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 17ms, Maximum = 19ms, Average = 17ms

C:\\Users\\Student> arp -a
Interface: 192.168.1.15 --- 0xb
  Internet Address      Physical Address      Type
  192.168.1.1           e0-28-6d-74-aa-10     dynamic
  192.168.1.255         ff-ff-ff-ff-ff-ff     static
  224.0.0.22           01-00-5e-00-00-16     static

C:\\Users\\Student> nslookup cbit.ac.in
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    cbit.ac.in
Address: 103.206.115.148`,
    viva: [
      { q: "What protocol and message types does the ping command use?", a: "ping uses ICMP (Internet Control Message Protocol): ICMP Type 8 (Echo Request) and ICMP Type 0 (Echo Reply)." },
      { q: "How does tracert / traceroute discover routers along the path?", a: "It sends packets with incrementing TTL (Time to Live) values starting at 1. Each router decrements TTL by 1; when TTL drops to 0, the router discards the packet and sends back an ICMP 'Time Exceeded' message, revealing its IP address." },
      { q: "What is the purpose of the ARP protocol?", a: "ARP (Address Resolution Protocol) resolves a known 32-bit IPv4 address into a 48-bit physical MAC address on the local area network." },
      { q: "What does the 127.0.0.1 IP address represent?", a: "It is the IPv4 Loopback address (localhost), used to test the host's own internal TCP/IP software stack without sending traffic over physical network hardware." }
    ],
    simulatorType: "network-cli"
  },
  {
    id: "cn-exp-2",
    num: "2",
    title: "Configure Peer to Peer Network with at Least Three Hosts",
    aim: "To configure and verify a Peer-to-Peer (P2P) network and basic network topologies with at least three hosts in Cisco Packet Tracer, configuring IPv4 addresses, subnet masks, and testing connectivity via ping.",
    objectives: [
      "Understand the difference between Peer-to-Peer and Client-Server architectures.",
      "Explore Star, Mesh, and Bus topologies in Cisco Packet Tracer.",
      "Configure static IP addresses, subnet masks, and verify end-to-end communication."
    ],
    theory: `
      <h3>1. Peer-to-Peer (P2P) Architecture</h3>
      <p>In a <strong>Peer-to-Peer network</strong>, each workstation has equal capabilities and responsibilities. There is no central server; any computer can act as both a client and a server, sharing files, printers, and resources directly.</p>

      <h3>2. Network Topologies Comparison:</h3>
      <ul>
        <li><strong>Star Topology:</strong> All end devices connect directly to a central node (Switch or Hub). Failure of a single link does not bring down the entire network. Most widely used in modern Ethernet LANs.</li>
        <li><strong>Mesh Topology:</strong> Every node has dedicated point-to-point links to every other node. For $N$ nodes, total physical links = $N(N - 1) / 2$. Highly fault-tolerant and robust, but expensive.</li>
        <li><strong>Bus Topology:</strong> All devices share a single linear central backbone cable terminated with resistors. Prone to cable break failures and packet collisions.</li>
      </ul>

      <h3>3. IP Addressing Scheme for 3-Host Lab:</h3>
      <table>
        <tr><th>Device</th><th>Interface</th><th>IP Address</th><th>Subnet Mask</th><th>Gateway</th></tr>
        <tr><td>PC0</td><td>FastEthernet0</td><td>192.168.1.10</td><td>255.255.255.0</td><td>192.168.1.1</td></tr>
        <tr><td>PC1</td><td>FastEthernet0</td><td>192.168.1.20</td><td>255.255.255.0</td><td>192.168.1.1</td></tr>
        <tr><td>PC2</td><td>FastEthernet0</td><td>192.168.1.30</td><td>255.255.255.0</td><td>192.168.1.1</td></tr>
      </table>
    `,
    algorithm: `
1. Launch Cisco Packet Tracer.
2. Drag and drop 3 PC devices (PC0, PC1, PC2) and 1 Cisco 2960 Switch into the workspace.
3. Connect PC0 (Fa0) -> Switch (Fa0/1), PC1 (Fa0) -> Switch (Fa0/2), and PC2 (Fa0) -> Switch (Fa0/3) using Copper Straight-Through cables.
4. Configure IP on PC0: IP = 192.168.1.10, Subnet = 255.255.255.0.
5. Configure IP on PC1: IP = 192.168.1.20, Subnet = 255.255.255.0.
6. Configure IP on PC2: IP = 192.168.1.30, Subnet = 255.255.255.0.
7. Switch to Command Prompt on PC0.
8. Execute: ping 192.168.1.20 and ping 192.168.1.30.
9. Verify 0% packet loss and observe successful ARP and ICMP exchanges in Simulation Mode.
    `,
    code: `// Cisco IOS Switch Verification Commands (Cisco 2960 Switch)
Switch> enable
Switch# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0001.42a1.b101    DYNAMIC     Fa0/1
   1    0001.42a1.b102    DYNAMIC     Fa0/2
   1    0001.42a1.b103    DYNAMIC     Fa0/3
Total Mac Addresses for this criterion: 3

// PC0 Command Prompt Ping Test
PC> ping 192.168.1.20
Pinging 192.168.1.20 with 32 bytes of data:
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
Reply from 192.168.1.20: bytes=32 time<1ms TTL=128
Ping statistics for 192.168.1.20:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
    output: `Cisco Packet Tracer Topology Configured:
[PC0: 192.168.1.10] ---- (Fa0/1)
[PC1: 192.168.1.20] ---- (Fa0/2) [Cisco 2960 Switch]
[PC2: 192.168.1.30] ---- (Fa0/3)

Ping from PC0 to PC1 (192.168.1.20): SUCCESS (4/4 packets received, 0% loss)
Ping from PC0 to PC2 (192.168.1.30): SUCCESS (4/4 packets received, 0% loss)`,
    viva: [
      { q: "What cable type is used to connect a PC to a Switch versus PC to PC directly?", a: "PC to Switch uses a Copper Straight-Through cable. PC to PC directly uses a Copper Cross-Over cable (or straight-through if Auto-MDIX is supported)." },
      { q: "How many physical links are required in a fully connected mesh network of N nodes?", a: "N * (N - 1) / 2 links." },
      { q: "What is a broadcast domain versus a collision domain on a switch?", a: "Each port on a switch is an independent collision domain. By default, all ports on an unconfigured switch belong to one single broadcast domain." }
    ],
    simulatorType: "p2p-topology"
  },
  {
    id: "cn-exp-3",
    num: "3",
    title: "Implement Cyclic Redundancy Check (CRC) Method",
    aim: "To implement Cyclic Redundancy Check (CRC) error detection method in C++, calculating checksum at the sender using Modulo-2 binary division and verifying codeword integrity at the receiver.",
    objectives: [
      "Understand error detection techniques in the Data Link Layer.",
      "Implement Modulo-2 binary division using XOR logic.",
      "Demonstrate error detection when bits are corrupted during transmission."
    ],
    theory: `
      <h3>1. What is Cyclic Redundancy Check (CRC)?</h3>
      <p><strong>CRC</strong> is an algebraic error-detecting code based on polynomial division (Modulo-2 arithmetic). Both sender and receiver agree in advance on a generator polynomial $G(x)$.</p>

      <h3>2. Mathematical Principles:</h3>
      <ul>
        <li>Let $M$ be the data bitstring of length $m$.</li>
        <li>Let $G$ be the generator polynomial of degree $n$ (length $n+1$).</li>
        <li><strong>Sender:</strong>
          <ol>
            <li>Append $n$ zeros to data $M$ (forming $M \cdot 2^n$).</li>
            <li>Divide this padded data by $G$ using Modulo-2 binary division (XOR).</li>
            <li>The remainder $R$ of length $n$ is the <strong>CRC Checksum</strong>.</li>
            <li>Transmitted Codeword $T = M + R$.</li>
          </ol>
        </li>
        <li><strong>Receiver:</strong>
          <ol>
            <li>Divides received codeword $T'$ by the same generator $G$.</li>
            <li>If remainder is <strong>all zeros</strong>, the data is accepted as error-free.</li>
            <li>If remainder is <strong>non-zero</strong>, a transmission error is detected and packet is rejected.</li>
          </ol>
        </li>
      </ul>
      <p>Standard polynomials: CRC-12 ($x^{12}+x^{11}+x^3+x^2+x+1$), CRC-16, CRC-CCITT ($x^{16}+x^{12}+x^5+1$), CRC-32 (used in Ethernet 802.3).</p>
    `,
    algorithm: `
1. Start.
2. Input Data bits string (e.g., 100100) and Generator Polynomial (e.g., 1101).
3. Determine length of polynomial n = len(poly).
4. Append (n - 1) zeros to the data string.
5. Perform Modulo-2 Division (XOR operation) on padded data using polynomial:
   - For each bit from index 0 to data_len - 1:
     - If current bit is '1', XOR next n bits with polynomial.
6. The final (n - 1) bits remainder is the CRC Checksum.
7. Transmitted Codeword = Data + Remainder.
8. Receiver Side:
   - Perform Modulo-2 division on received codeword with the same polynomial.
   - If remainder is all '0's, declare "No Error Detected".
   - Else, declare "Error Detected in Transmission".
9. End.
    `,
    code: `/*
 * Experiment 3: Cyclic Redundancy Check (CRC)
 * Sender Checksum Generation and Receiver Error Detection
 * Clean C++ Implementation
 */

#include <iostream>
#include <string>

using namespace std;

// Function to perform XOR operation
string xorOp(string a, string b) {
    string result = "";
    for (int i = 1; i < b.length(); i++) {
        result += (a[i] == b[i]) ? '0' : '1';
    }
    return result;
}

// Function to perform Modulo-2 division
string mod2Div(string dividend, string divisor) {
    int pick = divisor.length();
    string tmp = dividend.substr(0, pick);
    int n = dividend.length();

    while (pick < n) {
        if (tmp[0] == '1')
            tmp = xorOp(divisor, tmp) + dividend[pick];
        else
            tmp = xorOp(string(pick, '0'), tmp) + dividend[pick];
        pick += 1;
    }

    if (tmp[0] == '1')
        tmp = xorOp(divisor, tmp);
    else
        tmp = xorOp(string(pick, '0'), tmp);

    return tmp;
}

int main() {
    string data, poly;

    cout << "=== Cyclic Redundancy Check (CRC) Demo ===\n";
    cout << "Enter Data Bitstring: ";
    cin >> data;
    cout << "Enter Generator Polynomial: ";
    cin >> poly;

    int n = poly.length();
    // Append (n - 1) zeros to data
    string paddedData = data + string(n - 1, '0');

    // Calculate CRC remainder
    string remainder = mod2Div(paddedData, poly);
    string codeword = data + remainder;

    cout << "\n[SENDER SIDE]\n";
    cout << "  Appended Data:        " << paddedData << "\n";
    cout << "  Calculated CRC:       " << remainder << "\n";
    cout << "  Transmitted Codeword: " << codeword << "\n";

    // Receiver Side Verification
    cout << "\n[RECEIVER SIDE - Valid Transmission]\n";
    string recRemainder = mod2Div(codeword, poly);
    cout << "  Receiver Remainder:   " << recRemainder << "\n";
    if (recRemainder.find('1') == string::npos) {
        cout << "  Result: NO ERROR DETECTED! Frame accepted.\n";
    } else {
        cout << "  Result: ERROR DETECTED! Frame discarded.\n";
    }

    // Simulate Transmission Bit Flip Error
    cout << "\n[RECEIVER SIDE - Error Injection (Bit Inversion)]\n";
    string corruptedCodeword = codeword;
    // Invert the first bit
    corruptedCodeword[0] = (corruptedCodeword[0] == '1') ? '0' : '1';
    cout << "  Corrupted Codeword:   " << corruptedCodeword << "\n";
    string errRemainder = mod2Div(corruptedCodeword, poly);
    cout << "  Receiver Remainder:   " << errRemainder << "\n";
    if (errRemainder.find('1') == string::npos) {
        cout << "  Result: NO ERROR DETECTED.\n";
    } else {
        cout << "  Result: ERROR DETECTED! Remainder is non-zero. Frame discarded.\n";
    }

    return 0;
}`,
    output: `student@cselab:~$ g++ crc.cpp -o crc
student@cselab:~$ ./crc
=== Cyclic Redundancy Check (CRC) Demo ===
Enter Data Bitstring: 100100
Enter Generator Polynomial: 1101

[SENDER SIDE]
  Appended Data:        100100000
  Calculated CRC:       001
  Transmitted Codeword: 100100001

[RECEIVER SIDE - Valid Transmission]
  Receiver Remainder:   000
  Result: NO ERROR DETECTED! Frame accepted.

[RECEIVER SIDE - Error Injection (Bit Inversion)]
  Corrupted Codeword:   000100001
  Receiver Remainder:   101
  Result: ERROR DETECTED! Remainder is non-zero. Frame discarded.`,
    viva: [
      { q: "Why is CRC called 'Cyclic'?", a: "Because the polynomial code is invariant under cyclic shifts: shifting any valid codeword cyclically produces another valid polynomial in the code." },
      { q: "How many zeros are appended to the data word at the sender?", a: "Degree of the generator polynomial (i.e., Length of Generator Polynomial - 1)." },
      { q: "What binary operation replaces addition and subtraction in Modulo-2 arithmetic?", a: "XOR (Exclusive OR) without carry or borrow." },
      { q: "Can CRC correct errors or only detect them?", a: "Standard CRC is an error-detecting code. While specialized cyclic codes can correct single-bit errors, in network protocols like Ethernet it is strictly used to detect errors and drop corrupt frames." }
    ],
    simulatorType: "crc-calc"
  },
  {
    id: "cn-exp-4",
    num: "4",
    title: "Configuration of Cisco Router and VLAN",
    aim: "To configure Cisco 2811 routers with static routing across interconnected networks, and configure Virtual Local Area Networks (VLAN 10 and VLAN 20) with IEEE 802.1Q trunking on Cisco 2960 switches in Cisco Packet Tracer.",
    objectives: [
      "Master Cisco IOS Command Line Interface (CLI) configuration modes (User, Privileged, Global Config, Interface Config).",
      "Configure FastEthernet and Serial WAN interfaces with clock rate and IP addresses.",
      "Implement static routes using the `ip route` command.",
      "Configure VLANs, Access Ports, and 802.1Q Trunk links to achieve broadcast domain isolation."
    ],
    theory: `
      <h3>Part A: Cisco Router Configuration & Static Routing</h3>
      <ul>
        <li><strong>User EXEC Mode (<code>Router&gt;</code>):</strong> Basic monitoring.</li>
        <li><strong>Privileged EXEC Mode (<code>Router#</code>):</strong> Verification and debug (<code>show ip route</code>).</li>
        <li><strong>Global Configuration Mode (<code>Router(config)#</code>):</strong> System-wide configuration.</li>
        <li><strong>Static Route Syntax:</strong> <code>ip route &lt;dest_network&gt; &lt;subnet_mask&gt; &lt;next_hop_ip&gt;</code>.</li>
      </ul>

      <h3>Part B: Virtual Local Area Network (VLAN) Configuration</h3>
      <p>A <strong>VLAN</strong> divides a single physical switch broadcast domain into multiple logical broadcast domains.</p>
      <ul>
        <li><strong>Access Port:</strong> Belongs to a single VLAN (connects PCs).</li>
        <li><strong>Trunk Port:</strong> Carries multiple VLAN traffic using <strong>IEEE 802.1Q</strong> tagging (connects Switch to Switch or Switch to Router).</li>
      </ul>
    `,
    algorithm: `
Part A: Cisco Router Static Routing:
1. Connect 4 Cisco routers via serial cables (Se0/0/0) with clock rate 64000 on DCE ends.
2. Assign IP addresses to FastEthernet LAN and Serial WAN interfaces and execute 'no shutdown'.
3. Configure static routes on R1: ip route 192.168.2.0 255.255.255.0 10.1.1.2.
4. Verify routing table using 'show ip route' and ping remote hosts.

Part B: Switch VLAN Configuration:
1. Connect 2 Cisco 2960 switches via crossover trunk link on Fa0/24.
2. Create VLAN 10 (CSE) and VLAN 20 (ECE) on both switches.
3. Assign PC access ports: Fa0/1 to VLAN 10, Fa0/2 to VLAN 20.
4. Configure Fa0/24 as trunk port: switchport mode trunk.
5. Verify intra-VLAN ping succeeds and cross-VLAN ping is isolated.
    `,
    code: `// ==========================================
// 1. CISCO ROUTER CONFIGURATION (Static Routing)
// ==========================================
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# no ip domain-lookup

// LAN Interface
R1(config)# interface FastEthernet 0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit

// WAN Serial Interface (DCE with clock rate)
R1(config)# interface Serial 0/0/0
R1(config-if)# ip address 10.1.1.1 255.255.255.252
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# exit

// Static Route to R2 LAN (192.168.2.0/24) via R2 Serial (10.1.1.2)
R1(config)# ip route 192.168.2.0 255.255.255.0 10.1.1.2
R1(config)# end
R1# write memory

// ==========================================
// 2. CISCO SWITCH VLAN CONFIGURATION
// ==========================================
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1

// Create VLAN 10 (CSE) and VLAN 20 (ECE)
SW1(config)# vlan 10
SW1(config-vlan)# name CSE
SW1(config-vlan)# exit

SW1(config)# vlan 20
SW1(config-vlan)# name ECE
SW1(config-vlan)# exit

// Assign Access Port for PC0 (VLAN 10)
SW1(config)# interface FastEthernet 0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# exit

// Assign Access Port for PC1 (VLAN 20)
SW1(config)# interface FastEthernet 0/2
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
SW1(config-if)# exit

// Configure 802.1Q Trunk Port to Switch 2
SW1(config)# interface FastEthernet 0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# end
SW1# write memory`,
    output: `R1# show ip route
Codes: C - connected, S - static, R - RIP

C       10.1.1.0/30 is directly connected, Serial0/0/0
C    192.168.1.0/24 is directly connected, FastEthernet0/0
S    192.168.2.0/24 [1/0] via 10.1.1.2

SW1# show vlan brief
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/3, Fa0/4 ... Fa0/23
10   CSE                              active    Fa0/1
20   ECE                              active    Fa0/2

SW1# show interfaces trunk
Port        Mode             Encapsulation  Status        Native vlan
Fa0/24      on               802.1q         trunking      1

// Connectivity Test:
PC0 (192.168.10.1) ping PC2 (192.168.10.2 - Same VLAN 10): SUCCESS (0% loss)
PC0 (192.168.10.1) ping PC1 (192.168.20.1 - Cross VLAN 20): Request timed out (Isolated)`,
    viva: [
      { q: "What is IEEE 802.1Q?", a: "IEEE 802.1Q is the industry standard for VLAN tagging across trunk links, inserting a 4-byte tag into Ethernet frames including a 12-bit VLAN ID." },
      { q: "What is Administrative Distance (AD)?", a: "A measure of trustworthiness: Directly connected = 0, Static route = 1, OSPF = 110, RIP = 120." },
      { q: "Can devices in different VLANs communicate without a router?", a: "No. Communication between different VLANs requires a Layer 3 device (router or multilayer switch) to perform Inter-VLAN routing." }
    ],
    simulatorType: "cisco-router"
  },
  {
    id: "cn-exp-5",
    num: "5",
    title: "Installation Setup of Network Simulator Software",
    aim: "To document the step-by-step installation, dependency resolution, build configuration, and environment setup of network simulator tools: NS-3, NS-2, Cisco Packet Tracer, and OMNeT++.",
    objectives: [
      "Understand discrete-event network simulation architectures.",
      "Install NS-3 dependencies (GCC, Python, CMake, NetAnim) on Ubuntu/WSL.",
      "Build and verify sample simulation scripts."
    ],
    theory: `
      <h3>1. What is a Network Simulator?</h3>
      <p>A <strong>network simulator</strong> is software that models the behavior of a network without requiring physical hardware. Simulators model packet loss, queueing delays, congestion algorithms, wireless propagation, and protocol state transitions.</p>

      <h3>2. Major Simulators:</h3>
      <ul>
        <li><strong>NS-3 (Network Simulator 3):</strong> Modern open-source discrete-event simulator written in C++ with Python bindings. Does not use OTcl (unlike NS-2). Generates NetAnim XML traces and Wireshark PCAP files.</li>
        <li><strong>Cisco Packet Tracer:</strong> Visual network design and simulation software created by Cisco for CCNA training.</li>
        <li><strong>OMNeT++:</strong> Component-based C++ simulation library and framework, primarily used for telecommunications and distributed systems.</li>
      </ul>
    `,
    algorithm: `
NS-3 Setup Procedure on Linux / WSL:
1. Update system package repository: sudo apt update && sudo apt upgrade -y.
2. Install prerequisites: build-essential, gcc, g++, python3, cmake, git, qtbase5-dev (for NetAnim).
3. Download NS-3 source tarball: wget https://www.nsnam.org/release/ns-allinone-3.41.tar.bz2.
4. Extract archive: tar -xjf ns-allinone-3.41.tar.bz2 && cd ns-allinone-3.41/ns-3.41.
5. Configure the build with examples enabled: ./ns3 configure --enable-examples --enable-tests.
6. Build NS-3: ./ns3 build.
7. Verify by running the hello simulator: ./ns3 run hello-simulator.
8. Build NetAnim animator: cd ../netanim-3.x && qmake NetAnim.pro && make.
    `,
    code: `#!/bin/bash
# ========================================================
# Automated Setup Script for NS-3 & NetAnim on Ubuntu/WSL
# ========================================================

set -e
echo "[*] Step 1: Installing Core Dependencies..."
sudo apt update
sudo apt install -y build-essential cmake ninja-build git \
    python3 python3-pip g++ qtbase5-dev libxml2-dev

echo "[*] Step 2: Downloading NS-3..."
NS3_VER="3.41"
wget -c "https://www.nsnam.org/release/ns-allinone-\${NS3_VER}.tar.bz2"
tar -xjf "ns-allinone-\${NS3_VER}.tar.bz2"
cd "ns-allinone-\${NS3_VER}/ns-\${NS3_VER}"

echo "[*] Step 3: Configuring & Compiling NS-3..."
./ns3 configure --build-profile=optimized --enable-examples
./ns3 build

echo "[*] Step 4: Testing Hello Simulator..."
./ns3 run hello-simulator

echo "[SUCCESS] NS-3 has been compiled and verified successfully!"`,
    output: `student@cselab:~$ ./install_ns3.sh
[*] Step 1: Installing Core Dependencies...
[*] Step 2: Downloading NS-3...
[*] Step 3: Configuring & Compiling NS-3...
[1/2450] Compiling src/core/model/simulator.cc
[2450/2450] Linking build/lib/libns3.41-core.so
'build' finished successfully (1m 12s)
[*] Step 4: Testing Hello Simulator...
Hello Simulator
[SUCCESS] NS-3 has been compiled and verified successfully!`,
    viva: [
      { q: "What is the difference between NS-2 and NS-3?", a: "NS-2 used dual languages (C++ for core protocols and OTcl for simulation scripting). NS-3 is completely redesigned in pure C++ with optional Python bindings." },
      { q: "What tool is used to visualize animations in NS-3?", a: "NetAnim (Network Animator), which parses XML animation trace files generated during simulation." },
      { q: "Can NS-3 capture packets for analysis in Wireshark?", a: "Yes. NS-3 can write simulation packet flows directly into standard .pcap files." }
    ],
    simulatorType: "ns3-guide"
  },
  {
    id: "cn-exp-6",
    num: "6",
    title: "Simulation of Star Topology",
    aim: "To simulate a Star Topology using NS-3 with an Ethernet bridge switch node and CSMA channels, deploying UDP Echo Client-Server applications and analyzing NetAnim visualization.",
    objectives: [
      "Understand Carrier Sense Multiple Access (CSMA) and star topology simulation.",
      "Deploy NodeContainer, CsmaHelper, and BridgeHelper in NS-3.",
      "Generate NetAnim animation traces and analyze packet delivery."
    ],
    theory: `
      <h3>1. Star Topology with CSMA in NS-3</h3>
      <p>A star topology connects multiple peripheral nodes to a central Ethernet bridge/hub. In NS-3, this is simulated using the <code>CsmaHelper</code> and <code>BridgeHelper</code> to interconnect multiple point-to-point CSMA net devices through a central bridge node.</p>

      <h3>2. Applications:</h3>
      <ul>
        <li><code>UdpEchoServerApplication</code>: Listens on port 9 for incoming UDP datagrams and echoes them back.</li>
        <li><code>UdpEchoClientApplication</code>: Sends periodic UDP datagrams to the server IP/port and logs replies.</li>
        <li><code>AnimationInterface</code>: Records coordinates and packet events into <code>starcsma.xml</code> for playback in NetAnim.</li>
      </ul>
    `,
    algorithm: `
1. Start NS-3 simulation script.
2. Enable UdpEchoClient and UdpEchoServer logging components.
3. Create 1 central switch node (Node 0) and 4 leaf nodes (Nodes 1 to 4) using NodeContainer.
4. Configure CSMA channel with DataRate = 100Mbps and Delay = 6560ns.
5. Install NetDevices on leaf-to-switch links and bind them using BridgeHelper on Node 0.
6. Install InternetStackHelper on all leaf nodes.
7. Assign IPv4 addresses (10.1.1.0/24) to the leaf nodes.
8. Install UdpEchoServer on Node 2 (port 9).
9. Install UdpEchoClient on Node 1 targeting Node 2's IP address.
10. Attach AnimationInterface to generate "starcsma.xml" with node coordinates.
11. Run Simulator::Run(), destroy resources, and view results.
    `,
    code: `/*
 * Experiment 6: Simulation of Star Topology using NS-3 & CSMA
 * Clean, Optimized implementation (matches student's starcsma.cc)
 */

#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/csma-module.h"
#include "ns3/bridge-module.h"
#include "ns3/applications-module.h"
#include "ns3/mobility-module.h"
#include "ns3/netanim-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("StarCsmaExample");

int main(int argc, char *argv[]) {
    CommandLine cmd;
    cmd.Parse(argc, argv);

    // 1. Enable UDP Echo logging
    LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
    LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);

    // 2. Create nodes: Node 0 = Central Switch, Nodes 1..4 = Peripheral hosts
    NodeContainer switchNode;
    switchNode.Create(1);

    NodeContainer spokeNodes;
    spokeNodes.Create(4);

    // 3. Configure CSMA channel
    CsmaHelper csma;
    csma.SetChannelAttribute("DataRate", StringValue("100Mbps"));
    csma.SetChannelAttribute("Delay", TimeValue(NanoSeconds(6560)));

    // 4. Create connections between spokes and switch
    NetDeviceContainer switchDevices;
    NetDeviceContainer spokeDevices;

    for (uint32_t i = 0; i < spokeNodes.GetN(); i++) {
        NodeContainer pair(spokeNodes.Get(i), switchNode.Get(0));
        NetDeviceContainer link = csma.Install(pair);
        spokeDevices.Add(link.Get(0));
        switchDevices.Add(link.Get(1));
    }

    // 5. Install bridge on switch node
    BridgeHelper bridge;
    bridge.Install(switchNode.Get(0), switchDevices);

    // 6. Install Internet stack on spoke nodes
    InternetStackHelper internet;
    internet.Install(spokeNodes);

    Ipv4AddressHelper ipv4;
    ipv4.SetBase("10.1.1.0", "255.255.255.0");
    Ipv4InterfaceContainer interfaces = ipv4.Assign(spokeDevices);

    // 7. Install UDP Echo Server on Spoke Node 1 (Index 1 -> 10.1.1.2)
    UdpEchoServerHelper echoServer(9);
    ApplicationContainer serverApps = echoServer.Install(spokeNodes.Get(1));
    serverApps.Start(Seconds(1.0));
    serverApps.Stop(Seconds(10.0));

    // 8. Install UDP Echo Client on Spoke Node 0 (Index 0 -> 10.1.1.1)
    UdpEchoClientHelper echoClient(interfaces.GetAddress(1), 9);
    echoClient.SetAttribute("MaxPackets", UintegerValue(3));
    echoClient.SetAttribute("Interval", TimeValue(Seconds(1.0)));
    echoClient.SetAttribute("PacketSize", UintegerValue(1024));

    ApplicationContainer clientApps = echoClient.Install(spokeNodes.Get(0));
    clientApps.Start(Seconds(2.0));
    clientApps.Stop(Seconds(10.0));

    // 9. Mobility layout for NetAnim visualizer
    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(switchNode);
    mobility.Install(spokeNodes);

    AnimationInterface anim("starcsma.xml");
    anim.SetConstantPosition(switchNode.Get(0), 50.0, 50.0); // center
    anim.SetConstantPosition(spokeNodes.Get(0), 10.0, 50.0); // west
    anim.SetConstantPosition(spokeNodes.Get(1), 50.0, 10.0); // north
    anim.SetConstantPosition(spokeNodes.Get(2), 90.0, 50.0); // east
    anim.SetConstantPosition(spokeNodes.Get(3), 50.0, 90.0); // south

    Simulator::Run();
    Simulator::Destroy();
    return 0;
}`,
    output: `student@cselab:~$ ./ns3 run scratch/starcsma
At time 2s client sent 1024 bytes to 10.1.1.2 port 9
At time 2.00014s server received 1024 bytes from 10.1.1.1 port 49153
At time 2.00014s server sent 1024 bytes to 10.1.1.1 port 49153
At time 2.00028s client received 1024 bytes from 10.1.1.2 port 9
At time 3s client sent 1024 bytes to 10.1.1.2 port 9
At time 3.00014s server received 1024 bytes from 10.1.1.1 port 49153
At time 3.00014s server sent 1024 bytes to 10.1.1.1 port 49153
At time 3.00028s client received 1024 bytes from 10.1.1.2 port 9
Animation trace file 'starcsma.xml' written successfully.`,
    viva: [
      { q: "What is CSMA/CD?", a: "Carrier Sense Multiple Access with Collision Detection: nodes listen to the medium before transmitting (Carrier Sense), multiple nodes can access (Multiple Access), and if two transmit at once, they detect the collision and abort." },
      { q: "What does the BridgeHelper do in NS-3?", a: "It aggregates multiple network devices on a central node into a single virtual bridging device, simulating the packet forwarding behavior of a Layer 2 Ethernet switch." },
      { q: "How is Star Topology visualized in NetAnim?", a: "By using AnimationInterface and assigning 2D coordinates with ConstantPositionMobilityModel." }
    ],
    simulatorType: "star-traffic"
  },
  {
    id: "cn-exp-7",
    num: "7",
    title: "Simulation of Stop and Wait Protocol",
    aim: "To simulate the Stop-and-Wait ARQ (Automatic Repeat reQuest) protocol, analyzing timeout mechanisms, positive acknowledgments (ACK), frame loss, and retransmissions.",
    objectives: [
      "Understand flow control and error control at the Data Link Layer.",
      "Simulate sequence numbers (0 and 1) to detect duplicate frames.",
      "Calculate channel utilization and efficiency: $\\eta = 1 / (1 + 2a)$."
    ],
    theory: `
      <h3>1. Stop-and-Wait ARQ Protocol Principles</h3>
      <p>The <strong>Stop-and-Wait ARQ</strong> protocol is the simplest flow and error control protocol. The sender transmits <em>one frame at a time</em>, starts a retransmission timer, and stops to wait for an acknowledgment (ACK) from the receiver before sending the next frame.</p>

      <h3>2. Handling Faults:</h3>
      <ul>
        <li><strong>Lost Frame:</strong> If a data frame is lost in transit, the sender's timer expires, and the frame is automatically retransmitted.</li>
        <li><strong>Lost ACK:</strong> If the ACK is lost, the sender times out and retransmits the same frame. To prevent the receiver from accepting it as a new frame, <strong>1-bit sequence numbers (0 and 1)</strong> alternate.</li>
        <li><strong>Efficiency Formula:</strong>
          <br>Efficiency $\\eta = \\frac{T_{frame}}{T_{frame} + 2 \\cdot T_{prop}} = \\frac{1}{1 + 2a}$, where $a = \\frac{T_{prop}}{T_{frame}}$.
        </li>
      </ul>
    `,
    algorithm: `
1. Initialize sequence number seq = 0, total_packets = N.
2. For each packet i from 1 to N:
   a. Sender transmits Frame with sequence number seq.
   b. Start timeout timer.
   c. Receiver receives Frame:
      - If corrupted/lost: receiver discards frame.
      - If valid and seq matches expected: accept data, toggle expected seq, send ACK.
   d. Sender waits for ACK:
      - If ACK arrives before timeout: mark packet confirmed, seq = 1 - seq, advance to next packet.
      - If timer expires (Timeout): retransmit Frame with seq, restart timer, repeat step d.
3. Display total transmissions and calculate protocol efficiency.
4. Stop.
    `,
    code: `/*
 * Experiment 7: Stop-and-Wait ARQ Protocol Simulation
 * Interactive Console Simulation with Packet Loss & Retransmission
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

int main() {
    int total_packets, i = 1;
    int seq_num = 0;
    int max_retries = 3;

    printf("=== Stop-and-Wait ARQ Protocol Simulator ===\n");
    printf("Enter number of packets to transmit: ");
    scanf("%d", &total_packets);

    while (i <= total_packets) {
        printf("\n------------------------------------------------\n");
        printf("[SENDER] Sending Packet %d (Seq No: %d)...\n", i, seq_num);
        printf("[SENDER] Timer started (Timeout = 2.0s)\n");

        // Simulate Channel Conditions: 1 = Success, 2 = Frame Lost, 3 = ACK Lost
        int condition;
        printf("Simulate channel condition? [1: Success, 2: Frame Loss, 3: ACK Loss]: ");
        scanf("%d", &condition);

        if (condition == 2) {
            printf("  [CHANNEL] >> Frame %d LOST in transmission!\n", i);
            printf("[SENDER] !! TIMEOUT EXPIRED !! No ACK received.\n");
            printf("[SENDER] Retransmitting Packet %d (Seq No: %d)...\n", i, seq_num);
            printf("  [RECEIVER] Received retransmitted Packet %d (Seq No: %d)\n", i, seq_num);
            printf("  [RECEIVER] Sent ACK %d\n", 1 - seq_num);
            printf("[SENDER] Received ACK %d. Packet %d confirmed!\n", 1 - seq_num, i);
            seq_num = 1 - seq_num;
            i++;
        }
        else if (condition == 3) {
            printf("  [RECEIVER] Received Packet %d (Seq No: %d)\n", i, seq_num);
            printf("  [CHANNEL] >> ACK %d LOST in network!\n", 1 - seq_num);
            printf("[SENDER] !! TIMEOUT EXPIRED !! No ACK received.\n");
            printf("[SENDER] Retransmitting Packet %d (Seq No: %d)...\n", i, seq_num);
            printf("  [RECEIVER] Duplicate Packet %d received! Discarded, resending ACK %d\n", i, 1 - seq_num);
            printf("[SENDER] Received ACK %d. Packet %d confirmed!\n", 1 - seq_num, i);
            seq_num = 1 - seq_num;
            i++;
        }
        else {
            printf("  [RECEIVER] Received Packet %d (Seq No: %d) successfully.\n", i, seq_num);
            printf("  [RECEIVER] Sent ACK %d\n", 1 - seq_num);
            printf("[SENDER] Received ACK %d. Packet %d successfully delivered!\n", 1 - seq_num, i);
            seq_num = 1 - seq_num;
            i++;
        }
    }

    printf("\n================================================\n");
    printf("[SUCCESS] All %d packets transmitted successfully!\n", total_packets);
    return 0;
}`,
    output: `student@cselab:~$ gcc stop_and_wait.c -o stop_and_wait
student@cselab:~$ ./stop_and_wait
=== Stop-and-Wait ARQ Protocol Simulator ===
Enter number of packets to transmit: 3

------------------------------------------------
[SENDER] Sending Packet 1 (Seq No: 0)...
[SENDER] Timer started (Timeout = 2.0s)
Simulate channel condition? [1: Success, 2: Frame Loss, 3: ACK Loss]: 1
  [RECEIVER] Received Packet 1 (Seq No: 0) successfully.
  [RECEIVER] Sent ACK 1
[SENDER] Received ACK 1. Packet 1 successfully delivered!

------------------------------------------------
[SENDER] Sending Packet 2 (Seq No: 1)...
[SENDER] Timer started (Timeout = 2.0s)
Simulate channel condition? [1: Success, 2: Frame Loss, 3: ACK Loss]: 2
  [CHANNEL] >> Frame 2 LOST in transmission!
[SENDER] !! TIMEOUT EXPIRED !! No ACK received.
[SENDER] Retransmitting Packet 2 (Seq No: 1)...
  [RECEIVER] Received retransmitted Packet 2 (Seq No: 1)
  [RECEIVER] Sent ACK 0
[SENDER] Received ACK 0. Packet 2 confirmed!

================================================
[SUCCESS] All 3 packets transmitted successfully!`,
    viva: [
      { q: "Why are sequence numbers required in Stop-and-Wait ARQ?", a: "To distinguish between a newly transmitted frame and a retransmitted duplicate frame when an ACK is lost or delayed." },
      { q: "What is the maximum window size in Stop-and-Wait?", a: "Sender Window Size = 1, Receiver Window Size = 1." },
      { q: "Why is Stop-and-Wait inefficient over high-bandwidth-delay channels?", a: "Because the sender stays idle during the entire round-trip time (RTT) waiting for the ACK, underutilizing available bandwidth." }
    ],
    simulatorType: "stop-wait"
  },
  {
    id: "cn-exp-8",
    num: "8",
    title: "Simulation of Sliding Window Protocol",
    aim: "To simulate Sliding Window Protocols: Go-Back-N (GBN) and Selective Repeat (SR), comparing window management, cumulative vs independent acknowledgments, and retransmission strategies.",
    objectives: [
      "Understand pipelining in data transmission to overcome Stop-and-Wait latency.",
      "Implement Go-Back-N with cumulative ACKs and window size $2^m - 1$.",
      "Implement Selective Repeat with individual ACKs, receiver buffer, and window size $2^{m-1}$."
    ],
    theory: `
      <h3>1. Sliding Window Protocol Principles</h3>
      <p>Sliding window protocols allow the sender to transmit multiple frames before needing an acknowledgment, keeping the channel full and significantly increasing throughput.</p>

      <h3>2. Go-Back-N (GBN) ARQ vs Selective Repeat (SR) ARQ:</h3>
      <table>
        <tr><th>Feature</th><th>Go-Back-N (GBN)</th><th>Selective Repeat (SR)</th></tr>
        <tr><td>Sender Window Size ($W_s$)</td><td>$2^m - 1$</td><td>$2^{m-1}$</td></tr>
        <tr><td>Receiver Window Size ($W_r$)</td><td>$1$ (only accepts in-order)</td><td>$2^{m-1}$ (buffers out-of-order)</td></tr>
        <tr><td>Acknowledgments</td><td>Cumulative (ACK $n$ confirms all up to $n$)</td><td>Individual / Selective (ACK $n$ confirms only packet $n$)</td></tr>
        <tr><td>Retransmission on Loss</td><td>Retransmits <strong>all</strong> frames in the window from the lost frame onwards</td><td>Retransmits <strong>only</strong> the specific lost frame</td></tr>
        <tr><td>Receiver Buffering</td><td>No buffer needed</td><td>Requires memory buffer for out-of-order frames</td></tr>
      </table>
    `,
    algorithm: `
Go-Back-N Algorithm:
1. Define Sender Window Size W. Initialize base = 1, nextSeqNum = 1, total_packets = N.
2. While base <= N:
   a. Transmit packets while nextSeqNum < base + W and nextSeqNum <= N.
   b. If packet k is lost:
      - Receiver rejects packet k and discards subsequent packets (k+1..).
      - Sender timer for base packet expires (Timeout).
      - Sender "Goes Back" and retransmits all packets starting from base (base to nextSeqNum - 1).
   c. If packet k is acknowledged:
      - Advance base = k + 1 (Slide the window forward).
3. End when all packets are acknowledged.
    `,
    code: `/*
 * Experiment 8: Sliding Window Protocol Simulation
 * Comparing Go-Back-N (GBN) and Selective Repeat (SR) Logic
 */

#include <stdio.h>
#include <stdlib.h>

void simulate_go_back_n(int total_packets, int window_size) {
    printf("\n=== [SIMULATION] Go-Back-N ARQ (Window Size = %d) ===\n", window_size);
    int base = 1, next_seq = 1;

    while (base <= total_packets) {
        printf("\n[Current Window: [ ");
        for (int i = base; i < base + window_size && i <= total_packets; i++) {
            printf("%d ", i);
        }
        printf("]]\n");

        // Send window frames
        while (next_seq < base + window_size && next_seq <= total_packets) {
            printf("  [SENDER] Sent Frame %d\n", next_seq);
            next_seq++;
        }

        // Simulate random loss or user selection
        int lost_frame = base + 1; // Simulate loss of second frame in window
        if (lost_frame <= total_packets && base == 1) {
            printf("  [ALERT] >> Frame %d was LOST during transmission!\n", lost_frame);
            printf("  [RECEIVER] Discarded out-of-order frames.\n");
            printf("  [SENDER] !! Timeout for Frame %d !!\n", lost_frame);
            printf("  [SENDER] Go-Back-N: Retransmitting all frames starting from %d!\n", lost_frame);
            next_seq = lost_frame; // Reset next_seq back to lost frame
            base = lost_frame;
        } else {
            printf("  [RECEIVER] Received in-order. Sent Cumulative ACK %d\n", next_seq - 1);
            base = next_seq;
        }
    }
    printf("[GBN COMPLETE] All %d frames delivered successfully.\n", total_packets);
}

int main() {
    int total_packets = 6;
    int window_size = 3;

    simulate_go_back_n(total_packets, window_size);
    return 0;
}`,
    output: `student@cselab:~$ gcc sliding_window.c -o sliding_window
student@cselab:~$ ./sliding_window

=== [SIMULATION] Go-Back-N ARQ (Window Size = 3) ===

[Current Window: [ 1 2 3 ]]
  [SENDER] Sent Frame 1
  [SENDER] Sent Frame 2
  [SENDER] Sent Frame 3
  [ALERT] >> Frame 2 was LOST during transmission!
  [RECEIVER] Discarded out-of-order frames.
  [SENDER] !! Timeout for Frame 2 !!
  [SENDER] Go-Back-N: Retransmitting all frames starting from 2!

[Current Window: [ 2 3 4 ]]
  [SENDER] Sent Frame 2
  [SENDER] Sent Frame 3
  [SENDER] Sent Frame 4
  [RECEIVER] Received in-order. Sent Cumulative ACK 4

[Current Window: [ 5 6 ]]
  [SENDER] Sent Frame 5
  [SENDER] Sent Frame 6
  [RECEIVER] Received in-order. Sent Cumulative ACK 6
[GBN COMPLETE] All 6 frames delivered successfully.`,
    viva: [
      { q: "Why is the window size in Go-Back-N at most 2^m - 1?", a: "If the window size were 2^m, and all ACKs were lost, the sender would retransmit frames that the receiver could confuse with new frames from the next cycle because sequence numbers would wrap around." },
      { q: "What is the key advantage of Selective Repeat over Go-Back-N?", a: "Selective Repeat only retransmits the specific damaged or lost frame, avoiding the waste of retransmitting successfully delivered out-of-order frames." },
      { q: "What is a Cumulative Acknowledgment?", a: "An acknowledgment (e.g. ACK 5) that informs the sender that all frames up to and including frame 4 have been correctly received." }
    ],
    simulatorType: "sliding-window"
  },
  {
    id: "cn-exp-9",
    num: "9",
    title: "Simulation of Routing Algorithms (Link State & Distance Vector)",
    aim: "To implement and simulate dynamic routing algorithms: Distance Vector Routing (Bellman-Ford / RIP) and Link State Routing (Dijkstra's Algorithm / OSPF), computing routing tables and shortest paths.",
    objectives: [
      "Analyze the fundamental differences between Bellman-Ford and Dijkstra algorithms.",
      "Understand periodic routing table exchanges and the Count-to-Infinity problem.",
      "Simulate link-state advertisement (LSA) flooding and shortest path tree computation."
    ],
    theory: `
      <h3>1. Distance Vector Routing (Bellman-Ford / RIP)</h3>
      <p>Each node shares its entire routing table with only its <em>immediate neighbors</em> periodically. Distance metric: Hop count (RIP max 15 hops; 16 = unreachable).
      <br>Formula: $D_x(y) = \\min_v \\{ c(x, v) + D_v(y) \\}$.</p>
      <p><strong>Drawback:</strong> Suffers from the <strong>Count-to-Infinity</strong> problem during link failure, partially mitigated by <em>Split Horizon</em> and <em>Poison Reverse</em>.</p>

      <h3>2. Link State Routing (Dijkstra / OSPF)</h3>
      <p>Each node floods information about its local links (Link State Advertisements - LSAs) to <em>every node</em> in the entire network. Every router builds a complete topology graph and independently runs <strong>Dijkstra's Shortest Path Algorithm</strong> to compute its routing table.</p>
    `,
    algorithm: `
Distance Vector (Bellman-Ford) Algorithm:
1. Initialize distance matrix dist[i][j] = cost[i][j] (direct link cost) and nextHop[i][j] = j.
2. For k from 0 to N-1 (iterations until convergence):
   - For every source node i:
     - For every destination node j:
       - For every intermediate neighbor v:
         - If dist[i][v] + dist[v][j] < dist[i][j]:
           - dist[i][j] = dist[i][v] + dist[v][j]
           - nextHop[i][j] = nextHop[i][v]
3. Print final converged routing tables for all nodes.
    `,
    code: `/*
 * Experiment 9: Distance Vector Routing Algorithm
 * Bellman-Ford Implementation with Routing Table Display
 */

#include <stdio.h>

#define INF 999
#define NODES 4

int main() {
    int cost[NODES][NODES] = {
        {0,   2,   INF, 1},
        {2,   0,   3,   INF},
        {INF, 3,   0,   4},
        {1,   INF, 4,   0}
    };

    int dist[NODES][NODES];
    int nextHop[NODES][NODES];
    int i, j, k, updated;

    // Initialize distance and next hop tables
    for (i = 0; i < NODES; i++) {
        for (j = 0; j < NODES; j++) {
            dist[i][j] = cost[i][j];
            if (cost[i][j] != INF && i != j)
                nextHop[i][j] = j;
            else
                nextHop[i][j] = -1;
        }
    }

    // Bellman-Ford Algorithm Iterations
    do {
        updated = 0;
        for (i = 0; i < NODES; i++) {
            for (j = 0; j < NODES; j++) {
                for (k = 0; k < NODES; k++) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        nextHop[i][j] = nextHop[i][k];
                        updated = 1;
                    }
                }
            }
        }
    } while (updated);

    // Display Routing Tables
    printf("=== Converged Distance Vector Routing Tables ===\n");
    for (i = 0; i < NODES; i++) {
        printf("\n--- Routing Table for Node R%d ---\n", i + 1);
        printf("%-15s %-10s %-10s\n", "Destination", "Cost", "Next Hop");
        printf("----------------------------------\n");
        for (j = 0; j < NODES; j++) {
            if (i == j)
                printf("R%-14d %-10d %-10s\n", j + 1, 0, "Self");
            else
                printf("R%-14d %-10d R%-9d\n", j + 1, dist[i][j], nextHop[i][j] + 1);
        }
    }

    return 0;
}`,
    output: `student@cselab:~$ gcc dvr.c -o dvr
student@cselab:~$ ./dvr
=== Converged Distance Vector Routing Tables ===

--- Routing Table for Node R1 ---
Destination     Cost       Next Hop  
----------------------------------
R1              0          Self      
R2              2          R2        
R3              5          R2        
R4              1          R4        

--- Routing Table for Node R2 ---
Destination     Cost       Next Hop  
----------------------------------
R1              2          R1        
R2              0          Self      
R3              3          R3        
R4              3          R1`,
    viva: [
      { q: "What is the Count-to-Infinity problem?", a: "In distance vector routing, when a link breaks, neighboring routers slowly increment routing costs in an endless routing loop, taking a long time to declare a destination unreachable." },
      { q: "How does Split Horizon mitigate routing loops?", a: "Split Horizon dictates that a router never advertises a route back out the same interface through which it learned that route." },
      { q: "What is the maximum hop count allowed in RIP?", a: "15 hops. A metric of 16 represents infinity (unreachable network)." }
    ],
    simulatorType: "routing-algo"
  },
  {
    id: "cn-exp-10",
    num: "10",
    title: "Use Wireshark Packet Sniffer Software",
    aim: "To use Wireshark packet sniffer software to capture, filter, and dissect TCP (3-way handshake), UDP, IP, ARP, ICMP, Telnet, and FTP packets.",
    objectives: [
      "Understand packet capture in promiscuous mode.",
      "Analyze the TCP 3-Way Handshake (SYN, SYN-ACK, ACK).",
      "Apply Wireshark display and capture filters to isolate protocol streams."
    ],
    theory: `
      <h3>1. What is Wireshark?</h3>
      <p><strong>Wireshark</strong> is an industry-standard open-source network protocol analyzer. It captures packet traffic passing through network interface cards (NIC) in promiscuous mode and decodes protocol headers across all OSI layers.</p>

      <h3>2. Protocols Analyzed:</h3>
      <ul>
        <li><strong>TCP (Transmission Control Protocol):</strong> Connection-oriented, reliable. Establishes connection via <strong>3-Way Handshake</strong>:
          <ol>
            <li>Client $\\rightarrow$ Server: <code>[SYN]</code> Seq = 0</li>
            <li>Server $\\rightarrow$ Client: <code>[SYN, ACK]</code> Seq = 0, Ack = 1</li>
            <li>Client $\\rightarrow$ Server: <code>[ACK]</code> Seq = 1, Ack = 1</li>
          </ol>
        </li>
        <li><strong>UDP (User Datagram Protocol):</strong> Lightweight, connectionless, 8-byte header (Source Port, Dest Port, Length, Checksum).</li>
        <li><strong>ARP (Address Resolution Protocol):</strong> Broadcast request ("Who has 192.168.1.1?"), unicast reply ("192.168.1.1 is at e0:28:...").</li>
        <li><strong>ICMP (Internet Control Message Protocol):</strong> Diagnostic protocol used by ping. Type 8 = Echo Request, Type 0 = Echo Reply.</li>
      </ul>
    `,
    algorithm: `
Wireshark Packet Capture Procedure:
1. Launch Wireshark with administrative privileges.
2. Select active Network Interface (e.g., Wi-Fi or Ethernet).
3. Click the Blue Shark Fin icon to start live packet capture.
4. Generate traffic:
   - For ICMP: open terminal and run ping google.com.
   - For TCP: open browser and visit http://example.com.
   - For ARP: run arp -d * and ping local gateway.
5. Stop packet capture by clicking the Red Square button.
6. In the Filter Bar, apply protocol filters:
   - tcp.flags.syn == 1
   - icmp
   - arp
   - udp.port == 53
7. Inspect the Packet Details pane to view Frame, Ethernet II, IPv4, and Transport headers.
    `,
    code: `# Wireshark Display Filters Cheat Sheet:
# 1. Filter only TCP traffic:
tcp

# 2. Filter TCP 3-Way Handshake SYN packets:
tcp.flags.syn == 1 and tcp.flags.ack == 0

# 3. Filter ICMP Ping packets:
icmp

# 4. Filter ARP requests and replies:
arp

# 5. Filter DNS queries and responses:
udp.port == 53 or dns

# 6. Filter HTTP web traffic:
http or tcp.port == 80`,
    output: `Wireshark Packet Capture Analysis Log:

1. TCP 3-Way Handshake Capture:
   No.  Time      Source        Destination   Protocol  Length  Info
   1    0.000000  192.168.1.15  93.184.216.34 TCP       66      54210 -> 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460
   2    0.024180  93.184.216.34 192.168.1.15  TCP       66      80 -> 54210 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0
   3    0.024250  192.168.1.15  93.184.216.34 TCP       54      54210 -> 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0

2. ICMP Ping Request & Reply:
   4    0.051200  192.168.1.15  8.8.8.8       ICMP      74      Echo (ping) request  id=0x0001, seq=1/256, ttl=128
   5    0.068900  8.8.8.8       192.168.1.15  ICMP      74      Echo (ping) reply    id=0x0001, seq=1/256, ttl=116

3. ARP Broadcast & Reply:
   6    0.102000  192.168.1.15  Broadcast     ARP       42      Who has 192.168.1.1? Tell 192.168.1.15
   7    0.103100  192.168.1.1   192.168.1.15  ARP       60      192.168.1.1 is at e0:28:6d:74:aa:10`,
    viva: [
      { q: "What is Promiscuous Mode?", a: "A mode of network interface controllers (NICs) that causes the controller to pass all network traffic it receives to the CPU, rather than just frames addressed to its own MAC address." },
      { q: "Explain the TCP 3-Way Handshake flags.", a: "1. Client sends SYN (synchronize sequence number). 2. Server responds with SYN-ACK (synchronize and acknowledge). 3. Client replies with ACK (acknowledge)." },
      { q: "Why is Telnet considered insecure compared to SSH when viewed in Wireshark?", a: "Because Telnet transmits all data, including usernames and passwords, in unencrypted clear plaintext, allowing Wireshark to inspect credentials with 'Follow TCP Stream'." }
    ],
    simulatorType: "wireshark-sniffer"
  },
  {
    id: "cn-exp-11",
    num: "11",
    title: "Implement Socket Programming (Server - Client Architecture)",
    aim: "To implement TCP Client-Server Socket Programming in Python, demonstrating connection establishment, bidirectional message exchange, and graceful socket closure.",
    objectives: [
      "Understand the Berkeley Sockets API architecture and lifecycle.",
      "Implement server.bind(), server.listen(), server.accept(), and client.connect().",
      "Demonstrate transmission of strings encoded to UTF-8 bytes and graceful socket shutdown."
    ],
    theory: `
      <h3>1. What is Socket Programming?</h3>
      <p>A <strong>socket</strong> is an endpoint of a two-way communication link between two programs running across the network. A socket is bound to an IP address and a Port number so that the TCP layer can route incoming application data correctly.</p>

      <h3>2. TCP Server-Client Lifecycle:</h3>
      <ul>
        <li><strong>Server Side Lifecycle:</strong>
          <ol>
            <li><code>socket(AF_INET, SOCK_STREAM)</code>: Creates IPv4 TCP socket.</li>
            <li><code>server.bind((server_ip, port))</code>: Associates socket with specific IP and port.</li>
            <li><code>server.listen(backlog)</code>: Puts socket into passive listening mode.</li>
            <li><code>server.accept()</code>: Blocks until incoming client connection arrives, returning client socket and address tuple.</li>
            <li><code>client_socket.recv(1024)</code> &amp; <code>client_socket.send(response)</code>: Data communication.</li>
            <li><code>client_socket.close()</code> &amp; <code>server.close()</code>: Clean shutdown.</li>
          </ol>
        </li>
        <li><strong>Client Side Lifecycle:</strong>
          <ol>
            <li><code>socket(AF_INET, SOCK_STREAM)</code>: Creates client socket.</li>
            <li><code>client.connect((server_ip, port))</code>: Establishes TCP 3-way handshake with listening server.</li>
            <li><code>client.send(msg)</code> &amp; <code>client.recv(1024)</code>: Exchanging data.</li>
            <li><code>client.close()</code>: Terminating connection.</li>
          </ol>
        </li>
      </ul>
    `,
    algorithm: `
Server Algorithm (server.py):
1. Import socket module.
2. Create TCP server socket: server = socket.socket(socket.AF_INET, socket.SOCK_STREAM).
3. Bind socket to IP "127.0.0.1" and Port 8000.
4. Listen for incoming connections: server.listen(0).
5. Accept client connection: client_socket, client_address = server.accept().
6. Loop:
   a. Receive request: request = client_socket.recv(1024).decode('utf-8').
   b. If request is "close":
      - Send "closed" acknowledgment back to client.
      - Break loop.
   c. Print received request.
   d. Send response: client_socket.send("accepted".encode('utf-8')).
7. Close client_socket and server socket.
8. End.

Client Algorithm (client.py):
1. Import socket module.
2. Create TCP client socket: client = socket.socket(socket.AF_INET, socket.SOCK_STREAM).
3. Connect to server at ("127.0.0.1", 8000) using client.connect().
4. Loop:
   a. Input message string from user.
   b. Send message: client.send(msg.encode('utf-8')[:1024]).
   c. Receive response: response = client.recv(1024).decode('utf-8').
   d. If response is "closed": break loop.
   e. Print response received from server.
5. Close client socket.
6. End.
    `,
    code: `# ==========================================
# SERVER SIDE: server.py
# ==========================================
import socket

def run_server():
    # 1. Create a socket object (AF_INET = IPv4, SOCK_STREAM = TCP)
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"
    port = 8000

    # 2. Bind the socket to a specific address and port
    server.bind((server_ip, port))

    # 3. Listen for incoming connections
    server.listen(0)
    print(f"Listening on {server_ip}:{port}")

    # 4. Accept incoming connections (blocking)
    client_socket, client_address = server.accept()
    print(f"Accepted connection from {client_address[0]}:{client_address[1]}")

    # 5. Receive and respond to data from the client
    while True:
        request = client_socket.recv(1024)
        request = request.decode("utf-8") # convert bytes to string

        # If we receive "close" from client, break and close connection
        if request.lower() == "close":
            client_socket.send("closed".encode("utf-8"))
            break

        print(f"Received: {request}")

        response = "accepted".encode("utf-8") # convert string to bytes
        client_socket.send(response)

    # 6. Close connection socket with client
    client_socket.close()
    print("Connection to client closed")

    # 7. Close server socket
    server.close()

if __name__ == "__main__":
    run_server()


# ==========================================
# CLIENT SIDE: client.py
# ==========================================
import socket

def run_client():
    # 1. Create a socket object
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_ip = "127.0.0.1"  # Server's IP address
    server_port = 8000       # Server's port number

    # 2. Establish connection with server
    client.connect((server_ip, server_port))

    # 3. Communication loop
    while True:
        # Input message and send to server
        msg = input("Enter message: ")
        client.send(msg.encode("utf-8")[:1024])

        # Receive response from server
        response = client.recv(1024)
        response = response.decode("utf-8")

        # If server sent "closed", break out and close socket
        if response.lower() == "closed":
            break

        print(f"Received: {response}")

    # 4. Close client socket
    client.close()
    print("Connection to server closed")

if __name__ == "__main__":
    run_client()`,
    output: `// Sample Execution Command:
// Terminal 1 (Run Server First):
student@cselab:~$ python server.py
Listening on 127.0.0.1:8000
Accepted connection from 127.0.0.1:54322
Received: Hello Server
Received: Computer Networks Practical Exam
Connection to client closed

// Terminal 2 (Run Client):
student@cselab:~$ python client.py
Enter message: Hello Server
Received: accepted
Enter message: Computer Networks Practical Exam
Received: accepted
Enter message: close
Connection to server closed`,
    viva: [
      { q: "What is the difference between SOCK_STREAM and SOCK_DGRAM?", a: "SOCK_STREAM provides sequenced, reliable, two-way, connection-based byte streams using TCP. SOCK_DGRAM provides connectionless, unreliable datagrams using UDP." },
      { q: "Why do we call bind() on the server but usually not on the client?", a: "The server must bind to a well-known, fixed port number so clients know where to connect. The client's operating system automatically assigns an ephemeral (random available) port upon calling connect()." },
      { q: "What does the listen() backlog parameter mean?", a: "It defines the maximum length to which the queue of pending unaccepted connections for the socket may grow before new connection requests are rejected." },
      { q: "What does server.accept() return?", a: "It returns a tuple: (client_socket, client_address), where client_socket is a new dedicated socket used for communicating with that specific client, and client_address is (ip, port)." }
    ],
    simulatorType: "socket-terminal"
  },
  {
    id: "cn-exp-12",
    num: "12",
    title: "Implement SMTP Protocol",
    aim: "To implement the Simple Mail Transfer Protocol (SMTP) client in Python using smtplib to establish secure TLS connections, authenticate with App Passwords, and transmit emails to multiple recipients.",
    objectives: [
      "Understand the Application Layer mail transfer architecture.",
      "Explore the SMTP command-response state machine (HELO, MAIL FROM, RCPT TO, DATA, QUIT).",
      "Send secure emails using smtplib and Google App Passwords over port 587 (STARTTLS)."
    ],
    theory: `
      <h3>1. What is SMTP?</h3>
      <p><strong>SMTP (Simple Mail Transfer Protocol)</strong> is a push protocol used to send email from a client to a mail server or between mail servers over TCP. Standard ports: Port 25 (unencrypted MTA-to-MTA), Port 587 (STARTTLS client submission), Port 465 (SMTPS SSL).</p>

      <h3>2. SMTP Dialogue State Machine:</h3>
      <ul>
        <li><code>220 &lt;server&gt; Service ready</code>: Initial greeting from server.</li>
        <li><code>EHLO &lt;client&gt;</code>: Extended Hello identifying client hostname.</li>
        <li><code>STARTTLS</code>: Upgrades plaintext TCP connection to secure TLS encryption.</li>
        <li><code>AUTH LOGIN</code>: Base64-encoded username and password/app password.</li>
        <li><code>MAIL FROM: &lt;sender@domain.com&gt;</code>: Specifies sender address (reply: 250 OK).</li>
        <li><code>RCPT TO: &lt;recipient@domain.com&gt;</code>: Specifies destination recipient(s).</li>
        <li><code>DATA</code>: Initiates message body transfer (reply: 354 Start mail input; end with &lt;CRLF&gt;.&lt;CRLF&gt;).</li>
        <li><code>QUIT</code>: Closes the SMTP session (reply: 221 Bye).</li>
      </ul>
    `,
    algorithm: `
1. Start.
2. Import smtplib module.
3. Define sender email, app password, list of receiver email addresses, and message string.
4. For each receiver email in list:
   a. Create SMTP session: s = smtplib.SMTP('smtp.gmail.com', 587).
   b. Upgrade connection to TLS security: s.starttls().
   c. Authenticate using credentials: s.login(sender_email, app_password).
   d. Transmit email: s.sendmail(sender_email, receiver_email, message).
   e. Terminate session: s.quit().
5. Display delivery confirmation.
6. Stop.
    `,
    code: `"""
Experiment 12: SMTP Protocol Implementation in Python
Using smtplib and STARTTLS for secure email transmission
(Optimized and Cleaned version of student lab manual code)
"""

import smtplib

def send_smtp_email():
    # Mail server credentials
    sender_email = "student@cbit.ac.in"
    # Note: Use 16-character Google App Password (not account password)
    app_password = "abcd efgh ijkl mnop"

    # Recipient list
    recipients = ["friend1@gmail.com", "friend2@gmail.com"]

    message = """Subject: CBIT CN Lab - SMTP Protocol Demonstration

Hello!
This email demonstrates the automated implementation of Simple Mail Transfer
Protocol (SMTP) using Python's smtplib library with secure STARTTLS encryption.

Regards,
Computer Networks Lab, CBIT.
"""

    try:
        print("[*] Connecting to SMTP server (smtp.gmail.com:587)...")
        # 1. Establish connection to SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(1) # Prints full SMTP dialogue (EHLO, 250, etc.)

        # 2. Put connection into TLS mode
        print("[*] Initiating STARTTLS...")
        server.starttls()

        # 3. Authenticate with server
        print("[*] Authenticating with App Password...")
        server.login(sender_email, app_password)

        # 4. Send email to each recipient
        for dest in recipients:
            print(f"[*] Sending mail to: {dest}")
            server.sendmail(sender_email, dest, message)
            print(f"[+] Successfully sent to: {dest}")

        # 5. Terminate the SMTP session
        server.quit()
        print("[SUCCESS] All emails sent and SMTP session closed.")

    except Exception as e:
        print(f"[ERROR] SMTP Error: {e}")

if __name__ == "__main__":
    send_smtp_email()`,
    output: `student@cselab:~$ python smtp_client.py
[*] Connecting to SMTP server (smtp.gmail.com:587)...
send: 'ehlo [127.0.0.1]\r\n'
reply: b'220 smtp.gmail.com ESMTP ready\r\n'
reply: b'250-smtp.gmail.com at your service\r\n'
reply: b'250-STARTTLS\r\n'
reply: b'250 8BITMIME\r\n'
[*] Initiating STARTTLS...
send: 'STARTTLS\r\n'
reply: b'220 2.0.0 Ready to start TLS\r\n'
[*] Authenticating with App Password...
send: 'AUTH LOGIN\r\n'
reply: b'235 2.7.0 Accepted\r\n'
[*] Sending mail to: friend1@gmail.com
send: 'mail FROM:<student@cbit.ac.in>\r\n'
reply: b'250 2.1.0 OK\r\n'
send: 'rcpt TO:<friend1@gmail.com>\r\n'
reply: b'250 2.1.5 OK\r\n'
send: 'data\r\n'
reply: b'354 Go ahead\r\n'
send: 'Subject: CBIT CN Lab...\r\n.\r\n'
reply: b'250 2.0.0 OK: message queued\r\n'
[+] Successfully sent to: friend1@gmail.com
send: 'quit\r\n'
reply: b'221 2.0.0 closing connection\r\n'
[SUCCESS] All emails sent and SMTP session closed.`,
    viva: [
      { q: "What is the difference between POP3/IMAP and SMTP?", a: "SMTP is a push protocol used by clients and servers to send emails. POP3 and IMAP are pull protocols used by email clients to retrieve emails from a mailbox server." },
      { q: "Why is an App Password required instead of the standard Gmail password?", a: "Modern email providers require OAuth2 or 16-character dedicated App Passwords to prevent third-party scripts from storing the primary account credentials." },
      { q: "How does the SMTP server know the message body is finished?", a: "When the client transmits a carriage return and line feed followed by a single period on its own line: \\r\\n.\\r\\n." }
    ],
    simulatorType: "smtp-dialogue"
  }
];
