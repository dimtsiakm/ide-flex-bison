'use babel';

import * as TokensFunctions from './tokens_functions';
import fs from 'fs';
import path from 'path';


export default class RulesAndUnionView {

  constructor(serializedState) {
    this.element = document.createElement('div');
    this.element.setAttribute("id", "flexbisonide");
    this.element.classList.add('rulesandunion');

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
    var union;
    var has_error_verbose;
    var rules_bison;

    var current_path = item.getPath();
    var pathproject = path.dirname(current_path);

    var str = fs.readdirSync(pathproject.toString());

    for(var i = 0; i<str.length; i++){
      var file_path = path.join(pathproject,str[i]);
      file_path = path.normalize(file_path);

      var ot = fs.readFileSync(file_path);
      ot = ot.toString();

      if(path.extname(file_path) == '.y'){
        union = TokensFunctions.union_declarations(ot);
        tknbison = TokensFunctions.tokens_bison(ot);
        ntermbison = TokensFunctions.non_terminal_bison(ot);
        has_error_verbose = TokensFunctions.error_verbose(ot);
        rules_bison = TokensFunctions.rules_bison(ot);
      }
      else {}
    }

    koti +=  `</br><h4>Union Declaration</h4>`;
    if(union != null){
      koti += `<ul>`;
      for(var i = 0; i < union.length; i++){
        koti += `<li>${union[i]}</li>`;
      }
      koti += `</ul>`;
    }
    else {
      koti += `<p>Union has not been established</p>`;
    }
    if(has_error_verbose){
      koti += `</br><h4>%error-verbose: true</h4>`;
    }
    else{
      koti += `</br></br><h4>%error-verbose: FALSE</h4>`;
    }

    koti += `</br></br><hr><h4>Rules</h4>`;
    if(typeof(rules_bison) !== 'undefined'){
      for(var i = 0; i < rules_bison.length;i++){
        koti += `<p>${rules_bison[i].name} :`;
        var rows = rules_bison[i].rules_arr;

        for(var j = 0; j < rows.length; j++){
          var rules_tokens = rows[j];

          for(var k = 0; k < rules_tokens.length; k++){

            var found_bison = tknbison.find(function (element) {
              var nme;
              var rtn;
              var flag = false;
              if(element.name_token != null){
                nme = element.name_token[0].replace(/\s+/g,'');

              }
              if(element.return_token != null){
                rtn = element.return_token[0].replace(/\s+/g, '');
              }
              return ((nme === rules_tokens[k]) || (rtn === rules_tokens[k]));
            });

            var found_nterm = ntermbison.find(function (element) {
              return (element === rules_tokens[k]);
            });


            if(found_bison || found_nterm){
              koti += `<span>${rules_tokens[k]}</span>`;
            }
            else if(rules_tokens[k] === 'error'){
              koti += `<span style="color:#5b7baf">${rules_tokens[k]}</span>`;
            }
            else{
              koti += `<span style="color:#ff8c8c">${rules_tokens[k]}</span>`;
            }
          }
          if(j == rows.length-1){
            koti += `</br>`;
          }
          else{
            koti += `</br>&nbsp;| `;
          }
        }
        koti += `</p>`;
      }
    }
    return koti;
  }

  getTitle() {
    return 'Rules and Union';
  }

  getDefaultLocation() {
    return 'left';
  }

  getAllowedLocations() {
    return ['left', 'right', 'bottom'];
  }

  getURI() {
    return 'atom://rulesandunion'
  }

  serialize() {
    return {
      deserializer: 'ide-flex-bison/RulesAndUnionView'
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
