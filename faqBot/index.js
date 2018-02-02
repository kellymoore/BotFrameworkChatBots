const restify = require('restify');
const builder = require('botbuilder');
const cognitiveServices = require('botbuilder-cognitiveservices');
require('dotenv').config()

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978,
    function () {
        console.log('%s listening to %s',server.name,server.url);
    }
);

const connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

server.post('/api/messages', connector.listen());

const recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
    subscriptionKey: process.env.SUBSCRIPTION_KEY,
});

const qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: "Sorry I don't understand the question",
    qnaThreshold: 0.4,
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', qnaMakerDialog);