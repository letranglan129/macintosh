module.exports = function (comments, users) {

    return comments.map(comment => {
        var user = users.find((user) => user._id == comment.userId)
        user = user[user.type]

        var date = new Date(comment.updatedAt)
        var day = `${date.toLocaleDateString()}`

        return `<div class="comment-item" id="${comment._id}">
        <div class="avatar">
            <img loading="lazy" src="${user.avatar}" width="40px" height="40px" class="rounded-circle">
        </div>
        <div class="info-comment w-100">
            <div>
            <div class="name">
                <span class="text-name no-hover">${user.username}</span>
                <span class="time">${day}</span>
            </div>
            <div class="comment-text">
                <p>${comment.cmtString}</p>
            </div>
            <div class="like-reply">
                <span class="like"><i class="bi bi-hand-thumbs-up"></i><span class="amount">${comment.liked}</span></span>
                <span class="reply"><i class="bi bi-chat-dots"></i> Trả lời</span>
            </div>
            </div>
            <div class="comment-replied"></div>
        </div>
    </div>`
    }).join('')
}