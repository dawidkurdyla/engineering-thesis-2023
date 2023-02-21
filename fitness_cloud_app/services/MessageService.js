/**
 * API for managing comments
 */
import ProxyService from './ProxyService';


class MessageService {

    static async getMessages(contacts, token) {
        let url = `/workout_manager/messages/?contacts_id=${1}`

        return ProxyService.get(url, token)
    }

    static async postMessage(contacts, content, token) {
        let url = `/workout_manager/messages/`

        return ProxyService.post(url, {
            "contacts_id": contacts.id,
            "content": content,
        },
            token
        )
    }
}

export default MessageService;