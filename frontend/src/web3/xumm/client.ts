import { Xumm } from 'xumm'
import type {
    XummJsonTransaction,
    XummPostPayloadBodyBlob,
    XummPostPayloadBodyJson,
    onPayloadEvent
} from 'xumm-sdk/dist/src/types'

const XUMM_API_KEY = import.meta.env.VITE_XUMM_API_KEY

export const xumm = new Xumm(XUMM_API_KEY)

export const createPayload = async (
    payload: XummPostPayloadBodyJson | XummPostPayloadBodyBlob | XummJsonTransaction,
    event: onPayloadEvent
) => {
    const payloadResp = await xumm.payload?.createAndSubscribe(payload, event)

    if (payloadResp) {
        // setPayloadUuid(payloadResp.created.uuid)

        if (xumm.runtime.xapp) {
            xumm.xapp?.openSignRequest(payloadResp.created)
        } else {
            if (payloadResp.created.pushed && payloadResp.created.next?.no_push_msg_received) {
                // setOpenPayloadUrl(payloadResp.created.next.no_push_msg_received)
            } else {
                window.open(payloadResp.created.next.always)
            }
        }
    }

    return payloadResp
}

// const payload = await xumm.payload?.createAndSubscribe({
//     TransactionType: 'Payment',
//     Destination: 'rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ',
//     Account: account,
//     Amount: String(1337),
// }, event => {
//     // Return if signed or not signed (rejected)
//     setLastPayloadUpdate(JSON.stringify(event.data, null, 2))

//     // Only return (websocket will live till non void)
//     if (Object.keys(event.data).indexOf('signed') > -1) {
//     return true
//     }
// })