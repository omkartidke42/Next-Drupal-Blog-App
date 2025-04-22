🧩 Next-Drupal-Blog-App

A decoupled, CMS-powered blog application built with Next.js 15 and Drupal, demonstrating full CRUD operations and dynamic view rendering using the next-drupal library.

This project serves as a practical guide for integrating Next.js App Router with a Drupal backend, leveraging the JSON:API to manage and render dynamic blog content.

🚀 Features
🔄 Full CRUD functionality (Create, Read, Update, Delete) with Drupal resources.
📊 Fetching and rendering Drupal Views with dynamic pagination.
🧱 Clean component structure with server components for better performance.
🧪 Follows best practices for data fetching and rendering in Next.js.


🧠 Architecture & Setup

🗂️ Drupal Client Configuration :

We use two separate clients via next-drupal:


📦 src/lib/drupal.ts (Public routes - for GET requests) :

```bash
import { NextDrupal } from "next-drupal"

// Public (browser) client
export const drupal = new NextDrupal(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)
```

📦 src/lib/drupal.ts (Public routes - for other requests) :
```bash
import { NextDrupal } from "next-drupal"

export const drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL!, {
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID!,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET!,
    },
  })
  

```

🧰 What This App Uses from next-drupal
Here are the main methods used from the next-drupal SDK:

🟢 Reading content:
drupal.getResource(type, uuid) drupal.getView(viewId, { params }) drupal.getResourceCollection(type, { params })

🔴 Creating content:
serverDrupal.createResource(type, payload)

🟡 Updating content: 
serverDrupal.updateResource(type, uuid, payload)

⚫ Deleting content:
serverDrupal.deleteResource(type, uuid)

✅ Best Practices :

✅ Use drupal (public client) in server components only to fetch public data.
✅ Use serverDrupal (authenticated client) for actions like creating or updating data.
🚫 Avoid using next-drupal in client components — use it only in Server Components or API routes.
✅ Always handle errors gracefully when working with getView, getResource, etc.

📸 Results
Here are a few snapshots of what this app renders: Result Image Result Image Result Image
![Screenshot from 2025-04-22 10-39-27](https://github.com/user-attachments/assets/b5336a58-2563-4e65-a2ba-e11f75040b49)
![Screenshot from 2025-04-22 10-39-44](https://github.com/user-attachments/assets/7b095f78-ac2e-43d3-b2b6-a07b7602d2df)
![Screenshot from 2025-04-22 10-39-52](https://github.com/user-attachments/assets/9ceffb4b-a6e5-4193-bbac-a51761a1ad84)
![Screenshot from 2025-04-22 10-40-01](https://github.com/user-attachments/assets/fa4b5066-b9d6-44c4-8982-81789df2a0c9)



💻 Running Locally

```bash
1️⃣ Clone the Repository :


git clone https://github.com/<your-username>/Next-Drupal-Blog-App.git
cd Next-Drupal-app
```

```bash
2️⃣ Install Dependencies : 
npm install
```

```bash
3️⃣ Setup Environment Variables
Create a .env.local file in the root:

NEXT_PUBLIC_API_URL=https://your-drupal-site.com/jsonapi
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
Ensure OAuth is enabled in your Drupal site and you’ve created a client with the necessary scopes.

```


```bash
4️⃣ Start Development Server :
npm run dev
Now visit http://localhost:3000 to see the app in action.

```

🛠️ Technologies Used
⚡ Next.js 15 (App Router)

🔌 Drupal JSON:API

📦 next-drupal

🎨 Tailwind CSS

🧑‍💻 TypeScript
