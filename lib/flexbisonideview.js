'use babel';

import * as TokensFunctions from './tokens_functions';
import fs from 'fs';
import path from 'path';


export default class FlexBisonIdeView {

  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.setAttribute("id", "flexbisonide");
    this.element.classList.add('flexbisonide');

    const message = document.createElement('div');
    message.textContent = 'The FlexBison IDE is Alive!';
    message.classList.add('message');
    this.element.appendChild(message);

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if (!atom.workspace.isTextEditor(item)) return;

      message.innerHTML = this.getFlexBisonItems(item);

      atom.workspace.getActiveTextEditor().onDidSave((event) => {
        message.innerHTML = this.getFlexBisonItems(item);
      });
    });
  }

  getFlexBisonItems(item) {
    var oti;
    var koti = '';
    var tknflex;
    var tknbison;
    var ntermbison;

    var current_path = item.getPath();
    var pathproject = path.dirname(current_path);

    var str = fs.readdirSync(pathproject.toString());

    for(var i = 0; i<str.length; i++){
      var file_path = path.join(pathproject,str[i]);
      file_path = path.normalize(file_path);

      var ot = fs.readFileSync(file_path);
      ot = ot.toString();

      if(path.extname(file_path) == '.l'){
        tknflex = TokensFunctions.tokens_flex(ot);
      }
      else if(path.extname(file_path) == '.y'){
        tknbison = TokensFunctions.tokens_bison(ot);
        ntermbison = TokensFunctions.non_terminal_bison(ot);
      }
      else {}
    }
    if(typeof(tknbison) !== 'undefined'){
    var copy_flex_tokens = tknflex.slice(0);
    var copy_flex_tokens1 = tknflex.slice(0);
    var copy_bison_tokens = tknbison.slice(0);
    var copy_non_terminal = ntermbison.slice(0);

    var number_of_tokens_bison = copy_bison_tokens.length;

    var has_bison_token = false;
    var index_token;

    koti +=  `<table style="width:85%">
              <tr><th>Flex tokens</th><th>Bison tokens</th></tr>`;

    for(var i = 0; i < tknflex.length; i++){
      for(var j = 0; j < copy_bison_tokens.length; j++){
        var flex_t = copy_flex_tokens[i].return_token[0];
        var bison_t = copy_bison_tokens[j].name_token[0];

        flex_t = flex_t.replace(/\s+/g,'');
        bison_t = bison_t.replace(/\s+/g,'');

        if(bison_t === flex_t){
          has_bison_token = true;
          index_token = j;
          break;
        }
        else {
        }
      }
      if(has_bison_token){
        koti += `<tr><td>${copy_flex_tokens[i].name_token[0]} -  ${copy_flex_tokens[i].return_token[0]}</td>
               <td>${copy_bison_tokens[index_token].name_token} -  ${copy_bison_tokens[index_token].return_token}</td></tr>`;
        copy_bison_tokens.splice(index_token,1);
      }
      else {
        koti += `<tr><td>${copy_flex_tokens[i].name_token[0]} -  ${copy_flex_tokens[i].return_token[0]}</td>
               <td></td></tr>`;
      }
      has_bison_token = false;
    }
    for(var j = 0; j < copy_bison_tokens.length; j++){
      koti += `<tr><td></td>
             <td>${copy_bison_tokens[j].name_token} -  ${copy_bison_tokens[j].return_token}</td></tr>`;
    }
    koti += `</table>`;

    koti += `</br></br><hr></br><h4><b>Non-terminal Symbols</b></h4><ul>`;
    for(var i = 0; i < ntermbison.length; i++){
      var element = ntermbison[i];
      var has_element = ntermbison.indexOf(element,i+1);
      if(has_element == -1){
        koti += `<li>${ntermbison[i]}</li>`;
      }
      else{
        koti += `<li style="color:#ff8c8c">${ntermbison[i]}</li>`;
      }
    }
    koti += `</ul>`;
    }
    return koti;
  }

  getTitle() {
    return 'Flex Bison View';
  }

  getDefaultLocation() {
    return 'right';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom'];
  }

  getURI() {
    return 'atom://flexbisonide'
  }

  serialize() {
    return {
      deserializer: 'ide-flex-bison/FlexBisonIdeView'
    };
  }

  destroy() {
    this.element.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

}

/*=============================================================================
 |   Assignment:  thesis
 |   University:  University of Macedonia, Thessaloniki, Greece
 |       Author:  Dimitrios Tsiakmakis housevetrinos@gmail.com
 |       Leader:  Ilias Sakellariou
 |
 |         Date:  2018
 |
 |  Description:  IDE for GNU Flex/BISON tools
 *===========================================================================*/
