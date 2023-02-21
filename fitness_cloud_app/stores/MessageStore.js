import { makeObservable, observable, computed, action, flow, runInAction } from "mobx"

import MessageService from "../services/MessageService";

class MessageStore {
    messages = [];
    newMessage = '';
    refreshing = false;

    constructor() {
        makeObservable(this, {
            messages: observable,
            refreshing: observable,
            newMessage: observable,
            setMessages: action,
            setNewMessage: action,
            setRefreshing: action,
        })
    }

    // --- Set Functions ---//

    setMessages(message) {
        this.messages = message
    }

    setRefreshing(value) {
        this.refreshing = value;
    }

    setNewMessage(value) {
        this.newComment = value;
    }


    // --- Load Functions ---//

    async loadMessages(contacts, token) {
        try {
            this.setRefreshing(true);
            const messages = await MessageService.getMessages(contacts, token);
            runInAction(() => {
                this.setMessages(messages);
                this.setRefreshing(false);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async sendMessage(contacts, token) {
        try {
            this.setRefreshing(true);
            await CommentService.postMessage(contacts, this.newMessage, token);
            runInAction(() => {
                this.loadMessages(contacts, token);
                this.setNewMessage('');
            })
        } catch (e) {
            console.log(e);
        }
    }

}

export default MessageStore = new MessageStore();