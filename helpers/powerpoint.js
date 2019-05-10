var Pptx = require("pptxgenjs");
const i18n = require('i18n');
const _ = require('lodash');
const state = require('./state.js');

function generate() {
    const content = state.load();

    var pptx = new Pptx();

    pptx.setLayout('LAYOUT_WIDE');

    pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        bkgd:  'FFFFFF',
        objects: [
          { 'rect':  { x: 0, y: 6.5, w:'100%', h:0.75, fill:'6C3483' } },
          { 'text':  { text: i18n.__("copyright"), options:{ x:3.0, y: 6.5, w:5.5, h:0.75, color: 'FFFFFF' } } },
        ],
        slideNumber: { x:0.3, y: 6.7, color: 'FFFFFF', fontSize: 16 }
    });

    const capitalizedPrefix = _.capitalize(content.searchTerm);

    pptx.addNewSlide()
        .addText(capitalizedPrefix, { x: '30%', y: '40%', fontSize:70, bold:true, color:'363636' })
        .addText(content.prefix, { x: '30%', y: '50%', fontSize:50, color:'363636' });

    console.log(content.sentences);

    content.sentences.forEach((sentence) => {
        pptx.addNewSlide('MASTER_SLIDE')
            .addText(sentence.text, { x: '10%', y: '30%', fontSize: 30 });
    });

    pptx.save(content.searchTerm);
}

module.exports = generate;