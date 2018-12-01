/**
 * @typedef {import("./newTeam.js")} NewTeam
 * @typedef {{member?: DiscordJs.GuildMember, id: number, name: string, tag: string, isFounder?: boolean, disbanded?: boolean, locked?: boolean}} TeamData
 */

const DiscordJs = require("discord.js"),

    Db = require("./database"),
    Exception = require("./exception"),
    Log = require("./log");

/**
 * @type {typeof import("./discord")}
 */
let Discord;

setTimeout(() => {
    Discord = require("./discord");
}, 0);

//  #####
//    #
//    #     ###    ###   ## #
//    #    #   #      #  # # #
//    #    #####   ####  # # #
//    #    #      #   #  # # #
//    #     ###    ####  #   #
/**
 * A class that handles team-related functions.
 */
class Team {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * A constructor to create a team.
     * @param {TeamData} data The data to load into the team.
     */
    constructor(data) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.tag = data.tag;
            if (data.isFounder) {
                this.founder = data.member;
            }
            this.disbanded = data.disbanded;
            this.locked = data.locked;
        }
    }

    //                          #
    //                          #
    //  ##   ###    ##    ###  ###    ##
    // #     #  #  # ##  #  #   #    # ##
    // #     #     ##    # ##   #    ##
    //  ##   #      ##    # #    ##   ##
    /**
     * Creates a new team.
     * @param {NewTeam} newTeam The data to create the team with.
     * @returns {Promise<Team>} A promise that resolves with the newly created team.
     */
    static async create(newTeam) {
        let teamData;
        try {
            teamData = await Db.createTeam(newTeam);
        } catch (err) {
            throw new Exception("There was a database error creating a team.", err);
        }

        const team = new Team(teamData);

        try {
            await team.setup(newTeam.member, false);

            await newTeam.delete(`${newTeam.member.displayName} created the team ${newTeam.name}.`);
        } catch (err) {
            throw new Exception("There was a critical Discord error creating a team.  Please resolve this manually as soon as possible.", err);
        }

        return team;
    }

    //              #    ###         ###    #    ##           #
    //              #    #  #        #  #         #           #
    //  ###   ##   ###   ###   #  #  #  #  ##     #     ##   ###
    // #  #  # ##   #    #  #  #  #  ###    #     #    #  #   #
    //  ##   ##     #    #  #   # #  #      #     #    #  #   #
    // #      ##     ##  ###     #   #     ###   ###    ##     ##
    //  ###                     #
    /**
     * Gets a team by its pilot.
     * @param {DiscordJs.GuildMember} pilot The pilot to get the team for.
     * @returns {Promise<Team>} The pilot's team.
     */
    static async getByPilot(pilot) {
        let data;
        try {
            data = await Db.getTeam(pilot);
        } catch (err) {
            throw new Exception("There was a database error getting a team by pilot.", err);
        }

        return data ? new Team(data) : void 0;
    }

    //              #    ###         #  #                     ##         ###
    //              #    #  #        ## #                    #  #         #
    //  ###   ##   ###   ###   #  #  ## #   ###  # #    ##   #  #  ###    #     ###   ###
    // #  #  # ##   #    #  #  #  #  # ##  #  #  ####  # ##  #  #  #  #   #    #  #  #  #
    //  ##   ##     #    #  #   # #  # ##  # ##  #  #  ##    #  #  #      #    # ##   ##
    // #      ##     ##  ###     #   #  #   # #  #  #   ##    ##   #      #     # #  #
    //  ###                     #                                                     ###
    /**
     * Gets a team by its name or tag.
     * @param {string} name The name or tag.
     * @returns {Promise<Team>} The team.
     */
    static async getByNameOrTag(name) {
        let data;
        try {
            data = await Db.getAnyTeamByNameOrTag(name);
        } catch (err) {
            throw new Exception("There was a database error getting a team by name or tag.", err);
        }

        return data ? new Team(data) : void 0;
    }

    //                         ####         #            #
    //                         #                         #
    // ###    ###  # #    ##   ###   #  #  ##     ###   ###    ###
    // #  #  #  #  ####  # ##  #      ##    #    ##      #    ##
    // #  #  # ##  #  #  ##    #      ##    #      ##    #      ##
    // #  #   # #  #  #   ##   ####  #  #  ###   ###      ##  ###
    /**
     * Determines whether a team name exists.
     * @param {string} name The team name to check.
     * @returns {boolean} A promise that resolves with whether the team name exists.
     */
    static nameExists(name) {
        return !!Discord.findRoleByName(`Team: ${name}`);
    }

    //  #                ####         #            #
    //  #                #                         #
    // ###    ###   ###  ###   #  #  ##     ###   ###    ###
    //  #    #  #  #  #  #      ##    #    ##      #    ##
    //  #    # ##   ##   #      ##    #      ##    #      ##
    //   ##   # #  #     ####  #  #  ###   ###      ##  ###
    //              ###
    /**
     * Determines whether a team tag exists.
     * @param {string} tag The team tag to check.
     * @returns {boolean} A promise that resolves with whether the team tag exists.
     */
    static tagExists(tag) {
        return !!Discord.findChannelByName(`Team ${tag}`);
    }

    //                    #           #                  ##   #                             ##
    //                    #                             #  #  #                              #
    //  ##    ###  ###   ###    ###  ##    ###    ###   #     ###    ###  ###   ###    ##    #
    // #     #  #  #  #   #    #  #   #    #  #  ##     #     #  #  #  #  #  #  #  #  # ##   #
    // #     # ##  #  #   #    # ##   #    #  #    ##   #  #  #  #  # ##  #  #  #  #  ##     #
    //  ##    # #  ###     ##   # #  ###   #  #  ###     ##   #  #   # #  #  #  #  #   ##   ###
    //             #
    /**
     * Gets the team's captains channel.
     * @returns {DiscordJs.TextChannel} The team's captains channel.
     */
    get captainsChannel() {
        return /** @type {DiscordJs.TextChannel} */ (Discord.findChannelByName(`captains-${this.tag.toLowerCase().replace(/ /g, "-")}`)); // eslint-disable-line no-extra-parens
    }

    //                    #           #                 #  #         #                 ##   #                             ##
    //                    #                             #  #                          #  #  #                              #
    //  ##    ###  ###   ###    ###  ##    ###    ###   #  #   ##   ##     ##    ##   #     ###    ###  ###   ###    ##    #
    // #     #  #  #  #   #    #  #   #    #  #  ##     #  #  #  #   #    #     # ##  #     #  #  #  #  #  #  #  #  # ##   #
    // #     # ##  #  #   #    # ##   #    #  #    ##    ##   #  #   #    #     ##    #  #  #  #  # ##  #  #  #  #  ##     #
    //  ##    # #  ###     ##   # #  ###   #  #  ###     ##    ##   ###    ##    ##    ##   #  #   # #  #  #  #  #   ##   ###
    //             #
    /**
     * Gets the team's captains voice channel.
     * @returns {DiscordJs.VoiceChannel} The team's captains voice channel.
     */
    get captainsVoiceChannel() {
        return /** @type {DiscordJs.VoiceChannel} */ (Discord.findChannelByName(`Captains ${this.tag}`)); // eslint-disable-line no-extra-parens
    }

    //              #                                   ##   #                             ##
    //              #                                  #  #  #                              #
    //  ##    ###  ###    ##    ###   ##   ###   #  #  #     ###    ###  ###   ###    ##    #
    // #     #  #   #    # ##  #  #  #  #  #  #  #  #  #     #  #  #  #  #  #  #  #  # ##   #
    // #     # ##   #    ##     ##   #  #  #      # #  #  #  #  #  # ##  #  #  #  #  ##     #
    //  ##    # #    ##   ##   #      ##   #       #    ##   #  #   # #  #  #  #  #   ##   ###
    //                          ###               #
    /**
     * Gets the team's category channel.
     * @returns {DiscordJs.CategoryChannel} The team's category channel.
     */
    get categoryChannel() {
        return /** @type {DiscordJs.CategoryChannel} */ (Discord.findChannelByName(this.name)); // eslint-disable-line no-extra-parens
    }

    //  #                       ##   #                             ##
    //  #                      #  #  #                              #
    // ###    ##    ###  # #   #     ###    ###  ###   ###    ##    #
    //  #    # ##  #  #  ####  #     #  #  #  #  #  #  #  #  # ##   #
    //  #    ##    # ##  #  #  #  #  #  #  # ##  #  #  #  #  ##     #
    //   ##   ##    # #  #  #   ##   #  #   # #  #  #  #  #   ##   ###
    /**
     * Gets the team's channel.
     * @returns {DiscordJs.TextChannel} The team's channel.
     */
    get teamChannel() {
        return /** @type {DiscordJs.TextChannel} */ (Discord.findChannelByName(`team-${this.tag.toLowerCase().replace(/ /g, "-")}`)); // eslint-disable-line no-extra-parens
    }

    //  #                      #  #         #                 ##   #                             ##
    //  #                      #  #                          #  #  #                              #
    // ###    ##    ###  # #   #  #   ##   ##     ##    ##   #     ###    ###  ###   ###    ##    #
    //  #    # ##  #  #  ####  #  #  #  #   #    #     # ##  #     #  #  #  #  #  #  #  #  # ##   #
    //  #    ##    # ##  #  #   ##   #  #   #    #     ##    #  #  #  #  # ##  #  #  #  #  ##     #
    //   ##   ##    # #  #  #   ##    ##   ###    ##    ##    ##   #  #   # #  #  #  #  #   ##   ###
    /**
     * Gets the team's guild voice channel.
     * @returns {DiscordJs.VoiceChannel} The team's voice channel.
     */
    get teamVoiceChannel() {
        return /** @type {DiscordJs.VoiceChannel} */ (Discord.findChannelByName(`Team ${this.tag}`)); // eslint-disable-line no-extra-parens
    }

    //             ##
    //              #
    // ###    ##    #     ##
    // #  #  #  #   #    # ##
    // #     #  #   #    ##
    // #      ##   ###    ##
    /**
     * Gets the team's role.
     * @returns {DiscordJs.Role} The team's role.
     */
    get role() {
        return Discord.findRoleByName(`Team: ${this.name}`);
    }

    //          #     #   ##                #           #
    //          #     #  #  #               #
    //  ###   ###   ###  #      ###  ###   ###    ###  ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    #  #   #    #  #
    // # ##  #  #  #  #  #  #  # ##  #  #   #    # ##   #    #  #
    //  # #   ###   ###   ##    # #  ###     ##   # #  ###   #  #
    //                               #
    /**
     * Adds a captain to the team.
     * @param {DiscordJs.GuildMember} member The pilot adding the captain.
     * @param {DiscordJs.GuildMember} captain The pilot to add as a captain.
     * @returns {Promise} A promise that resolves when the captain has been added.
     */
    async addCaptain(member, captain) {
        try {
            await Db.addCaptain(this, captain);
        } catch (err) {
            throw new Exception("There was a database error adding a captain.", err);
        }

        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const captainsVoiceChannel = this.captainsVoiceChannel;
            if (!captainsVoiceChannel) {
                throw new Error("Captain's voice channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            await captain.addRole(Discord.captainRole, `${member.displayName} added ${captain.displayName} as a captain of ${this.name}.`);

            await captainsChannel.overwritePermissions(
                captain,
                {"VIEW_CHANNEL": true},
                `${member.displayName} added ${captain.displayName} as a captain of ${this.name}.`
            );

            await captainsVoiceChannel.overwritePermissions(
                captain,
                {"VIEW_CHANNEL": true},
                `${member.displayName} added ${captain.displayName} as a captain of ${this.name}.`
            );

            await this.updateChannels();

            await Discord.queue(`${captain}, you have been added as a captain of **${this.name}**!  You now have access to your team's captain's channel, ${captainsChannel}.  Be sure to read the pinned messages in that channel for more information as to what you can do for your team as a captain.`, captain);
            await Discord.queue(`Welcome **${captain}** as the newest team captain!`, captainsChannel);
            await Discord.queue(`**${captain}** is now a team captain!`, teamChannel);
            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: this.name,
                description: "Leadership Update",
                color: 0x008000,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Captain Added",
                        value: `${captain}`
                    }
                ],
                footer: {
                    text: `added by ${member.displayName}`
                }
            }), Discord.rosterUpdatesChannel);

            await this.updateChannels();
        } catch (err) {
            throw new Exception("There was a critical Discord error adding a captain.  Please resolve this manually as soon as possible.", err);
        }
    }

    //          #     #  ###    #    ##           #
    //          #     #  #  #         #           #
    //  ###   ###   ###  #  #  ##     #     ##   ###
    // #  #  #  #  #  #  ###    #     #    #  #   #
    // # ##  #  #  #  #  #      #     #    #  #   #
    //  # #   ###   ###  #     ###   ###    ##     ##
    /**
     * Adds a pilot to the team.
     * @param {DiscordJs.GuildMember} member The pilot to add.
     * @returns {Promise} A promise that resolves when the pilot has been added.
     */
    async addPilot(member) {
        try {
            await Db.addPilotToTeam(member, this);
        } catch (err) {
            throw new Exception("There was a database error adding a pilot to a team.", err);
        }

        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            await member.addRole(this.role, `${member.displayName} accepted their invitation to ${this.name}.`);

            await this.updateChannels();

            await Discord.queue(`${member}, you are now a member of **${this.name}**!  You now have access to your team's channel, ${teamChannel}.`, member);
            await Discord.queue(`**${member}** has accepted your invitation to join the team!`, captainsChannel);
            await Discord.queue(`**${member}** has joined the team!`, teamChannel);
            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: this.name,
                description: "Pilot Added",
                color: 0x00FF00,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Pilot Added",
                        value: `${member}`
                    }
                ],
                footer: {
                    text: "added by accepted invitation"
                }
            }), Discord.rosterUpdatesChannel);
        } catch (err) {
            throw new Exception("There was a critical Discord error adding a pilot to a team.  Please resolve this manually as soon as possible.", err);
        }
    }

    //                   ##          #  #                    #  #
    //                    #          #  #                    ####
    //  ###  ###   ###    #    #  #  ####   ##   # #    ##   ####   ###  ###
    // #  #  #  #  #  #   #    #  #  #  #  #  #  ####  # ##  #  #  #  #  #  #
    // # ##  #  #  #  #   #     # #  #  #  #  #  #  #  ##    #  #  # ##  #  #
    //  # #  ###   ###   ###     #   #  #   ##   #  #   ##   #  #   # #  ###
    //       #     #            #                                        #
    /**
     * Applies a home map for a team.
     * @param {DiscordJs.GuildMember} member The pilot updating the home map.
     * @param {number} number The number of the home map.
     * @param {string} map The new home map.
     * @returns {Promise} A promise that resolves when the home map has been updated.
     */
    async applyHomeMap(member, number, map) {
        try {
            await Db.applyHomeMap(this, number, map);
        } catch (err) {
            throw new Exception("There was a database error setting a home map for the team the pilot is on.", err);
        }

        try {
            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Guild channel does not exist for the team.");
            }

            await this.updateChannels();

            await Discord.queue(`${member} has changed home map number ${number} to ${map}.`, teamChannel);
        } catch (err) {
            throw new Exception("There was a critical Discord error setting a home map for the team the pilot is on.  Please resolve this manually as soon as possible.", err);
        }
    }

    //                    #           #           ##                      #
    //                    #                      #  #                     #
    //  ##    ###  ###   ###    ###  ##    ###   #      ##   #  #  ###   ###
    // #     #  #  #  #   #    #  #   #    #  #  #     #  #  #  #  #  #   #
    // #     # ##  #  #   #    # ##   #    #  #  #  #  #  #  #  #  #  #   #
    //  ##    # #  ###     ##   # #  ###   #  #   ##    ##    ###  #  #    ##
    //             #
    /**
     * Gets the count of captains on the team.
     * @returns {number} The number of captains on the team.
     */
    captainCount() {
        return this.role.members.filter((tm) => !!Discord.captainRole.members.find((cm) => cm.id === tm.id)).size;
    }

    //       #                              ##         ##
    //       #                             #  #         #
    //  ##   ###    ###  ###    ###   ##   #      ##    #     ##   ###
    // #     #  #  #  #  #  #  #  #  # ##  #     #  #   #    #  #  #  #
    // #     #  #  # ##  #  #   ##   ##    #  #  #  #   #    #  #  #
    //  ##   #  #   # #  #  #  #      ##    ##    ##   ###    ##   #
    //                          ###
    /**
     * Changes the team's color.
     * @param {DiscordJs.GuildMember} member The pilot whose team to change color for.
     * @param {DiscordJs.ColorResolvable} color The color to change to.
     * @returns {Promise} A promise that resolves when the team's color has changed.
     */
    async changeColor(member, color) {
        try {
            await this.role.setColor(color, `${member.displayName} updated the team color.`);
        } catch (err) {
            throw new Exception("There was a Discord error changing a team's color.", err);
        }
    }

    //    #   #           #                    #  ###
    //    #               #                    #   #
    //  ###  ##     ###   ###    ###  ###    ###   #     ##    ###  # #
    // #  #   #    ##     #  #  #  #  #  #  #  #   #    # ##  #  #  ####
    // #  #   #      ##   #  #  # ##  #  #  #  #   #    ##    # ##  #  #
    //  ###  ###   ###    ###    # #  #  #   ###   #     ##    # #  #  #
    /**
     * Disbands the team.
     * @param {DiscordJs.GuildMember} member The pilot disbanding the team.
     * @returns {Promise} A promise that resolves when the team is disbanded.
     */
    async disbandTeam(member) {
        try {
            await Db.disbandTeam(this);
        } catch (err) {
            throw new Exception("There was a database error disbanding a team.", err);
        }

        try {
            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team channel does not exists.");
            }

            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain channel does not exists.");
            }

            const teamVoiceChannel = this.teamVoiceChannel;
            if (!teamVoiceChannel) {
                throw new Error("Team voice channel does not exists.");
            }

            const captainsVoiceChannel = this.captainsVoiceChannel;
            if (!captainsVoiceChannel) {
                throw new Error("Captains voice channel does not exists.");
            }

            const categoryChannel = this.categoryChannel;
            if (!categoryChannel) {
                throw new Error("Team category does not exists.");
            }

            await teamChannel.delete(`${member.displayName} disbanded ${this.name}.`);
            await captainsChannel.delete(`${member.displayName} disbanded ${this.name}.`);
            await teamVoiceChannel.delete(`${member.displayName} disbanded ${this.name}.`);
            await captainsVoiceChannel.delete(`${member.displayName} disbanded ${this.name}.`);
            await categoryChannel.delete(`${member.displayName} disbanded ${this.name}.`);

            const memberList = [];

            for (const memberPair of this.role.members) {
                const teamMember = memberPair[1];

                memberList.push(`${teamMember}`);

                if (Discord.captainRole.members.find((m) => m.id === teamMember.id)) {
                    await teamMember.removeRole(Discord.captainRole, `${member.displayName} disbanded ${this.name}.`);
                }

                if (Discord.founderRole.members.find((m) => m.id === teamMember.id)) {
                    await teamMember.removeRole(Discord.founderRole, `${member.displayName} disbanded ${this.name}.`);
                }

                await Discord.queue(`Your team ${this.name} has been disbanded.`, teamMember);
            }

            await this.role.delete(`${member.displayName} disbanded ${this.name}.`);

            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: `${this.name}`,
                description: "Team Disbanded",
                color: 0xFF00FF,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Pilots Removed",
                        value: `${memberList.join(", ")}`
                    }
                ],
                footer: {
                    text: `disbanded by ${member.displayName}`
                }
            }), Discord.rosterUpdatesChannel);

            this.disbanded = true;
        } catch (err) {
            throw new Exception("There was a critical Discord error disbanding a team.  Please resolve this manually as soon as possible.", err);
        }
    }

    //              #    #  #                    #  #
    //              #    #  #                    ####
    //  ###   ##   ###   ####   ##   # #    ##   ####   ###  ###    ###
    // #  #  # ##   #    #  #  #  #  ####  # ##  #  #  #  #  #  #  ##
    //  ##   ##     #    #  #  #  #  #  #  ##    #  #  # ##  #  #    ##
    // #      ##     ##  #  #   ##   #  #   ##   #  #   # #  ###   ###
    //  ###                                                  #
    /**
     * Gets the list of home maps for the team.
     * @returns {Promise<string[]>} A promise that resolves with a list of the team's home maps.
     */
    async getHomeMaps() {
        try {
            return await Db.getTeamHomeMaps(this);
        } catch (err) {
            throw new Exception("There was a database error getting the home maps for the team the pilot is on.", err);
        }
    }

    //              #    ###    #    ##           #     ##            #  ###                #     #             #   ##                      #
    //              #    #  #         #           #    #  #           #   #                       #             #  #  #                     #
    //  ###   ##   ###   #  #  ##     #     ##   ###   #  #  ###    ###   #    ###   # #   ##    ###    ##    ###  #      ##   #  #  ###   ###
    // #  #  # ##   #    ###    #     #    #  #   #    ####  #  #  #  #   #    #  #  # #    #     #    # ##  #  #  #     #  #  #  #  #  #   #
    //  ##   ##     #    #      #     #    #  #   #    #  #  #  #  #  #   #    #  #  # #    #     #    ##    #  #  #  #  #  #  #  #  #  #   #
    // #      ##     ##  #     ###   ###    ##     ##  #  #  #  #   ###  ###   #  #   #    ###     ##   ##    ###   ##    ##    ###  #  #    ##
    //  ###
    /**
     * Gets the total number of pilots on the team and invited to the team.
     * @returns {Promise<number>} A promise that resolves with the total number of pilots on the team and invited to the team.
     */
    async getPilotAndInvitedCount() {
        try {
            return await Db.getTeamPilotAndInvitedCount(this);
        } catch (err) {
            throw new Exception("There was a database error getting the number of pilots on and invited to a pilot's team.", err);
        }
    }

    //  #                 #     #          ###    #    ##           #
    //                          #          #  #         #           #
    // ##    ###   # #   ##    ###    ##   #  #  ##     #     ##   ###
    //  #    #  #  # #    #     #    # ##  ###    #     #    #  #   #
    //  #    #  #  # #    #     #    ##    #      #     #    #  #   #
    // ###   #  #   #    ###     ##   ##   #     ###   ###    ##     ##
    /**
     * Invites a pilot to the team.
     * @param {DiscordJs.GuildMember} fromMember The member inviting the pilot to the team.
     * @param {DiscordJs.GuildMember} toMember The pilot being invited to the team.
     * @returns {Promise} A promise that resolves when the pilot has been invited to the team.
     */
    async invitePilot(fromMember, toMember) {
        try {
            await Db.invitePilotToTeam(this, toMember);
        } catch (err) {
            throw new Exception("There was a database error inviting a pilot to a team.", err);
        }

        await Discord.queue(`${toMember.displayName}, you have been invited to join **${this.name}** by ${fromMember.displayName}.  You can accept this invitation by responding with \`!accept ${this.name}\`.`, toMember);

        await this.updateChannels();
    }

    //             #           ####                       #
    //             #           #                          #
    // # #    ###  # #    ##   ###    ##   #  #  ###    ###   ##   ###
    // ####  #  #  ##    # ##  #     #  #  #  #  #  #  #  #  # ##  #  #
    // #  #  # ##  # #   ##    #     #  #  #  #  #  #  #  #  ##    #
    // #  #   # #  #  #   ##   #      ##    ###  #  #   ###   ##   #
    /**
     * Transfers the team's founder from one pilot to another.
     * @param {DiscordJs.GuildMember} member The pilot who is the current founder.
     * @param {DiscordJs.GuildMember} pilot The pilot becoming the founder.
     * @returns {Promise} A promise that resolves when the founder has been transferred.
     */
    async makeFounder(member, pilot) {
        try {
            await Db.makeFounder(this, member, pilot);
        } catch (err) {
            throw new Exception("There was a database error transfering a team founder to another pilot.", err);
        }

        try {
            if (!this.role.members.find((m) => m.id === pilot.id)) {
                throw new Error("Pilots are not on the same team.");
            }

            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            await member.removeRole(Discord.founderRole, `${member.displayName} transferred founder of team ${this.name} to ${pilot.displayName}.`);
            await member.addRole(Discord.captainRole, `${member.displayName} transferred founder of team ${this.name} to ${pilot.displayName}.`);

            await pilot.addRole(Discord.founderRole, `${member.displayName} transferred founder of team ${this.name} to ${pilot.displayName}.`);
            await pilot.removeRole(Discord.captainRole, `${member.displayName} transferred founder of team ${this.name} to ${pilot.displayName}.`);

            await captainsChannel.overwritePermissions(
                pilot,
                {"VIEW_CHANNEL": true},
                `${member.displayName} made ${pilot.displayName} the founder of ${this.name}.`
            );

            await this.updateChannels();

            await Discord.queue(`${pilot}, you are now the founder of **${this.name}**!`, pilot);
            await Discord.queue(`${pilot.displayName} is now the team founder!`, captainsChannel);
            await Discord.queue(`${pilot.displayName} is now the team founder!`, teamChannel);
            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: this.name,
                description: "Leadership Update",
                color: 0x800000,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Old Founder",
                        value: `${member}`,
                        inline: true
                    },
                    {
                        name: "New Founder",
                        value: `${pilot}`,
                        inline: true
                    }
                ],
                footer: {
                    text: `changed by ${member.displayName}`
                }
            }), Discord.rosterUpdatesChannel);
        } catch (err) {
            throw new Exception("There was a critical Discord error transfering a team founder to another pilot.  Please resolve this manually as soon as possible.", err);
        }
    }

    //        #    ##           #    #             #    #
    //              #           #    #            # #   #
    // ###   ##     #     ##   ###   #      ##    #    ###
    // #  #   #     #    #  #   #    #     # ##  ###    #
    // #  #   #     #    #  #   #    #     ##     #     #
    // ###   ###   ###    ##     ##  ####   ##    #      ##
    // #
    /**
     * Removes a pilot who left the team.
     * @param {DiscordJs.GuildMember} member The pilot to remove.
     * @returns {Promise} A promise that resolves when the pilot is removed.
     */
    async pilotLeft(member) {
        try {
            await Db.removePilotFromTeam(member, this);
        } catch (err) {
            throw new Exception("There was a database error removing a pilot from a team.", err);
        }

        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            await member.removeRole(Discord.captainRole, `${member.displayName} left the team.`);

            await captainsChannel.overwritePermissions(
                member,
                {"VIEW_CHANNEL": null},
                `${member.displayName} left the team.`
            );

            await member.removeRole(this.role, `${member.displayName} left the team.`);

            await Discord.queue(`${member.displayName} has left the team.`, captainsChannel);
            await Discord.queue(`${member.displayName} has left the team.`, teamChannel);

            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: this.name,
                description: "Pilot Left",
                color: 0xFF0000,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Pilot Left",
                        value: `${member}`
                    }
                ],
                footer: {
                    text: "pilot left team"
                }
            }), Discord.rosterUpdatesChannel);
        } catch (err) {
            throw new Exception("There was a critical Discord error removing a pilot from a team.  Please resolve this manually as soon as possible.", err);
        }
    }

    //              #                  #           #
    //                                 #           #
    // ###    ##   ##    ###    ###   ###    ###  ###    ##
    // #  #  # ##   #    #  #  ##      #    #  #   #    # ##
    // #     ##     #    #  #    ##    #    # ##   #    ##
    // #      ##   ###   #  #  ###      ##   # #    ##   ##
    /**
     * Reinstates a disbanded team with a new founder.
     * @param {DiscordJs.GuildMember} member The new founder reinstating the team.
     * @returns {Promise} A promise that resolves when the team is reinstated.
     */
    async reinstate(member) {
        try {
            await Db.reinstateTeam(member, this);
        } catch (err) {
            throw new Exception("There was a database error reinstating a team.", err);
        }

        this.founder = member;

        try {
            await this.setup(member, true);
        } catch (err) {
            throw new Exception("There was a critical Discord error reinstating a team.  Please resolve this manually as soon as possible.", err);
        }
    }

    //                                      ##                #           #
    //                                     #  #               #
    // ###    ##   # #    ##   # #    ##   #      ###  ###   ###    ###  ##    ###
    // #  #  # ##  ####  #  #  # #   # ##  #     #  #  #  #   #    #  #   #    #  #
    // #     ##    #  #  #  #  # #   ##    #  #  # ##  #  #   #    # ##   #    #  #
    // #      ##   #  #   ##    #     ##    ##    # #  ###     ##   # #  ###   #  #
    //                                                 #
    /**
     * Removes a captain from the team.
     * @param {DiscordJs.GuildMember} member The pilot removing the captain.
     * @param {DiscordJs.GuildMember} captain The captain to remove.
     * @returns {Promise} A promise that resolves when the captain has been removed.
     */
    async removeCaptain(member, captain) {
        try {
            await Db.removeCaptain(this, captain);
        } catch (err) {
            throw new Exception("There was a database error removing a captain.", err);
        }

        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const captainsVoiceChannel = this.captainsVoiceChannel;
            if (!captainsVoiceChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            await captain.removeRole(Discord.captainRole, `${member.displayName} removed ${captain.displayName} as a captain.`);

            await captainsChannel.overwritePermissions(
                captain,
                {"VIEW_CHANNEL": null},
                `${member.displayName} removed ${captain.displayName} as a captain.`
            );

            await captainsVoiceChannel.overwritePermissions(
                captain,
                {"VIEW_CHANNEL": null},
                `${member.displayName} removed ${captain.displayName} as a captain.`
            );

            await this.updateChannels();

            await Discord.queue(`${captain}, you are no longer a captain of **${this.name}**.`, captain);
            await Discord.queue(`${captain.displayName} is no longer a team captain.`, captainsChannel);
            await Discord.queue(`${captain.displayName} is no longer a team captain.`, teamChannel);
            await Discord.richQueue(new DiscordJs.RichEmbed({
                title: this.name,
                description: "Leadership Update",
                color: 0x800000,
                timestamp: new Date(),
                fields: [
                    {
                        name: "Captain Removed",
                        value: `${captain}`
                    }
                ],
                footer: {
                    text: `removed by ${member.displayName}`
                }
            }), Discord.rosterUpdatesChannel);
        } catch (err) {
            throw new Exception("There was a critical Discord error removing a captain.  Please resolve this manually as soon as possible.", err);
        }
    }

    //                                     ###    #    ##           #
    //                                     #  #         #           #
    // ###    ##   # #    ##   # #    ##   #  #  ##     #     ##   ###
    // #  #  # ##  ####  #  #  # #   # ##  ###    #     #    #  #   #
    // #     ##    #  #  #  #  # #   ##    #      #     #    #  #   #
    // #      ##   #  #   ##    #     ##   #     ###   ###    ##     ##
    /**
     * Removes a pilot from the team, whether they are a pilot on the team, someone who has been invited, or someone who has requested to join.
     * @param {DiscordJs.GuildMember} member The pilot removing the pilot.
     * @param {DiscordJs.GuildMember} pilot The pilot to remove.
     * @returns {Promise} A promise that resolves when the pilot has been removed.
     */
    async removePilot(member, pilot) {
        try {
            await Db.removePilotFromTeam(pilot, this);
        } catch (err) {
            throw new Exception("There was a database error removing a pilot from a team.", err);
        }

        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                throw new Error("Captain's channel does not exist for the team.");
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                throw new Error("Team's channel does not exist.");
            }

            if (this.role.members.find((m) => m.id === pilot.id)) {
                await pilot.removeRole(Discord.captainRole, `${member.displayName} removed ${pilot.displayName} from the team.`);

                await captainsChannel.overwritePermissions(
                    pilot,
                    {"VIEW_CHANNEL": null},
                    `${member.displayName} removed ${pilot.displayName} from the team.`
                );

                await pilot.removeRole(this.role, `${member.displayName} removed ${pilot.displayName} from the team.`);

                await Discord.queue(`${pilot}, you have been removed from **${this.name}** by ${member.displayName}.`, pilot);
                await Discord.queue(`${pilot.displayName} has been removed from the team by ${member.displayName}.`, captainsChannel);
                await Discord.queue(`${pilot.displayName} has been removed from the team by ${member.displayName}.`, teamChannel);

                await Discord.richQueue(new DiscordJs.RichEmbed({
                    title: this.name,
                    description: "Pilot Removed",
                    color: 0xFF0000,
                    timestamp: new Date(),
                    fields: [
                        {
                            name: "Pilot Removed",
                            value: `${pilot}`
                        }
                    ],
                    footer: {
                        text: `removed by ${member.displayName}`
                    }
                }), Discord.rosterUpdatesChannel);
            } else {
                await Discord.queue(`${member.displayName} declined to invite ${pilot.displayName}.`, captainsChannel);
            }

            await this.updateChannels();
        } catch (err) {
            throw new Exception("There was a critical Discord error removing a pilot from a team.  Please resolve this manually as soon as possible.", err);
        }
    }

    //               #
    //               #
    //  ###    ##   ###   #  #  ###
    // ##     # ##   #    #  #  #  #
    //   ##   ##     #    #  #  #  #
    // ###     ##     ##   ###  ###
    //                          #
    /**
     * Sets up the team on Discord.
     * @param {DiscordJs.GuildMember} founder The founder of the team.
     * @param {boolean} reinstating Whether the team is being reinstated.
     * @returns {Promise} A promise that resolves when the team is setup on Discord.
     */
    async setup(founder, reinstating) {
        const existingRole = Discord.findRoleByName(`Team: ${this.name}`);
        if (existingRole) {
            throw new Error("Team role already exists.");
        }

        const existingCategory = Discord.findChannelByName(this.name);
        if (existingCategory) {
            throw new Error("Team category already exists.");
        }

        const channelName = `team-${this.tag.toLowerCase().replace(/ /g, "-")}`,
            existingChannel = Discord.findChannelByName(channelName);
        if (existingChannel) {
            throw new Error("Team channel already exists.");
        }

        const captainsChannelName = `captains-${this.tag.toLowerCase().replace(/ /g, "-")}`,
            existingCaptainsChannel = Discord.findChannelByName(captainsChannelName);
        if (existingCaptainsChannel) {
            throw new Error("Captains channel already exists.");
        }

        const voiceChannelName = `Team ${this.tag}`,
            existingVoiceChannel = Discord.findChannelByName(voiceChannelName);
        if (existingVoiceChannel) {
            throw new Error("Team voice channel already exists.");
        }

        const voiceCaptainsChannelName = `Captains ${this.tag}`,
            existingVoiceCaptainsChannel = Discord.findChannelByName(voiceCaptainsChannelName);
        if (existingVoiceCaptainsChannel) {
            throw new Error("Captains voice channel already exists.");
        }

        const teamRole = await Discord.createRole({
            name: `Team: ${this.name}`,
            mentionable: false
        }, `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await founder.addRole(Discord.founderRole, `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await founder.addRole(teamRole, `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        const category = await Discord.createChannel(this.name, "category", [
            {
                id: Discord.id,
                deny: ["VIEW_CHANNEL"]
            }, {
                id: teamRole.id,
                allow: ["VIEW_CHANNEL"]
            }
        ], `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        const teamChannel = await Discord.createChannel(channelName, "text", [
            {
                id: Discord.id,
                deny: ["VIEW_CHANNEL"]
            }, {
                id: teamRole.id,
                allow: ["VIEW_CHANNEL"]
            }
        ], `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await teamChannel.setParent(category);

        const captainsChannel = await Discord.createChannel(captainsChannelName, "text", [
            {
                id: Discord.id,
                deny: ["VIEW_CHANNEL"]
            }, {
                id: founder.id,
                allow: ["VIEW_CHANNEL"]
            }
        ], `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await captainsChannel.setParent(category);

        const teamVoiceChannel = await Discord.createChannel(voiceChannelName, "voice", [
            {
                id: Discord.id,
                deny: ["VIEW_CHANNEL"]
            }, {
                id: teamRole.id,
                allow: ["VIEW_CHANNEL"]
            }
        ], `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await teamVoiceChannel.setParent(category);
        await teamVoiceChannel.edit({bitrate: 64000});

        const captainsVoiceChannel = await Discord.createChannel(voiceCaptainsChannelName, "voice", [
            {
                id: Discord.id,
                deny: ["VIEW_CHANNEL"]
            }, {
                id: founder.id,
                allow: ["VIEW_CHANNEL"]
            }
        ], `${founder.displayName} ${reinstating ? "reinstated" : "created"} the team ${this.name}.`);

        await captainsVoiceChannel.setParent(category);
        await captainsVoiceChannel.edit({bitrate: 64000});

        await Discord.richQueue(new DiscordJs.RichEmbed({
            title: `${this.name} (${this.tag})`,
            description: reinstating ? "Team Reinstated" : "New Team",
            color: 0x0000FF,
            timestamp: new Date(),
            fields: [
                {
                    name: "Founder Added",
                    value: `${founder}`
                }
            ],
            footer: {
                text: `${reinstating ? "reinstated" : "created"} by ${founder.displayName}`
            }
        }), Discord.rosterUpdatesChannel);

        const msg1 = await Discord.richQueue(new DiscordJs.RichEmbed({
            title: "Founder commands",
            color: 0x00FF00,
            timestamp: new Date(),
            fields: [
                {
                    name: "!color ([light|dark]) [red|orange|yellow|green|indigo|blue|purple]",
                    value: "Set the color for display in Discord."
                },
                {
                    name: "!addcaptain <teammate>",
                    value: "Makes a teammate a captain."
                },
                {
                    name: "!removecaptain <captain>",
                    value: "Removes a captain.  Does not remove them from the team."
                },
                {
                    name: "!disband",
                    value: "Disbands the team."
                },
                {
                    name: "!makefounder <teammate>",
                    value: "Replace yourself with another teammate."
                }
            ]
        }), this.captainsChannel);

        if (msg1) {
            await msg1.pin();
        }

        const msg2 = await Discord.richQueue(new DiscordJs.RichEmbed({
            title: "Captain commands",
            color: 0x00FF00,
            timestamp: new Date(),
            fields: [
                {
                    name: "!home [1|2|3] <map>",
                    value: "Set a home map.  You must set all 3 home maps before you can send or receive challenges."
                },
                {
                    name: "!invite <pilot>",
                    value: "Invite a pilot to join your team."
                },
                {
                    name: "!remove <pilot>",
                    value: "Removes a pilot from the team, or revokes a pilot's invitation, or removes a pilot's request to join the team."
                },
                {
                    name: "!challenge <team>",
                    value: "Challenge a team to a match."
                }
            ]
        }), this.captainsChannel);

        if (msg2) {
            await msg2.pin();
        }

        await this.updateChannels();
    }

    //                #         #           ##   #                             ##
    //                #         #          #  #  #                              #
    // #  #  ###    ###   ###  ###    ##   #     ###    ###  ###   ###    ##    #     ###
    // #  #  #  #  #  #  #  #   #    # ##  #     #  #  #  #  #  #  #  #  # ##   #    ##
    // #  #  #  #  #  #  # ##   #    ##    #  #  #  #  # ##  #  #  #  #  ##     #      ##
    //  ###  ###    ###   # #    ##   ##    ##   #  #   # #  #  #  #  #   ##   ###   ###
    //       #
    /**
     * Updates the team's channels.
     * @returns {Promise} A promise that resolves when the team's channels have been updated.
     */
    async updateChannels() {
        try {
            const captainsChannel = this.captainsChannel;
            if (!captainsChannel) {
                Log.exception(`Captain's channel does not exist.  Please update ${this.name} manually.`);
                return;
            }

            const teamChannel = this.teamChannel;
            if (!teamChannel) {
                Log.exception(`Team's channel does not exist.  Please update ${this.name} manually.`);
                return;
            }

            let teamInfo;
            try {
                teamInfo = await Db.getTeamInfo(this);
            } catch (err) {
                Log.exception(`There was a database error retrieving team information.  Please update ${this.name} manually.`, err);
                return;
            }

            let topic = `${this.name}\nhttp://overloadteamsleague.org/team/${this.tag}\n\nRoster:`;

            teamInfo.members.forEach((member) => {
                topic += `\n${member.name}`;
                if (member.role) {
                    topic += ` - ${member.role}`;
                }
            });

            let channelTopic = topic,
                captainsChannelTopic = topic;

            if (teamInfo.homes && teamInfo.homes.length > 0) {
                channelTopic += "\n\nHome Maps:";
                teamInfo.homes.forEach((home) => {
                    channelTopic += `\n${home}`;
                });
            }

            if (teamInfo.upcomingMatches && teamInfo.upcomingMatches.length > 0) {
                channelTopic += "\n\nUpcoming matches:";
                teamInfo.upcomingMatches.forEach((match) => {
                    channelTopic += `\n${match.opponent} - ${match.date.toLocaleTimeString("en-us", {timeZone: "GMT", hour12: true, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZoneName: "short"})}`;
                    if (match.map) {
                        channelTopic += ` - ${match.map}`;
                    }
                });
            }

            if (teamInfo.recentMatches && teamInfo.recentMatches.length > 0) {
                channelTopic += "\n\nRecentMatches:";
                teamInfo.recentMatches.forEach((match) => {
                    channelTopic += `\n${match.date} - ${match.result} - ${match.score}-${match.opponentScore} - ${match.opponent} - ${match.map}`;
                });
            }

            if (teamInfo.requests && teamInfo.requests.length > 0) {
                captainsChannelTopic += "\n\nRequests:";
                teamInfo.requests.forEach((request) => {
                    captainsChannelTopic += `\n${request.name} - ${request.date.toLocaleTimeString("en-us", {timeZone: "GMT", hour12: true, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZoneName: "short"})}`;
                });
            }

            if (teamInfo.invites && teamInfo.invites.length > 0) {
                captainsChannelTopic += "\n\nInvites:";
                teamInfo.invites.forEach((invite) => {
                    captainsChannelTopic += `\n${invite.name} - ${invite.date.toLocaleTimeString("en-us", {timeZone: "GMT", hour12: true, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZoneName: "short"})}`;
                });
            }

            await teamChannel.setTopic(channelTopic, "Team topic update requested.");
            teamChannel.topic = channelTopic;

            await captainsChannel.setTopic(captainsChannelTopic, "Team topic update requested.");
            captainsChannel.topic = captainsChannelTopic;
        } catch (err) {
            Log.exception(`There was an error updating team information for ${this.name}.  Please update ${this.name} manually.`, err);
        }
    }
}

module.exports = Team;
