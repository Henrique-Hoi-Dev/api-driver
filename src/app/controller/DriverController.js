import DriverService from '../service/DriverService';

class DriverController {
  async profile(req, res) {
    try {
      let response = await DriverService.profile(req.driverId);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async update(req, res) {
    try {
      let response = await DriverService.update(req);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg });
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async forgotPassword(req, res) {
    try {
      let response = await DriverService.update(req, req.body.code);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg });
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }
}

export default new DriverController();
