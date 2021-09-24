var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fet = require('node-fetch');
const express = require('express');
const ejs = require('ejs');
let fs = require('fs');
const { clientId, clientSecret, port, redirectUrl } = require('./config.json');
const app = express();
app.get('/', ({ query }, response) => __awaiter(this, void 0, void 0, function* () {
    const { code } = query;
    const data = {
        redirectUrl: redirectUrl,
        userData: null
    };
    if (code) {
        try {
            const oauthResult = yield fet('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `${redirectUrl}`,
                    scope: 'identify',
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const oauthData = yield oauthResult.json();
            //Unauthorized
            if (!oauthData.expires_in) {
                console.log('Get Fucked');
                respond(response, data);
                return;
            }
            const userResult = yield fet('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });
            const userData = yield userResult.json();
            console.log(userData);
            console.log(userData.username);
            data.userData = userData;
            respond(response, data);
            return;
        }
        catch (error) {
            console.error(error);
        }
    }
    respond(response, data);
    return;
}));
function respond(res, data) {
    console.log(data);
    fs.readFile(__dirname + '/index.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { data: JSON.stringify(data) }));
    });
}
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
