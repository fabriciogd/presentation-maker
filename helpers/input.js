const readline = require('readline-sync');
const i18n = require('i18n');
const state = require('./state.js');

function informDetails() {
    const details = {};

    details.lang = askAndReturnLanguage();

    setLocale(details.lang);

    details.maximumSentences = askAndReturnMaximumSentences();
    details.searchTerm = askAndReturnSearchTerm();
    details.prefix = askAndReturnPrefix();

    state.save(details);

    function setLocale(locale){
        i18n.setLocale(locale);
    }

    function askAndReturnLanguage(){
        const language = ['pt','en']
        const text = i18n.__('choice_language');
		const selectedLangIndex = readline.keyInSelect(language, text);
        const selectedLangText = language[selectedLangIndex];
        
		return selectedLangText;
    }

    function askAndReturnMaximumSentences() {
        const text =  i18n.__('sentence_number');
        return readline.question(text);
    }

    function askAndReturnSearchTerm() {
        const text =  i18n.__('search_term');
        return readline.question(text );
    }

    function askAndReturnPrefix() {
        const prefixes = ['search_prefixes.who', 'search_prefixes.what', 'search_prefixes.history'].map(i18n.__);
        const text =  i18n.__('search_prefixes');
        const selectedPrefixIndex = readline.keyInSelect(prefixes, text);
        const selectedPrefixText = prefixes[selectedPrefixIndex];
    
        return selectedPrefixText;
    }
}

module.exports = informDetails;