// ==============================
// 공통 화면 이동 이벤트
// ==============================

homeTitleButton.addEventListener("click", function () {
 clearMessage();
 loadPosts(0);
});


// ==============================
// 로그인 / 회원가입 이벤트
// ==============================

goSignupButton.addEventListener("click", function () {
  clearMessage();
  showSection("signup");
  resetSignupTouched();
  clearSignupErrors();
  validateSignupForm();
});

showPasswordEditButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  showSection("passwordEdit");
});


connectLoginValidation(loginEmailInput, "email");
connectLoginValidation(loginPasswordInput, "password");

showListLoginButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  showSection("login");
  validateLoginInputs();
});

signupButton.addEventListener("click", function () {
  signup();
});

signupBackButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
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

connectSignupValidation(signupEmailInput, "email");
connectSignupValidation(signupPasswordInput, "password");
connectSignupValidation(signupPasswordCheckInput, "passwordCheck");
connectSignupValidation(signupNicknameInput, "nickname");

loginButton.addEventListener("click", function () {
  login();
});

cancelSignupButton.addEventListener("click", function () {
  clearMessage();
  resetLoginTouched();
  clearLoginErrors();
  resetSignupTouched();
  clearSignupErrors();
  showSection("login");
});

// ==============================
// 프로필 / 회원정보 이벤트
// ==============================
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

// 회원 탈퇴 버튼을 누르면 바로 삭제하지 않고 확인 모달을 먼저 보여줌
deleteUserButton.addEventListener("click", function () {
  profileDropdown.classList.add("hidden");
  openDeleteUserModal();
});

cancelDeleteUserButton.addEventListener("click", function () {
  closeDeleteUserModal();
});

confirmDeleteUserButton.addEventListener("click", function () {
  deleteUser();
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

logoutButton.addEventListener("click", function () {
  logout();
});

// ==============================
// 게시글 목록 / 작성 이벤트
// ==============================
showCreateButton.addEventListener("click", function () {
  if (!requireLogin()) {
    return;
  }

  clearMessage();
  showSection("create");
});

cancelCreateButton.addEventListener("click", function () {
  clearMessage();
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

// ==============================
// 게시글 상세 / 수정 / 신고 이벤트
// ==============================
backToListButton.addEventListener("click", function () {
  clearMessage();
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

reportPostButton.addEventListener("click", function () {
  reportPost();
});

// ==============================
// 댓글 이벤트
// ==============================
createCommentButton.addEventListener("click", function () {
  createComment();
});

// ==============================
// 새로고침 후 처음 실행되는 코드
// ==============================
renderLoginStatus();
// 만약 현재 아이디가 null이 아니라면 현재 CurrentUser를 로드하세요
if (currentUserId !== null) {
  loadCurrentUser(false, null);
}

validateLoginInputs();
showSection("login");
setTimeout(function () {
  validateLoginInputs();
}, 300);

// 로그인 input마다 같은 검증 이벤트를 붙이기 위해 만든 함수
function connectLoginValidation(inputElement, touchedKey) {
  inputElement.addEventListener("focus", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });

  inputElement.addEventListener("click", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });

  inputElement.addEventListener("input", function () {
    loginTouched[touchedKey] = true;
    validateLoginInputs();
  });
}

// 회원가입 input마다 같은 검증 이벤트를 붙이기 위해 만든 함수
function connectSignupValidation(inputElement, touchedKey) {
  inputElement.addEventListener("focus", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });

  inputElement.addEventListener("click", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });

  // 회원가입 입력값은 입력할 때마다 다시 검사해서 빨간 문구를 바로 갱신
  inputElement.addEventListener("input", function () {
    signupTouched[touchedKey] = true;
    validateSignupForm();
  });
}
