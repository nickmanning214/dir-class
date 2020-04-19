const assert = require('assert');
const Directory = require('../index.js')
const fs = require('fs');
const path = require('path');

let dir;

const DIR_NAME = 'ksaudyfokgajfkjh';

describe('Directory',()=>{
    before(()=>{
        dir = new Directory('/something/hello');
    })
    it('should have a path property',()=>{
        assert(dir.path === '/something/hello');
    });
});

describe('Directory.lift/drop',()=>{

    const dirpath = path.join(__dirname,DIR_NAME);

    before(()=>{
        dir = new Directory(dirpath);
        fs.mkdirSync(dirpath);
    });

    after(()=>{
        fs.rmdirSync(dirpath);
    });

    it('should lift the directory and drop it',async ()=>{
        assert(fs.existsSync(dirpath))
        await dir.lift();
        assert(!fs.existsSync(dirpath))
        await dir.drop();
        assert(fs.existsSync(dirpath))

    })
})
