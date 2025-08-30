# Outloox Project - Firebase Studio

This is a Next.js project created in Firebase Studio, fully configured for automated deployment to GitHub Pages.

## How to Deploy Your Website

Follow these steps exactly. After this, you won't need to do it again, as updates will be automatic.

### Step 1: Upload All Project Files to GitHub

1.  Create a **new, empty repository** on your GitHub account.
2.  **Important:** The repository name **MUST BE** `your-username.github.io`. For example, if your username is `outloox`, the repository name must be `outloox.github.io`.
3.  Upload **ALL** the files and folders from this project into that new repository. Make sure you include the hidden `.github` folder.

### Step 2: Configure GitHub Pages

1.  After uploading the files, wait about 2-3 minutes. The automated process (GitHub Actions) needs time to run for the first time.
2.  In your repository on GitHub, go to the **"Settings"** tab.
3.  In the left-hand menu, click on **"Pages"**.
4.  Under the "Build and deployment" section, for the **Source**, select `gh-pages` from the dropdown menu. (If you don't see `gh-pages`, wait another minute and refresh the page).
5.  Click **"Save"**.

**That's it!** Your website will be live at `https://your-username.github.io` within a few minutes.

From now on, any change you make to the code in the `main` branch will be automatically built and deployed to your website. You don't have to do anything else.
