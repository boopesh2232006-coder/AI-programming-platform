import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: apiKey || "" });

const fallbackQuestions = [
  {
    question: "What does JVM stand for in Java?",
    options: ["Java Virtual Machine", "Java Verified Module", "Just Variable Memory", "Java Version Manager"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "JVM stands for Java Virtual Machine, which executes Java bytecode on any platform.",
    unit: "Java Fundamentals",
    topic: "Core Concepts"
  },
  {
    question: "Which keyword is used to define a class in Java?",
    options: ["function", "class", "struct", "module"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "The keyword 'class' is used in Java to define a class.",
    unit: "Java Fundamentals",
    topic: "Syntax"
  },
  {
    question: "Which Java collection preserves insertion order and allows duplicate elements?",
    options: ["HashSet", "TreeSet", "ArrayList", "PriorityQueue"],
    correctAnswer: 2,
    difficulty: "Medium",
    explanation: "ArrayList preserves insertion order and allows duplicate values.",
    unit: "Java Fundamentals",
    topic: "Collections"
  },
  {
    question: "Which access modifier allows visibility only within the same package?",
    options: ["public", "private", "protected", "default"],
    correctAnswer: 3,
    difficulty: "Medium",
    explanation: "Default access in Java is package-private, meaning it is visible only within the same package.",
    unit: "Java Fundamentals",
    topic: "Access Modifiers"
  },
  {
    question: "What is the output type of the 'main' method in Java?",
    options: ["void", "int", "String", "boolean"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "The main method in Java is declared with return type void because it does not return any value.",
    unit: "Java Fundamentals",
    topic: "Syntax"
  }
];

// Topic Videos - Curated video resources for each topic across all units
export const topicVideos = {
  "Java Fundamentals": {
    "Core Concepts": [
      { title: "JVM Architecture Explained", url: "https://www.youtube.com/watch?v=rRvq0qIIGD8", duration: "15:32" },
      { title: "Java Platform Overview", url: "https://www.youtube.com/watch?v=GoUHjzd73de", duration: "12:45" },
      { title: "Bytecode and Class Loading", url: "https://www.youtube.com/watch?v=8fcQKD6EXDU", duration: "18:20" },
      { title: "JVM Memory Management", url: "https://www.youtube.com/watch?v=nUpZquTHSVU", duration: "22:15" },
      { title: "Java Type System", url: "https://www.youtube.com/watch?v=5DMdCDQWWx0", duration: "16:40" }
    ],
    "Syntax": [
      { title: "Java Syntax Fundamentals", url: "https://www.youtube.com/watch?v=r8P0n2p9Z3E", duration: "20:15" },
      { title: "Java Classes and Objects", url: "https://www.youtube.com/watch?v=h8syLL-83iU", duration: "18:30" },
      { title: "Java Variables and Scopes", url: "https://www.youtube.com/watch?v=OJ7YBG5nHHE", duration: "14:25" },
      { title: "Java Operators", url: "https://www.youtube.com/watch?v=GoUHjzd73de", duration: "13:50" }
    ],
    "Collections": [
      { title: "Java Collections Overview", url: "https://www.youtube.com/watch?v=O3mKtcYK8lU", duration: "17:10" },
      { title: "ArrayList vs LinkedList", url: "https://www.youtube.com/watch?v=QiYZpVSIg6c", duration: "19:05" },
      { title: "HashMap and HashSet", url: "https://www.youtube.com/watch?v=tXQSuV7zzF4", duration: "18:40" }
    ]
  },
  "Data Structures & Algorithms": {
    "Arrays": [
      { title: "Array Data Structure Basics", url: "https://www.youtube.com/watch?v=QJNwK2uJyIo", duration: "11:20" },
      { title: "Array Operations and Algorithms", url: "https://www.youtube.com/watch?v=rYU3P8bVrX8", duration: "14:15" },
      { title: "Array Searching Techniques", url: "https://www.youtube.com/watch?v=rYU3P8bVrX8", duration: "14:15" }
    ],
    "Linked Lists": [
      { title: "Linked Lists Explained", url: "https://www.youtube.com/watch?v=WwfhLC16bis", duration: "15:45" },
      { title: "Singly and Doubly Linked Lists", url: "https://www.youtube.com/watch?v=p-8ZvI_t4UI", duration: "17:30" },
      { title: "Linked List Operations", url: "https://www.youtube.com/watch?v=WwfhLC16bis", duration: "15:45" }
    ],
    "Trees": [
      { title: "Binary Trees Tutorial", url: "https://www.youtube.com/watch?v=H6vor7jVM34", duration: "19:20" },
      { title: "Tree Traversal Algorithms", url: "https://www.youtube.com/watch?v=Tn1XO63ECDY", duration: "16:45" },
      { title: "Binary Search Trees", url: "https://www.youtube.com/watch?v=H6vor7jVM34", duration: "19:20" }
    ],
    "Graphs": [
      { title: "Graph Theory Basics", url: "https://www.youtube.com/watch?v=BRWjs8pw4Xc", duration: "18:10" },
      { title: "Graph Traversal Algorithms", url: "https://www.youtube.com/watch?v=7fGz6KTNDk8", duration: "17:45" }
    ],
    "Sorting": [
      { title: "Sorting Algorithms Explained", url: "https://www.youtube.com/watch?v=aQ5gz5NFAfY", duration: "15:00" },
      { title: "Quick Sort vs Merge Sort", url: "https://www.youtube.com/watch?v=4uG1NMKNWCU", duration: "16:30" }
    ],
    "Dynamic Programming": [
      { title: "Dynamic Programming Introduction", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk", duration: "22:00" },
      { title: "DP Problem Solving", url: "https://www.youtube.com/watch?v=O0j7ZZ-v2Fs", duration: "21:30" }
    ]
  },
  "Web Development": {
    "HTML Basics": [
      { title: "HTML Introduction", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", duration: "12:45" },
      { title: "HTML Document Structure", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", duration: "12:45" },
      { title: "HTML Forms and Inputs", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", duration: "12:45" }
    ],
    "CSS Basics": [
      { title: "CSS Fundamentals", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", duration: "15:30" },
      { title: "CSS Layout", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", duration: "15:30" },
      { title: "CSS Flexbox", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", duration: "15:30" }
    ],
    "JavaScript Basics": [
      { title: "JavaScript Fundamentals", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "2:30:00" },
      { title: "JavaScript DOM", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "2:30:00" },
      { title: "JavaScript Events", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk", duration: "2:30:00" }
    ]
  },
  "Python Programming": {
    "Python Basics": [
      { title: "Python Fundamentals", url: "https://www.youtube.com/watch?v=rfscVS0vtik", duration: "4:27:00" },
      { title: "Variables and Data Types", url: "https://www.youtube.com/watch?v=7hAV4qKVP-Y", duration: "8:30" },
      { title: "Control Flow", url: "https://www.youtube.com/watch?v=dU1xS07jVzU", duration: "12:45" }
    ],
    "Object-Oriented Programming": [
      { title: "Python Classes and Objects", url: "https://www.youtube.com/watch?v=wfcWRAxRV5k", duration: "20:15" },
      { title: "Inheritance and Polymorphism", url: "https://www.youtube.com/watch?v=RSl87lqOXQE", duration: "18:30" },
      { title: "Encapsulation and Abstraction", url: "https://www.youtube.com/watch?v=p33CVV29OG8", duration: "15:20" }
    ],
    "Data Science": [
      { title: "NumPy Tutorial", url: "https://www.youtube.com/watch?v=QUT1VHiUKYQ", duration: "4:10:00" },
      { title: "Pandas Data Analysis", url: "https://www.youtube.com/watch?v=vmEHCJofslg", duration: "10:15:00" },
      { title: "Machine Learning with Scikit-learn", url: "https://www.youtube.com/watch?v=0Lt1DyjO_OU", duration: "3:30:00" }
    ]
  },
  "JavaScript & TypeScript": {
    "Modern JavaScript": [
      { title: "ES6 Features", url: "https://www.youtube.com/watch?v=WZcxJGmLbSo", duration: "1:15:00" },
      { title: "Async/Await and Promises", url: "https://www.youtube.com/watch?v=vn3tm0quoqE", duration: "22:30" },
      { title: "JavaScript Closures", url: "https://www.youtube.com/watch?v=1S8SBDhA7ow", duration: "12:50" }
    ],
    "TypeScript": [
      { title: "TypeScript Basics", url: "https://www.youtube.com/watch?v=d56mHVMyE0E", duration: "1:45:00" },
      { title: "Advanced Types and Generics", url: "https://www.youtube.com/watch?v=ts1kEND7msA", duration: "2:15:00" },
      { title: "TypeScript with React", url: "https://www.youtube.com/watch?v=FJDVKeh7RJI", duration: "1:30:00" }
    ],
    "React & Vue": [
      { title: "React Complete Guide", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "5:30:00" },
      { title: "Vue.js Fundamentals", url: "https://www.youtube.com/watch?v=bzlF1RcqSJg", duration: "3:45:00" },
      { title: "State Management with Redux", url: "https://www.youtube.com/watch?v=W80IM0tErug", duration: "1:35:00" }
    ]
  },
  "Mobile Development": {
    "iOS Development": [
      { title: "Swift Programming Basics", url: "https://www.youtube.com/watch?v=comQ8-7l7Dc", duration: "3:00:00" },
      { title: "SwiftUI Fundamentals", url: "https://www.youtube.com/watch?v=fQrxMZcUWezA", duration: "4:30:00" },
      { title: "Building iOS Apps", url: "https://www.youtube.com/watch?v=Og0Z6iAGXlQ", duration: "2:45:00" }
    ],
    "Android Development": [
      { title: "Android Studio Setup", url: "https://www.youtube.com/watch?v=FjrZtcc5iI0", duration: "25:30" },
      { title: "Kotlin for Android", url: "https://www.youtube.com/watch?v=LOcg2l-za3c", duration: "2:20:00" },
      { title: "Android UI Components", url: "https://www.youtube.com/watch?v=xXUvuFMjBdc", duration: "3:15:00" }
    ],
    "Cross-Platform": [
      { title: "Flutter Basics", url: "https://www.youtube.com/watch?v=1gDhl4leEzA", duration: "6:30:00" },
      { title: "React Native Guide", url: "https://www.youtube.com/watch?v=0-S5a0eS6Q8", duration: "4:00:00" },
      { title: "Dart Programming", url: "https://www.youtube.com/watch?v=Ej_6SNzuIHE", duration: "2:45:00" }
    ]
  },
  "Backend Development": {
    "Node.js & Express": [
      { title: "Node.js Basics", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", duration: "3:30:00" },
      { title: "Express.js Framework", url: "https://www.youtube.com/watch?v=g_xE2fMVbgI", duration: "2:00:00" },
      { title: "REST API Development", url: "https://www.youtube.com/watch?v=l8WPWK9mS5M", duration: "5:00:00" }
    ],
    "Django & Flask": [
      { title: "Django Full Course", url: "https://www.youtube.com/watch?v=PtQiiknWUcI", duration: "8:45:00" },
      { title: "Flask Fundamentals", url: "https://www.youtube.com/watch?v=Z1RJmh_OqeA", duration: "7:30:00" },
      { title: "Building Web APIs with Django", url: "https://www.youtube.com/watch?v=D6eghRoE4G8", duration: "4:20:00" }
    ],
    "Java Spring Boot": [
      { title: "Spring Boot Basics", url: "https://www.youtube.com/watch?v=UjNBjCenT1s", duration: "3:15:00" },
      { title: "Spring Data and JPA", url: "https://www.youtube.com/watch?v=jOupHNvDIqw", duration: "2:30:00" },
      { title: "Microservices with Spring Boot", url: "https://www.youtube.com/watch?v=y8IQb4oSXes", duration: "3:45:00" }
    ]
  },
  "Frontend Development": {
    "HTML & CSS": [
      { title: "HTML5 Complete Guide", url: "https://www.youtube.com/watch?v=mU6anWqk3SU", duration: "6:30:00" },
      { title: "CSS Grid and Flexbox", url: "https://www.youtube.com/watch?v=VlFbKHqM7fU", duration: "2:15:00" },
      { title: "Responsive Web Design", url: "https://www.youtube.com/watch?v=srvUrASNj0s", duration: "3:00:00" }
    ],
    "CSS Frameworks": [
      { title: "Tailwind CSS Complete", url: "https://www.youtube.com/watch?v=lCxcTsOHrjo", duration: "4:15:00" },
      { title: "Bootstrap 5 Guide", url: "https://www.youtube.com/watch?v=O_9u1P5YjVc", duration: "3:45:00" },
      { title: "Material Design UI", url: "https://www.youtube.com/watch?v=kRhSFsKMRC8", duration: "2:30:00" }
    ],
    "Web Performance": [
      { title: "Web Performance Optimization", url: "https://www.youtube.com/watch?v=n2dBR3o9YBo", duration: "1:45:00" },
      { title: "Image Optimization", url: "https://www.youtube.com/watch?v=YJGtsqSHoFQ", duration: "28:15" },
      { title: "Lighthouse and Web Metrics", url: "https://www.youtube.com/watch?v=XxIj1dveVT0", duration: "35:20" }
    ]
  },
  "Database Management": {
    "SQL": [
      { title: "SQL Fundamentals", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4:30:00" },
      { title: "Advanced SQL Queries", url: "https://www.youtube.com/watch?v=BPHAVVKWwVQ", duration: "3:15:00" },
      { title: "Database Design", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", duration: "2:45:00" }
    ],
    "NoSQL": [
      { title: "MongoDB Complete Guide", url: "https://www.youtube.com/watch?v=ofme2o29ngU", duration: "7:50:00" },
      { title: "Firebase Realtime Database", url: "https://www.youtube.com/watch?v=9kRgVxULbag", duration: "1:30:00" },
      { title: "Redis Caching", url: "https://www.youtube.com/watch?v=OqCK95AS-YE", duration: "2:20:00" }
    ],
    "Database Administration": [
      { title: "PostgreSQL Tutorial", url: "https://www.youtube.com/watch?v=qw--U5P91y8", duration: "3:45:00" },
      { title: "MySQL Optimization", url: "https://www.youtube.com/watch?v=2bW3wTTWvPE", duration: "2:30:00" },
      { title: "Database Backup and Recovery", url: "https://www.youtube.com/watch?v=_79Ytt5dFzg", duration: "1:50:00" }
    ]
  },
  "DevOps & Cloud": {
    "Docker & Containers": [
      { title: "Docker Fundamentals", url: "https://www.youtube.com/watch?v=3c-iBn73dLA", duration: "2:20:00" },
      { title: "Docker Compose", url: "https://www.youtube.com/watch?v=HG6yZ7JZ1fI", duration: "1:30:00" },
      { title: "Containerization Best Practices", url: "https://www.youtube.com/watch?v=8vXoMqWgbQQ", duration: "42:15" }
    ],
    "Kubernetes": [
      { title: "Kubernetes Complete Guide", url: "https://www.youtube.com/watch?v=d6WC5n9G_sM", duration: "4:30:00" },
      { title: "Kubernetes Services and Networking", url: "https://www.youtube.com/watch?v=n_qzr5g1j8g", duration: "2:15:00" },
      { title: "Helm Package Manager", url: "https://www.youtube.com/watch?v=fy8SJlxQv50", duration: "1:45:00" }
    ],
    "Cloud Platforms": [
      { title: "AWS Complete Course", url: "https://www.youtube.com/watch?v=3hLmDS179YE", duration: "26:00:00" },
      { title: "Google Cloud Platform Basics", url: "https://www.youtube.com/watch?v=QYLP7-JiZAE", duration: "3:30:00" },
      { title: "Azure Fundamentals", url: "https://www.youtube.com/watch?v=NPEsD6n9A_I", duration: "5:00:00" }
    ]
  },
  "Software Design Patterns": {
    "Creational Patterns": [
      { title: "Singleton Pattern", url: "https://www.youtube.com/watch?v=hUE3G6OKKNI", duration: "18:20" },
      { title: "Factory Pattern", url: "https://www.youtube.com/watch?v=ub0DXaeV6hY", duration: "16:45" },
      { title: "Builder and Prototype Patterns", url: "https://www.youtube.com/watch?v=riMqR0Rm4tI", duration: "22:30" }
    ],
    "Structural Patterns": [
      { title: "Adapter and Bridge Patterns", url: "https://www.youtube.com/watch?v=v-GiuMmsXJ4", duration: "20:15" },
      { title: "Decorator Pattern", url: "https://www.youtube.com/watch?v=GCraGHx6gso", duration: "17:50" },
      { title: "Facade Pattern", url: "https://www.youtube.com/watch?v=K5yXjVN2snA", duration: "15:30" }
    ],
    "Behavioral Patterns": [
      { title: "Observer Pattern", url: "https://www.youtube.com/watch?v=_BpmfnqjgzQ", duration: "19:45" },
      { title: "State and Strategy Patterns", url: "https://www.youtube.com/watch?v=_7O3ckLCPEY", duration: "23:10" },
      { title: "Command and Iterator Patterns", url: "https://www.youtube.com/watch?v=9jIkJI6qByc", duration: "24:20" }
    ]
  },
  "Testing & QA": {
    "Unit Testing": [
      { title: "JUnit Testing in Java", url: "https://www.youtube.com/watch?v=W383h59HdKE", duration: "2:30:00" },
      { title: "Jest for JavaScript", url: "https://www.youtube.com/watch?v=7r4xVZIrMZ8", duration: "2:00:00" },
      { title: "Pytest for Python", url: "https://www.youtube.com/watch?v=bbp_849-RZ4", duration: "3:15:00" }
    ],
    "Integration Testing": [
      { title: "Integration Testing Principles", url: "https://www.youtube.com/watch?v=QYCaaNz8emY", duration: "1:45:00" },
      { title: "Selenium Web Testing", url: "https://www.youtube.com/watch?v=RbSlW8jZGe8", duration: "6:30:00" },
      { title: "API Testing with Postman", url: "https://www.youtube.com/watch?v=VywxIQ2ZXw4", duration: "2:20:00" }
    ],
    "Performance & Load Testing": [
      { title: "JMeter Performance Testing", url: "https://www.youtube.com/watch?v=iabK47bZ1zY", duration: "3:15:00" },
      { title: "Load Testing Best Practices", url: "https://www.youtube.com/watch?v=EQxJPJqkKZ4", duration: "1:30:00" },
      { title: "Monitoring and Profiling", url: "https://www.youtube.com/watch?v=iUH0SgaMKpU", duration: "2:00:00" }
    ]
  },
  "Machine Learning & AI": {
    "Deep Learning": [
      { title: "Neural Networks Fundamentals", url: "https://www.youtube.com/watch?v=aircArM63fw", duration: "3:30:00" },
      { title: "TensorFlow Complete Guide", url: "https://www.youtube.com/watch?v=tPYj3fFJbGo", duration: "5:45:00" },
      { title: "Convolutional Neural Networks", url: "https://www.youtube.com/watch?v=QyJW9chlamM", duration: "2:15:00" }
    ],
    "Natural Language Processing": [
      { title: "NLP with Python", url: "https://www.youtube.com/watch?v=FLZvOKSCkxY", duration: "3:00:00" },
      { title: "BERT and Transformers", url: "https://www.youtube.com/watch?v=xI1_MHbW_qU", duration: "2:30:00" },
      { title: "Text Classification and Analysis", url: "https://www.youtube.com/watch?v=6AM6UmYDEMw", duration: "1:45:00" }
    ],
    "Computer Vision": [
      { title: "Image Processing Basics", url: "https://www.youtube.com/watch?v=vVaRhVV-QdE", duration: "2:20:00" },
      { title: "Object Detection with YOLO", url: "https://www.youtube.com/watch?v=n9_XyCGr-MI", duration: "1:50:00" },
      { title: "Facial Recognition Systems", url: "https://www.youtube.com/watch?v=5MLvmhTLvFI", duration: "2:00:00" }
    ]
  },
  "Cybersecurity & Network Security": {
    "Web Security": [
      { title: "OWASP Top 10", url: "https://www.youtube.com/watch?v=Z8ZAv_5KyKI", duration: "2:15:00" },
      { title: "SQL Injection Prevention", url: "https://www.youtube.com/watch?v=_Z9RQSnIWFo", duration: "28:30" },
      { title: "Cross-Site Scripting (XSS) Defense", url: "https://www.youtube.com/watch?v=L5l3lplCH50", duration: "22:45" }
    ],
    "Cryptography": [
      { title: "Cryptography Fundamentals", url: "https://www.youtube.com/watch?v=jhXCTbFnK8o", duration: "3:00:00" },
      { title: "RSA and Public Key Encryption", url: "https://www.youtube.com/watch?v=wXB-V_CFt30", duration: "25:15" },
      { title: "Hashing and Digital Signatures", url: "https://www.youtube.com/watch?v=gj7Mse7-6rE", duration: "1:45:00" }
    ],
    "Network Security": [
      { title: "Network Protocols and Security", url: "https://www.youtube.com/watch?v=qiQR5rTSshw", duration: "2:45:00" },
      { title: "Firewalls and VPNs", url: "https://www.youtube.com/watch?v=mEHkDHV1Akc", duration: "1:30:00" },
      { title: "Penetration Testing Basics", url: "https://www.youtube.com/watch?v=X2osVFmydqI", duration: "3:15:00" }
    ]
  },
  "Blockchain & Web3": {
    "Blockchain Fundamentals": [
      { title: "Bitcoin and Blockchain Basics", url: "https://www.youtube.com/watch?v=bBC-nYknJ-g", duration: "1:30:00" },
      { title: "How Blockchain Works", url: "https://www.youtube.com/watch?v=SSo_EIwHScE", duration: "12:35" },
      { title: "Cryptocurrency Economics", url: "https://www.youtube.com/watch?v=0aNuHWU6Qaw", duration: "2:00:00" }
    ],
    "Smart Contracts": [
      { title: "Solidity Programming", url: "https://www.youtube.com/watch?v=M576WGiDBdQ", duration: "5:45:00" },
      { title: "Ethereum Smart Contracts", url: "https://www.youtube.com/watch?v=sTOcqS4msoU", duration: "4:30:00" },
      { title: "DeFi and Decentralized Finance", url: "https://www.youtube.com/watch?v=k9HYC0EJU6E", duration: "2:15:00" }
    ],
    "Web3 Development": [
      { title: "Web3.js Library", url: "https://www.youtube.com/watch?v=rvrMhGHHXdE", duration: "2:30:00" },
      { title: "Building dApps", url: "https://www.youtube.com/watch?v=rZZff2EwQWU", duration: "3:45:00" },
      { title: "NFT Development", url: "https://www.youtube.com/watch?v=SV2006DJlRc", duration: "2:00:00" }
    ]
  },
  "Game Development": {
    "Unity Engine": [
      { title: "Unity Complete Beginner", url: "https://www.youtube.com/watch?v=atFcJXlKfPI", duration: "6:30:00" },
      { title: "C# for Game Development", url: "https://www.youtube.com/watch?v=IFayQioG71A", duration: "4:15:00" },
      { title: "Physics and Collision Detection", url: "https://www.youtube.com/watch?v=E0cJqLRnVfI", duration: "2:45:00" }
    ],
    "Unreal Engine": [
      { title: "Unreal Engine 5 Basics", url: "https://www.youtube.com/watch?v=0CUTXWT4X2c", duration: "3:30:00" },
      { title: "Blueprint Game Development", url: "https://www.youtube.com/watch?v=y76R-Dx8cjo", duration: "5:00:00" },
      { title: "C++ for Unreal", url: "https://www.youtube.com/watch?v=SXdvI6DykAI", duration: "4:45:00" }
    ],
    "Game Design": [
      { title: "Game Design Fundamentals", url: "https://www.youtube.com/watch?v=GkB0w2kxWWY", duration: "2:00:00" },
      { title: "Game Loop and State Management", url: "https://www.youtube.com/watch?v=1OqVWL6L8aI", duration: "1:30:00" },
      { title: "Multiplayer and Networking", url: "https://www.youtube.com/watch?v=B0I4i0KWlP0", duration: "2:30:00" }
    ]
  },
  "System Design & Architecture": {
    "Architectural Patterns": [
      { title: "Microservices Architecture", url: "https://www.youtube.com/watch?v=J-JP6z-zZWM", duration: "1:45:00" },
      { title: "Event-Driven Architecture", url: "https://www.youtube.com/watch?v=STKCRSUsyP0", duration: "1:30:00" },
      { title: "CQRS Pattern", url: "https://www.youtube.com/watch?v=L15xWVRGPPQ", duration: "45:30" }
    ],
    "Scalability": [
      { title: "Horizontal and Vertical Scaling", url: "https://www.youtube.com/watch?v=x3u_b7sPNMU", duration: "1:20:00" },
      { title: "Load Balancing Strategies", url: "https://www.youtube.com/watch?v=galcDo4wdBw", duration: "42:15" },
      { title: "Database Sharding and Partitioning", url: "https://www.youtube.com/watch?v=5eKZzLx7eYk", duration: "1:50:00" }
    ],
    "High Availability": [
      { title: "Fault Tolerance and Resilience", url: "https://www.youtube.com/watch?v=KPXrg5Hl37I", duration: "1:35:00" },
      { title: "Disaster Recovery Planning", url: "https://www.youtube.com/watch?v=gvpglL1yzYs", duration: "1:25:00" },
      { title: "CAP Theorem and Consistency", url: "https://www.youtube.com/watch?v=k-Yaq8AYY7k", duration: "1:10:00" }
    ]
  },
  "API Development & REST": {
    "REST API Design": [
      { title: "RESTful API Best Practices", url: "https://www.youtube.com/watch?v=l8WPWK9mS5M", duration: "5:00:00" },
      { title: "HTTP Status Codes and Methods", url: "https://www.youtube.com/watch?v=9OfL4SkjJJs", duration: "42:30" },
      { title: "API Versioning Strategies", url: "https://www.youtube.com/watch?v=9DfQ4sHNSPM", duration: "1:15:00" }
    ],
    "GraphQL": [
      { title: "GraphQL Complete Tutorial", url: "https://www.youtube.com/watch?v=ed8SzALpx1Q", duration: "3:45:00" },
      { title: "Apollo Server Setup", url: "https://www.youtube.com/watch?v=7Oe96sI-DXE", duration: "2:30:00" },
      { title: "Schema Design and Queries", url: "https://www.youtube.com/watch?v=LhZrHeiCHD4", duration: "2:00:00" }
    ],
    "API Security": [
      { title: "OAuth 2.0 and JWT", url: "https://www.youtube.com/watch?v=xQnndVrHoDE", duration: "1:45:00" },
      { title: "API Rate Limiting", url: "https://www.youtube.com/watch?v=Ua6P8-aN_WU", duration: "28:40" },
      { title: "API Documentation with Swagger", url: "https://www.youtube.com/watch?v=apzWQQNyrLY", duration: "1:30:00" }
    ]
  },
  "CI/CD & Automation": {
    "Continuous Integration": [
      { title: "Jenkins Complete Guide", url: "https://www.youtube.com/watch?v=3a8KsB5wJDE", duration: "5:30:00" },
      { title: "GitHub Actions Workflow", url: "https://www.youtube.com/watch?v=W1p_dP8WkTw", duration: "3:15:00" },
      { title: "GitLab CI/CD Pipeline", url: "https://www.youtube.com/watch?v=1verIAUhdzc", duration: "2:45:00" }
    ],
    "Continuous Deployment": [
      { title: "Deployment Strategies", url: "https://www.youtube.com/watch?v=6EzJzZvEW_U", duration: "1:40:00" },
      { title: "Blue-Green Deployment", url: "https://www.youtube.com/watch?v=HKy2FSKPW8M", duration: "1:05:00" },
      { title: "Canary Releases", url: "https://www.youtube.com/watch?v=POBpjxo6uRM", duration: "38:20" }
    ],
    "Infrastructure as Code": [
      { title: "Terraform Complete Guide", url: "https://www.youtube.com/watch?v=l5k1ai_GBDE", duration: "4:30:00" },
      { title: "Ansible Automation", url: "https://www.youtube.com/watch?v=adXJhFMhrmE", duration: "3:45:00" },
      { title: "CloudFormation on AWS", url: "https://www.youtube.com/watch?v=7-q4LCZGQ3c", duration: "2:30:00" }
    ]
  },
  "Agile & Software Engineering": {
    "Agile Methodology": [
      { title: "Scrum Complete Guide", url: "https://www.youtube.com/watch?v=Cje6pK9a0qE", duration: "2:00:00" },
      { title: "Kanban Workflow", url: "https://www.youtube.com/watch?v=DIvxuDB0YBI", duration: "1:15:00" },
      { title: "Sprint Planning and Retrospectives", url: "https://www.youtube.com/watch?v=D4C0aLrhVzI", duration: "1:45:00" }
    ],
    "Team Collaboration": [
      { title: "Git and Version Control", url: "https://www.youtube.com/watch?v=mJ-qvsxPHpY", duration: "3:30:00" },
      { title: "Code Review Best Practices", url: "https://www.youtube.com/watch?v=8l5g33Kpmb8", duration: "1:25:00" },
      { title: "Documentation and Communication", url: "https://www.youtube.com/watch?v=L9SfMyXGdKQ", duration: "52:30" }
    ],
    "Project Management": [
      { title: "Project Management Fundamentals", url: "https://www.youtube.com/watch?v=4Hlu3H_tA1E", duration: "2:45:00" },
      { title: "Risk Management in Software", url: "https://www.youtube.com/watch?v=BkVqFZVV_jU", duration: "1:35:00" },
      { title: "Technical Debt Management", url: "https://www.youtube.com/watch?v=BkVqFZVV_jU", duration: "1:20:00" }
    ]
  }
};

export function getFallbackQuestion(previousPerformance: string, askedQuestions: string[] = []) {
  for (const q of fallbackQuestions) {
    if (!askedQuestions.includes(q.question)) {
      return q;
    }
  }
  return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
}

export function getAllUnits() {
  return Object.keys(topicVideos);
}

export async function getPersonalizedFeedback(score: number, total: number, answers: any[]) {
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze the following assessment results for a Java developer:
Score: ${score}/${total}
Answers: ${JSON.stringify(answers)}

Provide a personalized feedback report including:
1. Strengths identified.
2. Specific skill gaps (e.g., multithreading, Spring Boot, security).
3. A recommended learning path for the next 4 weeks.
4. Encouraging remarks for inclusivity.

Format the response as Markdown.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Feedback currently unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI feedback. Please try again later.";
  }
}

// Tamil Language Videos
export const tamilVideos = {
  "Java Fundamentals": {
    "Core Concepts": [
      { title: "JVM ஆர்கிடெக்சர் விளக்கம்", url: "https://www.youtube.com/watch?v=fY3u_lB3jdg", duration: "15:32", language: "Tamil" },
      { title: "Java தட்டெழுத்து மற்றும் வகுப்பு ஏற்றம்", url: "https://www.youtube.com/watch?v=vPm1aNVeX-s", duration: "18:20", language: "Tamil" },
      { title: "JVM நினைவு மேலாண்மை", url: "https://www.youtube.com/watch?v=3X9zP0JmBPQ", duration: "22:15", language: "Tamil" }
    ],
    "Syntax": [
      { title: "Java தொடரியல் அடிப்படைகள்", url: "https://www.youtube.com/watch?v=C-PZYjQHYkM", duration: "20:15", language: "Tamil" },
      { title: "Java வகுப்புகள் மற்றும் பொருள்கள்", url: "https://www.youtube.com/watch?v=Z9m-w04qWiI", duration: "18:30", language: "Tamil" },
      { title: "Java ஆபரேட்டர்கள்", url: "https://www.youtube.com/watch?v=aZY3qYMKqSY", duration: "13:50", language: "Tamil" }
    ],
    "Collections": [
      { title: "Java சேகரணை மொத்த பார்வை", url: "https://www.youtube.com/watch?v=fLNcfAzH4uU", duration: "17:10", language: "Tamil" },
      { title: "ArrayList vs LinkedList", url: "https://www.youtube.com/watch?v=kQ5gxBqYbwc", duration: "19:05", language: "Tamil" },
      { title: "HashMap மற்றும் HashSet", url: "https://www.youtube.com/watch?v=Q1n89X1Vrvw", duration: "18:40", language: "Tamil" }
    ]
  },
  "Data Structures & Algorithms": {
    "Arrays": [
      { title: "வரிசை தரவு கட்டமைப்பு அடிப்படைகள்", url: "https://www.youtube.com/watch?v=fWXZ0zGQ-6k", duration: "11:20", language: "Tamil" },
      { title: "வரிசை செயல்பாடுகள் மற்றும் வழிமுறைகள்", url: "https://www.youtube.com/watch?v=SJvpChQ1Fuo", duration: "14:15", language: "Tamil" }
    ],
    "Linked Lists": [
      { title: "இணைக்கப்பட்ட பட்டியல் விளக்கம்", url: "https://www.youtube.com/watch?v=qERAecZL0bc", duration: "15:45", language: "Tamil" },
      { title: "ஒற்றை மற்றும் இரட்டை இணைக்கப்பட்ட பட்டியல்கள்", url: "https://www.youtube.com/watch?v=Bg6bx_l6bQ0", duration: "17:30", language: "Tamil" }
    ]
  },
  "Python Programming": {
    "Python Basics": [
      { title: "Python அடிப்படைகள்", url: "https://www.youtube.com/watch?v=ZPR_3gPoGac", duration: "4:27:00", language: "Tamil" },
      { title: "மாறிகள் மற்றும் தரவு வகைகள்", url: "https://www.youtube.com/watch?v=sKo5-R3LN3k", duration: "8:30", language: "Tamil" },
      { title: "제어 प्रवाह", url: "https://www.youtube.com/watch?v=AHhJfS6Z0H0", duration: "12:45", language: "Tamil" }
    ],
    "Object-Oriented Programming": [
      { title: "Python வகுப்புகள் மற்றும் பொருள்கள்", url: "https://www.youtube.com/watch?v=G8C1VrM1Azw", duration: "20:15", language: "Tamil" },
      { title: "பரம்பரை மற்றும் பல்வேறுতை", url: "https://www.youtube.com/watch?v=0-YpvBdXAcs", duration: "18:30", language: "Tamil" }
    ]
  },
  "Web Development": {
    "HTML Basics": [
      { title: "HTML அறிமுகம்", url: "https://www.youtube.com/watch?v=eTu8rPK2sTU", duration: "12:45", language: "Tamil" },
      { title: "HTML ஆவணம் கட்டமைப்பு", url: "https://www.youtube.com/watch?v=gJWbzg4u1Kg", duration: "12:45", language: "Tamil" }
    ],
    "CSS Basics": [
      { title: "CSS அடிப்படைகள்", url: "https://www.youtube.com/watch?v=7NYrLFKIyQQ", duration: "15:30", language: "Tamil" },
      { title: "CSS Flexbox", url: "https://www.youtube.com/watch?v=tXrNEZXyNjw", duration: "15:30", language: "Tamil" }
    ],
    "JavaScript Basics": [
      { title: "JavaScript அடிப்படைகள்", url: "https://www.youtube.com/watch?v=J2c0FN4JEsI", duration: "2:30:00", language: "Tamil" },
      { title: "JavaScript DOM", url: "https://www.youtube.com/watch?v=UpKRfxzJKfg", duration: "2:30:00", language: "Tamil" }
    ]
  },
  "JavaScript & TypeScript": {
    "Modern JavaScript": [
      { title: "ES6 அம்சங்கள்", url: "https://www.youtube.com/watch?v=bhGpUJQH-CQ", duration: "1:15:00", language: "Tamil" },
      { title: "Async/Await மற்றும் உறுதிமொழிகள்", url: "https://www.youtube.com/watch?v=w-2wvJTGgLw", duration: "22:30", language: "Tamil" }
    ]
  }
};

export function getVideosByTopic(unit: string, topic: string, language: string = "English") {
  let videos: Array<any> = [];
  
  if (language === "Tamil" && tamilVideos[unit as keyof typeof tamilVideos]) {
    const unitBundle = tamilVideos[unit as keyof typeof tamilVideos];
    videos = (unitBundle[topic as keyof typeof unitBundle] as Array<any>) || [];
  } else {
    // English videos - add language property
    const unitBundle = topicVideos[unit as keyof typeof topicVideos];
    if (!unitBundle) return [];
    const englishVids = (unitBundle[topic as keyof typeof unitBundle] as Array<any>) || [];
    videos = englishVids.map(v => ({ ...v, language: "English" }));
  }
  
  return videos;
}

export async function getAdaptiveQuestion(previousPerformance: string, askedQuestions: string[] = []) {
  const model = "gemini-3-flash-preview";
  
  let avoidanceText = '';
  if (askedQuestions && askedQuestions.length > 0) {
    avoidanceText = `IMPORTANT: Ensure the question is UNIQUE and NOT exactly or similar to any of these previously asked questions:\n- ${askedQuestions.join('\n- ')}\n`;
  }

  const prompt = `Generate a single multiple-choice question for a Java skill assessment.
Context: The learner's previous performance was "${previousPerformance}".
Adjust the difficulty accordingly (Easy, Medium, Hard).
${avoidanceText}
Return the response in JSON format with:
- question: string
- options: string[] (exactly 4)
- correctAnswer: number (index 0-3)
- difficulty: string
- explanation: string`;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not configured. Using fallback questions.');
    return getFallbackQuestion(previousPerformance, askedQuestions);
  }

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            difficulty: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "difficulty", "explanation"]
        }
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    if (
      !parsed ||
      typeof parsed.question !== "string" ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      typeof parsed.correctAnswer !== "number"
    ) {
      throw new Error("Invalid AI response format");
    }

    return parsed;
  } catch (error) {
    console.error("Gemini Error:", error);
    return getFallbackQuestion(previousPerformance, askedQuestions);
  }
}

export async function evaluateCode(language: string, code: string, problem: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Act as an expert technical interviewer and code judge.
Evaluate the following ${language} code for the problem: "${problem}".

Code:
${code}

Provide a JSON response with:
1. score: number (0-100)
2. status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded"
3. feedback: string (brief explanation)
4. optimizationHints: string[] (how to improve)`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            status: { type: Type.STRING },
            feedback: { type: Type.STRING },
            optimizationHints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "status", "feedback", "optimizationHints"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Code Judge Error:", error);
    return { score: 0, status: "Error", feedback: "AI Judge currently unavailable.", optimizationHints: [] };
  }
}

export async function getInterviewResponse(topic: string, question: string, userAnswer: string, history: any[]) {
  const model = "gemini-3-flash-preview";
  const prompt = `Act as a senior technical interviewer for a major tech company. 
Topic: ${topic}
Previous Context: ${JSON.stringify(history)}
Current Question: ${question}
User Answer: ${userAnswer}

Provide a response that:
1. Briefly evaluates the user's answer (score 0-10, feedback).
2. Asks a challenging follow-up question or shifts the topic if they are doing well.
3. Maintains a professional yet encouraging tone.

Return JSON:
- evaluation: string
- score: number
- nextQuestion: string`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluation: { type: Type.STRING },
            score: { type: Type.INTEGER },
            nextQuestion: { type: Type.STRING }
          },
          required: ["evaluation", "score", "nextQuestion"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Interview Error:", error);
    return { evaluation: "I see. Let's try another one.", score: 0, nextQuestion: "Tell me about the basics of " + topic };
  }
}

export async function summarizeContent(content: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Provide a concise 3-bullet point summary of the following technical content:
${content}

Format as markdown.`;

  try {
    const response = await genAI.models.generateContent({ model, contents: prompt });
    return response.text || "Summary unavailable.";
  } catch (error) {
    return "Error generating summary.";
  }
}
