import States from '../models/States';
import Cities from '../models/Cities';
import { literal, Op } from 'sequelize';
const XLSX = require('xlsx');
// const fs = require('fs');
// const path = require('path');

export default {
  async allCities({ search = '', uf = '' }) {
    const cities = await Cities.findAll({
      where: {
        [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
      },
      attributes: ['id', 'name'],
      include: [
        {
          model: States,
          as: 'states',
          attributes: ['uf'],
          where: uf ? { uf: { [Op.iLike]: `%${uf}%` } } : {},
        },
      ],
      order: [
        [
          literal(`CASE 
            WHEN "Cities"."name" ILIKE '${search}%' THEN 1 
            ELSE 2 
        END`),
          'ASC',
        ],
        ['name', 'ASC'],
      ],
    });

    return cities;
  },

  async allStates({ search = '' }) {
    const states = await States.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { uf: { [Op.iLike]: `%${search}%` } },
        ],
      },
      attributes: ['id', 'name', 'uf'],
    });
    return states;
  },

  async popularCityStateData(props) {
    const { file } = props;

    if (file === undefined) throw new Error('FILE_NOT_FOUND_ERROR');

    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      cellDates: true,
      cellText: true,
    });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

    // const cities = jsonData.map((row) => {
    //   return `{ name: "${row.name}", states_id: statesMap['${row.stateUf}'] }`;
    // });

    // // Formatando o resultado final como um array JS
    // const output = `const cities = [\n  ${cities.join(
    //   ',\n  '
    // )}\n];\n\nmodule.exports = cities;`;

    // // Salvando o arquivo gerado
    // fs.writeFileSync(path.join(__dirname, 'citiesArray.js'), output);

    return jsonData;
  },
};
