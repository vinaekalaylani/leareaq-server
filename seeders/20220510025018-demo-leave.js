
'use strict';
const fs = require(`fs`)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     let data = JSON.parse(fs.readFileSync('./data/leaves.json', 'utf8'))
     data.forEach(each => {
       delete each.id
      //  each.dateFrom = new Date()
      //  each.dateTo = new Date()
       each.createdAt = new Date()
       each.updatedAt = new Date()
     })
     
    await queryInterface.bulkInsert('Leaves', data);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Leaves', null, {});
  }
};