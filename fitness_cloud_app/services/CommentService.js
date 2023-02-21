/**
 * API for managing comments
 */
import ProxyService from './ProxyService';


class CommentService {

    static async getCommentList(training, token) {
        let url = `/workout_manager/trainings/${training.id}/comments/`

        return ProxyService.get(url, token)
    }
    
    static async postComment(userID, training, content, token) {
        let url = `/workout_manager/trainings/${training.id}/comments/`

        return ProxyService.post(url, {
                "user_id": userID,
                "content": content,
            },
            token
        )
    }

    static async postCommentFile(training, comment, file, token) {
        let url = `/workout_manager/trainings/${training.id}/comments/${comment.id}/files/`
        const format = file.uri.split('.').pop()
        
        let formData = new FormData();
        formData.append("file", {
            uri: file.uri,
            name: `comment_${comment.id}.${format}`,
            type: `application/${format}`,

        });
        return ProxyService.post(url, formData, token, true)
    }


}

export default CommentService;