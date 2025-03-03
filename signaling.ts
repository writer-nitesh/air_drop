// signaling.ts
type OfferCallback = (offer: RTCSessionDescriptionInit) => void;
type AnswerCallback = (answer: RTCSessionDescriptionInit) => void;

class Signaling {
    private offerCallback?: OfferCallback;
    private answerCallback?: AnswerCallback;

    sendOffer(offer: RTCSessionDescriptionInit) {
        this.offerCallback?.(offer);
    }

    sendAnswer(answer: RTCSessionDescriptionInit) {
        this.answerCallback?.(answer);
    }

    onOfferReceived(callback: OfferCallback) {
        this.offerCallback = callback;
    }

    onAnswerReceived(callback: AnswerCallback) {
        this.answerCallback = callback;
    }
}

export const signaling = new Signaling();
