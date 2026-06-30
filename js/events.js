// 버튼 이벤트 연결
if (homeTitleButton !== null) {
  homeTitleButton.addEventListener("click", function () {
    loadPosts(0);
  });
}

if (goSignupButton !== null) {
  goSignupButton.addEventListener("click", function () {
    showSection("signup");
    resetSignupTouched();
    clearSignupErrors();
    validateSignupForm();
  });
}

if (showPasswordEditButton !== null) {
  showPasswordEditButton.addEventListener("click", function () {
    profileDropdown.classList.add("hidden");
    showSection("passwordEdit");
  });
}

loginEmailInput.addEventListener("input", function () {
  validateLoginInputs();
});

loginPasswordInput.addEventListener("input", function () {
  validateLoginInputs();
});

// 오른쪽 위 프로필 동그라미를 누르면 메뉴가 열리고 닫히게 하는 이벤트
profileToggleButton.addEventListener("click", function () {
  profileDropdown.classList.toggle("hidden");
});


// 회원정보 수정 메뉴를 누르면 최신 회원정보를 불러오고 수정 화면으로 이동
showProfileEditButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  loadCurrentUser(true, "profileEdit");
});

// 회원정보 보기 화면 안에 있는 수정하기 버튼 이벤트
profileViewEditButton.addEventListener("click", function () {
  loadCurrentUser(false, "profileEdit");
});

// 회원 탈퇴 메뉴를 누르면 탈퇴 함수 실행
deleteUserButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  deleteUser();
});

showListButton.addEventListener("click", function () {
  loadPosts(currentPage);
});

showCreateButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  showSection("create");
});

signupButton.addEventListener("click", function () {
  signup();
});

signupBackButton.addEventListener("click", function () {
  resetSignupTouched();
  clearSignupErrors();
  showSection("login");
});

signupProfileImageInput.addEventListener("click", function () {
  signupTouched.profileImage = true;
  validateSignupForm();
});

// 회원가입 프로필 사진을 선택하면 미리보기로 보여줌
signupProfileImageInput.addEventListener("change", function () {
  readSignupProfileImage(signupProfileImageInput.files[0]);
});

signupEmailInput.addEventListener("focus", function () {
  signupTouched.email = true;
  validateSignupForm();
});

signupEmailInput.addEventListener("click", function () {
  signupTouched.email = true;
  validateSignupForm();
});

// 회원가입 입력값은 입력할 때마다 다시 검사해서 빨간 문구를 바로 갱신
signupEmailInput.addEventListener("input", function () {
  signupTouched.email = true;
  validateSignupForm();
});

signupPasswordInput.addEventListener("focus", function () {
  signupTouched.password = true;
  validateSignupForm();
});

signupPasswordInput.addEventListener("click", function () {
  signupTouched.password = true;
  validateSignupForm();
});

signupPasswordInput.addEventListener("input", function () {
  signupTouched.password = true;
  validateSignupForm();
});

signupPasswordCheckInput.addEventListener("focus", function () {
  signupTouched.passwordCheck = true;
  validateSignupForm();
});

signupPasswordCheckInput.addEventListener("click", function () {
  signupTouched.passwordCheck = true;
  validateSignupForm();
});

signupPasswordCheckInput.addEventListener("input", function () {
  signupTouched.passwordCheck = true;
  validateSignupForm();
});

signupNicknameInput.addEventListener("focus", function () {
  signupTouched.nickname = true;
  validateSignupForm();
});

signupNicknameInput.addEventListener("click", function () {
  signupTouched.nickname = true;
  validateSignupForm();
});

signupNicknameInput.addEventListener("input", function () {
  signupTouched.nickname = true;
  validateSignupForm();
});

loginButton.addEventListener("click", function () {
  login();
});

logoutButton.addEventListener("click", function () {
  logout();
});

cancelSignupButton.addEventListener("click", function () {
  resetSignupTouched();
  clearSignupErrors();
  showSection("login");
});

profileImageInput.addEventListener("change", function () {
  readProfileImage(profileImageInput.files[0]);
});


// 회원정보 수정 완료 버튼 이벤트
updateProfileButton.addEventListener("click", function () {
  updateProfile();
});

// 비밀번호 변경 버튼 이벤트
updatePasswordButton.addEventListener("click", function () {
  updatePassword();
});

// 비밀번호 변경 입력값도 입력할 때마다 다시 검사
profilePasswordInput.addEventListener("input", function () {
  validateProfilePasswordForm();
});

profilePasswordCheckInput.addEventListener("input", function () {
  validateProfilePasswordForm();
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
if (currentUserId !== null) {
  loadCurrentUser(false, null);
}

validateLoginInputs();
showSection("login");
setTimeout(function () {
  validateLoginInputs();
}, 300);