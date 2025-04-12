const auth = (sequelize, DataTypes) => {
  const Auth = sequelize.define(
    'Auth',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'auths',
      timestamps: false,
    }
  );
  Auth.associate = (models) => {
    Auth.belongsTo(models.Profile, {
      foreignKey: 'profileId',
      as: 'profile',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Auth;
};

module.exports = auth;
