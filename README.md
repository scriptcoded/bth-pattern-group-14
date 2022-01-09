# bth-pattern-group-14

[![Tests](https://github.com/scriptcoded/bth-pattern-group-14/actions/workflows/test.yml/badge.svg)](https://github.com/scriptcoded/bth-pattern-group-14/actions/workflows/test.yml)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/scriptcoded/bth-pattern-group-14/badges/quality-score.png?b=develop&s=7937d46ee3357a843e8c67a5d123c4a35c83deef)](https://scrutinizer-ci.com/g/scriptcoded/bth-pattern-group-14/?branch=develop)
[![codecov](https://codecov.io/gh/scriptcoded/bth-pattern-group-14/branch/main/graph/badge.svg?token=17V09SGATP)](https://codecov.io/gh/scriptcoded/bth-pattern-group-14)

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
