# AAA Grocery

AAA Grocery is a client-side grocery shopping demo. Product data, cart contents, and demo orders are stored in the browser; the app does not connect to retailers or process real payments or orders.

## Deploy to Vercel

1. Push the project to a Git provider supported by Vercel.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Next.js framework and build settings. The project requires no environment variables or backend services.
4. Select **Deploy**. Vercel will build the Next.js app and provide a hosted URL.

The included `vercel.json` identifies the project as a Next.js app and applies basic security response headers. Vercel detects the package manager from the committed lockfile.

## Deploy with the Vercel CLI

From the project root, run:

```bash
npx vercel
```

Follow the prompts to link the project, then deploy a production build with:

```bash
npx vercel --prod
```

Cart and order data is browser-local and is not shared across devices or browsers. All catalog prices, inventory, fulfillment options, and checkout activity are simulated.