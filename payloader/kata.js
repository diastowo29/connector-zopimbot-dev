const sendTextPayload = function (textContent) {
    const kataPayload = {
        type: 'text',
        content: textContent
    }
    return kataPayload;
}

const sendFilePayload = function (fileType, fileUrl) {
    const kataPayload = {
        type: 'data',
        payload: {
            type: fileType,
            url: fileUrl
        }
    }
    return kataPayload;
}

module.exports = {
    sendTextPayload,
    sendFilePayload
}
