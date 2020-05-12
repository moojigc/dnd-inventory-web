const moment = require('moment'),
    Table = require('./Table'),
    Guild = require('./Guild');
    
class Player extends Table {
    constructor(params) {
        let { id, name, guild, guildID } = params;
        super({
            collection: 'players', 
            id: id 
        });
        this.name = name;
        this.guild = guild;
        this.guildID = guildID;
        this.notificationsToDM = false;
        this.inventory = {};
        this.changelog = [];
        this.lastUpdated = moment().format();
    }
    createInventory(prepack, goldCoins, silverCoins) {
        if (prepack === 'prepack') {
            let prepackaged = {
                gold: 0 + parseInt(goldCoins),
                silver: 0 + parseInt(silverCoins),
                copper: 0,
                platinum: 0,
                electrum: 0,
                potions: [
                    {
                        name: "none",
                        quantity: 0
                    }
                ],
                weapons: [
                    {
                        name: "none",
                        quantity: 0
                    }
                ],
                misc: [
                    {
                        name: "crowbar",
                        quantity: 1
                    },
                    {
                        name: "hammer",
                        quantity: 1
                    },
                    {
                        name: "pitons",
                        quantity: 10
                    },
                    {
                        name: "torches",
                        quantity: 10
                    },
                    {
                        name: "rations",
                        quantity: 10
                    },
                    {
                        name: "feet of hempen rope",
                        quantity: 100
                    }
                ]
            };
            this.inventory = prepackaged;
        } else {
            let empty = {
                gold: 0,
                silver: 0,
                copper: 0,
                platinum: 0,
                electrum: 0,
                potions: [
                    {
                        name: "none",
                        quantity: 0
                    }
                ],
                weapons: [
                    {
                        name: "none",
                        quantity: 0
                    }
                ],
                misc: [
                    {
                        name: "none",
                        quantity: 0
                    }
                ]
            };
            this.inventory = empty;
        };
        return this;
    };
    prepack(addGold, addSilver, DMsetting) {
        let gold, 
            silver;
        if (!addGold) gold = 0;
        else gold = addGold;
        if (!addSilver) silver = 0;
        else silver = addSilver;
        this.createInventory('prepack', gold, silver);
        if (DMsetting === 'DM') this.notificationsToDM = true;
        return this;
    };
    writeChangelog(command) {
        this.lastUpdated = moment().format();
        let change = {
            on: moment(),
            command: command,
        }
        if (this.changelog.length > 9) {
            this.changelog.shift();
            this.changelog.push(change);
        } else {
            this.changelog.push(change);
        }
        return this
    }
    async checkExisting() {
        let response = await this.dbRead()
        if (response === null) return false;
        else {
            this.inventory = response.inventory;
            this.changelog = response.changelog;
            this.notificationsToDM = response.notificationsToDM;
            return response
        };
    }
    async sync() {
        let response = await this.dbRead()
        this.inventory = response.inventory;
        this.changelog = response.changelog;
        this.notificationsToDM = response.notificationsToDM;
        this.name = response.name;
        this.guild = response.guild;
        this.guildID = response.guildID;
    }
}

module.exports = Player;

