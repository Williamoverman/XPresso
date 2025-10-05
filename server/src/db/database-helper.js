import {Sequelize, DataTypes} from "sequelize";

// Check https://sequelize.org/ for the Getting Started
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: `db/database.${process.env.NODE_ENV}.sqlite`
});

// TODO create your tables here, see https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const UserRole = sequelize.define('UserRole', {
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' },
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: { model: Role, key: 'id' },
        allowNull: false
    }
});

const Game = sequelize.define('Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    abbreviation: {
        type: DataTypes.STRING
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

const ProPlayer = sequelize.define('ProPlayer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: User, key: 'id' }
    },
    bio: {
        type: DataTypes.TEXT
    },
    hourly_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 10
    }
});

const ProPlayerGame = sequelize.define('ProPlayerGame', {
    pro_player_id: {
        type: DataTypes.INTEGER,
        references: { model: ProPlayer, key: 'id' },
        primaryKey: true
    },
    game_id: {
        type: DataTypes.INTEGER,
        references: { model: Game, key: 'id' },
        primaryKey: true
    },
    current_rank: {
        type: DataTypes.STRING
    },
    years_experience: {
        type: DataTypes.INTEGER
    }
});

const Ad = sequelize.define('Ad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    game_id: {
        type: DataTypes.INTEGER,
        references: { model: Game, key: 'id' },
    },
    pro_player_id: {
        type: DataTypes.INTEGER,
        references: { model: ProPlayer, key: 'id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    max_reservations_per_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    service_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_spots_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    max_duration_minutes: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1
        },
    }
});

const Reservation = sequelize.define('Reservation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' }
    },
    ad_id: {
        type: DataTypes.INTEGER,
        references: { model: Ad, key: 'id' }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending"
    },
    customer_notes: {
        type: DataTypes.TEXT
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
});

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reservation_id: {
        type: DataTypes.INTEGER,
        references: { model: Reservation, key: 'id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' }
    },
    pro_player_id: {
        type: DataTypes.INTEGER,
        references: { model: ProPlayer, key: 'id' }
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            max: 5,
            min: 1
        },
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT
    }
});

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id", otherKey: "role_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id", otherKey: "user_id" });

ProPlayer.belongsTo(User, { foreignKey: "id" });
User.hasOne(ProPlayer, { foreignKey: "id" });

ProPlayer.belongsToMany(Game, { through: ProPlayerGame, foreignKey: "pro_player_id", otherKey: "game_id" });
Game.belongsToMany(ProPlayer, { through: ProPlayerGame, foreignKey: "game_id", otherKey: "pro_player_id" });

Ad.belongsTo(Game, { foreignKey: "game_id" });
Game.hasMany(Ad, { foreignKey: "game_id" });

Ad.belongsTo(ProPlayer, { foreignKey: "pro_player_id" });
ProPlayer.hasMany(Ad, { foreignKey: "pro_player_id" });

Reservation.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Reservation, { foreignKey: "user_id" });

Reservation.belongsTo(Ad, { foreignKey: "ad_id" });
Ad.hasMany(Reservation, { foreignKey: "ad_id" });

Review.belongsTo(Reservation, { foreignKey: "reservation_id" });
Reservation.hasOne(Review, { foreignKey: "reservation_id" });

Review.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Review, { foreignKey: "user_id" });

Review.belongsTo(ProPlayer, { foreignKey: "pro_player_id" });
ProPlayer.hasMany(Review, { foreignKey: "pro_player_id" });

ProPlayerGame.belongsTo(ProPlayer, { foreignKey: 'pro_player_id' });
ProPlayerGame.belongsTo(Game, { foreignKey: 'game_id' });

await sequelize.sync();

export {
    sequelize,
    User,
    Role,
    UserRole,
    Game,
    ProPlayer,
    ProPlayerGame,
    Ad,
    Reservation,
    Review
}