const finglet = require('figlet')
const path = require('path')
const fs = require('fs-extra')
const loading = require('loading-cli');
const load = loading("loading your directory Manager... 🎩").start()

const { Command } = require('commander');
const program = new Command();




console.log(finglet.textSync("Dir Manager"));

console.log('------------------------------------------')

setTimeout(() => {
    load.color = 'yellow';
    load.text = 'one more second..';
}, 2000)

setTimeout(() => {
    load.stop()



    program
        .version("0.0.4 by ponziedd")
        .description('An example CLI for managing a directory')
        .option("-l, --ls  [value]", "List directory contents")
        .option("-m, --mkdir <value>", "Create a directory")
        .option("-t, --touch <value>", "Create a file")
        .parse(process.argv);

    const options = program.opts();

    // -l 
    async function listDirContents(filepath: string) {

        try {

            // return an Array of all files in my directory []
            const files: string[] = await fs.promises.readdir(filepath);
            // loop 
            const detailedFilesPromises = files.map(async (file: string) => {

                // get files infos object
                let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
                const { size, birthtime, blocks } = fileDetails;
                // return what we need
                return { filename: file, "size(KB)": size, created_at: birthtime, block_size: blocks };
            });


            const detailedFiles = await Promise.all(detailedFilesPromises);
            console.table(detailedFiles);
        } catch (error) {
            console.dir('un error occured', error)
        }
    }


    // -m 

    function createDir(filepath: string) {

        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath)
            console.log('directory sucessfully created! 🙌 ')
        }
    }


    function createFile(filepath: string) {

        fs.openSync(filepath, "w");
        console.log('file succesfully created 👀 ')
    }


    // check if user as called the option 

    if (options.ls) {

        const filePath = typeof options.ls === "string" ? options.ls : __dirname;
        listDirContents(filePath)
    }

    if (options.mkdir) {
        createDir(path.resolve(__dirname, options.mkdir));
    }

    if (options.touch) {
        createFile(path.resolve(__dirname, options.touch));
    }

    
    if (!process.argv.slice(2).length) {
    
        program.outputHelp();
    }

}, 3000)