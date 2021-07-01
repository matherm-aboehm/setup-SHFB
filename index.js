const core = require('@actions/core');
const exec = require('@actions/exec');
const tool = require('@actions/tool-cache');
const path = require('path');
const fs = require('fs');




async function run() {
    try {

        const version = core.getInput('version');
        const vsixInst = '"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\Common7\\IDE\\VSIXInstaller.exe"';
        const toolUrl = 'https://github.com/EWSoftware/SHFB/releases/download/' + version + '/SHFBInstaller_' + version + '.zip';
        const home = process.env.GITHUB_WORKSPACE;

        console.log('Install SHFB Version: ' + version);

        const shfbRoot = 'C:\\Program Files (x86)\\EWSoftware\\Sandcastle Help File Builder\\';
        core.exportVariable('SHFBROOT', shfbRoot);


        const tempFile = await tool.downloadTool(toolUrl);
        //console.log('shfbInstaller: ', shfbInstaller);


        //const stat = fs.statSync(shfbInstaller);
        //console.log('Dir: ', stat.isDirectory);
        //console.log('File: ', stat.isFile);
        //console.log('Size: ', stat.size);
        
        console.log('-------------------------------------------');
 
        //const shfbFolder = await tool.extract7z(shfbInstaller, home);
        await exec.exec('7z', ['x', '-y', tempFile], { cwd: home});

        
        //console.log('shfbFolder: ', shfbFolder);

        

        const instFolder = path.join(home, 'InstallResources');
        console.log('instFolder: ', instFolder);
        if (fs.existsSync(instFolder)) {
            console.error('instFolder exists');
        }

        const instFile = path.join(instFolder, 'SandcastleHelpFileBuilder.msi');
        console.log('instFile: ', instFile);
        if (fs.existsSync(instFile)) {
            console.error('instFile exists');
        }

        await exec.exec('msiexec', ['/i', 'SandcastleHelpFileBuilder.msi', '/quiet'], { cwd: instFolder});
        
        await exec.exec(vsixInst, ['/q', '/a', 'SHFBVisualStudioPackage_VS2017AndLater.vsix'], { cwd: instFolder});

        //const shfbResDir = path.join(shfbFolder, 'InstallResources');
        //console.log('shfbResDir: ', shfbResDir);

/*

const options = {};
options.listeners = {
  stdout: (data: Buffer) => {
    console.log(data.toString());
  },
  stderr: (data: Buffer) => {
    console.eooro(data.toString());
  }
};
options.cwd = shfbResDir;


 
await exec.exec('msiexec', ['/i', 'SandcastleHelpFileBuilder.msi', '/quiet'], options );




await exec.exec(vsixInst, ['/q', '/a', 'SHFBVisualStudioPackage_VS2017AndLater.vsix'], options );
*/
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();