// 회원가입 함수
async function signup() {
  const email = signupEmailInput.value;
  const password = signupPasswordInput.value;
  const nickname = signupNicknameInput.value;

  if (email.trim() === "" || password.trim() === "" || nickname.trim() === "") {
    showMessage("회원가입 정보를 모두 입력하세요.", "error");
    return;
  }

  const body = {
    email: email,
    password: password,
    nickname: nickname
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

    signupEmailInput.value = "";
    signupPasswordInput.value = "";
    signupNicknameInput.value = "";

    showMessage("회원가입이 완료되었습니다. 로그인해주세요.", "success");
    showSection("login");
  } catch (error) {
    showMessage(error.message, "error");
  }
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

  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");

  renderLoginStatus();
  showMessage("로그아웃했습니다.", "success");
  showSection("list");
}