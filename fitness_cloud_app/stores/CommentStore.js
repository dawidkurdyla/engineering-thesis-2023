import { makeObservable, observable, computed, action, flow, runInAction } from "mobx"

import CommentService from "../services/CommentService"

class CommentStore {
    commentList = [];
    newComment= '';
    refreshing = false;
    commentMediaFile = null;

    constructor() {
        makeObservable(this, {
            commentList: observable,
            refreshing: observable,
            newComment: observable,
            commentMediaFile: observable,
            setCommentList: action,
            setCommentMediaFile: action,
            setNewComment: action,
            setRefreshing: action,
        })
    }

    // --- Set Functions ---//

    setCommentList(commentList) {
        this.commentList = commentList
    }

    setRefreshing(value) {
        this.refreshing = value;
    }

    setNewComment(value) {
        this.newComment = value;
    }

    setCommentMediaFile(file) {
        this.commentMediaFile = file;
    }


    // --- Load Functions ---//

    async loadCommentList(training, token) {
        try {
            this.setRefreshing(true);
            const commentList = await CommentService.getCommentList(training, token);
            runInAction(() => {
                this.setCommentList(commentList);
                this.setRefreshing(false);
            })

        } catch (e) {
            console.log(e);
        }
    }

    async sendComment(userID, training, token) {
        try {
            this.setRefreshing(true);
            const postedComment = await CommentService.postComment(userID, training, this.newComment, token);
            if (this.commentMediaFile){
                await CommentService.postCommentFile(training, postedComment, this.commentMediaFile, token)
            }
            runInAction(() => {
                this.loadCommentList(training, token);
                this.setNewComment('');
                this.setCommentMediaFile(null);
            })
        } catch (e) {
            console.log(e);
        }
    }

}

export default CommentStore = new CommentStore();