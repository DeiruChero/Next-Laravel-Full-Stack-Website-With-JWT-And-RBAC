Welcome to the Desimati project! 🎉

---

## 🏗️ Branch Structure

| Branch         | Purpose                          | Who can commit?       |
|----------------|----------------------------------|-----------------------|
| `main`         | Production-ready code            | Only via PR from `dev` |
| `dev`          | Integration branch (tested features) | Only via PR from feature branches |
| `feature/*`    | Individual features, fixes, tasks | Developers' working branches |

---

## Creating a New Feature Branch

1️⃣ Start from `dev`:
```bash
git checkout dev
git pull
```


2️⃣ Create your feature branch:
```bash
git checkout -b feature/<your-feature-name>
```

✅ Example:

feature/admin-panel
feature/customer-authentication

---

## Pushing Your Work -

```bash
 git push -u origin feature/<your-feature-name>
```

---

## Branch Protection Rules :

-> Do NOT commit directly to main or dev.

-> Always create a feature branch for your work.

-> All merges to dev must happen via a pull request.

-> All merges to main happen from dev only, after testing and review.

