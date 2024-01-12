## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/your-nextjs-app.git
cd your-nextjs-app
```

### Overview

This documentation provides a detailed overview of the folder structure in your Next.js project. Specifically, we will focus on the `constants` folder located within the `src` directory. The `constants` folder contains subfolders corresponding to different sections of your application, and within each section folder, static texts are stored.

### Folder Structure

```
your-nextjs-app/
│
├── src/
│ ├── constants/
│ │ ├── artibotData/
│ │ │ ├── index.ts
│ │ ├── landingPageData/
│ │ │ ├── navbar.ts
│ │ │ ├── services.ts
│ │ │ ├── whyUs/
│ │ │ │ ├── whyUs.ts
│ │ └── ...
│ └── ...
├── ...
└── ...
```

### Commit and Push Changes

After customizing texts, follow these steps to commit and push your changes:

```
git add .
git commit -m "Update static texts"
git push origin main
```

### Deployment
The continuous integration/deployment (CI/CD) pipeline or hosting platform (i.e, Vercel) will automatically trigger a new deployment with the updated texts.
