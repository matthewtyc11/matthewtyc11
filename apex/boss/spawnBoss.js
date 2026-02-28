if (!getMobNames().includes("Draugr Knight") && canSpawnBoss1) {
	canSpawnBoss1 = false
    boss1Reward = true
    bossId = api.attemptSpawnMob("Draugr Knight", 38.5, 25, 82.5, {spawnerId: api.getPlayerIds()[0]})
    api.setMobSetting(bossId, "baseRunningSpeed",8)
    api.setMobSetting(bossId, "attackRadius", 5)
    api.setMobSetting(bossId, "attackDamage", 150)
	api.setMobSetting(bossId, "attackInterval", 0)
	api.setMobSetting(bossId, "maxHealth" , 2000)
	api.setHealth(bossId, 2000)
}
