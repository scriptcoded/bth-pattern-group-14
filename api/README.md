![UML](docs/uml.png)

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
