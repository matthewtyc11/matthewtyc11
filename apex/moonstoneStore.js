const SAVED_DATA = ["kills", "cash"];  
const data = {};  
  
function ensure(id){  
    if(!data[id]){  
        data[id] = {};  
        SAVED_DATA.forEach(k => data[id][k] = 0);  
    }  
}  
  
function load(id){  
    let s = api.getMoonstoneChestItemSlot(id, 0), p = {};  
    if(s?.attributes?.customDescription){  
        s.attributes.customDescription.split("|").forEach(e => {  
            let [k, v] = e.split(":");  
            if(SAVED_DATA.includes(k)) p[k] = +v || 0;  
        });  
    }  
    SAVED_DATA.forEach(k => p[k] = p[k] || 0);  
    data[id] = p;  
}  
  
function save(id){  
    let s = api.getMoonstoneChestItemSlot(id, 0);  
    let desc = SAVED_DATA.map(k => `${k}:${data[id][k]}`).join("|");  
    if(!s){  
        api.setMoonstoneChestItemSlot(id, 0, "temp", 1, { customDescription: desc });  
        return;  
    }  
    let attrs = { ...(s.attributes||{}), customDescription: desc };  
    api.setMoonstoneChestItemSlot(id, 0, s.name, s.amount, attrs);  
}  
  
function inc(id, k){  
    ensure(id);  
    data[id][k]++;  
    save(id);  
}  
  
function get(id, key){  
    return data?.[id]?.[key] ?? 0;  
}  
  
function syncStatsToUI(id){  
    if(!playerData[id]) playerData[id]={};  
    playerData[id].kills=get(id,"kills");  
    playerData[id].cash=get(id,"cash");  
}