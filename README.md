# konyiel

This is a skype bot that will return a random message (lets call it an answer), when it receives a message with recognized rules.
* The answer is selected based from 3 main categories: _yes_, _no_ and _maybe_.
* Each of the category has an array of words that shares the same intent.
* For example, _yes_ category array may contain 'iya', 'yup', 'yes', etc.
* To find more about the recognized rules, please refer to the Message rules section below.

#### How to run/test the bot:
1. <a href="https://emulator.botframework.com/">Download</a> and install the client emulator. We will use this to communicate with the bot.
2. Clone the repository to your local drive.
3. Navigate to the clone directory and run the `npm install` command. This will install the restify and botbuilder modules.
4. Run the `node app` command. This will run the restify server in your localhost on port 8080.
5. Open the client emulator and set the URL endpoint with `http://localhost:8080/api/messages`. Leave the other fields empty.
6. Click the <b>CONNECT</b> button.

#### Message rules:
* The message must starts with `apakah` (incasesensitive) word and contain any `?` character onwards.
* <i>TBA</i>
