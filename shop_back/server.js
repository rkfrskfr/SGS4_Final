const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const multer = require('multer');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('img'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/') 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) 
  }
});

const upload = multer({ storage: storage });



const products = [
  { id: 1, title: "노스페이스 화이트라벨 눕시", price: 1000},
  { id: 2, title: "나이키 에어포스 1 07 WB M", price: 2000},
  { id: 3, title: "알파카 블렌드 더블 코트", price: 3000},
  { id: 4, title: "빈티지 와이드 데님", price: 4000},
  { id: 5, title: "후드 스웨트셔츠", price: 5000},
  { id: 6, title: "첼시 부츠 블랙", price: 6000},
  { id: 7, title: "STOOKY UNI 자켓", price: 7000},
  { id: 8, title: "니트", price: 8000},
  { id: 9, title: "체크 브이넥 가디건", price: 9000},
  { id: 10, title: "아디다스 스페지알", price: 10000},
  { id: 11, title: "레더 칼라 재킷", price: 11000},
  { id: 12, title: "보테가베네타 레더 클러치", price: 9000},
  { id: 13, title: "퍼 후드집업", price: 9000},
  { id: 14, title: "D로고 펜던트 목걸이", price: 9000},
  { id: 15, title: "체크 목도리", price: 9000},
  { id: 16, title: "윈터 퍼그 숏부츠", price: 9000},
];
const deletedIds = new Set();

app.listen(3333, () => {
  console.log("3333서버가 열림");
});


app.get('/', (req, res) => {
  res.json(products);
});


app.get('/product/detail/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
    res.json(product);
});


app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  
  if (index === -1) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  deletedIds.add(productId);
  products.splice(index, 1);
  res.sendStatus(204);
});

app.post('/products', upload.single('image'), (req, res) => {
  const maxId = Math.max(...products.map(p => p.id), 0);
  let newId = maxId + 1;

  while (deletedIds.has(newId)) {
    newId++;
  }

  const newProduct = {
    id: newId,
    title: req.body.title,
    price: parseInt(req.body.price),
    image: req.file ? `/img/${req.file.filename}` : null
  };
  products.push(newProduct);
  res.json(newProduct);
});

app.put('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  
  product.title = req.body.title || product.title;
  product.price = req.body.price || product.price;
  
  res.json(product);
});
