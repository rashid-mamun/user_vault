const profile = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // unique: true,
      },
      profilePhoto: {
        type: DataTypes.STRING,
      },
      isMarried: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'profiles',
      timestamps: false,
    }
  );
  Profile.associate = (models) => {
    Profile.hasOne(models.Auth,{
      foreignKey: 'profileId',
      as: 'auth'
    });
  };

  return Profile;
};

module.exports = profile;
