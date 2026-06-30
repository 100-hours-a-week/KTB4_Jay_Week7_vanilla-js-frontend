// 회원가입 함수
async function signup() {
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const nickname = signupNicknameInput.value;

  // 회원가입 요청 보내기 전에 프론트에서 먼저 형식 검사를 함
  if (!validateSignupForm()) {
    showMessage("회원가입 정보를 다시 확인하세요.", "error");
    return;
  }

  // 프로필 사진은 선택사항이니깐 없으면 기본 이미지 key를 서버에 보냄
  // 사진이 있으면 실제 이미지는 localStorage에 저장하고 서버에는 key만 보냄
  const profileImageKey = signupProfileImage.trim() === ""
    ? DEFAULT_PROFILE_IMAGE_KEY
    : "signup-profile-image-" + email.trim();

  const body = {
    email: email.trim(),
    password: password,
    nickname: nickname.trim(),
    profileImage: profileImageKey
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/users/register",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "회원가입에 실패했습니다.");
      throw new Error(message);
    }

    // 실제 이미지 문자열은 길어서 DB에 바로 넣지 않고 브라우저 저장소에 저장
    if (signupProfileImage.trim() !== "") {
      localStorage.setItem(profileImageKey, signupProfileImage);
    }

    signupEmailInput.value = "";
    signupPasswordInput.value = "";
    signupPasswordCheckInput.value = "";
    signupNicknameInput.value = "";
    resetSignupProfileImage();
    clearSignupErrors();

    showMessage("회원가입이 완료되었습니다. 로그인해주세요.", "success");
    showSection("login");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 회원가입 입력값이 조건에 맞는지 확인하는 함수
// 하나라도 조건이 안 맞으면 false를 반환해서 회원가입 요청을 막음
function validateSignupForm() {
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value;
  const passwordCheck = signupPasswordCheckInput.value;
  const nickname = signupNicknameInput.value.trim();
  let valid = true;

  clearSignupErrors();

  if (!isValidEmail(email)) {
    setFieldError(signupEmailError, signupEmailInput, "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
    valid = false;
  }

  if (!isValidPassword(password)) {
    setFieldError(signupPasswordError, signupPasswordInput, "* 비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
    valid = false;
  }

  if (passwordCheck.trim() === "") {
    setFieldError(signupPasswordCheckError, signupPasswordCheckInput, "* 비밀번호 확인을 입력해주세요.");
    valid = false;
  } else if (password !== passwordCheck) {
    setFieldError(signupPasswordCheckError, signupPasswordCheckInput, "* 비밀번호가 다릅니다.");
    valid = false;
  }

  if (nickname === "") {
    setFieldError(signupNicknameError, signupNicknameInput, "* 닉네임을 입력해주세요.");
    valid = false;
  } else if (nickname.length > 10) {
    setFieldError(signupNicknameError, signupNicknameInput, "* 닉네임은 최대 10자까지 작성 가능합니다.");
    valid = false;
  }

  return valid;
}

// 이메일 형식인지 정규식으로 확인하는 함수
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 비밀번호가 소문자, 숫자, 특수문자를 포함하고 8~20자인지 확인하는 함수
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(password);
}

// 검증 실패 시 빨간 문구랑 input 에러 스타일을 같이 넣어주는 함수
function setFieldError(errorElement, inputElement, message) {
  errorElement.textContent = message;

  if (inputElement !== null) {
    inputElement.classList.add("input-error");
  }
}

// 회원가입 검증 문구와 빨간 테두리를 전부 초기화하는 함수
function clearSignupErrors() {
  signupProfileImageError.textContent = "";
  signupEmailError.textContent = "";
  signupPasswordError.textContent = "";
  signupPasswordCheckError.textContent = "";
  signupNicknameError.textContent = "";

  signupEmailInput.classList.remove("input-error");
  signupPasswordInput.classList.remove("input-error");
  signupPasswordCheckInput.classList.remove("input-error");
  signupNicknameInput.classList.remove("input-error");
}

// 회원가입에서 프로필 사진을 선택했을 때 미리보기로 바꿔주는 함수
function readSignupProfileImage(file) {
  if (!file) {
    resetSignupProfileImage();
    return;
  }

  if (!file.type.startsWith("image/")) {
    setFieldError(signupProfileImageError, null, "* 이미지 파일만 선택할 수 있습니다.");
    resetSignupProfileImage();
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    signupProfileImage = String(reader.result);
    signupProfilePreview.src = signupProfileImage;
    signupProfilePreview.classList.remove("hidden");
    signupProfilePlus.classList.add("hidden");
    signupProfileImageError.textContent = "";
  };

  reader.onerror = function () {
    setFieldError(signupProfileImageError, null, "* 프로필 사진을 읽지 못했습니다.");
  };

  reader.readAsDataURL(file);
}

// 회원가입 프로필 사진 선택 상태를 처음 상태로 돌리는 함수
function resetSignupProfileImage() {
  signupProfileImage = "";
  signupProfileImageInput.value = "";
  signupProfilePreview.src = "";
  signupProfilePreview.classList.add("hidden");
  signupProfilePlus.classList.remove("hidden");
}

// 로그인 함수
async function login() {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  if (email.trim() === "" || password.trim() === "") {
    showMessage("이메일과 비밀번호를 입력하세요.", "error");
    return;
  }

  const body = {
    email: email,
    password: password
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/users/login",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "로그인에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();

    currentUserId = Number(result.data.userId ?? result.data.user_id ?? result.data.id);
    accessToken = result.data.accessToken ?? result.data.access_token ?? null;

    localStorage.setItem("userId", currentUserId);

    if (accessToken !== null) {
      localStorage.setItem("accessToken", accessToken);
    }

    loginEmailInput.value = "";
    loginPasswordInput.value = "";

    renderLoginStatus();
    // 로그인 후 닉네임과 프로필 이미지를 보여주기 위해 현재 회원정보도 불러옴
    loadCurrentUser(false, null);
    showMessage("로그인했습니다.", "success");
    loadPosts(0);
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 로그아웃 함수
function logout() {
  currentUserId = null;
  accessToken = null;
  currentUser = null;
  selectedProfileImage = "";
  selectedProfileImageChanged = false;

  // 브라우저에 저장된 로그인 정보도 같이 지워야 새로고침해도 로그아웃 상태가 됨
  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");

  renderLoginStatus();
  showMessage("로그아웃했습니다.", "success");
  showSection("list");
}

// 현재 로그인한 회원정보 조회 함수
// 백엔드에 단건 조회가 없어서 목록에서 현재 userId와 같은 사용자를 찾음
// 조회, 수정 페이지 화면 갱신해줌 renderProfileView 랑 Edit이랑
async function loadCurrentUser(showSuccessMessage = true, nextSection = "profileView") {
  if (!requireLogin()) {
    return;
  }

  try {
    const response = await fetch(API_BASE_URL + "/users");

    if (!response.ok) {
      const message = await getErrorMessage(response, "회원정보 조회에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();
    const users = result.data ?? [];
    const user = users.find(function (item) {
      return Number(item.userId) === currentUserId && item.deleted !== true;
    });

    if (!user) {
      throw new Error("회원정보를 찾을 수 없습니다.");
    }

    // 찾은 회원정보를 저장하고 프로필 관련 화면들을 같이 갱신
    currentUser = user;
    renderLoginStatus();
    renderProfileView(user);
    renderProfileEdit(user);

    if (nextSection === "profileEdit") {
      showSection("profileEdit");
    } else if (nextSection === "profileView") {
      showSection("profileView");
    }

    if (showSuccessMessage === true) {
      showMessage("회원정보를 불러왔습니다.", "success");
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 회원정보 수정 함수
async function updateProfile() {
  if (!requireLogin()) {
    return;
  }

  const nickname = profileNicknameInput.value;

  if (nickname.trim() === "") {
    showMessage("닉네임을 입력하세요.", "error");
    return;
  }

  if (selectedProfileImage.trim() === "") {
    showMessage("프로필 이미지를 선택하세요.", "error");
    return;
  }

  let profileImageKey = selectedProfileImage;

  // 새 이미지를 선택했으면 실제 이미지는 localStorage에 저장하고 서버에는 짧은 key만 보냄
  if (selectedProfileImageChanged || selectedProfileImage.startsWith("data:image/")) {
    profileImageKey = "local-profile-image-" + currentUserId;
    localStorage.setItem(profileImageKey, selectedProfileImage);
  }

  const body = {
    userId: currentUserId,
    nickname: nickname,
    profileImage: profileImageKey
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/users/me",
      getJsonOptions("PATCH", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "회원정보 수정에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();
    currentUser = {
      ...(currentUser ?? {}),
      userId: currentUserId,
      nickname: result.data?.nickname ?? nickname,
      profileImage: result.data?.profileImage ?? profileImageKey
    };
    // 저장이 끝났으니깐 현재 선택 이미지 상태도 서버에 저장된 key 기준으로 정리
    selectedProfileImage = currentUser.profileImage;
    selectedProfileImageChanged = false;

    renderLoginStatus();
    renderProfileView(currentUser);
    renderProfileEdit(currentUser);
    showMessage("회원정보를 수정했습니다.", "success");
    showSection("profileView");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 비밀번호 변경 함수
async function updatePassword() {
  if (!requireLogin()) {
    return;
  }

  const newPassword = profilePasswordInput.value;
  const newPasswordCheck = profilePasswordCheckInput.value;

  // 비밀번호 변경도 회원가입이랑 같은 규칙으로 먼저 검사
  if (!validateProfilePasswordForm()) {
    showMessage("비밀번호 변경 정보를 다시 확인하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    newPassword: newPassword,
    newPasswordCheck: newPasswordCheck
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/users/me/password",
      getJsonOptions("PATCH", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "비밀번호 변경에 실패했습니다.");
      throw new Error(message);
    }

    profilePasswordInput.value = "";
    profilePasswordCheckInput.value = "";
    clearProfilePasswordErrors();
    showMessage("비밀번호를 변경했습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 회원정보 수정 화면에서 새 비밀번호 조건을 확인하는 함수
function validateProfilePasswordForm() {
  const newPassword = profilePasswordInput.value;
  const newPasswordCheck = profilePasswordCheckInput.value;
  let valid = true;

  clearProfilePasswordErrors();

  if (!isValidPassword(newPassword)) {
    setFieldError(profilePasswordError, profilePasswordInput, "* 비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
    valid = false;
  }

  if (newPasswordCheck.trim() === "") {
    setFieldError(profilePasswordCheckError, profilePasswordCheckInput, "* 비밀번호 확인을 입력해주세요.");
    valid = false;
  } else if (newPassword !== newPasswordCheck) {
    setFieldError(profilePasswordCheckError, profilePasswordCheckInput, "* 비밀번호가 다릅니다.");
    valid = false;
  }

  return valid;
}

// 비밀번호 변경 검증 문구와 빨간 테두리를 초기화하는 함수
function clearProfilePasswordErrors() {
  profilePasswordError.textContent = "";
  profilePasswordCheckError.textContent = "";
  profilePasswordInput.classList.remove("input-error");
  profilePasswordCheckInput.classList.remove("input-error");
}

// 회원 탈퇴 함수
async function deleteUser() {
  if (!requireLogin()) {
    return;
  }

  const confirmed = confirm("정말 회원 탈퇴하시겠습니까?");

  if (!confirmed) {
    return;
  }

  const body = {
    userId: currentUserId
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/users/me",
      getJsonOptions("DELETE", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "회원 탈퇴에 실패했습니다.");
      throw new Error(message);
    }

    logout();
    showMessage("회원 탈퇴가 완료되었습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 선택한 프로필 이미지를 문자열로 읽어서 미리보기와 수정 요청에 사용
function readProfileImage(file) {
  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showMessage("이미지 파일만 선택할 수 있습니다.", "error");
    profileImageInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    selectedProfileImage = String(reader.result);
    selectedProfileImageChanged = true;
    profileEditPreview.src = selectedProfileImage;
  };

  reader.onerror = function () {
    showMessage("프로필 이미지를 읽지 못했습니다.", "error");
  };

  reader.readAsDataURL(file);
}
