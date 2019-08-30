import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      localization: Sequelize.STRING,
      date: Sequelize.DATE,
      image: Sequelize.STRING,
    },
    {
      sequelize,
    });

    return this;
  }

  static associate(models){
    this.belongsTo(models.User, {foreignKey: 'user_id'});
  }
}

export default Meetup;
