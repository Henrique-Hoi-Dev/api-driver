import HttpStatus from 'http-status';
import StatesAndCitiesService from '../service/StatesAndCitiesService';

class CitiesController {
  async allCities(req, res, next) {
    try {
      const data = await StatesAndCitiesService.allCities(req.query);
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new CitiesController();
