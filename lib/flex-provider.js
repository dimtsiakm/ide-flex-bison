'use babel';

import suggestions from '../data/flex';

class BasicFlexProvider {
  constructor() {
	   this.selector = '*';
	}

	getSuggestions(options) {
		const { prefix } = options;

		if (prefix.length >= 1) {
			return this.findMatchingSuggestions(prefix);
		}
	}

	findMatchingSuggestions(prefix) {
		let prefixLower = prefix.toLowerCase();
		let matchingSuggestions = suggestions.filter((suggestion) => {
			let textLower = suggestion.text.toLowerCase();
			return textLower.startsWith(prefixLower);
		});

		return matchingSuggestions.map(this.inflateSuggestion);
	}

	inflateSuggestion(suggestion) {
		return {
			text: suggestion.text,
			description: suggestion.description,
			type: 'variable',
			rightLabel: 'flex value'
		};
	}
}
export default new BasicFlexProvider();

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
