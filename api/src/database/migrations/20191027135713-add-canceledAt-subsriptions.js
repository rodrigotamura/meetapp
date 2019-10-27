
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('subscriptions', 'canceled_at', Sequelize.DATE),

  down: (queryInterface) => queryInterface.removeColumn('subscriptions', 'canceled_at'),
};
