const fet = require('node-fetch');
const express = require('express');
const ejs = require('ejs')
let fs = require('fs')


const { clientId, clientSecret, port, redirectUrl } = require('./config.json');



const app = express();

app.get('/', async ({ query }, response) => {
    const { code } = query;

    const data = {
        redirectUrl: redirectUrl,
        userData: null    
    }

    if (code) {
        try {
            const oauthResult = await fet('https://discord.com/api/oauth2/token', {
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

            const oauthData = await oauthResult.json() as any;

            //Unauthorized
            if (!oauthData.expires_in) {
                console.log('Get Fucked');
                respond(response, data);
                return;
            }

            const userResult = await fet('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });

            const userData = await userResult.json();
            console.log(userData);
            console.log(userData.username);
            data.userData = userData;

            respond(response, data);
            return;

        } catch (error) {
            console.error(error);
        }
    }


    respond(response, data);
    return;
});

function respond(res: any, data: any) {
    console.log(data);
    fs.readFile(__dirname + '/index.html', 'utf-8', (err, html) => {
        res.send(ejs.render(html, { data: JSON.stringify(data) }))
    })
}

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});