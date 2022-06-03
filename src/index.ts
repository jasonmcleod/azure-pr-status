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
}

(async() => {  
  projects.forEach(async (project: IProject) => {
    const list = formatOutput(await getPRs(project.org, project.repo, project.collectionURL, project.token));
    if(list.length === 0) {
      console.log(chalk.greenBright(`No active PRs for ${project.repo}! 😎`));
    } else {        
      console.log(chalk.cyanBright(`${list.length} active PR${list.length === 1 ? '':'s'} for ${project.repo}`));
      list.forEach((pr) => {
        console.log(`${pr.title}, by ${pr.author}\n\t${project.collectionURL}/${project.repo}/_git/${project.repo}/pullrequest/${pr.id}`);      
      });
      console.log('\n')      
    }
  })
})();