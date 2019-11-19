const { app, BrowserWindow, ipcMain } = require('electron');
process.env.NODE_ENV = 'production'; // Production Flag.


// INITILIZING...
const singleApp = app.requestSingleInstanceLock();
let mainWindow = null;
let argv = process.argv[1];

const createWindow = ()=>{

  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile("view/index.html");
  //mainWindow.openDevTools(); // Debag Only.

};//CreateWindow.
const saveB64Image = (_, data)=>{

  let base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
  require("fs").writeFile(argv+".jpg", base64Data, 'base64', function(err) {
    if(err==null){
      app.quit();
    }
  });

};//SaveB64Image.
const secendInstent = (event, commandLine, workingDirectory) =>{
  argv = commandLine[3];// Command From Secend Instent.
  mainWindow.send("GET_IMAGE", argv);
  if (mainWindow){
    if (mainWindow.isMinimized()){
      mainWindow.restore();
      mainWindow.focus();
    }
  }
};//secend iinstent event.


/* Arg Filter. */
if(argv[0]=='"'&&argv[argv.length]=='"')argv=argv.slice(1,argv.length-1);



function main(){

  ipcMain.on("GIVE_IMAGE", (event)=>{
    event.sender.send("GET_IMAGE", argv);
  });//ipcOn GIVE_IMAGE.
  ipcMain.on("SAVE", saveB64Image);

  /* Exception Handling. */
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
      app.quit();
  });//On window-all-closed event.
  
  process.on('uncaughtException', function(err) {
    app.quit();
  });//On uncaughtException handleing;

  app.on('second-instance', secendInstent);

  // Create Window And Show Application.
  app.once('ready', createWindow);

};//main.
if( singleApp ){

  main();

}else{

  app.quit();

}