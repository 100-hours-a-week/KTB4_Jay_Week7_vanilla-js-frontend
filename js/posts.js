// 게시글 목록을 서버에서 불러오는 함수
async function loadPosts(page = 0) {
  try {
    const response = await fetch(
      API_BASE_URL + "/posts?page=" + page + "&size=" + pageSize
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "게시글 목록 조회에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();

    // 백엔드가 Page 형태로 응답하므로 게시글 배열은 result.data.content에 있음
    const pageData = result.data;
    const posts = pageData.content;

    // 현재 페이지 번호 저장
    currentPage = pageData.number;

    // 화면에 게시글 목록 출력
    renderPosts(posts);

    // 페이지 정보 출력
    renderPageInfo(pageData);

    showSection("list");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 목록을 화면에 그리는 함수
function renderPosts(posts) {
  // 기존 목록 비우기
  postList.innerHTML = "";

  if (!posts || posts.length === 0) {
    postList.textContent = "게시글이 없습니다.";
    return;
  }

  posts.forEach(function (post) {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    if (post.blinded === true) {
      postCard.classList.add("blinded");
    }

    const title = document.createElement("h3");
    title.textContent = post.title;

    const author = document.createElement("p");
    author.classList.add("post-author");
    author.textContent = getAuthorName(post);

    const counts = document.createElement("p");
    counts.classList.add("post-counts");
    counts.textContent =
      "좋아요 " + (post.likeCount ?? 0) +
      "   댓글 " + (post.commentCount ?? 0) +
      "   조회수 " + (post.viewCount ?? 0);

    const createdAt = document.createElement("p");
    createdAt.classList.add("post-date");
    createdAt.textContent = formatDate(post.createdAt);

    postCard.appendChild(title);
    postCard.appendChild(counts);
    postCard.appendChild(createdAt);
    postCard.appendChild(author);

    // 게시글 카드를 클릭하면 해당 게시글의 상세조회 실행
    // 블라인드 처리된 게시글은 상세조회 클릭 막기
    if (post.blinded !== true) {
    postCard.addEventListener("click", function () {
        loadPostDetail(post.postId);
    });
    } else {
    postCard.style.cursor = "not-allowed";
    }

    postList.appendChild(postCard);
  });
}

// 페이지 정보를 화면에 보여주는 함수
function renderPageInfo(pageData) {
  const current = pageData.number + 1;
  const total = pageData.totalPages === 0 ? 1 : pageData.totalPages;

  pageInfo.textContent = current + " / " + total;

  prevPageButton.disabled = pageData.first;
  nextPageButton.disabled = pageData.last;
}

// 게시글 작성 함수
async function createPost() {
  // 로그인 필요한 기능이니깐 확인
  if (!requireLogin()) {
    return;
  }

  // 제목이랑 내용 받아와서 저장
  const title = createTitleInput.value;
  const content = createContentInput.value;

  if (title.trim() === "") {
    showMessage("제목을 입력하세요.", "error");
    return;
  }

  if (content.trim() === "") {
    showMessage("내용을 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    title: title,
    content: content
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "게시글 작성에 실패했습니다.");
      throw new Error(message);
    }

    createTitleInput.value = "";
    createContentInput.value = "";
    draftExists = false;

    showMessage("게시글을 작성했습니다.", "success");
    loadPosts(0);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 상세조회 함수
async function loadPostDetail(postId, showSuccessMessage = true) {
  try {
    // 현재 백엔드는 상세조회 시 userId를 요구하므로 로그인 안 했을 때는 임시로 1 사용
    const userId = currentUserId ?? 1;

    const response = await fetch(
      API_BASE_URL + "/posts/" + postId + "?userId=" + userId
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "게시글 상세 조회에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();
    const post = result.data;

    currentPostId = post.postId;

    renderPostDetail(post);

    showSection("detail");
    if (showSuccessMessage === true){
        showMessage("게시글 상세를 불러왔습니다.", "success");
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 상세 화면을 그리는 함수
function renderPostDetail(post) {
  detailTitle.textContent = post.title;
  detailAuthor.textContent = "작성자: " + getAuthorName(post);
  detailCreatedAt.textContent = "작성일: " + formatDate(post.createdAt);

  if (post.edited === true) {
    detailEdited.textContent = "수정됨";
  } else {
    detailEdited.textContent = "";
  }

  if (post.blinded === true) {
    detailContent.textContent = "블라인드 처리된 게시글입니다.";
  } else {
    detailContent.textContent = post.content ?? "";
  }

  detailViewCount.textContent = post.viewCount ?? "-";
  detailLikeCount.textContent = post.likeCount ?? "-";
  detailCommentCount.textContent = post.commentCount ?? "-";
  
  currentPostLiked = post.liked === true;
  if (currentPostLiked) {
    likePostButton.textContent = "좋아요 취소";
  } else {
    likePostButton.textContent = "좋아요";
  }
  // 수정 화면으로 넘어갈 때 기존 제목과 내용을 미리 넣어두기
  editTitleInput.value = post.title ?? "";
  editContentInput.value = post.content ?? "";
  // 현재 로그인한 사용자와 게시글 작성자가 같을 때만 수정/삭제 버튼 보여주기
  if (post.userId === currentUserId) {
    showEditButton.classList.remove("hidden");
    deletePostButton.classList.remove("hidden");
  } else {
    showEditButton.classList.add("hidden");
    deletePostButton.classList.add("hidden");
  }
  // 상세조회에 들어올 때마다 신고 입력창은 닫아두기
  reportBox.classList.add("hidden");
  reportReasonInput.value = "";
  renderComments(post.comments);
}

// 게시글 수정 함수
async function updatePost() {
    // 로그인했는지 확인
  if (!requireLogin()) {
    return;
  }


  if (currentPostId === null) {
    showMessage("수정할 게시글이 없습니다.", "error");
    return;
  }

  const title = editTitleInput.value;
  const content = editContentInput.value;

  if (title.trim() === "") {
    showMessage("제목을 입력하세요.", "error");
    return;
  }

  if (content.trim() === "") {
    showMessage("내용을 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    title: title,
    content: content
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/" + currentPostId,
      getJsonOptions("PATCH", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "게시글 수정에 실패했습니다.");
      throw new Error(message);
    }

    showMessage("게시글을 수정했습니다.", "success");
    loadPostDetail(currentPostId);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 삭제 함수
async function deletePost() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("삭제할 게시글이 없습니다.", "error");
    return;
  }

  const confirmed = confirm("정말 삭제하시겠습니까?");

  if (!confirmed) {
    return;
  }

  const body = {
    userId: currentUserId
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/" + currentPostId,
      getJsonOptions("DELETE", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "게시글 삭제에 실패했습니다.");
      throw new Error(message);
    }

    currentPostId = null;

    showMessage("게시글을 삭제했습니다.", "success");
    loadPosts(currentPage);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 좋아요 함수
async function likePost() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("좋아요를 누를 게시글이 없습니다.", "error");
    return;
  }

  const body = {
    userId: currentUserId
  };

  try {
    const method = currentPostLiked ? "DELETE" : "POST";

    const response = await fetch(
      API_BASE_URL + "/posts/" + currentPostId + "/likes",
      getJsonOptions(method, body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "좋아요 처리에 실패했습니다.");
      throw new Error(message);
    }

    if (currentPostLiked) {
      showMessage("좋아요를 취소했습니다.", "success");
    } else {
      showMessage("좋아요를 눌렀습니다.", "success");
    }

    loadPostDetail(currentPostId, false);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 게시글 신고 함수
async function reportPost() {
  if (!requireLogin()) {
    return;
  }

  if (currentPostId === null) {
    showMessage("신고할 게시글이 없습니다.", "error");
    return;
  }

  const reason = reportReasonInput.value;

  if (reason.trim() === "") {
    showMessage("신고 사유를 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    reason: reason
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/" + currentPostId + "/reports",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "신고에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();

    reportReasonInput.value = "";
    reportBox.classList.add("hidden");

    
    if (result.data && result.data.blinded === true){
        showMessage("신고 누적으로 블라인드 처리되었습니다.", "success");
        loadPosts(0);
        return;
    } 

    showMessage("신고가 접수되었습니다.", "success");
    loadPostDetail(currentPostId, false);
    
    
  } catch (error) {
    showMessage(error.message, "error");
  }
}
