# Personal_Project-Node_js-1-

## character API
|METHOD|API URL|기능|request(입력할 데이터)|
|---|---|---|---|
|GET|/characterAPI/character/:character_ID|케릭터 읽어오기||
|DEL|/characterAPI/character/:character_ID|케릭터 삭제하기||
|POST|/characterAPI/character|케릭터 저장하기|{"name": "이름"}|
|POST|/itemAPI/item/:character_ID|아이템 저장하기|{"item_code": 5,"item_name": "파멸의 반지","item_stat": { "health": 20, "power": 2 }}|
|GET|/itemAPI/item/:item_ID|아이템 상세정보 읽어오기||
|GET|/itemAPI/item|아이템 모두 읽어오기|{"name": "이름"}|
|PATCH|/itemAPI/item/:character_ID|아이템 수정하기|{"item_name": "파멸의 반지_리뉴얼","item_stat": { "health": 40 }}|
|PATCH|/equipmentAPI/equip/:character_ID|아이템 장착하기|{"item_code": 4}|
|PATCH|/equipmentAPI/unequip/:character_ID|아이템 탈착하기|{"item_code": 4}|
|GET|/equipmentAPI/equip/:character_ID|장착한 아이템 가져오||
