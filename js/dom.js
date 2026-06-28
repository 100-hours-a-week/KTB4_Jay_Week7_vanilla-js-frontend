// 여기부터는 html에 있는 요소들을 JS에서 가져오기 위해서 변수에 매핑하는 것
// querySelector로 HTML 문서에서 가져옴
const globalMessage = document.querySelector("#global-message");

const loginSection = document.querySelector("#login-section");
const signupSection = document.querySelector("#signup-section");

const postListSection = document.querySelector("#post-list-section");
const postCreateSection = document.querySelector("#post-create-section");
const postDetailSection = document.querySelector("#post-detail-section");
const postEditSection = document.querySelector("#post-edit-section");

const showListButton = document.querySelector("#show-list-button");
const showCreateButton = document.querySelector("#show-create-button");
const showLoginButton = document.querySelector("#show-login-button");
const showSignupButton = document.querySelector("#show-signup-button");
const logoutButton = document.querySelector("#logout-button");

const loginStatusText = document.querySelector("#login-status-text");

const signupEmailInput = document.querySelector("#signup-email-input");
const signupPasswordInput = document.querySelector("#signup-password-input");
const signupNicknameInput = document.querySelector("#signup-nickname-input");
const signupButton = document.querySelector("#signup-button");
const cancelSignupButton = document.querySelector("#cancel-signup-button");

const loginEmailInput = document.querySelector("#login-email-input");
const loginPasswordInput = document.querySelector("#login-password-input");
const loginButton = document.querySelector("#login-button");
const cancelLoginButton = document.querySelector("#cancel-login-button");

const refreshPostsButton = document.querySelector("#refresh-posts-button");
const postList = document.querySelector("#post-list");

const prevPageButton = document.querySelector("#prev-page-button");
const nextPageButton = document.querySelector("#next-page-button");
const pageInfo = document.querySelector("#page-info");

const createTitleInput = document.querySelector("#create-title-input");
const createContentInput = document.querySelector("#create-content-input");
const createPostButton = document.querySelector("#create-post-button");
const cancelCreateButton = document.querySelector("#cancel-create-button");
const saveDraftButton = document.querySelector("#save-draft-button");
const loadDraftButton = document.querySelector("#load-draft-button");

const detailTitle = document.querySelector("#detail-title");
const detailAuthor = document.querySelector("#detail-author");
const detailCreatedAt = document.querySelector("#detail-created-at");
const detailEdited = document.querySelector("#detail-edited");
const detailContent = document.querySelector("#detail-content");
const detailViewCount = document.querySelector("#detail-view-count");
const detailLikeCount = document.querySelector("#detail-like-count");
const detailCommentCount = document.querySelector("#detail-comment-count");

const backToListButton = document.querySelector("#back-to-list-button");
const showEditButton = document.querySelector("#show-edit-button");
const deletePostButton = document.querySelector("#delete-post-button");
const likePostButton = document.querySelector("#like-post-button");

const editTitleInput = document.querySelector("#edit-title-input");
const editContentInput = document.querySelector("#edit-content-input");
const updatePostButton = document.querySelector("#update-post-button");
const cancelEditButton = document.querySelector("#cancel-edit-button");

const showReportButton = document.querySelector("#show-report-button");
const reportBox = document.querySelector("#report-box");
const reportReasonInput = document.querySelector("#report-reason-input");
const reportPostButton = document.querySelector("#report-post-button");

const commentList = document.querySelector("#comment-list");
const commentInput = document.querySelector("#comment-input");
const createCommentButton = document.querySelector("#create-comment-button");