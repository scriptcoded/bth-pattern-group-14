# Setup

<!-- Test commit -->

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
1. If you already have MySQL running using systemd, stop it:
    ```bash
    systemctl stop mysql.service
    ```
1. Start MySQL and Redis (for persistent login sessions)
    ```bash
    docker-compose up -d
    ```
1. Migrate the database. Note that MySQL can take a few seconds to start.
    ```bash
    npx prisma migrate dev
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

# Setting up Stripe

## Stripe credentials

First you must configure your Stripe credentials. This lets the applications
create payments and invoices.

1. You need a account with Stripe. If you don't already, create one here: https://dashboard.stripe.com/register
2. When you've created your account you need to set a company name to be able to
   send invocies. When logged in to the dashboard
   (https://dashboard.stripe.com/), click the name in the top left and then
   "Edit" as shown in the screenshot. Then enter a suitable name.
    ![Stripe 1](docs/stripe_1.png)
3. Make sure "Test mode" is enabled, then go to "Developers" and finally "API keys".
    ![Stripe 2](docs/stripe_2.png)
4. Copy your "Publishable key" and "Secret key" and set them in your .env-file
    ```env
    STRIPE_SECRET_KEY="sk_test_xxx"
    STRIPE_PUBLISHABLE_KEY="pk_test_yyy"
    ```

## Stripe webhooks

Now you need to enable Stripe to call your application when a payment is
completed using webhooks.

1. Install the Stripe CLI utillity. https://stripe.com/docs/stripe-cli#install
2. Before string the API/backend, run the following command. This will allow
   Stripe to call your application:
    ```bash
    stripe listen --forward-to localhost:4000/payments/stripe/webhook
    ```
3. Copy the printed signing secret to your .env-file. It should start with
   `whsec_`.
    ```env
    STRIPE_WEBHOOK_SECRET="whsec_zzz"
    ```
4. Now you can start the API/backend. The webhook secret will most likely be the
   same between runs.

# UML / Database structure

![UML](docs/uml.png)
