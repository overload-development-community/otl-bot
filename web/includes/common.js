/**
 * @typedef {import("express").Request} Express.Request
 */

const HtmlMinifier = require("html-minifier"),
    pjson = require("../../package.json"),
    settings = require("../../settings"),

    nameAngledBracketTagStart = /^<.*> /,
    nameBraceTagStart = /^\{.*\} /,
    nameBracketTagStart = /^\[.*\] /,
    nameDesignaterEnd = / - .*$/,
    nameParenthesisEnd = / \(.*\)$/,
    nameParenthesisTagStart = /^\(.*\) /;

/**
 * @type {typeof import("../../public/views/index")}
 */
let IndexView;

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that handles common web functions.
 */
class Common {
    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {string} The HTML of the full web page.
     */
    static page(head, html, req) {
        if (!IndexView) {
            IndexView = require("../../public/views/index");
        }

        return HtmlMinifier.minify(
            IndexView.get({
                head,
                html,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                year: new Date().getFullYear(),
                version: pjson.version
            }),
            settings.htmlMinifier
        );
    }

    //   #               ###
    //  # #               #
    //  #     ###  # #    #     ##    ##   ###
    // ###   #  #  # #    #    #     #  #  #  #
    //  #    # ##  # #    #    #     #  #  #  #
    //  #     # #   #    ###    ##    ##   #  #
    /**
     * Returns the HTML to generate the favicon.
     * @returns {string} The HTML to generate the favicon.
     */
    static favIcon() {
        return /* html */`
            <meta name="apple-mobile-web-app-title" content="Overload Teams League">
            <meta name="application-name" content="Overload Teams League">
            <meta name="msapplication-TileColor" content="#ff9900">
            <meta name="msapplication-config" content="/images/browserconfig.xml">
            <meta name="theme-color" content="#ffffff">
            <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
            <link rel="manifest" href="/images/site.webmanifest">
            <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#ff9900">
            <link rel="shortcut icon" href="/images/favicon.ico">
        `;
    }

    // #      #          ##    ####                       #
    // #      #           #    #                          #
    // ###   ###   # #    #    ###   ###    ##    ##    ###   ##
    // #  #   #    ####   #    #     #  #  #     #  #  #  #  # ##
    // #  #   #    #  #   #    #     #  #  #     #  #  #  #  ##
    // #  #    ##  #  #  ###   ####  #  #   ##    ##    ###   ##
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);
    }

    //   #          ####                       #
    //              #                          #
    //   #    ###   ###   ###    ##    ##    ###   ##
    //   #   ##     #     #  #  #     #  #  #  #  # ##
    //   #     ##   #     #  #  #     #  #  #  #  ##
    // # #   ###    ####  #  #   ##    ##    ###   ##
    //  #
    /**
     * Javascript-encodes a string.
     * @param {*} str The string.
     * @returns {string} The encoded string.
     */
    static jsEncode(str) {
        return str.replace(/"/gim, "\\\"");
    }

    //                               ##     #                #  #
    //                                #                      ## #
    // ###    ##   ###   # #    ###   #    ##    ####   ##   ## #   ###  # #    ##
    // #  #  #  #  #  #  ####  #  #   #     #      #   # ##  # ##  #  #  ####  # ##
    // #  #  #  #  #     #  #  # ##   #     #     #    ##    # ##  # ##  #  #  ##
    // #  #   ##   #     #  #   # #  ###   ###   ####   ##   #  #   # #  #  #   ##
    /**
     * Normalizes a player name so that it doesn't start with a tag or end with a position designater.
     * @param {string} name The player's name.
     * @param {string} tag The player's team tag.
     * @returns {string} The normalized name.
     */
    static normalizeName(name, tag) {
        if (tag && name.toLowerCase().startsWith(`${tag.toLowerCase()} `)) {
            name = name.substring(tag.length + 1);
        }

        return name.replace(nameParenthesisTagStart, "").replace(nameBracketTagStart, "").replace(nameBraceTagStart, "").replace(nameAngledBracketTagStart, "").replace(nameDesignaterEnd, "").replace(nameParenthesisEnd, "");
    }
}

Common.route = {
    include: true
};

module.exports = Common;
