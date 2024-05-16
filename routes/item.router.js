import express from 'express';
import Item from '../schemas/item.schema.js';
import Joi from 'joi';

const router = express.Router();

// Joi 스키마 Item 추가
const createAddItemSchema = Joi.object({
  item_code: Joi.number().required(),
  item_name: Joi.string().required(),
  item_stat: {
    health: Joi.number().required(),
    power: Joi.number().required(),
  },
});

// Joi 스키마 Item 수정
const createFixItemSchema = Joi.object({
  item_name: Joi.string().required(),
  item_stat: {
    health: Joi.number(),
    power: Joi.number(),
  },
});

router.post('/item', async (req, res, next) => {
  try {
    const validateBody = await createAddItemSchema.validateAsync(req.body);
    const { item_code, item_name, item_stat } = validateBody;

    const validateName = await Item.find({ item_name: item_name }).exec();
    const validateCode = await Item.find({ item_code: item_code }).exec();

    if (validateName.length) {
      return res.status(400).json({ errorMessage: '이미 있는 이름입니다.' });
    }
    if (validateCode.length) {
      return res.status(400).json({ errorMessage: '이미 있는 코드입니다.' });
    }

    const item = new Item({ item_code, item_name, item_stat });

    await item.save();

    return res.status(201).json({ item });
  } catch (error) {
    // 에러 처리 미들웨어
    next(error);
  }
});

router.get('/item', async (req, res) => {
  const item = await Item.find({}).select('item_code item_name -_id').exec();

  return res.status(200).json({ item });
});

router.get('/item/:item_code', async (req, res) => {
  const item_code = req.params.item_code;
  const item = await Item.findOne({ item_code: item_code }).exec();

  if (!item) {
    return res.status(404).json({ errorMessage: '존재하지 않는 아이템 코드입니다.' });
  }

  const data = {
    item_code: item.item_code,
    item_name: item.item_name,
    item_stat: item.item_stat,
  };

  return res.status(200).json({ data });
});

router.patch('/item/:item_code', async (req, res) => {
  const item_code = req.params.item_code;

  const validateBody = await createFixItemSchema.validateAsync(req.body);
  const { item_name, item_stat } = validateBody;

  // 변경하려는 '해야할 일'을 가져옵니다. 만약, 해당 ID값을 가진 '해야할 일'이 없다면 에러를 발생시킵니다.
  const currentData = await Item.findOne({ item_code: item_code }).exec();

  if (!currentData) {
    return res.status(404).json({ errorMessage: '존재하지 않는 코드입니다.' });
  }
  currentData.item_name = item_name;
  currentData.item_stat = item_stat;

  // 변경된 '해야할 일'을 저장합니다.
  await currentData.save();

  return res.status(200).json({});
});

router.delete('/item/:item_ID', async (req, res) => {
  const item_ID = req.params.item_ID;

  const item = await Item.findOne({ item_ID: item_ID }).exec();

  if (!item) {
    return res.status(404).json({ errorMessage: '존재하지 않는 ID입니다.' });
  }

  await Item.deleteOne({ item_ID }).exec();

  return res.status(200).json({});
});

export default router;
