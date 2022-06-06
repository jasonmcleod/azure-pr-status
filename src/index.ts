#! /usr/bin/env node
import fs from 'fs';
import chalk from 'chalk';
import { formatOutput, getPRs } from "./util";

let projects: IProject[]
try {
  projects = JSON.parse(fs.readFileSync('./projects.json').toString());  
} catch(err) {
  console.log('Failed to load projects.json!');

  console.log(err);
  process.exit();
}

interface IProject {
  org: string;
  repo: string;
  collectionURL: string;
  token: string;
  reviewers: any[],
  requiredApprovals?: number,
  myDisplayName?: string
}

(async() => {
  projects.forEach(async (project: IProject) => {
    const list = formatOutput(await getPRs(project.org, project.repo, project.collectionURL, project.token));
    if(list.length === 0) {
      console.log(chalk.greenBright(`No active PRs for ${project.repo}! 😎`));
    } else {        
      console.log(chalk.cyanBright(`${list.length} active PR${list.length === 1 ? '':'s'} for ${project.repo}`));
      list.forEach((pr) => {
        let approvalsLabel = '';
        let myApprovalLabel = '';
        let hasMyApproval = false;
        if(project.requiredApprovals && project.requiredApprovals !== 0) {
          const approvals = pr.reviewers?.filter((reviewer) => reviewer.vote === 10);
          if(project.myDisplayName) {
            // console.log(pr.reviewers);
            hasMyApproval = !!pr.reviewers?.find((reviewer) => reviewer.vote === 10 && reviewer.displayName === project.myDisplayName);
          } 
          const approvalColor = approvals.length >= project.requiredApprovals ? 'green':'yellow';
          
          myApprovalLabel = hasMyApproval ? chalk.green('Has my approval.') : chalk.yellow('Does not have my approval.')          
          approvalsLabel = chalk[approvalColor](`${approvals.length} of ${project.requiredApprovals} approval${project.requiredApprovals === 1 ? '':'s'}.`);
        }
        console.log(`${pr.title}, by ${pr.author}\n\t${project.collectionURL}/${project.repo}/_git/${project.repo}/pullrequest/${pr.id}\n\t${approvalsLabel}\n\t${myApprovalLabel}`);
      });
      console.log('\n')      
    }
  })
})();