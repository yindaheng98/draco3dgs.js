/**
 * @fileoverview Main file for draco3d package.
 */

var createEncoderModule = require('./draco_encoder');
var createDecoderModule = require('./draco_decoder');

module.exports = {
  createEncoderModule,
  createDecoderModule
}
