# 🔐 Automated Risk Assessment and Mitigation Tool

An intelligent and scalable tool that automates the process of assessing software vulnerabilities and provides actionable mitigation recommendations. Built using Java Spring Boot (backend), Angular (frontend), and integrated with the NVD (National Vulnerability Database) for real-time risk insights.

---

## 🚀 Features

- ✅ Upload vendor/product/version data via Excel/CSV
- 🔎 Automated CVE scanning using NVD APIs
- 🛡️ Real-time risk scoring & categorization (Low, Medium, High)
- 📬 User notification system for newly discovered vulnerabilities
- 📊 Dashboard with risk metrics and historical trends
- 📁 User-specific CVE report generation
- ⏰ Scheduled background jobs for continuous monitoring
- 🔐 Secure login & role-based access control

---

## 🛠️ Tech Stack

- **Frontend**: Angular 17+, Bootstrap, Chart.js
- **Backend**: Java 17, Spring Boot, Spring Security, JPA, REST APIs
- **Database**: MySQL / H2 (for development), AWS RDS for deployment
- **Scheduler**: Spring Scheduler
- **Cloud**: AWS
