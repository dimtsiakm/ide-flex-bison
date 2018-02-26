'use babel';

export function tokens_flex(str_from_flex_file) {
  var pattern = /%%/;
  var tkns = str_from_flex_file.split(pattern);
  pattern_flex = /\n/;
  var ArrayTokens = tkns[1].split(pattern_flex);

  var s = new Array();
  var m;

  pattern_token = /\{\b\w+\b\}|^\".+\"|\[.+\]|^\./;//
  var pattern_return = /return\(\w+\)|return\s+\w+|return \'.\'/;
  for(i = 0; i < ArrayTokens.length; i++){
    if(ArrayTokens[i] != null){
      var arr_tokens = pattern_token.exec(ArrayTokens[i]);
      var arr_return = pattern_return.exec(ArrayTokens[i]);
      if(arr_tokens != null || arr_return != null){
        var return_clear = /((?!return\b)\b\w+)|\'.+\'/;
        var clear = return_clear.exec(arr_return);
        if(clear != null){
          var token = {
            name_token: arr_tokens,
            return_token: clear
          };
        }
        s.push(token);
      }
    }
  }
  return s;
}

export function tokens_bison(str){
  var pattern = /%%/;
  var tkns = str.split(pattern);

  if(tkns.length != 3){
    atom.notifications.addInfo('Wrong program format! Check "%%" symbols');
  }

  var ptrn = /\n/;
  var rows_of_tokens1 = tkns[0].split(ptrn);

  var ppt = /%token|%left|%type|%right|%nonassoc/;
  var rows_of_tokens = new Array();
  var rows_of_tokens2 = new Array();

//kathe grammh xwrise thn me ppt regex
  for(var i = 0; i < rows_of_tokens1.length; i++){
    if(ppt.exec(rows_of_tokens1[i]) != null){
      rows_of_tokens2.push(rows_of_tokens1[i]);
    }
  }
  var opo = "";

  for(var i = 0; i < rows_of_tokens2.length; i++){
    var index = rows_of_tokens2[i].split(ppt);
    for(var j = 0; j < index.length; j++){
      rows_of_tokens.push(index[j]);
    }
  }

  var array_tokens = new Array();
  var tkn = /(?![^<]*>\s*)\s*\w+|\'.\'/;
  var id = /\".+\"/;

  for(i = 0; i < rows_of_tokens.length; i++){
    var arr_tokens = tkn.exec(rows_of_tokens[i]);
    var arr_return = id.exec(rows_of_tokens[i]);
    if(arr_tokens != null || arr_return != null){
      var token = {
          name_token: arr_tokens,
          return_token: arr_return
      };
      array_tokens.push(token);
    }
  }
  return array_tokens;
}

export function non_terminal_bison(str){
  var pattern = /%%/;
  var tkns = str.split(pattern);
  var pattern_bison = /;/;
  var ArrayTokens = tkns[1].split(pattern_bison);

  var arr_tokens = new Array();
  pattern_bison = /^\s*(\w+)\s*:/;

  for(i = 0; i < ArrayTokens.length; i++){
    var nterm = pattern_bison.exec(ArrayTokens[i]);
    if(nterm != null){
      //clear = clear.replace(/\s/,'<->');
      arr_tokens.push(nterm[1]);
    }

  }
  return arr_tokens;
}

export function error_verbose(str){
  var pattern = /%%/;
  var piece = str.split(pattern);

  pattern = /%error-verbose/;
  var has_error = pattern.exec(piece[0]);
  if(has_error != null){
    return true;
  }
  else {
    return false;
  }
}

export function union_declarations(str){

  var pattern = /%%/;
  var piece = str.split(pattern);

  pattern = /%/;
  var arr = piece[0].split(pattern);
  pattern = /union/;
  var union;
  var index;
  var array;
  var arr_declarations = new Array();
  var regex_struct = /struct\s*{([^}]+)}\s*(\w+);/g;
  var regex_type = /((char|char\s*\*|int|double|float|long|short|long long|void|unsigned int)\s*\s+\w+;)/g;
  for(var i = 0; i < arr.length; i++){
    if(pattern.exec(arr[i]) != null){
      union = arr[i];
      while ((index = regex_struct.exec(union)) !== null) {
        arr_declarations.push(index[0]);
        union = union.replace(index[0],'');
      }
      while ((index = regex_type.exec(union)) !== null) {
        arr_declarations.push(index[1]);
      }
    }
  }
  if(arr_declarations.length > 0){
    return arr_declarations;
  }
  else{
    return null;
  }
}

export function rules_bison(str){
  var pattern = /%%/;
  var piece = str.split(pattern);


  pattern = /\n(?=\s*\w+\s*:)/g;
  var arr_non_terminal = piece[1].split(pattern);

  var name_rule;
  pattern = /^\s*(\w+)\s*:/;
  var rules = new Array();
  for(var i = 0; i < arr_non_terminal.length; i++){   //gia kathe kanona

    var nonterm = pattern.exec(arr_non_terminal[i]);  //pare to onoma
    if(nonterm != null){                  //an uparxei to onoma tou kanona (rule: )
      name_rule = nonterm[1];          //apothhkeuse to sthn metablhth name_rule
      arr_non_terminal[i] = arr_non_terminal[i].replace(nonterm[0],'');//svhse to onoma apo to string .rule:
      var row_rule_patt = /\|/;
      var rows_of_rules = arr_non_terminal[i].split(row_rule_patt);//xwrise to kuriws meros se merh sumfwna me '|'
      var rule_arr = new Array();
      for(var j = 0; j < rows_of_rules.length; j++){//gia kathe grammh
        var symbl_patt = /\s*(\w+|\'.\'|\"\w+\"|\".\")/g;
        var symbl;
        rows_of_rules[j] = rows_of_rules[j].replace(/\/\*[/s/S]*.*\*\//g,'');
        rows_of_rules[j] = rows_of_rules[j].replace(/{[\s\S]*}/g,''); //[\s\S]* anti gia katholikh flag /s opws /g gia apomakrunsh sxoliwn
        var symbols_arr = new Array();
        while ((symbl = symbl_patt.exec(rows_of_rules[j])) !== null) {
          symbols_arr.push(symbl[1]);//eisagwgh twn sumbolwn mias grammhs se ena pinaka
        }
        rule_arr.push(symbols_arr);//eisagwgh olwn twn pinakwn ana seira kanona.
      }
      var rule = {
        name: name_rule,
        rules_arr: rule_arr
      };
      rules.push(rule);
    }
  }

  return rules;
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
