function playerCommand(id, command) {
    let parts = command.split(" ");
    if (parts[0] === "give") {
        if (!isNaN(parts[parts.length - 1])) {
            let item = parts.slice(1, parts.length - 1).join(" ")
            api.giveItem(id, item, Number(parts[parts.length - 1]))
        } else {
            let item = parts.slice(1).join(" ")
            api.giveItem(id, item)
        }
 }}