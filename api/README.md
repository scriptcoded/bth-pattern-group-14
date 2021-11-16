# Setup

1. Install dependencies
    ```bash
    npm install
   ```
1. [Create OAuth credentials for GitHub](#creating-oauth-credentials-for-github)
1. Copy `.env`-file
    ```bash
    cp .env.example .env
    ```
    Make sure to generate the app secret and fill out your newly generated OAuth
    credentials.
    ```bash
    openssl rand -hex 32
    ```
1. Start MySQL and Redis (for persistent login sessions)
    ```bash
    docker compose up -d
    ```
1. Start the application
    ```bash
    npm run dev
    ```

# Creating OAuth credentials for GitHub

You should follow [this
guide](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).

You will need the following information:

|Field|Value|
|-|-|
|Application name|Anything you like, I used `BTH pattern Group 14 local`|
|Homepage URL|`http://localhost:4000`|
|Application description|Anything you like, can be left empty|
|Authorization callback URL|`http://localhost:4000/auth/github/callback`|

# UML / Database structure

![UML](docs/uml.png)
