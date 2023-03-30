#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const clc = require('cli-color');
const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();

function createInlineFolder(folderName) {
	const defaultPath = `./src/components/Pages/${folderName}`;
	const initialFile = `./src/Public`;
	let content = `extends ../views/layout/_layout.pug
	\nblock var
	- var title = ''
	- var bodyClass = ''
	\nblock main`;

	const defaultContent_1 = folderName => {
		content += `\n\tinclude ../components/Pages/${folderName}/${folderName}`;
		return content;
	};
	const defaultContent_2 = (folderName, type) => {
		let mergeContent = '';
		mergeContent = `${content}\n\tinclude ../components/Pages/${folderName}/${type}/${folderName}${type}`;
		return mergeContent;
	};
	const defaultContent_3 = numSections => {
		for (let i = 1; i <= numSections; i++) {
			content += `\n\tinclude ../components/Pages/${folderName}/${folderName}-${i}/${folderName}-${i}`;
		}
		return content;
	};
	const question = [
		{
			name:
				clc.xterm(36)(`1. `) +
				clc.xterm(15)(`Single folder and files (create 📁 `) +
				clc.xterm(208)(`${folderName}`) +
				clc.xterm(15)(` contain`) +
				clc.xterm(201)(` ${folderName}.sass `) +
				clc.xterm(15)(`and`) +
				clc.xterm(201)(` ${folderName}.pug)`),
			value: 1,
		},
		{
			name:
				clc.xterm(36)(`2. `) +
				clc.xterm(15)(`List folder and files (create 📁 `) +
				clc.xterm(208)(`List`) +
				clc.xterm(15)(` and`) +
				clc.xterm(208)(`  📁 Detail`) +
				clc.xterm(15)(`, each contain `) +
				clc.xterm(201)(`${folderName}{List/Detail}.sass`) +
				clc.xterm(15)(` and `) +
				clc.xterm(201)(`${folderName}{List/Detail}.pug`),
			value: 2,
		},
		{
			name:
				clc.xterm(36)(`3. `) +
				clc.xterm(15)(`Multiple sections (create `) +
				clc.xterm(208)(`${folderName}-1`) +
				clc.xterm(15)(', ') +
				clc.xterm(208)(`${folderName}-2`) +
				clc.xterm(15)(`, ... 📁, each containing `) +
				clc.xterm(201)(`${folderName}-1.sass`) +
				clc.xterm(15)(`,`) +
				clc.xterm(201)(`${folderName}-1.pug`) +
				clc.xterm(15)(`, etc.)`),
			value: 3,
		},
	];
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'option',
				message: 'Enter the name of the folder to create:',
				choices: question,
			},
		])
		.then(answers => {
			if (answers.option === 1) {
				// Create initial file
				fs.writeFileSync(
					`${initialFile}/${folderName}.pug`,
					defaultContent_1(folderName)
				);
				fs.mkdirSync(defaultPath);
				fs.writeFileSync(`${defaultPath}/${folderName}.pug`, '');
				fs.writeFileSync(`${defaultPath}/${folderName}.sass`, '');
			} else if (answers.option === 2) {
				// Create initial file
				fs.writeFileSync(
					`${initialFile}/${folderName}List.pug`,
					defaultContent_2(folderName, 'List')
				);
				fs.writeFileSync(
					`${initialFile}/${folderName}Detail.pug`,
					defaultContent_2(folderName, 'Detail')
				);
				fs.mkdirSync(defaultPath);
				fs.mkdirSync(`${defaultPath}/List`);
				fs.writeFileSync(`${defaultPath}/List/${folderName}List.pug`, '');
				fs.writeFileSync(`${defaultPath}/List/${folderName}List.sass`, '');
				fs.mkdirSync(`${defaultPath}/Detail`);
				fs.writeFileSync(`${defaultPath}/Detail/${folderName}Detail.pug`, '');
				fs.writeFileSync(`${defaultPath}/Detail/${folderName}Detail.sass`, '');
			} else if (answers.option === 3) {
				inquirer
					.prompt([
						{
							type: 'number',
							name: 'value',
							message: clc.blueBright(
								'Enter the number of sections you want to create:'
							),
						},
					])
					.then(numberOfSections => {
						const numSections = parseInt(numberOfSections.value, 10);
						fs.writeFileSync(
							`${initialFile}/${folderName}.pug`,
							defaultContent_3(numberOfSections.value)
						);
						fs.mkdirSync(defaultPath);
						if (isNaN(numSections)) {
							console.log(
								clc.redBright('Invalid input. Please enter a valid number.')
							);
						} else {
							for (let i = 1; i <= numSections; i++) {
								const sectionPath = `${defaultPath}/${folderName}-${i}`;
								fs.mkdirSync(sectionPath);
								fs.writeFileSync(`${sectionPath}/${folderName}-${i}.pug`, '');
								fs.writeFileSync(`${sectionPath}/${folderName}-${i}.sass`, '');
							}
							ui.log.write('Creating files');
						}
					});
			}
			if (answers.option !== 3) ui.log.write('Creating files');
		})
		.catch(error => {
			console.log(error);
			if (error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
			} else {
				// Something else went wrong
			}
		});
}

console.log('-----------------------');
console.log(clc.greenBright('Running createInlineFolder...'));
console.log('-----------------------');
const folderName = process.argv[2];
createInlineFolder(folderName);
