import HttpStatus from 'http-status';
import StatesAndCitiesService from '../service/StatesAndCitiesService';

class StatesController {
  async allStates(req, res, next) {
    try {
      const data = await StatesAndCitiesService.allStates(req.query);
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async popularCityStateData(req, res, next) {
    try {
      const data = await StatesAndCitiesService.popularCityStateData(req);
      return res
        .status(HttpStatus.CREATED)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new StatesController();
