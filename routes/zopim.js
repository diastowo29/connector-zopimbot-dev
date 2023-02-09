var express = require('express');
const winston = require('winston');
var router = express.Router();
const {
  zp_session
} = require('../sequelize')
// const Sequelize = require('sequelize')
const graph = require('../payloader/graphql')
const kata = require('../payloader/kata')
const req = require('../payloader/requestid')
const axios = require('axios');
const WebSocket = require('ws');
const e = require('express');
const CHAT_API_URL = "https://chat-api.zopim.com/graphql/request";
const APITOKEN = '8Ot0lh5g1YqJl8lSfWOIb7pDSCrrKdg3PocWo8WpBsk5K2L4qFpkvrvOv4Rm5L3f'
const BOT_ID = '';
var newWs;
const SUBSCRIPTION_DATA_SIGNAL = "DATA";
const TYPE = {
  VISITOR: "Visitor"
};
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'zopimconnectorloggs.log' })
    ]
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/handover', function(req, res, next) {
    let newMessage = req.body.messages[0].content;
    let channel_id = req.body.userId;
    try {
        newWs.send(JSON.stringify(graph.sendMsgPayload(channel_id, newMessage, true)));
        res.status(200).send({});
    } catch (err) {
        console.log(err)
    }
});

router.post('/reply', function(req, res, next) {
    writeLogs('info', `bot-reply: ${req.body}`)
    res.render('index', { title: 'Express' });
});

let startAgentSessionQueryPayload = graph.startAgentSessionPayload(APITOKEN);
openWs(startAgentSessionQueryPayload, APITOKEN)

router.post('/connect', function(req, res, next) {
    let newZdToken = req.body.token;

    if (newWs !== undefined) {
        newWs.close();
        doDetachEventListeners(newWs);
    }

    zp_session.destroy({
        where: {},
        truncate: true
    })
    let startAgentSessionQueryPayload = graph.startAgentSessionPayload(newZdToken);
    openWs(startAgentSessionQueryPayload)
});

function doAttachEventListeners(ws) {
    ws.addListener("open", doHandleOpen);
    ws.addListener("close", doHandleClose);
    ws.addListener("message", doHandleMessage);
}

function doDetachEventListeners(ws) {
    ws.removeListener("open", doHandleOpen);
    ws.removeListener("close", doHandleClose);
    ws.removeListener("message", doHandleMessage);
}

function doHandleOpen() {
    console.log('=== Web Socket is OPENING ===');
    /************************
     * PING for prevent  *
     * timed out *
     ************************/
    pingInterval = setInterval(() => {
      // console.log('PINGs');
      newWs.send(
        JSON.stringify({
          sig: "PING",
          payload: +new Date()
        })
      );
    }, 5000);
  
    /************************
     * Agent status to ONLINE *
     ************************/
    newWs.send(JSON.stringify(graph.udpateAgentStatusPayload()));
    console.log("[updateAgentStatus] Request sent");
  
    /************************
     * Message subscription *
     ************************/
    newWs.send(JSON.stringify(graph.subsMsgPayload()));
    console.log("[message] Subscription request sent");
}

function doHandleClose(reason) {
    console.log(reason)
    console.log('=== Web Socket is CLOSING , re-Opening===');
    writeLogs('error', `ws-closed: ${reason}`)
    openWs(startAgentSessionQueryPayload, APITOKEN)
}

function doHandleMessage(message) {
    const data = JSON.parse(message);
    if (data.payload.errors && data.payload.errors.length > 0) {
        console.log(`==== INBOUND ERROR ${data.id} ====`)
        console.log(JSON.stringify(data))
    } else {
        if (data.id === req.REQUEST_ID.MESSAGE_SUBSCRIPTION) {
            messageSubscriptionId = data.payload.data.subscription_id;
        }
    }

    if (
        data.sig === SUBSCRIPTION_DATA_SIGNAL &&
        data.subscription_id === messageSubscriptionId &&
        data.payload.data
    ) {
        const chatMessage = data.payload.data.message.node;
        const sender = chatMessage.from;
        const channel_id = chatMessage.channel.id
        if (sender.__typename === TYPE.VISITOR) {
            writeLogs('info', `cust-inbound: ${JSON.stringify(data.payload)}`)
            console.log(`[message] Received: '${chatMessage.content}' from: '${sender.display_name}'`);
            /* ECHO back to Customer - for testing */
            newWs.send(JSON.stringify(graph.sendMsgPayload(channel_id, chatMessage.content, true)));
            // sendToBot(BOT_ID, kata.sendTextPayload(chatMessage.content), channel_id);
        }
    }
}

function sendToBot (botId, msgPayload, channelId) {
    const botUrl = `https://kanal.kata.ai/receive_message/${botId}`
    axios({
        method: 'POST',
        url: botUrl,
        data: {
            userId: channelId,
            messages: [msgPayload]
        }
      }).then((response) => {
        console.log('OK')
      }, (error) => {
        console.log('error')
        writeLogs('error', `send-to-bot: ${JSON.stringify(error)}`)
        //   newWs.send(JSON.stringify(sendBotFailMsgPayload(chatMessage.channel.id)));
      });
}

function openWs (startAgentSessionQueryPayload, token) {
    axios({
        method: 'POST',
        url: CHAT_API_URL,
        data: {
            query: startAgentSessionQueryPayload
        }
    }).then((response) => {
        console.log('startAgentSession')
        let newAgentSessionResponse = response.data.data.startAgentSession
        newWs = new WebSocket(newAgentSessionResponse.websocket_url);
        zp_session.create({
            session_id: newAgentSessionResponse.session_id,
            client_id: newAgentSessionResponse.client_id,
            token: token,
            chat_api_url: CHAT_API_URL,
            websocket_url: newAgentSessionResponse.websocket_url
        }).then(zp_session_created => {
            console.log('zp_session_created success');
            doAttachEventListeners(newWs);
        })
    }).catch(err =>{
        console.log(err)
        writeLogs('error', `openws-error: ${err}`)
    })
}

function writeLogs (level, msg) {
    var logTime = new Date().toISOString();
    logger.log({
        level: level,
        timestamp: logTime,
        message: msg
    });
}

module.exports = router;
