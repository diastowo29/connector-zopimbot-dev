const REQS = require("./requestid")

const addTagsPayload = function (channel_id, tags) {
    const addTagsMutation = {
      payload: {
        query: `mutation {
          addTags(
            channel_id: "${channel_id}",
            tags: ["${tags}"]
          ) {
            success
          }
        }`
      },
      type: "request",
      id: REQS.REQUEST_ID.ADD_TAGS
    };
    return addTagsMutation;
}

const getDeptPayload = function () {
  const getDepartmentsQuery = {
    payload: {
      query: `query {
        departments {
          edges {
            node {
              id
              name
              status
            }
          }
        }
      }`
    },
    type: "request",
    id: REQS.REQUEST_ID.GET_DEPARTMENTS
  };
  return getDepartmentsQuery;
}

function transferToDepartmentPayload(channelToBeTransferred, onlineDepartment) {
  const transferToDepartmentQuery = {
    payload: {
      query: `mutation {
        transferToDepartment(
          channel_id: "${channelToBeTransferred}",
          department_id: "${onlineDepartment}",
          leave: true
        ) {
            success
          }
        }`
    },
    type: "request",
    id: REQS.REQUEST_ID.TRANSFER_TO_DEPARTMENT
  };
  return transferToDepartmentQuery;
}

const startAgentSessionPayload = function (ACCESS_TOKEN) {
  const startAgentSessionPayload = `mutation {
    startAgentSession(access_token: "${ACCESS_TOKEN}") {
      websocket_url
      session_id
      client_id
    }
  }`;
  return startAgentSessionPayload;
}

const udpateAgentStatusPayload = function () {
  const updateAgentStatusQuery = {
    payload: {
      query: `mutation {
        updateAgentStatus(status: ONLINE) {
          node {
            id
          }
        }
      }`
    },
    type: "request",
    id: REQS.REQUEST_ID.UPDATE_AGENT_STATUS
  };
  return updateAgentStatusQuery;
}

const sendMsgPayload = function (channel_id, message, backoff, msgId) {
  const sendMessageQuery = {
    payload: {
      query: `mutation {
                sendMessage(
          backoff: ${backoff}
          channel_id: "${channel_id}",
          msg_id: "${msgId}",
          msg: "${message}"
                ) {
                    success
                }
            }`
    },
    type: "request",
    id: REQS.REQUEST_ID.SEND_MESSAGE
  };
  return sendMessageQuery;
}

const subsMsgPayload = function () {
  const messageSubscriptionQuery = {
    payload: {
      query: `subscription {
        message {
          node {
            id
            content
            channel {
              id
            }
            from {
              __typename
              display_name
            }
          }
        }
      }`
    },
    type: "request",
    id: REQS.REQUEST_ID.MESSAGE_SUBSCRIPTION
  };
  return messageSubscriptionQuery;
}

function testingPanelTemplate(channel_id) {
  const sendQuickRepliesQuery = {
    payload: {
      query: `mutation {
        sendPanelTemplate(
          channel_id: "${channel_id}",
          panel: {
            heading: "Your appointment today at Garden City",
            paragraph: "You have a haircut scheduled at 5pm today with senior stylist Sharon",
            image_url: "https://example.com/banner.png",
            action: {
              value: "https://example.com/appointment/1"
            }
          },
          buttons: [
            {
              text: "Reschedule",
              action: {
                type: LINK_ACTION,
                value: "https://example.com/reschedule/1"
              }
            }
          ]
        ) {
          success
        }
      }`
    },
    type: "request",
    id: REQS.SEND_PANEL_TEMPLATES
  };
  return sendQuickRepliesQuery;
}


function sendBotFailMsgPayload(channel_id) {
  const sendQuickRepliesQuery = {
    payload: {
      query: `mutation {
        sendQuickReplies(
          channel_id: "${channel_id}",
          msg: "Oops, sepertinya bot kita sedang bermasalah, kamu mau gak kita hubungkan ke Agent beneran?",
          quick_replies: [{
              action: {
                value: "Hubungkan ke Agent asli"
              },
              text: "Hubungkan"
            },
            {
              action: {
                value: "Gak usah gpp kok"
              },
              text: "Gausah"
            }
          ],
          fallback: {
            msg: "Oops, sepertinya bot kita sedang bermasalah, kamu mau gak kita hubungkan ke Agent beneran?"
            options: [
              "Hubungkan",
              "Gausah"
            ]
          }
        ) {
          success
        }
      }`
    },
    type: "request",
    id: REQS.SEND_QUICK_REPLIES
  };
  return sendQuickRepliesQuery;
}

function sendBotDontGetPayload(channel_id) {
  const sendQuickRepliesQuery = {
    payload: {
      query: `mutation {
        sendQuickReplies(
          channel_id: "${channel_id}",
          msg: "Mau aku arahkan ke agent asli?",
          quick_replies: [{
              action: {
                value: "Hubungkan ke Agent asli"
              },
              text: "Hubungkan"
            },
            {
              action: {
                value: "Gak usah gpp kok"
              },
              text: "Gausah"
            }
          ],
          fallback: {
            msg: "fallback - Mau aku arahkan ke agent asli?"
            options: [
              "Hubungkan",
              "Gausah"
            ]
          }
        ) {
          success
        }
      }`
    },
    type: "request",
    id: REQS.SEND_QUICK_REPLIES
  };
  return sendQuickRepliesQuery;
}

function sendButtonMsgPayload (channel_id) {
	const sendButtonReplyQuery = {
        payload: {
          query: `mutation {
                    sendButtonTemplate(
                        channel_id: "${channel_id}",
                        msg: "Test button template reply?",
                        buttons: [
                          {
                            text: "Book an appointment",
                            action: {
                              type: LINK_ACTION,
                              value: "https://example.com/book"
                            }
                          },
                          {
                            text: "View hairstylists",
                            action: {
                              type: QUICK_REPLY_ACTION,
                              value: "view hairstylists"
                            }
                          },
                          {
                            text: "View gallery",
                            action: {
                              type: QUICK_REPLY_ACTION,
                              value: "view gallery"
                            }
                          }
                        ]
                    ) {
                        success
                    }
                }`
        },
        type: "request",
        id: REQS.SEND_QUICK_REPLIES
    };
	return sendButtonReplyQuery;
}

function testingQuickReplies(channel_id) {
  const sendQuickRepliesQuery = {
    payload: {
      query: `mutation {
        sendQuickReplies(
          channel_id: "${channel_id}",
          msg: "We have the following options. Which one is your favorite?",
          quick_replies: [
            {
              action: {
                value: "My favorite is chocolate"
              },
              text: "Chocolate"
            },
            {
              action: {
                value: "My favorite is vanilla"
              },
              text: "Vanilla"
            },
            {
              action: {
                value: "My favorite is cookies and cream"
              },
              text: "Cookies and cream"
            },
            {
              action: {
                value: "My favorite is coconut"
              },
              text: "Coconut"
            },
            {
              action: {
                value: "My favorite is salted caramel"
              },
              text: "Salted caramel"
            }
          ],
          fallback: {
            msg: "We have the following options. Which one is your favorite?"
            options: [
              "Chocolate",
              "Vanilla",
              "Cookies and cream",
              "Coconut",
              "Salted caramel"
            ]
          }
        ) {
          success
        }
      }`
    },
    type: "request",
    id: REQS.SEND_QUICK_REPLIES
  };
  return sendQuickRepliesQuery;
}

function testingListTemplates (channel_id) {
  const sendListTemplates = {
    payload: {
      query: `mutation {
        sendListTemplate(
          channel_id: "${channel_id}",
          items: [
            {
              heading: "Band 1",
              paragraph: "example paragraph text",
              image_url: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg",
              action: {
                value: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg"
              }
            },
            {
              heading: "Band 2",
              paragraph: "example paragraph text",
              image_url: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg",
              action: {
                value: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg"
              }
            },
            {
              heading: "Band 3",
              paragraph: "example paragraph text",
              image_url: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg",
              action: {
                value: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg"
              }
            }
          ],
          buttons: [
            {
              text: "View more",
              action: {
                type: LINK_ACTION,
                value: "https://absspeedsensors.com/wp-content/uploads/2020/09/sample.jpg"
              }
            }
          ]
        ) {
          success
        }
      }`
    },
    type: "request",
    id: REQS.SEND_QUICK_REPLIES
  };
	return sendListTemplates;
}

module.exports = {
    addTagsPayload,
    subsMsgPayload,
    sendMsgPayload,
    udpateAgentStatusPayload,
    startAgentSessionPayload,
    transferToDepartmentPayload,
    getDeptPayload
}
