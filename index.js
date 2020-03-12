#! /usr/bin/env node

/**
 * @description scan file 
 * @author theanarkh
 * @date 2020/03/11 23:59
 */
const fs = require('fs');
const path = require('path');
if (!process.argv.slice(2).length) {
  console.error('please config the configPath: scan configPath=xxx');
  process.exit();
}
const params = {};
// parse the params
process.argv.slice(2).forEach((item) => {
  const [key, vlaue] = item.split(/\s*=\s*/);
  params[key] = vlaue;
});
// only one param: the configPath
const {
  configPath
} = params;
// parse the absolute path of configPath 
const configFilePath = path.resolve(configPath);
let config;
try {
  config = require(configFilePath);
} catch(e) {
  console.error(`${configFilePath} is not found`);
  process.exit();
}
// support config
let {
  root,
  exclude,
  output,
  hooks = []
} = config;
// support mutiple root and resolve them
root = [].concat(root).map((item) => {
  return path.resolve(item);
});

// dir queue
const dirQueue = root;
// file queue
const fileQueue = [];
let dir;

// collect all files path
while(dir = dirQueue.shift()) {
    // read all file of dir include subdir
    const files = fs.readdirSync(dir);
    files.forEach((filename) => {
        const currentFile = path.resolve(dir + '/' + filename);
        const stat = fs.statSync(currentFile);
        // you can exclude the file by return true
        if (typeof exclude === 'function' && exclude(currentFile, filename) === true) {
          return;
        }
        if (stat.isFile()) {
          fileQueue.push(currentFile);
        } else if (stat.isDirectory()) {
          dirQueue.push(currentFile);
        }
    })
}

let result = [];
fileQueue.forEach(function(filename) {
    var fileContent = fs.readFileSync(filename, 'utf-8');
    // you can handle the fileConent by mutiple hooks and the return of last hook is final result
    hooks.forEach(function(fn) {
        fileContent = fn(fileContent, filename);
    });
    result = result.concat(fileContent);
})

if (config.output) {
    if (typeof config.output === 'function') {
      config.output(result);
    } else {
      fs.writeFileSync(config.output, Array.from(new Set(result)).join('\n'), 'utf-8');
    }
} else {
  console.log(Array.from(new Set(result)).join('\n'));
}
