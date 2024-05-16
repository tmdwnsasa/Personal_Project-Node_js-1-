import express from 'express';
import Character from '../schemas/character.schema.js';
import Equipment from '../schemas/equipment.schema.js';
import Joi from 'joi';

const router = express.Router();

// 데이터 검증을 위한 Joi 스키마를 정의
const createCharacterSchema = Joi.object({
  name: Joi.string().required(),
});

router.post('/character', async (req, res, next) => {
  try {
    // 클라이언트에게 전달받은 body 데이터를 검증
    const validateBody = await createCharacterSchema.validateAsync(req.body);

    const { name } = validateBody;

    const validateName = await Character.find({ name: name }).exec();

    if (validateName.length) {
      return res.status(400).json({ errorMessage: '이미 있는 이름입니다.' });
    }

    const characterMaxId = await Character.findOne().sort('-character_ID').exec();

    const character_ID = characterMaxId ? characterMaxId.character_ID + 1 : 1;

    // mongoose model
    const character = new Character({ character_ID, name, health: 500, power: 100 });
    const equipment = new Equipment({ character_ID });

    await character.save();
    await equipment.save();

    return res.status(201).json({ character });
  } catch (error) {
    // 에러 처리 미들웨어(app.js)
    next(error);
  }
});

router.get('/character/:character_ID', async (req, res) => {
  const character_ID = req.params.character_ID;
  const character = await Character.findOne({ character_ID: character_ID }).exec();

  if (!character) {
    return res.status(404).json({ errorMessage: '존재하지 않는 ID입니다.' });
  }

  const data = {
    name: character.name,
    health: character.health,
    power: character.power,
  };

  return res.status(200).json({ data });
});

router.patch('/characterEquip/:item_code', async (req, res) => {
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

router.delete('/character/:character_ID', async (req, res) => {
  const { character_ID } = req.params;

  const character = await Character.findOne({ character_ID: character_ID }).exec();

  if (!character) {
    return res.status(404).json({ errorMessage: '존재하지 않는 ID입니다.' });
  }

  await Character.deleteOne({ character_ID }).exec();

  return res.status(200).json({});
});

export default router;
