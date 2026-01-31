# Deploying Infinite Station to the Internet

Since we built this project using **Next.js**, the fastest and most efficient way to put it online (production) is via **Vercel**.

## Step 1: Push code to GitHub
If you haven't already, you need to save your project in a Git repository:
1. Create a new repository on [GitHub](https://github.com).
2. Run these commands in your terminal:
   ```bash
   git init
   git add .
   git commit -m "Final delivery"
   git remote add origin https://github.com/your-user/infinite-station.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New"** > **"Project"**.
3. Select your `infinite-station` repository.
4. Vercel will automatically detect Next.js.

## Step 3: Environment Variables
Wait! Before clicking "Deploy", add the following variables in the **Environment Variables** section:
- `DATABASE_URL`: Your Prisma connection string (PostgreSQL/Supabase).
- `NEXTAUTH_SECRET`: A random string for session security.
- `ENCRYPTION_SECRET`: A 32-character string for OAuth token encryption.

## Step 4: Go Live!
Click **Deploy**. In less than 2 minutes, you will have a URL like `https://infinite-station.vercel.app` accessible from anywhere in the world.

---

### Other Options:
- **Netlify**: Similar to Vercel, very easy for Next.js.
- **Docker + AWS/DigitalOcean**: For advanced control, you can containerize the app.
