# Azure PR Status

Quickly view the status of open PRs for your Azure Devops repos.

## Setup instructions

- Create a file in the root of the project called `projects.json`
- Run the app with "npm run start"

Each line in the json file should have the following info:
- `org`: The Azure Devops org for this repo
- `repo`: The repo name
- `collectionUrl`: Typically `https://dev.azure.com/${org}`
- `token`: Your own [Personal Access Token](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows) for this org.

---

## Global install
If you'd like to make this a "global function" you can add a function to your `~/.zprofile` file with something like this
```
function openprs() {
    cd ./path-to-this-repo
    npm run start
}