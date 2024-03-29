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
│ │ │ ├──




services.ts
│ │ │ ├── whyUs/
│ │ │ │ ├── whyUs.ts
│ │ └── ...
│ └── ...
├── ...
└── ...
```

### Change the text for Services

Head over to the

```
│
├── src/
│ ├── constants/
│ │ ├── productPageData/
│ │ │ ├── services.tsx

```

and make the changes in `servicesData`

### Change the text for WhyUs

Head over to the

```
│
├── src/
│ ├── constants/
│ │ ├── productPageData/
│ │ │ ├── whyUs
│ │ │ │ ├── whyUs.ts

```

and make the changes in `whyUsData`

### Commit and Push Changes

After customizing texts, follow these steps to commit and push your changes:

use `stage-dev` branch for vercel preview link
use `main` branch for production

```
git add .
git commit -m "Update static texts"
git push origin branch_name
```

### Deployment

The continuous integration/deployment (CI/CD) pipeline or hosting platform (i.e, Vercel) will automatically trigger a new deployment with the updated texts.
