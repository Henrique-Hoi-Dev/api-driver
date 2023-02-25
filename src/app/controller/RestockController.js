import RestockService from '../service/RestockService';

class RestockController {
  async createRestock(req, res) {
    try {
      let response = await RestockService.createRestock(req, req.body);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAllRestock(req, res) {
    try {
      let response = await RestockService.getAllRestock(req, res);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async getIdRestock(req, res) {
    try {
      let response = await RestockService.getIdRestock(req.params);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }
}

export default new RestockController();
