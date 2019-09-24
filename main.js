const { app, BrowserWindow, ipcMain } = require('electron');
DEV_IMG_PATH = `C:/Users/A29-PC/Desktop/MyPic.jpg`


/////////////////// Image Arguments Evaluate.
process.env.NODE_ENV = 'production'; // Production Flag.
let argv = process.argv[1];
if(argv[0]=='"'&&argv[argv.length]=='"')argv=argv.slice(1,argv.length-1);
if(argv=='.')argv=DEV_IMG_PATH;


//////////////////////////////// START //////////////////////////////////


let win;

const createWindow = ()=>{

  win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.setMenu(null);
  win.loadFile("view/index.html");

}


ipcMain.on("GIVE_IMAGE", (event)=>{
  event.sender.send("GET_IMAGE", argv);
})

ipcMain.on("SAVE", (_, data)=>{
  let base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
  require("fs").writeFile(argv+".jpg", base64Data, 'base64', function(err) {
    if(err==null){
      app.quit();
    }
  });
})




////////////////////////////////////////////////////// Exception.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
    app.quit();
})

process.on('uncaughtException', function(err) {
  app.quit();
});

// Create Window.
app.on('ready', createWindow);