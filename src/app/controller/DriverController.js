import DriverService from '../service/DriverService';

class DriverController {

  async getProfileDriver(req, res) { 
    try {
      let response = await DriverService.getProfileDriver(req.userId);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response)
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  }

  async updateDriver(req, res) {
    try {
      let response = await DriverService.updateDriver(req.body, req.userId);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg })
      }

    } catch (error) {
      return res.status(400).json({ mgs: error.message })
    }
  } 
}

export default new DriverController();
