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

describe('Directory#lift/drop',()=>{

    const dirpath = path.join(__dirname,DIR_NAME);

    before(()=>{
        dir = new Directory(dirpath);
        fs.mkdirSync(dirpath);
    });

    after(()=>{
        fs.rmdirSync(dirpath);
    });

    it('should lift the directory and drop it',async ()=>{
        before(()=>{
            console.log("Hello")
        })
        assert(fs.existsSync(dirpath))
        await dir.lift();
        assert(!fs.existsSync(dirpath))
        await dir.drop();
        assert(fs.existsSync(dirpath))

    })
});

describe('Directory#walk',()=>{
    before(()=>{
        dir = new Directory(path.join(__dirname,'dummy-directory'))
    })
    it('should walk the directory',()=>{
        const paths = dir.walk().sort().join(' ');
        const compared = [
            'dummy-directory',
            'dummy-directory/depth-1',
            'dummy-directory/depth-2', 
            'dummy-directory/depth-1/file1.txt', 
            'dummy-directory/depth-1/file2.txt', 
            'dummy-directory/depth-2/file3.txt', 
            'dummy-directory/depth-2/file4.txt'].map(p=>path.join(__dirname,p)).sort().join(' ');

        assert(paths == compared);


    });
    it('should return the nodes and not the string paths if you pass false',()=>{
        const nodes = dir.walk(false);
        assert(typeof nodes[0] == 'object' && nodes[0].metaData && nodes[0].value);
    })
});

describe('Directory#compare',()=>{
    before(()=>{
        dir = new Directory(path.join(__dirname,'dummy-compare-1'))
    });
    it('should compare the directory with another',()=>{
        const compared = dir.compare(path.join(__dirname,'dummy-compare-2'))
        assert.deepEqual(compared.fileNamesOnlyFirst,[ '/dir-in-1',
            '/dir-in-1/file1.txt',
            '/dir-in-1/file2.txt',
            '/dir-in-both/file-in-1.txt' ])
        assert.deepEqual(compared.fileNamesOnlySecond,[ '/dir-in-2',
        '/dir-in-2/file1.txt',
        '/dir-in-2/file2.txt',
        '/dir-in-both/file-in-2.txt' ])

        assert.deepEqual(compared.differingContents,[ '/dir-in-both/file-in-both-diff-contents.txt' ] )

    })
})
