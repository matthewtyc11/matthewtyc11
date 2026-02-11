id = api.attemptSpawnMob("Draugr Knight",thisPos[0],thisPos[1],thisPos[2])
api.setMobSetting(id, "baseWalkingSpeed", 10)
api.setMobSetting(id, "attackRadius", 4)
api.setMobSetting(id,"attackDamage", 105)