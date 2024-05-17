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

router.delete('/character/:character_ID', async (req, res) => {
  const { character_ID } = req.params;

  const character = await Character.findOne({ character_ID: character_ID }).exec();

  if (!character) {
    return res.status(404).json({ errorMessage: '존재하지 않는 ID입니다.' });
  }

  await Character.deleteOne({ character_ID }).exec();
  await Equipment.deleteOne({ character_ID }).exec();

  return res.status(200).json({});
});

export default router;
