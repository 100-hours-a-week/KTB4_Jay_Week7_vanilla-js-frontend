// 댓글 목록을 화면에 그리는 함수
function renderComments(comments) {
  commentList.innerHTML = "";

  if (!comments || comments.length === 0) {
    commentList.textContent = "댓글이 없습니다.";
    return;
  }

  comments.forEach(function (comment) {
    const commentItem = createCommentElement(comment, false);
    commentList.appendChild(commentItem);
  });
}

// 댓글 또는 대댓글 하나를 만드는 함수
function createCommentElement(comment, isReply) {
  const commentItem = document.createElement("div");
  commentItem.classList.add("comment-item");

  if (isReply === true) {
    commentItem.classList.add("reply-item");
  }

  if (comment.deleted === true) {
    commentItem.classList.add("deleted");
  }

  const meta = document.createElement("div");
  meta.classList.add("comment-meta");
  meta.textContent =
    (comment.authorNickname ?? "알 수 없음") + " · " + formatDate(comment.createdAt);

  const content = document.createElement("p");
  content.textContent = comment.content ?? "";

  commentItem.appendChild(meta);
  commentItem.appendChild(content);

  const commentAuthorId = Number(comment.authorId ?? comment.userId);

  // 삭제되지 않은 댓글이고, 현재 로그인 사용자가 댓글 작성자일 때만 삭제 버튼 보여주기
  if (comment.deleted !== true && commentAuthorId === currentUserId) {
    const buttonRow = document.createElement("div");
    buttonRow.classList.add("comment-button-row");

    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    deleteButton.classList.add("danger");
    deleteButton.textContent = "삭제";
    editButton.classList.add("secondary");
    editButton.textContent = "수정";


    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteComment(comment.commentId);
    });

    editButton.addEventListener("click", function(){
        showCommentEditForm(commentItem, comment);
    })
    
    buttonRow.appendChild(editButton);
    buttonRow.appendChild(deleteButton);
    commentItem.appendChild(buttonRow);
  }

  // 대댓글이 있으면 아래에 렌더링
  if (comment.replies && comment.replies.length > 0) {
    const replyList = document.createElement("div");
    replyList.classList.add("reply-list");

    comment.replies.forEach(function (reply) {
      const replyItem = createCommentElement(reply, true);
      replyList.appendChild(replyItem);
    });

    commentItem.appendChild(replyList);
  }

  return commentItem;
}

// 댓글 작성 함수
async function createComment() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("댓글을 작성할 게시글이 없습니다.", "error");
    return;
  }

  const comment = commentInput.value;

  if (comment.trim() === "") {
    showMessage("댓글 내용을 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    comment: comment
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/" + currentPostId + "/comments",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "댓글 작성에 실패했습니다.");
      throw new Error(message);
    }

    commentInput.value = "";

    showMessage("댓글을 작성했습니다.", "success");
    loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 댓글 삭제 함수
async function deleteComment(commentId) {
  if (!requireLogin()) {
    return;
  }

  const confirmed = confirm("댓글을 삭제하시겠습니까?");

  if (!confirmed) {
    return;
  }

  const body = {
    userId: currentUserId
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/comments/" + commentId,
      getJsonOptions("DELETE", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "댓글 삭제에 실패했습니다.");
      throw new Error(message);
    }

    showMessage("댓글을 삭제했습니다.", "success");
    loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 댓글 수정 버튼을 눌렀을 때 수정 입력창을 보여주는 함수
function showCommentEditForm(commentItem, comment) {
  // 이미 수정 폼이 열려 있으면 다시 누를 때 닫기
  const oldForm = commentItem.querySelector(".comment-edit-form");

  if (oldForm !== null) {
    oldForm.remove();
    return;
  }

  // 수정 폼 div 만들기
  const editForm = document.createElement("div");
  editForm.classList.add("comment-edit-form");

  // 수정할 내용을 입력할 input 만들기
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = "";
  editInput.placeholder = "수정할 댓글 내용을 입력하세요";

  // 수정 완료 버튼 만들기
  const submitButton = document.createElement("button");
  submitButton.textContent = "수정 완료";

  submitButton.addEventListener("click", function () {
    updateComment(comment.commentId, editInput.value);
  });

  // 취소 버튼 만들기
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "취소";

  cancelButton.addEventListener("click", function () {
    editForm.remove();
  });

  // 수정 폼 안에 input, 수정 완료 버튼, 취소 버튼 넣기
  editForm.appendChild(editInput);
  editForm.appendChild(submitButton);
  editForm.appendChild(cancelButton);

  // 댓글 박스 아래에 수정 폼 붙이기
  commentItem.appendChild(editForm);
}
// 댓글 수정 함수
async function updateComment(commentId, comment) {
  if (!requireLogin()) {
    return;
  }

  if (comment.trim() === "") {
    showMessage("수정할 댓글 내용을 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    comment: comment
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/comments/" + commentId,
      getJsonOptions("PATCH", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "댓글 수정에 실패했습니다.");
      throw new Error(message);
    }
    showMessage("댓글을 수정했습니다.", "success");
    loadPostDetail(currentPostId, false);
    
    
  } catch (error) {
    showMessage(error.message, "error");
  }
}