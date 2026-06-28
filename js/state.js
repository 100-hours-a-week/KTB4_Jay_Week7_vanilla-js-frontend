// 백엔드 서버 주소는 실행 중 바뀌면 안되니깐 const
const API_BASE_URL = "http://localhost:8080";

// 로그인 로그아웃 등을 통해 현재 사용자 아이디는 변경 가능
// Token값도 마찬가지
// localStorage는 브라우저 안에 저장되는 작은 저장소
let currentUserId = Number(localStorage.getItem("userId")) || null;
let accessToken = localStorage.getItem("accessToken") || null;

// 현재 페이지 또한 변경 가능하지만 페이지 사이즈는 5로 고정
// 게시글 아이디랑 임시저장 변수도 변경 가능해야됨
let currentPage = 0;
const pageSize = 5;
let currentPostId = null;
let draftExists = false;
let currentPostLiked = false;