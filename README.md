# bth-pattern-group-14

[![Tests](https://github.com/scriptcoded/bth-pattern-group-14/actions/workflows/test.yml/badge.svg)](https://github.com/scriptcoded/bth-pattern-group-14/actions/workflows/test.yml)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/scriptcoded/bth-pattern-group-14/badges/quality-score.png?b=develop&s=7937d46ee3357a843e8c67a5d123c4a35c83deef)](https://scrutinizer-ci.com/g/scriptcoded/bth-pattern-group-14/?branch=develop)
[![codecov](https://codecov.io/gh/scriptcoded/bth-pattern-group-14/branch/main/graph/badge.svg?token=17V09SGATP)](https://codecov.io/gh/scriptcoded/bth-pattern-group-14)

## Live demo

https://elsp.nihlen.dev/

## Development environment

There are four parts to the development environment.
1. A MySQL database
2. A Redis database (optional, but prevents your from being logged out when the API is restarted)
3. The frontend application (called `web`)
4. The backend API (called `api`)

The API requires a few environment variables to start properly.

### Initial setup

Before starting the application you need to install the dependencies for the frontend and backend:

```bash
cd web
npm install

cd ../api
npm install
```

Next you need to set up the environment variables for the API. Refer to [the API readme](api/README.md#environment-variables-and-stripe) for instructions on how to do this.

### All-in-one start

> 💡 You must complete the [Initial setup](#initial-setup) section before continuing.

To make starting the application easier we've set up a helper script. Make sure you're in the root of the
project and run `make start`. This will start the necessary containers for MySQL and
Redis and start a tmux session with the frontend and backend running. To exit,
hit `CTRL + B` followed by `:kill-session`. This will close the tmux session and
stop the sidecar containers.

### Manual start

> 💡 You must complete the [Initial setup](#initial-setup) section before continuing.

To start the application manually, first launch the necessary docker containers for MySQL and Redis:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Then open two shells:
```bash
# In shell 1
cd web
npm run serve

# In shell 2
cd api
npm run dev
```

When you're done developing, make sure to stop the containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

## REST API documentation

Documentation for the REST API is available here: https://github.nihlen.io/bth-pattern-group-14/.

## Working with Git

The project uses Git Flow as its branching strategy. You can [read more about it here](https://guides.github.com/introduction/flow/).

Development is done on the `develop` branch, and the working production release is on `main`.

In short, every feature is developed on a so called "feature branch".

Here is an example on how to create and work on a feature branch:
```bash
# 1. Make sure you've got the latest version of the develop branch
git checkout develop
git pull

# 2. Create the feature branch
git checkout -b add-awesome-cat-emojis

# 3. Commit some changes
git commit -am "feat: add cat emojis"

# 4. Push the changes

# 4.1 The first time you push a new branch you must tell Git where to push it to
git push --set-upstream origin add-awesome-cat-emojis

# 4.2 The following times you can just do a normal push
git push

# 5 When you're done with your changes, checkout the develop branch again
git checkout develop

# And if you want to, delete your branch
git branch -d add-awesome-cat-emojis

```
