'use babel';

import { Disposable } from 'atom';

let currentToolbar = null;

export function ToolbarConsumer(toolbar) {
  if (currentToolbar) {
    return;
  }

  currentToolbar = toolbar('flexbisonide');

  currentToolbar.addButton({
    icon: 'file-code',
    callback: 'ide-flex-bison:toggle',
    tooltip: 'Toggle FlexBison View'
  });

  currentToolbar.addButton({
    icon: 'code',
    callback: 'ide-flex-bison:toggle-rules',
    tooltip: 'Toggle Rules and Union View',
    iconset: 'ion'
  });

  currentToolbar.addButton({
    icon: 'leaf',
    callback: 'tree-view:toggle',
    tooltip: 'Toggle Tree View',
    iconset: 'ion'
  });

  currentToolbar.addButton({
    icon: 'paper-airplane',
    callback: 'ide-flex-bison:new-project',
    tooltip: 'Create New Project',
    iconset: 'ion'
  });

  currentToolbar.addSpacer();

  currentToolbar.addButton({
    icon: 'check',
    callback: 'build:trigger',
    tooltip: 'Makefile'
  });

  currentToolbar.addButton({
    icon: 'gear-a',
    callback: 'build:toggle-panel',
    tooltip: 'Toggle Build Panel',
    iconset: 'ion'
  });

  currentToolbar.addButton({
    icon: 'log-in',
    callback: 'build:select-active-target',
    tooltip: 'Select Make Target',
    iconset: 'ion'
  });

  currentToolbar.addSpacer();

  return new Disposable(() => {
   currentToolbar.removeItems();
   currentToolbar = null;
 });
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
