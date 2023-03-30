#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const clc = require('cli-color');
const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();

function createInlineFolder(folderName) {
	console.log('Testing...');
}

console.log('-----------------------');
console.log(clc.greenBright('Running createInlineFolder...'));
console.log('-----------------------');
const folderName = process.argv[2];
createInlineFolder(folderName);
