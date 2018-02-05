var builder = require("botbuilder");

var FeedbackTool = (function(){
    function AnswerFeedback(){
        this.lib = new builder.Library('FeedbackTool');
        this.lib.dialog('answerSelection',
            [sendQnaAnswers,getAnswerFeedback]
        );
    }
    
    AnswerFeedback.prototype.createLibrary = function () {
        return this.lib;
    };
    AnswerFeedback.prototype.answerSelector = function (session,      
    options) {
        session.beginDialog('FeedbackTool:answerSelection',
            options || {}
        );
    };
    return AnswerFeedback;
}());

function sendQnaAnswers(session, args){
    var qnaMakerResult = args;
    session.dialogData.qnaMakerAnswers = qnaMakerResult.answers; 
    var answerOptions = [];
    session.dialogData.qnaMakerAnswers.forEach(
        function (qna) { 
            answerOptions.push(qna.answer); 
        }
    );
    answerOptions.push("None of the above.");
    
    builder.Prompts.choice(
        session, 
        "Please enter the number of the most appropriate answer.:", 
         answerOptions,
         {listStyle: builder.ListStyle.list}
    );
}

function getAnswerFeedback(session, results){
    var selectedAnswer =    
        session.dialogData.qnaMakerAnswers[results.response.index];
    if (selectedAnswer){
        session.send("Thanks for your feedback.");
        session.endDialogWithResult(selectedAnswer);
    }else{
        session.send("Sorry I couldn't answer your question.")
        session.endDialog();
    }
}

exports.FeedbackTool = FeedbackTool;