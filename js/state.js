// 백엔드 서버 주소는 실행 중 바뀌면 안되니깐 const
const API_BASE_URL = "http://localhost:8080";

// 로그인 로그아웃 등을 통해 현재 사용자 아이디는 변경 가능
// Token값도 마찬가지
// localStorage는 브라우저 안에 저장되는 작은 저장소
let currentUserId = Number(localStorage.getItem("userId")) || null;
let accessToken = localStorage.getItem("accessToken") || null;
let currentUser = null;
let selectedProfileImage = "";
let selectedProfileImageChanged = false;
let signupProfileImage = "";

const DEFAULT_PROFILE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23e5e7eb'/%3E%3Ccircle cx='80' cy='62' r='30' fill='%239ca3af'/%3E%3Cpath d='M32 137c7-29 27-44 48-44s41 15 48 44' fill='%239ca3af'/%3E%3C/svg%3E";
const DEFAULT_PROFILE_IMAGE_KEY = "default-profile-image";

// 현재 페이지 또한 변경 가능하지만 페이지 사이즈는 5로 고정
// 게시글 아이디랑 임시저장 변수도 변경 가능해야됨
let currentPage = 0;
const pageSize = 5;
let currentPostId = null;
let draftExists = false;
let currentPostLiked = false;
