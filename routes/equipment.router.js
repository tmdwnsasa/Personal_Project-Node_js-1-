import express from 'express';
import Item from '../schemas/item.schema.js';
import Character from '../schemas/character.schema.js';
import Equipment from '../schemas/equipment.schema.js';

const router = express.Router();

router.get('/equip/:character_ID', async (req, res, next) => {
  const character_ID = req.params.character_ID;

  const validateCode = await Equipment.findOne({ character_ID: character_ID }).exec();
  if (!validateCode) {
    return res.status(400).json({ errorMessage: '없는 케릭터에게는 장착할 수 없습니다.' });
  }

  return res.status(201).json({ validateCode });
});

router.patch('/equip/:character_ID', async (req, res, next) => {
  const character_ID = req.params.character_ID;
  const { item_code } = req.body;

  const validateItem = await Item.findOne({ item_code: item_code }).exec();
  const validateCharacter = await Character.findOne({ character_ID: character_ID }).exec();
  const validateCode = await Equipment.findOne({ character_ID: character_ID }).exec();

  if (!validateItem) {
    return res.status(400).json({ errorMessage: '없는 아이템은 장착할 수 없습니다.' });
  }
  if (!validateCode) {
    return res.status(400).json({ errorMessage: '없는 케릭터에게는 장착할 수 없습니다.' });
  }
  for (const i of validateCode.equipment) {
    if (i.item_code === validateItem.item_code) {
      return res.status(400).json({ errorMessage: '이미 장착한 아이템입니다.' });
    }
  }

  validateCode.equipment.push(validateItem);
  if (validateItem.item_stat.health) validateCharacter.health += validateItem.item_stat.health;
  if (validateItem.item_stat.power) validateCharacter.power += validateItem.item_stat.power;

  await validateCode.save();
  await validateCharacter.save();

  return res.status(201).json({ validateCode });
});

router.patch('/unequip/:character_ID', async (req, res) => {
  const character_ID = req.params.character_ID;
  const { item_code } = req.body;

  const validateItem = await Item.findOne({ item_code: item_code }).exec();
  const validateCharacter = await Character.findOne({ character_ID: character_ID }).exec();
  const validateCode = await Equipment.findOne({ character_ID: character_ID }).exec();

  if (!validateItem) {
    return res.status(400).json({ errorMessage: '없는 아이템은 장착해제 할 수 없습니다.' });
  }
  if (!validateCode) {
    return res.status(400).json({ errorMessage: '없는 케릭터에게는 장착해제 할 수 없습니다.' });
  }

  const equipedItemIndex = validateCode.equipment.findIndex((element) => element.item_code === validateItem.item_code);
  if (equipedItemIndex === -1) return res.status(400).json({ errorMessage: '장착하지 않은 아이템을 장착해제 할 수 없습니다.' });
  else {
    if (validateItem.item_stat.health) validateCharacter.health -= validateItem.item_stat.health;
    if (validateItem.item_stat.power) validateCharacter.power -= validateItem.item_stat.power;
    validateCode.equipment.splice(equipedItemIndex, 1);
  }
  await validateCode.save();
  await validateCharacter.save();

  return res.status(201).json({ validateCode });
});

export default router;
