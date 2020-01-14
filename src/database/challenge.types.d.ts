type ChallengeData = {
    ChallengeId: number,
    ChallengingTeamId: number,
    ChallengedTeamId: number
}

type CTFStats = {
    Captures: number,
    Pickups: number,
    CarrierKills: number,
    Returns: number
}

type GameStats = KDAStats & {
    Damage: number
}

type KDAStats = {
    Kills: number,
    Assists: number,
    Deaths: number
}

export type ClockRecordsets = {
    recordsets: [
        {
            DateClocked: Date,
            DateClockDeadline: Date
        }[]
    ]
}

export type CloseRecordsets = {
    recordsets: [
        {
            PlayerId: number
        }[]
    ]
}

export type ConfirmGameTypeRecordsets = {
    recordsets: [
        {
            Map: string
        }[]
    ]
}

export type CreateRecordsets = {
    recordsets: [
        {
            ChallengeId: number,
            OrangeTeamId: number,
            BlueTeamId: number,
            HomeMapTeamId: number,
            Team1Penalized: boolean,
            Team2Penalized: boolean
        }[]
    ]
}

export type ExtendRecordsets = {
    recordsets: [
        {
            DateClockDeadline: Date
        }[]
    ]
}

export type GetAllByTeamRecordsets = {
    recordsets: [
        ChallengeData[]
    ]
}

export type GetAllByTeamsRecordsets = {
    recordsets: [
        ChallengeData[]
    ]
}

export type GetByIdRecordsets = {
    recordsets: [
        ChallengeData[]
    ]
}

export type GetByTeamsRecordsets = {
    recordsets: [
        ChallengeData[]
    ]
}

export type GetCastDataRecordsets = {
    recordsets: [
        (GameStats & CTFStats & {
            ChallengingTeamWins: number,
            ChallengingTeamLosses: number,
            ChallengingTeamTies: number,
            ChallengingTeamRating: number,
            ChallengedTeamWins: number,
            ChallengedTeamLosses: number,
            ChallengedTeamTies: number,
            ChallengedTeamRating: number,
            ChallengingTeamHeadToHeadWins: number,
            ChallengedTeamHeadToHeadWins: number,
            HeadToHeadTies: number,
            ChallengingTeamId: number,
            ChallengingTeamScore: number,
            ChallengedTeamId: number,
            ChallengedTeamScore: number,
            Map: string,
            GameType: string,
            MatchTime: Date,
            Name: string,
            TeamId: number
        })[],
        (GameStats & CTFStats & {
            Name: string,
            Games: number,
            GamesWithDamage: number,
            DeathsInGamesWithDamage: number,
            TwitchName: string
        })[],
        (GameStats & CTFStats & {
            Name: string,
            Games: number,
            GamesWithDamage: number,
            DeathsInGamesWithDamage: number,
            TwitchName: string
        })[]
    ]
}

export type GetDamageRecordsets = {
    recordsets: [
        {
            DiscordId: string,
            Name: string,
            TeamId: number,
            OpponentDiscordId: string,
            OpponentName: string,
            Weapon: string,
            Damage: number
        }[]
    ]
}

export type GetDetailsRecordsets = {
    recordsets: [
        {
            Title: string,
            OrangeTeamId: number,
            BlueTeamId: number,
            Map: string,
            TeamSize: number,
            MatchTime: Date,
            Postseason: boolean,
            HomeMapTeamId: number,
            AdminCreated: boolean,
            HomesLocked: boolean,
            UsingHomeMapTeam: boolean,
            ChallengingTeamPenalized: boolean,
            ChallengedTeamPenalized: boolean,
            SuggestedMap: string,
            SuggestedMapTeamId: number,
            SuggestedTeamSize: number,
            SuggestedTeamSizeTeamId: number,
            SuggestedTime: Date,
            SuggestedTimeTeamId: number,
            ReportingTeamId: number,
            ChallengingTeamScore: number,
            ChallengedTeamScore: number,
            DateAdded: Date,
            DateClocked: Date,
            ClockTeamId: number,
            DiscordId: string,
            DateClockDeadline: Date,
            DateClockDeadlineNotified: Date,
            DateReported: Date,
            DateConfirmed: Date,
            DateClosed: Date,
            DateRematchRequested: Date,
            RematchTeamId: number,
            DateRematched: Date,
            OvertimePeriods: number,
            DateVoided: Date,
            VoD: string,
            RatingChange: number,
            ChallengingTeamRating: number,
            ChallengedTeamRating: number,
            GameType: string,
            SuggestedGameType: string,
            SuggestedGameTypeTeamId: number
        }[],
        {
            Map: string
        }[]
    ]
}

export type GetNotificationsRecordsets = {
    recordsets: [
        {
            ChallengeId: number,
            DateClockDeadline: Date
        }[],
        {
            ChallengeId: number,
            MatchTime: Date
        }[],
        {
            ChallengeId: number,
            MatchTime: Date
        }[]
    ]
}

export type GetStatsForTeamRecordsets = {
    recordsets: [
        (GameStats & CTFStats & {
            DiscordId: string,
            Name: string            
        })[]
    ]
}

export type GetStreamersRecordsets = {
    recordsets: [
        {
            DiscordId: string,
            TwitchName: string
        }[]
    ]
}

export type GetTeamDetailsRecordsets = {
    recordsets: [
        {
            TeamId: number,
            Name: string,
            Tag: string,
            Rating: number,
            Wins: number,
            Losses: number,
            Ties: number
        }[],
        (KDAStats & CTFStats & {
            PlayerId: number,
            Name: string,
            TeamId: number,
            TwitchName: string
        })[],
        {
            PlayerId: number,
            Name: string,
            TeamId: number,
            OpponentName: string,
            OpponentTeamId: number,
            Weapon: string,
            Damage: number
        }[],
        {
            Season: number,
            Postseason: boolean
        }[]
    ]
}
