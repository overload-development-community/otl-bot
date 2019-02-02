const HtmlMinifier = require("html-minifier"),

    Common = require("./common"),

    settings = require("../settings");

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

//    #    #                     #
//   # #   #                     #
//  #   #  # ##    ###   #   #  ####
//  #   #  ##  #  #   #  #   #   #
//  #####  #   #  #   #  #   #   #
//  #   #  ##  #  #   #  #  ##   #  #
//  #   #  # ##    ###    ## #    ##
/**
 * A class that represents the about page.
 */
class About {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {void}
     */
    static get(req, res) {
        const html = Common.page(/* html */`
            <link rel="stylesheet" href="/css/about.css" />
        `, /* html */`
            <div id="about">
                <div class="section">About the Overload Teams League</div>
                <div class="text">
                    The Overload Teams League is a community of players who compete in the game <a href="http://playoverload.com" target="_blank">Overload</a>, a Six Degrees of Freedom First Person Shooter by Revival Productions.<br /><br />
                    To play, join the Discord server (link is at the bottom of the page), where you may join an existing team or create your own.  For rules specific to the league, please see the Rules section on the Discord server.
                </div>
                <div class="section">Discord Bot Commands</div>
                <div class="text">
                    The following commands are available on the Discord server.  You may issue most commands in any channel, or in private messages to The Fourth Sovereign.  Don't worry, she won't try to absorb your consciousness into her own.
                </div>
                <div id="commands">
                    <div class="header">Command</div>
                    <div class="header">Description</div>
                    <div class="header">Examples</div>

                    <div class="section">Basic Commands</div>

                    <div class="command">!help</div>
                    <div>Get a link to this page.</div>
                    <div class="example">!help</div>

                    <div class="command">!version</div>
                    <div>Get the version of the bot.</div>
                    <div class="example">!version</div>

                    <div class="command">!website</div>
                    <div>Get a link to the website.</div>
                    <div class="example">!website</div>

                    <div class="command">!timezone &lt;timezone></div>
                    <div>Changes your personal time zone.  See #timezone-faq on the Discord server for details.</div>
                    <div class="example">!timezone America/Los_Angeles<br />!timezone Europe/Berlin</div>

                    <div class="command">!twitch &lt;channel></div>
                    <div>Sets your Twitch channel.  Useful if you will be streaming your team's matches, or if you will be casting matches.</div>
                    <div class="example">!twitch kantor</div>

                    <div class="command">!removetwitch</div>
                    <div>Unsets your Twitch channel.</div>
                    <div class="example">!removetwitch</div>

                    <div class="command">!next</div>
                    <div>List the upcoming scheduled matches.</div>
                    <div class="example">!next</div>

                    <div class="command">!matchtime &lt;challengeId></div>
                    <div>Gets the match time in your local time zone.</div>
                    <div class="example">!matchtime 12</div>

                    <div class="command">!countdown &lt;challengeId></div>
                    <div>Gets the amount of time until the match begins.</div>
                    <div class="example">!countdown 12</div>

                    <div class="command">!cast (&lt;challengeId>|next)</div>
                    <div>Indicates that you wish to cast a scheduled match that you are not playing in.  You can get the challenge ID from the #scheduled-matches channel on Discord.  You will join the challenge channel and be able to coordinate your efforts with both teams.  You can see what match is next by using the word "next" instead of a challenge ID.</div>
                    <div class="example">!cast 1<br />!cast next</div>

                    <div class="command">!uncast</div>
                    <div>You must use this command in a challenge room you are casting a match for.  Indicates that you no longer wish to cast a scheduled match.</div>
                    <div class="example">!uncast</div>

                    <div class="command">!stats [&lt;pilot>]</div>
                    <div>Gets the current season stats for the player, or yourself if used without mentioning a pilot.</div>
                    <div class="example">!stats @Kantor<br />!stats</div>

                    <div class="command">!request &lt;team></div>
                    <div>Request to join a team.</div>
                    <div class="example">!request CF<br />!request Cronus Frontier</div>

                    <div class="command">!accept &lt;team></div>
                    <div>Accepts an invitation to join a team.</div>
                    <div class="example">!accept CF<br />!accept Cronus Frontier</div>

                    <div class="command">!leave</div>
                    <div>Leaves your current team.</div>
                    <div class="example">!leave</div>

                    <div class="section">Team Creation</div>

                    <div class="command">!createteam</div>
                    <div>Begins the process of creating a new team.  This will create a new channel where you can complete creation of your team.</div>
                    <div class="example">!createteam</div>

                    <div class="command">!name &lt;name></div>
                    <div>Names your team.  Must be between 6 and 25 characters.  Use only alpha-numeric characters and spaces.</div>
                    <div class="example">!name Cronus Frontier</div>

                    <div class="command">!tag &lt;tag></div>
                    <div>Creates a tag for that represents your team in short form.  Must be 5 characters or less.  Use only alpha-numeric characters.</div>
                    <div class="example">!tag CF</div>

                    <div class="command">!cancel</div>
                    <div>Cancels the process of creating a new team, removing the new team channel.</div>
                    <div class="example">!cancel</div>

                    <div class="command">!complete</div>
                    <div>Completes the process of creating a new team.  This will create four new channels for use by your new team.  There are two text channels and two voice channels, one of each for the team and one of each for the team's leadership.  Your team will also be officially added to the website.</div>
                    <div class="example">!complete</div>

                    <div class="section">Team Management</div>

                    <div class="command">!color<br />[(light|dark)]<br />(red|orange|yellow|green|blue|purple)</div>
                    <div>Founder only.  Gives your team role a color on the Discord server.</div>
                    <div class="example">!color red<br />!color dark green</div>

                    <div class="command">!teamtimezone &lt;timezone></div>
                    <div>Changes your team's time zone.  See #timezone-faq on the Discord server for details.</div>
                    <div class="example">!teamtimezone America/Los_Angeles<br />!teamtimezone Europe/Berlin</div>

                    <div class="command">!home (1|2|3) &lt;map></div>
                    <div>Founder only.  Sets a map for your team.  You must have 3 maps set before you can issue a challenge.</div>
                    <div class="example">!home 1 Vault<br />!home 2 Wraith<br />!home 3 Terminal</div>

                    <div class="command">!invite &lt;pilot></div>
                    <div>Founder or Captain only.  Invites a pilot to your team.  You must have 2 pilots on your team before you can issue a challenge.</div>
                    <div class="example">!invite @Kantor</div>

                    <div class="command">!remove &lt;pilot></div>
                    <div>Founder or Captain only.  Removes a pilot from the team, or cancels a request or invitation from the pilot.</div>
                    <div class="example">!remove @Kantor</div>

                    <div class="command">!addcaptain &lt;pilot></div>
                    <div>Founder only.  Adds a captain from your roster to your team, up to two captains.</div>
                    <div class="example">!addcaptain @Kantor</div>

                    <div class="command">!removecaptain &lt;pilot></div>
                    <div>Founder only.  Removes a captain from your team.  The player will remain on your roster.</div>
                    <div class="example">!removecaptain @Kantor</div>

                    <div class="command">!disband</div>
                    <div>Founder only.  Disbands your team.  Clears your roster (including you), removes your team channels, and sets your team as disbanded on the website.</div>
                    <div class="example">!disband</div>

                    <div class="command">!makefounder &lt;pilot></div>
                    <div>Founder only.  Transfers ownership of your team to another pilot.  You remain on the roster as a captain.  Note that if this puts your team above the team limit of 2 captains, you cannot issue this command until you remove another captain.</div>
                    <div class="example">!makefounder @Kantor</div>

                    <div class="command">!reinstate &lt;team></div>
                    <div>Reinstates a disbanded team.  You must have previously been a founder or captain of the team you are trying to reinstate.</div>
                    <div class="example">!reinstate CF<br />!reinstate Cronus Frontier</div>

                    <div class="command">!challenge &lt;team></div>
                    <div>Founder or Captain only.  Challenges another team to a match.  Creates a challenge channel where you can negotiate the match parameters with the other team.</div>
                    <div class="example">!challenge CF<br />!challenge Cronus Frontier</div>

                    <div class="section">Challenges (Only allowed in challenge channels)</div>

                    <div class="command">!matchtime</div>
                    <div>Gets the match time in your local time zone.</div>
                    <div class="example">!matchtime</div>

                    <div class="command">!countdown</div>
                    <div>Gets the amount of time until the match begins.</div>
                    <div class="example">!countdown</div>

                    <div class="command">!deadline</div>
                    <div>Gets the clock deadilne in your local time zone.</div>
                    <div class="example">!deadline</div>

                    <div class="command">!deadlinecountdown</div>
                    <div>Gets the amount of time until the clock deadline expires.</div>
                    <div class="example">!deadlinecountdown</div>

                    <div class="command">!streaming</div>
                    <div>Indicates that you will be streaming this match as you play it.</div>
                    <div class="example">!streaming</div>

                    <div class="command">!notstreaming</div>
                    <div>Indicates that you will not be streaming this match as you play it.  This is the default, you only need to issue this command if you previously used the !streaming command but no longer will be streaming the match as you play.</div>
                    <div class="example">!notstreaming</div>

                    <div class="command">!pickmap (a|b|c)</div>
                    <div>Founder or Captain only.  Picks a map from the home map team's home maps and locks in that map for the match.  Cannot be used once the map is locked in.</div>
                    <div class="example">!pickmap b</div>

                    <div class="command">!suggestmap &lt;map></div>
                    <div>Founder or Captain only.  Suggests a neutral map.  The suggested map cannot be one of the home map team's home maps.  Cannot be used once the map is locked in.</div>
                    <div class="example">!suggestmap Vault</div>

                    <div class="command">!confirmmap</div>
                    <div>Founder or Captain only.  Confirms a neutral map suggestion from the other team and locks in that map for the match.  Cannot be used once the map is locked in.</div>
                    <div class="example">!confirmmap</div>

                    <div class="command">!suggestneutralserver</div>
                    <div>Founder or Captain only.  Suggests a neutral server.</div>
                    <div class="example">!suggestneutralserver</div>

                    <div class="command">!confirmneutralserver</div>
                    <div>Founder or Captain only.  Confirms a neutral server suggestion from the other team.</div>
                    <div class="example">!confirmneutralserver</div>

                    <div class="command">!suggestteamsize (2|3|4)</div>
                    <div>Founder or Captain only.  Suggests the team size for the match.</div>
                    <div class="example">!suggestteamsize 3</div>

                    <div class="command">!confirmteamsize</div>
                    <div>Founder or Captain only.  Confirms a team size suggestion from the other team.</div>
                    <div class="example">!confirmteamsize</div>

                    <div class="command">!suggesttime (&lt;date and time&gt;|now)</div>
                    <div>Founder or Captain only.  Suggests a date and time for the challenge.  Uses your personal time zone.</div>
                    <div class="example">!suggesttime 3/14 3:00 PM<br />!suggesttime Mar 14 15:00<br />!suggesttime now</div>

                    <div class="command">!confirmtime</div>
                    <div>Founder or Captain only.  Confirms a match time suggestion from the other team.</div>
                    <div class="example">!confirmtime</div>

                    <div class="command">!clock</div>
                    <div>Founder or Captain only.  Puts a challenge on the clock, giving both teams 28 days to schedule and play the match.  Limits apply, see #challenges on the Discord server for details.</div>
                    <div class="example">!clock</div>

                    <div class="command">!report &lt;score1> &lt;score2></div>
                    <div>Founder or Captain only.  Reports the score, indicating that your team has not won the match.</div>
                    <div class="example">!report 62 39<br />!report 45 78<br />!report 63 63</div>

                    <div class="command">!confirm</div>
                    <div>Founder or Captain only.  Confirms the score reported by the other team.</div>
                    <div class="example">!confirm</div>

                    <div class="command">!rematch</div>
                    <div>Founder or Captain only.  Requests a rematch.  Both teams must enter this command.  Once that happens, this will create a new challenge room with normal parameters, except the home server team will be swapped (or remain neutral if it was neutral for this game), the team size will remain the same as the previous match, and the match time will be set to start immediately.</div>
                    <div class="example">!rematch</div>
                </div>
            </div>
        `, req);

        res.status(200).send(HtmlMinifier.minify(html, settings.htmlMinifier));
    }
}

module.exports = About.get;
