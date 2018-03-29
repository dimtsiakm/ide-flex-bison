const {TextEditor, BufferedProcess, CompositeDisposable, Disposable} = require('atom')
const path = require('path')
const fs = require('fs')
const os = require('os')


module.exports = class NewProjectView {

  constructor () {
    this.disposables = new CompositeDisposable();

    this.element = document.createElement('div');
    this.element.classList.add('package-generator');

    //close div button
    this.close_div = document.createElement('button');
    this.close_div.classList.add('close_div');
    var name_close_button = document.createTextNode("x");
    this.close_div.appendChild(name_close_button);
    this.element.appendChild(this.close_div);

    //text editor element
    this.miniEditor = new TextEditor({mini: true});
    this.element.appendChild(this.miniEditor.element);

    //set path button ( open OS' file explorer )
    this.open_button = document.createElement('button');
    this.open_button.classList.add('open_button');
    var name_button = document.createTextNode("set path");
    this.open_button.appendChild(name_button);
    this.element.appendChild(this.open_button);

    //error message div
    this.error = document.createElement('div')
    this.error.classList.add('error')
    this.element.appendChild(this.error)

    var br = document.createElement('br');
    this.element.appendChild(br);

    //flex
    var pathDiv = document.createElement('div');
    pathDiv.classList.add('pathDiv');

    var FlexText = document.createElement('span');
    var index = document.createTextNode('Flex name: ');
    FlexText.appendChild(index);
    FlexText.classList.add('FlexText');
    pathDiv.appendChild(FlexText);

    this.Flex = new TextEditor({mini: true});
    this.Flex.element.classList.add('FlexEditor');
    this.Flex.element.tabIndex = "1";
    pathDiv.appendChild(this.Flex.element);

    this.element.appendChild(pathDiv);


    //bison
    var pathDivBison = document.createElement('div');
    pathDivBison.classList.add('pathDiv');

    var BisonText = document.createElement('span');
    var index1 = document.createTextNode('Bison name: ');
    BisonText.appendChild(index1);
    BisonText.classList.add('FlexText');
    pathDivBison.appendChild(BisonText);

    this.Bison = new TextEditor({mini: true});
    this.Bison.element.classList.add('BisonEditor');
    this.Bison.element.tabIndex = "2";
    pathDivBison.appendChild(this.Bison.element);

    this.element.appendChild(pathDivBison);

    //executable
    var pathDivExe = document.createElement('div');
    pathDivExe.classList.add('pathDivExe');

    var ExeText = document.createElement('span');
    var index2 = document.createTextNode('Exe name: ');
    ExeText.appendChild(index2);
    ExeText.classList.add('ExeText');
    pathDivExe.appendChild(ExeText);

    this.Exe = new TextEditor({mini: true});
    this.Exe.element.classList.add('BisonEditor');
    this.Exe.element.tabIndex = "3";
    pathDivExe.appendChild(this.Exe.element);

    this.element.appendChild(pathDivExe);

    //Makefile checkbox
    var MakefileText = document.createElement('div');
    var index3 = document.createTextNode('Makefile');
    var spanMessage = document.createElement('span');
    spanMessage.classList.add('spanMessage');
    spanMessage.appendChild(index3);

    MakefileText.classList.add('MakefileText');

    this.checkbox = document.createElement('input');
    this.checkbox.classList.add('MakefileCheckbox');
    this.checkbox.setAttribute('type', 'checkbox');
    this.checkbox.setAttribute('id', 'checkbox');
    this.checkbox.tabIndex = "4"

    MakefileText.appendChild(spanMessage);
    MakefileText.appendChild(this.checkbox);

    this.element.appendChild(MakefileText);


    //ok button
    this.okButton = document.createElement('button');
    this.okButton.classList.add('okButton');
    var name_button = document.createTextNode('OK');
    this.okButton.appendChild(name_button);
    this.okButton.tabIndex = "5";

    this.element.appendChild(this.okButton);


    //message div
    this.message = document.createElement('div')
    this.message.classList.add('message')
    this.element.appendChild(this.message)
    this.disposables.add(atom.commands.add('atom-workspace', {
      'ide-flex-bison:new-project': () => this.attach()
    }))
    this.disposables.add(atom.commands.add(this.element, {
      'core:confirm': () => this.confirm(),
      'core:cancel': () => this.close()
    }))

    const dirpath = () => this.getDirPath();
    this.open_button.addEventListener("click", dirpath, false);
    const closediv = () => this.close();
    this.close_div.addEventListener("click", closediv, false);
    document.body.addEventListener("keyup", function(e) {
      if(e.keyCode == 27) { closediv(); }
    }, false);

    const conf = () => this.confirm();
    this.okButton.addEventListener('click', conf, false);

  }

  getDirPath () {
    var remote = require('remote');
    var dialog = remote.require('electron').dialog;
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if(typeof(path) != 'undefined'){
        this.miniEditor.setText(path+'');
    }
  }

  attach () {
    if (this.panel == null) this.panel = atom.workspace.addModalPanel({item: this, visible: false})
    this.previouslyFocusedElement = document.activeElement
    this.panel.show()
    this.message.textContent = `Set flex/bison files`
    this.setPathText('flex-bison', [0, Infinity])
    this.miniEditor.element.focus()
  }

  setPathText (placeholderName, rangeToSelect) {
    if (rangeToSelect == null) rangeToSelect = [0, placeholderName.length]
    const packagesDirectory = this.getPackagesDirectory()
    this.miniEditor.setText(path.join(packagesDirectory, placeholderName))
    const pathLength = this.miniEditor.getText().length
    const endOfDirectoryIndex = pathLength - placeholderName.length
    this.miniEditor.setSelectedBufferRange([[0, endOfDirectoryIndex + rangeToSelect[0]], [0, endOfDirectoryIndex + rangeToSelect[1]]])

  }

  getPackagesDirectory () {
    return require('os').homedir()
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://package-generator'
  }

  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  confirm () {
    const pth = this.getPackagePath();
    const name = this.getPackageName();
    if(!this.validPackagePath()){
      fs.mkdirSync(pth);
    }

    if(this.validPackagePath()) {
      let flex = this.getFlexPath();
      if(flex != false){
        fs.writeFile(this.getFlexPath(), this.getFlexContent(), function (err) {
          if (err) throw err;
        });
      }

      let bison = this.getBisonPath();
      if(bison != false){
        fs.writeFile(this.getBisonPath(), this.getBisonContent(), function (err) {
          if (err) throw err;
        });
      }
      if(this.checkbox.checked){
        fs.writeFile(this.getMakePath(), this.getMakeContent(), function (err) {
          if (err) throw err;
        });
      }
      atom.project.addPath(pth);
      this.close();
      atom.notifications.addInfo("Project '" + name + "' created successfully!");
    }
  }

  validPackagePath () {
    var pattern = /[A-Za-z](\w|-)*[A-Za-z0-9]/;
    var pth = this.getPackagePath();
    var nme = this.getPackageName();
    var index = pattern.exec(nme)
    if (index[0] !== nme){
      this.error.textContent = `Name '${this.getPackageName()}' is not compatible`
      this.error.style.display = 'block'
      return false
    }
    else if(!(this.validateName(this.Flex.getText()) || this.validateName(this.Bison.getText())) && !this.checkbox.checked) {
      this.error.textContent = `Insert a correct, Flex or Bison, name (without spaces or special characters) or select Makefile`;
      this.error.style.display = 'block';
      return false
    }
    else if(!this.validateName(this.Exe.getText()) && this.checkbox.checked) {
      this.error.textContent = `For Makefile must insert executable name`;
      this.error.style.display = 'block';
      return false
    }
    else {
      return true
    }
  }

  getPackagePath () {
    const packagePath = path.normalize(this.miniEditor.getText().trim())
    var packageName = path.basename(packagePath)
    packageName = packageName.replace(/\s/g, '')
    return path.join(path.dirname(packagePath), packageName)
  }

  getPackageName() {
    const packagePath = path.normalize(this.miniEditor.getText().trim())
    var packageName = path.basename(packagePath)
    packageName = packageName.replace(/\s/g, '')
    return packageName
  }


  close () {
    if(typeof(this.panel) !== 'undefined'){
      if (!this.panel.isVisible()) return
      this.panel.hide()
      if (this.previouslyFocusedElement != null) this.previouslyFocusedElement.focus()
    }
  }

  validateName(name){
      var pattern = /^[A-Za-z](\w|-)*[A-Za-z0-9]$/;
      var index = pattern.exec(name);
      if(index != null)
        return true;
      else {
        return false;
      }
  }


  getFlexContent(){
    return "%{\n\n%}\n\n\n%%\n\n/*Tokens declarations*/\n\n%%\n\n/*C code for lexer*/\n\n";
  }

  getFlexPath() {
    if(this.validateName(this.Flex.getText())){
      var pth = this.getPackagePath();
      var nme = this.Flex.getText() + '.l';
      return  path.normalize(path.join(pth,nme));
    }
    else{
      return false;
    }
  }

  getBisonContent(){
    var content = "%{\n\n%}\n/*Tokens declarations*/\n%%\n/*Rules Declarations*/\n%%\n\n/*C code for parser*/\n\nint main (int argc, char **argv)\n{\n\t++argv, --argc;\n\t";
    content += "if ( argc > 0 )\n\t\tyyin = fopen( argv[0], 'r' );\n\telse\n\t\tyyin = stdin;\n\treturn yyparse();\n}\n";
    return content;
  }

  getBisonPath() {
    if(this.validateName(this.Bison.getText())){
      var pth = this.getPackagePath();
      var nme = this.Bison.getText() + '.y';
      return  path.normalize(path.join(pth,nme));
    }
    else{
      return false;
    }
  }

  getMakeContent(){
    var content = '';
    var flex = this.Flex.getText();
    var bison = this.Bison.getText();
    var exe = this.Exe.getText();

    if(this.validateName(flex) && this.validateName(bison)){
      content = ".PHONY: default\n\ndefault: "+exe+"\n\n"+exe+": "+flex+".lex.c "+bison+".tab.c\n\tgcc -o "+exe+" "+bison+".tab.c -lfl\n\n"+flex+".lex.c: ";
      content += flex+".l\n\tflex -s -o "+flex+".lex.c "+flex+".l\n\n"+bison+".tab.c: "+bison+".y\n\tbison -v "+bison+".y\n\n";
    }
    else if(this.validateName(flex)){
      content = ".PHONY: default\n\ndefault: "+exe+"\n\n"+exe+": "+flex+".lex.c\n\tgcc -o "+exe+" "+flex+".lex.c -lfl\n\n"+flex+".lex.c: "+flex+".l\n\t"+flex+"-s "+flex+".lex.c "+flex+".l\n\n";
    }
    else if(this.validateName(bison)){
      content = ".PHONY: default\n\ndefault: "+exe+"\n\n"+exe+": "+bison+".tab.c\n\tgcc -o "+exe+" "+bison+".tab.c -lfl\n\n"+bison+".tab.c: "+bison+".y\n\t"+"bison -v "+bison+".y\n\n";
    }
    return content;
  }

  getMakePath() {
    var pth = this.getPackagePath();
    var nme = 'Makefile';
    return  path.normalize(path.join(pth,nme));

  }
}

/*=============================================================================
 |   Assignment:  thesis
 |   University:  University of Macedonia, Thessaloniki, Greece
 |       Author:  Dimitrios Tsiakmakis it1237@uom.edu.gr
 |       Leader:  Ilias Sakellariou
 |
 |         Date:  2018
 |
 |  Description:  IDE for GNU Flex/BISON tools
 *===========================================================================*/
