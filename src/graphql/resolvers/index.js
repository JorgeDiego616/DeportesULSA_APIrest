const bcrypt = require('bcryptjs');
const db = require('../../database/db');
const { generateToken } = require('../../utils/auth');
const { checkAuth, checkAdmin } = require('../../utils/protected');

const resolvers = {
    Query: {
        users: async (_, __, context) => { checkAuth(context); return await db('Users').select('*'); },
        user: async (_, { user_id }, context) => { checkAuth(context); return await db('Users').where({ user_id }).first(); },

        sports: async (_, __, context) => { checkAuth(context); return await db('Sport').select('*'); },
        sport: async (_, { sport_id }, context) => { checkAuth(context); return await db('Sport').where({ sport_id }).first(); },

        players: async (_, __, context) => { checkAuth(context); return await db('Player').select('*'); },
        player: async (_, { player_id }, context) => { checkAuth(context); return await db('Player').where({ player_id }).first(); },

        teams: async (_, __, context) => { checkAuth(context); return await db('Team').select('*'); },
        team: async (_, { team_id }, context) => { checkAuth(context); return await db('Team').where({ team_id }).first(); },
        teamsBySport: async (_, { sport_id }, context) => { checkAuth(context); return await db('Team').where({ sport_id }); },

        teamPlayers: async (_, __, context) => { checkAuth(context); return await db('TeamPlayer').select('*'); },
        teamPlayersByTeam: async (_, { team_id }, context) => { checkAuth(context); return await db('TeamPlayer').where({ team_id }); },

        favoriteTeams: async (_, __, context) => { checkAuth(context); return await db('FavoriteTeam').select('*'); },
        favoriteTeamsByUser: async (_, { user_id }, context) => { checkAuth(context); return await db('FavoriteTeam').where({ user_id }); },

        matches: async (_, __, context) => { checkAuth(context); return await db('MatchGame').select('*'); },
        match: async (_, { match_id }, context) => { checkAuth(context); return await db('MatchGame').where({ match_id }).first(); },
        matchesByStatus: async (_, { status }, context) => { checkAuth(context); return await db('MatchGame').where({ status }); },

        allNews: async (_, __, context) => { checkAuth(context); return await db('News').select('*'); },
        newsById: async (_, { news_id }, context) => { checkAuth(context); return await db('News').where({ news_id }).first(); },
        newsByTeam: async (_, { team_id }, context) => { checkAuth(context); return await db('News').where({ team_id }); },

        forumPosts: async (_, __, context) => { checkAuth(context); return await db('ForumPost').select('*'); },
        forumPost: async (_, { post_id }, context) => { checkAuth(context); return await db('ForumPost').where({ post_id }).first(); },
        forumPostsByTeam: async (_, { team_id }, context) => { checkAuth(context); return await db('ForumPost').where({ team_id }); },

        comments: async (_, { post_id }, context) => { checkAuth(context); return await db('Comments').where({ post_id }); },
    },

    Mutation: {
        register: async (_, { name, email, password, role }) => {
            const existingUser = await db('Users').where({ email }).first();
            if (existingUser) throw new Error('El email ya está registrado');

            const hashedPassword = await bcrypt.hash(password, 10);
            const [user_id] = await db('Users').insert({
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
            });

            const user = await db('Users').where({ user_id }).first();
            const token = generateToken(user);
            return { token, user };
        },

        login: async (_, { email, password }) => {
            const user = await db('Users').where({ email }).first();
            if (!user) throw new Error('Email o contraseña incorrectos');

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) throw new Error('Email o contraseña incorrectos');

            const token = generateToken(user);
            return { token, user };
        },

        addSport: async (_, { name, category }, context) => {
            checkAdmin(context);
            const [sport_id] = await db('Sport').insert({ name, category });
            return await db('Sport').where({ sport_id }).first();
        },
        updateSport: async (_, { sport_id, ...rest }, context) => {
            checkAdmin(context);
            await db('Sport').where({ sport_id }).update(rest);
            return await db('Sport').where({ sport_id }).first();
        },
        deleteSport: async (_, { sport_id }, context) => {
            checkAdmin(context);
            await db('Sport').where({ sport_id }).del();
            return sport_id;
        },

        addPlayer: async (_, {
            name,
            number,
            position,
            age,
            team_id
        }, context) => {

            checkAdmin(context);

            const [player_id] = await db('Player').insert({
                name,
                number,
                position,
                age
            });

            if (team_id) {

                await db('TeamPlayer').insert({

                    player_id,
                    team_id,
                    join_date: new Date()

                });

            }

    return await db('Player')
        .where({ player_id })
        .first();

        },
        updatePlayer: async (_, { player_id, ...rest }, context) => {
            checkAdmin(context);
            await db('Player').where({ player_id }).update(rest);
            return await db('Player').where({ player_id }).first();
        },
        deletePlayer: async (_, { player_id }, context) => {
            checkAdmin(context);
            await db('Player').where({ player_id }).del();
            return player_id;
        },

        addTeam: async (_, { name, logo, coach, description, sport_id }, context) => {
            checkAdmin(context);
            const [team_id] = await db('Team').insert({ name, logo, coach, description, sport_id });
            return await db('Team').where({ team_id }).first();
        },
        updateTeam: async (_, { team_id, ...rest }, context) => {
            checkAdmin(context);
            await db('Team').where({ team_id }).update(rest);
            return await db('Team').where({ team_id }).first();
        },
        deleteTeam: async (_, { team_id }, context) => {
            checkAdmin(context);
            await db('Team').where({ team_id }).del();
            return team_id;
        },

        addTeamPlayer: async (_, { player_id, team_id, join_date, leave_date }, context) => {
            checkAdmin(context);
            const [team_player_id] = await db('TeamPlayer').insert({ player_id, team_id, join_date, leave_date });
            return await db('TeamPlayer').where({ team_player_id }).first();
        },
        deleteTeamPlayer: async (_, { team_player_id }, context) => {
            checkAdmin(context);
            await db('TeamPlayer').where({ team_player_id }).del();
            return team_player_id;
        },

        addFavoriteTeam: async (_, { user_id, team_id }, context) => {
            checkAuth(context);
            const [favorite_id] = await db('FavoriteTeam').insert({ user_id, team_id });
            return await db('FavoriteTeam').where({ favorite_id }).first();
        },
        deleteFavoriteTeam: async (_, { favorite_id }, context) => {
            checkAuth(context);
            await db('FavoriteTeam').where({ favorite_id }).del();
            return favorite_id;
        },

        addMatch: async (_, { home_team_id, away_team_id, match_date, location, home_score, away_score, status }, context) => {
            checkAdmin(context);
            const [match_id] = await db('MatchGame').insert({ home_team_id, away_team_id, match_date, location, home_score, away_score, status });
            return await db('MatchGame').where({ match_id }).first();
        },
        updateMatch: async (_, { match_id, ...rest }, context) => {
            checkAdmin(context);
            await db('MatchGame').where({ match_id }).update(rest);
            return await db('MatchGame').where({ match_id }).first();
        },
        deleteMatch: async (_, { match_id }, context) => {
            checkAdmin(context);
            await db('MatchGame').where({ match_id }).del();
            return match_id;
        },

        addNews: async (_, { title, content, image, team_id, user_id }, context) => {
            checkAuth(context);
            const [news_id] = await db('News').insert({ title, content, image, team_id, user_id });
            return await db('News').where({ news_id }).first();
        },
        updateNews: async (_, { news_id, ...rest }, context) => {
            checkAuth(context);
            await db('News').where({ news_id }).update(rest);
            return await db('News').where({ news_id }).first();
        },
        deleteNews: async (_, { news_id }, context) => {
            checkAuth(context);
            await db('News').where({ news_id }).del();
            return news_id;
        },

        addForumPost: async (_, { title, content, user_id, team_id }, context) => {
            checkAuth(context);
            const [post_id] = await db('ForumPost').insert({ title, content, user_id, team_id });
            return await db('ForumPost').where({ post_id }).first();
        },
        updateForumPost: async (_, { post_id, ...rest }, context) => {
            checkAuth(context);
            await db('ForumPost').where({ post_id }).update(rest);
            return await db('ForumPost').where({ post_id }).first();
        },
        deleteForumPost: async (_, { post_id }, context) => {
            checkAuth(context);
            await db('ForumPost').where({ post_id }).del();
            return post_id;
        },

        addComment: async (_, { content, user_id, post_id }, context) => {
            checkAuth(context);
            const [comment_id] = await db('Comments').insert({ content, user_id, post_id });
            return await db('Comments').where({ comment_id }).first();
        },
        updateComment: async (_, { comment_id, content }, context) => {
            checkAuth(context);
            await db('Comments').where({ comment_id }).update({ content });
            return await db('Comments').where({ comment_id }).first();
        },
        deleteComment: async (_, { comment_id }, context) => {
            checkAuth(context);
            await db('Comments').where({ comment_id }).del();
            return comment_id;
        },
        updateUserRole: async (_, { user_id, role }, context) => {
            checkAdmin(context);
            await db('Users').where({ user_id }).update({ role });
            return await db('Users').where({ user_id }).first();
        },      
    },
};

module.exports = resolvers;