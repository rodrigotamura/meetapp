import Sequelize, { Model } from 'sequelize';
import { isAfter } from 'date-fns';

class Meetup extends Model {
  static init(sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      localization: Sequelize.STRING,
      date: Sequelize.DATE,
      editable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isAfter(this.date, new Date());
        },
      },
    },
    {
      sequelize,
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'organizer' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
    this.hasMany(models.Subscription, { as: 'subscriptions' });
  }
}

export default Meetup;
