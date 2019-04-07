const electron = require('electron');
const url = require('url')
const path = require('path')

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;
let addWindow;
let helpWindow;

// set ENV
process.env.NODE_ENV = 'production';
const proc = 'production'
// listen for app to be ready 
app.on('ready',function(){
    //create new window
    mainWindow = new BrowserWindow({});
    //load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Build menu from the template
    const mainMenu = electron.Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    electron.Menu.setApplicationMenu(mainMenu);
});

// Handle add window
function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 500,
        height: 550,
    });
        //Quit app when when closed 
        mainWindow.on('closed', function(){
            app.quit();
        });
        //load HTML into window
        addWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'addWindow.html'),
            protocol: 'file:',
            slashes: true
        }));
        // Garbage collection handle
        addWindow.on('close', function(){
            addwindow = null;
        });
}

// Handle help window
function createhelpWindow(){
    helpWindow = new BrowserWindow({
        width: 500,
        height: 550,
    });
        //Quit app when when closed 
        mainWindow.on('closed', function(){
            app.quit();
        });
        //load HTML into window
        helpWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'helpWindow.html'),
            protocol: 'file:',
            slashes: true
        }));
        // Garbage collection handle
        helpWindow.on('close', function(){
            addwindow = null;
        });
}

//catch item:add
ipcMain.on('item:add',function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
});

//catch task:add
ipcMain.on('task:add',function(e, task){
    console.log(task);
    mainWindow.webContents.send('task:add', task);
    addWindow.close();
});
//create menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
        {
            label: 'Add Task',
            accelerator: process.platform == 'darwin' ? 'command+A' :
            'Ctrl+Shift+A',
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear all',
            accelerator: process.platform == 'darwin' ? 'command+C' :
            'Ctrl+Shift+C',
            click(){
                mainWindow.webContents.send('item:clear');
                mainWindow.webContents.send('task:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'command+Q' :
            'Ctrl+Q',
            click(){
                app.quit();
            }
        }]
    },
    {
        label: 'Help',
        submenu:[
            {
            label: 'Instructions',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
            'Ctrl+Shift+I',
            click(){
                createhelpWindow()   
            }
        },
    ]
    },
    ]
// if mac, add empty object on menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
            'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
    ]
    });
}
