import { DataTypes } from "sequelize";

class User {
  static init(sequelize) {
    return sequelize.define("Users", {
      userID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "email",
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['admin', 'client'],
        defaultValue: 'client'
      },      
      session: {
        type: DataTypes.STRING,
      },      
      expiry: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['active', 'inactive'],
        defaultValue: 'active'
      },
      recaptchaVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      
    });
  }
}

export default User;