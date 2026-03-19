# CJG Capelle AI Project

## Overview
This project focuses on improving the decision-making process ("beschikkingsproces") within CJG Capelle aan den IJssel using AI.  
The goal is to support employees with a clearer, faster and more structured workflow.

---

## Getting Started

Clone the repository:
```bash
git clone <repo-url>
cd projectnaam
```

---

## Git Workflow

### Branches
- `main` → production branch
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

## Branch Protection

### `main`
- Pull Request required  
- Minimum 1 approval  
- No direct pushes allowed  

### `staging`
- Pull Request required  
- Used for testing and validation
- No direct pushes allowed  

---



---

## 💡 Vision
This project aims to use AI to simplify complex processes in youth care, allowing professionals to focus more on helping people instead of handling administrative complexity.
