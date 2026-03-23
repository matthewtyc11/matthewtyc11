function cuteSnSetChestItem(ChestTypeNum,myId,x,y,z){
	const playerEffects = api.getEffects(myId);  
	const hasFortune = playerEffects.includes("Fortune")
	l=0
	for (let i=0;i<ChestItem.length;i++){
		rarityDiff = Math.abs(ChestItemRarity[i] - ChestRarity[ChestTypeNum])
		if (hasFortune){
			rarityDiff = rarityDiff * 0.75
		}
		if (rarityDiff <= 0.3){
			matchQuality = 1 - rarityDiff
			matchChance = (matchQuality ** 3)* 0.4
			matchIncreaseChance = 1 - (ChestItemRarity[i] * 0.7)
			if (hasFortune){
				matchIncreaseChance = Math.min(1,matchIncreaseChance * 1.3)
			}
			amount = 1
			if (Math.random()<matchChance){
				amountMax = Math.max(2,10*(matchIncreaseChance))
				amountMax = amountMax * (0.5 + matchQuality * 0.5)
				while(amount<amountMax && Math.random()<matchIncreaseChance){
					amount = amount + 1
				}
				try {
			        GetGameItem_idk = JSON.parse(GetGameItem_GearEnchantment[ChestItem[i]]);
					api.setStandardChestItemSlot([x=x, y=y, z=z],l,GetGameItem_Item[ChestItem[i]],amount,myId,{
			            customDescription:GetGameItem_ItemDesc[ChestItem[i]],
			            customDisplayName:GetGameItem_ItemName[ChestItem[i]]+"[$"+ChestItemPrice[i]+"]",
			            customAttributes:{enchantmentTier:GetGameItem_ItemTier[ChestItem[i]],enchantments:GetGameItem_idk}
			        });
			    } catch(error) {
			        api.setStandardChestItemSlot([x=x, y=y, z=z],l,GetGameItem_Item[ChestItem[i]],amount,myId,{
			            customDescription:GetGameItem_ItemDesc[ChestItem[i]],
			            customDisplayName:GetGameItem_ItemName[ChestItem[i]]+"[$"+ChestItemPrice[i]+"]",
			            customAttributes:{enchantmentTier:GetGameItem_ItemTier[ChestItem[i]]}
			        });
			    }
				l=Number(l)+Number(1)
			}
		}
	}
}
function cuteSnClearChestItem(myId,x,y,z){
	for(let i=0;i<36;i++) {
		api.setStandardChestItemSlot([x=x, y=y, z=z],i,"Air")
	}
}

function cuteSnLootChest(myId,x,y,z,ismoon){
if(ismoon) return
	if(!ismoon&&(!chestcd[[x=x,y=y,z=z]]||api.now()-chestcd[[x=x,y=y,z=z]]>90000)){		
		if(api.getBlock(x, y+1, z)=="Gray Concrete Slab"){
			chestcd[[x=x,y=y,z=z]]=api.now()
			api.sendMessage(myId,openChestText[0])
			cuteSnClearChestItem(myId,x,y,z)
			cuteSnSetChestItem(0,myId,x,y,z)
		}
		if(api.getBlock(x, y+1, z)=="Blue Concrete Slab"){
			chestcd[[x=x,y=y,z=z]]=api.now()
			api.sendMessage(myId,openChestText[1])
			cuteSnClearChestItem(myId,x,y,z)
			cuteSnSetChestItem(1,myId,x,y,z)
		}
		if(api.getBlock(x, y+1, z)=="Orange Concrete Slab"){
			chestcd[[x=x,y=y,z=z]]=api.now()
			api.sendMessage(myId,openChestText[2])
			cuteSnClearChestItem(myId,x,y,z)
			cuteSnSetChestItem(2,myId,x,y,z)
		}
		if(api.getBlock(x, y+1, z)=="Red Concrete Slab"){
			chestcd[[x=x,y=y,z=z]]=api.now()
			api.sendMessage(myId,openChestText[3])
			cuteSnClearChestItem(myId,x,y,z)
			cuteSnSetChestItem(3,myId,x,y,z)
		}
	}
	else{
		api.sendMessage(myId,
openChestText[4])
		if(api.getBlock(x, y+1, z)=="Gray Wool") return 'preventOpen'
	}
	return true
}
functionDefined[13] = 1
void 0;