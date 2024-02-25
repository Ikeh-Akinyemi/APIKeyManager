import { Sequelize, Model, DataTypes } from "sequelize";
import { configs } from "../../utils/configs";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: configs.DBURL,
  logQueryParameters: false,
});

/////////////////////////
/// Mode definitions
////////////////////////

class User extends Model { }
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: "users"
});

class APIKey extends Model {}
APIKey.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  websiteUrl: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  permissions: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const permissions = this.getDataValue("permissions");
      return permissions ? JSON.parse(permissions) : [];
    },
    set(val: string) {
      let permissions = this.getDataValue("permissions");
      let parsedVal = permissions ? JSON.parse(permissions) : [];
      parsedVal.push(val);
      this.setDataValue("permissions", JSON.stringify(parsedVal));
    },
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: "apiKeys"
});

/////////////////////////
/// Models relationships
////////////////////////
User.hasMany(APIKey, { foreignKey: "userId" });
APIKey.belongsTo(User, { foreignKey: "userId" });

export {
  User,
  APIKey,
};