const restify = require('restify');
const builder = require('botbuilder');
const cognitiveServices = require('botbuilder-cognitiveservices');
var feedbackTool = require('./feedbackTool');
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

//Bot setup
var bot = new builder.UniversalBot(connector);

const recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
    subscriptionKey: process.env.SUBSCRIPTION_KEY,
    top: 3
});

var feedbackTool = new feedbackTool.FeedbackTool();
bot.library(feedbackTool.createLibrary());

const qnaMakerDialog = new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: "Sorry I don't understand the question",
    qnaThreshold: 0.4,
    feedbackLib:feedbackTool
});

bot.dialog('/', qnaMakerDialog);