// 버튼 이벤트 연결
showLoginButton.addEventListener("click", function () {
  showSection("login");
  showMessage("로그인 화면입니다.", "success");
});

showSignupButton.addEventListener("click", function () {
  showSection("signup");
  showMessage("회원가입 화면입니다.", "success");
});

showListButton.addEventListener("click", function () {
  loadPosts(currentPage);
});

showCreateButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  showSection("create");
  showMessage("게시글 작성 화면입니다.", "success");
});

signupButton.addEventListener("click", function () {
  signup();
});

loginButton.addEventListener("click", function () {
  login();
});

logoutButton.addEventListener("click", function () {
  logout();
});

cancelSignupButton.addEventListener("click", function () {
  showSection("list");
});

cancelLoginButton.addEventListener("click", function () {
  showSection("list");
});

cancelCreateButton.addEventListener("click", function () {
  showSection("list");
});

refreshPostsButton.addEventListener("click", function () {
  loadPosts(currentPage);
});

prevPageButton.addEventListener("click", function () {
  if (currentPage > 0) {
    loadPosts(currentPage - 1);
  }
});

nextPageButton.addEventListener("click", function () {
  loadPosts(currentPage + 1);
});

createPostButton.addEventListener("click", function() {
  createPost();
});

saveDraftButton.addEventListener("click", function () {
  saveDraft();
});

loadDraftButton.addEventListener("click", function () {
  loadDraft();
});

backToListButton.addEventListener("click", function () {
  loadPosts(currentPage);
});

showEditButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  showSection("edit");
});
showReportButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  reportBox.classList.toggle("hidden");
});

cancelEditButton.addEventListener("click", function () {
  showSection("detail");
});

updatePostButton.addEventListener("click", function () {
  updatePost();
});

deletePostButton.addEventListener("click", function () {
  deletePost();
});

likePostButton.addEventListener("click", function () {
  likePost();
});

createCommentButton.addEventListener("click", function () {
  createComment();
});

reportPostButton.addEventListener("click", function () {
  reportPost();
});

renderLoginStatus();
loadPosts(0);