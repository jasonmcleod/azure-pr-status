import * as vsts from "azure-devops-node-api";
import { GitPullRequest, PullRequestStatus } from "azure-devops-node-api/interfaces/GitInterfaces";

export async function getPRs(project: string, repo: string, collectionURL: string, token: string) {         
    var authHandler = vsts.getPersonalAccessTokenHandler(token)
    var connection = new vsts.WebApi(collectionURL, authHandler)
    
    const vstsGit = await connection.getGitApi();
    
    const results = await vstsGit.getPullRequests(repo, {status: PullRequestStatus.Active}, repo);      
    return results
  }
  
export function formatOutput(prs: GitPullRequest[]) {  
    return prs.map((pr) => { return {
      title: pr.title,
      author: pr.createdBy?.displayName,
      id: pr.pullRequestId,
      reviewers: pr.reviewers || []
    }});
  }