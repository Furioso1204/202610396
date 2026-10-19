const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();

// 6번: 학번 뒷자리 4자리(0396 -> 3396)로 포트 번호 변경
const PORT = process.env.PORT || 3396;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// POST /todo/1?_method=PUT → PUT /todo/1 로 처리
app.use(methodOverride('_method'));

// 정적 파일 serving (index.html 위치)
app.use(express.static(__dirname));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

// GET: 할일 목록 조회
app.get('/todo', (req, res) => {
  res.json(todos);
});

// POST: 할일 추가
app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});

// 7번: 수정처리를 위한 PUT 라우트 구현
app.put('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const text = (req.body.text || '').trim();
  const todo = todos.find((t) => t.id === id);
  if (todo && text) {
    todo.text = text;
  }
  res.redirect('/');
});

// 8번: 삭제처리를 위한 DELETE 라우트 구현
app.delete('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  todos = todos.filter((t) => t.id !== id);
  res.redirect('/');
});

// 메인 페이지 전달
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});