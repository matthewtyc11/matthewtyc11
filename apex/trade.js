let updateTimer=250,
	confirmTimer=10000,
	trades=[],
	viewing={},
	count=0
function getPlayersTradingWith(id,acceptedOnly=false){return trades.filter(t=>(!acceptedOnly||t.accepted)&&(t.p1===id||t.p2===id)).map(t=>t.p1===id?t.p2:t.p1)}
function getPlayersRequestedBy(id){
	let ids=[]
	for(let trade of trades){
		if(trade.accepted||trade.p1!==id)continue
		ids.push(trade.p2)
	}
	return ids
}
function getPlayersRequesting(id){
	let ids=[]
	for(let trade of trades){
		if(trade.accepted||trade.p2!==id)continue
		ids.push(trade.p1)
	}
	return ids
}
function findViewedTrade(id){
	let t=trades.find(t=>(t.p1===id||t.p2===id)&&(t.p1===viewing[id]||t.p2===viewing[id]))
	return t.p1===id?[t,'p1','p2']:[t,'p2','p1']
}
function updateSentRequests(id){
	let ids=api.getPlayerIds()
	api.updateShopItemForPlayer(id,'trade','sendRequest',{userInput:{type:'player',excludedPlayers:getPlayersTradingWith(id).concat(getPlayersRequestedBy(id)).concat(id)}})
	api.updateShopItemForPlayer(id,'trade','cancelRequest',{userInput:{type:'player',excludedPlayers:ids.filter(x=>!getPlayersRequestedBy(id).includes(x)).concat(id)}})
}
function updateRecievedRequests(id){
	let ids=api.getPlayerIds()
	api.updateShopItemForPlayer(id,'trade','acceptRequest',{userInput:{type:'player',excludedPlayers:ids.filter(x=>!getPlayersRequesting(id).includes(x)).concat(id)}})
	api.updateShopItemForPlayer(id,'trade','declineRequest',{userInput:{type:'player',excludedPlayers:ids.filter(x=>!getPlayersRequesting(id).includes(x)).concat(id)}})
}
function updateViewedTrade(id){
	let ids=api.getPlayerIds()
	api.updateShopItemForPlayer(id,'trade','viewTrade',{userInput:{type:'player',excludedPlayers:ids.filter(x=>!getPlayersTradingWith(id,true).includes(x))}})
	api.updateShopItemForPlayer(id,'trade','viewingTrade',{description:viewing[id]?api.getEntityName(viewing[id]):''})
}
function updateTradeItems(id){
	let meI=[],themI=[]
	if(viewing[id]){
		let [t,me,them]=findViewedTrade(id)
		meI=(t[me+'Items']??[]).map((x,y)=>`${y+1}: ${x.amt} ${x?.attributes?.customDisplayName??x.name}`)
		themI=(t[them+'Items']??[]).map((x,y)=>`${y+1}: ${x.amt} ${x?.attributes?.customDisplayName??x.name}`)
	}
	api.updateShopItemForPlayer(id,'trade','viewYourItems',{userInput:{type:'dropdown',dropdownOptions:meI}})
	api.updateShopItemForPlayer(id,'trade','viewTheirItems',{userInput:{type:'dropdown',dropdownOptions:themI}})
	api.updateShopItemForPlayer(id,'trade','removeItem',{userInput:{type:'dropdown',dropdownOptions:meI}})
}
onPlayerBoughtShopItem=(id,cKey,iKey,item,input)=>{
	if(cKey==='trade'){
		if(iKey==='sendRequest'){
			let ids=api.getPlayerIds()
			trades.push({p1:id,p2:input,accepted:false,p1Items:[],p2Items:[],p1Confirm:false,p2Confirm:false,timer:0})
			updateSentRequests(id)
			updateRecievedRequests(input)
			api.sendOverShopInfo(id,'Request sent!')
			api.sendMessage(input,`You have a trade request from ${api.getEntityName(id)}!`,{color:'lime'})
		}else if(iKey==='cancelRequest'){
			trades.splice(trades.findIndex(x=>x.p1===id&&x.p2===input&&!x.accepted),1)
			updateSentRequests(id)
			updateRecievedRequests(input)
			api.sendOverShopInfo(id,'Request canceled!')
			api.sendMessage(input,`${api.getEntityName(id)} has canceled their trade request to you!`,{color:'red'})
		}else if(iKey==='acceptRequest'){
			let i=trades.findIndex(x=>x.p1===input&&x.p2===id)
			trades[i].accepted=true
			updateViewedTrade(id)
			updateViewedTrade(input)
			updateRecievedRequests(id)
			updateSentRequests(input)
			api.sendOverShopInfo(id,'Request accepted!')
			api.sendMessage(input,`${api.getEntityName(id)} has accepted your trade request!`,{color:'lime'})
		}else if(iKey==='declineRequest'){
			trades.splice(trades.findIndex(x=>x.p1===input&&x.p2===id),1)
			updateRecievedRequests(id)
			updateSentRequests(input)
			api.sendOverShopInfo(id,'Request declined!')
			api.sendMessage(input,`${api.getEntityName(id)} has declined your trade request!`,{color:'red'})
		}else if(iKey==='viewTrade'){
			viewing[id]=input
			updateViewedTrade(id)
			updateTradeItems(id)
			api.sendOverShopInfo(id,`Now viewing trade with ${api.getEntityName(input)}`)
		}else if(iKey==='addItem'){
			let held=api.getHeldItem(id)
			if(!viewing[id]){
				api.sendOverShopInfo(id,[{str:'You haven\'t selected any trade!',style:{color:'red'}}])
				return
			}
			if(held===null){
				api.sendOverShopInfo(id,[{str:'You aren\'t holding anything!',style:{color:'red'}}])
				return
			}
			let [t,me,them]=findViewedTrade(id)
			if(t[me+'Confirm']){
				api.sendOverShopInfo(id,[{str:'You can\' edit the trade after confirming! Please unconfirm to continue!',style:{color:'red'}}])
				return
			}
			api.setItemSlot(id,api.getSelectedInventorySlotI(id),'Air')
			t[me+'Items'].push({name:held.name,amt:held.amount,attr:held.attributes})
			updateTradeItems(id)
			if(viewing[viewing[id]]===id)updateTradeItems(viewing[id])
			api.sendOverShopInfo(id,'Item added!')
			api.sendMessage(t[them],`${api.getEntityName(id)} has added an item to the trade!`,{color:'lime'})
		}else if(iKey==='removeItem'){
			if(!viewing[id]){
				api.sendOverShopInfo(id,[{str:'You haven\'t selected any trade!',style:{color:'red'}}])
				return
			}
			let [t,me,them]=findViewedTrade(id),items=t[me+'Items'],idx=input[0]-1
			if(t[me+'Confirm']){
				api.sendOverShopInfo(id,[{str:'You can\' edit the trade after confirming! Please unconfirm to continue!',style:{color:'red'}}])
				return
			}
			api.giveItem(id,items[idx].name,items[idx].amt,items[idx].attr)
			items.splice(idx,1)
			updateTradeItems(id)
			if(viewing[viewing[id]]===id)updateTradeItems(viewing[id])
			api.sendOverShopInfo(id,'Item removed!')
			api.sendMessage(t[them],`${api.getEntityName(id)} has removed an item from the trade!`,{color:'red'})
		}else if(iKey==='confirm'){
			if(!viewing[id]){
				api.sendOverShopInfo(id,[{str:'You haven\'t selected any trade!',style:{color:'red'}}])
				return
			}
			let [t,me,them]=findViewedTrade(id)
			t[me+'Confirm']=true
			api.sendOverShopInfo(id,'Trade confirmed!')
			api.sendMessage(t[them],`${api.getEntityName(id)} has confirmed the trade!`,{color:'lime'})
		}else if(iKey==='unconfirm'){
			if(!viewing[id]){
				api.sendOverShopInfo(id,[{str:'You haven\'t selected any trade!',style:{color:'red'}}])
				return
			}
			let [t,me,them]=findViewedTrade(id)
			t[me+'Confirm']=false
			api.sendOverShopInfo(id,'Trade unconfirmed!')
			api.sendMessage(t[them],`${api.getEntityName(id)} has unconfirmed the trade!`,{color:'red'})
		}else if(iKey==='exitTrade'){
			if(!viewing[id]){
				api.sendOverShopInfo(id,[{str:'You haven\'t selected any trade!',style:{color:'red'}}])
				return
			}
			let [t,me,them]=findViewedTrade(id)
			t.p1Items.forEach(x=>api.giveItem(t.p1,x.name,x.amt,x.attr))
			t.p2Items.forEach(x=>api.giveItem(t.p2,x.name,x.amt,x.attr))
			if(viewing[t[them]]===id){
				delete viewing[t[them]]
				updateViewedTrade(t[them])
				updateTradeItems(t[them])
			}
			delete viewing[id]
			updateViewedTrade(id)
			updateTradeItems(id)
			trades.splice(trades.findIndex(x=>x===t),1)
			api.sendOverShopInfo(id,'Trade exited!')
			api.sendMessage(t[them],`${api.getEntityName(id)} has exited the trade!`,{color:'red'})
		}
	}
}
tick=dt=>{
	count+=dt
	if(count>=updateTimer){
		count=0
		for(let id of api.getPlayerIds()){
			updateSentRequests(id)
			updateRecievedRequests(id)
			updateViewedTrade(id)
		}
	}
	for(let i=trades.length-1;i>=0;i--){
		let t=trades[i]
		if(!t.p1Confirm||!t.p2Confirm){t.timer=0;continue}
		if(t.timer===0){
			api.sendMessage(t.p1,'Trade executed in 10s!',{color:'lime'})
			api.sendMessage(t.p2,'Trade executed in 10s!',{color:'lime'})
		}else{
			api.sendOverShopInfo(t.p1,`Trade executed in ${Math.ceil((confirmTimer-t.timer)/1000)}s!`)
			api.sendOverShopInfo(t.p2,`Trade executed in ${Math.ceil((confirmTimer-t.timer)/1000)}s!`)
		}
		t.timer+=dt
		if(t.timer>=confirmTimer){
			for(let i of t.p1Items){
				api.giveItem(t.p2,i.name,i.amt,i.attr)
			}
			for(let i of t.p2Items){
				api.giveItem(t.p1,i.name,i.amt,i.attr)
			}
			
			api.sendMessage(t.p1,'Trade executed!',{color:'lime'})
			api.sendMessage(t.p2,'Trade executed!',{color:'lime'})
			if(viewing[t.p1]===t.p2){
				delete viewing[t.p1]
				updateViewedTrade(t.p1)
				updateTradeItems(t.p1)
			}
			if(viewing[t.p2]===t.p1){
				delete viewing[t.p2]
				updateViewedTrade(t.p2)
				updateTradeItems(t.p2)
			}
			trades.splice(i,1)
		}
	}
}
api.configureShopCategory('trade',{customTitle:'Trade',sortPriority:100})
api.createShopItem('trade','sendRequest',{
	image:'warp_set_icon.png',
	buyButtonText:'Send',
	customTitle:'Send Trade Request',
	description:'Send a trade request to any player',
	userInput:{type:'player'},
	sortPriority:100
})
api.createShopItem('trade','cancelRequest',{
	image:'warp_del_icon.png',
	buyButtonText:'Cancel',
	customTitle:'Cancel Trade Request',
	description:'Cancel a trade request you have sent',
	userInput:{type:'player'},
	sortPriority:99
})
api.createShopItem('trade','acceptRequest',{
	image:'warp_set_icon.png',
	buyButtonText:'Accept',
	customTitle:'Accept Trade Request',
	description:'Accept a trade request from a player',
	userInput:{type:'player'},
	sortPriority:98
})
api.createShopItem('trade','declineRequest',{
	image:'warp_del_icon.png',
	buyButtonText:'Decline',
	customTitle:'Decline Trade Request',
	description:'Decline a trade request from a player',
	userInput:{type:'player'},
	sortPriority:97
})
api.createShopItem('trade','viewTrade',{
	image:'selectPlayerIcon.png',
	buyButtonText:'View',
	customTitle:'View Trade',
	description:'View your trade with someone',
	userInput:{type:'player'},
	sortPriority:96
})
api.createShopItem('trade','viewingTrade',{
	image:'selectPlayerIcon.png',
	customTitle:'Viewing Trade With:',
	description:'',
	sortPriority:95
})
api.createShopItem('trade','viewYourItems',{
	image:'Diamond',
	buyButtonText:'\u2B05 \u{1F392}',
	customTitle:'View Your Offered Items:',
	userInput:{type:'dropdown',dropdownOptions:[]},
	sortPriority:94
})
api.createShopItem('trade','viewTheirItems',{
	image:'Diamond',
	buyButtonText:'\u2B05 \u{1F392}',
	customTitle:'View Other Person\'s Offered Items:',
	userInput:{type:'dropdown',dropdownOptions:[]},
	sortPriority:93
})
api.createShopItem('trade','addItem',{
	image:'Lime Glass',
	customTitle:'Add Item',
	description:'Add your held item to the trade',
	sortPriority:92
})
api.createShopItem('trade','removeItem',{
	image:'Red Glass',
	buyButtonText:'Remove',
	customTitle:'Remove item',
	description:'Remove an item you added to the trade',
	userInput:{type:'dropdown',dropdownOptions:[]},
	sortPriority:91
})
api.createShopItem('trade','confirm',{
	image:'Lime Concrete',
	customTitle:'Confirm Trade',
	description:'10s after both players confirm, the trade will be executed. You can\'t edit your items after confirming!',
	sortPriority:90
})
api.createShopItem('trade','unconfirm',{
	image:'Red Concrete',
	customTitle:'Unconfirm Trade',
	description:'Reset your confirmation to edit trade items',
	sortPriority:89
})
api.createShopItem('trade','exitTrade',{
	image:'Patterned Red Glass',
	customTitle:'Exit Trade',
	description:'Click this if you no longer want to do the trade',
	sortPriority:88
})