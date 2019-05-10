    
const i18n = require('i18n');

const helpers = {
    input: require('./helpers/input.js'),
    text: require('./helpers/text.js'),
    powerpoint: require('./helpers/powerpoint.js')
}

async function start() {
    configureLocale();

    helpers.input();
    await helpers.text();
    helpers.powerpoint();
}

function configureLocale(){
    i18n.configure({
        locales:['pt', 'en'],
        defaultLocale: 'pt',
        directory: __dirname + '/locales'
    });
}

start();