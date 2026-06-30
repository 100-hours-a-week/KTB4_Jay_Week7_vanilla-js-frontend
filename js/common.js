// 보여지는 화면 설정하기 
// 1. 처음에 모든 화면 hidden 설정 (클래스 추가를 통해)
// 2. 보고 싶은 화면만 hidden 제거
function showSection(sectionName) {
  loginSection.classList.add("hidden");
  signupSection.classList.add("hidden");
  profileViewSection.classList.add("hidden");
  profileEditSection.classList.add("hidden");
  postListSection.classList.add("hidden");
  postCreateSection.classList.add("hidden");
  postDetailSection.classList.add("hidden");
  postEditSection.classList.add("hidden");

  if (sectionName === "login") {
    loginSection.classList.remove("hidden");
  }

  if (sectionName === "signup") {
    signupSection.classList.remove("hidden");
  }

  if (sectionName === "profileView") {
    profileViewSection.classList.remove("hidden");
  }

  if (sectionName === "profileEdit") {
    profileEditSection.classList.remove("hidden");
  }

  if (sectionName === "list") {
    postListSection.classList.remove("hidden");
  }

  if (sectionName === "create") {
    postCreateSection.classList.remove("hidden");
  }

  if (sectionName === "detail") {
    postDetailSection.classList.remove("hidden");
  }

  if (sectionName === "edit") {
    postEditSection.classList.remove("hidden");
  }
}

// showMessage 함수를 통해 성공, 실패 시에 globalMessage 안에 클래스를 추가하였습니다.
// 추가 하기 전에 깔끔하게 비워줘야 확실히 표시가 됩니다. 
function showMessage(message, type) {
  globalMessage.classList.remove("success");
  globalMessage.classList.remove("error");

  if (message === "already_reported") {
    globalMessage.textContent = "해당 게시글은 이미 신고하셨습니다.";
  } else {
    globalMessage.textContent = message;
  }

  if (type === "success") {
    globalMessage.classList.add("success");
  }

  if (type === "error") {
    globalMessage.classList.add("error");
  }
}

// 로그인 상태 위에 출력해주는 함수
function renderLoginStatus() {
  if (currentUserId === null) {
    loginStatusText.textContent = "로그인하지 않았습니다.";

    showLoginButton.classList.remove("hidden");
    showSignupButton.classList.remove("hidden");
    profileMenu.classList.add("hidden");
    profileDropdown.classList.add("hidden");
    profileToggleImage.src = DEFAULT_PROFILE_IMAGE;
    logoutButton.classList.add("hidden");

    return;
  }

  const userLabel = currentUser?.nickname ?? currentUserId + "번 유저";
  loginStatusText.textContent = userLabel + "로 로그인 중입니다.";

  showLoginButton.classList.add("hidden");
  showSignupButton.classList.add("hidden");
  profileMenu.classList.remove("hidden");
  renderProfileToggleImage(currentUser);
  logoutButton.classList.remove("hidden");
}

// 로그인 필요한지 확인하는 함수
function requireLogin() {
  if (currentUserId === null) {
    showMessage("로그인이 필요합니다.", "error");
    showSection("login");
    return false;
  }

  return true;
}

// JSON으로 변경해주는 함수
function getJsonOptions(method, body) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (accessToken !== null) {
    headers["Authorization"] = "Bearer " + accessToken;
  }

  return {
    method: method,
    headers: headers,
    body: JSON.stringify(body)
  };
}

// 서버가 내려준 에러 메시지를 꺼내는 함수
// 실패 응답 body에 message가 있으면 그걸 사용하고, 없으면 기본 메시지를 사용
async function getErrorMessage(response, fallbackMessage) {
  try {
    const errorResult = await response.json();
    return errorResult.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
}

// 작성자 이름을 상황에 따라 다르게 보여주는 함수
function getAuthorName(post) {
  if (post.blinded === true) {
    return "블라인드 처리된 사용자입니다.";
  }

  if (post.authorDeleted === true) {
    return "알 수 없음";
  }

  return post.authorNickname ?? "알 수 없음";
}

// 날짜 형식을 보기 좋게 바꿔주는 함수
function formatDate(dateText) {
  if (!dateText) {
    return "";
  }

  return dateText.replace("T", " ").slice(0, 19);
}

// 프로필 이미지를 화면에 보여줄 수 있는 주소로 바꿔주는 함수
// 서버에는 이미지 key만 저장되어 있을 수 있으니깐 localStorage에서 실제 이미지를 찾아줌
function getProfileImageUrl(profileImage) {
  if (!profileImage || profileImage.trim() === "") {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (profileImage === DEFAULT_PROFILE_IMAGE_KEY) {
    return DEFAULT_PROFILE_IMAGE;
  }

  if (profileImage.startsWith("local-profile-image-") || profileImage.startsWith("signup-profile-image-")) {
    return localStorage.getItem(profileImage) || DEFAULT_PROFILE_IMAGE;
  }

  return profileImage;
}

// 회원정보 보기 화면에 현재 사용자 정보를 넣어주는 함수
function renderProfileView(user) {
  profileViewImage.src = getProfileImageUrl(user.profileImage);
  renderProfileToggleImage(user);
  profileViewUserId.textContent = user.userId ?? "-";
  profileViewEmail.textContent = user.email ?? "-";
  profileViewNickname.textContent = user.nickname ?? "-";
}

// 오른쪽 위 동그라미 프로필에도 같은 이미지가 보여야되니깐 따로 갱신하는 함수
function renderProfileToggleImage(user) {
  profileToggleImage.src = getProfileImageUrl(user?.profileImage);
}

// 회원정보 수정 화면으로 들어갈 때 기존 정보를 미리 넣어주는 함수
// 비밀번호는 보여주면 안되니깐 항상 비워둠
function renderProfileEdit(user) {
  selectedProfileImage = user.profileImage || DEFAULT_PROFILE_IMAGE_KEY;
  selectedProfileImageChanged = false;
  profileEditPreview.src = getProfileImageUrl(selectedProfileImage);
  profileNicknameInput.value = user.nickname ?? "";
  profilePasswordInput.value = "";
  profilePasswordCheckInput.value = "";
  profileImageInput.value = "";
  profilePasswordError.textContent = "";
  profilePasswordCheckError.textContent = "";
  profilePasswordInput.classList.remove("input-error");
  profilePasswordCheckInput.classList.remove("input-error");
}
