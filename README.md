# CampusPulse

### Student Placement Analytics & Intelligence Platform

CampusPulse is a web-based analytics platform that transforms student placement datasets into an interactive dashboard.

It analyzes placement performance across branches, academic performance, internship experience, and salary outcomes, helping colleges identify trends and make data-driven decisions.

---

## 🚀 Features

- 📁 Upload student placement datasets
- 📊 Automatic placement analysis
- 🎓 CGPA vs placement analysis
- 🏫 Branch-wise placement comparison
- 💼 Internship vs placement analysis
- 💰 Average package analysis
- 💡 Automated data-driven insights
- 🔎 Branch filtering
- 📈 Interactive charts
- 🔄 Upload and analyze multiple datasets sequentially
- ⚠️ File validation and error handling
- 📱 Responsive dashboard

---

## 🧠 What CampusPulse Analyzes

CampusPulse currently analyzes:

### 1. Overall Placement

- Total number of students
- Overall placement rate
- Average CGPA
- Average package

### 2. Branch-wise Placement

CampusPulse calculates placement rates for each branch in the uploaded dataset.

### 3. CGPA Analysis

Students are grouped into:

- Below 6
- 6–7
- 7–8
- 8–9
- 9+

The platform calculates the placement rate for each group.

### 4. Internship Impact

Placement rates are compared between:

- Students with internships
- Students without internships

### 5. Salary Analysis

Average package is calculated branch-wise for placed students.

### 6. Automated Insights

CampusPulse automatically identifies patterns such as:

- Highest placement branch
- Lowest placement branch
- Highest package branch
- Highest-performing CGPA group
- Internship placement difference

---

## 📂 Dataset Requirements

CampusPulse currently accepts:

**CSV (`.csv`)**

Maximum file size:

**10 MB**

### Required Core Columns

The following columns are required for the main analysis:

```text
branch
cgpa
internships
placed
package_lpa
