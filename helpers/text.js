const fetch = require('node-fetch')
const state = require('./state.js');
const sentenceBoundaryDetection = require('sbd');
const _ = require('lodash');

async function search() {
    const content = state.load();

    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    limitMaximumSentences(content);

    state.save(content)

    async function fetchContentFromWikipedia(content) {
        const response = await fetch(`https://${content.lang}.wikipedia.org/w/api.php?action=query&exintro=true&prop=extracts&generator=search&gsrsearch=${encodeURIComponent(content.searchTerm)}&format=json`)
        const wikipediaRawResponse = await response.json()

        const wikipediaRawContent = wikipediaRawResponse.query.pages

        content.sourceContentOriginal = "";

        Object.keys(wikipediaRawContent).forEach((key) => {
            content.sourceContentOriginal += wikipediaRawContent[key]['extract']
        });
    }

    function sanitizeContent(content){

        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
        const withoutHtmlTags = removeHtmlTags(withoutDatesInParentheses);

        content.sourceContentSanitized = withoutHtmlTags
        
        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')

            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if (line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }

                return true
            });

            return withoutBlankLinesAndMarkdown.join(' ')
        }

        function removeDatesInParentheses(text) {
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
        }

        function removeHtmlTags(text){
            return text.replace(/(<([^>]+)>)/ig,"");
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = []
    
        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized);

        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence
            });
        });
    }

    function limitMaximumSentences(content) {
        if (!_.isEmpty(content.maximumSentences))
            content.sentences = content.sentences.slice(0, content.maximumSentences)
    }
}

module.exports = search