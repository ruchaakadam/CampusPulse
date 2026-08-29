# 📊 CampusPulse

## College Placement Analytics Dashboard

CampusPulse is a web-based data analytics platform that transforms student placement datasets into an interactive dashboard.

Instead of manually analyzing large spreadsheets, users can upload a placement dataset and CampusPulse automatically calculates placement statistics, generates visualizations, and highlights important trends.

---

## 🚀 Live Demo

<p align="center">

<a href="https://campuspulse-rysk.onrender.com">

<img src="https://img.shields.io/badge/🌐%20Live%20Demo-CampusPulse-315EFB?style=for-the-badge" alt="Live Demo">

</a>

</p>

### 👉 Open CampusPulse

https://campuspulse-rysk.onrender.com

---

# 🖥️ Project Preview

## 📊 Dashboard

The main dashboard provides an overview of college placement performance, including placement rate, CGPA, salary packages, branch-wise performance and internship impact.

<p align="center">
  <img src="assets/screenshots/dashboard.png" alt="CampusPulse Dashboard" width="95%">
</p>

---

## 📁 Dataset Upload

Users can upload their placement dataset using the drag-and-drop interface or browse for a CSV file.

<p align="center">
  <img src="assets/screenshots/upload.png" alt="CampusPulse Dataset Upload" width="70%">
</p>

---

## 💡 Automated Insights

CampusPulse converts the analyzed data into easy-to-understand insights about internships, academic performance and branch-level differences.

<p align="center">
  <img src="assets/screenshots/insights.png" alt="CampusPulse Automated Insights" width="95%">
</p>

---

# 🎯 Problem Statement

College placement data is often maintained in large spreadsheets.

Finding meaningful information from these datasets can require manual calculations and data analysis.

For example:

- What is the overall placement rate?
- Which branch has the highest placement rate?
- Does CGPA affect placement?
- Do internships improve placement outcomes?
- Which branch has the highest average package?
- How many students were analyzed?

CampusPulse automates these calculations and presents the results through an interactive dashboard.

# 📂 CSV Dataset Requirements

CampusPulse currently accepts student placement datasets in:

**CSV (`.csv`) format**

Maximum file size:

**10 MB**

## Required Columns

The uploaded CSV should contain these columns:

| Column | Required | Description |
|---|:---:|---|
| `student_id` | ✅ | Unique identifier for each student |
| `gender` | ✅ | Student gender |
| `age` | ✅ | Student age |
| `degree` | ✅ | Degree/program |
| `branch` | ✅ | Academic branch |
| `cgpa` | ✅ | Student CGPA |
| `backlogs` | ✅ | Number of academic backlogs |
| `internships` | ✅ | Internship experience |
| `certifications` | ✅ | Certifications |
| `coding_skills` | ✅ | Coding skill score/level |
| `communication_skills` | ✅ | Communication skill score/level |
| `aptitude_score` | ✅ | Aptitude assessment score |
| `projects` | ✅ | Number/details of projects |
| `placed` | ✅ | Placement status (`0` = Not Placed, `1` = Placed) |
| `company_type` | ✅ | Type/category of recruiting company |
| `package_lpa` | ✅ | Salary package in Lakhs Per Annum |

## Core Analysis Fields

The following fields are particularly important for the current CampusPulse analysis:

```text
branch
cgpa
internships
placed
package_lpa
---

# 💡 Solution

CampusPulse follows a simple workflow:

```text
Upload Dataset
      ↓
Validate Dataset
      ↓
Process Data
      ↓
Calculate Statistics
      ↓
Generate Visualizations
      ↓
Display Insights
