const { gql } = require('apollo-server');

const typeDefs = gql`

    type User {
        user_id: ID!
        name: String
        email: String
        role: String
        profile_picture: String
        created_at: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Sport {
        sport_id: ID!
        name: String
        category: String
    }

    type Player {
        player_id: ID!
        name: String
        number: Int
        position: String
        age: Int
    }

    type Team {
        team_id: ID!
        name: String
        logo: String
        coach: String
        description: String
        sport_id: ID
        created_at: String
    }

    type TeamPlayer {
        team_player_id: ID!
        player_id: ID
        team_id: ID
        join_date: String
        leave_date: String
    }

    type FavoriteTeam {
        favorite_id: ID!
        user_id: ID
        team_id: ID
        created_at: String
    }

    type MatchGame {
        match_id: ID!
        home_team_id: ID
        away_team_id: ID
        match_date: String
        location: String
        home_score: Int
        away_score: Int
        status: String
    }

    type News {
        news_id: ID!
        title: String
        content: String
        image: String
        created_at: String
        team_id: ID
        user_id: ID
    }

    type ForumPost {
        post_id: ID!
        title: String
        content: String
        created_at: String
        user_id: ID
        team_id: ID
    }

    type Comment {
        comment_id: ID!
        content: String
        created_at: String
        user_id: ID
        post_id: ID
    }

    type Query {
        users: [User]
        user(user_id: Int!): User

        sports: [Sport]
        sport(sport_id: Int!): Sport

        players: [Player]
        player(player_id: Int!): Player

        teams: [Team]
        team(team_id: Int!): Team
        teamsBySport(sport_id: Int!): [Team]

        teamPlayers: [TeamPlayer]
        teamPlayersByTeam(team_id: Int!): [TeamPlayer]

        favoriteTeams: [FavoriteTeam]
        favoriteTeamsByUser(user_id: Int!): [FavoriteTeam]

        matches: [MatchGame]
        match(match_id: Int!): MatchGame
        matchesByStatus(status: String!): [MatchGame]

        allNews: [News]
        newsById(news_id: Int!): News
        newsByTeam(team_id: Int!): [News]

        forumPosts: [ForumPost]
        forumPost(post_id: Int!): ForumPost
        forumPostsByTeam(team_id: Int!): [ForumPost]

        comments(post_id: Int!): [Comment]

        playersByTeam(team_id: Int!): [Player]

        matchesByTeam(team_id: Int!): [MatchGame]

        searchTeams(name: String!): [Team]
    }

    type Mutation {
        register(name: String!, email: String!, password: String!, role: String): AuthPayload!
        login(email: String!, password: String!): AuthPayload!

        addSport(name: String!, category: String): Sport!
        updateSport(sport_id: Int!, name: String, category: String): Sport!
        deleteSport(sport_id: Int!): ID!

        addPlayer(
        name: String!,
        number: Int,
        position: String,
        age: Int,
        team_id: Int
        ): Player!
        
        updatePlayer(
        player_id: Int!,
        name: String,
        number: Int,
        position: String,
        age: Int
        ): Player!

        deletePlayer(
        player_id: Int!
        ): ID!       

        addTeam(name: String!, logo: String, coach: String, description: String, sport_id: Int!): Team!
        updateTeam(team_id: Int!, name: String, logo: String, coach: String, description: String): Team!
        deleteTeam(team_id: Int!): ID!

        addTeamPlayer(player_id: Int!, team_id: Int!, join_date: String, leave_date: String): TeamPlayer!
        deleteTeamPlayer(team_player_id: Int!): ID!

        addFavoriteTeam(user_id: Int!, team_id: Int!): FavoriteTeam!
        deleteFavoriteTeam(favorite_id: Int!): ID!

        addMatch(home_team_id: Int!, away_team_id: Int!, match_date: String, location: String, home_score: Int, away_score: Int, status: String): MatchGame!
        updateMatch(match_id: Int!, home_score: Int, away_score: Int, status: String, location: String): MatchGame!
        deleteMatch(match_id: Int!): ID!

        addNews(title: String!, content: String!, image: String, team_id: Int, user_id: Int!): News!
        updateNews(news_id: Int!, title: String, content: String, image: String): News!
        deleteNews(news_id: Int!): ID!

        addForumPost(title: String!, content: String!, user_id: Int!, team_id: Int): ForumPost!
        updateForumPost(post_id: Int!, title: String, content: String): ForumPost!
        deleteForumPost(post_id: Int!): ID!

        addComment(content: String!, user_id: Int!, post_id: Int!): Comment!
        updateComment(comment_id: Int!, content: String!): Comment!
        deleteComment(comment_id: Int!): ID!

        updateUserRole(user_id: Int!, role: String!): User!
    }
`;

module.exports = typeDefs;