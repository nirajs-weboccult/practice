const baseController = require('./base.controller');
const bcrypt = require('bcrypt');

class AuthController extends baseController {
  constructor() {
    super()
    this.validation = require('../validations/user.validations');
    this.userService = require('../services/user.service')
    this.validation = require('../validations/user.validations')
    this.es6BindAll(this, []);
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { error } = this.validation.loginValidation.validate(req.body);
      if (error) {
        console.log(error);
        return res.status(400).send({
          status: false,
          message: error.details?.[0]?.message || error.message,
          type: 'ValidationError',
        });
      }
      const user = await this.userService.getUserWithEmail(email)
      const userData = user.data
      
      this.helperResponse.setSession(req, "user", userData);
      const accessModule = await this.userService.getAccessModule(userData._id)
      this.helperResponse.setSession(req, "access_module", accessModule);
      if (user.status === false) {
        return res.status(401).json({ status: false, message: this.messages.INVALID_CREDENTIALS});
      }
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.status(401).json({ status: false, message:this.messages.INVALID_PASSWORD });
      }

      if (userData.is_active === 0) {
        return res.status(403).json({ status: false, message: this.messages.USER_NOT_ACTIVE });
      }

      const token = this.jwt.sign({ userId: userData._id }, this.config.commonConfig.SECRET_KEY, {
        expiresIn: '24h'
      });

      return res.status(200).json({
        status: true,
        message: "Login successful",
        token,
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role_id?.name,
          access_modules: userData.role_id?.access_module || []
        }
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ status: false, message: this.messages.INTERNAL_SERVER_ERROR });
    }
  }

  async signUp(req, res) {
    try {
      const { first_name, last_name, email, password, role_id, is_active , gender } = req.body;

      const newUser = await this.userService.insertUser({ email, password, role_id, gender, is_active, first_name, last_name });
      if(newUser.status==false){
        return res.status(400).json({ status: false, message: newUser.message });
      }
      const userData = newUser.user
      this.helperResponse.setSession(req, "user", userData);
      const accessModule = await this.userService.getAccessModule(userData._id)
      this.helperResponse.setSession(req, "access_module", accessModule);
      const token = this.jwt.sign({ userId: userData._id }, this.config.commonConfig.SECRET_KEY, {
        expiresIn: '24h'
      });

      return res.status(201).json({
        status: true,
        message: 'Signup successful',
        token,
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email
        }
      });
    } catch (error) {
      console.error("Sign Up error:", error);
      return res.status(500).json({
        status: false,
        message: this.messages.INTERNAL_SERVER_ERROR || 'Internal Server Error'
      });
    }
  }
}
module.exports = new AuthController();
