/**
 * konyiel bot
 * Created by aCELo on 30/09/2017
 */

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function(){
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

//CONSTANTS ------------
const conversationUpdateMessageText = 'aloha smuaa';

const noneAnswers = [
    'nanya yang jelas plis',
    ':^)',
    'nanyanya musti ada kata apakah sama tanda tanya',
    '|-(',
    '(sarcastic)',
    '(ttm)',
];

const botMessagePrefix = "@konyiel.suci ";
const yesAnswers = ['iyes', 'ya', 'yup', 'begitulah'];
const noAnswers = ['gak', 'tidak lah', 'enggak', 'kagak'];
const maybeAnswers = ['hm...', 'ga tau', 'coba tanya oci', 'mnurut kamu?', '(lalala)'];
const perkAnswers = ['(rofl)', 'hehe', '(cool)'];
//------------------------------------------
//------------------------------------------

function getRandomBoolean(){
    return Math.random() >= 0.5;
}

function getRandomNumber(max) {
    var min = 1;
    max = max;
    return Math.floor(Math.random() * (max - min + min)) + min;
}

function getRandomNumberWithWeights(numberWeights) {
    numberWeights.sort(function(a,b) { return a - b; });
    numberWeights.reverse();

    var totalWeight = numberWeights.reduce(function(total, num) { return total + num; });
    var randomNumber = Math.random();

    var selectedNumber = 1;
    var currentWeightProbability = 0;
    numberWeights.forEach(function(numberWeight, idx) {
        if(randomNumber > currentWeightProbability) {
            selectedNumber = idx + 1;
        }

        currentWeightProbability += numberWeight/totalWeight;
    });

    return selectedNumber;
}

function getRandomAnswer(answers) {
    var answersLength = answers.length;

    return answers[getRandomNumber(answersLength) - 1];
}

function getMessageData(message){
    return {
        author: message.user.name,
        timestamp: Math.round(Date.parse(message.timestamp)/1000),
        messageText: message.text,
        botName: message.address.bot.name
    }
}

function sendQuotedAnswer(session, quote, answers) {
    session.send(quote + getRandomAnswer(answers));
}

function sendPerkMessage(session) {
    session.sendTyping();
    
    if(getRandomBoolean()) { return; }

    sendQuotedAnswer(session, "", perkAnswers);
}

function getQuoteMessage(data) {
    return `
    <quote author="${data.author}" authorname="${data.author}" conversation="19:9cf2fd02a5164f988fb1d4e21955facf@thread.skype" timestamp="${data.timestamp}"><legacyquote></legacyquote>${data.messageText}<legacyquote>&lt;&lt;&lt;</legacyquote></quote>`;
}

//initialise the bot
var bot = new builder.UniversalBot(connector, [function(session){
    session.sendTyping();

    var data = getMessageData(session.message);

    if(data.messageText === "@" + data.botName) {
        if(getRandomBoolean()) {
            session.send('ya?');
        } else {
            session.send('kenapa?');
        }
    } else {
        var data = getMessageData(session.message);
        var quotedMessage = getQuoteMessage(data);
        sendQuotedAnswer(session, quotedMessage, noneAnswers);
    }

    session.endDialog();
}]);

//dialog handler when the bot is added into a conversation
bot.on('conversationUpdate', function (message) {
    var reply = new builder.Message().address(message.address).text(conversationUpdateMessageText);
    bot.send(reply);
});

//dialog handler when user sends message with a matching pattern for yes/no answer 
bot.dialog('yesno', function (session, args, next) {
    session.sendTyping();

    var data = getMessageData(session.message);

    var quotedMessage = getQuoteMessage(data);

    if(data.messageText.toLowerCase() === "@" + data.botName + "apakah?" || data.messageText.toLowerCase() === "apakah?") {
        session.send(quotedMessage + 'opoooo');
        session.endDialog();
        return;
    }

    var answerMode = getRandomNumberWithWeights([5, 5, 1]);
    
    switch(answerMode) {
        case 1:
            sendQuotedAnswer(session, quotedMessage, yesAnswers);
            sendPerkMessage(session);
        break;
        case 2:
            sendQuotedAnswer(session, quotedMessage, noAnswers);
        break;
        case 3:
            sendQuotedAnswer(session, quotedMessage, maybeAnswers);
            sendPerkMessage(session);
        break;
    }

    session.endDialog();
})
.triggerAction({
    matches: /(?=apakah)(?=.*\?)/i,
})