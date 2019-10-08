import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      localization: Sequelize.STRING,
      date: Sequelize.DATE,
    },
    {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
  }
}

export default Meetup;
