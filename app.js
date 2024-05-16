import express from 'express';
import connect from './schemas/index.js';
import characterRouter from './routes/character.router.js';
import itemRouter from './routes/item.router.js';
import equipmentRouter from './routes/equipment.router.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';

const app = express();
const PORT = 3000;
const router = express.Router();

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, '-', new Date());
  next();
});

app.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});

// /api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use('/characterAPI', [router, characterRouter]);
app.use('/itemAPI', [router, itemRouter]);
app.use('/equipmentAPI', [router, equipmentRouter]);

// 에러 핸들링 미들웨어를 등록합니다.
app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
