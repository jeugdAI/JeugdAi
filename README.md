# 🚀 CJG Capelle – AI Project

## 📌 Overview
This project focuses on improving the decision-making process ("beschikkingsproces") within CJG Capelle aan den IJssel using AI.  
The goal is to support employees with a clearer, faster and more structured workflow.

---

## 🎯 Goals
- Understand the current decision-making process  
- Identify bottlenecks and inefficiencies  
- Design an AI-supported solution  
- Improve speed and quality of decisions  

---

## ⚙️ Getting Started

Clone the repository:
```bash
git clone <repo-url>
cd projectnaam
```

---

## 🔀 Git Workflow

### Branches
- `main` → production (stable)
- `staging` → testing environment
- `feature/*` → development

### Rules
- Never push directly to `main` or `staging`
- Always create a **feature branch**
- Use **Pull Requests (PR)** for merging
- Minimum **1 code review required**

---

## 🔄 Development Flow

1. Create a branch:
```bash
git checkout -b feature/your-feature
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: your change"
```

3. Push your branch:
```bash
git push origin feature/your-feature
```

4. Open a Pull Request → `staging`  
5. Request review  
6. Merge after approval  
7. When stable → PR from `staging` to `main`

---

## 🔒 Branch Protection

### `main`
- Pull Request required  
- Minimum 1 approval  
- No direct pushes allowed  

### `staging`
- Pull Request required  
- Used for testing and validation  

---

## 📁 Project Structure
```
/frontend
/backend
/docs
/research
```

---

## 📋 Conventions
- Use clear commit messages (`feat:`, `fix:`, `docs:`)  
- Keep commits small and focused  
- Always pull latest changes before starting work  
- Use meaningful branch names (`feature/login`, `feature/search`)  

---

## 🧪 Current Status
- GitHub environment setup  
- Workflow and collaboration rules defined  
- Research phase in progress  

---

## 🔮 Next Steps
- Conduct interviews with CJG employees  
- Analyze current workflow in detail  
- Define requirements for AI solution  
- Build prototype / proof of concept  

---

## 👥 Team
- Naam 1  
- Naam 2  
- Naam 3  

---

## 💡 Vision
This project aims to use AI to simplify complex processes in youth care, allowing professionals to focus more on helping people instead of handling administrative complexity.
