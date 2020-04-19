const fs = require('fs-extra');

class Directory{
    constructor(path){
        this.path = path;
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

}

module.exports = Directory;
