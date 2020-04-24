const fs = require('fs-extra');
const walkDirectory = require('@nickmanning214/walk-tree/implementations/walkDirectory.js')
const path = require('path');
const difference = require('lodash.difference');
const intersection = require('lodash.intersection');

class Directory{
    constructor(pathString){
        this.path = pathString;


        this.parentDir = path.parse(pathString).dir;
        this.name = path.parse(pathString).name;
        //this.children = this.walk()


        this.liftTempDestination = `/var/tmp/ahu8siornau4hrivfuoan`
    }
    lift(){
        //The issue is you're trying to replace it with /var/tmp and that's not what you want.
        return new Promise((resolve,reject)=>{
            fs.move(this.path, this.liftTempDestination, err => {
                if(err) reject(err)
                resolve()
            });
        })
        

    }

    drop(){
        return new Promise((resolve,reject)=>{

            fs.move(this.liftTempDestination, this.path, err => {
                if(err) reject(err)
                resolve()
            });
        })
    }

    //todo: walk returns nodes, paths returns full paths, and another function returns relative paths.

    walk(map=true){
        const parsed = path.parse(this.path);
        const nodes =  walkDirectory(parsed.dir,parsed.name);
        if (!map) return nodes;
        else return nodes.map(n=>`${n.metaData.parentPath}/${n.value}`);
    }

    relativePaths(){
        return this.walk().map(path=>path.substr(this.parentDir.length+1+this.name.length));
    }

    compare(path){
        const thesePaths = this.relativePaths();
        const compareTo = new Directory(path);
        const comparePaths = compareTo.relativePaths();


        const fileNamesInBoth = intersection(thesePaths,comparePaths);
        const differingContents = [];
        fileNamesInBoth.forEach(fileName=>{
            const path1 = `${this.path}${fileName}`;
            const path2 = `${path}${fileName}`;
            if ([path1,path2].every(e=>fs.lstatSync(e).isFile()) && fs.readFileSync(path1).toString()!==fs.readFileSync(path2).toString()) differingContents.push(fileName);
        })
        

        const ret = {
            fileNamesOnlyFirst:difference(thesePaths,comparePaths),
            fileNamesOnlySecond:difference(comparePaths,thesePaths),
            differingContents
        };



        return ret;

    }


}

module.exports = Directory;
