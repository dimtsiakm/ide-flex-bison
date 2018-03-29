'use babel';

import FlexBisonIdeView from './flexbisonideview';
import RulesAndUnionView from './rulesandunionview'
import { ToolbarConsumer } from './toolbar';
import NewProjectView from './new_project'
import {CompositeDisposable, Disposable} from 'atom';
import BasicFlexProvider from './flex-provider';
import BasicBisonProvider from './bison-provider';

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

export default {

  subscriptions: null,
  consumeToolBar: null,
  view: null,

  activate(state) {
    require('atom-package-deps').install('ide-flex-bison');
    this.consumeToolBar = ToolbarConsumer;
    this.view = new NewProjectView();
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.

      atom.workspace.addOpener(uri => {
        if (uri === 'atom://flexbisonide') {
          console.log('Activate');
          return new FlexBisonIdeView();
        }
      }),
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://rulesandunion') {
          return new RulesAndUnionView();
        }
      }),
      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'ide-flex-bison:toggle': () => this.toggle(),
        'ide-flex-bison:toggle-rules': () => this.toggleRules(),
      }),

      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof FlexBisonIdeView) {
            item.destroy();
          }
          else if (item instanceof NewProjectView) {
            item.destroy();
          }
          else if (item instanceof RulesAndUnionView) {
            item.destroy();
          }
        });
      })
    );
  },

  getProvider() {
    return [BasicFlexProvider, BasicBisonProvider];
  },


  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://flexbisonide');
  },

  toggleRules() {
    atom.workspace.toggle('atom://rulesandunion');
  },

  new_project() {
    atom.workspace.toggle('atom://package-generator')
  },

  deserializeFlexBisonIdeView(serialized) {
    return new FlexBisonIdeView();
  },

  deserializeRulesAndUnionView(serialized) {
    return new RulesAndUnionView();
  }

};
