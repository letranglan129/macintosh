
var icons = {
    tagEl: 'i',
    old: 'bi-hand-thumbs-up',
    new: 'bi-hand-thumbs-up-fill',
}
function handleComment(type) {

    const sendCommentBtn = document.querySelector('#sendComment')
    const cmtAvatar = document.querySelector('#cmt-avatar')
    const modalValidateBtn = document.querySelector('#modal-validate-btn')
    const modalValidateLogin = document.querySelector('#modal-validate-login')
    const textComment = document.querySelector('#textComment')
    const cmtContext = document.querySelector('#cmt-context')
    var likeBtn = cmtContext.querySelectorAll('.like')
    var replyBtn = cmtContext.querySelectorAll('.reply')
    
    var icons = {
        tagEl: 'i',
        old: 'bi-hand-thumbs-up',
        new: 'bi-hand-thumbs-up-fill',
    }

    function handleReplyBtn(replyBtn) {
        replyBtn.forEach(element => {
            element.onclick = function () {
                if (Object.keys(user).length == 0) {
                    modalValidateBtn.click()
                } else {
                    var commentItem = getParent(element, '.comment-replied')

                    //Get element to insert form
                    if (commentItem == undefined) {
                        commentItem = getParent(element, '.comment-item')
                    }
                    else {
                        commentItem = getParent(commentItem, '.comment-item')
                    }

                    //Insert form input comment
                    var infoComment = commentItem.querySelector('.info-comment')

                    if (!infoComment.querySelector('.user-reply')) {
                        infoComment.innerHTML += `<div action="" class="user-reply">
                                                    <div class="avatar-input">
                                                        <img src="${user.avatar}" onerror="this.src='/img/user-icon.svg'"
                                                            class="me-4" />
                                                        <textarea name="" class="comment-text-input flex-grow-1 flex-shrink-0 flex-md-fill"
                                                            rows="1" placeholder="Nhập bình luận..."></textarea>
                                                        <button class="send-reply mb-0 ms-auto ms-sm-4 mt-2 mt-md-0 btn">Gửi bình
                                                            luận</button>
                                                    </div>
                                                    <p class="form-message text-center d-none">Bạn chưa nhập bình luận</p>
                                                </div>`
                    }
                    var sendReply = commentItem.querySelector('.send-reply')
                    var inputComment = commentItem.querySelectorAll('.comment-text-input')
                    window.scroll(0, sendReply.offsetTop - 100)

                    //Enter to send and clear input
                    inputComment.forEach(element => {
                        element.addEventListener("keydown", function (e) {
                            if (e.key == "Enter") {
                                sendReply.click()
                                setTimeout(function () { element.value = "" }, 0)
                            }
                        })
                    })

                    //Handle click send comment in comment reply
                    sendReply.onclick = function () {
                        var commentTextInput = commentItem.querySelector('.comment-text-input')
                        if (commentTextInput.value.trim() == '')
                            infoComment.querySelector('.user-reply .form-message').classList.remove('d-none')
                        else {
                            infoComment.querySelector('.user-reply .form-message').classList.add('d-none')
                            //Send to comment to server
                            socket.emit('client-reply', {
                                replyId: commentItem.id,
                                cmtString: commentTextInput.value.trim(),
                                userId: userFull._id,
                                appId: type == 'news' ? news._id : app._id,
                                isReply: true,
                            })
                            commentTextInput.value = ''
                        }
                    }

                }

            }
        })
    }
    handleReplyBtn(replyBtn)

    sendCommentBtn.onclick = sendComment

    function sendComment() {
        const userComment = document.querySelector('#user-cmt')

        if (Object.keys(user).length == 0) {
            modalValidateBtn.click()
        } else {
            if (textComment.value.trim() == '')
                userComment.querySelector('.form-message').classList.remove('d-none')
            else {
                userComment.querySelector('.form-message').classList.add('d-none')
                socket.emit('client-send-cmt', {
                    cmtString: textComment.value.trim(),
                    userId: userFull._id,
                    appId: type == 'news' ? news._id : app._id,
                })
                textComment.value = ''
            }
        }
    }

    //Enter to send and clear input
    textComment.addEventListener('keydown', function (e) {
        console.log(this.value)
        if (e.key == "Enter") {
            sendCommentBtn.click()
            setTimeout(function () { textComment.value = "" }, 0)
        }
    })

    //server send comment to client
    //client render comment
    socket.on('server-send-cmt', (data) => {
        var date = new Date(data.comment.updatedAt)
        var day = `${date.toLocaleDateString()}`
        var user = data.user[data.user.type]
        var htmlComment = `<div class="comment-item" id="${data.comment._id}">
                                    <div class="avatar">
                                        <img src="${user.avatar}" width="40px" height="40px" class="rounded-circle">
                                    </div>
                                    <div class="info-comment">
                                        <div>
                                            <div class="name">
                                            <span class="text-name no-hover">${user.username}</span>
                                            <span class="time">${day}</span>
                                            </div>
                                            <div class="comment-text">
                                                <p>${data.comment.cmtString}</p>
                                            </div>
                                            <div class="like-reply">
                                                <span class="like"><i class="bi bi-hand-thumbs-up"></i><span class="amount">${data.comment.liked}</span></span>
                                                <span class="reply"><i class="bi bi-chat-dots"></i> Trả lời</span>
                                            </div>
                                        </div>
                                        <div class="comment-replied">
                                        </div>
                                    </div>
                                </div>`
        cmtContext.innerHTML += htmlComment

        likeBtn = cmtContext.querySelectorAll('.like')
        likeAction(likeBtn)
        replyBtn = cmtContext.querySelectorAll('.reply')
        handleReplyBtn(replyBtn)
    })

    socket.on('server-send-reply', ([data, userReply]) => serverReplyComment([data, userReply]))

    //Render reply
    comments.forEach(comment => {
        if (!comment.isReply) {
            var user = userComment.find((user) => user._id == comment.userId)

            if (user) {
                user = user[user.type]

                var date = new Date(comment.createdAt)
                var day = `${date.toLocaleDateString()}`

                var html = `<div class="comment-item" id="${comment._id}">
                <div class="avatar">
                    <img src="${user.avatar}" width="40px" height="40px" class="rounded-circle">
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
                        <span class="like"><i class="bi bi-hand-thumbs-up"></i><span class="amount">${comment.userLiked.length}</span></span>
                        <span class="reply"><i class="bi bi-chat-dots"></i> Trả lời</span>
                    </div>
                    </div>
                    <div class="comment-replied"></div>
                </div>
            </div>`
                cmtContext.insertAdjacentHTML("beforeend", html)
            }
        }

        likeBtn = cmtContext.querySelectorAll('.like')
        likeAction(likeBtn)
        replyBtn = cmtContext.querySelectorAll('.reply')
        handleReplyBtn(replyBtn)
    })

    if (comments) {
        comments.forEach(comment => serverReplyComment([comment]))
    }

    comments.forEach(comment => {
        var commentEl = document.getElementById(comment._id)
        var likeIcon = commentEl.querySelector('.like i')
        if (comment.userLiked.indexOf(userFull._id) != -1) {
            likeIcon.classList.add(`${icons.new}`)
            likeIcon.classList.remove(`${icons.old}`)
        } else {
            likeIcon.classList.add(`${icons.old}`)
            likeIcon.classList.remove(`${icons.new}`)
        }
    })

    //Reply server send
    function serverReplyComment([comment, userReply]) {
        //Check comment reply
        if (comment.isReply == true) {
            var commentParent = document.getElementById(comment.replyId)
            var replyCmtWrap = commentParent.querySelector('.comment-replied')
            
            //Get user comment
            userComment.push(userReply)
            var user = userComment.find((user) => user._id == comment.userId)
            user = user[user.type]
            //Format time
            var date = new Date(comment.createdAt)
            var day = `${date.toLocaleDateString()}`

            // HTML comment reply and insertHTML
            var html = `<div class="comment-item" id="${comment._id}">
                <div class="avatar">
                <img src="${user.avatar}"
                    width="40px" height="40px" class="rounded-circle" />
                </div>
                <div class="info-comment">
                <div class="name">
                    <span class="text-name no-hover">${user.username}</span>
                    <span class="time">${day}</span>
                </div>
                <div class="comment-text">
                    <p>${comment.cmtString}</p>
                </div>
                <div class="like-reply">
                    <span class="like"><i class="bi bi-hand-thumbs-up"></i><span class="amount">${comment.userLiked.length}</span></span>
                    <span class="reply"><i class="bi bi-chat-dots"></i> Trả lời</span>
                </div>
                </div>
            </div>`
            replyCmtWrap.insertAdjacentHTML("beforeend", html)
        }

        likeBtn = cmtContext.querySelectorAll('.like')
        likeAction(likeBtn)
        replyBtn = cmtContext.querySelectorAll('.reply')
        handleReplyBtn(replyBtn)
    }

    //Handle like comment
    function likeAction(likeBtn) {
        likeBtn.forEach((item) => {
            item.onclick = function (e) {
                //get comment element and comment id
                var likeEl = item.querySelector(icons.tagEl)
                var id = e.target.closest('.comment-item').id
    
                if (Object.keys(user).length == 0) {
                    modalValidateBtn.click()
                } else {
                    if (likeEl.matches(`.${icons.old}`)) {
                        likeEl.classList.remove(icons.old)
                        likeEl.classList.add(icons.new)
                    } else {
                        likeEl.classList.add(icons.old)
                        likeEl.classList.remove(icons.new)
                    }
                    //send to server user liked comment  
                    socket.emit('like-action', { id, userId: userFull._id, like: false })
                }
            }
    
        })
    }
    likeAction(likeBtn)
    socket.on('liked', ({ idComment, userLiked }) => {
        var commentEl = document.getElementById(idComment)
        commentEl.querySelector('.amount').textContent = userLiked.length
    })

    //Handle reply
    replyBtn.forEach((element) => {
        element.onclick = function () {

            if (Object.keys(user).length == 0) {
                modalValidateBtn.click()
            } else {
                var commentItem = getParent(element, '.comment-replied')

                //Get element to insert form
                if (commentItem == undefined) {
                    commentItem = getParent(element, '.comment-item')
                }
                else {
                    commentItem = getParent(commentItem, '.comment-item')
                }

                //Insert form input comment
                var infoComment = commentItem.querySelector('.info-comment')
                infoComment.innerHTML += `<div action="" class="user-reply">
                                            <div class="avatar-input">
                                                <img src="${user.avatar}" onerror="this.src='/img/user-icon.svg'"
                                                    class="me-4" />
                                                <textarea name="" class="comment-text-input flex-grow-1 flex-shrink-0 flex-md-fill"
                                                    rows="1" placeholder="Nhập bình luận..."></textarea>
                                                <button class="send-reply mb-0 ms-auto ms-sm-4 mt-2 mt-md-0 btn">Gửi bình
                                                    luận</button>
                                            </div>
                                            <p class="form-message text-center d-none">Bạn chưa nhập bình luận</p>
                                        </div>`

                var sendReply = commentItem.querySelector('.send-reply')
                var inputComment = commentItem.querySelectorAll('.comment-text-input')
                window.scroll(0, sendReply.offsetTop - 100)

                //Enter to send and clear input
                inputComment.forEach(element => {
                    element.addEventListener("keydown", function (e) {
                        if (e.key == "Enter") {
                            sendReply.click()
                            setTimeout(function () { element.value = "" }, 0)
                        }
                    })
                })

                //Handle click send comment in comment reply
                sendReply.onclick = function () {
                    var commentTextInput = commentItem.querySelector('.comment-text-input')
                    if (commentTextInput.value.trim() == '')
                        infoComment.querySelector('.user-reply .form-message').classList.remove('d-none')
                    else {
                        infoComment.querySelector('.user-reply .form-message').classList.add('d-none')
                        //Send to comment to server
                        socket.emit('client-reply', {
                            replyId: commentItem.id,
                            cmtString: commentTextInput.value.trim(),
                            userId: userFull._id,
                            appId: type == 'news' ? news._id : app._id,
                            isReply: true,
                        })
                        commentTextInput.value = ''
                    }
                }

            }

        }
    })

}

