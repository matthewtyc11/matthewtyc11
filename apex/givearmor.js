const armours = ["White Wood Helmet"]
armours.forEach(armour => {
    api.giveItem(myId, armour, 1, {
        customDisplayName: "Tier 6",
        customDescription: "Admin level armour",
        customAttributes: {
            enchantments: {
                "Health": 1000
            }
        }
    })
})
