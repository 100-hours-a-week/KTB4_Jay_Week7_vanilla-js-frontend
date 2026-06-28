// 임시저장 함수
async function saveDraft() {
  if (!requireLogin()) {
    return;
  }

  const title = createTitleInput.value;
  const content = createContentInput.value;

  if (title.trim() === "" && content.trim() === "") {
    showMessage("임시저장할 제목이나 내용을 입력하세요.", "error");
    return;
  }

  const body = {
    userId: currentUserId,
    title: title,
    content: content
  };

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/draft",
      getJsonOptions("POST", body)
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "임시저장에 실패했습니다.");
      throw new Error(message);
    }

    draftExists = true;

    showMessage("임시저장했습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

// 임시저장 불러오기 함수
async function loadDraft() {
  if (!requireLogin()) {
    return;
  }

  try {
    const response = await fetch(
      API_BASE_URL + "/posts/draft?userId=" + currentUserId
    );

    if (!response.ok) {
      const message = await getErrorMessage(response, "임시저장 불러오기에 실패했습니다.");
      throw new Error(message);
    }

    const result = await response.json();

    if (!result.data) {
      showMessage("저장된 임시글이 없습니다.", "error");
      return;
    }

    createTitleInput.value = result.data.title ?? "";
    createContentInput.value = result.data.content ?? "";

    draftExists = true;

    showSection("create");
    showMessage("임시저장을 불러왔습니다.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
}